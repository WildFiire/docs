import { currentRequest } from '@server/request-context';
import { RUNTIME_ROOT } from '@server/storage/paths';
import { readJson, writeJson } from '@server/storage/json';
import path from 'node:path';
import {
  generateRandomToken,
  hashPassword,
  verifyPassword,
  signSessionToken,
  verifySessionToken,
} from './crypto';
import { recordAuditEvent } from './audit';
import {
  findTeamMemberByUsername,
  findTeamMemberByUsernameSync,
  loadTeamMembers,
  loadTeamMembersSync,
  saveTeamMembers,
  type TeamMemberPermissions,
  type TeamMember,
} from './teamStore';

export interface AdminUser {
  username: string;
  displayName?: string;
  role: string;
  isRoot?: boolean;
  permissions?: TeamMemberPermissions;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  backupCodes?: string[];
}

export interface AdminSession {
  sessionId: string;
  username: string;
  displayName: string;
  role: string;
  isRoot: boolean;
  permissions: TeamMemberPermissions;
  ip: string;
  userAgent: string;
  createdAt: number;
  lastActiveAt: number;
  expiresAt: number;
}

const sessionFile = path.join(RUNTIME_ROOT, 'data', 'sessions.json');
const persisted = readJson<{ sessions: AdminSession[]; panic: boolean }>(sessionFile, {
  sessions: [],
  panic: false,
});
const activeSessions = new Map<string, AdminSession>(
  persisted.sessions.map((session) => [session.sessionId, session]),
);
let panicLockdownActive = persisted.panic;
function persistSessions() {
  writeJson(sessionFile, { sessions: [...activeSessions.values()], panic: panicLockdownActive });
}

// Default admin credentials (Can be overridden via environment variables)
const DEFAULT_SALT = process.env.ADMIN_DEFAULT_SALT || 'wf_root_salt_2026';
const DEFAULT_HASH = process.env.ADMIN_INITIAL_PASSWORD
  ? hashPassword(process.env.ADMIN_INITIAL_PASSWORD, DEFAULT_SALT).hash
  : 'ed43c8e23c47beafcea7f2638c8dcf78b47c8edaec4e09eba1064bcef06d7098fcaa3dca286553b5e276bcfbaad6049283b795bf65d001f239b67f16eb562c82';

export const SESSION_COOKIE_NAME = 'wf_admin_session';
export const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days persistent login
export const INACTIVITY_TIMEOUT_MS = 14 * 24 * 60 * 60 * 1000; // 14 days inactivity window

export const AUTH_ROOT_PERMISSIONS: TeamMemberPermissions = {
  canEditDocs: true,
  canDeleteDocs: true,
  canManageHealth: true,
  canManageMedia: true,
  canManageTasks: true,
  canViewAnalytics: true,
  canViewAiStats: true,
  canManageDb: true,
  canViewAudit: true,
  canManageSecurity: true,
  canManageApiKeys: true,
  canManageSnapshots: true,
  canManageWebhooks: true,
  canManageSettings: true,
  canManageTeam: true,
  canTriggerPanic: true,
  canManageDiscordBot: true,
};

export const AUTH_DEFAULT_PERMISSIONS: TeamMemberPermissions = {
  canEditDocs: true,
  canDeleteDocs: false,
  canManageHealth: true,
  canManageMedia: true,
  canManageTasks: true,
  canViewAnalytics: true,
  canViewAiStats: false,
  canManageDb: false,
  canViewAudit: false,
  canManageSecurity: false,
  canManageApiKeys: false,
  canManageSnapshots: false,
  canManageWebhooks: false,
  canManageSettings: false,
  canManageTeam: false,
  canTriggerPanic: false,
  canManageDiscordBot: false,
};

/**
 * Validates if a username belongs to the strict Root Super Admin identity.
 */
export function isRootUsername(username?: string): boolean {
  if (!username) return false;
  const clean = username.trim().toLowerCase();
  return clean === 'iannc' || clean === 'iannc69';
}

/**
 * Validates admin master credentials or team member credentials.
 */
export function verifyAdminCredentials(
  password: string,
  username?: string,
  emergencyRelease = false,
): { valid: boolean; member?: TeamMember; error?: string } {
  if (panicLockdownActive && !emergencyRelease)
    return { valid: false, error: 'System is in Panic Lockdown.' };
  const cleanPassword = (password || '').trim();
  let cleanUsername = (username || 'iannC69').trim();

  if (cleanUsername.toLowerCase() === 'iannc') {
    cleanUsername = 'iannC69';
  }

  // 1. Check Team Member Store
  const member = findTeamMemberByUsernameSync(cleanUsername);
  if (member) {
    if (member.status === 'suspended') {
      const isZombie = member.suspendedReason === 'inactivity_30d';
      return {
        valid: false,
        error: isZombie
          ? 'Cont înghețat din cauza inactivității (peste 30 de zile). Contactează un Root Admin pentru dezghețare din panou.'
          : 'Acest cont a fost suspendat de către Root Administrator.',
      };
    }

    // ── ZOMBIE ACCOUNT REAPER (30 days inactivity) ──
    const INACTIVITY_LIMIT_MS = 30 * 24 * 60 * 60 * 1000;
    if (!member.isRoot) {
      const lastActivityTime = Math.max(
        member.unfrozenAt ? new Date(member.unfrozenAt).getTime() : 0,
        member.lastLoginAt ? new Date(member.lastLoginAt).getTime() : 0,
        member.createdAt ? new Date(member.createdAt).getTime() : 0,
      );

      if (lastActivityTime > 0) {
        const msSinceActivity = Date.now() - lastActivityTime;
        if (msSinceActivity > INACTIVITY_LIMIT_MS) {
          const all = loadTeamMembersSync();
          const idx = all.findIndex((m) => m.id === member.id);
          if (idx !== -1) {
            all[idx].status = 'suspended';
            all[idx].suspendedReason = 'inactivity_30d';
            all[idx].suspendedAt = new Date().toISOString();
            saveTeamMembers(all);
          }
          recordAuditEvent({
            action: 'AUTH_LOGIN_FAILURE',
            actor: member.username,
            ip: '127.0.0.1',
            details: {
              error: 'ZOMBIE_ACCOUNT_FROZEN',
              message: 'Account inactive for >30 days. Automatically suspended.',
            },
          });
          return {
            valid: false,
            error:
              'Cont înghețat din cauza inactivității (peste 30 de zile). Contactează un Root Admin pentru dezghețare din panou.',
          };
        }
      }
    }

    const matchesHash = verifyPassword(cleanPassword, member.passwordHash, member.salt);
    const matchesMasterFallback =
      process.env.ADMIN_INITIAL_PASSWORD &&
      cleanPassword === process.env.ADMIN_INITIAL_PASSWORD.trim();

    if (matchesHash || (member.isRoot && matchesMasterFallback)) {
      // Update last login
      const all = loadTeamMembersSync();
      const idx = all.findIndex((m) => m.id === member.id);
      if (idx !== -1) {
        all[idx].lastLoginAt = new Date().toISOString();
        all[idx].suspendedReason = undefined;
        all[idx].suspendedAt = undefined;
        saveTeamMembers(all);
      }
      return { valid: true, member };
    }
  }

  // 2. Fallback Root Verification for iannC / iannC69
  const isRootUser = isRootUsername(cleanUsername);

  if (isRootUser) {
    const isMasterValid =
      (process.env.ADMIN_INITIAL_PASSWORD &&
        cleanPassword === process.env.ADMIN_INITIAL_PASSWORD.trim()) ||
      verifyPassword(cleanPassword, DEFAULT_HASH, DEFAULT_SALT);

    if (isMasterValid) {
      const root: TeamMember = {
        id: 'member_root_superadmin',
        username: 'iannC69',
        displayName: 'iannC (Founder & Root)',
        role: 'root_admin' as const,
        avatarColor: '#ff6b00',
        passwordHash: DEFAULT_HASH,
        salt: DEFAULT_SALT,
        permissions: AUTH_ROOT_PERMISSIONS,
        status: 'active' as const,
        isRoot: true,
        createdAt: new Date().toISOString(),
      };
      return { valid: true, member: root };
    }
  }

  return { valid: false, error: 'Nume de utilizator sau parolă incorectă.' };
}

/**
 * Creates a signed admin session and stores it.
 */
export function createAdminSession(params: {
  username: string;
  displayName?: string;
  role?: string;
  isRoot?: boolean;
  permissions?: TeamMemberPermissions;
  ip: string;
  userAgent: string;
}): { token: string; session: AdminSession } {
  const sessionId = `sess_${generateRandomToken(24)}`;
  const now = Date.now();

  const isRoot = params.isRoot ?? isRootUsername(params.username);
  const defaultPermissions: TeamMemberPermissions = isRoot
    ? AUTH_ROOT_PERMISSIONS
    : AUTH_DEFAULT_PERMISSIONS;

  const session: AdminSession = {
    sessionId,
    username: params.username,
    displayName: params.displayName || params.username,
    role: params.role || (isRoot ? 'root_admin' : 'content_editor'),
    isRoot,
    permissions: params.permissions || defaultPermissions,
    ip: params.ip,
    userAgent: params.userAgent,
    createdAt: now,
    lastActiveAt: now,
    expiresAt: now + SESSION_DURATION_MS,
  };

  activeSessions.set(sessionId, session);
  persistSessions();

  const token = signSessionToken({
    sessionId: session.sessionId,
    username: session.username,
    displayName: session.displayName,
    role: session.role,
    isRoot: session.isRoot,
    permissions: session.permissions,
    createdAt: session.createdAt,
    expiresAt: session.expiresAt,
  });

  return { token, session };
}

/**
 * Validates a session token, updates activity timestamp, and checks timeout.
 */
export async function validateSessionToken(token: string): Promise<AdminSession | null> {
  if (!token) return null;

  const payload = verifySessionToken<{
    sessionId: string;
    username: string;
    displayName?: string;
    role: string;
    isRoot?: boolean;
    permissions?: TeamMemberPermissions;
    expiresAt: number;
    createdAt?: number;
  }>(token);
  if (
    !payload ||
    !payload.sessionId ||
    !payload.username ||
    !Number.isFinite(payload.expiresAt) ||
    (payload as any).type
  )
    return null;
  if (panicLockdownActive) return null;

  const now = Date.now();
  if (payload.expiresAt < now) {
    activeSessions.delete(payload.sessionId);
    return null;
  }

  // Cross check against live team store
  const member = await findTeamMemberByUsername(payload.username);

  // If member was suspended or deleted, destroy session
  if (!member || member.status === 'suspended') {
    activeSessions.delete(payload.sessionId);
    return null;
  }

  const isRoot = member?.isRoot ?? payload.isRoot ?? isRootUsername(payload.username);

  let session = activeSessions.get(payload.sessionId);
  if (!session || session.username !== payload.username) return null;
  else {
    // Keep live permissions strictly updated from persistent store
    if (member) {
      session.isRoot = isRoot;
      session.role = member.role;
      session.displayName = member.displayName;
      session.permissions = isRoot ? AUTH_ROOT_PERMISSIONS : member.permissions;
    }
  }

  // Check activity timeout
  if (!session || now - session.lastActiveAt > INACTIVITY_TIMEOUT_MS) {
    activeSessions.delete(payload.sessionId);
    return null;
  }

  session.lastActiveAt = now;
  return session;
}

export async function getAuthenticatedAdminSession(): Promise<AdminSession | null> {
  try {
    const req = currentRequest();
    const token = req.cookies[SESSION_COOKIE_NAME];
    if (!token) return null;
    const session = await validateSessionToken(token);
    if (!session) return null;

    const currentIp =
      req.get?.('cf-connecting-ip')?.trim() ||
      req.get?.('x-real-ip')?.trim() ||
      req.get?.('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.ip ||
      '127.0.0.1';

    // Anti-Hijacking: Track roaming IP (Cloudflare edge proxy rotation, mobile networks, VPNs)
    // without prematurely invalidating the cryptographically signed HMAC session token.
    if (
      session.ip &&
      session.ip !== '127.0.0.1' &&
      currentIp !== '127.0.0.1' &&
      session.ip !== currentIp
    ) {
      session.ip = currentIp;
    }

    return session;
  } catch {
    return null;
  }
}

export function revokeAdminSession(sessionId: string, username?: string): boolean {
  if (activeSessions.has(sessionId)) {
    const sess = activeSessions.get(sessionId);
    if (sess?.isRoot && username && !isRootUsername(username)) return false;
    activeSessions.delete(sessionId);
    persistSessions();
    if (sess) {
      recordAuditEvent({
        action: 'SESSION_REVOKED',
        actor: username || 'system',
        ip: sess.ip,
        details: { revokedSessionId: sessionId, username: sess.username },
      });
    }
    return true;
  }
  return false;
}

export function triggerPanicLockdown(actor: string, ip: string): void {
  panicLockdownActive = true;
  activeSessions.clear();
  persistSessions();
  recordAuditEvent({
    action: 'PANIC_LOCKDOWN_TRIGGERED',
    actor,
    ip,
    details: { reason: 'Manual trigger from Mission Control' },
  });
}

export function releasePanicLockdown(actor: string, ip: string): void {
  panicLockdownActive = false;
  persistSessions();
  recordAuditEvent({
    action: 'PANIC_LOCKDOWN_RELEASED',
    actor,
    ip,
    details: { reason: 'Admin master release' },
  });
}

export function isPanicLockdown(): boolean {
  return panicLockdownActive;
}

export function isPanicLockdownActive(): boolean {
  return panicLockdownActive;
}

export function getActiveSessions(): AdminSession[] {
  return getActiveSessionsList();
}

export function getActiveSessionsList(): AdminSession[] {
  const now = Date.now();
  const valid: AdminSession[] = [];
  for (const session of activeSessions.values()) {
    if (now <= session.expiresAt && now - session.lastActiveAt <= INACTIVITY_TIMEOUT_MS) {
      valid.push(session);
    }
  }
  return valid;
}

export function revokeSession(sessionId: string, username?: string): boolean {
  return revokeAdminSession(sessionId, username);
}

let rootAdminUserState: AdminUser = {
  username: 'iannC69',
  displayName: 'iannC (Founder & Root)',
  role: 'root_admin',
  isRoot: true,
  twoFactorEnabled: false,
  twoFactorSecret: undefined,
  backupCodes: [],
};

export async function getAdminUser(): Promise<AdminUser> {
  const root = (await loadTeamMembers()).find((m) => m.isRoot);
  if (root) {
    return {
      username: root.username,
      displayName: root.displayName,
      role: root.role,
      isRoot: true,
      permissions: root.permissions,
      twoFactorEnabled: rootAdminUserState.twoFactorEnabled,
      twoFactorSecret: rootAdminUserState.twoFactorSecret,
      backupCodes: rootAdminUserState.backupCodes,
    };
  }
  return rootAdminUserState;
}

export function updateAdminUser(updates: Partial<AdminUser>): AdminUser {
  rootAdminUserState = { ...rootAdminUserState, ...updates };
  return rootAdminUserState;
}
