import { describe, expect, it } from 'vitest';
import { isAtypicalForDryFood, validateMetabolizableEnergy } from './metabolizableEnergy';

/**
 * Faixas de docs/dominio-nutricional.md > Validação de entrada: aceita de 200 a
 * 8 000 kcal/kg; fora de 2 500 a 5 000 o cálculo prossegue com aviso.
 */
describe('validateMetabolizableEnergy', () => {
  it.each([200, 2500, 3500, 4000, 5000, 8000])('aceita %p kcal/kg', (rawEnergy) => {
    expect(validateMetabolizableEnergy(rawEnergy)).toEqual({ valid: true, value: rawEnergy });
  });

  it('aceita a string que vem do formulário', () => {
    expect(validateMetabolizableEnergy('3800')).toEqual({ valid: true, value: 3800 });
  });

  // Critério 5 de docs/prd.md: EM fora de 200–8 000 bloqueia o cálculo.
  it.each([0, -1, 199, 8001, 100000])('rejeita %p kcal/kg', (rawEnergy) => {
    expect(validateMetabolizableEnergy(rawEnergy).valid).toBe(false);
  });

  it.each(['abc', '', '   ', null, undefined, Number.NaN, {}])(
    'rejeita entrada não numérica: %p',
    (rawEnergy) => {
      expect(validateMetabolizableEnergy(rawEnergy).valid).toBe(false);
    },
  );

  it('cita o valor recebido e a faixa esperada na mensagem', () => {
    expect(validateMetabolizableEnergy(100)).toEqual({
      valid: false,
      message:
        'Energia metabolizável inválida: recebido 100, esperado número entre 200 e 8000 kcal/kg',
    });
  });

  it('mostra a string entre aspas para o campo em branco não sumir da mensagem', () => {
    expect(validateMetabolizableEnergy('')).toEqual({
      valid: false,
      message:
        'Energia metabolizável inválida: recebido "", esperado número entre 200 e 8000 kcal/kg, ' +
        'com ponto decimal e não vírgula',
    });
  });

  it('nomeia o formato esperado quando o valor não é numérico', () => {
    // 3.500,5 é como o rótulo escreve. Sem citar o separador, a mensagem diz
    // que se esperava um número numa faixa em que esse valor está.
    expect(validateMetabolizableEnergy('3.500,5')).toEqual({
      valid: false,
      message:
        'Energia metabolizável inválida: recebido "3.500,5", esperado número entre 200 e ' +
        '8000 kcal/kg, com ponto decimal e não vírgula',
    });
  });
});

describe('isAtypicalForDryFood', () => {
  // Critério 6: entre 200 e 2 500 ou entre 5 000 e 8 000 calcula com aviso.
  it.each([200, 1200, 2499, 5001, 7000, 8000])('sinaliza %p kcal/kg como atípico', (energy) => {
    expect(isAtypicalForDryFood(energy)).toBe(true);
  });

  it.each([2500, 3500, 4000, 5000])(
    'não sinaliza %p kcal/kg, que é ração seca típica',
    (energy) => {
      expect(isAtypicalForDryFood(energy)).toBe(false);
    },
  );

  it('trata os dois extremos da faixa típica como típicos', () => {
    expect(isAtypicalForDryFood(2500)).toBe(false);
    expect(isAtypicalForDryFood(5000)).toBe(false);
  });
});
