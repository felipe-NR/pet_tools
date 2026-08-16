import { CalculatorForm } from './CalculatorForm';
import { CalculationResult } from './CalculationResult';
import { useDailyPortionCalculator } from './useDailyPortionCalculator';
import styles from './DailyPortionCalculator.module.css';

/** Connects the form state to the domain result without network or persistence. */
export function DailyPortionCalculator(): React.JSX.Element {
  const calculator = useDailyPortionCalculator();
  const { result, species, profile, rawWeight, rawEnergy, ...formProperties } = calculator;

  return (
    <section className={styles.workspace}>
      <CalculatorForm
        species={species}
        profile={profile}
        rawWeight={rawWeight}
        rawEnergy={rawEnergy}
        {...formProperties}
      />
      {result === null ? null : (
        <CalculationResult
          result={result}
          species={species}
          profile={profile}
          rawWeight={rawWeight}
          rawEnergy={rawEnergy}
        />
      )}
    </section>
  );
}
