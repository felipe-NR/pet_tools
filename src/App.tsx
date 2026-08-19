import { APP_EYEBROW, OUT_OF_SCOPE_NOTICE, OVERWEIGHT_GUIDANCE } from './copy/calculator';
import { DailyPortionCalculator } from './components/DailyPortionCalculator';
import styles from './App.module.css';

/** Single-screen application shell for the daily portion calculator. */
export function App(): React.JSX.Element {
  return (
    <main className={styles.page}>
      <div className={styles.calculationArea}>
        <DailyPortionCalculator />
        <aside className={styles.scope} aria-label={APP_EYEBROW}>
          <p>{OUT_OF_SCOPE_NOTICE}</p>
          <p>{OVERWEIGHT_GUIDANCE}</p>
        </aside>
      </div>
    </main>
  );
}
