import { describeRawValue } from '../domain/fieldValidation';
import type { FieldViolation } from '../domain/fieldValidation';
import type { Species } from '../domain/petProfile';
import { formatPortugueseNumber } from './calculator';

/**
 * Portuguese text the user reads under a form field.
 *
 * This is the only place in `src/` that writes Portuguese. The domain reports
 * violations as data and this layer turns them into sentences, so the
 * calculation engine stays reusable by a CLI or an API — see ADR 0004.
 *
 * The dependency runs one way: copy imports from domain, never the reverse.
 * ESLint enforces it.
 */

const SPECIES_LABELS: Readonly<Record<Species, string>> = {
  dog: 'cão',
  cat: 'gato',
};

/**
 * Portuguese name of the species, for use inside sentences.
 *
 * @example
 * speciesLabel('dog'); // 'cão'
 */
export function speciesLabel(species: Species): string {
  return SPECIES_LABELS[species];
}

/**
 * Suffix for a value that did not parse at all.
 *
 * An unparsed value often sits inside the range anyway — "4,5 kg" is a weight
 * this calculator accepts, typed with its unit — so quoting only the range
 * would tell the user to do exactly what they just did. Since ADR 0006 the
 * field reads the pt-BR notation, so there is no separator left to correct and
 * the suffix shows the shape of an accepted value instead.
 *
 * @example
 * acceptedFormatSuffix('4,5'); // ', no formato 4,5'
 */
function acceptedFormatSuffix(example: string): string {
  return `, no formato ${example}`;
}

/**
 * Message for a rejected weight field.
 *
 * Carries the offending value and the expected range, per acceptance criterion
 * 4 of docs/prd.md, and an example of the accepted format when the value is
 * not numeric at all.
 *
 * @example
 * weightViolationMessage(violation, 'cat');
 * // 'Peso inválido: recebido 20, esperado número entre 0,5 e 15 kg para gato'
 */
export function weightViolationMessage(violation: FieldViolation, species: Species): string {
  const expectation =
    `esperado número entre ${formatPortugueseNumber(violation.minimum)} e ` +
    `${formatPortugueseNumber(violation.maximum)} kg para ${speciesLabel(species)}`;
  const opening = `Peso inválido: recebido ${describeRawValue(violation.received)}`;

  if (violation.reason === 'notANumber') {
    return `${opening}, ${expectation}${acceptedFormatSuffix('4,5')}`;
  }

  return `${opening}, ${expectation}`;
}

/**
 * Message for a rejected metabolizable energy field.
 *
 * @example
 * metabolizableEnergyViolationMessage(violation);
 * // 'Energia metabolizável inválida: recebido 100, esperado número entre 200 e 8.000 kcal/kg'
 */
export function metabolizableEnergyViolationMessage(violation: FieldViolation): string {
  const expectation =
    `esperado número entre ${formatPortugueseNumber(violation.minimum)} e ` +
    `${formatPortugueseNumber(violation.maximum)} kcal/kg`;
  const opening = `Energia metabolizável inválida: recebido ${describeRawValue(violation.received)}`;

  if (violation.reason === 'notANumber') {
    return `${opening}, ${expectation}${acceptedFormatSuffix('3500')}`;
  }

  return `${opening}, ${expectation}`;
}
