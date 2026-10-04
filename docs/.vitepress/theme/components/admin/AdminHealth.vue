<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';

export interface DocHealthIssue {
  type: 'broken_link' | 'missing_frontmatter' | 'orphan_doc' | 'empty_content' | 'short_description';
  severity: 'error' | 'warning' | 'info';
  file: string;
  slug: string;
  message: string;
  detail?: string;
  line?: number;
}

export interface DocHealthReport {
  timestamp: string;
  totalPages: number;
  healthScore: number;
  issuesCount: {
    errors: number;
    warnings: number;
    infos: number;
  };
  brokenLinks: number;
  missingFrontmatter: number;
  orphanDocs: number;
  issues: DocHealthIssue[];
}

const props = defineProps<{
  user?: any;
}>();

const FILTERS = [
  { key: 'all', label: 'Toate' },
  { key: 'error', label: 'Erori' },
  { key: 'warning', label: 'Avertismente' },
  { key: 'broken_link', label: 'Link-uri Moarte' },
  { key: 'orphan', label: 'Orfane' },
] as const;

type FilterKey = typeof FILTERS[number]['key'];

const report = ref<DocHealthReport | null>(null);
const loading = ref<boolean>(true);
const filter = ref<FilterKey>('all');
const searchQuery = ref<string>('');
const lastScan = ref<string>('');

const radius = 36;
const circumference = 2 * Math.PI * radius;

const scoreVal = computed(() => report.value?.healthScore ?? 100);
const scoreColor = computed(() => {
  const s = scoreVal.value;
  return s >= 90 ? '#10b981' : s >= 70 ? '#f59e0b' : '#ef4444';
});
const scoreDash = computed(() => (scoreVal.value / 100) * circumference);
const scoreLabel = computed(() => {
  const s = scoreVal.value;
  return s >= 90 ? 'Excelent' : s >= 70 ? 'Atenție' : 'Critic';
});
const scoreClass = computed(() => {
  const s = scoreVal.value;
  return s >= 90 ? 'excellent' : s >= 70 ? 'warning' : 'critical';
});

const issues = computed(() => report.value?.issues || []);

const filterCounts = computed(() => {
  const list = issues.value;
  return {
    all: list.length,
    error: list.filter((i) => i.severity === 'error').length,
    warning: list.filter((i) => i.severity === 'warning').length,
    broken_link: list.filter((i) => i.type === 'broken_link').length,
    orphan: list.filter((i) => i.type === 'orphan_doc').length,
  };
});

const filteredIssues = computed(() => {
  const list = issues.value;
  const currentFilter = filter.value;
  const q = searchQuery.value.trim().toLowerCase();

  return list.filter((issue) => {
    if (currentFilter === 'error' && issue.severity !== 'error') return false;
    if (currentFilter === 'warning' && issue.severity !== 'warning') return false;
    if (currentFilter === 'broken_link' && issue.type !== 'broken_link') return false;
    if (currentFilter === 'orphan' && issue.type !== 'orphan_doc') return false;
    if (q) {
      return (
        issue.file.toLowerCase().includes(q) ||
        issue.message.toLowerCase().includes(q) ||
        (issue.detail && issue.detail.toLowerCase().includes(q))
      );
    }
    return true;
  });
});

async function fetchHealthReport() {
  loading.value = true;
  try {
    const res = await fetch('/api/admin/health');
    if (res.status === 401) {
      window.location.href = '/admin/login';
      return;
    }
    const data = await res.json();
    report.value = data;
    lastScan.value = new Date().toLocaleTimeString('ro-RO', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch (err) {
    console.error('Failed to load health report', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchHealthReport();
});
</script>

<template>
  <div class="admin-page-container">
    <!-- ── PAGE HEADER ─────────────────────────────────────────────── -->
    <div class="dh-page-header">
      <div class="dh-header-left">
        <div class="dh-header-breadcrumb">
          <Icon icon="lucide:cpu" width="11" height="11" />
          <span>SYSTEM DIAGNOSTICS</span>
          <span class="dh-breadcrumb-sep">/</span>
          <span>DOC HEALTH MATRIX</span>
        </div>
        <h1 class="dh-header-title">
          Inspector Integritate Docs
        </h1>
        <p class="dh-header-sub">
          Scanare automată în timp real a celor {{ report?.totalPages || '62' }}+ articole
          — link-uri moarte, frontmatter, SEO și documente orfane.
        </p>
      </div>

      <div class="dh-header-actions">
        <div v-if="lastScan" class="dh-last-scan-tag">
          <Icon icon="lucide:clock" width="11" height="11" />
          <span>Ultima scanare: {{ lastScan }}</span>
        </div>
        <button
          type="button"
          id="health-rescan-btn"
          class="dh-scan-btn"
          :disabled="loading"
          @click="fetchHealthReport"
        >
          <Icon icon="lucide:refresh-cw" width="13" height="13" :class="{ 'dh-spin': loading }" />
          <span>{{ loading ? 'Se scanează...' : 'Rescanează' }}</span>
        </button>
      </div>
    </div>

    <!-- ── KPI STRIP ───────────────────────────────────────────────── -->
    <div class="dh-kpi-strip">
      <!-- Score Gauge -->
      <div :class="['dh-kpi-score', `dh-kpi-score--${scoreClass}`]">
        <div class="dh-kpi-score-arc">
          <div v-if="loading" class="dh-score-placeholder">
            <Icon
              icon="lucide:refresh-cw"
              width="22"
              height="22"
              class="dh-spin dh-spin--slow"
              style="color: rgba(255, 255, 255, 0.3)"
            />
          </div>
          <svg v-else width="100" height="100" viewBox="0 0 100 100" class="dh-score-arc">
            <!-- track -->
            <circle
              cx="50"
              cy="50"
              :r="radius"
              fill="none"
              class="dh-score-track"
              stroke-width="8"
            />
            <!-- progress -->
            <circle
              cx="50"
              cy="50"
              :r="radius"
              fill="none"
              :stroke="scoreColor"
              stroke-width="8"
              stroke-linecap="round"
              :stroke-dasharray="`${scoreDash} ${circumference}`"
              stroke-dashoffset="0"
              transform="rotate(-90 50 50)"
              :style="{ filter: `drop-shadow(0 0 6px ${scoreColor}88)` }"
            />
            <!-- text -->
            <text
              x="50"
              y="46"
              text-anchor="middle"
              font-size="18"
              font-weight="900"
              :fill="scoreColor"
              font-family="monospace"
            >
              {{ scoreVal }}
            </text>
            <text
              x="50"
              y="62"
              text-anchor="middle"
              font-size="9"
              font-weight="700"
              class="dh-score-text-lbl"
              font-family="monospace"
            >
              SCORE
            </text>
          </svg>
        </div>
        <div class="dh-kpi-score-info">
          <span class="dh-kpi-score-label">HEALTH SCORE</span>
          <span :class="['dh-kpi-score-badge', `dh-kpi-score-badge--${scoreClass}`]">{{ scoreLabel }}</span>
          <span class="dh-kpi-score-desc">
            {{
              scoreVal >= 90
                ? 'Repository în stare excelentă — zero blocante.'
                : scoreVal >= 70
                ? 'Necesită atenție pe câteva fișiere.'
                : 'Erori critice detectate — acțiune urgentă.'
            }}
          </span>
        </div>
      </div>

      <!-- Divider -->
      <div class="dh-kpi-divider" />

      <!-- Stat: Broken Links -->
      <div class="dh-kpi-stat dh-kpi-stat--red">
        <div class="dh-kpi-stat-icon">
          <Icon icon="lucide:link-2" width="18" height="18" />
        </div>
        <div class="dh-kpi-stat-body">
          <span class="dh-kpi-stat-number">{{ loading ? '—' : report?.brokenLinks ?? 0 }}</span>
          <span class="dh-kpi-stat-name">Link-uri Moarte</span>
          <span class="dh-kpi-stat-desc">Ancore și href-uri 404</span>
        </div>
        <Icon
          v-if="(report?.brokenLinks ?? 0) === 0 && !loading"
          icon="lucide:check-circle-2"
          width="14"
          height="14"
          class="dh-kpi-ok-icon"
        />
      </div>

      <!-- Stat: Frontmatter -->
      <div class="dh-kpi-stat dh-kpi-stat--amber">
        <div class="dh-kpi-stat-icon">
          <Icon icon="lucide:file-warning" width="18" height="18" />
        </div>
        <div class="dh-kpi-stat-body">
          <span class="dh-kpi-stat-number">{{ loading ? '—' : report?.missingFrontmatter ?? 0 }}</span>
          <span class="dh-kpi-stat-name">Frontmatter Invalid</span>
          <span class="dh-kpi-stat-desc">Titlu / descriere SEO lipsă</span>
        </div>
        <Icon
          v-if="(report?.missingFrontmatter ?? 0) === 0 && !loading"
          icon="lucide:check-circle-2"
          width="14"
          height="14"
          class="dh-kpi-ok-icon"
        />
      </div>

      <!-- Stat: Orphans -->
      <div class="dh-kpi-stat dh-kpi-stat--blue">
        <div class="dh-kpi-stat-icon">
          <Icon icon="lucide:file-text" width="18" height="18" />
        </div>
        <div class="dh-kpi-stat-body">
          <span class="dh-kpi-stat-number">{{ loading ? '—' : report?.orphanDocs ?? 0 }}</span>
          <span class="dh-kpi-stat-name">Documente Orfane</span>
          <span class="dh-kpi-stat-desc">Fără referințe din alte pagini</span>
        </div>
        <Icon
          v-if="(report?.orphanDocs ?? 0) === 0 && !loading"
          icon="lucide:check-circle-2"
          width="14"
          height="14"
          class="dh-kpi-ok-icon"
        />
      </div>

      <!-- Stat: Total Pages -->
      <div class="dh-kpi-stat dh-kpi-stat--purple">
        <div class="dh-kpi-stat-icon">
          <Icon icon="lucide:activity" width="18" height="18" />
        </div>
        <div class="dh-kpi-stat-body">
          <span class="dh-kpi-stat-number">{{ loading ? '—' : report?.totalPages ?? 0 }}</span>
          <span class="dh-kpi-stat-name">Articole Scanate</span>
          <span class="dh-kpi-stat-desc">Fișiere .md / .mdx analizate</span>
        </div>
      </div>
    </div>

    <!-- ── ISSUES PANEL ────────────────────────────────────────────── -->
    <div class="dh-issues-panel">
      <!-- Panel toolbar -->
      <div class="dh-issues-toolbar">
        <div class="dh-toolbar-left">
          <div class="dh-issues-title">
            <Icon icon="lucide:filter" width="14" height="14" class="text-[var(--color-primary)]" />
            <span>Probleme Detectate</span>
            <span v-if="!loading" class="dh-issues-total-badge">{{ filteredIssues.length }}</span>
          </div>

          <div class="dh-filter-tabs">
            <button
              v-for="item in FILTERS"
              :key="item.key"
              type="button"
              :id="`health-filter-${item.key}`"
              :class="['dh-filter-tab', { 'dh-filter-tab--active': filter === item.key }]"
              @click="filter = item.key"
            >
              <span>{{ item.label }}</span>
              <span :class="['dh-filter-count', { 'dh-filter-count--active': filter === item.key }]">
                {{ filterCounts[item.key] }}
              </span>
            </button>
          </div>
        </div>

        <div class="dh-toolbar-right">
          <div class="dh-search-wrap">
            <Icon icon="lucide:search" width="13" height="13" class="dh-search-icon" />
            <input
              type="text"
              id="health-search-input"
              v-model="searchQuery"
              placeholder="Caută fișier, mesaj, detaliu..."
              class="dh-search-input"
            />
            <button
              v-if="searchQuery"
              type="button"
              class="dh-search-clear"
              title="Șterge căutarea"
              @click="searchQuery = ''"
            >
              <Icon icon="lucide:x" width="12" height="12" />
            </button>
          </div>
        </div>
      </div>

      <!-- Issue list -->
      <div class="dh-issues-list">
        <!-- LOADING -->
        <div v-if="loading" class="dh-loading-state">
          <div class="dh-loading-orb">
            <Icon icon="lucide:refresh-cw" width="20" height="20" class="dh-spin" />
          </div>
          <p class="dh-loading-text">Se analizează {{ report?.totalPages || 62 }} articole...</p>
          <p class="dh-loading-sub">Verificare frontmatter, link-uri interne și referințe încrucișate</p>
        </div>

        <!-- EMPTY -->
        <div v-else-if="filteredIssues.length === 0" class="dh-empty-state">
          <div class="dh-empty-orb">
            <Icon icon="lucide:check-circle-2" width="28" height="28" />
          </div>
          <h3 class="dh-empty-title">
            {{
              searchQuery
                ? 'Nicio potrivire găsită'
                : filter !== 'all'
                ? `Nicio problemă de tip „${FILTERS.find((f) => f.key === filter)?.label}”`
                : 'Repository 100% curat!'
            }}
          </h3>
          <p class="dh-empty-sub">
            {{
              searchQuery
                ? 'Încearcă alt termen de căutare sau elimină filtrul activ.'
                : 'Toate verificările de integritate au trecut cu succes.'
            }}
          </p>
        </div>

        <!-- ISSUE CARDS -->
        <div
          v-else
          v-for="(issue, idx) in filteredIssues"
          :key="idx"
          :class="['dh-issue-row', `dh-issue-row--${issue.severity}`]"
        >
          <!-- Left icon -->
          <div :class="['dh-issue-icon-col', `dh-issue-icon-col--${issue.severity}`]">
            <Icon
              v-if="issue.severity === 'error'"
              icon="lucide:shield-alert"
              width="15"
              height="15"
              class="dh-icon-error"
            />
            <Icon
              v-else-if="issue.severity === 'warning'"
              icon="lucide:alert-triangle"
              width="15"
              height="15"
              class="dh-icon-warning"
            />
            <Icon
              v-else
              icon="lucide:file-text"
              width="15"
              height="15"
              class="dh-icon-info"
            />
          </div>

          <!-- Main content -->
          <div class="dh-issue-content">
            <div class="dh-issue-meta-row">
              <span class="dh-issue-filepath">{{ issue.file }}</span>
              <span v-if="issue.line" class="dh-issue-line-tag">Linia {{ issue.line }}</span>
              <span :class="['dh-issue-severity-pill', `dh-issue-severity-pill--${issue.severity}`]">
                {{ issue.severity === 'error' ? 'EROARE' : issue.severity === 'warning' ? 'AVERTISMENT' : 'INFO' }}
              </span>
              <span class="dh-issue-type-chip">
                {{ issue.type.replace(/_/g, ' ') }}
              </span>
            </div>

            <p class="dh-issue-message">{{ issue.message }}</p>

            <div v-if="issue.detail" class="dh-issue-detail">
              <span class="dh-issue-detail-label">Detaliu:</span>
              <code class="dh-issue-detail-code">{{ issue.detail }}</code>
            </div>
          </div>

          <!-- Action -->
          <div class="dh-issue-action-col">
            <a
              :href="`/admin/content?slug=${encodeURIComponent(issue.slug)}`"
              class="dh-issue-fix-btn"
              title="Deschide în Content Studio"
            >
              <Icon icon="lucide:zap" width="12" height="12" />
              <span>Remediază</span>
              <Icon icon="lucide:external-link" width="11" height="11" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
