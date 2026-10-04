<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';

const props = withDefaults(
  defineProps<{
    type?: 'note' | 'tip' | 'warning' | 'danger' | 'caution' | 'important';
    title?: string;
  }>(),
  { type: 'note' },
);

const CALLOUT_DATA: Record<string, { icon: string; label: string }> = {
  note: { icon: 'lucide:info', label: 'Notă' },
  tip: { icon: 'lucide:check-circle-2', label: 'Sfat' },
  warning: { icon: 'lucide:alert-triangle', label: 'Atenție' },
  danger: { icon: 'lucide:shield-alert', label: 'Pericol' },
  caution: { icon: 'lucide:shield-alert', label: 'Precauție' },
  important: { icon: 'lucide:flame', label: 'Important' },
};

const meta = computed(() => CALLOUT_DATA[props.type] || CALLOUT_DATA.note);
</script>

<template>
  <div class="callout" :class="`callout--${type}`" role="note">
    <div class="callout-icon-wrapper" aria-hidden="true">
      <Icon :icon="meta.icon" width="16" height="16" />
    </div>
    <div class="callout-content">
      <div class="callout-title">{{ title ?? meta.label }}</div>
      <div class="callout-body"><slot /></div>
    </div>
  </div>
</template>
