<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vitepress';
import { Icon } from '@iconify/vue';
import { api } from '../../composables/useApi';
import DocReportModal from '../Docs/DocReportModal.vue';

interface FeedbackStats {
  helpful: number;
  unhelpful: number;
  total: number;
  percentage: number;
}

const props = defineProps<{
  slug?: string;
  initialStats?: FeedbackStats;
}>();

const route = useRoute();

const cleanSlug = computed(() => {
  return (props.slug || route.path)
    .replace(/^\/+|\/+$/g, '')
    .replace(/\.html$/, '');
});

const voted = ref<'helpful' | 'unhelpful' | null>(null);
const feedbackId = ref<string | null>(null);
const showCommentBox = ref<boolean>(false);
const comment = ref<string>('');
const submitting = ref<boolean>(false);
const commentSent = ref<boolean>(false);
const reportModalOpen = ref<boolean>(false);
const modalTab = ref<'issue' | 'request'>('issue');
const stats = ref<FeedbackStats>(
  props.initialStats || { helpful: 0, unhelpful: 0, total: 0, percentage: 100 }
);

async function loadStats() {
  if (!cleanSlug.value) return;
  try {
    const data = await api(`/api/docs/feedback?slug=${encodeURIComponent(cleanSlug.value)}`);
    if (data?.stats) {
      stats.value = data.stats;
    }
  } catch {}
}

onMounted(() => {
  if (!cleanSlug.value || typeof window === 'undefined') return;
  const localVote = localStorage.getItem(`wf_voted_${cleanSlug.value}`) as 'helpful' | 'unhelpful' | null;
  const localFbId = localStorage.getItem(`wf_fbid_${cleanSlug.value}`);
  if (localVote) voted.value = localVote;
  if (localFbId) feedbackId.value = localFbId;

  loadStats();

  const handleOpenReport = (e: any) => {
    if (e?.detail?.tab) {
      modalTab.value = e.detail.tab;
    }
    reportModalOpen.value = true;
  };

  window.addEventListener('open-doc-report', handleOpenReport);
});

async function handleVote(rating: 'helpful' | 'unhelpful') {
  if (!cleanSlug.value || submitting.value) return;

  voted.value = rating;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(`wf_voted_${cleanSlug.value}`, rating);
  }
  showCommentBox.value = true;

  try {
    const res = await api('/api/docs/feedback', {
      slug: cleanSlug.value,
      rating,
    });
    if (res?.feedback?.id) {
      feedbackId.value = res.feedback.id;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(`wf_fbid_${cleanSlug.value}`, res.feedback.id);
      }
    }
    if (res?.stats) {
      stats.value = res.stats;
    }
  } catch (err) {
    console.error('Failed to submit vote', err);
  }
}

async function handleSendComment() {
  if (!cleanSlug.value || !comment.value.trim() || submitting.value) return;

  submitting.value = true;
  try {
    const res = await api('/api/docs/feedback', {
      slug: cleanSlug.value,
      rating: voted.value || 'helpful',
      comment: comment.value.trim(),
      feedbackId: feedbackId.value || undefined,
    });
    if (res && !res.error) {
      commentSent.value = true;
      showCommentBox.value = false;
    }
  } catch (err) {
    console.error('Failed to submit comment', err);
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="feedback-liquid-wrapper" aria-label="Feedback documentație">
    <div class="feedback-liquid-card">
      <!-- Glow Specular Aura -->
      <div class="feedback-liquid-glow" aria-hidden="true" />

      <!-- Top Header Row -->
      <div class="feedback-liquid-header">
        <div class="feedback-liquid-left">
          <div class="feedback-liquid-icon-box">
            <Icon icon="lucide:flame" width="16" class="feedback-flame-icon" />
          </div>

          <div class="feedback-liquid-title-group">
            <div class="feedback-liquid-title-row">
              <span class="feedback-liquid-title">A fost util acest ghid?</span>
              <span class="feedback-liquid-pill-tag">Feedback Comunitate</span>
            </div>
            <p class="feedback-liquid-subtitle">
              Părerea ta ajută echipa WildFire să mențină informațiile la zi.
            </p>
          </div>
        </div>

        <!-- Real Community Rating Pill -->
        <div
          v-if="stats.total > 0"
          class="feedback-liquid-stats-pill"
          :title="`${stats.helpful} din ${stats.total} voturi pozitive`"
        >
          <span class="feedback-liquid-stats-dot" />
          <span class="feedback-liquid-stats-pct font-mono">{{ stats.percentage }}% util</span>
          <span class="feedback-liquid-stats-count font-mono">({{ stats.total }} {{ stats.total === 1 ? 'vot' : 'voturi' }})</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div v-if="!voted" class="feedback-liquid-actions">
        <button
          type="button"
          class="feedback-liquid-btn feedback-liquid-btn--yes"
          aria-label="Marchează ghidul ca util"
          @click="handleVote('helpful')"
        >
          <span class="feedback-btn-icon-wrap feedback-btn-icon-wrap--emerald">
            <Icon icon="lucide:thumbs-up" width="14" />
          </span>
          <span class="feedback-btn-text">Da, foarte util</span>
        </button>

        <button
          type="button"
          class="feedback-liquid-btn feedback-liquid-btn--no"
          aria-label="Marchează ghidul ca necesitând îmbunătățiri"
          @click="handleVote('unhelpful')"
        >
          <span class="feedback-btn-icon-wrap feedback-btn-icon-wrap--rose">
            <Icon icon="lucide:thumbs-down" width="14" />
          </span>
          <span class="feedback-btn-text">Nu, am nevoie de detalii</span>
        </button>
      </div>

      <div v-else class="feedback-liquid-voted-banner">
        <div class="feedback-liquid-thanks-box">
          <Icon icon="lucide:check-circle-2" width="16" class="text-emerald-400" />
          <span>
            {{
              voted === 'helpful'
                ? 'Mulțumim! Votul tău pozitiv a fost salvat.'
                : 'Mulțumim! Am înregistrat votul și vom actualiza acest ghid.'
            }}
          </span>
        </div>
      </div>

      <!-- Optional Comment / Suggestion Box -->
      <form v-if="showCommentBox && !commentSent" class="feedback-liquid-form" @submit.prevent="handleSendComment">
        <div class="feedback-liquid-form-header">
          <Icon icon="lucide:message-square" width="13" class="text-cyan-400" />
          <span>Ce putem adăuga sau clarifica în acest document? (opțional)</span>
        </div>

        <div class="feedback-liquid-input-row">
          <textarea
            v-model="comment"
            placeholder="Ex: Adăugați o comandă suplimentară sau clarificați durata..."
            rows="2"
            class="feedback-liquid-textarea"
            maxlength="400"
          />
          <button
            type="submit"
            :disabled="submitting || !comment.trim()"
            class="feedback-liquid-submit-btn"
            title="Trimite feedback-ul"
          >
            <Icon icon="lucide:send" width="13" />
            <span>Trimite</span>
          </button>
        </div>
      </form>

      <div v-if="commentSent" class="feedback-liquid-success-box">
        <Icon icon="lucide:sparkles" width="14" class="text-amber-400" />
        <span>Sugestia ta a fost trimisă cu succes către echipa de documentație!</span>
      </div>

      <!-- Bottom Report / Request Action Link Bar -->
      <div class="feedback-liquid-report-footer">
        <div class="feedback-report-pills-cluster">
          <button
            type="button"
            class="feedback-report-pill-btn feedback-report-pill-btn--issue"
            aria-label="Raportează o problemă sau eroare în acest ghid"
            @click="modalTab = 'issue'; reportModalOpen = true;"
          >
            <Icon icon="lucide:alert-triangle" width="12" class="feedback-pill-icon feedback-pill-icon--amber" />
            <span>Raportează o eroare în ghid</span>
          </button>

          <span class="feedback-report-cluster-sep" aria-hidden="true" />

          <button
            type="button"
            class="feedback-report-pill-btn feedback-report-pill-btn--request"
            aria-label="Solicită un ghid nou pentru comunitate"
            @click="modalTab = 'request'; reportModalOpen = true;"
          >
            <Icon icon="lucide:file-plus" width="12" class="feedback-pill-icon feedback-pill-icon--cyan" />
            <span>Solicită ghid nou</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Interactive Liquid Glass Report Modal -->
    <DocReportModal
      :is-open="reportModalOpen"
      :current-slug="cleanSlug"
      :initial-tab="modalTab"
      @close="reportModalOpen = false"
    />
  </div>
</template>

<style scoped>
.text-amber-400 { color: hsl(38 92% 50%); }
.text-cyan-400 { color: hsl(190 95% 45%); }
.text-emerald-400 { color: hsl(158 84% 45%); }
</style>
