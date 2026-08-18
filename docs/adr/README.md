# ADRs — decisões de arquitetura

Uma decisão por arquivo, numeração sequencial, nome em kebab-case: `NNNN-titulo-curto.md`.

Registre aqui toda escolha entre alternativas que o código sozinho não explica — stack, fórmula, limite, o que ficou de fora. O objetivo é impedir que uma sessão futura "corrija" uma decisão deliberada por não saber que ela foi deliberada.

ADR não se edita depois de aceito. Mudou de ideia? Novo ADR com status `Substitui NNNN`, e o antigo ganha `Substituído por NNNN`.

Seções: Status, Data, Contexto, Decisão, Alternativas descartadas, Consequências, Revisitar quando.

|nº|decisão|status|
|-|-|-|
|[0001](./0001-stack-e-arquitetura.md)|Vite + React + TypeScript, aplicação sem backend|Aceito|
|[0002](./0002-equacao-energetica-rer-mer.md)|`RER = 70 × kg^0.75` com fatores de MER por perfil|Aceito|
|[0003](./0003-peso-ideal-e-perfis-suportados.md)|Peso informado é o peso ideal; perda de peso, trabalho e idoso ficam de fora|Aceito|
|[0004](./0004-ingles-no-codigo-copy-em-portugues.md)|Inglês fora de `docs/`; copy do produto em português, isolada em `src/copy/`|Aceito|
|[0005](./0005-github-actions-e-github-pages.md)|GitHub Actions para CI e GitHub Pages para hospedagem|Aceito|
|[0006](./0006-entrada-numerica-em-pt-br.md)|Entrada numérica em pt-BR: vírgula decimal e ponto de milhar|Aceito|
