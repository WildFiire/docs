<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';

const CURRENT_VERSION = '1.8.5';
const PLATFORM_NAME = 'Wildfire Docs';

interface CurrentUser {
  isRoot?: boolean;
  username: string;
  role: string;
  permissions?: Record<string, boolean>;
}

const props = defineProps<{
  user?: any;
}>();

// ── state ───────────────────────────────────────────────────────────
const currentUser = ref<CurrentUser | null>(props.user || null);
const isPanicLocked = ref<boolean>(false);
const panicModalOpen = ref<boolean>(false);
const panicProcessing = ref<boolean>(false);
const panicError = ref<string>('');

const maintenanceEnabled = ref<boolean>(false);
const maintenanceMessage = ref<string>(
  "Wildfire Docs is currently undergoing scheduled platform upgrades and engine optimizations. We'll be back online shortly."
);
const maintenanceReason = ref<string>(
  'Actualizare structură documentație & optimizare index căutare'
);
const estimatedEndTime = ref<string>('30 minutes');
const allowAdmins = ref<boolean>(true);
const whitelistIps = ref<string>('');

const bannerEnabled = ref<boolean>(false);
const bannerText = ref<string>(
  'Wildfire Docs v1.5.0 este live cu Ghiduri CS2, Media Vault & Sistem de Securitate!'
);
const bannerLink = ref<string>('/changelog');
const bannerLinkText = ref<string>('Vezi Noutățile');
const bannerType = ref<'fire' | 'info' | 'warning'>('fire');
const bannerCustomColor = ref<string>('#f97316');
const bannerDismissible = ref<boolean>(true);

const revalidating = ref<boolean>(false);
const saving = ref<boolean>(false);
const statusMessage = ref<{
  type: 'success' | 'error';
  text: string;
} | null>(null);

const dbStatus = ref<any>(null);

const isRoot = computed(() => {
  return Boolean(
    currentUser.value?.isRoot ||
    currentUser.value?.role === 'root_admin' ||
    currentUser.value?.username?.toLowerCase() === 'iannc69' ||
    props.user?.isRoot ||
    props.user?.username?.toLowerCase() === 'iannc69'
  );
});

// ── load ────────────────────────────────────────────────────────────
async function loadSettings() {
  try {
    const res = await fetch('/api/admin/settings');
    if (res.status === 401) {
      window.location.href = '/admin/login';
      return;
    }
    const data = await res.json();
    if (data.maintenance) {
      maintenanceEnabled.value = data.maintenance.enabled || false;
      if (data.maintenance.message)          maintenanceMessage.value = data.maintenance.message;
      if (data.maintenance.reason)           maintenanceReason.value = data.maintenance.reason;
      if (data.maintenance.estimatedEndTime) estimatedEndTime.value = data.maintenance.estimatedEndTime;
      if (data.maintenance.allowAdmins !== undefined) allowAdmins.value = data.maintenance.allowAdmins;
      if (data.maintenance.whitelistIps)     whitelistIps.value = data.maintenance.whitelistIps;
    }
    if (data.announcement) {
      bannerEnabled.value = data.announcement.enabled || false;
      if (data.announcement.text)            bannerText.value = data.announcement.text;
      if (data.announcement.link)            bannerLink.value = data.announcement.link;
      if (data.announcement.linkText)        bannerLinkText.value = data.announcement.linkText;
      if (data.announcement.type)            bannerType.value = data.announcement.type;
      if (data.announcement.customColor)     bannerCustomColor.value = data.announcement.customColor;
      if (data.announcement.dismissible !== undefined) bannerDismissible.value = data.announcement.dismissible;
    }
  } catch (err) {
    console.error('Failed to load settings:', err);
  }
}

async function loadDbStatus() {
  try {
    const res = await fetch('/api/admin/database');
    if (res.ok) {
      const data = await res.json();
      dbStatus.value = data.status;
    }
  } catch {}
}

onMounted(() => {
  loadSettings();
  loadDbStatus();

  fetch('/api/admin/auth/me')
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (data?.authenticated && data.user) {
        currentUser.value = data.user;
      }
    })
    .catch(() => {});

  fetch('/api/admin/auth/panic')
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (data) setIsPanicLocked(data.locked || false);
    })
    .catch(() => {});
});

function setIsPanicLocked(val: boolean) {
  isPanicLocked.value = val;
}

// ── handlers ────────────────────────────────────────────────────────
const handleTriggerPanic = async (action: 'trigger' | 'release') => {
  panicProcessing.value = true;
  panicError.value = '';
  try {
    const res = await fetch('/api/admin/auth/panic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    const data = await res.json();
    if (data.success) {
      panicModalOpen.value = false;
      isPanicLocked.value = action === 'trigger';
      statusMessage.value = {
        type: action === 'trigger' ? 'error' : 'success',
        text:
          action === 'trigger'
            ? 'Panic Lockdown a fost declanșat cu succes! Toate sesiunile active au fost revocate.'
            : 'Panic Lockdown a fost ridicat. Platforma a revenit la starea normală de funcționare.',
      };
    } else {
      panicError.value = data.error || 'Eroare la executarea comenzii Panic Lockdown.';
    }
  } catch {
    panicError.value = 'Eroare de conexiune la server.';
  } finally {
    panicProcessing.value = false;
  }
};

const saveConfiguration = async (overrides?: {
  maintenanceEnabled?: boolean;
  bannerEnabled?: boolean;
}) => {
  const maintActive =
    overrides?.maintenanceEnabled !== undefined
      ? overrides.maintenanceEnabled
      : maintenanceEnabled.value;
  const bannerActive =
    overrides?.bannerEnabled !== undefined
      ? overrides.bannerEnabled
      : bannerEnabled.value;

  saving.value = true;
  statusMessage.value = null;
  try {
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        maintenance: {
          enabled: maintActive,
          message: maintenanceMessage.value,
          reason: maintenanceReason.value,
          estimatedEndTime: estimatedEndTime.value,
          allowAdmins: allowAdmins.value,
          whitelistIps: whitelistIps.value,
        },
        announcement: {
          enabled: bannerActive,
          text: bannerText.value,
          link: bannerLink.value,
          linkText: bannerLinkText.value,
          type: bannerType.value,
          customColor: bannerCustomColor.value,
          dismissible: bannerDismissible.value,
        },
      }),
    });
    const data = await res.json();
    if (data.success) {
      statusMessage.value = {
        type: 'success',
        text: 'Configurațiile platformei au fost salvate și aplicate pe disc.',
      };
    } else {
      statusMessage.value = {
        type: 'error',
        text: data.error || 'Salvarea setărilor a eșuat.',
      };
    }
  } catch {
    statusMessage.value = { type: 'error', text: 'Eroare de conexiune la server.' };
  } finally {
    saving.value = false;
  }
};

const handleRevalidateCache = async () => {
  revalidating.value = true;
  try {
    const res = await fetch('/api/admin/maintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'revalidate' }),
    });
    const data = await res.json();
    if (data.success) {
      statusMessage.value = {
        type: 'success',
        text: 'Cache-ul ISR al platformei și rutele statice au fost regenerate.',
      };
    }
  } catch {
    statusMessage.value = { type: 'error', text: 'Eroare la invalidarea cache-ului.' };
  } finally {
    revalidating.value = false;
  }
};

const BANNER_TYPES = [
  { key: 'fire' as const, label: 'Wildfire Ember', icon: 'lucide:flame', cls: 'st-banner-type--fire' },
  { key: 'info' as const, label: 'Informativ', icon: 'lucide:info', cls: 'st-banner-type--info' },
  { key: 'warning' as const, label: 'Atenționare', icon: 'lucide:alert-triangle', cls: 'st-banner-type--warning' },
];

const engineSpecs = computed(() => [
  { label: 'Engine', value: PLATFORM_NAME },
  { label: 'Versiune', value: `v${CURRENT_VERSION}` },
  { label: 'Framework', value: 'Next.js 16 (Turbopack) / VitePress Engine' },
  { label: 'Runtime', value: 'Node.js Edge Runtime' },
]);
</script>

<template>
  <div class="admin-page-container">
    <!-- ── HEADER ──────────────────────────────────────────────────── -->
    <div class="st-header">
      <div class="st-header-left">
        <div class="st-breadcrumb">
          <Icon icon="lucide:settings-2" width="11" height="11" />
          <span>PLATFORM CONTROL</span>
          <span class="st-breadcrumb-sep">/</span>
          <span>ENGINE CONFIGURATION</span>
        </div>
        <h1 class="st-title">Setări Globale Platformă</h1>
        <p class="st-subtitle">
          Controlează bannerele publice, modul de mentenanță, cache-ul ISR și securitatea administrației.
        </p>
      </div>
      <div class="st-header-actions">
        <button
          type="button"
          id="settings-save-all-btn"
          @click="saveConfiguration()"
          :disabled="saving"
          class="st-save-btn"
        >
          <Icon icon="lucide:save" width="13" height="13" :class="{ 'st-spin': saving }" />
          <span>{{ saving ? 'Se salvează...' : 'Salvează Toate Setările' }}</span>
        </button>
      </div>
    </div>

    <!-- ── STATUS ALERT ────────────────────────────────────────────── -->
    <div v-if="statusMessage" class="st-alert" :class="`st-alert--${statusMessage.type}`">
      <Icon v-if="statusMessage.type === 'success'" icon="lucide:check-circle-2" width="15" height="15" />
      <Icon v-else icon="lucide:alert-circle" width="15" height="15" />
      <span>{{ statusMessage.text }}</span>
    </div>

    <!-- ── MAIN GRID ───────────────────────────────────────────────── -->
    <div class="st-grid">
      <!-- ══ LEFT COLUMN ════════════════════════════════════════════ -->
      <div class="st-col">
        <!-- ── ANNOUNCEMENT BANNER CARD ─────────────────────────── -->
        <div class="st-card">
          <div class="st-card-header">
            <div class="st-card-icon st-card-icon--orange">
              <Icon icon="lucide:megaphone" width="17" height="17" />
            </div>
            <div class="st-card-heading">
              <h3 class="st-card-title">Banner Public de Anunțuri</h3>
              <p class="st-card-sub">Afișează un banner proeminent în antetul tuturor paginilor de documentație</p>
            </div>
            <div class="st-card-toggle-area">
              <span class="st-card-status-dot" :class="{ 'st-card-status-dot--on': bannerEnabled }" />
              <span class="st-card-status-text">{{ bannerEnabled ? 'Activ' : 'Inactiv' }}</span>
              <button
                type="button"
                role="switch"
                :aria-checked="bannerEnabled"
                id="banner-enabled-toggle"
                @click="bannerEnabled = !bannerEnabled; saveConfiguration({ bannerEnabled });"
                class="st-toggle"
                :class="{ 'st-toggle--on': bannerEnabled }"
              >
                <span class="st-toggle-thumb" />
              </button>
            </div>
          </div>

          <div class="st-card-body">
            <!-- Banner type picker -->
            <div class="st-field">
              <label class="st-label">Tip Banner &amp; Culoare</label>
              <div class="st-banner-type-row">
                <button
                  v-for="item in BANNER_TYPES"
                  :key="item.key"
                  type="button"
                  :id="`banner-type-${item.key}`"
                  @click="bannerType = item.key"
                  class="st-banner-type-btn"
                  :class="[item.cls, { 'st-banner-type-btn--active': bannerType === item.key }]"
                >
                  <Icon :icon="item.icon" width="13" height="13" />
                  <span>{{ item.label }}</span>
                </button>
              </div>
            </div>

            <!-- Custom color picker for announcement banner -->
            <div class="st-field">
              <label class="st-label">Selector Culoare Personalizată Banner (Color Picker)</label>
              <div style="display: flex; align-items: center; gap: 10px;">
                <input
                  type="color"
                  v-model="bannerCustomColor"
                  id="banner-color-picker"
                  style="width: 40px; height: 36px; padding: 2px; border-radius: 6px; border: 1px solid var(--glass-border); background: transparent; cursor: pointer;"
                />
                <input
                  type="text"
                  v-model="bannerCustomColor"
                  placeholder="#f97316"
                  class="st-input"
                  style="flex: 1; max-width: 140px; font-family: monospace;"
                />
                <span style="font-size: 0.75rem; color: var(--color-text-tertiary);">
                  Cod HEX personalizat pentru accentul bannerului
                </span>
              </div>
            </div>

            <div class="st-field">
              <label class="st-label">Mesaj Anunț</label>
              <input
                type="text"
                id="banner-text-input"
                v-model="bannerText"
                placeholder="Ex: Am actualizat ghidul de Currency..."
                class="st-input"
              />
            </div>

            <div class="st-field-row">
              <div class="st-field">
                <label class="st-label">Link Buton</label>
                <input
                  type="text"
                  id="banner-link-input"
                  v-model="bannerLink"
                  placeholder="/changelog"
                  class="st-input"
                />
              </div>
              <div class="st-field">
                <label class="st-label">Text Buton</label>
                <input
                  type="text"
                  id="banner-link-text-input"
                  v-model="bannerLinkText"
                  placeholder="Vezi Noutățile"
                  class="st-input"
                />
              </div>
            </div>

            <div class="st-toggle-row">
              <div>
                <span class="st-toggle-row-label">Poate fi închis de vizitator</span>
                <p class="st-toggle-row-sub">Permite utilizatorilor să ascundă bannerul cu butonul X</p>
              </div>
              <button
                type="button"
                role="switch"
                :aria-checked="bannerDismissible"
                id="banner-dismissible-toggle"
                @click="bannerDismissible = !bannerDismissible"
                class="st-toggle"
                :class="{ 'st-toggle--on': bannerDismissible }"
              >
                <span class="st-toggle-thumb" />
              </button>
            </div>
          </div>
        </div>

        <!-- ── MAINTENANCE CARD ─────────────────────────────────── -->
        <div class="st-card">
          <div class="st-card-header">
            <div class="st-card-icon st-card-icon--red">
              <Icon icon="lucide:wrench" width="17" height="17" />
            </div>
            <div class="st-card-heading">
              <h3 class="st-card-title">Mod Mentenanță Platformă Docs</h3>
              <p class="st-card-sub">Blochează temporar accesul public și redirecționează la ecranul de mentenanță</p>
            </div>
            <div class="st-card-toggle-area">
              <span class="st-card-status-dot" :class="{ 'st-card-status-dot--red': maintenanceEnabled }" />
              <span class="st-card-status-text">{{ maintenanceEnabled ? 'LIVE' : 'Inactiv' }}</span>
              <button
                type="button"
                role="switch"
                :aria-checked="maintenanceEnabled"
                id="maintenance-enabled-toggle"
                @click="maintenanceEnabled = !maintenanceEnabled; saveConfiguration({ maintenanceEnabled });"
                class="st-toggle"
                :class="{ 'st-toggle--on': maintenanceEnabled }"
              >
                <span class="st-toggle-thumb" />
              </button>
            </div>
          </div>

          <div v-if="maintenanceEnabled" class="st-maintenance-warning">
            <Icon icon="lucide:alert-triangle" width="13" height="13" />
            <span>Platforma este în prezent în modul de mentenanță. Vizitatorii sunt redirecționați.</span>
          </div>

          <div class="st-card-body">
            <div class="st-field">
              <label class="st-label">Motiv Mentenanță (Intern)</label>
              <input
                type="text"
                id="maintenance-reason-input"
                v-model="maintenanceReason"
                placeholder="Actualizare regulamente și structură foldere"
                class="st-input"
              />
            </div>
            <div class="st-field">
              <label class="st-label">Mesaj Public pentru Jucători</label>
              <textarea
                id="maintenance-message-input"
                v-model="maintenanceMessage"
                :rows="2"
                class="st-input st-textarea"
              />
            </div>
            <div class="st-field">
              <label class="st-label">Timp Estimat Rămas</label>
              <input
                type="text"
                id="maintenance-eta-input"
                v-model="estimatedEndTime"
                placeholder="15 minute"
                class="st-input"
              />
            </div>

            <!-- IP Whitelist Field -->
            <div class="st-field">
              <label class="st-label">Listă Albă IP-uri (IP Whitelist - Acces Direct Fără Blocare)</label>
              <input
                type="text"
                id="maintenance-ip-whitelist-input"
                v-model="whitelistIps"
                placeholder="ex: 127.0.0.1, 192.168.1.50, 86.120.45.10 (separate prin virgulă)"
                class="st-input"
              />
              <span class="st-input-hint" style="font-size: 0.72rem; color: var(--color-text-tertiary); margin-top: 4px; display: block;">
                Adresele IP configurate aici au bypass garantat și pot naviga documentația în timpul lucrărilor.
              </span>
            </div>

            <!-- Allow Admins Bypass Toggle -->
            <div class="st-toggle-row">
              <div>
                <span class="st-toggle-row-label">Permite Accesul Administratorilor (Admin Bypass)</span>
                <p class="st-toggle-row-sub">Permite staff-ului autentificat să navigheze documentația în mentenanță</p>
              </div>
              <button
                type="button"
                role="switch"
                :aria-checked="allowAdmins"
                id="maintenance-allow-admins-toggle"
                @click="allowAdmins = !allowAdmins"
                class="st-toggle"
                :class="{ 'st-toggle--on': allowAdmins }"
              >
                <span class="st-toggle-thumb" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ══ RIGHT COLUMN ═══════════════════════════════════════════ -->
      <div class="st-col">
        <!-- ── DATABASE HUB CARD ────────────────────────────────── -->
        <div class="st-card">
          <div class="st-card-header">
            <div class="st-card-icon st-card-icon--cyan">
              <Icon icon="lucide:database" width="17" height="17" />
            </div>
            <div class="st-card-heading">
              <h3 class="st-card-title">Bază de Date &amp; Telemetrie</h3>
              <p class="st-card-sub">Panou dedicat pentru vizualizări pagini, recenzii comunitate și Supabase</p>
            </div>
          </div>
          <div class="st-card-body">
            <div class="st-db-status-row">
              <div class="st-db-status-info">
                <span class="st-db-status-label">Status Conexiune Live</span>
                <span class="st-db-online-pill">
                  <span class="st-db-pulse" />
                  Supabase PostgreSQL Cloud
                </span>
              </div>
              <a href="/admin/database" class="st-db-open-btn" id="open-database-hub-btn">
                <Icon icon="lucide:database" width="12" height="12" />
                <span>Deschide Database Hub</span>
                <Icon icon="lucide:chevron-right" width="12" height="12" />
              </a>
            </div>
          </div>
        </div>

        <!-- ── BACKUP CARD ──────────────────────────────────────── -->
        <div class="st-card">
          <div class="st-card-header">
            <div class="st-card-icon st-card-icon--green">
              <Icon icon="lucide:archive" width="17" height="17" />
            </div>
            <div class="st-card-heading">
              <h3 class="st-card-title">Backup &amp; Export Repository</h3>
              <p class="st-card-sub">Descarcă instantaneu arhiva completă cu toate cele 62+ articole Markdown</p>
            </div>
          </div>
          <div class="st-card-body">
            <div class="st-backup-list">
              <a href="/api/admin/backup?format=zip" download class="st-backup-item" id="backup-zip-btn">
                <div class="st-backup-icon st-backup-icon--green">
                  <Icon icon="lucide:download" width="16" height="16" />
                </div>
                <div class="st-backup-text">
                  <strong>Descarcă Arhivă ZIP (.zip)</strong>
                  <span>Include toate fișierele .md și structura de foldere</span>
                </div>
                <Icon icon="lucide:chevron-right" width="14" height="14" class="st-backup-arrow" />
              </a>

              <a href="/api/admin/backup?format=json" download class="st-backup-item" id="backup-json-btn">
                <div class="st-backup-icon st-backup-icon--blue">
                  <Icon icon="lucide:file-code" width="16" height="16" />
                </div>
                <div class="st-backup-text">
                  <strong>Export Bază de Date JSON (.json)</strong>
                  <span>Conține toate documentele cu frontmatter structurat</span>
                </div>
                <Icon icon="lucide:chevron-right" width="14" height="14" class="st-backup-arrow" />
              </a>

              <a href="/api/admin/backup?format=bundle" download class="st-backup-item" id="backup-bundle-btn">
                <div class="st-backup-icon st-backup-icon--orange">
                  <Icon icon="lucide:layers" width="16" height="16" />
                </div>
                <div class="st-backup-text">
                  <strong>Export Markdown Unificat (.md)</strong>
                  <span>Fișier unic concatenat pentru căutare și citire offline</span>
                </div>
                <Icon icon="lucide:chevron-right" width="14" height="14" class="st-backup-arrow" />
              </a>
            </div>
          </div>
        </div>

        <!-- ── ENGINE / CACHE CARD ──────────────────────────────── -->
        <div class="st-card">
          <div class="st-card-header">
            <div class="st-card-icon st-card-icon--purple">
              <Icon icon="lucide:server" width="17" height="17" />
            </div>
            <div class="st-card-heading">
              <h3 class="st-card-title">Optimizare &amp; Cache ISR</h3>
              <p class="st-card-sub">Regenerează paginile statice și indexul de căutare</p>
            </div>
          </div>
          <div class="st-card-body">
            <div class="st-engine-spec-list">
              <div v-for="spec in engineSpecs" :key="spec.label" class="st-engine-spec-row">
                <span class="st-engine-spec-key">{{ spec.label }}</span>
                <span class="st-engine-spec-val">{{ spec.value }}</span>
              </div>
            </div>
            <button
              type="button"
              id="revalidate-cache-btn"
              @click="handleRevalidateCache"
              :disabled="revalidating"
              class="st-revalidate-btn"
            >
              <Icon icon="lucide:refresh-cw" width="13" height="13" :class="{ 'st-spin': revalidating }" />
              <span>{{ revalidating ? 'Se regenerează cache-ul...' : 'Regenerează Cache ISR' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── PANIC DANGER ZONE ───────────────────────────────────────── -->
    <div class="st-danger-zone">
      <div class="st-danger-zone-header">
        <div class="st-danger-title-group">
          <div class="st-danger-icon">
            <Icon icon="lucide:shield-alert" width="22" height="22" />
          </div>
          <div>
            <div class="st-danger-title-row">
              <h3 class="st-danger-title">Zona de Urgență Super Admin (Root Danger Zone)</h3>
              <span class="st-danger-root-badge">STRICT ROOT ONLY</span>
            </div>
            <p class="st-danger-sub">
              Mecanism de urgență pentru blocarea imediată a întregii platforme și invalidarea tuturor sesiunilor administrative active.
            </p>
          </div>
        </div>
        <span v-if="isPanicLocked" class="st-panic-status st-panic-status--locked">
          <Icon icon="lucide:shield-alert" width="12" height="12" />
          LOCKDOWN ACTIV
        </span>
        <span v-else class="st-panic-status st-panic-status--normal">
          <Icon icon="lucide:shield-check" width="12" height="12" />
          SISTEM NORMAL
        </span>
      </div>

      <div class="st-danger-zone-body">
        <div class="st-danger-info-box">
          <strong class="st-danger-info-title">Ce face Panic Lockdown?</strong>
          <p class="st-danger-info-text">
            1. <strong>Revocă instantaneu</strong> toate tokenurile de sesiune pentru toți administratorii non-root.<br />
            2. <strong>Blochează</strong> toate modificările de articole, ștergerile și mutațiile din studio.<br />
            3. Doar Super Adminul Root (<code>@iannC69</code>) poate ridica starea de urgență.
          </p>
        </div>

        <div class="st-danger-action-box">
          <div>
            <strong class="st-danger-info-title">Stare Permisiuni &amp; Control</strong>
            <p v-if="isRoot" class="st-danger-root-ok">
              Ești autentificat ca Root Super Admin. Ai autoritate absolută de intervenție.
            </p>
            <p v-else class="st-danger-root-restricted">
              Acces restricționat: Doar Root Super Admin @iannC69 poate declanșa sau anula starea de panică.
            </p>
          </div>
          <div class="st-danger-btn-wrap">
            <button
              v-if="isPanicLocked"
              type="button"
              id="panic-release-btn"
              @click="handleTriggerPanic('release')"
              :disabled="!isRoot || panicProcessing"
              class="st-panic-release-btn"
            >
              <Icon icon="lucide:unlock" width="14" height="14" />
              <span>{{ panicProcessing ? 'Se deblochează...' : 'Deblochează Platforma' }}</span>
            </button>
            <button
              v-else
              type="button"
              id="panic-trigger-btn"
              @click="panicModalOpen = true"
              :disabled="!isRoot || panicProcessing"
              class="st-panic-trigger-btn"
            >
              <Icon icon="lucide:shield-alert" width="14" height="14" />
              <span>Declanșează Emergency Panic Lockdown</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── PANIC MODAL ─────────────────────────────────────────────── -->
    <div v-if="panicModalOpen" class="st-modal-overlay" role="dialog" aria-modal="true">
      <div class="st-modal">
        <div class="st-modal-header">
          <div class="st-modal-danger-orb">
            <Icon icon="lucide:shield-alert" width="22" height="22" />
          </div>
          <h3 class="st-modal-title">Declanșează Emergency Panic Lockdown?</h3>
        </div>
        <p class="st-modal-body">
          Această acțiune va <strong>revoca instantaneu toate sesiunile active</strong> ale administratorilor,
          va deconecta toți membrii echipei și va bloca mutațiile de conținut.
        </p>
        <div v-if="panicError" class="st-alert st-alert--error">
          <Icon icon="lucide:alert-circle" width="14" height="14" />
          <span>{{ panicError }}</span>
        </div>
        <div class="st-modal-actions">
          <button type="button" @click="panicModalOpen = false" class="st-modal-cancel-btn">
            Anulează
          </button>
          <button
            type="button"
            id="panic-confirm-btn"
            @click="handleTriggerPanic('trigger')"
            :disabled="panicProcessing"
            class="st-modal-confirm-btn"
          >
            <Icon icon="lucide:lock" width="13" height="13" />
            <span>{{ panicProcessing ? 'Se declanșează...' : 'Confirmă Panic Lockdown' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
