(function () {
  // Deep links remain useful even when the target is inside a closed disclosure.
  function revealTarget() {
    var id;
    try {
      id = decodeURIComponent(window.location.hash.slice(1));
    } catch (_) {
      return;
    }
    var target = id && document.getElementById(id);
    if (!target) return;
    var ancestor = target;
    while (ancestor) {
      if (ancestor.tagName === 'DETAILS') ancestor.open = true;
      ancestor = ancestor.parentElement;
    }
    var detail =
      target.classList.contains('product-detail') &&
      target.querySelector('details');
    if (detail) detail.open = true;
    window.requestAnimationFrame(function () {
      target.scrollIntoView({ block: 'start' });
    });
  }
  document.addEventListener('DOMContentLoaded', function () {
    revealTarget();
    window.addEventListener('hashchange', revealTarget);
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function () {
        if (link.hash === window.location.hash) revealTarget();
      });
    });
    var advisor = document.getElementById('plan-advisor');
    if (advisor) {
      var size = document.getElementById('advisor-size');
      var needs = document.getElementById('advisor-needs');
      function recommend(interactive) {
        var plan =
          size.value === 'master' || needs.value === 'master'
            ? 'Master'
            : size.value === 'pro' || needs.value === 'pro'
              ? 'Pro'
              : 'Starter';
        document.getElementById('advisor-plan').textContent = plan;
        document.getElementById('advisor-reason').textContent = {
          Starter:
            'Até 8 equipamentos e 3 usuários, com agenda, financeiro e dashboards para organizar a operação.',
          Pro: 'Até 15 equipamentos e 7 usuários, com CRM, cobranças, estoque, contratos e integrações.',
          Master:
            'Equipamentos e usuários ilimitados, com filiais, parceiros e automação de WhatsApp com a LILA.',
        }[plan];
        document.getElementById('advisor-link').href = '#' + plan.toLowerCase();
        window.dataLayer = window.dataLayer || [];
        if (interactive)
          window.dataLayer.push({
            event: 'plan_recommendation',
            recommended_plan: plan,
          });
      }
      size.addEventListener('change', function () {
        recommend(true);
      });
      needs.addEventListener('change', function () {
        recommend(true);
      });
      advisor.hidden = false;
      recommend();
    }
    document
      .querySelectorAll(
        'a[href*="index.html#demonstracao"], a[href="#demonstracao"]',
      )
      .forEach(function (link) {
        link.addEventListener('click', function () {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: 'demo_cta_click',
            page_path: window.location.pathname,
          });
        });
      });
  });
})();
