import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const postsData = JSON.parse(fs.readFileSync(path.join(root, "blog/posts.json"), "utf8"));
const posts = postsData.posts || [];
const errors = [];

function read(file) {
  return fs.readFileSync(path.join(dist, file), "utf8");
}

function assert(condition, message) {
  if (!condition) errors.push(message);
}

for (const post of posts) {
  const file = `blog/${post.slug}.html`;
  assert(fs.existsSync(path.join(dist, file)), `dist/${file} was not generated`);
  if (!fs.existsSync(path.join(dist, file))) continue;
  const html = read(file);
  assert(html.includes(`<link rel="canonical" href="https://www.sistemalaser.com.br/${file}">`), `dist/${file} missing canonical`);
  assert(html.includes('"@type":"BlogPosting"') || html.includes('"@type": "BlogPosting"'), `dist/${file} missing BlogPosting schema`);
  assert(html.includes('"@type":"BreadcrumbList"') || html.includes('"@type": "BreadcrumbList"'), `dist/${file} missing BreadcrumbList schema`);
  assert(html.includes(`datetime="${post.date}"`), `dist/${file} missing semantic date`);
  for (const block of html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    JSON.parse(block[1]);
  }
}

const sitemap = read("sitemap.xml");
for (const post of posts) {
  assert(sitemap.includes(`https://www.sistemalaser.com.br/blog/${post.slug}.html`), `sitemap missing ${post.slug}`);
}

for (const file of ["CNAME", "robots.txt", "llms.txt", "blog.html", "blog/posts.json", "blog/feed.xml", "assets/js/header-2026.js", "assets/js/footer-2026.js"]) {
  assert(fs.existsSync(path.join(dist, file)), `dist/${file} missing`);
}

const htmlFiles = fs
  .readdirSync(dist)
  .filter((file) => file.endsWith(".html"))
  .concat(fs.readdirSync(path.join(dist, "blog")).filter((file) => file.endsWith(".html")).map((file) => `blog/${file}`));

for (const file of htmlFiles) {
  const html = read(file);
  const currentDir = path.dirname(file) === "." ? "" : `${path.dirname(file)}/`;
  for (const match of html.matchAll(/\s(?:href|src)="([^"#:][^"]*)"/g)) {
    const link = match[1];
    if (/^[a-z][a-z0-9+.-]*:/i.test(link)) continue;
    if (link.includes("+")) continue;
    if (link.startsWith("mailto:") || link.startsWith("tel:") || link.startsWith("data:")) continue;
    const clean = decodeURIComponent(link.split("#")[0].split("?")[0]);
    if (!clean || clean.startsWith("//")) continue;
    const target = path.normalize(path.join(dist, currentDir, clean));
    assert(fs.existsSync(target), `${file} links to missing ${link}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated dist with ${posts.length} posts and ${htmlFiles.length} HTML files`);
