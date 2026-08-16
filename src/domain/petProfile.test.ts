import { describe, expect, it } from 'vitest';
import {
  isPetProfile,
  isSpecies,
  maintenanceEnergyFactorFor,
  requireProfile,
  requireSpecies,
  supportedProfilesFor,
} from './petProfile';

/**
 * The six factors come from docs/dominio-nutricional.md > Passo 2, confirmed
 * in the MSD/Merck Veterinary Manual and in Carlson's Table 1. This is the
 * only test file that spells them out.
 */
describe('maintenanceEnergyFactorFor', () => {
  it.each([
    ['dog', 'neutered', 1.6],
    ['dog', 'intact', 1.8],
    ['dog', 'obesityProne', 1.4],
    ['cat', 'neutered', 1.2],
    ['cat', 'intact', 1.4],
    ['cat', 'obesityProne', 1.0],
  ] as const)('returns the factor for %s / %s', (species, profile, expectedFactor) => {
    expect(maintenanceEnergyFactorFor(species, profile)).toBe(expectedFactor);
  });

  it('keeps factors apart per species: neutered is not worth the same for dog and cat', () => {
    expect(maintenanceEnergyFactorFor('dog', 'neutered')).not.toBe(
      maintenanceEnergyFactorFor('cat', 'neutered'),
    );
  });
});

describe('supportedProfilesFor', () => {
  // Acceptance criterion 8 of docs/prd.md: switching species keeps only the
  // profiles valid for that species selectable.
  it.each(['dog', 'cat'] as const)('lists the profiles supported by %s', (species) => {
    expect(supportedProfilesFor(species)).toEqual(['neutered', 'intact', 'obesityProne']);
  });

  it('never exposes a profile outside the table', () => {
    // Puppies, pregnant and lactating animals are out of scope by a decision
    // recorded in docs/prd.md > Fora de escopo.
    for (const species of ['dog', 'cat'] as const) {
      expect(supportedProfilesFor(species)).not.toContain('puppy');
      expect(supportedProfilesFor(species)).toHaveLength(3);
    }
  });
});

describe('isSpecies', () => {
  it.each(['dog', 'cat'])('accepts %p', (value) => {
    expect(isSpecies(value)).toBe(true);
  });

  it.each(['Dog', 'cachorro', '', null, undefined, 3, {}])('rejects %p', (value) => {
    expect(isSpecies(value)).toBe(false);
  });
});

describe('isPetProfile', () => {
  it.each(['neutered', 'intact', 'obesityProne'])('accepts %p', (value) => {
    expect(isPetProfile(value)).toBe(true);
  });

  it.each(['puppy', 'senior', 'pregnant', '', null, undefined, 1.4])('rejects %p', (value) => {
    expect(isPetProfile(value)).toBe(false);
  });
});

/**
 * The tables in this module are indexed by species and by profile. A value
 * that slipped past the type system would produce `TypeError: Cannot read
 * properties of undefined`, which tells nobody anything. These guards trade
 * that for a message that names the offending value.
 */
describe('requireSpecies', () => {
  it.each(['dog', 'cat'] as const)('returns %p untouched', (species) => {
    expect(requireSpecies(species)).toBe(species);
  });

  it.each(['ferret', 'Dog', 'cachorro', '', null, undefined, 3, {}])('throws for %p', (value) => {
    expect(() => requireSpecies(value)).toThrow(RangeError);
  });

  it('names the offending value and the accepted ones', () => {
    expect(() => requireSpecies('ferret')).toThrow(
      'Invalid species: received "ferret", expected "dog" or "cat"',
    );
  });
});

describe('requireProfile', () => {
  it.each(['neutered', 'intact', 'obesityProne'] as const)('returns %p untouched', (profile) => {
    expect(requireProfile(profile)).toBe(profile);
  });

  it.each(['puppy', 'pregnant', 'senior', '', null, undefined, 1.4])('throws for %p', (value) => {
    expect(() => requireProfile(value)).toThrow(RangeError);
  });

  it('names the offending value and the accepted ones', () => {
    expect(() => requireProfile('puppy')).toThrow(
      'Invalid profile: received "puppy", expected "neutered", "intact" or "obesityProne"',
    );
  });
});
