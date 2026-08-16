import { describe, expect, it } from 'vitest';
import { calculateRestingEnergyRequirement } from './restingEnergyRequirement';

/**
 * Os valores esperados vêm de docs/dominio-nutricional.md > Exemplos calculados
 * à mão. O documento trunca em quatro casas, e a conta em ponto flutuante passa
 * disso — daí a comparação em três casas, que ainda é ±0,0005 kcal.
 */
describe('calculateRestingEnergyRequirement', () => {
  it('calcula o RER de um cão de 10 kg', () => {
    expect(calculateRestingEnergyRequirement(10)).toBeCloseTo(393.6389, 3);
  });

  it('calcula o RER de um gato de 4 kg', () => {
    expect(calculateRestingEnergyRequirement(4)).toBeCloseTo(197.9899, 3);
  });

  it('calcula o RER de um cão de 25 kg', () => {
    expect(calculateRestingEnergyRequirement(25)).toBeCloseTo(782.6238, 3);
  });

  it('usa a mesma equação para qualquer porte, sem ramo por faixa de peso', () => {
    // A variante linear (30 × kg + 70) daria 370 para 10 kg contra 393,64 da
    // exponencial. ADR 0002 escolheu a exponencial para toda a faixa.
    expect(calculateRestingEnergyRequirement(10)).not.toBeCloseTo(370, 0);
    // Extremos das faixas de peso de docs/dominio-nutricional.md > Validação.
    expect(calculateRestingEnergyRequirement(0.5)).toBeCloseTo(41.6222, 3);
    expect(calculateRestingEnergyRequirement(100)).toBeCloseTo(2213.5944, 3);
  });

  it.each([0, -3, Number.NaN, Number.POSITIVE_INFINITY])(
    'rejeita peso não positivo ou não finito: %p',
    (weightInKilograms) => {
      expect(() => calculateRestingEnergyRequirement(weightInKilograms)).toThrow(RangeError);
    },
  );

  it('cita o valor ofensivo e o esperado na mensagem de erro', () => {
    expect(() => calculateRestingEnergyRequirement(-3)).toThrow(
      'Peso inválido para o cálculo de RER: recebido -3, esperado número positivo em kg',
    );
  });
});
