<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vitepress';

const props = defineProps<{ href: string }>();
const router = useRouter();

onMounted(() => {
  if (props.href) {
    if (typeof window !== 'undefined') {
      window.location.replace(props.href);
    } else {
      router.go(props.href);
    }
  }
});
</script>

<template>
  <div style="padding: var(--space-8); text-align: center; color: var(--color-text-secondary); font-size: var(--text-sm);">
    Se redirecționează către <a :href="href" style="color: var(--color-primary); font-weight: 600;">{{ href }}</a>...
  </div>
</template>
