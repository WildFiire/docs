import { DOCS_ROOT, PUBLIC_ROOT, RUNTIME_ROOT } from '@server/storage/paths';
import fs from 'fs';
import path from 'path';
import { sha256, generateRandomToken } from './crypto';
import { dispatchDiscordAuditLog } from '../notifications/discordAuditWebhook';
import { getLocalDatabaseConfig } from '../db/localStore';
import { supabaseSaveAuditEntry } from '../db/supabase';
import { writeJson } from '@server/storage/json';

export type AuditAction =
  | 'AUTH_LOGIN_SUCCESS'
  | 'AUTH_LOGIN_FAILURE'
  | 'AUTH_LOGOUT'
  | 'AUTH_2FA_ENABLED'
  | 'AUTH_2FA_DISABLED'
  | 'DOC_CREATE'
  | 'DOC_UPDATE'
  | 'DOC_DELETE'
  | 'DOC_RESTORE'
  | 'DOC_DELETE_FOREVER'
  | 'SETTINGS_UPDATE'
  | 'SESSION_REVOKED'
  | 'PANIC_LOCKDOWN_TRIGGERED'
  | 'PANIC_LOCKDOWN_RELEASED'
  | 'CACHE_REVALIDATED'
  | 'SYSTEM_INIT'
  | 'MAINTENANCE_TOGGLED'
  | 'BACKUP_EXPORT'
  | 'BACKUP_SNAPSHOT_CREATED'
  | 'BACKUP_SNAPSHOT_RESTORED'
  | 'DOC_ROLLBACK'
  | 'DOC_VERSION_SAVE'
  | 'DOC_REPORT_SUBMITTED'
  | 'MEDIA_UPLOAD'
  | 'MEDIA_DELETE'
  | 'AI_ABUSE_DETECTED'
  | 'TEAM_MEMBER_CREATED'
  | 'TEAM_MEMBER_UPDATED'
  | 'TEAM_MEMBER_DELETED'
  | 'TEAM_MEMBER_UNFROZEN'
  | 'WEBHOOK_CUSTOM_DISPATCHED'
  | 'GITOPS_CONFIG_UPDATED'
  | 'GITOPS_MANUAL_SYNC'
  | 'GITOPS_WEBHOOK_PUSH'
  | 'PROFILE_SELF_UPDATED';

export interface AuditEvent {
  id: string;
  timestamp: string;
  action: AuditAction;
  actor: string;
  ip: string;
  userAgent?: string;
  details?: Record<string, any>;
  previousHash: string;
  hash: string;
}

const AUDIT_FILE_PATH = path.join(RUNTIME_ROOT, 'content', 'audit.json');
const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

function loadAuditLedger(): AuditEvent[] {
  try {
    if (fs.existsSync(AUDIT_FILE_PATH)) {
      const raw = fs.readFileSync(AUDIT_FILE_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load audit ledger from disk:', err);
  }
  return [];
}

function saveAuditLedger(ledger: AuditEvent[]) {
  try {
    const dir = path.dirname(AUDIT_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    writeJson(AUDIT_FILE_PATH, ledger);
  } catch (err) {
    console.error('Failed to save audit ledger to disk:', err);
  }
}

/**
 * Appends an immutable, cryptographically chained audit event.
 */
export function recordAuditEvent(params: {
  action: AuditAction;
  actor?: string;
  ip?: string;
  userAgent?: string;
  details?: Record<string, any>;
}): AuditEvent {
  const ledger = loadAuditLedger();
  const lastHash = ledger.length > 0 ? ledger[0].hash : GENESIS_HASH;

  const id = `aud_${Date.now()}_${generateRandomToken(4)}`;
  const timestamp = new Date().toISOString();
  const actor = params.actor || 'system';
  const ip = params.ip || '127.0.0.1';
  const userAgent = params.userAgent || 'Internal Engine';
  const details = params.details || {};

  const payload = `${lastHash}|${id}|${timestamp}|${params.action}|${actor}|${ip}|${JSON.stringify(details)}`;
  const currentHash = sha256(payload);

  const event: AuditEvent = {
    id,
    timestamp,
    action: params.action,
    actor,
    ip,
    userAgent,
    details,
    previousHash: lastHash,
    hash: currentHash,
  };

  ledger.unshift(event); // most recent first
  saveAuditLedger(ledger);

  // Asynchronously dispatch to Supabase
  const dbConfig = getLocalDatabaseConfig();
  if (dbConfig.provider === 'supabase' && dbConfig.supabaseUrl && dbConfig.supabaseAnonKey) {
    supabaseSaveAuditEntry(
      { url: dbConfig.supabaseUrl, anonKey: dbConfig.supabaseAnonKey },
      event,
    ).catch(() => {});
  }

  // Asynchronously dispatch to Discord #logs stream
  dispatchDiscordAuditLog(event).catch(() => {});

  // Asynchronously dispatch to In-App Admin Notifications
  import('../db')
    .then(({ localCreateNotification }) => {
      let severity: 'info' | 'success' | 'warning' | 'urgent' = 'info';

      // Auto-map severity based on action type
      if (
        event.action.includes('FAILURE') ||
        event.action.includes('ABUSE') ||
        event.action.includes('PANIC')
      ) {
        severity = 'urgent';
      } else if (
        event.action.includes('DELETE') ||
        event.action.includes('REVOKE') ||
        event.action.includes('DISABLED')
      ) {
        severity = 'warning';
      } else if (event.action.includes('SUCCESS') || event.action.includes('CREATE')) {
        severity = 'success';
      }

      localCreateNotification({
        title: `Audit: ${event.action}`,
        message: event.details?.message || `Eveniment generat de ${event.actor}`,
        category: 'system',
        severity,
        link: '/admin/audit',
        isGlobal: true, // Show to all admins
      });
    })
    .catch(() => {});

  return event;
}

/**
 * Retrieves audit events with optional limit and action filter.
 */
export function getAuditEvents(limit = 50, filterAction?: AuditAction): AuditEvent[] {
  const ledger = loadAuditLedger();
  if (filterAction) {
    return ledger.filter((e) => e.action === filterAction).slice(0, limit);
  }
  return ledger.slice(0, limit);
}

/**
 * Verifies cryptographic integrity of the entire audit chain.
 * Returns true if valid, false if tampering is detected.
 */
export function verifyAuditChainIntegrity(): {
  isValid: boolean;
  totalEvents: number;
  brokenIndex?: number;
} {
  const ledger = loadAuditLedger();
  if (ledger.length === 0) {
    return { isValid: true, totalEvents: ledger.length };
  }

  // Iterate chronologically (from oldest to newest)
  const chronological = [...ledger].reverse();

  let prev = GENESIS_HASH;

  for (let i = 0; i < chronological.length; i++) {
    const e = chronological[i];
    if (e.previousHash !== prev) {
      return { isValid: false, totalEvents: ledger.length, brokenIndex: i };
    }

    const payload = `${e.previousHash}|${e.id}|${e.timestamp}|${e.action}|${e.actor}|${e.ip}|${JSON.stringify(e.details)}`;
    const expected = sha256(payload);

    if (e.hash !== expected) {
      return { isValid: false, totalEvents: ledger.length, brokenIndex: i };
    }

    prev = e.hash;
  }

  return { isValid: true, totalEvents: ledger.length };
}
