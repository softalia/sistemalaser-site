(function () {
  'use strict';
  const planNames = { starter: 'Starter', pro: 'Pro', master: 'Master' };
  const track = (event, values = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, page_path: location.pathname, ...values });
  };
  async function copyText(button, value) {
    const label = button.textContent;
    clearTimeout(button.copyTimer);
    try {
      await navigator.clipboard.writeText(value);
      button.textContent = 'Copiado!';
    } catch (_) {
      button.textContent = 'Não foi possível copiar. Tente novamente.';
    }
    button.copyTimer = setTimeout(() => {
      button.textContent = button.dataset.copyLabel || label;
    }, 3000);
    button.dataset.copyLabel = button.dataset.copyLabel || label;
  }
  function setupTour() {
    const tour = document.querySelector('.product-tour');
    if (!tour) return;
    const links = [...tour.querySelectorAll('[data-tour-tab]')];
    const panels = [...tour.querySelectorAll('[data-tour-panel]')];
    tour.querySelector('.tour-navigation').setAttribute('role', 'tablist');
    links.forEach((link, i) => {
      link.id = 'tour-tab-' + i;
      link.setAttribute('role', 'tab');
      link.setAttribute('aria-controls', panels[i].id);
      panels[i].setAttribute('role', 'tabpanel');
      panels[i].setAttribute('aria-labelledby', link.id);
      panels[i].tabIndex = 0;
    });
    function select(index, interactive = false) {
      links.forEach((link, i) => {
        link.setAttribute('aria-selected', String(index === i));
        link.tabIndex = index === i ? 0 : -1;
        panels[i].hidden = index !== i;
      });
      if (interactive) {
        history.replaceState(null, '', links[index].hash);
        tour.querySelector('.tour-status').textContent =
          `Etapa ${index + 1} de ${links.length}: ${links[index].textContent.trim()}`;
        track('product_tour_step', { step: index + 1 });
      }
    }
    links.forEach((link, i) => {
      link.addEventListener('click', (event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
          return;
        event.preventDefault();
        select(i, true);
      });
      link.addEventListener('keydown', (event) => {
        let next = i;
        if (event.key === 'ArrowRight') next = (i + 1) % links.length;
        else if (event.key === 'ArrowLeft')
          next = (i + links.length - 1) % links.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = links.length - 1;
        else return;
        event.preventDefault();
        select(next, true);
        links[next].focus();
      });
    });
    const fromHash = () => {
      const index = links.findIndex((link) => link.hash === location.hash);
      if (index >= 0) select(index);
    };
    select(0);
    fromHash();
    window.addEventListener('hashchange', fromHash);
  }
  function setupAdvisor() {
    const advisor = document.getElementById('plan-advisor');
    if (!advisor) return;
    const equipment = document.getElementById('advisor-equipment');
    const users = document.getElementById('advisor-users');
    const needs = document.getElementById('advisor-needs');
    const title = document.getElementById('advisor-plan');
    const reason = document.getElementById('advisor-reason');
    const link = document.getElementById('advisor-link');
    const demo = document.getElementById('advisor-demo');
    const copy = document.querySelector('[data-copy-advisor]');
    let summary = '',
      lastPlan = '';
    const validQuantity = (input) =>
      input.value !== '' &&
      input.validity.valid &&
      Number.isInteger(Number(input.value));
    function recommend() {
      const valid =
        validQuantity(equipment) &&
        validQuantity(users) &&
        ['starter', 'pro', 'master'].includes(needs.value);
      link.hidden = demo.hidden = copy.hidden = !valid;
      if (!valid) {
        title.textContent = 'Vamos encontrar seu plano.';
        reason.textContent =
          'Informe quantidades inteiras, a partir de 1, e selecione os recursos para receber uma sugestão.';
        summary = '';
        lastPlan = '';
        return;
      }
      const count = Number(equipment.value),
        people = Number(users.value);
      const plan =
        count > 15 || people > 7 || needs.value === 'master'
          ? 'master'
          : count > 8 || people > 3 || needs.value === 'pro'
            ? 'pro'
            : 'starter';
      const limits = {
        starter: 'Até 8 equipamentos e 3 usuários, com agenda e financeiro.',
        pro: 'Até 15 equipamentos e 7 usuários, com CRM, cobranças, estoque, documentos e API.',
        master:
          'Equipamentos e usuários ilimitados, com filiais, parceiros e automação com a LILA.',
      };
      title.textContent = planNames[plan];
      reason.textContent = `Para ${count} equipamentos e ${people} usuários, considerando os recursos escolhidos. ${limits[plan]} Confira os detalhes e as condições dos serviços integrados.`;
      link.href = '#' + plan;
      demo.href = `index.html?plano=${plan}#demonstracao`;
      summary = `Minha avaliação no Sistema Laser: ${count} equipamentos, ${people} usuários. Recursos: ${needs.selectedOptions[0].textContent.trim()}. Plano sugerido: ${planNames[plan]}. Confira recursos e condições em https://www.sistemalaser.com.br/planos.html#${plan}`;
      if (plan !== lastPlan)
        track('plan_recommendation', { recommended_plan: planNames[plan] });
      lastPlan = plan;
    }
    [equipment, users, needs].forEach((input) =>
      input.addEventListener('input', recommend),
    );
    copy.addEventListener('click', () => {
      if (summary) copyText(copy, summary);
    });
    advisor.hidden = false;
  }
  function setupComparison() {
    const region = document.querySelector('[data-plan-comparison]');
    if (!region) return;
    const controls = document.querySelector('[data-comparison-controls]');
    const select = document.getElementById('comparison-plan');
    const differences = document.getElementById('comparison-differences');
    const rows = [...region.querySelectorAll('tbody tr')];
    const params = new URLSearchParams(location.search);
    const choice = params.get('comparacao');
    select.value = ['all', '1', '2', '3'].includes(choice)
      ? choice
      : matchMedia('(max-width: 700px)').matches
        ? '2'
        : 'all';
    differences.checked = params.get('diferencas') === '1';
    function update(interactive = false) {
      const column = select.value === 'all' ? null : Number(select.value);
      region.dataset.selectedPlan = select.value;
      region.querySelectorAll('thead tr').forEach((row) =>
        [...row.children].forEach((cell, i) => {
          cell.hidden = column !== null && i > 0 && i !== column;
        }),
      );
      let group = null,
        groupVisible = false,
        visible = 0;
      for (const row of rows) {
        if (row.classList.contains('category')) {
          if (group) group.hidden = !groupVisible;
          group = row;
          groupVisible = false;
          row.firstElementChild.colSpan = column === null ? 4 : 2;
        } else {
          const cells = [...row.children];
          const values = cells
            .slice(1)
            .map((cell) => cell.textContent.trim().replace(/\s+/g, ' '));
          row.hidden =
            differences.checked && values.every((value) => value === values[0]);
          cells.forEach((cell, i) => {
            cell.hidden = column !== null && i > 0 && i !== column;
          });
          if (!row.hidden) {
            groupVisible = true;
            visible++;
          }
        }
      }
      if (group) group.hidden = !groupVisible;
      document.querySelector('[data-comparison-status]').textContent =
        `${visible} recursos exibidos. ${column === null ? 'Todos os planos.' : 'Plano ' + select.selectedOptions[0].textContent + '.'}`;
      if (interactive)
        track('plan_comparison_change', {
          comparison_plan: select.selectedOptions[0].textContent,
          differences_only: differences.checked,
        });
    }
    select.addEventListener('change', () => update(true));
    differences.addEventListener('change', () => update(true));
    const copy = document.querySelector('[data-share-plans]');
    copy.addEventListener('click', () => {
      const url = new URL('https://www.sistemalaser.com.br/planos.html');
      url.searchParams.set('comparacao', select.value);
      if (differences.checked) url.searchParams.set('diferencas', '1');
      url.hash = 'comparacao';
      copyText(copy, url.href);
    });
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          document.body.classList.toggle(
            'comparison-is-visible',
            entries.some((entry) => entry.isIntersecting),
          );
        },
        { threshold: 0 },
      );
      observer.observe(region);
    }
    controls.hidden = false;
    document.querySelector('.comparison-hint').textContent =
      'No celular, escolha um plano para ler todos os recursos sem rolar para os lados. Selecione Todos os planos para acessar a tabela completa.';
    update();
  }
  function setupContact() {
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href]');
      if (!link) return;
      let url;
      try {
        url = new URL(link.href, location.href);
      } catch (_) {
        return;
      }
      const targetPage = url.pathname.split('/').pop();
      if (
        (targetPage === 'index.html' || targetPage === '') &&
        url.hash === '#demonstracao' &&
        url.origin === location.origin
      ) {
        track('demo_cta_click', {
          cta_location: link.closest('nav')
            ? 'header'
            : link.closest('header')
              ? 'hero'
              : 'content',
        });
      }
      if (['api.whatsapp.com', 'wa.me'].includes(url.hostname))
        track('whatsapp_click', {
          contact_intent:
            link.dataset.intent === 'migration' ? 'migration' : 'information',
        });
      if (link.hasAttribute('data-form-external'))
        track('demo_form_external_open');
    });
    const ready = new WeakSet();
    window.addEventListener('message', (event) => {
      if (
        event.data?.type !== 'sll-public-form:ready' ||
        event.data.version !== 1
      )
        return;
      document
        .querySelectorAll('iframe[data-sll-public-form]')
        .forEach((iframe) => {
          if (
            iframe.contentWindow === event.source &&
            event.origin === iframe.dataset.sllPublicFormOrigin &&
            !ready.has(iframe)
          ) {
            ready.add(iframe);
            track('demo_form_ready');
          }
        });
    });
    const form = document.querySelector('#demonstracao');
    if (form && 'IntersectionObserver' in window) {
      let viewed = false;
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.some((entry) => entry.isIntersecting);
          if (visible && !viewed) {
            track('demo_section_view');
            viewed = true;
          }
        },
        { threshold: 0 },
      );
      observer.observe(form);
    }
  }
  document.addEventListener('DOMContentLoaded', () => {
    setupTour();
    setupAdvisor();
    setupComparison();
    setupContact();
  });
})();
