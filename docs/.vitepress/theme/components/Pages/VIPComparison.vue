<template>
  <div class="vip-table-wrap">
    <!-- Header row -->
    <div class="vip-table">
      <!-- Column headers -->
      <div class="vip-thead">
        <div class="vip-th vip-th--feature">Functionalitate</div>
        <div
          v-for="tier in tiers"
          :key="tier.id"
          class="vip-th"
          :class="['vip-th--' + tier.id, { 'vip-th--highlight': tier.highlight }]"
          :style="{ '--tier-color': tier.color }"
        >
          <span class="vip-th__icon" v-html="tier.icon"></span>
          <span class="vip-th__name">{{ tier.name }}</span>
          <span class="vip-th__price">{{ tier.price }}</span>
        </div>
      </div>

      <!-- Feature rows grouped by category -->
      <template v-for="group in featureGroups" :key="group.label">
        <div class="vip-group-label">
          <span class="vip-group-icon" v-html="group.icon"></span>
          {{ group.label }}
        </div>
        <div
          v-for="row in group.rows"
          :key="row.key"
          class="vip-row"
          :class="{ 'vip-row--alt': row.alt }"
        >
          <div class="vip-cell vip-cell--feature">{{ row.label }}</div>
          <div
            v-for="tier in tiers"
            :key="tier.id"
            class="vip-cell"
            :class="{ 'vip-cell--highlight': tier.highlight }"
            :style="{ '--tier-color': tier.color }"
          >
            <span v-html="renderCell(row.values[tier.id])"></span>
          </div>
        </div>
      </template>

      <!-- Buy buttons row -->
      <div class="vip-footer-row">
        <div class="vip-cell vip-cell--feature"></div>
        <div
          v-for="tier in tiers"
          :key="tier.id"
          class="vip-cell vip-cell--btn"
          :style="{ '--tier-color': tier.color }"
        >
          <a
            v-if="tier.link"
            :href="tier.link"
            class="vip-buy-btn"
            :style="{ borderColor: tier.color, color: tier.color }"
          >
            {{ tier.cta }}
          </a>
          <span v-else class="vip-auto-tag">Automat</span>
        </div>
      </div>
    </div>
    <p class="vip-note">* Mythic se obtine exclusiv prin performanta (top ore / top skill). Preturile in coins variaza cu durata.</p>
  </div>
</template>

<script setup>
const CHECK = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: #22c55e"><polyline points="20 6 9 17 4 12"/></svg>`
const CROSS = `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: rgba(128,128,128,0.4)"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`

function renderCell(val) {
  if (val === true)  return CHECK
  if (val === false) return CROSS
  if (val === null || val === undefined) return CROSS
  return `<span class="vip-val">${val}</span>`
}

const tiers = [
  {
    id: 'night',
    name: 'VIP Night',
    price: 'Gratuit (noapte)',
    color: '#6366f1',
    icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    link: '/market/vip/vip-night',
    cta: 'Detalii',
    highlight: false,
  },
  {
    id: 'rebirth',
    name: 'VIP Rebirth',
    price: '3€ / coins',
    color: '#8b5cf6',
    icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/></svg>`,
    link: '/market/vip/rebirth',
    cta: 'Cumpara',
    highlight: false,
  },
  {
    id: 'immortal',
    name: 'VIP Immortal',
    price: '6.5€ / coins',
    color: '#ec4899',
    icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    link: '/market/vip/immortal',
    cta: 'Cumpara',
    highlight: true,
  },
  {
    id: 'mythic',
    name: 'VIP Mythic',
    price: 'Prin performanta',
    color: '#f59e0b',
    icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    link: '/market/vip/mythic',
    cta: 'Detalii',
    highlight: false,
  },
]

const featureGroups = [
  {
    label: 'Combat & Stats',
    icon: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"/><path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"/><path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"/><path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/><path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"/><path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"/></svg>`,
    rows: [
      { key: 'armor', label: 'Armura (AP)', values: { night: '102 AP', rebirth: '100 AP', immortal: '105 AP', mythic: '110 AP' } },
      { key: 'speed', label: 'Speed Bonus', values: { night: '1.05x', rebirth: '1.1x', immortal: '1.15x', mythic: '1.2x' } },
      { key: 'money', label: 'Money Bonus', values: { night: '1500$', rebirth: '1500$', immortal: '2000$', mythic: '2500$' } },
      { key: 'reload', label: 'Fast Reload', values: { night: true, rebirth: true, immortal: true, mythic: 'Ultra Fast' } },
    ]
  },
  {
    label: 'Abilitati Speciale',
    icon: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    rows: [
      { key: 'jump', label: 'Double Jump', values: { night: false, rebirth: false, immortal: true, mythic: 'x2' } },
      { key: 'bhop', label: 'Auto-Bhop', values: { night: false, rebirth: false, immortal: false, mythic: true } },
      { key: 'healthshot', label: 'Healthshot', values: { night: false, rebirth: false, immortal: true, mythic: 'x2' } },
      { key: 'fastplant', label: 'Fast Plant/Defuse', values: { night: false, rebirth: false, immortal: true, mythic: true } },
    ]
  },
  {
    label: 'Echipament',
    icon: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
    rows: [
      { key: 'defuse', label: 'Defuse Kit & Zeus', values: { night: true, rebirth: true, immortal: true, mythic: true } },
      { key: 'grenades', label: 'Full Grenades', values: { night: true, rebirth: true, immortal: true, mythic: true } },
      { key: 'fov', label: 'FOV Custom', values: { night: true, rebirth: true, immortal: true, mythic: true } },
      { key: 'slot', label: 'Reserved Slot', values: { night: true, rebirth: true, immortal: true, mythic: 'Priority' } },
    ]
  },
  {
    label: 'Identitate & Chat',
    icon: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
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
  margin: 28px 0 12px;
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-elv);
}

.vip-table {
  min-width: 680px;
  width: 100%;
}

/* === HEADER === */
.vip-thead {
  display: grid;
  grid-template-columns: 180px repeat(4, 1fr);
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  border-radius: 16px 16px 0 0;
  overflow: hidden;
}

.vip-th {
  padding: 16px 10px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  text-align: center;
  border-right: 1px solid var(--vp-c-divider);
  position: relative;
}
.vip-th:last-child { border-right: none; }

.vip-th--feature {
  align-items: flex-start;
  padding-left: 16px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--vp-c-text-3);
  justify-content: flex-end;
}

.vip-th--highlight {
  background: rgba(var(--tier-color-rgb, 236, 72, 153), 0.06);
}
.vip-th--highlight::after {
  content: 'POPULAR';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #fff;
  background: v-bind('tiers.find(t => t.highlight)?.color ?? "#ec4899"');
  padding: 2px 8px;
  border-radius: 0 0 6px 6px;
}

.vip-th__icon {
  display: flex;
  align-items: center;
  color: var(--tier-color);
  margin-top: 10px;
}
.vip-th__icon :deep(svg) { display: block; }

.vip-th__name {
  font-size: 12px;
  font-weight: 800;
  color: var(--tier-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.vip-th__price {
  font-size: 10px;
  color: var(--vp-c-text-3);
  font-weight: 500;
}

/* === GROUP LABEL === */
.vip-group-label {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 16px 6px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--vp-c-text-3);
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
}
.vip-group-icon { display: inline-flex; align-items: center; color: var(--vp-c-brand-1); }
.vip-group-icon :deep(svg) { display: block; }

/* === ROWS === */
.vip-row {
  display: grid;
  grid-template-columns: 180px repeat(4, 1fr);
  border-bottom: 1px solid var(--vp-c-divider);
  transition: background 0.15s ease;
}
.vip-row:hover { background: rgba(var(--wf-accent-rgb), 0.03); }
.vip-row--alt { background: rgba(0,0,0,0.015); }
.dark .vip-row--alt { background: rgba(255,255,255,0.015); }

.vip-cell {
  padding: 11px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12.5px;
  border-right: 1px solid var(--vp-c-divider);
  min-height: 42px;
}
.vip-cell:last-child { border-right: none; }

.vip-cell--feature {
  justify-content: flex-start;
  padding-left: 16px;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.vip-cell--highlight {
  background: rgba(236, 72, 153, 0.04);
}

.vip-cell :deep(svg) { display: block; }

.vip-val {
  font-size: 12px;
  font-weight: 700;
  color: var(--tier-color, var(--vp-c-text-1));
}

/* === FOOTER (buy buttons) === */
.vip-footer-row {
  display: grid;
  grid-template-columns: 180px repeat(4, 1fr);
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  border-radius: 0 0 16px 16px;
  overflow: hidden;
}

.vip-cell--btn {
  padding: 14px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid var(--vp-c-divider);
}
.vip-cell--btn:last-child { border-right: none; }

.vip-buy-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 7px 16px;
  border-radius: 8px;
  border: 1.5px solid;
  font-size: 11px;
  font-weight: 700;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: transparent;
  transition: all 0.18s ease;
}
.vip-buy-btn:hover {
  background: var(--tier-color);
  color: #fff !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.vip-auto-tag {
  font-size: 10px;
  font-weight: 600;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

/* Note */
.vip-note {
  font-size: 11.5px;
  color: var(--vp-c-text-3);
  margin: 10px 0 0;
  line-height: 1.6;
  padding: 0 4px;
}
</style>
