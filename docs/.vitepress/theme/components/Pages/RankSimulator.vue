<template>
  <div class="rs-wrap">
    <div class="rs-header">
      <svg class="rs-header__icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
      </svg>
      <div>
        <div class="rs-header__title">Simulator Rank ELO</div>
        <div class="rs-header__sub">Introdu punctele ELO pentru a vedea rank-ul tau</div>
      </div>
    </div>

    <!-- ELO Input -->
    <div class="rs-input-row">
      <label class="rs-label" for="rs-elo-input">Puncte ELO</label>
      <div class="rs-input-wrap">
        <input
          id="rs-elo-input"
          type="number"
          v-model.number="elo"
          :min="0"
          :max="maxElo"
          class="rs-input"
          placeholder="ex: 12500"
          @input="clampElo"
        />
        <span class="rs-input-unit">ELO</span>
      </div>
      <input
        type="range"
        v-model.number="elo"
        :min="0"
        :max="maxElo"
        :step="100"
        class="rs-slider"
        :style="{ '--pct': sliderPct + '%', '--rank-color': currentRank.color }"
        @input="clampElo"
      />
      <div class="rs-slider-labels">
        <span>0</span>
        <span>{{ maxElo.toLocaleString() }}+</span>
      </div>
    </div>

    <!-- Rank display -->
    <Transition name="rank-change" mode="out-in">
      <div class="rs-rank-card" :key="currentRank.name" :style="{ '--rank-color': currentRank.color }">
        <div class="rs-rank-card__glow"></div>
        <div class="rs-rank-card__left">
          <div class="rs-rank-badge" :style="{ background: `rgba(${currentRank.colorRgb}, 0.12)`, borderColor: `rgba(${currentRank.colorRgb}, 0.3)` }">
            <span class="rs-rank-badge__text" :style="{ color: currentRank.color }">{{ currentRank.abbr }}</span>
          </div>
        </div>
        <div class="rs-rank-card__body">
          <div class="rs-rank-name" :style="{ color: currentRank.color }">{{ currentRank.name }}</div>
          <div class="rs-rank-range">{{ currentRank.min.toLocaleString() }} – {{ currentRank.max === Infinity ? '∞' : currentRank.max.toLocaleString() }} ELO</div>
          <!-- Progress bar to next rank -->
          <div v-if="nextRank" class="rs-progress-wrap">
            <div class="rs-progress-track">
              <div class="rs-progress-fill" :style="{ width: progressToNext + '%', background: currentRank.color }"></div>
            </div>
            <div class="rs-progress-labels">
              <span>{{ elo.toLocaleString() }} ELO</span>
              <span>Urmator: <strong>{{ nextRank.name }}</strong> ({{ nextRank.min.toLocaleString() }} ELO)</span>
            </div>
            <div class="rs-progress-remaining">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
              Mai ai <strong>{{ (nextRank.min - elo).toLocaleString() }}</strong> ELO pana la {{ nextRank.name }}
            </div>
          </div>
          <div v-else class="rs-progress-remaining rs-top">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Rank maxim atins! Global Elite!
          </div>
        </div>
      </div>
    </Transition>

    <!-- Full rank ladder -->
    <div class="rs-ladder">
      <div class="rs-ladder__title">Scala Completă de Rank-uri</div>
      <div class="rs-ladder__list">
        <div
          v-for="rank in ranks"
          :key="rank.name"
          class="rs-ladder__item"
          :class="{ 'rs-ladder__item--active': rank.name === currentRank.name }"
          :style="{ '--rank-color': rank.color }"
          @click="elo = rank.min"
        >
          <span class="rs-ladder__abbr" :style="{ color: rank.color }">{{ rank.abbr }}</span>
          <span class="rs-ladder__name">{{ rank.name }}</span>
          <span class="rs-ladder__elo">{{ rank.min.toLocaleString() }}+</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const maxElo = 35000

const ranks = [
  { name: 'Silver I',                       abbr: 'S1',   min: 0,     max: 1749,   color: '#9ca3af', colorRgb: '156,163,175' },
  { name: 'Silver II',                      abbr: 'S2',   min: 1750,  max: 2499,   color: '#9ca3af', colorRgb: '156,163,175' },
  { name: 'Silver III',                     abbr: 'S3',   min: 2500,  max: 3249,   color: '#9ca3af', colorRgb: '156,163,175' },
  { name: 'Silver IV',                      abbr: 'S4',   min: 3250,  max: 4999,   color: '#9ca3af', colorRgb: '156,163,175' },
  { name: 'Gold Nova I',                    abbr: 'GN1',  min: 5000,  max: 6999,   color: '#fbbf24', colorRgb: '251,191,36' },
  { name: 'Gold Nova II',                   abbr: 'GN2',  min: 7000,  max: 8999,   color: '#fbbf24', colorRgb: '251,191,36' },
  { name: 'Gold Nova III',                  abbr: 'GN3',  min: 9000,  max: 9999,   color: '#fbbf24', colorRgb: '251,191,36' },
  { name: 'Master Guardian I',              abbr: 'MG1',  min: 10000, max: 12499,  color: '#6366f1', colorRgb: '99,102,241' },
  { name: 'Master Guardian II',             abbr: 'MG2',  min: 12500, max: 14999,  color: '#6366f1', colorRgb: '99,102,241' },
  { name: 'Master Guardian Elite',          abbr: 'MGE',  min: 15000, max: 17499,  color: '#6366f1', colorRgb: '99,102,241' },
  { name: 'Distinguished Master Guardian',  abbr: 'DMG',  min: 17500, max: 19999,  color: '#8b5cf6', colorRgb: '139,92,246' },
  { name: 'Legendary Eagle',                abbr: 'LE',   min: 20000, max: 21999,  color: '#a855f7', colorRgb: '168,85,247' },
  { name: 'Legendary Eagle Master',         abbr: 'LEM',  min: 22000, max: 24999,  color: '#a855f7', colorRgb: '168,85,247' },
  { name: 'Supreme Master First Class',     abbr: 'SMFC', min: 25000, max: 29999,  color: '#ec4899', colorRgb: '236,72,153' },
  { name: 'The Global Elite',               abbr: 'GE',   min: 30000, max: Infinity, color: '#ef4444', colorRgb: '239,68,68' },
]

const elo = ref(12500)

function clampElo() {
  if (elo.value < 0) elo.value = 0
  if (elo.value > maxElo) elo.value = maxElo
}

const currentRank = computed(() => {
  for (let i = ranks.length - 1; i >= 0; i--) {
    if (elo.value >= ranks[i].min) return ranks[i]
  }
  return ranks[0]
})

const nextRank = computed(() => {
  const idx = ranks.findIndex(r => r.name === currentRank.value.name)
  return idx < ranks.length - 1 ? ranks[idx + 1] : null
})

const progressToNext = computed(() => {
  if (!nextRank.value) return 100
  const range = nextRank.value.min - currentRank.value.min
  const progress = elo.value - currentRank.value.min
  return Math.min(Math.max((progress / range) * 100, 0), 100)
})

const sliderPct = computed(() => (elo.value / maxElo) * 100)
</script>

<style scoped>
.rs-wrap {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 24px;
  margin: 24px 0;
}

/* Header */
.rs-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.rs-header__icon {
  color: #ef4444;
  flex-shrink: 0;
  background: rgba(239,68,68,0.1);
  padding: 10px;
  border-radius: 10px;
  width: 42px;
  height: 42px;
}
.rs-header__title {
  font-size: 15px;
  font-weight: 800;
  color: var(--vp-c-text-1);
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 0.5px;
}
.rs-header__sub {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-top: 2px;
}

/* Input */
.rs-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--vp-c-text-3);
  margin-bottom: 8px;
}

.rs-input-wrap {
  display: flex;
  align-items: center;
  gap: 0;
  border: 1.5px solid var(--vp-c-divider);
  border-radius: 10px;
  overflow: hidden;
  background: var(--vp-c-bg);
  transition: border-color 0.2s;
}
.rs-input-wrap:focus-within {
  border-color: #ef4444;
}

.rs-input {
  flex: 1;
  padding: 10px 14px;
  font-size: 16px;
  font-weight: 700;
  font-family: 'Orbitron', sans-serif;
  background: transparent;
  border: none;
  outline: none;
  color: var(--vp-c-text-1);
  min-width: 0;
}
.rs-input::-webkit-outer-spin-button,
.rs-input::-webkit-inner-spin-button { -webkit-appearance: none; }
.rs-input[type=number] { -moz-appearance: textfield; }

.rs-input-unit {
  padding: 10px 14px;
  font-size: 12px;
  font-weight: 700;
  color: #ef4444;
  background: rgba(239,68,68,0.08);
  border-left: 1px solid var(--vp-c-divider);
}

/* Slider */
.rs-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 6px;
  margin: 16px 0 6px;
  cursor: pointer;
  background: linear-gradient(to right, var(--rank-color, #ef4444) var(--pct, 50%), var(--vp-c-divider) var(--pct, 50%));
  outline: none;
  border: none;
}
.rs-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--rank-color, #ef4444);
  border: 2px solid var(--vp-c-bg);
  box-shadow: 0 0 0 2px var(--rank-color, #ef4444), 0 2px 8px rgba(0,0,0,0.3);
  cursor: pointer;
  transition: transform 0.15s ease;
}
.rs-slider::-webkit-slider-thumb:active { transform: scale(1.2); }
.rs-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--rank-color, #ef4444);
  border: 2px solid var(--vp-c-bg);
  cursor: pointer;
}

.rs-slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--vp-c-text-3);
  margin-bottom: 20px;
}

/* Rank card */
.rs-rank-card {
  position: relative;
  background: rgba(var(--rank-color-rgb, 239,68,68), 0.04);
  border: 1.5px solid rgba(var(--rank-color-rgb, 239,68,68), 0.2);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
  overflow: hidden;
}
.rs-rank-card__glow {
  position: absolute;
  top: -30px;
  right: -30px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: var(--rank-color, #ef4444);
  opacity: 0.06;
  filter: blur(30px);
  pointer-events: none;
}

.rs-rank-badge {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  border: 2px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.rs-rank-badge__text {
  font-size: 12px;
  font-weight: 900;
  font-family: 'Orbitron', sans-serif;
  letter-spacing: -0.5px;
}

.rs-rank-card__body { flex: 1; min-width: 0; }

.rs-rank-name {
  font-size: 18px;
  font-weight: 800;
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 0.5px;
  line-height: 1.2;
  margin-bottom: 2px;
}
.rs-rank-range {
  font-size: 11px;
  color: var(--vp-c-text-3);
  margin-bottom: 12px;
}

/* Progress */
.rs-progress-wrap { width: 100%; }
.rs-progress-track {
  height: 6px;
  border-radius: 6px;
  background: var(--vp-c-divider);
  overflow: hidden;
  margin-bottom: 6px;
}
.rs-progress-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.3s ease;
}
.rs-progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10.5px;
  color: var(--vp-c-text-3);
  margin-bottom: 6px;
}
.rs-progress-remaining {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  color: var(--vp-c-text-2);
}
.rs-progress-remaining strong { color: var(--rank-color); }
.rs-progress-remaining svg { color: var(--rank-color); flex-shrink: 0; }
.rs-top { color: var(--rank-color) !important; font-weight: 700; }

/* Rank change animation */
.rank-change-enter-active, .rank-change-leave-active { transition: all 0.2s ease; }
.rank-change-enter-from { opacity: 0; transform: translateY(-6px) scale(0.98); }
.rank-change-leave-to   { opacity: 0; transform: translateY(4px) scale(0.99); }

/* Ladder */
.rs-ladder { border-top: 1px solid var(--vp-c-divider); padding-top: 16px; }
.rs-ladder__title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--vp-c-text-3);
  margin-bottom: 10px;
}
.rs-ladder__list { display: flex; flex-direction: column; gap: 2px; }

.rs-ladder__item {
  display: grid;
  grid-template-columns: 48px 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 7px 12px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.15s ease;
}
.rs-ladder__item:hover {
  background: rgba(var(--rank-color-rgb, 239,68,68), 0.06);
  border-color: rgba(var(--rank-color-rgb, 239,68,68), 0.15);
}
.rs-ladder__item--active {
  background: rgba(var(--rank-color-rgb, 239,68,68), 0.1) !important;
  border-color: rgba(var(--rank-color-rgb, 239,68,68), 0.25) !important;
}

.rs-ladder__abbr {
  font-size: 10px;
  font-weight: 900;
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 0.3px;
  text-align: center;
  background: rgba(var(--rank-color-rgb, 239,68,68), 0.1);
  padding: 3px 6px;
  border-radius: 5px;
}
.rs-ladder__name {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.rs-ladder__elo {
  font-size: 11px;
  color: var(--rank-color);
  font-weight: 700;
  font-family: 'Orbitron', sans-serif;
}
</style>
