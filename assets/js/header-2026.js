(function () {
  function rootPrefix() {
    var path = window.location.pathname;
    return path.indexOf('/blog/') !== -1 ? '../' : '';
  }
  function link(href) {
    return rootPrefix() + href;
  }
  function markup() {
    return (
      '<nav class="navbar navbar-expand-lg site-nav fixed-top" aria-label="Navegação principal"><div class="container"><a class="site-brand" href="' +
      link('index.html') +
      '"><img src="' +
      link('assets/img/icons/simbolo.svg') +
      '" width="28" height="34" alt=""><span>Sistema Laser<sup>®</sup></span></a><button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#siteMenu" aria-controls="siteMenu" aria-expanded="false" aria-label="Abrir menu"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse" id="siteMenu"><ul class="navbar-nav ms-auto align-items-lg-center"><li class="nav-item"><a class="nav-link" href="' +
      link('funcionalidades.html') +
      '" data-section="funcionalidades">Funcionalidades</a></li><li class="nav-item"><a class="nav-link" href="' +
      link('crm.html') +
      '">CRM</a></li><li class="nav-item"><a class="nav-link" href="' +
      link('sistema-financeiro-locadora.html') +
      '">Financeiro</a></li><li class="nav-item"><a class="nav-link" href="' +
      link('solucoes-locadoras.html') +
      '">Soluções</a></li><li class="nav-item"><a class="nav-link" href="' +
      link('integracoes.html') +
      '" data-section="integracoes">Integrações</a></li><li class="nav-item"><a class="nav-link" href="' +
      link('planos.html') +
      '">Planos</a></li><li class="nav-item"><a class="nav-link" href="' +
      link('blog.html') +
      '" data-section="blog">Blog</a></li></ul><div class="theme-control ms-lg-2" role="group" aria-label="Aparência"><button type="button" data-theme-set="light" aria-label="Tema claro">☀</button><button type="button" data-theme-set="dark" aria-label="Tema escuro">☾</button><button type="button" data-theme-set="auto" aria-label="Tema automático">◐</button></div><a class="btn btn-surface ms-lg-2" href="https://app.sistemalaser.com.br" target="_blank" rel="noopener">Entrar</a><a class="btn btn-primary ms-lg-2" href="' +
      link('index.html#demonstracao') +
      '">Ver demonstração</a></div></div></nav>'
    );
  }
  function render() {
    var current = document.querySelector('body > nav.navbar');
    if (current) current.remove();
    document.body.insertAdjacentHTML('afterbegin', markup());
    var page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.site-nav .nav-link').forEach(function (link) {
      var href = link.getAttribute('href').split('/').pop();
      if (
        href === page ||
        (link.dataset.section === 'funcionalidades' &&
          page === 'assinatura-eletronica.html') ||
        (link.dataset.section === 'integracoes' &&
          page === 'lila-whatsapp.html') ||
        (link.dataset.section === 'blog' &&
          window.location.pathname.indexOf('/blog/') !== -1)
      ) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
    var demoLink = document.querySelector(
      '.site-nav a[href$="index.html#demonstracao"]',
    );
    var menu = document.getElementById('siteMenu');
    var toggler = document.querySelector('.site-nav .navbar-toggler');
    if (demoLink && menu && toggler) {
      demoLink.addEventListener('click', function (event) {
        if (!document.getElementById('demonstracao')) {
          event.preventDefault();
          window.location.href = demoLink.href;
          return;
        }
        if (!window.matchMedia('(max-width: 991.98px)').matches) return;
        if (window.bootstrap && window.bootstrap.Collapse) {
          window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
        } else {
          menu.classList.remove('show');
          toggler.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }
  document.addEventListener('DOMContentLoaded', render);
})();
