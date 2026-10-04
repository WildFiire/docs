<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';

export interface TopQueryItem {
  query: string;
  count: number;
  resultCount: number;
}

export interface SearchLogItem {
  id: string;
  query: string;
  resultCount: number;
  latencyMs: number;
  timestamp: string;
  ip: string;
}

export interface AnalyticsData {
  totalSearches: number;
  missedCount: number;
  missedRate: number;
  avgLatencyMs: string;
  topQueries: TopQueryItem[];
  recentLogs: SearchLogItem[];
  missedLogs: SearchLogItem[];
}

export type TabKey = 'missed' | 'top' | 'recent';

const props = defineProps<{
  user?: any;
}>();

const data = ref<AnalyticsData | null>(null);
const loading = ref<boolean>(true);
const activeTab = ref<TabKey>('missed');
const lastRefresh = ref<string>('');

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'missed', label: 'Content Gaps', icon: 'lucide:file-question' },
  { key: 'top', label: 'Top Queries', icon: 'lucide:trending-up' },
  { key: 'recent', label: 'Recent Searches', icon: 'lucide:activity' },
];

function latencyClass(ms: number): string {
  if (ms < 20) return 'sa-latency--fast';
  if (ms < 80) return 'sa-latency--ok';
  return 'sa-latency--slow';
}

function relTime(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'chiar acum';
  if (m < 60) return `${m}m în urmă`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h în urmă`;
  return new Date(ts).toLocaleDateString('ro-RO');
}

const coverageRate = computed(() => {
  return data.value ? Math.max(0, 100 - (data.value.missedRate ?? 0)) : 100;
});

async function loadAnalytics() {
  loading.value = true;
  try {
    const res = await fetch('/api/admin/search-analytics');
    if (res.status === 401) {
      window.location.href = '/admin/login';
      return;
    }
    const json = await res.json();
    data.value = json;
    lastRefresh.value = new Date().toLocaleTimeString('ro-RO', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch (err) {
    console.error('Failed to load search analytics', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadAnalytics();
});
</script>

<template>
  <div class="admin-page-container">
    <!-- ── HEADER ──────────────────────────────────────────────────── -->
    <div class="sa-header">
      <div class="sa-header-left">
        <div class="sa-breadcrumb">
          <Icon icon="lucide:bar-chart-3" width="11" height="11" />
          <span>DISCOVERY TELEMETRY</span>
          <span class="sa-breadcrumb-sep">/</span>
          <span>SEARCH ANALYTICS</span>
        </div>
        <h1 class="sa-title">Search Telemetry &amp; Content Gap Inspector</h1>
        <p class="sa-subtitle">
          Analizează interogările în timp real, identifică articolele lipsă
          (căutări fără rezultate) și monitorizează latența motorului de căutare.
        </p>
      </div>

      <div class="sa-header-actions">
        <div v-if="lastRefresh" class="sa-last-refresh">
          <Icon icon="lucide:clock" width="11" height="11" />
          <span>{{ lastRefresh }}</span>
        </div>
        <button
          type="button"
          id="sa-refresh-btn"
          class="sa-refresh-btn"
          :disabled="loading"
          @click="loadAnalytics"
        >
          <Icon icon="lucide:refresh-cw" width="13" height="13" :class="{ 'sa-spin': loading }" />
          <span>{{ loading ? 'Se încarcă...' : 'Refresh Telemetry' }}</span>
        </button>
      </div>
    </div>

    <!-- ── KPI STRIP ───────────────────────────────────────────────── -->
    <div class="sa-kpi-strip">
      <!-- Total searches -->
      <div class="sa-kpi-cell">
        <div class="sa-kpi-icon sa-kpi-icon--purple">
          <Icon icon="lucide:search" width="20" height="20" />
        </div>
        <div class="sa-kpi-body">
          <span class="sa-kpi-number">{{ loading ? '—' : data?.totalSearches ?? 0 }}</span>
          <span class="sa-kpi-label">Total Căutări</span>
          <span class="sa-kpi-desc">Interogări indexate</span>
        </div>
      </div>

      <div class="sa-kpi-sep" />

      <!-- Coverage Rate -->
      <div class="sa-kpi-cell sa-kpi-cell--coverage">
        <div class="sa-kpi-icon sa-kpi-icon--green">
          <Icon icon="lucide:check-circle-2" width="20" height="20" />
        </div>
        <div class="sa-kpi-body">
          <span class="sa-kpi-number sa-kpi-number--green">
            {{ loading ? '—' : `${coverageRate.toFixed(0)}%` }}
          </span>
          <span class="sa-kpi-label">Coverage Rate</span>
          <div class="sa-coverage-bar-wrap">
            <div class="sa-coverage-bar">
              <div
                class="sa-coverage-bar-fill"
                :style="{ width: loading ? '0%' : `${coverageRate}%` }"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="sa-kpi-sep" />

      <!-- Missed queries -->
      <div class="sa-kpi-cell">
        <div class="sa-kpi-icon sa-kpi-icon--red">
          <Icon icon="lucide:alert-triangle" width="20" height="20" />
        </div>
        <div class="sa-kpi-body">
          <span class="sa-kpi-number sa-kpi-number--red">{{ loading ? '—' : data?.missedCount ?? 0 }}</span>
          <span class="sa-kpi-label">Căutări Ratate (0 Rezultate)</span>
          <span class="sa-kpi-desc">
            {{ loading ? '—' : `${data?.missedRate ?? 0}% miss rate · Oportunități noi` }}
          </span>
        </div>
      </div>

      <div class="sa-kpi-sep" />

      <!-- Avg latency -->
      <div class="sa-kpi-cell">
        <div class="sa-kpi-icon sa-kpi-icon--cyan">
          <Icon icon="lucide:zap" width="20" height="20" />
        </div>
        <div class="sa-kpi-body">
          <span class="sa-kpi-number sa-kpi-number--cyan">{{ loading ? '—' : `${data?.avgLatencyMs ?? 0}ms` }}</span>
          <span class="sa-kpi-label">Latență Medie</span>
          <span class="sa-kpi-desc">Viteză motor in-memory</span>
        </div>
      </div>

      <div class="sa-kpi-sep" />

      <!-- Top query -->
      <div class="sa-kpi-cell">
        <div class="sa-kpi-icon sa-kpi-icon--amber">
          <Icon icon="lucide:trending-up" width="20" height="20" />
        </div>
        <div class="sa-kpi-body">
          <span class="sa-kpi-number sa-kpi-number--sm">
            {{ loading ? '—' : data?.topQueries?.[0]?.count ?? 0 }}
          </span>
          <span class="sa-kpi-label">Top Interogare</span>
          <span class="sa-kpi-desc sa-kpi-desc--query">
            {{ data?.topQueries?.[0]?.query ? `"${data.topQueries[0].query}"` : '—' }}
          </span>
        </div>
      </div>
    </div>

    <!-- ── MAIN PANEL ──────────────────────────────────────────────── -->
    <div class="sa-panel">
      <!-- Panel header with tabs -->
      <div class="sa-panel-toolbar">
        <div class="sa-panel-title">
          <Icon icon="lucide:activity" width="14" height="14" class="sa-panel-title-icon" />
          <span>Query Stream</span>
          <span v-if="!loading" class="sa-panel-count">
            {{
              activeTab === 'missed'
                ? data?.missedCount ?? 0
                : activeTab === 'top'
                ? data?.topQueries?.length ?? 0
                : data?.recentLogs?.length ?? 0
            }}
          </span>
        </div>

        <div class="sa-tab-group">
          <button
            v-for="tab in TABS"
            :key="tab.key"
            type="button"
            :id="`sa-tab-${tab.key}`"
            :class="['sa-tab', { 'sa-tab--active': activeTab === tab.key }]"
            @click="activeTab = tab.key"
          >
            <Icon :icon="tab.icon" width="13" height="13" />
            <span>{{ tab.label }}</span>
            <span
              v-if="tab.key === 'missed' && (data?.missedCount ?? 0) > 0"
              class="sa-tab-alert"
            >
              {{ data!.missedCount }}
            </span>
          </button>
        </div>
      </div>

      <!-- ── LOADING ── -->
      <div v-if="loading" class="sa-loading">
        <div class="sa-loading-orb">
          <Icon icon="lucide:refresh-cw" width="20" height="20" class="sa-spin" />
        </div>
        <p class="sa-loading-text">Se încarcă telemetria de căutare...</p>
      </div>

      <!-- ── MISSED CONTENT GAPS ── -->
      <template v-else-if="activeTab === 'missed'">
        <div v-if="!data?.missedLogs || data.missedLogs.length === 0" class="sa-empty">
          <div class="sa-empty-orb sa-empty-orb--green">
            <Icon icon="lucide:check-circle-2" width="26" height="26" />
          </div>
          <p class="sa-empty-title">Nicio căutare ratată!</p>
          <p class="sa-empty-sub">
            Acoperirea documentației este optimă. Toate interogările returnează rezultate.
          </p>
        </div>

        <div v-else class="sa-table-wrap">
          <table class="sa-table">
            <thead>
              <tr>
                <th><Icon icon="lucide:hash" width="12" height="12" /> Interogare Ratată (0 Rezultate)</th>
                <th><Icon icon="lucide:clock" width="12" height="12" /> Timestamp</th>
                <th><Icon icon="lucide:wifi" width="12" height="12" /> IP</th>
                <th><Icon icon="lucide:zap" width="12" height="12" /> Latență</th>
                <th>Acțiune</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in data.missedLogs" :key="log.id" class="sa-table-row sa-table-row--missed">
                <td>
                  <div class="sa-query-cell">
                    <div class="sa-query-dot sa-query-dot--missed" />
                    <span class="sa-query-missed">"{{ log.query }}"</span>
                  </div>
                </td>
                <td>
                  <div class="sa-time-cell">
                    <span class="sa-time-rel">{{ relTime(log.timestamp) }}</span>
                    <span class="sa-time-abs">{{ new Date(log.timestamp).toLocaleString('ro-RO') }}</span>
                  </div>
                </td>
                <td>
                  <code class="sa-ip-chip">{{ log.ip }}</code>
                </td>
                <td>
                  <span :class="['sa-latency-pill', latencyClass(log.latencyMs)]">
                    {{ log.latencyMs }}ms
                  </span>
                </td>
                <td>
                  <a
                    :href="`/admin/content?newDoc=true&slug=${encodeURIComponent(
                      log.query.toLowerCase().replace(/[^a-z0-9-_]/g, '-')
                    )}&title=${encodeURIComponent(log.query)}&category=informatii`"
                    class="sa-create-btn"
                  >
                    <Icon icon="lucide:plus" width="11" height="11" />
                    <span>Creează Doc</span>
                    <Icon icon="lucide:chevron-right" width="11" height="11" />
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- ── TOP QUERIES ── -->
      <template v-else-if="activeTab === 'top'">
        <div v-if="!data?.topQueries || data.topQueries.length === 0" class="sa-empty">
          <div class="sa-empty-orb">
            <Icon icon="lucide:trending-up" width="26" height="26" />
          </div>
          <p class="sa-empty-title">Nicio interogare înregistrată încă.</p>
          <p class="sa-empty-sub">Top-ul se va popula automat pe măsură ce utilizatorii caută în docs.</p>
        </div>

        <div v-else class="sa-table-wrap">
          <table class="sa-table">
            <thead>
              <tr>
                <th>#</th>
                <th><Icon icon="lucide:search" width="12" height="12" /> Interogare</th>
                <th><Icon icon="lucide:bar-chart-3" width="12" height="12" /> Total Căutări</th>
                <th><Icon icon="lucide:hash" width="12" height="12" /> Rezultate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in data.topQueries" :key="idx" class="sa-table-row">
                <td>
                  <span class="sa-rank-badge">#{{ idx + 1 }}</span>
                </td>
                <td>
                  <div class="sa-query-cell">
                    <div
                      :class="[
                        'sa-query-dot',
                        item.resultCount > 0 ? 'sa-query-dot--ok' : 'sa-query-dot--missed',
                      ]"
                    />
                    <span class="sa-query-text">"{{ item.query }}"</span>
                  </div>
                </td>
                <td>
                  <div class="sa-count-cell">
                    <span class="sa-count-bar-bg">
                      <span
                        class="sa-count-bar-fill"
                        :style="{
                          width: `${Math.min(100, (item.count / (data.topQueries[0]?.count || 1)) * 100)}%`,
                        }"
                      />
                    </span>
                    <span class="sa-count-num">{{ item.count }}</span>
                  </div>
                </td>
                <td>
                  <span
                    :class="[
                      'sa-result-pill',
                      item.resultCount > 0 ? 'sa-result-pill--covered' : 'sa-result-pill--missing',
                    ]"
                  >
                    {{ item.resultCount }} {{ item.resultCount === 1 ? 'articol' : 'articole' }}
                  </span>
                </td>
                <td>
                  <span
                    v-if="item.resultCount > 0"
                    class="sa-status-pill sa-status-pill--covered"
                  >
                    <Icon icon="lucide:check-circle-2" width="10" height="10" />
                    Acoperit
                  </span>
                  <span
                    v-else
                    class="sa-status-pill sa-status-pill--missing"
                  >
                    <Icon icon="lucide:alert-triangle" width="10" height="10" />
                    Lipsă Doc
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- ── RECENT SEARCHES ── -->
      <template v-else-if="activeTab === 'recent'">
        <div v-if="!data?.recentLogs || data.recentLogs.length === 0" class="sa-empty">
          <div class="sa-empty-orb">
            <Icon icon="lucide:activity" width="26" height="26" />
          </div>
          <p class="sa-empty-title">Nicio căutare recentă înregistrată.</p>
          <p class="sa-empty-sub">Activitatea de căutare va apărea imediat ce utilizatorii caută în platformă.</p>
        </div>

        <div v-else class="sa-table-wrap">
          <table class="sa-table">
            <thead>
              <tr>
                <th><Icon icon="lucide:clock" width="12" height="12" /> Timp</th>
                <th><Icon icon="lucide:search" width="12" height="12" /> Interogare</th>
                <th><Icon icon="lucide:hash" width="12" height="12" /> Rezultate</th>
                <th><Icon icon="lucide:zap" width="12" height="12" /> Latență</th>
                <th><Icon icon="lucide:wifi" width="12" height="12" /> IP</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in data.recentLogs" :key="log.id" class="sa-table-row">
                <td>
                  <div class="sa-time-cell">
                    <span class="sa-time-rel">{{ relTime(log.timestamp) }}</span>
                    <span class="sa-time-abs">
                      {{ new Date(log.timestamp).toLocaleTimeString('ro-RO') }}
                    </span>
                  </div>
                </td>
                <td>
                  <div class="sa-query-cell">
                    <div
                      :class="[
                        'sa-query-dot',
                        log.resultCount > 0 ? 'sa-query-dot--ok' : 'sa-query-dot--missed',
                      ]"
                    />
                    <span class="sa-query-text">"{{ log.query }}"</span>
                  </div>
                </td>
                <td>
                  <span
                    :class="[
                      'sa-result-pill',
                      log.resultCount > 0 ? 'sa-result-pill--covered' : 'sa-result-pill--missing',
                    ]"
                  >
                    {{ log.resultCount }} docs
                  </span>
                </td>
                <td>
                  <span :class="['sa-latency-pill', latencyClass(log.latencyMs)]">
                    {{ log.latencyMs }}ms
                  </span>
                </td>
                <td>
                  <code class="sa-ip-chip">{{ log.ip }}</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>
  </div>
</template>
