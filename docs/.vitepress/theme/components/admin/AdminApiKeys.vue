<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';

interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  scope: string;
  createdAt: string;
  lastUsedAt?: string;
  expiresAt: string;
  revoked: boolean;
}

const keys = ref<ApiKeyItem[]>([]);
const showCreateModal = ref<boolean>(false);
const name = ref<string>('');
const scope = ref<'full_access' | 'read_only' | 'ci_cd'>('read_only');
const expiresInDays = ref<number>(90);
const newlyCreatedToken = ref<string | null>(null);
const copied = ref<boolean>(false);
const statusMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null);
const loading = ref<boolean>(true);

async function loadKeys() {
  try {
    const res = await fetch('/api/admin/api-keys');
    if (res.status === 401) {
      window.location.href = '/admin/login';
      return;
    }
    const data = await res.json();
    keys.value = data.keys || [];
  } catch (err) {
    console.error('Failed to load API keys', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadKeys();
});

async function handleCreateKey(e: Event) {
  e.preventDefault();
  try {
    const res = await fetch('/api/admin/api-keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create',
        name: name.value,
        scope: scope.value,
        expiresInDays: expiresInDays.value,
      }),
    });
    const data = await res.json();
    if (data.success) {
      newlyCreatedToken.value = data.rawToken;
      name.value = '';
      loadKeys();
    } else {
      statusMessage.value = { type: 'error', text: data.error || 'Failed to generate key.' };
    }
  } catch {
    statusMessage.value = { type: 'error', text: 'Network error occurred.' };
  }
}

async function handleRevokeKey(keyId: string) {
  try {
    const res = await fetch('/api/admin/api-keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'revoke', keyId }),
    });
    const data = await res.json();
    if (data.success) {
      statusMessage.value = { type: 'success', text: 'API Key revoked successfully.' };
      loadKeys();
    }
  } catch {
    statusMessage.value = { type: 'error', text: 'Failed to revoke key.' };
  }
}

function copyToken() {
  if (newlyCreatedToken.value) {
    navigator.clipboard.writeText(newlyCreatedToken.value);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  }
}
</script>

<template>
  <div class="admin-api-keys-page">
    <!-- Page Header -->
    <div class="admin-page-header">
      <div>
        <div class="admin-breadcrumb-tag">ACCESS INTEGRATIONS</div>
        <h1 class="admin-page-title">API Tokens &amp; Webhook Credentials</h1>
        <p class="admin-page-description">
          Generate and manage cryptographically signed access tokens for CI/CD deployment pipelines, automated doc publishing, and external services.
        </p>
      </div>

      <div class="admin-header-actions">
        <button
          type="button"
          @click="() => { showCreateModal = true; newlyCreatedToken = null; }"
          class="admin-btn admin-btn--primary"
        >
          <Icon icon="lucide:plus" width="14" height="14" />
          <span>Generate New API Key</span>
        </button>
      </div>
    </div>

    <!-- Status Feedback -->
    <div
      v-if="statusMessage"
      class="admin-alert-box"
      :class="statusMessage.type === 'success' ? 'admin-alert-box--success' : 'admin-alert-box--danger'"
    >
      <Icon
        :icon="statusMessage.type === 'success' ? 'lucide:check-circle-2' : 'lucide:alert-circle'"
        width="16"
        height="16"
      />
      <span>{{ statusMessage.text }}</span>
    </div>

    <!-- Modal: Generate Token -->
    <div v-if="showCreateModal" class="admin-modal-overlay" role="dialog" aria-modal="true">
      <div class="admin-modal-card">
        <div class="admin-modal-header">
          <Icon icon="lucide:key" class="admin-panel-icon" width="20" height="20" />
          <h3 class="admin-modal-title">Generate Fortress API Token</h3>
        </div>

        <form v-if="!newlyCreatedToken" @submit="handleCreateKey">
          <div class="admin-form-group">
            <label class="admin-form-label" for="key-name">
              Token Name / Description
            </label>
            <input
              id="key-name"
              type="text"
              required
              placeholder="e.g. GitHub Actions CI Deploy"
              v-model="name"
              class="admin-input-field"
            />
          </div>

          <div class="admin-form-group">
            <label class="admin-form-label" for="key-scope">
              Access Permission Scope
            </label>
            <select
              id="key-scope"
              v-model="scope"
              class="admin-select-field"
            >
              <option value="read_only">Read-Only (Query &amp; Fetch Docs)</option>
              <option value="ci_cd">CI/CD Pipeline (Deploy &amp; Invalidate Cache)</option>
              <option value="full_access">Full Access (Manage Everything)</option>
            </select>
          </div>

          <div class="admin-form-group">
            <label class="admin-form-label" for="key-expiry">
              Expiration Period
            </label>
            <select
              id="key-expiry"
              v-model.number="expiresInDays"
              class="admin-select-field"
            >
              <option :value="30">30 Days</option>
              <option :value="90">90 Days (Recommended)</option>
              <option :value="365">1 Year</option>
            </select>
          </div>

          <div class="admin-modal-actions">
            <button
              type="button"
              @click="showCreateModal = false"
              class="admin-btn admin-btn--secondary"
            >
              Cancel
            </button>
            <button type="submit" class="admin-btn admin-btn--primary">
              <Icon icon="lucide:shield-check" width="14" height="14" />
              <span>Create Token</span>
            </button>
          </div>
        </form>

        <div v-else>
          <div class="admin-alert-box admin-alert-box--success">
            <Icon icon="lucide:check-circle-2" width="16" height="16" />
            <span>API Key generated! Copy this token now as you won't be able to see it again.</span>
          </div>

          <div class="admin-totp-secret-box">
            <div class="admin-totp-secret-row">
              <code class="admin-totp-secret-code">{{ newlyCreatedToken }}</code>
              <button
                type="button"
                @click="copyToken"
                class="admin-btn admin-btn--secondary admin-btn--sm"
              >
                <Icon :icon="copied ? 'lucide:check' : 'lucide:copy'" width="13" height="13" />
                <span>{{ copied ? 'Copied' : 'Copy Token' }}</span>
              </button>
            </div>
          </div>

          <div class="admin-modal-actions">
            <button
              type="button"
              @click="() => { showCreateModal = false; newlyCreatedToken = null; }"
              class="admin-btn admin-btn--primary"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Directory Card -->
    <section class="admin-panel-card">
      <div class="admin-panel-card-header">
        <div class="admin-panel-title-box">
          <Icon icon="lucide:key" class="admin-panel-icon" width="16" height="16" />
          <h2 class="admin-panel-title">Active API Tokens ({{ keys.length }})</h2>
        </div>
      </div>

      <div class="admin-table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Token Prefix</th>
              <th>Description</th>
              <th>Scope</th>
              <th>Created</th>
              <th>Last Used</th>
              <th>Expires</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="keys.length === 0">
              <td colspan="8" class="admin-table-empty">
                No active API keys created yet.
              </td>
            </tr>
            <tr v-else v-for="k in keys" :key="k.id">
              <td>
                <code class="admin-code-cell">{{ k.prefix }}...</code>
              </td>
              <td>
                <strong class="admin-user-tag">{{ k.name }}</strong>
              </td>
              <td>
                <span class="admin-status-pill">
                  {{ k.scope.replace('_', ' ') }}
                </span>
              </td>
              <td>{{ new Date(k.createdAt).toLocaleDateString() }}</td>
              <td>
                {{ k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString() : 'Never' }}
              </td>
              <td>{{ new Date(k.expiresAt).toLocaleDateString() }}</td>
              <td>
                <span
                  class="admin-status-pill"
                  :class="k.revoked ? 'admin-status-pill--danger' : 'admin-status-pill--success'"
                >
                  {{ k.revoked ? 'Revoked' : 'Active' }}
                </span>
              </td>
              <td>
                <button
                  v-if="!k.revoked"
                  type="button"
                  @click="handleRevokeKey(k.id)"
                  class="admin-btn admin-btn--danger-sm"
                >
                  Revoke
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
