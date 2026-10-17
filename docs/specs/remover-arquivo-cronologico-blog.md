# Remover arquivo cronológico do blog

Retirar a seção “Todos os artigos, por data” do gerador e remover seus estilos sem uso. Preservar busca, categorias, paginação e todas as URLs dos artigos. Para manter o catálogo acessível sem JavaScript e a descoberta por links HTML, renderizar todos os cards na listagem inicial; a melhoria progressiva existente apresenta oito por página quando o JavaScript carrega. Conferir ausência da seção, paginação, busca e leitura sem JavaScript; executar `make validate`.

Resultado: seção e estilos retirados. Navegador em 390 e 1440 px: oito cards por página, paginação e busca funcionando, sem transbordamento. Sem JavaScript, os 103 cards permanecem disponíveis na listagem principal. `make validate` aprovado (131 páginas, 103 artigos), incluindo descoberta de todas as páginas indexáveis.
