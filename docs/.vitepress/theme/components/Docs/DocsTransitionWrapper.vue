<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter, useRoute } from 'vitepress';
import DocSkeleton from '../ui/DocSkeleton.vue';

const router = useRouter();
const route = useRoute();
const isNavigating = ref(false);
let navTimer: ReturnType<typeof setTimeout> | null = null;

watch(() => route.path, () => {
  if (navTimer) clearTimeout(navTimer);
  isNavigating.value = false;
});

onMounted(() => {
  if (typeof window === 'undefined') return;

  const originalBefore = router.onBeforeRouteChange;
  const originalAfter = router.onAfterRouteChange;

  router.onBeforeRouteChange = (to) => {
    isNavigating.value = true;
    if (navTimer) clearTimeout(navTimer);
    navTimer = setTimeout(() => {
      isNavigating.value = false;
    }, 400);
    if (originalBefore) originalBefore(to);
  };

  router.onAfterRouteChange = (to) => {
    if (navTimer) clearTimeout(navTimer);
    isNavigating.value = false;
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
