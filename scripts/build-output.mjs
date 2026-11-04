import fs from 'node:fs';
import path from 'node:path';

// Serialize publication and validation, while each builder works in isolation.
export async function lockBuildOutput(root) {
  const lock = path.join(root, '.dist-publish-lock');
  const owner = path.join(lock, 'pid');
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      fs.mkdirSync(lock);
      fs.writeFileSync(owner, String(process.pid));
      let active = true;
      const release = () => {
        if (!active) return;
        active = false;
        fs.rmSync(lock, { recursive: true, force: true });
      };
      process.once('exit', release);
      return release;
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      try {
        const pid = Number(fs.readFileSync(owner, 'utf8'));
        if (Number.isInteger(pid) && pid > 0) {
          try {
            process.kill(pid, 0);
          } catch (check) {
            if (check.code === 'ESRCH')
              fs.rmSync(lock, { recursive: true, force: true });
          }
        }
      } catch (read) {
        if (read.code !== 'ENOENT') throw read;
        try {
          if (Date.now() - fs.statSync(lock).mtimeMs > 10000)
            fs.rmSync(lock, { recursive: true, force: true });
        } catch (stat) {
          if (stat.code !== 'ENOENT') throw stat;
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  throw new Error(
    'Outra geração ainda está publicando ou validando dist. Tente novamente.',
  );
}

export function createBuildOutput(root) {
  const directory = path.join(root, `.dist-build-${process.pid}`);
  const previous = path.join(root, `.dist-previous-${process.pid}`);
  const destination = path.join(root, 'dist');
  process.once('exit', () =>
    fs.rmSync(directory, { recursive: true, force: true }),
  );
  async function publish() {
    const release = await lockBuildOutput(root);
    try {
      if (fs.existsSync(destination)) fs.renameSync(destination, previous);
      try {
        fs.renameSync(directory, destination);
      } catch (error) {
        if (!fs.existsSync(destination) && fs.existsSync(previous))
          fs.renameSync(previous, destination);
        throw error;
      }
    } finally {
      release();
    }
    fs.rmSync(previous, { recursive: true, force: true });
  }
  return { directory, publish };
}
