(function () {
  function rootPrefix() {
    return window.location.pathname.indexOf('/blog/') !== -1 ? '../' : '';
  }
  function link(href) {
    return rootPrefix() + href;
  }
  function markup() {
    return (
      '<footer class="site-footer"><div class="container"><div class="row g-4"><div class="col-lg-4"><a class="site-brand" style="color:#fff" href="' +
      link('index.html') +
      '"><img src="' +
      link('assets/img/icons/simbolo.svg') +
      '" width="25" height="30" alt=""><span>Sistema Laser<sup>®</sup></span></a><p class="mt-3">Software para gestão de locação de equipamentos, aperfeiçoado há mais de 20 anos por quem entende de logística.</p><div class="footer-other mt-4"><h3>Outras soluções</h3><a class="footer-other-link" href="https://www.ebrain.clinic" target="_blank" rel="noopener">ebrain.clinic ↗</a></div></div><div class="col-6 col-lg-2"><h3>Plataforma</h3><a href="' +
      link('erp-locadora.html') +
      '">ERP para locadora</a><a href="' +
      link('crm.html') +
      '">CRM completo</a><a href="' +
      link('sistema-financeiro-locadora.html') +
      '">Sistema financeiro</a><a href="' +
      link('assinatura-eletronica.html') +
      '">Assinatura eletrônica</a><a href="' +
      link('lila-whatsapp.html') +
      '">LILA e WhatsApp</a><a href="' +
      link('funcionalidades.html#rede') +
      '">Parceiros</a><a href="' +
      link('integracoes.html') +
      '">Integrações</a><a href="' +
      link('funcionalidades.html') +
      '">Funcionalidades</a><a href="' +
      link('nota-fiscal-eletronica.html') +
      '">Nota Fiscal</a></div><div class="col-6 col-lg-2"><h3>Soluções</h3><a href="' +
      link('locadora-laser.html') +
      '">Locadora de laser</a><a href="' +
      link('software-locadora-medica.html') +
      '">Locadora médica</a><a href="' +
      link('software-locadora-construcao.html') +
      '">Construção civil</a><a href="' +
      link('software-locadora-eletronicos.html') +
      '">Equipamentos eletrônicos</a><a href="' +
      link('planos.html') +
      '">Planos e preços</a></div><div class="col-6 col-lg-2"><h3>Empresa</h3><a href="' +
      link('blog.html') +
      '">Blog</a><a href="' +
      link('faq.html') +
      '">Perguntas frequentes</a><a href="' +
      link('jobs.html') +
      '">Trabalhe conosco</a><a href="' +
      link('whatsapp.html') +
      '">Meta Partner</a><a class="footer-social-link" href="https://www.instagram.com/meusistemalaser" target="_blank" rel="me noopener"><svg class="footer-social-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M7.2 2h9.6A5.2 5.2 0 0 1 22 7.2v9.6a5.2 5.2 0 0 1-5.2 5.2H7.2A5.2 5.2 0 0 1 2 16.8V7.2A5.2 5.2 0 0 1 7.2 2Zm-.17 2A3.03 3.03 0 0 0 4 7.03v9.94A3.03 3.03 0 0 0 7.03 20h9.94A3.03 3.03 0 0 0 20 16.97V7.03A3.03 3.03 0 0 0 16.97 4H7.03ZM18.5 5.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg><span>@meusistemalaser</span></a></div><div class="col-6 col-lg-2"><h3>Legal</h3><a href="' +
      link('termos-uso.html') +
      '">Termos de Uso</a><a href="' +
      link('termos-privacidade.html') +
      '">Privacidade</a></div></div><div class="footer-bottom">© 2005–2026 Sistema Laser® · Aliasoft Ltda. · CNPJ 54.344.272/0001-38 · INPI BR512019003013-3</div></div></footer>'
    );
  }
  function render() {
    var current = document.querySelector('body > footer');
    if (current) current.remove();
    var floatingAction = document.querySelector('.whatsapp-fab');
    if (floatingAction) {
      floatingAction.insertAdjacentHTML('beforebegin', markup());
    } else {
      document.body.insertAdjacentHTML('beforeend', markup());
    }
  }
  document.addEventListener('DOMContentLoaded', render);
})();
