# Revisão de SEO — 17/10/2026

Proposta local na branch `design_2026_10`. Nenhuma publicação, alteração de DNS,
configuração de produção ou envio ao Search Console foi realizado.

## Resultado da revisão de todas as páginas

O inventário [seo-inventario-2026-10.csv](seo-inventario-2026-10.csv) relaciona
as 131 páginas HTML geradas, seus títulos, H1, canonical, diretivas de robôs,
presença no sitemap e dimensões das imagens.

- 125 páginas com conteúdo, incluindo 103 artigos; seis caminhos antigos mantidos com redirecionamento HTML imediato, canonical de destino e link navegável.
- 125 títulos e descrições únicos, um H1 por página e nenhuma imagem sem dimensões. Títulos não foram truncados automaticamente; 25 títulos de busca do blog foram reescritos editorialmente. Títulos visíveis, textos dos artigos e slugs foram preservados.
- 124 páginas HTML indexáveis, todas alcançáveis a partir da home por links HTML. O catálogo completo dos 103 artigos permanece disponível sem JavaScript.
- A versão histórica dos termos permanece acessível no endereço anterior com `noindex,follow`; os termos atuais continuam indexáveis. O arquivo histórico não compete na busca nem entra no sitemap.
- 125 URLs no sitemap: 124 páginas indexáveis e o JSON público de FAQ. Caminhos antigos não entram no sitemap. Imagens relevantes são incluídas; `lastmod` usa somente datas editoriais reais dos artigos. Páginas sem data confiável não recebem uma data artificial de build. `priority` e `changefreq`, ignorados pelo Google, foram retirados.
- Relações entre página, site e organização disponíveis no HTML; referências a `#organization` e `#website` resolvidas em todas as páginas. Entidades comerciais, ofertas e políticas foram preservadas.
- Removida a marcação `Review` do resumo institucional “Operações de locação de equipamentos usam...”: esse texto não é um depoimento atribuível. A informação continua visível. Nenhuma avaliação ou nota foi inventada.
- Idioma pt-BR, metadados sociais consistentes com título/descrição/canonical e permissão de prévias grandes nas páginas indexáveis.
- Links de artigos para a antiga landing de laser agora apontam diretamente para o endereço canônico.

## Desempenho, acessibilidade e cabeçalho

- Menus e submenus em 16 px, marca em 21,6 px no desktop e chamada legível em telas intermediárias. Altura do cabeçalho continua em 82 px no desktop e 72 px no celular, antes de abrir o menu.
- Conferidos menus abertos, fechamento por Escape e ausência de transbordamento em 390, 768, 1024, 1199 e 1440 px.
- Dimensões intrínsecas adicionadas a 37 imagens que ainda não as declaravam. CSS conserva apresentação e proporção; galeria de capturas continua funcional.
- Removidas folhas externas de ícones sem consumidores. WhatsApp usa SVG do glyph já licenciado no repositório, sem baixar uma fonte inteira para esse botão.
- CSS e JavaScript próprios são compactados somente no artefato de build. Fontes e terceiros já minificados permanecem intactos.
- Corrigido o contraste do selo “Mais popular” em tema escuro.
- Páginas jurídicas e de carreiras não carregam mais jQuery/Swiper sem uso nem o inicializador antigo que redirecionava localhost para HTTPS e quebrava a prévia. A exigência de HTTPS deve ocorrer na hospedagem.

Medição Lighthouse local em Chrome, configuração móvel padrão:

| Página | SEO | Acessibilidade | Boas práticas | Desempenho |
| --- | ---: | ---: | ---: | ---: |
| Home | 100 | 100 | 100 | 85 |
| ERP para locadoras | 100 | 100 | — | — |
| Artigo de controle de máquinas | 100 | 100 | — | — |

A home marcou 82 em desempenho e 96 em acessibilidade na primeira medição desta
revisão, antes dos ajustes adicionais de ícones, compactação e contraste.
Essas notas são medições de laboratório, não resultados de tráfego real. O
servidor Python local não aplica compressão nem cache de produção; tamanho do
Bootstrap e carregamento de analytics ainda aparecem nas oportunidades de
performance. Há carregamento de GA direto e por GTM: eventual consolidação exige
revisar a configuração de tags e conversões, preservada nesta proposta.
Os relatórios JSON e capturas estão em `output/playwright/`, ignorado no Git.

## Ajuste necessário na hospedagem

Consulta somente de leitura à API do GitHub Pages confirmou:

```json
{
  "build_type": "workflow",
  "cname": "sistemalaser.com.br",
  "https_enforced": false,
  "html_url": "http://sistemalaser.com.br/"
}
```

O certificado estava aprovado para os dois domínios. As consultas HTTP mostraram
HTTP 200 no domínio sem www e redirecionamento 301 de www para sem www. A rota inexistente de auditoria respondeu HTTP 404. O domínio servido
contradiz os canonicals e sitemap existentes, que usam HTTPS com www.

Para preservar os canonicals já definidos, a proposta mantém todos os endereços
`https://www.sistemalaser.com.br/...` e alinha o arquivo CNAME de referência.
Na publicação, configurar `Settings > Pages > Custom domain` como
`www.sistemalaser.com.br` e ativar `Enforce HTTPS`. Confirmar a validação do DNS
pelo GitHub e testar que os dois domínios em HTTP, bem como HTTPS sem www,
convergem para HTTPS com www, preservando caminhos e parâmetros.

Com GitHub Actions, o arquivo CNAME do artefato não aplica o domínio configurado
no serviço: esse ajuste exige as configurações do Pages. Esta proposta não
modificou o serviço, não acionou deploy e não alterou DNS.

## Acompanhamento após publicação

Conferir primeiro os redirecionamentos reais, HTTPS e resposta 404 para caminhos
inexistentes. Validar amostras de dados estruturados no Rich Results Test e, no
Search Console, reenviar o sitemap, inspecionar home, páginas comerciais, um
artigo e caminhos antigos e acompanhar a canonical selecionada pelo Google,
indexação, cobertura e Core Web Vitals. Conferir também termos de busca, cliques
e conversão para demonstração, evitando avaliar sucesso somente por nota técnica.

Indexação, posicionamento e exibição de resultados enriquecidos não são
garantidos por metadados, sitemap, Schema.org ou nota do Lighthouse. `llms.txt`
é documentação para agentes, não substitui a descoberta por links e sitemap.

## Validação realizada

`make validate` aprovado: 131 HTML, 103 artigos, dados estruturados, imagens,
links, navegação, sitemap, descoberta e formatação. JavaScript próprio gerado
passou por `node --check`. Navegação de oito páginas em quatro larguras: HTTP
200, um H1, diretivas corretas e nenhum transbordamento. Galeria, Escape, tema
escuro e leitura sem JavaScript conferidos. Comparação com o Git confirmou que
nenhum texto visível das páginas nem corpo/título editorial dos artigos foi
alterado. Os avisos de Hotjar na prévia HTTP são de um serviço que requer HTTPS;
não houve envio de formulários ou leads.

## Referências

- [Google: sitemap e datas reais de atualização](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google: redirecionamentos](https://developers.google.com/search/docs/crawling-indexing/301-redirects)
- [Google: diretivas de robôs e prévias de imagens](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
- [Google: diretrizes de dados estruturados](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [GitHub: domínio personalizado, Actions e HTTPS](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [Chrome: Lighthouse e limites da auditoria](https://developer.chrome.com/docs/lighthouse/overview)
