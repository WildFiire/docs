<script setup lang="ts">
import { computed } from 'vue';
import { useData, useRoute } from 'vitepress';

const { theme, frontmatter } = useData();
const route = useRoute();

interface NavItem {
  text: string;
  link: string;
}

function cleanTitle(raw: string): string {
  if (!raw) return '';
  return String(raw)
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function fallbackTitle(link: string): string {
  const segment = (link || '').replace(/(\.html|\/)$/, '').split('/').pop() || '';
  return segment
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function normalizePath(p: string): string {
  if (!p) return '/';
  return p
    .replace(/(\.html|\.md|\/)$/, '')
    .replace(/\/$/, '')
    .toLowerCase() || '/';
}

// Flatten all sidebar items to a linear list
const flat = computed<NavItem[]>(() => {
  const items: NavItem[] = [];
  function traverse(nodes: any[]) {
    for (const n of nodes ?? []) {
      if (n.link && !n.link.startsWith('http://') && !n.link.startsWith('https://')) {
        const title = cleanTitle(n.text) || fallbackTitle(n.link);
        items.push({
          text: title,
          link: n.link,
        });
      }
      if (n.items) traverse(n.items);
    }
  }
  const sidebar = theme.value?.sidebar ?? [];
  if (Array.isArray(sidebar)) {
    traverse(sidebar);
  } else {
    for (const group of Object.values(sidebar)) traverse(group as any[]);
  }
  return items;
});

const currentPath = computed(() => normalizePath(route.path));

const currentIndex = computed(() =>
  flat.value.findIndex(p => normalizePath(p.link) === currentPath.value)
);

const prev = computed(() => {
  if (frontmatter.value?.prev === false) return null;
  if (frontmatter.value?.prev && typeof frontmatter.value.prev === 'object') {
    return {
      text: cleanTitle(frontmatter.value.prev.text || '') || fallbackTitle(frontmatter.value.prev.link || ''),
      link: frontmatter.value.prev.link || '#',
    };
  }
  return currentIndex.value > 0 ? flat.value[currentIndex.value - 1] : null;
});

const next = computed(() => {
  if (frontmatter.value?.next === false) return null;
  if (frontmatter.value?.next && typeof frontmatter.value.next === 'object') {
    return {
      text: cleanTitle(frontmatter.value.next.text || '') || fallbackTitle(frontmatter.value.next.link || ''),
      link: frontmatter.value.next.link || '#',
    };
  }
  return currentIndex.value >= 0 && currentIndex.value < flat.value.length - 1
    ? flat.value[currentIndex.value + 1]
    : null;
});
</script>

<template>
  <nav v-if="prev || next" class="page-nav" aria-label="Page navigation">
    <a
      v-if="prev"
      :href="prev.link"
      class="page-nav-card page-nav-card--prev"
    >
      <div class="page-nav-icon-box">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="page-nav-arrow" aria-hidden="true">
          <path d="m12 19-7-7 7-7"/>
          <path d="M19 12H5"/>
        </svg>
      </div>
      <div class="page-nav-text-col">
        <span class="page-nav-sub">Previous</span>
        <span class="page-nav-title">{{ prev.text }}</span>
      </div>
    </a>
    <div v-else class="page-nav-placeholder" aria-hidden="true" />

    <a
      v-if="next"
      :href="next.link"
      class="page-nav-card page-nav-card--next"
    >
      <div class="page-nav-text-col page-nav-text-col--right">
        <span class="page-nav-sub">Next</span>
        <span class="page-nav-title">{{ next.text }}</span>
      </div>
      <div class="page-nav-icon-box">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="page-nav-arrow" aria-hidden="true">
          <path d="M5 12h14"/>
          <path d="m12 5 7 7-7 7"/>
        </svg>
      </div>
    </a>
    <div v-else class="page-nav-placeholder" aria-hidden="true" />
  </nav>
</template>
