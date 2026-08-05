import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const blogDir = path.join(root, "blog");
const outFile = path.join(blogDir, "posts.json");

function extractMeta(file) {
  const html = fs.readFileSync(file, "utf8");
  const match = html.match(/<script\s+type="application\/json"\s+id="post-meta">([\s\S]*?)<\/script>/);
  if (!match) {
    throw new Error(`Missing post-meta in ${path.relative(root, file)}`);
  }
  const meta = JSON.parse(match[1]);
  const slug = path.basename(file);
  return {
    title: meta.title,
    description: meta.description,
    date: meta.date,
    modified: meta.modified || meta.date,
    category: meta.category,
    tags: meta.tags || [],
    url: `blog/${slug}`
  };
}

const posts = fs.readdirSync(blogDir)
  .filter((file) => file.endsWith(".html"))
  .map((file) => extractMeta(path.join(blogDir, file)))
  .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

fs.writeFileSync(outFile, JSON.stringify({ generatedAt: new Date().toISOString(), posts }, null, 2) + "\n");
console.log(`Wrote ${path.relative(root, outFile)} with ${posts.length} posts`);
