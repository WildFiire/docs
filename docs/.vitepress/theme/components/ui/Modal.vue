<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted } from 'vue';
const props = defineProps<{ open: boolean; title: string }>();
const emit = defineEmits<{ close: [] }>();
const dialog = ref<HTMLDialogElement>();
let previous: HTMLElement | null = null;
watch(
  () => props.open,
  async (open) => {
    await nextTick();
    if (typeof document === 'undefined') return;
    if (open) {
      previous = document.activeElement as HTMLElement;
      try {
        if (!dialog.value?.open) dialog.value?.showModal();
      } catch {}
    } else {
      try {
        dialog.value?.close();
      } catch {}
      previous?.focus();
    }
  },
  { immediate: true },
);
onUnmounted(() => {
  try {
    dialog.value?.close();
  } catch {}
  previous?.focus();
});
</script>
<template>
  <Teleport to="body" v-if="open">
    <dialog
      ref="dialog"
      class="wf-dialog"
      aria-modal="true"
      :aria-label="title"
      @cancel.prevent="emit('close')"
      @click="$event.target === dialog && emit('close')"
    >
      <div class="wf-dialog-inner">
        <header>
          <h2>{{ title }}</h2>
          <button type="button" @click="emit('close')" aria-label="Închide">×</button>
        </header>
        <slot />
      </div>
    </dialog>
  </Teleport>
</template>
