# PRD — Calculadora de porção diária de ração

## Problema

O rótulo da ração traz uma tabela de porção por faixa de peso, larga e genérica, que ignora castração e nível de atividade. Quem quer acertar a quantidade precisa calcular à mão: descobrir a necessidade calórica do animal, converter a energia metabolizável do rótulo para kcal por grama e dividir. O cálculo envolve potência fracionária, o que na prática elimina quem não vai atrás de uma calculadora científica.

A consequência é conhecida: obesidade é o distúrbio nutricional mais comum em cães e gatos domésticos.

## Para quem

Tutor de cão ou gato adulto, sem formação veterinária, que já tem a ração em casa e quer saber quantos gramas servir por dia.

Não é ferramenta clínica. Veterinário tem software próprio e não é o público.

## Escopo do MVP

Uma tela. O usuário informa:

- espécie: cão ou gato
- peso em kg
- perfil: castrado, inteiro ou propenso à obesidade
- energia metabolizável da ração, em kcal/kg

A aplicação devolve:

- gramas por dia
- as calorias diárias (MER) que sustentam esse número
- os passos do cálculo, visíveis, com a fórmula usada
- aviso de que é estimativa e de que a validação é o acompanhamento de peso com veterinário

Regras completas de cálculo e validação em [dominio-nutricional.md](./dominio-nutricional.md).

## Fora de escopo

Decisões, não pendências. Sair de qualquer uma exige ADR.

- filhotes, gestantes, lactantes e animais doentes — a aplicação avisa e não calcula
- backend, banco de dados, conta de usuário, histórico
- múltiplas ferramentas, catálogo de tools, navegação entre elas
- base de rações cadastradas ou leitura de rótulo por foto
- divisão da porção em refeições, petiscos, ração úmida misturada com seca
- cálculo sobre peso alvo em vez de peso atual
- escore de condição corporal como entrada
- analytics, telemetria, cookies, qualquer coleta de dado

## Fluxo

1. Usuário chega na tela com o formulário visível. Nada de landing page antes.
2. Preenche os quatro campos. Validação acontece durante a digitação, com mensagem específica no campo.
3. Resultado aparece sem recarregar a página.
4. Abaixo do resultado, os passos do cálculo e o aviso clínico.

## Critérios de aceite

Escritos para virar teste.

Os critérios 1 a 3 são os três exemplos calculados à mão em [dominio-nutricional.md](./dominio-nutricional.md#exemplos-calculados-à-mão). Entradas e resultados esperados vivem lá e não são replicados aqui — cópia de número é cópia que diverge.

1. Primeiro exemplo, cão adulto castrado: devolve exatamente os g/dia e o MER registrados naquele arquivo.
2. Segundo exemplo, gato adulto castrado: idem.
3. Terceiro exemplo, cão propenso à obesidade: idem.
4. Peso zero, negativo ou fora da faixa da espécie bloqueia o cálculo e mostra mensagem que cita o valor recebido e a faixa esperada.
5. EM fora de 200–8 000 kcal/kg bloqueia o cálculo com a mesma qualidade de mensagem.
6. EM entre 200 e 2 500 ou entre 5 000 e 8 000 calcula normalmente e mostra aviso de valor atípico para ração seca.
7. Trocar de cão para gato reavalia a faixa de peso: 20 kg é válido para cão e inválido para gato.
8. Trocar de espécie mantém apenas os perfis válidos daquela espécie selecionáveis.
9. O aviso de que o resultado é estimativa e não substitui veterinário está visível junto do resultado, sem precisar rolar ou clicar.
10. Nenhuma requisição de rede sai da página depois do carregamento inicial.
11. A tela funciona em viewport de 360 px de largura.
12. O formulário é operável só por teclado, e cada campo tem label associado.

## Pronto quando

- os doze critérios acima têm teste automatizado passando
- `npm run lint && npm test && npm run build` passa limpo
- cobertura em `src/domain/` acima de 90% de linhas, projeto acima de 80%
- build estático publicado e acessível por URL
