// Build an isolated HEAD snapshot and serve it beside the uncommitted proposal.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const temporary = fs.mkdtempSync(
  path.join(os.tmpdir(), 'sistemalaser-comparacao-'),
);
const before = path.join(temporary, 'source');
fs.mkdirSync(before);
function cleanup() {
  fs.rmSync(temporary, { recursive: true, force: true });
}
process.once('exit', cleanup);
try {
  const archive = path.join(temporary, 'head.tar');
  execFileSync('git', ['archive', '--format=tar', '-o', archive, 'HEAD'], {
    cwd: root,
  });
  execFileSync('tar', ['-xf', archive, '-C', before]);
  fs.symlinkSync(
    path.join(root, 'node_modules'),
    path.join(before, 'node_modules'),
    'dir',
  );
  execFileSync(process.execPath, ['scripts/build-blog.mjs'], {
    cwd: before,
    stdio: 'inherit',
  });
} catch (error) {
  console.error('Não foi possível preparar a comparação:', error.message);
  process.exit(1);
}
const launcher = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Comparação local · Sistema Laser</title><style>body{margin:0;padding:1.5rem;background:#f3f3f8;color:#232738;font:17px/1.5 system-ui,sans-serif}h1{font-size:1.6rem;margin:0}header{display:flex;gap:1rem;align-items:center;flex-wrap:wrap}select,a{font:inherit}a{color:#5944b8}main{display:grid;grid-template-columns:1fr 1fr;gap:1rem}iframe{width:100%;height:78vh;border:1px solid #ccc;border-radius:8px;background:white}section{min-width:0}p{margin:.8rem 0}label{font-weight:600}@media(max-width:800px){main{grid-template-columns:1fr}}</style></head><body><header><h1>Antes e depois</h1><label for="page">Página</label><select id="page"><option value="index.html">Inicial</option><option value="planos.html">Planos</option><option value="software-locadora-construcao.html">Construção</option><option value="software-locadora-medica.html">Médica</option><option value="software-locadora-eletronicos.html">Eletrônicos</option><option value="locadora-laser.html">Laser</option><option value="blog.html">Blog</option></select></header><p>Antes: versão de HEAD. Depois: proposta local sem commit. Abra cada versão em outra aba para avaliar em toda a largura da tela.</p><main><section><p><strong>Antes</strong> · <a id="before-link" href="/antes/index.html" target="_blank" rel="noopener">Abrir em outra aba</a></p><iframe id="before" src="/antes/index.html" title="Site antes das alterações"></iframe></section><section><p><strong>Depois</strong> · <a id="after-link" href="/depois/index.html" target="_blank" rel="noopener">Abrir em outra aba</a></p><iframe id="after" src="/depois/index.html" title="Proposta local"></iframe></section></main><script>document.getElementById('page').addEventListener('change',function(){for(const [id,prefix] of [['before','antes'],['after','depois']]){const url='/'+prefix+'/'+this.value;document.getElementById(id).src=url;document.getElementById(id+'-link').href=url;}})</script></body></html>`;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
};
const server = http.createServer((request, response) => {
  const url = new URL(request.url, 'http://localhost');
  response.setHeader('Cache-Control', 'no-store');
  if (url.pathname === '/') {
    response.writeHead(200, { 'Content-Type': types['.html'] });
    response.end(launcher);
    return;
  }
  let requested;
  try {
    requested = decodeURIComponent(url.pathname);
  } catch (_) {
    response.writeHead(400);
    response.end('Endereço inválido.');
    return;
  }
  const match = requested.match(/^\/(antes|depois)\/(.*)$/);
  if (!match) {
    response.writeHead(404);
    response.end('Página não encontrada.');
    return;
  }
  const directory =
    match[1] === 'antes' ? path.join(before, 'dist') : path.join(root, 'dist');
  const file = path.resolve(directory, match[2] || 'index.html');
  if (
    !file.startsWith(directory + path.sep) ||
    !fs.existsSync(file) ||
    !fs.statSync(file).isFile()
  ) {
    response.writeHead(404);
    response.end('Página não encontrada.');
    return;
  }
  response.writeHead(200, {
    'Content-Type': types[path.extname(file)] || 'application/octet-stream',
  });
  fs.createReadStream(file)
    .on('error', () => response.destroy())
    .pipe(response);
});
const port = Number(process.env.SITE_COMPARE_PORT || 8084);
server.once('error', (error) => {
  console.error(error.message);
  process.exit(1);
});
server.listen(port, '127.0.0.1', () =>
  console.log(
    `Comparação local: http://localhost:${port}/\nAntes: http://localhost:${port}/antes/index.html\nDepois: http://localhost:${port}/depois/index.html\nCtrl+C encerra e remove a cópia temporária. Nenhum commit é criado.`,
  ),
);
for (const signal of ['SIGINT', 'SIGTERM'])
  process.once(signal, () => server.close(() => process.exit(0)));
