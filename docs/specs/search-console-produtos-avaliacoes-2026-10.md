# Dados estruturados comerciais e avisos de avaliações

Solicitação: revisar home, planos e demais páginas em razão dos avisos de ausência de `review` e `aggregateRating` em snippets de produto.

## Diagnóstico

- A documentação atual do Google permite Product com `name` e uma oferta válida, sem avaliação. Os dois campos são recomendados nesse caso; os avisos não são erros de sintaxe nem impedem elegibilidade de snippets do produto.
- Não existem avaliações identificáveis, notas ou contagens verificáveis no projeto. Não preencher com números inventados, quantidade de clientes, resumo institucional ou avaliações da empresa tratadas como avaliações do software. Manter as entidades existentes conforme AGENTS.md.
- Todas as páginas foram pesquisadas. Home e planos são as únicas com Product. Existem nove SoftwareApplication. Seis usam AggregateOffer sem preço explícito; ERP e eletrônicos não têm oferta; LILA já usa Offer com preço.
- Para resultados enriquecidos específicos de aplicativos, Google também exige avaliação/review. A normalização de preços não resolve essa ausência; não prometer que todos os avisos desaparecerão.

## Implementação

1. Preservar Product, ofertas/faixas, políticas, SoftwareApplication, texto visível e URLs.
2. Usar nas oito ofertas incompletas de software uma Offer do plano de entrada adequado, com preço explícito, nome, moeda e URL por plano, reaproveitando as ofertas comerciais verificadas da página de planos. Manter as políticas existentes. LILA permanece no Master.
3. Ampliar a validação compartilhada para ofertas de software com preço explícito e ofertas de produto válidas. Não transformar ausência de avaliações opcionais em erro de build.
4. Auditar novamente todos os HTML gerados, documentar por URL os dados comerciais e as pendências reais. Não criar avaliações, remover Product para ocultar o aviso, publicar ou solicitar revalidação remota sem autorização.
5. Executar `make validate` e verificar que textos, entidades principais, preços de Product e políticas foram preservados. Como só há alteração em JSON-LD e validação, não há fluxo visual afetado.

Solicitados ao usuário os dados reais: texto e autor do depoimento, ou média, escala, quantidade e origem das avaliações. A publicação de marcação de avaliações depende dessa informação e da presença correspondente no conteúdo visível.

## Fontes oficiais

- https://developers.google.com/search/docs/appearance/structured-data/product-snippet
- https://developers.google.com/search/docs/appearance/structured-data/software-app
- https://developers.google.com/search/docs/appearance/structured-data/review-snippet

## Resultado

Oito páginas com ofertas de software corrigidas. `make validate` aprovado: 133 HTML e 105 artigos. Auditoria dos HTML gerados: dois Product (home e planos) com ofertas preservadas; nove SoftwareApplication com preço, moeda, URL por plano e políticas. Textos visíveis e entidades principais preservados por comparação com Git.

O usuário informou que os clientes são totalmente satisfeitos. Isso não especifica autor/texto de um depoimento, média numérica, escala ou quantidade de avaliações; portanto, não foi convertido em Review ou AggregateRating. Os dois avisos opcionais de Product permanecem pendentes desses dados. O requisito de avaliações para resultados enriquecidos de aplicativos também permanece não atendido. Nenhuma nota, contagem ou avaliação fictícia foi criada.
