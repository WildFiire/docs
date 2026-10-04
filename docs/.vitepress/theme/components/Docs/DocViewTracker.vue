<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Icon } from '@iconify/vue';
import { api } from '../../composables/useApi';
import { consent } from '../../composables/useConsent';

const props = defineProps<{
  slug: string;
  initialViews?: number;
}>();

const views = ref<number>(props.initialViews || 0);

onMounted(async () => {
  if (!props.slug || typeof window === 'undefined') return;

  const sessionKey = `wf_viewed_${props.slug}`;
  const alreadyTracked = sessionStorage.getItem(sessionKey);

  try {
    if (!alreadyTracked && consent.analytics) {
      sessionStorage.setItem(sessionKey, '1');
      const data = await api('/api/analytics/view', { slug: props.slug });
      if (typeof data.views === 'number') {
        views.value = data.views;
      }
    } else {
      const data = await api(`/api/analytics/view?slug=${encodeURIComponent(props.slug)}`);
      if (typeof data.views === 'number') {
        views.value = data.views;
      }
    }
  } catch {
    // Silent fail
  }
});

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
