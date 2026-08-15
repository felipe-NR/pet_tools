# ADR 0002 — `RER = 70 × kg^0.75` com fatores de MER por perfil

**Status:** Aceito
**Data:** 2026-08-15

## Contexto

O material que originou o projeto — uma conversa com o modo IA da busca do Google — trouxe **duas famílias de equações incompatíveis**, uma em cada resposta.

Primeira resposta, coeficiente direto por espécie:

```
cão  adulto sedentário:  NEM = 95 × kg^0.75
gato adulto castrado:    NEM = 75 × kg^0.67
```

Segunda resposta, requisito de repouso multiplicado por fator de perfil:

```
RER = 70 × kg^0.75
MER = RER × fator
```

As duas produzem números diferentes o suficiente para importar. Para um cão de 10 kg castrado: 534 kcal contra 630 kcal, diferença de 18%. Para um gato de 4 kg castrado: 190 kcal contra 238 kcal, diferença de 25%.

Note o segundo detalhe: a primeira família usa expoente **0.67** para gatos, a segunda usa **0.75** para as duas espécies. Não é erro de digitação — as duas convenções existem na literatura.

Sem uma decisão registrada, uma sessão futura vai encontrar a família alternativa numa fonte qualquer e "corrigir" o código, mudando silenciosamente o resultado que todo usuário recebe.

## Decisão

Adotar a segunda família:

```
RER = 70 × (peso_kg ^ 0.75)     para cães e gatos, qualquer peso
MER = RER × fator_do_perfil
```

Os fatores por espécie e perfil vêm da tabela confirmada no MSD/Merck Veterinary Manual e vivem em [dominio-nutricional.md](../dominio-nutricional.md), que é a fonte única deles. Este ADR decide a *família de equações*; os valores não são reproduzidos aqui de propósito, para não existirem duas cópias que possam divergir.

Descartada também a variante linear `RER = 30 × kg + 70`, válida só entre 2 e 45 kg.

## Alternativas descartadas

**Coeficiente direto por espécie (`95 × kg^0.75`, `75 × kg^0.67`).** Exige uma equação por espécie e por perfil, com expoentes diferentes entre elas. Cada perfil novo vira um coeficiente mágico no código, sem lugar único para conferir. É a família que a FEDIAF usa, e ela é legítima — foi descartada por manutenibilidade, não por estar errada.

**RER linear (`30 × kg + 70`).** Introduziria um branch por faixa de peso e quebraria para gatos filhotes, cães toy e raças gigantes. Para 10 kg diverge ~6% da exponencial, o que tornaria os dois caminhos mutuamente inconsistentes.

## Consequências

- Uma equação de RER para as duas espécies. O perfil vira dado numa tabela, não código.
- Adicionar um perfil é acrescentar uma linha com fonte, não escrever uma fórmula.
- Nenhum branch por faixa de peso: a exponencial vale de 0.5 kg a 100 kg.
- Os resultados são de 18% a 25% maiores que os da família da FEDIAF nos exemplos acima. É diferença real, e é exatamente por isso que a escolha precisa estar registrada.
- Os fatores da FEDIAF **não foram verificados contra o documento original nesta sessão** — o que se sabe deles vem do material de origem. Qualquer proposta de migrar para aquela família começa por verificar a fonte primária.
- Os testes de `src/domain/` usam valor exato, não faixa. Trocar de família quebra a suíte inteira de propósito, e é assim que deve ser.

## Nota sobre precisão

Nenhuma das duas famílias entrega a necessidade energética individual do animal. São estimativas populacionais, e a variação entre indivíduos de mesmo peso e perfil é relevante.

A validação real do número não está na escolha da fórmula: está em pesar a porção, acompanhar peso e escore de condição corporal por algumas semanas e ajustar com o veterinário. A interface precisa dizer isso — ver critério de aceite 9 em [prd.md](../prd.md).

## Revisitar quando

Surgir necessidade de suportar filhotes, gestação, lactação ou programa de perda de peso — casos em que a família de equações e os fatores mudam, e que hoje estão explicitamente fora de escopo.
