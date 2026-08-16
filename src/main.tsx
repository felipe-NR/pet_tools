import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App.tsx';

const rootElement = document.getElementById('root');

// AGENTS.md > O que nao fazer: nada de `!` para calar o compilador. Se o
// elemento sumir do index.html, a mensagem diz o que faltou.
if (rootElement === null) {
  throw new Error('Elemento raiz nao encontrado: esperado <div id="root"> em index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
