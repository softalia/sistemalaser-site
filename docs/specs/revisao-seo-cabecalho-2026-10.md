# Revisão de SEO e escala do cabeçalho

Revisar todas as 131 páginas geradas, preservando conteúdo, URLs canônicas, dados comerciais, entidades verificáveis existentes e os seis caminhos antigos com redirecionamento. Branch `design_2026_10`, atualizada com o merge já realizado em master. Nenhum deploy ou envio ao Search Console faz parte desta implementação.

## Diagnóstico e plano

- As 125 páginas com conteúdo têm títulos e descrições únicos. Revisar títulos excessivamente longos em artigos e a descrição longa identificada; preservar títulos editoriais e corpo dos artigos.
- Melhorar títulos/descrições das páginas comerciais quando isso esclarecer a intenção de busca.
- Padronizar idioma, metadados sociais e permissão de prévias grandes. Completar relações de WebPage, WebSite e Organization sem inventar avaliações ou informações comerciais.
- Declarar dimensões intrínsecas nas imagens locais que ainda não as têm, preservando proporção, carregamento e galeria.
- Eliminar `lastmod` artificial que muda a cada build: manter datas editoriais reais dos artigos e omitir datas sem fonte confiável. Gerar o sitemap a partir das páginas efetivamente indexáveis, incluindo suas imagens e mantendo a base JSON de FAQ.
- Preservar meta refresh imediato, canonical e link nos caminhos antigos compatíveis com GitHub Pages. Retirar o `noindex` desses redirecionamentos para não misturar remoção com consolidação. A versão histórica dos termos permanece acessível, com `noindex,follow` e link para os termos atuais.
- Remover apenas a marcação Review do texto institucional genérico, preservando sua prosa visível e as entidades comerciais; não é depoimento atribuível a um cliente.
- Após Lighthouse: retirar a folha externa de ícones sem consumidores e usar o glyph WhatsApp já licenciado no repositório como SVG local. Corrigir contraste do selo em tema escuro e compactar CSS/JS próprios no build. Preservar fontes e arquivos de terceiros já minificados.
- Alinhar o arquivo CNAME de referência com www e documentar que Actions não aplica domínio por esse arquivo. Produção requer configurar o domínio correspondente e HTTPS obrigatório no Pages; não alterar hospedagem durante a proposta.
- Verificar links internos, descoberta de artigos sem JavaScript, canonicals, dados estruturados, imagens e correspondência completa com sitemap. Ampliar validação compartilhada para proteger esses contratos.
- Recuperar escala próxima à anterior no cabeçalho: navegação e submenus em 16 px, marca em 21,6 px no desktop, botões legíveis também em telas intermediárias. Manter estados compactos e fonte sem serifas.

Na validação de navegação, identificado script legado nas páginas jurídicas e de carreiras que força HTTPS via JavaScript e quebra a prévia HTTP em localhost. Essas páginas não têm carrossel, AOS ou consumidores de jQuery. Retirar os imports sem uso de Swiper/jQuery e o inicializador legado; preservar Bootstrap, navegação e conteúdo. HTTPS obrigatório deve ser garantido na hospedagem.

## Verificação

`make validate`; auditoria de todas as páginas e rotas geradas; navegador em desktop, tablet e celular, incluindo menus; consulta somente de leitura ao site publicado e às recomendações oficiais do Google. Registrar resultados e limites reais. Indexação, posição e exibição de resultados enriquecidos dependem do Google; não podem ser garantidas por código.

## Referências oficiais

- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/docs/crawling-indexing/301-redirects
- https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- https://developers.google.com/search/docs/appearance/structured-data/sd-policies

## Resultado

Implementação concluída. `make validate` aprovado com 131 HTML e 103 artigos. Auditoria completa registrada em `docs/seo-revisao-2026-10.md` e inventário das 131 páginas em `docs/seo-inventario-2026-10.csv`. Lighthouse: SEO/acessibilidade 100 na home, ERP e artigo; boas práticas 100 e desempenho móvel local 85 na home. Conferência visual e funcional de oito páginas em quatro larguras, menus em cinco larguras, galeria e conteúdo sem JavaScript. Conteúdo visível preservado por comparação com Git.

Hospedagem consultada somente em leitura: domínio atual sem www e HTTPS não obrigatório. CNAME de referência e README alinhados aos canonicals www; atualização do serviço fica para publicação autorizada, sem qualquer deploy nesta entrega.
