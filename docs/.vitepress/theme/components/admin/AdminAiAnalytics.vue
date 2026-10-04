<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';
import AdminMetricCard from './AdminMetricCard.vue';

// Gemini 2.5 Flash Lite Free Tier Limits
const FREE_TIER_RPD_LIMIT = 1500; // Requests per day
const FREE_TIER_RPM_LIMIT = 15; // Requests per minute
const CONTEXT_WINDOW_LIMIT = 1048576; // 1M tokens

export interface KnowledgeDoc {
  path: string;
  title: string;
  category: string;
  charCount: number;
  estTokens: number;
  lastModified: string;
}

export interface KnowledgeBaseData {
  docCount: number;
  totalChars: number;
  totalTokens: number;
  generatedAt: string;
  docs: KnowledgeDoc[];
}

export interface AiInteractionLog {
  id: string;
  timestamp: string;
  querySnippet: string;
  responseChars: number;
  promptTokens: number;
  candidatesTokens: number;
  totalTokens: number;
  latencyMs: number;
  status: 'success' | 'error' | 'rate_limited';
  model: string;
  estimatedCostUsd: number;
  ip: string;
  errorMessage?: string;
  feedback?: 'helpful' | 'unhelpful' | null;
  feedbackTimestamp?: string;
  feedbackReason?: string;
}

export interface DailyUsageItem {
  date: string;
  queries: number;
  totalTokens: number;
  costUsd: number;
}

export interface FullTelemetryData {
  lifetimeQueries: number;
  todayQueries: number;
  totalPromptTokens: number;
  totalCandidatesTokens: number;
  totalTokens: number;
  totalCostUsd: number;
  avgLatencyMs: number;
  successRate: number;
  totalHelpful: number;
  totalUnhelpful: number;
  satisfactionRate: number;
  model: string;
  docsContextCount: number;
  docsContextChars: number;
  dailyUsage: DailyUsageItem[];
  recentLogs: AiInteractionLog[];
  lastUpdated: string;
  knowledgeBase?: KnowledgeBaseData;
}

const props = defineProps<{
  user?: any;
}>();

const data = ref<FullTelemetryData | null>(null);
const loading = ref<boolean>(true);
const autoRefreshInterval = ref<number>(10);
const searchFilter = ref<string>('');
const statusFilter = ref<'all' | 'success' | 'error' | 'rate_limited' | 'helpful' | 'unhelpful'>('all');
const purgeLoading = ref<boolean>(false);

// Knowledge Explorer State
const kbCategoryFilter = ref<string>('all');
const kbSearchFilter = ref<string>('');
const rebuildLoading = ref<boolean>(false);
const rebuildMsg = ref<string | null>(null);

// Sandbox State
const sandboxPrompt = ref<string>('Care sunt cerințele minime pentru a aplica ca Helper?');
const sandboxLoading = ref<boolean>(false);
const sandboxResult = ref<{
  success: boolean;
  answer?: string;
  error?: string;
  latencyMs?: number;
  model?: string;
  usage?: { promptTokens: number; candidatesTokens: number; totalTokens: number };
} | null>(null);

async function loadAnalytics(showLoader = true) {
  if (showLoader) loading.value = true;
  try {
    const res = await fetch('/api/admin/ai-analytics');
    if (res.status === 401) {
      window.location.href = '/admin/login';
      return;
    }
    const json: FullTelemetryData = await res.json();
    data.value = json;
  } catch (err) {
    console.error('[AI Telemetry] Failed to fetch analytics:', err);
  } finally {
    if (showLoader) loading.value = false;
  }
}

let timer: ReturnType<typeof setInterval> | null = null;

watch(
  autoRefreshInterval,
  (newVal) => {
    if (timer) clearInterval(timer);
    if (newVal > 0) {
      timer = setInterval(() => {
        loadAnalytics(false);
      }, newVal * 1000);
    }
  },
  { immediate: true },
);

onMounted(() => {
  loadAnalytics();
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

async function handlePurge() {
  if (!window.confirm('Ești sigur că vrei să resetezi toate logurile și metricele AI Telemetry?')) {
    return;
  }
  purgeLoading.value = true;
  try {
    const res = await fetch('/api/admin/ai-analytics', { method: 'DELETE' });
    if (res.ok) {
      await loadAnalytics();
    }
  } catch (err) {
    console.error('Failed to purge AI telemetry:', err);
  } finally {
    purgeLoading.value = false;
  }
}

async function handleRebuildContext() {
  rebuildLoading.value = true;
  rebuildMsg.value = null;
  try {
    const res = await fetch('/api/admin/ai-analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'rebuild_context' }),
    });
    const json = await res.json();
    if (json.success) {
      rebuildMsg.value = json.message;
      await loadAnalytics(false);
      setTimeout(() => {
        rebuildMsg.value = null;
      }, 4000);
    }
  } catch (e: any) {
    rebuildMsg.value = 'Eroare la recompilare index.';
  } finally {
    rebuildLoading.value = false;
  }
}

async function handleRunSandbox() {
  if (!sandboxPrompt.value.trim() || sandboxLoading.value) return;
  sandboxLoading.value = true;
  sandboxResult.value = null;
  try {
    const res = await fetch('/api/admin/ai-analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'test_prompt', prompt: sandboxPrompt.value }),
    });
    const json = await res.json();
    sandboxResult.value = json;
    loadAnalytics(false);
  } catch (e: any) {
    sandboxResult.value = {
      success: false,
      error: e?.message || 'Eroare la execuția testului sandbox',
    };
  } finally {
    sandboxLoading.value = false;
  }
}

const filteredLogs = computed(() => {
  if (!data.value?.recentLogs) return [];
  const sFilter = searchFilter.value.trim().toLowerCase();
  const stFilter = statusFilter.value;

  return data.value.recentLogs.filter((log) => {
    const rawIp = log.ip && log.ip !== ':' ? log.ip : '127.0.0.1';
    const matchesSearch =
      !sFilter ||
      log.querySnippet.toLowerCase().includes(sFilter) ||
      rawIp.toLowerCase().includes(sFilter);

    const matchesStatus =
      stFilter === 'all'
        ? true
        : stFilter === 'helpful'
        ? log.feedback === 'helpful'
        : stFilter === 'unhelpful'
        ? log.feedback === 'unhelpful'
        : log.status === stFilter;

    return matchesSearch && matchesStatus;
  });
});

const filteredKbDocs = computed(() => {
  if (!data.value?.knowledgeBase?.docs) return [];
  const catFilter = kbCategoryFilter.value;
  const sFilter = kbSearchFilter.value.trim().toLowerCase();

  return data.value.knowledgeBase.docs.filter((doc) => {
    const matchesCat = catFilter === 'all' || doc.category.toLowerCase() === catFilter.toLowerCase();
    const matchesSearch =
      !sFilter ||
      doc.title.toLowerCase().includes(sFilter) ||
      doc.path.toLowerCase().includes(sFilter);
    return matchesCat && matchesSearch;
  });
});

// Quota Calculations
const todayQueries = computed(() => data.value?.todayQueries || 0);
const rpdPercent = computed(() =>
  Math.min(100, Math.round((todayQueries.value / FREE_TIER_RPD_LIMIT) * 100)),
);
const remainingToday = computed(() => Math.max(0, FREE_TIER_RPD_LIMIT - todayQueries.value));

const contextTokens = computed(() => data.value?.knowledgeBase?.totalTokens || 38000);
const contextWindowPercent = computed(() =>
  ((contextTokens.value / CONTEXT_WINDOW_LIMIT) * 100).toFixed(1),
);
</script>

<template>
  <div class="admin-page-container">
    <!-- Header -->
    <div class="admin-page-header">
      <div>
        <div class="admin-page-pretitle-tag">
          <Icon icon="lucide:sparkles" width="11" height="11" class="text-amber-400" />
          <span>INTELLIGENCE &amp; QUOTA CONTROL</span>
        </div>
        <h1 class="admin-page-title">AI Engine Telemetry &amp; Knowledge Inspector</h1>
        <p class="admin-page-desc">
          Monitor real-time Gemini token consumption, remaining API quota, response latencies, inspect grounded documentation knowledge base, and run diagnostic sandbox prompts.
        </p>
      </div>

      <div class="admin-header-actions">
        <div class="admin-sync-pill">
          <span class="admin-sync-dot" />
          <span>Live Sync:</span>
          <select
            v-model="autoRefreshInterval"
            class="admin-sync-select"
          >
            <option :value="5">Every 5s</option>
            <option :value="10">Every 10s</option>
            <option :value="30">Every 30s</option>
            <option :value="0">Manual</option>
          </select>
        </div>

        <button
          type="button"
          class="admin-btn admin-btn--secondary"
          :disabled="loading"
          @click="loadAnalytics(true)"
        >
          <Icon icon="lucide:refresh-cw" width="13" height="13" :class="{ 'admin-spin': loading }" />
          <span>Actualizează</span>
        </button>

        <button
          type="button"
          class="admin-btn admin-btn--danger"
          :disabled="purgeLoading || !data?.lifetimeQueries"
          @click="handlePurge"
        >
          <Icon icon="lucide:trash-2" width="13" height="13" />
          <span>Reset Telemetry</span>
        </button>
      </div>
    </div>

    <!-- Top 5 KPI Metrics -->
    <div class="admin-metrics-grid">
      <AdminMetricCard
        title="Total Interogări AI"
        :value="data ? data.lifetimeQueries.toLocaleString() : '—'"
        :change="data ? `${todayQueries} astăzi` : undefined"
        trend="positive"
        subtitle="Interogări procesate prin Gemini"
        icon="lucide:cpu"
      />

      <AdminMetricCard
        title="Satisfacție Răspunsuri"
        :value="data ? `${data.satisfactionRate}%` : '100%'"
        :change="data ? `${data.totalHelpful} Utile / ${data.totalUnhelpful} Inutile` : undefined"
        :trend="data && data.satisfactionRate >= 80 ? 'positive' : data && data.satisfactionRate >= 50 ? 'neutral' : 'down'"
        subtitle="Evaluări înregistrate live"
        icon="lucide:thumbs-up"
      />

      <AdminMetricCard
        title="Consum Total Tokeni"
        :value="data ? data.totalTokens.toLocaleString() : '—'"
        :change="data ? `${(data.totalTokens / 1000).toFixed(1)}k tokens` : undefined"
        trend="neutral"
        :subtitle="`In: ${data ? data.totalPromptTokens.toLocaleString() : 0} | Out: ${data ? data.totalCandidatesTokens.toLocaleString() : 0}`"
        icon="lucide:zap"
      />

      <AdminMetricCard
        title="Cost Estimat (Valoare)"
        :value="data ? `$${data.totalCostUsd.toFixed(4)}` : '$0.0000'"
        change="100% Free Tier"
        trend="positive"
        subtitle="Tarif Gemini: $0.075 / $0.30 per 1M"
        icon="lucide:dollar-sign"
      />

      <AdminMetricCard
        title="Latență Medie Motor"
        :value="data ? `${data.avgLatencyMs}ms` : '—'"
        :change="data ? `${data.successRate}% Rata Succes` : undefined"
        :trend="data && data.successRate >= 90 ? 'positive' : 'neutral'"
        subtitle="Timp mediu de execuție per request"
        icon="lucide:clock"
      />
    </div>

    <!-- Quota & Capacity Overview Cards -->
    <div class="admin-quota-section">
      <div class="admin-section-header">
        <div class="admin-section-title-wrap">
          <div class="admin-section-icon-box admin-section-icon-box--emerald">
            <Icon icon="lucide:gauge" width="16" height="16" />
          </div>
          <div>
            <span class="admin-section-tag admin-section-tag--emerald">LIVE CAPACITY METRICS</span>
            <h2 class="admin-section-title">Cât mai ai disponibil (Cote &amp; Limite Gemini Free Tier)</h2>
          </div>
        </div>
        <span class="admin-status-pill admin-status-pill--success">
          <Icon icon="lucide:check-circle-2" width="11" height="11" />
          <span>COTE ÎN PARAMETRII OPTIMI</span>
        </span>
      </div>

      <div class="admin-quota-grid">
        <!-- 1. Daily Requests Card -->
        <div class="admin-quota-card">
          <div class="admin-quota-top">
            <div class="admin-quota-icon-box admin-quota-icon-box--emerald">
              <Icon icon="lucide:flame" width="15" height="15" class="text-emerald-400" />
            </div>
            <div>
              <div class="admin-quota-title">Cota Zilnică de Cereri</div>
              <div class="admin-quota-sub">Max 1,500 cereri / zi (RPD)</div>
            </div>
            <div class="admin-quota-num">
              {{ todayQueries }} <span class="admin-quota-denom">/ 1500</span>
            </div>
          </div>

          <div class="admin-progress-track">
            <div
              class="admin-progress-bar admin-progress-bar--emerald"
              :style="{ width: `${Math.max(2, rpdPercent)}%` }"
            />
          </div>

          <div class="admin-quota-meta">
            <span>{{ remainingToday.toLocaleString() }} cereri rămase astăzi</span>
            <span class="text-emerald-400">{{ (100 - rpdPercent).toFixed(1) }}% disponibil</span>
          </div>
        </div>

        <!-- 2. Rate Limit & Token Budget Policy -->
        <div class="admin-quota-card">
          <div class="admin-quota-top">
            <div class="admin-quota-icon-box admin-quota-icon-box--cyan">
              <Icon icon="lucide:zap" width="15" height="15" class="text-cyan-400" />
            </div>
            <div>
              <div class="admin-quota-title">Buget &amp; Cooldown Client</div>
              <div class="admin-quota-sub">Sliding window rate limiter</div>
            </div>
            <div class="admin-quota-num">
              <span class="admin-perm-tag admin-perm-tag--cyan">180k tok / 3 min</span>
            </div>
          </div>

          <div class="admin-progress-track">
            <div class="admin-progress-bar admin-progress-bar--cyan" style="width: 24%" />
          </div>

          <div class="admin-quota-meta">
            <span>Max 6 interogări / 3 minute per IP</span>
            <span class="text-cyan-400">Protecție Activă</span>
          </div>
        </div>

        <!-- 3. Context Window Size -->
        <div class="admin-quota-card">
          <div class="admin-quota-top">
            <div class="admin-quota-icon-box admin-quota-icon-box--amber">
              <Icon icon="lucide:layers" width="15" height="15" class="text-amber-400" />
            </div>
            <div>
              <div class="admin-quota-title">Fereastră Context</div>
              <div class="admin-quota-sub">Capacitate max 1,048,576 tokens</div>
            </div>
            <div class="admin-quota-num">
              <span class="admin-perm-tag admin-perm-tag--amber">~{{ (contextTokens / 1000).toFixed(1) }}k / 1M</span>
            </div>
          </div>

          <div class="admin-progress-track">
            <div
              class="admin-progress-bar admin-progress-bar--amber"
              :style="{ width: `${Math.max(3, Number(contextWindowPercent))}%` }"
            />
          </div>

          <div class="admin-quota-meta">
            <span>{{ (CONTEXT_WINDOW_LIMIT - contextTokens).toLocaleString() }} tokens liberi per prompt</span>
            <span class="text-amber-400">Doar {{ contextWindowPercent }}% ocupat</span>
          </div>
        </div>

        <!-- 4. Billing & Free Tier Status -->
        <div class="admin-quota-card">
          <div class="admin-quota-top">
            <div class="admin-quota-icon-box admin-quota-icon-box--purple">
              <Icon icon="lucide:dollar-sign" width="15" height="15" class="text-purple-400" />
            </div>
            <div>
              <div class="admin-quota-title">Buget &amp; Facturare</div>
              <div class="admin-quota-sub">Status Google AI Studio</div>
            </div>
            <div class="admin-quota-num">
              <span class="admin-perm-tag admin-perm-tag--purple">FREE TIER</span>
            </div>
          </div>

          <div class="admin-progress-track">
            <div class="admin-progress-bar admin-progress-bar--purple" style="width: 100%" />
          </div>

          <div class="admin-quota-meta">
            <span>Cost facturat: $0.00 USD</span>
            <span class="text-purple-400">Nelimitat în cota Free</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── NEW: AI Knowledge Base Inspector & Index Explorer ────────── -->
    <div class="admin-panel-card mb-6">
      <div class="admin-panel-header">
        <div class="admin-section-title-wrap">
          <div class="admin-section-icon-box admin-section-icon-box--amber">
            <Icon icon="lucide:book-open" width="16" height="16" />
          </div>
          <div>
            <span class="admin-section-tag admin-section-tag--amber">GROUNDED CONTEXT REPO</span>
            <h2 class="admin-section-title">Inspector Cunoștințe &amp; Explorer Documente Indexate</h2>
            <p class="admin-panel-sub">
              Toate cele {{ data?.knowledgeBase?.docCount || 62 }} ghiduri oficiale sunt compilate în memorie și furnizate asistentului AI.
            </p>
          </div>
        </div>

        <div class="admin-header-actions">
          <span v-if="rebuildMsg" class="admin-status-pill admin-status-pill--success">
            <Icon icon="lucide:check" width="11" height="11" />
            <span>{{ rebuildMsg }}</span>
          </span>
          <button
            type="button"
            class="admin-btn admin-btn--primary"
            :disabled="rebuildLoading"
            title="Recompilează fișierul ai-context.json"
            @click="handleRebuildContext"
          >
            <Icon icon="lucide:refresh-cw" width="13" height="13" :class="{ 'admin-spin': rebuildLoading }" />
            <span>Recompilare Index ({{ data?.knowledgeBase?.docCount || 62 }} Ghiduri)</span>
          </button>
        </div>
      </div>

      <!-- KB Filter & Search Toolbar -->
      <div class="admin-table-toolbar">
        <div class="admin-table-filters">
          <button
            v-for="cat in ['all', 'informatii', 'currency', 'systems', 'market-donatii']"
            :key="cat"
            type="button"
            :class="['admin-filter-pill', { 'admin-filter-pill--active': kbCategoryFilter === cat }]"
            @click="kbCategoryFilter = cat"
          >
            {{ cat === 'all' ? 'Toate Categoriile' : cat.toUpperCase() }}
          </button>
        </div>

        <div class="admin-table-search">
          <div class="admin-search-input-wrap">
            <Icon icon="lucide:search" width="13" height="13" class="admin-search-icon" />
            <input
              type="text"
              v-model="kbSearchFilter"
              placeholder="Caută în ghiduri indexate..."
              class="admin-search-input"
            />
          </div>
        </div>
      </div>

      <!-- KB Table -->
      <div class="admin-table-container max-h-[360px] overflow-y-auto">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Titlu Ghid</th>
              <th>Categorie</th>
              <th>Cale Internă</th>
              <th>Caractere</th>
              <th>Tokeni Estimați</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredKbDocs.length === 0">
              <td colspan="5" class="admin-table-empty">
                <p>Nu s-au găsit ghiduri corespunzătoare filtrului.</p>
              </td>
            </tr>
            <tr v-else v-for="(doc, idx) in filteredKbDocs" :key="idx">
              <td>
                <div class="flex items-center gap-2">
                  <Icon icon="lucide:book-open" width="12" height="12" class="text-amber-500" />
                  <span class="font-semibold admin-doc-title">{{ doc.title }}</span>
                </div>
              </td>
              <td>
                <span class="admin-perm-tag admin-perm-tag--emerald">
                  {{ doc.category }}
                </span>
              </td>
              <td class="admin-table-mono admin-table-muted">/docs/{{ doc.path.replace(/\.md$/, '') }}</td>
              <td class="admin-table-mono">{{ doc.charCount.toLocaleString() }} chars</td>
              <td class="admin-table-mono text-amber-400">~{{ doc.estTokens.toLocaleString() }} tokens</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── NEW: AI Sandbox & Diagnostic Prompt Tester ───────────────── -->
    <div class="admin-panel-card mb-6">
      <div class="admin-panel-header">
        <div class="admin-section-title-wrap">
          <div class="admin-section-icon-box admin-section-icon-box--cyan">
            <Icon icon="lucide:terminal" width="16" height="16" />
          </div>
          <div>
            <span class="admin-section-tag admin-section-tag--cyan">PROMPT DIAGNOSTICS &amp; LATENCY</span>
            <h2 class="admin-section-title">AI Sandbox &amp; Prompt Diagnostic Tester</h2>
            <p class="admin-panel-sub">
              Testează răspunsurile asistentului în timp real și măsoară latența, consumul de tokeni și împământarea documentației.
            </p>
          </div>
        </div>
      </div>

      <div class="admin-sandbox-body">
        <!-- Quick Preset Chips -->
        <div class="admin-sandbox-presets">
          <span class="admin-sandbox-presets-label">Întrebări Test Rapide:</span>
          <button
            v-for="(q, qIdx) in [
              'Care sunt cerințele minime pentru Helper?',
              'Ce beneficii oferă gradul VIP Mythic?',
              'Cum funcționează comanda !mvp pe server?',
              'Câte Phoenix Coins primesc la donație?',
            ]"
            :key="qIdx"
            type="button"
            class="admin-sandbox-preset-btn"
            @click="sandboxPrompt = q"
          >
            <Icon icon="lucide:sparkles" width="11" height="11" class="text-cyan-400" />
            <span>{{ q }}</span>
          </button>
        </div>

        <div class="admin-sandbox-form">
          <div class="admin-sandbox-textarea-wrap">
            <textarea
              v-model="sandboxPrompt"
              class="admin-sandbox-textarea"
              placeholder="Scrie o întrebare de test pentru asistentul AI..."
            />
          </div>
          <button
            type="button"
            class="admin-sandbox-submit-btn"
            :disabled="sandboxLoading || !sandboxPrompt.trim()"
            @click="handleRunSandbox"
          >
            <template v-if="sandboxLoading">
              <Icon icon="lucide:refresh-cw" width="14" height="14" class="admin-spin" />
              <span>Rulează...</span>
            </template>
            <template v-else>
              <Icon icon="lucide:play" width="14" height="14" />
              <span>Execută Sandbox</span>
            </template>
          </button>
        </div>

        <!-- Sandbox Result View -->
        <div v-if="sandboxResult" class="admin-sandbox-result-card">
          <div class="admin-sandbox-result-header">
            <div class="admin-sandbox-result-badges">
              <span
                :class="[
                  'admin-status-pill',
                  sandboxResult.success ? 'admin-status-pill--success' : 'admin-status-pill--danger',
                ]"
              >
                <Icon
                  :icon="sandboxResult.success ? 'lucide:check-circle-2' : 'lucide:alert-circle'"
                  width="11"
                  height="11"
                />
                <span>
                  {{ sandboxResult.success ? 'DIAGNOSTIC REUȘIT' : 'EROARE EXECUTARE' }}
                </span>
              </span>
              <span v-if="sandboxResult.model" class="admin-perm-tag admin-perm-tag--cyan">
                {{ sandboxResult.model }}
              </span>
            </div>

            <div class="admin-sandbox-result-meta">
              <span v-if="sandboxResult.latencyMs !== undefined">
                Latență: <strong class="admin-sandbox-meta-val">{{ sandboxResult.latencyMs }}ms</strong>
              </span>
              <span v-if="sandboxResult.usage">
                Tokeni:
                <strong class="text-amber-400">
                  {{ sandboxResult.usage.totalTokens.toLocaleString() }}
                </strong>
                ({{ sandboxResult.usage.promptTokens.toLocaleString() }} in /
                {{ sandboxResult.usage.candidatesTokens.toLocaleString() }} out)
              </span>
            </div>
          </div>

          <div
            v-if="sandboxResult.success && sandboxResult.answer"
            class="admin-sandbox-result-content"
          >
            {{ sandboxResult.answer }}
          </div>

          <div
            v-if="!sandboxResult.success && sandboxResult.error"
            class="admin-sandbox-result-error"
          >
            {{ sandboxResult.error }}
          </div>
        </div>
      </div>
    </div>

    <!-- Live AI Logs Audit Table -->
    <div class="admin-panel-card">
      <div class="admin-panel-header">
        <div class="admin-section-title-wrap">
          <div class="admin-section-icon-box admin-section-icon-box--orange">
            <Icon icon="lucide:activity" width="16" height="16" />
          </div>
          <div>
            <span class="admin-section-tag admin-section-tag--orange">REAL-TIME AUDIT LOGS</span>
            <h2 class="admin-section-title">Istoric Interogări AI &amp; Audit Live</h2>
            <p class="admin-panel-sub">
              Ultimele 100 de interogări procesate, statusul de execuție, consumul de tokeni și IP-ul clientului.
            </p>
          </div>
        </div>
      </div>

      <!-- Filters Toolbar -->
      <div class="admin-table-toolbar">
        <div class="admin-table-filters">
          <button
            type="button"
            :class="['admin-filter-pill', { 'admin-filter-pill--active': statusFilter === 'all' }]"
            @click="statusFilter = 'all'"
          >
            Toate ({{ data?.recentLogs?.length || 0 }})
          </button>
          <button
            type="button"
            :class="['admin-filter-pill', { 'admin-filter-pill--active': statusFilter === 'success' }]"
            @click="statusFilter = 'success'"
          >
            Succes
          </button>
          <button
            type="button"
            :class="['admin-filter-pill', { 'admin-filter-pill--active': statusFilter === 'helpful' }]"
            @click="statusFilter = 'helpful'"
          >
            <Icon icon="lucide:thumbs-up" width="11" height="11" class="text-emerald-400" />
            <span>Utile ({{ data?.recentLogs?.filter((l) => l.feedback === 'helpful').length || 0 }})</span>
          </button>
          <button
            type="button"
            :class="['admin-filter-pill', { 'admin-filter-pill--active': statusFilter === 'unhelpful' }]"
            @click="statusFilter = 'unhelpful'"
          >
            <Icon icon="lucide:thumbs-down" width="11" height="11" class="text-rose-400" />
            <span>Inutile ({{ data?.recentLogs?.filter((l) => l.feedback === 'unhelpful').length || 0 }})</span>
          </button>
          <button
            type="button"
            :class="['admin-filter-pill', { 'admin-filter-pill--active': statusFilter === 'error' }]"
            @click="statusFilter = 'error'"
          >
            Erori
          </button>
          <button
            type="button"
            :class="['admin-filter-pill', { 'admin-filter-pill--active': statusFilter === 'rate_limited' }]"
            @click="statusFilter = 'rate_limited'"
          >
            Limited
          </button>
        </div>

        <div class="admin-table-search">
          <div class="admin-search-input-wrap">
            <Icon icon="lucide:search" width="13" height="13" class="admin-search-icon" />
            <input
              type="text"
              v-model="searchFilter"
              placeholder="Caută în întrebări sau IP..."
              class="admin-search-input"
            />
          </div>
        </div>
      </div>

      <!-- Logs Table -->
      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Data &amp; Ora</th>
              <th>Întrebare Utilizator</th>
              <th>Status</th>
              <th>Feedback</th>
              <th>Latență</th>
              <th>Tokeni (In / Out / Tot)</th>
              <th>Cost Estimat</th>
              <th>IP Client</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredLogs.length === 0">
              <td colspan="8" class="admin-table-empty">
                <p>Nu există interogări înregistrate conform filtrelor selectate.</p>
              </td>
            </tr>
            <tr v-else v-for="log in filteredLogs" :key="log.id">
              <td class="admin-table-muted admin-table-mono">
                {{
                  new Date(log.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })
                }}
              </td>
              <td class="admin-table-query">
                <span class="admin-query-snippet" :title="log.querySnippet">
                  {{ log.querySnippet || '—' }}
                </span>
                <span v-if="log.errorMessage" class="admin-log-err" :title="log.errorMessage">
                  {{ log.errorMessage }}
                </span>
              </td>
              <td>
                <span
                  v-if="log.status === 'success'"
                  class="admin-status-pill admin-status-pill--success"
                >
                  <Icon icon="lucide:check-circle-2" width="11" height="11" />
                  <span>SUCCES</span>
                </span>
                <span
                  v-else-if="log.status === 'error'"
                  class="admin-status-pill admin-status-pill--danger"
                >
                  <Icon icon="lucide:alert-circle" width="11" height="11" />
                  <span>EROARE</span>
                </span>
                <span
                  v-else-if="log.status === 'rate_limited'"
                  class="admin-status-pill admin-status-pill--warning"
                >
                  <Icon icon="lucide:clock" width="11" height="11" />
                  <span>LIMITED</span>
                </span>
              </td>
              <td>
                <span
                  v-if="log.feedback === 'helpful'"
                  class="admin-status-pill admin-status-pill--success"
                  title="Utilizatorul a marcat răspunsul ca util"
                >
                  <Icon icon="lucide:thumbs-up" width="11" height="11" />
                  <span>UTIL</span>
                </span>
                <span
                  v-else-if="log.feedback === 'unhelpful'"
                  class="admin-status-pill admin-status-pill--danger"
                  :title="log.feedbackReason ? `Motiv: ${log.feedbackReason}` : 'Utilizatorul a marcat răspunsul ca nesatisfăcător'"
                >
                  <Icon icon="lucide:thumbs-down" width="11" height="11" />
                  <span>INUTIL</span>
                </span>
                <span v-else class="admin-table-muted text-xs">—</span>
              </td>
              <td class="admin-table-mono">{{ log.latencyMs }}ms</td>
              <td>
                <div class="admin-tokens-breakdown">
                  <span class="admin-perm-tag admin-perm-tag--blue">
                    {{ log.promptTokens.toLocaleString() }} in
                  </span>
                  <span class="admin-perm-tag admin-perm-tag--emerald">
                    {{ log.candidatesTokens.toLocaleString() }} out
                  </span>
                  <span class="admin-table-sub">
                    ({{ log.totalTokens.toLocaleString() }} tot)
                  </span>
                </div>
              </td>
              <td class="admin-table-mono">
                ${{ log.estimatedCostUsd > 0 ? log.estimatedCostUsd.toFixed(5) : '0.00000' }}
              </td>
              <td class="admin-table-muted admin-table-mono">
                <span class="admin-ip-pill">
                  <Icon icon="lucide:globe" width="10" height="10" />
                  {{ log.ip && log.ip !== ':' ? log.ip : '127.0.0.1' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
