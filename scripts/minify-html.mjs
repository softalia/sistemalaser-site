import fs from 'node:fs';
import path from 'node:path';
import { minify } from 'html-minifier-terser';

const minifyOptions = {
  collapseBooleanAttributes: true,
  collapseWhitespace: true,
  decodeEntities: true,
  keepClosingSlash: true,
  minifyCSS: true,
  minifyJS: true,
  removeComments: true,
  removeEmptyAttributes: true,
  removeRedundantAttributes: true,
  useShortDoctype: true,
};

function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(file);
    return entry.isFile() && entry.name.endsWith('.html') ? [file] : [];
  });
}

export async function minifyHtmlDirectory(directory) {
  const files = htmlFiles(directory);
  await Promise.all(
    files.map(async (file) => {
      const html = fs.readFileSync(file, 'utf8');
      fs.writeFileSync(file, await minify(html, minifyOptions));
    }),
  );
  return files.length;
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) ===
    path.resolve(new URL(import.meta.url).pathname)
) {
  const directory = path.resolve(process.argv[2] || 'dist');
  const count = await minifyHtmlDirectory(directory);
  console.log(`Minified ${count} HTML pages in ${directory}`);
}
