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
const showGithubPreview = ref<boolean>(false);
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
const showNewPassword = ref<boolean>(false);
const showEditPassword = ref<boolean>(false);
const newRole = ref<string>('content_editor');
const newDiscord = ref<string>('');
const newSteamId = ref<string>('');
const newGithubUsername = ref<string>('');
const newPermissions = ref<TeamMemberPermissions>({ ...DEFAULT_EDITOR_PERMISSIONS });
const newSteamAvatarPreview = ref<string | null>(null);
const creating = ref<boolean>(false);

function generateSecurePassword(length = 16): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const numbers = '23456789';
  const symbols = '!@#$%&*';
  const all = upper + lower + numbers + symbols;

  let pwd = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];

  for (let i = 4; i < length; i++) {
    pwd.push(all[Math.floor(Math.random() * all.length)]);
  }

  return pwd.sort(() => Math.random() - 0.5).join('');
}

function handleGenerateNewPassword() {
  newPassword.value = generateSecurePassword();
  showNewPassword.value = true;
}

function handleGenerateEditPassword() {
  editNewPassword.value = generateSecurePassword();
  showEditPassword.value = true;
}

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

const reconciledCount = computed(() => {
  return unifiedContributors.value.filter((gc) =>
    members.value.some((m) =>
      ((m as any).githubUsername && (m as any).githubUsername.toLowerCase() === gc.login.toLowerCase()) ||
      m.username.toLowerCase() === gc.login.toLowerCase() ||
      m.displayName.toLowerCase() === gc.login.toLowerCase()
    )
  ).length;
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
          <span class="admin-team-metric-badge admin-team-metric-badge--cyan">17 MODULE</span>
        </div>
        <div class="admin-team-metric-sub">Permisiuni granulare criptate</div>
      </div>
    </div>

    <!-- Navigation Tabs: Membri Echipă / GitHub Contributors / Matrice Globală -->
    <div class="admin-db-tabs-bar">
      <button
        type="button"
        class="admin-db-tab-btn"
        :class="{ 'admin-db-tab-btn--active-amber': activeTab === 'members' }"
        @click="activeTab = 'members'"
      >
        <Icon icon="lucide:users" width="14" height="14" />
        <span>Membri Echipă</span>
        <span class="admin-db-tab-badge">{{ filteredMembers.length }}</span>
      </button>

      <button
        type="button"
        class="admin-db-tab-btn"
        :class="{ 'admin-db-tab-btn--active-cyan': activeTab === 'github' }"
        @click="activeTab = 'github'"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
        <span>GitHub Contributors Graph</span>
        <span class="admin-db-tab-badge">{{ unifiedContributors.length }}</span>
      </button>

      <button
        type="button"
        class="admin-db-tab-btn"
        :class="{ 'admin-db-tab-btn--active-emerald': activeTab === 'matrix' }"
        @click="activeTab = 'matrix'"
      >
        <Icon icon="lucide:shield-check" width="14" height="14" />
        <span>Matrice Permisiuni (Overview)</span>
        <span class="admin-db-tab-badge">17</span>
      </button>
    </div>

    <!-- ── TAB 1: MEMBRI ECHIPĂ ── -->
    <div v-if="activeTab === 'members'">
      <!-- GitHub Contributors Graph Reconciliation Panel Preview -->
      <div v-if="unifiedContributors.length > 0" class="wf-github-sync-panel">
        <div class="wf-github-sync-header">
          <div class="wf-github-sync-info">
            <div class="wf-github-sync-icon-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="text-zinc-200" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </div>
            <div>
              <div class="wf-github-sync-title-row">
                <h4 class="wf-github-sync-title">Sincronizare GitHub Contributors Graph</h4>
                <span class="wf-perm-tag wf-perm-tag--emerald">LIVE SYNC ACTIV</span>
              </div>
              <span class="wf-github-sync-sub">
                Reconciliere automată între committerii din repository (graphs/contributors) și membrii din My Team
              </span>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <button
              type="button"
              class="admin-filter-pill"
              :class="{ 'admin-filter-pill--active': showGithubPreview }"
              style="cursor: pointer;"
              @click="showGithubPreview = !showGithubPreview"
            >
              <Icon :icon="showGithubPreview ? 'lucide:chevron-up' : 'lucide:chevron-down'" width="12" height="12" />
              <span>{{ showGithubPreview ? 'Ascunde Detalii' : 'Previzualizează Committeri (' + unifiedContributors.length + ')' }}</span>
            </button>

            <button
              type="button"
              class="admin-filter-pill"
              style="cursor: pointer;"
              @click="activeTab = 'github'"
            >
              <Icon icon="lucide:layout-grid" width="12" height="12" />
              <span>Deschide Tab Graph</span>
            </button>

            <a
              :href="githubGraphUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="wf-github-sync-link"
              title="Deschide graficul oficial pe GitHub"
            >
              <span>GitHub</span>
              <Icon icon="lucide:external-link" width="11" height="11" />
            </a>
          </div>
        </div>

        <div v-if="showGithubPreview" class="wf-github-sync-grid">
          <div
            v-for="gc in unifiedContributors"
            :key="gc.login"
            class="wf-github-sync-card"
          >
            <div class="wf-gh-card-left">
              <img
                :src="gc.avatarUrl || `https://github.com/${gc.login}.png`"
                :alt="gc.login"
                class="wf-github-sync-avatar"
                @error="(e) => {
                  const matched = members.find((m) =>
                    ((m as any).githubUsername && (m as any).githubUsername.toLowerCase() === gc.login.toLowerCase()) ||
                    m.username.toLowerCase() === gc.login.toLowerCase()
                  );
                  if (matched?.avatarUrl) (e.currentTarget as HTMLImageElement).src = matched.avatarUrl;
                }"
              />
              <div class="wf-gh-card-names">
                <div class="wf-gh-card-login-row">
                  <span class="wf-github-sync-username">@{{ gc.login }}</span>
                  <span
                    class="wf-gh-commit-count"
                    :style="{ color: gc.totalCommits > 0 ? 'hsl(215 90% 65%)' : '#64748b' }"
                  >
                    {{ gc.totalCommits }} commits
                  </span>
                </div>
                <div class="wf-gh-match-status">
                  <template
                    v-if="
                      members.find((m) =>
                        ((m as any).githubUsername && (m as any).githubUsername.toLowerCase() === gc.login.toLowerCase()) ||
                        m.username.toLowerCase() === gc.login.toLowerCase() ||
                        m.displayName.toLowerCase() === gc.login.toLowerCase()
                      )
                    "
                  >
                    <span class="wf-gh-matched-pill">
                      <Icon icon="lucide:check" width="11" height="11" />
                      <span>Reconciliat cu <strong>@{{
                        members.find((m) =>
                          ((m as any).githubUsername && (m as any).githubUsername.toLowerCase() === gc.login.toLowerCase()) ||
                          m.username.toLowerCase() === gc.login.toLowerCase() ||
                          m.displayName.toLowerCase() === gc.login.toLowerCase()
                        )?.username
                      }}</strong></span>
                    </span>
                  </template>
                  <template v-else>
                    <span class="wf-gh-unmatched-pill">Neasociat în My Team</span>
                  </template>
                </div>
              </div>
            </div>

            <div class="wf-gh-diff-stats">
              <span v-if="gc.totalAdditions > 0" style="color: hsl(142 71% 65%); display: block;">
                +{{ gc.totalAdditions.toLocaleString() }}
              </span>
              <span v-if="gc.totalDeletions > 0" style="color: hsl(0 84% 65%); display: block;">
                -{{ gc.totalDeletions.toLocaleString() }}
              </span>
              <span v-if="gc.totalCommits === 0" style="color: #64748b; font-size: 0.65rem; display: block;">
                Profil Conectat
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Search & Filter Toolbar -->
      <div class="wf-team-toolbar">
        <div class="wf-team-search-box">
          <Icon icon="lucide:search" width="14" height="14" class="wf-team-search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Caută membru după nume, rol sau username..."
            autocomplete="off"
            spellcheck="false"
            class="wf-team-search-input"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="wf-team-search-clear"
            title="Șterge căutarea"
            @click="searchQuery = ''"
          >
            <Icon icon="lucide:x" width="12" height="12" />
          </button>
        </div>

        <div class="wf-team-session-pill">
          <span class="wf-member-status-dot wf-member-status-dot--active" style="position: static; width: 7px; height: 7px; border: none;" />
          <span class="wf-session-pill-label">Autentificat ca:</span>
          <span class="wf-session-pill-name">
            {{ currentUser?.displayName || currentUser?.username || 'Admin' }}
          </span>
          <span
            class="wf-session-pill-badge"
            :class="isRootAdmin ? 'wf-session-pill-badge--root' : 'wf-session-pill-badge--member'"
          >
            {{ isRootAdmin ? 'Root Super Admin' : 'Membru Delegat' }}
          </span>
        </div>
      </div>

      <!-- Role Filters Bar -->
      <div class="wf-role-filter-bar">
        <div class="wf-role-pills-wrap">
          <span class="wf-filter-section-label">Filtrează după rol:</span>
          <button
            type="button"
            class="wf-filter-chip"
            :class="{ 'wf-filter-chip--active': roleFilter === 'all' }"
            @click="roleFilter = 'all'"
          >
            Toate ({{ members.length }})
          </button>
          <button
            type="button"
            class="wf-filter-chip"
            :class="{ 'wf-filter-chip--active': roleFilter === 'root_admin' }"
            @click="roleFilter = 'root_admin'"
          >
            Root Super Admin
          </button>
          <button
            type="button"
            class="wf-filter-chip"
            :class="{ 'wf-filter-chip--active': roleFilter === 'doc_lead' }"
            @click="roleFilter = 'doc_lead'"
          >
            Doc Lead
          </button>
          <button
            type="button"
            class="wf-filter-chip"
            :class="{ 'wf-filter-chip--active': roleFilter === 'content_editor' }"
            @click="roleFilter = 'content_editor'"
          >
            Content Editor
          </button>
          <button
            type="button"
            class="wf-filter-chip"
            :class="{ 'wf-filter-chip--active': roleFilter === 'moderator' }"
            @click="roleFilter = 'moderator'"
          >
            Moderator
          </button>
          <button
            type="button"
            class="wf-filter-chip"
            :class="{ 'wf-filter-chip--active': roleFilter === 'viewer' }"
            @click="roleFilter = 'viewer'"
          >
            Viewer
          </button>
          <button
            type="button"
            class="wf-filter-chip"
            :class="{ 'wf-filter-chip--active': roleFilter === 'security_auditor' }"
            @click="roleFilter = 'security_auditor'"
          >
            Auditor
          </button>
          <button
            type="button"
            class="wf-filter-chip"
            :class="{ 'wf-filter-chip--active': roleFilter === 'discord_dev' }"
            @click="roleFilter = 'discord_dev'"
          >
            Discord Bot Dev
          </button>
        </div>

        <div class="wf-status-pills-wrap">
          <button
            type="button"
            class="wf-status-filter-chip"
            :class="{ 'wf-status-filter-chip--active': statusFilter === 'all' }"
            @click="statusFilter = 'all'"
          >
            Toți
          </button>
          <button
            type="button"
            class="wf-status-filter-chip"
            :class="{ 'wf-status-filter-chip--active': statusFilter === 'active' }"
            @click="statusFilter = 'active'"
          >
            Activi ({{ activeCount }})
          </button>
          <button
            type="button"
            class="wf-status-filter-chip"
            :class="{ 'wf-status-filter-chip--active': statusFilter === 'suspended' }"
            @click="statusFilter = 'suspended'"
          >
            Suspendați ({{ members.length - activeCount }})
          </button>
        </div>
      </div>

      <!-- Members Grid -->
      <div class="wf-team-cards-grid">
        <div v-if="loading" class="wf-team-empty-state">
          <Icon icon="lucide:refresh-cw" width="24" height="24" class="wf-rotate-spin text-orange-500 mb-2" />
          <span>Se încarcă membrii echipei...</span>
        </div>

        <div v-else-if="filteredMembers.length === 0" class="wf-team-empty-state">
          <Icon icon="lucide:users" width="36" height="36" class="text-zinc-500 mb-2" />
          <p>Niciun membru găsit conform filtrelor selectate.</p>
        </div>

        <div
          v-for="member in filteredMembers"
          v-else
          :key="member.id"
          class="wf-member-card"
          :class="{
            'wf-member-card--selected': selectedMember?.id === member.id,
            'wf-member-card--frozen': isZombieFrozen(member)
          }"
          @click="openInspector(member)"
        >
          <div class="wf-card-top-beam" aria-hidden="true" />

          <div class="wf-member-card-header">
            <!-- 44px Avatar Wrap with Status Pip -->
            <div class="wf-member-avatar-wrap">
              <img
                v-if="member.avatarUrl"
                :src="member.avatarUrl"
                :alt="member.displayName"
                class="wf-member-avatar-img"
                @error="($event.target as HTMLImageElement).src = member.githubUsername ? `https://github.com/${member.githubUsername}.png` : 'https://github.com/iannC69.png'"
              />
              <div
                v-else
                class="wf-member-avatar-fallback"
                :style="{ backgroundColor: member.avatarColor || '#ff6b00' }"
              >
                {{ member.displayName ? member.displayName.slice(0, 2).toUpperCase() : member.username.slice(0, 2).toUpperCase() }}
              </div>
              <span
                class="wf-member-status-dot"
                :class="{
                  'wf-member-status-dot--active': member.status === 'active',
                  'wf-member-status-dot--frozen': isZombieFrozen(member),
                  'wf-member-status-dot--suspended': member.status !== 'active' && !isZombieFrozen(member)
                }"
              />
            </div>

            <!-- Identity Info -->
            <div class="wf-member-identity">
              <div class="wf-member-name-row">
                <h4 class="wf-member-name">{{ member.displayName }}</h4>
                <span v-if="member.isRoot" class="wf-badge-root" title="Root Super Admin (Protejat)">
                  <Icon icon="lucide:shield-check" width="11" height="11" />
                  <span>ROOT</span>
                </span>
                <span v-if="member.totpEnabled" class="wf-badge-2fa" title="2FA TOTP Activ">
                  <Icon icon="lucide:lock" width="10" height="10" />
                  <span>2FA</span>
                </span>
              </div>
              <div class="wf-member-handle-row">
                <span class="wf-member-handle">@{{ member.username }}</span>
                <span v-if="member.customTitle" class="wf-member-custom-title">• {{ member.customTitle }}</span>
              </div>
            </div>

            <!-- Status Capsule -->
            <span
              v-if="member.status === 'active'"
              class="wf-status-pill wf-status-pill--active"
            >
              <span class="wf-status-pip" />
              <span>ACTIV</span>
            </span>
            <span
              v-else-if="isZombieFrozen(member)"
              class="wf-status-pill wf-status-pill--frozen"
              title="Cont înghețat automat pentru inactivitate (peste 30 de zile)"
            >
              <Icon icon="lucide:snowflake" width="10" height="10" />
              <span>ÎNGHEȚAT</span>
            </span>
            <span
              v-else
              class="wf-status-pill wf-status-pill--suspended"
            >
              <span class="wf-status-pip" />
              <span>SUSPENDAT</span>
            </span>
          </div>

          <div class="wf-member-card-body">
            <div class="wf-member-meta-row">
              <span class="wf-member-role-chip">
                {{ rolePresets[member.role]?.label || member.role.replace('_', ' ') }}
              </span>
              <span v-if="member.email" class="wf-member-email-chip" :title="member.email">
                <Icon icon="lucide:mail" width="10" height="10" />
                <span>{{ member.email }}</span>
              </span>
            </div>

            <!-- Active Micro-Permission Badges -->
            <div class="wf-member-perms-flow">
              <span v-if="member.permissions?.canEditDocs" class="wf-perm-chip wf-perm-chip--studio">Content Studio</span>
              <span v-if="member.permissions?.canDeleteDocs" class="wf-perm-chip wf-perm-chip--delete">Delete Docs</span>
              <span v-if="member.permissions?.canManageHealth" class="wf-perm-chip wf-perm-chip--health">Doc Health</span>
              <span v-if="member.permissions?.canManageMedia" class="wf-perm-chip wf-perm-chip--media">Media Vault</span>
              <span v-if="member.permissions?.canManageTasks" class="wf-perm-chip wf-perm-chip--tasks">Task Hub</span>
              <span v-if="member.permissions?.canViewAnalytics" class="wf-perm-chip wf-perm-chip--telemetry">Telemetry</span>
              <span v-if="member.permissions?.canViewAiStats" class="wf-perm-chip wf-perm-chip--ai">AI Telemetry</span>
              <span v-if="member.permissions?.canManageDb" class="wf-perm-chip wf-perm-chip--db">Database</span>
              <span v-if="member.permissions?.canViewAudit" class="wf-perm-chip wf-perm-chip--audit">Audit Ledger</span>
              <span v-if="member.permissions?.canManageSecurity" class="wf-perm-chip wf-perm-chip--security">Securitate 2FA</span>
              <span v-if="member.permissions?.canManageApiKeys" class="wf-perm-chip wf-perm-chip--api">API Tokens</span>
              <span v-if="member.permissions?.canManageSnapshots" class="wf-perm-chip wf-perm-chip--snapshots">Snapshots</span>
              <span v-if="member.permissions?.canManageWebhooks" class="wf-perm-chip wf-perm-chip--webhooks">Webhooks</span>
              <span v-if="member.permissions?.canManageDiscordBot" class="wf-perm-chip wf-perm-chip--bot">Discord Bot</span>
              <span v-if="member.permissions?.canManageSettings" class="wf-perm-chip wf-perm-chip--settings">Setări Platformă</span>
              <span v-if="member.permissions?.canManageTeam" class="wf-perm-chip wf-perm-chip--team">Gestiune Echipă</span>
              <span v-if="member.permissions?.canTriggerPanic" class="wf-perm-chip wf-perm-chip--panic">Panic Lockdown</span>
            </div>
          </div>

          <div class="wf-member-card-footer">
            <div class="wf-member-telemetry-box">
              <span class="wf-member-perms-count">
                {{ countActivePerms(member) }} / 17 Permisiuni Active
              </span>
              <span class="wf-member-git-stat">
                <template v-if="repoStats[member.username.toLowerCase()]?.totalCommits">
                  <Icon icon="lucide:git-commit" width="11" height="11" class="text-cyan-400" />
                  <span><strong>{{ repoStats[member.username.toLowerCase()].totalCommits }}</strong> commits repo</span>
                </template>
                <template v-else>
                  <Icon icon="lucide:file-text" width="11" height="11" class="text-zinc-500" />
                  <span><strong>{{ repoStats[member.username.toLowerCase()]?.docsCommits ?? member.docsModifiedCount ?? 0 }}</strong> ghiduri</span>
                </template>
              </span>
            </div>

            <div class="wf-member-actions-cluster">
              <button
                v-if="isRootAdmin && member.status === 'suspended'"
                type="button"
                class="wf-btn-tactical"
                style="font-size: 0.7rem; padding: 4px 8px; color: #38bdf8; border-color: rgba(56, 189, 248, 0.35); background: rgba(56, 189, 248, 0.08);"
                :title="isZombieFrozen(member) ? 'Dezgheață contul și resetează inactivitatea' : 'Reactivează contul'"
                :disabled="unfreezingId === member.id"
                @click.stop="handleUnfreezeMember(member)"
              >
                <Icon :icon="unfreezingId === member.id ? 'lucide:refresh-cw' : 'lucide:flame'" width="11" height="11" :class="{ 'wf-rotate-spin': unfreezingId === member.id }" />
                <span>{{ unfreezingId === member.id ? '...' : 'Dezgheață' }}</span>
              </button>
              <a
                :href="`/docs/team/${encodeURIComponent(member.username)}`"
                target="_blank"
                rel="noopener noreferrer"
                class="wf-btn-tactical wf-btn-tactical--ghost"
                title="Deschide profilul public"
                @click.stop
              >
                <Icon icon="lucide:external-link" width="12" height="12" />
              </a>
              <button
                type="button"
                class="wf-btn-tactical wf-btn-tactical--ghost"
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
    <div v-else-if="activeTab === 'github'" class="wf-github-expanded-tab">
      <div class="wf-github-sync-panel" style="margin-top: 0;">
        <div class="wf-github-sync-header">
          <div class="wf-github-sync-info">
            <div class="wf-github-sync-icon-box" style="width: 38px; height: 38px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="text-zinc-200">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </div>
            <div>
              <div class="wf-github-sync-title-row">
                <h3 class="wf-github-sync-title" style="font-size: 0.95rem;">GitHub Contributors & Commits Matrix</h3>
                <span class="wf-perm-tag wf-perm-tag--emerald">LIVE GRAPH API</span>
              </div>
              <p class="wf-github-sync-sub">
                Sincronizare completă a activității pe repository-ul WildFire Docs cu asocierile membrilor interni.
              </p>
            </div>
          </div>

          <a
            :href="githubGraphUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="wf-github-sync-link"
          >
            <span>Deschide Graphs/Contributors pe GitHub</span>
            <Icon icon="lucide:external-link" width="12" height="12" />
          </a>
        </div>

        <div class="wf-github-sync-grid" style="grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));">
          <div
            v-for="gc in unifiedContributors"
            :key="gc.login"
            class="wf-github-sync-card"
            style="padding: 12px 14px;"
          >
            <div class="wf-gh-card-left">
              <img
                :src="gc.avatarUrl || `https://github.com/${gc.login}.png`"
                :alt="gc.login"
                class="wf-github-sync-avatar"
                style="width: 40px; height: 40px;"
                @error="(e) => {
                  const matched = members.find((m) =>
                    ((m as any).githubUsername && (m as any).githubUsername.toLowerCase() === gc.login.toLowerCase()) ||
                    m.username.toLowerCase() === gc.login.toLowerCase()
                  );
                  if (matched?.avatarUrl) (e.currentTarget as HTMLImageElement).src = matched.avatarUrl;
                }"
              />
              <div class="wf-gh-card-names">
                <div class="wf-gh-card-login-row">
                  <span class="wf-github-sync-username" style="font-size: 0.92rem;">@{{ gc.login }}</span>
                  <a
                    :href="gc.profileUrl || `https://github.com/${gc.login}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-zinc-400 hover:text-white"
                    title="Profil GitHub"
                  >
                    <Icon icon="lucide:external-link" width="12" height="12" />
                  </a>
                </div>
                <div class="wf-gh-match-status">
                  <span v-if="members.find((m) => ((m as any).githubUsername && (m as any).githubUsername.toLowerCase() === gc.login.toLowerCase()) || m.username.toLowerCase() === gc.login.toLowerCase())" class="wf-gh-matched-pill">
                    <Icon icon="lucide:check" width="11" height="11" />
                    <span>Asociat cu <strong>@{{ members.find((m) => ((m as any).githubUsername && (m as any).githubUsername.toLowerCase() === gc.login.toLowerCase()) || m.username.toLowerCase() === gc.login.toLowerCase())?.username }}</strong></span>
                  </span>
                  <span v-else class="wf-gh-unmatched-pill">
                    Neasociat în My Team
                  </span>
                </div>
              </div>
            </div>

            <div class="wf-gh-diff-stats">
              <div style="font-size: 0.85rem; font-weight: 800; color: #60a5fa;">
                {{ gc.totalCommits }} commits
              </div>
              <div v-if="gc.totalAdditions > 0" style="color: #4ade80; font-size: 0.72rem;">
                +{{ gc.totalAdditions.toLocaleString() }} linii
              </div>
              <div v-if="gc.totalDeletions > 0" style="color: #f87171; font-size: 0.72rem;">
                -{{ gc.totalDeletions.toLocaleString() }} linii
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── TAB 3: MATRICE GLOBALA PERMISIUNI (OVERVIEW) ── -->
    <div v-else-if="activeTab === 'matrix'" class="wf-matrix-tab">
      <div class="wf-matrix-table-wrap">
        <table class="wf-matrix-table">
          <thead>
            <tr>
              <th style="min-width: 190px; text-align: left;">Membru Echipă</th>
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
                <div class="wf-matrix-member-cell">
                  <div
                    v-if="!m.avatarUrl"
                    class="mini-avatar"
                    :style="{ backgroundColor: m.avatarColor || '#ff6b00' }"
                  >
                    {{ m.displayName ? m.displayName.slice(0, 1).toUpperCase() : m.username.slice(0, 1).toUpperCase() }}
                  </div>
                  <img v-else :src="m.avatarUrl" class="mini-avatar" alt="Avatar" @error="($event.target as HTMLImageElement).src = m.githubUsername ? `https://github.com/${m.githubUsername}.png` : 'https://github.com/iannC69.png'" />
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
                <span class="wf-member-role-chip" style="font-size: 0.65rem; padding: 2px 7px;">
                  {{ rolePresets[m.role]?.label || m.role }}
                </span>
              </td>
              <td style="text-align: center;">
                <span
                  v-if="m.status === 'active'"
                  class="wf-status-pill wf-status-pill--active"
                  style="font-size: 0.6rem; padding: 2px 7px;"
                >
                  ACTIV
                </span>
                <span
                  v-else-if="isZombieFrozen(m)"
                  class="wf-status-pill wf-status-pill--frozen"
                  style="font-size: 0.6rem; padding: 2px 7px;"
                  title="Cont înghețat automat pentru inactivitate (peste 30 de zile)"
                >
                  ÎNGHEȚAT
                </span>
                <span
                  v-else
                  class="wf-status-pill wf-status-pill--suspended"
                  style="font-size: 0.6rem; padding: 2px 7px;"
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
                <div style="display: flex; gap: 6px; justify-content: flex-end; align-items: center;">
                  <button
                    v-if="isRootAdmin && m.status === 'suspended'"
                    type="button"
                    class="wf-btn-tactical"
                    style="font-size: 0.68rem; padding: 2px 7px; color: #38bdf8; border-color: rgba(56, 189, 248, 0.35); background: rgba(56, 189, 248, 0.08);"
                    :title="isZombieFrozen(m) ? 'Dezgheață contul și resetează inactivitatea' : 'Reactivează contul'"
                    :disabled="unfreezingId === m.id"
                    @click="handleUnfreezeMember(m)"
                  >
                    {{ unfreezingId === m.id ? '...' : 'Dezgheață' }}
                  </button>
                  <button
                    type="button"
                    class="wf-btn-tactical wf-btn-tactical--ghost"
                    style="font-size: 0.68rem; padding: 2px 8px;"
                    @click="openInspector(m)"
                  >
                    Inspector
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- ========================================================================= -->
    <!-- DEEP PROFILE & PERMISSIONS INSPECTOR MODAL / DRAWER -->
    <!-- ========================================================================= -->
    <div v-if="selectedMember" class="wf-modal-backdrop" @click.self="selectedMember = null">
      <div class="wf-modal-box wf-modal-box--inspector" role="dialog" aria-modal="true">
        <!-- Top Specular Beam Highlight -->
        <div class="wf-modal-beam" aria-hidden="true" />

        <!-- Modal Header -->
        <div class="wf-modal-head">
          <div class="wf-modal-head-identity">
            <!-- Large Avatar Frame with Status Pip -->
            <div class="wf-modal-avatar-frame">
              <img
                v-if="editAvatarUrl || steamAvatarPreview || selectedMember.avatarUrl"
                :src="editAvatarUrl || steamAvatarPreview || selectedMember.avatarUrl || ''"
                :alt="selectedMember.displayName"
                class="wf-modal-avatar-img"
                @error="(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }"
              />
              <div
                v-else
                class="wf-modal-avatar-fallback"
                :style="{ backgroundColor: selectedMember.avatarColor || '#ea580c' }"
              >
                {{ selectedMember.displayName ? selectedMember.displayName.slice(0, 2).toUpperCase() : selectedMember.username.slice(0, 2).toUpperCase() }}
              </div>
              <span
                class="wf-modal-avatar-pip"
                :class="{
                  'wf-modal-avatar-pip--active': selectedMember.status === 'active',
                  'wf-modal-avatar-pip--frozen': isZombieFrozen(selectedMember),
                  'wf-modal-avatar-pip--suspended': selectedMember.status !== 'active' && !isZombieFrozen(selectedMember)
                }"
              />
            </div>

            <!-- Identity Labels & Badges Row -->
            <div class="wf-modal-identity-meta">
              <div class="wf-modal-identity-row">
                <h3 class="wf-modal-title">{{ selectedMember.displayName }}</h3>
                <span class="wf-modal-role-pill">
                  <Icon icon="lucide:shield" width="11" height="11" />
                  <span>{{ rolePresets[selectedMember.role]?.label || selectedMember.role.replace('_', ' ') }}</span>
                </span>
                <span
                  v-if="selectedMember.status === 'active'"
                  class="wf-modal-status-pill wf-modal-status-pill--active"
                >
                  <span class="wf-status-pip" />
                  <span>ACTIV</span>
                </span>
                <span
                  v-else-if="isZombieFrozen(selectedMember)"
                  class="wf-modal-status-pill wf-modal-status-pill--frozen"
                  title="Cont înghețat automat pentru inactivitate (peste 30 de zile)"
                >
                  <Icon icon="lucide:snowflake" width="11" height="11" />
                  <span>ÎNGHEȚAT 30Z</span>
                </span>
                <span
                  v-else
                  class="wf-modal-status-pill wf-modal-status-pill--suspended"
                >
                  <Icon icon="lucide:ban" width="11" height="11" />
                  <span>SUSPENDAT</span>
                </span>
                <span v-if="selectedMember.totpEnabled" class="wf-modal-2fa-pill" title="2FA Activ">
                  <Icon icon="lucide:lock" width="10" height="10" />
                  <span>2FA TOTP</span>
                </span>
                <span v-if="selectedMember.isRoot" class="wf-modal-root-pill" title="Root Super Admin">
                  <Icon icon="lucide:shield-check" width="11" height="11" />
                  <span>ROOT IMMUNITY</span>
                </span>
              </div>

              <div class="wf-modal-sub-row">
                <span class="wf-modal-handle">@{{ selectedMember.username }}</span>
                <span v-if="selectedMember.email" class="wf-modal-sub-sep">•</span>
                <span v-if="selectedMember.email" class="wf-modal-sub-val">{{ selectedMember.email }}</span>
                <span v-if="selectedMember.customTitle" class="wf-modal-sub-sep">•</span>
                <span v-if="selectedMember.customTitle" class="wf-modal-sub-val">{{ selectedMember.customTitle }}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            class="wf-modal-close-btn"
            title="Închide fereastra"
            @click="selectedMember = null"
          >
            <Icon icon="lucide:x" width="16" height="16" />
          </button>
        </div>

        <!-- Modal Body (Scrollable) -->
        <div class="wf-modal-body">
          <!-- CARD 1: Public Profile & Account Details (If Root Super Admin) -->
          <div v-if="isRootAdmin" class="wf-modal-card">
            <div class="wf-modal-card-head">
              <div class="wf-modal-card-icon wf-modal-card-icon--orange">
                <Icon icon="lucide:user-cog" width="14" height="14" />
              </div>
              <div>
                <h4 class="wf-modal-card-title">Profil Public &amp; Informații Cont</h4>
                <p class="wf-modal-card-subtitle">Actualizează datele de identificare și conexiunile contului.</p>
              </div>
            </div>

            <!-- Zombie Inactivity Alert Notice -->
            <div
              v-if="!selectedMember.isRoot && selectedMember.status === 'suspended'"
              class="wf-modal-freeze-banner"
            >
              <div class="wf-modal-freeze-left">
                <div class="wf-modal-freeze-icon">
                  <Icon :icon="isZombieFrozen(selectedMember) ? 'lucide:snowflake' : 'lucide:alert-octagon'" width="18" height="18" />
                </div>
                <div>
                  <div class="wf-modal-freeze-title">
                    {{ isZombieFrozen(selectedMember) ? 'CONT ÎNGHEȚAT PENTRU INACTIVITATE (30+ ZILE)' : 'CONT SUSPENDAT TEMPORAR' }}
                  </div>
                  <div class="wf-modal-freeze-text">
                    <template v-if="isZombieFrozen(selectedMember)">
                      Sistemul de securitate Zombie Reaper a înghețat acest cont din cauza absenței conectării. Ultima conectare: <strong>{{ formatRelativeTimeRo(selectedMember.lastLoginAt) }}</strong>.
                    </template>
                    <template v-else>
                      Acest cont are accesul restricționat manual de către un administrator.
                    </template>
                    Apasă pe <strong>Dezgheață Cont</strong> pentru a anula restricția și a reseta cronometrul de 30 de zile.
                  </div>
                </div>
              </div>

              <button
                type="button"
                class="wf-btn-tactical wf-btn-tactical--unfreeze"
                :disabled="unfreezingId === selectedMember.id"
                @click="handleUnfreezeMember(selectedMember)"
              >
                <Icon :icon="unfreezingId === selectedMember.id ? 'lucide:refresh-cw' : 'lucide:flame'" width="13" height="13" :class="{ 'wf-rotate-spin': unfreezingId === selectedMember.id }" />
                <span>{{ unfreezingId === selectedMember.id ? 'Se dezgheață...' : 'Dezgheață Cont' }}</span>
              </button>
            </div>

            <div class="wf-modal-form-grid">
              <div class="wf-form-field">
                <label class="wf-form-label">Nume Afișat</label>
                <input
                  v-model="editDisplayName"
                  type="text"
                  autocomplete="off"
                  class="wf-form-input"
                />
              </div>

              <div class="wf-form-field">
                <label class="wf-form-label">Username (@login handle)</label>
                <input
                  v-model="editUsername"
                  type="text"
                  :disabled="selectedMember.isRoot"
                  autocomplete="off"
                  placeholder="Ex: iannc69"
                  class="wf-form-input font-mono"
                />
              </div>

              <div class="wf-form-field">
                <label class="wf-form-label">Email Oficial</label>
                <input
                  v-model="editEmail"
                  type="email"
                  autocomplete="off"
                  placeholder="Ex: user@wildfire.ro"
                  class="wf-form-input"
                />
              </div>

              <div v-if="!selectedMember.isRoot" class="wf-form-field">
                <label class="wf-form-label">Status Cont</label>
                <select
                  v-model="editStatus"
                  class="wf-form-select"
                >
                  <option value="active">ACTIV (Acces complet permis - resetează inactivitatea)</option>
                  <option value="suspended">SUSPENDAT (Acces blocat temporar)</option>
                </select>
              </div>

              <!-- Password changer with inline generator -->
              <div v-if="!selectedMember.isRoot" class="wf-form-field">
                <div class="wf-form-label-row">
                  <label class="wf-form-label">Schimbă Parola</label>
                  <button
                    type="button"
                    class="wf-form-action-btn"
                    title="Generează o parolă puternică aleatorie"
                    @click="handleGenerateEditPassword"
                  >
                    <Icon icon="lucide:sparkles" width="11" height="11" />
                    <span>Generează</span>
                  </button>
                </div>
                <div class="wf-form-input-wrap">
                  <input
                    v-model="editNewPassword"
                    :type="showEditPassword ? 'text' : 'password'"
                    autocomplete="new-password"
                    placeholder="Parolă nouă (opțional)..."
                    class="wf-form-input wf-form-input--has-action"
                  />
                  <button
                    type="button"
                    class="wf-input-eye-btn"
                    :title="showEditPassword ? 'Ascunde parola' : 'Arată parola'"
                    @click="showEditPassword = !showEditPassword"
                  >
                    <Icon
                      :icon="showEditPassword ? 'lucide:eye-off' : 'lucide:eye'"
                      width="15"
                      height="15"
                      :class="{ 'text-amber-400': showEditPassword }"
                    />
                  </button>
                </div>
              </div>

              <div class="wf-form-field">
                <label class="wf-form-label">Titlu Special / Funcție Card</label>
                <input
                  v-model="editCustomTitle"
                  type="text"
                  autocomplete="off"
                  placeholder="Ex: Senior Content Editor"
                  class="wf-form-input"
                />
              </div>

              <div class="wf-form-field">
                <label class="wf-form-label">Tag / UserID Discord</label>
                <input
                  v-model="editDiscord"
                  type="text"
                  autocomplete="off"
                  placeholder="Ex: iannc sau 371621920162185216"
                  class="wf-form-input font-mono"
                />
              </div>

              <div class="wf-form-field">
                <label class="wf-form-label">SteamID / Link Profil Steam</label>
                <input
                  v-model="editSteamId"
                  type="text"
                  autocomplete="off"
                  placeholder="Ex: 1iannc sau 76561198... sau link profil"
                  class="wf-form-input font-mono"
                />
              </div>

              <div class="wf-form-field">
                <label class="wf-form-label">GitHub Username (Profil Contribuitor)</label>
                <input
                  v-model="editGithubUsername"
                  type="text"
                  autocomplete="off"
                  placeholder="Ex: iannC69"
                  class="wf-form-input font-mono"
                />
              </div>

              <!-- Avatar URL with live preview thumbnail -->
              <div class="wf-form-field">
                <div class="wf-form-label-row">
                  <label class="wf-form-label">URL Poză Avatar (Imagine Profil)</label>
                  <span v-if="!editAvatarUrl && steamAvatarPreview" class="wf-form-label-hint">
                    Preluat automat de pe Steam
                  </span>
                </div>
                <div class="wf-avatar-input-row">
                  <img
                    v-if="editAvatarUrl || steamAvatarPreview"
                    :src="editAvatarUrl || steamAvatarPreview || ''"
                    alt="Preview"
                    class="wf-avatar-preview-thumb"
                    @error="(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }"
                  />
                  <input
                    v-model="editAvatarUrl"
                    type="text"
                    autocomplete="off"
                    :placeholder="steamAvatarPreview ? 'Lăsat gol: folosește automat Steam' : 'https://... (URL imagine)'"
                    class="wf-form-input font-mono text-xs"
                    style="flex: 1;"
                  />
                </div>
              </div>

              <div class="wf-form-field wf-form-field--full">
                <label class="wf-form-label">Bio / Descriere Publică</label>
                <input
                  v-model="editBio"
                  type="text"
                  autocomplete="off"
                  placeholder="Scurtă descriere a activității..."
                  class="wf-form-input"
                />
              </div>

              <div class="wf-form-field wf-form-field--full">
                <label class="wf-form-label">Responsabilități (Separate prin virgulă)</label>
                <input
                  v-model="editRespString"
                  type="text"
                  autocomplete="off"
                  placeholder="Ex: Audit Documentație, Ghiduri MVP, Securitate"
                  class="wf-form-input"
                />
              </div>
            </div>
          </div>

          <!-- CARD 2: Security & Auto-Progression Telemetry -->
          <div class="wf-modal-card">
            <div class="wf-modal-card-head">
              <div class="wf-modal-card-icon wf-modal-card-icon--blue">
                <Icon icon="lucide:shield-check" width="14" height="14" />
              </div>
              <div>
                <h4 class="wf-modal-card-title">Securitate &amp; Telemetrie Progres</h4>
                <p class="wf-modal-card-subtitle">Starea autentificării în 2 pași și statisticile automate de activitate.</p>
              </div>
            </div>

            <div class="wf-security-telemetry-grid">
              <!-- 2FA Box -->
              <div class="wf-telemetry-item-box">
                <div class="wf-telemetry-box-left">
                  <div class="wf-telemetry-box-icon" :class="selectedMember.totpEnabled ? 'text-emerald-400' : 'text-zinc-500'">
                    <Icon :icon="selectedMember.totpEnabled ? 'lucide:shield-check' : 'lucide:shield-off'" width="18" height="18" />
                  </div>
                  <div>
                    <div class="wf-telemetry-box-title">
                      2FA TOTP:
                      <span :class="selectedMember.totpEnabled ? 'text-emerald-400 font-bold' : 'text-zinc-400'">
                        {{ selectedMember.totpEnabled ? 'ACTIVAT' : 'DEZACTIVAT' }}
                      </span>
                    </div>
                    <div class="wf-telemetry-box-desc">
                      {{ selectedMember.totpEnabled ? 'Utilizatorul folosește aplicație TOTP (Google Auth, Aegis).' : 'Contul nu are 2FA activat în prezent.' }}
                    </div>
                  </div>
                </div>

                <button
                  v-if="selectedMember.totpEnabled && !selectedMember.isRoot"
                  type="button"
                  class="wf-btn-tactical wf-btn-tactical--ghost"
                  title="Resetează cheia 2FA pentru deblocare cont"
                  @click="handleReset2FA(selectedMember)"
                >
                  <Icon icon="lucide:key" width="12" height="12" />
                  <span>Resetează 2FA</span>
                </button>
              </div>

              <!-- Auto-Progression Box -->
              <div class="wf-telemetry-item-box">
                <div class="wf-telemetry-box-left">
                  <div class="wf-telemetry-box-icon text-cyan-400">
                    <Icon icon="lucide:sparkles" width="18" height="18" />
                  </div>
                  <div>
                    <div class="wf-telemetry-box-title text-cyan-300">
                      Progres &amp; Insigne Automate
                    </div>
                    <div class="wf-telemetry-box-desc">
                      Contorizate 100% automat în timp real prin Git și Docs Engine.
                    </div>
                  </div>
                </div>

                <div class="wf-telemetry-badges-cluster">
                  <span class="wf-metric-pill wf-metric-pill--emerald">
                    <Icon icon="lucide:book-open" width="10" height="10" />
                    {{ selectedMember.docsModifiedCount || 0 }} Ghiduri
                  </span>
                  <span class="wf-metric-pill wf-metric-pill--cyan">
                    <Icon icon="lucide:git-commit" width="10" height="10" />
                    Auto-Sync Git
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- CARD 3: Role Presets & 17 Granular Permissions -->
          <div class="wf-modal-card">
            <div class="wf-modal-card-head">
              <div class="wf-modal-card-icon wf-modal-card-icon--purple">
                <Icon icon="lucide:sliders" width="14" height="14" />
              </div>
              <div class="wf-modal-card-head-grow">
                <div class="wf-modal-card-head-between">
                  <h4 class="wf-modal-card-title">
                    {{ isRootAdmin && !selectedMember.isRoot ? 'Roluri & Matrice Permisiuni (17 Module)' : 'Permisiuni Active' }}
                  </h4>
                  <span class="wf-active-perms-badge">
                    {{ Object.values(isRootAdmin && !selectedMember.isRoot ? editPermissions : (selectedMember.permissions || {})).filter(Boolean).length }} / 17 Module Active
                  </span>
                </div>
                <p class="wf-modal-card-subtitle">
                  Configurează accesul granular pentru fiecare arie din sistemul de documentație.
                </p>
              </div>
            </div>

            <!-- Role Presets Selector -->
            <div v-if="isRootAdmin && !selectedMember.isRoot" class="wf-modal-role-presets">
              <div class="wf-role-presets-header">
                <span class="wf-role-presets-title">Șabloane Rapide de Rol:</span>
                <span class="wf-role-presets-hint">Alege un rol pentru a popula automat permisiunile asociate</span>
              </div>
              <div class="wf-role-presets-grid">
                <template v-for="(preset, key) in rolePresets" :key="key">
                  <button
                    v-if="key !== 'root_admin'"
                    type="button"
                    class="wf-role-preset-chip"
                    :class="{ 'wf-role-preset-chip--active': editRole === key }"
                    @click="handleRolePresetChange(String(key), false)"
                  >
                    <span class="wf-role-preset-chip-name">{{ preset.label }}</span>
                  </button>
                </template>
              </div>
            </div>

            <!-- Categorized Permission Groups (Core, Ops, Dangerous) -->
            <div class="wf-modal-perm-groups">
              <div
                v-for="group in PERMISSION_GROUPS"
                :key="group.title"
                class="wf-modal-perm-group-box"
              >
                <!-- Group Header -->
                <div class="wf-perm-group-header">
                  <div class="wf-perm-group-title-wrap">
                    <div
                      class="wf-perm-group-icon"
                      :style="{ backgroundColor: group.accent + '15', color: group.accent, borderColor: group.accent + '30' }"
                    >
                      <Icon :icon="group.icon" width="13" height="13" />
                    </div>
                    <div>
                      <span class="wf-perm-group-title">{{ group.title }}</span>
                      <span class="wf-perm-group-sub">{{ group.subtitle }}</span>
                    </div>
                  </div>

                  <div class="wf-perm-group-actions">
                    <span
                      class="wf-perm-group-count"
                      :style="{ backgroundColor: group.accent + '12', color: group.accent, borderColor: group.accent + '25' }"
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
                        class="wf-perm-action-mini-btn"
                        title="Activează toate din această categorie"
                        @click="handleCategorySelectAll(group.modules, true, false)"
                      >
                        Toate
                      </button>
                      <button
                        type="button"
                        class="wf-perm-action-mini-btn"
                        title="Dezactivează toate din această categorie"
                        @click="handleCategorySelectAll(group.modules, false, false)"
                      >
                        Niciuna
                      </button>
                    </template>
                  </div>
                </div>

                <!-- Group Modules Grid -->
                <div class="wf-perm-modules-grid">
                  <div
                    v-for="item in group.modules"
                    :key="item.key"
                    class="wf-perm-module-tile"
                    :class="
                      (isRootAdmin && !selectedMember.isRoot ? Boolean(editPermissions[item.key]) : Boolean(selectedMember.permissions?.[item.key]))
                        ? 'wf-perm-module-tile--active'
                        : 'wf-perm-module-tile--inactive'
                    "
                  >
                    <div class="wf-perm-tile-main">
                      <div
                        class="wf-perm-tile-icon"
                        :style="{
                          color: item.color,
                          backgroundColor: item.color + '15',
                          borderColor: item.color + '28',
                        }"
                      >
                        <Icon :icon="item.icon" width="14" height="14" />
                      </div>
                      <div class="wf-perm-tile-info">
                        <span class="wf-perm-tile-name">{{ item.name }}</span>
                        <span class="wf-perm-tile-desc" :title="item.desc">{{ item.desc }}</span>
                      </div>
                    </div>

                    <template v-if="isRootAdmin && !selectedMember.isRoot && !item.isRestricted">
                      <label class="wf-toggle-switch">
                        <input
                          v-model="editPermissions[item.key]"
                          type="checkbox"
                          @change="editRole = 'custom'"
                        />
                        <span class="wf-toggle-track" />
                      </label>
                    </template>
                    <template v-else>
                      <span
                        class="wf-perm-lock-badge"
                        :class="Boolean(selectedMember.permissions?.[item.key]) ? 'wf-perm-lock-badge--granted' : 'wf-perm-lock-badge--denied'"
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

        <!-- Modal Footer Actions -->
        <div class="wf-modal-foot">
          <button
            v-if="!selectedMember.isRoot && isRootAdmin"
            type="button"
            class="wf-modal-btn wf-modal-btn--danger"
            @click="handleDeleteMember(selectedMember.id, selectedMember.username)"
          >
            <Icon icon="lucide:trash-2" width="14" height="14" />
            <span>Șterge Membru</span>
          </button>
          <div v-else />

          <div class="wf-modal-foot-right">
            <button
              type="button"
              class="wf-modal-btn wf-modal-btn--ghost"
              @click="selectedMember = null"
            >
              Închide
            </button>

            <button
              v-if="isRootAdmin"
              type="button"
              :disabled="savingEdit"
              class="wf-modal-btn wf-modal-btn--primary"
              @click="handleSaveMember"
            >
              <Icon icon="lucide:save" width="14" height="14" :class="{ 'wf-rotate-spin': savingEdit }" />
              <span>{{ savingEdit ? 'Se salvează...' : 'Salvează Permisiunile' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- ADD NEW MEMBER MODAL (USER INVITE MODAL) -->
    <!-- ========================================================================= -->
    <div v-if="addModalOpen" class="wf-modal-backdrop" @click.self="addModalOpen = false">
      <div class="wf-modal-box wf-modal-box--add" role="dialog" aria-modal="true">
        <div class="wf-modal-beam" aria-hidden="true" />

        <div class="wf-modal-head">
          <div class="wf-modal-head-identity">
            <div class="wf-modal-card-icon wf-modal-card-icon--orange" style="width: 40px; height: 40px;">
              <Icon icon="lucide:user-plus" width="18" height="18" />
            </div>
            <div class="wf-modal-identity-meta">
              <div class="wf-team-breadcrumb-pill" style="margin-bottom: 2px;">
                <span>ACCESS CONTROL — CONT NOU</span>
              </div>
              <h3 class="wf-modal-title">Adaugă Administrator Nou</h3>
              <p class="wf-modal-sub-val">Configurează datele de conectare, rolul și permisiunile modulare.</p>
            </div>
          </div>

          <button
            type="button"
            class="wf-modal-close-btn"
            title="Închide"
            @click="addModalOpen = false"
          >
            <Icon icon="lucide:x" width="16" height="16" />
          </button>
        </div>

        <form @submit.prevent="handleCreateMember">
          <div class="wf-modal-body">
            <!-- Credentials section -->
            <div class="wf-modal-card">
              <div class="wf-modal-card-head">
                <div class="wf-modal-card-icon wf-modal-card-icon--orange">
                  <Icon icon="lucide:key-round" width="14" height="14" />
                </div>
                <div>
                  <h4 class="wf-modal-card-title">Credențiale &amp; Identitate</h4>
                  <p class="wf-modal-card-subtitle">Setează numele, contul de logare și parola inițială.</p>
                </div>
              </div>

              <div class="wf-modal-form-grid">
                <div class="wf-form-field">
                  <label class="wf-form-label">Username (Cont Logare)</label>
                  <input
                    v-model="newUsername"
                    type="text"
                    required
                    placeholder="Ex: alex_lead"
                    class="wf-form-input font-mono"
                  />
                </div>

                <div class="wf-form-field">
                  <label class="wf-form-label">Nume Afișat</label>
                  <input
                    v-model="newDisplayName"
                    type="text"
                    placeholder="Ex: Alex - Doc Lead"
                    class="wf-form-input"
                  />
                </div>

                <div class="wf-form-field">
                  <div class="wf-form-label-row">
                    <label class="wf-form-label">Parolă Inițială</label>
                    <button
                      type="button"
                      class="wf-form-action-btn"
                      title="Generează o parolă puternică aleatorie"
                      @click="handleGenerateNewPassword"
                    >
                      <Icon icon="lucide:sparkles" width="11" height="11" />
                      <span>Generează</span>
                    </button>
                  </div>
                  <div class="wf-form-input-wrap">
                    <input
                      v-model="newPassword"
                      :type="showNewPassword ? 'text' : 'password'"
                      required
                      placeholder="Parolă complexă..."
                      class="wf-form-input wf-form-input--has-action"
                      autocomplete="new-password"
                    />
                    <button
                      type="button"
                      class="wf-input-eye-btn"
                      :title="showNewPassword ? 'Ascunde parola' : 'Arată parola'"
                      @click="showNewPassword = !showNewPassword"
                    >
                      <Icon
                        :icon="showNewPassword ? 'lucide:eye-off' : 'lucide:eye'"
                        width="15"
                        height="15"
                        :class="{ 'text-amber-400': showNewPassword }"
                      />
                    </button>
                  </div>
                </div>

                <div class="wf-form-field">
                  <label class="wf-form-label">Email Oficial</label>
                  <input
                    v-model="newEmail"
                    type="email"
                    placeholder="alex@wildfire.ro"
                    class="wf-form-input"
                  />
                </div>

                <div class="wf-form-field">
                  <label class="wf-form-label">Tag / UserID Discord (Opțional)</label>
                  <input
                    v-model="newDiscord"
                    type="text"
                    placeholder="Ex: alex_wf sau 282937..."
                    class="wf-form-input font-mono"
                  />
                </div>

                <div class="wf-form-field">
                  <label class="wf-form-label">SteamID / Link Profil Steam (Opțional)</label>
                  <div class="wf-avatar-input-row">
                    <img
                      v-if="newSteamAvatarPreview"
                      :src="newSteamAvatarPreview"
                      alt="Steam Preview"
                      class="wf-avatar-preview-thumb"
                    />
                    <input
                      v-model="newSteamId"
                      type="text"
                      placeholder="Ex: 76561198... sau alex_steam"
                      class="wf-form-input font-mono text-xs"
                      style="flex: 1;"
                    />
                  </div>
                </div>

                <div class="wf-form-field wf-form-field--full">
                  <label class="wf-form-label">GitHub Username (Profil Contribuitor / Auto-Push)</label>
                  <input
                    v-model="newGithubUsername"
                    type="text"
                    placeholder="Ex: alex_dev (username pe GitHub)"
                    class="wf-form-input font-mono"
                  />
                </div>
              </div>
            </div>

            <!-- Role Preset -->
            <div class="wf-modal-card">
              <div class="wf-modal-card-head">
                <div class="wf-modal-card-icon wf-modal-card-icon--purple">
                  <Icon icon="lucide:wand-2" width="14" height="14" />
                </div>
                <div>
                  <h4 class="wf-modal-card-title">Rol &amp; Șablon Rapid de Permisiuni</h4>
                  <p class="wf-modal-card-subtitle">Selectează un rol predefinit pentru a aloca comutatoarele automat.</p>
                </div>
              </div>

              <div class="wf-role-presets-grid" style="grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));">
                <template v-for="(preset, key) in rolePresets" :key="key">
                  <button
                    v-if="key !== 'root_admin'"
                    type="button"
                    class="wf-role-preset-chip"
                    :class="{ 'wf-role-preset-chip--active': newRole === key }"
                    @click="handleRolePresetChange(String(key), true)"
                  >
                    <span class="wf-role-preset-chip-name">{{ preset.label }}</span>
                  </button>
                </template>
              </div>
            </div>

            <!-- Categorized Permissions Grid for New Member -->
            <div class="wf-modal-card">
              <div class="wf-modal-card-head">
                <div class="wf-modal-card-icon wf-modal-card-icon--cyan">
                  <Icon icon="lucide:sliders" width="14" height="14" />
                </div>
                <div class="wf-modal-card-head-grow">
                  <div class="wf-modal-card-head-between">
                    <h4 class="wf-modal-card-title">Comutatoare Permisiuni Inițiale</h4>
                    <span class="wf-active-perms-badge">
                      {{ Object.values(newPermissions || {}).filter(Boolean).length }} / 17 Active
                    </span>
                  </div>
                </div>
              </div>

              <div class="wf-modal-perm-groups">
                <div
                  v-for="group in PERMISSION_GROUPS"
                  :key="group.title"
                  class="wf-modal-perm-group-box"
                >
                  <div class="wf-perm-group-header">
                    <div class="wf-perm-group-title-wrap">
                      <div
                        class="wf-perm-group-icon"
                        :style="{ backgroundColor: group.accent + '15', color: group.accent, borderColor: group.accent + '30' }"
                      >
                        <Icon :icon="group.icon" width="13" height="13" />
                      </div>
                      <div>
                        <span class="wf-perm-group-title">{{ group.title }}</span>
                        <span class="wf-perm-group-sub">{{ group.subtitle }}</span>
                      </div>
                    </div>

                    <div class="wf-perm-group-actions">
                      <span
                        class="wf-perm-group-count"
                        :style="{ backgroundColor: group.accent + '12', color: group.accent, borderColor: group.accent + '25' }"
                      >
                        {{ group.modules.filter((m) => Boolean(newPermissions[m.key])).length }} / {{ group.modules.length }} Active
                      </span>

                      <template v-if="group.modules.some((m) => !m.isRestricted)">
                        <button
                          type="button"
                          class="wf-perm-action-mini-btn"
                          title="Activează toate din această categorie"
                          @click="handleCategorySelectAll(group.modules, true, true)"
                        >
                          Toate
                        </button>
                        <button
                          type="button"
                          class="wf-perm-action-mini-btn"
                          title="Dezactivează toate din această categorie"
                          @click="handleCategorySelectAll(group.modules, false, true)"
                        >
                          Niciuna
                        </button>
                      </template>
                    </div>
                  </div>

                  <div class="wf-perm-modules-grid">
                    <div
                      v-for="item in group.modules"
                      :key="item.key"
                      class="wf-perm-module-tile"
                      :class="Boolean(newPermissions[item.key]) ? 'wf-perm-module-tile--active' : 'wf-perm-module-tile--inactive'"
                    >
                      <div class="wf-perm-tile-main">
                        <div
                          class="wf-perm-tile-icon"
                          :style="{
                            color: item.color,
                            backgroundColor: item.color + '15',
                            borderColor: item.color + '28',
                          }"
                        >
                          <Icon :icon="item.icon" width="14" height="14" />
                        </div>
                        <div class="wf-perm-tile-info">
                          <span class="wf-perm-tile-name">{{ item.name }}</span>
                          <span class="wf-perm-tile-desc" :title="item.desc">{{ item.desc }}</span>
                        </div>
                      </div>

                      <template v-if="!item.isRestricted">
                        <label class="wf-toggle-switch">
                          <input
                            v-model="newPermissions[item.key]"
                            type="checkbox"
                            @change="newRole = 'custom'"
                          />
                          <span class="wf-toggle-track" />
                        </label>
                      </template>
                      <template v-else>
                        <span class="wf-perm-lock-badge wf-perm-lock-badge--denied">
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

          <div class="wf-modal-foot">
            <div />
            <div class="wf-modal-foot-right">
              <button
                type="button"
                class="wf-modal-btn wf-modal-btn--ghost"
                @click="addModalOpen = false"
              >
                Anulează
              </button>

              <button
                type="submit"
                :disabled="creating"
                class="wf-modal-btn wf-modal-btn--primary"
              >
                <Icon icon="lucide:plus" width="14" height="14" :class="{ 'wf-rotate-spin': creating }" />
                <span>{{ creating ? 'Se creează contul...' : 'Creează Administrator' }}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>

</template>

<style scoped>
/* =========================================================================
   SAAS CARBON SYSTEM - ADMIN TEAM & RBAC ACCESS CONTROL
   Zero-Trust RBAC | Linear / Clerk / Stripe Matte Aesthetic
   ========================================================================= */

.wf-team-stage {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem 1.75rem 4rem 1.75rem;
  color: #f1f5f9;
  font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
}

/* ── Top Header Panel ── */
.wf-team-header-panel {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 1.75rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.wf-team-header-content {
  flex: 1;
  min-width: 0;
}

.wf-team-badge-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.wf-team-breadcrumb-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 9px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #cbd5e1;
  text-transform: uppercase;
}

.wf-team-telemetry-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 9px;
  border-radius: 9999px;
  background: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.22);
  color: #4ade80;
  font-size: 0.68rem;
  font-weight: 600;
}

.wf-telemetry-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.6);
  display: inline-block;
  animation: wf-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes wf-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}

.wf-team-page-title {
  font-size: 1.65rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.025em;
  margin: 0 0 6px 0;
  line-height: 1.25;
}

.wf-team-page-desc {
  font-size: 0.85rem;
  color: #94a3b8;
  line-height: 1.45;
  margin: 0;
  max-width: 760px;
}

.wf-team-header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.wf-team-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 15px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
}

.wf-team-action-btn--primary {
  background: #f97316;
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.22);
}

.wf-team-action-btn--primary:hover {
  background: #ea580c;
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.wf-team-action-btn--primary:active {
  transform: translateY(0);
}

.wf-team-action-btn--secondary {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: #cbd5e1;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.wf-team-action-btn--secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  transform: translateY(-1px);
}

.wf-team-action-btn--secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.wf-rotate-spin {
  animation: wf-spin 1s linear infinite;
}

@keyframes wf-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ── Status Feedback Alert Box ── */
.wf-team-alert-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 0.82rem;
  margin-bottom: 1.25rem;
}

.wf-team-alert-box--success {
  background: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.28);
  color: #4ade80;
}

.wf-team-alert-box--danger {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.28);
  color: #f87171;
}

/* ── Metrics Grid (4 Tactical Carbon Cards) ── */
.wf-team-metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 1.5rem;
}

@media (max-width: 1024px) {
  .wf-team-metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .wf-team-metrics-grid {
    grid-template-columns: 1fr;
  }
}

.wf-metric-carbon-card {
  background: rgba(14, 18, 27, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.04);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wf-metric-carbon-card:hover {
  border-color: rgba(255, 255, 255, 0.13);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.wf-metric-carbon-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.wf-metric-carbon-label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #94a3b8;
  text-transform: uppercase;
}

.wf-metric-carbon-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.wf-metric-carbon-icon--orange {
  background: rgba(249, 115, 22, 0.12);
  color: #fb923c;
  border: 1px solid rgba(249, 115, 22, 0.25);
}

.wf-metric-carbon-icon--amber {
  background: rgba(245, 158, 11, 0.12);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.25);
}

.wf-metric-carbon-icon--blue {
  background: rgba(59, 130, 246, 0.12);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.25);
}

.wf-metric-carbon-icon--cyan {
  background: rgba(6, 182, 212, 0.12);
  color: #22d3ee;
  border: 1px solid rgba(6, 182, 212, 0.25);
}

.wf-metric-carbon-body {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.wf-metric-carbon-value {
  font-size: 1.45rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.wf-metric-pill {
  font-size: 0.62rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 9999px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.wf-metric-pill--emerald {
  background: rgba(34, 197, 94, 0.12);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.25);
}

.wf-metric-pill--amber {
  background: rgba(245, 158, 11, 0.12);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.25);
}

.wf-metric-pill--blue {
  background: rgba(59, 130, 246, 0.12);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.25);
}

.wf-metric-pill--cyan {
  background: rgba(6, 182, 212, 0.12);
  color: #22d3ee;
  border: 1px solid rgba(6, 182, 212, 0.25);
}

.wf-metric-carbon-sub {
  font-size: 0.72rem;
  color: #64748b;
  line-height: 1.3;
}

/* ── Main Navigation Tabs Bar ── */
.admin-db-tabs-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px;
  background: hsl(220 20% 7% / 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  margin-bottom: 1.25rem;
}

.admin-db-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 14px;
  border-radius: 8px;
  border: 1px solid transparent;
  font-size: 0.78rem;
  font-weight: 700;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.18s ease;
  white-space: nowrap;
  background: transparent;
}

.admin-db-tab-btn:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
}

.admin-db-tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 18px;
  padding: 0 6px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.08);
  font-size: 0.68rem;
  font-weight: 800;
  color: #cbd5e1;
  margin-left: 4px;
  font-family: var(--font-mono, monospace);
}

.admin-db-tab-btn--active-amber {
  background: rgba(245, 158, 11, 0.12) !important;
  border-color: rgba(245, 158, 11, 0.35) !important;
  color: #fbbf24 !important;
}

.admin-db-tab-btn--active-amber .admin-db-tab-badge {
  background: rgba(245, 158, 11, 0.22);
  color: #fbbf24;
}

.admin-db-tab-btn--active-cyan {
  background: rgba(6, 182, 212, 0.12) !important;
  border-color: rgba(6, 182, 212, 0.35) !important;
  color: #22d3ee !important;
}

.admin-db-tab-btn--active-cyan .admin-db-tab-badge {
  background: rgba(6, 182, 212, 0.22);
  color: #22d3ee;
}

.admin-db-tab-btn--active-emerald {
  background: rgba(16, 185, 129, 0.12) !important;
  border-color: rgba(16, 185, 129, 0.35) !important;
  color: #34d399 !important;
}

.admin-db-tab-btn--active-emerald .admin-db-tab-badge {
  background: rgba(16, 185, 129, 0.22);
  color: #34d399;
}

/* Light Theme support for tabs */
:global(html:not(.dark)) .admin-db-tabs-bar {
  background: #f1f5f9 !important;
  border-color: #cbd5e1 !important;
}

:global(html:not(.dark)) .admin-db-tab-btn {
  color: #475569 !important;
}

:global(html:not(.dark)) .admin-db-tab-btn:hover {
  background: #e2e8f0 !important;
  color: #0f172a !important;
}

:global(html:not(.dark)) .admin-db-tab-badge {
  background: #e2e8f0 !important;
  color: #334155 !important;
}

:global(html:not(.dark)) .admin-db-tab-btn--active-amber {
  background: #ffffff !important;
  color: #d97706 !important;
  border-color: rgba(217, 119, 6, 0.45) !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06) !important;
}

:global(html:not(.dark)) .admin-db-tab-btn--active-amber .admin-db-tab-badge {
  background: rgba(245, 158, 11, 0.18) !important;
  color: #b45309 !important;
}

:global(html:not(.dark)) .admin-db-tab-btn--active-cyan {
  background: #ffffff !important;
  color: #0891b2 !important;
  border-color: rgba(8, 145, 178, 0.45) !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06) !important;
}

:global(html:not(.dark)) .admin-db-tab-btn--active-cyan .admin-db-tab-badge {
  background: rgba(6, 182, 212, 0.18) !important;
  color: #0e7490 !important;
}

:global(html:not(.dark)) .admin-db-tab-btn--active-emerald {
  background: #ffffff !important;
  color: #059669 !important;
  border-color: rgba(5, 150, 105, 0.45) !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06) !important;
}

:global(html:not(.dark)) .admin-db-tab-btn--active-emerald .admin-db-tab-badge {
  background: rgba(16, 185, 129, 0.18) !important;
  color: #047857 !important;
}

/* ── GitHub Sync Panel (Reconciliation Preview in Tab 1) ── */
.wf-github-sync-panel {
  background: rgba(14, 18, 27, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 1.25rem;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.25);
}

.wf-github-sync-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.wf-github-sync-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.wf-github-sync-icon-box {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.wf-github-sync-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.wf-github-sync-title {
  font-size: 0.84rem;
  font-weight: 700;
  color: #ffffff;
}

.wf-perm-tag {
  font-size: 0.62rem;
  font-weight: 700;
  padding: 1.5px 6px;
  border-radius: 4px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.wf-perm-tag--emerald {
  background: rgba(34, 197, 94, 0.12);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.25);
}

.wf-github-sync-sub {
  font-size: 0.72rem;
  color: #64748b;
  display: block;
  margin-top: 2px;
}

.wf-github-sync-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.74rem;
  font-weight: 600;
  color: #94a3b8;
  padding: 5px 10px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  transition: all 0.15s ease;
  text-decoration: none;
}

.wf-github-sync-link:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.12);
}

.wf-github-sync-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 10px;
}

.wf-github-sync-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.15s ease;
}

.wf-github-sync-card:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.09);
}

.wf-gh-card-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.wf-github-sync-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.wf-gh-card-names {
  min-width: 0;
}

.wf-gh-card-login-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.wf-github-sync-username {
  font-size: 0.8rem;
  font-weight: 700;
  color: #f1f5f9;
}

.wf-gh-commit-count {
  font-size: 0.68rem;
  font-weight: 600;
}

.wf-gh-match-status {
  font-size: 0.68rem;
  margin-top: 1px;
}

.wf-gh-diff-stats {
  font-size: 0.68rem;
  font-family: var(--font-mono, monospace);
  font-weight: 600;
  text-align: right;
  flex-shrink: 0;
}

.wf-gh-matched-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #4ade80;
  font-size: 0.68rem;
  font-weight: 500;
}

.wf-gh-unmatched-pill {
  color: #f59e0b;
  font-size: 0.68rem;
  font-weight: 500;
}

/* ── Toolbar & Search ── */
.wf-team-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.wf-team-search-box {
  position: relative;
  flex: 1;
  max-width: 480px;
  min-width: 240px;
  display: flex;
  align-items: center;
}

.wf-team-search-icon {
  position: absolute;
  left: 12px;
  color: #64748b;
  pointer-events: none;
}

.wf-team-search-input {
  width: 100%;
  height: 38px;
  padding: 0 34px 0 36px;
  border-radius: 8px;
  background: rgba(14, 18, 27, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font-size: 0.82rem;
  transition: all 0.15s ease;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
}

.wf-team-search-input:focus {
  outline: none;
  border-color: rgba(249, 115, 22, 0.5);
  background: rgba(14, 18, 27, 0.95);
  box-shadow: 0 0 0 1px rgba(249, 115, 22, 0.3), inset 0 1px 2px rgba(0, 0, 0, 0.3);
}

.wf-team-search-input::placeholder {
  color: #64748b;
}

.wf-team-search-clear {
  position: absolute;
  right: 10px;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.07);
  border: none;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.wf-team-search-clear:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.14);
}

.wf-team-session-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 12px;
  border-radius: 8px;
  background: rgba(14, 18, 27, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.74rem;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25);
}

.wf-session-pill-label {
  color: #64748b;
}

.wf-session-pill-name {
  color: #f1f5f9;
  font-weight: 700;
}

.wf-session-pill-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 1.5px 6px;
  border-radius: 4px;
}

.wf-session-pill-badge--root {
  background: rgba(245, 158, 11, 0.12);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.25);
}

.wf-session-pill-badge--member {
  background: rgba(59, 130, 246, 0.12);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.25);
}

/* ── Filter Bars ── */
.wf-role-filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 10px;
  background: rgba(14, 18, 27, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.wf-role-pills-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.wf-filter-section-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: #64748b;
  margin-right: 2px;
}

.wf-filter-chip {
  padding: 3px 9px;
  border-radius: 6px;
  background: transparent;
  border: 1px solid transparent;
  color: #94a3b8;
  font-size: 0.74rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.wf-filter-chip:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.04);
}

.wf-filter-chip--active {
  background: rgba(249, 115, 22, 0.12) !important;
  color: #fb923c !important;
  border-color: rgba(249, 115, 22, 0.3) !important;
}

.wf-status-pills-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}

.wf-status-filter-chip {
  padding: 3px 9px;
  border-radius: 6px;
  background: transparent;
  border: 1px solid transparent;
  color: #94a3b8;
  font-size: 0.74rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.wf-status-filter-chip:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.04);
}

.wf-status-filter-chip--active {
  background: rgba(255, 255, 255, 0.08) !important;
  color: #ffffff !important;
  border-color: rgba(255, 255, 255, 0.14) !important;
}

/* ── Member Cards Grid ── */
.wf-team-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 16px;
}

.wf-team-empty-state {
  grid-column: 1 / -1;
  padding: 3rem 1rem;
  text-align: center;
  color: #64748b;
  background: rgba(14, 18, 27, 0.4);
  border: 1px dashed rgba(255, 255, 255, 0.08);
  border-radius: 14px;
}

.wf-member-card {
  position: relative;
  background: rgba(14, 18, 27, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.04);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.wf-member-card:hover {
  border-color: rgba(255, 255, 255, 0.16);
  transform: translateY(-2px);
  box-shadow: 0 8px 26px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.wf-member-card--selected {
  border-color: rgba(249, 115, 22, 0.45);
  box-shadow: 0 0 0 1px rgba(249, 115, 22, 0.3), 0 8px 26px rgba(0, 0, 0, 0.5);
}

.wf-member-card--frozen {
  border-color: rgba(56, 189, 248, 0.25);
}

.wf-card-top-beam {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%);
  pointer-events: none;
}

/* ── Member Card Header ── */
.wf-member-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.wf-member-avatar-wrap {
  position: relative;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
}

.wf-member-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: block;
}

.wf-member-avatar-fallback {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.95rem;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.wf-member-status-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #0e121b;
}

.wf-member-status-dot--active {
  background: #22c55e;
  box-shadow: 0 0 5px rgba(34, 197, 94, 0.6);
}

.wf-member-status-dot--frozen {
  background: #38bdf8;
  box-shadow: 0 0 5px rgba(56, 189, 248, 0.6);
}

.wf-member-status-dot--suspended {
  background: #f43f5e;
  box-shadow: 0 0 5px rgba(244, 63, 94, 0.6);
}

.wf-member-identity {
  flex: 1;
  min-width: 0;
}

.wf-member-name-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.wf-member-name {
  font-size: 0.92rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  line-height: 1.25;
}

.wf-badge-root {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 1px 5px;
  border-radius: 4px;
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.35);
  color: #fbbf24;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.wf-badge-2fa {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 1px 5px;
  border-radius: 4px;
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.35);
  color: #60a5fa;
  font-size: 0.62rem;
  font-weight: 700;
}

.wf-member-handle-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
}

.wf-member-handle {
  font-size: 0.74rem;
  font-family: var(--font-mono, monospace);
  color: #64748b;
}

.wf-member-custom-title {
  font-size: 0.72rem;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wf-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2.5px 8px;
  border-radius: 9999px;
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  flex-shrink: 0;
}

.wf-status-pill--active {
  background: rgba(34, 197, 94, 0.1);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.25);
}

.wf-status-pill--frozen {
  background: rgba(56, 189, 248, 0.1);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.25);
}

.wf-status-pill--suspended {
  background: rgba(244, 63, 94, 0.1);
  color: #f43f5e;
  border: 1px solid rgba(244, 63, 94, 0.25);
}

.wf-status-pip {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}

/* ── Member Card Body ── */
.wf-member-card-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wf-member-meta-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.wf-member-role-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 7px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: #cbd5e1;
  font-size: 0.68rem;
  font-weight: 700;
}

.wf-member-email-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 7px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #94a3b8;
  font-size: 0.68rem;
  font-family: var(--font-mono, monospace);
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wf-member-perms-flow {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  min-height: 28px;
}

.wf-perm-chip {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.64rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #94a3b8;
}

.wf-perm-chip--studio { color: #34d399; background: rgba(52, 211, 153, 0.08); border-color: rgba(52, 211, 153, 0.2); }
.wf-perm-chip--delete { color: #f87171; background: rgba(248, 113, 113, 0.08); border-color: rgba(248, 113, 113, 0.2); }
.wf-perm-chip--health { color: #38bdf8; background: rgba(56, 189, 248, 0.08); border-color: rgba(56, 189, 248, 0.2); }
.wf-perm-chip--media { color: #a78bfa; background: rgba(167, 139, 250, 0.08); border-color: rgba(167, 139, 250, 0.2); }
.wf-perm-chip--tasks { color: #fbbf24; background: rgba(251, 191, 36, 0.08); border-color: rgba(251, 191, 36, 0.2); }
.wf-perm-chip--telemetry { color: #38bdf8; background: rgba(56, 189, 248, 0.08); border-color: rgba(56, 189, 248, 0.2); }
.wf-perm-chip--ai { color: #818cf8; background: rgba(129, 140, 248, 0.08); border-color: rgba(129, 140, 248, 0.2); }
.wf-perm-chip--db { color: #fb923c; background: rgba(251, 146, 60, 0.08); border-color: rgba(251, 146, 60, 0.2); }
.wf-perm-chip--audit { color: #a3e635; background: rgba(163, 230, 53, 0.08); border-color: rgba(163, 230, 53, 0.2); }
.wf-perm-chip--security { color: #38bdf8; background: rgba(56, 189, 248, 0.08); border-color: rgba(56, 189, 248, 0.2); }
.wf-perm-chip--api { color: #c084fc; background: rgba(192, 132, 252, 0.08); border-color: rgba(192, 132, 252, 0.2); }
.wf-perm-chip--snapshots { color: #2dd4bf; background: rgba(45, 212, 191, 0.08); border-color: rgba(45, 212, 191, 0.2); }
.wf-perm-chip--webhooks { color: #f472b6; background: rgba(244, 114, 182, 0.08); border-color: rgba(244, 114, 182, 0.2); }
.wf-perm-chip--bot { color: #818cf8; background: rgba(129, 140, 248, 0.08); border-color: rgba(129, 140, 248, 0.2); }
.wf-perm-chip--settings { color: #94a3b8; background: rgba(148, 163, 184, 0.08); border-color: rgba(148, 163, 184, 0.2); }
.wf-perm-chip--team { color: #f87171; background: rgba(248, 113, 113, 0.1); border-color: rgba(248, 113, 113, 0.25); }
.wf-perm-chip--panic { color: #ef4444; background: rgba(239, 68, 68, 0.12); border-color: rgba(239, 68, 68, 0.3); }

/* ── Member Card Footer ── */
.wf-member-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.wf-member-telemetry-box {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.wf-member-perms-count {
  font-size: 0.7rem;
  font-weight: 700;
  color: #e2e8f0;
}

.wf-member-git-stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.68rem;
  color: #64748b;
  font-family: var(--font-mono, monospace);
}

.wf-member-actions-cluster {
  display: flex;
  align-items: center;
  gap: 6px;
}

.wf-btn-tactical {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 9px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  text-decoration: none;
}

.wf-btn-tactical--ghost {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #94a3b8;
  padding: 4px 6px;
}

.wf-btn-tactical--ghost:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.15);
}

.wf-btn-tactical--inspector {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.wf-btn-tactical--inspector:hover {
  background: rgba(249, 115, 22, 0.15);
  border-color: rgba(249, 115, 22, 0.35);
  color: #fb923c;
}

.wf-btn-tactical--unfreeze {
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.3);
  color: #38bdf8;
}

.wf-btn-tactical--unfreeze:hover:not(:disabled) {
  background: rgba(56, 189, 248, 0.2);
  border-color: rgba(56, 189, 248, 0.45);
}

/* ── Modal Overlays & Containers ── */
.admin-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(4, 7, 13, 0.78);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  overflow-y: auto;
}

.admin-modal-container {
  width: 100%;
  max-width: 680px;
  background: #0d121c;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow: hidden;
}

.admin-modal-container--large {
  max-width: 900px;
}

.admin-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(14, 18, 27, 0.85);
  flex-shrink: 0;
}

.admin-modal-pretitle {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #f97316;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.admin-modal-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  line-height: 1.25;
}

.admin-modal-subtitle {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 2px 0 0 0;
}

.admin-modal-close-btn {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.admin-modal-close-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

.admin-member-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.95rem;
  color: #ffffff;
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  flex-shrink: 0;
}

.admin-member-role-badge {
  font-size: 0.64rem;
  font-weight: 700;
  padding: 1.5px 7px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
}

.admin-modal-body {
  padding: 18px 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.admin-modal-glass-section {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 16px;
}

.admin-modal-section-label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.admin-modal-form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px 14px;
}

@media (max-width: 600px) {
  .admin-modal-form-grid {
    grid-template-columns: 1fr;
  }
}

.admin-form-group {
  display: flex;
  flex-direction: column;
}

.admin-form-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #cbd5e1;
  margin-bottom: 5px;
}

.admin-form-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
}

.admin-form-input {
  width: 100%;
  height: 36px;
  padding: 0 11px;
  border-radius: 7px;
  background: rgba(14, 18, 27, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-size: 0.8rem;
  transition: all 0.15s ease;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.35);
}

.admin-form-input:focus {
  outline: none;
  border-color: rgba(249, 115, 22, 0.5);
  box-shadow: 0 0 0 1px rgba(249, 115, 22, 0.3), inset 0 1px 2px rgba(0, 0, 0, 0.35);
}

.admin-form-input:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.admin-pwd-action-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(249, 115, 22, 0.08);
  border: 1px solid rgba(249, 115, 22, 0.25);
  border-radius: 5px;
  color: #fb923c;
  font-size: 0.68rem;
  font-weight: 700;
  cursor: pointer;
  padding: 2px 7px;
  transition: all 0.15s ease;
}

.admin-pwd-action-link:hover {
  background: rgba(249, 115, 22, 0.2);
  border-color: rgba(249, 115, 22, 0.4);
  color: #fdba74;
}

.admin-password-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.admin-form-input--has-toggle {
  padding-right: 38px !important;
}

.admin-password-toggle-btn {
  position: absolute;
  right: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 5px;
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.15s ease;
}

.admin-password-toggle-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
}

/* ── Role Preset Picker Grid ── */
.admin-role-picker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(135px, 1fr));
  gap: 8px;
}

.admin-role-preset-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 8px 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.07);
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
}

.admin-role-preset-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.14);
}

.admin-role-preset-btn--active {
  background: rgba(249, 115, 22, 0.1) !important;
  border-color: rgba(249, 115, 22, 0.35) !important;
}

.admin-role-preset-name {
  font-size: 0.74rem;
  font-weight: 700;
  color: #ffffff;
}

.admin-role-preset-desc {
  font-size: 0.65rem;
  color: #64748b;
  margin-top: 2px;
}

/* ── Permissions Section & Groups Stack ── */
.admin-perms-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.admin-perms-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.admin-perms-header-title {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #94a3b8;
  text-transform: uppercase;
}

.admin-perms-header-count {
  font-size: 0.72rem;
  font-weight: 700;
  color: #4ade80;
}

.admin-perms-categories-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.admin-perm-category-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 12px 14px;
}

.admin-perm-cat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.admin-perm-cat-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.admin-perm-cat-badge-icon {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.admin-perm-cat-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: #ffffff;
}

.admin-perm-cat-sub {
  font-size: 0.68rem;
  color: #64748b;
}

.admin-perm-cat-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.admin-perm-cat-btn {
  padding: 2px 7px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: #cbd5e1;
  font-size: 0.65rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.admin-perm-cat-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.admin-perms-compact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 6px;
}

.admin-perm-compact-tile {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 9px;
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.15s ease;
}

.admin-perm-compact-tile--active {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.09);
}

.admin-perm-compact-icon {
  width: 22px;
  height: 22px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid transparent;
}

.admin-perm-tile-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.admin-perm-compact-name {
  font-size: 0.72rem;
  font-weight: 700;
  color: #f1f5f9;
}

.admin-perm-tile-desc {
  font-size: 0.64rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
}

/* ── Toggle Switch (Sleek SaaS Carbon Switch) ── */
.admin-toggle-switch {
  position: relative;
  display: inline-block;
  width: 32px;
  height: 18px;
  flex-shrink: 0;
  cursor: pointer;
}

.admin-toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.admin-toggle-slider {
  position: absolute;
  inset: 0;
  background-color: rgba(255, 255, 255, 0.12);
  border-radius: 9999px;
  transition: 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.admin-toggle-slider:before {
  position: absolute;
  content: "";
  height: 12px;
  width: 12px;
  left: 2px;
  bottom: 2px;
  background-color: #cbd5e1;
  border-radius: 50%;
  transition: 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
}

.admin-toggle-switch input:checked + .admin-toggle-slider {
  background-color: #f97316;
  border-color: rgba(255, 255, 255, 0.2);
}

.admin-toggle-switch input:checked + .admin-toggle-slider:before {
  transform: translateX(14px);
  background-color: #ffffff;
}

.admin-perm-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.6rem;
  font-weight: 700;
  padding: 1.5px 5px;
  border-radius: 4px;
}

.admin-perm-status-pill--granted {
  background: rgba(34, 197, 94, 0.12);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.25);
}

.admin-perm-status-pill--denied {
  background: rgba(255, 255, 255, 0.05);
  color: #64748b;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* ── Modal Footer ── */
.admin-modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(14, 18, 27, 0.85);
  flex-shrink: 0;
}

.admin-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 7px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.admin-btn--primary {
  background: #f97316;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.admin-btn--primary:hover:not(:disabled) {
  background: #ea580c;
  transform: translateY(-1px);
}

.admin-btn--primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.admin-btn--secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: #cbd5e1;
}

.admin-btn--secondary:hover {
  background: rgba(255, 255, 255, 0.09);
  color: #ffffff;
}

.admin-btn--danger {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
}

.admin-btn--danger:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.45);
}

/* ── Matrix Tab Table Styling ── */
.wf-matrix-tab,
.admin-matrix-tab {
  margin-top: 0;
}

.wf-matrix-table-wrap,
.admin-matrix-table-wrap {
  overflow-x: auto;
  background: #0b0f19;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.wf-matrix-table,
.admin-matrix-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.74rem;
  text-align: center;
}

.wf-matrix-table th,
.wf-matrix-table td,
.admin-matrix-table th,
.admin-matrix-table td {
  padding: 10px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  white-space: nowrap;
}

.wf-matrix-table tbody tr,
.admin-matrix-table tbody tr {
  transition: background 0.15s ease;
}

.wf-matrix-table tbody tr:hover,
.admin-matrix-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.035);
}

.wf-matrix-member-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
}

.cat-header {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 6px 8px;
}

.cat-header--core {
  background: rgba(34, 197, 94, 0.08);
  color: #4ade80;
  border-left: 2px solid #22c55e;
}

.cat-header--ops {
  background: rgba(59, 130, 246, 0.08);
  color: #60a5fa;
  border-left: 2px solid #3b82f6;
}

.cat-header--dangerous {
  background: rgba(239, 68, 68, 0.08);
  color: #f87171;
  border-left: 2px solid #ef4444;
}

.sub-headers th {
  font-size: 0.64rem;
  color: #64748b;
  font-weight: 600;
  padding: 4px;
}

.cell-grant {
  color: #4ade80;
  background: rgba(34, 197, 94, 0.04);
}

.cell-deny {
  color: rgba(255, 255, 255, 0.15);
}

.cell-root {
  color: #f87171;
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
  color: #ffffff;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.admin-member-inspect-btn {
  font-size: 0.68rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: #cbd5e1;
  cursor: pointer;
  transition: all 0.15s ease;
}

.admin-member-inspect-btn:hover {
  background: rgba(249, 115, 22, 0.15);
  border-color: rgba(249, 115, 22, 0.35);
  color: #fb923c;
}


/* =========================================================================
   WF-MODAL SYSTEM — ADVANCED SAAS CARBON MODALS & RBAC INSPECTOR
   ========================================================================= */

.wf-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(3, 6, 12, 0.82);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  overflow-y: auto;
}

.wf-modal-box {
  position: relative;
  width: 100%;
  max-width: 860px;
  max-height: 90vh;
  background: #0b0f19;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.wf-modal-box--add {
  max-width: 720px;
}

.wf-modal-beam {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(249, 115, 22, 0.6) 50%, transparent 100%);
  pointer-events: none;
  z-index: 2;
}

/* ── Modal Header ── */
.wf-modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 22px;
  background: rgba(14, 18, 28, 0.85);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

.wf-modal-head-identity {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.wf-modal-avatar-frame {
  position: relative;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 2px solid #f97316;
  padding: 1.5px;
  background: #090d16;
  flex-shrink: 0;
}

.wf-modal-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.wf-modal-avatar-fallback {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.1rem;
  color: #ffffff;
}

.wf-modal-avatar-pip {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #0b0f19;
}

.wf-modal-avatar-pip--active {
  background: #22c55e;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.7);
}

.wf-modal-avatar-pip--frozen {
  background: #38bdf8;
  box-shadow: 0 0 6px rgba(56, 189, 248, 0.7);
}

.wf-modal-avatar-pip--suspended {
  background: #f43f5e;
  box-shadow: 0 0 6px rgba(244, 63, 94, 0.7);
}

.wf-modal-identity-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.wf-modal-identity-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.wf-modal-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.015em;
}

.wf-modal-role-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
  font-size: 0.68rem;
  font-weight: 700;
}

.wf-modal-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
}

.wf-modal-status-pill--active {
  background: rgba(34, 197, 94, 0.12);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.28);
}

.wf-modal-status-pill--frozen {
  background: rgba(56, 189, 248, 0.12);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.28);
}

.wf-modal-status-pill--suspended {
  background: rgba(244, 63, 94, 0.12);
  color: #f43f5e;
  border: 1px solid rgba(244, 63, 94, 0.28);
}

.wf-modal-2fa-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 9999px;
  background: rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.28);
  color: #60a5fa;
  font-size: 0.65rem;
  font-weight: 700;
}

.wf-modal-root-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 9999px;
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.35);
  color: #fbbf24;
  font-size: 0.65rem;
  font-weight: 800;
}

.wf-modal-sub-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.74rem;
  color: #64748b;
  font-family: var(--font-mono, monospace);
  flex-wrap: wrap;
}

.wf-modal-handle {
  color: #94a3b8;
  font-weight: 600;
}

.wf-modal-sub-sep {
  color: #475569;
}

.wf-modal-sub-val {
  color: #94a3b8;
}

.wf-modal-close-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.wf-modal-close-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

/* ── Modal Body & Cards ── */
.wf-modal-body {
  flex: 1;
  padding: 20px 22px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.wf-modal-card {
  background: rgba(14, 18, 28, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

.wf-modal-card-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.wf-modal-card-head-grow {
  flex: 1;
  min-width: 0;
}

.wf-modal-card-head-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.wf-modal-card-icon {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.wf-modal-card-icon--orange {
  background: rgba(249, 115, 22, 0.12);
  color: #fb923c;
  border: 1px solid rgba(249, 115, 22, 0.25);
}

.wf-modal-card-icon--blue {
  background: rgba(59, 130, 246, 0.12);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.25);
}

.wf-modal-card-icon--purple {
  background: rgba(168, 85, 247, 0.12);
  color: #c084fc;
  border: 1px solid rgba(168, 85, 247, 0.25);
}

.wf-modal-card-icon--cyan {
  background: rgba(6, 182, 212, 0.12);
  color: #22d3ee;
  border: 1px solid rgba(6, 182, 212, 0.25);
}

.wf-modal-card-title {
  font-size: 0.84rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.25;
}

.wf-modal-card-subtitle {
  font-size: 0.72rem;
  color: #64748b;
  margin: 2px 0 0 0;
}

.wf-active-perms-badge {
  font-size: 0.68rem;
  font-weight: 700;
  color: #4ade80;
  background: rgba(34, 197, 94, 0.1);
  padding: 2px 7px;
  border-radius: 4px;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

/* ── Freeze Alert Banner ── */
.wf-modal-freeze-banner {
  padding: 12px 14px;
  background: rgba(14, 165, 233, 0.08);
  border: 1px solid rgba(14, 165, 233, 0.28);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;
}

.wf-modal-freeze-left {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.wf-modal-freeze-icon {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: rgba(14, 165, 233, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #38bdf8;
  flex-shrink: 0;
  margin-top: 2px;
}

.wf-modal-freeze-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: #38bdf8;
  margin-bottom: 2px;
}

.wf-modal-freeze-text {
  font-size: 0.72rem;
  color: #94a3b8;
  line-height: 1.4;
}

/* ── Form Inputs Grid ── */
.wf-modal-form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px 14px;
}

@media (max-width: 640px) {
  .wf-modal-form-grid {
    grid-template-columns: 1fr;
  }
}

.wf-form-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.wf-form-field--full {
  grid-column: 1 / -1;
}

.wf-form-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: #cbd5e1;
}

.wf-form-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.wf-form-label-hint {
  font-size: 0.68rem;
  font-weight: 600;
  color: #60a5fa;
}

.wf-form-input,
.wf-form-select {
  width: 100%;
  height: 36px;
  padding: 0 11px;
  border-radius: 7px;
  background: rgba(9, 12, 19, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: #ffffff;
  font-size: 0.8rem;
  transition: all 0.15s ease;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.35);
}

.wf-form-input:focus,
.wf-form-select:focus {
  outline: none;
  border-color: rgba(249, 115, 22, 0.5);
  box-shadow: 0 0 0 1px rgba(249, 115, 22, 0.3), inset 0 1px 2px rgba(0, 0, 0, 0.35);
}

.wf-form-input:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.wf-form-input-wrap {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.wf-form-input--has-action {
  padding-right: 36px !important;
}

.wf-input-eye-btn {
  position: absolute;
  right: 7px;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.15s ease;
}

.wf-input-eye-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
}

.wf-form-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 7px;
  border-radius: 4px;
  background: rgba(249, 115, 22, 0.1);
  border: 1px solid rgba(249, 115, 22, 0.28);
  color: #fb923c;
  font-size: 0.68rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}

.wf-form-action-btn:hover {
  background: rgba(249, 115, 22, 0.22);
  color: #fdba74;
}

.wf-avatar-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.wf-avatar-preview-thumb {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

/* ── Security & Telemetry Grid ── */
.wf-security-telemetry-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

@media (max-width: 640px) {
  .wf-security-telemetry-grid {
    grid-template-columns: 1fr;
  }
}

.wf-telemetry-item-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.wf-telemetry-box-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.wf-telemetry-box-icon {
  flex-shrink: 0;
}

.wf-telemetry-box-title {
  font-size: 0.76rem;
  font-weight: 700;
  color: #ffffff;
}

.wf-telemetry-box-desc {
  font-size: 0.68rem;
  color: #64748b;
  margin-top: 1px;
}

.wf-telemetry-badges-cluster {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

/* ── Role Presets Selector ── */
.wf-modal-role-presets {
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.wf-role-presets-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.wf-role-presets-title {
  font-size: 0.72rem;
  font-weight: 700;
  color: #cbd5e1;
}

.wf-role-presets-hint {
  font-size: 0.68rem;
  color: #64748b;
}

.wf-role-presets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(115px, 1fr));
  gap: 6px;
}

.wf-role-preset-chip {
  padding: 6px 10px;
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  color: #cbd5e1;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  transition: all 0.15s ease;
}

.wf-role-preset-chip:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

.wf-role-preset-chip--active {
  background: rgba(249, 115, 22, 0.12) !important;
  border-color: rgba(249, 115, 22, 0.35) !important;
  color: #fb923c !important;
}

/* ── Permission Groups Stack ── */
.wf-modal-perm-groups {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.wf-modal-perm-group-box {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 12px;
}

.wf-perm-group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.wf-perm-group-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.wf-perm-group-icon {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid;
}

.wf-perm-group-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: #ffffff;
  display: block;
}

.wf-perm-group-sub {
  font-size: 0.68rem;
  color: #64748b;
  display: block;
}

.wf-perm-group-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.wf-perm-group-count {
  font-size: 0.64rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
  border: 1px solid;
}

.wf-perm-action-mini-btn {
  padding: 2px 7px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
  font-size: 0.64rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.wf-perm-action-mini-btn:hover {
  background: rgba(255, 255, 255, 0.09);
  color: #ffffff;
}

.wf-perm-modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 6px;
}

.wf-perm-module-tile {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 9px;
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.15s ease;
}

.wf-perm-module-tile--active {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.09);
}

.wf-perm-tile-main {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
}

.wf-perm-tile-icon {
  width: 22px;
  height: 22px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid;
}

.wf-perm-tile-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.wf-perm-tile-name {
  font-size: 0.72rem;
  font-weight: 700;
  color: #f1f5f9;
}

.wf-perm-tile-desc {
  font-size: 0.64rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 135px;
}

/* ── Toggle Switch (Sleek SaaS Carbon Switch) ── */
.wf-toggle-switch {
  position: relative;
  display: inline-block;
  width: 32px;
  height: 18px;
  flex-shrink: 0;
  cursor: pointer;
}

.wf-toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.wf-toggle-track {
  position: absolute;
  inset: 0;
  background-color: rgba(255, 255, 255, 0.12);
  border-radius: 9999px;
  transition: 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.wf-toggle-track:before {
  position: absolute;
  content: "";
  height: 12px;
  width: 12px;
  left: 2px;
  bottom: 2px;
  background-color: #cbd5e1;
  border-radius: 50%;
  transition: 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
}

.wf-toggle-switch input:checked + .wf-toggle-track {
  background-color: #f97316;
  border-color: rgba(255, 255, 255, 0.2);
}

.wf-toggle-switch input:checked + .wf-toggle-track:before {
  transform: translateX(14px);
  background-color: #ffffff;
}

.wf-perm-lock-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.6rem;
  font-weight: 700;
  padding: 1.5px 5px;
  border-radius: 4px;
}

.wf-perm-lock-badge--granted {
  background: rgba(34, 197, 94, 0.12);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.25);
}

.wf-perm-lock-badge--denied {
  background: rgba(255, 255, 255, 0.05);
  color: #64748b;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* ── Modal Footer ── */
.wf-modal-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 22px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(11, 15, 25, 0.95);
  flex-shrink: 0;
}

.wf-modal-foot-right {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

.wf-modal-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 15px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.wf-modal-btn--primary {
  background: #f97316;
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.22);
}

.wf-modal-btn--primary:hover:not(:disabled) {
  background: #ea580c;
  transform: translateY(-1px);
}

.wf-modal-btn--primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.wf-modal-btn--ghost {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
}

.wf-modal-btn--ghost:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.wf-modal-btn--danger {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.28);
  color: #f87171;
}

.wf-modal-btn--danger:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.45);
}

</style>
