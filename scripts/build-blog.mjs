import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteUrl = "https://www.sistemalaser.com.br";
const blogDir = path.join(root, "blog");
const distDir = path.join(root, "dist");
const distBlogDir = path.join(distDir, "blog");
const postsFile = path.join(blogDir, "posts.json");
const blogImagesDir = path.join(blogDir, "images");
const distBlogImagesDir = path.join(distBlogDir, "images");
const sitemapFile = path.join(distDir, "sitemap.xml");
const rssFile = path.join(distBlogDir, "feed.xml");
const today = process.env.SITE_LASTMOD || new Date().toISOString().slice(0, 10);
const staticFiles = ["CNAME", "robots.txt", "llms.txt"];
const staticDirs = ["assets"];

const staticSitemapEntries = [
  ["/", today, "weekly", "1.0"],
  ["/software-locacao-equipamentos.html", today, "monthly", "0.9"],
  ["/sistema-locadora-laser.html", today, "monthly", "0.9"],
  ["/software-locadora-medica.html", today, "monthly", "0.85"],
  ["/software-locadora-construcao.html", today, "monthly", "0.8"],
  ["/erp-locadora.html", today, "monthly", "0.85"],
  ["/sistema-financeiro-locadora.html", today, "monthly", "0.9"],
  ["/controle-equipamentos.html", today, "monthly", "0.85"],
  ["/agenda-locacoes.html", today, "monthly", "0.85"],
  ["/funcionalidades.html", today, "monthly", "0.8"],
  ["/solucoes-locadoras.html", today, "monthly", "0.8"],
  ["/integracoes.html", today, "monthly", "0.75"],
  ["/planos.html", today, "monthly", "0.8"],
  ["/whatsapp.html", today, "monthly", "0.7"],
  ["/blog.html", today, "weekly", "0.75"],
  ["/jobs.html", today, "yearly", "0.3"],
  ["/termos-privacidade.html", today, "yearly", "0.2"],
  ["/termos-uso.html", today, "yearly", "0.2"],
];

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyRecursive(source, target) {
  if (path.basename(source) === ".DS_Store") return;
  const stat = fs.statSync(source);
  if (stat.isDirectory()) {
    ensureDir(target);
    for (const entry of fs.readdirSync(source)) {
      copyRecursive(path.join(source, entry), path.join(target, entry));
    }
    return;
  }
  ensureDir(path.dirname(target));
  fs.copyFileSync(source, target);
}

function prepareDist(posts) {
  fs.rmSync(distDir, { recursive: true, force: true });
  ensureDir(distBlogDir);

  for (const file of fs.readdirSync(root).filter((entry) => entry.endsWith(".html"))) {
    fs.copyFileSync(path.join(root, file), path.join(distDir, file));
  }

  for (const file of staticFiles) {
    const source = path.join(root, file);
    if (fs.existsSync(source)) fs.copyFileSync(source, path.join(distDir, file));
  }

  for (const dir of staticDirs) {
    copyRecursive(path.join(root, dir), path.join(distDir, dir));
  }

  fs.writeFileSync(path.join(distBlogDir, "posts.json"), `${JSON.stringify({ version: 1, posts }, null, 2)}\n`);
  if (fs.existsSync(blogImagesDir)) {
    copyRecursive(blogImagesDir, distBlogImagesDir);
  }
  fs.writeFileSync(path.join(distDir, ".nojekyll"), "");
}

function stripHtml(value) {
  return String(value ?? "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function absolute(url) {
  return `${siteUrl}/${url.replace(/^\/+/, "")}`;
}

function isAbsoluteUrl(url) {
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(String(url ?? ""));
}

function normalizePostImage(image) {
  const fallback = `${siteUrl}/assets/img/og-sistema-laser-2026.png`;
  const value = String(image || "").trim();
  if (!value) return { image: fallback, imagePath: "" };
  if (isAbsoluteUrl(value)) return { image: value, imagePath: value };

  const normalized = value
    .replace(/^\/+/, "")
    .replace(/^\.\/+/, "")
    .replace(/^\.\.\/+/, "blog/images/");
  const rootRelativePath = normalized.startsWith("blog/images/")
    ? normalized
    : normalized.startsWith("images/")
      ? `blog/${normalized}`
      : normalized;

  return {
    image: absolute(rootRelativePath),
    imagePath: `../${rootRelativePath.replace(/^blog\//, "")}`,
  };
}

function formatDate(date) {
  const value = String(date ?? "");
  const hasTime = /(?:T|\s)\d{2}:\d{2}/.test(value);
  const parts = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...(hasTime ? { hour: "2-digit", minute: "2-digit", hour12: false } : {}),
  }).formatToParts(parseDate(date));
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.day}/${values.month}/${values.year}${hasTime ? ` ${values.hour}h${values.minute}` : ""}`;
}

function parseDate(date) {
  const value = String(date ?? "");
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return new Date(`${value}T12:00:00-03:00`);
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(value)) return new Date(`${value.replace(" ", "T")}-03:00`);
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{4,}(?:Z|[+-]\d{2}:\d{2})?$/.test(value)) {
    return new Date(value.replace(/\.(\d{3})\d+/, ".$1"));
  }
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?$/.test(value)) return new Date(`${value}-03:00`);
  return new Date(value);
}

function formatReadingTime(readingTime) {
  const value = String(readingTime ?? "").trim();
  if (!value) return "";
  return /\bmin\b/i.test(value) ? value : `${value} min`;
}

function readPosts() {
  const data = JSON.parse(fs.readFileSync(postsFile, "utf8"));
  if (!Array.isArray(data.posts)) throw new Error("blog/posts.json must include a posts array");
  const seen = new Set();
  return data.posts
    .map((post) => {
      const required = ["slug", "title", "description", "date", "category", "contentHtml"];
      for (const field of required) {
        if (!post[field]) throw new Error(`Missing ${field} in blog post`);
      }
      if (seen.has(post.slug)) throw new Error(`Duplicate post slug: ${post.slug}`);
      seen.add(post.slug);
      return {
        ...post,
        modified: post.modified || post.date,
        tags: post.tags || [],
        readingTime: post.readingTime || Math.max(1, Math.ceil(stripHtml(post.contentHtml).split(/\s+/).length / 200)),
        ...normalizePostImage(post.image),
        url: post.url || `blog/${post.slug}.html`,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}

function relatedPosts(post, posts) {
  return posts
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => {
      const tagMatches = candidate.tags.filter((tag) => post.tags.includes(tag)).length;
      const categoryMatch = candidate.category === post.category ? 2 : 0;
      return { candidate, score: tagMatches + categoryMatch };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || b.candidate.date.localeCompare(a.candidate.date))
    .slice(0, 3)
    .map((item) => item.candidate);
}

function jsonScript(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function postHtml(post, posts) {
  const canonical = absolute(post.url);
  const related = relatedPosts(post, posts);
  const keywords = post.tags.join(", ");
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${canonical}#blogposting`,
        headline: post.title,
        description: post.description,
        keywords: post.tags,
        articleSection: post.category,
        wordCount: stripHtml(post.contentHtml).split(/\s+/).filter(Boolean).length,
        datePublished: post.date,
        dateModified: post.modified,
        inLanguage: "pt-BR",
        author: post.author
          ? { "@type": "Person", name: post.author }
          : { "@type": "Organization", name: "Sistema Laser", url: siteUrl },
        publisher: { "@id": `${siteUrl}/#organization` },
        mainEntityOfPage: canonical,
        image: post.image,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog.html` },
          { "@type": "ListItem", position: 3, name: post.title, item: canonical },
        ],
      },
    ],
  };
  const postMeta = {
    title: post.title,
    description: post.description,
    date: post.date,
    modified: post.modified,
    author: post.author,
    category: post.category,
    tags: post.tags,
    image: post.image,
    imagePath: post.imagePath,
  };

  return `<!doctype html>
<html lang="pt-BR" data-bs-theme="light" data-theme-preference="auto">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(post.seoTitle || `${post.title} | Sistema Laser`)}</title>
  <meta name="description" content="${escapeHtml(post.seoDescription || post.description)}">
  <meta name="keywords" content="${escapeHtml(keywords)}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Sistema Laser">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${escapeHtml(post.ogTitle || post.title)}">
  <meta property="og:description" content="${escapeHtml(post.ogDescription || post.description)}">
  <meta property="og:image" content="${escapeHtml(post.image)}">
  <meta property="article:published_time" content="${post.date}">
  <meta property="article:modified_time" content="${post.modified}">
  <meta property="article:section" content="${escapeHtml(post.category)}">
${post.tags.map((tag) => `  <meta property="article:tag" content="${escapeHtml(tag)}">`).join("\n")}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(post.ogTitle || post.title)}">
  <meta name="twitter:description" content="${escapeHtml(post.ogDescription || post.description)}">
  <meta name="twitter:image" content="${escapeHtml(post.image)}">
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start":new Date().getTime(),event:"gtm.js"});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";j.async=true;j.src="https://www.googletagmanager.com/gtm.js?id="+i+dl;f.parentNode.insertBefore(j,f)})(window,document,"script","dataLayer","GTM-PPW847MH");</script>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-WS5QS9LS8K"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","G-WS5QS9LS8K");</script>
  <link rel="icon" href="../assets/img/icons/favicon-32x32.png">
  <link rel="stylesheet" href="../assets/bootstrap/css/bootstrap.min.css">
  <link rel="stylesheet" href="../assets/css/site-2026.css">
  <script src="../assets/js/header-2026.js"></script>
  <script src="../assets/js/footer-2026.js"></script>
  <script src="../assets/js/theme-2026.js"></script>
  <script type="application/json" id="post-meta">${jsonScript(postMeta)}</script>
  <script type="application/ld+json">${jsonScript(schema)}</script>
</head>
<body>
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PPW847MH" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <a class="skip-link" href="#conteudo">Ir para o conteúdo</a>
  <main id="conteudo">
    <article>
      <header class="subhero">
        <div class="container">
          <div class="mb-4"><a href="../blog.html" class="btn btn-surface">Voltar ao Blog</a></div>
          <span class="eyebrow">${escapeHtml(post.category)}</span>
          <h1 class="display-title">${escapeHtml(post.heroTitle || post.title)}</h1>
          <p class="hero-copy">${escapeHtml(post.heroCopy || post.description)}</p>
          <p class="legal-note"><time datetime="${post.date}">${formatDate(post.date)}</time>${post.author ? ` · Por ${escapeHtml(post.author)}` : ""} · ${formatReadingTime(post.readingTime)} de leitura</p>
          ${post.imagePath && !isAbsoluteUrl(post.imagePath) ? `<img class="mt-4 w-100" style="border-radius:12px;max-height:480px;object-fit:cover" src="${escapeHtml(post.imagePath)}" alt="${escapeHtml(post.title)}" loading="eager" fetchpriority="high">` : ""}
        </div>
      </header>
      <section class="section-space">
        <div class="container" style="max-width:860px">
${post.contentHtml}
        </div>
      </section>
    </article>
${related.length ? `    <section class="section-space surface-section">
      <div class="container">
        <span class="eyebrow">Continue lendo</span>
        <h2 class="section-title">Postagens relacionadas.</h2>
        <div class="row g-4">
${related.map((item) => `          <div class="col-md-4"><article class="module-card"><span class="eyebrow">${escapeHtml(item.category)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p><a href="${escapeHtml(item.slug)}.html">Ler postagem</a></article></div>`).join("\n")}
        </div>
      </div>
    </section>
` : ""}  </main>
  <script src="../assets/bootstrap/js/bootstrap.min.js"></script>
</body>
</html>
`;
}

function buildSitemap(posts) {
  const entries = [
    ...staticSitemapEntries,
    ...posts.map((post) => [`/${post.url}`, post.modified, "yearly", "0.55", post.image]),
  ];
  const seen = new Set();
  const urls = entries
    .filter(([loc]) => {
      if (seen.has(loc)) return false;
      seen.add(loc);
      return true;
    })
    .map(([loc, lastmod, changefreq, priority, image]) => {
      const imageXml = image ? `<image:image><image:loc>${escapeHtml(image)}</image:loc></image:image>` : "";
      return `    <url><loc>${absolute(loc)}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority>${imageXml}</url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls}
</urlset>
`;
}

function buildRss(posts) {
  const items = posts.slice(0, 20).map((post) => {
    const canonical = absolute(post.url);
    return `    <item>
      <title>${escapeHtml(post.title)}</title>
      <link>${canonical}</link>
      <guid>${canonical}</guid>
      <pubDate>${parseDate(post.date).toUTCString()}</pubDate>
      <description>${escapeHtml(post.description)}</description>
    </item>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Blog Sistema Laser</title>
    <link>${siteUrl}/blog.html</link>
    <description>Guias sobre gestão de locação de equipamentos, agenda, contratos, manutenção, financeiro e automação.</description>
${items}
  </channel>
</rss>
`;
}

const posts = readPosts();
prepareDist(posts);
for (const post of posts) {
  fs.writeFileSync(path.join(distBlogDir, `${post.slug}.html`), postHtml(post, posts));
}
fs.writeFileSync(sitemapFile, buildSitemap(posts));
fs.writeFileSync(rssFile, buildRss(posts));

console.log(`Built dist with ${posts.length} blog pages, sitemap.xml, blog/feed.xml and static assets`);
