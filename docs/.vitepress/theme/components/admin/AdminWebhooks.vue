<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';

defineProps<{ user?: any }>();

interface WebhookResult {
  id: string;
  name: string;
  status: 'success' | 'error' | 'pending' | 'idle';
  message?: string;
  triggeredAt?: string;
  duration?: number;
}

interface WebhookDef {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  method: 'GET' | 'POST';
  channel: string;
  icon: string;
  color: string;
  badgeColor: string;
  category: 'reports' | 'security' | 'ai' | 'system';
}

interface EmbedField {
  name: string;
  value: string;
  inline: boolean;
}

interface DiscordEmbedState {
  mode: 'create' | 'edit';
  messageId: string;
  channelPreset: string;
  customWebhookUrl: string;
  content: string;
  authorName: string;
  authorIcon: string;
  authorUrl: string;
  title: string;
  titleUrl: string;
  description: string;
  color: string;
  fields: EmbedField[];
  thumbnailUrl: string;
  imageUrl: string;
  footerText: string;
  footerIcon: string;
  includeTimestamp: boolean;
}

interface SentMessageHistory {
  id: string;
  messageId: string;
  title: string;
  channel: string;
  time: string;
  color: string;
}

const PRESET_COLORS = [
  { label: 'WildFire Orange', hex: '#ff6b00' },
  { label: 'Amber Gold', hex: '#f59e0b' },
  { label: 'Emerald Green', hex: '#10b981' },
  { label: 'Cyan Blue', hex: '#06b6d4' },
  { label: 'Crimson Red', hex: '#ef4444' },
  { label: 'Discord Blurple', hex: '#5865f2' },
  { label: 'Royal Purple', hex: '#8b5cf6' },
  { label: 'Slate Dark', hex: '#475569' },
];

const CHANNEL_OPTIONS = [
  { value: '#procedura', label: '#procedura', desc: 'Ghiduri, Roluri & Proceduri Interne', icon: 'lucide:scroll-text', color: '#ff6b00' },
  { value: '#anunturi', label: '#anunturi', desc: 'Anunturi Oficiale Comunitate', icon: 'lucide:megaphone', color: '#06b6d4' },
  { value: '#logs', label: '#logs', desc: 'Audit, Securitate & Evenimente', icon: 'lucide:activity', color: '#10b981' },
  { value: '#tasks', label: '#tasks', desc: 'Task-uri & Alerte Echipa', icon: 'lucide:check-circle-2', color: '#f59e0b' },
  { value: '#security', label: '#security', desc: 'Alerte Securitate & Lockdown', icon: 'lucide:shield', color: '#ef4444' },
  { value: '#team', label: '#team', desc: 'Modificari Echipa & Roluri', icon: 'lucide:user', color: '#3b82f6' },
  { value: '#content', label: '#content', desc: 'Actualizari Ghiduri & Continut', icon: 'lucide:file-text', color: '#10b981' },
  { value: '#system', label: '#system', desc: 'Mentenanta & Stare Sistem', icon: 'lucide:server', color: '#8b5cf6' },
  { value: 'custom', label: 'Custom Webhook URL', desc: 'Specifica un URL webhook manual', icon: 'lucide:globe', color: '#64748b' },
];

const CHANNEL_ICON_MAP: Record<string, string> = {
  '#procedura': 'lucide:scroll-text',
  '#anunturi': 'lucide:megaphone',
  '#logs': 'lucide:activity',
  '#tasks': 'lucide:check-circle-2',
  '#security': 'lucide:shield',
  '#team': 'lucide:user',
  '#content': 'lucide:file-text',
  '#system': 'lucide:server',
  custom: 'lucide:globe',
};

const PRESETS: Array<{ id: string; name: string; description: string; color: string; data: Partial<DiscordEmbedState> }> = [
  {
    id: 'procedura-team',
    name: 'Procedura Echipa',
    description: 'Roluri si reguli complete pentru #procedura',
    color: '#ff6b00',
    data: {
      channelPreset: '#procedura',
      content: '',
      authorName: 'WildFire Docs Core · Administrare & Standarde',
      authorIcon: 'https://raw.githubusercontent.com/iannC69/wf-docscore/main/public/logo.png',
      authorUrl: 'https://docs.wildfire.ro/docs/team',
      title: '[PROCEDURA OFICIALA] Roluri Echipa & Standarde de Redactare Docs',
      titleUrl: 'https://docs.wildfire.ro/admin',
      color: '#ff6b00',
      description:
        'Acest ghid stabileste **procedura standard si rolurile obligatorii** pentru toti membrii echipei Docs. Fiecare membru cu acces in Admin Panel are responsabilitati specifice si trebuie sa respecte standardele de calitate la fiecare commit.\n\n> **Panou Admin:** `https://docs.wildfire.ro/admin`\n> **Echipa Oficiala:** `https://docs.wildfire.ro/docs/team`',
      fields: [
        {
          name: '1. Lead Docs & Systems Architect',
          value:
            '<@371621920162185216>\n* Administrare globala platforma, structura categorii & arhitectura docs.\n* Gestiune echipa, matrice RBAC, 2FA TOTP si control Panic Lockdown.\n* Monitorizare telemetrie AI si integritate SHA-256 Audit Ledger.',
          inline: false,
        },
        {
          name: '2. Co-Root & Systems Lead',
          value:
            '<@650621084223275010>\n* Supervizare tehnica infrastructura platforma Docs & backend.\n* Mentenanta baze de date, Snapshot Vault si stabilitate sistem.\n* Revizuire si validare ghiduri tehnice avansate inainte de publicare.',
          inline: false,
        },
        {
          name: '3. Senior Content Editor & Reviewer',
          value:
            '<@778170514036228097>\n* Redactare ghiduri detaliate, structura categorii si standarde vizuale.\n* Administrare Media Vault (incarcare si optimizare imagini WebP).\n* Solutionare feedback utilizatori si verificare acuratete documentatie.',
          inline: false,
        },
        {
          name: '4. Senior Content Editor',
          value:
            '<@996796351587287100>\n* Redactare ghiduri administrative, proceduri interne Staff si regulamente.\n* Formatare MDX, verificare conformitate sintaxa si corectura de limbaj.\n* Rezolvare task-uri alocate pe fluxul Kanban saptamanal.',
          inline: false,
        },
        {
          name: 'Reguli Obligatorii MDX Health',
          value:
            '* **Zero Emoji-uri:** Exclusiv iconite vectoriale SVG.\n* **Scor MDX Health:** Minim 90/100 inainte de publicare.\n* **Git Auto-Commit:** Fiecare salvare este semnata in Audit Ledger.',
          inline: true,
        },
        {
          name: 'Media & Task Hub',
          value:
            '* **Media Vault:** Imagini WebP/PNG optimizate (`/public/media/...`).\n* **Task Hub:** Actualizare status (`pending` -> `in_progress` -> `completed`).',
          inline: true,
        },
      ],
      thumbnailUrl: '',
      imageUrl: '',
      footerText: 'WildFire Docs Core Engine · Proceduri & Standarde Interne',
      footerIcon: 'https://raw.githubusercontent.com/iannC69/wf-docscore/main/public/logo.png',
      includeTimestamp: true,
    },
  },
  {
    id: 'announcement-docs',
    name: 'Anunt Docs',
    description: 'Anunt pentru lansarea de ghiduri noi',
    color: '#06b6d4',
    data: {
      channelPreset: '#anunturi',
      content: '@everyone',
      authorName: 'WildFire Docs · Actualizare Ghiduri',
      authorIcon: 'https://raw.githubusercontent.com/iannC69/wf-docscore/main/public/logo.png',
      authorUrl: 'https://docs.wildfire.ro',
      title: 'Noi Ghiduri Tehnice & Actualizari Disponibile pe Docs',
      titleUrl: 'https://docs.wildfire.ro',
      color: '#06b6d4',
      description:
        'Am publicat o noua serie de actualizari si ghiduri complete pe platforma **WildFire Docs**!\n\nVa invitam sa consultati cele mai recente modificari si sa descoperiti noile functionalitati documentate in detaliu.',
      fields: [
        {
          name: 'Ce este nou?',
          value:
            '* Structura actualizata pentru toate categoriile si sectiunile Docs.\n* Ghiduri detaliate pentru fluxurile de utilizare si proceduri interne.\n* Optimizari majore pentru motorul de cautare rapida (Ctrl + K).',
          inline: false,
        },
        {
          name: 'Ai gasit o eroare?',
          value: 'Trimite un raport rapid folosind butonul de feedback de la finalul fiecarui ghid.',
          inline: true,
        },
        { name: 'Link Direct', value: '[docs.wildfire.ro](https://docs.wildfire.ro)', inline: true },
      ],
      thumbnailUrl: '',
      imageUrl: '',
      footerText: 'WildFire Community Documentation',
      footerIcon: 'https://raw.githubusercontent.com/iannC69/wf-docscore/main/public/logo.png',
      includeTimestamp: true,
    },
  },
  {
    id: 'maintenance-alert',
    name: 'Mentenanta',
    description: 'Alerta pentru interventii tehnice programate',
    color: '#f59e0b',
    data: {
      channelPreset: '#system',
      content: '@here',
      authorName: 'WildFire Infrastructure & Systems',
      authorIcon: 'https://raw.githubusercontent.com/iannC69/wf-docscore/main/public/logo.png',
      authorUrl: 'https://docs.wildfire.ro/admin/health',
      title: '[MENTENANTA PROGRAMATA] Interventie Optimizare Platforma Docs',
      titleUrl: 'https://docs.wildfire.ro/maintenance',
      color: '#f59e0b',
      description:
        'Infrastructura platformei de documentatie WildFire Docs va trece printr-o scurta runda de mentenanta preventiva si aplicare de patch-uri de securitate.',
      fields: [
        { name: 'Interval Estimat', value: 'Aproximativ 20-30 minute', inline: true },
        { name: 'Impact', value: 'Acces restrictionat temporar in Admin Studio', inline: true },
        {
          name: 'Responsabili Tehnici',
          value: 'Supervizat de <@371621920162185216> si <@650621084223275010>',
          inline: false,
        },
      ],
      thumbnailUrl: '',
      imageUrl: '',
      footerText: 'WildFire Systems & Infrastructure Lead',
      footerIcon: 'https://raw.githubusercontent.com/iannC69/wf-docscore/main/public/logo.png',
      includeTimestamp: true,
    },
  },
  {
    id: 'changelog-update',
    name: 'Changelog',
    description: 'Actualizari si note de lansare Docs',
    color: '#10b981',
    data: {
      channelPreset: '#content',
      content: '',
      authorName: 'WildFire Docs Core · Changelog Engine',
      authorIcon: 'https://raw.githubusercontent.com/iannC69/wf-docscore/main/public/logo.png',
      authorUrl: 'https://docs.wildfire.ro/changelog',
      title: '[CHANGELOG] Note de Lansare & Modificari Recente',
      titleUrl: 'https://docs.wildfire.ro/changelog',
      color: '#10b981',
      description:
        'O noua versiune a platformei de documentatie a fost lansata cu imbunatatiri de performanta si noi ghiduri.',
      fields: [
        { name: 'Versiune', value: 'v1.8.5', inline: true },
        { name: 'Canal', value: '#content', inline: true },
        {
          name: 'Modificari Cheie',
          value: '* Corecturi MDX Health\n* Actualizare componente interactive\n* Optimizari viteza de incarcare',
          inline: false,
        },
      ],
      thumbnailUrl: '',
      imageUrl: '',
      footerText: 'WildFire Changelog · Actualizari Continue',
      footerIcon: 'https://raw.githubusercontent.com/iannC69/wf-docscore/main/public/logo.png',
      includeTimestamp: true,
    },
  },
  {
    id: 'security-alert',
    name: 'Alerta Securitate',
    description: 'Alerte de securitate si audit pentru #security',
    color: '#ef4444',
    data: {
      channelPreset: '#security',
      content: '@here',
      authorName: 'WildFire Security Ledger',
      authorIcon: 'https://raw.githubusercontent.com/iannC69/wf-docscore/main/public/logo.png',
      authorUrl: 'https://docs.wildfire.ro/admin/security',
      title: '[ALERTA SECURITATE] Eveniment Critic Inregistrat',
      titleUrl: 'https://docs.wildfire.ro/admin/security',
      color: '#ef4444',
      description:
        'A fost detectat un eveniment critic in sistemul de securitate. Toti administratorii sunt rugati sa verifice registrul de audit.',
      fields: [
        { name: 'Nivel Severitate', value: 'CRITIC (P1)', inline: true },
        { name: 'Stare Ledger', value: 'SHA-256 Validat', inline: true },
        { name: 'Actiune Necesara', value: 'Inspectati sesiunile active in Admin Studio.', inline: false },
      ],
      thumbnailUrl: '',
      imageUrl: '',
      footerText: 'WildFire Security Operations Center',
      footerIcon: 'https://raw.githubusercontent.com/iannC69/wf-docscore/main/public/logo.png',
      includeTimestamp: true,
    },
  },
];

const WEBHOOKS: WebhookDef[] = [
  {
    id: 'daily-digest',
    name: 'Raport Zilnic de Trafic',
    description:
      'Trimite un rezumat complet al traficului de azi: top ghiduri citite, vizualizari totale, intrebari AI si integritate sistem.',
    endpoint: '/api/admin/reports/daily-digest',
    method: 'POST',
    channel: '#logs',
    icon: 'lucide:bar-chart-3',
    color: 'hsl(26 100% 52%)',
    badgeColor: 'adx-pill--orange',
    category: 'reports',
  },
  {
    id: 'security-snapshot',
    name: 'Security Snapshot',
    description:
      'Trimite un raport de securitate live: sesiuni active, stare Panic Lockdown, integritate SHA-256 Audit Chain si ultimele 5 evenimente critice.',
    endpoint: '/api/admin/reports/security-snapshot',
    method: 'POST',
    channel: '#logs',
    icon: 'lucide:shield',
    color: '#ef4444',
    badgeColor: 'adx-pill--red',
    category: 'security',
  },
  {
    id: 'ai-telemetry',
    name: 'AI Helper Telemetry',
    description:
      'Trimite un raport detaliat al performantei AI Helper: cost total USD, tokeni, latenta medie, success rate si ultimele query-uri.',
    endpoint: '/api/admin/reports/ai-telemetry',
    method: 'POST',
    channel: '#logs',
    icon: 'lucide:bot',
    color: '#a78bfa',
    badgeColor: 'adx-pill--purple',
    category: 'ai',
  },
  {
    id: 'system-health',
    name: 'System Health Check',
    description:
      'Transmite starea live a serverului: memorie heap/RSS, uptime, versiune platforma si integritate date.',
    endpoint: '/api/admin/reports/system-health',
    method: 'POST',
    channel: '#logs',
    icon: 'lucide:activity',
    color: '#10b981',
    badgeColor: 'adx-pill--green',
    category: 'system',
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  reports: 'Rapoarte & Analytics',
  security: 'Securitate',
  ai: 'AI & Telemetry',
  system: 'Sistem',
};

const STORAGE_SENT_MESSAGES_KEY = 'wf_discord_sent_embeds_history';

function formatDuration(ms?: number): string {
  if (!ms) return '';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatTime(iso?: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function renderDiscordMarkdown(text: string) {
  if (!text) return '';
  let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  html = html.replace(/```([\s\S]*?)```/g, '<pre class="dc-pre"><code>$1</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code class="dc-code">$1</code>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/^>\s?(.*)$/gm, '<blockquote class="dc-quote">$1</blockquote>');
  html = html.replace(/^\*\s+(.*)$/gm, '<div class="dc-bullet">• $1</div>');
  html = html.replace(/^-\s+(.*)$/gm, '<div class="dc-bullet">• $1</div>');
  html = html.replace(/\n/g, '<br />');
  return html;
}

const activeTab = ref<'embed_studio' | 'system_reports'>('embed_studio');
const results = ref<Record<string, WebhookResult>>({});
const history = ref<Array<{ id: string; name: string; status: 'success' | 'error'; time: string; duration: number }>>([]);

const defaultEmbed = PRESETS[0].data;
const embedState = ref<DiscordEmbedState>({
  mode: 'create',
  messageId: '',
  channelPreset: defaultEmbed.channelPreset || '#procedura',
  customWebhookUrl: defaultEmbed.customWebhookUrl || '',
  content: defaultEmbed.content || '',
  authorName: defaultEmbed.authorName || '',
  authorIcon: defaultEmbed.authorIcon || '',
  authorUrl: defaultEmbed.authorUrl || '',
  title: defaultEmbed.title || '',
  titleUrl: defaultEmbed.titleUrl || '',
  description: defaultEmbed.description || '',
  color: defaultEmbed.color || '#ff6b00',
  fields: defaultEmbed.fields ? JSON.parse(JSON.stringify(defaultEmbed.fields)) : [],
  thumbnailUrl: defaultEmbed.thumbnailUrl || '',
  imageUrl: defaultEmbed.imageUrl || '',
  footerText: defaultEmbed.footerText || '',
  footerIcon: defaultEmbed.footerIcon || '',
  includeTimestamp: defaultEmbed.includeTimestamp ?? true,
});

const isSendingEmbed = ref(false);
const embedDispatchStatus = ref<{
  type: 'success' | 'error' | null;
  message: string;
  messageId?: string;
  time?: string;
}>({ type: null, message: '' });

const copiedPayload = ref(false);
const copiedId = ref<string | null>(null);
const showJsonRaw = ref(false);
const sentHistory = ref<SentMessageHistory[]>([]);

const channelDropdownOpen = ref(false);
const dropdownRootRef = ref<HTMLElement | null>(null);

const selectedChannel = computed(() => {
  return CHANNEL_OPTIONS.find((o) => o.value === embedState.value.channelPreset) || CHANNEL_OPTIONS[0];
});

const categories = computed(() => [...new Set(WEBHOOKS.map((w) => w.category))]);

const currentSimulatedTime = ref('');
function updateSimulatedTime() {
  currentSimulatedTime.value = new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
}

function handleOutsideClick(e: MouseEvent) {
  if (dropdownRootRef.value && !dropdownRootRef.value.contains(e.target as Node)) {
    channelDropdownOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleOutsideClick);
  updateSimulatedTime();
  try {
    const stored = localStorage.getItem(STORAGE_SENT_MESSAGES_KEY);
    if (stored) sentHistory.value = JSON.parse(stored);
  } catch {}
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleOutsideClick);
});

function selectChannel(val: string) {
  embedState.value.channelPreset = val;
  channelDropdownOpen.value = false;
}

function handleLoadPreset(presetId: string) {
  const p = PRESETS.find((item) => item.id === presetId);
  if (!p) return;
  embedState.value = {
    ...embedState.value,
    channelPreset: p.data.channelPreset || '#procedura',
    customWebhookUrl: p.data.customWebhookUrl || '',
    content: p.data.content || '',
    authorName: p.data.authorName || '',
    authorIcon: p.data.authorIcon || '',
    authorUrl: p.data.authorUrl || '',
    title: p.data.title || '',
    titleUrl: p.data.titleUrl || '',
    description: p.data.description || '',
    color: p.data.color || '#ff6b00',
    fields: p.data.fields ? JSON.parse(JSON.stringify(p.data.fields)) : [],
    thumbnailUrl: p.data.thumbnailUrl || '',
    imageUrl: p.data.imageUrl || '',
    footerText: p.data.footerText || '',
    footerIcon: p.data.footerIcon || '',
    includeTimestamp: p.data.includeTimestamp ?? true,
  };
  embedDispatchStatus.value = { type: null, message: '' };
}

function resetForm() {
  embedState.value = {
    mode: 'create',
    messageId: '',
    channelPreset: '#procedura',
    customWebhookUrl: '',
    content: '',
    authorName: '',
    authorIcon: '',
    authorUrl: '',
    title: '',
    titleUrl: '',
    description: '',
    color: '#ff6b00',
    fields: [],
    thumbnailUrl: '',
    imageUrl: '',
    footerText: '',
    footerIcon: '',
    includeTimestamp: true,
  };
  embedDispatchStatus.value = { type: null, message: '' };
}

function handleAddField() {
  if (embedState.value.fields.length >= 25) return;
  embedState.value.fields.push({
    name: 'Camp Nou',
    value: 'Descriere camp...',
    inline: true,
  });
}

function handleRemoveField(index: number) {
  embedState.value.fields.splice(index, 1);
}

function saveSentMessageToHistory(msg: SentMessageHistory) {
  const filtered = sentHistory.value.filter((m) => m.messageId !== msg.messageId);
  const updated = [msg, ...filtered].slice(0, 10);
  sentHistory.value = updated;
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_SENT_MESSAGES_KEY, JSON.stringify(updated));
    }
  } catch {}
}

function clearSentHistory() {
  sentHistory.value = [];
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_SENT_MESSAGES_KEY);
    }
  } catch {}
}

async function handleSendEmbed() {
  isSendingEmbed.value = true;
  embedDispatchStatus.value = { type: null, message: '' };
  try {
    const payload = {
      mode: embedState.value.mode,
      messageId: embedState.value.mode === 'edit' ? embedState.value.messageId.trim() : undefined,
      channelPreset: embedState.value.channelPreset,
      customWebhookUrl: embedState.value.customWebhookUrl || undefined,
      content: embedState.value.content || undefined,
      embed: {
        title: embedState.value.title || undefined,
        url: embedState.value.titleUrl || undefined,
        description: embedState.value.description || undefined,
        color: embedState.value.color,
        author: embedState.value.authorName
          ? {
              name: embedState.value.authorName,
              icon_url: embedState.value.authorIcon || undefined,
              url: embedState.value.authorUrl || undefined,
            }
          : undefined,
        fields: embedState.value.fields.length > 0 ? embedState.value.fields : undefined,
        thumbnail: embedState.value.thumbnailUrl ? { url: embedState.value.thumbnailUrl } : undefined,
        image: embedState.value.imageUrl ? { url: embedState.value.imageUrl } : undefined,
        footer: embedState.value.footerText
          ? {
              text: embedState.value.footerText,
              icon_url: embedState.value.footerIcon || undefined,
            }
          : undefined,
        timestamp: embedState.value.includeTimestamp ? new Date().toISOString() : undefined,
      },
    };
    const res = await fetch('/api/admin/webhooks/custom-embed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    const returnedId = data.messageId || embedState.value.messageId || undefined;
    if (returnedId) {
      saveSentMessageToHistory({
        id: `msg_${Date.now()}`,
        messageId: returnedId,
        title: embedState.value.title || '(Fara Titlu)',
        channel: embedState.value.channelPreset,
        time: new Date().toLocaleTimeString('ro-RO'),
        color: embedState.value.color,
      });
      embedState.value.messageId = returnedId;
    }
    embedDispatchStatus.value = {
      type: 'success',
      message: data.message || 'Embed transmis cu succes pe Discord!',
      messageId: returnedId,
      time: new Date().toLocaleTimeString('ro-RO'),
    };
  } catch (err: any) {
    embedDispatchStatus.value = {
      type: 'error',
      message: err.message || 'A aparut o eroare la trimiterea embed-ului.',
    };
  } finally {
    isSendingEmbed.value = false;
  }
}

function handleCopyJson() {
  const payload = {
    content: embedState.value.content || undefined,
    embeds: [
      {
        title: embedState.value.title,
        url: embedState.value.titleUrl || undefined,
        description: embedState.value.description,
        color: parseInt(embedState.value.color.replace('#', ''), 16) || 0xff6b00,
        author: embedState.value.authorName
          ? {
              name: embedState.value.authorName,
              icon_url: embedState.value.authorIcon || undefined,
              url: embedState.value.authorUrl || undefined,
            }
          : undefined,
        fields: embedState.value.fields,
        thumbnail: embedState.value.thumbnailUrl ? { url: embedState.value.thumbnailUrl } : undefined,
        image: embedState.value.imageUrl ? { url: embedState.value.imageUrl } : undefined,
        footer: embedState.value.footerText
          ? {
              text: embedState.value.footerText,
              icon_url: embedState.value.footerIcon || undefined,
            }
          : undefined,
        timestamp: embedState.value.includeTimestamp ? new Date().toISOString() : undefined,
      },
    ],
  };
  navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
  copiedPayload.value = true;
  setTimeout(() => {
    copiedPayload.value = false;
  }, 2000);
}

function handleCopyMessageId(id: string) {
  navigator.clipboard.writeText(id);
  copiedId.value = id;
  setTimeout(() => {
    copiedId.value = null;
  }, 2000);
}

function handleLoadHistoryMessage(item: SentMessageHistory) {
  embedState.value.mode = 'edit';
  embedState.value.messageId = item.messageId;
  embedState.value.channelPreset = item.channel;
  embedDispatchStatus.value = {
    type: 'success',
    message: `Mesajul (${item.messageId}) este pregatit pentru editare in-place pe ${item.channel}.`,
  };
}

async function trigger(wh: WebhookDef) {
  results.value[wh.id] = { id: wh.id, name: wh.name, status: 'pending' };
  const start = Date.now();
  try {
    const res = await fetch(wh.endpoint, { method: wh.method });
    const data = await res.json().catch(() => ({}));
    const duration = Date.now() - start;
    const triggeredAt = new Date().toISOString();
    if (res.ok) {
      results.value[wh.id] = {
        id: wh.id,
        name: wh.name,
        status: 'success',
        message: data.message || 'Webhook trimis cu succes.',
        triggeredAt,
        duration,
      };
      history.value.unshift({
        id: wh.id,
        name: wh.name,
        status: 'success',
        time: triggeredAt,
        duration,
      });
      if (history.value.length > 20) history.value = history.value.slice(0, 20);
    } else {
      throw new Error(data.error || `HTTP ${res.status}`);
    }
  } catch (err: any) {
    const duration = Date.now() - start;
    const triggeredAt = new Date().toISOString();
    results.value[wh.id] = {
      id: wh.id,
      name: wh.name,
      status: 'error',
      message: err.message || 'A aparut o eroare.',
      triggeredAt,
      duration,
    };
    history.value.unshift({
      id: wh.id,
      name: wh.name,
      status: 'error',
      time: triggeredAt,
      duration,
    });
    if (history.value.length > 20) history.value = history.value.slice(0, 20);
  }
}

async function triggerAll() {
  for (const wh of WEBHOOKS) {
    await trigger(wh);
    await new Promise((r) => setTimeout(r, 500));
  }
}

function handleImageError(e: Event) {
  const target = e.currentTarget as HTMLElement | null;
  if (target) {
    target.style.display = 'none';
  }
}

function handleAvatarError(e: Event) {
  const target = e.currentTarget as HTMLImageElement | null;
  if (target) {
    target.src = 'https://github.com/iannC69.png';
  }
}
</script>

<template>
  <div class="whk-page">
    <!-- HERO HEADER -->
    <div class="whk-hero">
      <div class="whk-hero-left">
        <div class="whk-hero-tag">
          <Icon icon="lucide:radio" width="11" height="11" />
          <span>Discord Integration Hub</span>
        </div>
        <h1 class="whk-hero-title">Discord Webhooks &amp; Embed Studio</h1>
        <p class="whk-hero-sub">
          Creaza si <strong>editeaza live mesaje</strong> pe
          <span class="whk-channel">#procedura</span>,
          <span class="whk-channel">#anunturi</span>, sau ruleaza rapoarte de telemetrie pe
          <span class="whk-channel">#logs</span>.
        </p>
      </div>
      <div class="whk-tabs-container">
        <button
          type="button"
          @click="activeTab = 'embed_studio'"
          :class="['whk-tab-btn', activeTab === 'embed_studio' ? 'whk-tab-btn--active' : '']"
        >
          <Icon icon="lucide:sparkles" width="14" height="14" />
          <span>Discord Embed Studio</span>
        </button>
        <button
          type="button"
          @click="activeTab = 'system_reports'"
          :class="['whk-tab-btn', activeTab === 'system_reports' ? 'whk-tab-btn--active' : '']"
        >
          <Icon icon="lucide:bar-chart-3" width="14" height="14" />
          <span>Rapoarte &amp; Telemetrie</span>
        </button>
      </div>
    </div>

    <!-- TAB 1: EMBED STUDIO -->
    <div v-if="activeTab === 'embed_studio'" class="whk-studio-wrapper">
      <div class="whk-presets-bar">
        <div class="whk-presets-label">
          <Icon icon="lucide:layers" width="13" height="13" />
          <span>Preset-uri Rapide</span>
        </div>
        <div class="whk-presets-list">
          <button
            v-for="p in PRESETS"
            :key="p.id"
            type="button"
            @click="handleLoadPreset(p.id)"
            class="whk-preset-pill-btn"
            :title="p.description"
            :style="{ '--preset-color': p.color }"
          >
            <span class="whk-preset-dot" :style="{ background: p.color }" />
            <span>{{ p.name }}</span>
          </button>
          <button
            type="button"
            @click="resetForm"
            class="whk-preset-pill-btn whk-preset-pill-btn--reset"
            title="Curata toate campurile"
          >
            <Icon icon="lucide:rotate-ccw" width="11" height="11" />
            <span>Reset Form</span>
          </button>
        </div>
      </div>

      <div class="whk-studio-grid">
        <div class="whk-editor-col">
          <!-- Card 1: Mode & Channel -->
          <div class="whk-editor-card">
            <div class="whk-editor-card-header">
              <div class="whk-card-header-left">
                <Icon icon="lucide:globe" width="14" height="14" class="whk-section-icon" />
                <span class="whk-editor-card-title">Mod Livrare &amp; Canal Destinatie</span>
              </div>
            </div>
            <div class="whk-mode-selector">
              <button
                type="button"
                @click="embedState.mode = 'create'"
                :class="['whk-mode-btn', embedState.mode === 'create' ? 'whk-mode-btn--active' : '']"
              >
                <Icon icon="lucide:send" width="14" height="14" />
                <div class="whk-mode-btn-text">
                  <span class="whk-mode-btn-title">Mesaj Nou</span>
                  <span class="whk-mode-btn-sub">POST webhook</span>
                </div>
              </button>
              <button
                type="button"
                @click="embedState.mode = 'edit'"
                :class="['whk-mode-btn', embedState.mode === 'edit' ? 'whk-mode-btn--active-edit' : '']"
              >
                <Icon icon="lucide:edit-3" width="14" height="14" />
                <div class="whk-mode-btn-text">
                  <span class="whk-mode-btn-title">Editare In-Place</span>
                  <span class="whk-mode-btn-sub">PATCH Discord</span>
                </div>
              </button>
            </div>

            <div v-if="embedState.mode === 'edit'" class="whk-edit-id-box">
              <label class="whk-label">
                <span>Discord Message ID de actualizat</span>
                <span class="whk-label-hint">Click dreapta pe mesaj &rarr; Copy Message ID</span>
              </label>
              <div class="whk-input-with-action">
                <input
                  type="text"
                  v-model="embedState.messageId"
                  placeholder="ex: 1540796861432995850"
                  class="whk-input whk-input--message-id"
                />
                <button
                  v-if="embedState.messageId"
                  type="button"
                  @click="handleCopyMessageId(embedState.messageId)"
                  class="whk-mini-btn"
                  title="Copiaza ID"
                >
                  <Icon v-if="copiedId === embedState.messageId" icon="lucide:check" width="12" height="12" />
                  <Icon v-else icon="lucide:copy" width="12" height="12" />
                </button>
              </div>
            </div>

            <div class="whk-form-group">
              <label class="whk-label">Canal Tinta (Webhook Preset)</label>
              <div class="whk-dropdown-root" ref="dropdownRootRef">
                <button
                  type="button"
                  :class="['whk-dropdown-trigger', channelDropdownOpen ? 'whk-dropdown-trigger--open' : '']"
                  @click="channelDropdownOpen = !channelDropdownOpen"
                  :style="{ '--dd-color': selectedChannel.color }"
                >
                  <span class="whk-dropdown-trigger-icon" :style="{ color: selectedChannel.color }">
                    <Icon :icon="CHANNEL_ICON_MAP[selectedChannel.value] || 'lucide:hash'" width="15" height="15" />
                  </span>
                  <span class="whk-dropdown-trigger-label">
                    <span class="whk-dropdown-channel-name">{{ selectedChannel.label }}</span>
                    <span class="whk-dropdown-channel-desc">{{ selectedChannel.desc }}</span>
                  </span>
                  <Icon
                    icon="lucide:chevron-down"
                    width="14"
                    height="14"
                    :class="['whk-dropdown-chevron', channelDropdownOpen ? 'whk-dropdown-chevron--open' : '']"
                  />
                </button>
                <div v-if="channelDropdownOpen" class="whk-dropdown-popover">
                  <div class="whk-dropdown-popover-inner">
                    <button
                      v-for="opt in CHANNEL_OPTIONS"
                      :key="opt.value"
                      type="button"
                      :class="['whk-dropdown-option', opt.value === embedState.channelPreset ? 'whk-dropdown-option--active' : '']"
                      @click="selectChannel(opt.value)"
                      :style="{ '--dd-color': opt.color }"
                    >
                      <span
                        class="whk-dropdown-option-icon"
                        :style="{
                          color: opt.color,
                          background: `${opt.color}18`,
                          border: `1px solid ${opt.color}30`,
                        }"
                      >
                        <Icon :icon="CHANNEL_ICON_MAP[opt.value] || 'lucide:hash'" width="15" height="15" />
                      </span>
                      <span class="whk-dropdown-option-text">
                        <span class="whk-dropdown-option-name">{{ opt.label }}</span>
                        <span class="whk-dropdown-option-desc">{{ opt.desc }}</span>
                      </span>
                      <Icon
                        v-if="opt.value === embedState.channelPreset"
                        icon="lucide:check"
                        width="13"
                        height="13"
                        class="whk-dropdown-check"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="embedState.channelPreset === 'custom'" class="whk-form-group">
              <label class="whk-label">Custom Webhook URL Discord</label>
              <input
                type="text"
                v-model="embedState.customWebhookUrl"
                placeholder="https://discord.com/api/webhooks/..."
                class="whk-input"
              />
            </div>

            <div class="whk-form-group">
              <label class="whk-label">
                <span>Mentiuni Top Mesaj</span>
                <span class="whk-label-hint">Optional — ex: @everyone, @here</span>
              </label>
              <input
                type="text"
                v-model="embedState.content"
                placeholder="ex: @everyone sau text deasupra embed-ului"
                class="whk-input"
              />
            </div>
          </div>

          <!-- Card 2: Author -->
          <div class="whk-editor-card">
            <div class="whk-editor-card-header">
              <div class="whk-card-header-left">
                <Icon icon="lucide:user" width="14" height="14" class="whk-section-icon" />
                <span class="whk-editor-card-title">Autor Embed</span>
              </div>
            </div>
            <div class="whk-grid-2">
              <div class="whk-form-group">
                <label class="whk-label">Nume Autor</label>
                <input
                  type="text"
                  v-model="embedState.authorName"
                  placeholder="ex: WildFire Docs Core"
                  class="whk-input"
                />
              </div>
              <div class="whk-form-group">
                <label class="whk-label">Link Autor (URL)</label>
                <input
                  type="text"
                  v-model="embedState.authorUrl"
                  placeholder="https://docs.wildfire.ro"
                  class="whk-input"
                />
              </div>
            </div>
            <div class="whk-form-group">
              <label class="whk-label">Icon URL Autor</label>
              <div class="whk-input-icon-preview">
                <img
                  v-if="embedState.authorIcon"
                  :src="embedState.authorIcon"
                  alt=""
                  class="whk-input-avatar-preview"
                  @error="handleImageError"
                />
                <input
                  type="text"
                  v-model="embedState.authorIcon"
                  placeholder="https://.../avatar.png"
                  class="whk-input"
                />
              </div>
            </div>
          </div>

          <!-- Card 3: Title, Desc, Color -->
          <div class="whk-editor-card">
            <div class="whk-editor-card-header">
              <div class="whk-card-header-left">
                <Icon icon="lucide:file-text" width="14" height="14" class="whk-section-icon" />
                <span class="whk-editor-card-title">Titlu, Continut &amp; Culoare Accent</span>
              </div>
            </div>
            <div class="whk-grid-2">
              <div class="whk-form-group">
                <label class="whk-label">Titlu Embed</label>
                <input
                  type="text"
                  v-model="embedState.title"
                  placeholder="ex: [PROCEDURA] Roluri & Standarde"
                  class="whk-input"
                />
              </div>
              <div class="whk-form-group">
                <label class="whk-label">Link Titlu (URL)</label>
                <input
                  type="text"
                  v-model="embedState.titleUrl"
                  placeholder="https://docs.wildfire.ro/..."
                  class="whk-input"
                />
              </div>
            </div>
            <div class="whk-form-group">
              <label class="whk-label">
                <span>Culoare Dunga Stanga (Accent HEX)</span>
                <span class="whk-label-hint" :style="{ color: embedState.color }">{{ embedState.color }}</span>
              </label>
              <div class="whk-color-palette">
                <button
                  v-for="c in PRESET_COLORS"
                  :key="c.hex"
                  type="button"
                  @click="embedState.color = c.hex"
                  :class="['whk-color-swatch', embedState.color.toLowerCase() === c.hex.toLowerCase() ? 'whk-color-swatch--active' : '']"
                  :style="{ backgroundColor: c.hex }"
                  :title="c.label"
                />
                <div class="whk-custom-color-wrap">
                  <input
                    type="color"
                    v-model="embedState.color"
                    class="whk-color-picker-input"
                  />
                  <input
                    type="text"
                    v-model="embedState.color"
                    class="whk-input whk-input--hex"
                    placeholder="#ff6b00"
                    maxlength="7"
                  />
                </div>
              </div>
            </div>
            <div class="whk-form-group">
              <div class="whk-desc-header">
                <label class="whk-label">Descriere Principala (Markdown Discord)</label>
                <span :class="['whk-char-counter', embedState.description.length > 3500 ? 'whk-char-counter--warn' : '']">
                  {{ embedState.description.length }} / 4096
                </span>
              </div>
              <textarea
                v-model="embedState.description"
                rows="6"
                placeholder="Scrie corpul mesajului cu suport Markdown: **bold**, *italic*, `code`, > quote, liste..."
                class="whk-textarea whk-textarea--monospace"
              />
            </div>
          </div>

          <!-- Card 4: Fields -->
          <div class="whk-editor-card">
            <div class="whk-editor-card-header">
              <div class="whk-card-header-left">
                <Icon icon="lucide:layers" width="14" height="14" class="whk-section-icon" />
                <span class="whk-editor-card-title">Campuri Structurate (Fields)</span>
                <span class="whk-count-badge">{{ embedState.fields.length }} / 25</span>
              </div>
              <button
                type="button"
                @click="handleAddField"
                :disabled="embedState.fields.length >= 25"
                class="whk-btn-add-field"
              >
                <Icon icon="lucide:plus" width="13" height="13" />
                <span>Adauga Camp</span>
              </button>
            </div>

            <div v-if="embedState.fields.length === 0" class="whk-fields-empty">
              <Icon icon="lucide:layers" width="20" height="20" />
              <p>Niciun camp adaugat inca.</p>
              <span>Apasa &quot;Adauga Camp&quot; pentru a structura informatia pe coloane sau sectiuni.</span>
            </div>

            <div v-else class="whk-fields-list">
              <div v-for="(f, idx) in embedState.fields" :key="idx" class="whk-field-item">
                <div class="whk-field-item-top">
                  <div class="whk-field-index">#{{ idx + 1 }}</div>
                  <input
                    type="text"
                    v-model="f.name"
                    placeholder="Titlu Camp (ex: Rol, Reguli, Link)"
                    class="whk-input whk-input--field-name"
                  />
                  <label class="whk-inline-checkbox-label" title="Afiseaza campul pe aceeasi linie cu altele">
                    <input type="checkbox" v-model="f.inline" />
                    <span>Inline</span>
                  </label>
                  <button
                    type="button"
                    @click="handleRemoveField(idx)"
                    class="whk-btn-remove-field"
                    title="Sterge campul"
                  >
                    <Icon icon="lucide:trash-2" width="13" height="13" />
                  </button>
                </div>
                <textarea
                  v-model="f.value"
                  rows="2"
                  placeholder="Continutul campului (suporta markdown)..."
                  class="whk-textarea whk-textarea--field-val"
                />
              </div>
            </div>
          </div>

          <!-- Card 5: Media & Footer -->
          <div class="whk-editor-card">
            <div class="whk-editor-card-header">
              <div class="whk-card-header-left">
                <Icon icon="lucide:image" width="14" height="14" class="whk-section-icon" />
                <span class="whk-editor-card-title">Media, Imagini &amp; Footer</span>
              </div>
            </div>
            <div class="whk-grid-2">
              <div class="whk-form-group">
                <label class="whk-label">Thumbnail URL (Colt Dreapta-Sus)</label>
                <input
                  type="text"
                  v-model="embedState.thumbnailUrl"
                  placeholder="https://.../thumb.png"
                  class="whk-input"
                />
              </div>
              <div class="whk-form-group">
                <label class="whk-label">Hero / Banner Image URL (Jos)</label>
                <input
                  type="text"
                  v-model="embedState.imageUrl"
                  placeholder="https://.../banner.png"
                  class="whk-input"
                />
              </div>
            </div>
            <div class="whk-grid-2">
              <div class="whk-form-group">
                <label class="whk-label">Text Footer</label>
                <input
                  type="text"
                  v-model="embedState.footerText"
                  placeholder="ex: WildFire Documentation Engine"
                  class="whk-input"
                />
              </div>
              <div class="whk-form-group">
                <label class="whk-label">Icon URL Footer</label>
                <input
                  type="text"
                  v-model="embedState.footerIcon"
                  placeholder="https://.../small-icon.png"
                  class="whk-input"
                />
              </div>
            </div>
            <div class="whk-form-group">
              <label class="whk-checkbox-toggle">
                <input type="checkbox" v-model="embedState.includeTimestamp" />
                <span>Include Timestamp Live (Ora transmiterii)</span>
              </label>
            </div>
          </div>

          <!-- Action Bar -->
          <div class="whk-editor-action-bar">
            <button
              type="button"
              @click="handleSendEmbed"
              :disabled="isSendingEmbed || (embedState.mode === 'edit' && !embedState.messageId.trim())"
              :class="['whk-btn-dispatch', embedState.mode === 'edit' ? 'whk-btn-dispatch--edit' : '']"
            >
              <template v-if="isSendingEmbed">
                <Icon icon="lucide:loader-2" width="16" height="16" class="whk-spin" />
                <span>{{ embedState.mode === 'edit' ? 'Se actualizeaza pe Discord...' : 'Se transmite pe Discord...' }}</span>
              </template>
              <template v-else-if="embedState.mode === 'edit'">
                <Icon icon="lucide:edit-3" width="16" height="16" />
                <span>Actualizeaza Mesajul Existent (In-Place)</span>
              </template>
              <template v-else>
                <Icon icon="lucide:send" width="16" height="16" />
                <span>Trimite Mesaj Nou pe Discord ({{ embedState.channelPreset }})</span>
              </template>
            </button>
            <button type="button" @click="handleCopyJson" class="whk-btn-secondary">
              <Icon v-if="copiedPayload" icon="lucide:check" width="14" height="14" style="color: #10b981;" />
              <Icon v-else icon="lucide:copy" width="14" height="14" />
              <span>{{ copiedPayload ? 'Copiat in Clipboard!' : 'Copiaza JSON' }}</span>
            </button>
            <button type="button" @click="showJsonRaw = !showJsonRaw" class="whk-btn-secondary">
              <Icon icon="lucide:code" width="14" height="14" />
              <span>{{ showJsonRaw ? 'Ascunde JSON' : 'Vezi JSON' }}</span>
            </button>
          </div>

          <!-- Dispatch Alert -->
          <div
            v-if="embedDispatchStatus.type"
            :class="['whk-dispatch-alert', embedDispatchStatus.type === 'success' ? 'whk-dispatch-alert--success' : 'whk-dispatch-alert--error']"
          >
            <Icon v-if="embedDispatchStatus.type === 'success'" icon="lucide:check-circle-2" width="16" height="16" />
            <Icon v-else icon="lucide:alert-circle" width="16" height="16" />
            <div class="whk-dispatch-alert-content">
              <span>{{ embedDispatchStatus.message }}</span>
              <div v-if="embedDispatchStatus.messageId" class="whk-alert-id-row">
                <span>Message ID: <code>{{ embedDispatchStatus.messageId }}</code></span>
                <button
                  type="button"
                  @click="handleCopyMessageId(embedDispatchStatus.messageId!)"
                  class="whk-id-copy-tag"
                >
                  {{ copiedId === embedDispatchStatus.messageId ? 'Copiat!' : 'Copiaza ID' }}
                </button>
              </div>
              <small v-if="embedDispatchStatus.time">Confirmat la {{ embedDispatchStatus.time }}</small>
            </div>
            <button
              type="button"
              class="whk-alert-close"
              @click="embedDispatchStatus = { type: null, message: '' }"
            >
              <Icon icon="lucide:x" width="13" height="13" />
            </button>
          </div>

          <!-- Sent History -->
          <div v-if="sentHistory.length > 0" class="whk-sent-history-card">
            <div class="whk-sent-history-header">
              <div class="whk-sent-history-title-row">
                <Icon icon="lucide:history" width="13" height="13" class="whk-section-icon" />
                <span>Istoric Mesaje Trimise</span>
                <span class="whk-history-count">{{ sentHistory.length }} mesaje</span>
              </div>
              <button
                type="button"
                class="whk-mini-btn"
                title="Curata istoricul"
                @click="clearSentHistory"
              >
                <Icon icon="lucide:trash-2" width="11" height="11" />
              </button>
            </div>
            <div class="whk-sent-history-list">
              <div v-for="item in sentHistory" :key="item.id" class="whk-sent-history-item">
                <div class="whk-sent-item-dot" :style="{ backgroundColor: item.color || '#ff6b00' }" />
                <div class="whk-sent-item-info">
                  <span class="whk-sent-item-title">{{ item.title }}</span>
                  <span class="whk-sent-item-meta">{{ item.channel }} · ID: <code>{{ item.messageId }}</code> · {{ item.time }}</span>
                </div>
                <button
                  type="button"
                  @click="handleLoadHistoryMessage(item)"
                  class="whk-btn-edit-target"
                  title="Incarca acest ID pentru editare in-place"
                >
                  <Icon icon="lucide:edit-3" width="11" height="11" />
                  <span>Editeaza</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Raw JSON View -->
          <div v-if="showJsonRaw" class="whk-json-view">
            <pre>{{
              JSON.stringify(
                {
                  mode: embedState.mode,
                  messageId: embedState.messageId || undefined,
                  content: embedState.content || undefined,
                  embeds: [
                    {
                      title: embedState.title,
                      description: embedState.description,
                      color: embedState.color,
                      fields: embedState.fields,
                    },
                  ],
                },
                null,
                2
              )
            }}</pre>
          </div>
        </div>

        <!-- RIGHT: Live Discord Preview Simulator -->
        <div class="whk-preview-col">
          <div class="whk-discord-container">
            <div class="whk-discord-header">
              <div class="whk-discord-channel-info">
                <Icon icon="lucide:hash" width="16" height="16" class="whk-discord-hash" />
                <span class="whk-discord-channel-name">{{ embedState.channelPreset.replace('#', '') || 'procedura' }}</span>
                <span class="whk-discord-tag-pill">{{ embedState.mode === 'edit' ? 'EDITARE IN-PLACE (PATCH)' : 'DISCORD LIVE SIMULATOR' }}</span>
              </div>
              <div class="whk-discord-actions">
                <span class="whk-discord-badge">1:1 Client Parity</span>
              </div>
            </div>
            <div class="whk-discord-body">
              <div class="whk-discord-msg-row">
                <img
                  :src="embedState.authorIcon || 'https://github.com/iannC69.png'"
                  alt="Bot Avatar"
                  class="whk-discord-avatar"
                  @error="handleAvatarError"
                />
                <div class="whk-discord-msg-content">
                  <div class="whk-discord-author-line">
                    <span class="whk-discord-bot-name">WildFire Docs Engine</span>
                    <span class="whk-discord-bot-tag">BOT</span>
                    <span class="whk-discord-timestamp">Astazi la {{ currentSimulatedTime }}</span>
                    <span v-if="embedState.mode === 'edit'" class="whk-discord-edited-tag">(editat)</span>
                  </div>
                  <div v-if="embedState.content" class="whk-discord-top-content">
                    <span class="whk-discord-mention">{{ embedState.content }}</span>
                  </div>
                  <div class="whk-discord-embed" :style="{ borderLeftColor: embedState.color || '#ff6b00' }">
                    <div class="whk-discord-embed-inner">
                      <div class="whk-discord-embed-main">
                        <div v-if="embedState.authorName" class="whk-discord-embed-author">
                          <img
                            v-if="embedState.authorIcon"
                            :src="embedState.authorIcon"
                            alt=""
                            class="whk-discord-embed-author-icon"
                            @error="handleImageError"
                          />
                          <a
                            v-if="embedState.authorUrl"
                            :href="embedState.authorUrl"
                            target="_blank"
                            rel="noreferrer"
                            class="whk-discord-embed-author-link"
                          >{{ embedState.authorName }}</a>
                          <span v-else class="whk-discord-embed-author-name">{{ embedState.authorName }}</span>
                        </div>
                        <div v-if="embedState.title" class="whk-discord-embed-title">
                          <a
                            v-if="embedState.titleUrl"
                            :href="embedState.titleUrl"
                            target="_blank"
                            rel="noreferrer"
                            class="whk-discord-embed-title-link"
                          >{{ embedState.title }}</a>
                          <span v-else>{{ embedState.title }}</span>
                        </div>
                        <div
                          v-if="embedState.description"
                          class="whk-discord-embed-desc"
                          v-html="renderDiscordMarkdown(embedState.description)"
                        />
                        <div v-if="embedState.fields && embedState.fields.length > 0" class="whk-discord-fields-grid">
                          <div
                            v-for="(field, i) in embedState.fields"
                            :key="i"
                            :class="['whk-discord-field', field.inline ? 'whk-discord-field--inline' : 'whk-discord-field--full']"
                          >
                            <div class="whk-discord-field-name">{{ field.name }}</div>
                            <div class="whk-discord-field-value" v-html="renderDiscordMarkdown(field.value)" />
                          </div>
                        </div>
                        <div v-if="embedState.imageUrl" class="whk-discord-embed-image-wrap">
                          <img
                            :src="embedState.imageUrl"
                            alt=""
                            class="whk-discord-embed-image"
                            @error="handleImageError"
                          />
                        </div>
                        <div v-if="embedState.footerText || embedState.includeTimestamp" class="whk-discord-embed-footer">
                          <img
                            v-if="embedState.footerIcon"
                            :src="embedState.footerIcon"
                            alt=""
                            class="whk-discord-embed-footer-icon"
                            @error="handleImageError"
                          />
                          <span>{{ embedState.footerText }}</span>
                          <span v-if="embedState.footerText && embedState.includeTimestamp"> • </span>
                          <span v-if="embedState.includeTimestamp">Astazi la {{ currentSimulatedTime }}</span>
                        </div>
                      </div>
                      <div v-if="embedState.thumbnailUrl" class="whk-discord-embed-thumb-wrap">
                        <img
                          :src="embedState.thumbnailUrl"
                          alt=""
                          class="whk-discord-embed-thumb"
                          @error="handleImageError"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: SYSTEM REPORTS -->
    <div v-if="activeTab === 'system_reports'" class="whk-reports-wrapper">
      <div class="whk-reports-top-bar">
        <p class="whk-reports-info-text">
          Transmisii automate si manuale de telemetrie de sistem catre canalul <span class="whk-channel">#logs</span>.
        </p>
        <button type="button" @click="triggerAll" class="whk-btn whk-btn--fire-all">
          <Icon icon="lucide:zap" width="15" height="15" />
          <span>Fire All Webhooks</span>
        </button>
      </div>
      <div class="whk-main">
        <div class="whk-cards-col">
          <div v-for="cat in categories" :key="cat" class="whk-category-section">
            <div class="whk-category-label">
              <span>{{ CATEGORY_LABELS[cat] }}</span>
            </div>
            <div class="whk-cards">
              <div
                v-for="wh in WEBHOOKS.filter((w) => w.category === cat)"
                :key="wh.id"
                :class="[
                  'whk-card',
                  results[wh.id]?.status === 'success' ? 'whk-card--success' : results[wh.id]?.status === 'error' ? 'whk-card--error' : '',
                ]"
                :style="{ '--wh-color': wh.color }"
              >
                <div class="whk-card-accent" />
                <div class="whk-card-body">
                  <div class="whk-card-header">
                    <div
                      class="whk-card-icon-wrap"
                      :style="{
                        color: wh.color,
                        background: `${wh.color}18`,
                        borderColor: `${wh.color}30`,
                      }"
                    >
                      <Icon :icon="wh.icon" width="18" height="18" />
                    </div>
                    <div class="whk-card-titles">
                      <h3 class="whk-card-name">{{ wh.name }}</h3>
                      <div class="whk-card-meta">
                        <span :class="['adx-pill', wh.badgeColor]">{{ wh.method }}</span>
                        <span class="whk-channel-pill">
                          <Icon icon="lucide:hash" width="9" height="9" />
                          <span>{{ wh.channel.replace('#', '') }}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <p class="whk-card-desc">{{ wh.description }}</p>
                  <div class="whk-card-endpoint">
                    <span class="whk-endpoint-path">{{ wh.endpoint }}</span>
                  </div>
                  <div
                    v-if="results[wh.id] && results[wh.id].status !== 'idle'"
                    :class="[
                      'whk-result',
                      results[wh.id].status === 'success' ? 'whk-result--success' : results[wh.id].status === 'error' ? 'whk-result--error' : 'whk-result--pending',
                    ]"
                  >
                    <template v-if="results[wh.id].status === 'pending'">
                      <Icon icon="lucide:loader-2" width="13" height="13" class="whk-spin" />
                      <span>Se trimite pe Discord...</span>
                    </template>
                    <template v-else-if="results[wh.id].status === 'success'">
                      <Icon icon="lucide:check-circle-2" width="13" height="13" />
                      <span>{{ results[wh.id].message }}</span>
                      <span class="whk-result-time">{{ formatTime(results[wh.id].triggeredAt) }} · {{ formatDuration(results[wh.id].duration) }}</span>
                    </template>
                    <template v-else>
                      <Icon icon="lucide:alert-circle" width="13" height="13" />
                      <span>{{ results[wh.id].message }}</span>
                    </template>
                  </div>
                  <div class="whk-card-footer">
                    <div class="whk-card-footer-info">
                      <span v-if="results[wh.id]?.triggeredAt && results[wh.id]?.status !== 'pending'" class="whk-last-trigger">
                        <Icon icon="lucide:clock" width="10" height="10" />
                        <span>Ultimul trigger: {{ formatTime(results[wh.id].triggeredAt) }}</span>
                      </span>
                    </div>
                    <button
                      type="button"
                      @click="trigger(wh)"
                      :disabled="results[wh.id]?.status === 'pending'"
                      class="whk-btn whk-btn--trigger"
                      :style="{ '--wh-color': wh.color }"
                    >
                      <template v-if="results[wh.id]?.status === 'pending'">
                        <Icon icon="lucide:loader-2" width="13" height="13" class="whk-spin" />
                        <span>Trimitere...</span>
                      </template>
                      <template v-else>
                        <Icon icon="lucide:send" width="13" height="13" />
                        <span>Trimite</span>
                      </template>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="whk-sidebar">
          <div class="whk-info-card">
            <div class="whk-info-header">
              <Icon icon="lucide:globe" width="14" height="14" class="whk-info-icon" />
              <span class="whk-info-title">Configurare Discord</span>
            </div>
            <div class="whk-info-rows">
              <div class="whk-info-row">
                <span class="whk-info-key">Channel</span>
                <span class="whk-info-val whk-channel">#logs</span>
              </div>
              <div class="whk-info-row">
                <span class="whk-info-key">Auto Daily</span>
                <span class="whk-info-val" style="color: #10b981;">00:00 / zi</span>
              </div>
              <div class="whk-info-row">
                <span class="whk-info-key">Format</span>
                <span class="whk-info-val">Discord Embeds</span>
              </div>
              <div class="whk-info-row">
                <span class="whk-info-key">Webhook URL</span>
                <span class="whk-info-val" style="color: #10b981;">Configurat</span>
              </div>
            </div>
          </div>
          <div class="whk-history-card">
            <div class="whk-info-header">
              <Icon icon="lucide:clock" width="14" height="14" class="whk-info-icon" />
              <span class="whk-info-title">Istoric Triggere</span>
              <button
                v-if="history.length > 0"
                type="button"
                @click="history = []"
                class="whk-clear-btn"
              >
                <Icon icon="lucide:refresh-cw" width="10" height="10" />
                <span>Reset</span>
              </button>
            </div>
            <div v-if="history.length === 0" class="whk-history-empty">
              <Icon icon="lucide:bell" width="24" height="24" />
              <p>Niciun trigger in aceasta sesiune.</p>
              <span>Apasa &quot;Trimite&quot; pentru a declansa un webhook.</span>
            </div>
            <div v-else class="whk-history-list">
              <div v-for="(h, i) in history" :key="i" class="whk-history-row">
                <div :class="['whk-history-dot', h.status === 'success' ? 'whk-dot--green' : 'whk-dot--red']" />
                <div class="whk-history-info">
                  <span class="whk-history-name">{{ h.name }}</span>
                  <span class="whk-history-meta">{{ formatTime(h.time) }} · {{ formatDuration(h.duration) }}</span>
                </div>
                <span :class="['adx-pill', h.status === 'success' ? 'adx-pill--green' : 'adx-pill--red']">
                  {{ h.status === 'success' ? 'OK' : 'ERR' }}
                </span>
              </div>
            </div>
          </div>
          <div class="whk-guide-card">
            <div class="whk-info-header">
              <Icon icon="lucide:zap" width="14" height="14" class="whk-info-icon" />
              <span class="whk-info-title">Ghid Rapid</span>
            </div>
            <ul class="whk-guide-list">
              <li>
                <Icon icon="lucide:chevron-right" width="10" height="10" />
                <span>Apasa <strong>Trimite</strong> pe orice card pentru a declansa acel webhook imediat.</span>
              </li>
              <li>
                <Icon icon="lucide:chevron-right" width="10" height="10" />
                <span><strong>Fire All</strong> trimite toate webhook-urile in secventa, la 500ms interval.</span>
              </li>
              <li>
                <Icon icon="lucide:chevron-right" width="10" height="10" />
                <span>Raportul zilnic se trimite automat la <strong>00:00</strong> in fiecare noapte.</span>
              </li>
              <li>
                <Icon icon="lucide:chevron-right" width="10" height="10" />
                <span>Toate mesajele sunt livrate pe canalul Discord <span class="whk-channel">#logs</span>.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
