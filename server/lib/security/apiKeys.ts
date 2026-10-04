import { DOCS_ROOT, PUBLIC_ROOT, RUNTIME_ROOT } from '@server/storage/paths';
import fs from 'fs';
import path from 'path';
import { generateRandomToken, sha256 } from './crypto';
import { recordAuditEvent } from './audit';
import { getLocalDatabaseConfig } from '../db/localStore';

export interface ApiKeyRecord {
  id: string;
  name: string;
  prefix: string;
  tokenHash: string;
  scope: 'full_access' | 'read_only' | 'ci_cd';
  createdAt: string;
  lastUsedAt?: string;
  expiresAt: string;
  revoked: boolean;
}

// ─── Persistent Storage Path ─────────────────────────────────────────────────
const API_KEYS_FILE = path.join(RUNTIME_ROOT, 'content', 'api-keys.json');

function ensureDir() {
  const dir = path.dirname(API_KEYS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ─── Load from disk (with in-memory cache fallback) ──────────────────────────
function loadApiKeysFromDisk(): ApiKeyRecord[] {
  ensureDir();
  try {
    if (fs.existsSync(API_KEYS_FILE)) {
      const raw = fs.readFileSync(API_KEYS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('[ApiKeys] Failed to read api-keys.json:', err);
  }
  // Default: no active keys if unseeded
  return [];
}

function saveApiKeysToDisk(keys: ApiKeyRecord[]): void {
  ensureDir();
  try {
    fs.writeFileSync(API_KEYS_FILE, JSON.stringify(keys, null, 2), 'utf-8');
  } catch (err) {
    console.error('[ApiKeys] Failed to write api-keys.json:', err);
  }
}

// ─── Supabase Background Sync ─────────────────────────────────────────────────
async function syncApiKeyToSupabase(key: ApiKeyRecord): Promise<void> {
  try {
    const config = getLocalDatabaseConfig();
    if (config.provider === 'supabase' && config.supabaseUrl && config.supabaseAnonKey) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const row = {
        id: key.id,
        name: key.name,
        prefix: key.prefix,
        token_hash: key.tokenHash,
        scope: key.scope,
        created_at: key.createdAt,
        last_used_at: key.lastUsedAt || null,
        expires_at: key.expiresAt,
        revoked: key.revoked,
      };
      const { error } = await supabase.from('api_keys').upsert(row, { onConflict: 'id' });
      if (error) {
        console.warn('[ApiKeys] Supabase sync error:', error.message);
      }
    }
  } catch (err) {
    console.warn('[ApiKeys] Background Supabase sync failed:', err);
  }
}

async function syncDeleteApiKeyFromSupabase(keyId: string): Promise<void> {
  try {
    const config = getLocalDatabaseConfig();
    if (config.provider === 'supabase' && config.supabaseUrl && config.supabaseAnonKey) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      await supabase.from('api_keys').delete().eq('id', keyId);
    }
  } catch {}
}

// ─── Load from Supabase (for initial hydration) ───────────────────────────────
async function loadApiKeysFromSupabase(): Promise<ApiKeyRecord[] | null> {
  try {
    const config = getLocalDatabaseConfig();
    if (config.provider === 'supabase' && config.supabaseUrl && config.supabaseAnonKey) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });
      if (error || !data || data.length === 0) return null;
      return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        prefix: row.prefix,
        tokenHash: row.token_hash,
        scope: row.scope,
        createdAt: row.created_at,
        lastUsedAt: row.last_used_at || undefined,
        expiresAt: row.expires_at,
        revoked: row.revoked,
      }));
    }
  } catch (err) {
    console.warn('[ApiKeys] Supabase load failed, falling back to disk:', err);
  }
  return null;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function generateApiKey(params: {
  name: string;
  scope: 'full_access' | 'read_only' | 'ci_cd';
  expiresInDays?: number;
  actor?: string;
}): { rawToken: string; record: ApiKeyRecord } {
  const secretRandom = generateRandomToken(24);
  const rawToken = `wf_${params.scope === 'ci_cd' ? 'ci' : 'live'}_${secretRandom}`;
  const prefix = rawToken.slice(0, 10);
  const tokenHash = sha256(rawToken);
  const days = params.expiresInDays || 90;

  const record: ApiKeyRecord = {
    id: `key_${Date.now()}_${generateRandomToken(4)}`,
    name: params.name,
    prefix,
    tokenHash,
    scope: params.scope,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + days * 86400000).toISOString(),
    revoked: false,
  };

  const keys = loadApiKeysFromDisk();
  keys.unshift(record);
  saveApiKeysToDisk(keys);

  // Background sync to Supabase
  syncApiKeyToSupabase(record).catch(() => {});

  recordAuditEvent({
    action: 'SETTINGS_UPDATE',
    actor: params.actor || 'admin',
    details: { createdApiKey: record.name, keyId: record.id, scope: record.scope },
  });

  return { rawToken, record };
}

export function listApiKeys(): ApiKeyRecord[] {
  return loadApiKeysFromDisk();
}

export async function listApiKeysAsync(): Promise<ApiKeyRecord[]> {
  // Try Supabase first, then fall back to disk
  const supabaseKeys = await loadApiKeysFromSupabase();
  if (supabaseKeys && supabaseKeys.length > 0) {
    // Sync to local disk cache
    saveApiKeysToDisk(supabaseKeys);
    return supabaseKeys;
  }
  return loadApiKeysFromDisk();
}

export function revokeApiKey(keyId: string, actor = 'admin'): boolean {
  const keys = loadApiKeysFromDisk();
  const key = keys.find((k) => k.id === keyId);
  if (!key) return false;

  key.revoked = true;
  saveApiKeysToDisk(keys);

  // Background sync to Supabase
  syncApiKeyToSupabase(key).catch(() => {});

  recordAuditEvent({
    action: 'SETTINGS_UPDATE',
    actor,
    details: { revokedApiKey: key.name, keyId: key.id },
  });

  return true;
}

export function deleteApiKey(keyId: string, actor = 'admin'): boolean {
  const keys = loadApiKeysFromDisk();
  const key = keys.find((k) => k.id === keyId);
  if (!key) return false;

  const filtered = keys.filter((k) => k.id !== keyId);
  saveApiKeysToDisk(filtered);

  // Background delete from Supabase
  syncDeleteApiKeyFromSupabase(keyId).catch(() => {});

  recordAuditEvent({
    action: 'SETTINGS_UPDATE',
    actor,
    details: { deletedApiKey: key.name, keyId: key.id },
  });

  return true;
}

export function validateApiKey(rawToken: string): {
  valid: boolean;
  record?: ApiKeyRecord;
  error?: string;
} {
  if (!rawToken || typeof rawToken !== 'string') {
    return { valid: false, error: 'Missing or invalid token format.' };
  }

  const tokenHash = sha256(rawToken);
  const keys = loadApiKeysFromDisk();

  const record = keys.find((k) => k.tokenHash === tokenHash);
  if (!record) {
    return { valid: false, error: 'Invalid API key.' };
  }

  if (record.revoked) {
    return { valid: false, error: 'API key is revoked.' };
  }

  if (new Date(record.expiresAt).getTime() < Date.now()) {
    return { valid: false, error: 'API key is expired.' };
  }

  // Update last used timestamp persistently
  record.lastUsedAt = new Date().toISOString();
  const keys2 = loadApiKeysFromDisk();
  const idx = keys2.findIndex((k) => k.id === record.id);
  if (idx !== -1) {
    keys2[idx].lastUsedAt = record.lastUsedAt;
    saveApiKeysToDisk(keys2);
  }

  return { valid: true, record };
}

export function authenticateApiRequest(req: Request): {
  valid: boolean;
  record?: ApiKeyRecord;
  error?: string;
} {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Missing Bearer token in Authorization header.' };
  }

  const rawToken = authHeader.split(' ')[1];
  return validateApiKey(rawToken);
}
