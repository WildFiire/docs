import { spawn } from 'node:child_process';
import path from 'node:path';
import { RUNTIME_ROOT } from '@server/storage/paths';
import { writeJson } from '@server/storage/json';
let running = false;
let pending = false;
let timer: ReturnType<typeof setTimeout> | undefined;
export const publicationState = {
  status: 'idle',
  requestedAt: '',
  publishedAt: '',
  error: '',
  log: '',
};
function persist() {
  writeJson(path.join(RUNTIME_ROOT, 'data', 'publication.json'), publicationState);
}
export function requestPublication(_reason = 'content', _scope?: string) {
  pending = true;
  publicationState.requestedAt = new Date().toISOString();
  publicationState.status = running ? 'building' : 'queued';
  if (process.env.WF_PUBLICATION_DISABLED === '1') return;
  clearTimeout(timer);
  timer = setTimeout(run, 1200);
  persist();
}
async function run() {
  if (running || !pending) return;
  pending = false;
  running = true;
  publicationState.status = 'building';
  publicationState.log = '';
  persist();
  const child = spawn(process.execPath, ['scripts/build-docs.mjs'], {
    cwd: process.cwd(),
    env: process.env,
    windowsHide: true,
  });
  child.stdout.on('data', (chunk) => {
    publicationState.log = (publicationState.log + chunk).slice(-20000);
  });
  child.stderr.on('data', (chunk) => {
    publicationState.log = (publicationState.log + chunk).slice(-20000);
  });
  const exit = await new Promise<number>((resolve) => {
    child.once('error', (err) => {
      publicationState.error = err.message;
      resolve(-1);
    });
    child.once('exit', (code) => resolve(code ?? -1));
  });
  running = false;
  if (exit === 0) {
    publicationState.status = 'published';
    publicationState.publishedAt = new Date().toISOString();
    publicationState.error = '';
  } else {
    publicationState.status = 'failed';
    publicationState.error = `Build failed (${exit}); previous static output preserved.`;
  }
  persist();
  if (pending) timer = setTimeout(run, 1200);
}
