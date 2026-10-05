<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps<{
  user?: {
    username?: string;
    displayName?: string;
    totpEnabled?: boolean;
    role?: string;
    isRoot?: boolean;
  } | null;
}>();

const emit = defineEmits<{
  (e: 'update:totp', enabled: boolean): void;
}>();

// State
const isOpen = ref(false);
const isMinimized = ref(false);
const loading = ref(false);
const verifying = ref(false);
const errorMsg = ref('');
const copied = ref(false);
const isSuccess = ref(false);

const qrCodeData = ref('');
const totpSecret = ref('');
const otpDigits = ref<string[]>(['', '', '', '', '', '']);
const digitInputs = ref<HTMLInputElement[]>([]);

// Computed
const isTotpEnabled = computed(() => Boolean(props.user?.totpEnabled));
const isFullyFilled = computed(() => otpDigits.value.every((d) => d.length === 1));
const formattedCode = computed(() => otpDigits.value.join(''));

// Manual formatted secret for easy reading (groups of 4)
const formattedSecret = computed(() => {
  if (!totpSecret.value) return '';
  return totpSecret.value.match(/.{1,4}/g)?.join(' ') || totpSecret.value;
});

async function init2FASetup() {
  if (isTotpEnabled.value) return;
  loading.value = true;
  errorMsg.value = '';
  try {
    const res = await fetch('/api/admin/profile/2fa', { method: 'POST' });
    const data = await res.json();
    if (res.ok && data.success) {
      qrCodeData.value = data.qrCode || '';
      totpSecret.value = data.secret || '';
      // Clear inputs
      otpDigits.value = ['', '', '', '', '', ''];
    } else {
      errorMsg.value = data.message || 'Nu s-a putut inițializa cheia 2FA.';
    }
  } catch {
    errorMsg.value = 'Eroare de conexiune la server pentru generarea codului 2FA.';
  } finally {
    loading.value = false;
  }
}

function openModal() {
  isOpen.value = true;
  isMinimized.value = false;
  if (!qrCodeData.value) {
    void init2FASetup();
  }
  nextTick(() => {
    digitInputs.value[0]?.focus();
  });
}

function closeModal() {
  isOpen.value = false;
  isMinimized.value = true;
  // Mark in sessionStorage that modal was minimized in current session
  try {
    sessionStorage.setItem('wf_2fa_prompt_minimized', 'true');
  } catch {}
}

async function copySecret() {
  if (!totpSecret.value) return;
  try {
    await navigator.clipboard.writeText(totpSecret.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2500);
  } catch {}
}

// OTP digit input handlers
function onDigitInput(index: number, event: Event) {
  const input = event.target as HTMLInputElement;
  const value = input.value.replace(/\D/g, '');

  if (value.length > 1) {
    // Handle multi-character paste or fast typing into single cell
    handlePasteValue(value, index);
    return;
  }

  otpDigits.value[index] = value;
  errorMsg.value = '';

  if (value && index < 5) {
    digitInputs.value[index + 1]?.focus();
  }

  if (isFullyFilled.value) {
    void verifyCode();
  }
}

function onDigitKeyDown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    digitInputs.value[index - 1]?.focus();
  }
}

function onPaste(event: ClipboardEvent) {
  event.preventDefault();
  const pasted = event.clipboardData?.getData('text') || '';
  handlePasteValue(pasted, 0);
}

function handlePasteValue(text: string, startIndex: number) {
  const digits = text.replace(/\D/g, '').slice(0, 6).split('');
  if (digits.length === 0) return;

  for (let i = 0; i < 6; i++) {
    const targetIdx = startIndex + i;
    if (targetIdx < 6 && digits[i]) {
      otpDigits.value[targetIdx] = digits[i];
    }
  }

  // Focus next empty or last
  const nextEmpty = otpDigits.value.findIndex((d) => !d);
  if (nextEmpty !== -1) {
    digitInputs.value[nextEmpty]?.focus();
  } else {
    digitInputs.value[5]?.focus();
    void verifyCode();
  }
}

async function verifyCode() {
  const code = formattedCode.value;
  if (code.length !== 6) {
    errorMsg.value = 'Introduceți codul complet de 6 cifre.';
    return;
  }

  verifying.value = true;
  errorMsg.value = '';

  try {
    const res = await fetch('/api/admin/profile/2fa', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      isSuccess.value = true;
      emit('update:totp', true);

      // Update cached user in localStorage
      try {
        const stored = localStorage.getItem('wf_admin_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.totpEnabled = true;
          localStorage.setItem('wf_admin_user', JSON.stringify(parsed));
        }
      } catch {}

      // Close modal after celebration
      setTimeout(() => {
        isOpen.value = false;
        isMinimized.value = false;
      }, 2400);
    } else {
      errorMsg.value = data.message || 'Codul 2FA introdus este incorect sau a expirat.';
      // Clear inputs for re-try
      otpDigits.value = ['', '', '', '', '', ''];
      nextTick(() => {
        digitInputs.value[0]?.focus();
      });
    }
  } catch {
    errorMsg.value = 'Eroare de conexiune la verificarea codului.';
  } finally {
    verifying.value = false;
  }
}

onMounted(() => {
  if (!isTotpEnabled.value) {
    const alreadyMinimized = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('wf_2fa_prompt_minimized') === 'true';
    if (!alreadyMinimized) {
      // Auto open modal on login/load if 2FA is not enabled
      openModal();
    } else {
      isMinimized.value = true;
    }
  }
});
</script>

<template>
  <div v-if="!isTotpEnabled" class="admin-2fa-enforcer-scope">
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- 1. GLOSSY PERSISTENT ENFORCEMENT BANNER                             -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <aside class="glossy-security-banner" role="alert">
      <div class="banner-glass-glow" />
      <div class="banner-inner">
        <div class="banner-left">
          <div class="shield-pulse-wrapper">
            <Icon icon="lucide:shield-alert" class="shield-pulse-icon" width="22" height="22" />
            <span class="shield-pulse-ring" />
          </div>
          <div class="banner-text">
            <div class="banner-title-row">
              <span class="banner-title">SECURITATE CRITICĂ: 2FA OBLIGATORIU</span>
              <span class="banner-tag">PROTOCOL ECHIPĂ CS2</span>
            </div>
            <p class="banner-desc">
              Contul tău administrativ <strong>{{ props.user?.displayName || props.user?.username }}</strong> nu are activată autentificarea în doi pași. Conform standardelor de securitate Wildfire, toți membrii echipei sunt obligați să folosească 2FA (TOTP).
            </p>
          </div>
        </div>

        <div class="banner-right">
          <button type="button" class="glossy-cta-btn" @click="openModal">
            <Icon icon="lucide:lock-keyhole" width="16" height="16" />
            <span>Activează 2FA Acum</span>
            <Icon icon="lucide:arrow-right" width="14" height="14" class="btn-arrow" />
          </button>
        </div>
      </div>
    </aside>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- 2. ULTRA-GLOSSY MODERN 2FA SETUP MODAL                              -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="fade-modal">
        <div v-if="isOpen" class="glossy-modal-backdrop" @click.self="closeModal">
          <div class="glossy-modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-2fa-title">
            <!-- Glass Sheen Highlights -->
            <div class="sheen-light-bar" />
            <div class="radial-flare" />

            <!-- Close / Minimize Button -->
            <button
              type="button"
              class="glossy-close-btn"
              title="Minimizează dialogul"
              aria-label="Închide dialogul"
              @click="closeModal"
            >
              <Icon icon="lucide:x" width="18" height="18" />
            </button>

            <!-- Success State View -->
            <div v-if="isSuccess" class="success-screen">
              <div class="success-shield-box">
                <Icon icon="lucide:shield-check" class="success-shield-icon" width="64" height="64" />
                <div class="success-ring" />
              </div>
              <h2 class="success-title">Cont Securizat cu Succes!</h2>
              <p class="success-desc">
                Autentificarea 2FA (TOTP) este acum activă pe contul tău. La următoarea autentificare în Admin Center, ți se va solicita codul generat de aplicația ta de securitate.
              </p>
              <div class="success-badge-row">
                <span class="active-badge">
                  <Icon icon="lucide:check-circle-2" width="15" height="15" />
                  Status: 2FA ACTIV & PROTEJAT
                </span>
              </div>
            </div>

            <!-- Main Setup Content -->
            <div v-else class="setup-content">
              <!-- Header Section -->
              <div class="modal-header">
                <div class="header-icon-box">
                  <Icon icon="lucide:shield-alert" class="header-shield" width="28" height="28" />
                  <span class="halo-glow" />
                </div>
                <div class="header-titles">
                  <div class="protocol-pill">
                    <Icon icon="lucide:flame" width="12" height="12" class="flame-icon" />
                    <span>WILDFIRE SECURITY ENFORCEMENT</span>
                  </div>
                  <h2 id="modal-2fa-title" class="modal-title">Activare Obligatorie 2FA</h2>
                  <p class="modal-subtitle">
                    Protejează-ți contul administrativ și accesul la infrastructura comunității Wildfire.
                  </p>
                </div>
              </div>

              <!-- Loader while generating secret & QR -->
              <div v-if="loading" class="modal-loading-box">
                <Icon icon="lucide:refresh-cw" class="loading-spin text-amber-500" width="36" height="36" />
                <p>Generare pereche de securitate TOTP & QR Code...</p>
              </div>

              <!-- Main Steps View -->
              <div v-else class="modal-body-grid">
                <!-- Left Column: Step 1 (QR Code & Apps) -->
                <div class="step-card">
                  <div class="step-badge">PASUL 1</div>
                  <h3 class="step-title">Scanează Codul QR</h3>
                  <p class="step-desc">
                    Deschide aplicația ta de autentificare (Google Authenticator, Apple Passwords, Microsoft Authenticator sau Bitwarden) și scanează codul de mai jos:
                  </p>

                  <div class="qr-container">
                    <div class="qr-frame">
                      <img
                        v-if="qrCodeData"
                        :src="qrCodeData"
                        alt="Wildfire 2FA QR Code"
                        class="qr-image"
                        width="180"
                        height="180"
                      />
                      <div v-else class="qr-placeholder">
                        <Icon icon="lucide:qr-code" width="48" height="48" class="text-neutral-500" />
                      </div>
                    </div>
                  </div>

                  <!-- Manual Secret Fallback -->
                  <div class="manual-key-box">
                    <span class="manual-label">Sau introdu cheia manual:</span>
                    <div class="key-display-row">
                      <code class="secret-code">{{ formattedSecret || '•••• •••• •••• ••••' }}</code>
                      <button
                        type="button"
                        class="copy-btn"
                        :class="{ 'copy-btn--copied': copied }"
                        @click="copySecret"
                      >
                        <Icon :icon="copied ? 'lucide:check' : 'lucide:copy'" width="14" height="14" />
                        <span>{{ copied ? 'Copiat!' : 'Copiază' }}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Right Column: Step 2 (Verification Input) -->
                <div class="step-card step-card--accent">
                  <div class="step-badge">PASUL 2</div>
                  <h3 class="step-title">Confirmă Codul de 6 Cifre</h3>
                  <p class="step-desc">
                    Introdu codul generat pe ecranul aplicației pentru a asocia definitiv dispozitivul tău:
                  </p>

                  <!-- 6 Distinct Glossy Digits Boxes -->
                  <div class="otp-inputs-row" @paste="onPaste">
                    <input
                      v-for="(digit, i) in otpDigits"
                      :key="i"
                      :ref="(el) => (digitInputs[i] = el as HTMLInputElement)"
                      v-model="otpDigits[i]"
                      type="text"
                      inputmode="numeric"
                      pattern="[0-9]*"
                      maxlength="1"
                      class="otp-digit-box"
                      :class="{
                        'otp-digit-box--filled': otpDigits[i],
                        'otp-digit-box--error': errorMsg,
                      }"
                      :disabled="verifying"
                      @input="onDigitInput(i, $event)"
                      @keydown="onDigitKeyDown(i, $event)"
                    />
                  </div>

                  <!-- Error message with glossy badge -->
                  <div v-if="errorMsg" class="error-glass-badge">
                    <Icon icon="lucide:alert-circle" width="16" height="16" />
                    <span>{{ errorMsg }}</span>
                  </div>

                  <!-- App Recommendation Pills -->
                  <div class="supported-apps">
                    <span class="apps-label">Aplicații Compatibile:</span>
                    <div class="apps-badges">
                      <span class="app-pill">Google Authenticator</span>
                      <span class="app-pill">Apple Keychain</span>
                      <span class="app-pill">Microsoft Auth</span>
                      <span class="app-pill">Bitwarden</span>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="modal-actions">
                    <button
                      type="button"
                      class="submit-verify-btn"
                      :disabled="!isFullyFilled || verifying"
                      @click="verifyCode"
                    >
                      <Icon
                        :icon="verifying ? 'lucide:refresh-cw' : 'lucide:shield-check'"
                        width="18"
                        height="18"
                        :class="{ 'animate-spin': verifying }"
                      />
                      <span>{{ verifying ? 'Se validează...' : 'Activează & Securizează Contul' }}</span>
                    </button>

                    <button type="button" class="dismiss-link" @click="closeModal">
                      Amintește-mi în această sesiune (Minimizează)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* ═════════════════════════════════════════════════════════════════════ */
/* 1. PERSISTENT GLOSSY SECURITY BANNER                                   */
/* ═════════════════════════════════════════════════════════════════════ */
.admin-2fa-enforcer-scope {
  width: 100%;
}

.glossy-security-banner {
  position: relative;
  margin: 0 0 20px 0;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(30, 20, 15, 0.85) 0%, rgba(18, 20, 28, 0.95) 100%);
  border: 1px solid rgba(255, 107, 0, 0.35);
  box-shadow: 0 8px 32px -4px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 0 24px rgba(255, 107, 0, 0.15);
  backdrop-filter: blur(16px);
  overflow: hidden;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.banner-glass-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ff6b00 30%, #ffaa00 70%, transparent);
}

.banner-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 16px 22px;
}

@media (max-width: 900px) {
  .banner-inner {
    flex-direction: column;
    align-items: flex-start;
  }
}

.banner-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.shield-pulse-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: radial-gradient(circle, rgba(255, 107, 0, 0.25) 0%, rgba(255, 107, 0, 0.05) 100%);
  border: 1px solid rgba(255, 107, 0, 0.4);
  color: #ff6b00;
  flex-shrink: 0;
}

.shield-pulse-ring {
  position: absolute;
  inset: -3px;
  border-radius: 14px;
  border: 1.5px solid rgba(255, 107, 0, 0.4);
  animation: pulse-ring 2.5s cubic-bezier(0.24, 0, 0.38, 1) infinite;
}

@keyframes pulse-ring {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 0.2; }
  100% { transform: scale(0.95); opacity: 0.8; }
}

.banner-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.banner-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.banner-title {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #ff8800;
  text-transform: uppercase;
}

.banner-tag {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 2px 7px;
  border-radius: 6px;
  background: rgba(255, 107, 0, 0.15);
  border: 1px solid rgba(255, 107, 0, 0.3);
  color: #ffb066;
}

.banner-desc {
  font-size: 13px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.78);
  margin: 0;
}

.banner-desc strong {
  color: #ffffff;
}

.banner-right {
  flex-shrink: 0;
}

.glossy-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 10px;
  background: linear-gradient(135deg, #ff6b00 0%, #e05300 100%);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(255, 107, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;
  white-space: nowrap;
}

.glossy-cta-btn:hover {
  transform: translateY(-1px);
  background: linear-gradient(135deg, #ff7e1a 0%, #f05a00 100%);
  box-shadow: 0 6px 24px rgba(255, 107, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.btn-arrow {
  transition: transform 0.2s ease;
}

.glossy-cta-btn:hover .btn-arrow {
  transform: translateX(3px);
}

/* ═════════════════════════════════════════════════════════════════════ */
/* 2. ULTRA-GLOSSY MODAL DIALOG                                         */
/* ═════════════════════════════════════════════════════════════════════ */
.glossy-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(4, 6, 12, 0.82);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.glossy-modal-card {
  position: relative;
  width: 100%;
  max-width: 820px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 20px;
  background: radial-gradient(circle at 50% 0%, rgba(255, 107, 0, 0.14) 0%, rgba(16, 20, 28, 0.95) 50%, rgba(10, 12, 18, 0.98) 100%);
  border: 1px solid rgba(255, 107, 0, 0.35);
  box-shadow: 0 24px 70px -10px rgba(0, 0, 0, 0.9), 0 0 50px rgba(255, 107, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(30px);
  padding: 32px;
  box-sizing: border-box;
}

.sheen-light-bar {
  position: absolute;
  top: 0;
  left: 10%;
  right: 10%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 136, 0, 0.8), rgba(255, 255, 255, 0.8), rgba(255, 136, 0, 0.8), transparent);
}

.radial-flare {
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  width: 320px;
  height: 160px;
  background: radial-gradient(ellipse at center, rgba(255, 107, 0, 0.25) 0%, transparent 70%);
  pointer-events: none;
}

.glossy-close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 2;
}

.glossy-close-btn:hover {
  background: rgba(255, 107, 0, 0.2);
  border-color: rgba(255, 107, 0, 0.4);
  color: #ffffff;
}

/* Header */
.modal-header {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 28px;
}

.header-icon-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(255, 107, 0, 0.3) 0%, rgba(255, 60, 0, 0.1) 100%);
  border: 1px solid rgba(255, 107, 0, 0.5);
  color: #ff8800;
  box-shadow: 0 0 24px rgba(255, 107, 0, 0.35);
  flex-shrink: 0;
}

.header-titles {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.protocol-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #ff8800;
  text-transform: uppercase;
}

.flame-icon {
  color: #ff6b00;
}

.modal-title {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #ffffff;
  margin: 0;
}

.modal-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

/* Loading */
.modal-loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.loading-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Grid Layout */
.modal-body-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 768px) {
  .modal-body-grid {
    grid-template-columns: 1fr;
  }
}

.step-card {
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.step-card--accent {
  background: radial-gradient(circle at 50% 0%, rgba(255, 107, 0, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
  border-color: rgba(255, 107, 0, 0.25);
}

.step-badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: #ff8800;
  margin-bottom: 8px;
}

.step-title {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.step-desc {
  font-size: 13px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.65);
  margin: 0 0 16px 0;
}

/* QR Container */
.qr-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.qr-frame {
  padding: 12px;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 107, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-image {
  display: block;
  border-radius: 6px;
}

.manual-key-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: rgba(0, 0, 0, 0.3);
  padding: 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.manual-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
}

.key-display-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.secret-code {
  font-family: monospace;
  font-size: 12px;
  color: #ffaa55;
  word-break: break-all;
}

.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.copy-btn:hover {
  background: rgba(255, 107, 0, 0.25);
  border-color: rgba(255, 107, 0, 0.4);
}

.copy-btn--copied {
  background: rgba(16, 185, 129, 0.2);
  border-color: rgba(16, 185, 129, 0.5);
  color: #10b981;
}

/* OTP Digits Row */
.otp-inputs-row {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin: 16px 0;
}

.otp-digit-box {
  width: 44px;
  height: 52px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.4);
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  font-family: monospace;
  font-size: 24px;
  font-weight: 800;
  text-align: center;
  outline: none;
  transition: all 0.2s ease;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.4);
}

.otp-digit-box:focus {
  border-color: #ff6b00;
  box-shadow: 0 0 16px rgba(255, 107, 0, 0.4), inset 0 1px 2px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.otp-digit-box--filled {
  border-color: rgba(255, 136, 0, 0.6);
  background: rgba(255, 107, 0, 0.08);
}

.otp-digit-box--error {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.08);
}

.error-glass-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.35);
  color: #fca5a5;
  font-size: 12px;
  margin-bottom: 14px;
}

.supported-apps {
  margin: 12px 0 20px 0;
}

.apps-label {
  display: block;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 6px;
}

.apps-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.app-pill {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.65);
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: auto;
}

.submit-verify-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 13px 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ff6b00 0%, #d94800 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(255, 107, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;
}

.submit-verify-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #ff7e1a 0%, #ee5000 100%);
  box-shadow: 0 6px 28px rgba(255, 107, 0, 0.6);
  transform: translateY(-1px);
}

.submit-verify-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.dismiss-link {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.45);
  font-size: 12px;
  cursor: pointer;
  text-align: center;
  padding: 4px;
  transition: color 0.2s;
}

.dismiss-link:hover {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: underline;
}

/* Success View */
.success-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.success-shield-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90px;
  height: 90px;
  border-radius: 26px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(16, 185, 129, 0.05) 100%);
  border: 1.5px solid rgba(16, 185, 129, 0.5);
  color: #10b981;
  box-shadow: 0 0 40px rgba(16, 185, 129, 0.35);
  margin-bottom: 24px;
}

.success-shield-icon {
  color: #10b981;
}

.success-ring {
  position: absolute;
  inset: -6px;
  border-radius: 30px;
  border: 2px solid rgba(16, 185, 129, 0.4);
  animation: pulse-ring 2s ease infinite;
}

.success-title {
  font-size: 24px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 10px 0;
}

.success-desc {
  font-size: 14px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.75);
  max-width: 480px;
  margin: 0 0 20px 0;
}

.active-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #34d399;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

/* Modal Transition */
.fade-modal-enter-active,
.fade-modal-leave-active {
  transition: opacity 0.25s ease;
}

.fade-modal-enter-from,
.fade-modal-leave-to {
  opacity: 0;
}

.fade-modal-enter-active .glossy-modal-card {
  animation: zoom-in 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes zoom-in {
  from {
    transform: scale(0.92) translateY(12px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}
</style>
