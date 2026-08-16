import { describe, expect, it } from 'vitest';
import { calculateMaintenanceEnergyRequirement } from './maintenanceEnergyRequirement';
import { calculateRestingEnergyRequirement } from './restingEnergyRequirement';

/**
 * Valores esperados de docs/dominio-nutricional.md > Exemplos calculados à mão.
 * Três casas decimais pelo mesmo motivo explicado em
 * restingEnergyRequirement.test.ts: o documento trunca em quatro.
 */
describe('calculateMaintenanceEnergyRequirement', () => {
  it('calcula o MER do cão de 10 kg castrado', () => {
    const restingEnergy = calculateRestingEnergyRequirement(10);

    expect(calculateMaintenanceEnergyRequirement(restingEnergy, 'dog', 'neutered')).toBeCloseTo(
      629.8222,
      3,
    );
  });

  it('calcula o MER do gato de 4 kg castrado', () => {
    const restingEnergy = calculateRestingEnergyRequirement(4);

    expect(calculateMaintenanceEnergyRequirement(restingEnergy, 'cat', 'neutered')).toBeCloseTo(
      237.5879,
      3,
    );
  });

  it('calcula o MER do cão de 25 kg propenso à obesidade', () => {
    const restingEnergy = calculateRestingEnergyRequirement(25);

    expect(calculateMaintenanceEnergyRequirement(restingEnergy, 'dog', 'obesityProne')).toBeCloseTo(
      1095.6733,
      3,
    );
  });

  it('aplica fator maior para inteiro do que para castrado, na mesma espécie', () => {
    const restingEnergy = calculateRestingEnergyRequirement(10);
    const intact = calculateMaintenanceEnergyRequirement(restingEnergy, 'dog', 'intact');
    const neutered = calculateMaintenanceEnergyRequirement(restingEnergy, 'dog', 'neutered');

    expect(intact).toBeGreaterThan(neutered);
  });

  it('não arredonda: o MER sai com precisão total', () => {
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
    'rejeita RER não positivo ou não finito: %p',
    (restingEnergy) => {
      expect(() => calculateMaintenanceEnergyRequirement(restingEnergy, 'dog', 'neutered')).toThrow(
        RangeError,
      );
    },
  );

  it('cita o valor ofensivo na mensagem de erro', () => {
    expect(() => calculateMaintenanceEnergyRequirement(-1, 'dog', 'neutered')).toThrow(
      'RER inválido para o cálculo de MER: recebido -1, esperado número positivo em kcal',
    );
  });
});
