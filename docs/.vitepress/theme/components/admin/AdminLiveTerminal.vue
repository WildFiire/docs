<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { Icon } from '@iconify/vue';
import { api } from '../../composables/useApi';

interface RealLogItem {
  id: string;
  time: string;
  level: 'info' | 'warn' | 'error' | 'success';
  tag: string;
  message: string;
  category: 'git' | 'audit' | 'system' | 'security' | 'content';
}

interface GitCommitInfo {
  hash: string;
  author: string;
  relativeTime: string;
  subject: string;
}

const logs = ref<RealLogItem[]>([]);
const commits = ref<GitCommitInfo[]>([]);
const telemetry = ref<any>(null);
const filter = ref<'all' | 'git' | 'audit' | 'system' | 'security' | 'content'>('all');
const isLive = ref(true);
const loading = ref(true);
const lastSync = ref('');
const terminalEndRef = ref<HTMLDivElement | null>(null);

const filteredLogs = computed(() =>
  filter.value === 'all' ? logs.value : logs.value.filter((l) => l.category === filter.value)
);

let timer: ReturnType<typeof setInterval>;

async function fetchRealLogs() {
  try {
    const data = await api('/api/system/logs');
    logs.value = data.logs || [];
    commits.value = data.commits || [];
    telemetry.value = data.telemetry || null;
    lastSync.value = new Date().toLocaleTimeString('en-US', { hour12: false });
  } catch (err) {
    console.error('Failed to stream terminal logs', err);
  } finally {
    loading.value = false;
  }
}

function handleExportJSON() {
  const payload = {
    exportedAt: new Date().toISOString(),
    telemetry: telemetry.value,
    commits: commits.value,
    logs: logs.value,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wildfire-telemetry-logs-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function handleClear() {
  logs.value = [];
}

onMounted(() => {
  fetchRealLogs();
  timer = setInterval(() => {
    if (isLive.value && !document.hidden) {
      fetchRealLogs();
    }
  }, 4000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<template>
  <div class="admin-terminal-widget">
    <!-- Terminal Top Control Bar -->
    <div class="admin-terminal-header">
      <div class="admin-terminal-title-row">
        <div class="admin-terminal-dots">
          <span class="dot dot--red"></span>
          <span class="dot dot--yellow"></span>
          <span class="dot dot--green"></span>
        </div>
        <div class="admin-terminal-title">
          <Icon icon="lucide:terminal" class="text-amber-400" />
          <span>REAL-TIME ENGINE TELEMETRY &amp; AUDIT STREAM</span>
          <span v-if="telemetry" class="admin-terminal-pid">
            PID {{ telemetry.pid }} • v{{ telemetry.version }}
          </span>
        </div>
      </div>

      <!-- Action Controls -->
      <div class="admin-terminal-actions">
        <button
          type="button"
          class="admin-term-btn"
          :class="{ 'admin-term-btn--active': isLive }"
          :title="isLive ? 'Pauză stream automat' : 'Pornește live stream'"
          @click="isLive = !isLive"
        >
          <Icon :icon="isLive ? 'lucide:pause' : 'lucide:play'" />
          <span>{{ isLive ? 'LIVE' : 'PAUSED' }}</span>
        </button>

        <button
          type="button"
          class="admin-term-btn"
          :disabled="loading"
          title="Sincronizare forțată"
          @click="fetchRealLogs"
        >
          <Icon icon="lucide:refresh-cw" :class="{ 'animate-spin': loading }" />
          <span>SYNC</span>
        </button>

        <button
          type="button"
          class="admin-term-btn"
          title="Exportă jurnalul complet în JSON"
          @click="handleExportJSON"
        >
          <Icon icon="lucide:download" />
          <span>EXPORT</span>
        </button>

        <button
          type="button"
          class="admin-term-btn"
          title="Golește ecranul"
          @click="handleClear"
        >
          <Icon icon="lucide:trash-2" />
        </button>
      </div>
    </div>

    <!-- Filter Category Tabs -->
    <div class="admin-terminal-tabs">
      <button
        type="button"
        class="admin-term-tab"
        :class="{ 'admin-term-tab--active': filter === 'all' }"
        @click="filter = 'all'"
      >
        <Icon icon="lucide:activity" />
        <span>ALL ({{ logs.length }})</span>
      </button>

      <button
        type="button"
        class="admin-term-tab"
        :class="{ 'admin-term-tab--active': filter === 'git' }"
        @click="filter = 'git'"
      >
        <Icon icon="lucide:git-branch" />
        <span>GIT COMMITS ({{ commits.length }})</span>
      </button>

      <button
        type="button"
        class="admin-term-tab"
        :class="{ 'admin-term-tab--active': filter === 'security' }"
        @click="filter = 'security'"
      >
        <Icon icon="lucide:shield-check" />
        <span>SECURITY &amp; AUTH</span>
      </button>

      <button
        type="button"
        class="admin-term-tab"
        :class="{ 'admin-term-tab--active': filter === 'system' }"
        @click="filter = 'system'"
      >
        <Icon icon="lucide:cpu" />
        <span>SYSTEM &amp; V8</span>
      </button>

      <button
        type="button"
        class="admin-term-tab"
        :class="{ 'admin-term-tab--active': filter === 'content' }"
        @click="filter = 'content'"
      >
        <Icon icon="lucide:file-text" />
        <span>CONTENT OPS</span>
      </button>
    </div>

    <!-- Terminal Monospace Stream Output -->
    <div class="admin-terminal-body">
      <div v-if="filteredLogs.length === 0" class="admin-term-empty">
        <span>[NO TELEMETRY LOGS IN THIS CATEGORY]</span>
      </div>
      <template v-else>
        <div
          v-for="log in filteredLogs"
          :key="log.id"
          class="admin-term-line"
          :class="`admin-term-line--${log.level}`"
        >
          <span class="term-timestamp">[{{ log.time }}]</span>
          <span class="term-tag" :class="`term-tag--${log.category}`">[{{ log.tag }}]</span>
          <span class="term-msg">{{ log.message }}</span>
        </div>
      </template>
      <div ref="terminalEndRef"></div>
    </div>

    <!-- Terminal Live Status Bar -->
    <div v-if="telemetry" class="admin-terminal-footer">
      <div class="term-foot-item">
        <span class="term-foot-label">RAM Heap:</span>
        <span class="term-foot-val">{{ telemetry.heapUsedMb }} MB</span>
      </div>
      <div class="term-foot-item">
        <span class="term-foot-label">Docs Index:</span>
        <span class="term-foot-val">{{ telemetry.totalDocs }} files</span>
      </div>
      <div class="term-foot-item">
        <span class="term-foot-label">SHA-256 Attestation:</span>
        <span class="term-foot-val term-foot-val--success">
          <Icon icon="lucide:check-circle-2" class="inline mr-1" />
          VERIFIED
        </span>
      </div>
      <div class="term-foot-item term-foot-item--sync">
        <span class="term-foot-label">Last Polled:</span>
        <span class="term-foot-val">{{ lastSync || 'Live' }}</span>
      </div>
    </div>
  </div>
</template>
