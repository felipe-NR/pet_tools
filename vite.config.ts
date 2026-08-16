/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // AGENTS.md > Tests: every test runs headless, with no manual seeding and
    // no missing configuration. Tests sit next to the code they cover.
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/test/**', 'src/main.tsx'],
      // Thresholds from docs/prd.md > Pronto quando: domain above 90% of
      // lines, project above 80%. Branches come from AGENTS.md > Tests.
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
