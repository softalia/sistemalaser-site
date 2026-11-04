# Evolução comercial para comparação — novembro de 2026

Todas as alterações desta implementação são locais, sem commit e sem publicação.
A proposta original está em `docs/proposta-marketing-ux-copywriting-2026-11.md`.

## Como comparar

Execute `make compare` na raiz do repositório. Abra `http://localhost:8084/`.
O comando gera uma cópia isolada de HEAD e apresenta as duas versões lado a lado.
Também é possível abri-las em abas separadas, para avaliar na largura completa.
O seletor permite alternar entre inicial, planos, segmentos e blog. Ctrl+C encerra
os servidores da comparação e remove a cópia temporária. Não altera branches,
index do Git ou commits. Se a porta estiver ocupada, use
`SITE_COMPARE_PORT=8085 make compare`.

`make serve` continua disponível em `http://localhost:8083/` para a proposta atual.
Cada build gera um artefato isolado antes de substituir `dist/`. A troca é
serializada e aguarda a validação em andamento para impedir mistura de páginas
entre watcher e build manual.

## Implementado

- Mensagem inicial concreta e chamada para solicitar demonstração. Os atalhos
  “Nesta página” foram retirados na revisão de foco comercial.
- Home reorganizada: provas existentes, percurso com telas reais, quatro
  necessidades de negócio, segmentos, planos, orientação sobre migração e contato,
  seguidos dos recursos completos e aprofundamento.
- Catálogo agrupado por tarefa, com todo o conteúdo e disclosures abertos.
- Tour navegável por clique, teclado e links diretos; imagens integram a galeria
  existente. Sem JavaScript, todas as etapas continuam visíveis.
- Comparação de planos com um plano legível no celular, tabela completa acessível,
  cabeçalho persistente, filtro de diferenças, contagem acessível e link para
  compartilhar a seleção.
- Recomendação após informar equipamentos, usuários e recursos; limites e motivos
  explícitos, validação de quantidades, resumo copiável e demonstração do plano.
- Critérios visíveis nos cartões e explicação sobre capacidade ilimitada do Master
  versus requisitos de infraestrutura ou integração especiais.
- Formulário existente preservado, com próximos passos, exemplo de descrição
  e alternativa para abrir o formulário em outra aba.
- Resumo copiável no recomendador de planos. O quadro “Contexto da sua avaliação”
  da home e o armazenamento que o alimentava foram retirados na revisão.
- Telefone comercial retirado do texto visível; WhatsApp flutuante preservado
  também na área do formulário. O campo para o visitante informar seu telefone
  permanece no formulário de solicitação.
- Simulador de custo manual retirado da home a pedido, junto com sua pergunta
  de FAQ e o código exclusivo da funcionalidade.
- Fluxos específicos com telas existentes nas páginas de laser, médica,
  construção e eletrônicos, com critérios para preparar a demonstração.
- Blog com sete famílias editoriais, preservando temas antigos como tags, artigos,
  URLs e datas. Autoria institucional identificada e campo de ferramenta removido
  do nome de uma autora, preservando o nome já publicado.
- Próximo passo contextual em todos os artigos, metadados de organização corretos
  para autoria institucional e nota editorial sem alegar revisão não realizada.
- FAQ canônica atualizada, mantendo somente a primeira pergunta aberta.
- Hierarquia visual, tipografia sem serifa, foco visível, ajustes móveis e
  preferência por movimento reduzido.

## Medição implementada no site

| Evento | O que comprova |
| --- | --- |
| `demo_cta_click` | Clique que leva à solicitação; informa posição na página |
| `demo_section_view` | Seção de contato entrou na área visível |
| `demo_form_ready` | Iframe conhecido anunciou readiness no protocolo vigente |
| `demo_form_external_open` | Clique para abrir o formulário em outra aba |
| `whatsapp_click` | Clique no link de WhatsApp, sem comprovar conversa iniciada |
| `plan_recommendation` | Resultado de uma recomendação após respostas válidas |
| `plan_comparison_change` | Alteração de plano visível ou filtro de diferenças |
| `product_tour_step` | Navegação deliberada para uma etapa do tour |

Os eventos próprios não carregam nome, e-mail, telefone, texto livre, URL completa
com parâmetros. Não foi alterado o contêiner GTM externo.
Readiness verifica origem e janela do iframe e não significa lead recebido.

## Dependências que exigem dados ou acesso externo

1. **Casos de clientes, depoimentos e fotos novas:** faltam materiais e autorização.
   Foram mantidas apenas as marcas, telas e provas já existentes. Não há casos,
   estrelas, autores, fotografias ou resultados fictícios.
2. **Números e alegações comerciais:** confirmar internamente a fonte e a data de
   referência de 420 mil locações/21 mil locatários e o alcance de parcerias
   exclusivas. Os números existentes foram preservados. O destaque “mais escolhido”
   foi substituído por “para integrar”, que descreve o perfil do Pro.
3. **Vigência promocional e compromissos de atendimento:** dependem das condições
   comerciais reais. Não foram definidos prazos, SLA, duração de reunião ou regras
   de renovação sem informação confirmada.
4. **Campos e confirmação do formulário externo:** pertencem ao aplicativo, não
   ao site estático. O protocolo vigente informa readiness/tema, sem confirmação
   de lead salvo. Para medir `generate_lead`, o aplicativo precisa confirmar a
   persistência real, fornecer um identificador de evento para deduplicação e
   comunicar um resultado sem dados pessoais. O hospedeiro deve validar origem e
   janela. Não há listener de sucesso fictício nesta implementação.
5. **Qualificação, reunião realizada, oportunidades e vendas:** exigem integração
   e auditoria no CRM e GTM/GA4. Planejar a ligação por identificador controlado no
   ambiente comercial, preservando dados pessoais fora de analytics.
6. **Pesquisa com compradores e testes de conversão:** precisam de participantes,
   baseline e tráfego. A validação técnica desta entrega não mede ganho de vendas.
7. **Core Web Vitals em campo:** dependem de dados de produção/CrUX. A implementação
   preserva lazy loading e dimensões das telas; o tour não inicia vídeo automático.

## Validação

Ver resultados ao final da especificação `docs/specs/evolucao-comercial-2026-11.md`.

## Revisão de foco comercial

Retirados os blocos “Nesta página” de todas as páginas, o quadro de contexto da
home e o número comercial impresso. Permanecem chamadas de conversão, formulário,
e-mail, WhatsApp e dados estruturados legítimos. As âncoras de conteúdo continuam
disponíveis para links internos e externos. Ver `docs/specs/ajustes-foco-conversao-2026-11.md`.
