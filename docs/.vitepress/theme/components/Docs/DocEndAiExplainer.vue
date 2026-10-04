<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps<{
  docTitle?: string;
  docSlug?: string;
  category?: string;
}>();

const customQuestion = ref('');

function triggerAi(query: string) {
  window.dispatchEvent(
    new CustomEvent('wf-ask-ai', {
      detail: { text: query },
    })
  );
}

function handleQuickPrompt(type: 'summary' | 'key_points' | 'rules') {
  let q = '';
  if (type === 'summary') {
    q = `Fă un rezumat clar și structurat al ghidului «${props.docTitle}»`;
  } else if (type === 'key_points') {
    q = `Care sunt pașii, beneficiile sau comenzile esențiale explicate în «${props.docTitle}»?`;
  } else if (type === 'rules') {
    q = `Care sunt cele mai importante reguli, cerințe sau limitări menționate în «${props.docTitle}»?`;
  }
  triggerAi(q);
}

function handleSubmit() {
  const q = customQuestion.value.trim();
  if (!q) return;
  triggerAi(`Referitor la ghidul «${props.docTitle}»:\n${q}`);
  customQuestion.value = '';
}
</script>

<template>
  <section class="doc-end-ai-card" aria-label="Asistent AI pentru această pagină">
    <div class="doc-end-ai-bg-glow" aria-hidden="true" />
    <div class="doc-end-ai-inner">
      <!-- Header -->
      <div class="doc-end-ai-header">
        <div class="doc-end-ai-icon-box">
          <Icon icon="lucide:sparkles" width="16" class="text-amber-400" />
        </div>
        <div class="doc-end-ai-title-wrap">
          <div class="doc-end-ai-top-meta">
            <span class="doc-end-ai-pretitle">WILDFIRE AI ASSISTANT</span>
            <span class="doc-end-ai-badge">
              <Icon icon="lucide:cpu" width="11" class="text-amber-400" />
              <span>Grounded Docs AI</span>
            </span>
          </div>
          <h3 class="doc-end-ai-title">Ai nevoie de clarificări despre această pagină?</h3>
          <p class="doc-end-ai-desc">
            Asistentul cunoaște în detaliu ghidul <strong>«{{ docTitle }}»</strong> și îți poate oferi explicații instant sau un rezumat la obiect.
          </p>
        </div>
      </div>

      <!-- Quick Action Chips -->
      <div class="doc-end-ai-chips">
        <button
          type="button"
          class="doc-end-ai-chip"
          @click="handleQuickPrompt('summary')"
        >
          <Icon icon="lucide:book-open" width="12" />
          <span>Rezumat complet</span>
        </button>

        <button
          type="button"
          class="doc-end-ai-chip"
          @click="handleQuickPrompt('key_points')"
        >
          <Icon icon="lucide:list-ordered" width="12" />
          <span>Puncte cheie & Pași</span>
        </button>

        <button
          type="button"
          class="doc-end-ai-chip"
          @click="handleQuickPrompt('rules')"
        >
          <Icon icon="lucide:shield-alert" width="12" />
          <span>Reguli & Cerințe</span>
        </button>
      </div>

      <!-- Question Input Form -->
      <form class="doc-end-ai-form" @submit.prevent="handleSubmit">
        <div class="doc-end-ai-input-wrap">
          <input
            v-model="customQuestion"
            type="text"
            class="doc-end-ai-input"
            :placeholder="`Adresează o întrebare despre «${docTitle}»…`"
          />
          <button
            type="submit"
            class="doc-end-ai-submit"
            :disabled="!customQuestion.trim()"
            aria-label="Trimite întrebarea"
          >
            <Icon icon="lucide:send" width="13" />
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped>
.doc-end-ai-card {
  position: relative;
  margin: 36px 0 24px;
  border-radius: var(--radius-xl, 16px);
  border: 1px solid var(--color-border);
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  overflow: hidden;
  transition: all var(--transition-base, 0.2s);
}

.doc-end-ai-card:hover {
  border-color: var(--color-border-strong);
  background: var(--glass-bg-hover);
  box-shadow: 0 8px 30px -10px hsl(26 100% 52% / 0.12);
}

.doc-end-ai-bg-glow {
  position: absolute;
  top: -40px;
  right: -40px;
  width: 220px;
  height: 160px;
  background: radial-gradient(circle, hsl(26 100% 52% / 0.08) 0%, transparent 70%);
  pointer-events: none;
  transition: opacity var(--transition-base, 0.2s);
}

.doc-end-ai-card:hover .doc-end-ai-bg-glow {
  opacity: 1;
  background: radial-gradient(circle, hsl(26 100% 52% / 0.14) 0%, transparent 70%);
}

.doc-end-ai-inner {
  position: relative;
  z-index: 2;
  padding: 22px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.doc-end-ai-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.doc-end-ai-title-wrap {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.doc-end-ai-top-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 4px;
}

.doc-end-ai-icon-box {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md, 8px);
  background: hsl(26 100% 52% / 0.12);
  border: 1px solid hsl(26 100% 52% / 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}

.doc-end-ai-pretitle {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--color-primary);
  font-family: var(--font-mono);
}

.doc-end-ai-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.35;
  margin: 2px 0 4px;
}

.doc-end-ai-desc {
  font-size: 0.84rem;
  color: var(--color-text-secondary);
  line-height: 1.55;
  margin: 0;
}

.doc-end-ai-desc strong {
  color: var(--color-text);
  font-weight: 600;
}

.doc-end-ai-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 9px;
  border-radius: var(--radius-full, 9999px);
  background: hsl(0 0% 100% / 0.04);
  border: 1px solid var(--glass-border);
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--color-text-secondary);
  white-space: nowrap;
  flex-shrink: 0;
}

.doc-end-ai-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.doc-end-ai-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 13px;
  border-radius: var(--radius-full, 9999px);
  background: hsl(0 0% 100% / 0.03);
  border: 1px solid var(--glass-border);
  color: var(--color-text);
  font-size: 0.76rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast, 0.15s);
}

.doc-end-ai-chip:hover {
  background: hsl(26 100% 52% / 0.12);
  border-color: hsl(26 100% 52% / 0.35);
  color: var(--color-primary);
  transform: translateY(-1px);
}

.doc-end-ai-form {
  width: 100%;
}

.doc-end-ai-input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  background: hsl(0 0% 100% / 0.025);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 4px 6px 4px 14px;
  transition: border-color var(--transition-fast, 0.15s), background-color var(--transition-fast, 0.15s);
}

.doc-end-ai-input-wrap:hover {
  border-color: var(--color-border-strong);
}

.doc-end-ai-input-wrap:focus-within {
  border-color: hsl(26 100% 52% / 0.45);
  background: hsl(0 0% 100% / 0.05);
}

.doc-end-ai-input {
  flex: 1;
  background: transparent !important;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  -webkit-appearance: none;
  appearance: none;
  padding: 8px 4px;
  color: var(--color-text);
  font-family: var(--font-sans);
  font-size: 0.84rem;
  line-height: 1.5;
  min-width: 0;
}

.doc-end-ai-input:focus,
.doc-end-ai-input:focus-visible {
  outline: none !important;
  border: none !important;
  box-shadow: none !important;
}

.doc-end-ai-input::placeholder {
  color: var(--color-text-tertiary);
}

.doc-end-ai-submit {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 8px;
  background: linear-gradient(135deg, hsl(26 100% 52% / 0.9) 0%, hsl(26 100% 44% / 0.9) 100%);
  border: 1px solid hsl(26 100% 52% / 0.5);
  color: #000000;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-fast, 0.15s);
  white-space: nowrap;
}

.doc-end-ai-submit:hover:not(:disabled) {
  background: var(--color-primary-hover, #ff6633);
  transform: scale(1.02);
  box-shadow: 0 0 12px hsl(26 100% 52% / 0.4);
}

.doc-end-ai-submit:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.text-amber-400 {
  color: hsl(38 92% 50%);
}
</style>
