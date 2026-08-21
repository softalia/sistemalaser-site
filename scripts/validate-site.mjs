import fs from 'node:fs';
import path from 'node:path';

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
assert(
  sitemap.includes(
    'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"',
  ),
  'sitemap missing image namespace',
);
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
  'assets/js/footer-2026.js',
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
const gallerySources = new Set(
  Array.from(
    galleryScript.matchAll(/\bsrc:\s*'([^']+)'/g),
    (match) => match[1],
  ),
);
for (const source of gallerySources) {
  assert(
    fs.existsSync(path.join(dist, source)),
    `gallery references missing screenshot ${source}`,
  );
}

for (const file of htmlFiles) {
  const html = read(file);
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
      gallerySources.has(source),
      `${file} uses ${source}, but it is missing from the screenshot gallery`,
    );
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(
  `Validated dist with ${posts.length} posts and ${htmlFiles.length} HTML files`,
);
