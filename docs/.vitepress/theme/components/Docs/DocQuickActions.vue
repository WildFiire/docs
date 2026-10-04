<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps<{
  slug?: string;
  githubEditUrl?: string;
  isAdmin?: boolean;
}>();

const copied = ref(false);
const linkCopied = ref(false);
const dropdownOpen = ref(false);
const menuRef = ref<HTMLElement | null>(null);

function getRawContent(): string {
  const el = document.querySelector('.vp-doc, .prose');
  return el ? el.textContent || '' : '';
}

async function handleCopyMarkdown() {
  try {
    const text = getRawContent();
    await navigator.clipboard.writeText(text);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
      dropdownOpen.value = false;
    }, 1500);
  } catch (err) {
    console.error('Failed to copy markdown:', err);
  }
}

async function handleShareLink() {
  const cleanUrl = typeof window !== 'undefined' ? window.location.href.split('#')[0] : '';
  if (typeof navigator !== 'undefined' && navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
    try {
      await navigator.share({ title: document.title, url: cleanUrl });
      dropdownOpen.value = false;
      return;
    } catch {}
  }
  try {
    await navigator.clipboard.writeText(cleanUrl);
    linkCopied.value = true;
    setTimeout(() => {
      linkCopied.value = false;
      dropdownOpen.value = false;
    }, 1500);
  } catch (err) {
    console.error('Failed to copy link:', err);
  }
}

function handlePrint() {
  window.print();
  dropdownOpen.value = false;
}

function handleClickOutside(event: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    dropdownOpen.value = false;
  }
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape') dropdownOpen.value = false;
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
  document.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
  document.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <div class="doc-quick-actions-toolbar" ref="menuRef">
    <!-- Quick Copy Markdown Button -->
    <button
      type="button"
      class="doc-quick-btn"
      :class="{ 'doc-quick-btn--copied': copied }"
      title="Copiază conținutul Markdown în clipboard"
      aria-label="Copiază conținutul Markdown"
      @click="handleCopyMarkdown"
    >
      <Icon :icon="copied ? 'lucide:check' : 'lucide:copy'" width="12" />
      <span>{{ copied ? 'Copiat!' : 'Markdown' }}</span>
    </button>

    <!-- Quick Share Link Button -->
    <button
      type="button"
      class="doc-quick-btn"
      :class="{ 'doc-quick-btn--copied': linkCopied }"
      title="Copiază linkul paginii"
      aria-label="Copiază linkul paginii"
      @click="handleShareLink"
    >
      <Icon :icon="linkCopied ? 'lucide:check' : 'lucide:share-2'" width="12" />
      <span>{{ linkCopied ? 'Link Copiat!' : 'Distribuie' }}</span>
    </button>

    <!-- Print / PDF Button -->
    <button
      type="button"
      class="doc-quick-btn"
      title="Exportă sau Printează ca PDF"
      aria-label="Exportă ca PDF"
      @click="handlePrint"
    >
      <Icon icon="lucide:printer" width="12" />
      <span>PDF</span>
    </button>

    <!-- Admin Edit (if admin) -->
    <a
      v-if="isAdmin && slug"
      :href="`/admin/content?slug=${encodeURIComponent(slug)}`"
      class="doc-quick-btn doc-quick-btn--admin"
      title="Editează în Content Studio"
    >
      <Icon icon="lucide:pencil" width="12" />
      <span>Studio</span>
    </a>

    <!-- GitHub Edit Link (fallback) -->
    <a
      v-else-if="githubEditUrl"
      :href="githubEditUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="doc-quick-btn doc-quick-btn--github"
      title="Editează această pagină pe GitHub"
    >
      <Icon icon="lucide:pencil" width="11" />
      <span>Edit</span>
      <Icon icon="lucide:external-link" width="10" class="quick-btn-ext" />
    </a>
  </div>
</template>
