import { DOCS_ROOT, PUBLIC_ROOT, RUNTIME_ROOT } from '@server/storage/paths';
import fs from 'fs';
import path from 'path';
import { recordAuditEvent } from './audit';
import { getLocalDatabaseConfig } from '../db/localStore';

export interface PlatformSettings {
  maintenance: {
    enabled: boolean;
    message: string;
    estimatedEndTime: string;
    reason?: string;
    allowAdmins?: boolean;
  };
  announcement: {
    enabled: boolean;
    text: string;
    link?: string;
    linkText?: string;
    type?: 'info' | 'warning' | 'fire';
    dismissible?: boolean;
  };
  discordLogThreads?: Record<string, string>;
  updatedAt: string;
  updatedBy: string;
}

const DEFAULT_SETTINGS: PlatformSettings = {
  maintenance: {
    enabled: false,
    message:
      "Wildfire Docs is currently undergoing scheduled platform upgrades and engine optimizations. We'll be back online shortly.",
    estimatedEndTime: '30 minutes',
    reason: 'Actualizare structură documentație & optimizare index căutare',
    allowAdmins: true,
  },
  announcement: {
    enabled: false,
    text: 'Wildfire Docs v1.5.0 este live cu Ghiduri CS2, Media Vault & Sistem de Securitate!',
    link: '/changelog',
    linkText: 'Vezi Noutățile',
    type: 'fire',
    dismissible: true,
  },
  updatedAt: new Date().toISOString(),
  updatedBy: 'system',
};

const SETTINGS_FILE_PATH = path.join(RUNTIME_ROOT, 'content', 'settings.json');

/**
 * Reads platform settings from persistent disk store.
 */
export function getPlatformSettings(): PlatformSettings {
  try {
    if (fs.existsSync(SETTINGS_FILE_PATH)) {
      const raw = fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        maintenance: { ...DEFAULT_SETTINGS.maintenance, ...(parsed.maintenance || {}) },
        announcement: { ...DEFAULT_SETTINGS.announcement, ...(parsed.announcement || {}) },
      };
    }
  } catch (err) {
    console.error('Failed to read settings file, using defaults:', err);
  }
  return DEFAULT_SETTINGS;
}

/**
 * Updates platform settings and commits to disk store.
 */
export function updatePlatformSettings(
  updates: {
    maintenance?: Partial<PlatformSettings['maintenance']>;
    announcement?: Partial<PlatformSettings['announcement']>;
    discordLogThreads?: Record<string, string>;
  },
  actor = 'admin',
  skipAudit = false,
): PlatformSettings {
  const current = getPlatformSettings();
  const next: PlatformSettings = {
    ...current,
    maintenance: {
      ...current.maintenance,
      ...(updates.maintenance || {}),
    },
    announcement: {
      ...current.announcement,
      ...(updates.announcement || {}),
    },
    discordLogThreads: updates.discordLogThreads || current.discordLogThreads || {},
    updatedAt: new Date().toISOString(),
    updatedBy: actor,
  };

  try {
    const dir = path.dirname(SETTINGS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(next, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write settings file:', err);
  }

  // ── Background sync to Supabase ────────────────────────────────────────────
  try {
    const config = getLocalDatabaseConfig();
    if (config.provider === 'supabase' && config.supabaseUrl && config.supabaseAnonKey) {
      import('../db/supabase')
        .then(({ supabaseSavePlatformSettings }) => {
          supabaseSavePlatformSettings(
            {
              url: config.supabaseUrl!,
              anonKey: config.supabaseAnonKey!,
              serviceKey: config.supabaseServiceKey,
            },
            next,
          ).catch(() => {});
        })
        .catch(() => {});
    }
  } catch {}

  if (!skipAudit) {
    recordAuditEvent({
      action: 'SETTINGS_UPDATE',
      actor,
      details: {
        maintenanceEnabled: next.maintenance.enabled,
        announcementEnabled: next.announcement.enabled,
      },
    });
  }

  return next;
}
