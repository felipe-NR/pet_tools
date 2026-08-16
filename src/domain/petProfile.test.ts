import { describe, expect, it } from 'vitest';
import {
  isPetProfile,
  isSpecies,
  maintenanceEnergyFactorFor,
  requireProfile,
  requireSpecies,
  speciesLabelFor,
  supportedProfilesFor,
} from './petProfile';

/**
 * Os seis fatores vêm de docs/dominio-nutricional.md > Passo 2, confirmados no
 * MSD/Merck Veterinary Manual. Este é o único arquivo de teste que os cita.
 */
describe('maintenanceEnergyFactorFor', () => {
  it.each([
    ['dog', 'neutered', 1.6],
    ['dog', 'intact', 1.8],
    ['dog', 'obesityProne', 1.4],
    ['cat', 'neutered', 1.2],
    ['cat', 'intact', 1.4],
    ['cat', 'obesityProne', 1.0],
  ] as const)('devolve o fator de %s / %s', (species, profile, expectedFactor) => {
    expect(maintenanceEnergyFactorFor(species, profile)).toBe(expectedFactor);
  });

  it('separa os fatores por espécie: castrado não vale o mesmo para cão e gato', () => {
    expect(maintenanceEnergyFactorFor('dog', 'neutered')).not.toBe(
      maintenanceEnergyFactorFor('cat', 'neutered'),
    );
  });
});

describe('supportedProfilesFor', () => {
  // Critério 8 de docs/prd.md: trocar de espécie mantém apenas os perfis
  // válidos daquela espécie selecionáveis.
  it.each(['dog', 'cat'] as const)('lista os perfis suportados de %s', (species) => {
    expect(supportedProfilesFor(species)).toEqual(['neutered', 'intact', 'obesityProne']);
  });

  it('não expõe perfil fora da tabela', () => {
    // Filhote, gestante, lactante e doente estão fora de escopo por decisão
    // registrada em docs/prd.md > Fora de escopo.
    for (const species of ['dog', 'cat'] as const) {
      expect(supportedProfilesFor(species)).not.toContain('puppy');
      expect(supportedProfilesFor(species)).toHaveLength(3);
    }
  });
});

describe('isSpecies', () => {
  it.each(['dog', 'cat'])('aceita %p', (value) => {
    expect(isSpecies(value)).toBe(true);
  });

  it.each(['Dog', 'cachorro', '', null, undefined, 3, {}])('rejeita %p', (value) => {
    expect(isSpecies(value)).toBe(false);
  });
});

describe('isPetProfile', () => {
  it.each(['neutered', 'intact', 'obesityProne'])('aceita %p', (value) => {
    expect(isPetProfile(value)).toBe(true);
  });

  it.each(['puppy', 'senior', 'pregnant', '', null, undefined, 1.4])('rejeita %p', (value) => {
    expect(isPetProfile(value)).toBe(false);
  });
});

describe('speciesLabelFor', () => {
  it('devolve o rótulo em português usado nas mensagens de erro', () => {
    expect(speciesLabelFor('dog')).toBe('cão');
    expect(speciesLabelFor('cat')).toBe('gato');
  });
});

/**
 * As tabelas deste módulo são indexadas por espécie e por perfil. Um valor que
 * burlou o tipo produziria `TypeError: Cannot read properties of undefined`,
 * que não diz nada a quem lê o log. Estas guardas trocam isso pela mensagem
 * que AGENTS.md > Estilo de código exige.
 */
describe('requireSpecies', () => {
  it.each(['dog', 'cat'] as const)('devolve %p intacto', (species) => {
    expect(requireSpecies(species)).toBe(species);
  });

  it.each(['ferret', 'Dog', 'cachorro', '', null, undefined, 3, {}])('lança para %p', (value) => {
    expect(() => requireSpecies(value)).toThrow(RangeError);
  });

  it('cita o valor ofensivo e os valores esperados', () => {
    expect(() => requireSpecies('ferret')).toThrow(
      'Espécie inválida: recebido "ferret", esperado "dog" ou "cat"',
    );
  });
});

describe('requireProfile', () => {
  it.each(['neutered', 'intact', 'obesityProne'] as const)('devolve %p intacto', (profile) => {
    expect(requireProfile(profile)).toBe(profile);
  });

  it.each(['puppy', 'pregnant', 'senior', '', null, undefined, 1.4])('lança para %p', (value) => {
    expect(() => requireProfile(value)).toThrow(RangeError);
  });

  it('cita o valor ofensivo e os valores esperados', () => {
    expect(() => requireProfile('puppy')).toThrow(
      'Perfil inválido: recebido "puppy", esperado "neutered", "intact" ou "obesityProne"',
    );
  });
});
