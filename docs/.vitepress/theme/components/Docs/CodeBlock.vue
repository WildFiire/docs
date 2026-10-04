<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps<{
  code?: string;
  language?: string;
  filename?: string;
}>();

const copied = ref(false);
const preRef = ref<HTMLPreElement>();

async function handleCopy() {
  const text = props.code || preRef.value?.textContent || '';
  await navigator.clipboard.writeText(text);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
}
</script>

<template>
  <div class="code-block-wrapper">
    <div class="code-block-header">
      <span class="code-block-lang">
        <span v-if="filename" class="code-block-filename">{{ filename }}</span>
        <template v-else>{{ language || 'code' }}</template>
      </span>
      <button
        type="button"
        class="code-block-copy"
        :class="{ copied }"
        :aria-label="copied ? 'Copied!' : 'Copy code'"
        @click="handleCopy"
      >
        <template v-if="copied">
          <Icon icon="lucide:check" width="12" /> Copied
        </template>
        <template v-else>
          <Icon icon="lucide:copy" width="12" /> Copy
        </template>
      </button>
    </div>
    <pre ref="preRef"><code>{{ code }}<slot /></code></pre>
  </div>
</template>
