<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vitepress';
import { Icon } from '@iconify/vue';
import { api } from '../../composables/useApi';

const router = useRouter();

const username = ref('');
const password = ref('');
const showPassword = ref(false);

const authStep = ref<'login' | '2fa_setup' | '2fa_verify'>('login');
const totpCode = ref('');
const tempToken = ref('');
const qrCodeUrl = ref('');
const setupSecret = ref('');

const rememberUser = ref(true);
const loading = ref(false);
const error = ref('');
const lockoutTimer = ref<number | null>(null);

let timerInterval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  try {
    const savedUser = localStorage.getItem('wf_admin_remembered_user');
    if (savedUser) {
      username.value = savedUser;
    } else {
      username.value = 'iannC69';
    }
  } catch {}

  timerInterval = setInterval(() => {
    if (lockoutTimer.value !== null && lockoutTimer.value > 0) {
      lockoutTimer.value--;
      if (lockoutTimer.value <= 0) {
        lockoutTimer.value = null;
        error.value = '';
      }
    }
  }, 1000);
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});

async function handleSubmit() {
  loading.value = true;
  error.value = '';

  try {
    if (rememberUser.value && username.value.trim()) {
      try {
        localStorage.setItem('wf_admin_remembered_user', username.value.trim());
      } catch {}
    }

    const data = await api('/api/admin/auth/login', {
      username: username.value,
      password: password.value,
    });

    if (data.require2FASetup) {
      tempToken.value = data.tempToken;
      await init2FASetup(data.tempToken);
      return;
    }

    if (data.require2FA) {
      tempToken.value = data.tempToken;
      authStep.value = '2fa_verify';
      loading.value = false;
      return;
    }

    if (data.success) {
      window.location.href = '/admin';
    } else {
      error.value = data.message || 'Credențiale de administrator invalide.';
      loading.value = false;
    }
  } catch (err: any) {
    if (err.status === 429) {
      error.value = err.message;
      lockoutTimer.value = err.data?.lockoutRemainingSeconds || 900;
    } else {
      error.value = err.message || 'Eroare de conexiune la rețea. Te rugăm să reîncerci.';
    }
    loading.value = false;
  }
}

async function init2FASetup(token: string) {
  try {
    const data = await api('/api/admin/auth/2fa', {
      action: 'setup',
      tempToken: token,
    });
    if (data.success) {
      qrCodeUrl.value = data.qrCode;
      setupSecret.value = data.secret;
      authStep.value = '2fa_setup';
    } else {
      error.value = data.message || 'Eroare la inițializarea 2FA.';
    }
  } catch (err: any) {
    error.value = err.message || err.data?.message || 'Eroare la inițializarea 2FA.';
  } finally {
    loading.value = false;
  }
}

async function handle2FASubmit() {
  loading.value = true;
  error.value = '';

  try {
    const action = authStep.value === '2fa_setup' ? 'verify-setup' : 'verify';
    const data = await api('/api/admin/auth/2fa', {
      action,
      tempToken: tempToken.value,
      code: totpCode.value,
    });

    if (data.success) {
      window.location.href = '/admin';
    } else {
      error.value = data.message || 'Cod 2FA incorect.';
      loading.value = false;
    }
  } catch (err: any) {
    error.value = err.message || err.data?.message || 'Cod 2FA incorect sau sesiune expirată. Apasă pe Anulează pentru a reîncerca autentificarea.';
    loading.value = false;
  }
}

function cancel2FA() {
  authStep.value = 'login';
  totpCode.value = '';
  tempToken.value = '';
  error.value = '';
}
</script>

<template>
  <div class="admin-login-wrapper">
    <!-- Ambient background layers -->
    <div class="admin-login-aurora-bg" aria-hidden="true">
      <div class="admin-aurora-orb admin-aurora-orb--1" />
      <div class="admin-aurora-orb admin-aurora-orb--2" />
      <div class="admin-aurora-orb admin-aurora-orb--3" />
      <div class="admin-aurora-grid-overlay" />
    </div>

    <!-- Split-panel login card -->
    <div class="admin-login-split">
      <!-- ── LEFT PANEL: Brand Identity ───────────────────────────────── -->
      <div class="admin-login-left-panel">
        <div class="admin-login-left-glow" aria-hidden="true" />

        <div class="admin-login-brand-stack">
          <!-- Logo -->
          <div class="admin-login-brand-icon">
            <div class="admin-brand-icon-glow" aria-hidden="true" />
            <img
              src="/logo.png"
              alt="Wildfire Logo"
              class="admin-login-logo-img"
              width="48"
              height="48"
            />
          </div>

          <div>
            <h1 class="admin-login-title">WILDFIRE ADMIN</h1>
            <p class="admin-login-subtitle">Mission Control &amp; Fortress Security</p>
          </div>

          <!-- Status badges -->
          <div class="admin-login-status-pills">
            <div class="admin-login-badge">
              <Icon icon="lucide:radio" width="9" height="9" class="admin-live-pulse-dot" />
              <span>SECURE GATEWAY</span>
            </div>
            <div class="admin-login-pill-tag">
              <Icon icon="lucide:cpu" width="9" height="9" />
              <span>v1.8.5</span>
            </div>
          </div>
        </div>

        <!-- Left panel feature list -->
        <ul class="admin-login-features" aria-label="Platform capabilities">
          <li class="admin-login-feature-item">
            <span class="admin-login-feature-icon"><Icon icon="lucide:lock" width="13" height="13" /></span>
            <span>256-bit HMAC &amp; PBKDF2 SHA-512 Auth</span>
          </li>
          <li class="admin-login-feature-item">
            <span class="admin-login-feature-icon"><Icon icon="lucide:shield-check" width="13" height="13" /></span>
            <span>TOTP 2FA &amp; Session Isolation</span>
          </li>
          <li class="admin-login-feature-item">
            <span class="admin-login-feature-icon"><Icon icon="lucide:git-commit" width="13" height="13" /></span>
            <span>Live Audit Ledger &amp; Geo-IP Logging</span>
          </li>
          <li class="admin-login-feature-item">
            <span class="admin-login-feature-icon"><Icon icon="lucide:layers" width="13" height="13" /></span>
            <span>Role-Based Permission Isolation</span>
          </li>
        </ul>

        <!-- Left panel footer -->
        <div class="admin-login-left-footer">
          <span class="admin-login-left-footer-text">wf-docscore &copy; 2026 Wildfire.ro</span>
        </div>
      </div>

      <!-- Vertical divider -->
      <div class="admin-login-divider" aria-hidden="true" />

      <!-- ── RIGHT PANEL: Secure Form ─────────────────────────────────── -->
      <div class="admin-login-right-panel">
        <!-- Top shimmer accent -->
        <div class="admin-login-shimmer-beam" aria-hidden="true" />

        <div class="admin-login-form-header">
          <h2 class="admin-login-form-title">
            <template v-if="authStep === 'login'">Administrator Sign In</template>
            <template v-else-if="authStep === '2fa_setup'">Securizează Contul (2FA)</template>
            <template v-else-if="authStep === '2fa_verify'">Verificare 2FA</template>
          </h2>
          <p class="admin-login-form-desc">
            <template v-if="authStep === 'login'">Acces restricționat. Numai personal autorizat.</template>
            <template v-else-if="authStep === '2fa_setup'">Aplicația necesită Autentificare în Doi Pași (TOTP).</template>
            <template v-else-if="authStep === '2fa_verify'">Introdu codul generat de aplicația ta de autentificare.</template>
          </p>
        </div>

        <!-- Error alert -->
        <div v-if="error" class="admin-alert-box admin-alert-box--danger" role="alert">
          <Icon icon="lucide:shield-alert" width="15" height="15" class="admin-alert-icon" />
          <span>{{ error }}</span>
        </div>

        <!-- Login Form -->
        <form v-if="authStep === 'login'" class="admin-login-form" @submit.prevent="handleSubmit">
          <div class="admin-form-group">
            <label class="admin-form-label" for="admin-username">
              Administrator ID
            </label>
            <div class="admin-input-wrapper">
              <Icon icon="lucide:user" width="15" height="15" class="admin-input-icon" />
              <input
                id="admin-username"
                v-model="username"
                type="text"
                required
                placeholder="Introdu ID-ul de admin"
                class="admin-input-field"
                autocomplete="username"
                spellcheck="false"
                autofocus
              />
            </div>
          </div>

          <div class="admin-form-group">
            <label class="admin-form-label" for="admin-password">
              Master Password
            </label>
            <div class="admin-input-wrapper">
              <Icon icon="lucide:lock-keyhole" width="15" height="15" class="admin-input-icon" />
              <input
                id="admin-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="Introdu parola master"
                class="admin-input-field admin-input-field--password"
                autocomplete="current-password"
              />
              <button
                type="button"
                class="admin-password-toggle-btn"
                :title="showPassword ? 'Ascunde parola' : 'Afișează parola'"
                :aria-label="showPassword ? 'Ascunde parola' : 'Afișează parola'"
                @click="showPassword = !showPassword"
              >
                <Icon :icon="showPassword ? 'lucide:eye-off' : 'lucide:eye'" width="14" height="14" />
              </button>
            </div>
          </div>

          <div class="admin-remember-row">
            <label class="admin-remember-label" for="admin-remember-me">
              <input
                id="admin-remember-me"
                v-model="rememberUser"
                type="checkbox"
                class="admin-remember-checkbox"
              />
              <span>Reține Administrator ID pe acest dispozitiv</span>
            </label>
          </div>

          <button
            type="submit"
            :disabled="loading || (lockoutTimer !== null && lockoutTimer > 0)"
            class="admin-login-submit-btn"
            :class="{ 'admin-login-submit-btn--loading': loading }"
          >
            <template v-if="loading">
              <Icon icon="lucide:loader-2" width="16" height="16" class="admin-spin" />
              <span>Se autentifică...</span>
            </template>
            <template v-else-if="lockoutTimer !== null && lockoutTimer > 0">
              <Icon icon="lucide:lock" width="15" height="15" />
              <span>Reîncearcă în {{ lockoutTimer }}s</span>
            </template>
            <template v-else>
              <span>Sign In to Mission Control</span>
              <Icon icon="lucide:arrow-right" width="15" height="15" />
            </template>
          </button>
        </form>

        <!-- 2FA Setup / Verify Form -->
        <form
          v-if="authStep === '2fa_setup' || authStep === '2fa_verify'"
          class="admin-login-form"
          @submit.prevent="handle2FASubmit"
        >
          <div v-if="authStep === '2fa_setup'" class="admin-2fa-setup-box" style="text-align: center; margin-bottom: 1.5rem;">
            <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 1rem;">
              Scanează acest cod QR folosind <strong>Authy</strong> sau <strong>Google Authenticator</strong> pentru a adăuga contul.
            </p>
            <div style="display: inline-block; background: white; padding: 10px; border-radius: 12px; border: 1px solid var(--border-color); margin-bottom: 1rem; position: relative;">
              <img
                v-if="qrCodeUrl"
                :src="qrCodeUrl"
                alt="2FA QR Code"
                width="180"
                height="180"
                style="display: block;"
              />
              <!-- WF Logo Watermark in the center -->
              <div
                style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 4px; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.15);"
              >
                <img src="/logo.png" alt="WildFire Logo" width="32" height="32" />
              </div>
            </div>
            <p style="color: var(--text-tertiary); font-size: 0.75rem; user-select: all;">
              Secret: <code>{{ setupSecret }}</code>
            </p>
          </div>

          <div class="admin-form-group">
            <label class="admin-form-label" for="admin-totp">
              Cod de Securitate din Aplicație
            </label>
            <div class="admin-input-wrapper">
              <Icon icon="lucide:scan-line" width="15" height="15" class="admin-input-icon" />
              <input
                id="admin-totp"
                v-model="totpCode"
                type="text"
                required
                maxlength="6"
                class="admin-input-field admin-input-field--totp"
                autocomplete="one-time-code"
                autofocus
                style="letter-spacing: 8px; font-weight: 600; font-size: 1.2rem; text-align: center;"
                @input="totpCode = totpCode.replace(/\D/g, '')"
              />
            </div>
            <p class="admin-form-help">
              Introdu cele 6 cifre afișate în aplicație pentru a confirma.
            </p>
          </div>

          <button
            type="submit"
            :disabled="loading || totpCode.length !== 6"
            class="admin-login-submit-btn"
            :class="{ 'admin-login-submit-btn--loading': loading }"
          >
            <template v-if="loading">
              <Icon icon="lucide:loader-2" width="16" height="16" class="admin-spin" />
              <span>Se verifică...</span>
            </template>
            <template v-else>
              <span>Verifică &amp; Activează</span>
              <Icon icon="lucide:shield-check" width="15" height="15" />
            </template>
          </button>

          <button
            type="button"
            class="admin-btn admin-btn--ghost"
            style="width: 100%; margin-top: 0.5rem;"
            @click="cancel2FA"
          >
            Anulează
          </button>
        </form>

        <!-- Footer -->
        <div class="admin-login-footer">
          <div class="admin-security-seal">
            <Icon icon="lucide:shield-check" width="12" height="12" class="admin-seal-icon" />
            <span>End-to-End Encrypted &amp; HMAC Protected</span>
          </div>
          <a href="/docs" class="admin-back-btn">
            <Icon icon="lucide:arrow-left" width="12" height="12" />
            <span>Înapoi la Documentația Publică</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
