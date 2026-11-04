# Ajustes de foco comercial após revisão da proposta

## Escopo

Remover todos os blocos “Nesta página”, o contexto visível da avaliação na home
 e o telefone comercial impresso. Manter chamadas comerciais, botão flutuante de
WhatsApp, formulário, e-mail, URLs e âncoras úteis. As mudanças continuam sem commit.

## Implementação

- Remover navegação local da home e sua geração nas páginas de produto.
- Remover o quadro de contexto e seu código/estilos, inclusive armazenamento de
  sessão que alimentava exclusivamente esse quadro; manter resumo copiável no
  recomendador de planos.
- Remover o parágrafo com o telefone comercial visível. Preservar número em URLs
  de contato e em Organization/contactPoint, que não são conteúdo visual.
- Manter o WhatsApp flutuante disponível também próximo ao formulário, já que ele
  passa a ser a principal forma de localizar o contato pelo WhatsApp nessa área.
- Atualizar o relatório para refletir a revisão e validar o site e o formulário.

## Validação

make validate; conferência de ausência dos blocos na saída gerada, telefone fora
do texto visível e presença dos CTAs, formulário e WhatsApp. Conferência da home
em desktop/celular e das páginas de produto, preservando os detalhes abertos.

## Resultado

- make validate aprovado: 145 páginas HTML e 117 artigos.
- Auditoria do texto gerado confirmou ausência dos índices, do quadro e do número
  comercial visível em todas as páginas. Telefone em dados estruturados preservado.
- Conferência no navegador em 390 e 1440 pixels: formulário e botão flutuante
  disponíveis, sem transbordamento horizontal e sem erros JavaScript.
- Disclosures continuam abertos e recomendador de planos mantém seu funcionamento.
- Alterações locais, sem commit ou publicação.
