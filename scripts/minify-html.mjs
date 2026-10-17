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

// Keep readable sources while publishing compact first-party CSS and scripts.
// Already minified vendor files keep their original licensing and contents.
export async function minifySiteAssets(directory) {
  const files = ['css', 'js'].flatMap((kind) => {
    const folder = path.join(directory, 'assets', kind);
    return fs
      .readdirSync(folder)
      .filter(
        (name) => name.endsWith(`.${kind}`) && !name.endsWith(`.min.${kind}`),
      )
      .map((name) => ({ file: path.join(folder, name), kind }));
  });
  await Promise.all(
    files.map(async ({ file, kind }) => {
      const tag = kind === 'css' ? 'style' : 'script';
      const source = fs.readFileSync(file, 'utf8');
      const output = await minify(`<${tag}>${source}</${tag}>`, {
        minifyCSS: kind === 'css',
        minifyJS: kind === 'js',
      });
      fs.writeFileSync(file, output.slice(tag.length + 2, -(tag.length + 3)));
    }),
  );
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
