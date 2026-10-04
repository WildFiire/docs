<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useData } from 'vitepress';

const { isDark } = useData();
const theme = ref<'light' | 'dark'>('dark');
const mounted = ref(false);

onMounted(() => {
  mounted.value = true;
  const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
  const initial = stored ?? 'dark';
  theme.value = initial;
  isDark.value = initial === 'dark';
  document.documentElement.setAttribute('data-theme', initial);
});

function toggle() {
  const next = theme.value === 'light' ? 'dark' : 'light';
  theme.value = next;
  isDark.value = next === 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try {
    localStorage.setItem('theme', next);
  } catch {}
}
</script>

<template>
  <button
    v-if="!mounted"
    type="button"
    class="theme-toggle"
    aria-label="Toggle theme"
    disabled
  >
    <Icon icon="lucide:sun" width="18" />
  </button>
  <button
    v-else
    type="button"
    class="theme-toggle"
    :aria-label="theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'"
    :title="theme === 'light' ? 'Dark mode' : 'Light mode'"
    @click="toggle"
  >
    <Icon :icon="theme === 'light' ? 'lucide:moon' : 'lucide:sun'" width="18" />
  </button>
</template>
