import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { config } from 'dotenv';
config({ quiet: true });
import os from 'node:os';
const vp = path.resolve('docs/.vitepress'),
  lock = path.join(vp, 'publication.lock'),
  staging = path.join(os.tmpdir(), `wf-docs-build-${process.pid}`),
  dist = path.join(vp, 'dist');
let handle;
function run(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { stdio: 'inherit', windowsHide: true });
    child.once('error', reject);
    child.once('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`Build step failed: ${args.join(' ')} (${code})`)),
    );
  });
}
async function files(dir, base = dir) {
  const out = [];
  for (const item of await fs.readdir(dir, { withFileTypes: true })) {
    if (item.isSymbolicLink()) throw new Error('Symlinks are not allowed in build output');
    const file = path.join(dir, item.name);
    if (item.isDirectory()) out.push(...(await files(file, base)));
    else out.push(path.relative(base, file));
  }
  return out;
}
try {
  handle = await fs.open(lock, 'wx', 0o600);
  await handle.writeFile(JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }));
  await run(['scripts/seed-runtime.mjs']);
  await run(['scripts/build-server.mjs']);
  await run(['scripts/prepare-static.mjs']);
  await run(['node_modules/vitepress/bin/vitepress.js', 'build', 'docs', '--outDir', staging]);
  await fs.access(path.join(staging, 'index.html'));
  const output = await files(staging);
  let previous = [];
  try {
    previous = JSON.parse(await fs.readFile(path.join(vp, 'published-manifest.json'), 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  // Publish assets first, then atomically replace each HTML document. Keeping old
  // hashed assets makes both old and new pages usable throughout publication.
  output.sort((a, b) => Number(a.endsWith('.html')) - Number(b.endsWith('.html')));
  for (const relative of output) {
    const target = path.join(dist, relative);
    await fs.mkdir(path.dirname(target), { recursive: true });
    const temporary = target + `.publish-${process.pid}`;
    await fs.copyFile(path.join(staging, relative), temporary);
    await fs.rename(temporary, target);
  }
  // Remove deleted pages/media only after the new build is fully published.
  // Hashed assets stay available for browsers still using the previous HTML.
  const current = new Set(output);
  for (const relative of previous) {
    const target = path.resolve(dist, relative);
    if (
      !current.has(relative) &&
      !relative.replaceAll('\\', '/').startsWith('assets/') &&
      target.startsWith(dist + path.sep)
    )
      await fs.rm(target, { force: true });
  }
  await fs.writeFile(path.join(vp, 'published-manifest.json'), JSON.stringify(output));
  console.log(`Published ${output.length} files to docs/.vitepress/dist`);
} finally {
  if (staging && path.basename(staging) === `wf-docs-build-${process.pid}`)
    await fs.rm(staging, { recursive: true, force: true }).catch(() => {});
  if (handle) {
    await handle.close();
    await fs.unlink(lock).catch(() => {});
  }
}
