<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';

/* ── types ──────────────────────────────────────────────────────────── */
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
  role: 'root_admin' | 'doc_lead' | 'content_editor' | 'moderator' | 'viewer' | 'security_auditor' | 'custom';
  customTitle?: string;
  avatarUrl?: string;
  avatarColor: string;
  bio?: string;
  discord?: string;
  steamId?: string;
  githubUsername?: string;
  status: 'active' | 'suspended';
  isRoot: boolean;
  createdAt: string;
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
    title: 'Telemetrie, AI & Baze de Date',
    subtitle: 'Vizualizare statistici căutare, telemetrie AI, metrici și audit',
    icon: 'lucide:search',
    accent: '#a855f7',
    modules: [
      { key: 'canViewAnalytics', name: 'Search Telemetry', desc: 'Analiză căutări, termeni populari & trends', icon: 'lucide:search', color: '#a855f7' },
      { key: 'canViewAiStats', name: 'AI Engine Telemetry', desc: 'Consum tokeni, latență și incidente AI', icon: 'lucide:cpu', color: '#ec4899' },
      { key: 'canManageDb', name: 'Database & Metrics', desc: 'Monitorizare stocare și sincronizare Supabase', icon: 'lucide:database', color: '#06b6d4' },
      { key: 'canViewAudit', name: 'Audit Ledger', desc: 'Registru criptografic SHA-256 al acțiunilor', icon: 'lucide:scroll-text', color: '#f59e0b' },
    ],
  },
  {
    title: 'Securitate, API & Infrastructură',
    subtitle: 'Autentificare 2FA, tokeni de acces, backup-uri și setări platformă',
    icon: 'lucide:shield-check',
    accent: '#3b82f6',
    modules: [
      { key: 'canManageSecurity', name: 'Securitate 2FA', desc: 'Configurare TOTP și revocare forțată sesiuni', icon: 'lucide:shield-check', color: '#3b82f6' },
      { key: 'canManageApiKeys', name: 'API Tokens', desc: 'Generare și revocare chei de acces REST', icon: 'lucide:key', color: '#6366f1' },
      { key: 'canManageSnapshots', name: 'Snapshot Vault', desc: 'Creare backup-uri și descărcare bundle complet', icon: 'lucide:archive', color: '#10b981' },
      { key: 'canManageWebhooks', name: 'Discord Webhooks', desc: 'Configurare stream-uri de notificare pe Discord', icon: 'lucide:webhook', color: '#f97316' },
      { key: 'canManageSettings', name: 'Engine Settings', desc: 'Mod mentenanță, titluri, bannere & config', icon: 'lucide:sliders', color: '#ff6b00' },
    ],
  },
  {
    title: 'Discord Bot Suite',
    subtitle: 'Integrare bot Discord, monitorizare tickete, staff și log-uri',
    icon: 'lucide:bot',
    accent: '#5865F2',
    modules: [
      { key: 'canManageDiscordBot', name: 'Discord Bot Dashboard', desc: 'Control centralizat tickete, moderare și roluri', icon: 'lucide:bot', color: '#5865F2' },
    ],
  },
  {
    title: 'Comenzi Restricționate Root Super Admin',
    subtitle: 'Privilegii de nivel înalt cu imunitate completă și izolare de securitate',
    icon: 'lucide:shield-alert',
    accent: '#ef4444',
    modules: [
      { key: 'canManageTeam', name: 'Gestiune Echipă & Roluri', desc: 'Adăugare, editare și revocare permisiuni administratori', icon: 'lucide:users', color: '#f59e0b', isRestricted: true },
      { key: 'canTriggerPanic', name: 'Panic Lockdown', desc: 'Blocare instantanee a platformei în caz de urgență', icon: 'lucide:shield-alert', color: '#ef4444', isRestricted: true },
    ],
  },
];

const props = defineProps<{
  user?: any;
}>();

/* ── state ──────────────────────────────────────────────────────────── */
const loading = ref<boolean>(true);
const saving = ref<boolean>(false);
const profile = ref<Partial<TeamMember> | null>(null);
const statusMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null);

const formData = ref({
  displayName: '',
  email: '',
  bio: '',
  avatarUrl: '',
  discord: '',
  steamId: '',
  githubUsername: '',
  password: '',
});
const showProfilePassword = ref(false);

// Steam resolver state
const resolvingSteam = ref<boolean>(false);
const steamMessage = ref<string | null>(null);

// 2FA modal state
const show2FAModal = ref<boolean>(false);
const qrCodeData = ref<string | null>(null);
const totpSecret = ref<string | null>(null);
const verifyCode = ref<string>('');
const twoFAActionLoading = ref<boolean>(false);

/* ── fetch profile ──────────────────────────────────────────────────── */
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
        };
      }
    }
  } catch (err) {
    console.error('Failed to fetch profile:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchProfile();
});

/* ── save profile ───────────────────────────────────────────────────── */
async function handleSave() {
  saving.value = true;
  statusMessage.value = null;

  try {
    const res = await fetch('/api/admin/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData.value),
    });

    const data = await res.json();
    if (data.success) {
      statusMessage.value = { type: 'success', text: 'Profilul a fost actualizat cu succes!' };
      profile.value = data.profile;
      formData.value.password = '';
      formData.value.avatarUrl = data.profile.avatarUrl || formData.value.avatarUrl;
      window.dispatchEvent(new Event('admin-profile-updated'));
    } else {
      statusMessage.value = { type: 'error', text: data.message || 'Eroare la salvare.' };
    }
  } catch (err) {
    statusMessage.value = { type: 'error', text: 'Eroare de conexiune la rețea.' };
  } finally {
    saving.value = false;
  }
}

/* ── steam avatar resolver ──────────────────────────────────────────── */
async function resolveSteamAvatar() {
  const query = formData.value.steamId.trim();
  if (!query) {
    steamMessage.value = 'Introduceți un Steam ID64 sau link de profil Steam mai întâi.';
    return;
  }

  resolvingSteam.value = true;
  steamMessage.value = null;

  try {
    const res = await fetch(`/api/steam/avatar?id=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (res.ok && data.avatarUrl) {
      formData.value.avatarUrl = data.avatarUrl;
      steamMessage.value = 'Avatar Steam preluat cu succes!';
      setTimeout(() => {
        steamMessage.value = null;
      }, 4000);
    } else {
      steamMessage.value = data.error || 'Nu s-a putut găsi avatarul Steam.';
    }
  } catch (err) {
    steamMessage.value = 'Eroare la conectarea la serviciul Steam.';
  } finally {
    resolvingSteam.value = false;
  }
}

/* ── 2FA handlers ───────────────────────────────────────────────────── */
async function handleDisable2FA() {
  if (!confirm('Ești sigur că vrei să dezactivezi 2FA? Contul tău va fi mai puțin sigur.')) return;
  twoFAActionLoading.value = true;
  try {
    const res = await fetch('/api/admin/profile/2fa', { method: 'DELETE' });
    if (res.ok) {
      if (profile.value) profile.value.totpEnabled = false;
      statusMessage.value = { type: 'success', text: '2FA a fost dezactivat cu succes.' };
    } else {
      const d = await res.json();
      statusMessage.value = { type: 'error', text: d.message || 'Eroare la dezactivare.' };
    }
  } catch (err) {
    statusMessage.value = { type: 'error', text: 'Eroare de conexiune.' };
  } finally {
    twoFAActionLoading.value = false;
  }
}

async function handleEnable2FA() {
  twoFAActionLoading.value = true;
  try {
    const res = await fetch('/api/admin/profile/2fa', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      qrCodeData.value = data.qrCode;
      totpSecret.value = data.secret;
      show2FAModal.value = true;
    } else {
      statusMessage.value = { type: 'error', text: data.message || 'Eroare la generare 2FA.' };
    }
  } catch (err) {
    statusMessage.value = { type: 'error', text: 'Eroare de conexiune.' };
  } finally {
    twoFAActionLoading.value = false;
  }
}

async function handleVerify2FA() {
  if (!verifyCode.value || verifyCode.value.length !== 6) return;
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
      verifyCode.value = '';
      statusMessage.value = { type: 'success', text: '2FA a fost activat cu succes!' };
    } else {
      alert(data.message || 'Cod invalid');
    }
  } catch (err) {
    alert('Eroare de conexiune.');
  } finally {
    twoFAActionLoading.value = false;
  }
}

function handleVerifyCodeInput(e: Event) {
  const target = e.target as HTMLInputElement;
  verifyCode.value = target.value.replace(/\D/g, '').slice(0, 6);
}

/* ── active permissions list ────────────────────────────────────────── */
const activePermissions = computed(() => {
  if (!profile.value) return [];
  const isRoot = profile.value.isRoot;
  const userPerms = profile.value.permissions || {};

  const allModules = PERMISSION_GROUPS.flatMap((g) => g.modules);
  return allModules.filter((mod) => {
    return isRoot || Boolean(userPerms[mod.key]);
  });
});
</script>

<template>
  <div v-if="loading" class="admin-page-container admin-profile-loading-wrapper">
    <div class="admin-profile-loading-content">
      <Icon icon="lucide:refresh-cw" width="32" height="32" class="admin-icon-spin" />
      <span class="admin-profile-loading-text">SE ÎNCARCĂ DATELE PROFILULUI...</span>
    </div>
  </div>

  <div v-else-if="!profile" class="admin-page-container admin-profile-loading-wrapper">
    <div class="admin-alert-box admin-alert-box--danger">
      <Icon icon="lucide:shield-alert" width="16" height="16" />
      <span>Eroare la încărcarea profilului. Vă rugăm să reîncercați.</span>
    </div>
  </div>

  <div v-else class="admin-page-container">
    <!-- Header -->
    <div class="admin-page-header">
      <div>
        <div class="admin-breadcrumb-tag">USER PREFERENCES &amp; IDENTITY</div>
        <h1 class="admin-page-title">Profilul Meu</h1>
        <p class="admin-page-description">
          Gestionează datele personale, integrarea conturilor de gaming și preferințele de securitate ale contului tău.
        </p>
      </div>
    </div>

    <!-- Status message -->
    <div
      v-if="statusMessage"
      :class="[
        'admin-alert-box admin-alert-spaced',
        statusMessage.type === 'success' ? 'admin-alert-box--success' : 'admin-alert-box--danger'
      ]"
    >
      <Icon
        :icon="statusMessage.type === 'success' ? 'lucide:check-circle-2' : 'lucide:alert-circle'"
        width="16"
        height="16"
      />
      <span>{{ statusMessage.text }}</span>
    </div>

    <form class="admin-profile-grid" @submit.prevent="handleSave">
      <!-- Left Column: Settings -->
      <div class="admin-profile-main">

        <!-- Section: Public Info -->
        <div class="admin-card">
          <div class="admin-card-header">
            <div class="admin-flex-label">
              <div class="admin-card-icon-box">
                <Icon icon="lucide:user" width="16" height="16" />
              </div>
              <h2 class="admin-card-title">Informații Publice</h2>
            </div>
          </div>
          <div class="admin-card-body">
            <div class="admin-form-group">
              <label class="admin-form-label">Nume Afișat</label>
              <input
                v-model="formData.displayName"
                type="text"
                name="displayName"
                class="admin-input-field"
                placeholder="Numele vizibil în dashboard"
              />
            </div>

            <div class="admin-form-group">
              <label class="admin-form-label">Email de Contact</label>
              <div class="admin-input-wrapper">
                <Icon icon="lucide:mail" width="14" height="14" class="admin-input-icon admin-text-zinc-500" />
                <input
                  v-model="formData.email"
                  type="email"
                  name="email"
                  class="admin-input-field admin-input-with-pad"
                  placeholder="adresa@exemplu.com"
                />
              </div>
            </div>

            <div class="admin-form-group">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <label class="admin-form-label">URL Avatar Personalizat</label>
                <button
                  v-if="formData.steamId"
                  type="button"
                  class="admin-steam-quick-btn"
                  :disabled="resolvingSteam"
                  @click="resolveSteamAvatar"
                >
                  <Icon
                    :icon="resolvingSteam ? 'lucide:refresh-cw' : 'lucide:gamepad-2'"
                    width="12"
                    height="12"
                    :class="{ 'admin-icon-spin': resolvingSteam }"
                  />
                  <span>{{ resolvingSteam ? 'Se preia...' : 'Preluare din Steam' }}</span>
                </button>
              </div>
              <input
                v-model="formData.avatarUrl"
                type="url"
                name="avatarUrl"
                class="admin-input-field"
                placeholder="https://... (Lasă gol pentru fallback automat)"
              />
              <p v-if="steamMessage" class="admin-steam-status-hint">
                {{ steamMessage }}
              </p>
              <p class="admin-form-hint">
                Dacă lași acest câmp gol, sistemul va încerca să preia automat avatarul tău de pe Steam (dacă ai setat ID-ul) sau de pe Discord.
              </p>
            </div>

            <div class="admin-form-group">
              <label class="admin-form-label">Despre Mine (Bio)</label>
              <textarea
                v-model="formData.bio"
                name="bio"
                class="admin-textarea-field"
                rows="3"
                placeholder="Scurtă descriere despre rolul tău..."
              />
            </div>
          </div>
        </div>

        <!-- Section: Integrations -->
        <div class="admin-card">
          <div class="admin-card-header">
            <div class="admin-flex-label">
              <div class="admin-card-icon-box admin-card-icon-box--indigo">
                <Icon icon="lucide:gamepad-2" width="16" height="16" class="admin-text-indigo" />
              </div>
              <h2 class="admin-card-title admin-text-indigo">Integrări Platforme</h2>
            </div>
          </div>
          <div class="admin-card-body">
            <div class="admin-form-row">
              <div class="admin-form-group admin-flex-1">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <label class="admin-form-label admin-flex-label">
                    <Icon icon="lucide:gamepad-2" width="13" height="13" />
                    <span>Steam ID64</span>
                  </label>
                  <button
                    v-if="formData.steamId"
                    type="button"
                    class="admin-steam-inline-btn"
                    :disabled="resolvingSteam"
                    title="Rezolvă și actualizează avatarul automat"
                    @click="resolveSteamAvatar"
                  >
                    <Icon
                      :icon="resolvingSteam ? 'lucide:refresh-cw' : 'lucide:refresh-cw'"
                      width="11"
                      height="11"
                      :class="{ 'admin-icon-spin': resolvingSteam }"
                    />
                    <span>Rezolvă Avatar</span>
                  </button>
                </div>
                <input
                  v-model="formData.steamId"
                  type="text"
                  name="steamId"
                  class="admin-input-field"
                  placeholder="7656119..."
                />
              </div>
              <div class="admin-form-group admin-flex-1">
                <label class="admin-form-label admin-flex-label">
                  <Icon icon="lucide:message-square" width="13" height="13" />
                  <span>Discord ID</span>
                </label>
                <input
                  v-model="formData.discord"
                  type="text"
                  name="discord"
                  class="admin-input-field"
                  placeholder="ex: 123456789012345678"
                />
              </div>
            </div>

            <div class="admin-form-group admin-margin-top-md">
              <label class="admin-form-label admin-flex-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GitHub Username</span>
              </label>
              <input
                v-model="formData.githubUsername"
                type="text"
                name="githubUsername"
                class="admin-input-field"
                placeholder="Username-ul tău de pe GitHub"
              />
              <p class="admin-form-hint">
                Folosit pentru sincronizarea statisticilor din GitHub Contributors Graph.
              </p>
            </div>
          </div>
        </div>

        <!-- Section: Security -->
        <div class="admin-card">
          <div class="admin-card-header">
            <div class="admin-flex-label">
              <div class="admin-card-icon-box admin-card-icon-box--rose">
                <Icon icon="lucide:lock" width="16" height="16" class="admin-text-rose" />
              </div>
              <h2 class="admin-card-title admin-text-rose">Securitate</h2>
            </div>
          </div>
          <div class="admin-card-body">
            <div class="admin-form-group">
              <label class="admin-form-label">Schimbă Parola</label>
              <div class="admin-input-wrapper admin-input-wrapper--relative">
                <Icon icon="lucide:lock" width="14" height="14" class="admin-input-icon admin-text-zinc-500" />
                <input
                  v-model="formData.password"
                  :type="showProfilePassword ? 'text' : 'password'"
                  name="password"
                  class="admin-input-field admin-input-with-pad admin-input-field--password"
                  placeholder="Lasă gol pentru a nu modifica parola"
                />
                <button
                  type="button"
                  class="admin-password-toggle-btn"
                  :title="showProfilePassword ? 'Ascunde parola' : 'Arată parola (unhide)'"
                  :aria-label="showProfilePassword ? 'Ascunde parola' : 'Arată parola'"
                  @click="showProfilePassword = !showProfilePassword"
                >
                  <Icon
                    :icon="showProfilePassword ? 'lucide:eye-off' : 'lucide:eye'"
                    width="14"
                    height="14"
                    :class="{ 'text-amber-500': showProfilePassword }"
                  />
                </button>
              </div>
              <p class="admin-form-hint admin-text-rose-muted">
                Dacă introduci o parolă nouă, vei fi deconectat de pe toate celelalte dispozitive (sesiunile vechi vor fi invalidate la expirare sau la verificare manuală).
              </p>
            </div>

            <div class="admin-security-status-box" style="justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <Icon
                  icon="lucide:shield-check"
                  width="18"
                  height="18"
                  :class="profile.totpEnabled ? 'admin-text-emerald' : 'admin-text-zinc-500'"
                />
                <div class="admin-security-status-text">
                  <span class="admin-security-status-title">2FA (Autentificare în 2 Pași)</span>
                  <span class="admin-security-status-desc">
                    {{
                      profile.totpEnabled
                        ? 'Protecția 2FA este activată pentru contul tău.'
                        : '2FA nu este activat. Este recomandat să îl activezi la următorul login.'
                    }}
                  </span>
                </div>
              </div>
              <div>
                <button
                  v-if="profile.totpEnabled"
                  type="button"
                  :disabled="twoFAActionLoading"
                  class="admin-btn admin-btn--danger"
                  style="font-size: 0.75rem; padding: 6px 12px;"
                  @click="handleDisable2FA"
                >
                  <Icon v-if="twoFAActionLoading" icon="lucide:refresh-cw" width="12" height="12" class="admin-icon-spin" />
                  <span v-else>Dezactivează</span>
                </button>
                <button
                  v-else
                  type="button"
                  :disabled="twoFAActionLoading"
                  class="admin-btn admin-btn--primary"
                  style="font-size: 0.75rem; padding: 6px 12px;"
                  @click="handleEnable2FA"
                >
                  <Icon v-if="twoFAActionLoading" icon="lucide:refresh-cw" width="12" height="12" class="admin-icon-spin" />
                  <span v-else>Activează 2FA</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Submit Button -->
        <div class="admin-form-actions">
          <button
            type="submit"
            :disabled="saving"
            class="admin-btn admin-btn--primary admin-btn--lg admin-btn-full"
          >
            <template v-if="saving">
              <Icon icon="lucide:refresh-cw" width="16" height="16" class="admin-icon-spin" />
              <span>Se Salvează...</span>
            </template>
            <template v-else>
              <Icon icon="lucide:save" width="16" height="16" />
              <span>Salvează Modificările Profilului</span>
            </template>
          </button>
        </div>

      </div>

      <!-- Right Column: Identity Preview & Permissions -->
      <div class="admin-profile-sidebar">

        <!-- Live Preview Card -->
        <div class="admin-card admin-profile-preview-card">
          <div class="admin-profile-preview-inner">
            <div class="admin-profile-avatar-container">
              <img
                v-if="formData.avatarUrl"
                :src="formData.avatarUrl"
                alt="Preview"
                class="admin-profile-avatar-img"
              />
              <div
                v-else
                class="admin-profile-avatar-placeholder"
                :style="{ color: profile.avatarColor || '#ff6b00' }"
              >
                {{ (formData.displayName || profile.username || 'U').slice(0, 2).toUpperCase() }}
              </div>
              <div v-if="profile.isRoot" class="admin-profile-root-badge" title="Root Admin">
                <Icon icon="lucide:shield-check" width="14" height="14" />
              </div>
            </div>

            <h3 class="admin-profile-display-name">
              {{ formData.displayName || profile.username }}
            </h3>
            <div class="admin-profile-username-tag">
              @{{ profile.username }}
            </div>

            <div :class="['admin-member-role-badge', `admin-member-role-badge--${profile.role}`, 'admin-margin-top-sm']">
              <span>{{ profile.customTitle || profile.role?.replace('_', ' ') || 'Membru' }}</span>
            </div>

            <p v-if="formData.bio" class="admin-profile-bio">
              "{{ formData.bio }}"
            </p>
          </div>
        </div>

        <!-- Permissions Breakdown (Matrix) -->
        <div class="admin-card">
          <div class="admin-card-header">
            <div class="admin-flex-label">
              <div class="admin-card-icon-box admin-card-icon-box--cyan">
                <Icon icon="lucide:terminal" width="16" height="16" class="admin-text-cyan" />
              </div>
              <h2 class="admin-card-title admin-text-cyan">Drepturi &amp; Acces (RBAC)</h2>
            </div>
          </div>
          <div class="admin-permissions-breakdown">
            <div class="admin-permissions-desc">
              Acestea sunt modulele la care ai acces în prezent. Pentru a solicita drepturi suplimentare, contactează un Super Admin.
            </div>
            <div class="admin-permissions-list">
              <div
                v-for="mod in activePermissions"
                :key="mod.key"
                class="admin-permission-item"
              >
                <div class="admin-permission-item-icon" :style="{ color: mod.color }">
                  <Icon :icon="mod.icon" width="14" height="14" />
                </div>
                <div class="admin-permission-item-text">
                  <span class="admin-permission-item-title">{{ mod.name }}</span>
                  <span class="admin-permission-item-subtitle">{{ mod.desc }}</span>
                </div>
              </div>

              <div v-if="activePermissions.length === 0" style="padding: 16px; text-align: center; color: #71717a; font-size: 0.8rem;">
                Nicio permisiune directă asociată contului.
              </div>
            </div>
          </div>
        </div>

      </div>
    </form>

    <!-- 2FA Setup Modal -->
    <div v-if="show2FAModal" class="admin-modal-backdrop" @click.self="show2FAModal = false">
      <div class="admin-modal-container" style="max-width: 400px;">
        <div class="admin-modal-header">
          <h2 class="admin-modal-title">Configurare 2FA</h2>
        </div>
        <div class="admin-modal-body" style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px;">
          <p class="admin-text-zinc-500" style="font-size: 0.85rem;">
            Scanează codul QR cu o aplicație de autentificare (ex: Google Authenticator, Authy, Apple Passwords).
          </p>
          <img
            v-if="qrCodeData"
            :src="qrCodeData"
            alt="QR Code"
            style="width: 200px; height: 200px; border-radius: 8px;"
          />
          <div v-else class="admin-qr-placeholder">
            <Icon icon="lucide:refresh-cw" width="24" height="24" class="admin-icon-spin admin-text-zinc-500" />
          </div>

          <div v-if="totpSecret" class="admin-totp-secret-box">
            {{ totpSecret }}
          </div>

          <div style="width: 100%; margin-top: 8px;">
            <label class="admin-form-label" style="text-align: left;">Cod de Verificare (6 cifre)</label>
            <input
              :value="verifyCode"
              type="text"
              class="admin-input-field"
              placeholder="123456"
              style="text-align: center; font-size: 1.2rem; letter-spacing: 4px;"
              @input="handleVerifyCodeInput"
            />
          </div>
        </div>
        <div class="admin-modal-footer">
          <button
            type="button"
            class="admin-btn admin-btn--ghost"
            :disabled="twoFAActionLoading"
            @click="show2FAModal = false"
          >
            Anulează
          </button>
          <button
            type="button"
            class="admin-btn admin-btn--primary"
            :disabled="twoFAActionLoading || verifyCode.length !== 6"
            @click="handleVerify2FA"
          >
            <Icon v-if="twoFAActionLoading" icon="lucide:refresh-cw" width="14" height="14" class="admin-icon-spin" />
            <span v-else>Verifică și Activează</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-steam-quick-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(99, 102, 241, 0.12);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #818cf8;
  font-size: 0.68rem;
  font-weight: 700;
  border-radius: 6px;
  padding: 2px 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.admin-steam-quick-btn:hover:not(:disabled) {
  background: rgba(99, 102, 241, 0.22);
  color: #a5b4fc;
}
.admin-steam-inline-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  color: #818cf8;
  font-size: 0.68rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s ease;
}
.admin-steam-inline-btn:hover:not(:disabled) {
  color: #c7d2fe;
}
.admin-steam-status-hint {
  font-size: 0.72rem;
  color: #10b981;
  margin: 4px 0 0 0;
  font-weight: 500;
}

.admin-input-wrapper--relative {
  position: relative;
  display: flex;
  align-items: center;
}

.admin-input-field--password {
  padding-right: 40px !important;
}

.admin-password-toggle-btn {
  position: absolute;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.55);
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 2;
}

.admin-password-toggle-btn:hover {
  background: rgba(255, 107, 0, 0.18);
  border-color: rgba(255, 107, 0, 0.4);
  color: #ff8800;
  transform: scale(1.05);
}
</style>
