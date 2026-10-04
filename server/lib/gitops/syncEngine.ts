import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PUBLIC_ROOT, RUNTIME_ROOT, inside } from '@server/storage/paths';
import { readJson, writeJson } from '@server/storage/json';
import { docPath, validateMarkdown, snapshotDocument } from '@server/services/documents';
import { getGitOpsSettings, updateGitOpsSettings } from './store';
import { requestPublication } from '@server/services/publication';
import { validateMedia } from '@server/security/media';

export interface SyncResult {
  success: boolean;
  commitSha?: string;
  commitMessage?: string;
  commitAuthor?: string;
  filesUpdated: number;
  logs: string[];
  error?: string;
  conflicts?: string[];
}
const hash = (data: Buffer) => crypto.createHash('sha256').update(data).digest('hex');
let running = false;

// Download immutable blobs first. Unknown local changes are conflicts, including
// on the first sync; no canonical file is overwritten until all checks pass.
export async function pullContentFromGitHub(): Promise<SyncResult> {
  if (running) return { success: false, filesUpdated: 0, logs: [], error: 'SYNC_IN_PROGRESS' };
  running = true;
  const logs: string[] = [];
  const settings = getGitOpsSettings();
  const { owner, repo, branch, contentPath } = settings.publicRepo;
  const headers: Record<string, string> = {
    'User-Agent': 'Wildfire-VitePress',
    Accept: 'application/vnd.github+json',
  };
  if (settings.sync.githubToken) headers.Authorization = `Bearer ${settings.sync.githubToken}`;
  const root = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
  const manifestPath = path.join(RUNTIME_ROOT, 'content', '.gitops-sync-hashes.json');
  const changes: {
    file: string;
    relative: string;
    bytes: Buffer;
    previous: Buffer | null;
    slug?: string;
  }[] = [];
  async function get(suffix: string) {
    const response = await fetch(root + suffix, { headers, signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`GitHub HTTP ${response.status}`);
    return response.json();
  }
  try {
    if (!/^[\w.-]+$/.test(owner) || !/^[\w.-]+$/.test(repo) || !branch)
      throw new Error('Invalid repository settings');
    const info = await get(`/commits/${encodeURIComponent(branch)}`);
    const commitSha = info.sha;
    const tree = await get(`/git/trees/${info.commit.tree.sha}?recursive=1`);
    if (tree.truncated || !Array.isArray(tree.tree)) throw new Error('Incomplete GitHub tree');
    const prefix = contentPath.replace(/^\/+|\/+$/g, '') + '/';
    const previous = readJson<Record<string, string>>(manifestPath, {});
    const next = { ...previous },
      conflicts: string[] = [],
      destinations = new Set<string>();
    let totalBytes = 0;
    for (const item of tree.tree) {
      if (item.type !== 'blob') continue;
      const isDoc =
        item.path.startsWith(prefix) &&
        /\.mdx?$/.test(item.path) &&
        !/\/readme\.md$/i.test(item.path);
      const isMedia =
        /^(public|media)\//.test(item.path) &&
        /\.(png|jpe?g|webp|gif|svg|ico|mp4|webm|mp3|ogg|wav)$/i.test(item.path);
      if (!isDoc && !isMedia) continue;
      if (item.mode === '120000' || !/^[a-f0-9]{40,64}$/.test(item.sha))
        throw new Error('Invalid Git blob');
      const relative = isDoc
        ? item.path
            .slice(prefix.length)
            .replace(/^docs\//, '')
            .replace(/\.mdx$/, '.md')
        : item.path.replace(/^public\//, '');
      const file = isDoc ? docPath(relative) : inside(PUBLIC_ROOT, relative);
      if (destinations.has(file.toLowerCase()))
        throw new Error(`Duplicate destination: ${relative}`);
      destinations.add(file.toLowerCase());
      if (item.size > (isDoc ? 1_000_000 : 64 * 1024 * 1024))
        throw new Error(`File too large: ${relative}`);
      const blob = await get(`/git/blobs/${item.sha}`);
      if (blob.encoding !== 'base64') throw new Error('Unexpected blob encoding');
      let bytes = Buffer.from(blob.content, 'base64');
      totalBytes += bytes.length;
      if (totalBytes > 256 * 1024 * 1024)
        throw new Error('Sync exceeds 256 MB; use smaller batches');
      if (isDoc) {
        const markdown = bytes.toString('utf8').replace(/([("'])\/docs\//g, '$1/');
        validateMarkdown(markdown);
        bytes = Buffer.from(markdown);
      }
      else validateMedia(relative, bytes);
      const local = fs.existsSync(file) ? fs.readFileSync(file) : null;
      const key = (isDoc ? 'docs/' : 'public/') + relative,
        remoteHash = hash(bytes);
      if (local && hash(local) !== remoteHash && previous[key] !== hash(local)) {
        conflicts.push(key);
        continue;
      }
      next[key] = remoteHash;
      if (!local || hash(local) !== remoteHash)
        changes.push({
          file,
          relative,
          bytes,
          previous: local,
          slug: isDoc ? relative : undefined,
        });
    }
    if (conflicts.length)
      return {
        success: false,
        filesUpdated: 0,
        commitSha,
        logs: ['Sincronizare oprită; documentele locale sunt păstrate.'],
        error: 'LOCAL_CONTENT_CONFLICT',
        conflicts,
      };
    // Recheck after asynchronous downloads: a CMS edit must never be overwritten.
    for (const change of changes) {
      const current = fs.existsSync(change.file) ? fs.readFileSync(change.file) : null;
      if ((current === null) !== (change.previous === null) ||
          (current && change.previous && hash(current) !== hash(change.previous)))
        return { success: false, filesUpdated: 0, commitSha, logs,
          error: 'LOCAL_CONTENT_CONFLICT', conflicts: [change.relative] };
    }
    const applied: typeof changes = [];
    try {
      for (const change of changes) {
        if (change.slug && change.previous) snapshotDocument(change.slug, 'gitops');
        fs.mkdirSync(path.dirname(change.file), { recursive: true });
        const temporary = change.file + '.sync-' + crypto.randomUUID();
        try {
          fs.writeFileSync(temporary, change.bytes);
          fs.renameSync(temporary, change.file);
        } finally {
          if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
        }
        applied.push(change);
      }
      writeJson(manifestPath, next);
    } catch (error) {
      for (const change of applied.reverse()) {
        if (change.previous) fs.writeFileSync(change.file, change.previous);
        else fs.unlinkSync(change.file);
      }
      throw error;
    }
    const commitMessage = info.commit.message.split('\n')[0],
      commitAuthor = info.commit.author.name;
    updateGitOpsSettings(
      {
        sync: {
          lastSyncTimestamp: new Date().toISOString(),
          lastSyncStatus: 'success',
          lastSyncCommit: commitSha,
          lastSyncMessage: commitMessage,
          syncCount: settings.sync.syncCount + 1,
        },
      },
      'gitops',
    );
    if (changes.length) requestPublication('gitops');
    logs.push(
      `${changes.length} fișiere actualizate. Publicarea statică este în coadă dacă există modificări.`,
    );
    return {
      success: true,
      filesUpdated: changes.length,
      commitSha,
      commitMessage,
      commitAuthor,
      logs,
    };
  } catch (error: any) {
    updateGitOpsSettings(
      { sync: { lastSyncStatus: 'error', lastSyncMessage: error.message } },
      'gitops',
    );
    return { success: false, filesUpdated: 0, logs, error: error.message };
  } finally {
    running = false;
  }
}
