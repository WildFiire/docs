<script setup lang="ts">
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';

interface LanguageOption {
  key: string;
  name: string;
  badgeColor: string;
}

const LANGUAGES: LanguageOption[] = [
  { key: 'bash', name: 'Bash / Consolă', badgeColor: '#10b981' },
  { key: 'typescript', name: 'TypeScript', badgeColor: '#3b82f6' },
  { key: 'javascript', name: 'JavaScript', badgeColor: '#f59e0b' },
  { key: 'json', name: 'JSON Config', badgeColor: '#06b6d4' },
  { key: 'csharp', name: 'C# (.NET)', badgeColor: '#8b5cf6' },
  { key: 'python', name: 'Python', badgeColor: '#ec4899' },
  { key: 'sql', name: 'PostgreSQL / SQL', badgeColor: '#38bdf8' },
  { key: 'yaml', name: 'YAML / YML', badgeColor: '#fb923c' },
  { key: 'cpp', name: 'C++ / SourcePawn', badgeColor: '#f43f5e' },
  { key: 'markdown', name: 'Markdown / MDX', badgeColor: '#a855f7' },
  { key: 'css', name: 'CSS / SCSS', badgeColor: '#60a5fa' },
  { key: 'plaintext', name: 'Text Simplu', badgeColor: '#9ca3af' },
];

const CODE_PRESETS = [
  {
    name: 'Conectare CS2 & Setări Rețea',
    lang: 'bash',
    title: 'autoexec.cfg',
    code: `// Conectare rapidă pe serverul WildFire CS2
connect cs2.wildfire.ro:27015

// Setări rate rețea recomandate
rate 786432
cl_interp 0.015625
cl_updaterate 128
cl_cmdrate 128`,
  },
  {
    name: 'Comandă Chat & Alias Consolă',
    lang: 'bash',
    title: 'chat_commands.txt',
    code: `// Comenzi uzuale în joc
!vip          // Deschide meniul VIP
!shop         // Magazin credite
!ws           // Selector arme & skin-uri
!knife        // Meniu alegere cuțit
!gloves       // Meniu mănuși`,
  },
  {
    name: 'Configurație Server Plugin',
    lang: 'json',
    title: 'config/settings.json',
    code: `{
  "serverName": "Wildfire CS2 #1 | Competitive",
  "maxPlayers": 24,
  "creditsPerRoundWin": 50,
  "creditsPerKill": 10,
  "vipMultipliers": {
    "bronze": 1.15,
    "silver": 1.30,
    "diamond": 1.50
  }
}`,
  },
  {
    name: 'Exemplu Payload Discord Webhook',
    lang: 'json',
    title: 'discord-webhook-payload.json',
    code: `{
  "username": "Wildfire Security Guard",
  "avatar_url": "https://wildfire.ro/logo.png",
  "embeds": [
    {
      "title": "Audit Alert: Modificare Articol",
      "description": "Utilizatorul **iannC69** a actualizat ghidul de comenzi.",
      "color": 16739072
    }
  ]
}`,
  },
];

const props = defineProps<{
  cursorLine: number;
}>();

const emit = defineEmits<{
  (e: 'insert', markdown: string): void;
  (e: 'close'): void;
}>();

const lang = ref('bash');
const fileTitle = ref('');
const code = ref('# Introdu aici liniile de cod sau comenzile\nconnect cs2.wildfire.ro');
const selectedPresetName = ref('');

function applyPreset(preset: typeof CODE_PRESETS[0]) {
  selectedPresetName.value = preset.name;
  lang.value = preset.lang;
  fileTitle.value = preset.title;
  code.value = preset.code;
}

const generateMarkdownCode = computed(() => {
  const titleComment = fileTitle.value.trim() ? `# [${fileTitle.value.trim()}]\n` : '';
  return `\`\`\`${lang.value}\n${titleComment}${code.value}\n\`\`\``;
});

function handleInsert() {
  emit('insert', generateMarkdownCode.value);
}
</script>

<template>
  <div class="admin-modal-overlay">
    <div class="admin-modal-container studio-code-modal-container">
      <!-- Header -->
      <div class="admin-modal-header">
        <div>
          <div class="studio-modal-badge">
            <Icon icon="lucide:code" width="12" height="12" />
            <span>CONSTRUCTOR BLOCURI DE COD</span>
          </div>
          <h3 class="admin-modal-title">Configurare Limbaj &amp; Script Tehnologic</h3>
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
          <Icon icon="lucide:terminal" width="12" height="12" />
          <span>Limbaj: {{ lang }}</span>
        </div>
      </div>

      <div class="admin-modal-body">
        <!-- Preset Buttons -->
        <div class="studio-builder-presets-section">
          <div class="studio-builder-presets-label">
            <Icon icon="lucide:wand-2" width="13" height="13" class="text-amber-400" />
            <span>Fragmente Preconfigurate:</span>
          </div>
          <div class="studio-builder-presets-list">
            <button
              v-for="preset in CODE_PRESETS"
              :key="preset.name"
              type="button"
              class="studio-builder-preset-chip"
              :class="{ 'studio-builder-preset-chip--active': selectedPresetName === preset.name }"
              @click="applyPreset(preset)"
            >
              <Icon icon="lucide:sparkles" width="11" height="11" />
              <span>{{ preset.name }}</span>
            </button>
          </div>
        </div>

        <!-- Language Selection Chips -->
        <div class="studio-code-languages-grid">
          <button
            v-for="l in LANGUAGES"
            :key="l.key"
            type="button"
            class="studio-code-lang-chip"
            :class="{ 'studio-code-lang-chip--active': lang === l.key }"
            :style="{ '--lang-accent': l.badgeColor } as any"
            @click="lang = l.key"
          >
            <span class="studio-code-lang-dot" />
            <span>{{ l.name }}</span>
          </button>
        </div>

        <!-- Optional Title input -->
        <div class="admin-form-group mt-3">
          <label class="admin-form-label">Titlu Fișier / Antet Script (Opțional)</label>
          <input
            v-model="fileTitle"
            type="text"
            placeholder="ex: cfg/server.cfg sau src/controllers/user.ts"
            class="admin-form-input admin-table-mono"
          />
        </div>

        <!-- Code Textarea -->
        <div class="admin-form-group">
          <div class="studio-code-editor-header">
            <div class="studio-code-editor-tab">
              <Icon icon="lucide:file-code" width="13" height="13" />
              <span>{{ fileTitle.trim() || `snippet.${lang}` }}</span>
            </div>
            <span class="studio-code-editor-lines">{{ code.split('\n').length }} linii</span>
          </div>
          <textarea
            v-model="code"
            rows="8"
            placeholder="Scrie sau lipește codul aici..."
            class="admin-form-input studio-code-textarea admin-table-mono"
            spellcheck="false"
          />
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
          <span>Inserează Blocul de Cod la Linia {{ cursorLine }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
