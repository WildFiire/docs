<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useData, useRoute } from 'vitepress';
import { Icon } from '@iconify/vue';
import { api } from '../../composables/useApi';
import { consent } from '../../composables/useConsent';
import Modal from '../ui/Modal.vue';
const route = useRoute(),
  { page } = useData();
const slug = computed(() =>
  route.path
    .replace(/^\//, '')
    .replace(/\.html$/, '')
    .replace(/\/$/, '/index'),
);
const report = ref(false),
  description = ref(''),
  issue = ref('unclear_command'),
  comment = ref(''),
  message = ref(''),
  summary = ref<any>(null),
  busy = ref(false),
  selection = ref('');
function ask(text: string) {
  window.dispatchEvent(new CustomEvent('wf-ask-ai', { detail: { text } }));
}
async function vote(rating: string) {
  try {
    await api('/api/docs/feedback', { slug: slug.value, rating, comment: comment.value });
    message.value = 'Mulțumim pentru feedback.';
  } catch (e: any) {
    message.value = e.message;
  }
}
async function sendReport() {
  try {
    await api('/api/docs/report', {
      type: 'issue',
      slug: slug.value,
      issueType: issue.value,
      description: description.value,
    });
    report.value = false;
    message.value = 'Raportul a fost trimis.';
  } catch (e: any) {
    message.value = e.message;
  }
}
async function summarize() {
  busy.value = true;
  try {
    const result = await api('/api/ai-helper/summary', {
      docSlug: slug.value,
      docTitle: page.value.title,
      rawContent: document.querySelector('.vp-doc')?.textContent || '',
    });
    summary.value = result.summary;
  } catch (e: any) {
    message.value = e.message;
  } finally {
    busy.value = false;
  }
}
function copyLink() {
  navigator.clipboard
    .writeText(location.href)
    .then(() => (message.value = 'Link copiat.'))
    .catch(() => (message.value = 'Copierea nu este disponibilă.'));
}
function select() {
  const sel = window.getSelection();
  selection.value = sel?.anchorNode?.parentElement?.closest('.vp-doc')
    ? sel.toString().trim().slice(0, 1200)
    : '';
}
const tracked = new Set<string>();
watch([() => consent.analytics, slug], async ([allowed, current]) => {
  if (!allowed || typeof window === 'undefined' || tracked.has(String(current))) return;
  tracked.add(String(current));
  try {
    await api('/api/analytics/view', { slug: current });
  } catch {}
});
watch(slug, () => {
  summary.value = null;
  message.value = '';
  selection.value = '';
});
onMounted(() => document.addEventListener('selectionchange', select));
onUnmounted(() => document.removeEventListener('selectionchange', select));
</script>
<template>
  <section class="doc-tools">
    <div class="doc-quick-actions">
      <button type="button" @click="copyLink"><Icon icon="lucide:link" />Copiază linkul</button
      ><button type="button" @click="report = true"><Icon icon="lucide:flag" />Raportează</button
      ><button type="button" @click="summarize" :disabled="busy">
        <Icon icon="lucide:sparkles" />Rezumat AI
      </button>
    </div>
    <div v-if="summary" class="glass-panel">
      <h3>Pe scurt</h3>
      <p>{{ summary.summary || summary.overview }}</p>
      <ul>
        <li v-for="line in summary.keyTakeaways || summary.takeaways || []" :key="line">
          {{ line }}
        </li>
      </ul>
      <h4 v-if="summary.commands?.length">Comenzi</h4>
      <code v-for="command in summary.commands || []" :key="command">{{ command }} </code>
      <h4 v-if="summary.rulesOrRequirements?.length">Reguli și cerințe</h4>
      <ul>
        <li v-for="rule in summary.rulesOrRequirements || []" :key="rule">{{ rule }}</li>
      </ul>
    </div>
    <div class="feedback-widget glass-panel">
      <h3>Ți-a fost util acest ghid?</h3>
      <label>Observații opționale<textarea v-model="comment" maxlength="2000" /></label
      ><button type="button" @click="vote('helpful')">Da, m-a ajutat</button
      ><button type="button" @click="vote('unhelpful')">Nu încă</button
      ><button type="button" @click="ask(`Explică ghidul ${page.title}`)">Explică-mi cu AI</button>
      <p role="status">{{ message }}</p>
    </div>
    <div class="doc-integrity-seal" v-if="page.frontmatter.sha256">
      <Icon icon="lucide:shield-check" /><span>Integritate SHA-256</span
      ><code>{{ page.frontmatter.sha256 }}</code>
    </div>
    <button v-if="selection" type="button" class="selection-ai" @click="ask(selection)">
      Explică selecția cu AI</button
    ><Modal :open="report" title="Raportează o problemă" @close="report = false"
      ><form @submit.prevent="sendReport">
        <label
          >Tip<select v-model="issue">
            <option value="unclear_command">Comandă neclară</option>
            <option value="outdated_info">Informație neactualizată</option>
            <option value="broken_link">Link defect</option>
            <option value="other">Altă problemă</option>
          </select></label
        ><label>Descriere<textarea required v-model="description" maxlength="4000" /></label
        ><button type="submit" class="primary">Trimite raportul</button>
      </form></Modal
    >
  </section>
</template>
