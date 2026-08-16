/**
 * Vocabulário comum das validações de campo.
 *
 * O formulário entrega string, e o domínio precisa tratar o tipo como
 * realmente desconhecido — daí `unknown` + narrowing, conforme
 * AGENTS.md > Estilo de código.
 */

/**
 * Resultado de validar um campo: ou o valor já convertido, ou a mensagem que
 * vai para baixo do campo. União discriminada para o TypeScript obrigar quem
 * chama a tratar o caso inválido.
 */
export type FieldValidation<T> =
  { readonly valid: true; readonly value: T } | { readonly valid: false; readonly message: string };

/**
 * Só decimal com ponto: `25`, `0.5`, `-3`.
 *
 * O padrão existe porque `Number()` sozinho é largo demais para o contrato
 * desta função: `Number('0x1194')` é 4500 e `Number('1e1')` é 10, então uma
 * string colada ou malformada viraria silenciosamente um número plausível e
 * entraria no cálculo. `Number('')` é 0, que transformaria campo em branco em
 * peso zero. O padrão recusa os três.
 */
const DECIMAL_INPUT_PATTERN = /^-?\d+(?:\.\d+)?$/;

/**
 * Converte a entrada crua em número, ou devolve `null` se ela não for um
 * decimal utilizável.
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
 * Formata a entrada crua para aparecer na mensagem de erro.
 *
 * String vai entre aspas para que campo em branco não vire uma mensagem que
 * parece truncada — ver AGENTS.md > Estilo de código.
 *
 * @example
 * describeRawValue(''); // '""'
 */
export function describeRawValue(rawValue: unknown): string {
  return typeof rawValue === 'string' ? `"${rawValue}"` : String(rawValue);
}
