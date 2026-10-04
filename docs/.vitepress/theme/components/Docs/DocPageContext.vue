<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useData, useRoute } from 'vitepress';
import { Icon } from '@iconify/vue';
const { page, theme } = useData(),
  route = useRoute(),
  progress = ref(0);
const labels = computed(() => {
  const map: Record<string, string> = {};
  function walk(items: any[]) {
    for (const item of items) {
      if (item.link) map[item.link.replace(/\/$/, '')] = String(item.text || '').replace(/<[^>]*>/g, '').trim();
      if (item.items) walk(item.items);
    }
  }
  const sidebar = theme.value.sidebar;
  if (Array.isArray(sidebar)) walk(sidebar);
  else
    for (const value of Object.values(sidebar || {})) {
      if (Array.isArray(value)) walk(value);
    }
  return map;
});
const trail = computed(() => {
  const parts = route.path
    .replace(/\.html$/, '')
    .split('/')
    .filter(Boolean);
  return parts.map((part, i) => {
    const url = '/' + parts.slice(0, i + 1).join('/');
    return {
      url,
      label:
        i === parts.length - 1 ? page.value.title : labels.value[url] || part.replaceAll('-', ' '),
      last: i === parts.length - 1,
    };
  });
});
let frame = 0;
function update() {
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    const total = document.documentElement.scrollHeight - innerHeight;
    progress.value = total > 0 ? Math.min(100, (scrollY / total) * 100) : 0;
  });
}
onMounted(() => {
  update();
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
});
onUnmounted(() => {
  cancelAnimationFrame(frame);
  removeEventListener('scroll', update);
  removeEventListener('resize', update);
});
</script>
<template>
  <div class="page-progress" aria-hidden="true" :style="{ width: progress + '%' }"></div>
  <nav class="doc-breadcrumbs" aria-label="Fir de navigare">
    <a href="/" aria-label="Acasă"><Icon icon="lucide:house" /></a
    ><template v-for="crumb in trail" :key="crumb.url"
      ><Icon icon="lucide:chevron-right" /><span v-if="crumb.last" aria-current="page">{{
        crumb.label
      }}</span
      ><span v-else>{{ crumb.label }}</span></template
    >
  </nav>
</template>
<style scoped>
.page-progress {
  position: fixed;
  left: 0;
  top: 0;
  height: 2px;
  background: var(--color-primary);
  z-index: 80;
}
.doc-breadcrumbs {
  display: flex;
  align-items: center;
  gap: 9px;
  flex-wrap: wrap;
  color: var(--color-text-secondary);
  font-size: 12px;
  margin-bottom: 20px;
}
.doc-breadcrumbs > svg {
  width: 12px;
  opacity: 0.5;
}
.doc-breadcrumbs span:last-child {
  color: var(--color-text);
}
</style>
