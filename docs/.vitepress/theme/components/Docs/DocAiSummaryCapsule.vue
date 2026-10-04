<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { api } from '../../composables/useApi';

const props = defineProps<{
  docTitle?: string;
  docSlug?: string;
}>();

interface SummaryData {
  overview: string;
  keyTakeaways: string[];
  commands: string[];
  rulesOrRequirements: string[];
}

const isOpen = ref(false);
const loading = ref(false);
const data = ref<SummaryData | null>(null);
const copied = ref(false);
const copiedCmd = ref<string | null>(null);

async function fetchSummary() {
  if (data.value || loading.value) return;
  loading.value = true;
  try {
    const raw = document.querySelector('.vp-doc, .prose')?.textContent || '';
    const res = await api('/api/ai-helper/summary', {
      docTitle: props.docTitle || document.title,
      docSlug: props.docSlug || '',
      rawContent: raw.slice(0, 10000),
    });
    if (res.summary) {
      data.value = res.summary;
    }
  } catch (err) {
    console.error('[AI Summary] Error loading summary:', err);
  } finally {
    loading.value = false;
  }
}

function toggle() {
  isOpen.value = !isOpen.value;
  if (isOpen.value && !data.value) {
    fetchSummary();
  }
}

async function copySummary() {
  if (!data.value) return;
  const text = `${data.value.overview}\n\nConcluzii cheie:\n${data.value.keyTakeaways.map(t => `- ${t}`).join('\n')}`;
  try {
    await navigator.clipboard.writeText(text);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 1500);
  } catch {}
}

async function copyCommand(cmd: string) {
  try {
    await navigator.clipboard.writeText(cmd);
    copiedCmd.value = cmd;
    setTimeout(() => { copiedCmd.value = null; }, 1500);
  } catch {}
}

function askAi() {
  window.dispatchEvent(new CustomEvent('wf-ask-ai', {
    detail: { text: `Explică pe scurt ghidul «${props.docTitle}»` }
  }));
}
</script>

<template>
  <div class="doc-ai-summary-capsule" :class="{ 'doc-ai-summary-capsule--open': isOpen }">
    <!-- Trigger Banner -->
    <button
      type="button"
      class="capsule-trigger"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      <div class="capsule-trigger-left">
        <span class="capsule-icon-box">
          <Icon icon="lucide:sparkles" width="13" class="text-amber-400" />
        </span>
        <span class="capsule-label">Rezumat Rapid AI</span>
        <span class="capsule-pill">TL;DR</span>
      </div>

      <div class="capsule-trigger-right">
        <span class="capsule-hint">{{ isOpen ? 'Ascunde rezumatul' : 'Afișează rezumatul generat de AI' }}</span>
        <Icon
          :icon="isOpen ? 'lucide:chevron-up' : 'lucide:chevron-down'"
          width="13"
          class="capsule-chevron"
        />
      </div>
    </button>

    <!-- Expanded Content -->
    <div v-if="isOpen" class="capsule-content">
      <div v-if="loading" class="capsule-loading">
        <Icon icon="lucide:loader-2" width="16" class="spin" />
        <span>Se generează rezumatul inteligent prin Wildfire AI…</span>
      </div>

      <div v-else-if="data" class="capsule-body">
        <p class="capsule-overview">{{ data.overview }}</p>

        <div v-if="data.keyTakeaways?.length" class="capsule-section">
          <span class="capsule-section-title">Idei principale</span>
          <ul class="capsule-bullets">
            <li v-for="(point, i) in data.keyTakeaways" :key="i">
              <Icon icon="lucide:check" width="12" class="bullet-icon text-emerald-400" />
              <span>{{ point }}</span>
            </li>
          </ul>
        </div>

        <div v-if="data.commands?.length" class="capsule-section">
          <span class="capsule-section-title">Comenzi detectate</span>
          <div class="capsule-commands-grid">
            <button
              v-for="cmd in data.commands"
              :key="cmd"
              type="button"
              class="capsule-cmd-btn"
              :title="`Copiază: ${cmd}`"
              @click="copyCommand(cmd)"
            >
              <code>{{ cmd }}</code>
              <Icon :icon="copiedCmd === cmd ? 'lucide:check' : 'lucide:copy'" width="11" />
            </button>
          </div>
        </div>

        <!-- Footer Actions inside capsule -->
        <div class="capsule-footer">
          <button type="button" class="capsule-action-btn" @click="copySummary">
            <Icon :icon="copied ? 'lucide:check' : 'lucide:copy'" width="12" />
            <span>{{ copied ? 'Copiat!' : 'Copiază rezumatul' }}</span>
          </button>
          <button type="button" class="capsule-action-btn" @click="askAi">
            <Icon icon="lucide:message-square" width="12" />
            <span>Întreabă AI-ul</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.doc-ai-summary-capsule {
  margin: var(--space-4, 16px) 0 var(--space-6, 24px);
  border: 1px solid var(--color-primary-border, hsl(26 100% 52% / 0.25));
  border-radius: var(--radius-lg, 12px);
  background: linear-gradient(135deg, hsl(26 100% 52% / 0.06), var(--glass-bg, rgba(255,255,255,0.02)));
  overflow: hidden;
  transition: border-color var(--transition-fast, 0.2s);
}
.doc-ai-summary-capsule--open {
  border-color: hsl(26 100% 52% / 0.45);
}
.capsule-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--color-text);
  font-size: 13px;
}
.capsule-trigger-left, .capsule-trigger-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.capsule-icon-box {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: hsl(26 100% 52% / 0.15);
  border: 1px solid hsl(26 100% 52% / 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}
.capsule-label {
  font-weight: 700;
  font-size: 12px;
}
.capsule-pill {
  font-size: 10px;
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--color-primary);
  background: var(--color-primary-dim);
  padding: 1px 6px;
  border-radius: 4px;
}
.capsule-hint {
  font-size: 11px;
  color: var(--color-text-secondary);
}
.capsule-chevron {
  color: var(--color-text-tertiary);
  transition: transform 0.2s;
}
.capsule-content {
  padding: 14px 16px 16px;
  border-top: 1px solid var(--glass-border);
}
.capsule-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--color-text-secondary);
}
.capsule-overview {
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-text);
  margin: 0 0 12px;
}
.capsule-section {
  margin-top: 12px;
}
.capsule-section-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-secondary);
  display: block;
  margin-bottom: 6px;
}
.capsule-bullets {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.capsule-bullets li {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--color-text-secondary);
}
.bullet-icon {
  flex-shrink: 0;
  margin-top: 2px;
}
.capsule-commands-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.capsule-cmd-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 6px;
  background: var(--color-bg);
  border: 1px solid var(--glass-border);
  color: var(--color-text);
  font-size: 11px;
}
.capsule-cmd-btn code {
  font-family: var(--font-mono);
  color: var(--color-primary);
}
.capsule-footer {
  display: flex;
  gap: 8px;
  margin-top: 14px;
  padding-top: 10px;
  border-top: 1px solid var(--glass-border);
}
.capsule-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 6px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  font-size: 11px;
  color: var(--color-text-secondary);
}
.capsule-action-btn:hover {
  color: var(--color-text);
  border-color: var(--color-primary-border);
}
@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 0.8s linear infinite; }
.text-amber-400 { color: hsl(38 92% 50%); }
.text-emerald-400 { color: hsl(158 84% 45%); }
</style>
