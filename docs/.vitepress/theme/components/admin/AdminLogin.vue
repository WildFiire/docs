<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue';
import { useRouter } from 'vitepress';
import { Icon } from '@iconify/vue';
import { api } from '../../composables/useApi';

const router = useRouter();

// ── Two-Phase Authentication Flow ──────────────────────────────────────────
// Phase 1: 'enter_user' (user inputs Administrator ID; left panel shows cyber nexus)
// Phase 2: 'enter_password' (left panel morphs into matched Administrator profile; password input + login button appear)
const loginPhase = ref<'enter_user' | 'enter_password'>('enter_user');

interface KnownAdmin {
  username: string;
  displayName: string;
  customTitle: string;
  avatarUrl: string;
  avatarColor: string;
  role: string;
  badges: string[];
  responsibilities?: string[];
  totpEnabled?: boolean;
  isRoot?: boolean;
  docsModifiedCount?: number;
}

const defaultPrivileges = [
  'Acces Terminal Mission Control & RBAC Activ',
  'Management & Publicare Documentație CS2',
  'Canal Criptat TLS 1.3 · Politică Zero-Trust',
  'Audit Log & Telemetrie Înregistrate în Timp Real',
];

const KNOWN_ADMINS: Record<string, KnownAdmin> = {
  iannc69: {
    username: 'iannC69',
    displayName: 'iannC',
    customTitle: 'Community Manager',
    avatarUrl: 'https://github.com/iannC69.png',
    avatarColor: '#ff6b00',
    role: 'Root Super Admin',
    badges: ['COMMUNITY MANAGER', 'DOCS LEAD'],
    responsibilities: [
      'Coordonare Generală & Community Management',
      'Management & Publicare Documentație Oficială',
      'Control Bază de Date, RBAC & Panic Lockdown',
      'Supervizare Echipă Staff & Content Editors',
    ],
    totpEnabled: false,
    isRoot: true,
    docsModifiedCount: 62,
  },
  iannc: {
    username: 'iannC69',
    displayName: 'iannC',
    customTitle: 'Community Manager',
    avatarUrl: 'https://github.com/iannC69.png',
    avatarColor: '#ff6b00',
    role: 'Root Super Admin',
    badges: ['COMMUNITY MANAGER', 'DOCS LEAD'],
    responsibilities: [
      'Coordonare Generală & Community Management',
      'Management & Publicare Documentație Oficială',
      'Control Bază de Date, RBAC & Panic Lockdown',
      'Supervizare Echipă Staff & Content Editors',
    ],
    totpEnabled: false,
    isRoot: true,
    docsModifiedCount: 62,
  },
};

const dynamicAdminProfiles = ref<Record<string, KnownAdmin>>({});
const matchedAdmin = ref<KnownAdmin | null>(null);
const verifyingUser = ref(false);

function resolveAdminProfile(userStr: string): KnownAdmin | null {
  const clean = userStr.trim().toLowerCase();
  return dynamicAdminProfiles.value[clean] || KNOWN_ADMINS[clean] || null;
}

export interface QuickStaffMember {
  username: string;
  name: string;
  title: string;
  avatar: string;
  color: string;
}

const quickStaffMembers = ref<QuickStaffMember[]>([
  {
    username: 'iannC69',
    name: 'iannC',
    title: 'Community Manager',
    avatar: 'https://github.com/iannC69.png',
    color: '#ff6b00',
  },
]);

async function loadQuickStaff() {
  try {
    const res = await fetch('/api/team/contributors');
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.contributors) && data.contributors.length > 0) {
        quickStaffMembers.value = data.contributors.map((m: any) => ({
          username: m.username,
          name: m.displayName || m.username,
          title: m.customTitle || m.role || 'Staff',
          avatar: m.avatarUrl || `https://github.com/${m.githubUsername || m.username}.png`,
          color: m.avatarColor || '#ff6b00',
        }));

        const newProfiles: Record<string, KnownAdmin> = {};
        for (const m of data.contributors) {
          const profile: KnownAdmin = {
            username: m.username,
            displayName: m.displayName || m.username,
            customTitle: m.customTitle || m.role || 'Administrator',
            avatarUrl: m.avatarUrl || `https://github.com/${m.githubUsername || m.username}.png`,
            avatarColor: m.avatarColor || '#ff6b00',
            role: m.isRoot ? 'Root Super Admin' : (m.customTitle || 'Administrator'),
            badges: m.badges || [],
            responsibilities: m.responsibilities || [],
            totpEnabled: Boolean(m.totpEnabled),
            isRoot: Boolean(m.isRoot),
            docsModifiedCount: m.docsModifiedCount || 0,
          };
          newProfiles[m.username.toLowerCase()] = profile;
          if (m.displayName) {
            newProfiles[m.displayName.toLowerCase()] = profile;
          }
        }
        dynamicAdminProfiles.value = newProfiles;
      }
    }
  } catch (err) {
    console.warn('[AdminLogin] Nu s-au putut prelua membrii staff:', err);
  }
}

const timeGreeting = computed(() => {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'Bună dimineața! Echipă activă.';
  if (h >= 12 && h < 18) return 'Salutare! Zi productivă în echipă.';
  if (h >= 18 && h < 23) return 'Bună seara! Tura de seară este online.';
  return 'Noapte productivă în echipă!';
});

const greetingHeadline = computed(() => {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'Bună dimineața!';
  if (h >= 12 && h < 18) return 'Salutare!';
  return 'Bună seara!';
});

async function selectQuickStaff(userStr: string) {
  if (verifyingUser.value) return;
  username.value = userStr;
  userManuallyTypedUid.value = true;
  await proceedToPassword();
}

const username = ref('');
const password = ref('');
const showPassword = ref(false);

const isUidActive = ref(true);
const isPwdActive = ref(true);
const userManuallyTypedUid = ref(true);
const userManuallyTypedPwd = ref(true);
const rememberMe = ref(true);

const authStep = ref<'login' | '2fa_setup' | '2fa_verify'>('login');
const totpCode = ref('');
const tempToken = ref('');
const qrCodeUrl = ref('');
const setupSecret = ref('');
const copiedSecret = ref(false);

// Individual 6-digit TOTP cells
const digits = ref(['', '', '', '', '', '']);
const digitInputs = ref<HTMLInputElement[]>([]);

const loading = ref(false);
const error = ref('');
const lockoutTimer = ref<number | null>(null);

let timerInterval: ReturnType<typeof setInterval> | null = null;

onMounted(async () => {
  // 1. If user already has an active session, redirect straight to /admin
  try {
    const me = await api('/api/admin/auth/me');
    if (me?.authenticated && me?.user) {
      window.location.href = '/admin';
      return;
    }
  } catch {}

  // 2. Load live staff members automatically
  await loadQuickStaff();

  // 3. Load remember preference and saved username
  try {
    const pref = localStorage.getItem('wf_admin_remember_preference');
    if (pref === 'false') {
      rememberMe.value = false;
    }
    const savedUser = localStorage.getItem('wf_admin_remember_user');
    if (savedUser && rememberMe.value) {
      username.value = savedUser;
      const matched = resolveAdminProfile(savedUser);
      if (matched) {
        matchedAdmin.value = matched;
      }
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

function handleUidKeydown() {
  userManuallyTypedUid.value = true;
  if (error.value) error.value = '';
}

function handlePwdKeydown() {
  userManuallyTypedPwd.value = true;
  if (error.value) error.value = '';
}

async function proceedToPassword() {
  if (verifyingUser.value) return;
  const clean = username.value.trim();
  if (!clean) {
    error.value = 'Introduceți utilizatorul pentru a continua.';
    return;
  }

  error.value = '';
  verifyingUser.value = true;

  try {
    const [res] = await Promise.all([
      api('/api/admin/auth/check-user', { username: clean }),
      new Promise((resolve) => setTimeout(resolve, 650)),
    ]);
    if (res && res.exists && res.user) {
      matchedAdmin.value = {
        username: res.user.username,
        displayName: res.user.displayName,
        customTitle: res.user.customTitle,
        avatarUrl: res.user.avatarUrl,
        avatarColor: res.user.avatarColor,
        role: res.user.role,
        badges: res.user.badges || [],
        responsibilities: res.user.responsibilities || [],
        totpEnabled: Boolean(res.user.totpEnabled),
        isRoot: Boolean(res.user.isRoot),
        docsModifiedCount: res.user.docsModifiedCount || 0,
      };
      loginPhase.value = 'enter_password';
      password.value = '';
      isPwdActive.value = true;
      nextTick(() => {
        const pwdInput = document.getElementById('wf-adm-pwd');
        pwdInput?.focus();
      });
      return;
    } else {
      error.value = 'User invalid! Acest cont nu a fost găsit în baza de date.';
      loginPhase.value = 'enter_user';
      matchedAdmin.value = null;
      return;
    }
  } catch (err: any) {
    if (err.status === 404 || err.data?.exists === false) {
      error.value = 'User invalid! Acest cont nu a fost găsit în baza de date.';
      loginPhase.value = 'enter_user';
      matchedAdmin.value = null;
      return;
    }
    if (err.status === 403 || err.data?.error?.includes('suspendat')) {
      error.value = err.data?.error || 'Acest cont administrativ este suspendat.';
      loginPhase.value = 'enter_user';
      matchedAdmin.value = null;
      return;
    }

    // Fallback if network/offline issue: strictly check preconfigured admins
    const fallback = resolveAdminProfile(clean);
    if (fallback) {
      matchedAdmin.value = fallback;
      loginPhase.value = 'enter_password';
      password.value = '';
      isPwdActive.value = true;
      nextTick(() => {
        const pwdInput = document.getElementById('wf-adm-pwd');
        pwdInput?.focus();
      });
      return;
    }

    error.value = 'User invalid! Acest cont nu a fost găsit în baza de date.';
    loginPhase.value = 'enter_user';
    matchedAdmin.value = null;
  } finally {
    verifyingUser.value = false;
  }
}

function backToUserStep() {
  loginPhase.value = 'enter_user';
  password.value = '';
  error.value = '';
  nextTick(() => {
    const uidInput = document.getElementById('wf-adm-uid');
    uidInput?.focus();
  });
}

async function handleSubmit() {
  if (loading.value) return;

  const cleanUser = username.value.trim();
  const cleanPass = password.value;

  if (!cleanUser || !cleanPass) {
    error.value = 'Introduceți parola pentru a continua.';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    if (rememberMe.value) {
      try {
        localStorage.setItem('wf_admin_remember_user', cleanUser);
        localStorage.setItem('wf_admin_remember_preference', 'true');
      } catch {}
    } else {
      try {
        localStorage.removeItem('wf_admin_remember_user');
        localStorage.setItem('wf_admin_remember_preference', 'false');
      } catch {}
    }

    const [data] = await Promise.all([
      api('/api/admin/auth/login', {
        username: cleanUser,
        password: cleanPass,
        rememberMe: rememberMe.value,
      }),
      new Promise((resolve) => setTimeout(resolve, 650)),
    ]);

    if (data.require2FASetup) {
      tempToken.value = data.tempToken;
      await init2FASetup(data.tempToken);
      return;
    }

    if (data.require2FA) {
      tempToken.value = data.tempToken;
      authStep.value = '2fa_verify';
      loading.value = false;
      resetDigits();
      return;
    }

    if (data.success) {
      if (data.user) {
        try {
          localStorage.setItem('wf_admin_user', JSON.stringify(data.user));
        } catch {}
      }
      window.location.href = '/admin';
    } else {
      error.value = data.message || 'Credențiale de administrator invalide.';
      loading.value = false;
    }
  } catch (err: any) {
    if (err.status === 429) {
      error.value = err.message || 'Prea multe încercări eșuate. Acces temporar blocat.';
      lockoutTimer.value = err.data?.lockoutRemainingSeconds || 900;
    } else {
      error.value = err.message || 'Eroare de conexiune la server. Vă rugăm să reîncercați.';
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
      resetDigits();
    } else {
      error.value = data.message || 'Eroare la inițializarea 2FA.';
    }
  } catch (err: any) {
    error.value = err.message || err.data?.message || 'Eroare la inițializarea 2FA.';
  } finally {
    loading.value = false;
  }
}

function resetDigits() {
  digits.value = ['', '', '', '', '', ''];
  totpCode.value = '';
  nextTick(() => {
    digitInputs.value[0]?.focus();
  });
}

function onDigitInput(index: number, e: Event) {
  const target = e.target as HTMLInputElement;
  const val = target.value.replace(/\D/g, '');

  if (!val) {
    digits.value[index] = '';
    totpCode.value = digits.value.join('');
    return;
  }

  if (val.length > 1) {
    const chars = val.slice(0, 6).split('');
    chars.forEach((c, i) => {
      if (index + i < 6) digits.value[index + i] = c;
    });
    const nextIdx = Math.min(index + chars.length, 5);
    digitInputs.value[nextIdx]?.focus();
  } else {
    digits.value[index] = val;
    if (index < 5) {
      digitInputs.value[index + 1]?.focus();
    }
  }

  totpCode.value = digits.value.join('');
  if (totpCode.value.length === 6) {
    void handle2FASubmit();
  }
}

function onDigitKeydown(index: number, e: KeyboardEvent) {
  if (e.key === 'Backspace' && !digits.value[index] && index > 0) {
    digitInputs.value[index - 1]?.focus();
  }
}

function onDigitPaste(e: ClipboardEvent) {
  e.preventDefault();
  const pasted = (e.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 6);
  if (pasted) {
    pasted.split('').forEach((c, i) => {
      if (i < 6) digits.value[i] = c;
    });
    totpCode.value = digits.value.join('');
    const focusTarget = Math.min(pasted.length, 5);
    digitInputs.value[focusTarget]?.focus();
    if (totpCode.value.length === 6) {
      void handle2FASubmit();
    }
  }
}

async function copySecretKey() {
  if (!setupSecret.value) return;
  try {
    await navigator.clipboard.writeText(setupSecret.value);
    copiedSecret.value = true;
    setTimeout(() => {
      copiedSecret.value = false;
    }, 2200);
  } catch {}
}

async function handle2FASubmit() {
  if (loading.value) return;
  const code = digits.value.join('').trim();
  if (code.length !== 6) {
    error.value = 'Introduceți codul complet de 6 cifre.';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const action = authStep.value === '2fa_setup' ? 'verify-setup' : 'verify';
    const [data] = await Promise.all([
      api('/api/admin/auth/2fa', {
        action,
        tempToken: tempToken.value,
        code,
        rememberMe: rememberMe.value,
      }),
      new Promise((resolve) => setTimeout(resolve, 650)),
    ]);

    if (data.success) {
      if (data.user) {
        try {
          localStorage.setItem('wf_admin_user', JSON.stringify(data.user));
        } catch {}
      }
      window.location.href = '/admin';
    } else {
      error.value = data.message || 'Cod 2FA incorect.';
      loading.value = false;
    }
  } catch (err: any) {
    error.value = err.message || err.data?.message || 'Cod 2FA incorect sau sesiune expirată.';
    loading.value = false;
  }
}

function cancel2FA() {
  authStep.value = 'login';
  resetDigits();
  tempToken.value = '';
  error.value = '';
}
</script>

<template>
  <div class="wf-cyber-stage">
    <!-- Atmospheric Ambient Lighting & Cyber Mesh -->
    <div class="wf-stage-atmosphere" aria-hidden="true">
      <div class="wf-ambient-aura wf-ambient-aura--fire" />
      <div class="wf-ambient-aura wf-ambient-aura--cyan" />
      <div class="wf-ambient-grid" />
    </div>

    <!-- ── Grand Expansive Split Console (Carbon Edition) ────────────────── -->
    <div class="wf-master-card" role="region" aria-label="Consolă Securizată Wildfire Mission Control">
      <!-- Subtle Carbon Texture Overlay -->
      <div class="wf-carbon-weave" aria-hidden="true" />

      <!-- Perimeter Carbon Border & Top Highlight -->
      <div class="wf-card-border-edge" aria-hidden="true" />
      <div class="wf-card-specular-beam" aria-hidden="true" />

      <div class="wf-card-grid">
        <!-- ── LEFT SHOWCASE PANEL: Dynamic Nexus / Administrator Profile ─── -->
        <aside class="wf-showcase-panel">
          <!-- PHASE 1: Lively Staff HQ & Operations Hub -->
          <div v-if="loginPhase === 'enter_user'" class="wf-nexus-stage wf-nexus-stage--friendly">
            <div class="wf-showcase-top">
              <div class="wf-brand-pill">
                <img src="/logo.png" alt="Wildfire Logo" class="wf-brand-logo-img" width="30" height="30" />
                <div class="wf-brand-pill-text">
                  <span class="wf-brand-title">WILDFIRE</span>
                  <span class="wf-brand-sub">Mission Control</span>
                </div>
              </div>

              <div class="wf-live-beacon-tag">
                <span class="wf-beacon-dot" aria-hidden="true" />
                <span>ONLINE · OPERAȚIONAL</span>
              </div>
            </div>

            <!-- Dynamic Live Operations Deck (Floating Interactive Cards) -->
            <div class="wf-live-hub-stage" aria-hidden="true">
              <!-- Subtle Background Ambient Core -->
              <div class="wf-hub-orbit-ring" />
              <div class="wf-hub-core-pulse">
                <img src="/logo.png" alt="" width="28" height="28" class="wf-hub-pulse-logo" />
              </div>

              <!-- Floating Card 1: Grade VIP & Market -->
              <div class="wf-hub-floating-card wf-hub-card--1">
                <div class="wf-hcard-icon wf-hcard-icon--orange">
                  <Icon icon="lucide:gem" width="16" height="16" />
                </div>
                <div class="wf-hcard-content">
                  <div class="wf-hcard-title">Grade VIP & Market</div>
                  <div class="wf-hcard-sub">Pachete, Beneficii, Entry Songs</div>
                </div>
                <div class="wf-hcard-badge wf-hcard-badge--amber">
                  <Icon icon="lucide:sparkles" width="10" height="10" />
                  <span>Market</span>
                </div>
              </div>

              <!-- Floating Card 2: Docs Vault -->
              <div class="wf-hub-floating-card wf-hub-card--2">
                <div class="wf-hcard-icon wf-hcard-icon--green">
                  <Icon icon="lucide:book-check" width="16" height="16" />
                </div>
                <div class="wf-hcard-content">
                  <div class="wf-hcard-title">60 Ghiduri Sincronizate</div>
                  <div class="wf-hcard-sub">Regulamente, Comenzi, Economie</div>
                </div>
                <div class="wf-hcard-badge wf-hcard-badge--blue">
                  <Icon icon="lucide:git-branch" width="10" height="10" />
                  <span>Main</span>
                </div>
              </div>

              <!-- Floating Card 3: Team Roster -->
              <div class="wf-hub-floating-card wf-hub-card--3">
                <div class="wf-hcard-icon wf-hcard-icon--purple">
                  <Icon icon="lucide:users-round" width="16" height="16" />
                </div>
                <div class="wf-hcard-content">
                  <div class="wf-hcard-title">Echipă & Administrare</div>
                  <div class="wf-hcard-sub">Zero-Trust RBAC Activ</div>
                </div>
                <div class="wf-hcard-badge wf-hcard-badge--green">
                  <span class="wf-hcard-dot" />
                  <span>Staff</span>
                </div>
              </div>
            </div>

            <div class="wf-showcase-meta">
              <h1 class="wf-showcase-headline">
                Wildfire Staff Workspace
              </h1>
              <p class="wf-showcase-lead">
                Spațiul central de lucru pentru echipa de administrare. Creăm ghiduri clare, coordonăm comunitatea și menținem documentația la cel mai înalt standard.
              </p>
            </div>

            <div class="wf-telemetry-strip">
              <div class="wf-telemetry-item">
                <span class="wf-telemetry-val">60 Ghiduri</span>
                <span class="wf-telemetry-lbl">Documentație Live</span>
              </div>
              <div class="wf-telemetry-sep" aria-hidden="true" />
              <div class="wf-telemetry-item">
                <span class="wf-telemetry-val">Git Sync</span>
                <span class="wf-telemetry-lbl">Sincronizare Cloud</span>
              </div>
              <div class="wf-telemetry-sep" aria-hidden="true" />
              <div class="wf-telemetry-item">
                <span class="wf-telemetry-val">Zero-Trust</span>
                <span class="wf-telemetry-lbl">Audit Nivel Staff</span>
              </div>
            </div>
          </div>

          <!-- PHASE 2: Morphs into Verified Administrator Profile (Inspired by Reference Image 2) -->
          <div v-else class="wf-profile-stage">
            <div class="wf-showcase-top">
              <div class="wf-brand-pill">
                <img src="/logo.png" alt="Wildfire Logo" class="wf-brand-logo-img" width="28" height="28" />
                <div class="wf-brand-pill-text">
                  <span class="wf-brand-title">WILDFIRE</span>
                  <span class="wf-brand-sub">Mission Control</span>
                </div>
              </div>

              <div class="wf-verified-tag">
                <Icon icon="lucide:shield-check" width="13" height="13" class="wf-verified-icon" />
                <span>IDENTITATE CONFIRMATĂ</span>
              </div>
            </div>

            <!-- BOX 1: Profile Hero Card (Clean Typography, No Clunky Dropdowns/Badges) -->
            <div class="wf-profile-hero-card">
              <!-- Cover Header Mesh Bar -->
              <div class="wf-hero-cover-bar" aria-hidden="true">
                <div class="wf-hero-cover-mesh" />
              </div>

              <!-- Identity Section (Consistent Left-Aligned Flow) -->
              <div class="wf-hero-identity-section">
                <!-- Circular Avatar (Overlapping cover banner) -->
                <div
                  class="wf-profile-avatar-frame"
                  :style="{ borderColor: matchedAdmin?.avatarColor || '#f97316' }"
                >
                  <img
                    v-if="matchedAdmin?.avatarUrl"
                    :src="matchedAdmin.avatarUrl"
                    :alt="matchedAdmin.displayName"
                    class="wf-profile-avatar-img"
                    width="66"
                    height="66"
                  />
                  <div
                    v-else
                    class="wf-profile-avatar-fallback"
                    :style="{ backgroundColor: matchedAdmin?.avatarColor || '#f97316' }"
                  >
                    {{ (matchedAdmin?.displayName || username).charAt(0).toUpperCase() }}
                  </div>
                  <div class="wf-profile-avatar-badge" title="Administrator Verificat">
                    <Icon icon="lucide:check" width="11" height="11" />
                  </div>
                </div>

                <div class="wf-profile-info">
                  <div class="wf-profile-name-row">
                    <h2 class="wf-profile-name">{{ matchedAdmin?.displayName || username }}</h2>
                    <Icon icon="lucide:check-circle-2" width="16" height="16" class="wf-name-verified-icon" />
                  </div>

                  <div class="wf-profile-meta-line">
                    <span class="wf-profile-title">{{ matchedAdmin?.customTitle || matchedAdmin?.role || 'Administrator' }}</span>
                  </div>

                  <span class="wf-profile-handle">@{{ matchedAdmin?.username || username }}</span>
                </div>
              </div>

              <!-- Checklist Box (Reference Image 2: Clean Checkmark List) -->
              <div class="wf-access-checklist-box">
                <div class="wf-checklist-header">
                  <Icon icon="lucide:shield-check" width="14" height="14" class="wf-checklist-header-icon" />
                  <span>Atribuții & acces în sistem:</span>
                </div>
                <ul class="wf-checklist-list">
                  <li
                    v-for="(item, idx) in (matchedAdmin?.responsibilities?.length ? matchedAdmin.responsibilities.slice(0, 4) : defaultPrivileges)"
                    :key="idx"
                    class="wf-checklist-item"
                  >
                    <Icon icon="lucide:check" width="14" height="14" class="wf-check-mark-svg" />
                    <span class="wf-checklist-text">{{ item }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- BOX 2: Security Protocol & Clearance Card (Clean Telemetry, Zero Pill Dropdowns) -->
            <div class="wf-clearance-box">
              <div class="wf-clearance-top">
                <div class="wf-clearance-icon-wrap">
                  <Icon icon="lucide:shield-check" width="18" height="18" class="wf-clearance-lock" />
                </div>
                <div class="wf-clearance-meta">
                  <div class="wf-clearance-header">
                    <span>Nivel securitate: {{ matchedAdmin?.isRoot ? 'Root Sovereign' : 'Administrator' }}</span>
                  </div>
                  <p class="wf-clearance-desc">
                    Identitatea a fost validată în baza de date. Introduceți parola pentru a finaliza autentificarea.
                  </p>
                </div>
              </div>

              <!-- Status Telemetry Row (Clean text items, no boxy pill buttons) -->
              <div class="wf-clearance-telemetry-row">
                <div class="wf-ctel-item">
                  <span class="wf-ctel-dot" />
                  <span class="wf-ctel-text">Cont activ</span>
                </div>
                <span class="wf-ctel-sep">·</span>
                <div class="wf-ctel-item">
                  <span class="wf-ctel-text">Criptare TLS 1.3</span>
                </div>
                <span v-if="matchedAdmin?.totpEnabled" class="wf-ctel-sep">·</span>
                <div v-if="matchedAdmin?.totpEnabled" class="wf-ctel-item">
                  <span class="wf-ctel-text">2FA activat</span>
                </div>
              </div>
            </div>

            <!-- Switch User Button -->
            <button type="button" class="wf-switch-user-btn" @click="backToUserStep">
              <Icon icon="lucide:user-x" width="14" height="14" />
              <span>Conectează-te cu alt utilizator</span>
            </button>
          </div>
        </aside>

        <!-- Elegant Divider -->
        <div class="wf-card-divider" aria-hidden="true" />

        <!-- ── RIGHT CONSOLE PANEL: Step-by-Step Form ─────────────────────── -->
        <main class="wf-form-panel">
          <!-- ── STATE 1: Standard Login Stages ────────────────────────────── -->
          <template v-if="authStep === 'login'">
            <!-- ── STEP 1: Enter Username (Friendly & Animated) ──────────── -->
            <div v-if="loginPhase === 'enter_user'" class="wf-step-container">
              <header class="wf-form-header">
                <div class="wf-welcome-pill">
                  <span class="wf-welcome-dot" />
                  <span>{{ timeGreeting }}</span>
                </div>
                <h2 class="wf-form-title">{{ greetingHeadline }} Bine ai revenit.</h2>
                <p class="wf-form-desc">
                  Alege contul tău sau introdu utilizatorul pentru a continua în panou.
                </p>
              </header>

              <!-- Quick Staff Selection -->
              <div v-if="quickStaffMembers && quickStaffMembers.length > 0" class="wf-quick-staff-section">
                <div class="wf-quick-staff-header">
                  <Icon icon="lucide:sparkles" width="13" height="13" class="wf-sparkle-icon" />
                  <span>Autentificare rapidă staff:</span>
                </div>
                <div class="wf-quick-staff-grid">
                  <button
                    v-for="m in quickStaffMembers"
                    :key="m.username"
                    type="button"
                    class="wf-quick-avatar-btn"
                    :title="`${m.name} (${m.title})`"
                    :disabled="verifyingUser"
                    @click="selectQuickStaff(m.username)"
                  >
                    <div class="wf-quick-avatar-frame" :style="{ borderColor: m.color }">
                      <img :src="m.avatar" :alt="m.name" class="wf-quick-avatar-img" width="38" height="38" />
                    </div>
                    <span class="wf-quick-avatar-name">{{ m.name }}</span>
                    <span class="wf-quick-avatar-role">{{ (m.title || 'Staff').split(' ')[0] }}</span>
                  </button>
                </div>
              </div>

              <!-- Sleek Divider -->
              <div class="wf-or-divider" aria-hidden="true">
                <span class="wf-or-line" />
                <span class="wf-or-text">sau introdu alt cont</span>
                <span class="wf-or-line" />
              </div>

              <!-- Error Banner -->
              <div
                v-if="error"
                class="wf-alert-box wf-alert-box--danger"
                role="alert"
                aria-live="polite"
              >
                <Icon icon="lucide:alert-circle" width="15" height="15" class="wf-alert-icon" />
                <span>{{ error }}</span>
              </div>

              <!-- User Input Form -->
              <div class="wf-auth-form" role="form" @keydown.enter.prevent="proceedToPassword">
                <div class="wf-field-group">
                  <label class="wf-field-label" for="wf-adm-uid">
                    Utilizator
                  </label>
                  <div class="wf-input-box">
                    <Icon icon="lucide:user" width="16" height="16" class="wf-input-symbol" aria-hidden="true" />
                    <input
                      id="wf-adm-uid"
                      name="wf_adm_id_token"
                      v-model="username"
                      type="text"
                      required
                      placeholder="Introdu utilizatorul (ex: iannC)..."
                      :class="['wf-field-control', error ? 'wf-field-control--error' : '']"
                      autocomplete="off"
                      autocorrect="off"
                      autocapitalize="none"
                      spellcheck="false"
                      data-lpignore="true"
                      data-form-type="other"
                      :readonly="!isUidActive"
                      @focus="isUidActive = true"
                      @click="isUidActive = true"
                      @keydown="handleUidKeydown"
                      @input="userManuallyTypedUid = true; if (error) error = ''"
                      @paste="userManuallyTypedUid = true; if (error) error = ''"
                    />
                    <button
                      v-if="username"
                      type="button"
                      class="wf-clear-input-btn"
                      title="Șterge"
                      @click="username = ''; if (error) error = ''"
                    >
                      <Icon icon="lucide:x" width="13" height="13" />
                    </button>
                  </div>
                </div>

                <!-- Sleek Persistent Session Toggle -->
                <div
                  class="wf-session-toggle-box"
                  role="checkbox"
                  :aria-checked="rememberMe"
                  tabindex="0"
                  @click="rememberMe = !rememberMe"
                  @keydown.space.prevent="rememberMe = !rememberMe"
                >
                  <div class="wf-session-toggle-left">
                    <div class="wf-session-shield-badge">
                      <Icon icon="lucide:shield-check" width="14" height="14" />
                    </div>
                    <div class="wf-session-text">
                      <span class="wf-session-title">Sesiune persistentă</span>
                      <span class="wf-session-desc">Rămâi conectat securizat pe acest dispozitiv</span>
                    </div>
                  </div>
                  <div class="wf-modern-switch" :class="{ 'wf-modern-switch--active': rememberMe }">
                    <span class="wf-modern-switch-thumb" />
                  </div>
                </div>

                <!-- Next Button -->
                <button
                  type="button"
                  :disabled="!username.trim() || verifyingUser"
                  class="wf-action-btn"
                  :class="{ 'wf-action-btn--loading': verifyingUser }"
                  @click="proceedToPassword"
                >
                  <!-- Liquid Tank Loading Layer -->
                  <div v-if="verifyingUser" class="wf-btn-liquid-tank" aria-hidden="true">
                    <div class="wf-liquid-stream">
                      <svg class="wf-liquid-wave-svg wf-liquid-wave-svg--1" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M0,50 C150,85 300,20 450,55 C600,85 750,20 900,55 C1050,85 1150,30 1200,50 L1200,120 L0,120 Z" />
                      </svg>
                      <svg class="wf-liquid-wave-svg wf-liquid-wave-svg--2" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M0,45 C200,15 350,75 500,45 C650,15 800,75 950,45 C1100,20 1180,65 1200,45 L1200,120 L0,120 Z" />
                      </svg>
                      <div class="wf-liquid-front-crest" />
                      <div class="wf-liquid-flow-sheen" />
                    </div>
                  </div>

                  <span class="wf-btn-inner-content">
                    <template v-if="verifyingUser">
                      <Icon icon="lucide:loader-2" width="16" height="16" class="wf-rotate-spin" />
                      <span>Se verifică baza de date...</span>
                    </template>
                    <template v-else>
                      <span>Continuă spre conectare</span>
                      <Icon icon="lucide:arrow-right" width="15" height="15" class="wf-arrow-slide" />
                    </template>
                  </span>
                </button>
              </div>

              <footer class="wf-form-footer wf-form-footer--step1">
                <div class="wf-friendly-helper">
                  <Icon icon="lucide:help-circle" width="13" height="13" class="wf-helper-icon" />
                  <span>Ai nevoie de asistență? Contactează un Root Admin pe Discord.</span>
                </div>
                <a href="/docs" class="wf-back-link">
                  <Icon icon="lucide:arrow-left" width="14" height="14" />
                  <span>Înapoi la documentație</span>
                </a>
              </footer>
            </div>

            <!-- ── STEP 2: Enter Password (Warm, Verified & Modern) ────────── -->
            <div v-else class="wf-step-container">
              <!-- Verified Staff Identity Card -->
              <div class="wf-verified-identity-card">
                <div class="wf-identity-left">
                  <div
                    class="wf-identity-avatar-frame"
                    :style="{ borderColor: matchedAdmin?.avatarColor || '#f97316' }"
                  >
                    <img
                      v-if="matchedAdmin?.avatarUrl"
                      :src="matchedAdmin.avatarUrl"
                      alt=""
                      class="wf-identity-avatar-img"
                      width="38"
                      height="38"
                    />
                    <span v-else class="wf-identity-avatar-fallback">
                      {{ (matchedAdmin?.displayName || username).charAt(0).toUpperCase() }}
                    </span>
                    <span class="wf-identity-online-dot" />
                  </div>
                  <div class="wf-identity-details">
                    <div class="wf-identity-row-name">
                      <span class="wf-identity-name">{{ matchedAdmin?.displayName || username }}</span>
                      <span class="wf-identity-role-badge">
                        {{ matchedAdmin?.customTitle || (matchedAdmin?.isRoot ? 'Root Admin' : 'Staff Admin') }}
                      </span>
                    </div>
                    <div class="wf-identity-row-meta">
                      <span class="wf-identity-username">@{{ matchedAdmin?.username || username }}</span>
                      <span class="wf-identity-meta-sep">·</span>
                      <span class="wf-identity-status">Cont Verificat</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  class="wf-switch-account-pill"
                  title="Conectează-te cu alt cont"
                  @click="backToUserStep"
                >
                  <Icon icon="lucide:arrow-left" width="12" height="12" />
                  <span>Schimbă</span>
                </button>
              </div>

              <!-- Header: Friendly & Engaging -->
              <header class="wf-form-header">
                <h2 class="wf-form-title">Bun venit, {{ matchedAdmin?.displayName || username }}!</h2>
                <p class="wf-form-desc">
                  Introdu cheia de securitate sau parola contului pentru a accesa panoul.
                </p>
              </header>

              <!-- Error Banner -->
              <div
                v-if="error"
                class="wf-alert-box wf-alert-box--danger"
                role="alert"
                aria-live="polite"
              >
                <Icon icon="lucide:alert-circle" width="15" height="15" class="wf-alert-icon" />
                <span>{{ error }}</span>
              </div>

              <!-- Password Form -->
              <div class="wf-auth-form" role="form" @keydown.enter.prevent="handleSubmit">
                <div class="wf-field-group">
                  <label class="wf-field-label" for="wf-adm-pwd">
                    Parolă
                  </label>
                  <div class="wf-input-box">
                    <Icon icon="lucide:lock" width="16" height="16" class="wf-input-symbol" aria-hidden="true" />
                    <input
                      id="wf-adm-pwd"
                      name="wf_adm_pwd_token"
                      v-model="password"
                      type="text"
                      required
                      placeholder="Introdu parola..."
                      :class="['wf-field-control', !showPassword && password ? 'wf-field-masked' : '']"
                      autocomplete="new-password"
                      autocorrect="off"
                      autocapitalize="none"
                      spellcheck="false"
                      data-lpignore="true"
                      data-form-type="other"
                      :readonly="!isPwdActive"
                      @focus="isPwdActive = true"
                      @click="isPwdActive = true"
                      @keydown="handlePwdKeydown"
                      @input="userManuallyTypedPwd = true"
                      @paste="userManuallyTypedPwd = true"
                      :disabled="loading"
                    />
                    <button
                      type="button"
                      class="wf-eye-toggle"
                      :title="showPassword ? 'Ascunde parola' : 'Afișează parola'"
                      :aria-label="showPassword ? 'Ascunde parola' : 'Afișează parola'"
                      tabindex="0"
                      @click="showPassword = !showPassword"
                    >
                      <Icon
                        :icon="showPassword ? 'lucide:eye-off' : 'lucide:eye'"
                        width="15"
                        height="15"
                      />
                    </button>
                  </div>
                </div>

                <!-- Sleek Persistent Session Toggle -->
                <div
                  class="wf-session-toggle-box"
                  role="checkbox"
                  :aria-checked="rememberMe"
                  tabindex="0"
                  @click="rememberMe = !rememberMe"
                  @keydown.space.prevent="rememberMe = !rememberMe"
                >
                  <div class="wf-session-toggle-left">
                    <div class="wf-session-shield-badge">
                      <Icon icon="lucide:shield-check" width="14" height="14" />
                    </div>
                    <div class="wf-session-text">
                      <span class="wf-session-title">Sesiune persistentă</span>
                      <span class="wf-session-desc">Rămâi conectat securizat pe acest dispozitiv</span>
                    </div>
                  </div>
                  <div class="wf-modern-switch" :class="{ 'wf-modern-switch--active': rememberMe }">
                    <span class="wf-modern-switch-thumb" />
                  </div>
                </div>

                <!-- Primary Submit Button -->
                <button
                  type="button"
                  :disabled="loading || (lockoutTimer !== null && lockoutTimer > 0) || !password"
                  class="wf-action-btn"
                  :class="{ 'wf-action-btn--loading': loading }"
                  @click="handleSubmit"
                >
                  <!-- Liquid Tank Loading Layer -->
                  <div v-if="loading" class="wf-btn-liquid-tank" aria-hidden="true">
                    <div class="wf-liquid-stream">
                      <svg class="wf-liquid-wave-svg wf-liquid-wave-svg--1" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M0,50 C150,85 300,20 450,55 C600,85 750,20 900,55 C1050,85 1150,30 1200,50 L1200,120 L0,120 Z" />
                      </svg>
                      <svg class="wf-liquid-wave-svg wf-liquid-wave-svg--2" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M0,45 C200,15 350,75 500,45 C650,15 800,75 950,45 C1100,20 1180,65 1200,45 L1200,120 L0,120 Z" />
                      </svg>
                      <div class="wf-liquid-front-crest" />
                      <div class="wf-liquid-flow-sheen" />
                    </div>
                  </div>

                  <span class="wf-btn-inner-content">
                    <template v-if="loading">
                      <Icon icon="lucide:loader-2" width="16" height="16" class="wf-rotate-spin" />
                      <span>Se verifică acreditările...</span>
                    </template>
                    <template v-else-if="lockoutTimer !== null && lockoutTimer > 0">
                      <Icon icon="lucide:lock" width="15" height="15" />
                      <span>Reîncercare în {{ lockoutTimer }}s</span>
                    </template>
                    <template v-else>
                      <span>Conectează-te în panou</span>
                      <Icon icon="lucide:arrow-right" width="15" height="15" class="wf-arrow-slide" />
                    </template>
                  </span>
                </button>
              </div>

              <footer class="wf-form-footer wf-form-footer--step2">
                <div class="wf-security-footnote">
                  <Icon icon="lucide:shield-check" width="13" height="13" class="wf-sfoot-icon" />
                  <span>Conexiune securizată · Criptare TLS 1.3 & Argon2id</span>
                </div>
                <a href="/docs" class="wf-back-link">
                  <Icon icon="lucide:arrow-left" width="14" height="14" />
                  <span>Înapoi la documentație</span>
                </a>
              </footer>
            </div>
          </template>

          <!-- ── STATE 2 & 3: Advanced 2FA Modal Experience ─────────────────── -->
          <div v-else class="wf-step-container wf-2fa-container">
            <div class="wf-2fa-hero">
              <div class="wf-2fa-icon-frame">
                <Icon icon="lucide:shield-check" width="32" height="32" class="wf-2fa-shield-icon" />
              </div>
              <h2 class="wf-form-title">
                <template v-if="authStep === '2fa_setup'">Configurare Securitate 2FA</template>
                <template v-else>Verificare în Doi Pași (TOTP)</template>
              </h2>
              <p class="wf-form-desc">
                <template v-if="authStep === '2fa_setup'">
                  Scanați codul QR cu aplicația dvs. de autentificare pentru a asocia contul.
                </template>
                <template v-else>
                  Introduceți codul numeric de 6 cifre generat pe telefon.
                </template>
              </p>
            </div>

            <!-- Error Banner -->
            <div
              v-if="error"
              class="wf-alert-box wf-alert-box--danger"
              role="alert"
              aria-live="polite"
            >
              <Icon icon="lucide:alert-circle" width="15" height="15" class="wf-alert-icon" />
              <span>{{ error }}</span>
            </div>

            <!-- QR Code Card for 2FA Setup -->
            <div v-if="authStep === '2fa_setup'" class="wf-qr-card">
              <div class="wf-qr-box">
                <img
                  v-if="qrCodeUrl"
                  :src="qrCodeUrl"
                  alt="Cod QR 2FA"
                  width="140"
                  height="140"
                  class="wf-qr-image"
                />
                <div class="wf-qr-badge-center">
                  <img src="/logo.png" alt="WildFire" width="22" height="22" />
                </div>
              </div>

              <!-- Manual Secret Copy Box -->
              <div class="wf-secret-row">
                <span class="wf-secret-label">Cheie manuală:</span>
                <code class="wf-secret-code">{{ setupSecret }}</code>
                <button
                  type="button"
                  class="wf-copy-btn"
                  :title="copiedSecret ? 'Copiat!' : 'Copiază secretul'"
                  @click="copySecretKey"
                >
                  <Icon :icon="copiedSecret ? 'lucide:check' : 'lucide:copy'" width="13" height="13" />
                  <span>{{ copiedSecret ? 'Copiat!' : 'Copiază' }}</span>
                </button>
              </div>
            </div>

            <!-- ── 6-Digit Individual Cell Input ── -->
            <div class="wf-digit-cells-section">
              <label class="wf-digit-label">Cod de securitate (6 cifre)</label>
              <div class="wf-digit-grid" @paste="onDigitPaste">
                <input
                  v-for="(digit, idx) in digits"
                  :key="idx"
                  :ref="(el) => { if (el) digitInputs[idx] = el as HTMLInputElement; }"
                  type="text"
                  inputmode="numeric"
                  maxlength="1"
                  class="wf-digit-cell"
                  :class="{ 'wf-digit-cell--filled': digit !== '' }"
                  :value="digit"
                  autocomplete="one-time-code"
                  @input="onDigitInput(idx, $event)"
                  @keydown="onDigitKeydown(idx, $event)"
                />
              </div>
              <span class="wf-digit-hint">Codul se reîmprospătează automat la fiecare 30 de secunde.</span>
            </div>

            <!-- 2FA Action Buttons -->
            <div class="wf-2fa-actions">
              <button
                type="button"
                :disabled="loading || totpCode.length !== 6"
                class="wf-action-btn"
                :class="{ 'wf-action-btn--loading': loading }"
                @click="handle2FASubmit"
              >
                <!-- Liquid Tank Loading Layer -->
                <div v-if="loading" class="wf-btn-liquid-tank" aria-hidden="true">
                  <div class="wf-liquid-stream">
                    <svg class="wf-liquid-wave-svg wf-liquid-wave-svg--1" viewBox="0 0 1200 120" preserveAspectRatio="none">
                      <path d="M0,50 C150,85 300,20 450,55 C600,85 750,20 900,55 C1050,85 1150,30 1200,50 L1200,120 L0,120 Z" />
                    </svg>
                    <svg class="wf-liquid-wave-svg wf-liquid-wave-svg--2" viewBox="0 0 1200 120" preserveAspectRatio="none">
                      <path d="M0,45 C200,15 350,75 500,45 C650,15 800,75 950,45 C1100,20 1180,65 1200,45 L1200,120 L0,120 Z" />
                    </svg>
                    <div class="wf-liquid-front-crest" />
                    <div class="wf-liquid-flow-sheen" />
                  </div>
                </div>

                <span class="wf-btn-inner-content">
                  <template v-if="loading">
                    <Icon icon="lucide:loader-2" width="16" height="16" class="wf-rotate-spin" />
                    <span>Se verifică codul...</span>
                  </template>
                  <template v-else>
                    <span>Verifică &amp; Autorizează Accesul</span>
                    <Icon icon="lucide:shield-check" width="16" height="16" />
                  </template>
                </span>
              </button>

              <button
                type="button"
                class="wf-secondary-ghost-btn"
                @click="cancel2FA"
              >
                <Icon icon="lucide:x" width="13" height="13" />
                <span>Anulează și revino la login</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════════════
   WILDFIRE ADMIN — TWO-PHASE DYNAMIC CARBON COMMAND CENTER
   Step 1: Administrator Identification & Ambient Security Nexus
   Step 2: Morphs into Verified Admin Profile & Password Entry
   ═══════════════════════════════════════════════════════════════════════════ */

.wf-cyber-stage {
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  position: relative;
  background: #080a0f;
  color: #f1f5f9;
  z-index: 10;
  box-sizing: border-box;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ── Atmospheric Ambient Lighting & Cyber Mesh ─────────────────────────── */
.wf-stage-atmosphere {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.wf-ambient-aura--fire {
  position: absolute;
  top: 18%;
  left: 15%;
  width: 620px;
  height: 620px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(249, 115, 22, 0.12) 0%, rgba(234, 88, 12, 0.04) 45%, transparent 70%);
  filter: blur(80px);
  will-change: transform;
  animation: wf-aura-drift 22s ease-in-out infinite alternate;
}

.wf-ambient-aura--cyan {
  position: absolute;
  bottom: 15%;
  right: 15%;
  width: 520px;
  height: 520px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.06) 0%, rgba(249, 115, 22, 0.03) 40%, transparent 70%);
  filter: blur(90px);
  will-change: transform;
  animation: wf-aura-drift-rev 26s ease-in-out infinite alternate;
}

@keyframes wf-aura-drift {
  0%   { transform: translate(0, 0) scale(1); }
  50%  { transform: translate(40px, -30px) scale(1.08); }
  100% { transform: translate(-30px, 25px) scale(0.95); }
}

@keyframes wf-aura-drift-rev {
  0%   { transform: translate(0, 0) scale(1); }
  50%  { transform: translate(-35px, 35px) scale(1.06); }
  100% { transform: translate(30px, -20px) scale(0.92); }
}

.wf-ambient-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 85%);
  -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 85%);
}

/* ── The Master Card (Expansive Proportions: 1060px) ───────────────────── */
.wf-master-card {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1060px;
  background: #0d1117;
  border-radius: 24px;
  overflow: hidden;
  box-shadow:
    0 32px 84px -16px rgba(0, 0, 0, 0.95),
    0 0 0 1px rgba(255, 255, 255, 0.08);
  animation: wf-card-pop 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-sizing: border-box;
}

@keyframes wf-card-pop {
  0% {
    opacity: 0;
    transform: translateY(12px) scale(0.985);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.wf-carbon-weave {
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.01) 0px, rgba(255, 255, 255, 0.01) 1px, transparent 1px, transparent 4px),
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.01) 0px, rgba(255, 255, 255, 0.01) 1px, transparent 1px, transparent 4px);
  pointer-events: none;
  opacity: 0.6;
  z-index: 1;
}

.wf-card-border-edge {
  position: absolute;
  inset: 0;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  pointer-events: none;
  z-index: 2;
}

.wf-card-specular-beam {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 20%,
    rgba(249, 115, 22, 0.4) 50%,
    rgba(255, 255, 255, 0.1) 80%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 3;
}

.wf-card-grid {
  display: grid;
  grid-template-columns: 1.18fr 1px 1fr;
  position: relative;
  z-index: 4;
}

/* ── LEFT SHOWCASE PANEL ───────────────────────────────────────────────── */
.wf-showcase-panel {
  padding: 48px 44px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(160deg, rgba(249, 115, 22, 0.04) 0%, rgba(10, 13, 19, 0.96) 65%);
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}

.wf-nexus-stage,
.wf-profile-stage {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  gap: 24px;
  animation: wf-fade-in 0.3s ease;
}

@keyframes wf-fade-in {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.wf-showcase-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.wf-brand-pill {
  display: flex;
  align-items: center;
  gap: 12px;
}

.wf-brand-logo-img {
  width: 30px;
  height: 30px;
  object-fit: contain;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.6));
}

.wf-brand-pill-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.wf-brand-title {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif;
  font-size: 0.95rem;
  font-weight: 850;
  letter-spacing: 0.08em;
  background: linear-gradient(135deg, #ffffff 40%, #fb923c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.wf-brand-sub {
  font-size: 0.67rem;
  color: #94a3b8;
  font-weight: 500;
  letter-spacing: 0.03em;
}

.wf-live-beacon-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.63rem;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", monospace;
  font-weight: 700;
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 99px;
  padding: 3.5px 10px;
  letter-spacing: 0.04em;
}

.wf-beacon-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.7);
  animation: wf-beacon-pulse 2s infinite ease-in-out;
}

@keyframes wf-beacon-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}

.wf-verified-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.62rem;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", monospace;
  font-weight: 750;
  color: #34d399;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: 99px;
  padding: 3px 9px;
  letter-spacing: 0.05em;
}

.wf-verified-icon {
  color: #34d399;
}

/* Dynamic Live Operations Deck (Floating Interactive Showcase) */
.wf-live-hub-stage {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0;
  margin: 6px 0 10px;
}

.wf-hub-orbit-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 1px dashed rgba(249, 115, 22, 0.12);
  pointer-events: none;
  animation: wf-hub-orbit 40s linear infinite;
}

.wf-hub-core-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, transparent 70%);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.wf-hub-pulse-logo {
  opacity: 0.2;
  filter: grayscale(40%);
  pointer-events: none;
}

.wf-hub-floating-card {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: 14px;
  background: rgba(14, 18, 25, 0.88);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 24px -6px rgba(0, 0, 0, 0.55);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.wf-hub-card--1 {
  animation: wf-float-1 4.5s ease-in-out infinite;
  margin-right: 14px;
}

.wf-hub-card--2 {
  animation: wf-float-2 5.2s ease-in-out infinite;
  margin-left: 18px;
}

.wf-hub-card--3 {
  animation: wf-float-3 4.8s ease-in-out infinite;
  margin-right: 8px;
}

.wf-hcard-icon {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.wf-hcard-icon--orange {
  background: rgba(249, 115, 22, 0.12);
  border: 1px solid rgba(249, 115, 22, 0.25);
  color: #fb923c;
}

.wf-hcard-icon--green {
  background: rgba(34, 197, 94, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.25);
  color: #4ade80;
}

.wf-hcard-icon--purple {
  background: rgba(168, 85, 247, 0.12);
  border: 1px solid rgba(168, 85, 247, 0.25);
  color: #c084fc;
}

.wf-hcard-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.wf-hcard-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: #f1f5f9;
  letter-spacing: -0.01em;
}

.wf-hcard-sub {
  font-size: 0.67rem;
  color: #64748b;
  font-weight: 500;
}

.wf-hcard-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.63rem;
  font-weight: 700;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", monospace;
  padding: 3px 8px;
  border-radius: 99px;
  flex-shrink: 0;
}

.wf-hcard-badge--green {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.25);
  color: #4ade80;
}

.wf-hcard-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 5px rgba(34, 197, 94, 0.6);
}

.wf-hcard-badge--blue {
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.25);
  color: #38bdf8;
}

.wf-hcard-badge--amber {
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.25);
  color: #fbbf24;
}

@keyframes wf-float-1 {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

@keyframes wf-float-2 {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(5px); }
}

@keyframes wf-float-3 {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
}

@keyframes wf-hub-orbit {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to   { transform: translate(-50%, -50%) rotate(360deg); }
}

.wf-showcase-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wf-showcase-headline {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif;
  font-size: 1.55rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #ffffff;
  margin: 0;
  line-height: 1.25;
}

.wf-showcase-lead {
  font-size: 0.8rem;
  color: #94a3b8;
  line-height: 1.55;
  margin: 0;
}

.wf-telemetry-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.wf-telemetry-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.wf-telemetry-val {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", monospace;
  font-size: 0.82rem;
  font-weight: 750;
  color: #ffffff;
}

.wf-telemetry-lbl {
  font-size: 0.65rem;
  color: #64748b;
  font-weight: 500;
}

.wf-telemetry-sep {
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.07);
}

/* ── PHASE 2: ADMINISTRATOR PROFILE SHOWCASE (Reference Image 2 Style) ── */
.wf-profile-hero-card {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.6);
}

.wf-hero-cover-bar {
  height: 74px;
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.18) 0%, rgba(234, 88, 12, 0.08) 50%, rgba(56, 189, 248, 0.1) 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 12px 16px;
  position: relative;
}

.wf-hero-cover-mesh {
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.015) 0, rgba(255, 255, 255, 0.015) 1px, transparent 0, transparent 8px);
  pointer-events: none;
}

.wf-hero-cover-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.62rem;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", monospace;
  font-weight: 750;
  letter-spacing: 0.06em;
  color: #cbd5e1;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  padding: 3px 9px;
  border-radius: 99px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  z-index: 2;
}

.wf-hero-status-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 6px #22c55e;
}

/* Left-Aligned Identity Section */
.wf-hero-identity-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  padding: 0 22px;
  margin-top: -34px;
  gap: 8px;
  position: relative;
  z-index: 3;
}

.wf-profile-avatar-frame {
  position: relative;
  width: 68px;
  height: 68px;
  border-radius: 50%;
  border: 2.5px solid #f97316;
  padding: 2px;
  background: #0b0e15;
  box-shadow: 0 10px 26px -4px rgba(0, 0, 0, 0.9);
}

.wf-profile-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.wf-profile-avatar-fallback {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  font-weight: 800;
  color: #ffffff;
}

.wf-profile-avatar-badge {
  position: absolute;
  bottom: 0px;
  right: 0px;
  width: 19px;
  height: 19px;
  border-radius: 50%;
  background: #22c55e;
  color: #ffffff;
  border: 2px solid #0d1117;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

.wf-profile-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  margin-top: 2px;
}

.wf-profile-name-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.wf-profile-name {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif;
  font-size: 1.35rem;
  font-weight: 850;
  color: #ffffff;
  margin: 0;
  letter-spacing: -0.01em;
}

.wf-profile-check-pill {
  color: #22c55e;
  display: inline-flex;
}

.wf-name-verified-icon {
  color: #22c55e;
}

.wf-profile-meta-line {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  line-height: 1.4;
}

.wf-profile-title {
  font-weight: 600;
  color: #fb923c;
  letter-spacing: 0.01em;
}

.wf-profile-bullet {
  color: #475569;
  font-size: 0.75rem;
}

.wf-profile-handle {
  font-size: 0.74rem;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", monospace;
  color: #64748b;
}

/* ── Checklist Box (Clean Reference Image 2 Style) ── */
.wf-access-checklist-box {
  width: 100%;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.22);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 16px 22px 18px;
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
}

.wf-checklist-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.77rem;
  font-weight: 750;
  color: #ffffff;
  letter-spacing: 0.01em;
}

.wf-checklist-header-icon {
  color: #22c55e;
}

.wf-checklist-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wf-checklist-item {
  display: flex;
  align-items: center;
  gap: 10px;
  line-height: 1.35;
}

.wf-check-mark-svg {
  color: #22c55e;
  flex-shrink: 0;
}

.wf-checklist-text {
  color: #cbd5e1;
  font-size: 0.76rem;
  font-weight: 500;
}

/* ── BOX 2: Security Clearance Box ── */
.wf-clearance-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
}

.wf-clearance-top {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.wf-clearance-icon-wrap {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(249, 115, 22, 0.1);
  border: 1px solid rgba(249, 115, 22, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fb923c;
  flex-shrink: 0;
}

.wf-clearance-meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.wf-clearance-header {
  font-size: 0.76rem;
  font-weight: 750;
  color: #ffffff;
  letter-spacing: 0.01em;
}

.wf-clearance-desc {
  font-size: 0.71rem;
  color: #94a3b8;
  line-height: 1.45;
  margin: 0;
}

.wf-clearance-telemetry-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding-top: 6px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.7rem;
  color: #94a3b8;
}

.wf-ctel-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.wf-ctel-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 6px #22c55e;
}

.wf-ctel-text {
  font-weight: 500;
  color: #cbd5e1;
}

.wf-ctel-sep {
  color: #475569;
}

.wf-switch-user-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  height: 38px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 11px;
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.wf-switch-user-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.15);
}

/* ── CARD DIVIDER ──────────────────────────────────────────────────────── */
.wf-card-divider {
  width: 1px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(255, 255, 255, 0.08) 20%,
    rgba(255, 255, 255, 0.08) 80%,
    transparent 100%
  );
}

/* ── RIGHT CONSOLE PANEL ───────────────────────────────────────────────── */
.wf-form-panel {
  padding: 48px 44px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #0e1219;
  box-sizing: border-box;
}

.wf-step-container {
  display: flex;
  flex-direction: column;
  gap: 22px;
  animation: wf-fade-in 0.25s ease;
}

.wf-form-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.wf-form-title {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif;
  font-size: 1.45rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #ffffff;
  margin: 0;
  line-height: 1.25;
}

.wf-form-desc {
  font-size: 0.8rem;
  color: #94a3b8;
  line-height: 1.5;
  margin: 0;
}

/* Step 1: Welcome Pill & Header */
.wf-welcome-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  padding: 3px 10px;
  background: rgba(249, 115, 22, 0.08);
  border: 1px solid rgba(249, 115, 22, 0.22);
  border-radius: 99px;
  font-size: 0.68rem;
  font-weight: 700;
  color: #fb923c;
  letter-spacing: 0.02em;
  margin-bottom: 2px;
}

.wf-welcome-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #f97316;
  box-shadow: 0 0 6px #f97316;
}

/* Quick Staff Selection Grid */
.wf-quick-staff-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.wf-quick-staff-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  font-weight: 650;
  color: #cbd5e1;
}

.wf-sparkle-icon {
  color: #f97316;
}

.wf-quick-staff-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.wf-quick-avatar-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 8px 4px;
  border-radius: 10px;
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

.wf-quick-avatar-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.wf-quick-avatar-btn:active:not(:disabled) {
  transform: translateY(0);
}

.wf-quick-avatar-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.wf-quick-avatar-frame {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #f97316;
  padding: 1.5px;
  background: #0b0e15;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  flex-shrink: 0;
}

.wf-quick-avatar-btn:hover:not(:disabled) .wf-quick-avatar-frame {
  transform: scale(1.06);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.6);
}

.wf-quick-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.wf-quick-avatar-name {
  font-size: 0.72rem;
  font-weight: 700;
  color: #f1f5f9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.wf-quick-avatar-role {
  font-size: 0.6rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* Or Divider */
.wf-or-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: -4px 0;
}

.wf-or-line {
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
}

.wf-or-text {
  font-size: 0.68rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* Clear Input Button */
.wf-clear-input-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.06);
  border: none;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.15s ease;
  z-index: 2;
}

.wf-clear-input-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

/* Step 1 Friendly Helper Footer */
.wf-form-footer--step1 {
  flex-direction: column;
  gap: 12px;
}

.wf-friendly-helper {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  color: #64748b;
  text-align: center;
  line-height: 1.4;
}

.wf-helper-icon {
  color: #94a3b8;
  flex-shrink: 0;
}

/* Verified Staff Identity Card (Step 2 top chip) */
.wf-verified-identity-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.09);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
  transition: all 0.15s ease;
}

.wf-identity-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.wf-identity-avatar-frame {
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 2px solid #f97316;
  padding: 1.5px;
  background: #0b0e15;
  flex-shrink: 0;
}

.wf-identity-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.wf-identity-avatar-fallback {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #f97316;
  color: #ffffff;
  font-weight: 800;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wf-identity-online-dot {
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #22c55e;
  border: 1.5px solid #0e1219;
  box-shadow: 0 0 5px rgba(34, 197, 94, 0.6);
}

.wf-identity-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.wf-identity-row-name {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.wf-identity-name {
  font-size: 0.88rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.01em;
}

.wf-identity-role-badge {
  font-size: 0.62rem;
  font-weight: 700;
  padding: 1.5px 7px;
  border-radius: 99px;
  background: rgba(249, 115, 22, 0.12);
  border: 1px solid rgba(249, 115, 22, 0.28);
  color: #fb923c;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.wf-identity-row-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.68rem;
}

.wf-identity-username {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", monospace;
  color: #94a3b8;
  font-weight: 600;
}

.wf-identity-meta-sep {
  color: #475569;
}

.wf-identity-status {
  color: #34d399;
  font-weight: 600;
}

.wf-switch-account-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #cbd5e1;
  font-size: 0.72rem;
  font-weight: 650;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.wf-switch-account-pill:hover {
  background: rgba(249, 115, 22, 0.12);
  border-color: rgba(249, 115, 22, 0.35);
  color: #fb923c;
  transform: translateX(-1px);
}

/* Alert Box */
.wf-alert-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 11px;
  font-size: 0.76rem;
  line-height: 1.4;
  box-sizing: border-box;
}

.wf-alert-box--danger {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.26);
  color: #fca5a5;
}

.wf-alert-icon {
  flex-shrink: 0;
  color: #ef4444;
}

/* Form Container */
.wf-auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.wf-field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.wf-field-label {
  font-size: 0.75rem;
  font-weight: 650;
  color: #cbd5e1;
  letter-spacing: 0.02em;
}

.wf-input-box {
  position: relative;
  display: flex;
  align-items: center;
}

.wf-input-symbol {
  position: absolute;
  left: 12px;
  color: #64748b;
  pointer-events: none;
  transition: color 0.15s ease;
  z-index: 2;
}

.wf-input-box:focus-within .wf-input-symbol {
  color: #fb923c;
}

/* Carbon Input Field - Modern, Slim & Refined */
.wf-field-control {
  width: 100%;
  height: 42px;
  padding: 8px 38px 8px 38px;
  background: rgba(11, 14, 21, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 9px;
  color: #ffffff !important;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif;
  font-size: 0.86rem;
  outline: none;
  box-sizing: border-box;
  transition: all 0.15s ease;
}

.wf-field-control::placeholder {
  color: #64748b !important;
  opacity: 1;
  letter-spacing: normal !important;
}

.wf-field-control:hover:not(:disabled) {
  border-color: rgba(255, 255, 255, 0.18) !important;
}

.wf-field-control:focus {
  border-color: #f97316 !important;
  box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.18) !important;
  background: #0b0e15 !important;
}

.wf-field-control:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.wf-field-control--error {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.18) !important;
}

.wf-field-control--error:focus {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.28) !important;
}

/* Password Mask for type="text" */
.wf-field-masked {
  -webkit-text-security: disc !important;
  text-security: disc !important;
  letter-spacing: 0.14em !important;
}

/* Total destruction of browser autofill yellow / olive background */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active,
input:-internal-autofill-selected {
  -webkit-box-shadow: 0 0 0 1000px #0b0e15 inset !important;
  box-shadow: 0 0 0 1000px #0b0e15 inset !important;
  -webkit-text-fill-color: #ffffff !important;
  caret-color: #ffffff !important;
  color: #ffffff !important;
  background-color: #0b0e15 !important;
  border-color: rgba(255, 255, 255, 0.12) !important;
  transition: background-color 999999s ease-in-out 0s !important;
}

input:-webkit-autofill:focus {
  border-color: #f97316 !important;
  -webkit-box-shadow: 0 0 0 1000px #0b0e15 inset, 0 0 0 2px rgba(249, 115, 22, 0.16) !important;
  box-shadow: 0 0 0 1000px #0b0e15 inset, 0 0 0 2px rgba(249, 115, 22, 0.16) !important;
}

.wf-eye-toggle {
  position: absolute;
  right: 6px;
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  z-index: 2;
}

.wf-eye-toggle:hover {
  color: #fb923c;
  background: rgba(255, 255, 255, 0.06);
}

/* ── Modern Persistent Session Toggle ── */
.wf-session-toggle-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  outline: none;
  transition: all 0.15s ease;
  margin-top: -2px;
}

.wf-session-toggle-box:hover {
  background: rgba(255, 255, 255, 0.045);
  border-color: rgba(255, 255, 255, 0.12);
}

.wf-session-toggle-box:focus-visible {
  border-color: #f97316;
  box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
}

.wf-session-toggle-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.wf-session-shield-badge {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(249, 115, 22, 0.1);
  border: 1px solid rgba(249, 115, 22, 0.22);
  color: #fb923c;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.wf-session-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.wf-session-title {
  font-size: 0.77rem;
  font-weight: 700;
  color: #e2e8f0;
}

.wf-session-desc {
  font-size: 0.67rem;
  color: #64748b;
  font-weight: 500;
}

/* Modern iOS / SaaS Style Toggle Switch */
.wf-modern-switch {
  width: 38px;
  height: 22px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  transition: background-color 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, box-shadow 0.2s ease;
  flex-shrink: 0;
}

.wf-modern-switch-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.wf-modern-switch--active {
  background: #f97316;
  border-color: #ea580c;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
}

.wf-modern-switch--active .wf-modern-switch-thumb {
  transform: translateX(16px);
}

/* ── Primary Action Button (Matte Carbon Disabled / Vivid Wildfire Active / Liquid Tank Loading) ── */
.wf-action-btn {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 12px;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif;
  font-size: 0.92rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  margin-top: 4px;
  transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s ease, filter 0.18s ease, background 0.22s ease, border-color 0.22s ease, color 0.18s ease;
}

/* Disabled State: Clean matte carbon, no muddy brown */
.wf-action-btn:disabled:not(.wf-action-btn--loading) {
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #64748b;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
  filter: none;
}

/* Active State: Clean Wildfire Orange Fire (NO GLOW, Clean Depth) */
.wf-action-btn:not(:disabled):not(.wf-action-btn--loading) {
  background: linear-gradient(135deg, #ff6b00 0%, #f97316 55%, #ea580c 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  cursor: pointer;
  box-shadow:
    0 2px 5px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.wf-action-btn:not(:disabled):not(.wf-action-btn--loading):hover {
  transform: translateY(-1px);
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.32);
  filter: brightness(1.04);
}

.wf-action-btn:not(:disabled):not(.wf-action-btn--loading):active {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  filter: brightness(0.97);
}

/* Loading State: Button transforms into an empty matte graphite/carbon chamber */
.wf-action-btn.wf-action-btn--loading {
  background: #141822 !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  color: #ffffff !important;
  cursor: wait !important;
  box-shadow:
    inset 0 2px 5px rgba(0, 0, 0, 0.65),
    0 1px 2px rgba(0, 0, 0, 0.35) !important;
  transform: none !important;
  filter: none !important;
}

/* Liquid Loading Fluid Tank inside Button */
.wf-btn-liquid-tank {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
  pointer-events: none;
  background: transparent;
  z-index: 1;
}

/* Liquid Stream that fills up horizontally like a fluid loading bar */
.wf-liquid-stream {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #c2410c 0%, #ea580c 45%, #f97316 80%, #fb923c 100%);
  animation: wf-liquid-fill-progress 1.6s cubic-bezier(0.18, 0.89, 0.32, 1) forwards;
  will-change: width;
  overflow: hidden;
}

@keyframes wf-liquid-fill-progress {
  0% {
    width: 0%;
  }
  28% {
    width: 42%;
  }
  58% {
    width: 76%;
  }
  82% {
    width: 91%;
  }
  100% {
    width: 100%;
  }
}

/* Leading Wave Meniscus / Fluid Crest at the front edge */
.wf-liquid-front-crest {
  position: absolute;
  top: -15%;
  right: -8px;
  bottom: -15%;
  width: 18px;
  background: radial-gradient(ellipse at center, rgba(255, 237, 213, 0.75) 0%, rgba(249, 115, 22, 0.95) 55%, transparent 100%);
  border-radius: 50%;
  filter: blur(2px);
  animation: wf-crest-slosh 0.75s ease-in-out infinite alternate;
}

@keyframes wf-crest-slosh {
  0% {
    transform: scaleY(0.85) scaleX(0.9);
  }
  100% {
    transform: scaleY(1.2) scaleX(1.15);
  }
}

/* Internal Waves */
.wf-liquid-wave-svg {
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 200%;
  height: 115%;
  pointer-events: none;
  will-change: transform;
}

.wf-liquid-wave-svg--1 {
  fill: rgba(255, 255, 255, 0.22);
  animation: wf-wave-flow-1 2.2s linear infinite;
}

.wf-liquid-wave-svg--2 {
  fill: rgba(254, 215, 170, 0.28);
  animation: wf-wave-flow-2 3.4s linear infinite reverse;
}

@keyframes wf-wave-flow-1 {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes wf-wave-flow-2 {
  0%   { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}

/* Flow Sheen Sweep */
.wf-liquid-flow-sheen {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.24) 50%,
    transparent 100%
  );
  animation: wf-liquid-sheen-sweep 1.4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes wf-liquid-sheen-sweep {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.wf-btn-inner-content {
  position: relative;
  z-index: 5;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.75);
}

.wf-arrow-slide {
  transition: transform 0.15s ease;
}

.wf-action-btn:not(:disabled):hover .wf-arrow-slide {
  transform: translateX(3px);
}

.wf-rotate-spin {
  animation: wf-spin-spin 0.8s linear infinite;
}

@keyframes wf-spin-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* Console Footers */
.wf-form-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 8px;
}

.wf-form-footer--step2 {
  flex-direction: column;
  gap: 10px;
  padding-top: 4px;
}

.wf-security-footnote {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.69rem;
  color: #64748b;
  text-align: center;
}

.wf-sfoot-icon {
  color: #34d399;
  flex-shrink: 0;
}

.wf-back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
  font-size: 0.77rem;
  font-weight: 600;
  text-decoration: none;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.15s ease;
}

.wf-back-link:hover {
  color: #ffffff;
}

/* ── 2FA VERIFICATION STYLES ────────────────────────────────────────────── */
.wf-2fa-container {
  gap: 22px;
}

.wf-2fa-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
}

.wf-2fa-icon-frame {
  width: 58px;
  height: 58px;
  border-radius: 17px;
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.12) 0%, #0b0e15 100%);
  border: 1px solid rgba(249, 115, 22, 0.3);
  box-shadow: 0 10px 24px -4px rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.wf-2fa-shield-icon {
  color: #fb923c;
}

/* QR Code Setup Card */
.wf-qr-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.wf-qr-box {
  position: relative;
  display: inline-block;
  background: #ffffff;
  padding: 8px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
}

.wf-qr-image {
  display: block;
  border-radius: 4px;
}

.wf-qr-badge-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #ffffff;
  padding: 3px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.wf-secret-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.72rem;
  color: #94a3b8;
  flex-wrap: wrap;
  justify-content: center;
}

.wf-secret-label {
  color: #64748b;
}

.wf-secret-code {
  font-family: monospace;
  color: #fb923c;
  background: rgba(249, 115, 22, 0.1);
  padding: 2px 7px;
  border-radius: 5px;
  font-weight: 700;
  user-select: all;
}

.wf-copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  padding: 3px 8px;
  font-size: 0.68rem;
  color: #f1f5f9;
  cursor: pointer;
  transition: all 0.15s ease;
}

.wf-copy-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(249, 115, 22, 0.4);
  color: #fb923c;
}

/* ── 6-Digit Individual Cell Input ───────────────────────────────────────── */
.wf-digit-cells-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
}

.wf-digit-label {
  font-size: 0.74rem;
  font-weight: 650;
  color: #cbd5e1;
  text-align: center;
}

.wf-digit-grid {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.wf-digit-cell {
  width: 44px;
  height: 52px;
  border-radius: 12px;
  background: #0b0e15 !important;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #ffffff !important;
  font-size: 1.35rem;
  font-weight: 750;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", monospace;
  text-align: center;
  outline: none;
  box-sizing: border-box;
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

.wf-digit-cell:focus {
  border-color: #f97316 !important;
  box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2) !important;
  transform: translateY(-1px);
}

.wf-digit-cell--filled {
  border-color: rgba(249, 115, 22, 0.5);
  background: #0e1219 !important;
}

.wf-digit-hint {
  font-size: 0.68rem;
  color: #64748b;
  text-align: center;
}

.wf-2fa-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 4px;
}

.wf-secondary-ghost-btn {
  width: 100%;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 11px;
  color: #94a3b8;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.wf-secondary-ghost-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

/* ── RESPONSIVE DESIGN ─────────────────────────────────────────────────── */
@media (max-width: 960px) {
  .wf-card-grid {
    grid-template-columns: 1fr;
  }

  .wf-card-divider {
    display: none;
  }

  .wf-showcase-panel {
    padding: 32px 28px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    gap: 20px;
  }

  .wf-live-hub-stage {
    display: none;
  }

  .wf-showcase-headline {
    font-size: 1.35rem;
  }

  .wf-form-panel {
    padding: 32px 28px 36px;
  }

  .wf-digit-cell {
    width: 38px;
    height: 46px;
    font-size: 1.15rem;
  }
}

@media (max-width: 480px) {
  .wf-quick-staff-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 440px) {
  .wf-cyber-stage {
    padding: 16px 12px;
  }

  .wf-showcase-panel {
    padding: 24px 20px;
  }

  .wf-form-panel {
    padding: 24px 20px 28px;
  }

  .wf-telemetry-strip {
    padding: 10px 12px;
  }

  .wf-digit-cell {
    width: 34px;
    height: 42px;
    font-size: 1.05rem;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
