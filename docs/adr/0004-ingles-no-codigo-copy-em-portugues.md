# ADR 0004 — Inglês no projeto, português só em `docs/` e na copy

**Status:** Aceito
**Data:** 2026-08-15

## Contexto

O repositório nasceu inteiro em português: comentários, nomes de teste, `README.md`, `AGENTS.md`, `CLAUDE.md` e as mensagens de validação do domínio. Os identificadores já eram ingleses (`calculateRestingEnergyRequirement`, `maintenanceEnergyFactorFor`), então o código estava misturado — nome em inglês, comentário explicando em português.

É projeto de portfólio. Quem chega de fora para ler o código não necessariamente lê português, e `AGENTS.md` já se descreve como ponto de partida para qualquer agente de IA.

Ao mesmo tempo, o produto é para tutor brasileiro. O [prd.md](../prd.md) define o usuário como "tutor de cão ou gato adulto, sem formação veterinária", o `index.html` declara `lang="pt-BR"`, e o [referencias.md](../referencias.md) mantém uma seção de material em português explicitamente útil para linguagem de interface. Traduzir a tela quebraria o produto.

O conflito concreto estava nas mensagens de validação. Elas moram em `src/domain/`, mas quem as lê é o tutor:

```
Peso inválido: recebido 20, esperado número entre 0.5 e 15 kg para gato
```

São texto de produto vivendo dentro do motor de cálculo — que `AGENTS.md > Estrutura` descreve como reaproveitável por uma CLI ou API futura. Um domínio que carrega frases em português não é reaproveitável: é português embutido.

## Decisão

**1. Tudo fora de `docs/` é escrito em inglês.** Código, comentários, docstrings, nomes de teste, mensagens de exceção, `README.md`, `AGENTS.md`, `CLAUDE.md` e mensagens de commit.

**2. `docs/` continua em português.** É onde vivem domínio nutricional, PRD, referências e os próprios ADRs. São documentos de domínio, escritos contra fontes que já estão em português no repositório.

**3. A copy do produto continua em português e sai de `src/domain/`.** O domínio não monta frase: a validação devolve um `FieldViolation` estruturado — motivo, valor recebido, mínimo e máximo — e a camada de copy transforma isso em texto.

**4. A copy mora em `src/copy/`.** Inclui os rótulos de espécie, que hoje estavam em `petProfile.ts` devolvendo `'cão'` e `'gato'` de dentro do domínio.

**5. `src/domain/` não importa de `src/copy/`.** A dependência é numa direção só, e o ESLint verifica — do mesmo jeito que já verifica que o domínio não importa React.

**6. O histórico de commits anterior a este ADR fica como está.** Reescrever 12 commits para traduzir mensagem é risco sem retorno.

## Alternativas descartadas

**Traduzir a tela junto.** Mudaria o público-alvo definido no PRD. O produto existe para um tutor brasileiro que digita a EM do rótulo de uma ração vendida no Brasil.

**Manter a copy em português dentro do domínio, só traduzindo comentários.** Resolveria a legibilidade e deixaria o problema estrutural intacto: o motor de cálculo continuaria sabendo falar português, e a promessa de reaproveitamento por CLI ou API continuaria falsa.

**Adotar uma biblioteca de i18n.** Há um idioma e um punhado de strings. Seria dependência nova sem problema para resolver, contra `AGENTS.md > O que não fazer`.

**Traduzir `docs/` também.** As fontes veterinárias em português, o material de origem e os três ADRs anteriores estão em português. Traduzir criaria uma camada de tradução entre o número e a fonte dele, que é exatamente o que `AGENTS.md > Domínio` tenta evitar.

## Consequências

- `AGENTS.md > Estilo de código` muda: a regra de mensagem de erro deixa de valer para o domínio como texto e passa a valer em dois lugares distintos — exceção de programador, em inglês, carrega o valor ofensivo; mensagem de usuário é montada em `src/copy/` a partir do `FieldViolation`.
- `AGENTS.md > Estrutura` ganha `src/copy/`.
- A matemática não muda. RER, MER, fatores e faixas continuam idênticos, e os critérios de aceite 1 a 8 continuam válidos.
- `FieldValidation<T>` deixa de carregar `message` e passa a carregar `violation`. Quem consome precisa renderizar em vez de exibir.
- O texto que o tutor lê ganha um lugar único para revisar, em vez de estar espalhado por quatro módulos de domínio.
- Um segundo idioma, se algum dia fizer sentido, é um segundo arquivo em `src/copy/` e nada mais.

## Revisitar quando

Aparecer um segundo idioma de interface de verdade — aí a escolha passa a ser entre mais um arquivo em `src/copy/` e uma biblioteca de i18n.

Ou se o público-alvo deixar de ser brasileiro, o que reabre a decisão 3 inteira.
