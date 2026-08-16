import { maintenanceEnergyFactorFor } from './petProfile';
import type { PetProfile, Species } from './petProfile';

/**
 * Step 2 of docs/dominio-nutricional.md: MER, the daily calories that keep the
 * current weight. The literature also calls it DER and NEM; the code says MER
 * everywhere.
 *
 * The factors do not live here — they live in `petProfile.ts`, the single
 * source.
 */

/**
 * Calculates the MER in kcal: `MER = RER × profile factor`.
 *
 * Takes the RER already computed rather than the weight so that the
 * composition of the three steps stays visible in `dailyPortion.ts`, and so
 * the intermediate value can reach the screen without being recomputed.
 *
 * @example
 * calculateMaintenanceEnergyRequirement(393.638927, 'dog', 'neutered');
 * // 629.822284...
 */
export function calculateMaintenanceEnergyRequirement(
  restingEnergyRequirementKcal: number,
  species: Species,
  profile: PetProfile,
): number {
  if (!Number.isFinite(restingEnergyRequirementKcal) || restingEnergyRequirementKcal <= 0) {
    throw new RangeError(
      `Invalid RER for the MER calculation: received ${String(restingEnergyRequirementKcal)}, ` +
        'expected a positive number in kcal',
    );
  }

  return restingEnergyRequirementKcal * maintenanceEnergyFactorFor(species, profile);
}
