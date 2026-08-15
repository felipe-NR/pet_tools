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

Fatores confirmados no MSD/Merck Veterinary Manual:

|espécie|perfil|fator|
|-|-|-|
|cão|adulto castrado|1.6|
|cão|adulto inteiro|1.8|
|cão|propenso à obesidade|1.4|
|gato|adulto castrado|1.2|
|gato|adulto inteiro|1.4|
|gato|propenso à obesidade|1.0|

Estes seis são os únicos perfis suportados. A tabela é a fonte única — não replique esses números em componente, teste ou texto de UI.

Nota de proveniência: o material que originou o projeto trazia "cão propenso à obesidade / idoso: 1.4". O MSD confirma 1.4 para propenso à obesidade, mas **não** define fator para geriátrico. Idoso não é perfil suportado; a fusão dos dois no material original não foi adotada.

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

Fora da faixa típica de ração seca (2 500 a 5 000 kcal/kg) o cálculo prossegue, mas a UI mostra aviso de que o valor é atípico e pede conferência do rótulo. Isso cobre ração úmida sem bloquear o usuário.

## Armadilhas conhecidas

**Unidade da EM no rótulo.** Fabricantes informam em kcal/kg, kcal/100 g ou kcal por medida/copo. O MVP aceita **kcal/kg apenas**, e o campo diz isso de forma inequívoca. Conversão, quando o rótulo vier em kcal/100 g: multiplique por 10.

**EM não é o mesmo que "níveis de garantia".** O painel de garantia traz proteína, gordura, fibra e umidade — nenhum deles é energia metabolizável. A EM costuma vir em nota separada. Se o rótulo não trouxer EM, o cálculo não pode ser feito; a UI precisa explicar isso em vez de aceitar um chute.

**Peso alvo contra peso atual.** Para animal acima do peso, a literatura calcula sobre o peso *ideal*, não o atual. O MVP usa o peso informado e avisa. Suportar peso alvo exige ADR.

## Fora de escopo

Não implemente. Estão aqui para que ninguém invente um número quando o assunto aparecer.

|situação|fator na literatura|
|-|-|
|filhote até 4 meses|3.0 × RER|
|filhote acima de 4 meses|2.0 × RER|
|filhote de gato|2.5 × RER|
|gestação e lactação|acima de 2.0 × RER, muito variável|
|perda de peso supervisionada|abaixo do fator de manutenção|
|animal doente, hospitalizado ou em recuperação|caso a caso|

Todos exigem acompanhamento veterinário. Quando o usuário selecionar um caso destes, a aplicação **não calcula** — informa e encaminha ao veterinário.

## Limite do produto

O resultado é estimativa populacional. O gasto energético individual varia de forma relevante entre animais do mesmo peso e perfil.

A conduta correta, e que a UI comunica: use o valor como ponto de partida, pese a porção em balança de cozinha, acompanhe peso e escore de condição corporal por 2 a 4 semanas, ajuste com orientação veterinária.

Nenhum texto da aplicação pode se posicionar como substituto de avaliação veterinária.
