import { describeRawValue, parseDecimalInput } from './fieldValidation';
import type { FieldValidation } from './fieldValidation';
import { requireSpecies, speciesLabelFor } from './petProfile';
import type { Species } from './petProfile';

/**
 * Faixa de peso aceita por espécie e a validação do campo de peso.
 *
 * A faixa é por espécie de propósito: 20 kg é peso plausível de cão e
 * implausível de gato, e o critério 7 de docs/prd.md exige que trocar a
 * espécie reavalie o peso já digitado.
 */

export interface WeightRangeInKilograms {
  readonly minimum: number;
  readonly maximum: number;
}

/** Faixas de docs/dominio-nutricional.md > Validação de entrada. */
const WEIGHT_RANGES: Readonly<Record<Species, WeightRangeInKilograms>> = {
  dog: { minimum: 0.5, maximum: 100 },
  cat: { minimum: 0.5, maximum: 15 },
};

/**
 * Faixa de peso aceita para a espécie, em quilogramas.
 *
 * @example
 * weightRangeFor('cat'); // { minimum: 0.5, maximum: 15 }
 */
export function weightRangeFor(species: Species): WeightRangeInKilograms {
  return WEIGHT_RANGES[requireSpecies(species)];
}

/**
 * Valida o peso digitado contra a faixa da espécie.
 *
 * `rawWeight` é `unknown` porque é o campo sob validação e vem do formulário
 * como string; `species` é precondição, já narrowada, e viola o contrato se
 * vier errada — por isso um devolve resultado e o outro lança.
 *
 * A mensagem carrega o valor recebido e a faixa esperada, conforme o critério
 * 4 de docs/prd.md. Quando o valor sequer é numérico, ela nomeia também o
 * formato: sem isso, quem digita "12,5" lê que se esperava um número entre 0.5
 * e 100 — faixa em que 12,5 está — e não descobre que o separador é ponto.
 *
 * @example
 * validateWeightInKilograms('20', 'cat');
 * // { valid: false, message: 'Peso inválido: recebido "20", ...' }
 */
export function validateWeightInKilograms(
  rawWeight: unknown,
  species: Species,
): FieldValidation<number> {
  const range = weightRangeFor(species);
  const parsedWeight = parseDecimalInput(rawWeight);
  const expectation =
    `esperado número entre ${String(range.minimum)} e ${String(range.maximum)} kg ` +
    `para ${speciesLabelFor(species)}`;

  if (parsedWeight === null) {
    return {
      valid: false,
      message:
        `Peso inválido: recebido ${describeRawValue(rawWeight)}, ${expectation}, ` +
        'com ponto decimal e não vírgula',
    };
  }

  if (parsedWeight < range.minimum || parsedWeight > range.maximum) {
    return {
      valid: false,
      message: `Peso inválido: recebido ${describeRawValue(rawWeight)}, ${expectation}`,
    };
  }

  return { valid: true, value: parsedWeight };
}
