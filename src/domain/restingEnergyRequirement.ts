/**
 * Step 1 of docs/dominio-nutricional.md: RER, the calories spent at absolute
 * rest, thermoneutrality and fasting.
 *
 * Where the numbers come from: docs/dominio-nutricional.md > Passo 1. The
 * choice of equation family is ADR 0002 and does not change without a new ADR.
 */

/**
 * RER = 70 × weight^0.75. Holds for dogs and cats, any weight, any size.
 *
 * The linear variant found in the literature, `RER = 30 × kg + 70`, is not
 * used: it only holds from 2 to 45 kg and diverges ~6% from the exponential at
 * 10 kg (370 against 393.64), so mixing the two would produce inconsistent
 * results. See ADR 0002.
 */
const RESTING_ENERGY_COEFFICIENT = 70;
const RESTING_ENERGY_EXPONENT = 0.75;

/**
 * Calculates the RER in kcal from the weight in kilograms.
 *
 * The result carries full floating point precision. Rounding here would break
 * test determinism — see `roundToWholeNumber` in `dailyPortion.ts`, the single
 * rounding point.
 *
 * @example
 * calculateRestingEnergyRequirement(10); // 393.638927...
 */
export function calculateRestingEnergyRequirement(weightInKilograms: number): number {
  if (!Number.isFinite(weightInKilograms) || weightInKilograms <= 0) {
    throw new RangeError(
      `Invalid weight for the RER calculation: received ${String(weightInKilograms)}, ` +
        'expected a positive number in kg',
    );
  }

  return RESTING_ENERGY_COEFFICIENT * weightInKilograms ** RESTING_ENERGY_EXPONENT;
}
