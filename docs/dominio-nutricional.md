# Domínio nutricional

Fonte única de verdade para fórmulas, fatores e faixas de validação.
Código em `src/domain/` implementa este documento. Divergência entre os dois é bug no código, não neste arquivo.

Nenhum número aqui pode ser alterado sem ADR. Ver [ADR 0002](./adr/0002-equacao-energetica-rer-mer.md) para a escolha da família de equações.

## Vocabulário

|sigla|nome|o que é|
|-|-|-|
|RER|Resting Energy Requirement|calorias gastas em repouso absoluto, termoneutralidade, jejum|
|MER|Maintenance Energy Requirement|calorias diárias para manter o peso atual. Também aparece como DER ou NEM|
|EM|Energia Metabolizável|calorias que o animal de fato aproveita da ração. Vem no rótulo, em kcal/kg|

MER, DER e NEM são o mesmo conceito com nomes diferentes na literatura. O código usa **MER** em todo lugar.

## Passo 1 — RER

```
RER = 70 × (peso_kg ^ 0.75)
```

Vale para cães e gatos, qualquer peso, qualquer porte.

Existe uma variante linear na literatura, `RER = 30 × peso_kg + 70`, restrita a animais entre 2 e 45 kg. **Não usamos.** A exponencial cobre toda a faixa e evita um branch com limite de peso. Para 10 kg as duas divergem ~6% (393,6 contra 370), então misturar as duas produziria resultados inconsistentes.

## Passo 2 — MER

```
MER = RER × fator_do_perfil
```

Fatores confirmados em duas fontes independentes, com valores idênticos: o MSD/Merck Veterinary Manual e a Tabela 1 de Carlson (*Nutrition Math 101*, Today's Veterinary Nurse, Summer 2023), que por sua vez cita o *Small Animal Clinical Nutrition*, 5ª ed. Ver [referencias.md](./referencias.md).

No MSD estes seis valem sob os títulos "Healthy adult dogs" e "Healthy adult cats". **Propenso à obesidade é categoria de animal saudável** — do animal que tende a engordar, não do que já está acima do peso. Ver [ADR 0003](./adr/0003-peso-ideal-e-perfis-suportados.md).

|espécie|perfil|fator|
|-|-|-|
|cão|adulto castrado|1.6|
|cão|adulto inteiro|1.8|
|cão|propenso à obesidade|1.4|
|gato|adulto castrado|1.2|
|gato|adulto inteiro|1.4|
|gato|propenso à obesidade|1.0|

Estes seis são os únicos perfis suportados. A tabela é a fonte única — não replique esses números em componente, teste ou texto de UI.

Nota de proveniência: o material que originou o projeto trazia "cão propenso à obesidade / idoso: 1.4". As duas fontes confirmam 1.4 para propenso à obesidade, e **nenhuma** define fator para geriátrico — o MSD ainda registra que as diretrizes atuais não reconhecem mudança nutricional por idade em idoso saudável.

Idoso continua **não sendo um perfil**: não há linha na tabela nem fator próprio, e inventar um violaria a regra 2 de `AGENTS.md > Domínio`. O que o [ADR 0003](./adr/0003-peso-ideal-e-perfis-suportados.md) decidiu é outra coisa — para onde a interface manda o usuário: o tutor de animal idoso é orientado a escolher "propenso à obesidade". É decisão de produto, conservadora e sem respaldo em fonte, e está registrada como tal no ADR.

## Passo 3 — gramas por dia

O rótulo informa EM em kcal/kg. Converta para kcal/g e divida:

```
em_por_grama    = em_kcal_por_kg / 1000
gramas_por_dia  = MER / em_por_grama
```

## Exemplos calculados à mão

Use estes valores como casos de teste de valor exato.

**Cão, 10 kg, castrado, ração de 3 500 kcal/kg**

```
RER    = 70 × 10^0.75 = 70 × 5,623413 = 393,6389 kcal
MER    = 393,6389 × 1.6              = 629,8222 kcal
gramas = 629,8222 / 3,5              = 179,95 → 180 g/dia
```

**Gato, 4 kg, castrado, ração de 4 000 kcal/kg**

```
RER    = 70 × 4^0.75 = 70 × 2,828427 = 197,9899 kcal
MER    = 197,9899 × 1.2              = 237,5879 kcal
gramas = 237,5879 / 4,0              =  59,40 →  59 g/dia
```

**Cão, 25 kg, propenso à obesidade, ração de 3 800 kcal/kg**

```
RER    = 70 × 25^0.75 = 70 × 11,180340 = 782,6238 kcal
MER    = 782,6238 × 1.4                = 1095,6733 kcal
gramas = 1095,6733 / 3,8               = 288,33 → 288 g/dia
```

## Precisão e arredondamento

Arredonde **uma vez, no fim**. RER e MER circulam com precisão total de ponto flutuante.

O motivo é determinismo de teste, não magnitude do erro: com arredondamento intermediário, o valor esperado de um teste passa a depender de onde o arredondamento aconteceu, e duas implementações corretas discordam na última unidade.

Na apresentação:

- gramas por dia: inteiro
- kcal (RER e MER): inteiro
- nunca exiba mais de uma casa decimal em nada

## Validação de entrada

|campo|aceita|rejeita|
|-|-|-|
|peso, cão|0.5 a 100 kg|zero, negativo, não-numérico, fora da faixa|
|peso, gato|0.5 a 15 kg|idem|
|EM|200 a 8 000 kcal/kg|zero, negativo, não-numérico, fora da faixa|
|espécie|`dog`, `cat`|qualquer outro valor|
|perfil|um dos seis da tabela|qualquer outro valor|

**Notação aceita nos campos numéricos.** Vírgula é o separador decimal e ponto é o separador de milhar, como se escreve em português: `4,5` é 4,5 e `3.500` é 3 500. Ponto decimal também é aceito, então `0.5` continua valendo. Quando um `X.YYY` é ambíguo, milhar ganha — `1.500` no peso é 1 500 e cai fora da faixa, em vez de virar 1,5. Regra completa e motivo no [ADR 0006](./adr/0006-entrada-numerica-em-pt-br.md).

Fora da faixa típica de ração seca (2 500 a 5 000 kcal/kg) o cálculo prossegue, mas a UI mostra aviso de que o valor é atípico e pede conferência do rótulo. Isso cobre ração úmida sem bloquear o usuário.

## Armadilhas conhecidas

**Unidade da EM no rótulo.** Fabricantes informam em kcal/kg, kcal/100 g ou kcal por medida/copo. O MVP aceita **kcal/kg apenas**, e o campo diz isso de forma inequívoca. Conversão, quando o rótulo vier em kcal/100 g: multiplique por 10.

**EM não é o mesmo que "níveis de garantia".** O painel de garantia traz proteína, gordura, fibra e umidade — nenhum deles é energia metabolizável. A EM costuma vir em nota separada. Se o rótulo não trouxer EM, o cálculo não pode ser feito; a UI precisa explicar isso em vez de aceitar um chute.

**Peso alvo contra peso atual.** Resolvido pelo [ADR 0003](./adr/0003-peso-ideal-e-perfis-suportados.md): **o peso informado é o peso ideal**, não o atual. Para animal já no peso saudável os dois coincidem e nada muda.

O enquadramento se apoia no que a fonte diz de si mesma — os fatores descrevem animal saudável, então aplicá-los ao peso ideal é usá-los como definidos. Fora isso, as fontes não fecham: o MSD não trata do assunto e o exemplo trabalhado do Carlson usa o peso atual.

A interface precisa dizer três coisas, e nenhuma é opcional:

- o peso ideal se define com veterinário, não se estima em casa;
- servindo a quantidade calculada, o animal tende ao peso informado — **sem prazo prometido**;
- animal visivelmente acima do peso é caso de acompanhamento veterinário. Em gato isso é mais sério: restrição calórica sem supervisão associa-se a lipidose hepática.

## Fora de escopo

Não implemente. Estão aqui para que ninguém invente um número quando o assunto aparecer.

|situação|fator na literatura|fonte|
|-|-|-|
|filhote até 4 meses|3.0 × RER|MSD e Carlson|
|filhote acima de 4 meses|2.0 × RER|MSD e Carlson|
|filhote de gato|2.5 × RER|MSD e Carlson|
|gestação e lactação|acima de 2.0 × RER, muito variável|material de origem; nenhuma das duas fontes traz linha|
|perda de peso, cão|1.0 × RER **sobre o peso ideal**|Carlson|
|perda de peso, gato|0.8 × RER **sobre o peso ideal**|Carlson|
|cão de trabalho leve|2.0 × RER|Carlson|
|cão de trabalho pesado|4 a 8 × RER — faixa, não fator|Carlson|
|animal doente, hospitalizado ou em recuperação|caso a caso|—|

Todos exigem acompanhamento veterinário. Quando o usuário selecionar um caso destes, a aplicação **não calcula** — informa e encaminha ao veterinário.

Três observações sobre esta tabela, para ninguém a ler como lista de pendências:

- **Perda de peso ficou de fora por decisão**, não por falta de número. Chegar ao peso ideal exige escore de condição corporal, que está fora de escopo, e emagrecimento é procedimento supervisionado. Ver [ADR 0003](./adr/0003-peso-ideal-e-perfis-suportados.md).
- **Cão de trabalho ficou de fora por público-alvo.** E "4 a 8" é faixa: escolher um ponto dentro dela seria inventar número. O material de origem ainda divergia do Carlson aqui, trazendo "2,0 a 3,0" para cão de trabalho.
- **Nada nesta tabela entra em `src/domain/`** sem ADR novo e sem fonte primária conferida.

## Limite do produto

O resultado é estimativa populacional. O gasto energético individual varia de forma relevante entre animais do mesmo peso e perfil.

A conduta correta, e que a UI comunica: use o valor como ponto de partida, pese a porção em balança de cozinha, acompanhe peso e escore de condição corporal por 2 a 4 semanas, ajuste com orientação veterinária.

Nenhum texto da aplicação pode se posicionar como substituto de avaliação veterinária.
