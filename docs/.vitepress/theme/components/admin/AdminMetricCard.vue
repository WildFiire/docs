<script setup lang="ts">
import { Icon } from '@iconify/vue';

defineProps<{
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral' | 'positive';
  icon: string;
  subtitle?: string;
}>();
</script>

<template>
  <div class="admin-metric-card">
    <div class="admin-metric-header">
      <span class="admin-metric-title">{{ title }}</span>
      <span class="admin-metric-icon-box">
        <Icon :icon="icon" width="16" height="16" />
      </span>
    </div>

    <div class="admin-metric-body">
      <span class="admin-metric-value">{{ value }}</span>
      <span
        v-if="change"
        :class="['admin-metric-trend', `admin-metric-trend--${trend || 'neutral'}`]"
      >
        {{ change }}
      </span>
    </div>

    <p v-if="subtitle" class="admin-metric-subtitle">{{ subtitle }}</p>
  </div>
</template>
