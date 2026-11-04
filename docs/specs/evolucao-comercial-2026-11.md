# Evolução comercial do site — implementação para comparação

## Escopo autorizado

Implementar a proposta de marketing, UX e copywriting de novembro, mantendo as
mudanças locais e sem commit ou publicação. Preservar conteúdo, URLs, preços,
condições, fontes sem serifa, legibilidade e disclosures abertos por padrão.

## Plano

1. Guardar artefato anterior para comparação local.
2. Reorganizar home com provas existentes, demonstração guiada, percursos por
   necessidade, migração clara e formulário com orientação/fallback.
3. Tornar a comparação móvel utilizável, adicionar filtro de diferenças e
   recomendação após respostas explícitas, com resumo compartilhável.
4. Implementar simulador de custo manual com premissas editáveis, sem prometer
   economia; enriquecer segmentos com fluxos e telas existentes.
5. Consolidar categorias do blog e autoria institucional/individual real,
   adicionar recomendações de produto e transparência editorial.
6. Padronizar pedidos de demonstração, preservar contexto de plano/segmento,
   medir interações sem dados pessoais e documentar o contrato de integração.
7. Revisar FAQ e executar validação estrutural, cenários de interação, teclado,
   ausência de JavaScript, desktop, celular e temas claro/escuro.

## Dependências externas

Não há dados/autorização de novos casos, depoimentos, fotografias ou métricas de
resultado. Utilizar apenas marcas e provas já publicadas, sem criar conteúdo
fictício. O formulário externo atualmente comunica apenas readiness/tema; não
inventar evento de lead recebido. Auditoria do GTM/CRM, confirmação de envio,
processo comercial e testes com compradores dependem de acesso/dados externos.
Registrar esses pontos para acompanhamento ao fim.

## Ajuste necessário na geração

A reconstrução automática foi reiniciada durante o trabalho e voltou a competir
com a validação, causando ENOTEMPTY, rodapés duplicados e transformação dupla de
âncoras. A geração passará a usar uma pasta temporária por processo e publicar o
artefato completo com exclusão mútua apenas na troca de diretório. A FAQ receberá
o diretório de saída explicitamente, mantendo o padrão para chamadas existentes.
Validar duas gerações concorrentes e ausência de arquivos temporários ao concluir.

## Resultado e verificação

Implementação local, sem commit, sem push e sem publicação.

- `make validate` aprovado: 145 páginas HTML e 117 artigos; formatação, links,
  SEO e JSON-LD validados. Novos scripts também passam por `node --check`.
- Duas gerações concorrentes, seguidas da validação, concluídas com sucesso.
  Nenhuma pasta temporária de build ou lock ficou no checkout ao concluir.
- Conferidos os conjuntos de URLs e IDs contra a cópia anterior: todas as 145
  URLs HTML e âncoras preexistentes preservadas.
- Corpos, slugs e datas dos 117 artigos preservados, exceto a alteração autorizada
  da chamada “Agendar demonstração” para “Solicitar demonstração”. Categorias
  antigas continuam como tags. Entidades Product/SoftwareApplication de home e
  planos permanecem equivalentes às anteriores.
- Navegador: 320, 390, 768, 1024, 1280 e 1440 pixels, sem transbordamento horizontal
  da página; tema escuro e preferência por movimento reduzido conferidos.
- Recomendador: limites 8/3, 15/7, ultrapassagem por equipamento ou usuário,
  escolha por recursos, campo vazio, zero e quantidade fracionária.
- Comparador: um plano cabe na tela móvel; tabela completa disponível; diferenças
  filtradas corretamente; seleção e filtro restaurados pelo link compartilhado.
- Tour: teclado, links diretos, seleção de etapas, abertura da galeria e Escape.
- Simulador: 120 repetições × 5 minutos ÷ 60 × R$ 30 = R$ 300 e 10 horas/mês;
  alteração dos valores invalida a estimativa anterior; evento não inclui entradas.
- Jornada de contato: 12 equipamentos/4 usuários e recursos do Pro preservados no
  resumo; cópia e restauração do botão verificadas; formulário priorizado no celular.
- Formulário público inspecionado sem envio. Readiness verdadeiro observado;
  mensagem de origem/janela não autorizada ignorada. Sem eventos de lead fictícios.
- Blog: sete categorias, busca com filtro e próximo passo em artigo. Sem
  JavaScript: 117 artigos disponíveis, quatro etapas do tour visíveis, comparação
  completa e fórmula manual do simulador acessíveis.
- Seletor antes/depois de `make compare` conferido em navegador.
- Materiais reais e integrações externas pendentes descritos em
  `docs/evolucao-comercial-2026-11.md`.

Capturas locais em `output/playwright/commerce-*.png` (ignoradas pelo Git).
