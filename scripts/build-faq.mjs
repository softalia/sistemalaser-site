import fs from 'node:fs';
import path from 'node:path';

const siteUrl = 'https://www.sistemalaser.com.br';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function jsonScript(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function readFaq(root) {
  const source = path.join(root, 'faq', 'faq.json');
  const data = JSON.parse(fs.readFileSync(source, 'utf8'));
  if (!Array.isArray(data.sections))
    throw new Error('faq/faq.json must include a sections array');

  const ids = new Set();
  for (const section of data.sections) {
    if (
      !section.id ||
      !section.name ||
      !Array.isArray(section.pages) ||
      !Array.isArray(section.questions)
    ) {
      throw new Error('Every FAQ section needs id, name, pages and questions');
    }
    for (const item of section.questions) {
      if (!item.id || !item.question || !item.answer)
        throw new Error(`Invalid FAQ item in ${section.id}`);
      if (ids.has(item.id)) throw new Error(`Duplicate FAQ id: ${item.id}`);
      ids.add(item.id);
    }
  }
  return data;
}

function renderAccordion(items, accordionId) {
  return `<div class="accordion accordion-flush" id="${escapeHtml(accordionId)}">${items
    .map((item, index) => {
      const id = `${accordionId}-${item.id}`;
      return `<div class="accordion-item"><h3 class="accordion-header"><button class="accordion-button${index ? ' collapsed' : ''}" type="button" data-bs-toggle="collapse" data-bs-target="#${escapeHtml(id)}" aria-expanded="${index ? 'false' : 'true'}">${escapeHtml(item.question)}</button></h3><div id="${escapeHtml(id)}" class="accordion-collapse collapse${index ? '' : ' show'}" data-bs-parent="#${escapeHtml(accordionId)}"><div class="accordion-body">${escapeHtml(item.answer)}</div></div></div>`;
    })
    .join('')}</div>`;
}

function pageFaqSection(section) {
  return `<section class="section-space surface-section" data-generated-faq="${escapeHtml(section.id)}"><div class="container"><div class="row g-5"><div class="col-lg-4"><span class="eyebrow">Perguntas frequentes</span><h2 class="section-title">Dúvidas sobre ${escapeHtml(section.name)}.</h2><p>Encontre respostas objetivas para os pontos mais consultados desta página.</p><a class="btn btn-surface" href="faq.html#${escapeHtml(section.id)}">Ver todas as perguntas</a></div><div class="col-lg-8">${renderAccordion(section.questions, `faq-${section.id}`)}</div></div></div></section>`;
}

function faqSchema(section, page) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${siteUrl}/${page}#faq`,
    mainEntity: section.questions.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

function removeFaqSchemas(html) {
  return html.replace(
    /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    (full, raw) => {
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        return full;
      }
      if (Array.isArray(data['@graph'])) {
        const graph = data['@graph'].filter(
          (entry) => entry['@type'] !== 'FAQPage',
        );
        if (graph.length === data['@graph'].length) return full;
        if (!graph.length) return '';
        return `<script type="application/ld+json">${jsonScript({ ...data, '@graph': graph })}</script>`;
      }
      return data['@type'] === 'FAQPage' ? '' : full;
    },
  );
}

function removeVisibleFaq(html) {
  return html.replace(/<section\b[\s\S]*?<\/section>/g, (section) =>
    section.includes('accordion') && /faq/i.test(section) ? '' : section,
  );
}

function faqPageHtml(data) {
  const all = data.sections.flatMap((section) =>
    section.questions.map((item) => ({
      ...item,
      section: section.id,
      sectionName: section.name,
    })),
  );
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        '@id': `${siteUrl}/faq.html#faqpage`,
        mainEntity: all.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${siteUrl}/faq.html#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Início',
            item: `${siteUrl}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Perguntas frequentes',
            item: `${siteUrl}/faq.html`,
          },
        ],
      },
    ],
  };

  return `<!doctype html>
<html lang="pt-BR" data-bs-theme="light" data-theme-preference="auto">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Perguntas frequentes | Sistema Laser</title>
  <meta name="description" content="Tire dúvidas sobre planos, CRM, agenda, locações, equipamentos, financeiro, contratos e integrações do Sistema Laser.">
  <link rel="canonical" href="${siteUrl}/faq.html">
  <meta property="og:type" content="website"><meta property="og:site_name" content="Sistema Laser"><meta property="og:url" content="${siteUrl}/faq.html"><meta property="og:title" content="Perguntas frequentes | Sistema Laser"><meta property="og:description" content="Respostas sobre a plataforma de gestão para locadoras de equipamentos."><meta property="og:image" content="${siteUrl}/assets/img/og-sistema-laser-2026.png">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="Perguntas frequentes | Sistema Laser"><meta name="twitter:description" content="Respostas sobre a plataforma de gestão para locadoras de equipamentos."><meta name="twitter:image" content="${siteUrl}/assets/img/og-sistema-laser-2026.png">
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f)})(window,document,'script','dataLayer','GTM-PPW847MH');</script><script async src="https://www.googletagmanager.com/gtag/js?id=G-WS5QS9LS8K"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-WS5QS9LS8K');</script>
  <link rel="icon" href="assets/img/icons/favicon-32x32.png"><link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css"><link rel="stylesheet" href="assets/css/site-2026.css"><script defer src="assets/js/header-2026.js"></script><script defer src="assets/js/footer-2026.js"></script><script defer src="assets/js/theme-2026.js"></script>
  <script type="application/ld+json">${jsonScript(schema)}</script>
</head>
<body><noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PPW847MH" height="0" width="0" style="display:none"></iframe></noscript><a class="skip-link" href="#conteudo">Ir para o conteúdo</a>
  <main id="conteudo"><header class="subhero"><div class="container"><span class="eyebrow">Central de ajuda</span><h1 class="display-title">Perguntas frequentes sobre o Sistema Laser.</h1><p class="hero-copy">Pesquise por tema ou navegue pelas seções para entender como a plataforma apoia a rotina da sua locadora.</p></div></header>
    <section class="section-space"><div class="container"><div class="row g-4 align-items-end mb-5"><div class="col-lg-8"><label class="form-label" for="faqSearch">O que você quer saber?</label><input class="form-control form-control-lg" id="faqSearch" type="search" placeholder="Ex.: CRM, PIX, contratos, preços ou agenda" autocomplete="off"></div><div class="col-lg-4"><label class="form-label" for="faqSection">Filtrar por seção</label><select class="form-select form-select-lg" id="faqSection"><option value="">Todas as seções</option>${data.sections.map((section) => `<option value="${escapeHtml(section.id)}">${escapeHtml(section.name)}</option>`).join('')}</select></div></div><p class="section-lead" id="faqStatus" aria-live="polite"></p><div id="faqResults"></div></div></section>
  </main>
  <script>const faqData=${jsonScript(all)};(${function (faq) {
    const results = document.getElementById('faqResults');
    const search = document.getElementById('faqSearch');
    const section = document.getElementById('faqSection');
    const status = document.getElementById('faqStatus');
    function render() {
      const term = search.value.toLocaleLowerCase('pt-BR').trim();
      const filtered = faq.filter(
        (item) =>
          (!section.value || item.section === section.value) &&
          (!term ||
            `${item.question} ${item.answer} ${item.sectionName}`
              .toLocaleLowerCase('pt-BR')
              .includes(term)),
      );
      status.textContent = `${filtered.length} ${filtered.length === 1 ? 'resposta encontrada' : 'respostas encontradas'}.`;
      results.innerHTML = '';
      const groups = new Map();
      filtered.forEach((item) => {
        if (!groups.has(item.section)) groups.set(item.section, []);
        groups.get(item.section).push(item);
      });
      groups.forEach((items, sectionId) => {
        const wrapper = document.createElement('section');
        wrapper.className = 'mb-5';
        wrapper.id = sectionId;
        const title = document.createElement('h2');
        title.className = 'section-title mb-4';
        title.textContent = items[0].sectionName;
        wrapper.appendChild(title);
        const accordion = document.createElement('div');
        accordion.className = 'accordion accordion-flush';
        accordion.id = `faq-page-${sectionId}`;
        items.forEach((item, index) => {
          const itemId = `faq-page-${item.id}`;
          const entry = document.createElement('div');
          entry.className = 'accordion-item';
          entry.innerHTML = `<h3 class="accordion-header"><button class="accordion-button${index ? ' collapsed' : ''}" type="button" data-bs-toggle="collapse" data-bs-target="#${itemId}">${item.question}</button></h3><div id="${itemId}" class="accordion-collapse collapse${index ? '' : ' show'}" data-bs-parent="#${accordion.id}"><div class="accordion-body"></div></div>`;
          entry.querySelector('.accordion-body').textContent = item.answer;
          accordion.appendChild(entry);
        });
        wrapper.appendChild(accordion);
        results.appendChild(wrapper);
      });
    }
    search.addEventListener('input', render);
    section.addEventListener('change', render);
    render();
  }.toString()})(faqData)</script>
  <script defer src="assets/bootstrap/js/bootstrap.min.js"></script>
</body></html>`;
}

export function buildFaq(root) {
  const data = readFaq(root);
  const dist = path.join(root, 'dist');
  const faqDir = path.join(dist, 'faq');
  fs.mkdirSync(faqDir, { recursive: true });
  fs.writeFileSync(
    path.join(faqDir, 'faq.json'),
    `${JSON.stringify(data, null, 2)}\n`,
  );
  fs.writeFileSync(path.join(dist, 'faq.html'), faqPageHtml(data));

  const pages = new Map();
  for (const section of data.sections)
    for (const page of section.pages) pages.set(page, section);
  for (const [page, section] of pages) {
    const file = path.join(dist, page);
    if (!fs.existsSync(file))
      throw new Error(`FAQ page target does not exist: ${page}`);
    let html = fs.readFileSync(file, 'utf8');
    html = removeVisibleFaq(removeFaqSchemas(html));
    html = html.replace('</main>', `${pageFaqSection(section)}\n  </main>`);
    html = html.replace(
      '</head>',
      `  <script type="application/ld+json" data-generated-faq-schema="${escapeHtml(section.id)}">${jsonScript(faqSchema(section, page))}</script>\n</head>`,
    );
    fs.writeFileSync(file, html);
  }
  return data;
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) ===
    path.resolve(new URL(import.meta.url).pathname)
) {
  buildFaq(process.cwd());
  console.log('Built FAQ page and page-specific FAQ sections');
}
