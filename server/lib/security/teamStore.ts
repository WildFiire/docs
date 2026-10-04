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

export function getDefaultTeamMembers(): TeamMember[] {
  const rootSalt = process.env.ADMIN_DEFAULT_SALT || 'wf_root_salt_2026';
  const initialPassword = process.env.ADMIN_INITIAL_PASSWORD;
  const rootHash = initialPassword
    ? hashPassword(initialPassword, rootSalt).hash
    : 'ed43c8e23c47beafcea7f2638c8dcf78b47c8edaec4e09eba1064bcef06d7098fcaa3dca286553b5e276bcfbaad6049283b795bf65d001f239b67f16eb562c82';

  return [
    {
      id: 'user_root_iannc69',
      username: 'iannC69',
      displayName: 'iannC',
      email: 'iannc@wildfire.ro',
      role: 'root_admin',
      customTitle: 'Lead Docs & Systems Architect',
      avatarUrl:
        'https://avatars.fastly.steamstatic.com/f9a2171998ee2677dae87089953177799dbf7dc1_full.jpg',
      avatarColor: '#ff6b00',
      bio: 'Se ocupă de structura, redactarea și actualizarea platformei de documentație, integrarea sistemelor tehnice și experiența generală a ghidurilor WildFire.',
      responsibilities: [
        'Arhitectură Documentație',
        'Redactare & Ghiduri Tehnice',
        'Optimizare Docs Engine',
        'Supervizare Echipă Docs',
        'Securitate & 2FA',
      ],
      badges: ['LEAD ARCHITECT', 'DOCS SPECIALIST', 'SYSTEMS LEAD'],
      discord: '371621920162185216',
      steamId: 'https://steamcommunity.com/id/1iannc/',
      githubUsername: 'iannC69',
      docsModifiedCount: 1,
      passwordHash: rootHash,
      salt: rootSalt,
      totpEnabled: false,
      permissions: ROOT_PERMISSIONS,
      status: 'active',
      isRoot: true,
      createdAt: '2026-08-17T18:20:32.349+00:00',
      lastLoginAt: new Date().toISOString(),
    },
    {
      id: 'user_83750fc6a71f918f089d8f783542baf9',
      username: 'Yakuza',
      displayName: 'Yakuza',
      email: 'yakuza@wildfire.ro',
      role: 'content_editor',
      customTitle: 'Senior Content Editor & Reviewer',
      avatarUrl:
        'https://avatars.akamai.steamstatic.com/e2847cb722e1ec8bf9df607659f7f5e3804a0182_full.jpg',
      avatarColor: '#10b981',
      bio: 'Responsabil de elaborarea ghidurilor detaliate pentru jucători, proceduri de joc, revizuirea mecanicii și acuratețea datelor.',
      responsibilities: [
        'Ghiduri Jucători',
        'Sisteme & MVP',
        'Media & Asset Vault',
        'Verificare Acuratețe',
      ],
      badges: ['CONTENT LEAD', 'VERIFIED GUIDE'],
      discord: '778170514036228097',
      steamId: 'https://steamcommunity.com/id/YakuzaTheImmortal',
      githubUsername: 'Yakuza2377',
      docsModifiedCount: 3,
      passwordHash:
        'f824a42578d0586e470a99ef629c5f6d2f34afffcdab78de9b204d69ebc541ae57ffac9b43a6495fba81c01b56b4e601979b9916259acb41350e8929d3aa8b4f',
      salt: 'salt_a33fb9bd2f803c2ee297b267',
      totpEnabled: false,
      permissions: {
        canEditDocs: true,
        canViewAudit: false,
        canDeleteDocs: false,
        canManageTeam: false,
        canManageMedia: true,
        canTriggerPanic: false,
        canManageApiKeys: false,
        canViewAnalytics: true,
        canManageSecurity: false,
        canManageSettings: false,
        canManageHealth: true,
        canManageTasks: true,
        canViewAiStats: false,
        canManageDb: false,
        canManageSnapshots: false,
        canManageWebhooks: false,
        canManageDiscordBot: false,
      },
      status: 'active',
      isRoot: false,
      createdAt: '2026-08-21T14:15:00.61+00:00',
      lastLoginAt: '2026-08-22T10:11:39.115+00:00',
    },
    {
      id: 'user_5d1bd9841e1a0968998b302637aaced5',
      username: 'V1ccX',
      displayName: 'V1ccX',
      role: 'content_editor',
      customTitle: 'Senior Content Editor',
      avatarUrl:
        'https://avatars.akamai.steamstatic.com/4963bca91b1b3edf88de548e459b2092a35312e7_full.jpg',
      avatarColor: '#06b6d4',
      bio: 'Redactează documentația tehnică a serverelor CS2, realizează task-uri de conținut și actualizări periodice.',
      responsibilities: [
        'Documentație Tehnică',
        'Actualizări Periodice',
        'Task Management',
      ],
      badges: ['CONTENT CREATOR'],
      discord: '996796351587287100',
      steamId: 'https://steamcommunity.com/profiles/76561199698821208',
      githubUsername: 'Vicc09',
      docsModifiedCount: 2,
      passwordHash:
        'a83b581b6bc88de0bd4954849da0a859df0d89b4bc3638cc233a56675d4e2df1c88daa1c0b61c74322c3f0729a295632d4085e5eb5cf478918d7622ed1c459b6',
      salt: 'salt_c136591ad0fc7e653fcd5d5a',
      totpEnabled: false,
      permissions: {
        canEditDocs: true,
        canManageDb: false,
        canViewAudit: false,
        canDeleteDocs: false,
        canManageTeam: false,
        canManageMedia: true,
        canManageTasks: true,
        canViewAiStats: false,
        canManageHealth: true,
        canTriggerPanic: false,
        canManageApiKeys: false,
        canViewAnalytics: true,
        canManageSecurity: false,
        canManageSettings: false,
        canManageWebhooks: false,
        canManageSnapshots: false,
        canManageDiscordBot: false,
      },
      status: 'active',
      isRoot: false,
      createdAt: '2026-08-22T10:01:24.486+00:00',
      lastLoginAt: '2026-10-04T11:09:20.42+00:00',
    },
    {
      id: 'user_2f6fcb4ed5f4780859ff8a272d017a60',
      username: 'umpy',
      displayName: 'umpy',
      role: 'root_admin',
      customTitle: 'Co-Root & Systems Lead',
      avatarUrl:
        'https://avatars.akamai.steamstatic.com/562c921ff1c8b59f1c5f9642c39608af2984128b_full.jpg',
      avatarColor: '#8b5cf6',
      bio: 'Co-fondator și responsabil de infrastructura tehnică a serverelor CS2 WildFire. Supervizează stabilitatea rețelei, integrarea sistemelor tehnice și calitatea.',
      responsibilities: [
        'Infrastructură & Servere CS2',
        'Supervizare Tehnică & Sisteme',
        'Mentenanță & Stabilitate',
        'Revizuire Ghiduri Tehnice',
      ],
      badges: ['SYSTEMS CO-LEAD', 'ROOT FOUNDER'],
      discord: '650621084223275010',
      steamId: 'https://steamcommunity.com/profiles/76561198974838451',
      githubUsername: 'umpy04',
      docsModifiedCount: 0,
      passwordHash:
        '3c515f70a32f26ab6eeb08402105b118219bf72ae6fcf56d275111ee3c03cf955b9f21d9dc66d9e588d0c56b4d64c86e8bfa50cafb169e219a9a9c799de59deb',
      salt: 'salt_46e9d28bdec8f5b50df834db',
      totpEnabled: false,
      permissions: {
        canEditDocs: true,
        canManageDb: true,
        canViewAudit: true,
        canDeleteDocs: true,
        canManageTeam: false,
        canManageMedia: true,
        canManageTasks: true,
        canViewAiStats: true,
        canManageHealth: true,
        canTriggerPanic: false,
        canManageApiKeys: true,
        canViewAnalytics: true,
        canManageSecurity: true,
        canManageSettings: true,
        canManageWebhooks: true,
        canManageSnapshots: true,
        canManageDiscordBot: false,
      },
      status: 'active',
      isRoot: false,
      createdAt: '2026-08-25T13:54:01.625+00:00',
      lastLoginAt: null,
    },
  ];
}

export function reconcileTeamMembers(loadedMembers: TeamMember[]): {
  members: TeamMember[];
  modified: boolean;
} {
  const defaults = getDefaultTeamMembers();
  if (!loadedMembers || loadedMembers.length === 0) {
    return { members: defaults, modified: true };
  }

  let modified = false;
  const result: TeamMember[] = [...loadedMembers];

  for (const def of defaults) {
    const existingIndex = result.findIndex(
      (m) => m.username.toLowerCase() === def.username.toLowerCase(),
    );

    if (existingIndex === -1) {
      result.push(def);
      modified = true;
    } else {
      const existing = { ...result[existingIndex] };
      let memberModified = false;

      // Reconcile avatarUrl if missing or empty
      if (!existing.avatarUrl || existing.avatarUrl.trim() === '') {
        if (def.avatarUrl) {
          existing.avatarUrl = def.avatarUrl;
          memberModified = true;
        }
      }

      // Reconcile customTitle if missing or empty
      if (!existing.customTitle || existing.customTitle.trim() === '') {
        if (def.customTitle) {
          existing.customTitle = def.customTitle;
          memberModified = true;
        }
      }

      // Reconcile bio if missing or empty
      if (!existing.bio || existing.bio.trim() === '') {
        if (def.bio) {
          existing.bio = def.bio;
          memberModified = true;
        }
      }

      // Reconcile discord if missing or empty
      if (!existing.discord || existing.discord.trim() === '') {
        if (def.discord) {
          existing.discord = def.discord;
          memberModified = true;
        }
      }

      // Reconcile steamId if missing or empty
      if (!existing.steamId || existing.steamId.trim() === '') {
        if (def.steamId) {
          existing.steamId = def.steamId;
          memberModified = true;
        }
      }

      // Reconcile githubUsername if missing or empty
      if (!existing.githubUsername || existing.githubUsername.trim() === '') {
        if (def.githubUsername) {
          existing.githubUsername = def.githubUsername;
          memberModified = true;
        }
      }

      // Reconcile badges if empty or missing
      if (!existing.badges || existing.badges.length === 0) {
        if (def.badges && def.badges.length > 0) {
          existing.badges = def.badges;
          memberModified = true;
        }
      }

      // Reconcile responsibilities if empty or missing
      if (!existing.responsibilities || existing.responsibilities.length === 0) {
        if (def.responsibilities && def.responsibilities.length > 0) {
          existing.responsibilities = def.responsibilities;
          memberModified = true;
        }
      }

      // Fix legacy placeholder displayName for root
      if (
        (existing.username.toLowerCase() === 'iannc69' || existing.isRoot) &&
        existing.displayName === 'iannC (Founder & Root)'
      ) {
        existing.displayName = 'iannC';
        memberModified = true;
      }

      // Ensure root has all root permissions enabled
      if (existing.isRoot && !existing.permissions.canManageHealth) {
        existing.permissions = { ...ROOT_PERMISSIONS, ...existing.permissions };
        memberModified = true;
      }

      // Reconcile root password if it is the legacy initial password hash
      const LEGACY_INITIAL_HASH =
        'b3f609a854dcf6bf00b3150c55dcbe132ca37b3e2ea88ad0e23e07985ba5969dda8689fe17b08c007137cf932f3d7e56c01359dc24037ed3b898da3f1ba1255c';
      if (
        existing.isRoot &&
        (existing.passwordHash === LEGACY_INITIAL_HASH || !existing.passwordHash)
      ) {
        existing.passwordHash = def.passwordHash;
        existing.salt = def.salt;
        memberModified = true;
      }

      if (memberModified) {
        result[existingIndex] = existing;
        modified = true;
      }
    }
  }

  return { members: result, modified };
}

function initRootMember(): TeamMember {
  return getDefaultTeamMembers()[0];
}

export function loadTeamMembersSync(): TeamMember[] {
  let loaded: TeamMember[] | null = null;
  try {
    if (fs.existsSync(TEAM_FILE_PATH)) {
      const raw = fs.readFileSync(TEAM_FILE_PATH, 'utf-8');
      loaded = JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to sync load team members:', err);
  }

  const { members: reconciled, modified } = reconcileTeamMembers(loaded || []);
  if (modified || !fs.existsSync(TEAM_FILE_PATH)) {
    try {
      const dir = path.dirname(TEAM_FILE_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(TEAM_FILE_PATH, JSON.stringify(reconciled, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to persist reconciled team members:', e);
    }
  }
  return reconciled;
}

let cachedMembers: TeamMember[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds in-memory cache

export function invalidateTeamMemberCache(): void {
  cachedMembers = null;
  lastCacheTime = 0;
}

export async function loadTeamMembers(): Promise<TeamMember[]> {
  const now = Date.now();
  if (cachedMembers && now - lastCacheTime < CACHE_TTL_MS) {
    return cachedMembers;
  }

  let members: TeamMember[] | null = null;
  try {
    const config = getLocalDatabaseConfig();

    if (config.provider === 'supabase' && config.supabaseUrl && config.supabaseAnonKey) {
      const { supabaseGetTeamMembers } = await import('../db/supabase');
      const dbMembers = await supabaseGetTeamMembers({
        url: config.supabaseUrl,
        anonKey: config.supabaseAnonKey,
      });
      if (dbMembers && dbMembers.length > 0) {
        members = dbMembers;
      }
    }

    if (!members && fs.existsSync(TEAM_FILE_PATH)) {
      const raw = fs.readFileSync(TEAM_FILE_PATH, 'utf-8');
      members = JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load team members from Supabase, using local fallback:', err);
    if (fs.existsSync(TEAM_FILE_PATH)) {
      try {
        const raw = fs.readFileSync(TEAM_FILE_PATH, 'utf-8');
        members = JSON.parse(raw);
      } catch {}
    }
  }

  const { members: reconciled, modified } = reconcileTeamMembers(members || cachedMembers || getDefaultTeamMembers());
  if (!fs.existsSync(TEAM_FILE_PATH)) {
    try {
      const dir = path.dirname(TEAM_FILE_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(TEAM_FILE_PATH, JSON.stringify(reconciled, null, 2), 'utf-8');
    } catch {}
  }
  cachedMembers = reconciled;
  lastCacheTime = now;
  return reconciled;
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
    invalidateTeamMemberCache();

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
