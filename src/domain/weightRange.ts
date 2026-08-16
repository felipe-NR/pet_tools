import { parseDecimalInput } from './fieldValidation';
import type { FieldValidation, NumericRange } from './fieldValidation';
import { requireSpecies } from './petProfile';
import type { Species } from './petProfile';

/**
 * Weight range accepted per species, and validation of the weight field.
 *
 * The range is per species on purpose: 20 kg is a plausible dog and an
 * implausible cat, and acceptance criterion 7 of docs/prd.md requires that
 * switching species re-evaluates the weight already typed.
 *
 * Since ADR 0003 the weight asked for is the animal's **ideal** weight, not
 * its current one. That changes what the field means, not what it accepts.
 */

/** Ranges from docs/dominio-nutricional.md > Validação de entrada. */
const WEIGHT_RANGES: Readonly<Record<Species, NumericRange>> = {
  dog: { minimum: 0.5, maximum: 100 },
  cat: { minimum: 0.5, maximum: 15 },
};

/**
 * Weight range accepted for the species, in kilograms.
 *
 * @example
 * weightRangeFor('cat'); // { minimum: 0.5, maximum: 15 }
 */
export function weightRangeFor(species: Species): NumericRange {
  return WEIGHT_RANGES[requireSpecies(species)];
}

/**
 * Validates the typed weight against the range of the species.
 *
 * `rawWeight` is `unknown` because it is the field under validation and
 * arrives from the form as a string. `species` is a precondition, already
 * narrowed, and breaks the contract if it comes in wrong — which is why one
 * returns a result and the other throws.
 *
 * Returns the violation as data, never as a sentence: the Portuguese message
 * is built in `src/copy/`. See ADR 0004.
 *
 * @example
 * validateWeightInKilograms('20', 'cat');
 * // { valid: false, violation: { reason: 'outOfRange', received: '20', ... } }
 */
export function validateWeightInKilograms(
  rawWeight: unknown,
  species: Species,
): FieldValidation<number> {
  const range = weightRangeFor(species);
  const parsedWeight = parseDecimalInput(rawWeight);

  if (parsedWeight === null) {
    return { valid: false, violation: { reason: 'notANumber', received: rawWeight, ...range } };
  }

  if (parsedWeight < range.minimum || parsedWeight > range.maximum) {
    return { valid: false, violation: { reason: 'outOfRange', received: rawWeight, ...range } };
  }

  return { valid: true, value: parsedWeight };
}
