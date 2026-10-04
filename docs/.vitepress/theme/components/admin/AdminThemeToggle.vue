<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';

const theme = ref<'light' | 'dark'>('dark');
const mounted = ref(false);

onMounted(() => {
  mounted.value = true;
  const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
  const initial = stored || (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'dark';
  theme.value = initial;
  document.documentElement.setAttribute('data-theme', initial);
});

function toggleTheme() {
  const next = theme.value === 'light' ? 'dark' : 'light';
  theme.value = next;
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: next } }));
}
</script>

<template>
  <button
    v-if="!mounted"
    type="button"
    class="admin-header-theme-btn"
    aria-label="Schimbă tema"
  >
    <Icon icon="lucide:moon" width="15" height="15" />
  </button>

  <button
    v-else
    type="button"
    class="admin-header-theme-btn"
    :class="theme === 'light' ? 'admin-header-theme-btn--light' : 'admin-header-theme-btn--dark'"
    :aria-label="theme === 'light' ? 'Comută pe Modul Întunecat (Dark Mode)' : 'Comută pe Modul Luminos (Light Mode)'"
    :title="theme === 'light' ? 'Comută pe Modul Întunecat' : 'Comută pe Modul Luminos'"
    @click="toggleTheme"
  >
    <Icon
      v-if="theme === 'light'"
      icon="lucide:moon"
      width="15"
      height="15"
      class="admin-header-theme-icon admin-header-theme-icon--moon"
    />
    <Icon
      v-else
      icon="lucide:sun"
      width="15"
      height="15"
      class="admin-header-theme-icon admin-header-theme-icon--sun"
    />
  </button>
</template>
