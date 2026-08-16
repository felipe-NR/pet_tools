import { APP_TITLE, SHELL_NOTICE } from './copy/appShell';

/**
 * Application shell. The form and the result land in the UI branch, which
 * covers acceptance criteria 9 to 15 of docs/prd.md. This branch delivers the
 * scaffold and src/domain/.
 *
 * The visible text comes from src/copy/ — see ADR 0004.
 */
export function App(): React.JSX.Element {
  return (
    <main>
      <h1>{APP_TITLE}</h1>
      <p>{SHELL_NOTICE}</p>
    </main>
  );
}
