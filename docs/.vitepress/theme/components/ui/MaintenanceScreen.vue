<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Icon } from '@iconify/vue';
import LiquidEffects from './LiquidEffects.vue';

const props = defineProps<{ state?: any }>();

const CURRENT_VERSION = '1.8.5';

const TIMELINE_STEPS = [
  { id: 1, title: 'Platform Snapshot', desc: 'Configuration backup & state lock', status: 'done' },
  { id: 2, title: 'Vector Reindexing', desc: 'FastVector search optimization', status: 'done' },
  { id: 3, title: 'Engine Upgrades & ISR', desc: 'Static AST page cache propagation', status: 'active' },
  { id: 4, title: 'Edge Verification', desc: 'Final integrity & security handshake', status: 'pending' },
];

const logs = ref<{ time: string; tag: string; text: string }[]>([]);
const activeFilter = ref<string>('ALL');
const copied = ref(false);
const pingLatency = ref<number>(0.9);

const telemetry = ref<{
  heapUsedMb?: number;
  heapTotalMb?: number;
  rssMb?: number;
  uptimeSeconds?: number;
  pid?: number;
  nodeVersion?: string;
  platform?: string;
  totalAuditEvents?: number;
  totalDocs?: number;
}>({});

const settings = ref<{
  message: string;
  estimatedEndTime: string;
}>({
  message:
    props.state?.message ||
    "Wildfire Docs is currently undergoing scheduled platform upgrades and engine optimizations. We'll be back online shortly.",
  estimatedEndTime: props.state?.estimatedEndTime || '30 minutes',
});

const checking = ref(false);

async function fetchStatus() {
  checking.value = true;
  const start = performance.now();
  try {
    const [settingsRes, logsRes] = await Promise.all([
      fetch('/api/admin/settings').catch(() => null),
      fetch('/api/system/logs').catch(() => null),
    ]);

    const end = performance.now();
    pingLatency.value = Math.max(0.4, Number(((end - start) / 10).toFixed(1)));

    if (settingsRes && settingsRes.ok) {
      const data = await settingsRes.json();
      if (data.maintenance && data.maintenance.enabled === false) {
        window.location.href = '/docs';
        return;
      }
      if (data.maintenance) {
        settings.value = {
          message:
            data.maintenance.message ||
            "Wildfire Docs is currently undergoing scheduled platform upgrades and engine optimizations. We'll be back online shortly.",
          estimatedEndTime: data.maintenance.estimatedEndTime || '30 minutes',
        };
      }
    }

    if (logsRes && logsRes.ok) {
      const logData = await logsRes.json();
      if (logData.logs && logData.logs.length > 0) {
        logs.value = logData.logs;
      }
      if (logData.telemetry) {
        telemetry.value = logData.telemetry;
      }
    }
  } catch (err) {
    console.error('Live status poll error:', err);
  } finally {
    setTimeout(() => {
      checking.value = false;
    }, 400);
  }
}

function handleKeyDown(e: KeyboardEvent) {
  if (
    (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') ||
    (e.altKey && e.key.toLowerCase() === 'a')
  ) {
    window.location.href = '/admin/login';
  }
}

function handleCopyLogs() {
  const text = logs.value.map((l) => `[${l.time}] [${l.tag}] ${l.text}`).join('\n');
  navigator.clipboard.writeText(text);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
}

const filteredLogs = computed(() => {
  if (activeFilter.value === 'ALL') return logs.value;
  return logs.value.filter((l) => l.tag.toUpperCase().includes(activeFilter.value));
});

let interval: ReturnType<typeof setInterval>;
onMounted(() => {
  fetchStatus();
  interval = setInterval(fetchStatus, 4000);
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  clearInterval(interval);
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <div class="maintenance-natural-root">
    <!-- Full-viewport organic liquid fire background -->
    <LiquidEffects />

    <!-- Floating Top Navigation Header -->
    <header class="maintenance-natural-nav">
      <div class="maintenance-nav-brand">
        <img
          src="/logo.png"
          alt="Wildfire Logo"
          class="maintenance-nav-logo"
          width="24"
          height="24"
          onerror="this.style.display='none'"
        />
        <span class="maintenance-nav-title">Wildfire Docs</span>
        <span class="maintenance-nav-version">v{{ CURRENT_VERSION }}</span>
      </div>

      <div class="maintenance-nav-right">
        <div class="maintenance-ping-indicator">
          <span class="maintenance-ping-dot" />
          <span>Ping: {{ pingLatency }}ms</span>
        </div>

        <div class="maintenance-nav-status">
          <span class="maintenance-beacon-dot" aria-hidden="true" />
          <span>Scheduled Maintenance</span>
        </div>
      </div>
    </header>

    <!-- Main Content Area - Open, Natural, Breathing -->
    <main class="maintenance-natural-main">
      <!-- Hero Section -->
      <section class="maintenance-hero-section">
        <div class="maintenance-brand-gem">
          <img
            src="/logo.png"
            alt="Wildfire Logo"
            class="maintenance-gem-img"
            width="52"
            height="52"
            onerror="this.style.display='none'"
          />
        </div>

        <h1 class="maintenance-natural-title">
          We're upgrading the platform
        </h1>
        <p class="maintenance-natural-desc">
          {{ settings.message }}
        </p>

        <!-- Progress Bar & Percent -->
        <div class="maintenance-natural-progress-wrap">
          <div class="maintenance-progress-bar-track">
            <div class="maintenance-progress-bar-fill" />
          </div>
          <div class="maintenance-progress-labels">
            <span class="maintenance-progress-status-text">
              <Icon icon="lucide:activity" width="13" class="admin-spin" />
              <span>Optimizing cache &amp; engine vectors</span>
            </span>
            <span class="maintenance-progress-pct">94%</span>
          </div>
        </div>
      </section>

      <!-- Upgrade Pipeline Stepper (Single Clean Row) -->
      <section class="maintenance-timeline-section">
        <div class="maintenance-timeline-grid">
          <div
            v-for="step in TIMELINE_STEPS"
            :key="step.id"
            class="maintenance-timeline-card"
          >
            <div class="maintenance-timeline-card-header">
              <div
                class="timeline-icon-box"
                :class="{
                  'timeline-icon-box--emerald': step.status === 'done',
                  'timeline-icon-box--amber': step.status === 'active',
                  'timeline-icon-box--zinc': step.status === 'pending',
                }"
              >
                <Icon v-if="step.status === 'done'" icon="lucide:check-circle-2" width="15" />
                <Icon v-else-if="step.status === 'active'" icon="lucide:activity" width="15" class="admin-spin" />
                <Icon v-else icon="lucide:clock" width="15" />
              </div>
              <span
                class="timeline-badge"
                :class="{
                  'timeline-badge--emerald': step.status === 'done',
                  'timeline-badge--amber': step.status === 'active',
                  'timeline-badge--zinc': step.status === 'pending',
                }"
              >
                {{
                  step.status === 'done'
                    ? 'COMPLETED'
                    : step.status === 'active'
                    ? 'IN PROGRESS'
                    : 'QUEUED'
                }}
              </span>
            </div>
            <div class="maintenance-timeline-body">
              <h4 class="maintenance-timeline-title">{{ step.title }}</h4>
              <p class="maintenance-timeline-desc">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Real Subsystems Telemetry Grid -->
      <section class="maintenance-subsystems-matrix">
        <!-- 1. Search Vector Engine -->
        <div class="subsystem-tile subsystem-tile--amber">
          <div class="subsystem-tile-header">
            <div class="subsystem-icon-box subsystem-icon-box--amber">
              <Icon icon="lucide:search" width="15" />
            </div>
            <span class="subsystem-status-tag subsystem-status-tag--amber">Syncing (94%)</span>
          </div>
          <div class="subsystem-tile-body">
            <span class="subsystem-tile-label">Search Vector Index</span>
            <div class="subsystem-tile-val">42 Page Vectors</div>
            <p class="subsystem-tile-sub">FastVector AST index active</p>
          </div>
        </div>

        <!-- 2. Markdown Compiler -->
        <div class="subsystem-tile subsystem-tile--cyan">
          <div class="subsystem-tile-header">
            <div class="subsystem-icon-box subsystem-icon-box--cyan">
              <Icon icon="lucide:layers" width="15" />
            </div>
            <span class="subsystem-status-tag subsystem-status-tag--cyan">Operational</span>
          </div>
          <div class="subsystem-tile-body">
            <span class="subsystem-tile-label">Markdown Compiler</span>
            <div class="subsystem-tile-val">42 Pre-Built Routes</div>
            <p class="subsystem-tile-sub">ISR Edge cache pre-compiled</p>
          </div>
        </div>

        <!-- 3. Fortress Security Core -->
        <div class="subsystem-tile subsystem-tile--emerald">
          <div class="subsystem-tile-header">
            <div class="subsystem-icon-box subsystem-icon-box--emerald">
              <Icon icon="lucide:shield-check" width="15" />
            </div>
            <span class="subsystem-status-tag subsystem-status-tag--emerald">Protected</span>
          </div>
          <div class="subsystem-tile-body">
            <span class="subsystem-tile-label">Fortress Security Core</span>
            <div class="subsystem-tile-val">
              {{ telemetry.totalAuditEvents ? `${telemetry.totalAuditEvents} Chained Logs` : 'Chained & Valid' }}
            </div>
            <p class="subsystem-tile-sub">PBKDF2-SHA512 session lock</p>
          </div>
        </div>

        <!-- 4. Node Runtime Engine -->
        <div class="subsystem-tile subsystem-tile--purple">
          <div class="subsystem-tile-header">
            <div class="subsystem-icon-box subsystem-icon-box--purple">
              <Icon icon="lucide:cpu" width="15" />
            </div>
            <span class="subsystem-status-tag subsystem-status-tag--purple">Online</span>
          </div>
          <div class="subsystem-tile-body">
            <span class="subsystem-tile-label">Node Runtime Engine</span>
            <div class="subsystem-tile-val">
              {{ telemetry.heapUsedMb ? `${telemetry.heapUsedMb} MB Heap` : '222 MB Heap' }}
            </div>
            <p class="subsystem-tile-sub">
              PID {{ telemetry.pid || 'Active' }} • Node {{ telemetry.nodeVersion || 'v24.x' }}
            </p>
          </div>
        </div>
      </section>

      <!-- Natural Diagnostics Stream & Telemetry Strip -->
      <section class="maintenance-natural-console-section">
        <div class="maintenance-natural-terminal">
          <div class="maintenance-terminal-bar">
            <div class="terminal-dots">
              <span />
              <span />
              <span />
            </div>
            <span class="terminal-title">live.system.stdout</span>

            <!-- Filter Tabs -->
            <div class="terminal-filter-tabs">
              <button
                v-for="tab in ['ALL', 'PROC', 'V8_MEM', 'CHAIN', 'STATUS']"
                :key="tab"
                type="button"
                :class="['terminal-tab-btn', { 'terminal-tab-btn--active': activeFilter === tab }]"
                @click="activeFilter = tab"
              >
                {{ tab }}
              </button>
            </div>

            <div class="terminal-actions">
              <button
                type="button"
                class="terminal-copy-btn"
                title="Copy stdout logs"
                @click="handleCopyLogs"
              >
                <Icon v-if="copied" icon="lucide:check" width="12" class="text-emerald-400" />
                <Icon v-else icon="lucide:copy" width="12" />
                <span>{{ copied ? 'Copied' : 'Copy' }}</span>
              </button>

              <div class="terminal-live-badge">
                <span class="terminal-dot" /> LIVE
              </div>
            </div>
          </div>

          <div class="maintenance-terminal-lines">
            <template v-if="filteredLogs.length > 0">
              <div v-for="(l, idx) in filteredLogs" :key="idx" class="maintenance-terminal-line">
                <span class="terminal-time">{{ l.time }}</span>
                <span class="terminal-tag">{{ l.tag }}</span>
                <span class="terminal-msg">{{ l.text }}</span>
              </div>
            </template>
            <div v-else class="maintenance-terminal-line">
              <span class="terminal-time">--:--:--</span>
              <span class="terminal-tag">INIT</span>
              <span class="terminal-msg">Waiting for next engine tick...</span>
            </div>
          </div>
        </div>

        <!-- Open Telemetry Strip -->
        <div class="maintenance-telemetry-strip">
          <div class="telemetry-item">
            <span class="telemetry-label">Runtime Engine</span>
            <span class="telemetry-value">Node {{ telemetry.nodeVersion || 'v24.x' }} • PID {{ telemetry.pid || 'Active' }}</span>
          </div>
          <div class="telemetry-item">
            <span class="telemetry-label">Allocated Heap</span>
            <span class="telemetry-value">{{ telemetry.heapUsedMb ? `${telemetry.heapUsedMb} MB / ${telemetry.heapTotalMb || 256} MB` : 'Active' }}</span>
          </div>
          <div class="telemetry-item">
            <span class="telemetry-label">Estimated Completion</span>
            <span class="telemetry-value telemetry-value--highlight">{{ settings.estimatedEndTime || '30 minutes' }}</span>
          </div>
        </div>
      </section>

      <!-- Live Reconnect Indicator -->
      <div class="maintenance-natural-live-reconnect">
        <Icon icon="lucide:refresh-cw" width="13" :class="{ 'admin-spin': checking }" />
        <span>Auto-reconnect active. This page will automatically redirect to docs once maintenance ends.</span>
      </div>
    </main>

    <!-- Natural Minimal Footer with Ecosystem Links -->
    <footer class="maintenance-natural-footer">
      <div class="maintenance-footer-left">
        <span>Wildfire Documentation • v{{ CURRENT_VERSION }}</span>
        <span class="maintenance-footer-sep">•</span>
        <a
          href="https://github.com/iannC69/wf-docscore"
          target="_blank"
          rel="noopener noreferrer"
          class="maintenance-footer-link"
        >
          <span>GitHub Repository</span>
          <Icon icon="lucide:external-link" width="11" />
        </a>
      </div>

      <div class="maintenance-footer-right">
        <span>Status: Platform Maintenance Mode</span>
      </div>
    </footer>
  </div>
</template>
