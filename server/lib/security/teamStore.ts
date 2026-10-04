import { DOCS_ROOT, PUBLIC_ROOT, RUNTIME_ROOT } from '@server/storage/paths';
import fs from 'fs';
import path from 'path';
import { hashPassword, verifyPassword, generateRandomToken } from './crypto';
import { getLocalDatabaseConfig } from '../db/localStore';
import { supabaseSaveTeamMember, supabaseDeleteTeamMember } from '../db/supabase';

export interface TeamMemberPermissions {
  // ── Conținut & Workspace ──
  canEditDocs: boolean; // Content Studio (editare/creare ghiduri)
  canDeleteDocs: boolean; // Ștergere articole Markdown
  canManageHealth: boolean; // Doc Health & Linter
  canManageMedia: boolean; // Media & Asset Vault
  canManageTasks: boolean; // Task Hub & Team TODO

  // ── Telemetrie, AI & Baze de Date ──
  canViewAnalytics: boolean; // Search Telemetry & căutări
  canViewAiStats: boolean; // AI Engine Telemetry & tokeni
  canManageDb: boolean; // Database & Metrics (Supabase Sync)
  canViewAudit: boolean; // Audit Ledger & Trasabilitate SHA-256

  // ── Securitate & Infrastructură ──
  canManageSecurity: boolean; // Securitate 2FA & Sesiuni active
  canManageApiKeys: boolean; // API Tokens & Chei Servicii
  canManageSnapshots: boolean; // Snapshot Vault & Backup-uri
  canManageWebhooks: boolean; // Discord Webhooks & Notificări
  canManageSettings: boolean; // Engine Settings & Mentenanță

  // ── Discord Bot Control Center ──
  canManageDiscordBot: boolean; // Dashboard Discord Bot (Tickete, Staff, Stats, Watchlist)

  // ── Restricționate Root Super Admin ──
  canManageTeam: boolean; // Gestiune Echipă & Permisiuni (Root iannC69)
  canTriggerPanic: boolean; // Panic Lockdown de Urgență (Root iannC69)
}

export interface TeamMember {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  role:
    | 'root_admin'
    | 'doc_lead'
    | 'content_editor'
    | 'moderator'
    | 'viewer'
    | 'security_auditor'
    | 'custom';
  customTitle?: string; // ex: "Founder & Lead Architect", "Senior Content Editor"
  avatarUrl?: string; // Custom profile image URL (or fallback to avatarColor monogram)
  avatarColor: string;
  bio?: string; // Short bio / mission statement
  responsibilities?: string[]; // List of responsibilities / areas
  badges?: string[]; // List of highlight badges
  discord?: string; // Discord username or User ID
  steamId?: string; // Steam ID, Steam64, or Steam profile link
  githubUsername?: string; // GitHub profile username (for profile page integration)
  docsModifiedCount?: number; // Number of doc files created/modified
  status: 'active' | 'suspended';
  suspendedReason?: 'inactivity_30d' | 'manual_admin' | string;
  suspendedAt?: string;
  unfrozenAt?: string;
  isRoot: boolean;
  createdAt: string;
  lastLoginAt?: string;
  passwordHash: string;
  salt: string;
  totpEnabled?: boolean;
  totpSecret?: string;
  permissions: TeamMemberPermissions;
  notificationPreferences?: {
    task?: boolean;
    system?: boolean;
    security?: boolean;
    content?: boolean;
    report?: boolean;
  };
}

export type PublicTeamMember = Omit<
  TeamMember,
  | 'passwordHash'
  | 'salt'
  | 'email'
  | 'totpSecret'
  | 'totpEnabled'
  | 'permissions'
  | 'notificationPreferences'
>;

const TEAM_FILE_PATH = path.join(RUNTIME_ROOT, 'content', 'team.json');
const ENV_LOCAL_PATH = path.join(process.cwd(), '.env.local');

const ROOT_PERMISSIONS: TeamMemberPermissions = {
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

export const ROLE_PRESETS: Record<
  string,
  { label: string; description: string; permissions: TeamMemberPermissions }
> = {
  root_admin: {
    label: 'Root Super Admin',
    description: 'Control absolut peste întregul sistem, Panic Lockdown și gestiunea echipei.',
    permissions: ROOT_PERMISSIONS,
  },
  doc_lead: {
    label: 'Documentation Lead',
    description:
      'Gestionează articolele, sănătatea documentației, resursele media, sarcinile și setările.',
    permissions: {
      canEditDocs: true,
      canDeleteDocs: true,
      canManageHealth: true,
      canManageMedia: true,
      canManageTasks: true,
      canViewAnalytics: true,
      canViewAiStats: true,
      canManageDb: false,
      canViewAudit: true,
      canManageSecurity: false,
      canManageApiKeys: false,
      canManageSnapshots: true,
      canManageWebhooks: true,
      canManageSettings: true,
      canManageTeam: false,
      canTriggerPanic: false,
      canManageDiscordBot: true,
    },
  },
  content_editor: {
    label: 'Content Editor',
    description:
      'Redactează și actualizează ghiduri Markdown, verifică sănătatea docs și gestionează media & task-uri.',
    permissions: {
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
    },
  },

  security_auditor: {
    label: 'Security Auditor',
    description:
      'Monitorizează registrul de audit, securitatea 2FA și telemetria AI. Acces read-only pe infrastructură.',
    permissions: {
      canEditDocs: false,
      canDeleteDocs: false,
      canManageHealth: false,
      canManageMedia: false,
      canManageTasks: true,
      canViewAnalytics: true,
      canViewAiStats: true,
      canManageDb: false, // Auditor citește, nu configurează DB
      canViewAudit: true,
      canManageSecurity: true,
      canManageApiKeys: false, // Nu poate genera/revoca chei API — risc backdoor
      canManageSnapshots: false, // Nu poate restaura/șterge backup-uri
      canManageWebhooks: false, // Nu poate trimite/reconfigura webhooks Discord
      canManageSettings: false,
      canManageTeam: false,
      canTriggerPanic: false,
      canManageDiscordBot: false,
    },
  },
  moderator: {
    label: 'Reviewer / Moderator',
    description:
      'Revizuiește documentația, gestionează sarcini și monitorizează căutările jucătorilor.',
    permissions: {
      canEditDocs: true,
      canDeleteDocs: false,
      canManageHealth: true,
      canManageMedia: false,
      canManageTasks: true,
      canViewAnalytics: true,
      canViewAiStats: false,
      canManageDb: false,
      canViewAudit: true,
      canManageSecurity: false,
      canManageApiKeys: false,
      canManageSnapshots: false,
      canManageWebhooks: false,
      canManageSettings: false,
      canManageTeam: false,
      canTriggerPanic: false,
      canManageDiscordBot: false,
    },
  },
  viewer: {
    label: 'Auditor / Read-Only',
    description:
      'Acces exclusiv de vizualizare pe documentație, telemetrie și rapoarte. Fără acces la costuri AI.',
    permissions: {
      canEditDocs: false,
      canDeleteDocs: false,
      canManageHealth: false,
      canManageMedia: false,
      canManageTasks: false,
      canViewAnalytics: true,
      canViewAiStats: false, // Costuri AI/tokeni — informații financiare interne
      canManageDb: false,
      canViewAudit: true,
      canManageSecurity: false,
      canManageApiKeys: false,
      canManageSnapshots: false,
      canManageWebhooks: false,
      canManageSettings: false,
      canManageTeam: false,
      canTriggerPanic: false,
      canManageDiscordBot: false,
    },
  },
  custom: {
    label: 'Rol Personalizat (Custom)',
    description: 'Permisiuni configurate individual direct de către Root Super Admin.',
    permissions: {
      canEditDocs: true,
      canDeleteDocs: false,
      canManageHealth: true,
      canManageMedia: false,
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
      canManageDiscordBot: true,
    },
  },
  discord_dev: {
    label: 'Discord Bot Developer',
    description:
      'Acces exclusiv la Discord Bot Control Center: tickete, staff, statistici, watchlist. Fără acces la documentație.',
    permissions: {
      canEditDocs: false,
      canDeleteDocs: false,
      canManageHealth: false,
      canManageMedia: false,
      canManageTasks: false,
      canViewAnalytics: false,
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
      canManageDiscordBot: true,
    },
  },
};

/**
 * Synchronizes team members and passwords directly to .env.local
 */

function initRootMember(): TeamMember {
  const salt = generateRandomToken(16);
  const initialPassword = process.env.ADMIN_INITIAL_PASSWORD;
  if (!initialPassword)
    throw new Error('ADMIN_INITIAL_PASSWORD is required to initialize an empty account store');
  const { hash } = hashPassword(initialPassword, salt);

  // Sync root to .env.local

  return {
    id: 'user_root_iannc69',
    username: 'iannC69',
    displayName: 'iannC (Founder & Root)',
    email: 'iannc@wildfire.ro',
    role: 'root_admin',
    avatarColor: '#ff6b00',
    passwordHash: hash,
    salt,
    permissions: ROOT_PERMISSIONS,
    status: 'active',
    isRoot: true,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };
}

export function loadTeamMembersSync(): TeamMember[] {
  try {
    if (fs.existsSync(TEAM_FILE_PATH)) {
      const raw = fs.readFileSync(TEAM_FILE_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to sync load team members:', err);
  }
  return [initRootMember()];
}

export async function loadTeamMembers(): Promise<TeamMember[]> {
  try {
    const config = getLocalDatabaseConfig();
    let members: TeamMember[] | null = null;

    if (config.provider === 'supabase' && config.supabaseUrl && config.supabaseAnonKey) {
      const { supabaseGetTeamMembers } = await import('../db/supabase');
      const dbMembers = await supabaseGetTeamMembers({
        url: config.supabaseUrl,
        anonKey: config.supabaseAnonKey,
      });
      if (dbMembers && dbMembers.length > 0) {
        members = dbMembers;
        // Optionally update the local cache
        const dir = path.dirname(TEAM_FILE_PATH);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(TEAM_FILE_PATH, JSON.stringify(members, null, 2), 'utf-8');
      }
    }

    if (!members && fs.existsSync(TEAM_FILE_PATH)) {
      const raw = fs.readFileSync(TEAM_FILE_PATH, 'utf-8');
      members = JSON.parse(raw);
    }

    if (members) {
      const hasRoot = members.some(
        (m) => m.username.toLowerCase() === 'iannc69' || m.username.toLowerCase() === 'iannc',
      );
      if (!hasRoot) {
        members.unshift(initRootMember());
        await saveTeamMembers(members);
      }
      return members;
    }
  } catch (err) {
    console.error('Failed to load team members:', err);
  }

  const initial = [initRootMember()];
  await saveTeamMembers(initial);
  return initial;
}

async function syncTeamToSupabase(members: TeamMember[]): Promise<void> {
  try {
    const config = getLocalDatabaseConfig();
    if (config.provider === 'supabase' && config.supabaseUrl && config.supabaseAnonKey) {
      for (const m of members) {
        await supabaseSaveTeamMember(
          { url: config.supabaseUrl, anonKey: config.supabaseAnonKey },
          m,
        );
      }
    }
  } catch (err) {
    console.warn('[TeamStore] Background Supabase sync error:', err);
  }
}

export async function saveTeamMembers(members: TeamMember[]): Promise<boolean> {
  try {
    const dir = path.dirname(TEAM_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(TEAM_FILE_PATH, JSON.stringify(members, null, 2), 'utf-8');

    // Așteptăm salvarea sincronă în Supabase
    await syncTeamToSupabase(members);

    return true;
  } catch (err) {
    console.error('Failed to save team members to disk:', err);
    return false;
  }
}

export async function findTeamMemberByUsername(username: string): Promise<TeamMember | null> {
  const members = await loadTeamMembers();
  const clean = username.trim().toLowerCase();
  return (
    members.find(
      (m) =>
        m.username.toLowerCase() === clean ||
        m.displayName.toLowerCase() === clean ||
        (m.isRoot && (clean === 'iannc' || clean === 'iannc69')),
    ) || null
  );
}

export function findTeamMemberByUsernameSync(username: string): TeamMember | null {
  const members = loadTeamMembersSync();
  const clean = username.trim().toLowerCase();
  return members.find((m) => m.username.toLowerCase() === clean) || null;
}

export async function createTeamMember(params: {
  username: string;
  displayName: string;
  email?: string;
  role: 'root_admin' | 'doc_lead' | 'content_editor' | 'moderator' | 'viewer';
  password: string;
  customPermissions?: Partial<TeamMemberPermissions>;
  customTitle?: string;
  avatarUrl?: string;
  discord?: string;
  steamId?: string;
  githubUsername?: string;
  bio?: string;
  responsibilities?: string[];
}): Promise<{ success: boolean; error?: string; member?: TeamMember }> {
  const cleanUsername = params.username.trim();
  if (!cleanUsername || cleanUsername.length < 3) {
    return { success: false, error: 'Numele de utilizator trebuie să aibă cel puțin 3 caractere.' };
  }

  const members = await loadTeamMembers();
  if (members.some((m) => m.username.toLowerCase() === cleanUsername.toLowerCase())) {
    return { success: false, error: `Utilizatorul "${cleanUsername}" există deja în echipă.` };
  }

  const salt = `salt_${generateRandomToken(12)}`;
  const { hash } = hashPassword(params.password, salt);
  const basePermissions =
    ROLE_PRESETS[params.role]?.permissions || ROLE_PRESETS.content_editor.permissions;

  const permissions: TeamMemberPermissions = {
    ...basePermissions,
    ...(params.customPermissions || {}),
    // Only root can ever have canTriggerPanic or canManageTeam
    canTriggerPanic: params.role === 'root_admin',
    canManageTeam: params.role === 'root_admin',
  };

  const colors = ['#ff6b00', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];
  const avatarColor = colors[Math.floor(Math.random() * colors.length)];

  const newMember: TeamMember = {
    id: `user_${generateRandomToken(16)}`,
    username: cleanUsername,
    displayName: params.displayName.trim() || cleanUsername,
    email: params.email?.trim(),
    role: params.role,
    customTitle: params.customTitle?.trim(),
    avatarUrl: params.avatarUrl?.trim(),
    avatarColor,
    bio: params.bio?.trim(),
    discord: params.discord?.trim(),
    steamId: params.steamId?.trim(),
    githubUsername: params.githubUsername?.trim() || undefined,
    responsibilities: params.responsibilities,
    docsModifiedCount: 0,
    passwordHash: hash,
    salt,
    permissions,
    status: 'active',
    isRoot: false,
    createdAt: new Date().toISOString(),
  };

  members.push(newMember);
  await saveTeamMembers(members);

  // Sync to .env.local

  return { success: true, member: newMember };
}

export async function updateTeamMember(
  id: string,
  updates: {
    username?: string;
    displayName?: string;
    email?: string;

    role?: 'root_admin' | 'doc_lead' | 'content_editor' | 'moderator' | 'viewer';
    status?: 'active' | 'suspended';
    action?: 'unfreeze' | string;
    suspendedReason?: string;
    permissions?: Partial<TeamMemberPermissions>;
    password?: string;
    customTitle?: string;
    avatarUrl?: string;
    avatarColor?: string;
    bio?: string;
    discord?: string;
    steamId?: string;
    githubUsername?: string;
    totpSecret?: string;
    totpEnabled?: boolean;
    responsibilities?: string[];
    badges?: string[];
    docsModifiedCount?: number;
    notificationPreferences?: {
      task?: boolean;
      system?: boolean;
      security?: boolean;
      content?: boolean;
      report?: boolean;
    };
  },
): Promise<{ success: boolean; error?: string; member?: TeamMember }> {
  const members = await loadTeamMembers();
  const idx = members.findIndex((m) => m.id === id);
  if (idx === -1) {
    return { success: false, error: 'Membrul echipei nu a fost găsit.' };
  }

  const target = members[idx];

  // Prevent modifying root flags on non-root or demoting root
  if (target.isRoot) {
    if (updates.status === 'suspended') {
      return { success: false, error: 'Contul Root Super Admin nu poate fi suspendat.' };
    }
  }

  if (updates.username && !target.isRoot) {
    const cleanUser = updates.username.trim();
    if (cleanUser && cleanUser.toLowerCase() !== target.username.toLowerCase()) {
      const exists = members.some(
        (m) => m.id !== id && m.username.toLowerCase() === cleanUser.toLowerCase(),
      );
      if (exists) {
        return {
          success: false,
          error: 'Numele de utilizator este deja folosit de un alt membru.',
        };
      }
      target.username = cleanUser;
    }
  }

  if (updates.displayName) target.displayName = updates.displayName.trim();
  if (updates.email !== undefined) target.email = updates.email.trim();
  if (updates.customTitle !== undefined) target.customTitle = updates.customTitle.trim();

  if (updates.avatarUrl !== undefined) target.avatarUrl = updates.avatarUrl.trim();
  if (updates.avatarColor !== undefined) target.avatarColor = updates.avatarColor;
  if (updates.bio !== undefined) target.bio = updates.bio.trim();
  if (updates.discord !== undefined) target.discord = updates.discord?.trim();
  if (updates.steamId !== undefined) target.steamId = updates.steamId?.trim();
  if (updates.githubUsername !== undefined)
    target.githubUsername = updates.githubUsername?.trim() || undefined;
  if (updates.totpSecret !== undefined) target.totpSecret = updates.totpSecret;
  if (updates.totpEnabled !== undefined) target.totpEnabled = updates.totpEnabled;
  if (updates.responsibilities !== undefined) target.responsibilities = updates.responsibilities;
  if (updates.badges !== undefined) target.badges = updates.badges;
  if (updates.docsModifiedCount !== undefined)
    target.docsModifiedCount = Math.max(0, updates.docsModifiedCount);
  if (updates.notificationPreferences !== undefined) {
    target.notificationPreferences = {
      ...(target.notificationPreferences || {}),
      ...updates.notificationPreferences,
    };
  }

  if (updates.role && !target.isRoot) {
    target.role = updates.role;
    target.permissions = {
      ...ROLE_PRESETS[updates.role].permissions,
      ...(updates.permissions || {}),
      canTriggerPanic: false,
      canManageTeam: false,
    };
  } else if (updates.permissions && !target.isRoot) {
    target.permissions = {
      ...target.permissions,
      ...updates.permissions,
      canTriggerPanic: false,
      canManageTeam: false,
    };
  }

  if (!target.isRoot) {
    if (updates.action === 'unfreeze' || (updates.status === 'active' && target.status === 'suspended')) {
      target.status = 'active';
      target.unfrozenAt = new Date().toISOString();
      target.lastLoginAt = new Date().toISOString();
      target.suspendedReason = undefined;
      target.suspendedAt = undefined;
    } else if (updates.status === 'suspended') {
      target.status = 'suspended';
      target.suspendedReason = updates.suspendedReason || target.suspendedReason || 'manual_admin';
      target.suspendedAt = new Date().toISOString();
    } else if (updates.status === 'active') {
      target.status = 'active';
    }
  }

  if (updates.password && updates.password.trim()) {
    const salt = `salt_${generateRandomToken(12)}`;
    const { hash } = hashPassword(updates.password.trim(), salt);
    target.passwordHash = hash;
    target.salt = salt;
    // Sync updated password to .env.local
  }

  members[idx] = target;
  await saveTeamMembers(members);

  return { success: true, member: target };
}

export async function incrementMemberDocCount(username: string): Promise<void> {
  try {
    const members = await loadTeamMembers();
    const clean = username.trim().toLowerCase();
    const target = members.find((m) => m.username.toLowerCase() === clean);
    if (target) {
      target.docsModifiedCount = (target.docsModifiedCount || 0) + 1;
      await saveTeamMembers(members);
    }
  } catch (err) {
    console.error('Failed to increment member doc count:', err);
  }
}

export function getPublicTeamMembersSync(): PublicTeamMember[] {
  const members = loadTeamMembersSync();
  return members
    .filter((m) => m.status === 'active')
    .map(
      ({
        passwordHash,
        salt,
        email,
        totpSecret,
        totpEnabled,
        permissions,
        notificationPreferences,
        ...safe
      }) => safe,
    );
}

export async function getPublicTeamMembers(): Promise<PublicTeamMember[]> {
  const members = await loadTeamMembers();
  return members
    .filter((m) => m.status === 'active')
    .map(
      ({
        passwordHash,
        salt,
        email,
        totpSecret,
        totpEnabled,
        permissions,
        notificationPreferences,
        ...safe
      }) => safe,
    );
}

export async function deleteTeamMember(id: string): Promise<{ success: boolean; error?: string }> {
  const members = await loadTeamMembers();
  const target = members.find((m) => m.id === id);
  if (!target) {
    return { success: false, error: 'Membrul echipei nu a fost găsit.' };
  }
  if (target.isRoot) {
    return {
      success: false,
      error: 'Contul Root Super Admin (iannC69) este protejat și nu poate fi șters.',
    };
  }

  const filtered = members.filter((m) => m.id !== id);
  await saveTeamMembers(filtered);

  // Background delete from Supabase
  try {
    const config = getLocalDatabaseConfig();
    if (config.provider === 'supabase' && config.supabaseUrl && config.supabaseAnonKey) {
      supabaseDeleteTeamMember(
        { url: config.supabaseUrl, anonKey: config.supabaseAnonKey },
        id,
      ).catch(() => {});
    }
  } catch {}

  // Remove from .env.local

  return { success: true };
}
