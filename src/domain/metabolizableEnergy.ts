import { parseDecimalInput } from './fieldValidation';
import type { FieldValidation, NumericRange } from './fieldValidation';

/**
 * Metabolizable energy from the label: range validation and the atypical-value
 * flag.
 *
 * Labels state ME in kcal/kg, and the MVP accepts **only** that unit. A label
 * in kcal/100 g converts by multiplying by 10 — see
 * docs/dominio-nutricional.md > Armadilhas conhecidas.
 */

/** Accepted range, from docs/dominio-nutricional.md > Validação de entrada. */
export const METABOLIZABLE_ENERGY_RANGE: NumericRange = { minimum: 200, maximum: 8000 };

/**
 * Typical dry food range. Outside it the calculation proceeds and the UI warns,
 * which covers wet food without blocking the user. Both ends count as typical.
 */
const TYPICAL_DRY_FOOD_RANGE: NumericRange = { minimum: 2500, maximum: 5000 };

/**
 * Validates the typed ME against the accepted range.
 *
 * Returns the violation as data, never as a sentence — see ADR 0004.
 *
 * @example
 * validateMetabolizableEnergy('3500'); // { valid: true, value: 3500 }
 */
export function validateMetabolizableEnergy(rawEnergy: unknown): FieldValidation<number> {
  const parsedEnergy = parseDecimalInput(rawEnergy);

  if (parsedEnergy === null) {
    return {
      valid: false,
      violation: { reason: 'notANumber', received: rawEnergy, ...METABOLIZABLE_ENERGY_RANGE },
    };
  }

  if (
    parsedEnergy < METABOLIZABLE_ENERGY_RANGE.minimum ||
    parsedEnergy > METABOLIZABLE_ENERGY_RANGE.maximum
  ) {
    return {
      valid: false,
      violation: { reason: 'outOfRange', received: rawEnergy, ...METABOLIZABLE_ENERGY_RANGE },
    };
  }

  return { valid: true, value: parsedEnergy };
}

/**
 * Tells whether the ME falls outside the typical dry food range.
 *
 * Blocks nothing: it lets the UI ask for a second look at the label, since an
 * atypical value is usually a unit mistake — kcal/100 g typed as kcal/kg.
 *
 * @example
 * isAtypicalForDryFood(1200); // true
 */
export function isAtypicalForDryFood(energyKcalPerKilogram: number): boolean {
  return (
    energyKcalPerKilogram < TYPICAL_DRY_FOOD_RANGE.minimum ||
    energyKcalPerKilogram > TYPICAL_DRY_FOOD_RANGE.maximum
  );
}
