# ADR 0001 — Vite + React + TypeScript, aplicação sem backend

**Status:** Aceito
**Data:** 2026-08-15

## Contexto

Repositório novo. Uma ferramenta só: um cálculo determinístico sobre quatro entradas — espécie, peso, perfil e energia metabolizável. Nenhum dado precisa sair do navegador, nenhuma informação precisa sobreviver à sessão.

É projeto de portfólio. Precisa ser barato de publicar, fácil de ler por quem chega de fora, e coerente com as regras de `AGENTS.md`, que exigem tipagem explícita e testes rodando sem setup humano.

Ambiente da máquina: Node 24, bun, Python 3.14 com uv, cargo e docker disponíveis. Ruby não está instalado.

## Decisão

Vite + React + TypeScript com `strict: true`. Aplicação inteiramente client-side, build estático, sem backend, sem banco, sem autenticação, sem persistência remota.

Vitest e Testing Library para testes. ESLint e Prettier para lint e formatação.

`src/domain/` não importa React nem toca no DOM.

## Alternativas descartadas

**Next.js.** Todo o valor do produto está num cálculo puro que roda no cliente. SSR, rotas de API e a separação server/client components seriam superfície que o projeto não usa, com custo permanente de complexidade de build e de raciocínio. Over-engineering é o modo de falha característico de desenvolvimento assistido por agente, e a decisão consciente de não adotá-lo é o freio.

**Rails.** Ruby não está instalado na máquina, e um servidor para um cálculo sem estado é peso morto.

**Python + FastAPI + HTMX.** Mesma razão: backend para algo que não precisa de servidor. Também é a opção mais fraca como vitrine de portfólio front-end.

**HTML e JavaScript puros, sem build.** Custaria a tipagem explícita que `AGENTS.md` exige e a infraestrutura de teste que torna TDD viável.

## Consequências

Ganhos:

- publica em qualquer host estático, sem custo de runtime, sem segredo de servidor, sem superfície de ataque de backend
- nada a fazer sobre LGPD: nenhum dado pessoal ou de saúde animal é coletado, transmitido ou armazenado
- `src/domain/` isolado de React é reaproveitável por uma CLI ou API futura sem reescrita
- testes de domínio rodam em milissegundos, o que sustenta a exigência de TDD

Custos aceitos:

- sem renderização no servidor e sem SEO por página
- guardar perfis de pet, histórico de peso ou base de rações exige ADR novo e provavelmente mudança de stack
- o usuário digita a energia metabolizável a cada uso, já que não há persistência

## Revisitar quando

Aparecer necessidade real de persistência entre dispositivos, uma segunda ferramenta com estado compartilhado, ou requisito de SEO por página.
