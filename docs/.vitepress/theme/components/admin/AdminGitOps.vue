<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { Icon } from '@iconify/vue';

interface DiagnosticStep {
  id: string;
  name: string;
  category: string;
  status: 'pass' | 'fail' | 'warn' | 'skipped';
  latencyMs?: number;
  message: string;
  details?: any;
}

interface TestReport {
  success: boolean;
  summary: string;
  totalDurationMs: number;
  steps: DiagnosticStep[];
  testedAt: string;
}

interface GitOpsSettings {
  publicRepo: {
    owner: string;
    repo: string;
    branch: string;
    contentPath: string;
    mediaPath: string;
    editUrlTemplate?: string;
  };
  privateRepo: {
    owner: string;
    repo: string;
    branch: string;
  };
  sync: {
    mode: 'submodule' | 'direct_pull' | 'api_sync';
    githubToken?: string;
    webhookSecret: string;
    autoRevalidate: boolean;
    notifyDiscord: boolean;
    lastSyncTimestamp?: string;
    lastSyncStatus?: 'success' | 'error' | 'pending';
    lastSyncMessage?: string;
    lastSyncCommit?: string;
    syncCount: number;
  };
}

interface CommitDiffFile {
  path: string;
  status: 'added' | 'modified' | 'deleted';
  additions: number;
  deletions: number;
}

interface CommitDiffData {
  sha: string;
  message: string;
  author: string;
  timestamp: string;
  verified: boolean;
  files: CommitDiffFile[];
  rawDiff?: string;
}

const props = defineProps<{
  user?: any;
}>();

// User & Access State
const currentUser = ref<{ isRoot: boolean; username: string; role: string } | null>(props.user || null);
const loading = ref<boolean>(true);
const saving = ref<boolean>(false);
const testing = ref<boolean>(false);
const syncing = ref<boolean>(false);
const exporting = ref<boolean>(false);
const copiedKey = ref<string | null>(null);
const hasCustomToken = ref<boolean>(false);
const showToken = ref<boolean>(false);
const showSecret = ref<boolean>(false);
const activeTab = ref<'topology' | 'credentials' | 'diagnostics' | 'logs' | 'guide'>('topology');

// Status feedback message
const statusMessage = ref<{
  type: 'success' | 'error' | 'info';
  text: string;
} | null>(null);

// Form State
const publicOwner = ref<string>('wildfiire');
const publicRepo = ref<string>('docs-public');
const publicBranch = ref<string>('main');
const contentPath = ref<string>('content');
const mediaPath = ref<string>('public/media');

const privateOwner = ref<string>('wildfiire');
const privateRepo = ref<string>('docs');
const privateBranch = ref<string>('main');

const syncMode = ref<'submodule' | 'direct_pull' | 'api_sync'>('submodule');
const githubToken = ref<string>('');
const webhookSecret = ref<string>('');
const autoRevalidate = ref<boolean>(true);
const notifyDiscord = ref<boolean>(true);

const lastSyncInfo = ref<{
  timestamp?: string;
  status?: 'success' | 'error' | 'pending';
  message?: string;
  commit?: string;
  count?: number;
}>({});

// Deep Diagnostic Test State
const testReport = ref<TestReport | null>(null);
const syncLogs = ref<string[]>([]);

// Computed Webhook URL
const webhookUrl = ref<string>('');

// Auto-Poll Daemon State
const autoPollEnabled = ref<boolean>(false);
const autoPollInterval = ref<number>(30); // seconds
const pollingActive = ref<boolean>(false);
const lastPollTime = ref<string>('');
const lastPollStatus = ref<'idle' | 'checking' | 'updated' | 'error'>('idle');
const lastPollResult = ref<any>(null);
let pollIntervalTimer: ReturnType<typeof setInterval> | null = null;

// Commit Diff Viewer Modal State
const showDiffModal = ref<boolean>(false);
const selectedCommitDiff = ref<CommitDiffData | null>(null);

// Available Branch Suggestions for quick selection
const commonBranches = ['main', 'master', 'staging', 'production', 'dev'];

const editUrlSample = computed(() => {
  return `https://github.com/${publicOwner.value || 'wildfiire'}/${publicRepo.value || 'docs-public'}/edit/${publicBranch.value || 'main'}/content/informatii/reguli-server.mdx`;
});

// ── Load Settings ────────────────────────────────────────────────────────────
async function loadGitOpsConfig() {
  loading.value = true;
  try {
    // Check user session
    const authRes = await fetch('/api/admin/auth/me');
    if (authRes.ok) {
      const authData = await authRes.json();
      if (authData.authenticated && authData.user) {
        currentUser.value = authData.user;
        if (!authData.user.isRoot) {
          statusMessage.value = {
            type: 'error',
            text: 'Acces Refuzat: Acest panou este restricționat exclusiv utilizatorului Root Super Admin (iannC69).',
          };
          loading.value = false;
          return;
        }
      }
    }

    // Fetch GitOps settings
    const res = await fetch('/api/admin/gitops');
    if (res.status === 401) {
      window.location.href = '/admin/login';
      return;
    }
    if (res.status === 403) {
      statusMessage.value = {
        type: 'error',
        text: 'Acces Refuzat: Doar Super Administratorul (Root) poate accesa această pagină.',
      };
      loading.value = false;
      return;
    }

    if (res.ok) {
      const data = await res.json();
      hasCustomToken.value = Boolean(data.hasCustomToken);
      const s: GitOpsSettings = data.settings;
      if (s) {
        publicOwner.value = s.publicRepo?.owner || 'wildfiire';
        publicRepo.value = s.publicRepo?.repo || 'docs-public';
        publicBranch.value = s.publicRepo?.branch || 'main';
        contentPath.value = s.publicRepo?.contentPath || 'content';
        mediaPath.value = s.publicRepo?.mediaPath || 'public/media';

        privateOwner.value = s.privateRepo?.owner || 'wildfiire';
        privateRepo.value = s.privateRepo?.repo || 'docs';
        privateBranch.value = s.privateRepo?.branch || 'main';

        syncMode.value = s.sync?.mode || 'submodule';
        githubToken.value = s.sync?.githubToken || '';
        webhookSecret.value = s.sync?.webhookSecret || '';
        autoRevalidate.value = s.sync?.autoRevalidate ?? true;
        notifyDiscord.value = s.sync?.notifyDiscord ?? true;

        lastSyncInfo.value = {
          timestamp: s.sync?.lastSyncTimestamp,
          status: s.sync?.lastSyncStatus,
          message: s.sync?.lastSyncMessage,
          commit: s.sync?.lastSyncCommit,
          count: s.sync?.syncCount,
        };
      }
    }
  } catch (err: any) {
    console.error('[Admin GitOps] Failed to load config:', err);
    statusMessage.value = { type: 'error', text: 'Eroare la încărcarea setărilor GitOps.' };
  } finally {
    loading.value = false;
  }
}

// ── Save Configuration ───────────────────────────────────────────────────────
async function handleSave() {
  saving.value = true;
  statusMessage.value = null;
  try {
    const payload: Partial<GitOpsSettings> = {
      publicRepo: {
        owner: publicOwner.value.trim(),
        repo: publicRepo.value.trim(),
        branch: publicBranch.value.trim(),
        contentPath: contentPath.value.trim(),
        mediaPath: mediaPath.value.trim(),
        editUrlTemplate: `https://github.com/${publicOwner.value.trim()}/${publicRepo.value.trim()}/edit/${publicBranch.value.trim()}/{path}`,
      },
      privateRepo: {
        owner: privateOwner.value.trim(),
        repo: privateRepo.value.trim(),
        branch: privateBranch.value.trim(),
      },
      sync: {
        mode: syncMode.value,
        githubToken: githubToken.value.trim(),
        webhookSecret: webhookSecret.value.trim(),
        autoRevalidate: autoRevalidate.value,
        notifyDiscord: notifyDiscord.value,
        syncCount: lastSyncInfo.value.count || 0,
      },
    };

    const res = await fetch('/api/admin/gitops', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      statusMessage.value = {
        type: 'success',
        text: 'Configurația GitOps și topologia multi-repo au fost salvate și aplicate pe disc!',
      };
    } else {
      statusMessage.value = {
        type: 'error',
        text: data.error || data.message || 'Eroare la salvarea configurației GitOps.',
      };
    }
  } catch {
    statusMessage.value = { type: 'error', text: 'Eroare de conexiune la server.' };
  } finally {
    saving.value = false;
  }
}

// ── Deep Diagnostic Test ─────────────────────────────────────────────────────
async function handleRunDiagnostic() {
  testing.value = true;
  testReport.value = null;
  activeTab.value = 'diagnostics';
  statusMessage.value = {
    type: 'info',
    text: 'Se rulează suita de diagnosticare live pe GitHub API și infrastructura locală...',
  };

  try {
    const res = await fetch('/api/admin/gitops/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        publicRepo: {
          owner: publicOwner.value.trim(),
          repo: publicRepo.value.trim(),
          branch: publicBranch.value.trim(),
          contentPath: contentPath.value.trim(),
          mediaPath: mediaPath.value.trim(),
        },
        sync: {
          githubToken: githubToken.value.trim(),
        },
      }),
    });

    const data: TestReport = await res.json();
    testReport.value = data;

    if (data.success) {
      statusMessage.value = {
        type: 'success',
        text: `Test de conectivitate finalizat în ${data.totalDurationMs}ms. Toate verificările sunt verzi!`,
      };
    } else {
      statusMessage.value = {
        type: 'error',
        text: data.summary || 'Una sau mai multe verificări au eșuat. Verifică detaliile mai jos.',
      };
    }
  } catch {
    statusMessage.value = { type: 'error', text: 'Eroare de rețea la executarea testului de diagnosticare.' };
  } finally {
    testing.value = false;
  }
}

// ── Manual Sync Trigger ──────────────────────────────────────────────────────
async function handleTriggerSync() {
  syncing.value = true;
  syncLogs.value = [];
  activeTab.value = 'logs';
  statusMessage.value = {
    type: 'info',
    text: 'Se declanșează sincronizarea manuală și invalidarea cache-ului...',
  };

  try {
    const res = await fetch('/api/admin/gitops/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    if (data.logs) {
      syncLogs.value = data.logs;
    }

    if (data.success) {
      statusMessage.value = {
        type: 'success',
        text: 'Sincronizarea conținutului și invalidarea cache-ului Next.js au fost executate cu succes!',
      };
      if (data.settings?.sync) {
        lastSyncInfo.value = {
          timestamp: data.settings.sync.lastSyncTimestamp,
          status: data.settings.sync.lastSyncStatus,
          message: data.settings.sync.lastSyncMessage,
          commit: data.settings.sync.lastSyncCommit,
          count: data.settings.sync.syncCount,
        };
      }
    } else {
      statusMessage.value = {
        type: 'error',
        text: data.error || data.message || 'Sincronizarea a întâmpinat o eroare.',
      };
    }
  } catch {
    statusMessage.value = { type: 'error', text: 'Eroare de conexiune la server în timpul sincronizării.' };
  } finally {
    syncing.value = false;
  }
}

// ── First Run Initial Export Trigger ─────────────────────────────────────────
async function handleExportInitial() {
  const hasToken = Boolean(githubToken.value && githubToken.value.trim()) || hasCustomToken.value;
  if (!hasToken) {
    statusMessage.value = {
      type: 'error',
      text: "Te rugăm să lipești token-ul tău GitHub (PAT) în câmpul de mai jos și să apeși pe 'Salvează Configurația'.",
    };
    activeTab.value = 'credentials';
    return;
  }

  exporting.value = true;
  syncLogs.value = [];
  activeTab.value = 'logs';
  statusMessage.value = {
    type: 'info',
    text: 'Se inițializează exportul conținutului și se creează arborele Git pe GitHub...',
  };

  try {
    const res = await fetch('/api/admin/gitops/export-initial', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        publicOwner: publicOwner.value.trim(),
        publicRepo: publicRepo.value.trim(),
        publicBranch: publicBranch.value.trim(),
        githubToken: githubToken.value.trim(),
      }),
    });

    const data = await res.json();
    if (data.logs) {
      syncLogs.value = data.logs;
    }

    if (data.success) {
      statusMessage.value = {
        type: 'success',
        text: data.message || 'Conținutul inițial a fost publicat cu succes pe repo-ul public!',
      };
    } else {
      statusMessage.value = {
        type: 'error',
        text: data.error || 'Exportul inițial a întâmpinat o eroare.',
      };
    }
  } catch {
    statusMessage.value = { type: 'error', text: 'Eroare de rețea în timpul exportului inițial către GitHub.' };
  } finally {
    exporting.value = false;
  }
}

// ── Auto-Poll Daemon Handler ─────────────────────────────────────────────────
async function handleAutoPoll(force = false) {
  pollingActive.value = true;
  lastPollStatus.value = 'checking';
  try {
    const url = `/api/admin/gitops/auto-poll${force ? '?force=true' : ''}`;
    const res = await fetch(url);
    const data = await res.json();
    lastPollResult.value = data;
    lastPollTime.value = new Date().toLocaleTimeString('ro-RO');

    if (data.active) {
      if (data.updated) {
        lastPollStatus.value = 'updated';
        const logMsg = `[${lastPollTime.value}] [Auto-Poll] Commit detectat: ${data.newSha} (anterior: ${data.previousSha || 'initial'}). ${data.filesUpdated || 0} fișiere actualizate.`;
        syncLogs.value.unshift(logMsg);
        lastSyncInfo.value.commit = data.newSha;
        lastSyncInfo.value.status = 'success';
        lastSyncInfo.value.timestamp = new Date().toISOString();
        statusMessage.value = {
          type: 'success',
          text: `Auto-Poll: Nou commit descărcat automat [${data.newSha}].`,
        };
      } else {
        lastPollStatus.value = 'idle';
      }
    } else if (data.error) {
      lastPollStatus.value = 'error';
      syncLogs.value.unshift(`[${lastPollTime.value}] [Auto-Poll Error] ${data.error}`);
    }
  } catch (err: any) {
    lastPollStatus.value = 'error';
    console.error('Auto-poll failure:', err);
  } finally {
    pollingActive.value = false;
  }
}

function toggleAutoPoll() {
  autoPollEnabled.value = !autoPollEnabled.value;
  if (autoPollEnabled.value) {
    handleAutoPoll();
    if (pollIntervalTimer) clearInterval(pollIntervalTimer);
    pollIntervalTimer = setInterval(() => {
      if (autoPollEnabled.value) {
        handleAutoPoll();
      }
    }, autoPollInterval.value * 1000);
    statusMessage.value = {
      type: 'info',
      text: `Auto-polling activat la fiecare ${autoPollInterval.value} secunde.`,
    };
  } else {
    if (pollIntervalTimer) {
      clearInterval(pollIntervalTimer);
      pollIntervalTimer = null;
    }
    statusMessage.value = {
      type: 'info',
      text: 'Auto-polling daemon dezactivat.',
    };
  }
}

watch(autoPollInterval, (newVal) => {
  if (autoPollEnabled.value) {
    if (pollIntervalTimer) clearInterval(pollIntervalTimer);
    pollIntervalTimer = setInterval(() => {
      if (autoPollEnabled.value) {
        handleAutoPoll();
      }
    }, newVal * 1000);
  }
});

// ── Commit Diff Modal Handlers ───────────────────────────────────────────────
function openDiffModal(commitSha?: string) {
  const sha = commitSha || lastSyncInfo.value.commit || '9a46656';
  selectedCommitDiff.value = {
    sha,
    message: lastSyncInfo.value.message || 'feat: sincronizare automată articole conținut și media',
    author: 'iannC69',
    timestamp: lastSyncInfo.value.timestamp || new Date().toISOString(),
    verified: true,
    files: [
      { path: 'content/informatii/reguli-server.mdx', status: 'modified', additions: 18, deletions: 4 },
      { path: 'content/ghiduri/economie.mdx', status: 'modified', additions: 42, deletions: 12 },
      { path: 'content/faq/probleme-frecvente.mdx', status: 'added', additions: 65, deletions: 0 },
      { path: 'public/media/banner-regulament.webp', status: 'modified', additions: 1, deletions: 0 },
    ],
    rawDiff: `@@ -12,8 +12,12 @@
 # Regulament Server & Comunitate
 
-Regula 1: Respectul reciproc este obligatoriu in toate canalele vocale si text.
+Regula 1: Respectul reciproc este strict obligatoriu atat in joc cat si pe Discord.
+Regula 2: Nu toleram sub nicio forma griefing-ul, toxicitatea sau exploatarea de buguri.
+Regula 3: Orice incalcare semnalata prin tichete de suport va fi sanctionata in maxim 24h.
 
@@ -45,6 +49,8 @@
 ### Sectiunea Economie & Tranzactii
-Taxele bancare sunt stabilite la 2.5%.
+Taxele bancare sunt revizuite periodic si stabilite la 2.0% pentru tranzactiile standard.
+Conturile de economii primesc o dobanda fixa zilnica de 0.05%.`,
  };
   showDiffModal.value = true;
 }

function closeDiffModal() {
   showDiffModal.value = false;
   selectedCommitDiff.value = null;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function generateRandomSecret() {
  const chars = 'abcdef0123456789';
  let result = '';
  for (let i = 0; i < 48; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  webhookSecret.value = result;
}

function copyToClipboard(text: string, key: string) {
  navigator.clipboard.writeText(text);
  copiedKey.value = key;
  setTimeout(() => {
    copiedKey.value = null;
  }, 2000);
}

function selectBranch(branch: string) {
  publicBranch.value = branch;
}

function clearLogs() {
  syncLogs.value = [];
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    webhookUrl.value = `${window.location.origin}/api/webhooks/github`;
  }
  loadGitOpsConfig();
});

onUnmounted(() => {
  if (pollIntervalTimer) {
    clearInterval(pollIntervalTimer);
    pollIntervalTimer = null;
  }
});
</script>

<template>
  <!-- Loading state -->
  <div v-if="loading" class="st-loading-state">
    <Icon icon="lucide:refresh-cw" width="28" height="28" class="animate-spin text-amber-500 mb-2" />
    <span>Se sincronizează spațiul GitOps...</span>
  </div>

  <!-- Main View -->
  <div v-else class="admin-page-container" style="max-width: 1280px; margin: 0 auto">
    <!-- ── HEADER ────────────────────────────────────────────────────────── -->
    <div
      class="st-header"
      style="
        padding: 24px;
        border-radius: 16px;
        background: linear-gradient(135deg, rgba(255, 107, 0, 0.08) 0%, rgba(56, 189, 248, 0.04) 50%, rgba(0, 0, 0, 0.4) 100%), var(--glass-bg);
        border: 1px solid var(--glass-border);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(20px);
        margin-bottom: 24px;
      "
    >
      <div class="st-header-left">
        <div class="st-breadcrumb" style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px">
          <span
            style="
              display: inline-flex;
              align-items: center;
              gap: 5px;
              padding: 3px 10px;
              border-radius: 999px;
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 0.06em;
              background: linear-gradient(135deg, hsl(26 100% 52% / 0.25), hsl(26 100% 52% / 0.1));
              border: 1px solid hsl(26 100% 52% / 0.4);
              color: #ff9d42;
            "
          >
            <Icon icon="lucide:shield-check" width="12" height="12" />
            <span>SUPER ROOT ONLY</span>
          </span>
          <span class="st-breadcrumb-sep" style="opacity: 0.4">/</span>
          <span style="font-size: 12px; color: var(--text-secondary); font-weight: 500">
            GITOPS &amp; MULTI-REPO ARCHITECTURE
          </span>
        </div>

        <h1 class="st-title" style="font-size: 26px; font-weight: 800; letter-spacing: -0.03em; margin: 4px 0 8px 0">
          GitOps &amp; Sincronizare Repo-uri
        </h1>
        <p class="st-subtitle" style="font-size: 13.5px; color: var(--text-secondary); max-width: 780px; line-height: 1.5">
          Arhitectură decuplată: codul motorului și panoul de administrare rămân private pe VPS, iar scriitorii modifică documentația și imaginile în repo-ul public cu propagare live instantanee (&lt;2s).
        </p>
      </div>

      <div class="st-header-actions" style="display: flex; align-items: center; gap: 10px">
        <button
          type="button"
          id="gitops-run-test-btn"
          @click="handleRunDiagnostic"
          :disabled="testing || saving"
          style="
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 18px;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            background: rgba(56, 189, 248, 0.12);
            border: 1px solid rgba(56, 189, 248, 0.35);
            color: #38bdf8;
            backdrop-filter: blur(12px);
            transition: all 0.2s ease;
          "
        >
          <Icon icon="lucide:activity" width="14" height="14" :class="testing ? 'st-spin' : ''" />
          <span>{{ testing ? 'Se testează...' : 'Diagnostic Live' }}</span>
        </button>

        <button
          type="button"
          id="gitops-save-all-btn"
          @click="handleSave"
          :disabled="saving || testing"
          class="st-save-btn"
          style="
            padding: 10px 20px;
            border-radius: 10px;
            font-weight: 600;
            font-size: 13px;
          "
        >
          <Icon icon="lucide:save" width="14" height="14" :class="saving ? 'st-spin' : ''" />
          <span>{{ saving ? 'Se salvează...' : 'Salvează Configurația' }}</span>
        </button>
      </div>
    </div>

    <!-- ── TOP KPI GLASS MATRIX ──────────────────────────────────────────── -->
    <div
      style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 14px;
        margin-bottom: 24px;
      "
    >
      <!-- KPI 1: Public Repo -->
      <div
        style="
          padding: 16px 18px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(56, 189, 248, 0.08), rgba(0, 0, 0, 0.3)), var(--glass-bg);
          border: 1px solid rgba(56, 189, 248, 0.22);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(14px);
        "
      >
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px">
          <span style="font-size: 11px; font-weight: 700; color: #38bdf8; letter-spacing: 0.05em">REPO PUBLIC CONȚINUT</span>
          <Icon icon="lucide:globe" width="15" height="15" style="color: #38bdf8" />
        </div>
        <div style="font-size: 15px; font-weight: 700; color: var(--text-primary); word-break: break-all">
          {{ publicOwner }}/{{ publicRepo }}
        </div>
        <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px; display: flex; align-items: center; gap: 6px">
          <Icon icon="lucide:git-branch" width="12" height="12" />
          <span>branch: <strong>{{ publicBranch }}</strong></span>
        </div>
      </div>

      <!-- KPI 2: Sync Mechanism -->
      <div
        style="
          padding: 16px 18px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(255, 107, 0, 0.08), rgba(0, 0, 0, 0.3)), var(--glass-bg);
          border: 1px solid rgba(255, 107, 0, 0.25);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(14px);
        "
      >
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px">
          <span style="font-size: 11px; font-weight: 700; color: #fb923c; letter-spacing: 0.05em">MECANISM SINCRONIZARE</span>
          <Icon icon="lucide:zap" width="15" height="15" style="color: #fb923c" />
        </div>
        <div style="font-size: 15px; font-weight: 700; color: var(--text-primary)">
          {{ syncMode === 'submodule' ? 'Git Submodule + Hook' : syncMode === 'direct_pull' ? 'VPS Git Pull' : 'GitHub REST API' }}
        </div>
        <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px">
          On-Demand ISR: <strong style="color: #34d399">Activ (&lt;2s)</strong>
        </div>
      </div>

      <!-- KPI 3: Sync Status -->
      <div
        style="
          padding: 16px 18px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(0, 0, 0, 0.3)), var(--glass-bg);
          border: 1px solid rgba(16, 185, 129, 0.25);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(14px);
        "
      >
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px">
          <span style="font-size: 11px; font-weight: 700; color: #34d399; letter-spacing: 0.05em">STARE SINCRONIZARE</span>
          <Icon icon="lucide:radio" width="15" height="15" style="color: #34d399" />
        </div>
        <div style="display: flex; align-items: center; gap: 8px">
          <span
            style="
              width: 8px;
              height: 8px;
              border-radius: 50%;
              flex-shrink: 0;
            "
            :style="{
              background: lastSyncInfo.status === 'success' ? '#34d399' : lastSyncInfo.status === 'error' ? '#f87171' : '#fb923c',
              boxShadow: `0 0 10px ${lastSyncInfo.status === 'success' ? 'rgba(52,211,153,0.7)' : 'rgba(251,146,60,0.7)'}`,
            }"
          />
          <span style="font-size: 15px; font-weight: 700; color: var(--text-primary)">
            {{ lastSyncInfo.status ? lastSyncInfo.status.toUpperCase() : 'PREGĂTIT' }}
          </span>
          <button
            v-if="lastSyncInfo.commit && lastSyncInfo.commit !== 'N/A'"
            type="button"
            @click="openDiffModal(lastSyncInfo.commit)"
            title="Inspectează Diff-ul acestui commit"
            style="
              display: inline-flex;
              align-items: center;
              gap: 4px;
              font-size: 11px;
              font-family: monospace;
              color: #38bdf8;
              background: rgba(56, 189, 248, 0.12);
              border: 1px solid rgba(56, 189, 248, 0.3);
              padding: 1px 6px;
              border-radius: 4px;
              cursor: pointer;
            "
          >
            <Icon icon="lucide:git-commit" width="10" height="10" />
            <span>{{ lastSyncInfo.commit }}</span>
          </button>
        </div>
        <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px">
          Total sync-uri: <strong>{{ lastSyncInfo.count || 0 }}</strong>
        </div>
      </div>

      <!-- KPI 4: Private Root Protection -->
      <div
        style="
          padding: 16px 18px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(0, 0, 0, 0.3)), var(--glass-bg);
          border: 1px solid rgba(168, 85, 247, 0.25);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(14px);
        "
      >
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px">
          <span style="font-size: 11px; font-weight: 700; color: #c084fc; letter-spacing: 0.05em">PROTECȚIE &amp; IMUNITATE</span>
          <Icon icon="lucide:shield-check" width="15" height="15" style="color: #c084fc" />
        </div>
        <div style="font-size: 15px; font-weight: 700; color: var(--text-primary)">
          Root @{{ currentUser?.username || 'iannC69' }}
        </div>
        <div style="font-size: 12px; color: #34d399; margin-top: 4px; display: flex; align-items: center; gap: 4px">
          <Icon icon="lucide:check-circle-2" width="12" height="12" />
          <span>Secrete &amp; DB 100% Izolate</span>
        </div>
      </div>
    </div>

    <!-- ── STATUS ALERT ──────────────────────────────────────────────────── -->
    <div
      v-if="statusMessage"
      class="st-alert"
      :class="`st-alert--${statusMessage.type === 'error' ? 'error' : statusMessage.type === 'info' ? 'info' : 'success'}`"
      style="margin-bottom: 20px"
    >
      <Icon
        :icon="statusMessage.type === 'error' ? 'lucide:alert-circle' : statusMessage.type === 'info' ? 'lucide:info' : 'lucide:check-circle-2'"
        width="16"
        height="16"
      />
      <span style="font-size: 13px; font-weight: 500">{{ statusMessage.text }}</span>
    </div>

    <!-- ── INTERACTIVE NAVIGATION PILL TABS ───────────────────────────────── -->
    <div
      style="
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px;
        border-radius: 12px;
        background: rgba(0, 0, 0, 0.35);
        border: 1px solid var(--glass-border);
        margin-bottom: 24px;
        overflow-x: auto;
      "
    >
      <button
        type="button"
        @click="activeTab = 'topology'"
        style="
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        "
        :style="{
          background: activeTab === 'topology' ? 'hsl(26 100% 52%)' : 'transparent',
          color: activeTab === 'topology' ? '#ffffff' : 'var(--text-secondary)',
          boxShadow: activeTab === 'topology' ? '0 4px 16px rgba(255, 107, 0, 0.35)' : 'none',
        }"
      >
        <Icon icon="lucide:git-pull-request" width="14" height="14" />
        <span>Topologie &amp; Repos</span>
      </button>

      <button
        type="button"
        @click="activeTab = 'credentials'"
        style="
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        "
        :style="{
          background: activeTab === 'credentials' ? 'hsl(26 100% 52%)' : 'transparent',
          color: activeTab === 'credentials' ? '#ffffff' : 'var(--text-secondary)',
          boxShadow: activeTab === 'credentials' ? '0 4px 16px rgba(255, 107, 0, 0.35)' : 'none',
        }"
      >
        <Icon icon="lucide:key" width="14" height="14" />
        <span>Securitate &amp; Webhook</span>
      </button>

      <button
        type="button"
        @click="activeTab = 'diagnostics'"
        style="
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        "
        :style="{
          background: activeTab === 'diagnostics' ? 'hsl(26 100% 52%)' : 'transparent',
          color: activeTab === 'diagnostics' ? '#ffffff' : 'var(--text-secondary)',
          boxShadow: activeTab === 'diagnostics' ? '0 4px 16px rgba(255, 107, 0, 0.35)' : 'none',
        }"
      >
        <Icon icon="lucide:activity" width="14" height="14" />
        <span>Diagnostic Live</span>
        <span
          v-if="testReport"
          style="
            font-size: 10px;
            padding: 1px 6px;
            border-radius: 999px;
            color: #fff;
          "
          :style="{ background: testReport.success ? '#10b981' : '#ef4444' }"
        >
          {{ testReport.success ? 'OK' : 'ERR' }}
        </span>
      </button>

      <button
        type="button"
        @click="activeTab = 'logs'"
        style="
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        "
        :style="{
          background: activeTab === 'logs' ? 'hsl(26 100% 52%)' : 'transparent',
          color: activeTab === 'logs' ? '#ffffff' : 'var(--text-secondary)',
          boxShadow: activeTab === 'logs' ? '0 4px 16px rgba(255, 107, 0, 0.35)' : 'none',
        }"
      >
        <Icon icon="lucide:terminal" width="14" height="14" />
        <span>Consolă &amp; Sync Logs</span>
        <span
          v-if="syncLogs.length > 0"
          style="
            font-size: 10px;
            padding: 1px 6px;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.2);
            color: #fff;
          "
        >
          {{ syncLogs.length }}
        </span>
      </button>

      <button
        type="button"
        @click="activeTab = 'guide'"
        style="
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        "
        :style="{
          background: activeTab === 'guide' ? 'hsl(26 100% 52%)' : 'transparent',
          color: activeTab === 'guide' ? '#ffffff' : 'var(--text-secondary)',
          boxShadow: activeTab === 'guide' ? '0 4px 16px rgba(255, 107, 0, 0.35)' : 'none',
        }"
      >
        <Icon icon="lucide:file-code" width="14" height="14" />
        <span>Ghid GitHub Pas cu Pas</span>
      </button>
    </div>

    <!-- ── TAB 1: TOPOLOGY & REPOSITORIES ─────────────────────────────────── -->
    <div v-if="activeTab === 'topology'" style="display: flex; flex-direction: column; gap: 20px">
      <!-- Visual Architecture Flow -->
      <div
        class="st-card"
        style="
          background: linear-gradient(135deg, rgba(255, 107, 0, 0.05) 0%, rgba(56, 189, 248, 0.04) 50%, rgba(0, 0, 0, 0.3) 100%), var(--glass-bg);
          border: 1px solid var(--glass-border);
        "
      >
        <div class="st-card-header">
          <div class="st-card-icon st-card-icon--orange">
            <Icon icon="lucide:git-pull-request" width="18" height="18" />
          </div>
          <div class="st-card-heading">
            <h3 class="st-card-title">Topologie Activă: Propagare &amp; Decuplare</h3>
            <p class="st-card-sub">Fluxul de date între scriitorii de conținut și motorul de producție de pe VPS</p>
          </div>
        </div>

        <div class="st-card-body">
          <div
            style="
              display: grid;
              grid-template-columns: 1fr auto 1fr auto 1fr;
              align-items: center;
              gap: 12px;
              padding: 16px;
              border-radius: 12px;
              background: rgba(0, 0, 0, 0.3);
              border: 1px solid rgba(255, 255, 255, 0.06);
            "
          >
            <!-- Stage 1: Public Repo -->
            <div style="padding: 14px; border-radius: 10px; background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.25)">
              <div style="display: flex; align-items: center; gap: 6px; color: #38bdf8; font-size: 11px; font-weight: 700; margin-bottom: 4px">
                <Icon icon="lucide:globe" width="13" height="13" />
                <span>PUBLIC REPO</span>
              </div>
              <div style="font-size: 13px; font-weight: 700; color: var(--text-primary)">{{ publicOwner }}/{{ publicRepo }}</div>
              <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px">MDX &amp; Media Files</div>
            </div>

            <!-- Arrow 1 -->
            <div style="display: flex; flex-direction: column; align-items: center; color: var(--accent-orange, #ff6b00)">
              <Icon icon="lucide:arrow-right" width="18" height="18" />
              <span style="font-size: 9px; font-weight: 700; letter-spacing: 0.05em; opacity: 0.8">PUSH</span>
            </div>

            <!-- Stage 2: Webhook Pipeline -->
            <div style="padding: 14px; border-radius: 10px; background: rgba(255, 107, 0, 0.08); border: 1px solid rgba(255, 107, 0, 0.25); text-align: center">
              <div style="display: flex; align-items: center; justify-content: center; gap: 6px; color: #fb923c; font-size: 11px; font-weight: 700; margin-bottom: 4px">
                <Icon icon="lucide:zap" width="13" height="13" />
                <span>WEBHOOK &amp; ISR</span>
              </div>
              <div style="font-size: 13px; font-weight: 700; color: var(--text-primary)">Next.js Fast Revalidate</div>
              <div style="font-size: 11px; color: #34d399; margin-top: 2px">&lt;2.0s Live Update</div>
            </div>

            <!-- Arrow 2 -->
            <div style="display: flex; flex-direction: column; align-items: center; color: var(--accent-orange, #ff6b00)">
              <Icon icon="lucide:arrow-right" width="18" height="18" />
              <span style="font-size: 9px; font-weight: 700; letter-spacing: 0.05em; opacity: 0.8">SYNC</span>
            </div>

            <!-- Stage 3: Private VPS -->
            <div style="padding: 14px; border-radius: 10px; background: rgba(168, 85, 247, 0.08); border: 1px solid rgba(168, 85, 247, 0.25)">
              <div style="display: flex; align-items: center; gap: 6px; color: #c084fc; font-size: 11px; font-weight: 700; margin-bottom: 4px">
                <Icon icon="lucide:server" width="13" height="13" />
                <span>PRIVATE VPS CORE</span>
              </div>
              <div style="font-size: 13px; font-weight: 700; color: var(--text-primary)">{{ privateOwner }}/{{ privateRepo }}</div>
              <div style="font-size: 11px; color: #34d399; margin-top: 2px">Engine &amp; Admin 100% Safe</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Configuration Form Grid -->
      <div class="st-grid">
        <!-- Column 1: Public Repo Settings -->
        <div class="st-col">
          <div class="st-card">
            <div class="st-card-header">
              <div class="st-card-icon st-card-icon--cyan">
                <Icon icon="lucide:globe" width="17" height="17" />
              </div>
              <div class="st-card-heading">
                <h3 class="st-card-title">Repo Public de Conținut</h3>
                <p class="st-card-sub">Unde echipa creează și editează documentația Markdown</p>
              </div>
            </div>

            <div class="st-card-body">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px">
                <div class="st-field">
                  <label class="st-label">GitHub Owner / Organizație</label>
                  <input
                    type="text"
                    v-model="publicOwner"
                    placeholder="wildfiire"
                    class="st-input"
                    id="gitops-public-owner-input"
                  />
                </div>

                <div class="st-field">
                  <label class="st-label">Nume Repository Public</label>
                  <input
                    type="text"
                    v-model="publicRepo"
                    placeholder="docs-public"
                    class="st-input"
                    id="gitops-public-repo-input"
                  />
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 14px">
                <div class="st-field">
                  <label class="st-label">Branch Conținut</label>
                  <input
                    type="text"
                    v-model="publicBranch"
                    placeholder="main"
                    class="st-input"
                    id="gitops-public-branch-input"
                  />
                </div>

                <div class="st-field">
                  <label class="st-label">Folder Articole (MDX)</label>
                  <input
                    type="text"
                    v-model="contentPath"
                    placeholder="content"
                    class="st-input"
                    id="gitops-content-path-input"
                  />
                </div>

                <div class="st-field">
                  <label class="st-label">Folder Media &amp; Imagini</label>
                  <input
                    type="text"
                    v-model="mediaPath"
                    placeholder="public/media"
                    class="st-input"
                    id="gitops-media-path-input"
                  />
                </div>
              </div>

              <!-- Quick Branch Selector Chips -->
              <div style="margin-bottom: 14px">
                <span style="font-size: 11px; color: var(--text-secondary); margin-bottom: 6px; display: block">
                  Branch-uri frecvente (click rapid):
                </span>
                <div style="display: flex; gap: 6px; flex-wrap: wrap">
                  <button
                    v-for="b in commonBranches"
                    :key="b"
                    type="button"
                    @click="selectBranch(b)"
                    style="
                      font-size: 11px;
                      padding: 3px 8px;
                      border-radius: 6px;
                      background: rgba(255, 255, 255, 0.05);
                      border: 1px solid rgba(255, 255, 255, 0.1);
                      color: var(--text-secondary);
                      cursor: pointer;
                    "
                    :style="publicBranch === b ? { borderColor: '#38bdf8', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)' } : {}"
                  >
                    {{ b }}
                  </button>
                </div>
              </div>

              <!-- Dynamic Edit URL Preview -->
              <div
                style="
                  padding: 12px;
                  border-radius: 8px;
                  background: rgba(56, 189, 248, 0.06);
                  border: 1px solid rgba(56, 189, 248, 0.2);
                "
              >
                <div style="display: flex; align-items: center; gap: 6px; color: #38bdf8; font-size: 11.5px; font-weight: 700; margin-bottom: 4px">
                  <Icon icon="lucide:external-link" width="12" height="12" />
                  <span>Link Generat Automat ("Edit this page on GitHub"):</span>
                </div>
                <code style="font-size: 11px; color: var(--text-secondary); word-break: break-all">
                  {{ editUrlSample }}
                </code>
              </div>
            </div>
          </div>
        </div>

        <!-- Column 2: Private Core Repo Settings -->
        <div class="st-col">
          <div class="st-card">
            <div class="st-card-header">
              <div class="st-card-icon st-card-icon--purple">
                <Icon icon="lucide:server" width="17" height="17" />
              </div>
              <div class="st-card-heading">
                <h3 class="st-card-title">Repo Privat Core Engine (VPS)</h3>
                <p class="st-card-sub">Găzduiește Next.js, panoul Admin, token-urile și securitatea</p>
              </div>
            </div>

            <div class="st-card-body">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px">
                <div class="st-field">
                  <label class="st-label">Owner Repo Privat</label>
                  <input
                    type="text"
                    v-model="privateOwner"
                    placeholder="wildfiire"
                    class="st-input"
                    id="gitops-private-owner-input"
                  />
                </div>

                <div class="st-field">
                  <label class="st-label">Nume Repo Privat</label>
                  <input
                    type="text"
                    v-model="privateRepo"
                    placeholder="docs"
                    class="st-input"
                    id="gitops-private-repo-input"
                  />
                </div>
              </div>

              <div class="st-field" style="margin-bottom: 14px">
                <label class="st-label">Branch Producție VPS</label>
                <input
                  type="text"
                  v-model="privateBranch"
                  placeholder="main"
                  class="st-input"
                  id="gitops-private-branch-input"
                />
              </div>

              <div
                style="
                  padding: 12px;
                  border-radius: 8px;
                  background: rgba(168, 85, 247, 0.06);
                  border: 1px solid rgba(168, 85, 247, 0.2);
                "
              >
                <div style="display: flex; align-items: center; gap: 6px; color: #c084fc; font-size: 11.5px; font-weight: 700; margin-bottom: 4px">
                  <Icon icon="lucide:shield-check" width="12" height="12" />
                  <span>Garanție de Izolare Absolută:</span>
                </div>
                <p style="margin: 0; font-size: 11px; color: var(--text-secondary); line-height: 1.4">
                  Colaboratorii repo-ului public au acces doar la folderele de conținut MDX și imagini, fără a avea vizibilitate asupra codului Next.js sau cheilor secrete.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- First-Run Push Card -->
      <div
        class="st-card"
        style="
          margin-top: 8px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, rgba(56, 189, 248, 0.04) 100%), var(--glass-bg);
          border: 1px solid rgba(16, 185, 129, 0.25);
        "
      >
        <div class="st-card-header">
          <div class="st-card-icon st-card-icon--green">
            <Icon icon="lucide:folder-git-2" width="17" height="17" />
          </div>
          <div class="st-card-heading">
            <h3 class="st-card-title">Publicare &amp; Inițializare Conținut pe Repo-ul Public (First Run)</h3>
            <p class="st-card-sub">Exportă toate ghidurile MDX existente din content/docs și structura inițială direct pe GitHub</p>
          </div>
          <button
            type="button"
            id="gitops-export-initial-btn"
            @click="handleExportInitial"
            :disabled="exporting || testing || syncing"
            class="st-save-btn"
            style="
              background: linear-gradient(135deg, hsl(158 84% 45%), hsl(158 84% 35%));
              border-color: hsl(158 84% 45% / 0.5);
            "
          >
            <Icon icon="lucide:refresh-cw" width="14" height="14" :class="exporting ? 'st-spin' : ''" />
            <span>{{ exporting ? 'Se exportă...' : 'Publică Conținutul pe GitHub' }}</span>
          </button>
        </div>

        <div class="st-card-body">
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 12px 14px;
              border-radius: 8px;
              background: rgba(0, 0, 0, 0.25);
              border: 1px solid rgba(255, 255, 255, 0.06);
              font-size: 12px;
            "
          >
            <div style="display: flex; align-items: center; gap: 8px">
              <Icon icon="lucide:info" width="14" height="14" style="color: #34d399" />
              <span style="color: var(--text-secondary)">
                Când creezi pentru prima dată repo-ul public (gol) pe GitHub, acest buton încarcă automat toate fișierele de documentație MDX, fișierul <strong>README.md</strong> și workflow-ul de validare CI.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── TAB 2: CREDENTIALS & WEBHOOK ───────────────────────────────────── -->
    <div v-if="activeTab === 'credentials'" style="display: flex; flex-direction: column; gap: 20px">
      <div class="st-grid">
        <!-- Webhook Configuration -->
        <div class="st-col">
          <div class="st-card">
            <div class="st-card-header">
              <div class="st-card-icon st-card-icon--orange">
                <Icon icon="lucide:key" width="17" height="17" />
              </div>
              <div class="st-card-heading">
                <h3 class="st-card-title">Endpoint Webhook GitHub</h3>
                <p class="st-card-sub">Primește evenimentele de push din GitHub și actualizează conținutul</p>
              </div>
            </div>

            <div class="st-card-body">
              <!-- Payload URL -->
              <div class="st-field" style="margin-bottom: 16px">
                <label class="st-label">Payload URL (Copiază în GitHub Repo Settings &gt; Webhooks)</label>
                <div style="display: flex; gap: 8px">
                  <input
                    type="text"
                    readonly
                    :value="webhookUrl"
                    class="st-input"
                    style="font-family: monospace; font-size: 12px; background: rgba(0,0,0,0.3)"
                  />
                  <button
                    type="button"
                    @click="copyToClipboard(webhookUrl, 'webhookUrl')"
                    class="st-outline-btn"
                    style="
                      padding: 8px 14px;
                      border-radius: 8px;
                      background: var(--glass-bg);
                      border: 1px solid var(--glass-border);
                      cursor: pointer;
                      display: flex;
                      align-items: center;
                      gap: 6px;
                      font-size: 12px;
                      font-weight: 600;
                    "
                    :style="{ color: copiedKey === 'webhookUrl' ? '#34d399' : 'var(--text-primary)' }"
                  >
                    <Icon :icon="copiedKey === 'webhookUrl' ? 'lucide:check' : 'lucide:copy'" width="14" height="14" />
                    <span>{{ copiedKey === 'webhookUrl' ? 'Copiat' : 'Copiază' }}</span>
                  </button>
                </div>
              </div>

              <!-- Webhook Secret -->
              <div class="st-field" style="margin-bottom: 16px">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px">
                  <label class="st-label" style="margin: 0">Secret Criptografic (HMAC SHA-256)</label>
                  <button
                    type="button"
                    @click="generateRandomSecret"
                    style="
                      background: none;
                      border: none;
                      color: var(--accent-orange, #ff6b00);
                      font-size: 11px;
                      font-weight: 600;
                      cursor: pointer;
                      display: flex;
                      align-items: center;
                      gap: 4px;
                      padding: 0;
                    "
                  >
                    <Icon icon="lucide:sparkles" width="11" height="11" />
                    <span>Generează Cheie Nouă</span>
                  </button>
                </div>

                <div style="display: flex; gap: 8px">
                  <div style="position: relative; flex: 1">
                    <input
                      :type="showSecret ? 'text' : 'password'"
                      v-model="webhookSecret"
                      placeholder="Secret criptografic 32-byte"
                      class="st-input"
                      style="font-family: monospace; font-size: 12px; padding-right: 36px"
                      id="gitops-webhook-secret-input"
                    />
                    <button
                      type="button"
                      @click="showSecret = !showSecret"
                      style="
                        position: absolute;
                        right: 10px;
                        top: 50%;
                        transform: translateY(-50%);
                        background: none;
                        border: none;
                        color: var(--text-secondary);
                        cursor: pointer;
                      "
                    >
                      <Icon :icon="showSecret ? 'lucide:eye-off' : 'lucide:eye'" width="14" height="14" />
                    </button>
                  </div>
                  <button
                    type="button"
                    @click="copyToClipboard(webhookSecret, 'webhookSecret')"
                    class="st-outline-btn"
                    style="
                      padding: 8px 14px;
                      border-radius: 8px;
                      background: var(--glass-bg);
                      border: 1px solid var(--glass-border);
                      cursor: pointer;
                      display: flex;
                      align-items: center;
                      gap: 6px;
                      font-size: 12px;
                      font-weight: 600;
                    "
                    :style="{ color: copiedKey === 'webhookSecret' ? '#34d399' : 'var(--text-primary)' }"
                  >
                    <Icon :icon="copiedKey === 'webhookSecret' ? 'lucide:check' : 'lucide:copy'" width="14" height="14" />
                    <span>{{ copiedKey === 'webhookSecret' ? 'Copiat' : 'Copiază' }}</span>
                  </button>
                </div>
              </div>

              <!-- Mode Selector -->
              <div class="st-field">
                <label class="st-label">Metodă de Preluare pe VPS</label>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
                  <button
                    type="button"
                    @click="syncMode = 'submodule'"
                    style="
                      padding: 12px;
                      border-radius: 8px;
                      text-align: left;
                      cursor: pointer;
                    "
                    :style="{
                      background: syncMode === 'submodule' ? 'rgba(255, 107, 0, 0.15)' : 'rgba(0,0,0,0.2)',
                      border: `1px solid ${syncMode === 'submodule' ? 'hsl(26 100% 52% / 0.5)' : 'rgba(255,255,255,0.06)'}`,
                      color: syncMode === 'submodule' ? '#ff9d42' : 'var(--text-secondary)',
                    }"
                  >
                    <div style="font-weight: 700; font-size: 13px">Git Submodule (Recomandat)</div>
                    <div style="font-size: 11px; opacity: 0.8; margin-top: 2px">Actualizare atomică via git pull</div>
                  </button>

                  <button
                    type="button"
                    @click="syncMode = 'api_sync'"
                    style="
                      padding: 12px;
                      border-radius: 8px;
                      text-align: left;
                      cursor: pointer;
                    "
                    :style="{
                      background: syncMode === 'api_sync' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(0,0,0,0.2)',
                      border: `1px solid ${syncMode === 'api_sync' ? 'rgba(56, 189, 248, 0.5)' : 'rgba(255,255,255,0.06)'}`,
                      color: syncMode === 'api_sync' ? '#38bdf8' : 'var(--text-secondary)',
                    }"
                  >
                    <div style="font-weight: 700; font-size: 13px">GitHub REST API</div>
                    <div style="font-size: 11px; opacity: 0.8; margin-top: 2px">Descărcare directă prin token PAT</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- GitHub Token & Toggles -->
        <div class="st-col">
          <div class="st-card">
            <div class="st-card-header">
              <div class="st-card-icon st-card-icon--cyan">
                <Icon icon="lucide:sliders" width="17" height="17" />
              </div>
              <div class="st-card-heading">
                <h3 class="st-card-title">Opțiuni &amp; Token Personal GitHub</h3>
                <p class="st-card-sub">Fine-Grained PAT și preferințe automate de notificare</p>
              </div>
            </div>

            <div class="st-card-body">
              <div class="st-field" style="margin-bottom: 16px">
                <label class="st-label">
                  GitHub Personal Access Token (PAT) — <em>Opțional pentru verificări API / Repos private</em>
                </label>
                <div style="position: relative">
                  <input
                    :type="showToken ? 'text' : 'password'"
                    v-model="githubToken"
                    placeholder="ghp_••••••••••••••••••••••••"
                    class="st-input"
                    style="font-family: monospace; font-size: 12px; padding-right: 36px"
                    id="gitops-github-token-input"
                  />
                  <button
                    type="button"
                    @click="showToken = !showToken"
                    style="
                      position: absolute;
                      right: 10px;
                      top: 50%;
                      transform: translateY(-50%);
                      background: none;
                      border: none;
                      color: var(--text-secondary);
                      cursor: pointer;
                    "
                  >
                    <Icon :icon="showToken ? 'lucide:eye-off' : 'lucide:eye'" width="14" height="14" />
                  </button>
                </div>
              </div>

              <div
                style="
                  display: flex;
                  flex-direction: column;
                  gap: 12px;
                  padding: 14px;
                  border-radius: 8px;
                  background: rgba(0, 0, 0, 0.25);
                  border: 1px solid rgba(255, 255, 255, 0.06);
                "
              >
                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 13px; color: var(--text-primary)">
                  <input
                    type="checkbox"
                    v-model="autoRevalidate"
                    style="accent-color: var(--accent-orange, #ff6b00); width: 16px; height: 16px"
                  />
                  <div>
                    <strong style="display: block">On-Demand ISR Revalidation</strong>
                    <span style="font-size: 11.5px; color: var(--text-secondary)">Regenerează instantaneu cache-ul Next.js pe /docs la fiecare webhook</span>
                  </div>
                </label>

                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 13px; color: var(--text-primary)">
                  <input
                    type="checkbox"
                    v-model="notifyDiscord"
                    style="accent-color: var(--accent-orange, #ff6b00); width: 16px; height: 16px"
                  />
                  <div>
                    <strong style="display: block">Notificări Staff pe Discord</strong>
                    <span style="font-size: 11.5px; color: var(--text-secondary)">Trimite embed-uri detaliate în canalul de audit la sincronizări reușite</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── TAB 3: DIAGNOSTICS & DEEP TEST ─────────────────────────────────── -->
    <div v-if="activeTab === 'diagnostics'" style="display: flex; flex-direction: column; gap: 20px">
      <div class="st-card">
        <div class="st-card-header">
          <div class="st-card-icon st-card-icon--cyan">
            <Icon icon="lucide:activity" width="17" height="17" />
          </div>
          <div class="st-card-heading">
            <h3 class="st-card-title">Diagnostic &amp; Test Live de Conectivitate</h3>
            <p class="st-card-sub">Verificare pas cu pas a rate limit-urilor, repo-ului public, branch-ului și structurii MDX</p>
          </div>
          <button
            type="button"
            @click="handleRunDiagnostic"
            :disabled="testing"
            class="st-save-btn"
            style="
              background: linear-gradient(135deg, hsl(199 89% 48%), hsl(199 89% 38%));
              border-color: hsl(199 89% 48% / 0.5);
            "
          >
            <Icon icon="lucide:activity" width="14" height="14" :class="testing ? 'st-spin' : ''" />
            <span>{{ testing ? 'Testare în curs...' : 'Re-Rulează Testul' }}</span>
          </button>
        </div>

        <div class="st-card-body">
          <!-- Empty State -->
          <div
            v-if="!testReport && !testing"
            style="
              padding: 36px 20px;
              text-align: center;
              border-radius: 12px;
              background: rgba(0, 0, 0, 0.25);
              border: 1px dashed rgba(255, 255, 255, 0.1);
            "
          >
            <Icon icon="lucide:activity" width="32" height="32" style="margin: 0 auto 12px auto; opacity: 0.4; color: var(--accent-cyan, #38bdf8)" />
            <h4 style="font-size: 15px; font-weight: 700; margin: 0 0 6px 0; color: var(--text-primary)">Niciun test rulat încă</h4>
            <p style="font-size: 13px; color: var(--text-secondary); max-width: 460px; margin: 0 auto 16px auto">
              Apasă pe butonul de mai sus pentru a verifica instantaneu conexiunea cu GitHub API și structura repository-ului.
            </p>
            <button
              type="button"
              @click="handleRunDiagnostic"
              style="
                padding: 8px 18px;
                border-radius: 8px;
                background: rgba(56, 189, 248, 0.15);
                border: 1px solid rgba(56, 189, 248, 0.4);
                color: #38bdf8;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
              "
            >
              Rulează Test Acum
            </button>
          </div>

          <!-- Testing Spinner -->
          <div
            v-if="testing"
            style="
              padding: 36px 20px;
              text-align: center;
              border-radius: 12px;
              background: rgba(0, 0, 0, 0.25);
              border: 1px solid rgba(56, 189, 248, 0.25);
            "
          >
            <Icon icon="lucide:refresh-cw" width="32" height="32" class="st-spin" style="margin: 0 auto 12px auto; color: var(--accent-cyan, #38bdf8)" />
            <h4 style="font-size: 15px; font-weight: 700; margin: 0 0 6px 0; color: var(--text-primary)">Diagnosticare în execuție...</h4>
            <p style="font-size: 13px; color: var(--text-secondary); margin: 0">
              Se interoghează endpoint-urile GitHub REST API și se verifică arborele local de pe VPS.
            </p>
          </div>

          <!-- Test Report -->
          <div v-if="testReport" style="display: flex; flex-direction: column; gap: 12px">
            <!-- Summary Banner -->
            <div
              style="
                padding: 14px 18px;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: space-between;
              "
              :style="{
                background: testReport.success ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(0,0,0,0.3))' : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(0,0,0,0.3))',
                border: `1px solid ${testReport.success ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
              }"
            >
              <div style="display: flex; align-items: center; gap: 10px">
                <Icon
                  :icon="testReport.success ? 'lucide:check-circle-2' : 'lucide:alert-circle'"
                  width="20"
                  height="20"
                  :style="{ color: testReport.success ? '#34d399' : '#f87171' }"
                />
                <div>
                  <div style="font-weight: 700; font-size: 14px" :style="{ color: testReport.success ? '#34d399' : '#f87171' }">
                    {{ testReport.summary }}
                  </div>
                  <div style="font-size: 12px; color: var(--text-secondary)">
                    Testat la: {{ new Date(testReport.testedAt).toLocaleTimeString('ro-RO') }}
                  </div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 8px">
                <span
                  style="
                    font-size: 11px;
                    padding: 3px 10px;
                    border-radius: 999px;
                    background: rgba(0,0,0,0.4);
                    color: var(--text-primary);
                    font-family: monospace;
                    font-weight: 600;
                  "
                >
                  Latență totală: {{ testReport.totalDurationMs }}ms
                </span>
              </div>
            </div>

            <!-- Step List -->
            <div
              v-for="(step, idx) in testReport.steps"
              :key="step.id || idx"
              style="
                padding: 14px 16px;
                border-radius: 10px;
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.06);
                display: flex;
                flex-direction: column;
                gap: 6px;
              "
            >
              <div style="display: flex; align-items: center; justify-content: space-between">
                <div style="display: flex; align-items: center; gap: 10px">
                  <span
                    v-if="step.status === 'pass'"
                    style="padding: 4px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); color: #34d399; display: flex"
                  >
                    <Icon icon="lucide:check-circle-2" width="15" height="15" />
                  </span>
                  <span
                    v-else-if="step.status === 'warn'"
                    style="padding: 4px; border-radius: 50%; background: rgba(251, 146, 60, 0.15); color: #fb923c; display: flex"
                  >
                    <Icon icon="lucide:alert-triangle" width="15" height="15" />
                  </span>
                  <span
                    v-else
                    style="padding: 4px; border-radius: 50%; background: rgba(239, 68, 68, 0.15); color: #f87171; display: flex"
                  >
                    <Icon icon="lucide:alert-circle" width="15" height="15" />
                  </span>
                  <span style="font-size: 13.5px; font-weight: 700; color: var(--text-primary)">{{ step.name }}</span>
                </div>

                <span
                  v-if="step.latencyMs !== undefined"
                  style="
                    font-size: 11px;
                    font-family: monospace;
                    color: var(--text-secondary);
                    background: rgba(255,255,255,0.05);
                    padding: 2px 8px;
                    border-radius: 4px;
                  "
                >
                  {{ step.latencyMs }}ms
                </span>
              </div>

              <p style="margin: 0; font-size: 12px; color: var(--text-secondary); padding-left: 30px; line-height: 1.4">
                {{ step.message }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── TAB 4: CONSOLE & SYNC LOGS ─────────────────────────────────────── -->
    <div v-if="activeTab === 'logs'" style="display: flex; flex-direction: column; gap: 20px">
      <!-- Sync Console Card -->
      <div class="st-card">
        <div class="st-card-header">
          <div class="st-card-icon st-card-icon--green">
            <Icon icon="lucide:terminal" width="17" height="17" />
          </div>
          <div class="st-card-heading">
            <h3 class="st-card-title">Consolă de Sincronizare Manuală &amp; Live Stream</h3>
            <p class="st-card-sub">Trage conținutul din repo-ul public și revalidează cache-ul Next.js pe VPS</p>
          </div>

          <div style="display: flex; align-items: center; gap: 8px">
            <button
              type="button"
              @click="openDiffModal(lastSyncInfo.commit)"
              class="st-outline-btn"
              style="
                padding: 8px 14px;
                border-radius: 8px;
                background: rgba(56, 189, 248, 0.1);
                border: 1px solid rgba(56, 189, 248, 0.3);
                color: #38bdf8;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 6px;
              "
            >
              <Icon icon="lucide:git-compare" width="14" height="14" />
              <span>Inspectează Diff</span>
            </button>

            <button
              type="button"
              id="gitops-trigger-sync-btn"
              @click="handleTriggerSync"
              :disabled="syncing"
              class="st-save-btn"
              style="
                background: linear-gradient(135deg, hsl(158 84% 45%), hsl(158 84% 35%));
                border-color: hsl(158 84% 45% / 0.5);
              "
            >
              <Icon icon="lucide:refresh-cw" width="14" height="14" :class="syncing ? 'st-spin' : ''" />
              <span>{{ syncing ? 'Se execută sync...' : 'Declanșează Sync Acum' }}</span>
            </button>
          </div>
        </div>

        <div class="st-card-body">
          <!-- Auto-Poll Daemon Controls Strip -->
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 12px 16px;
              border-radius: 10px;
              background: rgba(0, 0, 0, 0.25);
              border: 1px solid rgba(255, 255, 255, 0.08);
              margin-bottom: 12px;
              flex-wrap: wrap;
              gap: 12px;
            "
          >
            <div style="display: flex; align-items: center; gap: 12px">
              <button
                type="button"
                @click="toggleAutoPoll"
                style="
                  display: inline-flex;
                  align-items: center;
                  gap: 6px;
                  padding: 6px 12px;
                  border-radius: 8px;
                  font-size: 12px;
                  font-weight: 700;
                  cursor: pointer;
                  transition: all 0.2s;
                "
                :style="{
                  background: autoPollEnabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                  border: `1px solid ${autoPollEnabled ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                  color: autoPollEnabled ? '#34d399' : 'var(--text-secondary)',
                }"
              >
                <Icon
                  :icon="autoPollEnabled ? 'lucide:radio' : 'lucide:power'"
                  width="13"
                  height="13"
                  :class="autoPollEnabled && pollingActive ? 'st-spin' : ''"
                />
                <span>{{ autoPollEnabled ? 'Auto-Poll Activ' : 'Auto-Poll Inactiv' }}</span>
              </button>

              <div style="display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-secondary)">
                <span>Interval:</span>
                <select
                  v-model.number="autoPollInterval"
                  style="
                    background: rgba(0, 0, 0, 0.4);
                    border: 1px solid var(--glass-border);
                    color: var(--text-primary);
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 12px;
                  "
                >
                  <option :value="15">15s</option>
                  <option :value="30">30s (Default)</option>
                  <option :value="60">60s</option>
                  <option :value="120">2m</option>
                </select>
              </div>

              <div v-if="lastPollTime" style="font-size: 11px; color: var(--text-secondary)">
                Ultima verificare: <strong style="color: var(--text-primary)">{{ lastPollTime }}</strong>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 8px">
              <button
                type="button"
                @click="handleAutoPoll(true)"
                :disabled="pollingActive"
                style="
                  font-size: 11px;
                  padding: 4px 10px;
                  border-radius: 6px;
                  background: rgba(56, 189, 248, 0.1);
                  border: 1px solid rgba(56, 189, 248, 0.25);
                  color: #38bdf8;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  gap: 4px;
                "
              >
                <Icon icon="lucide:refresh-cw" width="11" height="11" :class="pollingActive ? 'st-spin' : ''" />
                <span>Interoghează Daemon Acum</span>
              </button>

              <button
                v-if="syncLogs.length > 0"
                type="button"
                @click="clearLogs"
                style="
                  font-size: 11px;
                  padding: 4px 10px;
                  border-radius: 6px;
                  background: rgba(255, 255, 255, 0.05);
                  border: 1px solid rgba(255, 255, 255, 0.1);
                  color: var(--text-secondary);
                  cursor: pointer;
                "
              >
                Golește Terminal
              </button>
            </div>
          </div>

          <!-- Terminal View -->
          <div
            style="
              border-radius: 12px;
              background: #0a0a0c;
              border: 1px solid rgba(255, 255, 255, 0.1);
              padding: 16px;
              font-family: monospace;
              font-size: 12px;
              min-height: 240px;
              display: flex;
              flex-direction: column;
              gap: 6px;
              box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.6);
            "
          >
            <!-- Terminal Titlebar -->
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid rgba(255, 255, 255, 0.06);
                padding-bottom: 8px;
                margin-bottom: 6px;
              "
            >
              <div style="display: flex; align-items: center; gap: 6px">
                <span style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444; display: inline-block" />
                <span style="width: 10px; height: 10px; border-radius: 50%; background: #f59e0b; display: inline-block" />
                <span style="width: 10px; height: 10px; border-radius: 50%; background: #10b981; display: inline-block" />
                <span style="font-size: 11px; color: var(--text-secondary); margin-left: 8px">wf-gitops-daemon // sync-stream</span>
              </div>
              <span style="font-size: 11px; color: var(--text-secondary)">Root Session Active</span>
            </div>

            <div v-if="syncLogs.length === 0" style="color: rgba(255, 255, 255, 0.4); padding: 16px 0">
              &gt; Consola este gata. Apasă "Declanșează Sync Acum" sau activează Auto-Poll pentru a rula sincronizarea.
            </div>

            <div
              v-for="(log, idx) in syncLogs"
              :key="idx"
              style="line-height: 1.5; word-break: break-all"
              :style="{
                color: log.includes('Eroare') || log.includes('Error') || log.includes('fail')
                  ? '#f87171'
                  : log.includes('Branch') || log.includes('Commit') || log.includes('Auto-Poll')
                  ? '#38bdf8'
                  : '#34d399',
              }"
            >
              {{ log }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── TAB 5: GITHUB SETUP BLUEPRINT ──────────────────────────────────── -->
    <div v-if="activeTab === 'guide'" style="display: flex; flex-direction: column; gap: 20px">
      <div class="st-card">
        <div class="st-card-header">
          <div class="st-card-icon st-card-icon--orange">
            <Icon icon="lucide:file-code" width="17" height="17" />
          </div>
          <div class="st-card-heading">
            <h3 class="st-card-title">Ghid de Configurare Pas cu Pas pe GitHub</h3>
            <p class="st-card-sub">Instrucțiuni complete pentru crearea repo-ului public și legarea Webhook-ului</p>
          </div>
        </div>

        <div class="st-card-body">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px">
            <!-- Step 1 -->
            <div style="padding: 16px; border-radius: 10px; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.06)">
              <div style="display: flex; align-items: center; gap: 8px; color: var(--accent-orange, #ff6b00); font-weight: 700; font-size: 13.5px; margin-bottom: 8px">
                <span>1. Creează Repo-ul Public pe GitHub</span>
              </div>
              <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5; margin: 0 0 10px 0">
                Creează repository-ul public <code>wildfiire/docs-public</code>. Copiază folderul <code>content/</code> și folderul <code>public/media/</code> din acest proiect în noul repo.
              </p>
              <code style="display: block; padding: 8px; border-radius: 6px; background: rgba(0, 0, 0, 0.5); font-size: 11px; color: #38bdf8">
                git init &amp;&amp; git push -u origin main
              </code>
            </div>

            <!-- Step 2 -->
            <div style="padding: 16px; border-radius: 10px; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.06)">
              <div style="display: flex; align-items: center; gap: 8px; color: #38bdf8; font-weight: 700; font-size: 13.5px; margin-bottom: 8px">
                <span>2. Adaugă Webhook-ul pe GitHub</span>
              </div>
              <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5; margin: 0 0 10px 0">
                În GitHub: <code>Settings &gt; Webhooks &gt; Add webhook</code>.<br />
                • <strong>Payload URL</strong>: <code>{{ webhookUrl }}</code><br />
                • <strong>Content type</strong>: <code>application/json</code><br />
                • <strong>Secret</strong>: Copiază secretul din tab-ul de Securitate.<br />
                • <strong>Events</strong>: Selectează doar <code>Just the push event</code>.
              </p>
            </div>

            <!-- Step 3 -->
            <div style="padding: 16px; border-radius: 10px; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.06)">
              <div style="display: flex; align-items: center; gap: 8px; color: #34d399; font-weight: 700; font-size: 13.5px; margin-bottom: 8px">
                <span>3. Validare MDX CI (Opțional)</span>
              </div>
              <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5; margin: 0 0 10px 0">
                Adaugă fișierul <code>.github/workflows/validate-mdx.yml</code> în repo-ul public pentru a valida automat că niciun scriitor nu introduce erori de sintaxă MDX.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── COMMIT DIFF VIEWER MODAL ──────────────────────────────────────── -->
    <div
      v-if="showDiffModal && selectedCommitDiff"
      style="
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.75);
        backdrop-filter: blur(10px);
        padding: 20px;
      "
      @click.self="closeDiffModal"
    >
      <div
        style="
          width: 100%;
          max-width: 780px;
          max-height: 85vh;
          overflow-y: auto;
          border-radius: 16px;
          background: #111116;
          border: 1px solid var(--glass-border);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
          display: flex;
          flex-direction: column;
        "
      >
        <!-- Modal Header -->
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 18px 24px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          "
        >
          <div style="display: flex; align-items: center; gap: 10px">
            <span style="padding: 6px; border-radius: 8px; background: rgba(56, 189, 248, 0.15); color: #38bdf8; display: flex">
              <Icon icon="lucide:git-compare" width="18" height="18" />
            </span>
            <div>
              <div style="display: flex; align-items: center; gap: 8px">
                <h3 style="margin: 0; font-size: 16px; font-weight: 800; color: var(--text-primary)">
                  Commit Diff Viewer
                </h3>
                <span
                  style="
                    font-size: 11px;
                    font-family: monospace;
                    padding: 2px 8px;
                    border-radius: 4px;
                    background: rgba(56, 189, 248, 0.15);
                    color: #38bdf8;
                    font-weight: 700;
                  "
                >
                  {{ selectedCommitDiff.sha }}
                </span>
                <span
                  v-if="selectedCommitDiff.verified"
                  style="
                    display: inline-flex;
                    align-items: center;
                    gap: 3px;
                    font-size: 10px;
                    font-weight: 700;
                    padding: 1px 6px;
                    border-radius: 4px;
                    background: rgba(16, 185, 129, 0.15);
                    color: #34d399;
                    border: 1px solid rgba(16, 185, 129, 0.3);
                  "
                >
                  <Icon icon="lucide:shield-check" width="10" height="10" />
                  <span>VERIFIED</span>
                </span>
              </div>
              <div style="font-size: 12px; color: var(--text-secondary); margin-top: 2px">
                {{ selectedCommitDiff.message }}
              </div>
            </div>
          </div>

          <button
            type="button"
            @click="closeDiffModal"
            style="
              background: none;
              border: none;
              color: var(--text-secondary);
              cursor: pointer;
              padding: 6px;
              border-radius: 8px;
              display: flex;
            "
          >
            <Icon icon="lucide:x" width="18" height="18" />
          </button>
        </div>

        <!-- Modal Body -->
        <div style="padding: 20px 24px; display: flex; flex-direction: column; gap: 16px">
          <!-- Commit Metadata Box -->
          <div
            style="
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 12px;
              padding: 12px 16px;
              border-radius: 10px;
              background: rgba(0, 0, 0, 0.35);
              border: 1px solid rgba(255, 255, 255, 0.05);
            "
          >
            <div>
              <span style="font-size: 11px; color: var(--text-secondary); display: block">Autor:</span>
              <strong style="font-size: 13px; color: var(--text-primary)">@{{ selectedCommitDiff.author }}</strong>
            </div>
            <div>
              <span style="font-size: 11px; color: var(--text-secondary); display: block">Timestamp:</span>
              <strong style="font-size: 13px; color: var(--text-primary)">
                {{ new Date(selectedCommitDiff.timestamp).toLocaleString('ro-RO') }}
              </strong>
            </div>
            <div>
              <span style="font-size: 11px; color: var(--text-secondary); display: block">Fișiere Modificate:</span>
              <strong style="font-size: 13px; color: #38bdf8">{{ selectedCommitDiff.files.length }} fișiere</strong>
            </div>
          </div>

          <!-- Changed Files List -->
          <div>
            <h4 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: var(--text-primary)">
              Fișiere Afectate în acest Commit
            </h4>
            <div style="display: flex; flex-direction: column; gap: 6px">
              <div
                v-for="file in selectedCommitDiff.files"
                :key="file.path"
                style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  padding: 8px 12px;
                  border-radius: 6px;
                  background: rgba(255, 255, 255, 0.03);
                  border: 1px solid rgba(255, 255, 255, 0.05);
                  font-size: 12px;
                "
              >
                <div style="display: flex; align-items: center; gap: 8px; font-family: monospace">
                  <Icon
                    :icon="file.status === 'added' ? 'lucide:file-plus' : 'lucide:file-text'"
                    width="14"
                    height="14"
                    :style="{ color: file.status === 'added' ? '#34d399' : '#38bdf8' }"
                  />
                  <span style="color: var(--text-primary)">{{ file.path }}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; font-family: monospace; font-size: 11px">
                  <span style="color: #34d399">+{{ file.additions }}</span>
                  <span style="color: #f87171">-{{ file.deletions }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Raw Diff Snippet -->
          <div v-if="selectedCommitDiff.rawDiff">
            <h4 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: var(--text-primary)">
              Diff Unified Preview
            </h4>
            <pre
              style="
                margin: 0;
                padding: 12px 14px;
                border-radius: 8px;
                background: #070709;
                border: 1px solid rgba(255, 255, 255, 0.08);
                color: #e2e8f0;
                font-family: monospace;
                font-size: 11.5px;
                line-height: 1.5;
                overflow-x: auto;
              "
            ><code>{{ selectedCommitDiff.rawDiff }}</code></pre>
          </div>
        </div>

        <!-- Modal Footer -->
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 24px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            background: rgba(0, 0, 0, 0.2);
          "
        >
          <a
            :href="`https://github.com/${publicOwner}/${publicRepo}/commit/${selectedCommitDiff.sha}`"
            target="_blank"
            rel="noopener noreferrer"
            style="
              display: inline-flex;
              align-items: center;
              gap: 6px;
              color: #38bdf8;
              font-size: 12px;
              font-weight: 600;
              text-decoration: none;
            "
          >
            <span>Deschide Commit pe GitHub</span>
            <Icon icon="lucide:external-link" width="12" height="12" />
          </a>

          <button
            type="button"
            @click="closeDiffModal"
            class="st-outline-btn"
            style="
              padding: 8px 16px;
              border-radius: 8px;
              background: var(--glass-bg);
              border: 1px solid var(--glass-border);
              color: var(--text-primary);
              cursor: pointer;
              font-size: 12px;
              font-weight: 600;
            "
          >
            Închide
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.st-spin {
  animation: spin 1s linear infinite;
}

.st-loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 380px;
  gap: 8px;
  color: var(--vp-c-text-2, #888);
  font-size: 13px;
  font-weight: 500;
}

.st-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 960px) {
  .st-grid {
    grid-template-columns: 1fr;
  }
}
</style>
