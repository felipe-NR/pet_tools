# AGENTS.md

Regras operacionais para agentes de IA neste repositório. Leia antes de qualquer edição.
Este é o documento vivo do projeto: quando uma decisão nova sobrevive a uma sessão, ela é registrada aqui ou em `docs/`.

## Estado atual

Só existe documentação. Não há `package.json`, `src/` nem CI ainda.
As seções "Comandos" e "Estrutura" abaixo são o **contrato que o scaffold deve satisfazer**, não descrição do que existe.

## O projeto

Calculadora web que converte peso do pet + perfil + energia metabolizável do rótulo da ração em **gramas por dia**.
Uma ferramenta só. Sem backend, sem banco, sem login, sem coleta de dados pessoais — todo cálculo roda no navegador.

O domínio inteiro (fórmulas, fatores, faixas de validação, avisos clínicos) está em `docs/dominio-nutricional.md`. Leia esse arquivo antes de mexer em qualquer coisa dentro de `src/domain/`.

## Stack

- Vite + React + TypeScript (`strict: true`)
- Vitest para testes, Testing Library para componentes
- ESLint + Prettier
- Sem framework de UI pesado. CSS Modules ou CSS puro.

Justificativa em `docs/adr/0001-stack-e-arquitetura.md`. Trocar qualquer item acima exige um ADR novo.

## Comandos

Todo comando roda sem setup humano, sem credencial e sem rede.

|comando|o que faz|
|-|-|
|`npm run dev`|sobe o servidor de desenvolvimento|
|`npm test`|roda a suíte inteira, uma vez, headless|
|`npm run test:watch`|modo watch|
|`npm run lint`|ESLint + checagem de tipos|
|`npm run build`|build de produção|

Antes de declarar qualquer tarefa concluída: `npm run lint && npm test && npm run build`. Os três passam ou a tarefa não acabou.

## Estrutura

```
src/
  domain/       cálculo puro. Zero import de React, DOM, browser ou I/O.
  components/   componentes React. Um componente por arquivo.
  App.tsx
  main.tsx
docs/
  prd.md                    escopo, fora-de-escopo, critérios de aceite
  dominio-nutricional.md    fórmulas, fatores, validações, avisos
  referencias.md            fontes primárias
  adr/                      decisões de engenharia, numeradas
```

Testes ficam ao lado do código: `rer.ts` → `rer.test.ts`.

`src/domain/` não conhece React. Se um arquivo em `domain/` importar React, está errado — a regra existe para que o motor de cálculo seja testável sem renderizar nada e reaproveitável se um dia houver CLI ou API.

## Estilo de código

- Funções: 4–20 linhas. Passou disso, divide.
- Arquivos: abaixo de 500 linhas, mire 200–300. Passou disso, divide por responsabilidade.
- Uma coisa por função, uma responsabilidade por módulo.
- Nomes específicos e únicos. Proibido `data`, `info`, `handler`, `manager`, `service`, `utils`, `helper`. Prefira nomes que retornem menos de 5 hits no grep: `calculateRestingEnergyRequirement`, `maintenanceEnergyFactorFor`, `DailyPortionResult`.
- Tipos explícitos. Nada de `any`, nada de `object`, nada de função sem tipo de retorno. `unknown` + narrowing quando o tipo for realmente desconhecido.
- Sem duplicação. Lógica repetida vira função. Um agente que edita uma cópia e esquece as outras produz bug silencioso.
- Early return em vez de if aninhado. Máximo 2 níveis de indentação.
- Mensagem de erro carrega o valor ofensivo e o formato esperado: `Peso inválido: recebido -3, esperado número entre 0.5 e 100 kg`. Nunca `Invalid input`.
- Dependências entram por parâmetro ou props, não por import global de singleton.

## Comentários

- Escreva o **porquê**, não o **o quê**. `// i++ incrementa i` é lixo; `// FEDIAF usa expoente 0.75, não 0.67 — ver ADR 0002` é contexto.
- Comentário de proveniência é obrigatório em qualquer constante numérica do domínio: de onde veio o número, qual fonte, qual ADR.
- Docstring em função pública: intenção + um exemplo de uso.
- Não apague comentários existentes durante refactor. Eles são o contexto da próxima sessão.

## Testes

TDD é obrigatório aqui, não é preferência. Teste primeiro, implementação depois.

- Toda função nova ganha teste. Todo bug corrigido ganha teste de regressão que falha antes do fix.
- Alvo: 80% de cobertura de linhas, 70% de branches. Mais linhas de teste que de código.
- Testes F.I.R.S.T.: rápidos, independentes, repetíveis, auto-validáveis, escritos junto.
- Todo teste roda headless, sem seed manual e sem configuração ausente.
- `src/domain/` merece teste de valor exato, não `expect(x).toBeGreaterThan(0)`. Os exemplos calculados à mão estão em `docs/dominio-nutricional.md` — use aqueles números como casos.
- Teste os limites: peso zero, peso negativo, peso fora de faixa, EM ausente, EM absurda, string onde se espera número.

## Domínio: regras que não se negociam

1. **Nunca altere uma fórmula, fator ou faixa de validação sem antes ler `docs/dominio-nutricional.md` e abrir um ADR.** Esses números vêm de literatura veterinária, não de intuição.
2. **Nunca invente um fator** para um perfil que não está na tabela. Se o perfil não existe, ou ele não é suportado no MVP, ou vira ADR com fonte.
3. Filhotes, gestantes, lactantes e animais doentes **estão fora do escopo**. A UI avisa e não calcula. Ver `docs/prd.md`.
4. O resultado é estimativa e a interface diz isso. Nenhum texto pode sugerir que substitui avaliação veterinária.
5. Arredonde só no fim. Valores intermediários (RER, MER) circulam com precisão total.

## Fluxo de trabalho

- Commits pequenos, cada um passando lint + testes + build. Nada de acumular e refatorar depois.
- Uma responsabilidade por commit. Feature, fix e refactor não andam juntos.
- Refatore continuamente. Código empilhado sem poda vira monólito.
- Antes de implementar algo não-trivial, apresente o plano e espere aprovação.
- Se faltar contexto de domínio ou de decisão, pergunte. Não presuma e siga.

## O que não fazer

- Não adicione dependência sem justificar. Toda dependência nova é superfície de ataque e peso de bundle.
- Não crie backend, banco, autenticação, analytics ou telemetria. É decisão arquitetural registrada, não esquecimento.
- Não colete, envie ou persista dado pessoal ou de saúde do animal fora do navegador.
- Não generalize para "plataforma de ferramentas" antes de existir uma segunda ferramenta real.
- Não silencie erro de tipo com `any`, `as` ou `@ts-ignore`.
- Não marque tarefa como pronta com teste falhando, teste pulado ou lint vermelho. Reporte o que quebrou.
