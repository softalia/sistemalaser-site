import fs from 'node:fs';
import path from 'node:path';

const siteUrl = 'https://www.sistemalaser.com.br';
const escape = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
const plain = (value) =>
  value
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
const json = (value) => JSON.stringify(value).replace(/</g, '\\u003c');
const canonicalOf = (html) =>
  html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/)?.[1];
const metadata = (html, name) =>
  html.match(
    new RegExp(
      `<meta\\s+(?:name|property)="${name}"\\s+content="([^"]*)"`,
      'i',
    ),
  )?.[1];
const structuredData = (html) =>
  [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ].flatMap((match) => {
    const data = JSON.parse(match[1]);
    return data['@graph'] || [data];
  });
const hasType = (entity, type) => [entity['@type']].flat().includes(type);

function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory()
      ? htmlFiles(file)
      : entry.name.endsWith('.html')
        ? [file]
        : [];
  });
}

// Complete technical SEO in the generated HTML, before minification. No client
// rendering, fabricated dates, ratings or claims are needed for discovery.
export function optimizeSeo(directory, posts) {
  const home = fs.readFileSync(path.join(directory, 'index.html'), 'utf8');
  const sharedEntities = structuredData(home).filter((entity) =>
    ['Organization', 'WebSite'].some((type) => hasType(entity, type)),
  );
  const postByUrl = new Map(
    posts.map((post) => [`${siteUrl}/${post.url}`, post]),
  );
  const pages = [];
  for (const file of htmlFiles(directory)) {
    let html = fs.readFileSync(file, 'utf8');
    if (/http-equiv="refresh"/i.test(html)) continue;
    const canonical = canonicalOf(html);
    if (!canonical) throw new Error(`Missing canonical: ${file}`);
    const title = plain(html.match(/<title>([\s\S]*?)<\/title>/)[1]);
    const description = metadata(html, 'description');
    const image = metadata(html, 'og:image');
    const historical = path.basename(file) === 'termos-uso-2025-07-23.html';
    const addMeta = (attribute, name, value) => {
      if (!metadata(html, name))
        html = html.replace(
          '</head>',
          `<meta ${attribute}="${name}" content="${value}"></head>`,
        );
    };
    html = html.replace(
      /<html\b([^>]*)>/,
      (_, attributes) =>
        `<html${attributes.replace(/\s+lang="[^"]*"/i, '')} lang="pt-BR">`,
    );
    addMeta(
      'name',
      'robots',
      historical ? 'noindex,follow' : 'index,follow,max-image-preview:large',
    );
    addMeta('property', 'og:locale', 'pt_BR');
    addMeta('property', 'og:type', 'website');
    addMeta('property', 'og:site_name', 'Sistema Laser');
    addMeta('name', 'twitter:card', 'summary_large_image');
    addMeta('property', 'og:image:alt', escape(title));
    addMeta('name', 'twitter:image:alt', escape(title));
    // Link directly to the canonical landing, avoiding a redirect hop in articles.
    html = html.replace(
      /(href="(?:\.\.\/)?)(sistema-locadora-laser\.html)(["#])/g,
      '$1locadora-laser.html$3',
    );
    const entities = structuredData(html);
    const graph = sharedEntities.filter(
      (shared) => !entities.some((entity) => entity['@id'] === shared['@id']),
    );
    if (
      !entities.some((entity) =>
        ['WebPage', 'FAQPage', 'CollectionPage'].some((type) =>
          hasType(entity, type),
        ),
      )
    ) {
      graph.push({
        '@type':
          path.basename(file) === 'blog.html' ? 'CollectionPage' : 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: title,
        description,
        inLanguage: 'pt-BR',
        isPartOf: { '@id': `${siteUrl}/#website` },
        publisher: { '@id': `${siteUrl}/#organization` },
        ...(image
          ? { primaryImageOfPage: { '@type': 'ImageObject', url: image } }
          : {}),
      });
    }
    if (graph.length)
      html = html.replace(
        '</head>',
        `<script type="application/ld+json">${json({ '@context': 'https://schema.org', '@graph': graph })}</script></head>`,
      );
    const images = new Set(image ? [image] : []);
    for (const match of html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)) {
      const src = new URL(match[1], canonical).href;
      if (/\/(assets\/img\/sistema|blog\/images)\//.test(src)) images.add(src);
    }
    if (!/\bnoindex\b/i.test(metadata(html, 'robots') || ''))
      pages.push({
        canonical,
        images: [...images],
        modified: postByUrl.get(canonical)?.modified,
      });
    fs.writeFileSync(file, html);
  }
  // The public FAQ data is also a documented canonical discovery endpoint.
  pages.push({ canonical: `${siteUrl}/faq/faq.json`, images: [] });
  const entries = pages
    .sort((a, b) => a.canonical.localeCompare(b.canonical))
    .map((page) => {
      const modified = page.modified
        ? `<lastmod>${escape(page.modified)}</lastmod>`
        : '';
      const images = page.images
        .map(
          (image) =>
            `<image:image><image:loc>${escape(image)}</image:loc></image:image>`,
        )
        .join('');
      return `  <url><loc>${escape(page.canonical)}</loc>${modified}${images}</url>`;
    });
  fs.writeFileSync(
    path.join(directory, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${entries.join('\n')}\n</urlset>\n`,
  );
}
