import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App.tsx';

const rootElement = document.getElementById('root');

// AGENTS.md > What not to do: no `!` to silence the compiler. If the element
// ever disappears from index.html, the message says what was missing.
if (rootElement === null) {
  throw new Error('Root element not found: expected <div id="root"> in index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
