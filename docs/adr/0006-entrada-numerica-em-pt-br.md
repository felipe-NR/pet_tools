# ADR 0006 — Entrada numérica no padrão pt-BR: vírgula decimal e ponto de milhar

**Status:** Aceito
**Data:** 2026-08-18

## Contexto

O usuário definido pelo [prd.md](../prd.md) é tutor brasileiro, e o `index.html` declara `lang="pt-BR"`. Ele digita número como se escreve em português. O formulário não aceitava isso:

```
Peso inválido: recebido "4,5", esperado número entre 0.5 e 100 kg para cão,
com ponto decimal e não vírgula
```

A validação parseava com `DECIMAL_INPUT_PATTERN = /^-?\d+(?:\.\d+)?$/`, ponto decimal e nada mais. A escolha tinha motivo, registrado em comentário: `Number()` sozinho é muito mais largo que o contrato da função — `Number('0x1194')` é 4500, uma EM plausível, e `Number('1e1')` é 10, um peso plausível. String colada ou malformada virava número que chegava ao cálculo sem ninguém notar. `Number('')` é 0, e campo em branco viraria peso zero.

O padrão protegia contra isso e, no mesmo movimento, rejeitava a notação do próprio usuário. Dois caminhos prováveis quebravam:

- **peso**: `4,5` era `notANumber`, e a mensagem mandava usar ponto — pedindo ao tutor que escrevesse número numa convenção que não é a dele;
- **EM**: `3.500`, que é como o rótulo imprime, virava `3.5`, caía fora de 200–8 000 e devolvia erro de faixa. O usuário lia "esperado número entre 200 e 8000" tendo digitado o que ele lê como 3500. `3.500,5` era rejeitado direto, e havia teste fixando essa rejeição com o comentário "is how a label writes it".

Aceitar a notação local não é preferência de estilo: é o mesmo raciocínio do [ADR 0004](./0004-ingles-no-codigo-copy-em-portugues.md), que manteve a copy em português porque o produto é para tutor brasileiro. Entrada e saída fazem parte da mesma interface.

## Decisão

**1. Vírgula é o separador decimal.** `4,5` é 4,5.

**2. Ponto é separador de milhar quando forma grupos de três dígitos.** `3.500` é 3500, `1.234.567` é 1234567.

**3. Ponto decimal continua aceito.** `0.5` e `4.5` seguem valendo. A faixa aparece com ponto em [dominio-nutricional.md](../dominio-nutricional.md#validação-de-entrada) e nos textos de ajuda, e quem já digitava assim não perde nada.

`parseDecimalInput` aplica três padrões em ordem, e o primeiro que casar decide a leitura:

|nº|padrão|exemplo|vira|
|-|-|-|-|
|1|`^-?\d{1,3}(\.\d{3})+(,\d+)?$`|`3.500` / `3.500,5` / `1.234.567`|3500 / 3500,5 / 1234567|
|2|`^-?\d+(,\d+)?$`|`4,5` / `12`|4,5 / 12|
|3|`^-?\d+(\.\d+)?$`|`0.5` / `3500`|0,5 / 3500|
|—|nenhum|`0x1194` `1e1` `.5` `5.` `,5` `5,` `1.2.3` `1_000` `''`|`null`|

**4. A proteção original permanece.** Nenhum literal de outra base, notação científica, separador de milhar em underscore ou string vazia atravessa, e o guard `Number.isFinite` continua sendo a última barreira.

**5. Na ambiguidade, milhar ganha.** `1.500` é 1500 em qualquer campo — no peso isso dá erro de faixa, não 1,5.

A decisão 5 é a única que troca um comportamento existente por outro, e ela se sustenta em uma propriedade das faixas atuais: para qualquer `X.YYY`, a leitura de milhar cai em 1000–9999 e a leitura decimal cai abaixo de 10. Peso aceita 0,5 a 100 e EM aceita 200 a 8 000 — nenhuma das duas faixas contém as duas leituras. Quando uma é válida, a outra está sempre fora. Então a regra nunca troca em silêncio um número válido por outro número válido: o pior caso é erro de faixa citando o valor digitado, que o usuário corrige.

## Alternativas descartadas

**Desambiguar pela faixa do campo.** O parser devolveria as duas leituras e o validador escolheria a que cai dentro da faixa: `3.500` na EM seria 3500 e `1.500` no peso seria 1,5. Acerta os dois casos e é a melhor UX possível hoje. Descartada porque acopla o parsing à faixa: `parseDecimalInput` deixaria de ser agnóstico, e um campo futuro com faixa larga o bastante para conter as duas leituras voltaria a ser ambíguo — só que aí a escolha aconteceria em silêncio, dentro de uma função que ninguém releria.

**Aceitar só a vírgula, sem tratar milhar.** Mudança mínima, zero regressão: `4,5` e `3.500,5` passariam e `1.500` continuaria valendo 1,5. Descartada porque deixa quebrado justamente o caso mais provável do campo de EM — `3.500` puro, que é a forma impressa no rótulo que o tutor tem na mão.

**Normalizar com `Intl.NumberFormat` ou uma biblioteca de parsing localizado.** `Intl` formata, não parseia; parsear localizado exigiria dependência nova para um idioma e dois campos, contra `AGENTS.md > What not to do`.

**Trocar o campo por `<input type="number">` e deixar o navegador resolver.** O controle nativo aceita separador conforme o locale do navegador, não o do produto, e o valor cru some — a mensagem de erro perde o "recebido", que o critério de aceite 4 do PRD exige.

## Consequências

- `4,5`, `3.500` e `3.500,5` calculam. Era o objetivo.
- `1.500` no campo de peso passa a devolver erro de faixa em vez de calcular 1,5 kg. É a regressão aceita, e ela é visível: o usuário vê a mensagem citando `1.500` e a faixa 0,5–100.
- A copy muda junto. O sufixo `com ponto decimal e não vírgula` virou mentira e sai; em lugar dele, a mensagem de `notANumber` mostra um exemplo do formato aceito. O motivo do sufixo continua valendo — valor que não parseia pode estar dentro da faixa, e citar só a faixa mandaria o usuário repetir o que acabou de fazer.
- `AGENTS.md > Error messages` cita a mensagem antiga como exemplo e muda junto, senão a regra escrita contradiz o código.
- Os passos exibidos do cálculo não mudam: `formatPortionStep` e `formatRestingEnergyStep` ecoam a string crua, então `70 × 4,5^0,75` e `÷ (3.500 ÷ 1.000)` já saem corretos em pt-BR.
- A matemática não muda. Fórmulas, fatores e faixas continuam idênticos, e os quinze critérios de aceite continuam válidos.

## Revisitar quando

Aparecer um terceiro campo numérico cuja faixa contenha as duas leituras de um `X.YYY` — aí a propriedade que sustenta a decisão 5 deixa de valer, e a alternativa de desambiguar pela faixa volta à mesa.

Ou se o público-alvo deixar de ser brasileiro, o que reabre esta decisão junto com a decisão 3 do ADR 0004.
