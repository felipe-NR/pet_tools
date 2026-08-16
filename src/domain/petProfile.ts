import { describeRawValue } from './fieldValidation';

/**
 * Espécies e perfis suportados, e o fator de manutenção de cada combinação.
 *
 * Esta é a fonte única dos seis fatores dentro do código. Nenhum componente,
 * teste ou texto de UI pode repetir esses números — ver AGENTS.md > Domínio.
 */

/** Valores aceitos em docs/dominio-nutricional.md > Validação de entrada. */
export type Species = 'dog' | 'cat';

/**
 * Os três perfis de adulto suportados no MVP. Filhote, gestante, lactante,
 * idoso e animal doente **não** são perfis: estão fora de escopo por decisão
 * registrada em docs/prd.md, e a aplicação avisa em vez de calcular.
 */
export type PetProfile = 'neutered' | 'intact' | 'obesityProne';

/**
 * Fatores de MER = RER × fator, de docs/dominio-nutricional.md > Passo 2,
 * confirmados no MSD/Merck Veterinary Manual. Ver ADR 0002.
 *
 * O material que originou o projeto trazia "propenso à obesidade / idoso: 1.4".
 * O MSD confirma 1.4 para propenso à obesidade mas não define fator para
 * geriátrico, então a fusão dos dois não foi adotada.
 */
type MaintenanceEnergyFactorTable = Readonly<Record<Species, Readonly<Record<PetProfile, number>>>>;

const MAINTENANCE_ENERGY_FACTORS: MaintenanceEnergyFactorTable = {
  dog: { neutered: 1.6, intact: 1.8, obesityProne: 1.4 },
  cat: { neutered: 1.2, intact: 1.4, obesityProne: 1.0 },
};

/** Ordem de exibição dos perfis. Fixa, para a UI não depender de Object.keys. */
const PROFILE_DISPLAY_ORDER: readonly PetProfile[] = ['neutered', 'intact', 'obesityProne'];

const SPECIES_LABELS: Readonly<Record<Species, string>> = {
  dog: 'cão',
  cat: 'gato',
};

/**
 * Devolve o fator de manutenção da combinação espécie + perfil.
 *
 * @example
 * maintenanceEnergyFactorFor('dog', 'neutered'); // 1.6
 */
export function maintenanceEnergyFactorFor(species: Species, profile: PetProfile): number {
  return MAINTENANCE_ENERGY_FACTORS[requireSpecies(species)][requireProfile(profile)];
}

/**
 * Perfis selecionáveis para uma espécie, na ordem de exibição.
 *
 * Hoje as duas espécies suportam **os mesmos três perfis**, e o tipo da tabela
 * obriga isso: tirar um perfil de uma espécie é erro de compilação, não lista
 * mais curta. A função existe mesmo assim para a UI perguntar em vez de
 * embutir a lista, de modo que o critério 8 de docs/prd.md tenha um lugar só
 * para mudar se a tabela deixar de ser simétrica.
 *
 * @example
 * supportedProfilesFor('cat'); // ['neutered', 'intact', 'obesityProne']
 */
export function supportedProfilesFor(species: Species): readonly PetProfile[] {
  requireSpecies(species);
  return PROFILE_DISPLAY_ORDER;
}

/** Narrowing de valor vindo do formulário, onde o tipo é realmente desconhecido. */
export function isSpecies(value: unknown): value is Species {
  return value === 'dog' || value === 'cat';
}

/** Idem para o perfil. Qualquer valor fora da tabela é rejeitado. */
export function isPetProfile(value: unknown): value is PetProfile {
  return PROFILE_DISPLAY_ORDER.some((profile) => profile === value);
}

/** Rótulo em português da espécie, usado nas mensagens de validação. */
export function speciesLabelFor(species: Species): string {
  return SPECIES_LABELS[requireSpecies(species)];
}

/**
 * Exige que o valor seja uma espécie suportada, ou lança.
 *
 * As tabelas deste módulo são indexadas por espécie e por perfil. Sem esta
 * guarda, um valor que burlou o tipo — vindo de URL, de estado restaurado ou
 * de um consumidor futuro do domínio em CLI ou API — produziria
 * `TypeError: Cannot read properties of undefined`, que não diz nada a
 * ninguém. Com ela, produz a mensagem que AGENTS.md > Estilo de código exige.
 *
 * @example
 * requireSpecies('dog');    // 'dog'
 * requireSpecies('ferret'); // lança RangeError
 */
export function requireSpecies(value: unknown): Species {
  if (!isSpecies(value)) {
    throw new RangeError(
      `Espécie inválida: recebido ${describeRawValue(value)}, esperado "dog" ou "cat"`,
    );
  }

  return value;
}

/** Idem para o perfil. Ver `requireSpecies` para o porquê. */
export function requireProfile(value: unknown): PetProfile {
  if (!isPetProfile(value)) {
    throw new RangeError(
      `Perfil inválido: recebido ${describeRawValue(value)}, ` +
        'esperado "neutered", "intact" ou "obesityProne"',
    );
  }

  return value;
}
