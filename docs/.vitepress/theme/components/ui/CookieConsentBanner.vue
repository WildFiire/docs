<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { Icon } from '@iconify/vue';

interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  savedAt: string;
}

const STORAGE_KEY = 'wf_cookie_consent_v1';

const isOpen = ref(false);
const modalOpen = ref(false);
const expandedSection = ref<string | null>(null);
const successPhase = ref<null | 'loading' | 'success' | 'closing'>(null);

const functional = ref(true);
const analytics = ref(true);
const marketing = ref(false);

function savePreferences(prefs: {
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}) {
  const payload: CookiePreferences = {
    essential: true,
    functional: prefs.functional,
    analytics: prefs.analytics,
    marketing: prefs.marketing,
    savedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {}
}

function saveWithAnimation(prefs: {
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}) {
  savePreferences(prefs);
  modalOpen.value = false;
  isOpen.value = true;
  successPhase.value = 'loading';

  setTimeout(() => {
    successPhase.value = 'success';
  }, 1100);

  setTimeout(() => {
    successPhase.value = 'closing';
  }, 2800);

  setTimeout(() => {
    successPhase.value = null;
    isOpen.value = false;
  }, 3200);
}

function handleAcceptAll() {
  functional.value = true;
  analytics.value = true;
  marketing.value = true;
  saveWithAnimation({ functional: true, analytics: true, marketing: true });
}

function handleRejectNonEssential() {
  functional.value = false;
  analytics.value = false;
  marketing.value = false;
  savePreferences({ functional: false, analytics: false, marketing: false });
  isOpen.value = false;
  modalOpen.value = false;
}

function handleSaveCustom() {
  saveWithAnimation({
    functional: functional.value,
    analytics: analytics.value,
    marketing: marketing.value,
  });
}

function toggleSection(sec: string) {
  expandedSection.value = expandedSection.value === sec ? null : sec;
}

function handleReopen() {
  isOpen.value = false;
  modalOpen.value = true;
}

watch(modalOpen, (val) => {
  if (typeof document !== 'undefined') {
    if (val) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
});

onMounted(() => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const timer = setTimeout(() => {
        isOpen.value = true;
      }, 1200);
    } else {
      const parsed: CookiePreferences = JSON.parse(stored);
      functional.value = parsed.functional ?? true;
      analytics.value = parsed.analytics ?? true;
      marketing.value = parsed.marketing ?? false;
    }
  } catch {
    isOpen.value = true;
  }

  window.addEventListener('wf-open-cookie-preferences', handleReopen);
});

onUnmounted(() => {
  window.removeEventListener('wf-open-cookie-preferences', handleReopen);
});
</script>

<template>
  <!-- FLOATING BOTTOM BANNER (normal + success states) -->
  <div
    v-if="(isOpen || successPhase) && !modalOpen"
    class="wf-cookie-banner-wrap"
    :class="{ 'wf-cookie-banner-wrap--closing': successPhase === 'closing' }"
    role="region"
    aria-label="Cookie &amp; Confidentialitate"
  >
    <div
      class="wf-cookie-banner"
      :class="successPhase ? `wf-cookie-banner--${successPhase}` : ''"
    >
      <!-- SUCCESS / LOADING continuous seamless card -->
      <div
        v-if="successPhase"
        class="wf-cookie-inline-success"
        :class="`wf-cookie-inline-success--${successPhase}`"
        role="status"
        aria-live="polite"
      >
        <div class="wf-cookie-success-glow" aria-hidden="true" />

        <div
          class="wf-cookie-success-ring"
          :class="`wf-cookie-success-ring--${successPhase}`"
          aria-hidden="true"
        >
          <svg viewBox="0 0 56 56" class="wf-cookie-ring-svg">
            <circle class="wf-cookie-ring-bg" cx="28" cy="28" r="23" />
            <circle class="wf-cookie-ring-fill" cx="28" cy="28" r="23" />
          </svg>

          <Icon icon="lucide:shield-check" width="22" class="wf-cookie-icon-shield" />
          <Icon icon="lucide:check" width="24" class="wf-cookie-icon-check" />

          <div v-if="successPhase === 'success'" class="wf-cookie-particles-box">
            <span
              v-for="i in 8"
              :key="i"
              class="wf-cookie-particle"
              :class="`wf-cookie-particle--${i - 1}`"
            />
          </div>
        </div>

        <div class="wf-cookie-inline-text">
          <span
            class="wf-cookie-success-title"
            :class="{ 'wf-cookie-success-title--success': successPhase === 'success' }"
          >
            {{ successPhase === 'loading' ? 'Salvăm preferințele...' : 'Preferințe Salvate!' }}
          </span>

          <div v-if="successPhase === 'loading'" class="wf-cookie-success-bar">
            <div class="wf-cookie-success-bar-fill" />
          </div>
          <span v-else class="wf-cookie-success-sublabel">
            Experiența ta WildFire a fost personalizată.
          </span>
        </div>
      </div>

      <!-- Normal Content State -->
      <template v-else>
        <div class="wf-cookie-banner-content">
          <div class="wf-cookie-banner-header">
            <div class="wf-cookie-icon-box">
              <Icon icon="lucide:cookie" width="17" />
            </div>
            <div>
              <h4 class="wf-cookie-title">Confidențialitate &amp; Tehnologii de Stocare</h4>
              <div class="wf-cookie-gdpr-tag">
                <Icon icon="lucide:shield-check" width="11" />
                <span>Conform GDPR &amp; Directiva ePrivacy UE</span>
              </div>
            </div>
          </div>

          <p class="wf-cookie-description">
            Utilizăm module cookie și stocare locală pentru a îmbunătăți performanța platformei,
            a reține preferințele de navigare (dark/light) și a genera statistici anonime despre
            articolele consultate. Cookie-urile funcționale sunt esențiale pentru rularea documentației.
          </p>
        </div>

        <div class="wf-cookie-banner-actions">
          <button
            type="button"
            id="cookie-customize-btn"
            class="wf-cookie-btn wf-cookie-btn--secondary"
            @click="modalOpen = true"
          >
            <Icon icon="lucide:sliders-horizontal" width="13" />
            <span>Personalizează</span>
          </button>

          <button
            type="button"
            id="cookie-reject-btn"
            class="wf-cookie-btn wf-cookie-btn--ghost"
            @click="handleRejectNonEssential"
          >
            <span>Doar Necesare</span>
          </button>

          <button
            type="button"
            id="cookie-accept-btn"
            class="wf-cookie-btn wf-cookie-btn--primary"
            @click="handleAcceptAll"
          >
            <Icon icon="lucide:check" width="13" />
            <span>Accept Toate</span>
          </button>
        </div>
      </template>
    </div>
  </div>

  <!-- DETAILED PREFERENCES MODAL -->
  <div v-if="modalOpen" class="wf-cookie-modal-overlay" role="dialog" aria-modal="true">
    <div class="wf-cookie-modal">
      <div class="wf-cookie-modal-header">
        <div class="wf-cookie-modal-title-group">
          <div class="wf-cookie-modal-icon">
            <Icon icon="lucide:shield-check" width="22" />
          </div>
          <div>
            <h3 class="wf-cookie-modal-title">Preferințe Confidențialitate &amp; Cookie-uri</h3>
            <p class="wf-cookie-modal-subtitle">
              Personalizează ce categorii de date și cookie-uri permiți pe acest dispozitiv.
            </p>
          </div>
        </div>

        <button
          type="button"
          class="wf-cookie-modal-close"
          title="Închide"
          @click="modalOpen = false"
        >
          <Icon icon="lucide:x" width="16" />
        </button>
      </div>

      <div class="wf-cookie-categories-list">
        <!-- 1. Essential -->
        <div
          class="wf-cookie-cat-card"
          :class="{ 'wf-cookie-cat-card--expanded': expandedSection === 'essential' }"
        >
          <div class="wf-cookie-cat-header" @click="toggleSection('essential')">
            <div class="wf-cookie-cat-left">
              <div class="wf-cookie-cat-icon wf-cookie-cat-icon--green">
                <Icon icon="lucide:lock" width="15" />
              </div>
              <div class="wf-cookie-cat-info">
                <div class="wf-cookie-cat-title-row">
                  <span class="wf-cookie-cat-title">Esențiale &amp; Securitate</span>
                  <span class="wf-cookie-badge wf-cookie-badge--required">MANDATORIU</span>
                </div>
                <span class="wf-cookie-cat-sub">Sesiuni, protecție CSRF și randare pagini</span>
              </div>
            </div>

            <div class="wf-cookie-cat-right">
              <div class="wf-cookie-toggle wf-cookie-toggle--locked" title="Permanent activ">
                <span class="wf-cookie-toggle-thumb wf-cookie-toggle-thumb--on" />
              </div>
              <button type="button" class="wf-cookie-expand-btn">
                <Icon
                  :icon="expandedSection === 'essential' ? 'lucide:chevron-up' : 'lucide:chevron-down'"
                  width="14"
                />
              </button>
            </div>
          </div>

          <div v-if="expandedSection === 'essential'" class="wf-cookie-cat-details">
            <p>
              Aceste tehnologii sunt strict necesare pentru funcționarea securizată a platformei Wildfire Docs.
              Includ sesiunile de autentificare securizate ale echipei administrative, cheile de sesiune
              anti-CSRF și mecanismul de protecție împotriva atacurilor DDoS.
            </p>
            <div class="wf-cookie-tech-pill">
              <span>Exemple:</span>
              <code>wf_admin_session</code>
              <code>wf_csrf_token</code>
              <code>data-theme</code>
            </div>
          </div>
        </div>

        <!-- 2. Functional -->
        <div
          class="wf-cookie-cat-card"
          :class="{ 'wf-cookie-cat-card--expanded': expandedSection === 'functional' }"
        >
          <div class="wf-cookie-cat-header" @click="toggleSection('functional')">
            <div class="wf-cookie-cat-left">
              <div class="wf-cookie-cat-icon wf-cookie-cat-icon--orange">
                <Icon icon="lucide:layers" width="15" />
              </div>
              <div class="wf-cookie-cat-info">
                <div class="wf-cookie-cat-title-row">
                  <span class="wf-cookie-cat-title">Funcționale &amp; Preferințe UI</span>
                  <span class="wf-cookie-badge wf-cookie-badge--recommended">RECOMANDAT</span>
                </div>
                <span class="wf-cookie-cat-sub">Păstrare Dark Mode, poziție sidebar și istoric căutare</span>
              </div>
            </div>

            <div class="wf-cookie-cat-right">
              <button
                type="button"
                role="switch"
                :aria-checked="functional"
                class="wf-cookie-toggle"
                :class="{ 'wf-cookie-toggle--on': functional }"
                @click.stop="functional = !functional"
              >
                <span class="wf-cookie-toggle-thumb" />
              </button>
              <button
                type="button"
                class="wf-cookie-expand-btn"
                @click.stop="toggleSection('functional')"
              >
                <Icon
                  :icon="expandedSection === 'functional' ? 'lucide:chevron-up' : 'lucide:chevron-down'"
                  width="14"
                />
              </button>
            </div>
          </div>

          <div v-if="expandedSection === 'functional'" class="wf-cookie-cat-details">
            <p>
              Permit reținerea setărilor tale vizuale pentru a nu le reconfigura la fiecare accesare:
              starea extinsă/restrânsă a capitolelor din documentație, istoricul căutărilor recente
              și preferința de layout.
            </p>
            <div class="wf-cookie-tech-pill">
              <span>Stocare:</span>
              <code>localStorage.theme</code>
              <code>wf_search_recent</code>
              <code>wf_sidebar_state</code>
            </div>
          </div>
        </div>

        <!-- 3. Analytics -->
        <div
          class="wf-cookie-cat-card"
          :class="{ 'wf-cookie-cat-card--expanded': expandedSection === 'analytics' }"
        >
          <div class="wf-cookie-cat-header" @click="toggleSection('analytics')">
            <div class="wf-cookie-cat-left">
              <div class="wf-cookie-cat-icon wf-cookie-cat-icon--purple">
                <Icon icon="lucide:activity" width="15" />
              </div>
              <div class="wf-cookie-cat-info">
                <div class="wf-cookie-cat-title-row">
                  <span class="wf-cookie-cat-title">Analitice &amp; Telemetrie Docs</span>
                  <span class="wf-cookie-badge wf-cookie-badge--analytics">PERFORMANȚĂ</span>
                </div>
                <span class="wf-cookie-cat-sub">Contorizare vizualizări pagini și acoperire căutare</span>
              </div>
            </div>

            <div class="wf-cookie-cat-right">
              <button
                type="button"
                role="switch"
                :aria-checked="analytics"
                class="wf-cookie-toggle"
                :class="{ 'wf-cookie-toggle--on': analytics }"
                @click.stop="analytics = !analytics"
              >
                <span class="wf-cookie-toggle-thumb" />
              </button>
              <button
                type="button"
                class="wf-cookie-expand-btn"
                @click.stop="toggleSection('analytics')"
              >
                <Icon
                  :icon="expandedSection === 'analytics' ? 'lucide:chevron-up' : 'lucide:chevron-down'"
                  width="14"
                />
              </button>
            </div>
          </div>

          <div v-if="expandedSection === 'analytics'" class="wf-cookie-cat-details">
            <p>
              Ne ajută să înțelegem ce articole sunt cele mai citite și ce subiecte caută jucătorii
              fără a găsi rezultate (Search Content Gaps). Datele sunt agregate anonim, fără colectare de date personale cu caracter sensibil.
            </p>
            <div class="wf-cookie-tech-pill">
              <span>Servicii:</span>
              <code>doc_views (Supabase)</code>
              <code>search-analytics</code>
            </div>
          </div>
        </div>

        <!-- 4. Marketing -->
        <div
          class="wf-cookie-cat-card"
          :class="{ 'wf-cookie-cat-card--expanded': expandedSection === 'marketing' }"
        >
          <div class="wf-cookie-cat-header" @click="toggleSection('marketing')">
            <div class="wf-cookie-cat-left">
              <div class="wf-cookie-cat-icon wf-cookie-cat-icon--orange">
                <Icon icon="lucide:megaphone" width="15" />
              </div>
              <div class="wf-cookie-cat-info">
                <div class="wf-cookie-cat-title-row">
                  <span class="wf-cookie-cat-title">Marketing &amp; Embed-uri Media</span>
                  <span class="wf-cookie-badge wf-cookie-badge--optional">OPȚIONAL</span>
                </div>
                <span class="wf-cookie-cat-sub">Embed-uri video YouTube/Twitch și preview-uri externe</span>
              </div>
            </div>

            <div class="wf-cookie-cat-right">
              <button
                type="button"
                role="switch"
                :aria-checked="marketing"
                class="wf-cookie-toggle"
                :class="{ 'wf-cookie-toggle--on': marketing }"
                @click.stop="marketing = !marketing"
              >
                <span class="wf-cookie-toggle-thumb" />
              </button>
              <button
                type="button"
                class="wf-cookie-expand-btn"
                @click.stop="toggleSection('marketing')"
              >
                <Icon
                  :icon="expandedSection === 'marketing' ? 'lucide:chevron-up' : 'lucide:chevron-down'"
                  width="14"
                />
              </button>
            </div>
          </div>

          <div v-if="expandedSection === 'marketing'" class="wf-cookie-cat-details">
            <p>
              Permite încărcarea conținutului multimedia extern integrat în ghiduri (videoclipuri demonstrative
              de pe YouTube sau stream-uri Twitch). Fără acest acord, embed-urile externe vor fi blocate.
            </p>
            <div class="wf-cookie-tech-pill">
              <span>Integrări:</span>
              <code>YouTube Embeds</code>
              <code>Twitch Streams</code>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer Actions -->
      <div class="wf-cookie-modal-footer">
        <div class="wf-cookie-footer-note">
          <span class="wf-cookie-note-icon">
            <Icon icon="lucide:shield-check" width="13" />
          </span>
          <span>Preferințele sunt salvate local timp de <strong>12 luni</strong>.</span>
        </div>

        <div class="wf-cookie-footer-buttons">
          <button
            type="button"
            class="wf-cookie-btn wf-cookie-btn--ghost"
            @click="handleRejectNonEssential"
          >
            Doar Necesare
          </button>
          <button
            type="button"
            class="wf-cookie-btn wf-cookie-btn--secondary"
            @click="handleSaveCustom"
          >
            Salvează Preferințele
          </button>
          <button
            type="button"
            class="wf-cookie-btn wf-cookie-btn--primary"
            @click="handleAcceptAll"
          >
            Accept Toate
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
