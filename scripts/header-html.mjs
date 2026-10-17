const groups = [
  [
    'Plataforma',
    [
      ['funcionalidades.html', 'Visão completa'],
      ['erp-locadora.html', 'Agenda e locações'],
      ['crm.html', 'CRM e vendas'],
      ['sistema-financeiro-locadora.html', 'Financeiro e cobranças'],
      ['estoque-produtos.html', 'Produtos e estoque'],
      ['assinatura-eletronica.html', 'Documentos e assinatura'],
      ['nota-fiscal-eletronica.html', 'Nota fiscal'],
      ['lila-whatsapp.html', 'LILA e WhatsApp'],
      ['integracoes.html', 'Integrações e API'],
    ],
  ],
  [
    'Segmentos',
    [
      ['locadora-laser.html', 'Laser e estética'],
      ['software-locadora-medica.html', 'Médicos e hospitalares'],
      ['software-locadora-construcao.html', 'Máquinas e construção'],
      ['software-locadora-eletronicos.html', 'Eletrônicos e outros ativos'],
    ],
  ],
  [
    'Conteúdos',
    [
      ['blog.html', 'Blog de gestão'],
      ['faq.html', 'Perguntas frequentes'],
    ],
  ],
];

export function renderHeader(prefix, page) {
  const link = ([href, label]) =>
    `<a href="${prefix}${href}"${href === page ? ' aria-current="page"' : ''}>${label}</a>`;
  const dropdown = ([label, links]) =>
    `<details class="nav-dropdown"><summary${links.some(([href]) => href === page) ? ' class="active"' : ''}>${label}<span aria-hidden="true">⌄</span></summary><div class="nav-dropdown-panel">${links.map(link).join('')}</div></details>`;
  return `<nav class="navbar site-nav fixed-top" aria-label="Navegação principal"><div class="container"><a class="site-brand" href="${prefix}index.html"><img src="${prefix}assets/img/icons/simbolo.svg" width="28" height="34" alt=""><span>Sistema Laser<sup>®</sup></span></a><button class="menu-toggle" type="button" aria-controls="siteMenu" aria-expanded="false">Menu <span aria-hidden="true">☰</span></button><div class="site-menu" id="siteMenu">${dropdown(groups[0])}${dropdown(groups[1])}<a class="nav-direct" href="${prefix}planos.html"${page === 'planos.html' ? ' aria-current="page"' : ''}>Planos</a>${dropdown(groups[2])}<div class="nav-actions"><div class="theme-control" role="group" aria-label="Aparência"><button type="button" data-theme-set="light" aria-label="Tema claro">☀</button><button type="button" data-theme-set="dark" aria-label="Tema escuro">☾</button><button type="button" data-theme-set="auto" aria-label="Tema automático">◐</button></div><a class="nav-login" href="https://app.sistemalaser.com.br" target="_blank" rel="noopener">Entrar ↗</a><a class="btn btn-primary" href="${prefix}index.html#demonstracao">Agendar demonstração <span aria-hidden="true">↗</span></a></div></div></div></nav>`;
}
