import { describe, expect, it } from 'vitest';
import {
  METABOLIZABLE_ENERGY_RANGE,
  isAtypicalForDryFood,
  validateMetabolizableEnergy,
} from './metabolizableEnergy';

/**
 * Ranges from docs/dominio-nutricional.md > Validação de entrada: accepts 200
 * to 8000 kcal/kg; outside 2500 to 5000 the calculation proceeds with a
 * warning.
 */
describe('METABOLIZABLE_ENERGY_RANGE', () => {
  it('exposes the accepted range for the UI to show in help text', () => {
    expect(METABOLIZABLE_ENERGY_RANGE).toEqual({ minimum: 200, maximum: 8000 });
  });
});

describe('validateMetabolizableEnergy', () => {
  it.each([200, 2500, 3500, 4000, 5000, 8000])('accepts %p kcal/kg', (rawEnergy) => {
    expect(validateMetabolizableEnergy(rawEnergy)).toEqual({ valid: true, value: rawEnergy });
  });

  it('accepts the string the form hands over', () => {
    expect(validateMetabolizableEnergy('3800')).toEqual({ valid: true, value: 3800 });
  });

  // Acceptance criterion 5 of docs/prd.md: ME outside 200–8000 blocks the
  // calculation.
  it.each([0, -1, 199, 8001, 100000])('rejects %p kcal/kg', (rawEnergy) => {
    expect(validateMetabolizableEnergy(rawEnergy).valid).toBe(false);
  });

  it.each(['abc', '', '   ', null, undefined, Number.NaN, {}])(
    'rejects non-numeric input: %p',
    (rawEnergy) => {
      expect(validateMetabolizableEnergy(rawEnergy).valid).toBe(false);
    },
  );

  it('reports an out-of-range value as data', () => {
    expect(validateMetabolizableEnergy(100)).toEqual({
      valid: false,
      violation: { reason: 'outOfRange', received: 100, minimum: 200, maximum: 8000 },
    });
  });

  it('separates a non-numeric value from an out-of-range one', () => {
    // "3.500,5" is how a label writes it, and it is inside the range.
    expect(validateMetabolizableEnergy('3.500,5')).toEqual({
      valid: false,
      violation: { reason: 'notANumber', received: '3.500,5', minimum: 200, maximum: 8000 },
    });
  });

  it('never returns display text, only the data the copy layer needs', () => {
    const validation = validateMetabolizableEnergy(100);

    expect(Object.keys(validation)).toEqual(['valid', 'violation']);
    expect(Object.keys(validation.valid ? {} : validation.violation).sort()).toEqual([
      'maximum',
      'minimum',
      'reason',
      'received',
    ]);
  });
});

describe('isAtypicalForDryFood', () => {
  // Criterion 6: between 200 and 2500 or between 5000 and 8000 it calculates
  // and warns.
  it.each([200, 1200, 2499, 5001, 7000, 8000])('flags %p kcal/kg as atypical', (energy) => {
    expect(isAtypicalForDryFood(energy)).toBe(true);
  });

  it.each([2500, 3500, 4000, 5000])('does not flag %p kcal/kg, typical dry food', (energy) => {
    expect(isAtypicalForDryFood(energy)).toBe(false);
  });

  it('treats both ends of the typical range as typical', () => {
    expect(isAtypicalForDryFood(2500)).toBe(false);
    expect(isAtypicalForDryFood(5000)).toBe(false);
  });
});
