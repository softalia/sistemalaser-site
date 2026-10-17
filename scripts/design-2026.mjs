import fs from 'node:fs';
import path from 'node:path';
import { renderHeader } from './header-html.mjs';

const escape = (s) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const text = (s) =>
  s
    .replace(/<[^>]*>/g, '')
    .replace(
      /&(amp|quot|lt|gt|apos|nbsp);/g,
      (_, entity) =>
        ({ amp: '&', quot: '"', lt: '<', gt: '>', apos: "'", nbsp: ' ' })[
          entity
        ],
    )
    .replace(/\s+/g, ' ')
    .trim();

// Transform complete source sections into native disclosures; text, media, URLs
// and original anchor IDs stay in the initial HTML, including without JavaScript.
function productDetails(html) {
  const entries = [];
  let n = 0;
  html = html.replace(/<section\b[^>]*>[\s\S]*?<\/section>/g, (section) => {
    if (
      !/<h2\b/.test(section) ||
      /data-generated-faq|dark-band|id="demonstracao"/.test(section)
    )
      return section;
    const heading = section.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/);
    if (!heading || /accordion/.test(section)) return section;
    const eyebrow = section.match(
      /<span\b[^>]*class="eyebrow"[^>]*>([\s\S]*?)<\/span>/,
    )?.[1];
    const label = text(eyebrow || heading[1]);
    const anchor =
      section.match(/^<section\b[^>]*\bid="([^"]+)"/)?.[1] || `detalhe-${++n}`;
    if (!/^<section\b[^>]*\bid=/.test(section))
      section = section.replace('<section', `<section id="${anchor}"`);
    entries.push([anchor, label]);
    if (entries.length === 1) return section;

    const inner = section
      .replace(/^<section\b[^>]*>/, '')
      .replace(/<\/section>$/, '')
      .replace(
        heading[0],
        heading[0].replace(/^<h2/, '<h3').replace(/<\/h2>$/, '</h3>'),
      )
      .replace(/<span\b[^>]*class="eyebrow"[^>]*>[\s\S]*?<\/span>/, '');
    return `<section class="product-detail" id="${anchor}"><div class="container"><details class="deep-dive"><summary><h2>${escape(label)}</h2><span class="disclosure-icon" aria-hidden="true">+</span></summary><div class="deep-dive-body">${inner}</div></details></div></section>`;
  });
  if (entries.length > 2) {
    const toc = `<nav class="page-index" aria-label="Nesta página"><div class="container"><span>Nesta página</span>${entries.map(([id, label]) => `<a href="#${id}">${escape(label)}</a>`).join('')}</div></nav>`;
    html = html.replace('</header>', `</header>${toc}`);
  }
  return html;
}

export function applyDesign(directory, posts) {
  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        visit(file);
        continue;
      }
      if (!entry.name.endsWith('.html')) continue;
      let html = fs.readFileSync(file, 'utf8');
      html = html.replace(/<footer>[\s\S]*?<\/footer>/g, '');
      if (/<meta http-equiv="refresh"/.test(html)) continue;
      if (entry.name === 'blog.html') {
        const cards = posts
          .slice(0, 8)
          .map(
            (post) =>
              `<div class="col-md-6 col-xl-3"><a class="blog-card-link" href="${escape(post.url)}"><article class="module-card"><span class="eyebrow">${escape(post.category)}</span><h3>${escape(post.title)}</h3><p>${escape(post.description)}</p><span class="blog-card-cta">Ler postagem</span></article></a></div>`,
          )
          .join('');
        html = html.replace(
          /(<div id="blogGrid"[^>]*>)\s*<\/div>/,
          `$1${cards}</div>`,
        );
        html = html.replace(
          'Carregando postagens...',
          'Explore os artigos sobre gestão de locadoras.',
        );
        const archive = `<section class="section-space"><div class="container"><details class="deep-dive"><summary><h2>Todos os artigos, por data</h2><span class="disclosure-icon" aria-hidden="true">+</span></summary><ul class="article-archive">${posts.map((post) => `<li><time datetime="${post.date}">${post.date.split('-').reverse().join('/')}</time><a href="${escape(post.url)}">${escape(post.title)}</a></li>`).join('')}</ul></details></div></section>`;
        html = html.replace('</main>', `${archive}</main>`);
      }
      const prefix = path.relative(directory, file).startsWith('blog/')
        ? '../'
        : '';
      html = html.replace(
        /<nav\b[^>]*class="[^"]*navbar[^\"]*"[\s\S]*?<\/nav>/g,
        '',
      );
      html = html.replace(/<a class="skip-link"[\s\S]*?<\/a>/g, '');
      html = html.replace(
        /<body([^>]*)>/,
        (_, attributes) =>
          `<body${attributes}><a class="skip-link" href="#conteudo">Ir para o conteúdo</a>${renderHeader(prefix, entry.name)}`,
      );
      html = html.replace(
        '</head>',
        `<link rel="stylesheet" href="${prefix}assets/css/design-2026.css"><script defer src="${prefix}assets/js/design-2026.js"></script><noscript><style>.site-menu{display:flex!important}.accordion-collapse{display:block!important}.site-nav{position:relative!important}.hero,.subhero{padding-top:3rem}.menu-toggle{display:none!important}</style></noscript></head>`,
      );
      if (
        !prefix &&
        !/^(index|planos|blog|faq|jobs|termos-.*)\.html$/.test(entry.name)
      )
        html = productDetails(html);
      if (!/<main\b/.test(html)) {
        html = html.replace(
          /(<section\b[^>]*>)/,
          '<main id="conteudo" class="legacy-content">$1',
        );
        html = html.replace(
          '<footer class="site-footer"',
          '</main><footer class="site-footer"',
        );
      }
      const title = text(
        html.match(/<title>([\s\S]*?)<\/title>/)?.[1] || 'Sistema Laser',
      );
      const description = html.match(
        /<meta\s+name="description"\s+content="([^"]*)"/i,
      )?.[1];
      for (const [attribute, key, value] of [
        ['property', 'og:title', escape(title)],
        ['name', 'twitter:title', escape(title)],
        ['property', 'og:description', description],
        ['name', 'twitter:description', description],
      ]) {
        if (value)
          html = html.replace(
            new RegExp(
              `(<meta\\s+${attribute}="${key}"\\s+content=")[^"]*(")`,
              'i',
            ),
            (_, a, b) => a + value + b,
          );
      }
      html = html.replace(/<meta\s+property="twitter:[^"]*"[^>]*>/g, '');
      const canonical = html.match(
        /<link\s+rel="canonical"\s+href="([^"]+)"/,
      )?.[1];
      if (canonical) {
        html = html.replace(/<meta\s+property="og:url"[^>]*>/g, '');
        html = html.replace(
          '</head>',
          `<meta property="og:url" content="${canonical}"></head>`,
        );
      }
      for (const [key, value] of [
        ['twitter:title', escape(title)],
        ['twitter:description', description],
      ]) {
        if (value && !html.includes(`name="${key}"`))
          html = html.replace(
            '</head>',
            `<meta name="${key}" content="${value}"></head>`,
          );
      }
      if (
        canonical &&
        !/"@type":\s*"BreadcrumbList"/.test(html) &&
        entry.name !== 'index.html'
      ) {
        const schema = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Início',
              item: 'https://www.sistemalaser.com.br/',
            },
            { '@type': 'ListItem', position: 2, name: title, item: canonical },
          ],
        };
        html = html.replace(
          '</head>',
          `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script></head>`,
        );
      }
      fs.writeFileSync(file, html);
    }
  }
  visit(directory);
}
