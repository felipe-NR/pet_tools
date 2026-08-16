import { maintenanceEnergyFactorFor } from './petProfile';
import type { PetProfile, Species } from './petProfile';

/**
 * Passo 2 de docs/dominio-nutricional.md: MER, as calorias diárias que mantêm
 * o peso atual. A literatura também chama de DER e NEM; o código usa MER em
 * todo lugar.
 *
 * Os fatores não moram aqui — moram em `petProfile.ts`, que é a fonte única.
 */

/**
 * Calcula o MER em kcal: `MER = RER × fator do perfil`.
 *
 * Recebe o RER pronto em vez do peso para que a composição dos três passos
 * fique visível em `dailyPortion.ts`, e para que o valor intermediário possa
 * ser exibido na tela sem ser recalculado.
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
      `RER inválido para o cálculo de MER: recebido ${String(restingEnergyRequirementKcal)}, ` +
        'esperado número positivo em kcal',
    );
  }

  return restingEnergyRequirementKcal * maintenanceEnergyFactorFor(species, profile);
}
