<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { api } from '../../composables/useApi';
import AdminLiveTerminal from './AdminLiveTerminal.vue';
import AdminThematicLoader from './AdminThematicLoader.vue';

const props = defineProps<{ user: any }>();

const data = ref<any>(null);
const loading = ref(true);
const error = ref('');

async function loadDashboard() {
  loading.value = true;
  error.value = '';
  try {
    const res = await api('/api/admin/dashboard');
    data.value = res;
  } catch (err: any) {
    error.value = err.message || 'Eroare la încărcarea datelor de control.';
  } finally {
    loading.value = false;
  }
}

function formatNumber(n: number): string {
  if (!n) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function formatRelativeTime(isoStr: string): string {
  if (!isoStr) return '—';
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'acum';
  if (mins < 60) return `acum ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `acum ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `acum ${days}z`;
}

function getActionColor(action: string): string {
  if (!action) return 'hsl(26 100% 52%)';
  if (action.includes('FAILURE') || action.includes('PANIC') || action.includes('ABUSE') || action.includes('DELETE')) return '#ef4444';
  if (action.includes('SUCCESS') || action.includes('CREATE') || action.includes('VERIFIED')) return '#10b981';
  if (action.includes('UPDATE') || action.includes('TOGGLE') || action.includes('MAINTENANCE')) return '#f59e0b';
  if (action.includes('MEDIA') || action.includes('BACKUP') || action.includes('SNAPSHOT')) return '#3b82f6';
  if (action.includes('AI') || action.includes('REPORT')) return '#8b5cf6';
  return 'hsl(26 100% 52%)';
}

const isRoot = computed(() => Boolean(props.user?.isRoot || props.user?.username?.toLowerCase() === 'iannc69'));

onMounted(() => {
  loadDashboard();
});
</script>

<template>
  <AdminThematicLoader
    v-if="loading"
    mode="inline"
    title="MISSION CONTROL TELEMETRY"
    subtitle="Se sincronizează indicatorii de securitate și telemetria serverelor…"
  />

  <div v-else-if="error" class="adx-error-state">
    <Icon icon="lucide:alert-triangle" class="text-red-500" width="32" height="32" />
    <p>{{ error }}</p>
    <button type="button" class="adx-btn adx-btn--primary" @click="loadDashboard">
      <Icon icon="lucide:refresh-cw" /> Reîncearcă
    </button>
  </div>

  <div v-else-if="data" class="adx-dashboard">
    <!-- ── EMERGENCY BANNERS ────────────────────────────── -->
    <div v-if="data.isLocked" class="adx-banner adx-banner--danger">
      <Icon icon="lucide:shield-alert" width="15" height="15" />
      <span><strong>EMERGENCY PANIC LOCKDOWN ACTIV.</strong> Toate sesiunile noi sunt blocate.</span>
      <a href="/admin/security" class="adx-banner-link">
        Security Control <Icon icon="lucide:chevron-right" width="12" height="12" />
      </a>
    </div>

    <div v-if="data.maintenance?.enabled" class="adx-banner adx-banner--warning">
      <Icon icon="lucide:wrench" width="15" height="15" />
      <span><strong>MAINTENANCE MODE ACTIV.</strong> Platforma publică este offline pentru jucători.</span>
      <a href="/admin/settings" class="adx-banner-link">
        Setări <Icon icon="lucide:chevron-right" width="12" height="12" />
      </a>
    </div>

    <!-- ── HERO HEADER ──────────────────────────────────── -->
    <div class="adx-hero">
      <div class="adx-hero-left">
        <div class="adx-hero-greeting">
          <div class="adx-live-indicator">
            <span class="adx-live-dot"></span>
            <span>LIVE</span>
          </div>
          <span class="adx-greeting-text">
            {{ data.greeting }}, <strong>{{ props.user?.displayName || props.user?.username }}</strong>
          </span>
        </div>
        <h1 class="adx-hero-title">Mission Control</h1>
        <p class="adx-hero-subtitle">
          WF-DOCSCORE v{{ data.version || '1.8.5' }} &nbsp;·&nbsp; Cryptographic Audit Chain
          <span :class="data.chainIntegrity?.isValid ? 'adx-badge adx-badge--green' : 'adx-badge adx-badge--red'">
            {{ data.chainIntegrity?.isValid ? 'VERIFIED' : 'COMPROMIS' }}
          </span>
          &nbsp;·&nbsp; Uptime <span class="adx-mono">{{ data.uptime?.uptimeHrs }}h {{ data.uptime?.uptimeMins }}m</span>
        </p>
      </div>

      <div class="adx-hero-actions">
        <a v-if="isRoot || props.user?.permissions?.canEditDocs" href="/admin/content" class="adx-btn adx-btn--primary">
          <Icon icon="lucide:plus" width="14" height="14" /> New Document
        </a>
        <a v-if="isRoot || props.user?.permissions?.canManageTasks" href="/admin/tasks" class="adx-btn adx-btn--ghost">
          <Icon icon="lucide:list-todo" width="14" height="14" /> Task Hub
        </a>
        <a v-if="isRoot || props.user?.permissions?.canManageWebhooks" href="/admin/webhooks" class="adx-btn adx-btn--ghost">
          <Icon icon="lucide:webhook" width="14" height="14" /> Webhooks
        </a>
        <a v-if="isRoot || props.user?.permissions?.canManageSecurity" href="/admin/security" class="adx-btn adx-btn--ghost">
          <Icon icon="lucide:lock" width="14" height="14" /> Security
        </a>
        <a v-if="isRoot || props.user?.permissions?.canViewAudit" href="/admin/audit" class="adx-btn adx-btn--ghost">
          <Icon icon="lucide:scroll-text" width="14" height="14" /> Audit Trail
        </a>
      </div>
    </div>

    <!-- ── ROW 1: PRIMARY METRIC CARDS ──────────────────── -->
    <div class="adx-metrics-row">
      <!-- Docs -->
      <div class="adx-metric-card adx-metric-card--orange">
        <div class="adx-metric-top">
          <span class="adx-metric-label">Document Library</span>
          <div class="adx-metric-icon-wrap adx-metric-icon--orange">
            <Icon icon="lucide:file-text" width="16" height="16" />
          </div>
        </div>
        <div class="adx-metric-big">{{ data.totalDocs || 0 }}</div>
        <div class="adx-metric-sub">
          <span class="adx-pill adx-pill--green">100% Synced</span>
          <span class="adx-metric-desc">Ghiduri publicate</span>
        </div>
      </div>

      <!-- Views -->
      <div class="adx-metric-card adx-metric-card--blue">
        <div class="adx-metric-top">
          <span class="adx-metric-label">Vizualizări Astăzi</span>
          <div class="adx-metric-icon-wrap adx-metric-icon--blue">
            <Icon icon="lucide:eye" width="16" height="16" />
          </div>
        </div>
        <div class="adx-metric-big">{{ data.docAnalytics?.todayViews || 0 }}</div>
        <div class="adx-metric-sub">
          <span class="adx-pill adx-pill--blue">{{ formatNumber(data.docAnalytics?.totalViews || 0) }} total</span>
          <span class="adx-metric-desc">Lectori activi</span>
        </div>
      </div>

      <!-- AI Queries -->
      <div class="adx-metric-card adx-metric-card--purple">
        <div class="adx-metric-top">
          <span class="adx-metric-label">AI Helper Queries</span>
          <div class="adx-metric-icon-wrap adx-metric-icon--purple">
            <Icon icon="lucide:brain" width="16" height="16" />
          </div>
        </div>
        <div class="adx-metric-big">{{ data.aiTelemetry?.lifetimeQueries || 0 }}</div>
        <div class="adx-metric-sub">
          <span class="adx-pill adx-pill--purple">{{ data.aiTelemetry?.successRate || 100 }}% success</span>
          <span class="adx-metric-desc">~{{ data.aiTelemetry?.avgLatency || 0 }}ms latency</span>
        </div>
      </div>

      <!-- Security -->
      <div class="adx-metric-card adx-metric-card--green">
        <div class="adx-metric-top">
          <span class="adx-metric-label">Security Score</span>
          <div class="adx-metric-icon-wrap adx-metric-icon--green">
            <Icon icon="lucide:shield-check" width="16" height="16" />
          </div>
        </div>
        <div class="adx-metric-big">{{ data.chainIntegrity?.isValid ? '100%' : '!' }}</div>
        <div class="adx-metric-sub">
          <span :class="data.chainIntegrity?.isValid ? 'adx-pill adx-pill--green' : 'adx-pill adx-pill--red'">
            {{ data.chainIntegrity?.isValid ? 'Chain OK' : 'TAMPERED' }}
          </span>
          <span class="adx-metric-desc">SHA-256 Chain</span>
        </div>
      </div>

      <!-- Search -->
      <div class="adx-metric-card adx-metric-card--amber">
        <div class="adx-metric-top">
          <span class="adx-metric-label">Search Queries</span>
          <div class="adx-metric-icon-wrap adx-metric-icon--amber">
            <Icon icon="lucide:search" width="16" height="16" />
          </div>
        </div>
        <div class="adx-metric-big">{{ data.searchAnalytics?.totalSearches || 0 }}</div>
        <div class="adx-metric-sub">
          <span :class="(data.searchAnalytics?.missedCount || 0) > 0 ? 'adx-pill adx-pill--red' : 'adx-pill adx-pill--green'">
            {{ data.searchAnalytics?.missedCount || 0 }} gaps
          </span>
          <span class="adx-metric-desc">{{ data.searchAnalytics?.avgLatencyMs || 0 }}ms avg</span>
        </div>
      </div>

      <!-- Media -->
      <div class="adx-metric-card adx-metric-card--cyan">
        <div class="adx-metric-top">
          <span class="adx-metric-label">Asset Vault</span>
          <div class="adx-metric-icon-wrap adx-metric-icon--cyan">
            <Icon icon="lucide:image" width="16" height="16" />
          </div>
        </div>
        <div class="adx-metric-big">{{ data.mediaStats?.totalAssets || 0 }}</div>
        <div class="adx-metric-sub">
          <span class="adx-pill adx-pill--cyan">{{ data.mediaStats?.totalSizeFormatted || '0 B' }}</span>
          <span class="adx-metric-desc">
            {{ data.mediaStats?.imagesCount || 0 }} images · {{ data.mediaStats?.videosCount || 0 }} videos
          </span>
        </div>
      </div>
    </div>

    <!-- ── ROW 2: LIVE TERMINAL ─────────────────────────── -->
    <AdminLiveTerminal />

    <!-- ── ROW 3: THREE COLUMN LAYOUT ───────────────────── -->
    <div class="adx-three-col">

      <!-- ── LEFT: AUDIT LEDGER ───────────────────────── -->
      <div class="adx-panel adx-audit-panel">
        <div class="adx-panel-header">
          <div class="adx-panel-title-row">
            <Icon icon="lucide:scroll-text" width="14" height="14" class="adx-panel-icon" />
            <h2 class="adx-panel-title">Real-Time Audit Ledger</h2>
            <span class="adx-live-dot adx-live-dot--sm"></span>
          </div>
          <a href="/admin/audit" class="adx-panel-link">
            Full Ledger <Icon icon="lucide:arrow-up-right" width="12" height="12" />
          </a>
        </div>
        <div class="adx-audit-list">
          <div v-for="evt in (data.recentEvents || [])" :key="evt.id" class="adx-audit-row">
            <div
              class="adx-audit-marker"
              :style="{ background: getActionColor(evt.action), boxShadow: `0 0 8px ${getActionColor(evt.action)}60` }"
            ></div>
            <div class="adx-audit-content">
              <div class="adx-audit-header-row">
                <span class="adx-audit-action" :style="{ color: getActionColor(evt.action) }">
                  {{ evt.action?.replace(/_/g, ' ') }}
                </span>
                <span class="adx-audit-time">{{ formatRelativeTime(evt.timestamp) }}</span>
              </div>
              <div class="adx-audit-meta">
                <span class="adx-mono-sm">{{ evt.actor }}</span>
                <span class="adx-mono-sm adx-text-dim">{{ evt.hash?.slice(0, 8) }}…</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── MIDDLE: DEEP ANALYTICS PANEL ─────────── -->
      <div class="adx-middle-stack">

        <!-- Traffic Intelligence -->
        <div class="adx-panel adx-analytics-mega">
          <div class="adx-panel-header">
            <div class="adx-panel-title-row">
              <Icon icon="lucide:bar-chart-3" width="14" height="14" class="adx-panel-icon" />
              <h2 class="adx-panel-title">Traffic Intelligence</h2>
              <span class="adx-live-dot adx-live-dot--sm"></span>
            </div>
            <a href="/admin/ai-analytics" class="adx-panel-link">
              Analytics Complet <Icon icon="lucide:arrow-up-right" width="12" height="12" />
            </a>
          </div>

          <!-- Day-Over-Day Bar Chart -->
          <div class="adx-section-header">
            <Icon icon="lucide:trending-up" width="11" height="11" />
            <span>Comparativ pe Zile — Ultimele 7 Zile</span>
          </div>
          <div class="adx-bar-chart-wrap">
            <div class="adx-bar-chart">
              <div v-if="!data.dailyChart?.length" class="adx-empty">
                Date insuficiente pentru comparativ.
              </div>
              <div
                v-for="day in (data.dailyChart || [])"
                :key="day.date"
                class="adx-bar-col"
              >
                <div class="adx-bar-value">{{ day.views > 0 ? day.views : '' }}</div>
                <div
                  class="adx-bar"
                  :class="day.isToday ? 'adx-bar--today' : 'adx-bar--past'"
                  :style="{ height: `${Math.max(day.heightPercent, day.views > 0 ? 8 : 3)}%` }"
                ></div>
                <div class="adx-bar-label" :class="{ 'adx-bar-label--today': day.isToday }">
                  {{ day.label }}
                </div>
              </div>
            </div>
          </div>

          <!-- Top Docs Leaderboard -->
          <div class="adx-section-header">
            <Icon icon="lucide:trending-up" width="11" height="11" />
            <span>Top Ghiduri Citite Astăzi</span>
            <span class="adx-section-badge">{{ data.docAnalytics?.todayViews || 0 }} vizualizări</span>
          </div>
          <div class="adx-doc-list">
            <div v-if="!data.docAnalytics?.topDocs?.length" class="adx-empty">
              Nicio vizualizare înregistrată azi.
            </div>
            <div
              v-for="(doc, i) in (data.docAnalytics?.topDocs || [])"
              :key="doc.slug"
              class="adx-top-doc-row"
            >
              <div
                class="adx-top-doc-rank-pill"
                :class="{
                  'adx-rank--gold': i === 0,
                  'adx-rank--silver': i === 1,
                  'adx-rank--bronze': i === 2,
                }"
              >
                <Icon v-if="i === 0" icon="lucide:trophy" width="13" height="13" />
                <Icon v-else-if="i === 1" icon="lucide:award" width="13" height="13" />
                <Icon v-else-if="i === 2" icon="lucide:medal" width="13" height="13" />
                <span v-else>#{{ Number(i) + 1 }}</span>
              </div>
              <div class="adx-top-doc-info">
                <div class="adx-top-doc-name-row">
                  <span class="adx-doc-slug">{{ doc.slug?.split('/').pop()?.replace(/-/g, ' ') }}</span>
                  <div class="adx-top-doc-badges">
                    <span class="adx-pill adx-pill--blue">{{ doc.todayViews }} azi</span>
                    <span class="adx-pill adx-pill--orange">{{ doc.totalViews }} total</span>
                  </div>
                </div>
                <div class="adx-top-doc-bar-wrap">
                  <div
                    class="adx-top-doc-bar"
                    :style="{
                      width: `${data.docAnalytics?.topDocs?.[0]?.todayViews ? Math.round((doc.todayViews / data.docAnalytics.topDocs[0].todayViews) * 100) : 0}%`,
                    }"
                  ></div>
                </div>
                <span class="adx-doc-path adx-text-dim">/{{ doc.slug }}</span>
              </div>
            </div>
          </div>

          <!-- Satisfaction Score -->
          <div class="adx-section-header">
            <Icon icon="lucide:activity" width="11" height="11" />
            <span>Scor Satisfacție Jucători</span>
          </div>
          <div class="adx-satisfaction-row">
            <div class="adx-satisfaction-score">
              <span
                class="adx-satisfaction-pct"
                :class="(data.docAnalytics?.satisfactionRate || 100) >= 70 ? 'adx-text-green' : 'adx-text-red'"
              >
                {{ data.docAnalytics?.satisfactionRate || 100 }}%
              </span>
              <span class="adx-satisfaction-label">Ghiduri Utile</span>
            </div>
            <div class="adx-satisfaction-bar-wrap">
              <div class="adx-satisfaction-track">
                <div
                  class="adx-satisfaction-fill"
                  :class="(data.docAnalytics?.satisfactionRate || 100) >= 70 ? 'adx-satisfaction--green' : 'adx-satisfaction--red'"
                  :style="{ width: `${data.docAnalytics?.satisfactionRate || 100}%` }"
                ></div>
              </div>
              <div class="adx-satisfaction-counts">
                <span class="adx-text-green adx-mono-sm">{{ data.docAnalytics?.helpful || 0 }} helpful</span>
                <span class="adx-text-red adx-mono-sm">{{ data.docAnalytics?.unhelpful || 0 }} unhelpful</span>
                <span class="adx-text-dim adx-mono-sm">{{ data.docAnalytics?.totalFeedbacks || 0 }} total</span>
              </div>
            </div>
          </div>

          <!-- Hourly Activity Heatmap -->
          <div class="adx-section-header">
            <Icon icon="lucide:clock" width="11" height="11" />
            <span>Activitate pe Ore — Azi</span>
            <span class="adx-section-badge">Peak ora {{ data.geoStats?.peakHour || 0 }}:00</span>
          </div>
          <div class="adx-hourly-heatmap">
            <div
              v-for="h in 24"
              :key="h - 1"
              class="adx-hour-cell"
              :class="{ 'adx-hour-cell--peak': h - 1 === data.geoStats?.peakHour }"
              :style="{
                opacity: (data.geoStats?.hourly?.[String(h - 1)] || 0) > 0 ? 0.35 + ((data.geoStats?.hourly?.[String(h - 1)] || 0) / 10) * 0.65 : 0.12,
                background: (data.geoStats?.hourly?.[String(h - 1)] || 0) > 4 ? 'hsl(26 100% 52%)' : (data.geoStats?.hourly?.[String(h - 1)] || 0) > 0 ? '#f59e0b' : 'hsl(220 14% 20%)',
              }"
              :title="`${h - 1}:00 — ${data.geoStats?.hourly?.[String(h - 1)] || 0} vizualizări`"
            ></div>
          </div>
          <div class="adx-hourly-labels">
            <span v-for="h in ['00', '06', '12', '18', '23']" :key="h" class="adx-mono-sm adx-text-dim">
              {{ h }}:00
            </span>
          </div>
        </div>

        <!-- AI Cost & Telemetry -->
        <div class="adx-panel adx-ai-panel">
          <div class="adx-panel-header">
            <div class="adx-panel-title-row">
              <Icon icon="lucide:bot" width="14" height="14" class="adx-panel-icon adx-panel-icon--purple" />
              <h2 class="adx-panel-title">AI Helper Telemetry</h2>
            </div>
            <a href="/admin/ai-analytics" class="adx-panel-link">
              Stats <Icon icon="lucide:arrow-up-right" width="12" height="12" />
            </a>
          </div>
          <div class="adx-ai-stats-grid">
            <div class="adx-ai-stat">
              <span class="adx-ai-stat-val adx-text-purple">{{ formatNumber(data.aiTelemetry?.totalTokens || 0) }}</span>
              <span class="adx-ai-stat-label">Tokeni Totali</span>
            </div>
            <div class="adx-ai-stat">
              <span class="adx-ai-stat-val adx-text-green">${{ (data.aiTelemetry?.totalCostUsd || 0).toFixed(3) }}</span>
              <span class="adx-ai-stat-label">Cost Total USD</span>
            </div>
            <div class="adx-ai-stat">
              <span class="adx-ai-stat-val adx-text-blue">{{ data.aiTelemetry?.avgLatency || 0 }}ms</span>
              <span class="adx-ai-stat-label">Latenta Medie</span>
            </div>
            <div class="adx-ai-stat">
              <span class="adx-ai-stat-val adx-text-amber">{{ data.aiTelemetry?.successRate || 100 }}%</span>
              <span class="adx-ai-stat-label">Success Rate</span>
            </div>
          </div>
          <div class="adx-ai-recent">
            <div v-for="log in (data.aiTelemetry?.recentLogs || [])" :key="log.id" class="adx-ai-log-row">
              <div class="adx-ai-status-dot" :class="`adx-ai-status--${log.status}`"></div>
              <span class="adx-ai-query">{{ log.querySnippet?.slice(0, 45) || '—' }}…</span>
              <span class="adx-mono-sm adx-text-dim">{{ formatRelativeTime(log.timestamp) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── RIGHT: SYSTEM + TEAM ─────────────────────── -->
      <div class="adx-right-stack">

        <!-- System Health -->
        <div class="adx-panel adx-system-panel">
          <div class="adx-panel-header">
            <div class="adx-panel-title-row">
              <Icon icon="lucide:cpu" width="14" height="14" class="adx-panel-icon" />
              <h2 class="adx-panel-title">System Health</h2>
            </div>
            <span class="adx-pill adx-pill--green">Operational</span>
          </div>
          <div class="adx-system-body">
            <!-- Memory Bar -->
            <div class="adx-sys-row">
              <div class="adx-sys-row-label">
                <Icon icon="lucide:hard-drive" width="12" height="12" />
                <span>Heap Memory</span>
              </div>
              <div class="adx-sys-row-right">
                <div class="adx-progress-bar">
                  <div class="adx-progress-fill adx-progress--orange" :style="{ width: `${data.memory?.heapPercent || 50}%` }"></div>
                </div>
                <span class="adx-mono-sm">{{ data.memory?.heapUsedMb }}/{{ data.memory?.heapTotalMb }}MB</span>
              </div>
            </div>
            <div class="adx-sys-divider"></div>
            <!-- Specs -->
            <div class="adx-spec-list">
              <div class="adx-spec-row">
                <span class="adx-spec-key">Platform</span>
                <span class="adx-spec-val">WF-DOCSCORE v{{ data.version || '1.8.5' }}</span>
              </div>
              <div class="adx-spec-row">
                <span class="adx-spec-key">Framework</span>
                <span class="adx-spec-val">VitePress 2.0 Engine</span>
              </div>
              <div class="adx-spec-row">
                <span class="adx-spec-key">RSS Memory</span>
                <span class="adx-spec-val">{{ data.memory?.rssMb }} MB</span>
              </div>
              <div class="adx-spec-row">
                <span class="adx-spec-key">Cipher Suite</span>
                <span class="adx-spec-val">PBKDF2-SHA512</span>
              </div>
              <div class="adx-spec-row">
                <span class="adx-spec-key">Active Sessions</span>
                <span class="adx-spec-val">{{ data.activeSessionCount || 1 }}</span>
              </div>
              <div class="adx-spec-row">
                <span class="adx-spec-key">API Keys</span>
                <span class="adx-spec-val">{{ data.apiKeysCount || 0 }} active</span>
              </div>
              <div class="adx-spec-row">
                <span class="adx-spec-key">Maintenance</span>
                <span :class="data.maintenance?.enabled ? 'adx-spec-val adx-text-amber' : 'adx-spec-val adx-text-green'">
                  {{ data.maintenance?.enabled ? 'ACTIVE' : 'OFFLINE' }}
                </span>
              </div>
              <div class="adx-spec-row">
                <span class="adx-spec-key">Panic Lock</span>
                <span :class="data.isLocked ? 'adx-spec-val adx-text-red' : 'adx-spec-val adx-text-green'">
                  {{ data.isLocked ? 'LOCKED' : 'CLEAR' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Country Breakdown -->
        <div class="adx-panel adx-geo-panel">
          <div class="adx-panel-header">
            <div class="adx-panel-title-row">
              <Icon icon="lucide:globe" width="14" height="14" class="adx-panel-icon adx-panel-icon--cyan" />
              <h2 class="adx-panel-title">Origine Vizitatori</h2>
            </div>
            <span class="adx-pill adx-pill--cyan">{{ data.geoStats?.totalGeoViews || 0 }} total</span>
          </div>
          <div class="adx-geo-list">
            <div v-if="!data.geoStats?.countries?.length" class="adx-empty">
              Fără date geo. Vizitează platforma pentru a popula.
            </div>
            <div
              v-for="(c, idx) in (data.geoStats?.countries || [])"
              :key="c.code"
              class="adx-geo-row"
            >
              <span class="adx-geo-code-badge">
                <Icon icon="lucide:globe" width="11" height="11" />
                {{ c.code }}
              </span>
              <div class="adx-geo-info">
                <div class="adx-geo-name-row">
                  <span class="adx-geo-name">{{ c.name }}</span>
                  <span class="adx-geo-views adx-mono-sm">{{ c.views }}</span>
                </div>
                <div class="adx-geo-bar-track">
                  <div
                    class="adx-geo-bar-fill"
                    :class="{ 'adx-geo--top': idx === 0 }"
                    :style="{ width: `${c.percentage || 100}%` }"
                  ></div>
                </div>
              </div>
              <span class="adx-geo-pct" :class="idx === 0 ? 'adx-text-orange' : 'adx-text-dim'">
                {{ c.percentage }}%
              </span>
            </div>
          </div>
          <div class="adx-geo-note">
            <Icon icon="lucide:globe" width="10" height="10" />
            <span>Rezolvare WAN live automată via ipwho.is MaxMind</span>
          </div>
        </div>

        <!-- Team Roster -->
        <div class="adx-panel adx-team-panel">
          <div class="adx-panel-header">
            <div class="adx-panel-title-row">
              <Icon icon="lucide:users" width="14" height="14" class="adx-panel-icon" />
              <h2 class="adx-panel-title">Echipa ({{ (data.allTeamMembers || []).length }})</h2>
            </div>
            <a href="/admin/team" class="adx-panel-link">
              Gestionare <Icon icon="lucide:arrow-up-right" width="12" height="12" />
            </a>
          </div>
          <div class="adx-team-list">
            <div
              v-for="m in (data.allTeamMembers || [])"
              :key="m.id"
              class="adx-team-member"
            >
              <div class="adx-team-avatar-wrap">
                <img
                  v-if="m.avatarUrl"
                  :src="m.avatarUrl"
                  :alt="m.displayName"
                  class="adx-team-avatar"
                />
                <div
                  v-else
                  class="adx-team-avatar adx-team-avatar--placeholder"
                  :style="{ background: m.avatarColor || 'hsl(26 100% 52%)' }"
                >
                  {{ m.displayName?.[0] }}
                </div>
                <div
                  class="adx-team-online-dot"
                  :class="m.status === 'active' ? 'adx-online--green' : 'adx-online--gray'"
                ></div>
              </div>
              <div class="adx-team-info">
                <div class="adx-team-name-row">
                  <span class="adx-team-name">{{ m.displayName }}</span>
                  <span v-if="m.isRoot" class="adx-badge adx-badge--orange">ROOT</span>
                </div>
                <span class="adx-team-role">{{ m.customTitle || m.role }}</span>
              </div>
              <div class="adx-team-meta">
                <span class="adx-text-dim adx-mono-sm">{{ formatRelativeTime(m.lastLoginAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── ROW 4: QUICK NAVIGATION LAUNCHPAD ────────────── -->
    <div class="adx-launchpad">
      <div class="adx-panel-header" style="padding: 0 0 14px 0; border-bottom: 1px solid hsl(220 14% 20% / 0.6)">
        <div class="adx-panel-title-row">
          <Icon icon="lucide:layers" width="14" height="14" class="adx-panel-icon" />
          <h2 class="adx-panel-title">Control Center — Acces Rapid</h2>
        </div>
      </div>
      <div class="adx-launchpad-grid">
        <a v-if="isRoot || props.user?.permissions?.canEditDocs" href="/admin/content" class="adx-launch-card adx-launch--orange">
          <Icon icon="lucide:file-text" width="20" height="20" />
          <span class="adx-launch-title">Conținut &amp; Docs</span>
          <span class="adx-launch-desc">{{ data.totalDocs || 0 }} ghiduri publicate</span>
        </a>
        <a v-if="isRoot || props.user?.permissions?.canManageTasks" href="/admin/tasks" class="adx-launch-card adx-launch--orange">
          <Icon icon="lucide:list-todo" width="20" height="20" />
          <span class="adx-launch-title">Task Hub &amp; TODO</span>
          <span class="adx-launch-desc">Gestiune sarcini &amp; Kanban</span>
        </a>
        <a v-if="isRoot || props.user?.permissions?.canManageWebhooks" href="/admin/webhooks" class="adx-launch-card adx-launch--cyan">
          <Icon icon="lucide:webhook" width="20" height="20" />
          <span class="adx-launch-title">Webhooks &amp; Alerte</span>
          <span class="adx-launch-desc">Trigger Discord #logs manual</span>
        </a>
        <a v-if="isRoot || props.user?.permissions?.canManageTeam" href="/admin/team" class="adx-launch-card adx-launch--emerald">
          <Icon icon="lucide:users" width="20" height="20" />
          <span class="adx-launch-title">Echipa</span>
          <span class="adx-launch-desc">{{ (data.allTeamMembers || []).length }} membri activi</span>
        </a>
        <a v-if="isRoot || props.user?.permissions?.canManageMedia" href="/admin/media" class="adx-launch-card adx-launch--cyan">
          <Icon icon="lucide:image" width="20" height="20" />
          <span class="adx-launch-title">Asset Vault</span>
          <span class="adx-launch-desc">{{ data.mediaStats?.totalAssets || 0 }} fișiere · {{ data.mediaStats?.totalSizeFormatted || '0 B' }}</span>
        </a>
        <a v-if="isRoot || props.user?.permissions?.canViewAudit" href="/admin/audit" class="adx-launch-card adx-launch--violet">
          <Icon icon="lucide:scroll-text" width="20" height="20" />
          <span class="adx-launch-title">Audit Trail</span>
          <span class="adx-launch-desc">SHA-256 cryptographic chain</span>
        </a>
        <a v-if="isRoot || props.user?.permissions?.canManageSecurity" href="/admin/security" class="adx-launch-card adx-launch--red">
          <Icon icon="lucide:shield" width="20" height="20" />
          <span class="adx-launch-title">Security</span>
          <span class="adx-launch-desc">{{ data.isLocked ? 'PANIC LOCKDOWN ACTIV' : 'Sisteme operaționale' }}</span>
        </a>
        <a v-if="isRoot || props.user?.permissions?.canViewAnalytics" href="/admin/search-analytics" class="adx-launch-card adx-launch--amber">
          <Icon icon="lucide:search" width="20" height="20" />
          <span class="adx-launch-title">Search Analytics</span>
          <span class="adx-launch-desc">{{ data.searchAnalytics?.totalSearches || 0 }} căutări · {{ data.searchAnalytics?.missedCount || 0 }} gaps</span>
        </a>
        <a v-if="isRoot || props.user?.permissions?.canManageApiKeys" href="/admin/api-keys" class="adx-launch-card adx-launch--blue">
          <Icon icon="lucide:key" width="20" height="20" />
          <span class="adx-launch-title">API Keys</span>
          <span class="adx-launch-desc">{{ data.apiKeysCount || 0 }} integrări active</span>
        </a>
        <a v-if="isRoot || props.user?.permissions?.canManageSettings" href="/admin/settings" class="adx-launch-card adx-launch--gray">
          <Icon icon="lucide:wrench" width="20" height="20" />
          <span class="adx-launch-title">Settings</span>
          <span class="adx-launch-desc">{{ data.maintenance?.enabled ? 'Maintenance activ' : 'Platform config' }}</span>
        </a>
        <a v-if="isRoot || props.user?.permissions?.canManageSnapshots" href="/admin/backups" class="adx-launch-card adx-launch--teal">
          <Icon icon="lucide:database" width="20" height="20" />
          <span class="adx-launch-title">Backups</span>
          <span class="adx-launch-desc">Snapshots &amp; export</span>
        </a>
        <a v-if="isRoot || props.user?.permissions?.canViewAiStats" href="/admin/ai-analytics" class="adx-launch-card adx-launch--fuchsia">
          <Icon icon="lucide:brain" width="20" height="20" />
          <span class="adx-launch-title">AI Analytics</span>
          <span class="adx-launch-desc">{{ data.aiTelemetry?.lifetimeQueries || 0 }} queries lifetime</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.adx-loading-state,
.adx-error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
  color: var(--color-text-secondary);
}
</style>
