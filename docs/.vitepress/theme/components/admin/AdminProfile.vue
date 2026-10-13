<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { Icon } from '@iconify/vue';

/* ── Types ──────────────────────────────────────────────────────────── */
export interface TeamMemberPermissions {
  canEditDocs?: boolean;
  canDeleteDocs?: boolean;
  canManageHealth?: boolean;
  canManageMedia?: boolean;
  canManageTasks?: boolean;
  canViewAnalytics?: boolean;
  canViewAiStats?: boolean;
  canManageDb?: boolean;
  canViewAudit?: boolean;
  canManageSecurity?: boolean;
  canManageApiKeys?: boolean;
  canManageSnapshots?: boolean;
  canManageWebhooks?: boolean;
  canManageSettings?: boolean;
  canManageDiscordBot?: boolean;
  canManageTeam?: boolean;
  canTriggerPanic?: boolean;
}

export interface TeamMember {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  role: 'root_admin' | 'doc_lead' | 'content_editor' | 'moderator' | 'viewer' | 'security_auditor' | 'custom' | string;
  customTitle?: string;
  avatarUrl?: string;
  avatarColor?: string;
  bio?: string;
  discord?: string;
  steamId?: string;
  githubUsername?: string;
  status: 'active' | 'suspended';
  isRoot: boolean;
  createdAt?: string;
  lastLoginAt?: string;
  totpEnabled?: boolean;
  permissions?: TeamMemberPermissions;
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
  title: string;
  subtitle: string;
  icon: string;
  accent: string;
  modules: PermissionModuleItem[];
}

const PERMISSION_GROUPS: PermissionCategoryGroup[] = [
  {
    title: 'Conținut, Workspace & Documentație',
    subtitle: 'Module de redactare ghiduri, verificare integritate, fișiere media și task-uri',
    icon: 'lucide:file-text',
    accent: '#10b981',
    modules: [
      { key: 'canEditDocs', name: 'Content Studio', desc: 'Redactare și publicare ghiduri Markdown & MDX', icon: 'lucide:file-edit', color: '#10b981' },
      { key: 'canDeleteDocs', name: 'Ștergere Documente', desc: 'Permisiune de ștergere definitivă a fișierelor', icon: 'lucide:trash-2', color: '#f43f5e' },
      { key: 'canManageHealth', name: 'Doc Health & Linter', desc: 'Scanare automată a link-urilor și conformității', icon: 'lucide:activity', color: '#06b6d4' },
      { key: 'canManageMedia', name: 'Media Vault', desc: 'Upload și administrare galerie de imagini și video', icon: 'lucide:folder', color: '#3b82f6' },
      { key: 'canManageTasks', name: 'Task Hub & TODO', desc: 'Creare, asignare și bifare sarcini în echipă', icon: 'lucide:list-todo', color: '#8b5cf6' },
    ],
  },
  {
    title: 'Telemetrie, AI & Baze de Date',
    subtitle: 'Statistici căutare, telemetrie motor AI, metrici și registru de audit',
    icon: 'lucide:search',
    accent: '#a855f7',
    modules: [
      { key: 'canViewAnalytics', name: 'Search Telemetry', desc: 'Analiză termeni căutați, trends și cuvinte cheie', icon: 'lucide:search', color: '#a855f7' },
      { key: 'canViewAiStats', name: 'AI Engine Telemetry', desc: 'Consum tokeni, latență răspuns și incidente AI', icon: 'lucide:cpu', color: '#ec4899' },
      { key: 'canManageDb', name: 'Database & Metrics', desc: 'Monitorizare stocare și sincronizare Supabase', icon: 'lucide:database', color: '#06b6d4' },
      { key: 'canViewAudit', name: 'Audit Ledger', desc: 'Registru criptografic SHA-256 al tuturor acțiunilor', icon: 'lucide:scroll-text', color: '#f59e0b' },
    ],
  },
  {
    title: 'Securitate, API & Infrastructură',
    subtitle: 'Autentificare 2FA, tokeni REST, backup-uri și setări globale',
    icon: 'lucide:shield-check',
    accent: '#3b82f6',
    modules: [
      { key: 'canManageSecurity', name: 'Securitate 2FA', desc: 'Configurare TOTP și revocare forțată sesiuni', icon: 'lucide:shield-check', color: '#3b82f6' },
      { key: 'canManageApiKeys', name: 'API Tokens', desc: 'Generare și revocare chei de acces REST securizate', icon: 'lucide:key', color: '#6366f1' },
      { key: 'canManageSnapshots', name: 'Snapshot Vault', desc: 'Creare backup-uri și restaurare bundle complet', icon: 'lucide:archive', color: '#10b981' },
      { key: 'canManageWebhooks', name: 'Discord Webhooks', desc: 'Fluxuri de notificare automată pe Discord', icon: 'lucide:webhook', color: '#f97316' },
      { key: 'canManageSettings', name: 'Engine Settings', desc: 'Mod mentenanță, titluri, bannere & configurări', icon: 'lucide:sliders', color: '#ff6b00' },
    ],
  },
  {
    title: 'Discord Bot Suite',
    subtitle: 'Integrare bot Discord, monitorizare tickete, staff și log-uri',
    icon: 'lucide:bot',
    accent: '#5865F2',
    modules: [
      { key: 'canManageDiscordBot', name: 'Discord Bot Suite', desc: 'Control centralizat tickete, moderare și roluri', icon: 'lucide:bot', color: '#5865F2' },
    ],
  },
  {
    title: 'Comenzi Restricționate Super Admin',
    subtitle: 'Privilegii de nivel înalt cu imunitate completă și izolare de securitate',
    icon: 'lucide:shield-alert',
    accent: '#ef4444',
    modules: [
      { key: 'canManageTeam', name: 'Gestiune Echipă & Roluri', desc: 'Adăugare, editare și revocare permisiuni administratori', icon: 'lucide:users', color: '#f59e0b', isRestricted: true },
      { key: 'canTriggerPanic', name: 'Panic Lockdown', desc: 'Blocare instantanee a platformei în caz de incident critic', icon: 'lucide:shield-alert', color: '#ef4444', isRestricted: true },
    ],
  },
];

const props = defineProps<{
  user?: any;
}>();

/* ── State ──────────────────────────────────────────────────────────── */
const loading = ref<boolean>(true);
const saving = ref<boolean>(false);
const profile = ref<Partial<TeamMember> | null>(null);
const statusMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null);
const activeTab = ref<'identity' | 'integrations' | 'security' | 'permissions'>('identity');

const formData = ref({
  displayName: '',
  email: '',
  bio: '',
  avatarUrl: '',
  discord: '',
  steamId: '',
  githubUsername: '',
  password: '',
  confirmPassword: '',
});

const showProfilePassword = ref(false);
const showConfirmPassword = ref(false);

// Steam resolver state
const resolvingSteam = ref<boolean>(false);
const steamMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null);

// 2FA modal state
const show2FAModal = ref<boolean>(false);
const qrCodeData = ref<string | null>(null);
const totpSecret = ref<string | null>(null);
const otpDigits = ref<string[]>(['', '', '', '', '', '']);
const digitInputs = ref<HTMLInputElement[]>([]);
const twoFAActionLoading = ref<boolean>(false);
const copiedSecret = ref<boolean>(false);
const rbacFilter = ref<'all' | 'granted' | 'restricted'>('all');
const testingAvatar = ref<boolean>(false);

/* ── Computed ───────────────────────────────────────────────────────── */
const isRootUser = computed(() => {
  const u = profile.value?.username?.toLowerCase()?.trim() || props.user?.username?.toLowerCase()?.trim();
  return Boolean(profile.value?.isRoot || props.user?.isRoot || u === 'iannc' || u === 'iannc69');
});

const roleBadgeLabel = computed(() => {
  if (isRootUser.value) return 'Root Super Admin';
  if (profile.value?.customTitle) return profile.value.customTitle;
  const r = profile.value?.role || 'member';
  return r.replace(/_/g, ' ').toUpperCase();
});

const roleColor = computed(() => {
  if (isRootUser.value) return '#ff4000';
  const r = profile.value?.role;
  if (r === 'doc_lead') return '#3b82f6';
  if (r === 'content_editor') return '#10b981';
  if (r === 'security_auditor') return '#8b5cf6';
  return '#f59e0b';
});

const formattedSecret = computed(() => {
  if (!totpSecret.value) return '';
  return totpSecret.value.match(/.{1,4}/g)?.join(' ') || totpSecret.value;
});

const verifyCode = computed(() => otpDigits.value.join(''));

const passwordStrength = computed(() => {
  const p = formData.value.password;
  if (!p) return { score: 0, text: 'Nicio schimbare', color: '#64748b' };
  let score = 0;
  if (p.length >= 8) score += 25;
  if (p.length >= 12) score += 15;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score += 20;
  if (/[0-9]/.test(p)) score += 20;
  if (/[^A-Za-z0-9]/.test(p)) score += 20;

  if (score < 40) return { score, text: 'Slabă', color: '#ef4444' };
  if (score < 70) return { score, text: 'Medie', color: '#f59e0b' };
  if (score < 90) return { score, text: 'Puternică', color: '#10b981' };
  return { score: 100, text: 'Excelentă (Fortress)', color: '#06b6d4' };
});

const securityScore = computed(() => {
  let score = 50;
  if (profile.value?.totpEnabled) score += 40;
  if (profile.value?.email) score += 5;
  if (formData.value.githubUsername || formData.value.discord) score += 5;
  return score;
});

const activePermissions = computed(() => {
  if (!profile.value) return [];
  const isRoot = isRootUser.value;
  const userPerms = profile.value.permissions || {};
  const allModules = PERMISSION_GROUPS.flatMap((g) => g.modules);
  return allModules.filter((mod) => isRoot || Boolean(userPerms[mod.key]));
});

/* ── Fetch Profile ──────────────────────────────────────────────────── */
async function fetchProfile() {
  loading.value = true;
  try {
    const res = await fetch('/api/admin/profile');
    if (res.ok) {
      const data = await res.json();
      if (data.profile) {
        profile.value = data.profile;
        formData.value = {
          displayName: data.profile.displayName || '',
          email: data.profile.email || '',
          bio: data.profile.bio || '',
          avatarUrl: data.profile.avatarUrl || '',
          discord: data.profile.discord || '',
          steamId: data.profile.steamId || '',
          githubUsername: data.profile.githubUsername || '',
          password: '',
          confirmPassword: '',
        };
      }
    }
  } catch (err) {
    console.error('Failed to fetch profile:', err);
  } finally {
    loading.value = false;
  }
}

const isLight = ref(false);

function detectTheme() {
  if (typeof document === 'undefined') return;
  const attr = document.documentElement.getAttribute('data-theme');
  const hasDark = document.documentElement.classList.contains('dark');
  const stored = localStorage.getItem('theme');
  isLight.value = attr === 'light' || stored === 'light' || (!hasDark && attr !== 'dark');
}

let themeObserver: MutationObserver | null = null;
const handleThemeChange = () => detectTheme();

onMounted(() => {
  detectTheme();
  if (typeof window !== 'undefined') {
    window.addEventListener('theme-change', handleThemeChange);
  }
  if (typeof MutationObserver !== 'undefined' && typeof document !== 'undefined') {
    themeObserver = new MutationObserver(() => detectTheme());
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
  }
  fetchProfile();
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('theme-change', handleThemeChange);
  }
  themeObserver?.disconnect();
});

/* ── Save Profile ───────────────────────────────────────────────────── */
async function handleSave() {
  if (formData.value.password && formData.value.password !== formData.value.confirmPassword) {
    statusMessage.value = { type: 'error', text: 'Parolele introduse nu coincid.' };
    return;
  }

  saving.value = true;
  statusMessage.value = null;

  try {
    const res = await fetch('/api/admin/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        displayName: formData.value.displayName,
        email: formData.value.email,
        bio: formData.value.bio,
        avatarUrl: formData.value.avatarUrl,
        discord: formData.value.discord,
        steamId: formData.value.steamId,
        githubUsername: formData.value.githubUsername,
        password: formData.value.password ? formData.value.password : undefined,
      }),
    });

    const data = await res.json();
    if (data.success) {
      statusMessage.value = { type: 'success', text: 'Profilul a fost salvat și actualizat cu succes.' };
      profile.value = data.profile;
      formData.value.password = '';
      formData.value.confirmPassword = '';
      formData.value.avatarUrl = data.profile.avatarUrl || formData.value.avatarUrl;
      window.dispatchEvent(new Event('admin-profile-updated'));
    } else {
      statusMessage.value = { type: 'error', text: data.message || data.error || 'Eroare la salvare.' };
    }
  } catch (err: any) {
    statusMessage.value = { type: 'error', text: `Eroare de conexiune la server: ${err.message}` };
  } finally {
    saving.value = false;
  }
}

/* ── Quick Avatar Presets ───────────────────────────────────────────── */
async function resolveSteamAvatar() {
  const query = formData.value.steamId.trim();
  if (!query) {
    steamMessage.value = { type: 'error', text: 'Completează un Steam ID64 sau link de profil mai întâi.' };
    return;
  }

  resolvingSteam.value = true;
  steamMessage.value = null;

  try {
    const res = await fetch(`/api/steam/avatar?id=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (res.ok && data.avatarUrl) {
      formData.value.avatarUrl = data.avatarUrl;
      steamMessage.value = { type: 'success', text: 'Avatar Steam preluat cu succes.' };
      setTimeout(() => (steamMessage.value = null), 4000);
    } else {
      steamMessage.value = { type: 'error', text: data.error || 'Nu s-a putut găsi avatarul Steam.' };
    }
  } catch {
    steamMessage.value = { type: 'error', text: 'Eroare la conectarea la serviciul Steam.' };
  } finally {
    resolvingSteam.value = false;
  }
}

function applyGithubAvatar() {
  if (!formData.value.githubUsername.trim()) {
    statusMessage.value = { type: 'error', text: 'Completează mai întâi numele de utilizator GitHub.' };
    return;
  }
  formData.value.avatarUrl = `https://github.com/${formData.value.githubUsername.trim()}.png`;
  statusMessage.value = { type: 'success', text: 'Avatar GitHub asociat cu succes.' };
}

function applyDiscordAvatar() {
  if (!formData.value.discord.trim()) {
    statusMessage.value = { type: 'error', text: 'Completează mai întâi ID-ul de Discord numeric.' };
    return;
  }
  formData.value.avatarUrl = `https://dcdn.dstn.to/avatars/${formData.value.discord.trim()}`;
  statusMessage.value = { type: 'success', text: 'Avatar Discord asociat cu succes.' };
}

function applyDicebearAvatar() {
  const seed = formData.value.displayName || profile.value?.username || 'wildfire';
  formData.value.avatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(seed)}`;
  statusMessage.value = { type: 'success', text: 'Avatar procedural generat cu succes.' };
}

function clearAvatar() {
  formData.value.avatarUrl = '';
  statusMessage.value = { type: 'success', text: 'Avatarul personalizat a fost resetat la cel implicit.' };
}

function copyToClipboard(text?: string, label?: string) {
  if (!text) return;
  navigator.clipboard.writeText(text);
  statusMessage.value = {
    type: 'success',
    text: `${label || 'Elementul'} a fost copiat în clipboard.`,
  };
  setTimeout(() => {
    if (statusMessage.value?.text.includes('copiat')) {
      statusMessage.value = null;
    }
  }, 3500);
}

function resetForm() {
  if (!profile.value) return;
  formData.value = {
    displayName: profile.value.displayName || '',
    email: profile.value.email || '',
    bio: profile.value.bio || '',
    avatarUrl: profile.value.avatarUrl || '',
    discord: profile.value.discord || '',
    steamId: profile.value.steamId || '',
    githubUsername: profile.value.githubUsername || '',
    password: '',
    confirmPassword: '',
  };
  statusMessage.value = {
    type: 'success',
    text: 'Formularul a fost resetat la valorile salvate pe server.',
  };
}

function exportProfileJson() {
  if (!profile.value) return;
  const data = {
    id: profile.value.id,
    username: profile.value.username,
    displayName: formData.value.displayName,
    email: formData.value.email,
    role: profile.value.role,
    bio: formData.value.bio,
    avatarUrl: formData.value.avatarUrl,
    discord: formData.value.discord,
    steamId: formData.value.steamId,
    githubUsername: formData.value.githubUsername,
    totpEnabled: profile.value.totpEnabled,
    permissions: profile.value.permissions,
    exportedAt: new Date().toISOString(),
  };
  copyToClipboard(JSON.stringify(data, null, 2), 'Configurația JSON a profilului');
}

function exportRbacReport() {
  if (!profile.value) return;
  const report = {
    user: profile.value.username,
    role: profile.value.role,
    isRoot: isRootUser.value,
    totalPermissions: 17,
    activePermissions: isRootUser.value ? 17 : activePermissions.value.length,
    matrix: PERMISSION_GROUPS.map((g) => ({
      category: g.title,
      modules: g.modules.map((m) => ({
        key: m.key,
        name: m.name,
        granted: Boolean(isRootUser.value || profile.value?.permissions?.[m.key]),
      })),
    })),
    generatedAt: new Date().toISOString(),
  };
  copyToClipboard(JSON.stringify(report, null, 2), 'Raportul RBAC');
}

function generateStrongPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*()_+~';
  let pass = '';
  const array = new Uint32Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
    for (let i = 0; i < 16; i++) {
      pass += chars[array[i] % chars.length];
    }
  } else {
    for (let i = 0; i < 16; i++) {
      pass += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  formData.value.password = pass;
  formData.value.confirmPassword = pass;
  showProfilePassword.value = true;
  showConfirmPassword.value = true;
  copyToClipboard(pass, 'Parolă securizată generată');
}

function clearPasswordFields() {
  formData.value.password = '';
  formData.value.confirmPassword = '';
  statusMessage.value = { type: 'success', text: 'Câmpurile de parolă au fost golite.' };
}

function applyDicebearBottts() {
  const seed = formData.value.displayName || profile.value?.username || 'wildfire';
  formData.value.avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seed)}`;
  statusMessage.value = { type: 'success', text: 'Avatar procedural DiceBear Bottts generat.' };
}

function applyGravatar() {
  if (!formData.value.email.trim()) {
    statusMessage.value = { type: 'error', text: 'Completează adresa de email pentru asocierea Gravatar.' };
    return;
  }
  formData.value.avatarUrl = `https://unavatar.io/${encodeURIComponent(formData.value.email.trim())}?fallback=https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(formData.value.email.trim())}`;
  statusMessage.value = { type: 'success', text: 'Avatar Gravatar asociat adresei de email.' };
}

function testAvatarUrl() {
  if (!formData.value.avatarUrl.trim()) {
    statusMessage.value = { type: 'error', text: 'Introduceți mai întâi un URL de avatar.' };
    return;
  }
  testingAvatar.value = true;
  const img = new Image();
  img.onload = () => {
    testingAvatar.value = false;
    statusMessage.value = { type: 'success', text: 'URL-ul avatarului este valid și se încarcă corect.' };
  };
  img.onerror = () => {
    testingAvatar.value = false;
    statusMessage.value = { type: 'error', text: 'Imaginea nu a putut fi descărcată de la acest URL.' };
  };
  img.src = formData.value.avatarUrl.trim();
}

function clearSteamId() {
  formData.value.steamId = '';
  steamMessage.value = null;
  statusMessage.value = { type: 'success', text: 'Steam ID a fost curățat.' };
}

function clearDiscordId() {
  formData.value.discord = '';
  statusMessage.value = { type: 'success', text: 'Discord ID a fost curățat.' };
}

function clearGithubUsername() {
  formData.value.githubUsername = '';
  statusMessage.value = { type: 'success', text: 'GitHub Username a fost curățat.' };
}

function isPermVisible(modKey: keyof TeamMemberPermissions): boolean {
  const granted = Boolean(isRootUser.value || profile.value?.permissions?.[modKey]);
  if (rbacFilter.value === 'granted') return granted;
  if (rbacFilter.value === 'restricted') return !granted;
  return true;
}

/* ── 2FA Handlers ───────────────────────────────────────────────────── */
async function handleEnable2FA() {
  twoFAActionLoading.value = true;
  try {
    const res = await fetch('/api/admin/profile/2fa', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      qrCodeData.value = data.qrCode;
      totpSecret.value = data.secret;
      otpDigits.value = ['', '', '', '', '', ''];
      show2FAModal.value = true;
      nextTick(() => {
        digitInputs.value[0]?.focus();
      });
    } else {
      statusMessage.value = { type: 'error', text: data.message || 'Eroare la generarea cheii 2FA.' };
    }
  } catch {
    statusMessage.value = { type: 'error', text: 'Eroare de conexiune la server.' };
  } finally {
    twoFAActionLoading.value = false;
  }
}

async function handleVerify2FA() {
  if (verifyCode.value.length !== 6) return;
  twoFAActionLoading.value = true;
  try {
    const res = await fetch('/api/admin/profile/2fa', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: verifyCode.value }),
    });
    const data = await res.json();
    if (data.success) {
      if (profile.value) profile.value.totpEnabled = true;
      show2FAModal.value = false;
      otpDigits.value = ['', '', '', '', '', ''];
      statusMessage.value = { type: 'success', text: 'Autentificarea în doi pași (2FA) a fost activată cu succes.' };
    } else {
      statusMessage.value = { type: 'error', text: data.message || 'Cod 2FA invalid.' };
    }
  } catch {
    statusMessage.value = { type: 'error', text: 'Eroare de conexiune la server.' };
  } finally {
    twoFAActionLoading.value = false;
  }
}

async function handleDisable2FA() {
  if (!confirm('Ești sigur că vrei să dezactivezi 2FA? Nivelul de securitate al contului tău va fi redus.')) return;
  twoFAActionLoading.value = true;
  try {
    const res = await fetch('/api/admin/profile/2fa', { method: 'DELETE' });
    if (res.ok) {
      if (profile.value) profile.value.totpEnabled = false;
      statusMessage.value = { type: 'success', text: '2FA a fost dezactivat cu succes.' };
    } else {
      const d = await res.json();
      statusMessage.value = { type: 'error', text: d.message || 'Eroare la dezactivarea 2FA.' };
    }
  } catch {
    statusMessage.value = { type: 'error', text: 'Eroare de conexiune la server.' };
  } finally {
    twoFAActionLoading.value = false;
  }
}

function copySecretToClipboard() {
  if (!totpSecret.value) return;
  navigator.clipboard.writeText(totpSecret.value);
  copiedSecret.value = true;
  setTimeout(() => (copiedSecret.value = false), 2500);
}

function handleDigitInput(index: number, e: Event) {
  const input = e.target as HTMLInputElement;
  const val = input.value.replace(/\D/g, '');
  otpDigits.value[index] = val ? val.slice(-1) : '';

  if (val && index < 5) {
    digitInputs.value[index + 1]?.focus();
  }

  if (otpDigits.value.every((d) => d.length === 1)) {
    handleVerify2FA();
  }
}

function handleDigitKeydown(index: number, e: KeyboardEvent) {
  if (e.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    digitInputs.value[index - 1]?.focus();
  }
}

function handlePasteOtp(e: ClipboardEvent) {
  const pasteData = e.clipboardData?.getData('text') || '';
  const digits = pasteData.replace(/\D/g, '').slice(0, 6);
  if (digits.length === 6) {
    e.preventDefault();
    digits.split('').forEach((char, idx) => {
      otpDigits.value[idx] = char;
    });
    handleVerify2FA();
  }
}
</script>

<template>
  <div class="adp-wrapper" :class="{ 'adp--light': isLight }">
    <!-- ── Loading Spinner ── -->
    <div v-if="loading" class="adp-loading-box">
      <Icon icon="lucide:refresh-cw" width="32" height="32" class="adp-spin text-amber-500" />
      <span class="adp-loading-text">SE ÎNCARCĂ PROFILUL ADMINISTRATIV...</span>
    </div>

    <!-- ── Main Content ── -->
    <div v-else-if="profile" class="adp-content">

      <!-- ── Top Header Bar ── -->
      <header class="adp-header">
        <div class="adp-header-info">
          <div class="adp-breadcrumb-row">
            <span class="adp-tag">WF-DOCS IDENTITY SYSTEM</span>
            <span class="adp-tag adp-tag--accent">SECURE CONTROL PANEL</span>
            <span class="adp-tag adp-mono">@{{ profile.username }}</span>
          </div>
          <h1 class="adp-title">Profil &amp; Securitate Personală</h1>
          <p class="adp-subtitle">
            Gestiune date publice, sincronizare platforme externe, acreditări de acces și audit RBAC calculat.
          </p>
        </div>

        <div class="adp-header-actions">
          <button
            type="button"
            class="adp-btn adp-btn--ghost"
            title="Reîncarcă datele salvate pe server"
            :disabled="loading"
            @click="fetchProfile"
          >
            <Icon icon="lucide:refresh-cw" width="14" height="14" :class="{ 'adp-spin': loading }" />
            <span>Reîncarcă</span>
          </button>

          <a
            href="/docs/team"
            target="_blank"
            class="adp-btn adp-btn--ghost"
            title="Deschide pagina publică a echipei într-o filă nouă"
          >
            <Icon icon="lucide:external-link" width="14" height="14" />
            <span>Vezi în Docs</span>
          </a>

          <button
            type="button"
            class="adp-btn adp-btn--ghost"
            title="Copiază ID cont în clipboard"
            @click="copyToClipboard(profile.id || profile.username, 'ID Cont')"
          >
            <Icon icon="lucide:copy" width="14" height="14" />
            <span>Copiază ID</span>
          </button>

          <button
            type="button"
            class="adp-btn adp-btn--primary"
            :disabled="saving"
            @click="handleSave"
          >
            <Icon
              :icon="saving ? 'lucide:refresh-cw' : 'lucide:save'"
              width="14"
              height="14"
              :class="{ 'adp-spin': saving }"
            />
            <span>{{ saving ? 'Se Salvează...' : 'Salvează Modificările' }}</span>
          </button>
        </div>
      </header>

      <!-- ── Status Message Alert ── -->
      <Transition name="fade">
        <div
          v-if="statusMessage"
          class="adp-alert"
          :class="statusMessage.type === 'success' ? 'adp-alert--success' : 'adp-alert--error'"
          role="alert"
        >
          <Icon
            :icon="statusMessage.type === 'success' ? 'lucide:check-circle-2' : 'lucide:alert-circle'"
            width="18"
            height="18"
          />
          <span class="adp-alert-text">{{ statusMessage.text }}</span>
          <button type="button" class="adp-alert-close" @click="statusMessage = null">
            <Icon icon="lucide:x" width="14" height="14" />
          </button>
        </div>
      </Transition>

      <!-- ── Hero Identity Card (Calculated & Crisp, Zero Glow) ── -->
      <section class="adp-hero-card">
        <div class="adp-hero-left">
          <!-- Avatar Frame -->
          <div class="adp-avatar-frame" :style="{ borderColor: roleColor }">
            <img
              v-if="formData.avatarUrl"
              :src="formData.avatarUrl"
              :alt="formData.displayName || profile.username"
              class="adp-avatar-img"
            />
            <div
              v-else
              class="adp-avatar-fallback"
              :style="{ color: roleColor }"
            >
              {{ (formData.displayName || profile.username || 'U').slice(0, 2).toUpperCase() }}
            </div>

            <!-- Root / Status Badge -->
            <div v-if="isRootUser" class="adp-avatar-badge" title="Root Super Admin">
              <Icon icon="lucide:shield-check" width="13" height="13" />
            </div>
          </div>

          <!-- User Details -->
          <div class="adp-hero-user">
            <div class="adp-hero-name-row">
              <h2 class="adp-hero-name">{{ formData.displayName || profile.username }}</h2>
              <span class="adp-role-chip" :style="{ borderColor: roleColor, color: roleColor, backgroundColor: `${roleColor}15` }">
                <Icon icon="lucide:shield" width="12" height="12" />
                <span>{{ roleBadgeLabel }}</span>
              </span>
            </div>

            <div class="adp-hero-meta-row">
              <span class="adp-meta-item" title="Nume utilizator">
                <Icon icon="lucide:at-sign" width="12" height="12" />
                <span class="adp-mono">{{ profile.username }}</span>
                <button
                  type="button"
                  class="adp-inline-copy-btn"
                  title="Copiază username"
                  @click="copyToClipboard(profile.username, 'Nume utilizator')"
                >
                  <Icon icon="lucide:copy" width="10" height="10" />
                </button>
              </span>

              <span v-if="profile.email" class="adp-meta-item" title="Adresă email oficială">
                <Icon icon="lucide:mail" width="12" height="12" />
                <span>{{ profile.email }}</span>
                <button
                  type="button"
                  class="adp-inline-copy-btn"
                  title="Copiază email"
                  @click="copyToClipboard(profile.email, 'Email')"
                >
                  <Icon icon="lucide:copy" width="10" height="10" />
                </button>
              </span>

              <span v-if="profile.createdAt" class="adp-meta-item">
                <Icon icon="lucide:calendar" width="12" height="12" />
                <span>Membru din {{ new Date(profile.createdAt).toLocaleDateString('ro-RO') }}</span>
              </span>
            </div>

            <p v-if="formData.bio" class="adp-hero-bio">
              "{{ formData.bio }}"
            </p>
          </div>
        </div>

        <!-- Quick Security Diagnostics (Calculated Stats) -->
        <div class="adp-hero-right">
          <div class="adp-stat-card">
            <div class="adp-stat-head">
              <span class="adp-stat-label">SCOR SECURITATE</span>
              <Icon icon="lucide:shield" width="14" height="14" :style="{ color: profile.totpEnabled ? '#10b981' : '#f59e0b' }" />
            </div>
            <div class="adp-stat-val" :style="{ color: profile.totpEnabled ? '#10b981' : '#f59e0b' }">
              {{ securityScore }}%
            </div>
            <div class="adp-stat-desc">
              {{ profile.totpEnabled ? 'Nivel Fortress (2FA Activ)' : 'Recomandare: Activează 2FA' }}
            </div>
            <button
              type="button"
              class="adp-stat-action-btn"
              @click="activeTab = 'security'"
            >
              <Icon icon="lucide:arrow-right" width="11" height="11" />
              <span>Configurare Securitate</span>
            </button>
          </div>

          <div class="adp-stat-card">
            <div class="adp-stat-head">
              <span class="adp-stat-label">STARE 2FA (TOTP)</span>
              <span class="adp-pulse-dot" :class="{ 'adp-pulse-dot--active': profile.totpEnabled }" />
            </div>
            <div class="adp-stat-val" :style="{ color: profile.totpEnabled ? '#10b981' : '#ef4444' }">
              {{ profile.totpEnabled ? 'ACTIVAT' : 'INACTIV' }}
            </div>
            <div class="adp-stat-desc">
              {{ profile.totpEnabled ? 'Autentificare dublă securizată' : 'Risc de interceptare' }}
            </div>
            <button
              v-if="profile.totpEnabled"
              type="button"
              class="adp-stat-action-btn"
              @click="activeTab = 'security'"
            >
              <Icon icon="lucide:settings" width="11" height="11" />
              <span>Opțiuni 2FA</span>
            </button>
            <button
              v-else
              type="button"
              class="adp-stat-action-btn adp-stat-action-btn--primary"
              @click="handleEnable2FA"
            >
              <Icon icon="lucide:shield-plus" width="11" height="11" />
              <span>Activează Acum</span>
            </button>
          </div>
        </div>
      </section>

      <!-- ── Navigation Tabs ── -->
      <nav class="adp-nav-tabs">
        <button
          type="button"
          class="adp-tab-btn"
          :class="{ 'adp-tab-btn--active': activeTab === 'identity' }"
          @click="activeTab = 'identity'"
        >
          <Icon icon="lucide:user" width="14" height="14" />
          <span>Identitate &amp; Profil</span>
        </button>

        <button
          type="button"
          class="adp-tab-btn"
          :class="{ 'adp-tab-btn--active': activeTab === 'integrations' }"
          @click="activeTab = 'integrations'"
        >
          <Icon icon="lucide:link-2" width="14" height="14" />
          <span>Integrări &amp; Conexiuni</span>
        </button>

        <button
          type="button"
          class="adp-tab-btn"
          :class="{ 'adp-tab-btn--active': activeTab === 'security' }"
          @click="activeTab = 'security'"
        >
          <Icon icon="lucide:shield-check" width="14" height="14" />
          <span>Securitate &amp; 2FA</span>
        </button>

        <button
          type="button"
          class="adp-tab-btn"
          :class="{ 'adp-tab-btn--active': activeTab === 'permissions' }"
          @click="activeTab = 'permissions'"
        >
          <Icon icon="lucide:key" width="14" height="14" />
          <span>Matrice RBAC</span>
          <span class="adp-tab-count">17</span>
        </button>
      </nav>

      <!-- ── Two-Column Main Layout ── -->
      <div class="adp-grid">

        <!-- ── Left Column: Active Tab Content ── -->
        <main class="adp-col-main">

          <!-- TAB 1: IDENTITATE & PROFIL -->
          <div v-if="activeTab === 'identity'" class="adp-card">
            <div class="adp-card-head">
              <div class="adp-card-icon-box" style="background: rgba(59, 130, 246, 0.15); color: #3b82f6;">
                <Icon icon="lucide:user-check" width="16" height="16" />
              </div>
              <div>
                <h3 class="adp-card-title">Informații Publice &amp; Vizibile</h3>
                <p class="adp-card-desc">Personalizează cum apari în fața comunității și a colegilor de echipă.</p>
              </div>
            </div>

            <div class="adp-card-body">
              <div class="adp-form-group">
                <div class="adp-label-split">
                  <label class="adp-label">Nume Afișat (Display Name)</label>
                  <button
                    v-if="formData.displayName"
                    type="button"
                    class="adp-mini-link-btn"
                    @click="copyToClipboard(formData.displayName, 'Nume afișat')"
                  >
                    <Icon icon="lucide:copy" width="11" height="11" />
                    <span>Copiază</span>
                  </button>
                </div>
                <div class="adp-input-box">
                  <Icon icon="lucide:user" width="14" height="14" class="adp-input-ico" />
                  <input
                    v-model="formData.displayName"
                    type="text"
                    class="adp-input"
                    placeholder="ex: iannC"
                  />
                </div>
                <span class="adp-hint">Numele principal afișat în header, audit log și pe pagina echipei.</span>
              </div>

              <div class="adp-form-group">
                <div class="adp-label-split">
                  <label class="adp-label">Adresă de Email Oficială</label>
                  <button
                    v-if="formData.email"
                    type="button"
                    class="adp-mini-link-btn"
                    @click="copyToClipboard(formData.email, 'Email')"
                  >
                    <Icon icon="lucide:copy" width="11" height="11" />
                    <span>Copiază</span>
                  </button>
                </div>
                <div class="adp-input-box">
                  <Icon icon="lucide:mail" width="14" height="14" class="adp-input-ico" />
                  <input
                    v-model="formData.email"
                    type="email"
                    class="adp-input"
                    placeholder="nume@exemplu.com"
                  />
                </div>
                <span class="adp-hint">Folosită pentru alerte administrative și notificări critice.</span>
              </div>

              <!-- Avatar Management -->
              <div class="adp-form-group">
                <div class="adp-label-split">
                  <label class="adp-label">URL Avatar Personalizat</label>
                  <button
                    v-if="formData.avatarUrl"
                    type="button"
                    class="adp-mini-link-btn"
                    :disabled="testingAvatar"
                    @click="testAvatarUrl"
                  >
                    <Icon icon="lucide:check-circle" width="11" height="11" />
                    <span>Verifică URL</span>
                  </button>
                </div>
                <div class="adp-input-box">
                  <Icon icon="lucide:image" width="14" height="14" class="adp-input-ico" />
                  <input
                    v-model="formData.avatarUrl"
                    type="url"
                    class="adp-input"
                    placeholder="https://... (sau alege un preset rapid de mai jos)"
                  />
                </div>

                <!-- Avatar Quick Presets Toolbar -->
                <div class="adp-avatar-presets">
                  <span class="adp-preset-label">Generare Rapidă:</span>
                  <button
                    type="button"
                    class="adp-preset-btn"
                    title="Preia din Steam ID configurat"
                    :disabled="resolvingSteam"
                    @click="resolveSteamAvatar"
                  >
                    <Icon icon="lucide:refresh-cw" width="11" height="11" :class="{ 'adp-spin': resolvingSteam }" />
                    <span>Preluare Steam</span>
                  </button>
                  <button
                    type="button"
                    class="adp-preset-btn"
                    title="Preia din GitHub Username"
                    @click="applyGithubAvatar"
                  >
                    <Icon icon="lucide:github" width="11" height="11" />
                    <span>Preluare GitHub</span>
                  </button>
                  <button
                    type="button"
                    class="adp-preset-btn"
                    title="Preia din Discord User ID"
                    @click="applyDiscordAvatar"
                  >
                    <Icon icon="lucide:bot" width="11" height="11" />
                    <span>Preluare Discord</span>
                  </button>
                  <button
                    type="button"
                    class="adp-preset-btn"
                    title="Generează avatar procedural DiceBear Identicon"
                    @click="applyDicebearAvatar"
                  >
                    <Icon icon="lucide:sparkles" width="11" height="11" />
                    <span>DiceBear Identicon</span>
                  </button>
                  <button
                    type="button"
                    class="adp-preset-btn"
                    title="Generează avatar procedural DiceBear Bottts"
                    @click="applyDicebearBottts"
                  >
                    <Icon icon="lucide:cpu" width="11" height="11" />
                    <span>DiceBear Bottts</span>
                  </button>
                  <button
                    type="button"
                    class="adp-preset-btn"
                    title="Asociază avatar Gravatar din adresa de email"
                    @click="applyGravatar"
                  >
                    <Icon icon="lucide:mail" width="11" height="11" />
                    <span>Gravatar Email</span>
                  </button>
                  <button
                    v-if="formData.avatarUrl"
                    type="button"
                    class="adp-preset-btn adp-preset-btn--clear"
                    title="Resetează avatarul la inițiale"
                    @click="clearAvatar"
                  >
                    <Icon icon="lucide:trash-2" width="11" height="11" />
                    <span>Resetare</span>
                  </button>
                </div>
              </div>

              <div class="adp-form-group">
                <div class="adp-label-split">
                  <label class="adp-label">Despre Mine (Bio / Descriere Activitate)</label>
                  <span class="adp-counter-hint">{{ formData.bio ? formData.bio.length : 0 }} caractere</span>
                </div>
                <textarea
                  v-model="formData.bio"
                  rows="3"
                  class="adp-textarea"
                  placeholder="Scurtă descriere a activității tale în proiectul Wildfire Docs..."
                />
                <span class="adp-hint">Textul apare pe cardul tău de pe pagina publică a echipei.</span>
              </div>
            </div>

            <div class="adp-card-footer">
              <button
                type="button"
                class="adp-btn adp-btn--primary"
                :disabled="saving"
                @click="handleSave"
              >
                <Icon :icon="saving ? 'lucide:refresh-cw' : 'lucide:save'" width="14" height="14" :class="{ 'adp-spin': saving }" />
                <span>Salvează Identitatea</span>
              </button>
              <button
                type="button"
                class="adp-btn adp-btn--ghost"
                @click="resetForm"
              >
                <Icon icon="lucide:rotate-ccw" width="14" height="14" />
                <span>Resetează Modificările</span>
              </button>
              <button
                type="button"
                class="adp-btn adp-btn--ghost"
                @click="exportProfileJson"
              >
                <Icon icon="lucide:file-code" width="14" height="14" />
                <span>Exportă JSON</span>
              </button>
            </div>
          </div>

          <!-- TAB 2: INTEGRĂRI & SOCIALS -->
          <div v-if="activeTab === 'integrations'" class="adp-card">
            <div class="adp-card-head">
              <div class="adp-card-icon-box" style="background: rgba(139, 92, 246, 0.15); color: #8b5cf6;">
                <Icon icon="lucide:link-2" width="16" height="16" />
              </div>
              <div>
                <h3 class="adp-card-title">Sincronizare Platforme Externe</h3>
                <p class="adp-card-desc">Conectează-ți conturile pentru verificarea identității și sincronizarea contribuțiilor.</p>
              </div>
            </div>

            <div class="adp-card-body">
              <!-- Steam ID -->
              <div class="adp-form-group">
                <div class="adp-label-split">
                  <label class="adp-label">Steam ID64 / Profil Steam</label>
                  <div class="adp-inline-actions">
                    <a
                      v-if="formData.steamId"
                      :href="`https://steamcommunity.com/profiles/${formData.steamId.trim()}`"
                      target="_blank"
                      class="adp-mini-link-btn"
                    >
                      <Icon icon="lucide:external-link" width="11" height="11" />
                      <span>Deschide Steam</span>
                    </a>
                    <button
                      v-if="formData.steamId"
                      type="button"
                      class="adp-mini-link-btn"
                      :disabled="resolvingSteam"
                      @click="resolveSteamAvatar"
                    >
                      <Icon icon="lucide:refresh-cw" width="11" height="11" :class="{ 'adp-spin': resolvingSteam }" />
                      <span>Sincronizează Avatar</span>
                    </button>
                    <button
                      v-if="formData.steamId"
                      type="button"
                      class="adp-mini-link-btn adp-mini-link-btn--danger"
                      @click="clearSteamId"
                    >
                      <Icon icon="lucide:trash-2" width="11" height="11" />
                      <span>Șterge</span>
                    </button>
                  </div>
                </div>
                <div class="adp-input-box">
                  <Icon icon="lucide:gamepad-2" width="14" height="14" class="adp-input-ico text-indigo-400" />
                  <input
                    v-model="formData.steamId"
                    type="text"
                    class="adp-input adp-mono"
                    placeholder="76561198000000000 sau link https://steamcommunity.com/id/..."
                  />
                </div>
                <span v-if="steamMessage" class="adp-hint" :style="{ color: steamMessage.type === 'success' ? '#10b981' : '#ef4444' }">
                  {{ steamMessage.text }}
                </span>
                <span v-else class="adp-hint">Folosit pentru identificarea profilului de membru staff.</span>
              </div>

              <!-- Discord User ID -->
              <div class="adp-form-group">
                <div class="adp-label-split">
                  <label class="adp-label">Discord User ID (Numeric)</label>
                  <div class="adp-inline-actions">
                    <button
                      v-if="formData.discord"
                      type="button"
                      class="adp-mini-link-btn"
                      @click="applyDiscordAvatar"
                    >
                      <Icon icon="lucide:image" width="11" height="11" />
                      <span>Preluare Avatar</span>
                    </button>
                    <button
                      v-if="formData.discord"
                      type="button"
                      class="adp-mini-link-btn"
                      @click="copyToClipboard(formData.discord, 'Discord User ID')"
                    >
                      <Icon icon="lucide:copy" width="11" height="11" />
                      <span>Copiază ID</span>
                    </button>
                    <button
                      v-if="formData.discord"
                      type="button"
                      class="adp-mini-link-btn adp-mini-link-btn--danger"
                      @click="clearDiscordId"
                    >
                      <Icon icon="lucide:trash-2" width="11" height="11" />
                      <span>Șterge</span>
                    </button>
                  </div>
                </div>
                <div class="adp-input-box">
                  <Icon icon="lucide:message-square" width="14" height="14" class="adp-input-ico text-purple-400" />
                  <input
                    v-model="formData.discord"
                    type="text"
                    class="adp-input adp-mono"
                    placeholder="ex: 371621920162185216"
                  />
                </div>
                <span class="adp-hint">Permite asocierea cu botul oficial de Discord și preluarea avatarului.</span>
              </div>

              <!-- GitHub Username -->
              <div class="adp-form-group">
                <div class="adp-label-split">
                  <label class="adp-label">GitHub Username</label>
                  <div class="adp-inline-actions">
                    <a
                      v-if="formData.githubUsername"
                      :href="`https://github.com/${formData.githubUsername.trim()}`"
                      target="_blank"
                      class="adp-mini-link-btn"
                    >
                      <Icon icon="lucide:external-link" width="11" height="11" />
                      <span>Deschide GitHub</span>
                    </a>
                    <button
                      v-if="formData.githubUsername"
                      type="button"
                      class="adp-mini-link-btn"
                      @click="applyGithubAvatar"
                    >
                      <Icon icon="lucide:image" width="11" height="11" />
                      <span>Preluare Avatar</span>
                    </button>
                    <button
                      v-if="formData.githubUsername"
                      type="button"
                      class="adp-mini-link-btn adp-mini-link-btn--danger"
                      @click="clearGithubUsername"
                    >
                      <Icon icon="lucide:trash-2" width="11" height="11" />
                      <span>Șterge</span>
                    </button>
                  </div>
                </div>
                <div class="adp-input-box">
                  <Icon icon="lucide:code-2" width="14" height="14" class="adp-input-ico text-slate-300" />
                  <input
                    v-model="formData.githubUsername"
                    type="text"
                    class="adp-input"
                    placeholder="ex: iannC69"
                  />
                </div>
                <span class="adp-hint">Sincronizează statisticile din graficul de GitOps &amp; GitHub Contributions.</span>
              </div>
            </div>

            <div class="adp-card-footer">
              <button
                type="button"
                class="adp-btn adp-btn--primary"
                :disabled="saving"
                @click="handleSave"
              >
                <Icon :icon="saving ? 'lucide:refresh-cw' : 'lucide:save'" width="14" height="14" :class="{ 'adp-spin': saving }" />
                <span>Salvează Integrările</span>
              </button>
              <button
                type="button"
                class="adp-btn adp-btn--ghost"
                @click="resetForm"
              >
                <Icon icon="lucide:rotate-ccw" width="14" height="14" />
                <span>Resetează Câmpurile</span>
              </button>
            </div>
          </div>

          <!-- TAB 3: SECURITATE & 2FA -->
          <div v-if="activeTab === 'security'" class="adp-card-stack">

            <!-- Card: Password Management -->
            <div class="adp-card">
              <div class="adp-card-head">
                <div class="adp-card-icon-box" style="background: rgba(239, 68, 68, 0.15); color: #ef4444;">
                  <Icon icon="lucide:lock" width="16" height="16" />
                </div>
                <div class="adp-flex-1">
                  <h3 class="adp-card-title">Schimbare Parolă Cont</h3>
                  <p class="adp-card-desc">Actualizează parola contului administrativ. Lasă gol dacă nu dorești modificarea.</p>
                </div>
                <button
                  type="button"
                  class="adp-btn adp-btn--ghost adp-btn--sm"
                  title="Generează automat o parolă complexă de 16 caractere"
                  @click="generateStrongPassword"
                >
                  <Icon icon="lucide:sparkles" width="13" height="13" />
                  <span>Generează Parolă Sigură</span>
                </button>
              </div>

              <div class="adp-card-body">
                <div class="adp-form-row">
                  <div class="adp-form-group adp-flex-1">
                    <label class="adp-label">Parolă Nouă</label>
                    <div class="adp-input-box adp-input-box--relative">
                      <Icon icon="lucide:lock" width="14" height="14" class="adp-input-ico" />
                      <input
                        v-model="formData.password"
                        :type="showProfilePassword ? 'text' : 'password'"
                        class="adp-input adp-input--pass"
                        placeholder="••••••••••••"
                      />
                      <button
                        type="button"
                        class="adp-eye-btn"
                        :title="showProfilePassword ? 'Ascunde' : 'Arată'"
                        @click="showProfilePassword = !showProfilePassword"
                      >
                        <Icon :icon="showProfilePassword ? 'lucide:eye-off' : 'lucide:eye'" width="14" height="14" />
                      </button>
                    </div>
                  </div>

                  <div class="adp-form-group adp-flex-1">
                    <label class="adp-label">Confirmă Parola Nouă</label>
                    <div class="adp-input-box adp-input-box--relative">
                      <Icon icon="lucide:lock" width="14" height="14" class="adp-input-ico" />
                      <input
                        v-model="formData.confirmPassword"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        class="adp-input adp-input--pass"
                        placeholder="••••••••••••"
                      />
                      <button
                        type="button"
                        class="adp-eye-btn"
                        :title="showConfirmPassword ? 'Ascunde' : 'Arată'"
                        @click="showConfirmPassword = !showConfirmPassword"
                      >
                        <Icon :icon="showConfirmPassword ? 'lucide:eye-off' : 'lucide:eye'" width="14" height="14" />
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Password Strength Meter -->
                <div v-if="formData.password" class="adp-pass-strength">
                  <div class="adp-pass-strength-head">
                    <span class="adp-pass-strength-label">Complexitate Parolă:</span>
                    <span class="adp-pass-strength-val" :style="{ color: passwordStrength.color }">
                      {{ passwordStrength.text }}
                    </span>
                  </div>
                  <div class="adp-strength-track">
                    <div
                      class="adp-strength-bar"
                      :style="{ width: `${passwordStrength.score}%`, backgroundColor: passwordStrength.color }"
                    />
                  </div>
                </div>

                <div class="adp-sec-notice">
                  <Icon icon="lucide:info" width="14" height="14" class="text-amber-400" />
                  <span>
                    Schimbarea parolei va actualiza acreditările și va invalida celelalte sesiuni active ale contului tău.
                  </span>
                </div>
              </div>

              <div class="adp-card-footer">
                <button
                  type="button"
                  class="adp-btn adp-btn--primary"
                  :disabled="saving || !formData.password || formData.password !== formData.confirmPassword"
                  @click="handleSave"
                >
                  <Icon :icon="saving ? 'lucide:refresh-cw' : 'lucide:key'" width="14" height="14" :class="{ 'adp-spin': saving }" />
                  <span>Actualizează Parola</span>
                </button>
                <button
                  v-if="formData.password || formData.confirmPassword"
                  type="button"
                  class="adp-btn adp-btn--ghost"
                  @click="clearPasswordFields"
                >
                  <Icon icon="lucide:x-circle" width="14" height="14" />
                  <span>Golește Câmpurile</span>
                </button>
              </div>
            </div>

            <!-- Card: 2FA Authentication -->
            <div class="adp-card">
              <div class="adp-card-head">
                <div
                  class="adp-card-icon-box"
                  :style="{
                    background: profile.totpEnabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: profile.totpEnabled ? '#10b981' : '#ef4444'
                  }"
                >
                  <Icon icon="lucide:shield-check" width="16" height="16" />
                </div>
                <div>
                  <h3 class="adp-card-title">Autentificare în Doi Pași (2FA TOTP)</h3>
                  <p class="adp-card-desc">Protecție prin cod dinamic generat pe dispozitiv (Google Authenticator, Apple Passwords, Authy).</p>
                </div>
              </div>

              <div class="adp-card-body">
                <div class="adp-2fa-status-card" :class="profile.totpEnabled ? 'adp-2fa--active' : 'adp-2fa--inactive'">
                  <div class="adp-2fa-status-left">
                    <div class="adp-2fa-icon-circle">
                      <Icon :icon="profile.totpEnabled ? 'lucide:lock-keyhole' : 'lucide:unlock'" width="20" height="20" />
                    </div>
                    <div>
                      <div class="adp-2fa-title">
                        {{ profile.totpEnabled ? 'Protecția 2FA este Activată și Operațională' : 'Protecția 2FA este Dezactivată' }}
                      </div>
                      <div class="adp-2fa-desc">
                        {{
                          profile.totpEnabled
                            ? 'Contul tău solicită un cod de 6 cifre la fiecare conectare. Accesul este protejat împotriva interceptării parolei.'
                            : 'Fără 2FA activat, contul tău prezintă un risc crescut de securitate în cazul expunerii parolei.'
                        }}
                      </div>
                    </div>
                  </div>

                  <div class="adp-2fa-actions">
                    <button
                      v-if="profile.totpEnabled"
                      type="button"
                      class="adp-btn adp-btn--danger"
                      :disabled="twoFAActionLoading"
                      @click="handleDisable2FA"
                    >
                      <Icon icon="lucide:shield-off" width="14" height="14" />
                      <span>Dezactivează 2FA</span>
                    </button>
                    <button
                      v-if="profile.totpEnabled"
                      type="button"
                      class="adp-btn adp-btn--ghost"
                      :disabled="twoFAActionLoading"
                      @click="handleEnable2FA"
                    >
                      <Icon icon="lucide:refresh-cw" width="14" height="14" />
                      <span>Reconfigurează Cheie</span>
                    </button>
                    <button
                      v-else
                      type="button"
                      class="adp-btn adp-btn--primary"
                      :disabled="twoFAActionLoading"
                      @click="handleEnable2FA"
                    >
                      <Icon icon="lucide:shield-plus" width="14" height="14" />
                      <span>Configurează 2FA Acum</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card: Current Session & Platform Safeguards -->
            <div class="adp-card">
              <div class="adp-card-head">
                <div class="adp-card-icon-box" style="background: rgba(6, 182, 212, 0.15); color: #06b6d4;">
                  <Icon icon="lucide:cpu" width="16" height="16" />
                </div>
                <div class="adp-flex-1">
                  <h3 class="adp-card-title">Sesiune Curentă &amp; Parametri Tehnici</h3>
                  <p class="adp-card-desc">Detalii criptografice despre conexiunea curentă administrativă.</p>
                </div>
                <button
                  type="button"
                  class="adp-btn adp-btn--ghost adp-btn--sm"
                  @click="copyToClipboard('Protocol: HttpOnly Strict, Hash: SHA-256 PBKDF2, Protectie: Anti-CSRF Origin Isolation', 'Specificațiile sesiunii')"
                >
                  <Icon icon="lucide:copy" width="13" height="13" />
                  <span>Copiază Specificații</span>
                </button>
              </div>

              <div class="adp-card-body">
                <div class="adp-session-metrics">
                  <div class="adp-session-item">
                    <span class="adp-session-label">PROTOCOL TOKEN</span>
                    <span class="adp-session-val adp-mono">HttpOnly Strict Secure Cookie</span>
                  </div>
                  <div class="adp-session-item">
                    <span class="adp-session-label">ALGORITM HASH</span>
                    <span class="adp-session-val adp-mono">SHA-256 PBKDF2</span>
                  </div>
                  <div class="adp-session-item">
                    <span class="adp-session-label">IZOLARE SESIUNE</span>
                    <span class="adp-session-val adp-mono text-emerald-400">Protejată (Anti-CSRF)</span>
                  </div>
                  <div class="adp-session-item">
                    <span class="adp-session-label">IMUNITATE ROOT</span>
                    <span class="adp-session-val adp-mono" :style="{ color: isRootUser ? '#ff4000' : '#64748b' }">
                      {{ isRootUser ? 'Activă (Superuser)' : 'N/A' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- TAB 4: MATRICEA DREPTURILOR & PERMISIUNI RBAC -->
          <div v-if="activeTab === 'permissions'" class="adp-card-stack">

            <!-- Root Super Admin Immunity Banner (Zero Glow, Calculated) -->
            <div v-if="isRootUser" class="adp-root-banner">
              <div class="adp-root-banner-inner">
                <div class="adp-root-icon-box">
                  <Icon icon="lucide:crown" width="24" height="24" class="text-amber-400" />
                </div>
                <div>
                  <h4 class="adp-root-banner-title">PRIVILEGII ROOT SUPER ADMIN ACTIVE</h4>
                  <p class="adp-root-banner-desc">
                    Contul tău <strong>{{ profile.username }}</strong> are imunitate absolută și drepturi universale în întreg panoul de control Wildfire Docs. Toate verificările RBAC sunt validate implicit.
                  </p>
                </div>
              </div>
            </div>

            <!-- RBAC Filter Toolbar -->
            <div class="adp-filter-toolbar">
              <div class="adp-filter-pills">
                <button
                  type="button"
                  class="adp-filter-pill"
                  :class="{ 'adp-filter-pill--active': rbacFilter === 'all' }"
                  @click="rbacFilter = 'all'"
                >
                  <span>Toate Permisiunile</span>
                  <span class="adp-pill-count">17</span>
                </button>
                <button
                  type="button"
                  class="adp-filter-pill"
                  :class="{ 'adp-filter-pill--active': rbacFilter === 'granted' }"
                  @click="rbacFilter = 'granted'"
                >
                  <span>Permise</span>
                  <span class="adp-pill-count text-emerald-400">{{ isRootUser ? 17 : activePermissions.length }}</span>
                </button>
                <button
                  type="button"
                  class="adp-filter-pill"
                  :class="{ 'adp-filter-pill--active': rbacFilter === 'restricted' }"
                  @click="rbacFilter = 'restricted'"
                >
                  <span>Restricționate</span>
                  <span class="adp-pill-count text-rose-400">{{ isRootUser ? 0 : 17 - activePermissions.length }}</span>
                </button>
              </div>

              <button
                type="button"
                class="adp-btn adp-btn--ghost adp-btn--sm"
                @click="exportRbacReport"
              >
                <Icon icon="lucide:download" width="13" height="13" />
                <span>Exportă Raport RBAC (JSON)</span>
              </button>
            </div>

            <!-- Permission Groups Breakdown -->
            <div
              v-for="group in PERMISSION_GROUPS"
              :key="group.title"
              class="adp-card"
            >
              <div class="adp-card-head">
                <div class="adp-card-icon-box" :style="{ backgroundColor: `${group.accent}20`, color: group.accent }">
                  <Icon :icon="group.icon" width="16" height="16" />
                </div>
                <div>
                  <h3 class="adp-card-title">{{ group.title }}</h3>
                  <p class="adp-card-desc">{{ group.subtitle }}</p>
                </div>
              </div>

              <div class="adp-card-body">
                <div class="adp-perms-grid">
                  <template
                    v-for="mod in group.modules"
                    :key="mod.key"
                  >
                    <div
                      v-if="isPermVisible(mod.key)"
                      class="adp-perm-card"
                      :class="{ 'adp-perm-card--active': isRootUser || profile.permissions?.[mod.key] }"
                    >
                      <div class="adp-perm-head">
                        <div class="adp-perm-icon" :style="{ color: mod.color, backgroundColor: `${mod.color}15` }">
                          <Icon :icon="mod.icon" width="15" height="15" />
                        </div>
                        <span
                          class="adp-perm-badge"
                          :class="(isRootUser || profile.permissions?.[mod.key]) ? 'adp-perm-badge--yes' : 'adp-perm-badge--no'"
                        >
                          {{ (isRootUser || profile.permissions?.[mod.key]) ? 'PERMIS' : 'RESTRICȚIONAT' }}
                        </span>
                      </div>

                      <h4 class="adp-perm-title">{{ mod.name }}</h4>
                      <p class="adp-perm-desc">{{ mod.desc }}</p>
                    </div>
                  </template>
                </div>
              </div>
            </div>

          </div>

        </main>

        <!-- ── Right Column: Sticky Live Identity Card Preview (Zero Glow) ── -->
        <aside class="adp-col-sidebar">
          <div class="adp-sticky-card">

            <!-- Card Header -->
            <div class="adp-preview-top">
              <span class="adp-preview-tag">PREVIZUALIZARE PROFIL LIVE</span>
              <span class="adp-live-pulse" />
            </div>

            <!-- Preview Card Body (Calculated, No Glow) -->
            <div class="adp-live-team-card" :style="{ borderColor: roleColor }">
              <div class="adp-live-avatar-box">
                <img
                  v-if="formData.avatarUrl"
                  :src="formData.avatarUrl"
                  alt="Avatar"
                  class="adp-live-avatar-img"
                />
                <div
                  v-else
                  class="adp-live-avatar-placeholder"
                  :style="{ color: roleColor }"
                >
                  {{ (formData.displayName || profile.username || 'U').slice(0, 2).toUpperCase() }}
                </div>
                <span class="adp-live-online-dot" />
              </div>

              <h3 class="adp-live-name">{{ formData.displayName || profile.username }}</h3>
              <span class="adp-live-username adp-mono">@{{ profile.username }}</span>

              <div class="adp-live-role-badge" :style="{ borderColor: roleColor, color: roleColor, backgroundColor: `${roleColor}12` }">
                {{ roleBadgeLabel }}
              </div>

              <p class="adp-live-bio">
                {{ formData.bio || 'Membru în echipa tehnică și de documentație a platformei Wildfire.' }}
              </p>

              <!-- External Links Preview -->
              <div class="adp-live-links">
                <a
                  v-if="formData.steamId"
                  :href="`https://steamcommunity.com/profiles/${formData.steamId.trim()}`"
                  target="_blank"
                  class="adp-live-link-chip text-indigo-400"
                  title="Deschide Profil Steam"
                >
                  <Icon icon="lucide:gamepad-2" width="13" height="13" />
                  <span>Steam</span>
                </a>
                <button
                  v-if="formData.discord"
                  type="button"
                  class="adp-live-link-chip text-purple-400"
                  title="Copiază Discord User ID"
                  @click="copyToClipboard(formData.discord, 'Discord User ID')"
                >
                  <Icon icon="lucide:message-square" width="13" height="13" />
                  <span>Discord</span>
                </button>
                <a
                  v-if="formData.githubUsername"
                  :href="`https://github.com/${formData.githubUsername.trim()}`"
                  target="_blank"
                  class="adp-live-link-chip text-slate-300"
                  title="Deschide GitHub"
                >
                  <Icon icon="lucide:github" width="13" height="13" />
                  <span>GitHub</span>
                </a>
              </div>
            </div>

            <!-- Complete Sidebar Actions -->
            <div class="adp-sidebar-actions">
              <button
                type="button"
                class="adp-btn adp-btn--primary adp-btn--full"
                :disabled="saving"
                @click="handleSave"
              >
                <Icon
                  :icon="saving ? 'lucide:refresh-cw' : 'lucide:save'"
                  width="15"
                  height="15"
                  :class="{ 'adp-spin': saving }"
                />
                <span>{{ saving ? 'Se Salvează...' : 'Salvează Profilul' }}</span>
              </button>

              <button
                type="button"
                class="adp-btn adp-btn--ghost adp-btn--full"
                @click="resetForm"
              >
                <Icon icon="lucide:rotate-ccw" width="14" height="14" />
                <span>Resetează Modificările</span>
              </button>

              <a
                href="/docs/team"
                target="_blank"
                class="adp-btn adp-btn--ghost adp-btn--full"
              >
                <Icon icon="lucide:external-link" width="14" height="14" />
                <span>Vezi în Pagina Echipei</span>
              </a>

              <button
                type="button"
                class="adp-btn adp-btn--ghost adp-btn--full"
                @click="copyToClipboard(profile.id || profile.username, 'Identificator Cont')"
              >
                <Icon icon="lucide:copy" width="14" height="14" />
                <span>Copiază ID Profil</span>
              </button>
            </div>

          </div>
        </aside>

      </div>

    </div>

    <!-- ── 2FA Setup Modal (Crisp & Calculated, Zero Blur Glow) ── -->
    <Teleport to="body">
      <Transition name="fade-modal">
        <div v-if="show2FAModal" class="adp-modal-backdrop" :class="{ 'adp-modal-backdrop--light': isLight }" @click.self="show2FAModal = false">
          <div class="adp-modal-card" :class="{ 'adp-modal-card--light': isLight }" role="dialog" aria-modal="true">
            <div class="adp-modal-header">
              <div>
                <div class="adp-modal-pretitle">AUTENTIFICARE ÎN DOI PAȘI</div>
                <h3 class="adp-modal-title">Configurare 2FA (TOTP)</h3>
              </div>
              <button type="button" class="adp-modal-close" @click="show2FAModal = false">
                <Icon icon="lucide:x" width="16" height="16" />
              </button>
            </div>

            <div class="adp-modal-body">
              <p class="adp-modal-instructions">
                1. Scanează codul QR folosind o aplicație de autentificare securizată (Google Authenticator, Apple Passwords, Authy, Bitwarden).
              </p>

              <!-- QR Code Frame -->
              <div class="adp-qr-container">
                <img
                  v-if="qrCodeData"
                  :src="qrCodeData"
                  alt="QR Code 2FA"
                  class="adp-qr-img"
                />
                <div v-else class="adp-qr-placeholder">
                  <Icon icon="lucide:refresh-cw" width="28" height="28" class="adp-spin text-amber-500" />
                </div>
              </div>

              <!-- Manual Secret Key -->
              <div v-if="totpSecret" class="adp-secret-block">
                <div class="adp-secret-head">
                  <span class="adp-secret-label">Sau introdu cheia secretă manual:</span>
                  <button type="button" class="adp-copy-btn" @click="copySecretToClipboard">
                    <Icon :icon="copiedSecret ? 'lucide:check' : 'lucide:copy'" width="12" height="12" />
                    <span>{{ copiedSecret ? 'Copiat!' : 'Copiază Cheia' }}</span>
                  </button>
                </div>
                <div class="adp-secret-text adp-mono">{{ formattedSecret }}</div>
              </div>

              <!-- 6-digit Code Inputs -->
              <div class="adp-otp-section">
                <label class="adp-otp-label">2. Introdu codul de verificare din 6 cifre:</label>
                <div class="adp-otp-inputs" @paste="handlePasteOtp">
                  <input
                    v-for="(_, idx) in otpDigits"
                    :key="idx"
                    :ref="(el) => { if (el) digitInputs[idx] = el as HTMLInputElement; }"
                    v-model="otpDigits[idx]"
                    type="text"
                    maxlength="1"
                    class="adp-otp-digit"
                    @input="handleDigitInput(idx, $event)"
                    @keydown="handleDigitKeydown(idx, $event)"
                  />
                </div>
              </div>
            </div>

            <div class="adp-modal-footer">
              <button type="button" class="adp-btn adp-btn--ghost" @click="show2FAModal = false">
                Anulează
              </button>
              <button
                type="button"
                class="adp-btn adp-btn--primary"
                :disabled="twoFAActionLoading || verifyCode.length !== 6"
                @click="handleVerify2FA"
              >
                <Icon
                  :icon="twoFAActionLoading ? 'lucide:refresh-cw' : 'lucide:check-circle-2'"
                  width="14"
                  height="14"
                  :class="{ 'adp-spin': twoFAActionLoading }"
                />
                <span>Verifică &amp; Activează</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<style scoped>
/* ── Container & Reset ── */
.adp-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 28px 60px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #e2e8f0;
}

/* ── Loader ── */
.adp-loading-box {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

.adp-loading-text {
  font-size: 0.8rem;
  letter-spacing: 1.5px;
  color: #94a3b8;
  font-weight: 600;
}

/* ── Top Header Bar ── */
.adp-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.adp-header-info {
  flex: 1;
  min-width: 280px;
}

.adp-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.adp-breadcrumb-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.adp-tag {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 3px 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.06);
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.adp-tag--accent {
  background: rgba(255, 64, 0, 0.12);
  color: #ff5500;
  border-color: rgba(255, 64, 0, 0.25);
}

.adp-title {
  font-size: 1.85rem;
  font-weight: 800;
  color: #f8fafc;
  margin: 0 0 6px 0;
  letter-spacing: -0.5px;
}

.adp-subtitle {
  font-size: 0.88rem;
  color: #94a3b8;
  margin: 0;
  max-width: 720px;
  line-height: 1.45;
}

/* ── Alerts ── */
.adp-alert {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.adp-alert--success {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.25);
  color: #a7f3d0;
}

.adp-alert--error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #fca5a5;
}

.adp-alert-text {
  flex: 1;
}

.adp-alert-close {
  background: transparent;
  border: none;
  color: currentColor;
  cursor: pointer;
  opacity: 0.7;
  padding: 2px;
  transition: opacity 0.15s;
}

.adp-alert-close:hover {
  opacity: 1;
}

/* ── Hero Identity Card (Calculated, Flat Elevation, Zero Glow) ── */
.adp-hero-card {
  position: relative;
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 24px 28px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.adp-hero-left {
  display: flex;
  align-items: center;
  gap: 22px;
  position: relative;
  z-index: 1;
}

.adp-avatar-frame {
  position: relative;
  width: 82px;
  height: 82px;
  border-radius: 14px;
  border: 2px solid #ff4000;
  background: #090d16;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.adp-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.adp-avatar-fallback {
  font-size: 1.8rem;
  font-weight: 800;
}

.adp-avatar-badge {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  background: #ff4000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  border: 2px solid #090d16;
}

.adp-hero-user {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.adp-hero-name-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.adp-hero-name {
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.adp-role-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: 6px;
  border: 1px solid;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.adp-hero-meta-row {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 0.78rem;
  color: #94a3b8;
  flex-wrap: wrap;
}

.adp-meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.adp-inline-copy-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #64748b;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  line-height: 1;
}

.adp-inline-copy-btn:hover {
  color: #f1f5f9;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.adp-hero-bio {
  font-size: 0.82rem;
  color: #cbd5e1;
  margin: 4px 0 0 0;
  font-style: italic;
  max-width: 600px;
}

.adp-hero-right {
  display: flex;
  align-items: center;
  gap: 14px;
  position: relative;
  z-index: 1;
}

.adp-stat-card {
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 10px;
  padding: 14px 18px;
  min-width: 170px;
  display: flex;
  flex-direction: column;
}

.adp-stat-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.adp-stat-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 1px;
}

.adp-stat-val {
  font-size: 1.4rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 4px;
}

.adp-stat-desc {
  font-size: 0.7rem;
  color: #64748b;
  margin-bottom: 8px;
}

.adp-stat-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 9px;
  font-size: 0.68rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #cbd5e1;
  cursor: pointer;
  transition: all 0.15s ease;
  margin-top: auto;
}

.adp-stat-action-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.2);
}

.adp-stat-action-btn--primary {
  background: rgba(255, 64, 0, 0.15);
  border-color: rgba(255, 64, 0, 0.3);
  color: #ff6b00;
}

.adp-stat-action-btn--primary:hover {
  background: rgba(255, 64, 0, 0.25);
  color: #ffffff;
}

.adp-pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
}

.adp-pulse-dot--active {
  background: #10b981;
  box-shadow: none;
  border: 1px solid rgba(16, 185, 129, 0.5);
  animation: adp-pulse 2s infinite;
}

@keyframes adp-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* ── Navigation Tabs ── */
.adp-nav-tabs {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  margin-bottom: 24px;
  overflow-x: auto;
}

.adp-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #94a3b8;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.adp-tab-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
}

.adp-tab-btn--active {
  color: #ffffff;
  background: #ff4000;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.adp-tab-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1px 6px;
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.15);
  color: inherit;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

/* ── Grid Layout ── */
.adp-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;
  align-items: start;
}

.adp-card-stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Standard Card (Calculated Flat Style) ── */
.adp-card {
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.adp-card-head {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 22px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(0, 0, 0, 0.2);
}

.adp-card-icon-box {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.adp-card-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #f8fafc;
  margin: 0 0 2px 0;
}

.adp-card-desc {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0;
}

.adp-card-body {
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.adp-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 22px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(0, 0, 0, 0.2);
  flex-wrap: wrap;
}

.adp-card-footer-left,
.adp-card-footer-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

/* ── Forms ── */
.adp-form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.adp-form-row {
  display: flex;
  gap: 16px;
}

.adp-flex-1 {
  flex: 1;
}

.adp-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #cbd5e1;
}

.adp-label-split {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}

.adp-input-box {
  position: relative;
  display: flex;
  align-items: center;
}

.adp-input-box--relative {
  position: relative;
}

.adp-input-ico {
  position: absolute;
  left: 12px;
  color: #64748b;
  pointer-events: none;
}

.adp-input {
  width: 100%;
  height: 38px;
  padding: 0 14px 0 36px;
  background: rgba(10, 15, 26, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #ffffff;
  font-size: 0.85rem;
  transition: all 0.15s ease;
  box-sizing: border-box;
}

.adp-input:focus {
  outline: none;
  border-color: #ff4000;
  box-shadow: 0 0 0 2px rgba(255, 64, 0, 0.2);
}

.adp-input--pass {
  padding-right: 42px;
}

.adp-textarea {
  width: 100%;
  padding: 10px 14px;
  background: rgba(10, 15, 26, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #ffffff;
  font-size: 0.85rem;
  resize: vertical;
  box-sizing: border-box;
}

.adp-textarea:focus {
  outline: none;
  border-color: #ff4000;
  box-shadow: 0 0 0 2px rgba(255, 64, 0, 0.2);
}

.adp-hint {
  font-size: 0.72rem;
  color: #64748b;
  line-height: 1.35;
}

.adp-counter-hint {
  font-size: 0.7rem;
  color: #64748b;
  font-weight: 600;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.adp-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.adp-eye-btn {
  position: absolute;
  right: 8px;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  color: #64748b;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color 0.15s;
}

.adp-eye-btn:hover {
  color: #ffffff;
}

.adp-mini-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  color: #818cf8;
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  padding: 2px 7px;
  transition: all 0.15s ease;
  text-decoration: none;
}

.adp-mini-link-btn:hover {
  color: #c7d2fe;
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.15);
}

.adp-mini-link-btn--danger {
  color: #f87171;
  border-color: rgba(239, 68, 68, 0.25);
}

.adp-mini-link-btn--danger:hover {
  color: #fca5a5;
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.35);
}

.adp-inline-actions {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

/* ── Avatar Presets Bar ── */
.adp-avatar-presets {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 6px;
}

.adp-preset-label {
  font-size: 0.7rem;
  color: #64748b;
  font-weight: 600;
}

.adp-preset-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #cbd5e1;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.adp-preset-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.2);
}

.adp-preset-btn--clear {
  color: #f87171;
  border-color: rgba(239, 68, 68, 0.3);
}

.adp-preset-btn--clear:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #ffffff;
}

/* ── Password Strength Bar ── */
.adp-pass-strength {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 4px;
}

.adp-pass-strength-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.adp-pass-strength-label {
  font-size: 0.7rem;
  color: #94a3b8;
}

.adp-pass-strength-val {
  font-size: 0.72rem;
  font-weight: 700;
}

.adp-strength-track {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  overflow: hidden;
}

.adp-strength-bar {
  height: 100%;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.adp-sec-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 8px;
  font-size: 0.75rem;
  color: #fde68a;
  line-height: 1.4;
}

/* ── 2FA Status Box ── */
.adp-2fa-status-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 18px 20px;
  border-radius: 10px;
  border: 1px solid;
  flex-wrap: wrap;
}

.adp-2fa--active {
  background: rgba(16, 185, 129, 0.06);
  border-color: rgba(16, 185, 129, 0.25);
}

.adp-2fa--inactive {
  background: rgba(239, 68, 68, 0.06);
  border-color: rgba(239, 68, 68, 0.25);
}

.adp-2fa-status-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 240px;
}

.adp-2fa-icon-circle {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.adp-2fa--active .adp-2fa-icon-circle {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

.adp-2fa--inactive .adp-2fa-icon-circle {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.adp-2fa-title {
  font-size: 0.92rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 3px;
}

.adp-2fa-desc {
  font-size: 0.75rem;
  color: #94a3b8;
  line-height: 1.4;
}

.adp-2fa-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

/* ── Session Metrics ── */
.adp-session-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.adp-session-item {
  padding: 12px 14px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.adp-session-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.5px;
}

.adp-session-val {
  font-size: 0.8rem;
  color: #cbd5e1;
}

/* ── Root Super Admin Immunity Banner (Zero Glow) ── */
.adp-root-banner {
  position: relative;
  background: rgba(255, 64, 0, 0.08);
  border: 1px solid rgba(255, 64, 0, 0.25);
  border-radius: 12px;
  padding: 18px 22px;
  overflow: hidden;
}

.adp-root-banner-inner {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 1;
}

.adp-root-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(255, 64, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.adp-root-banner-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: #ff6b00;
  margin: 0 0 3px 0;
  letter-spacing: 0.5px;
}

.adp-root-banner-desc {
  font-size: 0.78rem;
  color: #fed7aa;
  margin: 0;
  line-height: 1.45;
}

/* ── RBAC Filter Toolbar ── */
.adp-filter-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 10px 14px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
}

.adp-filter-pills {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.adp-filter-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 11px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  font-size: 0.74rem;
  font-weight: 600;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.15s ease;
}

.adp-filter-pill:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

.adp-filter-pill--active {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.25);
}

.adp-pill-count {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.35);
}

/* ── Permissions Grid ── */
.adp-perms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}

.adp-perm-card {
  background: rgba(10, 15, 26, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.15s ease;
}

.adp-perm-card--active {
  background: rgba(15, 23, 42, 0.8);
  border-color: rgba(255, 255, 255, 0.12);
}

.adp-perm-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.adp-perm-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.adp-perm-badge {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 2px 7px;
  border-radius: 4px;
}

.adp-perm-badge--yes {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

.adp-perm-badge--no {
  background: rgba(255, 255, 255, 0.05);
  color: #64748b;
}

.adp-perm-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
}

.adp-perm-desc {
  font-size: 0.7rem;
  color: #94a3b8;
  margin: 0;
  line-height: 1.35;
}

/* ── Right Column: Sticky Preview (Calculated Elevation, Zero Glow) ── */
.adp-sticky-card {
  position: sticky;
  top: 90px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.adp-preview-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}

.adp-preview-tag {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: #64748b;
}

.adp-live-pulse {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: none;
  border: 1px solid rgba(16, 185, 129, 0.4);
}

.adp-live-team-card {
  position: relative;
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.adp-live-avatar-box {
  position: relative;
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: #090d16;
  border: 2px solid rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 12px;
}

.adp-live-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.adp-live-avatar-placeholder {
  font-size: 1.6rem;
  font-weight: 800;
}

.adp-live-online-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #10b981;
  border: 2px solid #090d16;
}

.adp-live-name {
  font-size: 1.15rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 2px 0;
}

.adp-live-username {
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 10px;
}

.adp-live-role-badge {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 3px 10px;
  border-radius: 6px;
  border: 1px solid;
  margin-bottom: 12px;
}

.adp-live-bio {
  font-size: 0.78rem;
  color: #94a3b8;
  line-height: 1.45;
  margin: 0 0 16px 0;
}

.adp-live-links {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.adp-live-link-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.05);
}

.adp-sidebar-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* ── Buttons (Sharp & Calculated) ── */
.adp-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  height: 38px;
  padding: 0 16px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #f1f5f9;
}

.adp-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.14);
}

.adp-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.adp-btn--sm {
  height: 30px;
  padding: 0 11px;
  font-size: 0.75rem;
  gap: 5px;
}

.adp-btn--ghost {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
}

.adp-btn--ghost:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.2);
}

.adp-btn--primary {
  background: #ff4000;
  border-color: #ff5500;
  color: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.adp-btn--primary:hover:not(:disabled) {
  background: #ff5500;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
}

.adp-btn--danger {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
  color: #fca5a5;
}

.adp-btn--danger:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.25);
  color: #ffffff;
}

.adp-btn--full {
  width: 100%;
}

/* ── 2FA Modal ── */
.adp-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.adp-modal-card {
  width: 100%;
  max-width: 440px;
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
}

.adp-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.25);
}

.adp-modal-pretitle {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: #ff5500;
}

.adp-modal-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #ffffff;
  margin: 2px 0 0 0;
}

.adp-modal-close {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.15s;
}

.adp-modal-close:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
}

.adp-modal-body {
  padding: 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.adp-modal-instructions {
  font-size: 0.8rem;
  color: #94a3b8;
  line-height: 1.45;
  margin: 0;
}

.adp-qr-container {
  width: 190px;
  height: 190px;
  border-radius: 12px;
  background: #ffffff;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}

.adp-qr-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.adp-qr-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.adp-secret-block {
  width: 100%;
  padding: 10px 14px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.adp-secret-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.adp-secret-label {
  font-size: 0.68rem;
  color: #64748b;
}

.adp-copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  color: #ff5500;
  font-size: 0.68rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
}

.adp-secret-text {
  font-size: 0.82rem;
  font-weight: 700;
  color: #cbd5e1;
  letter-spacing: 1.5px;
}

.adp-otp-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.adp-otp-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #cbd5e1;
}

.adp-otp-inputs {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.adp-otp-digit {
  width: 44px;
  height: 52px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: #ffffff;
  font-size: 1.4rem;
  font-weight: 800;
  text-align: center;
  font-family: monospace;
  transition: all 0.15s ease;
}

.adp-otp-digit:focus {
  outline: none;
  border-color: #ff4000;
  box-shadow: 0 0 0 3px rgba(255, 64, 0, 0.2);
  background: rgba(255, 64, 0, 0.05);
}

.adp-modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 22px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.25);
}

/* ── Animation & Responsive ── */
.adp-spin {
  animation: adp-rotate 1s linear infinite;
}

@keyframes adp-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 1024px) {
  .adp-grid {
    grid-template-columns: 1fr;
  }
  .adp-sticky-card {
    position: static;
  }
}

@media (max-width: 768px) {
  .adp-wrapper {
    padding: 16px;
  }
  .adp-hero-card {
    flex-direction: column;
    align-items: flex-start;
  }
  .adp-hero-right {
    width: 100%;
    flex-direction: column;
  }
  .adp-stat-card {
    width: 100%;
  }
  .adp-form-row {
    flex-direction: column;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   LIGHT THEME STYLING FOR ADMIN PROFILE
   ═══════════════════════════════════════════════════════════════════════════ */

.adp--light,
:global([data-theme="light"]) .adp-wrapper,
:global(html:not(.dark)) .adp-wrapper {
  color: #0f172a;
}

.adp--light .adp-loading-text,
:global([data-theme="light"]) .adp-loading-text,
:global(html:not(.dark)) .adp-loading-text {
  color: #64748b;
}

.adp--light .adp-title,
:global([data-theme="light"]) .adp-title,
:global(html:not(.dark)) .adp-title {
  color: #0f172a;
}

.adp--light .adp-subtitle,
:global([data-theme="light"]) .adp-subtitle,
:global(html:not(.dark)) .adp-subtitle {
  color: #475569;
}

.adp--light .adp-tag,
:global([data-theme="light"]) .adp-tag,
:global(html:not(.dark)) .adp-tag {
  background: #f1f5f9;
  color: #475569;
  border-color: #cbd5e1;
}

.adp--light .adp-tag--accent,
:global([data-theme="light"]) .adp-tag--accent,
:global(html:not(.dark)) .adp-tag--accent {
  background: rgba(255, 64, 0, 0.08);
  color: #ea580c;
  border-color: rgba(255, 64, 0, 0.25);
}

.adp--light .adp-hero-card,
:global([data-theme="light"]) .adp-hero-card,
:global(html:not(.dark)) .adp-hero-card {
  background: #ffffff;
  border-color: #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.adp--light .adp-avatar-frame,
:global([data-theme="light"]) .adp-avatar-frame,
:global(html:not(.dark)) .adp-avatar-frame {
  background: #f8fafc;
  border: 2px solid #ff4000;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.adp--light .adp-avatar-badge,
:global([data-theme="light"]) .adp-avatar-badge,
:global(html:not(.dark)) .adp-avatar-badge {
  border: 2px solid #ffffff;
}

.adp--light .adp-hero-name,
:global([data-theme="light"]) .adp-hero-name,
:global(html:not(.dark)) .adp-hero-name {
  color: #0f172a;
}

.adp--light .adp-hero-meta-row,
:global([data-theme="light"]) .adp-hero-meta-row,
:global(html:not(.dark)) .adp-hero-meta-row {
  color: #64748b;
}

.adp--light .adp-inline-copy-btn,
:global([data-theme="light"]) .adp-inline-copy-btn,
:global(html:not(.dark)) .adp-inline-copy-btn {
  border-color: #cbd5e1;
  color: #64748b;
}

.adp--light .adp-inline-copy-btn:hover,
:global([data-theme="light"]) .adp-inline-copy-btn:hover,
:global(html:not(.dark)) .adp-inline-copy-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
  border-color: #94a3b8;
}

.adp--light .adp-hero-bio,
:global([data-theme="light"]) .adp-hero-bio,
:global(html:not(.dark)) .adp-hero-bio {
  color: #475569;
}

.adp--light .adp-stat-card,
:global([data-theme="light"]) .adp-stat-card,
:global(html:not(.dark)) .adp-stat-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}

.adp--light .adp-stat-label,
:global([data-theme="light"]) .adp-stat-label,
:global(html:not(.dark)) .adp-stat-label {
  color: #64748b;
}

.adp--light .adp-stat-val,
:global([data-theme="light"]) .adp-stat-val,
:global(html:not(.dark)) .adp-stat-val {
  color: #0f172a;
}

.adp--light .adp-stat-desc,
:global([data-theme="light"]) .adp-stat-desc,
:global(html:not(.dark)) .adp-stat-desc {
  color: #64748b;
}

.adp--light .adp-stat-action-btn,
:global([data-theme="light"]) .adp-stat-action-btn,
:global(html:not(.dark)) .adp-stat-action-btn {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #334155;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.adp--light .adp-stat-action-btn:hover,
:global([data-theme="light"]) .adp-stat-action-btn:hover,
:global(html:not(.dark)) .adp-stat-action-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
  border-color: #94a3b8;
}

.adp--light .adp-stat-action-btn--primary,
:global([data-theme="light"]) .adp-stat-action-btn--primary,
:global(html:not(.dark)) .adp-stat-action-btn--primary {
  background: rgba(255, 64, 0, 0.08);
  border-color: rgba(255, 64, 0, 0.3);
  color: #ea580c;
}

.adp--light .adp-stat-action-btn--primary:hover,
:global([data-theme="light"]) .adp-stat-action-btn--primary:hover,
:global(html:not(.dark)) .adp-stat-action-btn--primary:hover {
  background: #ff4000;
  color: #ffffff;
}

.adp--light .adp-nav-tabs,
:global([data-theme="light"]) .adp-nav-tabs,
:global(html:not(.dark)) .adp-nav-tabs {
  background: #f1f5f9;
  border-color: #e2e8f0;
}

.adp--light .adp-tab-btn,
:global([data-theme="light"]) .adp-tab-btn,
:global(html:not(.dark)) .adp-tab-btn {
  color: #64748b;
}

.adp--light .adp-tab-btn:hover,
:global([data-theme="light"]) .adp-tab-btn:hover,
:global(html:not(.dark)) .adp-tab-btn:hover {
  color: #0f172a;
  background: rgba(255, 255, 255, 0.85);
}

.adp--light .adp-tab-btn--active,
:global([data-theme="light"]) .adp-tab-btn--active,
:global(html:not(.dark)) .adp-tab-btn--active {
  color: #ffffff;
  background: #ff4000;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
}

.adp--light .adp-tab-count,
:global([data-theme="light"]) .adp-tab-count,
:global(html:not(.dark)) .adp-tab-count {
  background: #e2e8f0;
  color: #334155;
}

.adp--light .adp-card,
:global([data-theme="light"]) .adp-card,
:global(html:not(.dark)) .adp-card {
  background: #ffffff;
  border-color: #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.adp--light .adp-card-head,
:global([data-theme="light"]) .adp-card-head,
:global(html:not(.dark)) .adp-card-head {
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.adp--light .adp-card-title,
:global([data-theme="light"]) .adp-card-title,
:global(html:not(.dark)) .adp-card-title {
  color: #0f172a;
}

.adp--light .adp-card-desc,
:global([data-theme="light"]) .adp-card-desc,
:global(html:not(.dark)) .adp-card-desc {
  color: #64748b;
}

.adp--light .adp-card-footer,
:global([data-theme="light"]) .adp-card-footer,
:global(html:not(.dark)) .adp-card-footer {
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.adp--light .adp-label,
:global([data-theme="light"]) .adp-label,
:global(html:not(.dark)) .adp-label {
  color: #334155;
}

.adp--light .adp-input-ico,
:global([data-theme="light"]) .adp-input-ico,
:global(html:not(.dark)) .adp-input-ico {
  color: #94a3b8;
}

.adp--light .adp-input,
:global([data-theme="light"]) .adp-input,
:global(html:not(.dark)) .adp-input,
.adp--light .adp-textarea,
:global([data-theme="light"]) .adp-textarea,
:global(html:not(.dark)) .adp-textarea {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  color: #0f172a;
}

.adp--light .adp-input:focus,
:global([data-theme="light"]) .adp-input:focus,
:global(html:not(.dark)) .adp-input:focus,
.adp--light .adp-textarea:focus,
:global([data-theme="light"]) .adp-textarea:focus,
:global(html:not(.dark)) .adp-textarea:focus {
  background: #ffffff;
  border-color: #ff4000;
  box-shadow: 0 0 0 2px rgba(255, 64, 0, 0.15);
}

.adp--light .adp-input:disabled,
:global([data-theme="light"]) .adp-input:disabled,
:global(html:not(.dark)) .adp-input:disabled {
  background: #f1f5f9;
  border-color: #e2e8f0;
  color: #94a3b8;
}

.adp--light .adp-hint,
:global([data-theme="light"]) .adp-hint,
:global(html:not(.dark)) .adp-hint {
  color: #64748b;
}

.adp--light .adp-counter-hint,
:global([data-theme="light"]) .adp-counter-hint,
:global(html:not(.dark)) .adp-counter-hint {
  color: #64748b;
}

.adp--light .adp-eye-btn,
:global([data-theme="light"]) .adp-eye-btn,
:global(html:not(.dark)) .adp-eye-btn {
  color: #64748b;
}

.adp--light .adp-eye-btn:hover,
:global([data-theme="light"]) .adp-eye-btn:hover,
:global(html:not(.dark)) .adp-eye-btn:hover {
  color: #0f172a;
}

.adp--light .adp-mini-link-btn,
:global([data-theme="light"]) .adp-mini-link-btn,
:global(html:not(.dark)) .adp-mini-link-btn {
  border-color: #cbd5e1;
  color: #4f46e5;
}

.adp--light .adp-mini-link-btn:hover,
:global([data-theme="light"]) .adp-mini-link-btn:hover,
:global(html:not(.dark)) .adp-mini-link-btn:hover {
  color: #3730a3;
  background: #f1f5f9;
  border-color: #94a3b8;
}

.adp--light .adp-mini-link-btn--danger,
:global([data-theme="light"]) .adp-mini-link-btn--danger,
:global(html:not(.dark)) .adp-mini-link-btn--danger {
  color: #dc2626;
  border-color: rgba(239, 68, 68, 0.3);
}

.adp--light .adp-mini-link-btn--danger:hover,
:global([data-theme="light"]) .adp-mini-link-btn--danger:hover,
:global(html:not(.dark)) .adp-mini-link-btn--danger:hover {
  background: rgba(239, 68, 68, 0.08);
  color: #b91c1c;
  border-color: rgba(239, 68, 68, 0.5);
}

.adp--light .adp-preset-label,
:global([data-theme="light"]) .adp-preset-label,
:global(html:not(.dark)) .adp-preset-label {
  color: #64748b;
}

.adp--light .adp-preset-btn,
:global([data-theme="light"]) .adp-preset-btn,
:global(html:not(.dark)) .adp-preset-btn {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #334155;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.adp--light .adp-preset-btn:hover:not(:disabled),
:global([data-theme="light"]) .adp-preset-btn:hover:not(:disabled),
:global(html:not(.dark)) .adp-preset-btn:hover:not(:disabled) {
  background: #f1f5f9;
  color: #0f172a;
  border-color: #94a3b8;
}

.adp--light .adp-preset-btn--clear,
:global([data-theme="light"]) .adp-preset-btn--clear,
:global(html:not(.dark)) .adp-preset-btn--clear {
  color: #dc2626;
  border-color: rgba(239, 68, 68, 0.3);
}

.adp--light .adp-preset-btn--clear:hover,
:global([data-theme="light"]) .adp-preset-btn--clear:hover,
:global(html:not(.dark)) .adp-preset-btn--clear:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #b91c1c;
}

.adp--light .adp-strength-track,
:global([data-theme="light"]) .adp-strength-track,
:global(html:not(.dark)) .adp-strength-track {
  background: #e2e8f0;
}

.adp--light .adp-pass-strength-label,
:global([data-theme="light"]) .adp-pass-strength-label,
:global(html:not(.dark)) .adp-pass-strength-label {
  color: #64748b;
}

.adp--light .adp-sec-notice,
:global([data-theme="light"]) .adp-sec-notice,
:global(html:not(.dark)) .adp-sec-notice {
  background: rgba(245, 158, 11, 0.07);
  border: 1px solid rgba(245, 158, 11, 0.25);
  color: #b45309;
}

.adp--light .adp-2fa-status-card,
:global([data-theme="light"]) .adp-2fa-status-card,
:global(html:not(.dark)) .adp-2fa-status-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}

.adp--light .adp-2fa--active,
:global([data-theme="light"]) .adp-2fa--active,
:global(html:not(.dark)) .adp-2fa--active {
  background: rgba(16, 185, 129, 0.06);
  border-color: rgba(16, 185, 129, 0.25);
}

.adp--light .adp-2fa--inactive,
:global([data-theme="light"]) .adp-2fa--inactive,
:global(html:not(.dark)) .adp-2fa--inactive {
  background: rgba(239, 68, 68, 0.04);
  border-color: rgba(239, 68, 68, 0.2);
}

.adp--light .adp-2fa-title,
:global([data-theme="light"]) .adp-2fa-title,
:global(html:not(.dark)) .adp-2fa-title {
  color: #0f172a;
}

.adp--light .adp-2fa-desc,
:global([data-theme="light"]) .adp-2fa-desc,
:global(html:not(.dark)) .adp-2fa-desc {
  color: #64748b;
}

.adp--light .adp-session-item,
:global([data-theme="light"]) .adp-session-item,
:global(html:not(.dark)) .adp-session-item {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.adp--light .adp-session-label,
:global([data-theme="light"]) .adp-session-label,
:global(html:not(.dark)) .adp-session-label {
  color: #64748b;
}

.adp--light .adp-session-val,
:global([data-theme="light"]) .adp-session-val,
:global(html:not(.dark)) .adp-session-val {
  color: #334155;
}

.adp--light .adp-root-banner,
:global([data-theme="light"]) .adp-root-banner,
:global(html:not(.dark)) .adp-root-banner {
  background: linear-gradient(135deg, rgba(255, 64, 0, 0.06) 0%, rgba(245, 158, 11, 0.04) 100%);
  border: 1px solid rgba(255, 64, 0, 0.25);
}

.adp--light .adp-root-banner-title,
:global([data-theme="light"]) .adp-root-banner-title,
:global(html:not(.dark)) .adp-root-banner-title {
  color: #c2410c;
}

.adp--light .adp-root-banner-desc,
:global([data-theme="light"]) .adp-root-banner-desc,
:global(html:not(.dark)) .adp-root-banner-desc {
  color: #431407;
}

.adp--light .adp-filter-toolbar,
:global([data-theme="light"]) .adp-filter-toolbar,
:global(html:not(.dark)) .adp-filter-toolbar {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.adp--light .adp-filter-pill,
:global([data-theme="light"]) .adp-filter-pill,
:global(html:not(.dark)) .adp-filter-pill {
  border-color: #cbd5e1;
  color: #64748b;
}

.adp--light .adp-filter-pill:hover,
:global([data-theme="light"]) .adp-filter-pill:hover,
:global(html:not(.dark)) .adp-filter-pill:hover {
  background: #ffffff;
  color: #0f172a;
}

.adp--light .adp-filter-pill--active,
:global([data-theme="light"]) .adp-filter-pill--active,
:global(html:not(.dark)) .adp-filter-pill--active {
  background: #ffffff;
  color: #0f172a;
  border-color: #94a3b8;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.adp--light .adp-pill-count,
:global([data-theme="light"]) .adp-pill-count,
:global(html:not(.dark)) .adp-pill-count {
  background: #e2e8f0;
  color: #334155;
}

.adp--light .adp-perm-card,
:global([data-theme="light"]) .adp-perm-card,
:global(html:not(.dark)) .adp-perm-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.adp--light .adp-perm-card--active,
:global([data-theme="light"]) .adp-perm-card--active,
:global(html:not(.dark)) .adp-perm-card--active {
  background: #ffffff;
  border-color: #cbd5e1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}

.adp--light .adp-perm-title,
:global([data-theme="light"]) .adp-perm-title,
:global(html:not(.dark)) .adp-perm-title {
  color: #0f172a;
}

.adp--light .adp-perm-desc,
:global([data-theme="light"]) .adp-perm-desc,
:global(html:not(.dark)) .adp-perm-desc {
  color: #64748b;
}

.adp--light .adp-perm-badge--no,
:global([data-theme="light"]) .adp-perm-badge--no,
:global(html:not(.dark)) .adp-perm-badge--no {
  background: #e2e8f0;
  color: #64748b;
}

.adp--light .adp-preview-tag,
:global([data-theme="light"]) .adp-preview-tag,
:global(html:not(.dark)) .adp-preview-tag {
  color: #64748b;
}

.adp--light .adp-live-team-card,
:global([data-theme="light"]) .adp-live-team-card,
:global(html:not(.dark)) .adp-live-team-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.adp--light .adp-live-avatar-box,
:global([data-theme="light"]) .adp-live-avatar-box,
:global(html:not(.dark)) .adp-live-avatar-box {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
}

.adp--light .adp-live-online-dot,
:global([data-theme="light"]) .adp-live-online-dot,
:global(html:not(.dark)) .adp-live-online-dot {
  border: 2px solid #ffffff;
}

.adp--light .adp-live-name,
:global([data-theme="light"]) .adp-live-name,
:global(html:not(.dark)) .adp-live-name {
  color: #0f172a;
}

.adp--light .adp-live-username,
:global([data-theme="light"]) .adp-live-username,
:global(html:not(.dark)) .adp-live-username {
  color: #64748b;
}

.adp--light .adp-live-bio,
:global([data-theme="light"]) .adp-live-bio,
:global(html:not(.dark)) .adp-live-bio {
  color: #475569;
}

.adp--light .adp-live-link-chip,
:global([data-theme="light"]) .adp-live-link-chip,
:global(html:not(.dark)) .adp-live-link-chip {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #334155;
}

.adp--light .adp-btn,
:global([data-theme="light"]) .adp-btn,
:global(html:not(.dark)) .adp-btn {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #334155;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.adp--light .adp-btn:hover:not(:disabled),
:global([data-theme="light"]) .adp-btn:hover:not(:disabled),
:global(html:not(.dark)) .adp-btn:hover:not(:disabled) {
  background: #f8fafc;
  color: #0f172a;
  border-color: #94a3b8;
}

.adp--light .adp-btn--ghost,
:global([data-theme="light"]) .adp-btn--ghost,
:global(html:not(.dark)) .adp-btn--ghost {
  background: transparent;
  border-color: #cbd5e1;
  color: #334155;
}

.adp--light .adp-btn--ghost:hover:not(:disabled),
:global([data-theme="light"]) .adp-btn--ghost:hover:not(:disabled),
:global(html:not(.dark)) .adp-btn--ghost:hover:not(:disabled) {
  background: #f1f5f9;
  color: #0f172a;
  border-color: #94a3b8;
}

.adp--light .adp-btn--primary,
:global([data-theme="light"]) .adp-btn--primary,
:global(html:not(.dark)) .adp-btn--primary {
  background: #ff4000;
  border-color: #ff5500;
  color: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
}

.adp--light .adp-btn--primary:hover:not(:disabled),
:global([data-theme="light"]) .adp-btn--primary:hover:not(:disabled),
:global(html:not(.dark)) .adp-btn--primary:hover:not(:disabled) {
  background: #ff5500;
  color: #ffffff;
}

/* 2FA Teleported Modal Light Mode */
.adp-modal-backdrop--light,
:global([data-theme="light"]) .adp-modal-backdrop,
:global(html:not(.dark)) .adp-modal-backdrop {
  background: rgba(15, 23, 42, 0.55);
}

.adp-modal-card--light,
:global([data-theme="light"]) .adp-modal-card,
:global(html:not(.dark)) .adp-modal-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.adp-modal-card--light .adp-modal-header,
:global([data-theme="light"]) .adp-modal-header,
:global(html:not(.dark)) .adp-modal-header {
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.adp-modal-card--light .adp-modal-title,
:global([data-theme="light"]) .adp-modal-title,
:global(html:not(.dark)) .adp-modal-title {
  color: #0f172a;
}

.adp-modal-card--light .adp-modal-close,
:global([data-theme="light"]) .adp-modal-close,
:global(html:not(.dark)) .adp-modal-close {
  color: #64748b;
}

.adp-modal-card--light .adp-modal-close:hover,
:global([data-theme="light"]) .adp-modal-close:hover,
:global(html:not(.dark)) .adp-modal-close:hover {
  color: #0f172a;
  background: #f1f5f9;
}

.adp-modal-card--light .adp-modal-instructions,
:global([data-theme="light"]) .adp-modal-instructions,
:global(html:not(.dark)) .adp-modal-instructions {
  color: #475569;
}

.adp-modal-card--light .adp-qr-container,
:global([data-theme="light"]) .adp-qr-container,
:global(html:not(.dark)) .adp-qr-container {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.adp-modal-card--light .adp-secret-block,
:global([data-theme="light"]) .adp-secret-block,
:global(html:not(.dark)) .adp-secret-block {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
}

.adp-modal-card--light .adp-secret-text,
:global([data-theme="light"]) .adp-secret-text,
:global(html:not(.dark)) .adp-secret-text {
  color: #0f172a;
}

.adp-modal-card--light .adp-otp-label,
:global([data-theme="light"]) .adp-otp-label,
:global(html:not(.dark)) .adp-otp-label {
  color: #334155;
}

.adp-modal-card--light .adp-otp-digit,
:global([data-theme="light"]) .adp-otp-digit,
:global(html:not(.dark)) .adp-otp-digit {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  color: #0f172a;
}

.adp-modal-card--light .adp-otp-digit:focus,
:global([data-theme="light"]) .adp-otp-digit:focus,
:global(html:not(.dark)) .adp-otp-digit:focus {
  background: #ffffff;
  border-color: #ff4000;
  box-shadow: 0 0 0 3px rgba(255, 64, 0, 0.15);
}

.adp-modal-card--light .adp-modal-footer,
:global([data-theme="light"]) .adp-modal-footer,
:global(html:not(.dark)) .adp-modal-footer {
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}
</style>
