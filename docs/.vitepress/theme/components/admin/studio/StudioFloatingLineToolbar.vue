<script setup lang="ts">
import { ref, watch } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps<{
  cursorLine: number;
}>();

const emit = defineEmits<{
  (e: 'open-table-builder'): void;
  (e: 'open-callout-builder'): void;
  (e: 'open-code-builder'): void;
  (e: 'open-media-modal', tab: 'upload' | 'vault' | 'embed'): void;
  (e: 'open-gallery-builder'): void;
  (e: 'insert-quick-snippet', snippet: string): void;
  (e: 'jump-to-line', line: number): void;
}>();

const expanded = ref(false);
const inputLine = ref(props.cursorLine?.toString() || '1');

watch(
  () => props.cursorLine,
  (val) => {
    inputLine.value = (val || 1).toString();
  }
);

function handleInputKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const ln = parseInt(inputLine.value, 10);
    if (!isNaN(ln) && ln > 0) {
      emit('jump-to-line', ln);
    }
  }
}

function handleInputBlur() {
  inputLine.value = (props.cursorLine || 1).toString();
}

function handleInputChange(e: Event) {
  const val = (e.target as HTMLInputElement).value.replace(/[^0-9]/g, '');
  inputLine.value = val;
}
</script>

<template>
  <div class="studio-floating-line-bar">
    <div class="studio-floating-line-anchor">
      <div
        class="studio-floating-line-trigger-btn"
        :class="{ active: expanded }"
        style="display: flex; align-items: center; gap: 4px; padding-right: 4px;"
      >
        <button
          type="button"
          title="Instrumente Rapide"
          style="display: flex; align-items: center; justify-content: center; background: transparent; border: none; color: inherit; cursor: pointer; padding: 0 4px;"
          @click="expanded = !expanded"
        >
          <Icon :icon="expanded ? 'lucide:x' : 'lucide:plus'" width="12" height="12" />
        </button>
        <span style="font-size: 11px; font-weight: 600;">Linia</span>
        <input
          type="text"
          :value="inputLine"
          title="Tastează și apasă Enter pentru a sări"
          style="width: 28px; background: transparent; border: none; color: #38bdf8; font-size: 11px; font-weight: 700; text-align: center; outline: none; padding: 0; margin: 0;"
          @input="handleInputChange"
          @keydown="handleInputKeydown"
          @blur="handleInputBlur"
        />
      </div>

      <!-- Expanded Floating Popover -->
      <div v-if="expanded" class="studio-floating-popover">
        <div class="studio-floating-popover-header">
          <span>Instrumente Inserare la Linia {{ cursorLine }}</span>
          <button
            type="button"
            class="studio-floating-popover-close"
            @click="expanded = false"
          >
            <Icon icon="lucide:x" width="11" height="11" />
          </button>
        </div>

        <div class="studio-floating-grid">
          <button
            type="button"
            class="studio-floating-item studio-floating-item--accent"
            @click="expanded = false; emit('open-table-builder')"
          >
            <Icon icon="lucide:table" width="14" height="14" />
            <div class="studio-floating-item-text">
              <strong>Tabel Vizual</strong>
              <span>Generator linii &amp; coloane</span>
            </div>
          </button>

          <button
            type="button"
            class="studio-floating-item"
            @click="expanded = false; emit('open-callout-builder')"
          >
            <Icon icon="lucide:message-square-quote" width="14" height="14" />
            <div class="studio-floating-item-text">
              <strong>Notă / Alertă</strong>
              <span>Note, Tip, Important, Warning</span>
            </div>
          </button>

          <button
            type="button"
            class="studio-floating-item"
            @click="expanded = false; emit('open-code-builder')"
          >
            <Icon icon="lucide:code" width="14" height="14" />
            <div class="studio-floating-item-text">
              <strong>Bloc de Cod</strong>
              <span>Bash, TS, JSON, CS2 cfg</span>
            </div>
          </button>

          <button
            type="button"
            class="studio-floating-item"
            @click="expanded = false; emit('open-media-modal', 'vault')"
          >
            <Icon icon="lucide:image" width="14" height="14" />
            <div class="studio-floating-item-text">
              <strong>Imagine / Asset</strong>
              <span>Upload &amp; Media Vault</span>
            </div>
          </button>

          <button
            type="button"
            class="studio-floating-item"
            @click="expanded = false; emit('open-media-modal', 'embed')"
          >
            <Icon icon="lucide:play" width="14" height="14" />
            <div class="studio-floating-item-text">
              <strong>Video Embed</strong>
              <span>Player YouTube / MP4</span>
            </div>
          </button>

          <button
            type="button"
            class="studio-floating-item"
            @click="expanded = false; emit('open-gallery-builder')"
          >
            <Icon icon="lucide:layers" width="14" height="14" />
            <div class="studio-floating-item-text">
              <strong>Galerie Slide-uri</strong>
              <span>Carousel multi-cadru</span>
            </div>
          </button>
        </div>

        <div class="studio-floating-divider" />

        <div class="studio-floating-quick-row">
          <button
            type="button"
            class="studio-floating-micro-btn"
            title="Inserează Titlu H2"
            @click="expanded = false; emit('insert-quick-snippet', `## Secțiune Nouă L${cursorLine}\n`)"
          >
            <Icon icon="lucide:heading-2" width="12" height="12" />
            <span>H2</span>
          </button>
          <button
            type="button"
            class="studio-floating-micro-btn"
            title="Inserează Listă"
            @click="expanded = false; emit('insert-quick-snippet', '- Element listă 1\n- Element listă 2\n- Element listă 3\n')"
          >
            <Icon icon="lucide:list" width="12" height="12" />
            <span>Listă</span>
          </button>
          <button
            type="button"
            class="studio-floating-micro-btn"
            title="Inserează Listă cu Bife (Checklist)"
            @click="expanded = false; emit('insert-quick-snippet', '- [x] Pas completat\n- [ ] Pas în așteptare\n')"
          >
            <Icon icon="lucide:check-square" width="12" height="12" />
            <span>Bife</span>
          </button>
          <button
            type="button"
            class="studio-floating-micro-btn"
            title="Inserează Separator Orizontal"
            @click="expanded = false; emit('insert-quick-snippet', '\n---\n')"
          >
            <Icon icon="lucide:minus" width="12" height="12" />
            <span>Linie Divider</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
