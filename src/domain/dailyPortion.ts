import { describeRawValue } from './fieldValidation';
import type { FieldValidation } from './fieldValidation';
import { requireProfile, requireSpecies } from './petProfile';
import type { PetProfile, Species } from './petProfile';
import { calculateRestingEnergyRequirement } from './restingEnergyRequirement';
import { calculateMaintenanceEnergyRequirement } from './maintenanceEnergyRequirement';
import { isAtypicalForDryFood, validateMetabolizableEnergy } from './metabolizableEnergy';
import { validateWeightInKilograms } from './weightRange';

/**
 * Step 3 of docs/dominio-nutricional.md, plus the orchestration of the three
 * steps.
 *
 * This is the domain's only entry point for the UI, which is why it validates
 * everything it receives. The fields arrive as `unknown` because the form
 * hands over strings — narrowing happens here, once.
 */

/** Raw input, exactly as it leaves the form. */
export interface DailyPortionInput {
  readonly species: unknown;
  readonly profile: unknown;
  readonly weightInKilograms: unknown;
  readonly metabolizableEnergyKcalPerKilogram: unknown;
}

/**
 * Result with the intermediate steps exposed: the MVP scope in docs/prd.md
 * requires the calculation steps to appear on screen.
 *
 * Every number carries full floating point precision. Rounding belongs to
 * whoever displays it — see `roundToWholeNumber`.
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

/** The label states ME in kcal/kg; the calculation needs kcal/g. */
const GRAMS_PER_KILOGRAM = 1000;

/**
 * Calculates the daily portion in grams from the raw form input.
 *
 * Throws `RangeError` when any field is invalid. The message is English and
 * developer facing: the UI validates per field while typing and renders the
 * Portuguese text from `src/copy/`, so reaching this throw means a caller
 * skipped that path. See ADR 0004.
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
 * Rounds to a whole number. The domain's single rounding point.
 *
 * docs/dominio-nutricional.md > Precisão e arredondamento: round once, at the
 * end. The reason is test determinism, not error magnitude — with intermediate
 * rounding the expected value starts to depend on where the rounding happened,
 * and two correct implementations disagree on the last unit.
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
    weightInKilograms: unwrapOrThrow(
      'weight',
      validateWeightInKilograms(input.weightInKilograms, species),
    ),
    metabolizableEnergyKcalPerKilogram: unwrapOrThrow(
      'metabolizable energy',
      validateMetabolizableEnergy(input.metabolizableEnergyKcalPerKilogram),
    ),
  };
}

function unwrapOrThrow<T>(fieldName: string, validation: FieldValidation<T>): T {
  if (validation.valid) {
    return validation.value;
  }

  const { reason, received, minimum, maximum } = validation.violation;
  throw new RangeError(
    `Invalid ${fieldName} (${reason}): received ${describeRawValue(received)}, ` +
      `expected a decimal number between ${String(minimum)} and ${String(maximum)}`,
  );
}
