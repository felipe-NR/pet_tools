# ADR 0005 — GitHub Actions para CI e GitHub Pages para hospedagem

**Status:** Aceito
**Data:** 2026-08-16

## Contexto

O MVP já tem os quinze critérios de aceite automatizados, mas os gates de qualidade ainda dependem de execução local. O [prd.md](../prd.md#pronto-quando) também exige que o build estático esteja publicado e acessível por URL para considerar o produto pronto.

O repositório está no GitHub, é público e não usa backend, segredos de aplicação nem qualquer etapa de runtime. O build do Vite produz todos os arquivos que precisam ser publicados.

## Decisão

**1. GitHub Actions executa a integração contínua.** Pull requests para `master` e pushes em `master` instalam as dependências com `npm ci` e executam, nesta ordem, `npm run lint`, `npm test` e `npm run build`, usando Node.js 24.

**2. O mesmo workflow publica no GitHub Pages depois dos gates.** Em pull requests, o workflow termina depois da validação. Em pushes na `master`, o artefato produzido pelo build é enviado ao Pages e um job separado faz o deploy. O job de deploy depende da validação; um build que falha nunca chega à hospedagem.

**3. As permissões ficam no menor escopo possível.** A validação recebe apenas leitura do conteúdo. Somente o job de deploy recebe `pages: write` e `id-token: write`, exigidos pelo Pages. O deploy usa o ambiente protegido `github-pages`.

**4. O site é um GitHub Pages de projeto.** A URL canônica é `https://felipe-nr.github.io/pet_tools/`, então o Vite usa `/pet_tools/` como caminho base. Desenvolvimento e preview locais continuam funcionando porque o Vite aplica o mesmo prefixo às URLs dos assets.

**5. As ações oficiais usam suas versões principais atuais.** O workflow usa apenas ações mantidas pelo GitHub para checkout, Node.js, configuração, artefato e deploy do Pages. As versões principais ficam visíveis no arquivo para facilitar atualizações deliberadas.

## Alternativas descartadas

**Separar CI e deploy em dois workflows.** Repetiria instalação e build em todo push na `master`, ou exigiria conectar os workflows por `workflow_run` e transportar o artefato entre execuções. Um workflow com jobs dependentes expressa o gate de publicação diretamente e mantém as permissões separadas por job.

**Publicar uma branch `gh-pages`.** Adicionaria uma branch gerada e credencial de escrita no repositório. O fluxo oficial de artefato do GitHub Pages publica sem misturar saída de build com código-fonte.

**Netlify, Vercel ou outro host estático.** Todos atenderiam tecnicamente ao build do Vite, mas acrescentariam conta, integração e configuração externas quando o repositório já oferece Actions e Pages.

**Executar somente o build antes do deploy.** Um bundle compilável ainda pode conter regressão coberta pelos testes ou violação de lint. O deploy deve representar exatamente o mesmo release gate documentado em `AGENTS.md`.

## Consequências

- Todo pull request recebe resultado reproduzível dos três comandos obrigatórios, sem setup manual e sem credenciais.
- Cada push aceito na `master` publica automaticamente a versão correspondente se todos os gates passarem.
- A hospedagem não cria backend, telemetria, cookies ou persistência; o comportamento client-side decidido no ADR 0001 permanece igual.
- O repositório precisa manter GitHub Pages configurado com GitHub Actions como fonte de publicação.
- Renomear o repositório ou migrar para domínio próprio exige atualizar o caminho base do Vite e a URL documentada.
- Indisponibilidade do GitHub Actions ou Pages impede uma publicação nova, mas não remove a última versão já publicada.

## Revisitar quando

O projeto precisar de domínio próprio, previews por pull request, requisitos de disponibilidade além do GitHub Pages, ou recursos de runtime que deixem de caber em hospedagem estática.
