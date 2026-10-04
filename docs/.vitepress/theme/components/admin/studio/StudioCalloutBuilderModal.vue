<script setup lang="ts">
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';

export type CalloutType = 'NOTE' | 'TIP' | 'IMPORTANT' | 'WARNING' | 'CAUTION';

interface CalloutPreset {
  id: string;
  type: CalloutType;
  name: string;
  title: string;
  text: string;
}

const CALLOUT_TYPES: {
  type: CalloutType;
  label: string;
  desc: string;
  icon: string;
  badgeClass: string;
}[] = [
  {
    type: 'NOTE',
    label: 'Note (Informativ)',
    desc: 'Informații de context, mențiuni generale și detalii utile',
    icon: 'lucide:info',
    badgeClass: 'callout-badge--note',
  },
  {
    type: 'TIP',
    label: 'Tip (Sfat Practic)',
    desc: 'Recomandări, scurtături și optimizări pentru jucători',
    icon: 'lucide:sparkles',
    badgeClass: 'callout-badge--tip',
  },
  {
    type: 'IMPORTANT',
    label: 'Important (Esențial)',
    desc: 'Cerințe obligatorii, pași de reținut și permisiuni de bază',
    icon: 'lucide:triangle-alert',
    badgeClass: 'callout-badge--important',
  },
  {
    type: 'WARNING',
    label: 'Warning (Avertisment)',
    desc: 'Măsuri de precauție, restricții și riscuri de sancționare',
    icon: 'lucide:shield-alert',
    badgeClass: 'callout-badge--warning',
  },
  {
    type: 'CAUTION',
    label: 'Caution (Critic / Risc)',
    desc: 'Consecințe ireversibile, pierderi de credite sau comenzi riscante',
    icon: 'lucide:zap',
    badgeClass: 'callout-badge--caution',
  },
];

const CALLOUT_PRESETS: CalloutPreset[] = [
  {
    id: 'cs2-connect',
    type: 'NOTE',
    name: 'Conectare Server CS2',
    title: 'Conectare Server Oficial',
    text: 'Asigură-te că ești conectat pe serverul oficial de CS2 (`connect cs2.wildfire.ro`) înainte de a rula comenzile specificate.',
  },
  {
    id: 'vip-activation',
    type: 'TIP',
    name: 'Activare Instantă VIP',
    title: 'Activare Automată în Joc',
    text: 'Pachetele VIP achiziționate din magazin se activează automat în mai puțin de 5 secunde, fără a fi nevoie de reconectare pe server.',
  },
  {
    id: 'admin-rights',
    type: 'IMPORTANT',
    name: 'Permisiuni de Staff',
    title: 'Acces Restricționat Staff',
    text: 'Rularea comenzilor avansate de moderare necesită atribuirea gradului corespunzător în sistemul de permisiuni.',
  },
  {
    id: 'chat-rules',
    type: 'WARNING',
    name: 'Avertisment Chat & Comportament',
    title: 'Regulament de Comunicare',
    text: 'Spam-ul abuziv sau limbajul neadecvat în chat atrage sancțiuni automate de mute/gag conform regulamentului oficial.',
  },
  {
    id: 'loss-risk',
    type: 'CAUTION',
    name: 'Avertizare Tranzacții / Trade',
    title: 'Atenție la Schimburi & Credite',
    text: 'Transferurile de credite între jucători sunt finale și ireversibile. Asigură-te că introduci SteamID-ul corect al destinatarului.',
  },
];

const props = withDefaults(
  defineProps<{
    cursorLine: number;
    initialType?: CalloutType;
  }>(),
  {
    initialType: 'NOTE',
  }
);

const emit = defineEmits<{
  (e: 'insert', markdown: string): void;
  (e: 'close'): void;
}>();

const calloutType = ref<CalloutType>(props.initialType || 'NOTE');
const customTitle = ref('');
const content = ref(
  'Introdu aici mesajul detaliat care va fi evidențiat vizual în cadrul ghidului.'
);
const selectedPresetId = ref('');

function applyPreset(preset: CalloutPreset) {
  selectedPresetId.value = preset.id;
  calloutType.value = preset.type;
  customTitle.value = preset.title;
  content.value = preset.text;
}

const currentMeta = computed(() => {
  return CALLOUT_TYPES.find((c) => c.type === calloutType.value) || CALLOUT_TYPES[0];
});

const markdownResult = computed(() => {
  const lines = content.value.split('\n');
  let result = `> [!${calloutType.value}]`;
  if (customTitle.value.trim()) {
    result += `\n> **${customTitle.value.trim()}**`;
  }
  lines.forEach((line) => {
    result += `\n> ${line}`;
  });
  return result;
});

function handleInsert() {
  emit('insert', markdownResult.value);
}
</script>

<template>
  <div class="admin-modal-overlay">
    <div class="admin-modal-container studio-callout-modal-container">
      <!-- Header -->
      <div class="admin-modal-header">
        <div>
          <div class="studio-modal-badge">
            <Icon icon="lucide:message-square-quote" width="12" height="12" />
            <span>CONSTRUCTOR ALERTE &amp; CALLOUT-URI</span>
          </div>
          <h3 class="admin-modal-title">Personalizare Notă &amp; Avertisment Vizual</h3>
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
          <Icon :icon="currentMeta.icon" width="12" height="12" />
          <span>Tip: {{ calloutType }}</span>
        </div>
      </div>

      <div class="admin-modal-body">
        <!-- Preset Buttons -->
        <div class="studio-builder-presets-section">
          <div class="studio-builder-presets-label">
            <Icon icon="lucide:wand-2" width="13" height="13" class="text-amber-400" />
            <span>Șabloane Rapide Populare:</span>
          </div>
          <div class="studio-builder-presets-list">
            <button
              v-for="preset in CALLOUT_PRESETS"
              :key="preset.id"
              type="button"
              class="studio-builder-preset-chip"
              :class="{ 'studio-builder-preset-chip--active': selectedPresetId === preset.id }"
              @click="applyPreset(preset)"
            >
              <Icon icon="lucide:sparkles" width="11" height="11" />
              <span>{{ preset.name }}</span>
            </button>
          </div>
        </div>

        <!-- Callout Type Selection Grid -->
        <div class="studio-callout-types-grid">
          <button
            v-for="typeMeta in CALLOUT_TYPES"
            :key="typeMeta.type"
            type="button"
            class="studio-callout-type-card"
            :class="[
              typeMeta.badgeClass,
              { 'studio-callout-type-card--active': calloutType === typeMeta.type }
            ]"
            @click="calloutType = typeMeta.type"
          >
            <div class="studio-callout-type-header">
              <Icon :icon="typeMeta.icon" width="16" height="16" />
              <strong>{{ typeMeta.label }}</strong>
            </div>
            <p>{{ typeMeta.desc}}</p>
          </button>
        </div>

        <!-- Form Fields -->
        <div class="admin-form-group mt-3">
          <label class="admin-form-label">Titlu Opțional Alertă (Bold Header)</label>
          <input
            v-model="customTitle"
            type="text"
            placeholder="ex: Cerință Obligatorie pentru Conectare"
            class="admin-form-input"
          />
        </div>

        <div class="admin-form-group">
          <label class="admin-form-label">Conținut Text Alertă (Markdown Suportat)</label>
          <textarea
            v-model="content"
            rows="4"
            placeholder="Introdu instrucțiunile sau mesajul de atenționare..."
            class="admin-form-input studio-callout-textarea"
          />
        </div>

        <!-- Live Callout Preview Box -->
        <div class="studio-callout-live-preview">
          <div class="studio-callout-preview-label">Previzualizare Live în Document:</div>
          <div class="studio-callout-box" :class="`studio-callout-box--${calloutType.toLowerCase()}`">
            <div class="studio-callout-box-header">
              <Icon :icon="currentMeta.icon" width="15" height="15" />
              <span>{{ calloutType }}</span>
            </div>
            <div class="studio-callout-box-body">
              <strong v-if="customTitle">{{ customTitle }}</strong>
              <p>{{ content }}</p>
            </div>
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
          <span>Inserează Alerta la Linia {{ cursorLine }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
