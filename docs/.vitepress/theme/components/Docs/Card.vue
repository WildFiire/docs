<script setup lang="ts">
import { useSlots } from 'vue';
import { Icon } from '@iconify/vue';

defineProps<{
  title?: string;
  description?: string;
  tag?: string;
  href?: string;
  icon?: string;
}>();

const slots = useSlots();
</script>

<template>
  <a v-if="href" :href="href" class="card">
    <div class="card-header-row">
      <div v-if="icon" class="card-icon-box">
        <Icon :icon="icon.includes(':') ? icon : `lucide:${icon}`" width="16" height="16" />
      </div>
      <span v-if="tag" class="card-tag">{{ tag }}</span>
      <Icon icon="lucide:arrow-right" width="15" height="15" class="card-arrow" aria-hidden="true" />
    </div>
    <div class="card-title">{{ title }}</div>
    <p v-if="description" class="card-description">{{ description }}</p>
    <div v-if="slots.default" class="card-description"><slot /></div>
  </a>

  <div v-else class="card">
    <div class="card-header-row">
      <div v-if="icon" class="card-icon-box">
        <Icon :icon="icon.includes(':') ? icon : `lucide:${icon}`" width="16" height="16" />
      </div>
      <span v-if="tag" class="card-tag">{{ tag }}</span>
      <Icon icon="lucide:arrow-right" width="15" height="15" class="card-arrow" aria-hidden="true" />
    </div>
    <div class="card-title">{{ title }}</div>
    <p v-if="description" class="card-description">{{ description }}</p>
    <div v-if="slots.default" class="card-description"><slot /></div>
  </div>
</template>
