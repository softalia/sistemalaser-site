import fs from 'node:fs';
import path from 'node:path';
import { validateSeo } from './validate-seo.mjs';

const root = process.cwd();
const dist = path.join(root, 'dist');
const postsData = JSON.parse(
  fs.readFileSync(path.join(root, 'blog/posts.json'), 'utf8'),
);
const posts = postsData.posts || [];
const faqData = JSON.parse(
  fs.readFileSync(path.join(root, 'faq/faq.json'), 'utf8'),
);
const faqSections = faqData.sections || [];
const distPostsData = JSON.parse(
  fs.readFileSync(path.join(dist, 'blog/posts.json'), 'utf8'),
);
const distPosts = distPostsData.posts || [];
const errors = [];

function read(file) {
  return fs.readFileSync(path.join(dist, file), 'utf8');
}

function assert(condition, message) {
  if (!condition) errors.push(message);
}

for (const post of posts) {
  const file = `blog/${post.slug}.html`;
  assert(
    fs.existsSync(path.join(dist, file)),
    `dist/${file} was not generated`,
  );
  if (!fs.existsSync(path.join(dist, file))) continue;
  const html = read(file);
  assert(
    html.includes(
      `<link rel="canonical" href="https://www.sistemalaser.com.br/${file}">`,
    ),
    `dist/${file} missing canonical`,
  );
  assert(
    html.includes(
      '<meta property="og:image" content="https://www.sistemalaser.com.br/',
    ),
    `dist/${file} missing absolute og:image`,
  );
  assert(
    html.includes(
      '<meta name="twitter:image" content="https://www.sistemalaser.com.br/',
    ),
    `dist/${file} missing absolute twitter:image`,
  );
  assert(
    html.includes('"@type":"BlogPosting"') ||
      html.includes('"@type": "BlogPosting"'),
    `dist/${file} missing BlogPosting schema`,
  );
  assert(
    html.includes('"@type":"BreadcrumbList"') ||
      html.includes('"@type": "BreadcrumbList"'),
    `dist/${file} missing BreadcrumbList schema`,
  );
  assert(
    html.includes(`datetime="${post.date}"`),
    `dist/${file} missing semantic date`,
  );
  for (const block of html.matchAll(
    /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  )) {
    JSON.parse(block[1]);
  }
}

for (const post of distPosts) {
  assert(
    /^https:\/\/www\.sistemalaser\.com\.br\//.test(String(post.image || '')),
    `dist/blog/posts.json has non-absolute image for ${post.slug}`,
  );
  if (post.imagePath && !/^[a-z][a-z0-9+.-]*:\/\//i.test(post.imagePath)) {
    assert(
      fs.existsSync(path.join(dist, 'blog', post.imagePath)),
      `dist/blog/posts.json imagePath missing for ${post.slug}: ${post.imagePath}`,
    );
  }
}

const sitemap = read('sitemap.xml');
for (const route of [
  {
    old: 'sistema-locadora-laser.html',
    current: 'locadora-laser.html',
  },
]) {
  assert(
    fs.existsSync(path.join(dist, route.current)),
    `dist/${route.current} landing page missing`,
  );
  const landingHtml = read(route.current);
  assert(
    landingHtml.includes(
      `rel="canonical" href="https://www.sistemalaser.com.br/${route.current}"`,
    ),
    `${route.current} missing canonical`,
  );
  const redirect = read(route.old);
  assert(
    redirect.includes(`content="0;url=${route.current}"`),
    `${route.old} missing redirect to ${route.current}`,
  );
  assert(
    sitemap.includes(`https://www.sistemalaser.com.br/${route.current}`),
    `sitemap missing ${route.current}`,
  );
  assert(
    !sitemap.includes(`https://www.sistemalaser.com.br/${route.old}`),
    `sitemap must not include legacy route ${route.old}`,
  );
}
for (const legacyRoute of [
  'software-locacao-equipamentos.html',
  'locacao-equipamentos.html',
  'agenda-locacoes.html',
  'controle-equipamentos.html',
  'solucoes-locadoras.html',
]) {
  const redirect = read(legacyRoute);
  assert(
    redirect.includes('content="0;url=erp-locadora.html"'),
    `${legacyRoute} missing redirect to erp-locadora.html`,
  );
  assert(
    redirect.includes(
      'rel="canonical" href="https://www.sistemalaser.com.br/erp-locadora.html"',
    ),
    `${legacyRoute} missing consolidated canonical`,
  );
  assert(
    !sitemap.includes(`https://www.sistemalaser.com.br/${legacyRoute}`),
    `sitemap must not include redundant route ${legacyRoute}`,
  );
}
assert(
  sitemap.includes('https://www.sistemalaser.com.br/erp-locadora.html'),
  'sitemap missing consolidated ERP landing page',
);
const erpHtml = read('erp-locadora.html');
assert(
  erpHtml.includes('id="dashboard"') &&
    erpHtml.includes('sll-locacoes-dashboard-768.webp'),
  'ERP landing page missing the locations dashboard section',
);
const inventoryHtml = read('estoque-produtos.html');
assert(
  inventoryHtml.includes('id="estoques"') &&
    inventoryHtml.includes('id="rastreabilidade"') &&
    inventoryHtml.includes('id="transacoes"') &&
    inventoryHtml.includes('id="reposicao"'),
  'inventory landing page missing required product lifecycle sections',
);
assert(
  inventoryHtml.includes('sll-produtos-estoque.webp') &&
    inventoryHtml.includes('sll-produtos-transacao.webp') &&
    inventoryHtml.includes('sll-produtos-ponto-reposicao.webp'),
  'inventory landing page missing product screenshots',
);
assert(
  sitemap.includes('https://www.sistemalaser.com.br/estoque-produtos.html'),
  'sitemap missing inventory landing page',
);
assert(
  read('funcionalidades.html').includes('href="estoque-produtos.html"') &&
    read('erp-locadora.html').includes('href="estoque-produtos.html"'),
  'inventory landing page must be linked from funcionalidades.html and erp-locadora.html',
);
assert(
  !read('crm.html').includes('id="produtos-estoque"'),
  'crm.html must not include an inventory feature section',
);
const plansHtml = read('planos.html');
assert(
  plansHtml.includes('Emissão de Notas Fiscais de Serviço (NFS-e)'),
  'plan comparison missing NFS-e integration with Emissor Nacional',
);
const featuresHtml = read('funcionalidades.html');
for (const sectionId of [
  'agenda',
  'indicadores',
  'crm',
  'financeiro',
  'documentos',
  'lila',
  'ativos',
  'protocolos',
  'modelos-precos',
  'rede',
  'integracoes',
  'aparencia',
  'nota-fiscal',
  'segmentos',
]) {
  assert(
    featuresHtml.includes(`id="${sectionId}"`),
    `funcionalidades.html missing ${sectionId} section`,
  );
}
assert(
  sitemap.includes(
    'https://www.sistemalaser.com.br/software-locadora-eletronicos.html',
  ),
  'sitemap missing electronics rental landing page',
);
for (const file of ['index.html', 'locadora-laser.html', 'erp-locadora.html']) {
  const html = read(file);
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] || '';
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] || '';
  for (const competitor of ['Izziloc', 'Sisloc', 'Locsis']) {
    const name = competitor.toLocaleLowerCase('pt-BR');
    assert(
      head.toLocaleLowerCase('pt-BR').includes(`alternativa ao ${name}`),
      `${file} missing alternative metadata for ${competitor}`,
    );
    assert(
      !body.toLocaleLowerCase('pt-BR').includes(name),
      `${file} must not mention ${competitor} in visible content`,
    );
  }
}
assert(
  sitemap.includes(
    'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"',
  ),
  'sitemap missing image namespace',
);
for (const page of [
  {
    file: 'funcionalidades.html',
    image:
      'https://www.sistemalaser.com.br/assets/img/sistema/sll-documento-dashboard.webp',
  },
  {
    file: 'estoque-produtos.html',
    image:
      'https://www.sistemalaser.com.br/assets/img/sistema/sll-produtos-estoque.webp',
  },
  {
    file: 'integracoes.html',
    image:
      'https://www.sistemalaser.com.br/assets/img/sistema/sll-integracao-api.webp',
  },
  {
    file: 'whatsapp.html',
    image: 'https://www.sistemalaser.com.br/assets/img/whatsapp_partner.webp',
  },
]) {
  const html = read(page.file);
  assert(
    html.includes(`property="og:image" content="${page.image}"`),
    `${page.file} missing feature-specific og:image`,
  );
  assert(
    html.includes(`name="twitter:image" content="${page.image}"`),
    `${page.file} missing feature-specific twitter:image`,
  );
  assert(
    sitemap.includes(`<image:loc>${page.image}</image:loc>`),
    `sitemap missing image for ${page.file}`,
  );
}
for (const page of [
  {
    file: 'assinatura-eletronica.html',
    image:
      'https://www.sistemalaser.com.br/assets/img/sistema/sll-documento-dashboard.webp',
  },
  {
    file: 'lila-whatsapp.html',
    image:
      'https://www.sistemalaser.com.br/assets/img/sistema/sll-lila-dashboard.webp',
  },
]) {
  const html = read(page.file);
  const genericImage =
    'https://www.sistemalaser.com.br/assets/img/og-sistema-laser-2026.png';
  assert(
    html.includes(`property="og:image" content="${genericImage}"`),
    `${page.file} missing generic og:image`,
  );
  assert(
    html.includes(`name="twitter:image" content="${genericImage}"`),
    `${page.file} missing generic twitter:image`,
  );
  assert(
    sitemap.includes(`<image:loc>${page.image}</image:loc>`),
    `sitemap missing image for ${page.file}`,
  );
}
for (const post of posts) {
  assert(
    sitemap.includes(`https://www.sistemalaser.com.br/blog/${post.slug}.html`),
    `sitemap missing ${post.slug}`,
  );
}
for (const post of distPosts) {
  assert(
    sitemap.includes(`<image:loc>${post.image}</image:loc>`),
    `sitemap missing image for ${post.slug}`,
  );
}

for (const file of [
  'CNAME',
  'robots.txt',
  'llms.txt',
  'blog.html',
  'blog/posts.json',
  'blog/feed.xml',
  'faq.html',
  'faq/faq.json',
  'assets/js/header-2026.js',
]) {
  assert(fs.existsSync(path.join(dist, file)), `dist/${file} missing`);
}

assert(
  sitemap.includes('https://www.sistemalaser.com.br/faq.html'),
  'sitemap missing FAQ page',
);
const distFaq = JSON.parse(
  fs.readFileSync(path.join(dist, 'faq/faq.json'), 'utf8'),
);
assert(
  JSON.stringify(distFaq) === JSON.stringify(faqData),
  'dist FAQ data differs from faq/faq.json',
);
const faqHtml = read('faq.html');
assert(faqHtml.includes('id="faqSearch"'), 'FAQ page missing search input');
assert(
  faqHtml.includes('"@type":"FAQPage"') ||
    faqHtml.includes('"@type": "FAQPage"'),
  'FAQ page missing FAQPage schema',
);
for (const section of faqSections) {
  assert(
    Array.isArray(section.pages) && section.pages.length,
    `FAQ section ${section.id} has no pages`,
  );
  assert(
    Array.isArray(section.questions) && section.questions.length,
    `FAQ section ${section.id} has no questions`,
  );
  for (const page of section.pages) {
    const pagePath = path.join(dist, page);
    assert(fs.existsSync(pagePath), `FAQ target page missing: ${page}`);
    if (!fs.existsSync(pagePath)) continue;
    const pageHtml = fs.readFileSync(pagePath, 'utf8');
    assert(
      pageHtml.includes(`data-generated-faq="${section.id}"`),
      `${page} missing generated FAQ section ${section.id}`,
    );
    assert(
      pageHtml.includes(`data-generated-faq-schema="${section.id}"`),
      `${page} missing generated FAQ schema ${section.id}`,
    );
  }
}

if (fs.existsSync(path.join(root, 'blog/images'))) {
  assert(
    fs.existsSync(path.join(dist, 'blog/images')),
    'dist/blog/images missing',
  );
}

const htmlFiles = fs
  .readdirSync(dist)
  .filter((file) => file.endsWith('.html'))
  .concat(
    fs
      .readdirSync(path.join(dist, 'blog'))
      .filter((file) => file.endsWith('.html'))
      .map((file) => `blog/${file}`),
  );

const galleryScript = fs.readFileSync(
  path.join(dist, 'assets/js/screenshot-gallery.js'),
  'utf8',
);
// Navigation is part of delivered HTML, so visitors and crawlers can use it
// without waiting for a client-side render.
const homeHeader =
  read('index.html').match(/<nav class="navbar[\s\S]*?<\/nav>/)?.[0] || '';
for (const href of [
  'funcionalidades.html',
  'erp-locadora.html',
  'crm.html',
  'planos.html',
  'faq.html',
  'locadora-laser.html',
]) {
  assert(
    homeHeader.includes(`href="${href}"`),
    `Static navigation missing ${href}`,
  );
}
assert(
  homeHeader.includes('aria-controls="siteMenu"'),
  'Mobile menu missing controlled region',
);
for (const post of posts) {
  assert(
    read(`blog/${post.slug}.html`).includes('href="../erp-locadora.html"'),
    `Blog navigation missing root-relative product path: ${post.slug}`,
  );
}
const faqInitial =
  read('faq.html').match(/<div id="faqResults">([\s\S]*?)<\/main>/)?.[1] || '';
for (const section of faqSections) {
  for (const item of section.questions) {
    const encoded = item.question
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;');
    assert(
      faqInitial.includes(encoded),
      `FAQ is missing from initial HTML: ${item.id}`,
    );
  }
}
const gallerySources = new Set(
  Array.from(
    galleryScript.matchAll(/\bsrc:\s*(['"])([^'"]+)\1/g),
    (match) => match[2],
  ),
);
assert(gallerySources.size > 0, 'Screenshot gallery catalog must not be empty');
for (const source of gallerySources) {
  assert(
    fs.existsSync(path.join(dist, source)),
    `gallery references missing screenshot ${source}`,
  );
}

function isValidPrice(value) {
  return (
    (typeof value === 'number' ||
      (typeof value === 'string' && /^\d+(?:\.\d+)?$/.test(value))) &&
    Number.isFinite(Number(value)) &&
    Number(value) >= 0
  );
}

function validateOfferPolicies(value, file) {
  if (!value || typeof value !== 'object') return;
  if (['Offer', 'AggregateOffer'].includes(value['@type'])) {
    assert(
      value.priceCurrency === 'BRL' &&
        (value['@type'] === 'Offer'
          ? isValidPrice(value.price)
          : isValidPrice(value.lowPrice) &&
            (value.highPrice === undefined ||
              (isValidPrice(value.highPrice) &&
                Number(value.highPrice) >= Number(value.lowPrice)))),
      `${file}: offer missing a valid price and currency`,
    );
    const shipping = value.shippingDetails;
    const returns = value.hasMerchantReturnPolicy;
    assert(
      shipping?.['@type'] === 'OfferShippingDetails' &&
        shipping.shippingRate?.currency === value.priceCurrency &&
        Number.isFinite(shipping.shippingRate?.value) &&
        shipping.shippingRate.value >= 0 &&
        shipping.shippingDestination?.addressCountry &&
        shipping.deliveryTime?.['@type'] === 'ShippingDeliveryTime',
      `${file}: offer missing valid shippingDetails`,
    );
    const category = returns?.returnPolicyCategory;
    assert(
      returns?.['@type'] === 'MerchantReturnPolicy' &&
        returns.applicableCountry &&
        [
          'MerchantReturnNotPermitted',
          'MerchantReturnFiniteReturnWindow',
          'MerchantReturnUnlimitedWindow',
        ].some((name) => category === `https://schema.org/${name}`) &&
        (category !== 'https://schema.org/MerchantReturnFiniteReturnWindow' ||
          (Number.isInteger(returns.merchantReturnDays) &&
            returns.merchantReturnDays >= 0)),
      `${file}: offer missing valid hasMerchantReturnPolicy`,
    );
  }
  for (const child of Object.values(value)) validateOfferPolicies(child, file);
}

for (const file of htmlFiles) {
  const html = read(file);
  const entities = [];
  for (const block of html.matchAll(
    /<script\b[^>]*\btype="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  )) {
    try {
      const data = JSON.parse(block[1]);
      validateOfferPolicies(data, file);
      entities.push(...(data['@graph'] || [data]));
    } catch (error) {
      assert(false, `${file}: invalid JSON-LD: ${error.message}`);
    }
  }
  for (const entity of entities) {
    if ([entity['@type']].flat().includes('SoftwareApplication')) {
      assert(
        entity.name &&
          entity.offers?.['@type'] === 'Offer' &&
          isValidPrice(entity.offers.price) &&
          entity.offers.url?.startsWith(
            'https://www.sistemalaser.com.br/planos.html#',
          ),
        `${file}: SoftwareApplication needs an explicit offer price and plan URL`,
      );
    }
    if ([entity['@type']].flat().includes('Product')) {
      assert(
        entity.name &&
          (entity.offers || entity.review || entity.aggregateRating),
        `${file}: Product needs a name and offers, review or aggregateRating`,
      );
    }
  }
  if (['index.html', 'planos.html'].includes(file)) {
    assert(
      entities.some((entity) => entity['@type'] === 'Product' && entity.offers),
      `${file}: Sistema Laser Product and offers must be preserved`,
    );
  }
  if (!html.includes('http-equiv="refresh"')) {
    assert(
      (html.match(/<h1\b/g) || []).length === 1,
      `${file}: expected one main heading`,
    );
    assert(
      (html.match(/<nav class="navbar/g) || []).length === 1,
      `${file}: expected one static header`,
    );
    assert(
      (html.match(/<link rel="canonical"/g) || []).length === 1,
      `${file}: expected one canonical URL`,
    );
    assert(
      (html.match(/property="og:url"/g) || []).length === 1,
      `${file}: duplicate or missing social URL`,
    );
    assert(
      html.includes('name="twitter:title"'),
      `${file}: missing Twitter title`,
    );
    const ids = Array.from(html.matchAll(/\bid="([^"]+)"/g), (item) => item[1]);
    assert(ids.length === new Set(ids).size, `${file}: duplicate anchor IDs`);
  }
  for (const match of html.matchAll(
    /\bhref="([^"#:]*(?:\/[^"#:]*)?#[^"]+)"/g,
  )) {
    const [pathname, fragment] = match[1].split('#');
    const targetFile = path.normalize(
      path.join(path.dirname(file), pathname || path.basename(file)),
    );
    if (
      !fragment ||
      !fs.existsSync(path.join(dist, targetFile)) ||
      !targetFile.endsWith('.html')
    )
      continue;
    const targetHtml = read(targetFile);
    if (targetHtml.includes('http-equiv="refresh"')) continue;
    assert(
      targetHtml.includes(`id="${decodeURIComponent(fragment)}"`),
      `${file}: missing anchor ${match[1]}`,
    );
  }
  const footers = html.match(/<footer class="site-footer"/g) || [];
  assert(
    footers.length === 1,
    `${file} must include exactly one build-time footer`,
  );
  assert(
    !html.includes('footer-2026.js'),
    `${file} must not reference the removed runtime footer script`,
  );
  const whatsappButtons = html.match(/\bdata-generated-whatsapp-fab\b/g) || [];
  assert(
    whatsappButtons.length === 1,
    `${file} must include exactly one generated WhatsApp button`,
  );
  assert(
    html.includes('class="whatsapp-icon"'),
    `${file} generated WhatsApp button is missing its brand icon`,
  );
  const currentDir = path.dirname(file) === '.' ? '' : `${path.dirname(file)}/`;
  for (const match of html.matchAll(/\s(?:href|src)="([^"#:][^"]*)"/g)) {
    const link = match[1];
    if (/^[a-z][a-z0-9+.-]*:/i.test(link)) continue;
    if (link.includes('+')) continue;
    if (
      link.startsWith('mailto:') ||
      link.startsWith('tel:') ||
      link.startsWith('data:')
    )
      continue;
    const clean = decodeURIComponent(link.split('#')[0].split('?')[0]);
    if (!clean || clean.startsWith('//')) continue;
    const target = path.normalize(path.join(dist, currentDir, clean));
    assert(fs.existsSync(target), `${file} links to missing ${link}`);
  }

  if (!html.includes('assets/js/screenshot-gallery.js')) continue;
  for (const match of html.matchAll(
    /<img\b[^>]*\bsrc=(["'])(assets\/img\/sistema\/[^"']+)\1/g,
  )) {
    const source = match[2].split('?')[0];
    assert(
      gallerySources.has(source) ||
        gallerySources.has(source.replace(/-\d+\.webp$/, '.webp')),
      `${file} uses ${source}, but it is missing from the screenshot gallery`,
    );
  }
}

errors.push(...validateSeo(dist, htmlFiles, posts));

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(
  `Validated dist with ${posts.length} posts and ${htmlFiles.length} HTML files`,
);
