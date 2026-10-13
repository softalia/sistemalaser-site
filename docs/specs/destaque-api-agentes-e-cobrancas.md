# Destaque da API e cobranças integradas

- Dar destaque à API em `integracoes.html`, antes das demais integrações, com a imagem `sll-integracao-api.webp`.
- Apresentar consultas e criação de locações, criação de cobranças e emissão de notas fiscais por agentes, incluindo ChatGPT Codex, Claude, Gemini, Grok e outros.
- Explicar a documentação OpenAPI v3, Swagger, `llms.txt` e o guia completo `llms-full.txt`, que permite aos agentes compreender a integração imediatamente.
- Preservar as integrações relevantes com WhatsApp/LILA, webhooks, formulários e Google.
- Resumir a API em `funcionalidades.html#integracoes` e criar uma seção própria para cartão, PIX, boleto e baixa automática, usando a imagem de cobranças existente.
- Registrar a nova imagem na galeria compartilhada com título e descrição, atualizar FAQ e descoberta no `llms.txt` do site e alinhar metadados.
- Manter as indicações existentes de disponibilidade nos planos Pro e Master.
- Formatar arquivos alterados e executar `make validate`; verificar visualmente se houver navegador disponível.

## Organização visual de funcionalidades

- Posicionar `#cobrancas` imediatamente após `#financeiro`, incluindo a mesma ordem no catálogo estruturado.
- Preservar `#agenda` integralmente e alternar texto/imagem nos grupos com duas colunas em telas grandes; no celular, preservar texto antes da imagem.
- Preservar a galeria de três opções de aparência, cujo layout não usa o par texto/imagem.

## Grupo exclusivo de Nota Fiscal

- Reposicionar o grupo existente `#nota-fiscal` imediatamente depois de `#cobrancas`, sem duplicar conteúdo ou identificadores.
- Manter a imagem `sll-nfe-emitir.webp`, já registrada na galeria.
- Concentrar o texto sobre emissão agendada e o botão “Ver a emissão automática de notas” no grupo de Nota Fiscal.
- Atualizar a ordem do catálogo estruturado e recalcular a alternância de texto/imagem dos grupos com duas colunas, preservando Agenda e locações.
