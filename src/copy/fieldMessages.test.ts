import { describe, expect, it } from 'vitest';
import {
  metabolizableEnergyViolationMessage,
  speciesLabel,
  weightViolationMessage,
} from './fieldMessages';
import { validateMetabolizableEnergy } from '../domain/metabolizableEnergy';
import { validateWeightInKilograms } from '../domain/weightRange';
import type { FieldViolation } from '../domain/fieldValidation';

/**
 * The messages are asserted against violations produced by the real
 * validators, not hand-built literals: that is what keeps the copy and the
 * ranges from drifting apart.
 */
describe('speciesLabel', () => {
  it('returns the Portuguese name used inside sentences', () => {
    expect(speciesLabel('dog')).toBe('cão');
    expect(speciesLabel('cat')).toBe('gato');
  });
});

describe('weightViolationMessage', () => {
  it('names the offending value and the range of the species', () => {
    expect(weightViolationMessage(weightViolationOf(20, 'cat'), 'cat')).toBe(
      'Peso inválido: recebido 20, esperado número entre 0.5 e 15 kg para gato',
    );
  });

  it('uses the dog range when the species is a dog', () => {
    expect(weightViolationMessage(weightViolationOf(200, 'dog'), 'dog')).toBe(
      'Peso inválido: recebido 200, esperado número entre 0.5 e 100 kg para cão',
    );
  });

  it('names the expected format when the value is not numeric', () => {
    // The weight typed with its unit is rejected, and the 4,5 the user meant
    // is inside the range: quoting only the range would tell them to do
    // exactly what they just did.
    expect(weightViolationMessage(weightViolationOf('4,5 kg', 'dog'), 'dog')).toBe(
      'Peso inválido: recebido "4,5 kg", esperado número entre 0.5 e 100 kg para cão, ' +
        'com ponto decimal e não vírgula',
    );
  });

  it('quotes an empty field so it does not vanish from the message', () => {
    expect(weightViolationMessage(weightViolationOf('', 'dog'), 'dog')).toBe(
      'Peso inválido: recebido "", esperado número entre 0.5 e 100 kg para cão, ' +
        'com ponto decimal e não vírgula',
    );
  });
});

describe('metabolizableEnergyViolationMessage', () => {
  it('names the offending value and the accepted range', () => {
    expect(metabolizableEnergyViolationMessage(energyViolationOf(100))).toBe(
      'Energia metabolizável inválida: recebido 100, esperado número entre 200 e 8000 kcal/kg',
    );
  });

  it('names the expected format when the value is not numeric', () => {
    // The label value copied with its unit. "3.500" alone parses since ADR
    // 0006; the unit is what breaks it, and 3500 is inside the range.
    expect(metabolizableEnergyViolationMessage(energyViolationOf('3.500 kcal/kg'))).toBe(
      'Energia metabolizável inválida: recebido "3.500 kcal/kg", esperado número entre 200 e ' +
        '8000 kcal/kg, com ponto decimal e não vírgula',
    );
  });
});

function weightViolationOf(rawWeight: unknown, species: 'dog' | 'cat'): FieldViolation {
  const validation = validateWeightInKilograms(rawWeight, species);

  if (validation.valid) {
    throw new Error(`Expected ${String(rawWeight)} to be rejected for a ${species}`);
  }

  return validation.violation;
}

function energyViolationOf(rawEnergy: unknown): FieldViolation {
  const validation = validateMetabolizableEnergy(rawEnergy);

  if (validation.valid) {
    throw new Error(`Expected ${String(rawEnergy)} to be rejected`);
  }

  return validation.violation;
}
