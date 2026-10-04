<script setup lang="ts">
defineProps<{ label: string }>();
</script>
<template>
  <div class="tab-content"><slot /></div>
</template>
