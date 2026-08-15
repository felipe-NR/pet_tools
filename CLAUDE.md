# CLAUDE.md

**As regras deste repositório estão em [AGENTS.md](./AGENTS.md). Leia esse arquivo antes de editar qualquer coisa.**

Este arquivo existe só para o que é específico do Claude Code. Ele não repete nada do AGENTS.md — se houver conflito, AGENTS.md vence.

## Ordem de leitura

1. `AGENTS.md` — sempre
2. `docs/dominio-nutricional.md` — antes de tocar em `src/domain/`
3. `docs/adr/` — antes de propor mudança de stack, arquitetura ou fórmula

## Específico do Claude Code

- **Plan mode antes de implementar.** Qualquer tarefa que passe de ~3 arquivos ou envolva decisão de arquitetura entra em plan mode primeiro. Aprovação humana antes do código.
- **Subagentes** para busca ampla e leitura exploratória. A implementação e as decisões de domínio ficam na sessão principal, com o contexto completo.
- **Não rode `git commit` nem `git push` sem pedido explícito.**
- Ao editar um arquivo de domínio, cite a fonte no comentário e o ADR correspondente. Ver "Comentários" no AGENTS.md.
- Se um comando de `AGENTS.md > Comandos` não existir ainda, diga isso em vez de inventar um substituto.

## Ao terminar uma tarefa

Rode `npm run lint && npm test && npm run build` e reporte o resultado real, incluindo falhas. Não declare pronto o que não passou.

## Manutenção deste contexto

Quando uma decisão nova sobreviver à sessão, registre no lugar certo em vez de deixar no histórico do chat:

|tipo de conhecimento|onde vai|
|-|-|
|regra de código ou de processo|`AGENTS.md`|
|fórmula, fator, faixa de validação|`docs/dominio-nutricional.md`|
|escolha entre alternativas|`docs/adr/NNNN-titulo.md`|
|escopo, critério de aceite|`docs/prd.md`|
