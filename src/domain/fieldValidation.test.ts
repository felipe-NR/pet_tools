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

  // pt-BR notation, per ADR 0006: the comma opens the decimals and the dot
  // groups the thousands. "3.500" is how the label prints the energy, so it is
  // the form the user copies into the field.
  it.each([
    ['4,5', 4.5],
    ['0,5', 0.5],
    ['-3,5', -3.5],
    ['12,5', 12.5],
    ['3.500', 3500],
    ['3.500,5', 3500.5],
    ['1.234.567', 1234567],
    ['  3.500,5  ', 3500.5],
    // Four digits ahead of the dot are not a thousands group, so the dot keeps
    // reading as the decimal separator.
    ['1234.567', 1234.567],
  ])('reads the pt-BR notation %p as %p', (rawValue, expectedValue) => {
    expect(parseDecimalInput(rawValue)).toBe(expectedValue);
  });

  it('resolves an ambiguous X.YYY as thousands, not as decimals', () => {
    // Both readings exist for "1.500". ADR 0006 gives the tie to the thousands
    // separator: no accepted range holds 1.5 and 1500 at once, so the losing
    // reading can only ever surface as an out-of-range message.
    expect(parseDecimalInput('1.500')).toBe(1500);
  });

  it.each([
    ['abc'],
    [''],
    ['   '],
    // The comma separates decimals, it is not a free-floating character: it
    // still needs digits on both sides, exactly like the dot.
    [',5'],
    ['5,'],
    ['1,2,3'],
    ['1.500,'],
    ['1.2.3'],
    // en-US notation is the pt-BR one mirrored, and reading it would swap the
    // two separators — 3,500.5 is not 3500.5 to this parser.
    ['3,500.5'],
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
