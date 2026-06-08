<template>
  <div class="vip-table-wrap">
    <div class="vip-table">
      <!-- Header row -->
      <div class="vip-thead">
        <div class="vip-th vip-th--feature">Funcționalitate</div>
        <div
          v-for="(tier, index) in tiers"
          :key="tier.id"
          class="vip-th"
          :class="[
            'vip-th--' + tier.id, 
            { 'vip-th--highlight': tier.highlight, 'is-hovered': hoveredColumn === index }
          ]"
          :style="{ '--tier-color': tier.color }"
          @mouseenter="hoveredColumn = index"
          @mouseleave="hoveredColumn = null"
        >
          <span class="vip-th__icon"><Icon :icon="tier.icon" width="24" height="24" /></span>
          <span class="vip-th__name">{{ tier.name }}</span>
          <span class="vip-th__price">{{ tier.price }}</span>
        </div>
      </div>

      <!-- Feature rows grouped by category -->
      <template v-for="group in featureGroups" :key="group.label">
        <div class="vip-group-label">
          <span class="vip-group-icon"><Icon :icon="group.icon" width="16" height="16" /></span>
          {{ group.label }}
        </div>
        <div
          v-for="row in group.rows"
          :key="row.key"
          class="vip-row"
        >
          <div class="vip-cell vip-cell--feature">{{ row.label }}</div>
          <div
            v-for="(tier, index) in tiers"
            :key="tier.id"
            class="vip-cell"
            :class="[
              'vip-cell--' + tier.id,
              { 'vip-cell--highlight': tier.highlight, 'is-hovered': hoveredColumn === index }
            ]"
            :style="{ '--tier-color': tier.color }"
            @mouseenter="hoveredColumn = index"
            @mouseleave="hoveredColumn = null"
          >
            <template v-if="row.values[tier.id] === true">
              <Icon icon="lucide:check" width="20" height="20" class="vip-icon-check" />
            </template>
            <template v-else-if="row.values[tier.id] === false || row.values[tier.id] === null || row.values[tier.id] === undefined">
              <Icon icon="lucide:x" width="18" height="18" class="vip-icon-cross" />
            </template>
            <template v-else>
              <span class="vip-val">{{ row.values[tier.id] }}</span>
            </template>
          </div>
        </div>
      </template>
    </div>
    
    <div class="vip-footer">
      <p class="vip-note">
        <Icon icon="lucide:info" width="15" height="15" />
        * Mythic se obține exclusiv prin performanță (top ore / top skill). Prețurile în coins variază cu durata aleasă.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const hoveredColumn = ref(null)

const tiers = [
  {
    id: 'night',
    name: 'VIP Night',
    price: 'Gratuit (noapte)',
    color: '#6366f1',
    icon: 'lucide:moon',
    highlight: false,
  },
  {
    id: 'rebirth',
    name: 'VIP Rebirth',
    price: '3€ / coins',
    color: '#8b5cf6',
    icon: 'lucide:crown',
    highlight: false,
  },
  {
    id: 'immortal',
    name: 'VIP Immortal',
    price: '6.5€ / coins',
    color: '#ec4899',
    icon: 'lucide:star',
    highlight: true,
  },
  {
    id: 'mythic',
    name: 'VIP Mythic',
    price: 'Prin performanță',
    color: '#f59e0b',
    icon: 'lucide:trophy',
    highlight: false,
  },
]

const featureGroups = [
  {
    label: 'Combat & Stats',
    icon: 'lucide:swords',
    rows: [
      { key: 'armor', label: 'Armură (AP)', values: { night: '102 AP', rebirth: '100 AP', immortal: '105 AP', mythic: '110 AP' } },
      { key: 'speed', label: 'Speed Bonus', values: { night: '1.05x', rebirth: '1.1x', immortal: '1.15x', mythic: '1.2x' } },
      { key: 'money', label: 'Money Bonus', values: { night: '1500$', rebirth: '1500$', immortal: '2000$', mythic: '2500$' } },
      { key: 'reload', label: 'Fast Reload', values: { night: true, rebirth: true, immortal: true, mythic: 'Ultra Fast' } },
    ]
  },
  {
    label: 'Abilități Speciale',
    icon: 'lucide:zap',
    rows: [
      { key: 'jump', label: 'Double Jump', values: { night: false, rebirth: false, immortal: true, mythic: 'x2' } },
      { key: 'bhop', label: 'Auto-Bhop', values: { night: false, rebirth: false, immortal: false, mythic: true } },
      { key: 'healthshot', label: 'Healthshot', values: { night: false, rebirth: false, immortal: true, mythic: 'x2' } },
      { key: 'fastplant', label: 'Fast Plant/Defuse', values: { night: false, rebirth: false, immortal: true, mythic: true } },
    ]
  },
  {
    label: 'Echipament',
    icon: 'lucide:briefcase',
    rows: [
      { key: 'defuse', label: 'Defuse Kit & Zeus', values: { night: true, rebirth: true, immortal: true, mythic: true } },
      { key: 'grenades', label: 'Full Grenades', values: { night: true, rebirth: true, immortal: true, mythic: true } },
      { key: 'fov', label: 'FOV Custom', values: { night: true, rebirth: true, immortal: true, mythic: true } },
      { key: 'slot', label: 'Reserved Slot', values: { night: true, rebirth: true, immortal: true, mythic: 'Priority' } },
    ]
  },
  {
    label: 'Identitate & Chat',
    icon: 'lucide:message-square',
    rows: [
      { key: 'chattag', label: 'Chat Color & TAG', values: { night: true, rebirth: true, immortal: true, mythic: 'Supreme' } },
      { key: 'tabtag', label: 'TAG in Scoreboard', values: { night: true, rebirth: true, immortal: true, mythic: true } },
      { key: 'sanksounds', label: 'Sank Sounds', values: { night: false, rebirth: true, immortal: true, mythic: true } },
      { key: 'discord', label: 'Discord Rank', values: { night: false, rebirth: true, immortal: true, mythic: 'Mythic' } },
    ]
  },
]
</script>

<style scoped>
.vip-table-wrap {
  width: 100%;
  overflow-x: auto;
  margin: 32px 0 16px;
  border-radius: 20px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-elv);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.05);
  position: relative;
  /* Smooth horizontal scrolling for mobile */
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

.dark .vip-table-wrap {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.05);
  background: rgba(30, 30, 30, 0.4);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.vip-table {
  min-width: 760px; /* Minimum width before scrolling triggers */
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* === HEADER === */
.vip-thead {
  display: grid;
  grid-template-columns: 220px repeat(4, 1fr);
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  position: sticky;
  top: 0;
  z-index: 20;
}

.dark .vip-thead {
  background: rgba(20, 20, 20, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.vip-th {
  padding: 24px 12px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  border-right: 1px solid var(--vp-c-divider);
  position: relative;
  transition: background 0.3s ease, transform 0.3s ease;
}
.dark .vip-th {
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}
.vip-th:last-child { border-right: none; }

/* Sticky feature column */
.vip-th--feature, .vip-cell--feature {
  position: sticky;
  left: 0;
  z-index: 10;
  background: var(--vp-c-bg-soft);
}
.dark .vip-th--feature, .dark .vip-cell--feature {
  background: rgba(25, 25, 25, 1);
}

/* Header hover effect */
.vip-th.is-hovered {
  background: rgba(var(--vp-c-brand-1-rgb), 0.04);
}
.dark .vip-th.is-hovered {
  background: rgba(255, 255, 255, 0.03);
}

.vip-th--feature {
  align-items: flex-start;
  padding-left: 24px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: var(--vp-c-text-3);
  justify-content: flex-end;
  border-right: 2px solid var(--vp-c-divider) !important;
}
.dark .vip-th--feature {
  border-right: 2px solid rgba(255,255,255,0.08) !important;
}

.vip-th--highlight {
  background: linear-gradient(to bottom, rgba(236, 72, 153, 0.08), transparent);
}
.dark .vip-th--highlight {
  background: linear-gradient(to bottom, rgba(236, 72, 153, 0.15), transparent);
}
.vip-th--highlight.is-hovered {
  background: linear-gradient(to bottom, rgba(236, 72, 153, 0.15), transparent);
}
.dark .vip-th--highlight.is-hovered {
  background: linear-gradient(to bottom, rgba(236, 72, 153, 0.25), transparent);
}

.vip-th--highlight::after {
  content: 'POPULAR';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.2px;
  color: #fff;
  background: var(--tier-color, #ec4899);
  padding: 4px 12px;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
}

/* Mythic Glow */
.vip-th--mythic {
  position: relative;
}
.dark .vip-th--mythic::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, var(--tier-color), transparent);
  opacity: 0.5;
}

.vip-th__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--tier-color);
  margin-top: 12px;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.15));
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  padding: 8px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.5);
}
.dark .vip-th__icon {
  background: rgba(0, 0, 0, 0.2);
}
.vip-th.is-hovered .vip-th__icon {
  transform: scale(1.15) translateY(-2px);
}

.vip-th__name {
  font-size: 14px;
  font-weight: 800;
  color: var(--tier-color);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-top: 4px;
}

.vip-th__price {
  font-size: 12px;
  color: var(--vp-c-text-2);
  font-weight: 600;
  margin-top: 2px;
}

/* === GROUP LABEL === */
.vip-group-label {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 24px;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--vp-c-text-1);
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
  position: sticky;
  left: 0;
  z-index: 15;
}
.dark .vip-group-label {
  background: rgba(20, 20, 20, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  border-top: 1px solid rgba(255, 255, 255, 0.03);
}
.vip-group-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-brand-1);
  background: rgba(var(--vp-c-brand-1-rgb), 0.1);
  padding: 6px;
  border-radius: 6px;
}

/* === ROWS === */
.vip-row {
  display: grid;
  grid-template-columns: 220px repeat(4, 1fr);
  border-bottom: 1px solid var(--vp-c-divider);
  transition: background 0.2s ease;
  background: transparent;
}
.dark .vip-row {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.vip-row:last-child {
  border-bottom: none;
}
.vip-row:hover {
  background: rgba(0, 0, 0, 0.02);
}
.dark .vip-row:hover {
  background: rgba(255, 255, 255, 0.02);
}

.vip-cell {
  padding: 16px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border-right: 1px solid var(--vp-c-divider);
  min-height: 56px;
  transition: background 0.3s ease;
}
.dark .vip-cell {
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}
.vip-cell:last-child { border-right: none; }

/* Cell hover highlights */
.vip-cell.is-hovered {
  background: rgba(0, 0, 0, 0.02);
}
.dark .vip-cell.is-hovered {
  background: rgba(255, 255, 255, 0.03);
}

.vip-cell--highlight {
  background: rgba(236, 72, 153, 0.03);
}
.dark .vip-cell--highlight {
  background: rgba(236, 72, 153, 0.06);
}
.vip-cell--highlight.is-hovered {
  background: rgba(236, 72, 153, 0.06);
}
.dark .vip-cell--highlight.is-hovered {
  background: rgba(236, 72, 153, 0.1);
}

/* Feature Name Cell */
.vip-cell--feature {
  justify-content: flex-start;
  padding-left: 24px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  border-right: 2px solid var(--vp-c-divider) !important;
}
.dark .vip-cell--feature {
  border-right: 2px solid rgba(255,255,255,0.08) !important;
}

.vip-icon-check {
  color: #10b981;
  filter: drop-shadow(0 2px 4px rgba(16, 185, 129, 0.2));
}
.vip-icon-cross {
  color: var(--vp-c-text-3);
  opacity: 0.4;
}

.vip-val {
  font-size: 13.5px;
  font-weight: 800;
  color: var(--tier-color, var(--vp-c-text-1));
  text-shadow: 0 1px 2px rgba(0,0,0,0.05);
  background: rgba(var(--vp-c-brand-1-rgb), 0.05);
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid rgba(0,0,0,0.05);
}
.dark .vip-val {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.05);
}
.dark .vip-cell--mythic .vip-val {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.2);
}

/* === FOOTER === */
.vip-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  border-radius: 0 0 20px 20px;
}
.dark .vip-footer {
  background: rgba(20, 20, 20, 0.6);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.vip-note {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: var(--vp-c-text-3);
  margin: 0;
  line-height: 1.6;
}
.vip-note :deep(svg) {
  color: var(--vp-c-brand-1);
}

/* Scrollbar styling */
.vip-table-wrap::-webkit-scrollbar {
  height: 8px;
}
.vip-table-wrap::-webkit-scrollbar-track {
  background: transparent;
}
.vip-table-wrap::-webkit-scrollbar-thumb {
  background: var(--vp-c-divider);
  border-radius: 4px;
}
.vip-table-wrap::-webkit-scrollbar-thumb:hover {
  background: var(--vp-c-text-3);
}

@media (max-width: 768px) {
  .vip-table-wrap {
    margin: 20px -24px;
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
  .vip-th--feature, .vip-cell--feature {
    padding-left: 16px;
  }
  .vip-footer {
    border-radius: 0;
  }
}
</style>
