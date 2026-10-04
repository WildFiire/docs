<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { Icon } from '@iconify/vue';
import { api } from '../../composables/useApi';
import docViewsMap from '../../data/doc-views.json';

const props = defineProps<{
  slug: string;
  initialViews?: number;
}>();

function normalizeSlug(s: string): string {
  return (s || '')
    .trim()
    .replace(/^\/+|\/+$/g, '')
    .replace(/\.(md|html)$/i, '')
    .replace(/^docs\//i, '');
}

function getPrecomputedViews(slugKey: string): number {
  const clean = normalizeSlug(slugKey);
  const map = docViewsMap as Record<string, any>;
  return map[clean]?.total_views || map[`docs/${clean}`]?.total_views || 0;
}

const views = ref<number>(
  props.initialViews !== undefined && props.initialViews > 0
    ? props.initialViews
    : getPrecomputedViews(props.slug),
);

async function recordAndFetchViews(rawSlug: string) {
  const clean = normalizeSlug(rawSlug);
  if (!clean || typeof window === 'undefined') return;

  const pre = getPrecomputedViews(clean);
  if (pre > views.value) {
    views.value = pre;
  }

  const sessionKey = `wf_viewed_${clean}`;
  const alreadyTracked = sessionStorage.getItem(sessionKey);

  try {
    if (!alreadyTracked) {
      sessionStorage.setItem(sessionKey, '1');
      const data = await api('/api/analytics/view', { slug: clean });
      if (typeof data?.views === 'number') {
        views.value = data.views;
      }
    } else {
      const data = await api(`/api/analytics/view?slug=${encodeURIComponent(clean)}`);
      if (typeof data?.views === 'number') {
        views.value = data.views;
      }
    }
  } catch {
    // Silent fail
  }
}

onMounted(() => {
  recordAndFetchViews(props.slug);
});

watch(
  () => props.slug,
  (newSlug) => {
    if (newSlug) {
      views.value = getPrecomputedViews(newSlug);
      recordAndFetchViews(newSlug);
    }
  },
);

const formattedViews = computed(() => {
  const v = views.value;
  return v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v);
});
</script>

<template>
  <div class="page-meta-item page-meta-item--views" :title="`${views} vizualizări totale`">
    <Icon icon="lucide:eye" width="13" class="text-cyan-400" />
    <span>{{ formattedViews }} {{ views === 1 ? 'vizualizare' : 'vizualizări' }}</span>
  </div>
</template>

<style scoped>
.text-cyan-400 {
  color: hsl(190 95% 45%);
}
</style>
