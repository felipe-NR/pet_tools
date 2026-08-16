import {
  APP_EYEBROW,
  APP_SUBTITLE,
  APP_TITLE,
  OUT_OF_SCOPE_NOTICE,
  OVERWEIGHT_GUIDANCE,
} from './copy/calculator';
import { DailyPortionCalculator } from './components/DailyPortionCalculator';
import styles from './App.module.css';

/** Single-screen application shell for the daily portion calculator. */
export function App(): React.JSX.Element {
  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>{APP_EYEBROW}</p>
        <h1>{APP_TITLE}</h1>
        <p className={styles.subtitle}>{APP_SUBTITLE}</p>
      </header>
      <aside className={styles.scope}>
        <p>{OUT_OF_SCOPE_NOTICE}</p>
        <p>{OVERWEIGHT_GUIDANCE}</p>
      </aside>
      <DailyPortionCalculator />
    </main>
  );
}
