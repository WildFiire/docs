<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vitepress';
import DocSkeleton from '../ui/DocSkeleton.vue';

const router = useRouter();
const isNavigating = ref(false);
let navTimer: ReturnType<typeof setTimeout> | null = null;

onMounted(() => {
  if (typeof window === 'undefined') return;

  const originalBefore = router.onBeforeRouteChange;
  const originalAfter = router.onAfterRouteChange;

  router.onBeforeRouteChange = (to) => {
    isNavigating.value = true;
    if (navTimer) clearTimeout(navTimer);
    navTimer = setTimeout(() => {
      isNavigating.value = false;
    }, 4000);
    if (originalBefore) originalBefore(to);
  };

  router.onAfterRouteChange = (to) => {
    if (navTimer) clearTimeout(navTimer);
    navTimer = setTimeout(() => {
      isNavigating.value = false;
    }, 80);
    if (originalAfter) originalAfter(to);
  };
});

onUnmounted(() => {
  if (navTimer) clearTimeout(navTimer);
});
</script>

<template>
  <div class="docs-transition-container">
    <div v-if="isNavigating" class="docs-transition-skeleton animate-fade-in">
      <DocSkeleton />
    </div>
    <div v-show="!isNavigating" class="docs-transition-content animate-fade-in">
      <slot />
    </div>
  </div>
</template>
