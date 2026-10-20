# Ajuste do bloco de redes sociais no rodapé

## Objetivo

Manter Meta Partner na posição original, como último link institucional, e
separar visualmente as três redes sociais que aparecem abaixo dele.

## Alteração

- Desfazer a movimentação de Meta Partner para depois das redes sociais.
- Agrupar Instagram, YouTube e LinkedIn nessa sequência, diretamente no template.
- Aplicar margem superior de `1.25rem` ao bloco das redes sociais.
- Remover a lógica anterior de reordenação do HTML por expressões regulares.

## Validação

Executar `make validate` e conferir o HTML retornado pelo gerador compartilhado.

## Resultado

Meta Partner permanece acima do bloco social. As redes aparecem como Instagram,
YouTube e LinkedIn, com `1.25rem` de margem superior no bloco. `make validate`
aprovado para 133 páginas HTML e 105 artigos.
