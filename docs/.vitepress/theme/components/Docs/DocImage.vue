<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps<{
  src: string;
  alt?: string;
  className?: string;
}>();

const isGif = computed(() => {
  const s = (props.src || '').toLowerCase();
  return s.endsWith('.gif') || s.includes('.gif');
});

function handleClick(e: MouseEvent) {
  e.preventDefault();
  e.stopPropagation();
  if (typeof window !== 'undefined' && (window as any).__openWfLightbox) {
    (window as any).__openWfLightbox({
      type: 'image',
      src: props.src,
      title: props.alt && props.alt !== 'Doc image' ? props.alt : 'Previzualizare Imagine',
      alt: props.alt,
    });
  }
}
</script>

<template>
  <figure
    v-if="src"
    class="doc-image-figure not-prose"
    title="Apasă pentru a mări imaginea (Lightbox HD)"
    @click="handleClick"
  >
    <div class="doc-image-wrap">
      <!-- Sleek Showcase Top Bar -->
      <div class="doc-image-topbar">
        <div class="doc-image-dots">
          <span class="doc-image-dot" />
          <span class="doc-image-dot" />
          <span class="doc-image-dot" />
        </div>
        <div class="doc-image-meta">
          <span class="doc-image-badge">
            <Icon icon="lucide:image" width="10" class="text-amber-400" />
            <span>{{ isGif ? 'DEMO ANIMAT' : 'PREVIZUALIZARE' }}</span>
          </span>
        </div>
      </div>

      <!-- Media Frame -->
      <div class="doc-image-media-container">
        <img
          :src="src"
          :alt="alt || 'Doc image'"
          :class="['doc-image-element', className]"
          loading="lazy"
        />

        <!-- Hover Zoom Overlay Badge -->
        <div class="doc-image-zoom-overlay">
          <span class="doc-image-zoom-pill">
            <Icon icon="lucide:maximize-2" width="13" aria-hidden="true" />
            <span>Mărește Imaginea HD</span>
          </span>
        </div>
      </div>
    </div>

    <figcaption
      v-if="alt && alt.trim() !== '' && alt !== 'Doc image'"
      class="doc-image-caption"
    >
      <span class="doc-image-caption-pill">{{ alt }}</span>
    </figcaption>
  </figure>
</template>
