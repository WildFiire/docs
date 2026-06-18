<template>
  <div 
    class="global-ticker-wrap" 
    :style="{ backgroundColor, transform: `skewY(${skewY}deg)`, '--ticker-speed': speed }"
  >
    <div class="global-ticker" :style="{ animationDuration: speed }">
      <div v-for="i in 6" :key="i" class="global-ticker-content">
        <span v-for="(item, idx) in items" :key="idx" :style="{ color: textColor }">{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    default: () => [
      '/// WILDFIRE WIKI',
      '/// DOCUMENTATIE CS2',
      '/// COMMUNITY',
      '/// UPDATES',
      '/// RESURSE'
    ]
  },
  speed: {
    type: String,
    default: '20s'
  },
  backgroundColor: {
    type: String,
    default: '#ff7800'
  },
  textColor: {
    type: String,
    default: '#000000'
  },
  skewY: {
    type: Number,
    default: -1
  }
});
</script>

<style scoped>
/* ============================================
   GLOBAL TICKER (MARQUEE SEPARATOR)
   ============================================ */

.global-ticker-wrap {
    position: relative;
    width: 100%;
    padding: 0.5rem 0;
    overflow: hidden;
    z-index: 20;
    box-shadow: 0 0 20px rgba(255, 120, 0, 0.4);
    transform-origin: center;
    margin: 2rem 0;
}

.global-ticker {
    display: flex;
    width: fit-content;
    animation: marquee var(--ticker-speed, 20s) linear infinite;
}

.global-ticker-content {
    display: flex;
    gap: 2rem;
    padding-right: 2rem;
    white-space: nowrap;
}

.global-ticker-content span {
    font-size: 0.85rem;
    font-weight: 900;
    letter-spacing: 2px;
}

@keyframes marquee {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-50%);
    }
}
</style>
