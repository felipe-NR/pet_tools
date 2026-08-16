# ADR 0003 — Peso informado é o peso ideal; perfis que ficam de fora

**Status:** Aceito
**Data:** 2026-08-15

Complementa o [ADR 0002](./0002-equacao-energetica-rer-mer.md). Não o substitui: a família de equações e os seis fatores de manutenção continuam exatamente como decididos lá.

## Contexto

Chegou material novo: a Tabela 1 de Ed Carlson, *Nutrition Math 101*, Today's Veterinary Nurse, Summer 2023. Ela fez três coisas.

**Confirmou os seis fatores de manutenção** já adotados, com valor idêntico, e deu a cadeia de proveniência que faltava: a tabela cita como fonte o *Small Animal Clinical Nutrition*, 5ª ed. (Hand, Thatcher, Remillard), um livro-texto. Isso é mais forte que a atribuição genérica a "FEDIAF/WSAVA" que vinha do material de origem — atribuição que, aliás, era internamente inconsistente, já que a família de equações da FEDIAF é a que o ADR 0002 descartou.

A conferência direta ao MSD nesta sessão fechou a confirmação: mesma equação exponencial para qualquer peso, mesma variante linear restrita a mais de 2 kg e menos de 45 kg, e a mesma tabela de fatores, incluindo os de crescimento. Os seis valores de manutenção agora têm duas fontes verificadas e independentes.

Um detalhe da tabela do MSD merece registro, porque sustenta a decisão 1 abaixo: as linhas de manutenção estão sob os títulos **"Healthy adult dogs"** e **"Healthy adult cats"**. "Obesity prone" é, na fonte, uma categoria de animal **saudável** — não de animal obeso.

Esse ganho de proveniência **não é registrado editando o ADR 0002**. O `README.md` desta pasta diz que ADR aceito não se edita, e a consequência do 0002 que afirma que os fatores da FEDIAF "não foram verificados contra o documento original nesta sessão" é verdadeira sobre aquela sessão. Reescrevê-la apagaria histórico. Fica aqui.

**Trouxe dois perfis de manutenção adulta que o MVP não suporta:** perda de peso (cão 1.0, gato 0.8) e trabalho (cão: leve 2, pesado 4 a 8; gato não tem linha).

**Expôs uma ambiguidade que estava latente.** Dentro de "Maintenance" a tabela lista `Obese prone` e `Weight loss` como linhas separadas. Não são sinônimos: propenso à obesidade é o animal **no peso saudável** que tende a engordar, e perda de peso é o animal **já acima do peso**. O MVP implementa o primeiro. Um tutor com o animal gordo lê "propenso à obesidade", seleciona, e recebe uma ração de manutenção calculada sobre o peso que ele quer reduzir — que é exatamente o modo de falha que a literatura de obesidade descreve.

Sobre qual peso usar, as fontes não fecham sozinhas. O `dominio-nutricional.md > Armadilhas conhecidas` afirmava que a literatura calcula sobre o peso ideal; o exemplo trabalhado do próprio Carlson usa o peso atual (cadela de 30,45 kg acima do peso, RER 907 kcal, fator 1, DER 907); e o MSD **não trata do assunto**. Material de pesquisa complementar sustenta o peso ideal, com a razão fisiológica de que tecido adiposo armazena energia e quase não gasta, de modo que alimentar pelo peso atual de um animal obeso mantém a obesidade — mas esse material é saída de busca com IA, que por regra do `referencias.md` é ponto de partida e não fonte. **Não foi verificado contra fonte primária nesta sessão.**

O que dispensa essa verificação é o enquadramento adotado na decisão 1: os fatores da fonte descrevem animal **saudável**, então aplicá-los ao peso ideal é usá-los como a fonte os define. A pergunta sobre protocolo de emagrecimento continua em aberto, e continua fora de escopo.

## Decisão

**1. O peso informado é o peso ideal do animal, não o peso atual.**

A tela pede o peso ideal, diz que ele se define com veterinário, e explica o mecanismo: servindo a quantidade calculada, o animal tende ao peso informado. Para o animal já no peso saudável, peso ideal e peso atual coincidem e nada muda.

Isso reverte o item "cálculo sobre peso alvo em vez de peso atual" da seção Fora de escopo do [prd.md](../prd.md).

**2. Não haverá perfil de perda de peso.** Os fatores 1.0 e 0.8 ficam registrados em `dominio-nutricional.md > Fora de escopo`, com fonte, e não são implementados.

**3. Não haverá perfil de cão de trabalho.** Quem mantém cão de trabalho já domina o assunto e não é o público do produto.

**4. Animal idoso é orientado ao perfil "propenso à obesidade".** É decisão de produto sobre para onde mandar o usuário, não fator novo: a tabela de fatores permanece com três perfis e nenhum valor muda. Inventar um fator geriátrico violaria a regra 2 de `AGENTS.md > Domínio`, e nenhuma fonte verificada define um.

Esta é a única decisão deste ADR **sem respaldo em fonte**, e fica registrada como tal. O MSD vai além de omitir o fator: afirma que as diretrizes atuais *não reconhecem* mudança nutricional ligada à idade em animais idosos saudáveis — pela leitura dele, um idoso saudável e castrado seria 1.6 e não 1.4. A escolha aqui é de produto e conservadora: o fator menor erra para menos comida, direção segura numa ferramenta cujo problema declarado é obesidade. Se alguém trouxer fonte que trate idoso saudável como adulto comum, esta decisão é a primeira a cair.

**5. O texto da tela não promete prazo de emagrecimento**, e encaminha ao veterinário o caso do animal acima do peso — com menção específica a gato, pela associação entre restrição calórica sem supervisão e lipidose hepática.

## Alternativas descartadas

**Manter o peso atual como entrada e apenas avisar**, que era o que o PRD dizia. Produz o número errado justamente para o animal acima do peso, que é o público que o PRD cita na primeira linha do Problema: obesidade é o distúrbio nutricional mais comum em cães e gatos domésticos. Avisar não conserta um número errado.

**Implementar perda de peso com fator reduzido sobre o peso ideal.** Exigiria escore de condição corporal como entrada para chegar ao peso ideal — a escala de 1 a 9, em que cada ponto acima de 5 vale de 10% a 15% de excesso — e o ECC está fora de escopo por decisão própria. Além disso, perda de peso é procedimento supervisionado, com meta de 1% a 2% por semana e meta intermediária para os casos graves; uma calculadora sem acompanhamento não entrega isso. E os fatores 1.0 e 0.8 ainda não têm fonte primária verificada neste repositório.

**Implementar perfis de trabalho.** Além de não ser o público, `pesado = 4 a 8 × RER` é faixa e não fator. Escolher um ponto dentro dela seria inventar número, proibido pela regra 2 de `AGENTS.md > Domínio`. O material de origem ainda divergia do Carlson aqui, trazendo "2,0 a 3,0" para cão de trabalho contra "leve 2, pesado 4 a 8".

**Criar um perfil "idoso" com fator próprio.** Não há fator geriátrico em nenhuma das fontes verificadas. Seria número inventado.

## Consequências

- **`src/domain/` não muda.** A matemática é idêntica; o que muda é o significado da entrada e o texto da tela. Os testes dos critérios 1 a 8 seguem válidos sem alteração.
- O campo de peso passa a se chamar peso ideal, com texto de apoio, e o `prd.md` deixa de excluir o cálculo sobre peso alvo. O ECC continua fora.
- Para o animal muito acima do peso a estimativa fica conservadora: a literatura usaria fator reduzido, e a aplicação usa o fator de manutenção cheio sobre o peso ideal. A perda resultante é mais lenta que a de um protocolo supervisionado. É aceito, e a tela encaminha esse caso ao veterinário.
- O produto ganha uma promessa que precisa ser dita com cuidado. "Servindo isso, o animal chega ao peso informado" é verdade na direção e indefinida no prazo. Nenhum texto pode sugerir prazo.
- Idoso deixa de ser lacuna silenciosa e passa a ter destino explícito, sem fator novo e sem perfil novo.
- Perda de peso e trabalho ficam documentados como excluídos **com número e fonte**, que é o propósito da tabela de fora-de-escopo: impedir que uma sessão futura reencontre a Tabela 1 e trate a ausência como esquecimento.

## Revisitar quando

Aparecer fonte primária verificada para os fatores de perda de peso **e** houver disposição de aceitar escore de condição corporal como entrada. As duas condições juntas — uma sem a outra não resolve, porque o fator depende de conhecer o peso ideal e o ECC é como se chega nele.

Ou se o público-alvo mudar, o que reabre trabalho e crescimento.
