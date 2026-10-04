<script lang="ts">
export interface TeamMemberPermissions {
  // Conținut & Workspace (Core & Publishing)
  canEditDocs: boolean;
  canDeleteDocs: boolean;
  canManageHealth: boolean;
  canManageMedia: boolean;
  canManageTasks: boolean;

  // Telemetrie, Securitate & Infrastructură (Operational & Management)
  canViewAnalytics: boolean;
  canViewAiStats: boolean;
  canManageDb: boolean;
  canViewAudit: boolean;
  canManageSecurity: boolean;
  canManageApiKeys: boolean;
  canManageSnapshots: boolean;
  canManageWebhooks: boolean;
  canManageDiscordBot?: boolean;
  canManageSettings: boolean;

  // Comenzi Restricționate Root Super Admin (Dangerous & Root)
  canManageTeam: boolean;
  canTriggerPanic: boolean;
}

export interface TeamMember {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  role: string;
  customTitle?: string;
  avatarUrl?: string;
  avatarColor?: string;
  bio?: string;
  responsibilities?: string[];
  badges?: string[];
  discord?: string;
  steamId?: string;
  githubUsername?: string;
  docsModifiedCount?: number;
  status: 'active' | 'suspended';
  suspendedReason?: 'inactivity_30d' | 'manual_admin' | string;
  suspendedAt?: string;
  unfrozenAt?: string;
  isRoot: boolean;
  createdAt?: string;
  lastLoginAt?: string;
  totpEnabled?: boolean;
  permissions: TeamMemberPermissions;
}

export interface PermissionModuleItem {
  key: keyof TeamMemberPermissions;
  name: string;
  desc: string;
  icon: string;
  color: string;
  isRestricted?: boolean;
}

export interface PermissionCategoryGroup {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  accent: string;
  modules: PermissionModuleItem[];
}

export const PERMISSION_GROUPS: PermissionCategoryGroup[] = [
  {
    id: 'core',
    title: 'Conținut, Workspace & Documentație (Core & Publishing)',
    subtitle: 'Module de editare ghiduri, verificare integritate, fișiere media și task-uri',
    icon: 'lucide:file-text',
    accent: '#10b981',
    modules: [
      { key: 'canEditDocs', name: 'Content Studio', desc: 'Redactare și publicare ghiduri Markdown', icon: 'lucide:file-edit', color: '#10b981' },
      { key: 'canDeleteDocs', name: 'Ștergere Docs', desc: 'Permisiune de ștergere definitivă fișiere', icon: 'lucide:trash-2', color: '#f43f5e' },
      { key: 'canManageHealth', name: 'Doc Health & Linter', desc: 'Scanare automată de integritate și erori', icon: 'lucide:activity', color: '#06b6d4' },
      { key: 'canManageMedia', name: 'Media & Asset Vault', desc: 'Upload și gestiune galerie de imagini', icon: 'lucide:folder', color: '#3b82f6' },
      { key: 'canManageTasks', name: 'Task Hub & TODO', desc: 'Creare, asignare și bifare sarcini în echipă', icon: 'lucide:list-todo', color: '#8b5cf6' },
    ],
  },
  {
    id: 'ops',
    title: 'Telemetrie, Securitate & Infrastructură (Operational & Management)',
    subtitle: 'Telemetrie AI, căutare, baze de date, audit SHA-256, 2FA, tokeni și backup-uri',
    icon: 'lucide:sliders',
    accent: '#3b82f6',
    modules: [
      { key: 'canViewAnalytics', name: 'Search Telemetry', desc: 'Analiză căutări, termeni populari & trends', icon: 'lucide:search', color: '#a855f7' },
      { key: 'canViewAiStats', name: 'AI Engine Telemetry', desc: 'Consum tokeni, latență și incidente AI', icon: 'lucide:cpu', color: '#ec4899' },
      { key: 'canManageDb', name: 'Database & Metrics', desc: 'Monitorizare stocare și sincronizare Supabase', icon: 'lucide:database', color: '#06b6d4' },
      { key: 'canViewAudit', name: 'Audit Ledger', desc: 'Registru criptografic SHA-256 al acțiunilor', icon: 'lucide:scroll-text', color: '#f59e0b' },
      { key: 'canManageSecurity', name: 'Securitate 2FA', desc: 'Configurare TOTP și revocare forțată sesiuni', icon: 'lucide:shield-check', color: '#3b82f6' },
      { key: 'canManageApiKeys', name: 'API Tokens', desc: 'Generare și revocare chei de acces REST', icon: 'lucide:key', color: '#6366f1' },
      { key: 'canManageSnapshots', name: 'Snapshot Vault', desc: 'Creare backup-uri și descărcare bundle complet', icon: 'lucide:archive', color: '#10b981' },
      { key: 'canManageWebhooks', name: 'Discord Webhooks', desc: 'Configurare stream-uri de notificare pe Discord', icon: 'lucide:webhook', color: '#f97316' },
      { key: 'canManageDiscordBot', name: 'Discord Bot Control', desc: 'Tickete, staff, moderare și sincronizare bot', icon: 'lucide:bot', color: '#818cf8' },
      { key: 'canManageSettings', name: 'Engine Settings', desc: 'Mod mentenanță, titluri, bannere & config', icon: 'lucide:sliders', color: '#ff6b00' },
    ],
  },
  {
    id: 'dangerous',
    title: 'Comenzi Restricționate Root Super Admin (Dangerous & Root)',
    subtitle: 'Privilegii de nivel înalt cu imunitate completă și izolare de securitate',
    icon: 'lucide:shield-alert',
    accent: '#ef4444',
    modules: [
      { key: 'canManageTeam', name: 'Gestiune Echipă & Roluri', desc: 'Adăugare, editare și revocare permisiuni administratori', icon: 'lucide:users', color: '#f59e0b', isRestricted: true },
      { key: 'canTriggerPanic', name: 'Panic Lockdown', desc: 'Blocare instantanee a platformei în caz de urgență', icon: 'lucide:shield-alert', color: '#ef4444', isRestricted: true },
    ],
  },
];
</script>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps<{
  user?: any;
}>();

const DEFAULT_EDITOR_PERMISSIONS: TeamMemberPermissions = {
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

const FALLBACK_ROLE_PRESETS: Record<string, { label: string; description: string; permissions: TeamMemberPermissions }> = {
  root_admin: {
    label: 'Root Super Admin',
    description: 'Control absolut peste întregul sistem, Panic Lockdown și gestiunea echipei.',
    permissions: {
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
    },
  },
  doc_lead: {
    label: 'Lead Documentație & Arhitect',
    description: 'Acces complet la studio, media, telemetrie, sănătate și sarcini.',
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
      canManageSettings: false,
      canManageTeam: false,
      canTriggerPanic: false,
      canManageDiscordBot: false,
    },
  },
  content_editor: {
    label: 'Content Editor / Redactor',
    description: 'Creare și redactare ghiduri, upload imagini media și organizare task-uri.',
    permissions: { ...DEFAULT_EDITOR_PERMISSIONS },
  },
  moderator: {
    label: 'Moderator Ghiduri & Suport',
    description: 'Monitorizare integritate, rezolvare sarcini și vizualizare statistici.',
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
      canManageDiscordBot: false,
    },
  },
  viewer: {
    label: 'Observator (Read-Only)',
    description: 'Acces exclusiv de vizualizare telemetrie și analiză fără drepturi de editare.',
    permissions: {
      canEditDocs: false,
      canDeleteDocs: false,
      canManageHealth: false,
      canManageMedia: false,
      canManageTasks: false,
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
    label: 'Auditor Securitate',
    description: 'Audit ledger, inspecție telemetrie, fără permisiuni de editare a conținutului.',
    permissions: {
      canEditDocs: false,
      canDeleteDocs: false,
      canManageHealth: true,
      canManageMedia: false,
      canManageTasks: false,
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
  discord_dev: {
    label: 'Discord Bot Developer',
    description: 'Acces exclusiv la Discord Bot Control Center: tickete, staff, statistici, watchlist.',
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

// ── State ──
const members = ref<TeamMember[]>([]);
const currentUser = ref<any>(props.user || null);
const rolePresets = ref<Record<string, any>>(FALLBACK_ROLE_PRESETS);
const repoStats = ref<Record<string, { totalCommits: number; docsCommits: number }>>({});
const githubGraphContributors = ref<any[]>([]);
const githubGraphUrl = ref<string>('https://github.com/WildFiire/docs/graphs/contributors');
const loading = ref<boolean>(true);
const searchQuery = ref<string>('');
const roleFilter = ref<string>('all');
const statusFilter = ref<'all' | 'active' | 'suspended'>('all');
const activeTab = ref<'members' | 'github' | 'matrix'>('members');
const statusMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null);

// Inspector / Edit Modal State
const selectedMember = ref<TeamMember | null>(null);
const editUsername = ref<string>('');
const editDisplayName = ref<string>('');
const editEmail = ref<string>('');
const editRole = ref<string>('content_editor');
const editStatus = ref<'active' | 'suspended'>('active');
const editPermissions = ref<TeamMemberPermissions>({ ...DEFAULT_EDITOR_PERMISSIONS });
const editNewPassword = ref<string>('');
const editCustomTitle = ref<string>('');
const editAvatarUrl = ref<string>('');
const editBio = ref<string>('');
const editDiscord = ref<string>('');
const editSteamId = ref<string>('');
const editRespString = ref<string>('');
const editBadgesString = ref<string>('');
const editDocsModifiedCount = ref<number>(0);
const editGithubUsername = ref<string>('');
const steamAvatarPreview = ref<string | null>(null);
const savingEdit = ref<boolean>(false);

// Add Member Modal State
const addModalOpen = ref<boolean>(false);
const newUsername = ref<string>('');
const newDisplayName = ref<string>('');
const newEmail = ref<string>('');
const newPassword = ref<string>('');
const newRole = ref<string>('content_editor');
const newDiscord = ref<string>('');
const newSteamId = ref<string>('');
const newGithubUsername = ref<string>('');
const newPermissions = ref<TeamMemberPermissions>({ ...DEFAULT_EDITOR_PERMISSIONS });
const newSteamAvatarPreview = ref<string | null>(null);
const creating = ref<boolean>(false);

// ── Computed ──
const isRootAdmin = computed(() => {
  const u = currentUser.value || props.user;
  return Boolean(u?.isRoot || u?.username?.toLowerCase() === 'iannc69' || u?.username?.toLowerCase() === 'iannc');
});

const activeCount = computed(() => members.value.filter((m) => m.status === 'active').length);
const rootCount = computed(() => members.value.filter((m) => m.isRoot).length);

const filteredMembers = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  return members.value.filter((m) => {
    // Role filter
    if (roleFilter.value !== 'all') {
      if (roleFilter.value === 'root_admin') {
        if (!m.isRoot && m.role !== 'root_admin') return false;
      } else if (m.role !== roleFilter.value) {
        return false;
      }
    }

    // Status filter
    if (statusFilter.value !== 'all' && m.status !== statusFilter.value) {
      return false;
    }

    // Search query
    if (!q) return true;
    return (
      m.username.toLowerCase().includes(q) ||
      m.displayName.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      (m.email && m.email.toLowerCase().includes(q))
    );
  });
});

const unifiedContributors = computed(() => {
  const list = [...githubGraphContributors.value];
  const presentLogins = new Set(list.map((gc) => (gc.login || '').toLowerCase()));

  for (const m of members.value) {
    const gh = ((m as any).githubUsername?.trim() || m.username?.trim() || '');
    if (gh && !presentLogins.has(gh.toLowerCase()) && !presentLogins.has((m.username || '').toLowerCase())) {
      presentLogins.add(gh.toLowerCase());
      list.push({
        login: (m as any).githubUsername || m.username,
        avatarUrl: (m as any).githubUsername ? `https://github.com/${(m as any).githubUsername}.png` : m.avatarUrl || '',
        profileUrl: `https://github.com/${(m as any).githubUsername || m.username}`,
        totalCommits: repoStats.value[m.username.toLowerCase()]?.totalCommits || 0,
        totalAdditions: 0,
        totalDeletions: 0,
        weeks: [],
        activeWeeksCount: 0,
      });
    }
  }

  return list;
});

// ── Watchers for Steam Avatar ──
watch(editSteamId, async (val) => {
  if (val && val.trim()) {
    try {
      const r = await fetch(`/api/steam/avatar?id=${encodeURIComponent(val.trim())}`);
      const d = await r.json();
      steamAvatarPreview.value = d.avatarUrl || null;
    } catch {
      steamAvatarPreview.value = null;
    }
  } else {
    steamAvatarPreview.value = null;
  }
});

watch(newSteamId, async (val) => {
  if (val && val.trim()) {
    try {
      const r = await fetch(`/api/steam/avatar?id=${encodeURIComponent(val.trim())}`);
      const d = await r.json();
      newSteamAvatarPreview.value = d.avatarUrl || null;
    } catch {
      newSteamAvatarPreview.value = null;
    }
  } else {
    newSteamAvatarPreview.value = null;
  }
});

// ── API Actions ──
async function fetchTeam() {
  loading.value = true;
  try {
    const [res, contribRes] = await Promise.allSettled([
      fetch('/api/admin/team'),
      fetch('/api/team/contributors'),
    ]);

    if (res.status === 'fulfilled') {
      if (res.value.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await res.value.json();
      members.value = data.members || [];
      if (data.currentUser) {
        currentUser.value = data.currentUser;
      }
      rolePresets.value = { ...FALLBACK_ROLE_PRESETS, ...(data.rolePresets || {}) };
    }

    if (contribRes.status === 'fulfilled' && contribRes.value.ok) {
      const cData = await contribRes.value.json();
      if (cData?.githubGraphUrl) {
        githubGraphUrl.value = cData.githubGraphUrl;
      }
      if (cData?.githubGraphContributors && Array.isArray(cData.githubGraphContributors)) {
        githubGraphContributors.value = cData.githubGraphContributors;
      }
      if (cData?.contributors && Array.isArray(cData.contributors)) {
        const map: Record<string, { totalCommits: number; docsCommits: number }> = {};
        for (const c of cData.contributors) {
          map[c.username.toLowerCase()] = {
            totalCommits: c.stats?.totalCommits || 0,
            docsCommits: c.stats?.docsCommits || c.docsModifiedCount || 0,
          };
        }
        repoStats.value = map;
      }
    }
  } catch (err) {
    console.error('Failed to load team data', err);
  } finally {
    loading.value = false;
  }
}

function openInspector(member: TeamMember) {
  selectedMember.value = member;
  editUsername.value = member.username || '';
  editDisplayName.value = member.displayName || '';
  editEmail.value = member.email || '';
  editRole.value = member.role;
  editStatus.value = member.status;
  editPermissions.value = {
    canEditDocs: Boolean(member.permissions?.canEditDocs),
    canDeleteDocs: Boolean(member.permissions?.canDeleteDocs),
    canManageHealth: member.permissions?.canManageHealth ?? Boolean(member.permissions?.canEditDocs),
    canManageMedia: Boolean(member.permissions?.canManageMedia),
    canManageTasks: member.permissions?.canManageTasks ?? true,
    canViewAnalytics: Boolean(member.permissions?.canViewAnalytics),
    canViewAiStats: Boolean(member.permissions?.canViewAiStats),
    canManageDb: Boolean(member.permissions?.canManageDb),
    canViewAudit: Boolean(member.permissions?.canViewAudit),
    canManageSecurity: Boolean(member.permissions?.canManageSecurity),
    canManageApiKeys: Boolean(member.permissions?.canManageApiKeys),
    canManageSnapshots: member.permissions?.canManageSnapshots ?? Boolean(member.permissions?.canManageSettings),
    canManageWebhooks: member.permissions?.canManageWebhooks ?? Boolean(member.permissions?.canManageSettings),
    canManageSettings: Boolean(member.permissions?.canManageSettings),
    canManageTeam: Boolean(member.permissions?.canManageTeam),
    canTriggerPanic: Boolean(member.permissions?.canTriggerPanic),
    canManageDiscordBot: Boolean(member.permissions?.canManageDiscordBot),
  };
  editNewPassword.value = '';
  editCustomTitle.value = member.customTitle || '';
  editAvatarUrl.value = member.avatarUrl || '';
  editBio.value = member.bio || '';
  editDiscord.value = member.discord || '';
  editSteamId.value = member.steamId || '';
  editRespString.value = member.responsibilities ? member.responsibilities.join(', ') : '';
  editBadgesString.value = member.badges ? member.badges.join(', ') : '';
  editDocsModifiedCount.value = member.docsModifiedCount || 0;
  editGithubUsername.value = (member as any).githubUsername || '';
  statusMessage.value = null;
}

function handleRolePresetChange(roleKey: string, isCreate = false) {
  const preset = rolePresets.value[roleKey];
  if (preset) {
    if (isCreate) {
      newRole.value = roleKey;
      newPermissions.value = { ...preset.permissions };
    } else {
      editRole.value = roleKey;
      editPermissions.value = { ...preset.permissions };
    }
  }
}

function handleCategorySelectAll(modules: PermissionModuleItem[], selectAll: boolean, isCreate = false) {
  const updates: Partial<TeamMemberPermissions> = {};
  modules.forEach((m) => {
    if (!m.isRestricted) {
      updates[m.key] = selectAll;
    }
  });
  if (isCreate) {
    newPermissions.value = { ...newPermissions.value, ...updates };
    newRole.value = 'custom';
  } else {
    editPermissions.value = { ...editPermissions.value, ...updates };
    editRole.value = 'custom';
  }
}

const unfreezingId = ref<string | null>(null);

function isZombieFrozen(member?: TeamMember | null): boolean {
  if (!member || member.isRoot) return false;
  if (member.status === 'suspended' && member.suspendedReason === 'inactivity_30d') return true;
  if (member.status === 'suspended' && member.lastLoginAt) {
    const ms = Date.now() - new Date(member.lastLoginAt).getTime();
    if (ms > 30 * 24 * 60 * 60 * 1000) return true;
  }
  return false;
}

function formatRelativeTimeRo(isoString?: string): string {
  if (!isoString) return 'Niciodată';
  try {
    const ms = Date.now() - new Date(isoString).getTime();
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    if (days === 0) return 'Astăzi';
    if (days === 1) return 'Ieri';
    if (days < 30) return `Acum ${days} zile`;
    const months = Math.floor(days / 30);
    return `Acum ${months} luni (${days} zile)`;
  } catch {
    return 'Dată necunoscută';
  }
}

async function handleUnfreezeMember(member: TeamMember) {
  if (
    !window.confirm(
      `Sigur dorești să dezgheți contul ${member.displayName || member.username}? Cronometrul de 30 de zile de inactivitate va fi resetat imediat și utilizatorul se va putea autentifica fără nicio restricție.`
    )
  ) {
    return;
  }
  unfreezingId.value = member.id;
  statusMessage.value = null;
  try {
    const res = await fetch('/api/admin/team', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: member.id,
        action: 'unfreeze',
        status: 'active',
      }),
    });
    const data = await res.json();
    if (data.success) {
      statusMessage.value = {
        type: 'success',
        text: `Contul ${member.displayName || member.username} a fost dezghețat cu succes! Cronometrul de inactivitate a fost resetat.`,
      };
      await fetchTeam();
      if (selectedMember.value && selectedMember.value.id === member.id) {
        selectedMember.value = data.member || {
          ...selectedMember.value,
          status: 'active',
          suspendedReason: undefined,
          unfrozenAt: new Date().toISOString(),
        };
        editStatus.value = 'active';
      }
    } else {
      statusMessage.value = { type: 'error', text: data.message || 'Dezghețarea contului a eșuat.' };
    }
  } catch {
    statusMessage.value = { type: 'error', text: 'Eroare de conexiune la dezghețarea contului.' };
  } finally {
    unfreezingId.value = null;
  }
}

async function handleSaveMember() {
  if (!selectedMember.value) return;
  savingEdit.value = true;
  statusMessage.value = null;

  const responsibilities = editRespString.value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const badges = editBadgesString.value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const isUnfreezing = editStatus.value === 'active' && selectedMember.value.status === 'suspended';

  try {
    const res = await fetch('/api/admin/team', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: selectedMember.value.id,
        action: isUnfreezing ? 'unfreeze' : undefined,
        username: editUsername.value.trim() || undefined,
        displayName: editDisplayName.value.trim(),
        email: editEmail.value.trim(),
        role: editRole.value,
        status: editStatus.value,
        permissions: editPermissions.value,
        password: editNewPassword.value.trim() ? editNewPassword.value.trim() : undefined,
        customTitle: editCustomTitle.value.trim(),
        avatarUrl: editAvatarUrl.value.trim(),
        bio: editBio.value.trim(),
        discord: editDiscord.value.trim(),
        steamId: editSteamId.value.trim(),
        githubUsername: editGithubUsername.value.trim(),
        responsibilities,
        badges,
        docsModifiedCount: Number(editDocsModifiedCount.value) || 0,
      }),
    });

    const data = await res.json();
    if (data.success) {
      statusMessage.value = {
        type: 'success',
        text: `Modificările pentru ${editDisplayName.value || selectedMember.value.username} au fost salvate cu succes.`,
      };
      await fetchTeam();
      if (data.member) {
        selectedMember.value = data.member;
      }
    } else {
      statusMessage.value = { type: 'error', text: data.message || 'Salvarea a eșuat.' };
    }
  } catch {
    statusMessage.value = { type: 'error', text: 'Eroare de conexiune cu serverul.' };
  } finally {
    savingEdit.value = false;
  }
}

async function handleReset2FA(member: TeamMember) {
  if (
    !window.confirm(
      `Sigur dorești să resetezi protecția 2FA (TOTP) pentru ${member.displayName || member.username}? Utilizatorul va putea să se conecteze fără cod 2FA.`,
    )
  ) {
    return;
  }
  try {
    const res = await fetch('/api/admin/team', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: member.id,
        totpEnabled: false,
        totpSecret: '',
      }),
    });
    const data = await res.json();
    if (data.success) {
      statusMessage.value = {
        type: 'success',
        text: `Protecția 2FA a fost resetată cu succes pentru ${member.displayName || member.username}.`,
      };
      if (selectedMember.value && selectedMember.value.id === member.id) {
        selectedMember.value.totpEnabled = false;
      }
      await fetchTeam();
    } else {
      statusMessage.value = { type: 'error', text: data.message || 'Resetarea 2FA a eșuat.' };
    }
  } catch {
    statusMessage.value = { type: 'error', text: 'Eroare de conexiune la resetarea 2FA.' };
  }
}

async function handleCreateMember(e: Event) {
  e.preventDefault();
  if (!newUsername.value.trim() || !newPassword.value.trim()) {
    statusMessage.value = { type: 'error', text: 'Numele de utilizator și parola sunt obligatorii.' };
    return;
  }

  creating.value = true;
  statusMessage.value = null;

  try {
    const res = await fetch('/api/admin/team', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: newUsername.value.trim(),
        displayName: newDisplayName.value.trim() || newUsername.value.trim(),
        email: newEmail.value.trim(),
        password: newPassword.value.trim(),
        role: newRole.value,
        discord: newDiscord.value.trim(),
        steamId: newSteamId.value.trim(),
        githubUsername: newGithubUsername.value.trim() || undefined,
        customPermissions: newPermissions.value,
      }),
    });

    const data = await res.json();
    if (data.success) {
      statusMessage.value = {
        type: 'success',
        text: `Administratorul ${newUsername.value} a fost creat cu succes!`,
      };
      addModalOpen.value = false;
      newUsername.value = '';
      newDisplayName.value = '';
      newEmail.value = '';
      newPassword.value = '';
      newDiscord.value = '';
      newSteamId.value = '';
      newGithubUsername.value = '';
      newPermissions.value = { ...DEFAULT_EDITOR_PERMISSIONS };
      await fetchTeam();
    } else {
      statusMessage.value = { type: 'error', text: data.message || 'Crearea administratorului a eșuat.' };
    }
  } catch {
    statusMessage.value = { type: 'error', text: 'Eroare de rețea la crearea utilizatorului.' };
  } finally {
    creating.value = false;
  }
}

async function handleDeleteMember(id: string, username: string) {
  if (!window.confirm(`Sigur dorești să ștergi contul administratorului ${username}? Această acțiune este ireversibilă.`)) {
    return;
  }

  try {
    const res = await fetch(`/api/admin/team?id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      statusMessage.value = { type: 'success', text: `Contul ${username} a fost șters din echipă.` };
      selectedMember.value = null;
      await fetchTeam();
    } else {
      statusMessage.value = { type: 'error', text: data.message || 'Ștergerea a eșuat.' };
    }
  } catch {
    statusMessage.value = { type: 'error', text: 'Eroare la ștergerea contului.' };
  }
}

function countActivePerms(member: TeamMember): number {
  return Object.values(member.permissions || {}).filter(Boolean).length;
}

onMounted(() => {
  fetchTeam();
});
</script>

<template>
  <div class="admin-page-container">
    <!-- Header -->
    <div class="admin-page-header">
      <div>
        <div class="admin-breadcrumb-tag">ACCESS CONTROL & TEAM MATRIX</div>
        <h1 class="admin-page-title">Echipa Mea & Matricea de Permisiuni</h1>
        <p class="admin-page-description">
          Administrează conturile de acces, atribuie roluri dedicate echipei tale și configurează permisiuni granulare pe fiecare modul din documentație.
        </p>
      </div>

      <div class="admin-header-actions">
        <button
          v-if="isRootAdmin"
          type="button"
          class="admin-btn admin-btn--primary"
          @click="addModalOpen = true; statusMessage = null"
        >
          <Icon icon="lucide:user-plus" width="14" height="14" />
          <span>Adaugă Membru Nou</span>
        </button>

        <button
          type="button"
          :disabled="loading"
          class="admin-btn admin-btn--secondary"
          @click="fetchTeam"
        >
          <Icon icon="lucide:refresh-cw" width="14" height="14" :class="{ 'animate-spin': loading }" />
          <span>Reîmprospătează</span>
        </button>
      </div>
    </div>

    <!-- Status Feedback -->
    <div
      v-if="statusMessage"
      class="admin-alert-box"
      :class="statusMessage.type === 'success' ? 'admin-alert-box--success' : 'admin-alert-box--danger'"
    >
      <Icon
        :icon="statusMessage.type === 'success' ? 'lucide:check-circle-2' : 'lucide:alert-circle'"
        width="16"
        height="16"
      />
      <span>{{ statusMessage.text }}</span>
      <button
        type="button"
        class="ml-auto opacity-70 hover:opacity-100 transition-opacity"
        @click="statusMessage = null"
      >
        <Icon icon="lucide:x" width="14" height="14" />
      </button>
    </div>

    <!-- Metrics Row -->
    <div class="admin-team-metrics-grid">
      <div class="admin-team-metric-card">
        <div class="admin-team-metric-header">
          <span class="admin-team-metric-label">TOTAL MEMBRI</span>
          <div class="admin-team-metric-icon-box admin-team-metric-icon-box--orange">
            <Icon icon="lucide:users" width="15" height="15" />
          </div>
        </div>
        <div class="admin-team-metric-body">
          <div class="admin-team-metric-value">{{ members.length }} Conturi</div>
          <span class="admin-team-metric-badge admin-team-metric-badge--green">{{ activeCount }} ACTIVE</span>
        </div>
        <div class="admin-team-metric-sub">Conturi de acces înregistrate</div>
      </div>

      <div class="admin-team-metric-card">
        <div class="admin-team-metric-header">
          <span class="admin-team-metric-label">ROOT SUPER ADMIN</span>
          <div class="admin-team-metric-icon-box admin-team-metric-icon-box--amber">
            <Icon icon="lucide:shield-check" width="15" height="15" />
          </div>
        </div>
        <div class="admin-team-metric-body">
          <div class="admin-team-metric-value admin-team-metric-value--amber">iannC69</div>
          <span class="admin-team-metric-badge admin-team-metric-badge--amber">ROOT PROFIL</span>
        </div>
        <div class="admin-team-metric-sub">Control absolut & protecție imunitate</div>
      </div>

      <div class="admin-team-metric-card">
        <div class="admin-team-metric-header">
          <span class="admin-team-metric-label">SECURITATE RBAC</span>
          <div class="admin-team-metric-icon-box admin-team-metric-icon-box--cyan">
            <Icon icon="lucide:lock" width="15" height="15" />
          </div>
        </div>
        <div class="admin-team-metric-body">
          <div class="admin-team-metric-value admin-team-metric-value--cyan">RBAC 2.0</div>
          <span class="admin-team-metric-badge admin-team-metric-badge--cyan">17 MODULI</span>
        </div>
        <div class="admin-team-metric-sub">Permisiuni granulare criptate</div>
      </div>
    </div>

    <!-- Navigation Tabs: Membri Echipă / GitHub Contributors / Matrice Globală -->
    <div class="admin-tabs-nav">
      <div class="admin-tabs-compact">
        <button
          type="button"
          class="admin-tab-compact"
          :class="{ 'admin-tab-compact--active': activeTab === 'members' }"
          @click="activeTab = 'members'"
        >
          <span class="flex items-center gap-1.5">
            <Icon icon="lucide:users" width="13" height="13" />
            <span>Membri Echipă</span>
            <span class="tab-badge">{{ filteredMembers.length }}</span>
          </span>
        </button>

        <button
          type="button"
          class="admin-tab-compact"
          :class="{ 'admin-tab-compact--active': activeTab === 'github' }"
          @click="activeTab = 'github'"
        >
          <span class="flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub Contributors Graph</span>
            <span class="tab-badge tab-badge--blue">{{ unifiedContributors.length }}</span>
          </span>
        </button>

        <button
          type="button"
          class="admin-tab-compact"
          :class="{ 'admin-tab-compact--active': activeTab === 'matrix' }"
          @click="activeTab = 'matrix'"
        >
          <span class="flex items-center gap-1.5">
            <Icon icon="lucide:shield-check" width="13" height="13" />
            <span>Matrice Permisiuni (Overview)</span>
            <span class="tab-badge tab-badge--emerald">17 Module</span>
          </span>
        </button>
      </div>
    </div>

    <!-- ── TAB 1: MEMBRI ECHIPĂ ── -->
    <div v-if="activeTab === 'members'">
      <!-- GitHub Contributors Graph Reconciliation Panel Preview -->
      <div v-if="unifiedContributors.length > 0" class="admin-github-sync-panel">
        <div class="admin-github-sync-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="admin-github-sync-icon-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="text-zinc-200" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </div>
            <div>
              <h4 class="admin-github-sync-title">
                <span>Sincronizare GitHub Contributors Graph</span>
                <span
                  class="admin-perm-tag"
                  style="background: hsl(142 71% 45% / 0.15); border: 1px solid hsl(142 71% 45% / 0.3); color: hsl(142 71% 70%); font-size: 0.65rem; padding: 2px 7px;"
                >
                  LIVE SYNC ACTIV
                </span>
              </h4>
              <span style="font-size: 0.72rem; color: var(--color-text-tertiary);">
                Reconciliere automată între committerii din repository (graphs/contributors) și membrii din My Team
              </span>
            </div>
          </div>

          <a
            :href="githubGraphUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="admin-github-sync-link"
            title="Deschide graficul oficial pe GitHub"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>Vezi GitHub Contributors Graph</span>
            <Icon icon="lucide:external-link" width="11" height="11" />
          </a>
        </div>

        <div class="admin-github-sync-grid">
          <div
            v-for="gc in unifiedContributors"
            :key="gc.login"
            class="admin-github-sync-card"
          >
            <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
              <img
                :src="gc.avatarUrl || `https://github.com/${gc.login}.png`"
                :alt="gc.login"
                class="admin-github-sync-avatar"
                @error="(e) => {
                  const matched = members.find((m) =>
                    ((m as any).githubUsername && (m as any).githubUsername.toLowerCase() === gc.login.toLowerCase()) ||
                    m.username.toLowerCase() === gc.login.toLowerCase()
                  );
                  if (matched?.avatarUrl) (e.currentTarget as HTMLImageElement).src = matched.avatarUrl;
                }"
              />
              <div style="min-width: 0;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span class="admin-github-sync-username">@{{ gc.login }}</span>
                  <span
                    style="font-size: 0.68rem; font-weight: 800; font-family: var(--font-mono, monospace);"
                    :style="{ color: gc.totalCommits > 0 ? 'hsl(215 90% 65%)' : 'var(--color-text-muted)' }"
                  >
                    {{ gc.totalCommits }} commits
                  </span>
                </div>
                <div style="font-size: 0.68rem; color: var(--color-text-tertiary);">
                  <template
                    v-if="
                      members.find((m) =>
                        ((m as any).githubUsername && (m as any).githubUsername.toLowerCase() === gc.login.toLowerCase()) ||
                        m.username.toLowerCase() === gc.login.toLowerCase() ||
                        m.displayName.toLowerCase() === gc.login.toLowerCase()
                      )
                    "
                  >
                    <span style="color: hsl(142 71% 70%);">
                      ✓ Reconciliat cu <strong>@{{
                        members.find((m) =>
                          ((m as any).githubUsername && (m as any).githubUsername.toLowerCase() === gc.login.toLowerCase()) ||
                          m.username.toLowerCase() === gc.login.toLowerCase() ||
                          m.displayName.toLowerCase() === gc.login.toLowerCase()
                        )?.username
                      }}</strong>
                    </span>
                  </template>
                  <template v-else>
                    <span style="color: hsl(38 92% 65%);">Neasociat în My Team</span>
                  </template>
                </div>
              </div>
            </div>

            <div style="font-size: 0.68rem; font-family: var(--font-mono, monospace); text-align: right; flex-shrink: 0;">
              <span v-if="gc.totalAdditions > 0" style="color: hsl(142 71% 65%); display: block;">
                +{{ gc.totalAdditions.toLocaleString() }}
              </span>
              <span v-if="gc.totalDeletions > 0" style="color: hsl(0 84% 65%); display: block;">
                -{{ gc.totalDeletions.toLocaleString() }}
              </span>
              <span v-if="gc.totalCommits === 0" style="color: var(--color-text-muted); font-size: 0.65rem; display: block;">
                Profil Conectat
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Search & Filter Toolbar -->
      <div class="admin-team-toolbar">
        <div class="admin-team-search-box">
          <Icon icon="lucide:search" width="14" height="14" class="admin-search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Caută membru după nume, rol sau username..."
            autocomplete="off"
            spellcheck="false"
            class="admin-team-search-input"
          />
        </div>

        <div class="admin-current-session-pill">
          <span class="admin-current-session-dot" />
          <span class="admin-current-session-label">Autentificat ca:</span>
          <span class="admin-current-session-name">
            {{ currentUser?.displayName || currentUser?.username || 'Admin' }}
          </span>
          <span
            class="admin-current-session-tag"
            :class="isRootAdmin ? 'admin-current-session-tag--root' : 'admin-current-session-tag--member'"
          >
            {{ isRootAdmin ? 'Root Super Admin' : 'Membru Delegat' }}
          </span>
        </div>
      </div>

      <!-- Role Filters Bar -->
      <div class="admin-role-filter-bar">
        <div class="flex items-center gap-1.5 flex-wrap">
          <span class="text-xs text-zinc-400 mr-1 font-semibold">Filtrează după rol:</span>
          <button
            type="button"
            class="admin-role-filter-btn"
            :class="{ 'admin-role-filter-btn--active': roleFilter === 'all' }"
            @click="roleFilter = 'all'"
          >
            Toate ({{ members.length }})
          </button>
          <button
            type="button"
            class="admin-role-filter-btn"
            :class="{ 'admin-role-filter-btn--active': roleFilter === 'root_admin' }"
            @click="roleFilter = 'root_admin'"
          >
            Root Super Admin
          </button>
          <button
            type="button"
            class="admin-role-filter-btn"
            :class="{ 'admin-role-filter-btn--active': roleFilter === 'doc_lead' }"
            @click="roleFilter = 'doc_lead'"
          >
            Doc Lead
          </button>
          <button
            type="button"
            class="admin-role-filter-btn"
            :class="{ 'admin-role-filter-btn--active': roleFilter === 'content_editor' }"
            @click="roleFilter = 'content_editor'"
          >
            Content Editor
          </button>
          <button
            type="button"
            class="admin-role-filter-btn"
            :class="{ 'admin-role-filter-btn--active': roleFilter === 'moderator' }"
            @click="roleFilter = 'moderator'"
          >
            Moderator
          </button>
          <button
            type="button"
            class="admin-role-filter-btn"
            :class="{ 'admin-role-filter-btn--active': roleFilter === 'viewer' }"
            @click="roleFilter = 'viewer'"
          >
            Viewer
          </button>
          <button
            type="button"
            class="admin-role-filter-btn"
            :class="{ 'admin-role-filter-btn--active': roleFilter === 'security_auditor' }"
            @click="roleFilter = 'security_auditor'"
          >
            Auditor
          </button>
          <button
            type="button"
            class="admin-role-filter-btn"
            :class="{ 'admin-role-filter-btn--active': roleFilter === 'discord_dev' }"
            @click="roleFilter = 'discord_dev'"
          >
            Discord Bot Dev
          </button>
        </div>

        <div class="flex items-center gap-1 ml-auto">
          <button
            type="button"
            class="admin-role-filter-btn"
            :class="{ 'admin-role-filter-btn--active': statusFilter === 'all' }"
            @click="statusFilter = 'all'"
          >
            Toți
          </button>
          <button
            type="button"
            class="admin-role-filter-btn"
            :class="{ 'admin-role-filter-btn--active': statusFilter === 'active' }"
            @click="statusFilter = 'active'"
          >
            Activi ({{ activeCount }})
          </button>
          <button
            type="button"
            class="admin-role-filter-btn"
            :class="{ 'admin-role-filter-btn--active': statusFilter === 'suspended' }"
            @click="statusFilter = 'suspended'"
          >
            Suspendați ({{ members.length - activeCount }})
          </button>
        </div>
      </div>

      <!-- Members Grid -->
      <div class="admin-team-grid">
        <div v-if="loading" class="admin-team-loading">
          <Icon icon="lucide:refresh-cw" width="24" height="24" class="animate-spin text-[var(--color-primary)] mb-2" />
          <span>Se încarcă membrii echipei...</span>
        </div>

        <div v-else-if="filteredMembers.length === 0" class="admin-team-empty">
          <Icon icon="lucide:users" width="36" height="36" class="text-[var(--color-text-tertiary)] mb-2" />
          <p>Niciun membru găsit conform filtrelor selectate.</p>
        </div>

        <div
          v-for="member in filteredMembers"
          v-else
          :key="member.id"
          class="admin-member-card"
          :class="{ 'admin-member-card--selected': selectedMember?.id === member.id }"
          @click="openInspector(member)"
        >
          <div class="admin-member-card-header">
            <!-- Avatar -->
            <img
              v-if="member.avatarUrl"
              :src="member.avatarUrl"
              :alt="member.displayName"
              class="admin-member-avatar"
              style="object-fit: cover;"
            />
            <div
              v-else
              class="admin-member-avatar"
              :style="{ backgroundColor: member.avatarColor || '#ff6b00' }"
            >
              {{ member.displayName ? member.displayName.slice(0, 2).toUpperCase() : member.username.slice(0, 2).toUpperCase() }}
            </div>

            <div class="admin-member-title-box">
              <div class="flex items-center gap-2">
                <h4 class="admin-member-name">{{ member.displayName }}</h4>
                <span v-if="member.isRoot" class="admin-root-badge" title="Root Super Admin (Protejat)">
                  <Icon icon="lucide:shield-check" width="11" height="11" />
                  <span>ROOT</span>
                </span>
                <span v-if="member.totpEnabled" class="admin-2fa-badge" title="2FA TOTP Activ">
                  <Icon icon="lucide:lock" width="10" height="10" />
                  <span>2FA</span>
                </span>
              </div>
              <span class="admin-member-username">@{{ member.username }}</span>
            </div>

            <span
              v-if="member.status === 'active'"
              class="admin-status-pill admin-status-pill--active"
            >
              ACTIV
            </span>
            <span
              v-else-if="isZombieFrozen(member)"
              class="admin-status-pill admin-status-pill--frozen"
              title="Cont înghețat automat pentru inactivitate (peste 30 de zile)"
            >
              <Icon icon="lucide:snowflake" width="10" height="10" />
              <span>ÎNGHEȚAT 30Z</span>
            </span>
            <span
              v-else
              class="admin-status-pill admin-status-pill--suspended"
            >
              SUSPENDAT
            </span>
          </div>

          <div class="admin-member-card-body">
            <div class="admin-member-role-badge" :class="`admin-member-role-badge--${member.role}`">
              <span>{{ rolePresets[member.role]?.label || member.role.replace('_', ' ') }}</span>
            </div>

            <div v-if="member.email" class="admin-member-email">
              {{ member.email }}
            </div>

            <!-- Active Permission Badges with Vibrant Colors -->
            <div class="admin-member-perms-list">
              <span v-if="member.permissions?.canEditDocs" class="admin-perm-tag admin-perm-tag--studio">Content Studio</span>
              <span v-if="member.permissions?.canDeleteDocs" class="admin-perm-tag admin-perm-tag--delete">Delete Docs</span>
              <span v-if="member.permissions?.canManageHealth" class="admin-perm-tag admin-perm-tag--health">Doc Health</span>
              <span v-if="member.permissions?.canManageMedia" class="admin-perm-tag admin-perm-tag--media">Media Vault</span>
              <span v-if="member.permissions?.canManageTasks" class="admin-perm-tag admin-perm-tag--tasks">Task Hub</span>
              <span v-if="member.permissions?.canViewAnalytics" class="admin-perm-tag admin-perm-tag--telemetry">Telemetry</span>
              <span v-if="member.permissions?.canViewAiStats" class="admin-perm-tag admin-perm-tag--ai">AI Telemetry</span>
              <span v-if="member.permissions?.canManageDb" class="admin-perm-tag admin-perm-tag--db">Database</span>
              <span v-if="member.permissions?.canViewAudit" class="admin-perm-tag admin-perm-tag--audit">Audit Ledger</span>
              <span v-if="member.permissions?.canManageSecurity" class="admin-perm-tag admin-perm-tag--security">Securitate 2FA</span>
              <span v-if="member.permissions?.canManageApiKeys" class="admin-perm-tag admin-perm-tag--api">API Tokens</span>
              <span v-if="member.permissions?.canManageSnapshots" class="admin-perm-tag admin-perm-tag--snapshots">Snapshots</span>
              <span v-if="member.permissions?.canManageWebhooks" class="admin-perm-tag admin-perm-tag--webhooks">Webhooks</span>
              <span v-if="member.permissions?.canManageDiscordBot" class="admin-perm-tag admin-perm-tag--bot">Discord Bot</span>
              <span v-if="member.permissions?.canManageSettings" class="admin-perm-tag admin-perm-tag--settings">Setări Platformă</span>
              <span v-if="member.permissions?.canManageTeam" class="admin-perm-tag admin-perm-tag--team">Gestiune Echipă</span>
              <span v-if="member.permissions?.canTriggerPanic" class="admin-perm-tag admin-perm-tag--panic">Panic Lockdown</span>
            </div>
          </div>

          <div class="admin-member-card-footer">
            <div style="display: flex; flexDirection: column; gap: 2px;">
              <span class="admin-member-perms-count">
                {{ countActivePerms(member) }} / 17 Permisiuni Active
              </span>
              <span style="font-size: 0.68rem; color: var(--color-text-tertiary); display: inline-flex; align-items: center; gap: 4px;">
                <template v-if="repoStats[member.username.toLowerCase()]?.totalCommits">
                  <Icon icon="lucide:git-commit" width="10" height="10" class="text-cyan-400" />
                  <span><strong>{{ repoStats[member.username.toLowerCase()].totalCommits }}</strong> commit-uri repo</span>
                </template>
                <template v-else>
                  <Icon icon="lucide:file-text" width="10" height="10" class="text-zinc-500" />
                  <span><strong>{{ repoStats[member.username.toLowerCase()]?.docsCommits ?? member.docsModifiedCount ?? 0 }}</strong> ghiduri modificate</span>
                </template>
              </span>
            </div>

            <div style="display: flex; gap: 8px; align-items: center;">
              <button
                v-if="isRootAdmin && member.status === 'suspended'"
                type="button"
                class="admin-btn admin-btn--secondary"
                style="font-size: 0.72rem; padding: 4px 9px; color: #38bdf8; border-color: rgba(56, 189, 248, 0.35); background: rgba(56, 189, 248, 0.08);"
                :title="isZombieFrozen(member) ? 'Dezgheață contul și resetează inactivitatea' : 'Reactivează contul'"
                :disabled="unfreezingId === member.id"
                @click.stop="handleUnfreezeMember(member)"
              >
                <Icon :icon="unfreezingId === member.id ? 'lucide:refresh-cw' : 'lucide:flame'" width="11" height="11" :class="{ 'animate-spin': unfreezingId === member.id }" />
                <span>{{ unfreezingId === member.id ? '...' : 'Dezgheață' }}</span>
              </button>
              <a
                :href="`/docs/team/${encodeURIComponent(member.username)}`"
                target="_blank"
                rel="noopener noreferrer"
                class="admin-member-inspect-btn"
                style="text-decoration: none; background: hsl(0 0% 100% / 0.04); display: inline-flex; align-items: center; gap: 5px;"
                title="Deschide profilul public"
                @click.stop
              >
                <Icon icon="lucide:external-link" width="12" height="12" />
              </a>
              <button
                type="button"
                class="admin-member-inspect-btn"
                @click.stop="openInspector(member)"
              >
                <span>Inspector</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── TAB 2: GITHUB CONTRIBUTORS GRAPH EXPANDED ── -->
    <div v-else-if="activeTab === 'github'" class="admin-github-expanded-tab">
      <div class="admin-github-sync-panel" style="margin-top: 0;">
        <div class="admin-github-sync-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="admin-github-sync-icon-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="text-zinc-200">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </div>
            <div>
              <h3 class="admin-github-sync-title text-base">
                <span>GitHub Contributors & Commits Matrix</span>
                <span class="admin-perm-tag admin-perm-tag--emerald">LIVE GRAPH API</span>
              </h3>
              <p style="font-size: 0.78rem; color: var(--color-text-secondary); margin: 2px 0 0 0;">
                Sincronizare completă a activității pe repository-ul WildFire Docs cu asocierile membrilor interni.
              </p>
            </div>
          </div>

          <a
            :href="githubGraphUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="admin-github-sync-link"
          >
            <span>Deschide Graphs/Contributors pe GitHub</span>
            <Icon icon="lucide:external-link" width="12" height="12" />
          </a>
        </div>

        <div class="admin-github-sync-grid" style="grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));">
          <div
            v-for="gc in unifiedContributors"
            :key="gc.login"
            class="admin-github-sync-card"
            style="padding: 14px 16px;"
          >
            <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
              <img
                :src="gc.avatarUrl || `https://github.com/${gc.login}.png`"
                :alt="gc.login"
                class="admin-github-sync-avatar"
                style="width: 42px; height: 42px;"
              />
              <div style="min-width: 0;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="admin-github-sync-username" style="font-size: 0.95rem;">@{{ gc.login }}</span>
                  <a
                    :href="gc.profileUrl || `https://github.com/${gc.login}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-zinc-400 hover:text-white"
                  >
                    <Icon icon="lucide:external-link" width="12" height="12" />
                  </a>
                </div>
                <div style="font-size: 0.75rem; color: var(--color-text-tertiary); margin-top: 2px;">
                  <span v-if="members.find((m) => ((m as any).githubUsername && (m as any).githubUsername.toLowerCase() === gc.login.toLowerCase()) || m.username.toLowerCase() === gc.login.toLowerCase())" style="color: hsl(142 71% 70%);">
                    ✓ Asociat cu contul intern <strong>@{{ members.find((m) => ((m as any).githubUsername && (m as any).githubUsername.toLowerCase() === gc.login.toLowerCase()) || m.username.toLowerCase() === gc.login.toLowerCase())?.username }}</strong>
                  </span>
                  <span v-else style="color: hsl(38 92% 65%);">
                    Neasociat în My Team
                  </span>
                </div>
              </div>
            </div>

            <div style="text-align: right; flex-shrink: 0; font-family: var(--font-mono, monospace);">
              <div style="font-size: 0.85rem; font-weight: 800; color: hsl(215 90% 65%);">
                {{ gc.totalCommits }} commits
              </div>
              <div v-if="gc.totalAdditions > 0" style="color: hsl(142 71% 65%); font-size: 0.72rem;">
                +{{ gc.totalAdditions.toLocaleString() }} linii
              </div>
              <div v-if="gc.totalDeletions > 0" style="color: hsl(0 84% 65%); font-size: 0.72rem;">
                -{{ gc.totalDeletions.toLocaleString() }} linii
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── TAB 3: MATRICE GLOBALA PERMISIUNI (OVERVIEW) ── -->
    <div v-else-if="activeTab === 'matrix'" class="admin-matrix-tab">
      <div class="admin-matrix-table-wrap">
        <table class="admin-matrix-table">
          <thead>
            <tr>
              <th style="min-width: 180px; text-align: left;">Membru Echipă</th>
              <th style="text-align: center;">Rol</th>
              <th style="text-align: center;">Status</th>
              <!-- Core & Publishing -->
              <th colspan="5" class="cat-header cat-header--core">
                <span class="flex items-center justify-center gap-1.5">
                  <Icon icon="lucide:file-text" width="13" height="13" />
                  <span>Core &amp; Publishing (5)</span>
                </span>
              </th>
              <!-- Operational & Management -->
              <th colspan="10" class="cat-header cat-header--ops">
                <span class="flex items-center justify-center gap-1.5">
                  <Icon icon="lucide:sliders" width="13" height="13" />
                  <span>Operational &amp; Management (10)</span>
                </span>
              </th>
              <!-- Dangerous & Root -->
              <th colspan="2" class="cat-header cat-header--dangerous">
                <span class="flex items-center justify-center gap-1.5">
                  <Icon icon="lucide:shield-alert" width="13" height="13" />
                  <span>Dangerous &amp; Root (2)</span>
                </span>
              </th>
              <th style="text-align: right;">Acțiuni</th>
            </tr>
            <tr class="sub-headers">
              <th colspan="3"></th>
              <!-- Core modules -->
              <th title="Content Studio">Studio</th>
              <th title="Ștergere Docs">DelDocs</th>
              <th title="Doc Health">Health</th>
              <th title="Media Vault">Media</th>
              <th title="Task Hub">Tasks</th>
              <!-- Ops modules -->
              <th title="Search Telemetry">Search</th>
              <th title="AI Engine">AI</th>
              <th title="Database">DB</th>
              <th title="Audit Ledger">Audit</th>
              <th title="Securitate 2FA">2FA</th>
              <th title="API Tokens">API</th>
              <th title="Snapshots">Backup</th>
              <th title="Webhooks">Hooks</th>
              <th title="Discord Bot">Bot</th>
              <th title="Engine Settings">Settings</th>
              <!-- Dangerous modules -->
              <th title="Gestiune Echipă">Team</th>
              <th title="Panic Lockdown">Panic</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="m in filteredMembers" :key="m.id" :class="{ 'tr-root': m.isRoot }">
              <td>
                <div class="flex items-center gap-2">
                  <div
                    v-if="!m.avatarUrl"
                    class="mini-avatar"
                    :style="{ backgroundColor: m.avatarColor || '#ff6b00' }"
                  >
                    {{ m.displayName ? m.displayName.slice(0, 1).toUpperCase() : m.username.slice(0, 1).toUpperCase() }}
                  </div>
                  <img v-else :src="m.avatarUrl" class="mini-avatar" alt="Avatar" />
                  <div>
                    <div class="font-bold text-xs flex items-center gap-1">
                      <span>{{ m.displayName }}</span>
                      <Icon v-if="m.isRoot" icon="lucide:shield-check" class="text-amber-400" width="11" height="11" />
                    </div>
                    <div class="text-[0.68rem] text-zinc-400">@{{ m.username }}</div>
                  </div>
                </div>
              </td>
              <td style="text-align: center;">
                <span class="admin-perm-tag" style="font-size: 0.65rem;">
                  {{ rolePresets[m.role]?.label || m.role }}
                </span>
              </td>
              <td style="text-align: center;">
                <span
                  v-if="m.status === 'active'"
                  class="admin-status-pill admin-status-pill--active"
                  style="font-size: 0.6rem; padding: 2px 6px;"
                >
                  ACTIV
                </span>
                <span
                  v-else-if="isZombieFrozen(m)"
                  class="admin-status-pill admin-status-pill--frozen"
                  style="font-size: 0.6rem; padding: 2px 6px;"
                  title="Cont înghețat automat pentru inactivitate (peste 30 de zile)"
                >
                  ÎNGHEȚAT
                </span>
                <span
                  v-else
                  class="admin-status-pill admin-status-pill--suspended"
                  style="font-size: 0.6rem; padding: 2px 6px;"
                >
                  SUSP
                </span>
              </td>

              <!-- Core Modules -->
              <td :class="m.permissions?.canEditDocs ? 'cell-grant' : 'cell-deny'"><Icon :icon="m.permissions?.canEditDocs ? 'lucide:check' : 'lucide:x'" width="12" height="12" /></td>
              <td :class="m.permissions?.canDeleteDocs ? 'cell-grant' : 'cell-deny'"><Icon :icon="m.permissions?.canDeleteDocs ? 'lucide:check' : 'lucide:x'" width="12" height="12" /></td>
              <td :class="m.permissions?.canManageHealth ? 'cell-grant' : 'cell-deny'"><Icon :icon="m.permissions?.canManageHealth ? 'lucide:check' : 'lucide:x'" width="12" height="12" /></td>
              <td :class="m.permissions?.canManageMedia ? 'cell-grant' : 'cell-deny'"><Icon :icon="m.permissions?.canManageMedia ? 'lucide:check' : 'lucide:x'" width="12" height="12" /></td>
              <td :class="m.permissions?.canManageTasks ? 'cell-grant' : 'cell-deny'"><Icon :icon="m.permissions?.canManageTasks ? 'lucide:check' : 'lucide:x'" width="12" height="12" /></td>

              <!-- Ops Modules -->
              <td :class="m.permissions?.canViewAnalytics ? 'cell-grant' : 'cell-deny'"><Icon :icon="m.permissions?.canViewAnalytics ? 'lucide:check' : 'lucide:x'" width="12" height="12" /></td>
              <td :class="m.permissions?.canViewAiStats ? 'cell-grant' : 'cell-deny'"><Icon :icon="m.permissions?.canViewAiStats ? 'lucide:check' : 'lucide:x'" width="12" height="12" /></td>
              <td :class="m.permissions?.canManageDb ? 'cell-grant' : 'cell-deny'"><Icon :icon="m.permissions?.canManageDb ? 'lucide:check' : 'lucide:x'" width="12" height="12" /></td>
              <td :class="m.permissions?.canViewAudit ? 'cell-grant' : 'cell-deny'"><Icon :icon="m.permissions?.canViewAudit ? 'lucide:check' : 'lucide:x'" width="12" height="12" /></td>
              <td :class="m.permissions?.canManageSecurity ? 'cell-grant' : 'cell-deny'"><Icon :icon="m.permissions?.canManageSecurity ? 'lucide:check' : 'lucide:x'" width="12" height="12" /></td>
              <td :class="m.permissions?.canManageApiKeys ? 'cell-grant' : 'cell-deny'"><Icon :icon="m.permissions?.canManageApiKeys ? 'lucide:check' : 'lucide:x'" width="12" height="12" /></td>
              <td :class="m.permissions?.canManageSnapshots ? 'cell-grant' : 'cell-deny'"><Icon :icon="m.permissions?.canManageSnapshots ? 'lucide:check' : 'lucide:x'" width="12" height="12" /></td>
              <td :class="m.permissions?.canManageWebhooks ? 'cell-grant' : 'cell-deny'"><Icon :icon="m.permissions?.canManageWebhooks ? 'lucide:check' : 'lucide:x'" width="12" height="12" /></td>
              <td :class="m.permissions?.canManageDiscordBot ? 'cell-grant' : 'cell-deny'"><Icon :icon="m.permissions?.canManageDiscordBot ? 'lucide:check' : 'lucide:x'" width="12" height="12" /></td>
              <td :class="m.permissions?.canManageSettings ? 'cell-grant' : 'cell-deny'"><Icon :icon="m.permissions?.canManageSettings ? 'lucide:check' : 'lucide:x'" width="12" height="12" /></td>

              <!-- Dangerous Modules -->
              <td :class="m.permissions?.canManageTeam ? 'cell-grant cell-root' : 'cell-deny'"><Icon :icon="m.permissions?.canManageTeam ? 'lucide:check' : 'lucide:lock'" width="12" height="12" /></td>
              <td :class="m.permissions?.canTriggerPanic ? 'cell-grant cell-root' : 'cell-deny'"><Icon :icon="m.permissions?.canTriggerPanic ? 'lucide:check' : 'lucide:lock'" width="12" height="12" /></td>

              <td style="text-align: right;">
                <div style="display: flex; gap: 4px; justify-content: flex-end; align-items: center;">
                  <button
                    v-if="isRootAdmin && m.status === 'suspended'"
                    type="button"
                    class="admin-btn admin-btn--secondary"
                    style="font-size: 0.68rem; padding: 2px 7px; color: #38bdf8; border-color: rgba(56, 189, 248, 0.35); background: rgba(56, 189, 248, 0.08);"
                    :title="isZombieFrozen(m) ? 'Dezgheață contul și resetează inactivitatea' : 'Reactivează contul'"
                    :disabled="unfreezingId === m.id"
                    @click="handleUnfreezeMember(m)"
                  >
                    {{ unfreezingId === m.id ? '...' : 'Dezgheață' }}
                  </button>
                  <button
                    type="button"
                    class="admin-member-inspect-btn"
                    @click="openInspector(m)"
                  >
                    Edit
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- DEEP PROFILE & PERMISSIONS INSPECTOR MODAL / DRAWER -->
    <!-- ========================================================================= -->
    <div v-if="selectedMember" class="admin-modal-overlay">
      <div class="admin-modal-container admin-modal-container--large">
        <div class="admin-modal-header">
          <div class="flex items-center gap-3">
            <img
              v-if="editAvatarUrl || steamAvatarPreview || selectedMember.avatarUrl"
              :src="editAvatarUrl || steamAvatarPreview || selectedMember.avatarUrl || ''"
              :alt="selectedMember.displayName"
              class="admin-member-avatar"
              style="object-fit: cover;"
              @error="(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }"
            />
            <div
              v-else
              class="admin-member-avatar"
              :style="{ backgroundColor: selectedMember.avatarColor || '#ff6b00' }"
            >
              {{ selectedMember.displayName ? selectedMember.displayName.slice(0, 2).toUpperCase() : selectedMember.username.slice(0, 2).toUpperCase() }}
            </div>

            <div>
              <div class="flex items-center gap-2">
                <h3 class="admin-modal-title">
                  {{ selectedMember.displayName }}
                </h3>
                <span class="admin-member-role-badge" :class="`admin-member-role-badge--${selectedMember.role}`">
                  {{ rolePresets[selectedMember.role]?.label || selectedMember.role.replace('_', ' ') }}
                </span>
                <span
                  v-if="selectedMember.status === 'active'"
                  class="admin-status-pill admin-status-pill--active"
                >
                  ACTIV
                </span>
                <span
                  v-else-if="isZombieFrozen(selectedMember)"
                  class="admin-status-pill admin-status-pill--frozen"
                  title="Cont înghețat automat din cauza inactivității (peste 30 de zile)"
                >
                  <Icon icon="lucide:snowflake" width="10" height="10" />
                  <span>ÎNGHEȚAT 30Z</span>
                </span>
                <span
                  v-else
                  class="admin-status-pill admin-status-pill--suspended"
                >
                  SUSPENDAT
                </span>
                <span v-if="selectedMember.totpEnabled" class="admin-2fa-badge" title="2FA Activ">
                  <Icon icon="lucide:lock" width="10" height="10" />
                  <span>2FA TOTP</span>
                </span>
              </div>
              <p class="admin-modal-subtitle">
                @{{ selectedMember.username }} {{ selectedMember.email ? `• ${selectedMember.email}` : '' }}
              </p>
            </div>
          </div>

          <button
            type="button"
            class="admin-modal-close-btn"
            @click="selectedMember = null"
          >
            <Icon icon="lucide:x" width="16" height="16" />
          </button>
        </div>

        <div class="admin-modal-body">
          <!-- If Root Super Admin, show editing controls -->
          <div v-if="isRootAdmin" class="admin-modal-glass-section">
            <div class="admin-modal-section-label">Profil Public &amp; Informații Cont</div>
            <div class="admin-modal-form-grid">
              <!-- Zombie Inactivity Freeze / Suspension Notice & Quick Unfreeze Button -->
              <div
                v-if="!selectedMember.isRoot && selectedMember.status === 'suspended'"
                class="admin-form-group"
                style="grid-column: 1 / -1;"
              >
                <div
                  style="
                    padding: 14px 18px;
                    background: rgba(14, 165, 233, 0.08);
                    border: 1px solid rgba(14, 165, 233, 0.28);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                  "
                >
                  <div style="display: flex; align-items: flex-start; gap: 12px;">
                    <div
                      style="
                        width: 38px;
                        height: 38px;
                        border-radius: 8px;
                        background: rgba(14, 165, 233, 0.16);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #38bdf8;
                        flex-shrink: 0;
                        margin-top: 2px;
                      "
                    >
                      <Icon :icon="isZombieFrozen(selectedMember) ? 'lucide:snowflake' : 'lucide:alert-octagon'" width="20" height="20" />
                    </div>
                    <div>
                      <div style="font-size: 0.82rem; font-weight: 700; color: #38bdf8; margin-bottom: 3px;">
                        {{ isZombieFrozen(selectedMember) ? 'CONT ÎNGHEȚAT PENTRU INACTIVITATE (30+ ZILE)' : 'CONT SUSPENDAT TEMPORAR' }}
                      </div>
                      <div style="font-size: 0.72rem; color: var(--color-text-secondary); line-height: 1.45;">
                        <template v-if="isZombieFrozen(selectedMember)">
                          Sistemul de securitate Zombie Reaper a înghețat acest cont deoarece nu a înregistrat nicio autentificare în ultimele 30 de zile.
                          Ultima conectare: <strong>{{ formatRelativeTimeRo(selectedMember.lastLoginAt) }}</strong>.
                        </template>
                        <template v-else>
                          Acest cont are accesul restricționat manual de către un administrator.
                        </template>
                        Apasă pe <strong>Dezgheață Cont</strong> pentru a anula restricția și a reseta cronometrul de inactivitate pentru următoarele 30 de zile.
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    class="admin-btn admin-btn--primary"
                    style="font-size: 0.78rem; padding: 8px 16px; white-space: nowrap; flex-shrink: 0; background: linear-gradient(135deg, #0284c7, #0369a1); border-color: #38bdf8; color: #ffffff;"
                    :disabled="unfreezingId === selectedMember.id"
                    @click="handleUnfreezeMember(selectedMember)"
                  >
                    <Icon :icon="unfreezingId === selectedMember.id ? 'lucide:refresh-cw' : 'lucide:flame'" width="13" height="13" :class="{ 'animate-spin': unfreezingId === selectedMember.id }" />
                    <span>{{ unfreezingId === selectedMember.id ? 'Se dezgheață...' : 'Dezgheață Cont' }}</span>
                  </button>
                </div>
              </div>

              <div class="admin-form-group">
                <label class="admin-form-label">Nume Afișat</label>
                <input
                  v-model="editDisplayName"
                  type="text"
                  autocomplete="off"
                  class="admin-form-input"
                />
              </div>

              <div class="admin-form-group">
                <label class="admin-form-label">Username (@login handle)</label>
                <input
                  v-model="editUsername"
                  type="text"
                  :disabled="selectedMember.isRoot"
                  autocomplete="off"
                  placeholder="Ex: iannc69"
                  class="admin-form-input font-mono"
                />
              </div>

              <div class="admin-form-group">
                <label class="admin-form-label">Email Oficial</label>
                <input
                  v-model="editEmail"
                  type="email"
                  autocomplete="off"
                  placeholder="Ex: user@wildfire.ro"
                  class="admin-form-input"
                />
              </div>

              <div v-if="!selectedMember.isRoot" class="admin-form-group">
                <label class="admin-form-label">Status Cont</label>
                <select
                  v-model="editStatus"
                  class="admin-form-input"
                >
                  <option value="active">ACTIV (Acces complet permis - resetează inactivitatea)</option>
                  <option value="suspended">SUSPENDAT (Acces blocat temporar)</option>
                </select>
              </div>

              <div v-if="!selectedMember.isRoot" class="admin-form-group">
                <label class="admin-form-label">Schimbă Parola</label>
                <input
                  v-model="editNewPassword"
                  type="password"
                  autocomplete="new-password"
                  placeholder="Parolă nouă (opțional)..."
                  class="admin-form-input"
                />
              </div>

              <div class="admin-form-group">
                <label class="admin-form-label">Titlu Special / Funcție Card</label>
                <input
                  v-model="editCustomTitle"
                  type="text"
                  autocomplete="off"
                  placeholder="Ex: Lead Docs & Systems Architect"
                  class="admin-form-input"
                />
              </div>

              <div class="admin-form-group">
                <label class="admin-form-label">Tag / UserID Discord</label>
                <input
                  v-model="editDiscord"
                  type="text"
                  autocomplete="off"
                  placeholder="Ex: iannc sau 371621920162185216"
                  class="admin-form-input"
                />
              </div>

              <div class="admin-form-group">
                <label class="admin-form-label">SteamID / Link Profil Steam</label>
                <input
                  v-model="editSteamId"
                  type="text"
                  autocomplete="off"
                  placeholder="Ex: 1iannc sau 76561198... sau link complet"
                  class="admin-form-input"
                />
              </div>

              <div class="admin-form-group">
                <label class="admin-form-label">GitHub Username (Profil Contribuitor)</label>
                <input
                  v-model="editGithubUsername"
                  type="text"
                  autocomplete="off"
                  placeholder="Ex: iannC69"
                  class="admin-form-input"
                />
              </div>

              <div class="admin-form-group">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <label class="admin-form-label">URL Poză Avatar (Imagine Profil)</label>
                  <span v-if="!editAvatarUrl && steamAvatarPreview" style="font-size: 0.68rem; color: #60a5fa; font-weight: 700;">
                    ● Preluat automat de pe Steam
                  </span>
                </div>
                <div style="display: flex; gap: 8px; align-items: center;">
                  <img
                    v-if="editAvatarUrl || steamAvatarPreview"
                    :src="editAvatarUrl || steamAvatarPreview || ''"
                    alt="Preview"
                    style="width: 34px; height: 34px; border-radius: 8px; object-fit: cover; border: 1px solid var(--glass-border); flex-shrink: 0;"
                    @error="(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }"
                  />
                  <input
                    v-model="editAvatarUrl"
                    type="text"
                    autocomplete="off"
                    :placeholder="steamAvatarPreview ? 'Lăsat gol: folosește automat Steam' : 'https://... (URL imagine)'"
                    class="admin-form-input text-xs font-mono"
                    style="flex: 1;"
                  />
                </div>
              </div>

              <!-- 2FA Status & Action -->
              <div class="admin-form-group" style="grid-column: 1 / -1;">
                <div
                  style="padding: 10px 14px; background: rgba(59, 130, 246, 0.06); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 8px; display: flex; align-items: center; justify-content: space-between; gap: 12px;"
                >
                  <div class="flex items-center gap-2.5">
                    <Icon icon="lucide:shield-check" width="16" height="16" class="text-blue-400" />
                    <div>
                      <div class="text-xs font-bold text-blue-300">
                        Autentificare în 2 Pași (2FA TOTP):
                        <span :class="selectedMember.totpEnabled ? 'text-emerald-400' : 'text-zinc-400'">
                          {{ selectedMember.totpEnabled ? 'ACTIVATĂ' : 'DEZACTIVATĂ' }}
                        </span>
                      </div>
                      <div class="text-[0.7rem] text-zinc-400">
                        {{ selectedMember.totpEnabled ? 'Utilizatorul folosește aplicație TOTP (Google Auth, Aegis, etc).' : 'Contul nu are 2FA activat în prezent.' }}
                      </div>
                    </div>
                  </div>

                  <button
                    v-if="selectedMember.totpEnabled && !selectedMember.isRoot"
                    type="button"
                    class="admin-btn admin-btn--secondary"
                    style="font-size: 0.72rem; padding: 4px 10px;"
                    title="Resetează cheia 2FA pentru deblocare cont"
                    @click="handleReset2FA(selectedMember)"
                  >
                    <Icon icon="lucide:lock" width="12" height="12" />
                    <span>Resetează 2FA</span>
                  </button>
                </div>
              </div>

              <!-- Auto-Progression Engine Banner -->
              <div class="admin-form-group" style="grid-column: 1 / -1;">
                <div
                  style="
                    padding: 12px 16px;
                    background: rgba(16, 185, 129, 0.06);
                    border: 1px solid rgba(16, 185, 129, 0.22);
                    borderRadius: 10px;
                    display: flex;
                    alignItems: center;
                    justifyContent: space-between;
                    gap: 12px;
                  "
                >
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <Icon icon="lucide:sparkles" width="16" height="16" class="text-emerald-400" />
                    <div>
                      <div style="font-size: 0.78rem; font-weight: 700; color: #10b981; letter-spacing: 0.02em;">
                        PROGRES &amp; INSIGNE AUTOMATE
                      </div>
                      <div style="font-size: 0.72rem; color: var(--color-text-secondary);">
                        Contorul de ghiduri, commit-urile Git și insignele sunt calculate 100% automat în timp real.
                      </div>
                    </div>
                  </div>
                  <div style="display: flex; gap: 8px; align-items: center;">
                    <span class="admin-perm-tag" style="background: rgba(16, 185, 129, 0.12); color: #10b981; border-color: rgba(16, 185, 129, 0.3);">
                      <Icon icon="lucide:book-open" width="10" height="10" class="inline mr-1" />
                      {{ selectedMember.docsModifiedCount || 0 }} Ghiduri
                    </span>
                    <span class="admin-perm-tag" style="background: rgba(6, 182, 212, 0.12); color: #06b6d4; border-color: rgba(6, 182, 212, 0.3);">
                      <Icon icon="lucide:git-commit" width="10" height="10" class="inline mr-1" />
                      Auto-Sync Git
                    </span>
                  </div>
                </div>
              </div>

              <div class="admin-form-group" style="grid-column: 1 / -1;">
                <label class="admin-form-label">Bio / Descriere Publică</label>
                <input
                  v-model="editBio"
                  type="text"
                  autocomplete="off"
                  placeholder="Scurtă descriere a activității..."
                  class="admin-form-input"
                />
              </div>

              <div class="admin-form-group" style="grid-column: 1 / -1;">
                <label class="admin-form-label">Responsabilități (Separate prin virgulă)</label>
                <input
                  v-model="editRespString"
                  type="text"
                  autocomplete="off"
                  placeholder="Ex: Arhitectură Sisteme, Ghiduri MVP, Securitate"
                  class="admin-form-input"
                />
              </div>
            </div>
          </div>

          <!-- Role Presets Bar -->
          <div v-if="isRootAdmin && !selectedMember.isRoot" class="admin-form-group mb-4">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <label class="admin-form-label" style="margin-bottom: 0;">
                <Icon icon="lucide:wand-2" width="13" height="13" class="inline mr-1 text-amber-400" />
                Șabloane Rapide de Rol &amp; Permisiuni
              </label>
              <span style="font-size: 0.68rem; color: var(--color-text-tertiary);">
                Selectează un rol predefinit sau configurează manual comutatoarele de mai jos
              </span>
            </div>
            <div class="admin-role-picker-grid">
              <template v-for="(preset, key) in rolePresets" :key="key">
                <button
                  v-if="key !== 'root_admin'"
                  type="button"
                  class="admin-role-preset-btn"
                  :class="{ 'admin-role-preset-btn--active': editRole === key }"
                  @click="handleRolePresetChange(String(key), false)"
                >
                  <span class="admin-role-preset-name">{{ preset.label }}</span>
                </button>
              </template>
            </div>
          </div>

          <!-- CATEGORIZED LIQUID GLASS PERMISSIONS MATRIX -->
          <div class="admin-perms-section">
            <div class="admin-perms-header-bar">
              <span class="admin-perms-header-title">
                {{ isRootAdmin && !selectedMember.isRoot ? 'MATRICE PERMISIUNI & ACCES MODULE (17 MODULI)' : 'PERMISIUNI ACTIVE' }}
              </span>
              <span class="admin-perms-header-count">
                {{ Object.values(isRootAdmin && !selectedMember.isRoot ? editPermissions : (selectedMember.permissions || {})).filter(Boolean).length }} / 17 Module Active
              </span>
            </div>

            <div class="admin-perms-categories-stack">
              <div
                v-for="group in PERMISSION_GROUPS"
                :key="group.title"
                class="admin-perm-category-card"
              >
                <div class="admin-perm-cat-header">
                  <div class="admin-perm-cat-title-wrap">
                    <div
                      class="admin-perm-cat-badge-icon"
                      :style="{ backgroundColor: `${group.accent}18`, color: group.accent }"
                    >
                      <Icon :icon="group.icon" width="12" height="12" />
                    </div>
                    <div>
                      <div class="admin-perm-cat-title">{{ group.title }}</div>
                      <div class="admin-perm-cat-sub">{{ group.subtitle }}</div>
                    </div>
                  </div>

                  <div class="admin-perm-cat-actions">
                    <span
                      class="admin-perm-tag"
                      :style="{
                        backgroundColor: `${group.accent}15`,
                        color: group.accent,
                        borderColor: `${group.accent}30`,
                        fontSize: '0.65rem',
                        padding: '2px 7px',
                      }"
                    >
                      {{
                        group.modules.filter((m) =>
                          Boolean(isRootAdmin && !selectedMember.isRoot ? editPermissions[m.key] : selectedMember.permissions?.[m.key])
                        ).length
                      }} / {{ group.modules.length }} Active
                    </span>

                    <template v-if="isRootAdmin && !selectedMember.isRoot && group.modules.some((m) => !m.isRestricted)">
                      <button
                        type="button"
                        class="admin-perm-cat-btn"
                        title="Activează toate permisiunile din această categorie"
                        @click="handleCategorySelectAll(group.modules, true, false)"
                      >
                        Toate
                      </button>
                      <button
                        type="button"
                        class="admin-perm-cat-btn"
                        title="Dezactivează toate permisiunile din această categorie"
                        @click="handleCategorySelectAll(group.modules, false, false)"
                      >
                        Niciuna
                      </button>
                    </template>
                  </div>
                </div>

                <div class="admin-perms-compact-grid">
                  <div
                    v-for="item in group.modules"
                    :key="item.key"
                    class="admin-perm-compact-tile"
                    :class="
                      (isRootAdmin && !selectedMember.isRoot ? Boolean(editPermissions[item.key]) : Boolean(selectedMember.permissions?.[item.key]))
                        ? 'admin-perm-compact-tile--active'
                        : 'admin-perm-compact-tile--inactive'
                    "
                  >
                    <div class="flex items-center gap-2 min-w-0" style="flex: 1;">
                      <div
                        class="admin-perm-compact-icon"
                        :style="{
                          color: item.color,
                          backgroundColor: `${item.color}15`,
                          borderColor: `${item.color}30`,
                        }"
                      >
                        <Icon :icon="item.icon" width="14" height="14" />
                      </div>
                      <div class="admin-perm-tile-text">
                        <span class="admin-perm-compact-name">{{ item.name }}</span>
                        <span class="admin-perm-tile-desc" :title="item.desc">
                          {{ item.desc }}
                        </span>
                      </div>
                    </div>

                    <template v-if="isRootAdmin && !selectedMember.isRoot && !item.isRestricted">
                      <label class="admin-toggle-switch">
                        <input
                          v-model="editPermissions[item.key]"
                          type="checkbox"
                          @change="editRole = 'custom'"
                        />
                        <span class="admin-toggle-slider" />
                      </label>
                    </template>
                    <template v-else>
                      <span
                        class="admin-perm-status-pill"
                        :class="Boolean(selectedMember.permissions?.[item.key]) ? 'admin-perm-status-pill--granted' : 'admin-perm-status-pill--denied'"
                      >
                        <Icon
                          :icon="Boolean(selectedMember.permissions?.[item.key]) ? 'lucide:check' : 'lucide:lock'"
                          width="11"
                          height="11"
                        />
                        <span>{{ Boolean(selectedMember.permissions?.[item.key]) ? 'ACTIV' : 'BLOCAT' }}</span>
                      </span>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="admin-modal-footer">
          <button
            v-if="!selectedMember.isRoot && isRootAdmin"
            type="button"
            class="admin-btn admin-btn--danger"
            @click="handleDeleteMember(selectedMember.id, selectedMember.username)"
          >
            <Icon icon="lucide:trash-2" width="14" height="14" />
            <span>Șterge Membru</span>
          </button>

          <div class="flex items-center gap-3 ml-auto">
            <button
              type="button"
              class="admin-btn admin-btn--secondary"
              @click="selectedMember = null"
            >
              Închide
            </button>

            <button
              v-if="isRootAdmin"
              type="button"
              :disabled="savingEdit"
              class="admin-btn admin-btn--primary"
              @click="handleSaveMember"
            >
              <Icon icon="lucide:save" width="14" height="14" />
              <span>{{ savingEdit ? 'Se salvează...' : 'Salvează Permisiunile' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- ADD NEW MEMBER MODAL (USER INVITE MODAL) -->
    <!-- ========================================================================= -->
    <div v-if="addModalOpen" class="admin-modal-overlay">
      <div class="admin-modal-container">
        <div class="admin-modal-header">
          <div>
            <div class="admin-modal-pretitle">
              <Icon icon="lucide:user-plus" width="11" height="11" />
              <span>ACCESS CONTROL — NOU CONT</span>
            </div>
            <h3 class="admin-modal-title">Adaugă Administrator Nou</h3>
            <p class="admin-modal-subtitle">Configurează rolul, acreditivele și permisiunile granulare.</p>
          </div>
          <button
            type="button"
            class="admin-modal-close-btn"
            @click="addModalOpen = false"
          >
            <Icon icon="lucide:x" width="16" height="16" />
          </button>
        </div>

        <form @submit="handleCreateMember">
          <div class="admin-modal-body">
            <!-- Credentials section -->
            <div class="admin-modal-glass-section">
              <div class="admin-modal-section-label">Credențiale Cont</div>
              <div class="admin-modal-form-grid">
                <div class="admin-form-group">
                  <label class="admin-form-label">Username (Cont Logare)</label>
                  <input
                    v-model="newUsername"
                    type="text"
                    required
                    placeholder="Ex: alex_lead"
                    class="admin-form-input font-mono"
                  />
                </div>

                <div class="admin-form-group">
                  <label class="admin-form-label">Nume Afișat</label>
                  <input
                    v-model="newDisplayName"
                    type="text"
                    placeholder="Ex: Alex - Doc Lead"
                    class="admin-form-input"
                  />
                </div>

                <div class="admin-form-group">
                  <label class="admin-form-label">Parolă Inițială</label>
                  <input
                    v-model="newPassword"
                    type="password"
                    required
                    placeholder="Parolă complexă..."
                    class="admin-form-input"
                  />
                </div>

                <div class="admin-form-group">
                  <label class="admin-form-label">Email Oficial</label>
                  <input
                    v-model="newEmail"
                    type="email"
                    placeholder="alex@wildfire.ro"
                    class="admin-form-input"
                  />
                </div>

                <div class="admin-form-group">
                  <label class="admin-form-label">Tag / UserID Discord (Opțional)</label>
                  <input
                    v-model="newDiscord"
                    type="text"
                    placeholder="Ex: alex_wf sau 282937..."
                    class="admin-form-input"
                  />
                </div>

                <div class="admin-form-group">
                  <label class="admin-form-label">SteamID / Link Profil Steam (Opțional)</label>
                  <div style="display: flex; gap: 8px; align-items: center;">
                    <img
                      v-if="newSteamAvatarPreview"
                      :src="newSteamAvatarPreview"
                      alt="Steam Preview"
                      style="width: 32px; height: 32px; border-radius: 6px; object-fit: cover;"
                    />
                    <input
                      v-model="newSteamId"
                      type="text"
                      placeholder="Ex: 76561198... sau alex_cs2"
                      class="admin-form-input"
                      style="flex: 1;"
                    />
                  </div>
                </div>

                <div class="admin-form-group" style="grid-column: 1 / -1;">
                  <label class="admin-form-label">GitHub Username (Profil Contribuitor / Auto-Push)</label>
                  <input
                    v-model="newGithubUsername"
                    type="text"
                    placeholder="Ex: alex_dev (username oficial pe GitHub)"
                    class="admin-form-input"
                  />
                </div>
              </div>
            </div>

            <!-- Role Preset -->
            <div class="admin-form-group">
              <div class="admin-modal-section-label">Rol &amp; Șablon Rapid de Permisiuni</div>
              <div class="admin-role-picker-grid">
                <template v-for="(preset, key) in rolePresets" :key="key">
                  <button
                    v-if="key !== 'root_admin'"
                    type="button"
                    class="admin-role-preset-btn"
                    :class="{ 'admin-role-preset-btn--active': newRole === key }"
                    @click="handleRolePresetChange(String(key), true)"
                  >
                    <div class="admin-role-preset-name">{{ preset.label }}</div>
                    <div class="admin-role-preset-desc">{{ preset.description }}</div>
                  </button>
                </template>
              </div>
            </div>

            <!-- Categorized Permissions Grid for New Member -->
            <div class="admin-perms-section mt-4">
              <div class="admin-perms-header-bar">
                <span class="admin-perms-header-title">COMUTATOARE PERMISIUNI INIȚIALE (17 MODULI)</span>
                <span class="admin-perms-header-count">
                  {{ Object.values(newPermissions || {}).filter(Boolean).length }} / 17 Active
                </span>
              </div>

              <div class="admin-perms-categories-stack">
                <div
                  v-for="group in PERMISSION_GROUPS"
                  :key="group.title"
                  class="admin-perm-category-card"
                >
                  <div class="admin-perm-cat-header">
                    <div class="admin-perm-cat-title-wrap">
                      <div
                        class="admin-perm-cat-badge-icon"
                        :style="{ backgroundColor: `${group.accent}18`, color: group.accent }"
                      >
                        <Icon :icon="group.icon" width="12" height="12" />
                      </div>
                      <div>
                        <div class="admin-perm-cat-title">{{ group.title }}</div>
                        <div class="admin-perm-cat-sub">{{ group.subtitle }}</div>
                      </div>
                    </div>

                    <div class="admin-perm-cat-actions">
                      <span
                        class="admin-perm-tag"
                        :style="{
                          backgroundColor: `${group.accent}15`,
                          color: group.accent,
                          borderColor: `${group.accent}30`,
                          fontSize: '0.65rem',
                          padding: '2px 7px',
                        }"
                      >
                        {{ group.modules.filter((m) => Boolean(newPermissions[m.key])).length }} / {{ group.modules.length }} Active
                      </span>

                      <template v-if="group.modules.some((m) => !m.isRestricted)">
                        <button
                          type="button"
                          class="admin-perm-cat-btn"
                          title="Activează toate permisiunile din această categorie"
                          @click="handleCategorySelectAll(group.modules, true, true)"
                        >
                          Toate
                        </button>
                        <button
                          type="button"
                          class="admin-perm-cat-btn"
                          title="Dezactivează toate permisiunile din această categorie"
                          @click="handleCategorySelectAll(group.modules, false, true)"
                        >
                          Niciuna
                        </button>
                      </template>
                    </div>
                  </div>

                  <div class="admin-perms-compact-grid">
                    <div
                      v-for="item in group.modules"
                      :key="item.key"
                      class="admin-perm-compact-tile"
                      :class="Boolean(newPermissions[item.key]) ? 'admin-perm-compact-tile--active' : 'admin-perm-compact-tile--inactive'"
                    >
                      <div class="flex items-center gap-2 min-w-0" style="flex: 1;">
                        <div
                          class="admin-perm-compact-icon"
                          :style="{
                            color: item.color,
                            backgroundColor: `${item.color}15`,
                            borderColor: `${item.color}30`,
                          }"
                        >
                          <Icon :icon="item.icon" width="14" height="14" />
                        </div>
                        <div class="admin-perm-tile-text">
                          <span class="admin-perm-compact-name">{{ item.name }}</span>
                          <span class="admin-perm-tile-desc" :title="item.desc">
                            {{ item.desc }}
                          </span>
                        </div>
                      </div>

                      <template v-if="!item.isRestricted">
                        <label class="admin-toggle-switch">
                          <input
                            v-model="newPermissions[item.key]"
                            type="checkbox"
                            @change="newRole = 'custom'"
                          />
                          <span class="admin-toggle-slider" />
                        </label>
                      </template>
                      <template v-else>
                        <span class="admin-perm-status-pill admin-perm-status-pill--denied">
                          <Icon icon="lucide:lock" width="11" height="11" />
                          <span>BLOCAT</span>
                        </span>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="admin-modal-footer">
            <button
              type="button"
              class="admin-btn admin-btn--secondary"
              @click="addModalOpen = false"
            >
              Anulează
            </button>

            <button
              type="submit"
              :disabled="creating"
              class="admin-btn admin-btn--primary"
            >
              <Icon icon="lucide:plus" width="14" height="14" />
              <span>{{ creating ? 'Se creează contul...' : 'Creează Administrator' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-tabs-nav {
  margin-bottom: 1.25rem;
}

.tab-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 9999px;
  background: hsl(0 0% 100% / 0.1);
  color: #fff;
}

.tab-badge--blue {
  background: hsl(215 90% 65% / 0.2);
  color: hsl(215 90% 70%);
}

.tab-badge--emerald {
  background: hsl(142 71% 45% / 0.2);
  color: hsl(142 71% 70%);
}

.admin-role-filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  padding: 8px 12px;
  margin-bottom: 1.25rem;
  background: hsl(0 0% 100% / 0.02);
  border: 1px solid var(--color-border);
  border-radius: 10px;
}

.admin-role-filter-btn {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.admin-role-filter-btn:hover {
  color: #ffffff;
  background: hsl(0 0% 100% / 0.05);
}

.admin-role-filter-btn--active {
  background: hsl(26 100% 50% / 0.15);
  color: hsl(26 100% 58%);
  border-color: hsl(26 100% 50% / 0.3);
}

.admin-2fa-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.62rem;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 4px;
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.admin-perm-tag--bot {
  background: rgba(129, 140, 248, 0.15);
  color: #818cf8;
  border-color: rgba(129, 140, 248, 0.3);
}

/* ── Matrix Tab Styling ── */
.admin-matrix-table-wrap {
  overflow-x: auto;
  background: hsl(0 0% 100% / 0.02);
  border: 1px solid var(--color-border);
  border-radius: 12px;
}

.admin-matrix-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
  text-align: center;
}

.admin-matrix-table th,
.admin-matrix-table td {
  padding: 8px 10px;
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

.cat-header {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 6px 8px;
}

.cat-header--core {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
  border-left: 2px solid #10b981;
}

.cat-header--ops {
  background: rgba(59, 130, 246, 0.12);
  color: #60a5fa;
  border-left: 2px solid #3b82f6;
}

.cat-header--dangerous {
  background: rgba(239, 68, 68, 0.12);
  color: #f87171;
  border-left: 2px solid #ef4444;
}

.sub-headers th {
  font-size: 0.65rem;
  color: var(--color-text-secondary);
  font-weight: 600;
  padding: 4px;
}

.cell-grant {
  color: #10b981;
  background: rgba(16, 185, 129, 0.04);
}

.cell-deny {
  color: rgba(255, 255, 255, 0.15);
}

.cell-root {
  color: #ef4444;
}

.tr-root {
  background: rgba(245, 158, 11, 0.03);
}

.mini-avatar {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 700;
  color: #fff;
  object-fit: cover;
  flex-shrink: 0;
}
</style>
