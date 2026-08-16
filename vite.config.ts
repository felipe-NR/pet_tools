/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // AGENTS.md > Testes: todo teste roda headless, sem seed manual e sem
    // configuracao ausente. Os testes ficam ao lado do codigo.
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/test/**', 'src/main.tsx'],
      // Limiares de docs/prd.md > Pronto quando: dominio acima de 90% de
      // linhas, projeto acima de 80%. Branches vem de AGENTS.md > Testes.
      thresholds: {
        lines: 80,
        branches: 70,
        'src/domain/**': {
          lines: 90,
          branches: 90,
        },
      },
    },
  },
});
