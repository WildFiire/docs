<script setup lang="ts">
defineProps<{ title?: string }>();
</script>

<template>
  <div class="step">
    <div class="step-number" aria-hidden="true" />
    <div class="step-content">
      <div v-if="title" class="step-title">{{ title }}</div>
      <div><slot /></div>
    </div>
  </div>
</template>
