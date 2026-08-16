import type { FieldValidation } from './fieldValidation';
import { requireProfile, requireSpecies } from './petProfile';
import type { PetProfile, Species } from './petProfile';
import { calculateRestingEnergyRequirement } from './restingEnergyRequirement';
import { calculateMaintenanceEnergyRequirement } from './maintenanceEnergyRequirement';
import { isAtypicalForDryFood, validateMetabolizableEnergy } from './metabolizableEnergy';
import { validateWeightInKilograms } from './weightRange';

/**
 * Passo 3 de docs/dominio-nutricional.md e a orquestração dos três passos.
 *
 * Esta é a única porta de entrada do domínio para a UI, e por isso valida tudo
 * que recebe. Os campos entram como `unknown` porque o formulário entrega
 * string — narrowing acontece aqui, uma vez.
 */

/** Entrada crua, como sai do formulário. */
export interface DailyPortionInput {
  readonly species: unknown;
  readonly profile: unknown;
  readonly weightInKilograms: unknown;
  readonly metabolizableEnergyKcalPerKilogram: unknown;
}

/**
 * Resultado com os passos intermediários expostos: o critério de escopo do
 * MVP em docs/prd.md pede que os passos do cálculo apareçam na tela.
 *
 * Todos os números saem com precisão total de ponto flutuante. O
 * arredondamento é responsabilidade de quem exibe — ver `roundToWholeNumber`.
 */
export interface DailyPortionResult {
  readonly restingEnergyRequirementKcal: number;
  readonly maintenanceEnergyRequirementKcal: number;
  readonly gramsPerDay: number;
  readonly metabolizableEnergyIsAtypical: boolean;
}

interface ValidatedDailyPortionInput {
  readonly species: Species;
  readonly profile: PetProfile;
  readonly weightInKilograms: number;
  readonly metabolizableEnergyKcalPerKilogram: number;
}

/** O rótulo traz EM em kcal/kg; o cálculo precisa de kcal/g. */
const GRAMS_PER_KILOGRAM = 1000;

/**
 * Calcula a porção diária em gramas a partir da entrada crua do formulário.
 *
 * Lança `RangeError` quando qualquer campo é inválido, com a mesma mensagem
 * que a validação de campo mostraria. A UI valida durante a digitação; este
 * guarda é a rede de segurança de quem usar o domínio direto.
 *
 * @example
 * calculateDailyPortion({
 *   species: 'dog',
 *   profile: 'neutered',
 *   weightInKilograms: 10,
 *   metabolizableEnergyKcalPerKilogram: 3500,
 * }).gramsPerDay; // 179.949224...
 */
export function calculateDailyPortion(input: DailyPortionInput): DailyPortionResult {
  const validated = validateDailyPortionInput(input);

  const restingEnergyRequirementKcal = calculateRestingEnergyRequirement(
    validated.weightInKilograms,
  );
  const maintenanceEnergyRequirementKcal = calculateMaintenanceEnergyRequirement(
    restingEnergyRequirementKcal,
    validated.species,
    validated.profile,
  );
  const energyKcalPerGram = validated.metabolizableEnergyKcalPerKilogram / GRAMS_PER_KILOGRAM;

  return {
    restingEnergyRequirementKcal,
    maintenanceEnergyRequirementKcal,
    gramsPerDay: maintenanceEnergyRequirementKcal / energyKcalPerGram,
    metabolizableEnergyIsAtypical: isAtypicalForDryFood(
      validated.metabolizableEnergyKcalPerKilogram,
    ),
  };
}

/**
 * Arredonda para inteiro. Único ponto de arredondamento do domínio.
 *
 * docs/dominio-nutricional.md > Precisão e arredondamento: arredonde uma vez,
 * no fim. O motivo é determinismo de teste, não magnitude do erro — com
 * arredondamento intermediário o valor esperado passa a depender de onde o
 * arredondamento aconteceu, e duas implementações corretas discordam na
 * última unidade.
 *
 * @example
 * roundToWholeNumber(179.949224); // 180
 */
export function roundToWholeNumber(value: number): number {
  return Math.round(value);
}

function validateDailyPortionInput(input: DailyPortionInput): ValidatedDailyPortionInput {
  const species = requireSpecies(input.species);

  return {
    species,
    profile: requireProfile(input.profile),
    weightInKilograms: unwrapOrThrow(validateWeightInKilograms(input.weightInKilograms, species)),
    metabolizableEnergyKcalPerKilogram: unwrapOrThrow(
      validateMetabolizableEnergy(input.metabolizableEnergyKcalPerKilogram),
    ),
  };
}

function unwrapOrThrow<T>(validation: FieldValidation<T>): T {
  if (!validation.valid) {
    throw new RangeError(validation.message);
  }

  return validation.value;
}
