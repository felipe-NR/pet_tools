# Referências

Fontes que sustentam os números em [dominio-nutricional.md](./dominio-nutricional.md).

Antes de alterar qualquer fórmula ou fator, confira aqui de onde ele veio.

## Nutrição veterinária

|fonte|o que fornece|status|
|-|-|-|
|[MSD / Merck Veterinary Manual — Nutritional Requirements of Small Animals](https://www.msdvetmanual.com/management-and-nutrition/nutrition-small-animals/nutritional-requirements-of-small-animals)|`RER = 70 × kg^0.75`, variante linear `30 × kg + 70` restrita a 2–45 kg, e a tabela completa de fatores de MER por espécie e perfil|**verificado em 2026-08-15**, e conferido de novo na sessão do [ADR 0003](./adr/0003-peso-ideal-e-perfis-suportados.md). As linhas de manutenção vivem sob "Healthy adult dogs" e "Healthy adult cats" — *obesity prone* é categoria de animal saudável. Não define fator para perda de peso nem para idoso, e registra que as diretrizes atuais não reconhecem mudança nutricional por idade em idoso saudável|
|[Ed Carlson — *Nutrition Math 101*, Today's Veterinary Nurse, Summer 2023](https://todaysveterinarynurse.com/nutrition/veterinary-nutrition-math/)|Tabela 1, com os coeficientes diários de energia para cão e gato; as três formas de RER e o limite de 2–45 kg da variante linear|**verificado em 2026-08-15.** Segunda fonte independente dos seis fatores de manutenção, com valores idênticos aos do MSD. Traz também perda de peso (cão 1.0, gato 0.8) e trabalho (cão leve 2, pesado 4 a 8), ambos fora de escopo — ver ADR 0003|
|Gross KL, Yamka RM, Khoo C, et al. Macronutrients. In: Hand MS, Thatcher CD, Remillard RL, et al., eds. *Small Animal Clinical Nutrition*, 5ª ed.|fonte primária por trás da Tabela 1 do Carlson|**não consultado diretamente.** É livro, não página web. Fica registrado como a origem declarada dos fatores, para quem precisar chegar na fonte de verdade|
|[WSAVA — Global Nutrition Guidelines](https://wsava.org/global-guidelines/global-nutrition-guidelines/)|diretrizes globais de avaliação nutricional, escore de condição corporal, cálculo de RER|citado no material de origem, não verificado nesta sessão|
|[FEDIAF — Nutritional Guidelines](https://europeanpetfood.org/self-regulation/nutritional-guidelines/)|equações de energia metabolizável e fatores de atividade adotados na indústria europeia|citado no material de origem, não verificado nesta sessão. Ver [ADR 0002](./adr/0002-equacao-energetica-rer-mer.md) — a família de equações da FEDIAF diverge da adotada|
|[UK Pet Food — Calculating how much to feed](https://www.ukpetfood.org/spotlight-on-obesity/calculating-how-much-to-feed.html)|conversão de necessidade calórica para quantidade de alimento|não verificado nesta sessão|
|[Pet Nutrition Alliance — Calorie Calculator](https://petnutritionalliance.org/resources/calorie-calculator/)|calculadora de referência para conferir resultados|não verificado nesta sessão|

## Material em português

Útil para linguagem de interface e para conferir se o resultado bate com ferramentas que o público brasileiro já usa.

- [PremieRvet — Como realizar a avaliação nutricional de cães e gatos](https://premiervet.com.br/artigos/como-realizar-a-avaliacao-nutricional-de-caes-e-gatos/)
- [Purina Institute — Calculadora de MER para gatos](https://www.purinainstitute.com/pt-br/centresquare/mer-calculator-for-cats)
- [Prontupet — Calculadora de calorias](https://www.prontupet.com/calorias/index.html)
- [Royal Canin Portal Vet — consumo de alimento na vida adulta](https://portalvet.royalcanin.com.br/saude-e-nutricao/nutricao/royal-canin-responde-quantidade-de-alimento-consumida-pelo-animal-diminui-na-vida-adulta/)
- [Vetsmart — ABC da nutrição](https://www.vetsmart.com.br/cg/estudo/13814/artigo-abc-da-nutricao)

### Sobre obesidade e peso ideal

Sustentariam a regra de calcular sobre o peso ideal, que o [ADR 0003](./adr/0003-peso-ideal-e-perfis-suportados.md) discute. **Nenhum foi verificado**: PremieRvet e Royal Canin devolveram HTTP 403 na tentativa de leitura em 2026-08-15, e o MSD não trata do assunto. Quem for reabrir perda de peso começa por aqui.

- [PremieRvet — Obesidade em cães e gatos: causas, diagnóstico e tratamento](https://premiervet.com.br/artigos/obesidade-em-caes-e-gatos-causas-diagnostico-e-tratamento/)
- [Royal Canin Portal Vet — Tratamento da obesidade em cães e gatos](https://portalvet.royalcanin.com.br/saude-e-nutricao/controle-de-peso/tratamento-da-obesidade-em-caes-e-gatos/)
- [Vetsmart — Manual de obesidade canina e felina](https://vetsmart.com.br/cg/estudo/13145/manual-de-obesidade-canina-e-felina)

## Práticas de desenvolvimento agêntico

North Star do processo deste repositório. As regras de `AGENTS.md` derivam destes três textos.

- [Do zero a pós-produção em 1 semana: como usar IA em projetos de verdade](https://akitaonrails.com/2026/02/20/do-zero-a-pos-producao-em-1-semana-como-usar-ia-em-projetos-de-verdade-bastidores-do-the-m-akita-chronicles/) — commits pequenos com CI verde, TDD como viabilizador de velocidade, refactoring contínuo, segurança em todo commit, o humano como code review permanente e freio de over-engineering
- [Clean Code para agentes de IA](https://akitaonrails.com/2026/04/20/clean-code-para-agentes-de-ia/) — funções de 4–20 linhas, arquivos abaixo de 500, SRP, nomes com poucos hits no grep, tipos explícitos, DRY como segurança de refactor, no máximo 2 níveis de indentação, mensagens de erro com o valor ofensivo, comentário de proveniência
- [Como falar com o Claude Code efetivamente](https://akitaonrails.com/2026/04/15/como-falar-com-o-claude-code-efetivamente/) — os quatro blocos do prompt (objetivo, método, restrições, validação), contexto crítico declarado explicitamente, gate humano antes de ação irreversível, ciclos curtos com correção durante a execução

## Origem do projeto

A ideia nasceu de uma pergunta ao modo IA da busca do Google em agosto de 2026: como converter a energia metabolizável do rótulo em gramas por dia. A conversa resultante trouxe duas famílias de equações diferentes entre a primeira e a segunda resposta — divergência resolvida no [ADR 0002](./adr/0002-equacao-energetica-rer-mer.md).

Fica registrado como lembrete: resposta de IA generalista é ponto de partida de pesquisa, não fonte. Todo número que entra em `src/domain/` precisa de fonte veterinária rastreável nesta página.
