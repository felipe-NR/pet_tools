import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'node_modules'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // AGENTS.md > What not to do: never silence a type error with any, as
      // or @ts-ignore. And AGENTS.md > Code style: no function without a return type.
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
    },
  },
  {
    files: ['src/domain/**/*.ts'],
    rules: {
      // Two structural rules, checked rather than trusted.
      //
      // AGENTS.md > Structure: src/domain/ knows nothing about React or the
      // DOM, so the calculation engine is testable without rendering anything.
      //
      // ADR 0004: the domain never imports the copy layer either. It reports
      // violations as data and src/copy/ turns them into Portuguese, which is
      // what keeps the engine reusable by a CLI or an API.
      'no-restricted-imports': [
        'error',
        { patterns: ['react', 'react-dom', 'react/*', '**/copy/*', '../copy/*'] },
      ],
      'no-restricted-globals': [
        'error',
        'window',
        'document',
        'localStorage',
        'sessionStorage',
        'fetch',
        'navigator',
      ],
    },
  },
  reactHooks.configs.flat['recommended-latest'],
  reactRefresh.configs.vite,
  prettier,
);
