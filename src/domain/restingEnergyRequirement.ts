/**
 * Passo 1 de docs/dominio-nutricional.md: RER, as calorias gastas em repouso
 * absoluto, termoneutralidade e jejum.
 *
 * Fonte dos números: docs/dominio-nutricional.md > Passo 1. A escolha da
 * família de equações está no ADR 0002 e não muda sem ADR novo.
 */

/**
 * RER = 70 × peso^0.75. Vale para cães e gatos, qualquer peso, qualquer porte.
 *
 * A variante linear da literatura, `RER = 30 × kg + 70`, não é usada: ela vale
 * só de 2 a 45 kg e diverge ~6% da exponencial em 10 kg (370 contra 393,64),
 * então misturar as duas produziria resultados inconsistentes. Ver ADR 0002.
 */
const RESTING_ENERGY_COEFFICIENT = 70;
const RESTING_ENERGY_EXPONENT = 0.75;

/**
 * Calcula o RER em kcal a partir do peso em quilogramas.
 *
 * O resultado sai com precisão total de ponto flutuante. Arredondar aqui
 * quebraria o determinismo dos testes — ver `roundToWholeNumber` em
 * `dailyPortion.ts`, que é o único ponto de arredondamento.
 *
 * @example
 * calculateRestingEnergyRequirement(10); // 393.638927...
 */
export function calculateRestingEnergyRequirement(weightInKilograms: number): number {
  if (!Number.isFinite(weightInKilograms) || weightInKilograms <= 0) {
    throw new RangeError(
      `Peso inválido para o cálculo de RER: recebido ${String(weightInKilograms)}, ` +
        'esperado número positivo em kg',
    );
  }

  return RESTING_ENERGY_COEFFICIENT * weightInKilograms ** RESTING_ENERGY_EXPONENT;
}
