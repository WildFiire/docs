<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';

interface SessionInfo {
  sessionId: string;
  username: string;
  role: string;
  ip: string;
  userAgent: string;
  createdAt: number;
  lastActiveAt: number;
  isRoot?: boolean;
}

const props = defineProps<{
  user?: any;
}>();

const sessions = ref<SessionInfo[]>([]);
const currentSessionId = ref<string>('');
const currentUser = ref<any>(null);
const twoFactorEnabled = ref<boolean>(false);
const twoFactorSecret = ref<string>('');
const twoFactorUri = ref<string>('');
const backupCodes = ref<string[]>([]);
const verificationCode = ref<string>('');
const isLocked = ref<boolean>(false);
const masterPassword = ref<string>('');
const loading = ref<boolean>(true);
const copied = ref<boolean>(false);
const statusMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null);

async function loadSecurityState() {
  try {
    // 1. Load Sessions
    const sessRes = await fetch('/api/admin/sessions');
    if (sessRes.status === 401) {
      window.location.href = '/admin/login';
      return;
    }
    const sessData = await sessRes.json();
    sessions.value = sessData.sessions || [];
    currentSessionId.value = sessData.currentSessionId || '';
    if (sessData.currentUser) {
      currentUser.value = sessData.currentUser;
    }

    // 2. Load 2FA status
    const totpRes = await fetch('/api/admin/auth/totp');
    const totpData = await totpRes.json();
    twoFactorEnabled.value = totpData.enabled || false;
    if (totpData.secret) twoFactorSecret.value = totpData.secret;
    if (totpData.uri) twoFactorUri.value = totpData.uri;
    if (totpData.backupCodes) backupCodes.value = totpData.backupCodes;

    // 3. Load Panic Status
    const panicRes = await fetch('/api/admin/auth/panic');
    const panicData = await panicRes.json();
    isLocked.value = panicData.isLocked || false;
  } catch (err) {
    console.error('Failed to load security state', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadSecurityState();
});

async function handleRevokeSession(sessionId: string) {
  try {
    const res = await fetch('/api/admin/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });
    const data = await res.json();
    if (data.success) {
      statusMessage.value = { type: 'success', text: 'Session revoked successfully.' };
      loadSecurityState();
    }
  } catch {
    statusMessage.value = { type: 'error', text: 'Failed to revoke session.' };
  }
}

async function handleEnable2FA(e: Event) {
  e.preventDefault();
  try {
    const res = await fetch('/api/admin/auth/totp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'enable',
        secret: twoFactorSecret.value,
        code: verificationCode.value,
      }),
    });
    const data = await res.json();
    if (data.success) {
      statusMessage.value = { type: 'success', text: data.message };
      twoFactorEnabled.value = true;
      loadSecurityState();
    } else {
      statusMessage.value = { type: 'error', text: data.error };
    }
  } catch {
    statusMessage.value = { type: 'error', text: 'Failed to verify 2FA code.' };
  }
}

async function handleDisable2FA() {
  try {
    const res = await fetch('/api/admin/auth/totp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'disable' }),
    });
    const data = await res.json();
    if (data.success) {
      statusMessage.value = { type: 'success', text: data.message };
      twoFactorEnabled.value = false;
      loadSecurityState();
    }
  } catch {
    statusMessage.value = { type: 'error', text: 'Failed to disable 2FA.' };
  }
}

async function handleTriggerPanic() {
  try {
    const res = await fetch('/api/admin/auth/panic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'trigger' }),
    });
    const data = await res.json();
    if (data.success) {
      window.location.href = '/admin/login';
    }
  } catch {
    statusMessage.value = { type: 'error', text: 'Failed to trigger panic mode.' };
  }
}

async function handleReleasePanic() {
  try {
    const res = await fetch('/api/admin/auth/panic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'release', masterPassword: masterPassword.value }),
    });
    const data = await res.json();
    if (data.success) {
      statusMessage.value = { type: 'success', text: data.message };
      isLocked.value = false;
      masterPassword.value = '';
      loadSecurityState();
    } else {
      statusMessage.value = { type: 'error', text: data.error };
    }
  } catch {
    statusMessage.value = { type: 'error', text: 'Failed to release panic mode.' };
  }
}

function copySecret() {
  navigator.clipboard.writeText(twoFactorSecret.value);
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 2000);
}
</script>

<template>
  <div class="admin-security-page">
    <!-- Page Header -->
    <div class="admin-page-header">
      <div>
        <div class="admin-breadcrumb-tag">SECURITY COMMAND</div>
        <h1 class="admin-page-title">Access Control &amp; Two-Factor Fortress</h1>
        <p class="admin-page-description">
          Manage active sessions, configure RFC 6238 TOTP two-factor authentication, and monitor panic killswitch protocols.
        </p>
      </div>

      <div class="admin-header-actions">
        <button
          type="button"
          @click="loadSecurityState"
          class="admin-btn admin-btn--secondary"
        >
          <Icon icon="lucide:refresh-cw" width="14" height="14" />
          <span>Refresh State</span>
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

    <!-- Grid: 2FA Card + Panic Lockdown Card -->
    <div class="admin-security-grid">
      <!-- Two-Factor Authentication Card -->
      <section class="admin-panel-card">
        <div class="admin-panel-card-header">
          <div class="admin-panel-title-box">
            <Icon icon="lucide:key-round" class="admin-panel-icon" width="16" height="16" />
            <h2 class="admin-panel-title">Two-Factor Authentication (TOTP)</h2>
          </div>
          <span
            class="admin-status-pill"
            :class="twoFactorEnabled ? 'admin-status-pill--success' : 'admin-status-pill--warning'"
          >
            {{ twoFactorEnabled ? '2FA Active' : '2FA Inactive' }}
          </span>
        </div>

        <div class="admin-panel-card-body">
          <div v-if="twoFactorEnabled" class="admin-2fa-active-view">
            <div class="admin-2fa-shield-badge">
              <Icon icon="lucide:shield-check" class="admin-shield-icon" width="28" height="28" />
              <div>
                <h3 class="admin-card-heading">Fortress TOTP is Enabled</h3>
                <p class="admin-card-text">
                  Your administrator account requires a 6-digit TOTP code on every login.
                </p>
              </div>
            </div>

            <div class="admin-backup-codes-box">
              <h4 class="admin-backup-title">Emergency Recovery Codes</h4>
              <div class="admin-backup-codes-list">
                <span v-for="(code, idx) in backupCodes" :key="idx" class="admin-backup-code-pill">
                  {{ code }}
                </span>
              </div>
            </div>

            <button
              type="button"
              @click="handleDisable2FA"
              class="admin-btn admin-btn--danger-outline"
            >
              Disable Two-Factor Authentication
            </button>
          </div>

          <form v-else @submit="handleEnable2FA" class="admin-2fa-setup-form">
            <p class="admin-card-text">
              Add an extra layer of security to your admin account using Google Authenticator, 1Password, or Authy.
            </p>

            <div class="admin-totp-secret-box">
              <span class="admin-totp-label">Provisional Base32 Secret Key:</span>
              <div class="admin-totp-secret-row">
                <code class="admin-totp-secret-code">{{ twoFactorSecret }}</code>
                <button
                  type="button"
                  @click="copySecret"
                  class="admin-btn admin-btn--secondary admin-btn--sm"
                >
                  <Icon :icon="copied ? 'lucide:check' : 'lucide:copy'" width="13" height="13" />
                  <span>{{ copied ? 'Copied' : 'Copy' }}</span>
                </button>
              </div>
            </div>

            <div class="admin-form-group">
              <label class="admin-form-label" for="verify-totp">
                Enter 6-Digit Code to Confirm:
              </label>
              <input
                id="verify-totp"
                type="text"
                required
                maxlength="6"
                v-model="verificationCode"
                placeholder="e.g. 482910"
                class="admin-input-field"
              />
            </div>

            <button
              type="submit"
              class="admin-btn admin-btn--primary"
            >
              <Icon icon="lucide:shield-check" width="14" height="14" />
              <span>Verify &amp; Activate 2FA</span>
            </button>
          </form>
        </div>
      </section>

      <!-- Emergency Panic Lockdown Card -->
      <section class="admin-panel-card admin-panel-card--danger">
        <div class="admin-panel-card-header">
          <div class="admin-panel-title-box">
            <Icon icon="lucide:shield-alert" class="admin-panel-icon admin-panel-icon--danger" width="16" height="16" />
            <h2 class="admin-panel-title">Panic Lockdown Protocol</h2>
          </div>
          <span
            class="admin-status-pill"
            :class="isLocked ? 'admin-status-pill--danger' : 'admin-status-pill--success'"
          >
            {{ isLocked ? 'SYSTEM LOCKED' : 'ARMED' }}
          </span>
        </div>

        <div class="admin-panel-card-body">
          <p class="admin-card-text">
            In the event of a suspected breach, triggering Panic Lockdown will <strong>immediately revoke all active sessions</strong> and suspend all login access until master password override.
          </p>

          <div v-if="isLocked" class="admin-panic-unlock-box">
            <div class="admin-form-group">
              <label class="admin-form-label" for="master-pw">
                Master Password Override to Release Lockdown:
              </label>
              <input
                id="master-pw"
                type="password"
                v-model="masterPassword"
                placeholder="Enter master administrator password"
                class="admin-input-field"
              />
            </div>
            <button
              type="button"
              @click="handleReleasePanic"
              class="admin-btn admin-btn--primary"
            >
              <Icon icon="lucide:unlock" width="14" height="14" />
              <span>Release Panic Lockdown</span>
            </button>
          </div>

          <button
            v-else-if="currentUser?.isRoot || user?.isRoot"
            type="button"
            @click="handleTriggerPanic"
            class="admin-btn admin-btn--danger"
          >
            <Icon icon="lucide:lock" width="14" height="14" />
            <span>Trigger Panic Lockdown Now</span>
          </button>

          <div v-else class="flex items-center gap-2 p-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-md text-xs font-mono text-[var(--color-text-tertiary)]">
            <Icon icon="lucide:shield-alert" class="text-amber-400 flex-shrink-0" width="14" height="14" />
            <span>Acces Restricționat: Doar Super Administratorul Root (iannC69) poate declanșa Panic Lockdown.</span>
          </div>
        </div>
      </section>
    </div>

    <!-- Active Sessions Directory -->
    <section class="admin-panel-card">
      <div class="admin-panel-card-header">
        <div class="admin-panel-title-box">
          <Icon icon="lucide:users" class="admin-panel-icon" width="16" height="16" />
          <h2 class="admin-panel-title">Active Session Directory ({{ sessions.length }})</h2>
        </div>
      </div>

      <div class="admin-table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Administrator</th>
              <th>IP Address</th>
              <th>Created</th>
              <th>Last Active</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sess in sessions" :key="sess.sessionId">
              <td>
                <code class="admin-code-cell">{{ sess.sessionId.slice(0, 16) }}...</code>
              </td>
              <td>
                <div class="flex items-center gap-2">
                  <span class="admin-user-tag">{{ sess.username }}</span>
                  <span v-if="sess.isRoot || sess.role === 'root_admin'" class="admin-root-badge" title="Root Super Admin (Protejat)">
                    ROOT
                  </span>
                </div>
              </td>
              <td>{{ sess.ip }}</td>
              <td>{{ new Date(sess.createdAt).toLocaleTimeString() }}</td>
              <td>{{ new Date(sess.lastActiveAt).toLocaleTimeString() }}</td>
              <td>
                <span v-if="sess.sessionId === currentSessionId" class="admin-status-pill admin-status-pill--success">
                  Current Session
                </span>
                <span v-else class="admin-status-pill">Active</span>
              </td>
              <td>
                <template v-if="sess.sessionId !== currentSessionId">
                  <span
                    v-if="(sess.isRoot || sess.role === 'root_admin') && !(currentUser?.isRoot || user?.isRoot)"
                    class="admin-status-pill"
                    style="border-color: rgba(245, 158, 11, 0.35); color: #f59e0b; background: rgba(245, 158, 11, 0.08);"
                  >
                    PROTEJAT ROOT
                  </span>
                  <span
                    v-else-if="!(currentUser?.isRoot || user?.isRoot) && !currentUser?.permissions?.canManageSecurity"
                    class="text-xs text-[var(--color-text-tertiary)] font-mono"
                  >
                    Fără Drept
                  </span>
                  <button
                    v-else
                    type="button"
                    @click="handleRevokeSession(sess.sessionId)"
                    class="admin-btn admin-btn--danger-sm"
                  >
                    Revoke
                  </button>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
