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

## Memória de longo prazo (ai-memory)

O bloco de roteamento do ai-memory fica **só no `AGENTS.md`**, entre `<!-- ai-memory:start -->` e `<!-- ai-memory:end -->`. Não duplique aqui: este repositório trata o `AGENTS.md` como arquivo canônico, e você já vai lê-lo por causa da ordem de leitura acima.

Ao refrescar o bloco, direcione o alvo explicitamente:

```
ai-memory install-instructions --target AGENTS.md --no-skills
```

Sem `--target`, o CLI detecta os dois arquivos e reinstala o bloco no `CLAUDE.md` também, desfazendo essa decisão. As skills do ai-memory estão instaladas globalmente em `~/.claude/skills/`, por isso o `--no-skills`.
