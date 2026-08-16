/**
 * Shared vocabulary for field validation.
 *
 * The form hands over strings, so the domain treats the incoming type as
 * genuinely unknown — `unknown` plus narrowing, per AGENTS.md > Code style.
 *
 * Validation never produces display text. It reports what went wrong as data,
 * and `src/copy/` turns that into the Portuguese sentence the user reads. See
 * ADR 0004: a calculation engine that speaks one human language is not the
 * reusable engine AGENTS.md > Structure promises.
 */

/** Lower and upper bound a numeric field accepts, inclusive on both ends. */
export interface NumericRange {
  readonly minimum: number;
  readonly maximum: number;
}

/**
 * Why a field was rejected.
 *
 * `notANumber` and `outOfRange` stay apart because they need different
 * sentences: a value that failed to parse may well sit inside the range, so
 * quoting only the range would tell the user to do what they just did.
 */
export type FieldViolationReason = 'notANumber' | 'outOfRange';

/** Everything the copy layer needs to write a message for a numeric field. */
export interface FieldViolation extends NumericRange {
  readonly reason: FieldViolationReason;
  readonly received: unknown;
}

/**
 * Either the parsed value or the reason it was rejected. A discriminated union
 * so TypeScript forces the caller to handle the invalid case.
 */
export type FieldValidation<T> =
  | { readonly valid: true; readonly value: T }
  | { readonly valid: false; readonly violation: FieldViolation };

/**
 * Decimals with a dot only: `25`, `0.5`, `-3`.
 *
 * The pattern exists because `Number()` alone is far wider than this
 * function's contract: `Number('0x1194')` is 4500 and `Number('1e1')` is 10,
 * so a pasted or malformed string would quietly become a plausible number and
 * reach the calculation. `Number('')` is 0, which would turn a blank field
 * into a weight of zero. The pattern rejects all three.
 */
const DECIMAL_INPUT_PATTERN = /^-?\d+(?:\.\d+)?$/;

/**
 * Converts raw input into a number, or returns `null` when it is not a usable
 * decimal.
 *
 * @example
 * parseDecimalInput('  25 ');   // 25
 * parseDecimalInput('12,5');    // null
 * parseDecimalInput('0x1194');  // null
 */
export function parseDecimalInput(rawValue: unknown): number | null {
  if (typeof rawValue === 'number') {
    return Number.isFinite(rawValue) ? rawValue : null;
  }

  if (typeof rawValue !== 'string') {
    return null;
  }

  const trimmedValue = rawValue.trim();
  if (!DECIMAL_INPUT_PATTERN.test(trimmedValue)) {
    return null;
  }

  const parsedValue = Number(trimmedValue);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

/**
 * Formats a raw value for an error message.
 *
 * Strings get quotes so that a blank field does not read like a truncated
 * sentence — see AGENTS.md > Code style.
 *
 * @example
 * describeRawValue(''); // '""'
 */
export function describeRawValue(rawValue: unknown): string {
  return typeof rawValue === 'string' ? `"${rawValue}"` : String(rawValue);
}
