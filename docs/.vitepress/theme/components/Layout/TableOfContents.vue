<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute } from 'vitepress';
import { Icon } from '@iconify/vue';
import { layout, toggleToc } from '../../composables/useLayout';
import {
  useTableOfContents,
  normalizeText,
  type TocItem,
} from '../../composables/useTableOfContents';

const props = defineProps<{
  items?: TocItem[];
}>();

const route = useRoute();
const {
  items: globalItems,
  activeId,
  scrollProgress,
  onScrollSpy,
  scrollToHeading,
  syncHeadings,
  handleInitialHash,
} = useTableOfContents();

const capsuleMetrics = ref<{ top: number; height: number }>({ top: 0, height: 28 });
const listWrapperRef = ref<HTMLElement | null>(null);
const listRef = ref<HTMLUListElement | null>(null);
const tocAsideRef = ref<HTMLElement | null>(null);

// Single source of truth for items in TOC
const displayItems = computed<TocItem[]>(() => {
  if (props.items && props.items.length > 0) return props.items;
  if (globalItems.value && globalItems.value.length > 0) return globalItems.value;
  return [];
});

function isItemActive(item: TocItem): boolean {
  if (!activeId.value) return false;
  return (
    item.id === activeId.value ||
    normalizeText(item.id) === normalizeText(activeId.value) ||
    normalizeText(item.title) === normalizeText(activeId.value)
  );
}

function updateCapsulePosition() {
  const list = displayItems.value;
  if (!listRef.value || list.length === 0) return;

  const wrapper = listWrapperRef.value || listRef.value.parentElement;
  if (!wrapper) return;

  // 1. Locate active index by ID or normalized text
  let activeIndex = list.findIndex((i) => isItemActive(i));

  // 2. Fallback: locate via DOM active class
  if (activeIndex < 0) {
    const activeLink = listRef.value.querySelector('.toc-clean-link--active');
    if (activeLink) {
      const activeRow = activeLink.closest('.toc-clean-row') as HTMLElement;
      if (activeRow) {
        activeIndex = Array.from(listRef.value.children).indexOf(activeRow);
      }
    }
  }

  // 3. Fallback: locate by matching data-toc-id
  if (activeIndex < 0 && activeId.value) {
    const targetNorm = normalizeText(activeId.value);
    const rows = Array.from(listRef.value.querySelectorAll<HTMLElement>('.toc-clean-row'));
    const foundIdx = rows.findIndex((r) => {
      const rowId = r.getAttribute('data-toc-id') || '';
      return rowId === activeId.value || normalizeText(rowId) === targetNorm;
    });
    if (foundIdx >= 0) activeIndex = foundIdx;
  }

  const targetIdx = activeIndex >= 0 ? activeIndex : 0;
  const activeEl = listRef.value.children[targetIdx] as HTMLElement;

  if (activeEl) {
    const wrapperRect = wrapper.getBoundingClientRect();
    const itemRect = activeEl.getBoundingClientRect();

    capsuleMetrics.value = {
      top: Math.round(itemRect.top - wrapperRect.top),
      height: Math.round(itemRect.height || activeEl.offsetHeight || 28),
    };

    // Auto-scroll TOC container if active heading goes out of view (1:1 with wf-docscore)
    if (tocAsideRef.value) {
      const asideEl = tocAsideRef.value;
      const asideRect = asideEl.getBoundingClientRect();

      if (itemRect.bottom > asideRect.bottom - 16 || itemRect.top < asideRect.top + 16) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }
}

function handleLinkClick(item: TocItem, index: number) {
  // 1. Instant capsule move using exact row index
  activeId.value = item.id;
  if (listRef.value && (listWrapperRef.value || listRef.value.parentElement)) {
    const wrapper = listWrapperRef.value || listRef.value.parentElement!;
    const activeEl = listRef.value.children[index] as HTMLElement;
    if (activeEl) {
      const wrapperRect = wrapper.getBoundingClientRect();
      const itemRect = activeEl.getBoundingClientRect();
      capsuleMetrics.value = {
        top: Math.round(itemRect.top - wrapperRect.top),
        height: Math.round(itemRect.height || activeEl.offsetHeight || 28),
      };
    }
  }

  // 2. Smoothly scroll to heading
  scrollToHeading(item.id, 80);

  // 3. Keep capsule aligned after layout passes
  requestAnimationFrame(updateCapsulePosition);
  setTimeout(updateCapsulePosition, 50);
  setTimeout(updateCapsulePosition, 200);
}

function onKeydown(e: KeyboardEvent) {
  if ((e.target as HTMLElement)?.closest('input, textarea, [contenteditable]')) return;
  if (e.key === ']') {
    e.preventDefault();
    toggleToc();
  }
}

function doSync() {
  syncHeadings(displayItems.value);
  nextTick(() => {
    updateCapsulePosition();
    onScrollSpy();
  });
}

function onHashChange() {
  handleInitialHash();
  nextTick(updateCapsulePosition);
}

watch(() => props.items, () => {
  nextTick(() => {
    updateCapsulePosition();
    onScrollSpy();
  });
});

watch(() => route.path, () => {
  nextTick(() => {
    setTimeout(doSync, 100);
    setTimeout(handleInitialHash, 250);
    setTimeout(updateCapsulePosition, 300);
    setTimeout(doSync, 450);
  });
});

watch(activeId, () => {
  nextTick(updateCapsulePosition);
});

onMounted(() => {
  doSync();
  handleInitialHash();
  window.addEventListener('scroll', onScrollSpy, { passive: true });
  window.addEventListener('resize', updateCapsulePosition, { passive: true });
  window.addEventListener('keydown', onKeydown);
  window.addEventListener('hashchange', onHashChange);
  setTimeout(doSync, 150);
  setTimeout(handleInitialHash, 250);
  setTimeout(updateCapsulePosition, 300);
  setTimeout(doSync, 450);
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', onScrollSpy);
    window.removeEventListener('resize', updateCapsulePosition);
    window.removeEventListener('keydown', onKeydown);
    window.removeEventListener('hashchange', onHashChange);
  }
});
</script>

<template>
  <template v-if="displayItems && displayItems.length > 0">
    <!-- Floating reopen button if TOC is closed on wide screens (1:1 with wf-docscore) -->
    <button
      type="button"
      class="toc-floating-toggle"
      :class="{ 'toc-floating-toggle--visible': !layout.tocOpen }"
      title="Expand Right Table of Contents (Shortcut: ])"
      aria-label="Expand table of contents"
      @click="toggleToc"
    >
      <Icon icon="lucide:panel-right-open" :width="15" />
      <span class="floating-toggle-label">Contents</span>
    </button>

    <aside
      ref="tocAsideRef"
      class="toc"
      :class="layout.tocOpen ? 'toc--open' : 'toc--collapsed'"
      aria-label="Table of contents"
      :data-collapsed="!layout.tocOpen"
    >
      <!-- Header -->
      <div class="toc-header">
        <div class="toc-header-left">
          <span class="toc-header-icon-box">
            <Icon icon="lucide:align-left" :width="11" class="toc-header-icon" aria-hidden="true" />
          </span>
          <span class="toc-title">On this page</span>
        </div>

        <div class="toc-header-right">
          <span v-if="scrollProgress > 0" class="toc-progress-chip" title="Reading Progress">
            {{ scrollProgress }}%
          </span>
          <button
            type="button"
            class="toc-collapse-btn"
            title="Collapse Table of Contents (Shortcut: ])"
            aria-label="Collapse table of contents"
            @click="toggleToc"
          >
            <Icon icon="lucide:panel-right-close" :width="12" />
            <kbd class="toc-collapse-kbd" aria-hidden="true">]</kbd>
          </button>
        </div>
      </div>

      <!-- Clean, Orderly, Ultra-Refined TOC Navigation -->
      <nav class="toc-clean-nav">
        <div class="toc-clean-list-wrapper" ref="listWrapperRef">
          <!-- GPU-Accelerated Gliding Frosted Glass Capsule -->
          <div
            class="toc-gliding-capsule"
            :style="{
              transform: `translate3d(0, ${capsuleMetrics.top}px, 0)`,
              height: `${capsuleMetrics.height}px`,
            }"
            aria-hidden="true"
          />

          <ul role="list" class="toc-clean-list" ref="listRef">
            <li
              v-for="(item, index) in displayItems"
              :key="`${item.id}-${index}`"
              :data-toc-id="item.id"
              class="toc-clean-row"
              :class="`toc-clean-row--${item.depth || 2}`"
            >
              <a
                :href="`#${item.id}`"
                class="toc-clean-link"
                :class="[
                  `toc-clean-link--${item.depth || 2}`,
                  { 'toc-clean-link--active': isItemActive(item) }
                ]"
                :aria-current="isItemActive(item) ? 'location' : undefined"
                @click.prevent="handleLinkClick(item, index)"
              >
                <span
                  v-if="(item.depth || 2) >= 3"
                  class="toc-nested-pip"
                  :class="`toc-nested-pip--${item.depth || 2}`"
                  aria-hidden="true"
                />
                <span class="toc-clean-text">{{ item.title }}</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  </template>
</template>
