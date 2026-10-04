import { DOCS_ROOT, PUBLIC_ROOT, RUNTIME_ROOT } from '@server/storage/paths';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { recordAuditEvent } from '@server/lib/security/audit';

export interface GitOpsSettings {
  publicRepo: {
    owner: string;
    repo: string;
    branch: string;
    contentPath: string;
    mediaPath: string;
    editUrlTemplate: string;
  };
  privateRepo: {
    owner: string;
    repo: string;
    branch: string;
  };
  sync: {
    mode: 'submodule' | 'direct_pull' | 'api_sync';
    githubToken?: string;
    webhookSecret: string;
    autoRevalidate: boolean;
    notifyDiscord: boolean;
    lastSyncTimestamp?: string;
    lastSyncStatus?: 'success' | 'error' | 'pending';
    lastSyncMessage?: string;
    lastSyncCommit?: string;
    syncCount: number;
  };
  updatedAt: string;
  updatedBy: string;
}

const GITOPS_FILE_PATH = path.join(RUNTIME_ROOT, 'content', 'gitops.json');

function generateSecureSecret(): string {
  return crypto.randomBytes(24).toString('hex');
}

const DEFAULT_GITOPS_SETTINGS: GitOpsSettings = {
  publicRepo: {
    owner: 'wildfiire',
    repo: 'docs-public',
    branch: 'main',
    contentPath: 'content',
    mediaPath: 'public/media',
    editUrlTemplate: 'https://github.com/wildfiire/docs-public/edit/main/{path}',
  },
  privateRepo: {
    owner: 'wildfiire',
    repo: 'docs',
    branch: 'main',
  },
  sync: {
    mode: 'submodule',
    githubToken: '',
    webhookSecret: generateSecureSecret(),
    autoRevalidate: false,
    notifyDiscord: false,
    lastSyncStatus: 'pending',
    lastSyncMessage: 'Platforma este pregătită pentru configurare și sincronizare GitOps.',
    syncCount: 0,
  },
  updatedAt: new Date().toISOString(),
  updatedBy: 'system',
};

/**
 * Reads GitOps and Multi-Repo synchronization settings from disk store.
 */
export function getGitOpsSettings(): GitOpsSettings {
  try {
    if (fs.existsSync(GITOPS_FILE_PATH)) {
      const raw = fs.readFileSync(GITOPS_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      const settings = {
        ...DEFAULT_GITOPS_SETTINGS,
        ...parsed,
        publicRepo: { ...DEFAULT_GITOPS_SETTINGS.publicRepo, ...(parsed.publicRepo || {}) },
        privateRepo: { ...DEFAULT_GITOPS_SETTINGS.privateRepo, ...(parsed.privateRepo || {}) },
        sync: { ...DEFAULT_GITOPS_SETTINGS.sync, ...(parsed.sync || {}) },
      };

      if (
        !settings.sync.githubToken &&
        (process.env.GITHUB_SYNC_TOKEN || process.env.GITHUB_TOKEN)
      ) {
        settings.sync.githubToken = process.env.GITHUB_SYNC_TOKEN || process.env.GITHUB_TOKEN || '';
      }

      return settings;
    }
  } catch (err) {
    console.error('[GitOpsStore] Failed to read gitops.json, using defaults:', err);
  }
  return DEFAULT_GITOPS_SETTINGS;
}

/**
 * Updates GitOps settings, writes to disk store, and creates an audit ledger entry.
 */
export function updateGitOpsSettings(
  updates: {
    publicRepo?: Partial<GitOpsSettings['publicRepo']>;
    privateRepo?: Partial<GitOpsSettings['privateRepo']>;
    sync?: Partial<GitOpsSettings['sync']>;
  },
  actor = 'iannC69',
): GitOpsSettings {
  const current = getGitOpsSettings();
  const next: GitOpsSettings = {
    ...current,
    publicRepo: {
      ...current.publicRepo,
      ...(updates.publicRepo || {}),
    },
    privateRepo: {
      ...current.privateRepo,
      ...(updates.privateRepo || {}),
    },
    sync: {
      ...current.sync,
      ...(updates.sync || {}),
    },
    updatedAt: new Date().toISOString(),
    updatedBy: actor,
  };

  try {
    const dir = path.dirname(GITOPS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const toSave = JSON.parse(JSON.stringify(next));
    if (toSave.sync && toSave.sync.githubToken) {
      toSave.sync.githubToken = ''; // Ensure it's never written to disk
    }
    fs.writeFileSync(GITOPS_FILE_PATH, JSON.stringify(toSave, null, 2), 'utf-8');

    recordAuditEvent({
      action: 'GITOPS_CONFIG_UPDATED',
      actor,
      details: {
        publicRepo: `${next.publicRepo.owner}/${next.publicRepo.repo}@${next.publicRepo.branch}`,
        privateRepo: `${next.privateRepo.owner}/${next.privateRepo.repo}@${next.privateRepo.branch}`,
        syncMode: next.sync.mode,
        autoRevalidate: next.sync.autoRevalidate,
      },
    });
  } catch (err) {
    console.error('[GitOpsStore] Failed to write gitops.json:', err);
  }

  return next;
}

/**
 * Calculates the GitHub edit URL for a document page based on active GitOps settings.
 */
export function getGithubEditUrl(relativePath: string): string {
  const settings = getGitOpsSettings();

  // În wf-docscore paginile sunt în `content/docs/`, dar în docs-public-wf ele sunt mapate în `content/`
  let cleanRel = relativePath.replace(/^\/+/, '').replace(/\\/g, '/');
  if (cleanRel.startsWith('content/docs/')) {
    cleanRel = cleanRel.replace('content/docs/', 'content/');
  }

  const { owner, repo, branch } = settings.publicRepo;
  return `https://github.com/${owner}/${repo}/edit/${branch}/${cleanRel}`;
}
