# Search Console: review e aggregateRating — 20/10/2026

## Situação dos avisos recebidos

Os dois avisos em `index.html` e `planos.html` são recomendações de enriquecimento
para Product. A documentação do Google exige nome e ao menos um dos campos
`offers`, `review` ou `aggregateRating`. A oferta válida já existe nas duas
páginas, e foi preservada. O teste do Google pode continuar exibindo avisos por
falta de avaliações mesmo com essa marcação válida.

Não há base verificável de notas ou depoimentos no repositório. A informação
fornecida pelo proprietário de que os clientes são totalmente satisfeitos não
informa média, escala, quantidade, texto de avaliação ou autor. Não foi tratada
como se representasse uma avaliação individual ou uma média numérica.

**Pendente:** os avisos de `review` e `aggregateRating` não foram eliminados.
Para preenchê-los, é necessário obter dados reais e publicá-los também no
conteúdo visível das páginas correspondentes. Não foram criadas notas,
contagens, autores ou depoimentos fictícios, e nenhuma entidade Product foi
retirada para ocultar o aviso.

## Correções executadas na auditoria completa

Foram auditados os 133 HTML gerados. Somente home e planos possuem Product;
ambos mantêm suas ofertas, faixas/valores e políticas. Nove páginas possuem
SoftwareApplication. Oito tinham ofertas sem preço explícito ou sem oferta,
problemas adicionais ao aviso recebido. Agora apontam para o plano inicial
correspondente, com preço explícito, moeda, nome, URL e políticas já existentes
na página de planos.

| Página | Plano inicial da oferta de software | Preço mensal |
| --- | --- | ---: |
| index.html | Starter | R$ 399 |
| planos.html | Starter | R$ 399 |
| erp-locadora.html | Starter | R$ 399 |
| software-locadora-eletronicos.html | Starter | R$ 399 |
| sistema-financeiro-locadora.html | Starter | R$ 399 |
| estoque-produtos.html | Starter | R$ 399 |
| crm.html | Pro | R$ 699 |
| assinatura-eletronica.html | Pro | R$ 699 |
| lila-whatsapp.html | Master, já correto | R$ 1.299 |

As faixas e demais planos continuam descritos nas entidades Product, na página
de planos e no conteúdo visível. Corrigir o preço de software não resolve a
falta de avaliações: **o resultado enriquecido específico de aplicativos exige
review ou aggregateRating**, ao contrário da alternativa de offers válida
para snippets de Product. Essas duas regras não devem ser confundidas.

A validação compartilhada passou a verificar preços e moeda nas ofertas e
preço explícito/URL de plano nas entidades de software, preservando a exigência
de Product com ofertas nas páginas principais. Ausência de avaliações
opcionais de Product não é tratada como erro de build.

## Verificação e publicação

`make validate` aprovado: 133 páginas e 105 artigos, incluindo JSON-LD, URLs,
links, políticas comerciais e formatação. Comparação com Git confirmou que o
texto visível não mudou, todos os Product e suas ofertas permanecem idênticos
e os demais campos das entidades de software foram preservados.

Não houve publicação nem revalidação remota no Search Console. Os avisos
opcionais de avaliações poderão continuar após a publicação das correções de
preço. Solicitar nova inspeção não fornece os dados de avaliações ausentes e
não permite prometer que os avisos desaparecerão.

## Dados necessários para a próxima etapa

- Para um review: depoimento real identificável, autor, origem e, quando aplicável, nota e escala.
- Para aggregateRating: média real, escala e quantidade de avaliações do próprio produto, com base verificável. Não usar número de clientes como número de avaliações, nem misturar reputação da empresa com notas do software.
- Exibir os dados reais nas páginas correspondentes e refletir os mesmos valores no JSON-LD. Revisar os requisitos da marcação antes de publicar.

## Referências oficiais

- [Google: requisitos de snippets de produto e avisos opcionais](https://developers.google.com/search/docs/appearance/structured-data/product-snippet)
- [Google: preço e avaliações em aplicativos](https://developers.google.com/search/docs/appearance/structured-data/software-app)
- [Google: avaliações e médias](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)
