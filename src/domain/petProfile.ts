import { describeRawValue } from './fieldValidation';

/**
 * Supported species and profiles, and the maintenance factor of every
 * combination.
 *
 * This is the single source of the six factors inside the code. No component,
 * test or interface text may repeat these numbers — see AGENTS.md > Domain.
 *
 * Portuguese labels do not live here. They are product copy and belong to
 * `src/copy/`, per ADR 0004.
 */

/** Values accepted in docs/dominio-nutricional.md > Validação de entrada. */
export type Species = 'dog' | 'cat';

/**
 * The three adult profiles supported by the MVP. Puppies, pregnant, lactating,
 * senior and sick animals are **not** profiles: they are out of scope by a
 * decision recorded in docs/prd.md, and the app warns instead of calculating.
 */
export type PetProfile = 'neutered' | 'intact' | 'obesityProne';

type MaintenanceEnergyFactorTable = Readonly<Record<Species, Readonly<Record<PetProfile, number>>>>;

/**
 * MER = RER × factor, from docs/dominio-nutricional.md > Passo 2. Confirmed in
 * two independent sources with identical values: the MSD/Merck Veterinary
 * Manual and Carlson's Table 1, which cites Small Animal Clinical Nutrition,
 * 5th ed. See ADR 0002 and ADR 0003.
 *
 * In the MSD these rows sit under "Healthy adult dogs" and "Healthy adult
 * cats": obesity prone describes a **healthy** animal that tends to gain
 * weight, not one already above its ideal weight.
 */
const MAINTENANCE_ENERGY_FACTORS: MaintenanceEnergyFactorTable = {
  dog: { neutered: 1.6, intact: 1.8, obesityProne: 1.4 },
  cat: { neutered: 1.2, intact: 1.4, obesityProne: 1.0 },
};

/** Display order of the profiles. Fixed, so the UI never depends on Object.keys. */
const PROFILE_DISPLAY_ORDER: readonly PetProfile[] = ['neutered', 'intact', 'obesityProne'];

/**
 * Returns the maintenance factor for a species and profile pair.
 *
 * @example
 * maintenanceEnergyFactorFor('dog', 'neutered'); // 1.6
 */
export function maintenanceEnergyFactorFor(species: Species, profile: PetProfile): number {
  return MAINTENANCE_ENERGY_FACTORS[requireSpecies(species)][requireProfile(profile)];
}

/**
 * Profiles selectable for a species, in display order.
 *
 * Both species support **the same three profiles** today, and the table type
 * enforces it: removing a profile from one species is a compile error, not a
 * shorter list. The function exists anyway so the UI asks instead of hardcoding
 * the list, giving acceptance criterion 8 of docs/prd.md a single place to
 * change if the table ever stops being symmetric.
 *
 * @example
 * supportedProfilesFor('cat'); // ['neutered', 'intact', 'obesityProne']
 */
export function supportedProfilesFor(species: Species): readonly PetProfile[] {
  requireSpecies(species);
  return PROFILE_DISPLAY_ORDER;
}

/** Narrows a value coming from the form, where the type is genuinely unknown. */
export function isSpecies(value: unknown): value is Species {
  return value === 'dog' || value === 'cat';
}

/** Same for the profile. Any value outside the table is rejected. */
export function isPetProfile(value: unknown): value is PetProfile {
  return PROFILE_DISPLAY_ORDER.some((profile) => profile === value);
}

/**
 * Requires the value to be a supported species, or throws.
 *
 * The tables in this module are indexed by species and by profile. Without
 * this guard, a value that slipped past the type system — from a URL, from
 * restored state, or from a future CLI or API consumer of the domain — would
 * produce `TypeError: Cannot read properties of undefined`, which tells nobody
 * anything. With it, the message names the offending value.
 *
 * The text is English on purpose: this is a broken-contract exception a
 * developer reads in a log, not a message the user sees. See ADR 0004.
 *
 * @example
 * requireSpecies('dog');    // 'dog'
 * requireSpecies('ferret'); // throws RangeError
 */
export function requireSpecies(value: unknown): Species {
  if (!isSpecies(value)) {
    throw new RangeError(
      `Invalid species: received ${describeRawValue(value)}, expected "dog" or "cat"`,
    );
  }

  return value;
}

/** Same for the profile. See `requireSpecies` for the rationale. */
export function requireProfile(value: unknown): PetProfile {
  if (!isPetProfile(value)) {
    throw new RangeError(
      `Invalid profile: received ${describeRawValue(value)}, ` +
        'expected "neutered", "intact" or "obesityProne"',
    );
  }

  return value;
}
