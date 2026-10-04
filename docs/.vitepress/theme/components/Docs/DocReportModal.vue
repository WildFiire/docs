<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';
import { api } from '../../composables/useApi';

const props = withDefaults(
  defineProps<{
    isOpen: boolean;
    currentSlug?: string;
    initialTab?: 'issue' | 'request';
  }>(),
  {
    isOpen: false,
    currentSlug: '',
    initialTab: 'issue',
  }
);

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const ISSUE_TYPES = [
  { id: 'unclear_command', label: 'Comandă Neclară / Greșită', icon: 'lucide:alert-triangle', color: '#f59e0b' },
  { id: 'broken_link', label: 'Link Rupt / 404', icon: 'lucide:link-2', color: '#f43f5e' },
  { id: 'outdated_info', label: 'Informații Învechite', icon: 'lucide:clock', color: '#ff6b00' },
  { id: 'typo', label: 'Greșeală Text / Formatare', icon: 'lucide:file-text', color: '#06b6d4' },
  { id: 'missing_media', label: 'Lipsă Imagine / Schemă', icon: 'lucide:image', color: '#8b5cf6' },
  { id: 'other', label: 'Altă Problemă', icon: 'lucide:help-circle', color: '#10b981' },
];

const GUIDE_CATEGORIES = [
  { id: 'systems', label: 'Sisteme Jucători', color: '#06b6d4' },
  { id: 'factions', label: 'Facțiuni & Organizații', color: '#10b981' },
  { id: 'rules', label: 'Regulamente & Conduită', color: '#f59e0b' },
  { id: 'staff', label: 'Proceduri Staff', color: '#8b5cf6' },
  { id: 'economy', label: 'Economie & Joburi', color: '#eab308' },
  { id: 'other', label: 'Alte Sisteme', color: '#64748b' },
];

const activeTab = ref<'issue' | 'request'>(props.initialTab);
const issueType = ref<string>('unclear_command');
const category = ref<string>('systems');
const severity = ref<'normal' | 'medium' | 'high'>('normal');
const title = ref<string>('');
const description = ref<string>('');
const contactDiscord = ref<string>('');
const submitting = ref<boolean>(false);
const submitted = ref<boolean>(false);
const error = ref<string | null>(null);

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      activeTab.value = props.initialTab;
      error.value = null;
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'hidden';
      }
    } else {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    }
  }
);

function handleResetAndClose() {
  submitted.value = false;
  description.value = '';
  title.value = '';
  contactDiscord.value = '';
  error.value = null;
  emit('close');
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.isOpen) {
    handleResetAndClose();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeyDown);
    document.body.style.overflow = '';
  }
});

async function handleSubmit() {
  if (!description.value.trim() || submitting.value) return;

  submitting.value = true;
  error.value = null;

  try {
    const res = await api('/api/docs/report', {
      type: activeTab.value === 'request' ? 'new_guide_request' : 'issue',
      slug: props.currentSlug || 'general',
      issueType: activeTab.value === 'issue' ? issueType.value : undefined,
      category: activeTab.value === 'request' ? category.value : undefined,
      severity: activeTab.value === 'issue' ? severity.value : undefined,
      title: activeTab.value === 'request' ? title.value : undefined,
      description: description.value.trim(),
      contactDiscord: contactDiscord.value.trim() || undefined,
    });

    if (res && !res.error) {
      submitted.value = true;
    } else {
      error.value = res?.error || 'A apărut o eroare la trimitere.';
    }
  } catch {
    error.value = 'Conexiunea cu serverul a eșuat.';
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <Teleport to="body" v-if="isOpen">
    <div class="doc-report-overlay" @click="handleResetAndClose">
      <div
        class="doc-report-modal"
        role="dialog"
        aria-modal="true"
        @click.stop
      >
        <div class="doc-report-glow" aria-hidden="true" />

        <!-- Modal Header -->
        <div class="doc-report-header">
          <div class="doc-report-header-title-box">
            <div class="doc-report-header-icon-wrap">
              <Icon
                v-if="activeTab === 'issue'"
                icon="lucide:alert-triangle"
                width="18"
                class="text-amber-400"
              />
              <Icon
                v-else
                icon="lucide:file-plus"
                width="18"
                class="text-cyan-400"
              />
            </div>
            <div>
              <h3 class="doc-report-title">
                {{ activeTab === 'issue' ? 'Raportează o Problemă în Ghid' : 'Solicită un Ghid Nou' }}
              </h3>
              <p class="doc-report-sub">
                {{
                  activeTab === 'issue'
                    ? `Document: ${currentSlug ? `/${currentSlug}` : 'Ghid Curent'}`
                    : 'Sugerează un subiect sau o mecanică lipsă din documentație'
                }}
              </p>
            </div>
          </div>

          <button
            type="button"
            class="doc-report-close-btn"
            aria-label="Închide fereastra"
            @click="handleResetAndClose"
          >
            <Icon icon="lucide:x" width="16" />
          </button>
        </div>

        <!-- Tabs: Issue vs Request -->
        <div class="doc-report-tabs">
          <button
            type="button"
            class="doc-report-tab-btn"
            :class="{ 'doc-report-tab-btn--active': activeTab === 'issue' }"
            @click="activeTab = 'issue'; error = null;"
          >
            <Icon icon="lucide:alert-triangle" width="14" class="text-amber-400" />
            <span>Raportează Eroare</span>
          </button>
          <button
            type="button"
            class="doc-report-tab-btn"
            :class="{ 'doc-report-tab-btn--active': activeTab === 'request' }"
            @click="activeTab = 'request'; error = null;"
          >
            <Icon icon="lucide:file-plus" width="14" class="text-cyan-400" />
            <span>Solicită Ghid Nou</span>
          </button>
        </div>

        <!-- Submitted View -->
        <div v-if="submitted" class="doc-report-success-view">
          <div class="doc-report-success-icon-wrap">
            <Icon icon="lucide:check-circle-2" width="32" class="text-emerald-400" />
          </div>
          <h4 class="doc-report-success-title">
            {{ activeTab === 'issue' ? 'Raport Înregistrat cu Succes!' : 'Cerere Trimisă cu Succes!' }}
          </h4>
          <p class="doc-report-success-desc">
            Îți mulțumim pentru contribuție! Echipa de documentație a fost notificată și va analiza solicitarea în cel mai scurt timp.
          </p>
          <button
            type="button"
            class="doc-report-submit-action"
            style="margin-top: 12px"
            @click="handleResetAndClose"
          >
            Închide
          </button>
        </div>

        <!-- Form View -->
        <form v-else class="doc-report-form" @submit.prevent="handleSubmit">
          <div v-if="error" class="admin-status-message admin-status-message--error" style="margin-bottom: 8px">
            <Icon icon="lucide:shield-alert" width="14" />
            <span>{{ error }}</span>
          </div>

          <!-- TAB 1: Issue Report Fields -->
          <template v-if="activeTab === 'issue'">
            <div class="doc-report-section">
              <label class="doc-report-label">Tipul Problemei *</label>
              <div class="doc-report-pills-grid">
                <button
                  v-for="t in ISSUE_TYPES"
                  :key="t.id"
                  type="button"
                  class="doc-report-pill-choice"
                  :class="{ 'doc-report-pill-choice--active': issueType === t.id }"
                  :style="issueType === t.id ? { borderColor: t.color, color: t.color, background: `${t.color}15` } : {}"
                  @click="issueType = t.id"
                >
                  <Icon :icon="t.icon" width="13" :style="{ color: t.color }" />
                  <span>{{ t.label }}</span>
                </button>
              </div>
            </div>

            <div class="doc-report-severity-row">
              <label class="doc-report-label">Nivel Severitate:</label>
              <div class="doc-report-severity-btns">
                <button
                  type="button"
                  class="doc-report-sev-btn doc-report-sev-btn--normal"
                  :class="{ active: severity === 'normal' }"
                  @click="severity = 'normal'"
                >
                  Normal
                </button>
                <button
                  type="button"
                  class="doc-report-sev-btn doc-report-sev-btn--medium"
                  :class="{ active: severity === 'medium' }"
                  @click="severity = 'medium'"
                >
                  Moderat
                </button>
                <button
                  type="button"
                  class="doc-report-sev-btn doc-report-sev-btn--high"
                  :class="{ active: severity === 'high' }"
                  @click="severity = 'high'"
                >
                  Critic
                </button>
              </div>
            </div>
          </template>

          <!-- TAB 2: Guide Request Fields -->
          <template v-if="activeTab === 'request'">
            <div class="doc-report-section">
              <label class="doc-report-label">Categorie Ghid Solicitat *</label>
              <div class="doc-report-pills-grid">
                <button
                  v-for="cat in GUIDE_CATEGORIES"
                  :key="cat.id"
                  type="button"
                  class="doc-report-pill-choice"
                  :class="{ 'doc-report-pill-choice--active': category === cat.id }"
                  :style="category === cat.id ? { borderColor: cat.color, color: cat.color, background: `${cat.color}15` } : {}"
                  @click="category = cat.id"
                >
                  <Icon icon="lucide:layers" width="13" :style="{ color: cat.color }" />
                  <span>{{ cat.label }}</span>
                </button>
              </div>
            </div>

            <div class="doc-report-field">
              <label class="doc-report-label">Titlul Propus pentru Ghid</label>
              <input
                v-model="title"
                type="text"
                placeholder="Ex: Cum funcționează sistemul de transferuri bancare"
                class="doc-report-input"
                maxlength="100"
              />
            </div>
          </template>

          <!-- Description Field -->
          <div class="doc-report-field">
            <label class="doc-report-label">
              {{ activeTab === 'issue' ? 'Descrierea Erorii sau a Inexactității *' : 'Ce ar trebui să cuprindă acest ghid? *' }}
            </label>
            <textarea
              v-model="description"
              required
              rows="3"
              :placeholder="
                activeTab === 'issue'
                  ? 'Specifică exact comanda, secțiunea sau textul care conține erori...'
                  : 'Descrie pe scurt detaliile și mecanicile pe care dorești să le explicăm...'
              "
              class="doc-report-textarea"
              maxlength="800"
            />
          </div>

          <!-- Contact Discord -->
          <div class="doc-report-field">
            <label class="doc-report-label">
              Tag / Username Discord (Opțional — pentru clarificări dacă este nevoie)
            </label>
            <input
              v-model="contactDiscord"
              type="text"
              placeholder="Ex: player#0001 sau username"
              class="doc-report-input"
              maxlength="50"
            />
          </div>

          <!-- Modal Actions -->
          <div class="doc-report-actions">
            <button
              type="button"
              class="doc-report-cancel-btn"
              @click="handleResetAndClose"
            >
              Anulează
            </button>
            <button
              type="submit"
              :disabled="submitting || !description.trim()"
              class="doc-report-submit-action"
            >
              <Icon icon="lucide:send" width="13" />
              <span>{{ submitting ? 'Se trimite...' : 'Trimite Către Echipă' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.text-amber-400 { color: hsl(38 92% 50%); }
.text-cyan-400 { color: hsl(190 95% 45%); }
.text-emerald-400 { color: hsl(158 84% 45%); }
</style>
