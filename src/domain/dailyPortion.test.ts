import { describe, expect, it } from 'vitest';
import { calculateDailyPortion, roundToWholeNumber } from './dailyPortion';
import type { DailyPortionInput } from './dailyPortion';

/**
 * The three cases below are acceptance criteria 1, 2 and 3 of docs/prd.md, and
 * their inputs and results come from docs/dominio-nutricional.md > Exemplos
 * calculados à mão. RER and MER compare at three decimals because the document
 * truncates at four; grams per day compares the exact integer, which is what
 * the screen shows.
 */
describe('calculateDailyPortion', () => {
  it('criterion 1 — neutered 10 kg dog with a 3500 kcal/kg food', () => {
    const result = calculateDailyPortion({
      species: 'dog',
      profile: 'neutered',
      weightInKilograms: 10,
      metabolizableEnergyKcalPerKilogram: 3500,
    });

    expect(result.restingEnergyRequirementKcal).toBeCloseTo(393.6389, 3);
    expect(result.maintenanceEnergyRequirementKcal).toBeCloseTo(629.8222, 3);
    expect(roundToWholeNumber(result.gramsPerDay)).toBe(180);
  });

  it('criterion 2 — neutered 4 kg cat with a 4000 kcal/kg food', () => {
    const result = calculateDailyPortion({
      species: 'cat',
      profile: 'neutered',
      weightInKilograms: 4,
      metabolizableEnergyKcalPerKilogram: 4000,
    });

    expect(result.restingEnergyRequirementKcal).toBeCloseTo(197.9899, 3);
    expect(result.maintenanceEnergyRequirementKcal).toBeCloseTo(237.5879, 3);
    expect(roundToWholeNumber(result.gramsPerDay)).toBe(59);
  });

  it('criterion 3 — obesity prone 25 kg dog with a 3800 kcal/kg food', () => {
    const result = calculateDailyPortion({
      species: 'dog',
      profile: 'obesityProne',
      weightInKilograms: 25,
      metabolizableEnergyKcalPerKilogram: 3800,
    });

    expect(result.restingEnergyRequirementKcal).toBeCloseTo(782.6238, 3);
    expect(result.maintenanceEnergyRequirementKcal).toBeCloseTo(1095.6733, 3);
    expect(roundToWholeNumber(result.gramsPerDay)).toBe(288);
  });

  it('returns the intermediate steps for the screen to show the calculation', () => {
    const result = calculateDailyPortion(validInput());

    expect(Object.keys(result).sort()).toEqual([
      'gramsPerDay',
      'maintenanceEnergyRequirementKcal',
      'metabolizableEnergyIsAtypical',
      'restingEnergyRequirementKcal',
    ]);
  });

  it('rounds nothing along the way: the result keeps full precision', () => {
    const result = calculateDailyPortion(validInput());

    expect(Number.isInteger(result.restingEnergyRequirementKcal)).toBe(false);
    expect(Number.isInteger(result.maintenanceEnergyRequirementKcal)).toBe(false);
    expect(Number.isInteger(result.gramsPerDay)).toBe(false);
  });

  it('accepts strings in the numeric fields, as the form hands them over', () => {
    const result = calculateDailyPortion({
      species: 'dog',
      profile: 'neutered',
      weightInKilograms: '10',
      metabolizableEnergyKcalPerKilogram: '3500',
    });

    expect(roundToWholeNumber(result.gramsPerDay)).toBe(180);
  });

  // Criterion 6: atypical ME calculates normally and is flagged.
  it('calculates and flags an ME outside the typical dry food range', () => {
    const result = calculateDailyPortion({
      ...validInput(),
      metabolizableEnergyKcalPerKilogram: 900,
    });

    expect(result.metabolizableEnergyIsAtypical).toBe(true);
    expect(result.gramsPerDay).toBeGreaterThan(0);
  });

  it('does not flag an ME inside the typical range', () => {
    expect(calculateDailyPortion(validInput()).metabolizableEnergyIsAtypical).toBe(false);
  });

  // Criterion 4: zero, negative or out-of-range weight blocks the calculation.
  it.each([0, -3, 0.4, 100.1, 'abc', '', null, undefined])(
    'refuses to calculate with weight %p',
    (weightInKilograms) => {
      expect(() => calculateDailyPortion({ ...validInput(), weightInKilograms })).toThrow(
        RangeError,
      );
    },
  );

  it('refuses 20 kg for a cat and accepts it for a dog', () => {
    expect(() =>
      calculateDailyPortion({ ...validInput(), species: 'cat', weightInKilograms: 20 }),
    ).toThrow(RangeError);
    expect(() =>
      calculateDailyPortion({ ...validInput(), species: 'dog', weightInKilograms: 20 }),
    ).not.toThrow();
  });

  // Criterion 5: ME outside 200–8000 blocks the calculation.
  it.each([0, -1, 199, 8001, 'abc', '', null, undefined])(
    'refuses to calculate with ME %p',
    (metabolizableEnergyKcalPerKilogram) => {
      expect(() =>
        calculateDailyPortion({ ...validInput(), metabolizableEnergyKcalPerKilogram }),
      ).toThrow(RangeError);
    },
  );

  it('throws a developer-facing message carrying the value and the expectation', () => {
    // English on purpose: reaching this throw means a caller skipped the
    // per-field validation the UI runs while typing. See ADR 0004.
    expect(() =>
      calculateDailyPortion({ ...validInput(), species: 'cat', weightInKilograms: 20 }),
    ).toThrow(
      'Invalid weight (outOfRange): received 20, expected a decimal number between 0.5 and 15',
    );
  });

  it('distinguishes a non-numeric field from an out-of-range one when throwing', () => {
    expect(() =>
      calculateDailyPortion({ ...validInput(), metabolizableEnergyKcalPerKilogram: '3,500.5' }),
    ).toThrow(
      'Invalid metabolizable energy (notANumber): received "3,500.5", ' +
        'expected a decimal number between 200 and 8000',
    );
  });

  it('refuses a species outside the table', () => {
    expect(() => calculateDailyPortion({ ...validInput(), species: 'ferret' })).toThrow(RangeError);
  });

  it('refuses a profile outside the table, including the out-of-scope ones', () => {
    // Puppies, pregnant and lactating animals have factors in the literature
    // but are out of scope by a decision in docs/prd.md. The domain does not
    // invent them.
    for (const profile of ['puppy', 'pregnant', 'senior', '']) {
      expect(() => calculateDailyPortion({ ...validInput(), profile })).toThrow(RangeError);
    }
  });
});

describe('roundToWholeNumber', () => {
  it.each([
    [179.94922406091172, 180],
    [59.39696961967, 59],
    [288.33507, 288],
    [0.5, 1],
    [1.4, 1],
  ])('rounds %p to %p', (value, expectedValue) => {
    expect(roundToWholeNumber(value)).toBe(expectedValue);
  });
});

function validInput(): DailyPortionInput {
  return {
    species: 'dog',
    profile: 'neutered',
    weightInKilograms: 10,
    metabolizableEnergyKcalPerKilogram: 3500,
  };
}
