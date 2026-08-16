import { describe, expect, it } from 'vitest';
import { calculateMaintenanceEnergyRequirement } from './maintenanceEnergyRequirement';
import { calculateRestingEnergyRequirement } from './restingEnergyRequirement';

/**
 * Expected values from docs/dominio-nutricional.md > Exemplos calculados à
 * mão. Three decimals for the reason explained in
 * restingEnergyRequirement.test.ts: the document truncates at four.
 */
describe('calculateMaintenanceEnergyRequirement', () => {
  it('computes the MER of the neutered 10 kg dog', () => {
    const restingEnergy = calculateRestingEnergyRequirement(10);

    expect(calculateMaintenanceEnergyRequirement(restingEnergy, 'dog', 'neutered')).toBeCloseTo(
      629.8222,
      3,
    );
  });

  it('computes the MER of the neutered 4 kg cat', () => {
    const restingEnergy = calculateRestingEnergyRequirement(4);

    expect(calculateMaintenanceEnergyRequirement(restingEnergy, 'cat', 'neutered')).toBeCloseTo(
      237.5879,
      3,
    );
  });

  it('computes the MER of the obesity prone 25 kg dog', () => {
    const restingEnergy = calculateRestingEnergyRequirement(25);

    expect(calculateMaintenanceEnergyRequirement(restingEnergy, 'dog', 'obesityProne')).toBeCloseTo(
      1095.6733,
      3,
    );
  });

  it('applies a larger factor to intact than to neutered, within a species', () => {
    const restingEnergy = calculateRestingEnergyRequirement(10);
    const intact = calculateMaintenanceEnergyRequirement(restingEnergy, 'dog', 'intact');
    const neutered = calculateMaintenanceEnergyRequirement(restingEnergy, 'dog', 'neutered');

    expect(intact).toBeGreaterThan(neutered);
  });

  it('does not round: the MER keeps full precision', () => {
    const restingEnergy = calculateRestingEnergyRequirement(10);
    const maintenanceEnergy = calculateMaintenanceEnergyRequirement(
      restingEnergy,
      'dog',
      'neutered',
    );

    expect(Number.isInteger(maintenanceEnergy)).toBe(false);
    expect(maintenanceEnergy).not.toBe(629.8222);
  });

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects a non-positive or non-finite RER: %p',
    (restingEnergy) => {
      expect(() => calculateMaintenanceEnergyRequirement(restingEnergy, 'dog', 'neutered')).toThrow(
        RangeError,
      );
    },
  );

  it('names the offending value in the error message', () => {
    expect(() => calculateMaintenanceEnergyRequirement(-1, 'dog', 'neutered')).toThrow(
      'Invalid RER for the MER calculation: received -1, expected a positive number in kcal',
    );
  });
});
