<script setup lang="ts">
import { Icon } from '@iconify/vue';

const props = withDefaults(
  defineProps<{
    src: string;
    title?: string;
    badge?: string;
  }>(),
  {
    title: 'Previzualizare Video HD',
    badge: 'In-Game Preview',
  },
);

function handleOpenModal(e?: Event) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  if (typeof window !== 'undefined' && (window as any).__openWfLightbox) {
    (window as any).__openWfLightbox({
      type: 'video',
      src: props.src,
      title: props.title || 'Previzualizare Video HD',
    });
  }
}
</script>

<template>
  <figure v-if="src && src.trim() !== ''" class="doc-orange-player-figure not-prose">
    <div
      class="doc-orange-player-card"
      title="Apasă pentru a deschide videoclipul în mod teatru HD"
      role="button"
      tabindex="0"
      @click="handleOpenModal"
      @keydown.enter="handleOpenModal"
      @keydown.space.prevent="handleOpenModal"
    >
      <!-- Top Header Bar -->
      <div class="doc-orange-player-header">
        <div class="doc-orange-player-badge">
          <Icon icon="lucide:film" width="12" class="text-amber-400" aria-hidden="true" />
          <span>{{ badge }}</span>
        </div>

        <span class="doc-orange-player-title">{{ title || 'Previzualizare Video HD' }}</span>

        <div class="doc-orange-player-status">
          <span class="player-status-dot" aria-hidden="true" />
          <span>HD PREVIEW</span>
        </div>
      </div>

      <!-- Video Canvas Stage with Center Orange Play Button -->
      <div class="doc-orange-player-stage">
        <video
          :src="src"
          preload="metadata"
          muted
          playsinline
          class="doc-orange-player-bg-video"
        />

        <!-- Dark Glass Vignette Overlay -->
        <div class="doc-orange-player-overlay" />

        <!-- Big Glowing Center Orange Play Button -->
        <div class="doc-orange-play-btn-wrap">
          <div class="doc-orange-play-btn-pulse" aria-hidden="true" />
          <div class="doc-orange-play-btn">
            <Icon icon="lucide:play" width="28" height="28" class="play-icon-fill" aria-hidden="true" />
          </div>
          <span class="doc-orange-play-label">
            <span>Lansează Video</span>
            <Icon icon="lucide:sparkles" width="11" class="text-amber-300" aria-hidden="true" />
          </span>
        </div>
      </div>

      <!-- Bottom Bar: Action Hint & Fullscreen Icon -->
      <div class="doc-orange-player-footer">
        <div class="player-footer-left">
          <Icon icon="lucide:volume-2" width="13" class="text-amber-400/80" aria-hidden="true" />
          <span>Click oriunde pentru a deschide playerul cinematic</span>
        </div>
        <div class="player-footer-right">
          <span class="player-theatre-tag">
            <Icon icon="lucide:maximize-2" width="11" aria-hidden="true" />
            <span>Mod Teatru</span>
          </span>
        </div>
      </div>
    </div>

    <figcaption v-if="title" class="doc-orange-player-caption">{{ title }}</figcaption>
  </figure>
</template>
