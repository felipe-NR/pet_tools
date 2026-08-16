import { describe, expect, it } from 'vitest';
import { validateWeightInKilograms, weightRangeFor } from './weightRange';

/**
 * Faixas de docs/dominio-nutricional.md > Validação de entrada:
 * cão de 0,5 a 100 kg, gato de 0,5 a 15 kg.
 */
describe('weightRangeFor', () => {
  it('devolve faixas diferentes por espécie', () => {
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
  ] as const)('aceita %s com %p kg', (species, weight) => {
    expect(validateWeightInKilograms(weight, species)).toEqual({ valid: true, value: weight });
  });

  it('aceita a string que vem do formulário', () => {
    expect(validateWeightInKilograms('25', 'dog')).toEqual({ valid: true, value: 25 });
  });

  // Critério 7 de docs/prd.md: trocar de cão para gato reavalia a faixa.
  it('trata 20 kg como válido para cão e inválido para gato', () => {
    expect(validateWeightInKilograms(20, 'dog').valid).toBe(true);
    expect(validateWeightInKilograms(20, 'cat').valid).toBe(false);
  });

  // Critério 4: peso zero, negativo ou fora da faixa bloqueia o cálculo.
  it.each([0, -3, 0.4, 100.1])('rejeita %p kg para cão', (weight) => {
    expect(validateWeightInKilograms(weight, 'dog').valid).toBe(false);
  });

  it.each([0, -3, 0.4, 15.1, 20])('rejeita %p kg para gato', (weight) => {
    expect(validateWeightInKilograms(weight, 'cat').valid).toBe(false);
  });

  it.each(['abc', '', '   ', null, undefined, Number.NaN, {}])(
    'rejeita entrada não numérica: %p',
    (rawWeight) => {
      expect(validateWeightInKilograms(rawWeight, 'dog').valid).toBe(false);
    },
  );

  it('cita o valor recebido e a faixa esperada da espécie na mensagem', () => {
    const validation = validateWeightInKilograms(20, 'cat');

    expect(validation).toEqual({
      valid: false,
      message: 'Peso inválido: recebido 20, esperado número entre 0.5 e 15 kg para gato',
    });
  });

  it('usa a faixa do cão na mensagem quando a espécie é cão', () => {
    const validation = validateWeightInKilograms(-3, 'dog');

    expect(validation).toEqual({
      valid: false,
      message: 'Peso inválido: recebido -3, esperado número entre 0.5 e 100 kg para cão',
    });
  });

  it('mostra a string entre aspas para o campo em branco não sumir da mensagem', () => {
    const validation = validateWeightInKilograms('', 'dog');

    expect(validation).toEqual({
      valid: false,
      message: 'Peso inválido: recebido "", esperado número entre 0.5 e 100 kg para cão',
    });
  });
});
