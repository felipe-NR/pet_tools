# CLAUDE.md

**This repository's rules live in [AGENTS.md](./AGENTS.md). Read that file before editing anything.**

This file exists only for what is specific to Claude Code. It repeats nothing from AGENTS.md — if the two conflict, AGENTS.md wins.

## Reading order

1. `AGENTS.md` — always
2. `docs/dominio-nutricional.md` — before touching `src/domain/`
3. `docs/adr/` — before proposing a change to stack, architecture or formula

## Language

English everywhere except `docs/`, `src/copy/` and `index.html`. That includes commit messages. See `AGENTS.md > Language` and ADR 0004.

## Specific to Claude Code

- **Plan mode before implementing.** Any task touching more than ~3 files or involving an architectural decision goes through plan mode first. Human approval before code.
- **Subagents** for broad search and exploratory reading. Implementation and domain decisions stay in the main session, with full context.
- **Do not run `git commit` or `git push` without an explicit request.**
- When editing a domain file, cite the source in the comment and the matching ADR. See "Comments" in AGENTS.md.
- If a command from `AGENTS.md > Commands` does not exist yet, say so instead of inventing a substitute.

## When finishing a task

Run `npm run lint && npm test && npm run build` and report the real result, failures included. Do not declare done what did not pass.

## Maintaining this context

When a new decision survives a session, record it in the right place instead of leaving it in chat history:

|kind of knowledge|where it goes|
|-|-|
|code or process rule|`AGENTS.md`|
|formula, factor, validation range|`docs/dominio-nutricional.md`|
|choice between alternatives|`docs/adr/NNNN-titulo.md`|
|scope, acceptance criterion|`docs/prd.md`|
|Portuguese text the user reads|`src/copy/`|

ADR filenames stay in Portuguese, matching the rest of `docs/`.

## Long-term memory (ai-memory)

The ai-memory routing block lives **only in `AGENTS.md`**, between `<!-- ai-memory:start -->` and `<!-- ai-memory:end -->`. Do not duplicate it here: this repository treats `AGENTS.md` as the canonical file, and the reading order above means you will read it anyway.

When refreshing the block, name the target explicitly:

```
ai-memory install-instructions --target AGENTS.md --no-skills
```

Without `--target`, the CLI detects both files and reinstalls the block into `CLAUDE.md` too, undoing that decision. The ai-memory skills are installed globally under `~/.claude/skills/`, hence `--no-skills`.
