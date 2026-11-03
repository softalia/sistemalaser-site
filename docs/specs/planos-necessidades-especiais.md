# Planos: necessidades especiais e evolução da plataforma

## Objetivo

Oferecer um contato comercial para necessidades de infraestrutura e operação
fora dos planos apresentados e disponibilizar o convite para ideias já existente
na página inicial.

## Implementação

- Adicionar um quadro horizontal após Master, dentro da grade de planos, com
  título, exemplos de necessidades e botão Fale conosco para WhatsApp.
- Citar instalação em rede privada, domínio específico, infraestrutura
  diferenciada, equipes com muitos usuários e integração especial com plataformas
  existentes como demandas para avaliação.
- Reutilizar o quadro completo de evolução do index após a seção Comparação
  completa, ajustando o link da demonstração para index.html#demonstracao.
- Atualizar a FAQ de planos com orientação sobre necessidades especiais.
- Preservar preços, limites, condições comerciais e entidades de ofertas.

## Validação

Executar make validate e conferir os dois quadros no navegador em desktop e
celular, incluindo links e ausência de rolagem horizontal na página.

## Resultado

- Quadro de necessidades especiais ocupa a largura da grade, após o Master.
- Quadro de ideias reproduz o conteúdo da página inicial após a comparação.
- FAQ de planos atualizada para orientar o contato e a avaliação da proposta.
- `make validate` aprovado: 145 páginas HTML e 117 artigos.
- Conferência visual em 1440 e 390 pixels: quadros legíveis, sem transbordamento
  horizontal da página, posições e links de WhatsApp e demonstração corretos.
