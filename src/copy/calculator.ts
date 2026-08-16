import type { PetProfile, Species } from '../domain/petProfile';

export { APP_TITLE } from './appShell';

export const APP_EYEBROW = 'Nutrição cotidiana para cães e gatos';
export const APP_SUBTITLE =
  'Calcule uma porção diária inicial a partir do peso ideal e da energia da ração.';

export const OUT_OF_SCOPE_NOTICE =
  'Esta calculadora atende apenas cães e gatos adultos saudáveis. Filhotes, gestantes, lactantes e animais doentes precisam de orientação médico-veterinária e não devem usar este cálculo.';

export const OVERWEIGHT_GUIDANCE =
  'Se o animal está visivelmente acima do peso, procure um médico-veterinário antes de restringir a alimentação. Em gatos, a restrição calórica sem supervisão aumenta o risco de lipidose hepática.';

export const FORM_TITLE = 'Dados para o cálculo';
export const SPECIES_FIELD_LABEL = 'Espécie';
export const IDEAL_WEIGHT_FIELD_LABEL = 'Peso ideal (kg)';
export const IDEAL_WEIGHT_HELP =
  'Use o peso ideal definido com o médico-veterinário, não uma estimativa feita em casa.';
export const PROFILE_FIELD_LABEL = 'Perfil do animal';
export const PROFILE_GUIDANCE =
  'Propenso à obesidade descreve o animal que está no peso saudável, mas tende a engordar; não é um perfil de emagrecimento. Para animal idoso, escolha esse perfil.';
export const ENERGY_FIELD_LABEL = 'Energia metabolizável da ração (kcal/kg)';
export const ENERGY_FIELD_HELP =
  'Procure a energia metabolizável em uma nota do rótulo, não nos níveis de garantia. Se estiver em kcal/100 g, multiplique por 10. Sem esse valor, não calcule por estimativa.';
export const FORM_SUBMIT_LABEL = 'Calcular porção diária';

export const RESULT_TITLE = 'Porção diária estimada';
export const DAILY_PORTION_LABEL = 'Quantidade de ração';
export const DAILY_CALORIES_LABEL = 'Energia diária (MER)';
export const CALCULATION_STEPS_TITLE = 'Como chegamos ao resultado';
export const ESTIMATE_NOTICE =
  'Este resultado é uma estimativa inicial e não substitui avaliação veterinária.';
export const IDEAL_WEIGHT_DIRECTION =
  'Servir esta quantidade tende a levar o animal em direção ao peso ideal informado.';
export const FOLLOW_UP_GUIDANCE =
  'Pese a porção em balança de cozinha, acompanhe o peso e a condição corporal por 2 a 4 semanas e ajuste somente com orientação veterinária.';
export const ATYPICAL_ENERGY_NOTICE =
  'A energia informada é atípica para ração seca. O cálculo foi feito, mas confira o valor e a unidade no rótulo.';

const SPECIES_OPTION_LABELS: Readonly<Record<Species, string>> = {
  dog: 'Cão',
  cat: 'Gato',
};

const PROFILE_LABELS: Readonly<Record<PetProfile, string>> = {
  neutered: 'Castrado',
  intact: 'Inteiro (não castrado)',
  obesityProne: 'Propenso à obesidade',
};

/** Portuguese option label for a species from the domain. */
export function speciesOptionLabelFor(species: Species): string {
  return SPECIES_OPTION_LABELS[species];
}

/** Portuguese option label for a supported adult profile. */
export function profileLabelFor(profile: PetProfile): string {
  return PROFILE_LABELS[profile];
}

/** Whole-gram value displayed only after the domain calculation is complete. */
export function formatDailyPortion(gramsPerDay: number): string {
  return `${String(gramsPerDay)} g/dia`;
}

/** Whole-calorie MER value displayed only after the domain calculation is complete. */
export function formatDailyCalories(caloriesPerDay: number): string {
  return `${String(caloriesPerDay)} kcal/dia`;
}

/**
 * First calculation step. The equation is fixed by ADR 0002 and repeated here
 * only because the PRD requires the user to see the formula used.
 */
export function formatRestingEnergyStep(rawWeight: string, rer: number): string {
  return `RER = 70 × ${rawWeight}^0,75 = ${formatPortugueseNumber(rer)} kcal/dia`;
}

/** Second calculation step, with the factor read from the domain table. */
export function formatMaintenanceEnergyStep(rer: number, factor: number, mer: number): string {
  return (
    `MER = ${formatPortugueseNumber(rer)} × ${formatPortugueseNumber(factor)} = ` +
    `${formatPortugueseNumber(mer)} kcal/dia`
  );
}

/** Third calculation step, converting the label's kcal/kg into kcal/g. */
export function formatPortionStep(mer: number, rawEnergy: string, roundedGrams: number): string {
  return (
    `Porção = ${formatPortugueseNumber(mer)} ÷ (${rawEnergy} ÷ 1.000) = ` +
    `${String(roundedGrams)} g/dia`
  );
}

function formatPortugueseNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(value);
}
