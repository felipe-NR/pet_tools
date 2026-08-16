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
      // AGENTS.md > O que nao fazer: nao silenciar erro de tipo com any, as
      // ou @ts-ignore. E AGENTS.md > Estilo: nada de funcao sem tipo de retorno.
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
    },
  },
  {
    files: ['src/domain/**/*.ts'],
    rules: {
      // AGENTS.md > Estrutura: src/domain/ nao conhece React nem DOM. A regra
      // existe para o motor de calculo ser testavel sem renderizar nada.
      'no-restricted-imports': ['error', { patterns: ['react', 'react-dom', 'react/*'] }],
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
