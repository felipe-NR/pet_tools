import { describe, expect, it } from 'vitest';
import { validateWeightInKilograms, weightRangeFor } from './weightRange';

/**
 * Ranges from docs/dominio-nutricional.md > Validação de entrada:
 * dog from 0.5 to 100 kg, cat from 0.5 to 15 kg.
 */
describe('weightRangeFor', () => {
  it('returns different ranges per species', () => {
    expect(weightRangeFor('dog')).toEqual({ minimum: 0.5, maximum: 100 });
    expect(weightRangeFor('cat')).toEqual({ minimum: 0.5, maximum: 15 });
  });
});

describe('validateWeightInKilograms', () => {
  it.each([
    ['dog', 10],
    ['dog', 0.5],
    ['dog', 100],
    ['cat', 4],
    ['cat', 0.5],
    ['cat', 15],
  ] as const)('accepts %s at %p kg', (species, weight) => {
    expect(validateWeightInKilograms(weight, species)).toEqual({ valid: true, value: weight });
  });

  it('accepts the string the form hands over', () => {
    expect(validateWeightInKilograms('25', 'dog')).toEqual({ valid: true, value: 25 });
  });

  // Acceptance criterion 7 of docs/prd.md: switching from dog to cat
  // re-evaluates the range.
  it('treats 20 kg as valid for a dog and invalid for a cat', () => {
    expect(validateWeightInKilograms(20, 'dog').valid).toBe(true);
    expect(validateWeightInKilograms(20, 'cat').valid).toBe(false);
  });

  // Criterion 4: zero, negative or out-of-range weight blocks the calculation.
  it.each([0, -3, 0.4, 100.1])('rejects %p kg for a dog', (weight) => {
    expect(validateWeightInKilograms(weight, 'dog').valid).toBe(false);
  });

  it.each([0, -3, 0.4, 15.1, 20])('rejects %p kg for a cat', (weight) => {
    expect(validateWeightInKilograms(weight, 'cat').valid).toBe(false);
  });

  it.each(['abc', '', '   ', null, undefined, Number.NaN, {}])(
    'rejects non-numeric input: %p',
    (rawWeight) => {
      expect(validateWeightInKilograms(rawWeight, 'dog').valid).toBe(false);
    },
  );

  it('reports an out-of-range weight as data, with the range of the species', () => {
    expect(validateWeightInKilograms(20, 'cat')).toEqual({
      valid: false,
      violation: { reason: 'outOfRange', received: 20, minimum: 0.5, maximum: 15 },
    });
  });

  it('separates a non-numeric value from an out-of-range one', () => {
    // "1.2.3" sits nowhere, but a rejected value often does sit inside the
    // range: only the reason tells the copy layer to name the accepted format.
    expect(validateWeightInKilograms('1.2.3', 'dog')).toEqual({
      valid: false,
      violation: { reason: 'notANumber', received: '1.2.3', minimum: 0.5, maximum: 100 },
    });
  });

  it('accepts the weight written the way a Brazilian types it', () => {
    // ADR 0006. This is the whole point of the field: 4,5 kg is a plausible
    // small dog and used to be rejected as non-numeric.
    expect(validateWeightInKilograms('4,5', 'dog')).toEqual({ valid: true, value: 4.5 });
    expect(validateWeightInKilograms('12,5', 'dog')).toEqual({ valid: true, value: 12.5 });
  });

  it('reads an ambiguous 1.500 as 1500 kg and reports it out of range', () => {
    // The regression ADR 0006 accepts, and it is visible rather than silent:
    // the user reads the value back and retypes it as 1,5.
    expect(validateWeightInKilograms('1.500', 'dog')).toEqual({
      valid: false,
      violation: { reason: 'outOfRange', received: '1.500', minimum: 0.5, maximum: 100 },
    });
  });

  it('carries the raw value through untouched, for the message to quote it', () => {
    expect(validateWeightInKilograms('', 'dog')).toEqual({
      valid: false,
      violation: { reason: 'notANumber', received: '', minimum: 0.5, maximum: 100 },
    });
  });

  it('never returns display text, only the data the copy layer needs', () => {
    const validation = validateWeightInKilograms(20, 'cat');

    expect(validation.valid).toBe(false);
    expect(Object.keys(validation)).toEqual(['valid', 'violation']);
    expect(Object.keys(validation.valid ? {} : validation.violation).sort()).toEqual([
      'maximum',
      'minimum',
      'reason',
      'received',
    ]);
  });
});
