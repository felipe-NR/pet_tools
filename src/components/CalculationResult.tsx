import {
  ATYPICAL_ENERGY_NOTICE,
  CALCULATION_STEPS_TITLE,
  DAILY_CALORIES_LABEL,
  DAILY_PORTION_LABEL,
  ESTIMATE_NOTICE,
  FOLLOW_UP_GUIDANCE,
  formatDailyCalories,
  formatDailyPortion,
  formatMaintenanceEnergyStep,
  formatPortionStep,
  formatRestingEnergyStep,
  IDEAL_WEIGHT_DIRECTION,
  RESULT_TITLE,
} from '../copy/calculator';
import { roundToWholeNumber, type DailyPortionResult } from '../domain/dailyPortion';
import { maintenanceEnergyFactorFor, type PetProfile, type Species } from '../domain/petProfile';
import styles from './CalculationResult.module.css';

interface CalculationResultProperties {
  readonly result: DailyPortionResult;
  readonly species: Species;
  readonly profile: PetProfile;
  readonly rawWeight: string;
  readonly rawEnergy: string;
}

/** Displays the rounded answer, its formula trail, and adjacent clinical limit. */
export function CalculationResult(properties: CalculationResultProperties): React.JSX.Element {
  const roundedMer = roundToWholeNumber(properties.result.maintenanceEnergyRequirementKcal);
  const roundedGrams = roundToWholeNumber(properties.result.gramsPerDay);

  return (
    <section className={styles.result} role="region" aria-labelledby="calculation-result-title">
      <h2 id="calculation-result-title">{RESULT_TITLE}</h2>
      <dl className={styles.summary}>
        <div>
          <dt>{DAILY_PORTION_LABEL}</dt>
          <dd>{formatDailyPortion(roundedGrams)}</dd>
        </div>
        <div>
          <dt>{DAILY_CALORIES_LABEL}</dt>
          <dd>{formatDailyCalories(roundedMer)}</dd>
        </div>
      </dl>
      {properties.result.metabolizableEnergyIsAtypical ? (
        <p className={styles.warning}>{ATYPICAL_ENERGY_NOTICE}</p>
      ) : null}
      {calculationSteps({ ...properties, roundedGrams })}
      <div className={styles.clinical}>
        <p>{ESTIMATE_NOTICE}</p>
        <p>{IDEAL_WEIGHT_DIRECTION}</p>
        <p>{FOLLOW_UP_GUIDANCE}</p>
      </div>
    </section>
  );
}

interface CalculationStepsProperties extends CalculationResultProperties {
  readonly roundedGrams: number;
}

function calculationSteps(properties: CalculationStepsProperties): React.JSX.Element {
  const factor = maintenanceEnergyFactorFor(properties.species, properties.profile);
  return (
    <div className={styles.steps}>
      <h3>{CALCULATION_STEPS_TITLE}</h3>
      <ol>
        <li>
          {formatRestingEnergyStep(
            properties.rawWeight,
            properties.result.restingEnergyRequirementKcal,
          )}
        </li>
        <li>
          {formatMaintenanceEnergyStep(
            properties.result.restingEnergyRequirementKcal,
            factor,
            properties.result.maintenanceEnergyRequirementKcal,
          )}
        </li>
        <li>
          {formatPortionStep(
            properties.result.maintenanceEnergyRequirementKcal,
            properties.rawEnergy,
            properties.roundedGrams,
          )}
        </li>
      </ol>
    </div>
  );
}
