import { describe, expect, it } from 'vitest';
import { calculateRestingEnergyRequirement } from './restingEnergyRequirement';

/**
 * Expected values come from docs/dominio-nutricional.md > Exemplos calculados
 * à mão. That document truncates at four decimals and the floating point
 * result goes further, hence the three-decimal comparison — still a tolerance
 * of 0.0005 kcal.
 */
describe('calculateRestingEnergyRequirement', () => {
  it('computes the RER of a 10 kg dog', () => {
    expect(calculateRestingEnergyRequirement(10)).toBeCloseTo(393.6389, 3);
  });

  it('computes the RER of a 4 kg cat', () => {
    expect(calculateRestingEnergyRequirement(4)).toBeCloseTo(197.9899, 3);
  });

  it('computes the RER of a 25 kg dog', () => {
    expect(calculateRestingEnergyRequirement(25)).toBeCloseTo(782.6238, 3);
  });

  it('uses one equation for every size, with no branch per weight band', () => {
    // The linear variant (30 × kg + 70) would give 370 for 10 kg against
    // 393.64 from the exponential. ADR 0002 chose the exponential throughout.
    expect(calculateRestingEnergyRequirement(10)).not.toBeCloseTo(370, 0);
    // Ends of the weight ranges in docs/dominio-nutricional.md > Validação.
    expect(calculateRestingEnergyRequirement(0.5)).toBeCloseTo(41.6222, 3);
    expect(calculateRestingEnergyRequirement(100)).toBeCloseTo(2213.5944, 3);
  });

  it.each([0, -3, Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects a non-positive or non-finite weight: %p',
    (weightInKilograms) => {
      expect(() => calculateRestingEnergyRequirement(weightInKilograms)).toThrow(RangeError);
    },
  );

  it('names the offending value and the expectation in the error message', () => {
    expect(() => calculateRestingEnergyRequirement(-3)).toThrow(
      'Invalid weight for the RER calculation: received -3, expected a positive number in kg',
    );
  });
});
