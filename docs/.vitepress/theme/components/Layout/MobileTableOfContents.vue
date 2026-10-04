<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useRoute } from 'vitepress';
import { Icon } from '@iconify/vue';
import {
  useTableOfContents,
  normalizeText,
  type TocItem,
} from '../../composables/useTableOfContents';

const props = defineProps<{
  items?: TocItem[];
}>();

const route = useRoute();
const isOpen = ref(false);

const {
  items: globalItems,
  activeId,
  scrollToHeading,
  syncHeadings,
} = useTableOfContents();

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

const activeItem = computed(() => {
  return displayItems.value.find(i => isItemActive(i)) || displayItems.value[0];
});

function handleLinkClick(item: TocItem) {
  activeId.value = item.id;
  scrollToHeading(item.id, 70);
  isOpen.value = false;
}

function doSync() {
  if (displayItems.value.length > 0) {
    syncHeadings(displayItems.value);
  }
}

watch(() => props.items, () => {
  doSync();
}, { deep: true });

watch(() => route.path, () => {
  isOpen.value = false;
  nextTick(() => {
    setTimeout(doSync, 120);
  });
});

onMounted(() => {
  doSync();
});
</script>

<template>
  <div v-if="displayItems && displayItems.length > 0" class="mobile-toc-container">
    <button
      type="button"
      class="mobile-toc-btn"
      :class="{ 'mobile-toc-btn--open': isOpen }"
      :aria-expanded="isOpen"
      aria-label="Toggle page navigation"
      @click="isOpen = !isOpen"
    >
      <span class="mobile-toc-left">
        <Icon icon="lucide:align-left" :width="13" class="mobile-toc-icon" aria-hidden="true" />
        <span class="mobile-toc-label">
          On this page{{ activeItem ? ': ' : '' }}
          <span v-if="activeItem" class="mobile-toc-active-title">{{ activeItem.title }}</span>
        </span>
      </span>
      <Icon
        icon="lucide:chevron-down"
        :width="14"
        class="mobile-toc-chevron"
        :class="{ 'mobile-toc-chevron--open': isOpen }"
        aria-hidden="true"
      />
    </button>

    <div v-if="isOpen" class="mobile-toc-dropdown">
      <ul role="list" class="mobile-toc-list">
        <li
          v-for="(item, idx) in displayItems"
          :key="`${item.id}-${idx}`"
          class="mobile-toc-item"
          :class="[
            `mobile-toc-item--${item.depth || 2}`,
            { 'mobile-toc-item--nested': (item.depth || 2) >= 3 }
          ]"
        >
          <a
            :href="`#${item.id}`"
            class="mobile-toc-link"
            :class="{ 'mobile-toc-link--active': isItemActive(item) }"
            @click.prevent="handleLinkClick(item)"
          >
            <span class="mobile-toc-indicator" aria-hidden="true" />
            <span>{{ item.title }}</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
