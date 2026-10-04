<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

interface GallerySlide {
  id: string;
  url: string;
  title: string;
  caption: string;
}

const props = defineProps<{
  cursorLine: number;
  availableAssets: { filename: string; url: string; sizeFormatted?: string }[];
}>();

const emit = defineEmits<{
  (e: 'insert', markdown: string): void;
  (e: 'close'): void;
}>();

const layout = ref<'carousel' | 'grid-2' | 'grid-3'>('carousel');
const slides = ref<GallerySlide[]>([
  {
    id: 'slide_1',
    url: props.availableAssets[0]?.url || '/media/preview1.png',
    title: 'Demonstrație MVP Anthem CS2',
    caption: 'Efect vizual și sonor redat la finalul fiecărei runde câștigate.',
  },
  {
    id: 'slide_2',
    url: props.availableAssets[1]?.url || '/media/preview2.png',
    title: 'Meniu Interactiv !shop',
    caption: 'Interfață intuitivă de achiziție skin-uri și beneficii VIP.',
  },
]);

function addSlide() {
  const nextNum = slides.value.length + 1;
  const randomAsset = props.availableAssets[slides.value.length % Math.max(1, props.availableAssets.length)];
  slides.value.push({
    id: `slide_${Date.now()}_${nextNum}`,
    url: randomAsset?.url || `/media/preview${nextNum}.png`,
    title: `Imagine Cadru #${nextNum}`,
    caption: `Descriere detaliată pentru imaginea #${nextNum}`,
  });
}

function removeSlide(id: string) {
  if (slides.value.length <= 1) return;
  slides.value = slides.value.filter((s) => s.id !== id);
}

function updateSlide(id: string, updates: Partial<GallerySlide>) {
  slides.value = slides.value.map((s) => (s.id === id ? { ...s, ...updates } : s));
}

function handleVaultSelect(slideId: string, e: Event) {
  const val = (e.target as HTMLSelectElement).value;
  if (val) updateSlide(slideId, { url: val });
}

function generateMarkdown(): string {
  if (layout.value === 'carousel') {
    const slideBlocks = slides.value.map(
      (s) => `![${s.title.trim() || 'Slide'}](${s.url.trim()})\n*${s.caption.trim() || s.title.trim()}*`
    );
    return `\`\`\`\`carousel\n${slideBlocks.join('\n<!-- slide -->\n')}\n\`\`\`\``;
  }

  // Grid layout
  const cols = layout.value === 'grid-2' ? '2' : '3';
  const imageItems = slides.value
    .map((s) => `  <DocCard title="${s.title}" image="${s.url}" description="${s.caption}" />`)
    .join('\n');
  return `<DocGrid cols="${cols}">\n${imageItems}\n</DocGrid>`;
}

function handleInsert() {
  emit('insert', generateMarkdown());
}
</script>

<template>
  <div class="admin-modal-overlay">
    <div class="admin-modal-container studio-gallery-modal-container">
      <!-- Header -->
      <div class="admin-modal-header">
        <div>
          <div class="studio-modal-badge">
            <Icon icon="lucide:layers" width="12" height="12" />
            <span>CONSTRUCTOR GALERIE &amp; CAROUSEL</span>
          </div>
          <h3 class="admin-modal-title">Configurare Galerie Imagini Multi-Slide</h3>
        </div>
        <button type="button" class="admin-modal-close-btn" title="Închide" @click="emit('close')">
          <Icon icon="lucide:x" width="16" height="16" />
        </button>
      </div>

      <!-- Location line indicator pill -->
      <div class="studio-builder-line-indicator">
        <div class="studio-builder-line-pill">
          <span class="studio-builder-pulse-dot" />
          <span>Punct de inserare activ: <strong>Linia {{ cursorLine }}</strong> din document</span>
        </div>
        <div class="studio-builder-dimensions-badge">
          <Icon icon="lucide:layers" width="12" height="12" />
          <span>{{ slides.length }} Slide-uri ({{ layout }})</span>
        </div>
      </div>

      <div class="admin-modal-body">
        <!-- Layout Switcher -->
        <div class="admin-form-group">
          <label class="admin-form-label">Stil Layout Galerie</label>
          <div class="studio-gallery-layouts-grid">
            <button
              type="button"
              class="studio-gallery-layout-btn"
              :class="{ active: layout === 'carousel' }"
              @click="layout = 'carousel'"
            >
              <Icon icon="lucide:sliders" width="15" height="15" />
              <strong>Carousel Interactiv (Slide-uri)</strong>
              <span>Comutare fluidă cu butoane Next/Prev</span>
            </button>
            <button
              type="button"
              class="studio-gallery-layout-btn"
              :class="{ active: layout === 'grid-2' }"
              @click="layout = 'grid-2'"
            >
              <Icon icon="lucide:image" width="15" height="15" />
              <strong>Grilă 2 Coloane (Side-by-Side)</strong>
              <span>Comparație două cadre paralele</span>
            </button>
            <button
              type="button"
              class="studio-gallery-layout-btn"
              :class="{ active: layout === 'grid-3' }"
              @click="layout = 'grid-3'"
            >
              <Icon icon="lucide:layers" width="15" height="15" />
              <strong>Grilă 3 Coloane (Cards Grid)</strong>
              <span>Vitrină compactă pentru multiple iteme</span>
            </button>
          </div>
        </div>

        <!-- Slides List -->
        <div class="studio-gallery-slides-header">
          <label class="admin-form-label mb-0">Imagini &amp; Texte Slide-uri ({{ slides.length }})</label>
          <button
            type="button"
            class="studio-table-action-pill studio-table-action-pill--add"
            @click="addSlide"
          >
            <Icon icon="lucide:plus" width="12" height="12" />
            <span>Adaugă Slide Nou</span>
          </button>
        </div>

        <div class="studio-gallery-slides-list">
          <div v-for="(slide, idx) in slides" :key="slide.id" class="studio-gallery-slide-card">
            <div class="studio-gallery-slide-index">#{{ idx + 1 }}</div>
            <div class="studio-gallery-slide-thumb">
              <img
                v-if="slide.url"
                :src="slide.url"
                alt="Slide Preview"
                @error="($event.target as HTMLElement).style.display = 'none'"
              />
              <Icon v-else icon="lucide:image" width="24" height="24" class="text-slate-500" />
            </div>

            <div class="studio-gallery-slide-inputs">
              <div class="studio-gallery-input-row">
                <input
                  v-model="slide.url"
                  type="text"
                  placeholder="Cale URL Imagine (/media/...)"
                  class="admin-form-input admin-table-mono"
                />
                <select
                  v-if="availableAssets.length > 0"
                  class="admin-form-input studio-gallery-vault-select"
                  @change="handleVaultSelect(slide.id, $event)"
                >
                  <option value="" disabled selected>Alege din Vault...</option>
                  <option v-for="asset in availableAssets" :key="asset.url" :value="asset.url">
                    {{ asset.filename }}
                  </option>
                </select>
              </div>

              <div class="studio-gallery-input-row">
                <input
                  v-model="slide.title"
                  type="text"
                  placeholder="Titlu Imagine (ex. Meniu Principal)"
                  class="admin-form-input"
                />
                <input
                  v-model="slide.caption"
                  type="text"
                  placeholder="Descriere / Subtitlu Slide"
                  class="admin-form-input"
                />
              </div>
            </div>

            <button
              v-if="slides.length > 1"
              type="button"
              class="studio-gallery-slide-del-btn"
              title="Șterge acest slide"
              @click="removeSlide(slide.id)"
            >
              <Icon icon="lucide:trash-2" width="13" height="13" />
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="admin-modal-footer">
        <button type="button" class="admin-btn admin-btn--secondary" @click="emit('close')">
          Anulează
        </button>
        <button
          type="button"
          class="admin-btn admin-btn--primary studio-insert-submit-btn"
          @click="handleInsert"
        >
          <Icon icon="lucide:check" width="14" height="14" />
          <span>Inserează Galeria la Linia {{ cursorLine }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
