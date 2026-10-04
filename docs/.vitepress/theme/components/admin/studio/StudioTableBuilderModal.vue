<script setup lang="ts">
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';

type ColumnAlignment = 'left' | 'center' | 'right';

interface TablePreset {
  id: string;
  name: string;
  desc: string;
  headers: string[];
  alignments: ColumnAlignment[];
  rows: string[][];
}

const TABLE_PRESETS: TablePreset[] = [
  {
    id: 'commands',
    name: 'Comenzi Chat & Consolă',
    desc: 'Tabel standard pentru documentarea comenzilor de joc și argumentelor',
    headers: ['Comandă Chat', 'Comandă Consolă', 'Acces / Permisiune', 'Descriere Funcționalitate'],
    alignments: ['left', 'left', 'center', 'left'],
    rows: [
      ['`!vip`', '`css_vip`', 'VIP General', 'Deschide meniul principal de facilități VIP'],
      ['`!shop`', '`css_shop`', 'Toți Jucătorii', 'Accesează magazinul de credite și skin-uri'],
      ['`!admin`', '`css_admin`', 'Admin Staff', 'Deschide panoul administrativ de moderare'],
    ],
  },
  {
    id: 'vip-tiers',
    name: 'Pachete VIP & Prețuri',
    desc: 'Comparație grade VIP, beneficii exclusive și costuri lunare',
    headers: ['Grad VIP', 'Preț Lunar', 'Bonus Credite', 'Slot Rezervat', 'Meniu Skin-uri'],
    alignments: ['left', 'center', 'center', 'center', 'center'],
    rows: [
      ['**VIP Bronze**', '5.00 EUR', '+15%', 'Da', 'Cuțite de bază'],
      ['**VIP Silver**', '10.00 EUR', '+30%', 'Da (Prioritate)', 'Toate Cuțitele'],
      ['**VIP Diamond**', '20.00 EUR', '+50%', 'Garantat (99/99)', 'Toate Cuțitele + Mănuși'],
    ],
  },
  {
    id: 'cvar-config',
    name: 'Parametri & Configurație CVAR',
    desc: 'Specificații tehnice de configurare server / plugin',
    headers: ['Parametru (CVAR)', 'Tip Dată', 'Valoare Implicită', 'Descriere Setare'],
    alignments: ['left', 'center', 'center', 'left'],
    rows: [
      ['`wf_credits_kill`', 'Integer', '`10`', 'Numărul de credite acordate per kill'],
      ['`wf_vip_tag_enabled`', 'Boolean', '`true`', 'Activează afișarea tag-ului VIP în chat'],
      ['`wf_shop_cooldown`', 'Float', '`5.0`', 'Timpul de cooldown între deschideri meniu'],
    ],
  },
  {
    id: 'drop-rates',
    name: 'Șanse & Drop Rate Crate-uri',
    desc: 'Distribuție procente raritate pentru cutii și drop-uri',
    headers: ['Raritate Item', 'Culoare Tiers', 'Șansă Drop (%)', 'Multiplicator Valoare'],
    alignments: ['left', 'center', 'center', 'center'],
    rows: [
      ['Mil-Spec (Albastru)', 'Tier 1', '70.0%', '1.0x'],
      ['Restricted (Mov)', 'Tier 2', '20.0%', '2.5x'],
      ['Classified (Roz)', 'Tier 3', '7.5%', '6.0x'],
      ['Covert (Roșu)', 'Tier 4', '2.0%', '15.0x'],
      ['Special Rarisim (Auriu)', 'Tier Special', '0.5%', '50.0x'],
    ],
  },
];

const props = defineProps<{
  cursorLine: number;
}>();

const emit = defineEmits<{
  (e: 'insert', markdown: string): void;
  (e: 'close'): void;
}>();

const headers = ref<string[]>(['Coloană 1', 'Coloană 2', 'Coloană 3']);
const alignments = ref<ColumnAlignment[]>(['left', 'left', 'left']);
const rows = ref<string[][]>([
  ['Valoare A1', 'Valoare B1', 'Valoare C1'],
  ['Valoare A2', 'Valoare B2', 'Valoare C2'],
]);

const selectedPresetId = ref<string>('');
const previewTab = ref<'visual' | 'markdown'>('visual');
const copiedCode = ref(false);

function setColAlign(colIdx: number, align: ColumnAlignment) {
  alignments.value[colIdx] = align;
}

function handleHeaderChange(colIdx: number, val: string) {
  headers.value[colIdx] = val;
}

function handleCellChange(rowIdx: number, colIdx: number, val: string) {
  rows.value[rowIdx][colIdx] = val;
}

function addColumn() {
  const newIdx = headers.value.length + 1;
  headers.value.push(`Coloană ${newIdx}`);
  alignments.value.push('left');
  rows.value.forEach((r) => r.push(`Valoare C${newIdx}`));
}

function removeColumn(colIdx: number) {
  if (headers.value.length <= 1) return;
  headers.value.splice(colIdx, 1);
  alignments.value.splice(colIdx, 1);
  rows.value.forEach((r) => r.splice(colIdx, 1));
}

function addRow() {
  const newRowIdx = rows.value.length + 1;
  const newRow = headers.value.map((_, colIdx) => `Valoare R${newRowIdx} C${colIdx + 1}`);
  rows.value.push(newRow);
}

function removeRow(rowIdx: number) {
  if (rows.value.length <= 1) return;
  rows.value.splice(rowIdx, 1);
}

function applyPreset(preset: TablePreset) {
  selectedPresetId.value = preset.id;
  headers.value = [...preset.headers];
  alignments.value = [...preset.alignments];
  rows.value = preset.rows.map((row) => [...row]);
}

function resetTable() {
  selectedPresetId.value = '';
  headers.value = ['Coloană 1', 'Coloană 2', 'Coloană 3'];
  alignments.value = ['left', 'left', 'left'];
  rows.value = [
    ['Valoare A1', 'Valoare B1', 'Valoare C1'],
    ['Valoare A2', 'Valoare B2', 'Valoare C2'],
  ];
}

const markdownResult = computed(() => {
  const cleanHeaders = headers.value.map((h) => (h.trim() === '' ? ' ' : h.trim()));
  const headerRow = `| ${cleanHeaders.join(' | ')} |`;

  const separatorRow = `| ${alignments.value
    .map((align) => {
      if (align === 'center') return ':---:';
      if (align === 'right') return '---:';
      return ':---';
    })
    .join(' | ')} |`;

  const dataRows = rows.value.map((row) => {
    const cells = row.map((cell) => (cell.trim() === '' ? '-' : cell.trim()));
    return `| ${cells.join(' | ')} |`;
  });

  return [headerRow, separatorRow, ...dataRows].join('\n');
});

function handleInsert() {
  emit('insert', markdownResult.value);
}

function handleCopyMarkdown() {
  navigator.clipboard.writeText(markdownResult.value);
  copiedCode.value = true;
  setTimeout(() => (copiedCode.value = false), 2000);
}
</script>

<template>
  <div class="admin-modal-overlay">
    <div class="admin-modal-container studio-table-modal-container">
      <!-- Header -->
      <div class="admin-modal-header">
        <div>
          <div class="studio-modal-badge">
            <Icon icon="lucide:table" width="12" height="12" />
            <span>CREATOR INTERACTIV DE TABEL</span>
          </div>
          <h3 class="admin-modal-title">Configurare Structură &amp; Conținut Tabel</h3>
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
          <Icon icon="lucide:columns-3" width="12" height="12" />
          <span>{{ headers.length }} Coloane</span>
          <span class="studio-builder-badge-dot">×</span>
          <Icon icon="lucide:rows-3" width="12" height="12" />
          <span>{{ rows.length }} Rânduri</span>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="admin-modal-body studio-table-modal-body">
        <!-- Quick Presets Carousel / Badges -->
        <div class="studio-builder-presets-section">
          <div class="studio-builder-presets-label">
            <Icon icon="lucide:wand-2" width="13" height="13" class="text-amber-400" />
            <span>Șabloane Rapide Preconfigurate:</span>
          </div>
          <div class="studio-builder-presets-list">
            <button
              v-for="preset in TABLE_PRESETS"
              :key="preset.id"
              type="button"
              class="studio-builder-preset-chip"
              :class="{ 'studio-builder-preset-chip--active': selectedPresetId === preset.id }"
              :title="preset.desc"
              @click="applyPreset(preset)"
            >
              <Icon icon="lucide:sparkles" width="11" height="11" />
              <span>{{ preset.name }}</span>
            </button>
            <button
              type="button"
              class="studio-builder-preset-chip studio-builder-preset-chip--reset"
              title="Resetează la tabel curat 3x2"
              @click="resetTable"
            >
              <Icon icon="lucide:rotate-ccw" width="11" height="11" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <!-- View Mode Toggle: Interactive Grid vs Raw Markdown -->
        <div class="studio-builder-view-switcher">
          <button
            type="button"
            class="studio-builder-view-btn"
            :class="{ 'studio-builder-view-btn--active': previewTab === 'visual' }"
            @click="previewTab = 'visual'"
          >
            <Icon icon="lucide:table" width="13" height="13" />
            <span>Editor Vizual Interactiv</span>
          </button>
          <button
            type="button"
            class="studio-builder-view-btn"
            :class="{ 'studio-builder-view-btn--active': previewTab === 'markdown' }"
            @click="previewTab = 'markdown'"
          >
            <Icon icon="lucide:file-text" width="13" height="13" />
            <span>Previzualizare Cod Markdown</span>
          </button>
        </div>

        <!-- Interactive Visual Grid -->
        <div v-if="previewTab === 'visual'" class="studio-table-grid-wrapper">
          <!-- Controls bar (Add Row / Add Col) -->
          <div class="studio-table-quick-toolbar">
            <div class="studio-table-quick-toolbar-left">
              <button
                type="button"
                class="studio-table-action-pill studio-table-action-pill--add"
                @click="addColumn"
              >
                <Icon icon="lucide:plus" width="12" height="12" />
                <span>Adaugă Coloană (+Col)</span>
              </button>
              <button
                type="button"
                class="studio-table-action-pill studio-table-action-pill--add"
                @click="addRow"
              >
                <Icon icon="lucide:plus" width="12" height="12" />
                <span>Adaugă Rând (+Rând)</span>
              </button>
            </div>
            <div class="studio-table-quick-toolbar-right">
              <span class="studio-table-helper-text">
                Apasă pe butoanele de aliniere pentru a schimba direcția fiecărei coloane.
              </span>
            </div>
          </div>

          <!-- Interactive Matrix Grid -->
          <div class="studio-table-scroll-matrix">
            <table class="studio-interactive-table">
              <thead>
                <tr>
                  <th class="studio-th-corner">#</th>
                  <th v-for="(header, colIdx) in headers" :key="colIdx" class="studio-th-col">
                    <div class="studio-th-col-header">
                      <input
                        type="text"
                        :value="header"
                        :placeholder="`Antet Col ${colIdx + 1}`"
                        class="studio-th-input"
                        @input="handleHeaderChange(colIdx, ($event.target as HTMLInputElement).value)"
                      />
                      <div class="studio-th-align-group">
                        <button
                          type="button"
                          class="studio-th-align-btn"
                          :class="{ active: alignments[colIdx] === 'left' }"
                          title="Aliniere la Stânga"
                          @click="setColAlign(colIdx, 'left')"
                        >
                          <Icon icon="lucide:align-left" width="10" height="10" />
                        </button>
                        <button
                          type="button"
                          class="studio-th-align-btn"
                          :class="{ active: alignments[colIdx] === 'center' }"
                          title="Aliniere la Centru"
                          @click="setColAlign(colIdx, 'center')"
                        >
                          <Icon icon="lucide:align-center" width="10" height="10" />
                        </button>
                        <button
                          type="button"
                          class="studio-th-align-btn"
                          :class="{ active: alignments[colIdx] === 'right' }"
                          title="Aliniere la Dreapta"
                          @click="setColAlign(colIdx, 'right')"
                        >
                          <Icon icon="lucide:align-right" width="10" height="10" />
                        </button>
                        <button
                          v-if="headers.length > 1"
                          type="button"
                          class="studio-th-delete-col-btn"
                          title="Șterge această coloană"
                          @click="removeColumn(colIdx)"
                        >
                          <Icon icon="lucide:trash-2" width="10" height="10" />
                        </button>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, rowIdx) in rows" :key="rowIdx">
                  <td class="studio-td-row-handle">
                    <div class="studio-row-label-box">
                      <span>R{{ rowIdx + 1 }}</span>
                      <button
                        v-if="rows.length > 1"
                        type="button"
                        class="studio-row-delete-btn"
                        :title="`Șterge Rândul ${rowIdx + 1}`"
                        @click="removeRow(rowIdx)"
                      >
                        <Icon icon="lucide:trash-2" width="10" height="10" />
                      </button>
                    </div>
                  </td>
                  <td v-for="(cell, colIdx) in row" :key="colIdx" class="studio-td-cell">
                    <input
                      type="text"
                      :value="cell"
                      :placeholder="`Valoare L${rowIdx + 1} C${colIdx + 1}`"
                      class="studio-td-input"
                      :class="`studio-td-input--${alignments[colIdx]}`"
                      @input="handleCellChange(rowIdx, colIdx, ($event.target as HTMLInputElement).value)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Raw Markdown Preview -->
        <div v-else class="studio-table-markdown-preview">
          <div class="studio-markdown-preview-header">
            <span>Cod Generat Markdown (Ghid Standard GitHub Flavored Markdown)</span>
            <button type="button" class="studio-copy-code-btn" @click="handleCopyMarkdown">
              <Icon :icon="copiedCode ? 'lucide:check' : 'lucide:copy'" width="12" height="12" :class="{ 'text-emerald-400': copiedCode }" />
              <span>{{ copiedCode ? 'Copiat!' : 'Copiază Codul' }}</span>
            </button>
          </div>
          <pre class="studio-table-code-block"><code>{{ markdownResult }}</code></pre>
        </div>
      </div>

      <!-- Footer with Actions -->
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
          <span>Inserează Tabelul la Linia {{ cursorLine }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
