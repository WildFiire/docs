<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';

interface ShuffleSlide {
  id: string;
  dotColor: string;
  dotGlow: string;
  category: string;
  title: string;
  description: string;
  badge: string;
  badgeColor?: string;
  actionType: 'open-ai' | 'link' | 'next-tip';
  actionLabel: string;
  actionHref?: string;
}

const PRO_TIPS = [
  'Folosește comanda !ws în chat pentru a alege orice skin de armă în meci.',
  'Tastează !knife sau !gloves pentru a-ți schimba gratuit cuțitul și mănușile.',
  'Comanda !shop îți permite să cumperi efecte, tag-uri și titluri personalizate.',
  'Câștigă Credite jucând pe server sau participând la jocurile !dice și !roulette.',
  'Găsești orice ghid sau comandă de CS2 căutând în Docs cu scurtătura Ctrl+K.',
];

const currentIndex = ref(0);
const isPaused = ref(false);
const tipIndex = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;

const slides = computed<ShuffleSlide[]>(() => [
  {
    id: 'ai-assistant',
    dotColor: '#fb923c',
    dotGlow: 'rgba(251, 146, 60, 0.6)',
    category: 'ASISTENT AI',
    title: 'WildFire AI Docs',
    description: 'Întreabă orice despre comenzi CS2, credite, skin-uri sau VIP.',
    badge: 'Online 24/7',
    badgeColor: '#fb923c',
    actionType: 'open-ai',
    actionLabel: 'Deschide Chat',
  },
  {
    id: 'skins-guide',
    dotColor: '#38bdf8',
    dotGlow: 'rgba(56, 189, 248, 0.6)',
    category: 'SKINURI & CUȚITE',
    title: 'Sistemul !ws & !knife',
    description: 'Personalizează-ți armele cu !ws, !knife, !gloves și !agents.',
    badge: '!ws / !knife',
    badgeColor: '#38bdf8',
    actionType: 'link',
    actionLabel: 'Vezi Ghid',
    actionHref: '/systems/skins',
  },
  {
    id: 'economy-guide',
    dotColor: '#34d399',
    dotGlow: 'rgba(52, 211, 153, 0.6)',
    category: 'ECONOMIE & CREDITE',
    title: 'Credite & Mini-Game-uri',
    description: 'Acumulează credite și testează-ți norocul la !dice și !roulette.',
    badge: '!credits',
    badgeColor: '#34d399',
    actionType: 'link',
    actionLabel: 'Vezi Sistem',
    actionHref: '/currency',
  },
  {
    id: 'discord-hub',
    dotColor: '#818cf8',
    dotGlow: 'rgba(129, 140, 248, 0.6)',
    category: 'COMUNITATE CS2',
    title: 'Discord-ul Oficial',
    description: '2.860+ jucători de CS2. Anunțuri, update-uri și suport.',
    badge: 'discord.gg',
    badgeColor: '#a5b4fc',
    actionType: 'link',
    actionLabel: 'Conectează-te',
    actionHref: 'https://discord.gg/wildfire',
  },
  {
    id: 'pro-tip',
    dotColor: '#facc15',
    dotGlow: 'rgba(250, 204, 21, 0.6)',
    category: 'PRO TIP CS2',
    title: 'Sfat de la Comunitate',
    description: PRO_TIPS[tipIndex.value],
    badge: `Tip #${tipIndex.value + 1}`,
    badgeColor: '#fde047',
    actionType: 'next-tip',
    actionLabel: 'Alt Sfat',
  },
]);

const currentSlide = computed(() => slides.value[currentIndex.value]);

function handleNext() {
  currentIndex.value = (currentIndex.value + 1) % slides.value.length;
}

function handlePrev() {
  currentIndex.value = (currentIndex.value - 1 + slides.value.length) % slides.value.length;
}

function handleOpenAi() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('wf:open-ai'));
  }
}

function handleNextTip() {
  tipIndex.value = (tipIndex.value + 1) % PRO_TIPS.length;
}

onMounted(() => {
  timer = setInterval(() => {
    if (!isPaused.value) {
      handleNext();
    }
  }, 6500);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <div
    class="sidebar-liquid-card sidebar-shuffle-card"
    role="region"
    aria-label="WildFire Community Spotlight"
    @mouseenter="isPaused = true"
    @mouseleave="isPaused = false"
  >
    <!-- Top micro progress bar -->
    <div :key="currentIndex" class="shuffle-card-progress" />

    <!-- Header row with status dot, category & manual nav arrows -->
    <div class="liquid-card-header shuffle-card-header">
      <div class="shuffle-header-left">
        <span
          class="liquid-card-dot"
          :style="{
            background: currentSlide.dotColor,
            boxShadow: `0 0 6px ${currentSlide.dotGlow}`,
          }"
          aria-hidden="true"
        />
        <span class="shuffle-category-label">{{ currentSlide.category }}</span>
      </div>

      <!-- Dots & Nav buttons -->
      <div class="shuffle-nav-controls">
        <button
          type="button"
          class="shuffle-ctrl-btn"
          title="Anterior"
          aria-label="Anterior"
          @click="handlePrev"
        >
          <Icon icon="lucide:chevron-left" width="11" />
        </button>

        <div class="shuffle-dots-wrap">
          <button
            v-for="(_, idx) in slides"
            :key="idx"
            type="button"
            class="shuffle-dot"
            :class="{ 'shuffle-dot--active': currentIndex === idx }"
            :title="`Mergi la slide ${idx + 1}`"
            :aria-label="`Slide ${idx + 1}`"
            @click="currentIndex = idx"
          />
        </div>

        <button
          type="button"
          class="shuffle-ctrl-btn"
          title="Următor"
          aria-label="Următor"
          @click="handleNext"
        >
          <Icon icon="lucide:chevron-right" width="11" />
        </button>
      </div>
    </div>

    <!-- Slide Title -->
    <div class="shuffle-title-row">
      <span class="liquid-card-title">{{ currentSlide.title }}</span>
    </div>

    <!-- Slide Description -->
    <p class="liquid-card-desc shuffle-desc">{{ currentSlide.description }}</p>

    <!-- Footer Row: Action Button + Badge -->
    <div class="liquid-card-footer shuffle-card-footer">
      <button
        v-if="currentSlide.actionType === 'open-ai'"
        type="button"
        class="shuffle-action-btn shuffle-action-btn--ai"
        @click="handleOpenAi"
      >
        <Icon icon="lucide:sparkles" width="10" />
        <span>{{ currentSlide.actionLabel }}</span>
      </button>

      <template v-else-if="currentSlide.actionType === 'link' && currentSlide.actionHref">
        <a
          v-if="currentSlide.actionHref.startsWith('http')"
          :href="currentSlide.actionHref"
          target="_blank"
          rel="noopener noreferrer"
          class="shuffle-action-btn"
        >
          <Icon icon="lucide:external-link" width="10" />
          <span>{{ currentSlide.actionLabel }}</span>
        </a>
        <a
          v-else
          :href="currentSlide.actionHref"
          class="shuffle-action-btn"
        >
          <Icon icon="lucide:chevron-right" width="10" />
          <span>{{ currentSlide.actionLabel }}</span>
        </a>
      </template>

      <button
        v-else-if="currentSlide.actionType === 'next-tip'"
        type="button"
        class="shuffle-action-btn"
        @click="handleNextTip"
      >
        <Icon icon="lucide:shuffle" width="10" />
        <span>{{ currentSlide.actionLabel }}</span>
      </button>

      <!-- Right Badge -->
      <span
        class="shuffle-badge"
        :style="{
          color: currentSlide.badgeColor || 'var(--color-primary)',
          borderColor: `${currentSlide.dotColor}40`,
          backgroundColor: `${currentSlide.dotColor}14`,
        }"
      >
        {{ currentSlide.badge }}
      </span>
    </div>
  </div>
</template>
