import { DOCS_ROOT, PUBLIC_ROOT, RUNTIME_ROOT } from '@server/storage/paths';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import matter from 'gray-matter';
import type {
  BackupSnapshotMetadata,
  BackupSnapshotPayload,
  BackupDocItem,
  BackupManifest,
  BackupVaultStats,
  BackupType,
} from '@server/types/backups';
import { localCreateNotification } from '@server/lib/db';
import { recordAuditEvent } from '@server/lib/security/audit';
import { docPath, validateMarkdown } from '@server/services/documents';
import { requestPublication } from '@server/services/publication';

const DATA_DIR = path.join(RUNTIME_ROOT, 'data');
const BACKUPS_DIR = path.join(DATA_DIR, 'backups');
const MANIFEST_FILE = path.join(BACKUPS_DIR, 'manifest.json');
const ANALYTICS_FILE = path.join(DATA_DIR, 'doc_analytics.json');
const TEAM_FILE = path.join(RUNTIME_ROOT, 'content', 'team.json');
const DOCS_DIR = DOCS_ROOT;
const SETTINGS_FILE = path.join(DATA_DIR, 'db_config.json');

function ensureBackupDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(BACKUPS_DIR)) {
    fs.mkdirSync(BACKUPS_DIR, { recursive: true });
  }
}

function calculateSha256(content: string): string {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

export function readManifest(): BackupManifest {
  ensureBackupDir();
  if (fs.existsSync(MANIFEST_FILE)) {
    try {
      const raw = fs.readFileSync(MANIFEST_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed.snapshots)) parsed.snapshots = [];
      return parsed;
    } catch (err) {
      console.error('[BackupVault] Error reading manifest, initializing new:', err);
    }
  }

  const initial: BackupManifest = {
    version: '1.8.0',
    autoBackupEnabled: true,
    intervalDays: 3, // Auto backup every 3 days as requested
    retentionLimit: 10,
    lastAutoBackupAt: null,
    snapshots: [],
    totalStorageBytes: 0,
    updatedAt: new Date().toISOString(),
  };
  saveManifest(initial);
  return initial;
}

export function saveManifest(manifest: BackupManifest) {
  ensureBackupDir();
  try {
    manifest.updatedAt = new Date().toISOString();
    manifest.totalStorageBytes = (manifest.snapshots || []).reduce(
      (acc, s) => acc + (s.sizeBytes || 0),
      0,
    );
    fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2), 'utf-8');
  } catch (err) {
    console.error('[BackupVault] Error saving manifest:', err);
  }
}

function collectAllDocs(): BackupDocItem[] {
  const docs: BackupDocItem[] = [];
  if (!fs.existsSync(DOCS_DIR)) return docs;

  function scan(dir: string, baseDir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (
        entry.isSymbolicLink() ||
        entry.name.startsWith('.') ||
        ['admin', 'panel', 'public', 'docs', 'team', 'changelog', 'maintenance'].includes(
          entry.name,
        )
      )
        continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(fullPath, baseDir);
      } else if (entry.isFile() && (entry.name.endsWith('.mdx') || entry.name.endsWith('.md'))) {
        try {
          const raw = fs.readFileSync(fullPath, 'utf-8');
          const rel = path.relative(baseDir, fullPath).replace(/\\/g, '/');
          const slug = rel.replace(/\.(mdx|md)$/, '');
          const parsed = matter(raw);
          const hash = calculateSha256(raw);

          docs.push({
            slug,
            relativePath: rel,
            rawContent: raw,
            frontmatter: parsed.data || {},
            sha256: hash,
          });
        } catch (err) {
          console.error(`[BackupVault] Error reading doc file ${fullPath}:`, err);
        }
      }
    }
  }

  scan(DOCS_DIR, DOCS_DIR);
  return docs;
}

/**
 * Creates a new full snapshot of the platform
 */
export async function createSnapshot(opts?: {
  type?: BackupType;
  createdBy?: string;
  label?: string;
}): Promise<BackupSnapshotMetadata> {
  ensureBackupDir();
  const manifest = readManifest();

  const type = opts?.type || 'manual';
  const createdBy = opts?.createdBy || 'iannC69';
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  const snapshotId = `snap_${dateStr}_${timeStr}_${randomSuffix}`;

  const defaultLabel =
    type === 'auto'
      ? `Backup Automat Programat (Interval ${manifest.intervalDays || 3} Zile)`
      : `Snapshot Manual creat de @${createdBy}`;
  const label = opts?.label?.trim() || defaultLabel;

  // 1. Read Database
  let databaseData: any = {
    views: {},
    feedbacks: [],
    reports: [],
    tasks: [],
    notifications: [],
    updatedAt: now.toISOString(),
  };
  if (fs.existsSync(ANALYTICS_FILE)) {
    try {
      databaseData = JSON.parse(fs.readFileSync(ANALYTICS_FILE, 'utf-8'));
    } catch {}
  }

  // 2. Read Team
  let teamData: any = { members: [] };
  if (fs.existsSync(TEAM_FILE)) {
    try {
      teamData = JSON.parse(fs.readFileSync(TEAM_FILE, 'utf-8'));
    } catch {}
  }

  // 3. Read Docs
  const docsList = collectAllDocs();

  // 4. Read Settings
  let settingsData: any = {};
  if (fs.existsSync(SETTINGS_FILE)) {
    try {
      settingsData = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
    } catch {}
  }

  const payload: BackupSnapshotPayload = {
    version: '1.8.0',
    metadata: {
      id: snapshotId,
      createdAt: now.toISOString(),
      type,
      createdBy,
      label,
      totalDocs: docsList.length,
      totalTasks: (databaseData.tasks || []).length,
      totalReports: (databaseData.reports || []).length,
      totalFeedbacks: (databaseData.feedbacks || []).length,
      totalNotifications: (databaseData.notifications || []).length,
      sizeBytes: 0,
      sha256: '',
    },
    database: databaseData,
    team: teamData,
    docs: docsList,
    settings: settingsData,
  };

  const payloadString = JSON.stringify(payload, null, 2);
  const sha256 = calculateSha256(payloadString);
  const sizeBytes = Buffer.byteLength(payloadString, 'utf8');

  payload.metadata.sha256 = sha256;
  payload.metadata.sizeBytes = sizeBytes;

  // Save physical file
  const snapshotFilePath = path.join(BACKUPS_DIR, `${snapshotId}.json`);
  fs.writeFileSync(snapshotFilePath, JSON.stringify(payload, null, 2), 'utf-8');

  // Update manifest
  manifest.snapshots.unshift(payload.metadata);
  if (type === 'auto') {
    manifest.lastAutoBackupAt = now.toISOString();

    // Auto-rotate older auto-backups beyond retention limit
    const autoSnapshots = manifest.snapshots.filter((s) => s.type === 'auto');
    if (autoSnapshots.length > manifest.retentionLimit) {
      const toRemove = autoSnapshots.slice(manifest.retentionLimit);
      for (const oldSnap of toRemove) {
        manifest.snapshots = manifest.snapshots.filter((s) => s.id !== oldSnap.id);
        const oldFile = path.join(BACKUPS_DIR, `${oldSnap.id}.json`);
        if (fs.existsSync(oldFile)) {
          try {
            fs.unlinkSync(oldFile);
          } catch {}
        }
      }
    }
  }

  saveManifest(manifest);

  // Notify team
  try {
    localCreateNotification({
      isGlobal: true,
      title:
        type === 'auto'
          ? `Snapshot de Siguranță Finalizat (Auto 3 Zile)`
          : `Snapshot Manual Nou Generat: ${label}`,
      message: `Arhivate cu succes ${docsList.length} ghiduri, ${(databaseData.tasks || []).length} sarcini și întreaga bază de date (${(sizeBytes / 1024 / 1024).toFixed(2)} MB · SHA-256 Validat).`,
      category: 'system',
      severity: 'success',
      link: '/admin/backups',
      metadata: { snapshotId, sizeBytes, sha256 },
    });
  } catch {}

  // Record audit
  try {
    recordAuditEvent({
      action: 'BACKUP_SNAPSHOT_CREATED',
      actor: createdBy,
      details: {
        snapshotId,
        type,
        sizeBytes,
        sha256,
        totalDocs: docsList.length,
      },
    });
  } catch {}

  return payload.metadata;
}

/**
 * Checks if 3 days have elapsed since last auto backup; if so, triggers auto-backup
 */
export async function checkAndRunAutoBackup(
  forced = false,
): Promise<BackupSnapshotMetadata | null> {
  const manifest = readManifest();
  if (!manifest.autoBackupEnabled && !forced) return null;

  const intervalMs = (manifest.intervalDays || 3) * 24 * 60 * 60 * 1000;
  const now = Date.now();

  let shouldRun = forced;
  if (!manifest.lastAutoBackupAt) {
    shouldRun = true;
  } else {
    const lastTime = new Date(manifest.lastAutoBackupAt).getTime();
    if (now - lastTime >= intervalMs) {
      shouldRun = true;
    }
  }

  if (shouldRun) {
    return await createSnapshot({
      type: 'auto',
      createdBy: 'SYSTEM_SCHEDULER',
      label: `Backup Automat Programat (Interval ${manifest.intervalDays || 3} Zile)`,
    });
  }

  return null;
}

export function getAllSnapshots(): BackupSnapshotMetadata[] {
  const manifest = readManifest();
  return manifest.snapshots || [];
}

export function getSnapshotPayload(id: string): BackupSnapshotPayload | null {
  if (typeof id !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(id)) return null;
  ensureBackupDir();
  const filePath = path.join(BACKUPS_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;

  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[BackupVault] Error reading snapshot payload for ${id}:`, err);
    return null;
  }
}

/**
 * Restores the entire platform (Database, Team, Docs) to the selected snapshot
 */
export async function restoreSnapshot(
  id: string,
  restoredBy: string,
): Promise<{ success: boolean; error?: string; restoredMetadata?: BackupSnapshotMetadata }> {
  const payload = getSnapshotPayload(id);
  if (!payload) {
    return { success: false, error: 'Snapshot-ul selectat nu a fost găsit pe disc.' };
  }

  try {
    // Validate the whole snapshot before changing any state.
    for (const doc of payload.docs || []) {
      docPath(doc.relativePath);
      validateMarkdown(doc.rawContent);
      if (doc.sha256 && doc.sha256 !== calculateSha256(doc.rawContent))
        throw new Error('Snapshot document integrity mismatch');
    }
    // 1. Create a safety snapshot of current state before rollback
    await createSnapshot({
      type: 'manual',
      createdBy: 'SYSTEM_PRE_ROLLBACK',
      label: `Snapshot Automat Pre-Rollback (Înainte de restaurarea ${id})`,
    });

    // 2. Restore Database
    if (payload.database) {
      fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(payload.database, null, 2), 'utf-8');
    }

    // 3. Restore Team
    if (payload.team) {
      fs.writeFileSync(TEAM_FILE, JSON.stringify(payload.team, null, 2), 'utf-8');
    }

    // 4. Restore Docs Markdown files
    if (Array.isArray(payload.docs)) {
      for (const doc of payload.docs) {
        if (doc.relativePath && doc.rawContent) {
          const targetPath = docPath(doc.relativePath);
          const targetDir = path.dirname(targetPath);
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }
          fs.writeFileSync(targetPath, doc.rawContent, 'utf-8');
        }
      }
    }

    // 5. Restore Settings
    if (payload.settings) {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(payload.settings, null, 2), 'utf-8');
    }

    // Notify team
    localCreateNotification({
      isGlobal: true,
      title: `Platformă Restaurată cu Succes (Rollback)`,
      message: `Sistemul a fost restaurat de @${restoredBy} la snapshot-ul din ${new Date(payload.metadata.createdAt).toLocaleString('ro-RO')}.`,
      category: 'system',
      severity: 'urgent',
      link: '/admin/backups',
      metadata: { restoredSnapshotId: id, restoredBy },
    });

    // Record audit
    recordAuditEvent({
      action: 'BACKUP_SNAPSHOT_RESTORED',
      actor: restoredBy,
      details: {
        restoredSnapshotId: id,
        snapshotCreatedAt: payload.metadata.createdAt,
        totalDocsRestored: Array.isArray(payload.docs) ? payload.docs.length : 0,
      },
    });

    requestPublication('snapshot-restore');
    return { success: true, restoredMetadata: payload.metadata };
  } catch (err: any) {
    console.error('[BackupVault] Error during restore:', err);
    return { success: false, error: err?.message || 'Eroare necunoscută în timpul restaurării.' };
  }
}

export function deleteSnapshot(id: string): boolean {
  if (typeof id !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(id)) return false;
  ensureBackupDir();
  const manifest = readManifest();
  const initialLength = manifest.snapshots.length;

  manifest.snapshots = manifest.snapshots.filter((s) => s.id !== id);
  const filePath = path.join(BACKUPS_DIR, `${id}.json`);

  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch {}
  }

  if (manifest.snapshots.length !== initialLength) {
    saveManifest(manifest);
    return true;
  }
  return false;
}

export function updateSchedulerSettings(settings: {
  autoBackupEnabled?: boolean;
  intervalDays?: number;
  retentionLimit?: number;
}): BackupManifest {
  const manifest = readManifest();
  if (typeof settings.autoBackupEnabled === 'boolean') {
    manifest.autoBackupEnabled = settings.autoBackupEnabled;
  }
  if (typeof settings.intervalDays === 'number' && settings.intervalDays > 0) {
    manifest.intervalDays = settings.intervalDays;
  }
  if (typeof settings.retentionLimit === 'number' && settings.retentionLimit > 0) {
    manifest.retentionLimit = settings.retentionLimit;
  }
  saveManifest(manifest);
  return manifest;
}

export function getBackupVaultStats(): BackupVaultStats {
  const manifest = readManifest();
  const snapshots = manifest.snapshots || [];
  const autoSnapshots = snapshots.filter((s) => s.type === 'auto');
  const manualSnapshots = snapshots.filter((s) => s.type === 'manual');

  const lastBackupAt = snapshots.length > 0 ? snapshots[0].createdAt : null;
  const intervalMs = (manifest.intervalDays || 3) * 24 * 60 * 60 * 1000;

  let daysUntilNextAuto = manifest.intervalDays || 3;
  if (manifest.lastAutoBackupAt) {
    const elapsedMs = Date.now() - new Date(manifest.lastAutoBackupAt).getTime();
    const remainingMs = Math.max(0, intervalMs - elapsedMs);
    daysUntilNextAuto = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));
  }

  return {
    totalSnapshots: snapshots.length,
    autoSnapshotsCount: autoSnapshots.length,
    manualSnapshotsCount: manualSnapshots.length,
    lastBackupAt,
    totalStorageBytes: manifest.totalStorageBytes || 0,
    autoBackupEnabled: manifest.autoBackupEnabled,
    intervalDays: manifest.intervalDays || 3,
    daysUntilNextAuto,
  };
}
