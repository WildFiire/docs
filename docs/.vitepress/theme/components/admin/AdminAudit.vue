<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Icon } from '@iconify/vue';

interface AuditEventItem {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  ip: string;
  userAgent?: string;
  details?: Record<string, any>;
  previousHash: string;
  hash: string;
}

const events = ref<AuditEventItem[]>([]);
const integrity = ref<{ isValid: boolean; totalEvents: number } | null>(null);
const actionFilter = ref<string>('');
const loading = ref<boolean>(true);

async function loadAuditData() {
  loading.value = true;
  try {
    const url = actionFilter.value
      ? `/api/admin/audit?action=${encodeURIComponent(actionFilter.value)}`
      : `/api/admin/audit?limit=100`;
    const res = await fetch(url);
    if (res.status === 401) {
      window.location.href = '/admin/login';
      return;
    }
    const data = await res.json();
    events.value = data.events || [];
    integrity.value = data.integrity || null;
  } catch (err) {
    console.error('Failed to load audit events', err);
  } finally {
    loading.value = false;
  }
}

watch(actionFilter, () => {
  loadAuditData();
});

onMounted(() => {
  loadAuditData();
});

function handleExportJSON() {
  const dataStr = JSON.stringify(events.value, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wildfire-audit-ledger-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

const resealing = ref(false);

async function handleResealChain() {
  if (!confirm('Ești sigur că dorești să recalculezi și să resigilezi întregul lanț criptografic SHA-256? Această acțiune va repara orice discrepanță de integritate.')) {
    return;
  }
  resealing.value = true;
  try {
    const res = await fetch('/api/admin/audit', { method: 'POST' });
    const data = await res.json();
    if (data.ok) {
      await loadAuditData();
    } else {
      alert(data.message || 'Eroare la resigilarea lanțului.');
    }
  } catch (err: any) {
    alert(err?.message || 'Eroare de conexiune.');
  } finally {
    resealing.value = false;
  }
}
</script>

<template>
  <div class="admin-audit-page">
    <!-- Page Header -->
    <div class="admin-page-header">
      <div>
        <div class="admin-breadcrumb-tag">AUDIT TRAIL</div>
        <h1 class="admin-page-title">Cryptographic Audit Ledger</h1>
        <p class="admin-page-description">
          Tamper-evident, SHA-256 hash-chained log of all administrative actions, logins, and documentation updates.
        </p>
      </div>

      <div class="admin-header-actions">
        <button
          type="button"
          @click="handleExportJSON"
          class="admin-btn admin-btn--secondary"
        >
          <Icon icon="lucide:download" width="14" height="14" />
          <span>Export JSON</span>
        </button>
        <button
          type="button"
          @click="loadAuditData"
          class="admin-btn admin-btn--secondary"
        >
          <Icon icon="lucide:refresh-cw" width="14" height="14" />
          <span>Refresh Ledger</span>
        </button>
      </div>
    </div>

    <!-- Integrity Badge Banner -->
    <div
      v-if="integrity"
      class="admin-alert-banner"
      :class="integrity.isValid ? 'admin-alert-banner--success' : 'admin-alert-banner--danger'"
    >
      <Icon
        :icon="integrity.isValid ? 'lucide:shield-check' : 'lucide:shield-alert'"
        width="18"
        height="18"
      />
      <span style="flex: 1;">
        {{
          integrity.isValid
            ? `Cryptographic Hash Chain Integrity: 100% VERIFIED across ${integrity.totalEvents} events.`
            : `CRITICAL ALERT: Audit ledger tampering detected! Hash chain mismatch.`
        }}
      </span>
      <button
        v-if="!integrity.isValid"
        type="button"
        @click="handleResealChain"
        class="admin-btn admin-btn--primary"
        :disabled="resealing"
      >
        <Icon icon="lucide:wrench" width="14" height="14" />
        <span>{{ resealing ? 'Se resigilează...' : 'Resigilează Lanțul SHA-256' }}</span>
      </button>
    </div>

    <!-- Audit Table Card -->
    <section class="admin-panel-card">
      <div class="admin-panel-card-header">
        <div class="admin-panel-title-box">
          <Icon icon="lucide:scroll-text" class="admin-panel-icon" width="16" height="16" />
          <h2 class="admin-panel-title">Event Ledger ({{ events.length }})</h2>
        </div>

        <div class="admin-filter-box">
          <Icon icon="lucide:filter" class="admin-filter-icon" width="13" height="13" />
          <select
            v-model="actionFilter"
            class="admin-select-field"
          >
            <option value="">All Event Actions</option>
            <option value="AUTH_LOGIN_SUCCESS">AUTH_LOGIN_SUCCESS</option>
            <option value="AUTH_LOGIN_FAILURE">AUTH_LOGIN_FAILURE</option>
            <option value="AUTH_LOGOUT">AUTH_LOGOUT</option>
            <option value="DOC_CREATE">DOC_CREATE</option>
            <option value="DOC_UPDATE">DOC_UPDATE</option>
            <option value="AUTH_2FA_ENABLED">AUTH_2FA_ENABLED</option>
            <option value="SESSION_REVOKED">SESSION_REVOKED</option>
            <option value="PANIC_LOCKDOWN_TRIGGERED">PANIC_LOCKDOWN_TRIGGERED</option>
          </select>
        </div>
      </div>

      <div class="admin-table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>Actor</th>
              <th>IP Address</th>
              <th>SHA-256 Hash</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="events.length === 0">
              <td colspan="6" class="admin-table-empty">
                No audit records match the current filter.
              </td>
            </tr>
            <tr v-else v-for="evt in events" :key="evt.id">
              <td class="admin-table-time">
                {{ new Date(evt.timestamp).toLocaleString() }}
              </td>
              <td>
                <span class="admin-action-pill">
                  {{ evt.action.replace(/_/g, ' ') }}
                </span>
              </td>
              <td>
                <span class="admin-user-tag">{{ evt.actor }}</span>
              </td>
              <td>{{ evt.ip }}</td>
              <td>
                <code
                  class="admin-code-cell"
                  :title="`Full SHA-256: ${evt.hash}\nPrevious Hash: ${evt.previousHash}`"
                >
                  {{ evt.hash.slice(0, 12) }}...
                </code>
              </td>
              <td>
                <span class="admin-details-json">
                  {{ JSON.stringify(evt.details || {}) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
