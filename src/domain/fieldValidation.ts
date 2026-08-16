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
 * Converte a entrada crua em número, ou devolve `null` se ela não for um
 * decimal utilizável.
 *
 * Rejeita string vazia e só-espaços explicitamente porque `Number('')` é 0, o
 * que transformaria campo em branco em peso zero.
 *
 * @example
 * parseDecimalInput('  25 '); // 25
 * parseDecimalInput('12,5');  // null
 */
export function parseDecimalInput(rawValue: unknown): number | null {
  if (typeof rawValue === 'number') {
    return Number.isFinite(rawValue) ? rawValue : null;
  }

  if (typeof rawValue !== 'string' || rawValue.trim() === '') {
    return null;
  }

  const parsedValue = Number(rawValue);
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
