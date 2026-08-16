import { describe, expect, it } from 'vitest';
import { describeRawValue, parseDecimalInput } from './fieldValidation';

describe('parseDecimalInput', () => {
  it.each([
    [10, 10],
    [0.5, 0.5],
    [-3, -3],
    ['10', 10],
    ['0.5', 0.5],
    ['  25  ', 25],
    ['3500', 3500],
  ])('converte %p em %p', (rawValue, expectedValue) => {
    expect(parseDecimalInput(rawValue)).toBe(expectedValue);
  });

  it.each([
    ['abc'],
    [''],
    ['   '],
    // Vírgula decimal não é aceita: o campo do formulário entrega ponto, e
    // aceitar as duas formas é decisão de UI, não de domínio.
    ['12,5'],
    [null],
    [undefined],
    [Number.NaN],
    [Number.POSITIVE_INFINITY],
    [{}],
    [[]],
    [true],
  ])('rejeita %p devolvendo null', (rawValue) => {
    expect(parseDecimalInput(rawValue)).toBeNull();
  });
});

describe('describeRawValue', () => {
  it('põe aspas em string para o valor vazio aparecer na mensagem', () => {
    expect(describeRawValue('abc')).toBe('"abc"');
    expect(describeRawValue('')).toBe('""');
  });

  it.each([
    [-3, '-3'],
    [0, '0'],
    [null, 'null'],
    [undefined, 'undefined'],
    [Number.NaN, 'NaN'],
  ])('descreve %p como %p', (rawValue, expectedDescription) => {
    expect(describeRawValue(rawValue)).toBe(expectedDescription);
  });
});
