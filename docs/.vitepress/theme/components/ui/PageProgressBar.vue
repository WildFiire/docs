<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vitepress';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const progress = ref(0);
let timers: ReturnType<typeof setTimeout>[] = [];

function clearAllTimers() {
  timers.forEach(t => clearTimeout(t));
  timers = [];
}

function finish() {
  clearAllTimers();
  progress.value = 100;
  const finishTimer = setTimeout(() => {
    loading.value = false;
    progress.value = 0;
  }, 250);
  timers.push(finishTimer);
}

function start() {
  clearAllTimers();
  loading.value = true;
  progress.value = 35;

  const t1 = setTimeout(() => { progress.value = 65; }, 150);
  const t2 = setTimeout(() => { progress.value = 85; }, 350);
  const failSafe = setTimeout(() => {
    finish();
  }, 4000);

  timers.push(t1, t2, failSafe);
}

onMounted(() => {
  if (typeof window === 'undefined') return;

  const originalBefore = router.onBeforeRouteChange;
  const originalAfter = router.onAfterRouteChange;

  router.onBeforeRouteChange = (to) => {
    start();
    if (originalBefore) originalBefore(to);
  };

  router.onAfterRouteChange = (to) => {
    finish();
    if (originalAfter) originalAfter(to);
  };
});

watch(() => route.path, () => {
  finish();
});

onUnmounted(() => {
  clearAllTimers();
});
</script>

<template>
  <div
    v-if="loading || progress > 0"
    class="page-progress-bar-container"
    aria-hidden="true"
  >
    <div
      class="page-progress-bar-fill"
      :style="{
        width: `${progress}%`,
        opacity: progress === 100 ? 0 : 1,
      }"
    />
  </div>
</template>
