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
  ])('turns %p into %p', (rawValue, expectedValue) => {
    expect(parseDecimalInput(rawValue)).toBe(expectedValue);
  });

  it.each([
    ['abc'],
    [''],
    ['   '],
    // The decimal comma is not accepted: the form field hands over a dot, and
    // accepting both forms is a UI decision, not a domain one.
    ['12,5'],
    [null],
    [undefined],
    [Number.NaN],
    [Number.POSITIVE_INFINITY],
    [{}],
    [[]],
    [true],
  ])('rejects %p by returning null', (rawValue) => {
    expect(parseDecimalInput(rawValue)).toBeNull();
  });

  // Number() alone would accept all of these and produce a plausible number
  // that reached the calculation unnoticed.
  it.each([
    ['0x1194'], // Number() would give 4500, a valid ME
    ['1e1'], // Number() would give 10, a valid weight
    ['0b101'],
    ['0o17'],
    ['+5'],
    ['5.'],
    ['.5'],
    ['1_000'],
    ['Infinity'],
  ])('rejects the non-decimal literal %p', (rawValue) => {
    expect(parseDecimalInput(rawValue)).toBeNull();
  });

  it('rejects a decimal beyond the largest representable number', () => {
    // Digits only, so the pattern accepts it; Number() overflows to Infinity.
    // It is the only way the finiteness guard fires after the pattern.
    expect(parseDecimalInput('9'.repeat(400))).toBeNull();
  });
});

describe('describeRawValue', () => {
  it('quotes strings so an empty value still shows up in the message', () => {
    expect(describeRawValue('abc')).toBe('"abc"');
    expect(describeRawValue('')).toBe('""');
  });

  it.each([
    [-3, '-3'],
    [0, '0'],
    [null, 'null'],
    [undefined, 'undefined'],
    [Number.NaN, 'NaN'],
  ])('describes %p as %p', (rawValue, expectedDescription) => {
    expect(describeRawValue(rawValue)).toBe(expectedDescription);
  });
});
