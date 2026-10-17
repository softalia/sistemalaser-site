import fs from 'node:fs';
import path from 'node:path';

const siteUrl = 'https://www.sistemalaser.com.br';
const meta = (html, key) =>
  [...html.matchAll(/<meta\b[^>]*>/g)]
    .filter(
      ([tag]) =>
        tag.includes(`name="${key}"`) || tag.includes(`property="${key}"`),
    )
    .map(([tag]) => tag.match(/content="([^"]*)"/)?.[1]);

// Validate delivered documents and the complete discovery graph, rather than
// matching implementation details or a hand-maintained list of landing pages.
export function validateSeo(directory, files, posts) {
  const errors = [];
  const check = (condition, message) => {
    if (!condition) errors.push(message);
  };
  check(
    fs.readFileSync(path.join(directory, 'CNAME'), 'utf8').trim() ===
      new URL(siteUrl).hostname,
    'SEO: CNAME differs from the canonical domain',
  );
  const sitemap = fs.readFileSync(path.join(directory, 'sitemap.xml'), 'utf8');
  const urls = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)];
  const entries = new Map(
    urls.map(([, entry]) => [entry.match(/<loc>([^<]+)<\/loc>/)?.[1], entry]),
  );
  check(urls.length === entries.size, 'SEO: duplicate sitemap URLs');
  const records = new Map();
  const titles = new Map();
  const descriptions = new Map();
  const postByUrl = new Map(
    posts.map((post) => [`${siteUrl}/blog/${post.slug}.html`, post]),
  );
  for (const file of files) {
    const html = fs.readFileSync(path.join(directory, file), 'utf8');
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    const redirect = /http-equiv="refresh"/i.test(html);
    const noindex = meta(html, 'robots').some((value) =>
      /\bnoindex\b/i.test(value),
    );
    const url = file === 'index.html' ? `${siteUrl}/` : `${siteUrl}/${file}`;
    records.set(url, { file, html, canonical, redirect, noindex });
    if (redirect) {
      check(
        !noindex,
        `${file}: redirect must consolidate, rather than request removal`,
      );
      check(
        entries.has(canonical),
        `${file}: redirect destination missing from sitemap`,
      );
      check(
        !entries.has(url),
        `${file}: redirect source must not be in sitemap`,
      );
      continue;
    }
    check(
      canonical === url,
      `${file}: canonical does not match its public URL`,
    );
    const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim();
    const description = meta(html, 'description');
    check(
      title && !titles.has(title),
      `${file}: missing or duplicate search title (${titles.get(title) || ''})`,
    );
    titles.set(title, file);
    check(
      description.length === 1 &&
        description[0]?.length > 0 &&
        !descriptions.has(description[0]),
      `${file}: missing or duplicate description`,
    );
    descriptions.set(description[0], file);
    check(
      /<html\b[^>]*lang="pt-BR"/.test(html),
      `${file}: missing page language`,
    );
    check(
      meta(html, 'og:title')[0] === title,
      `${file}: social title differs from search title`,
    );
    check(
      meta(html, 'og:description')[0] === description[0],
      `${file}: social description differs from search description`,
    );
    check(
      meta(html, 'og:url')[0] === canonical,
      `${file}: social URL differs from canonical`,
    );
    check(
      meta(html, 'og:locale')[0] === 'pt_BR',
      `${file}: missing social locale`,
    );
    if (!noindex) {
      check(
        meta(html, 'robots').some((value) =>
          value.includes('max-image-preview:large'),
        ),
        `${file}: missing large image preview permission`,
      );
      check(
        entries.has(canonical),
        `${file}: indexable page missing from sitemap`,
      );
    } else
      check(
        !entries.has(canonical),
        `${file}: noindex page must not be in sitemap`,
      );
    for (const [image] of html.matchAll(/<img\b[^>]*>/g)) {
      check(
        /\balt="[^"]*"/.test(image),
        `${file}: image missing alternative text attribute`,
      );
      check(
        /\bwidth="[1-9]\d*"/.test(image) && /\bheight="[1-9]\d*"/.test(image),
        `${file}: image missing intrinsic dimensions`,
      );
    }
    const entities = [
      ...html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
      ),
    ].flatMap(([, source]) => {
      const data = JSON.parse(source);
      return data['@graph'] || [data];
    });
    const defined = new Set(
      entities.map((entity) => entity['@id']).filter(Boolean),
    );
    for (const id of [`${siteUrl}/#website`, `${siteUrl}/#organization`])
      check(
        defined.has(id),
        `${file}: missing definition of shared structured entity ${id}`,
      );
    check(
      entities.some((entity) =>
        ['WebPage', 'CollectionPage', 'FAQPage'].some((type) =>
          [entity['@type']].flat().includes(type),
        ),
      ),
      `${file}: missing page structured data`,
    );
  }
  for (const [url, entry] of entries) {
    if (url === `${siteUrl}/faq/faq.json`) continue;
    const record = records.get(url);
    check(
      record && !record.redirect && !record.noindex && record.canonical === url,
      `sitemap: ${url} is not an indexable canonical page`,
    );
    const modified = entry.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
    const post = postByUrl.get(url);
    check(
      post ? modified === (post.modified || post.date) : !modified,
      `sitemap: unverified modification date for ${url}`,
    );
    for (const [, image] of entry.matchAll(
      /<image:loc>([^<]+)<\/image:loc>/g,
    )) {
      check(
        image.startsWith(`${siteUrl}/`) &&
          fs.existsSync(path.join(directory, new URL(image).pathname)),
        `sitemap: missing local image ${image}`,
      );
    }
  }
  check(
    entries.has(`${siteUrl}/faq/faq.json`),
    'sitemap: missing public FAQ data',
  );
  const visited = new Set();
  const queue = [`${siteUrl}/`];
  while (queue.length) {
    const url = queue.pop();
    if (visited.has(url)) continue;
    visited.add(url);
    const record = records.get(url);
    if (!record) continue;
    for (const [, href] of record.html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
      const link = new URL(href.replace(/&amp;/g, '&'), url);
      if (link.origin !== siteUrl) continue;
      link.hash = '';
      link.search = '';
      if (link.pathname === '/index.html') link.pathname = '/';
      if (records.has(link.href)) queue.push(link.href);
    }
  }
  for (const [url, record] of records)
    if (!record.redirect && !record.noindex)
      check(
        visited.has(url),
        `${record.file}: page cannot be discovered through HTML links from home`,
      );
  return errors;
}
