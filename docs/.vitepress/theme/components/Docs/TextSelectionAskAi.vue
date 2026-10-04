<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';

const visible = ref(false);
const coords = ref({ top: 0, left: 0 });
const selectedText = ref('');
const popoverEl = ref<HTMLElement | null>(null);

function checkSelection() {
  if (typeof window === 'undefined') return;
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
    visible.value = false;
    return;
  }

  const text = selection.toString().trim();
  if (text.length < 5 || text.length > 800) {
    visible.value = false;
    return;
  }

  const anchorNode = selection.anchorNode;
  const element = anchorNode instanceof Element ? anchorNode : anchorNode?.parentElement;
  const docsContainer = element?.closest('#docs-main-container, .docs-content, .docs-article-body, article, .vp-doc, .prose');

  if (!docsContainer) {
    visible.value = false;
    return;
  }

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  if (rect.width === 0 && rect.height === 0) {
    visible.value = false;
    return;
  }

  const popoverHeight = 36;
  const popoverWidth = 140;
  const scrollY = window.scrollY;
  const scrollX = window.scrollX;

  let top = rect.top + scrollY - popoverHeight - 8;
  if (rect.top < 60) {
    top = rect.bottom + scrollY + 8;
  }

  let left = rect.left + scrollX + rect.width / 2 - popoverWidth / 2;
  left = Math.max(16, Math.min(left, window.innerWidth - popoverWidth - 16));

  selectedText.value = text;
  coords.value = { top, left };
  visible.value = true;
}

function handleMouseUp() {
  setTimeout(checkSelection, 20);
}

function handleKeyUp(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    visible.value = false;
    return;
  }
  setTimeout(checkSelection, 20);
}

function handleScroll() {
  if (visible.value) visible.value = false;
}

function handleMouseDown(e: MouseEvent) {
  if (popoverEl.value && popoverEl.value.contains(e.target as Node)) {
    return;
  }
  visible.value = false;
}

function handleTriggerAi(e: MouseEvent) {
  e.preventDefault();
  e.stopPropagation();

  if (!selectedText.value) return;

  const pageTitle = typeof document !== 'undefined' ? document.title.split('|')[0].trim() : '';

  const query = pageTitle
    ? `Explică-mi pe scurt acest fragment/titlu din ghidul «${pageTitle}»:\n\n> "${selectedText.value}"`
    : `Explică-mi pe scurt această secțiune din documentație:\n\n> "${selectedText.value}"`;

  window.dispatchEvent(
    new CustomEvent('wf:open-ai', {
      detail: {
        query,
        autoSubmit: true,
      },
    })
  );

  visible.value = false;
  window.getSelection()?.removeAllRanges();
}

onMounted(() => {
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('keyup', handleKeyUp);
  document.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  document.removeEventListener('mouseup', handleMouseUp);
  document.removeEventListener('keyup', handleKeyUp);
  document.removeEventListener('mousedown', handleMouseDown);
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div
    v-if="visible"
    ref="popoverEl"
    class="docs-selection-ai-popover"
    :style="{
      top: `${coords.top}px`,
      left: `${coords.left}px`,
    }"
  >
    <button
      type="button"
      class="docs-selection-ai-btn"
      title="Explică selecția cu WildFire AI"
      @click="handleTriggerAi"
    >
      <Icon icon="lucide:sparkles" width="12" class="docs-selection-sparkle" />
      <span>Explică cu AI</span>
    </button>
  </div>
</template>
