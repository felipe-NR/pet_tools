import { CalculatorForm } from './CalculatorForm';
import { CalculationResult } from './CalculationResult';
import { useDailyPortionCalculator } from './useDailyPortionCalculator';
import { EMPTY_RESULT_MESSAGE, EMPTY_RESULT_TITLE } from '../copy/calculator';
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
      <aside className={styles.output} aria-live="polite">
        {result === null ? (
          <CalculationPreview />
        ) : (
          <CalculationResult
            result={result}
            species={species}
            profile={profile}
            rawWeight={rawWeight}
            rawEnergy={rawEnergy}
          />
        )}
      </aside>
    </section>
  );
}

function CalculationPreview(): React.JSX.Element {
  return (
    <div className={styles.preview}>
      <div className={styles.previewMark} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <h2>{EMPTY_RESULT_TITLE}</h2>
      <p>{EMPTY_RESULT_MESSAGE}</p>
    </div>
  );
}
