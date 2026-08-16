import { describe, expect, it } from 'vitest';
import { calculateDailyPortion, roundToWholeNumber } from './dailyPortion';
import type { DailyPortionInput } from './dailyPortion';

/**
 * Os três casos abaixo são os critérios de aceite 1, 2 e 3 de docs/prd.md, e
 * as entradas e resultados vêm de docs/dominio-nutricional.md > Exemplos
 * calculados à mão. RER e MER comparam em três casas porque o documento trunca
 * em quatro; gramas por dia comparam o inteiro exato, que é o que a tela mostra.
 */
describe('calculateDailyPortion', () => {
  it('critério 1 — cão de 10 kg castrado com ração de 3 500 kcal/kg', () => {
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

  it('critério 2 — gato de 4 kg castrado com ração de 4 000 kcal/kg', () => {
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

  it('critério 3 — cão de 25 kg propenso à obesidade com ração de 3 800 kcal/kg', () => {
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

  it('devolve os passos intermediários para a tela mostrar o cálculo', () => {
    const result = calculateDailyPortion(validInput());

    expect(Object.keys(result).sort()).toEqual([
      'gramsPerDay',
      'maintenanceEnergyRequirementKcal',
      'metabolizableEnergyIsAtypical',
      'restingEnergyRequirementKcal',
    ]);
  });

  it('não arredonda nada no caminho: o resultado sai com precisão total', () => {
    const result = calculateDailyPortion(validInput());

    expect(Number.isInteger(result.restingEnergyRequirementKcal)).toBe(false);
    expect(Number.isInteger(result.maintenanceEnergyRequirementKcal)).toBe(false);
    expect(Number.isInteger(result.gramsPerDay)).toBe(false);
  });

  it('aceita string nos campos numéricos, como o formulário entrega', () => {
    const result = calculateDailyPortion({
      species: 'dog',
      profile: 'neutered',
      weightInKilograms: '10',
      metabolizableEnergyKcalPerKilogram: '3500',
    });

    expect(roundToWholeNumber(result.gramsPerDay)).toBe(180);
  });

  // Critério 6: EM atípica calcula normalmente e sinaliza.
  it('calcula e sinaliza EM fora da faixa típica de ração seca', () => {
    const result = calculateDailyPortion({
      ...validInput(),
      metabolizableEnergyKcalPerKilogram: 900,
    });

    expect(result.metabolizableEnergyIsAtypical).toBe(true);
    expect(result.gramsPerDay).toBeGreaterThan(0);
  });

  it('não sinaliza EM dentro da faixa típica', () => {
    expect(calculateDailyPortion(validInput()).metabolizableEnergyIsAtypical).toBe(false);
  });

  // Critério 4: peso zero, negativo ou fora da faixa bloqueia o cálculo.
  it.each([0, -3, 0.4, 100.1, 'abc', '', null, undefined])(
    'recusa calcular com peso %p',
    (weightInKilograms) => {
      expect(() => calculateDailyPortion({ ...validInput(), weightInKilograms })).toThrow(
        RangeError,
      );
    },
  );

  it('recusa 20 kg para gato e aceita para cão', () => {
    expect(() =>
      calculateDailyPortion({ ...validInput(), species: 'cat', weightInKilograms: 20 }),
    ).toThrow(RangeError);
    expect(() =>
      calculateDailyPortion({ ...validInput(), species: 'dog', weightInKilograms: 20 }),
    ).not.toThrow();
  });

  // Critério 5: EM fora de 200–8 000 bloqueia o cálculo.
  it.each([0, -1, 199, 8001, 'abc', '', null, undefined])(
    'recusa calcular com EM %p',
    (metabolizableEnergyKcalPerKilogram) => {
      expect(() =>
        calculateDailyPortion({ ...validInput(), metabolizableEnergyKcalPerKilogram }),
      ).toThrow(RangeError);
    },
  );

  it('propaga a mensagem da validação, com valor recebido e faixa esperada', () => {
    expect(() =>
      calculateDailyPortion({ ...validInput(), species: 'cat', weightInKilograms: 20 }),
    ).toThrow('Peso inválido: recebido 20, esperado número entre 0.5 e 15 kg para gato');
  });

  it('recusa espécie fora da tabela', () => {
    expect(() => calculateDailyPortion({ ...validInput(), species: 'ferret' })).toThrow(RangeError);
  });

  it('recusa perfil fora da tabela, inclusive os que estão fora de escopo', () => {
    // Filhote, gestante e lactante têm fator na literatura mas estão fora de
    // escopo por decisão de docs/prd.md. O domínio não os inventa.
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
  ])('arredonda %p para %p', (value, expectedValue) => {
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
