const escape = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');

export function renderTour() {
  const steps = [
    [
      'agenda',
      'Disponibilidade',
      'Antes de confirmar, consulte a agenda.',
      'Veja equipamentos, períodos, clientes e responsáveis no mesmo calendário. Comece pela disponibilidade que sua operação precisa conferir.',
      'sll-locacoes-calendario.webp',
      3714,
      2596,
      'erp-locadora.html',
      'Conhecer a agenda',
    ],
    [
      'locacao',
      'Locação',
      'Leve as informações para o contrato.',
      'Associe cliente, equipamentos, período e condições à locação. Consulte os documentos no contexto do atendimento.',
      'sll-locacoes-contrato-1280.webp',
      1280,
      910,
      'erp-locadora.html',
      'Conhecer o fluxo de locação',
    ],
    [
      'documentos',
      'Documentos',
      'Acompanhe a formalização.',
      'Consulte documentos e assinaturas vinculados à operação. Os recursos e as condições dos serviços integrados variam conforme o plano.',
      'sll-documento-assinatura.webp',
      3776,
      2886,
      'assinatura-eletronica.html',
      'Ver documentos e assinatura',
    ],
    [
      'recebimento',
      'Recebimento',
      'Saiba o que falta receber.',
      'Consulte parcelas, vencimentos e recebimentos. Integrações de cobrança conectam a confirmação do pagamento ao financeiro nos planos compatíveis.',
      'sll-financeiro-dashboard-1280.webp',
      1280,
      1077,
      'sistema-financeiro-locadora.html',
      'Conhecer o financeiro',
    ],
  ];
  return `<section class="section-space product-tour" id="como-funciona" aria-labelledby="tour-title"><div class="container"><div class="editorial-heading"><div><span class="eyebrow">Conheça antes de conversar</span><h2 class="section-title" id="tour-title">Da disponibilidade ao recebimento.</h2></div><p>Explore um percurso ilustrado com telas reais. Cada etapa conecta informações que sua equipe usa no dia a dia.</p></div><nav class="tour-navigation" aria-label="Etapas do percurso">${steps.map(([id, label], i) => `<a href="#tour-${id}" data-tour-tab><span>0${i + 1}</span>${label}</a>`).join('')}</nav><div class="tour-panels">${steps.map(([id, label, title, copy, file, width, height, href, cta], i) => `<article class="tour-panel" id="tour-${id}" data-tour-panel><div class="tour-copy"><span class="eyebrow">Etapa ${i + 1} · ${label}</span><h3>${title}</h3><p>${copy}</p><a href="${href}">${cta} →</a><p class="legal-note mt-3">Clique na tela para ampliar e explorar a galeria.</p></div><div class="tour-screen"><img src="assets/img/sistema/${file}" width="${width}" height="${height}" loading="lazy" alt="${escape(label)} no Sistema Laser"></div></article>`).join('')}</div><p class="tour-status visually-hidden" aria-live="polite"></p><div class="tour-footer"><p>Quer ver esse fluxo com os desafios da sua locadora?</p><a class="btn btn-primary" href="#demonstracao">Solicitar demonstração</a></div></div></section>`;
}

export function renderPaths() {
  const paths = [
    [
      '01',
      'Organizar reservas e entregas',
      'Disponibilidade, equipamentos, responsáveis e histórico da locação.',
      'erp-locadora.html',
      'Ver agenda e locações',
    ],
    [
      '02',
      'Conectar vendas e recebimentos',
      'Acompanhe propostas, documentos e cobranças na mesma operação.',
      'crm.html',
      'Ver CRM e vendas',
    ],
    [
      '03',
      'Trocar de sistema',
      'Entenda a migração gratuita dos dados compatíveis e prepare a transição.',
      '#planejar-migracao',
      'Planejar a mudança',
    ],
    [
      '04',
      'Estruturar uma operação maior',
      'Filiais, parceiros, integrações ou infraestrutura com necessidades próprias.',
      'planos.html#custom-plan-title',
      'Avaliar minha estrutura',
    ],
  ];
  return `<section class="section-space surface-section" id="necessidades"><div class="container"><div class="editorial-heading"><div><span class="eyebrow">Comece pela sua rotina</span><h2 class="section-title">O que precisa funcionar melhor hoje?</h2></div><p>Escolha um ponto de partida. Os recursos completos continuam disponíveis para você aprofundar a avaliação.</p></div><div class="need-paths">${paths.map(([number, title, copy, href, label]) => `<article class="need-path"><span class="path-number">${number}</span><h3>${title}</h3><p>${copy}</p><a href="${href}">${label} →</a></article>`).join('')}</div></div></section>`;
}

export function renderMigration() {
  return `<section class="section-space migration-preview" id="planejar-migracao"><div class="container"><div class="row g-5 align-items-start"><div class="col-lg-5"><span class="eyebrow">Migração gratuita</span><h2 class="section-title">Uma mudança planejada começa pelos seus dados.</h2><p class="section-lead">Importamos dados compatíveis exportados do sistema atual. A avaliação do material e o planejamento da transição ajudam sua equipe a entrar na nova rotina.</p><a class="btn btn-primary" href="#demonstracao" data-intent="migration">Conversar sobre minha migração</a></div><div class="col-lg-7"><ol class="migration-steps"><li><h3>Conte o que precisa trazer</h3><p>Apresente sua operação, o sistema atual e os dados que consegue exportar.</p></li><li><h3>Avalie a compatibilidade com a equipe</h3><p>Confira quais cadastros e informações podem ser importados, os formatos disponíveis e os pontos que precisam de preparação.</p></li><li><h3>Planeje a entrada em uso</h3><p>Combine o caminho da transição e esclareça como sua equipe será orientada. Suporte gratuito incluído no plano.</p></li></ol><a href="#migracao-detalhes">Ver todas as informações sobre migração e evolução ↓</a></div></div></div></section>`;
}

const segmentJourneys = {
  'software-locadora-construcao.html': {
    title: 'Da saída à devolução, com registros para consultar.',
    copy: 'Use o atendimento de uma obra como ponto de partida: confira o período, identifique os equipamentos e reúna as evidências da entrega e do retorno.',
    file: 'sll-locacoes-fotos-1280.webp',
    width: 1280,
    height: 979,
    steps: [
      [
        'Antes da entrega',
        'Consulte disponibilidade, cliente, endereço e responsáveis. Registre condições e equipamentos na locação.',
      ],
      [
        'Na entrega e no retorno',
        'Reúna fotos, protocolos e assinaturas vinculados ao atendimento para consultar o estado registrado dos equipamentos.',
      ],
      [
        'No acompanhamento',
        'Relacione a operação ao financeiro e consulte o histórico antes de preparar a próxima locação.',
      ],
    ],
    related: 'erp-locadora.html',
    label: 'Ver agenda e protocolos',
    alt: 'Fotos e registros vinculados à locação de equipamentos',
  },
  'software-locadora-medica.html': {
    title: 'Um histórico para acompanhar cada atendimento.',
    copy: 'Uma locação para uma clínica reúne equipamento, período, responsáveis e documentos. Mantenha esses registros no contexto da operação, da reserva à devolução.',
    file: 'sll-locacoes-contrato-1280.webp',
    width: 1280,
    height: 910,
    steps: [
      [
        'Na reserva',
        'Confira equipamento, cliente, período e disponibilidade antes de confirmar o atendimento.',
      ],
      [
        'Na formalização',
        'Vincule documentos e assinaturas à locação e consulte os responsáveis pelo processo.',
      ],
      [
        'No retorno',
        'Reúna protocolos, fotos e histórico. Consulte manutenção e disponibilidade ao preparar o próximo atendimento.',
      ],
    ],
    related: 'assinatura-eletronica.html',
    label: 'Ver documentos e assinatura',
    alt: 'Documentos e informações vinculados a uma locação',
  },
  'software-locadora-eletronicos.html': {
    title: 'Equipamentos e acessórios no contexto do contrato.',
    copy: 'Em um atendimento corporativo, acompanhe os itens locados, seus acessórios e os documentos, sem separar o histórico da operação do financeiro.',
    file: 'sll-locacoes-multiplos-modelos.webp',
    width: 4090,
    height: 3292,
    steps: [
      [
        'Prepare os itens',
        'Confira os equipamentos e acessórios previstos, o cliente e o período de uso.',
      ],
      [
        'Acompanhe o contrato',
        'Consulte condições, documentos e parcelas vinculados à locação. Avalie os recursos de recorrência dos planos compatíveis.',
      ],
      [
        'Consulte o histórico',
        'Registre o retorno e consulte manutenção e evidências antes de uma nova locação.',
      ],
    ],
    related: 'estoque-produtos.html',
    label: 'Ver produtos e estoque',
    alt: 'Múltiplos equipamentos e modelos na locação',
  },
  'sistema-locadora-laser.html': {
    title: 'Do aparelho à ponteira, acompanhe a operação.',
    copy: 'Uma locação de laser envolve mais do que datas: modelos, ponteiras, kits, disparos e condições de atendimento precisam acompanhar o aparelho.',
    file: 'sll-locacoes-fotos-1280.webp',
    width: 1280,
    height: 979,
    steps: [
      [
        'Confira a composição',
        'Relacione equipamento, kits e ponteiras ao atendimento e consulte disponibilidade.',
      ],
      [
        'Registre a execução',
        'Reúna protocolos e evidências e acompanhe os registros de uso previstos na sua rotina.',
      ],
      [
        'Feche o atendimento',
        'Consulte os documentos, valores e histórico da locação para preparar cobrança e próximo atendimento.',
      ],
    ],
    related: 'erp-locadora.html',
    label: 'Ver a gestão de locações',
    alt: 'Registros e fotos de equipamentos vinculados à locação de laser',
  },
};
segmentJourneys['locadora-laser.html'] =
  segmentJourneys['sistema-locadora-laser.html'];

export function renderSegmentJourney(page) {
  const item = segmentJourneys[page];
  if (!item) return '';
  return `<section class="section-space segment-journey"><div class="container"><div class="row g-5 align-items-center"><div class="col-lg-6"><span class="eyebrow">Uma rotina, passo a passo</span><h2 class="section-title">${item.title}</h2><p class="section-lead">${item.copy}</p><ol class="migration-steps">${item.steps.map(([title, copy]) => `<li><h3>${title}</h3><p>${copy}</p></li>`).join('')}</ol><a href="${item.related}">${item.label} →</a></div><div class="col-lg-6"><div class="media-panel"><img src="assets/img/sistema/${item.file}" width="${item.width}" height="${item.height}" loading="lazy" alt="${item.alt}"></div><p class="screen-caption">Tela real do sistema. Clique para ampliar.</p></div></div><div class="segment-decision"><h3>O que conferir na demonstração</h3><p>Traga um exemplo da sua rotina: quantidade de equipamentos e usuários, documentos utilizados e integrações necessárias. A equipe apresenta os recursos e esclarece limites e condições do plano.</p><a class="btn btn-primary" href="index.html#demonstracao">Solicitar demonstração para minha operação</a><a class="btn btn-surface" href="planos.html">Comparar planos</a></div></div></section>`;
}

export function renderArticleNextStep(post) {
  const groups = {
    Operação: [
      'erp-locadora.html',
      'agenda e locações',
      'Confira disponibilidade, atendimento e histórico em uma única operação.',
    ],
    Financeiro: [
      'sistema-financeiro-locadora.html',
      'financeiro e cobranças',
      'Conheça como vencimentos, recebimentos e cobranças se conectam às locações.',
    ],
    Comercial: [
      'crm.html',
      'CRM e vendas',
      'Explore propostas, tarefas e acompanhamento das oportunidades.',
    ],
    Equipamentos: [
      'estoque-produtos.html',
      'produtos e estoque',
      'Veja os registros de equipamentos, produtos, movimentações e manutenção.',
    ],
    Documentos: [
      'assinatura-eletronica.html',
      'documentos e assinatura',
      'Conheça a formalização de documentos e as condições dos serviços integrados.',
    ],
    Integrações: [
      'integracoes.html',
      'integrações',
      'Veja as conexões disponíveis e a API para sistemas e agentes.',
    ],
    'Produto e novidades': [
      'funcionalidades.html',
      'plataforma',
      'Confira os recursos e encontre o que faz sentido para sua operação.',
    ],
  };
  const [href, label, copy] =
    groups[post.category] || groups['Produto e novidades'];
  return `<aside class="article-next-step" aria-labelledby="article-next-title"><div class="container"><span class="eyebrow">Da leitura à sua operação</span><h2 id="article-next-title">Veja ${label} no Sistema Laser.</h2><p>${copy}</p><div class="hero-actions"><a class="btn btn-primary" href="../${href}">Explorar ${label}</a><a class="btn btn-surface" href="../index.html#demonstracao">Solicitar demonstração</a></div><p class="legal-note mt-3">Recursos, limites e condições comerciais: <a href="../planos.html">consulte os planos</a>.</p></div></aside>`;
}

export function applyCommercialComponents(html, page) {
  const components = {
    tour: renderTour,
    paths: renderPaths,
    migration: renderMigration,
  };
  html = html.replace(/<!-- commercial:(tour|paths|migration) -->/g, (_, key) =>
    components[key](),
  );
  if (segmentJourneys[page])
    html = html.replace('</main>', renderSegmentJourney(page) + '</main>');
  return html;
}
