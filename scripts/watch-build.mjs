import { watch } from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const root = process.cwd();
const sourceDirectories = ['assets', 'blog', 'faq', 'scripts'];
const rootFiles = new Set(['CNAME', 'llms.txt', 'robots.txt']);
let rebuildTimer;
let building = false;
let rebuildQueued = false;

function shouldRebuildRootFile(file) {
  return file?.endsWith('.html') || rootFiles.has(file);
}

function rebuild() {
  if (building) {
    rebuildQueued = true;
    return;
  }

  building = true;
  console.log('\nChange detected. Rebuilding dist...');
  const build = spawn(process.execPath, ['scripts/build-blog.mjs'], {
    cwd: root,
    stdio: 'inherit',
  });
  build.on('exit', (code) => {
    building = false;
    if (code !== 0) console.error(`Build failed with exit code ${code}.`);
    if (rebuildQueued) {
      rebuildQueued = false;
      rebuild();
    }
  });
}

function scheduleRebuild() {
  clearTimeout(rebuildTimer);
  rebuildTimer = setTimeout(rebuild, 150);
}

watch(root, (event, filename) => {
  if (shouldRebuildRootFile(filename)) scheduleRebuild();
});

for (const directory of sourceDirectories) {
  watch(path.join(root, directory), { recursive: true }, scheduleRebuild);
}

console.log('Watching source files for changes. Press Ctrl+C to stop.');
