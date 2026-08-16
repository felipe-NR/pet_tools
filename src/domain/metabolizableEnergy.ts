import { describeRawValue, parseDecimalInput } from './fieldValidation';
import type { FieldValidation } from './fieldValidation';

/**
 * Energia metabolizável do rótulo: validação da faixa aceita e do aviso de
 * valor atípico.
 *
 * O rótulo informa EM em kcal/kg, e o MVP aceita **só** essa unidade. Rótulo em
 * kcal/100 g converte multiplicando por 10 — ver
 * docs/dominio-nutricional.md > Armadilhas conhecidas.
 */

/** Faixa aceita, de docs/dominio-nutricional.md > Validação de entrada. */
const MINIMUM_KCAL_PER_KILOGRAM = 200;
const MAXIMUM_KCAL_PER_KILOGRAM = 8000;

/**
 * Faixa típica de ração seca. Fora dela o cálculo prossegue e a UI avisa, o
 * que cobre ração úmida sem bloquear o usuário. Extremos contam como típicos.
 */
const TYPICAL_DRY_FOOD_MINIMUM = 2500;
const TYPICAL_DRY_FOOD_MAXIMUM = 5000;

/**
 * Valida a EM digitada contra a faixa aceita.
 *
 * @example
 * validateMetabolizableEnergy('3500'); // { valid: true, value: 3500 }
 */
export function validateMetabolizableEnergy(rawEnergy: unknown): FieldValidation<number> {
  const parsedEnergy = parseDecimalInput(rawEnergy);
  const expectation =
    `esperado número entre ${String(MINIMUM_KCAL_PER_KILOGRAM)} e ` +
    `${String(MAXIMUM_KCAL_PER_KILOGRAM)} kcal/kg`;

  if (parsedEnergy === null) {
    return {
      valid: false,
      message:
        `Energia metabolizável inválida: recebido ${describeRawValue(rawEnergy)}, ` +
        `${expectation}, com ponto decimal e não vírgula`,
    };
  }

  if (parsedEnergy < MINIMUM_KCAL_PER_KILOGRAM || parsedEnergy > MAXIMUM_KCAL_PER_KILOGRAM) {
    return {
      valid: false,
      message: `Energia metabolizável inválida: recebido ${describeRawValue(rawEnergy)}, ${expectation}`,
    };
  }

  return { valid: true, value: parsedEnergy };
}

/**
 * Diz se a EM está fora da faixa típica de ração seca.
 *
 * Não bloqueia nada: serve para a UI pedir conferência do rótulo, já que valor
 * atípico costuma ser erro de unidade — kcal/100 g digitado como kcal/kg.
 *
 * @example
 * isAtypicalForDryFood(1200); // true
 */
export function isAtypicalForDryFood(energyKcalPerKilogram: number): boolean {
  return (
    energyKcalPerKilogram < TYPICAL_DRY_FOOD_MINIMUM ||
    energyKcalPerKilogram > TYPICAL_DRY_FOOD_MAXIMUM
  );
}
