# pet_tools

A calculator that turns a pet's weight and the metabolizable energy printed on the food label into **grams per day**.

Labels give broad weight bands that ignore neutering and activity level. Doing the arithmetic properly needs a fractional exponent, which in practice rules out anyone unwilling to hunt down a scientific calculator. This tool does the arithmetic and shows the steps.

Adult dogs and cats. Runs entirely in the browser — no data is collected, transmitted or stored.

> The result is a population estimate. Use it as a starting point, not a prescription: weigh the portion, follow weight and body condition, and adjust with veterinary guidance.

## Language

Everything outside `docs/` is written in English: code, comments, tests, these files and commit messages.

`docs/` stays in Portuguese — it holds the nutritional domain, the PRD, the references and the ADRs, written against sources that are already Portuguese.

The product copy the user reads is Portuguese too, and lives in `src/copy/`. See [ADR 0004](./docs/adr/0004-ingles-no-codigo-copy-em-portugues.md).

## Status

The calculation engine and responsive single-screen interface are implemented. Automated tests cover all 15 acceptance criteria in the PRD, and `src/domain/` has 100% line and branch coverage.

Not configured yet: CI and static hosting.

## Commands

|command|what it does|
|-|-|
|`npm run dev`|starts the development server|
|`npm test`|runs the whole suite once, headless, with coverage|
|`npm run test:watch`|watch mode|
|`npm run lint`|ESLint plus type checking|
|`npm run build`|production build|

## Documentation

|file|contents|
|-|-|
|[AGENTS.md](./AGENTS.md)|code, testing and process rules. Starting point for any AI agent|
|[CLAUDE.md](./CLAUDE.md)|what is specific to Claude Code. Points at AGENTS.md|
|[docs/prd.md](./docs/prd.md)|scope, out of scope, acceptance criteria|
|[docs/dominio-nutricional.md](./docs/dominio-nutricional.md)|formulas, factors, validation, label pitfalls|
|[docs/referencias.md](./docs/referencias.md)|veterinary and process sources|
|[docs/adr/](./docs/adr/)|architecture and domain decisions|

## Stack

Vite + React + TypeScript, no backend. Rationale in [ADR 0001](./docs/adr/0001-stack-e-arquitetura.md).

## License

MIT. See [LICENSE](./LICENSE).
