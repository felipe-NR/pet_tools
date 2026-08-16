import { describeRawValue } from '../domain/fieldValidation';
import type { FieldViolation } from '../domain/fieldValidation';
import type { Species } from '../domain/petProfile';

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
 * Message for a rejected weight field.
 *
 * Carries the offending value and the expected range, per acceptance criterion
 * 4 of docs/prd.md. When the value is not numeric at all it also names the
 * format: without that, someone typing "12,5" reads that a number between 0.5
 * and 100 was expected — a range 12,5 sits inside — and never learns the
 * separator is a dot.
 *
 * @example
 * weightViolationMessage(violation, 'cat');
 * // 'Peso inválido: recebido 20, esperado número entre 0.5 e 15 kg para gato'
 */
export function weightViolationMessage(violation: FieldViolation, species: Species): string {
  const expectation =
    `esperado número entre ${String(violation.minimum)} e ${String(violation.maximum)} kg ` +
    `para ${speciesLabel(species)}`;
  const opening = `Peso inválido: recebido ${describeRawValue(violation.received)}`;

  if (violation.reason === 'notANumber') {
    return `${opening}, ${expectation}, com ponto decimal e não vírgula`;
  }

  return `${opening}, ${expectation}`;
}

/**
 * Message for a rejected metabolizable energy field.
 *
 * @example
 * metabolizableEnergyViolationMessage(violation);
 * // 'Energia metabolizável inválida: recebido 100, esperado número entre 200 e 8000 kcal/kg'
 */
export function metabolizableEnergyViolationMessage(violation: FieldViolation): string {
  const expectation =
    `esperado número entre ${String(violation.minimum)} e ` +
    `${String(violation.maximum)} kcal/kg`;
  const opening = `Energia metabolizável inválida: recebido ${describeRawValue(violation.received)}`;

  if (violation.reason === 'notANumber') {
    return `${opening}, ${expectation}, com ponto decimal e não vírgula`;
  }

  return `${opening}, ${expectation}`;
}
