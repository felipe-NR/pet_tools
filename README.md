# pet_tools

Calculadora que converte o peso do pet e a energia metabolizável do rótulo da ração em **gramas por dia**.

O rótulo traz faixas de peso largas que ignoram castração e nível de atividade. Fazer a conta certa exige potência fracionária, o que na prática afasta quem não vai atrás de uma calculadora científica. Esta ferramenta faz a conta e mostra os passos.

Cães e gatos adultos. Roda inteiramente no navegador — nenhum dado é coletado, enviado ou armazenado.

> O resultado é estimativa populacional. Serve como ponto de partida, não como prescrição: pese a porção, acompanhe peso e condição corporal e ajuste com orientação veterinária.

## Estado

Em definição. Só a documentação existe — ainda não há código.

## Documentação

|arquivo|conteúdo|
|-|-|
|[AGENTS.md](./AGENTS.md)|regras de código, testes e processo. Ponto de partida para qualquer agente de IA|
|[CLAUDE.md](./CLAUDE.md)|o que é específico do Claude Code. Aponta para o AGENTS.md|
|[docs/prd.md](./docs/prd.md)|escopo, fora de escopo, critérios de aceite|
|[docs/dominio-nutricional.md](./docs/dominio-nutricional.md)|fórmulas, fatores, validações, armadilhas de rótulo|
|[docs/referencias.md](./docs/referencias.md)|fontes veterinárias e de processo|
|[docs/adr/](./docs/adr/)|decisões de arquitetura e de domínio|

## Stack

Vite + React + TypeScript, sem backend. Justificativa no [ADR 0001](./docs/adr/0001-stack-e-arquitetura.md).

## Licença

MIT. Ver [LICENSE](./LICENSE).
