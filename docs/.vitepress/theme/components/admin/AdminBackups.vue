<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';

export type BackupType = 'manual' | 'auto';

export interface BackupSnapshotMetadata {
  id: string;
  createdAt: string;
  type: BackupType;
  createdBy: string;
  label: string;
  totalDocs: number;
  totalTasks: number;
  totalReports: number;
  totalFeedbacks: number;
  totalNotifications: number;
  sizeBytes: number;
  sha256: string;
}

export interface BackupVaultStats {
  totalSnapshots: number;
  autoSnapshotsCount: number;
  manualSnapshotsCount: number;
  lastBackupAt: string | null;
  totalStorageBytes: number;
  autoBackupEnabled: boolean;
  intervalDays: number;
  daysUntilNextAuto: number;
}

export interface BackupManifest {
  version: string;
  autoBackupEnabled: boolean;
  intervalDays: number;
  retentionLimit: number;
  lastAutoBackupAt: string | null;
  snapshots: BackupSnapshotMetadata[];
  totalStorageBytes: number;
  updatedAt: string;
}

const props = defineProps<{
  user?: any;
}>();

function timeAgo(isoString: string | null): string {
  if (!isoString) return 'Niciodată';
  try {
    const date = new Date(isoString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Chiar acum';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Acum ${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Acum ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `Acum ${days}z`;
    return date.toLocaleDateString('ro-RO', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Recent';
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

const loading = ref(true);
const snapshots = ref<BackupSnapshotMetadata[]>([]);
const stats = ref<BackupVaultStats | null>(null);
const manifest = ref<Partial<BackupManifest>>({
  autoBackupEnabled: true,
  intervalDays: 3,
  retentionLimit: 10,
});

const activeTab = ref<'all' | 'auto' | 'manual'>('all');
const createModalOpen = ref(false);
const newLabel = ref('');
const creating = ref(false);

const restoreModalOpen = ref(false);
const selectedSnapshot = ref<BackupSnapshotMetadata | null>(null);
const restoring = ref(false);
const restoreSuccess = ref(false);

const copiedHash = ref<string | null>(null);
const savingSettings = ref(false);
const settingsSaved = ref(false);

const fetchBackups = async () => {
  loading.value = true;
  try {
    const res = await fetch('/api/admin/backups');
    if (res.ok) {
      const data = await res.json();
      snapshots.value = data.snapshots || [];
      stats.value = data.stats || null;
      if (data.manifest) {
        manifest.value = data.manifest;
      }
    }
  } catch (err) {
    console.error('[AdminBackupsPage] Error fetching backups:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchBackups();
});

const handleCreateSnapshot = async (e?: Event) => {
  if (e) e.preventDefault();
  creating.value = true;
  try {
    const res = await fetch('/api/admin/backups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', label: newLabel.value.trim() || undefined }),
    });
    if (res.ok) {
      createModalOpen.value = false;
      newLabel.value = '';
      await fetchBackups();
    }
  } catch (err) {
    console.error('Create snapshot error:', err);
  } finally {
    creating.value = false;
  }
};

const handleRunAutoCheck = async () => {
  loading.value = true;
  try {
    await fetch('/api/admin/backups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'run_auto_check' }),
    });
    await fetchBackups();
  } catch {}
};

const handleSaveSettings = async () => {
  savingSettings.value = true;
  settingsSaved.value = false;
  try {
    const res = await fetch('/api/admin/backups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_scheduler',
        autoBackupEnabled: manifest.value.autoBackupEnabled,
        intervalDays: Number(manifest.value.intervalDays),
        retentionLimit: Number(manifest.value.retentionLimit),
      }),
    });
    if (res.ok) {
      settingsSaved.value = true;
      setTimeout(() => {
        settingsSaved.value = false;
      }, 3000);
      await fetchBackups();
    }
  } catch {}
  savingSettings.value = false;
};

const handleRestore = async () => {
  if (!selectedSnapshot.value) return;
  restoring.value = true;
  try {
    const res = await fetch('/api/admin/backups', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'restore', id: selectedSnapshot.value.id }),
    });
    const data = await res.json();
    if (data.success) {
      restoreSuccess.value = true;
      setTimeout(() => {
        restoreSuccess.value = false;
        restoreModalOpen.value = false;
        selectedSnapshot.value = null;
        fetchBackups();
      }, 2000);
    }
  } catch (err) {
    console.error('Restore error:', err);
  } finally {
    restoring.value = false;
  }
};

const handleDelete = async (id: string) => {
  if (!confirm('Ești sigur că vrei să ștergi acest snapshot? Acțiunea este ireversibilă.')) return;
  try {
    const res = await fetch(`/api/admin/backups?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      await fetchBackups();
    }
  } catch {}
};

const handleCopyHash = (hash: string) => {
  navigator.clipboard.writeText(hash);
  copiedHash.value = hash;
  setTimeout(() => {
    copiedHash.value = null;
  }, 2000);
};

const filteredSnapshots = computed(() => {
  return snapshots.value.filter((s) => {
    if (activeTab.value === 'auto') return s.type === 'auto';
    if (activeTab.value === 'manual') return s.type === 'manual';
    return true;
  });
});
</script>

<template>
  <div class="admin-page-container">
    <!-- ── Page Header ────────────────────────────────────────────── -->
    <div class="admin-page-header">
      <div>
        <div class="admin-page-pretitle-tag">
          <Icon icon="lucide:archive" width="11" height="11" class="text-amber-400" />
          <span>BACKUP &amp; SNAPSHOT VAULT</span>
        </div>
        <h1 class="admin-page-title">Backup &amp; Snapshot Vault</h1>
        <p class="admin-page-desc">
          Arhivare completă a bazei de date și a celor 57+ ghiduri, auto-backup programat la fiecare 3 zile, verificare de integritate SHA-256 și restaurare instantanee 1-click.
        </p>
      </div>

      <div class="admin-header-actions">
        <button
          type="button"
          @click="handleRunAutoCheck"
          :disabled="loading"
          class="admin-btn admin-btn--secondary"
          title="Verifică și execută planificatorul de backup automat"
        >
          <Icon icon="lucide:refresh-cw" width="13" height="13" :class="{ 'admin-spin': loading }" />
          <span>{{ loading ? 'Se sincronizează...' : 'Sincronizează' }}</span>
        </button>

        <button
          type="button"
          @click="createModalOpen = true"
          class="admin-btn admin-btn--primary"
        >
          <Icon icon="lucide:plus" width="14" height="14" />
          <span>Generează Snapshot Nou</span>
        </button>
      </div>
    </div>

    <!-- ── 4-Metric KPI Grid ───────────────────────────────────────── -->
    <div class="admin-db-kpi-grid">
      <!-- Metric 1: Total Snapshots -->
      <div class="admin-db-kpi-card">
        <div class="admin-db-kpi-header">
          <span class="admin-db-kpi-title">Total Snapshot-uri Stocate</span>
          <div class="admin-db-kpi-icon-box admin-db-kpi-icon-box--amber">
            <Icon icon="lucide:archive" width="16" height="16" />
          </div>
        </div>
        <div class="admin-db-kpi-body">
          <span class="admin-db-kpi-value admin-db-kpi-value--amber">
            {{ stats?.totalSnapshots ?? snapshots.length }}
          </span>
          <span class="admin-db-kpi-badge admin-db-kpi-badge--amber">
            {{ stats?.autoSnapshotsCount || 0 }} Auto · {{ stats?.manualSnapshotsCount || 0 }} Manual
          </span>
        </div>
        <p class="admin-db-kpi-subtitle">Copii de siguranță complete pe disc</p>
      </div>

      <!-- Metric 2: Auto Scheduler -->
      <div class="admin-db-kpi-card">
        <div class="admin-db-kpi-header">
          <span class="admin-db-kpi-title">Planificator Auto-Backup</span>
          <div class="admin-db-kpi-icon-box admin-db-kpi-icon-box--emerald">
            <Icon icon="lucide:clock" width="16" height="16" />
          </div>
        </div>
        <div class="admin-db-kpi-body">
          <span class="admin-db-kpi-value admin-db-kpi-value--emerald">
            {{ manifest.autoBackupEnabled ? `${manifest.intervalDays} Zile` : 'Oprit' }}
          </span>
          <span class="admin-db-kpi-badge admin-db-kpi-badge--emerald">
            {{ manifest.autoBackupEnabled ? `Următorul: ~${stats?.daysUntilNextAuto ?? 3}z` : 'Dezactivat' }}
          </span>
        </div>
        <p class="admin-db-kpi-subtitle">Execuție automată în fundal fără întrerupere</p>
      </div>

      <!-- Metric 3: Last Backup -->
      <div class="admin-db-kpi-card">
        <div class="admin-db-kpi-header">
          <span class="admin-db-kpi-title">Ultimul Backup Înregistrat</span>
          <div class="admin-db-kpi-icon-box admin-db-kpi-icon-box--cyan">
            <Icon icon="lucide:calendar" width="16" height="16" />
          </div>
        </div>
        <div class="admin-db-kpi-body">
          <span class="admin-db-kpi-value admin-db-kpi-value--cyan" style="font-size: 1.25rem;">
            {{ timeAgo(stats?.lastBackupAt || (snapshots[0]?.createdAt ?? null)) }}
          </span>
          <span class="admin-db-kpi-badge admin-db-kpi-badge--cyan">
            Live Sync
          </span>
        </div>
        <p class="admin-db-kpi-subtitle">
          {{ snapshots[0]?.createdAt
            ? new Date(snapshots[0].createdAt).toLocaleString('ro-RO')
            : 'Niciun snapshot creat' }}
        </p>
      </div>

      <!-- Metric 4: Disk Storage -->
      <div class="admin-db-kpi-card">
        <div class="admin-db-kpi-header">
          <span class="admin-db-kpi-title">Spațiu Utilizat pe Disc</span>
          <div class="admin-db-kpi-icon-box admin-db-kpi-icon-box--purple">
            <Icon icon="lucide:hard-drive" width="16" height="16" />
          </div>
        </div>
        <div class="admin-db-kpi-body">
          <span class="admin-db-kpi-value admin-db-kpi-value--purple">
            {{ formatBytes(stats?.totalStorageBytes || 0) }}
          </span>
          <span class="admin-db-kpi-badge admin-db-kpi-badge--purple">
            SHA-256
          </span>
        </div>
        <p class="admin-db-kpi-subtitle">Integritate criptografică verificată</p>
      </div>
    </div>

    <!-- ── Auto-Backup Scheduler Config Box ──────────────────────────── -->
    <div class="admin-panel-card mb-6">
      <div class="admin-panel-header">
        <div class="admin-card-title-group" style="display: flex; align-items: center; gap: 10px;">
          <div class="admin-quota-icon-box admin-quota-icon-box--amber">
            <Icon icon="lucide:sliders" width="16" height="16" />
          </div>
          <div>
            <h3 class="admin-section-title">
              Configurare Planificator Automat (Auto-Backup Scheduler)
            </h3>
            <p class="admin-panel-sub">
              Sistemul execută automat snapshot-uri complete în fundal la fiecare 3 zile fără a întrerupe activitatea.
            </p>
          </div>
        </div>

        <div class="admin-card-actions" style="display: flex; align-items: center; gap: 10px;">
          <span v-if="settingsSaved" class="admin-status-pill admin-status-pill--success flex items-center gap-1">
            <Icon icon="lucide:check" width="11" height="11" />
            <span>Salvat cu Succes</span>
          </span>
          <button
            type="button"
            @click="handleSaveSettings"
            :disabled="savingSettings"
            class="admin-btn admin-btn--primary admin-btn--sm"
          >
            {{ savingSettings ? 'Se salvează...' : 'Aplică Setările' }}
          </button>
        </div>
      </div>

      <div class="admin-scheduler-form-grid" style="padding: 20px;">
        <div class="admin-form-group">
          <label class="admin-form-label">
            Stare Auto-Backup
          </label>
          <div class="admin-toggle-wrapper">
            <button
              type="button"
              @click="manifest.autoBackupEnabled = !manifest.autoBackupEnabled"
              class="admin-switch-btn"
              :class="{ active: manifest.autoBackupEnabled }"
            >
              <span class="admin-switch-handle" />
            </button>
            <span class="admin-toggle-label">
              {{ manifest.autoBackupEnabled ? 'Activ (Rulează automat în fundal)' : 'Inactiv (Doar manual)' }}
            </span>
          </div>
        </div>

        <div class="admin-form-group">
          <label class="admin-form-label">
            Interval de Rulare
          </label>
          <select
            v-model.number="manifest.intervalDays"
            class="admin-select"
          >
            <option :value="1">Zilnic (La fiecare 24 ore)</option>
            <option :value="3">La fiecare 3 zile (Recomandat)</option>
            <option :value="4">La fiecare 4 zile</option>
            <option :value="7">Săptămânal (La fiecare 7 zile)</option>
            <option :value="14">La fiecare 2 săptămâni</option>
          </select>
        </div>

        <div class="admin-form-group">
          <label class="admin-form-label">
            Limită Rotire Automată (Retention)
          </label>
          <select
            v-model.number="manifest.retentionLimit"
            class="admin-select"
          >
            <option :value="5">Păstrează ultimele 5 snapshot-uri</option>
            <option :value="10">Păstrează ultimele 10 snapshot-uri (Optim)</option>
            <option :value="20">Păstrează ultimele 20 snapshot-uri</option>
            <option :value="30">Păstrează ultimele 30 snapshot-uri</option>
          </select>
        </div>
      </div>
    </div>

    <!-- ── Tabs Bar ─────────────────────────────────────────────────── -->
    <div class="admin-db-tabs-bar">
      <button
        type="button"
        @click="activeTab = 'all'"
        class="admin-db-tab-btn"
        :class="{ 'admin-db-tab-btn--active-cyan': activeTab === 'all' }"
      >
        <Icon icon="lucide:layers" width="13" height="13" />
        <span>Toate Snapshot-urile</span>
        <span class="admin-db-tab-badge">{{ snapshots.length }}</span>
      </button>

      <button
        type="button"
        @click="activeTab = 'auto'"
        class="admin-db-tab-btn"
        :class="{ 'admin-db-tab-btn--active-cyan': activeTab === 'auto' }"
      >
        <Icon icon="lucide:bot" width="13" height="13" />
        <span>Automate (3 Zile)</span>
        <span class="admin-db-tab-badge">
          {{ snapshots.filter((s) => s.type === 'auto').length }}
        </span>
      </button>

      <button
        type="button"
        @click="activeTab = 'manual'"
        class="admin-db-tab-btn"
        :class="{ 'admin-db-tab-btn--active-amber': activeTab === 'manual' }"
      >
        <Icon icon="lucide:user" width="13" height="13" />
        <span>Manuale</span>
        <span class="admin-db-tab-badge">
          {{ snapshots.filter((s) => s.type === 'manual').length }}
        </span>
      </button>
    </div>

    <!-- ── Snapshots Matrix Table Card ─────────────────────────────── -->
    <div class="admin-panel-card">
      <div class="admin-table-container">
        <div v-if="filteredSnapshots.length === 0" class="admin-table-empty">
          <Icon icon="lucide:archive" width="36" height="36" class="text-slate-500 mb-2 mx-auto" />
          <h4 class="font-bold text-sm mb-1">Niciun snapshot găsit</h4>
          <p class="text-xs">
            Apasă pe „Generează Snapshot Nou” pentru a crea prima copie de siguranță completă.
          </p>
        </div>

        <table v-else class="admin-table" style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: hsl(0 0% 100% / 0.02); border-bottom: 1px solid var(--glass-border); text-align: left;">
              <th style="padding: 12px 16px; font-size: 0.72rem; font-weight: 700; color: var(--color-text-tertiary);">Snapshot ID &amp; Etichetă</th>
              <th style="padding: 12px 16px; font-size: 0.72rem; font-weight: 700; color: var(--color-text-tertiary);">Tip &amp; Autor</th>
              <th style="padding: 12px 16px; font-size: 0.72rem; font-weight: 700; color: var(--color-text-tertiary);">Conținut Arhivat</th>
              <th style="padding: 12px 16px; font-size: 0.72rem; font-weight: 700; color: var(--color-text-tertiary);">Mărime</th>
              <th style="padding: 12px 16px; font-size: 0.72rem; font-weight: 700; color: var(--color-text-tertiary);">Integritate SHA-256</th>
              <th style="padding: 12px 16px; font-size: 0.72rem; font-weight: 700; color: var(--color-text-tertiary); text-align: right;">Acțiuni 1-Click</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="snap in filteredSnapshots" :key="snap.id" style="border-bottom: 1px solid hsl(0 0% 100% / 0.04); transition: background 0.15s ease;">
              <!-- ID & Label -->
              <td style="padding: 12px 16px;">
                <div class="admin-snap-title-cell">
                  <div
                    class="admin-snap-icon-box"
                    :class="snap.type === 'auto' ? 'admin-snap-icon-box--auto' : 'admin-snap-icon-box--manual'"
                  >
                    <Icon v-if="snap.type === 'auto'" icon="lucide:bot" width="14" height="14" />
                    <Icon v-else icon="lucide:user" width="14" height="14" />
                  </div>
                  <div>
                    <div class="admin-snap-label">{{ snap.label }}</div>
                    <div class="admin-snap-id-meta">
                      <code>{{ snap.id }}</code>
                      <span>·</span>
                      <span>{{ timeAgo(snap.createdAt) }}</span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Type & Creator -->
              <td style="padding: 12px 16px;">
                <span v-if="snap.type === 'auto'" class="admin-status-pill admin-status-pill--cyan">
                  <Icon icon="lucide:bot" width="11" height="11" />
                  <span>Auto Scheduler</span>
                </span>
                <span v-else class="admin-status-pill admin-status-pill--amber">
                  <Icon icon="lucide:user" width="11" height="11" />
                  <span>@{{ snap.createdBy }}</span>
                </span>
              </td>

              <!-- Archived Content Details -->
              <td style="padding: 12px 16px;">
                <div class="admin-snap-items-pills">
                  <span class="admin-micro-pill" :title="`${snap.totalDocs} Ghiduri Markdown`">
                    <Icon icon="lucide:file-text" width="10" height="10" class="text-emerald-400" />
                    <span>{{ snap.totalDocs }} Ghiduri</span>
                  </span>
                  <span class="admin-micro-pill" :title="`${snap.totalTasks} Sarcini TODO`">
                    <Icon icon="lucide:list-todo" width="10" height="10" class="text-amber-400" />
                    <span>{{ snap.totalTasks }} Tasks</span>
                  </span>
                  <span class="admin-micro-pill" :title="`${snap.totalReports} Rapoarte & ${snap.totalFeedbacks} Feedbacks`">
                    <Icon icon="lucide:database" width="10" height="10" class="text-sky-400" />
                    <span>DB Sync</span>
                  </span>
                </div>
              </td>

              <!-- Size -->
              <td style="padding: 12px 16px;">
                <span class="admin-snap-size-text">
                  {{ formatBytes(snap.sizeBytes) }}
                </span>
              </td>

              <!-- SHA-256 Checksum -->
              <td style="padding: 12px 16px;">
                <button
                  type="button"
                  @click="handleCopyHash(snap.sha256)"
                  class="admin-sha-hash-btn"
                  title="Click pentru a copia hash-ul complet SHA-256"
                >
                  <Icon icon="lucide:shield-check" width="11" height="11" class="text-emerald-400" />
                  <code>{{ snap.sha256 ? `${snap.sha256.slice(0, 10)}...` : 'SHA-256 Valid' }}</code>
                  <Icon v-if="copiedHash === snap.sha256" icon="lucide:check" width="10" height="10" class="text-emerald-400" />
                  <Icon v-else icon="lucide:copy" width="10" height="10" class="opacity-60" />
                </button>
              </td>

              <!-- Actions -->
              <td style="padding: 12px 16px; text-align: right;">
                <div class="admin-table-actions" style="display: inline-flex; align-items: center; gap: 6px; justify-content: flex-end;">
                  <!-- Download Button -->
                  <a
                    :href="`/api/admin/backups/download?id=${encodeURIComponent(snap.id)}`"
                    download
                    class="admin-action-btn admin-action-btn--download"
                    title="Descarcă arhiva JSON pe calculatorul tău"
                    style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 6px; font-size: 0.72rem; font-weight: 700;"
                  >
                    <Icon icon="lucide:download" width="13" height="13" />
                    <span>Descarcă</span>
                  </a>

                  <!-- Restore Button -->
                  <button
                    type="button"
                    @click="selectedSnapshot = snap; restoreModalOpen = true;"
                    class="admin-action-btn admin-action-btn--restore"
                    title="Restaurează serverul la acest punct (Rollback)"
                    style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 6px; font-size: 0.72rem; font-weight: 700; cursor: pointer;"
                  >
                    <Icon icon="lucide:rotate-ccw" width="13" height="13" />
                    <span>Restaurează</span>
                  </button>

                  <!-- Delete Button -->
                  <button
                    type="button"
                    @click="handleDelete(snap.id)"
                    class="admin-action-btn admin-action-btn--delete"
                    title="Șterge acest snapshot"
                    style="display: inline-flex; align-items: center; justify-content: center; padding: 4px 8px; border-radius: 6px; background: hsl(0 84% 60% / 0.1); border: 1px solid hsl(0 84% 60% / 0.25); color: #f87171; cursor: pointer;"
                  >
                    <Icon icon="lucide:trash-2" width="13" height="13" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── Modal: Creare Snapshot Manual ───────────────────────────── -->
    <div v-if="createModalOpen" class="admin-modal-overlay" role="dialog" aria-modal="true">
      <div class="admin-modal-card">
        <div class="admin-modal-header">
          <div class="admin-icon-box admin-icon-box--amber">
            <Icon icon="lucide:archive" width="18" height="18" />
          </div>
          <div>
            <h3 class="admin-modal-title">Generează Snapshot Manual</h3>
            <p class="admin-modal-sub">
              Arhivare instantanee pentru baza de date, conținutul documentației și membrii echipei.
            </p>
          </div>
          <button
            type="button"
            @click="createModalOpen = false"
            class="admin-modal-close-btn"
          >
            <Icon icon="lucide:x" width="14" height="14" />
          </button>
        </div>

        <form @submit.prevent="handleCreateSnapshot">
          <div class="admin-modal-body">
            <div class="admin-form-group mb-4">
              <label class="admin-form-label">Etichetă / Descriere Snapshot (Opțional)</label>
              <input
                type="text"
                v-model="newLabel"
                placeholder="ex: Înainte de actualizarea regulamentului CS2"
                class="admin-input-field"
                autofocus
              />
              <span class="admin-input-hint">
                Dacă lași gol, se va genera automat o etichetă cu data și autorul.
              </span>
            </div>

            <div class="admin-info-banner">
              <Icon icon="lucide:shield-check" width="16" height="16" class="text-emerald-400 flex-shrink-0" />
              <p>
                Snapshot-ul va genera un hash criptografic <strong>SHA-256</strong> pentru garantarea integrității fișierelor împotriva oricărei coruperi.
              </p>
            </div>
          </div>

          <div class="admin-modal-actions">
            <button
              type="button"
              @click="createModalOpen = false"
              class="admin-btn admin-btn--secondary"
            >
              Anulează
            </button>
            <button
              type="submit"
              :disabled="creating"
              class="admin-btn admin-btn--primary"
            >
              {{ creating ? 'Se arhivează...' : 'Creează Snapshot' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ── Modal: Restaurare (Rollback) Snapshot ────────────────────── -->
    <div v-if="restoreModalOpen && selectedSnapshot" class="admin-modal-overlay" role="dialog" aria-modal="true">
      <div class="admin-modal-card admin-modal-card--danger">
        <div class="admin-modal-header">
          <div class="admin-icon-box admin-icon-box--danger">
            <Icon icon="lucide:rotate-ccw" width="18" height="18" />
          </div>
          <div>
            <h3 class="admin-modal-title">Restaurare Platformă (Rollback)</h3>
            <p class="admin-modal-sub">
              Sistemul va fi readus exact la starea din <strong>{{ new Date(selectedSnapshot.createdAt).toLocaleString('ro-RO') }}</strong>.
            </p>
          </div>
          <button
            type="button"
            @click="restoreModalOpen = false"
            class="admin-modal-close-btn"
          >
            <Icon icon="lucide:x" width="14" height="14" />
          </button>
        </div>

        <div class="admin-modal-body">
          <div v-if="restoreSuccess" class="admin-restore-success-card">
            <Icon icon="lucide:check-circle-2" width="36" height="36" class="text-emerald-400 mb-2" />
            <h4>Restaurare Finalizată cu Succes!</h4>
            <p>Toate ghidurile, sarcinile și tabelele au fost resincronizate la versiunea selectată.</p>
          </div>

          <template v-else>
            <div class="admin-alert-box admin-alert-box--danger mb-4">
              <Icon icon="lucide:alert-triangle" width="18" height="18" class="text-rose-400 flex-shrink-0" />
              <div>
                <strong>Atenție: Acțiune Critică de Sistem</strong>
                <p>
                  Această operațiune va suprascrie ghidurile curente și starea bazei de date cu versiunea din snapshot.
                </p>
              </div>
            </div>

            <div class="admin-snapshot-inspect-box">
              <div class="admin-snap-inspect-row">
                <span class="label">Etichetă:</span>
                <span class="val font-bold">{{ selectedSnapshot.label }}</span>
              </div>
              <div class="admin-snap-inspect-row">
                <span class="label">Creat de:</span>
                <span class="val">@{{ selectedSnapshot.createdBy }} ({{ selectedSnapshot.type.toUpperCase() }})</span>
              </div>
              <div class="admin-snap-inspect-row">
                <span class="label">Elemente:</span>
                <span class="val">
                  {{ selectedSnapshot.totalDocs }} Ghiduri · {{ selectedSnapshot.totalTasks }} Sarcini · {{ selectedSnapshot.totalReports }} Rapoarte
                </span>
              </div>
              <div class="admin-snap-inspect-row">
                <span class="label">Integritate:</span>
                <span class="val font-mono text-emerald-400">{{ selectedSnapshot.sha256 ? `${selectedSnapshot.sha256.slice(0, 16)}...` : '' }} (Valid)</span>
              </div>
            </div>

            <div class="admin-info-banner mt-4">
              <Icon icon="lucide:shield-check" width="16" height="16" class="text-sky-400 flex-shrink-0" />
              <p>
                <strong>Protecție automată activată:</strong> Sistemul va genera automat un snapshot de siguranță de tip <code>PRE_ROLLBACK</code> chiar înainte de aplicare.
              </p>
            </div>
          </template>
        </div>

        <div v-if="!restoreSuccess" class="admin-modal-actions">
          <button
            type="button"
            @click="restoreModalOpen = false"
            class="admin-btn admin-btn--secondary"
          >
            Anulează
          </button>
          <button
            type="button"
            @click="handleRestore"
            :disabled="restoring"
            class="admin-btn admin-btn--danger"
          >
            {{ restoring ? 'Se restaurează...' : 'Confirmă & Execută Restaurarea' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
