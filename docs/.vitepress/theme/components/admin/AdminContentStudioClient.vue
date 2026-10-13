<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted,
  nextTick,
} from 'vue';
import { useRouter } from 'vitepress';
import { Icon } from '@iconify/vue';
import { api } from '../../composables/useApi';
import AdminMarkdownPreview from './AdminMarkdownPreview.vue';
import { computeLineDiff } from '../../lib/admin/diff';
import { lintMarkdown, autoFixMarkdown, type LintResult } from '../../lib/admin/mdxLinter';
import StudioTableBuilderModal from './studio/StudioTableBuilderModal.vue';
import StudioCalloutBuilderModal, { type CalloutType } from './studio/StudioCalloutBuilderModal.vue';
import StudioCodeBuilderModal from './studio/StudioCodeBuilderModal.vue';
import StudioGalleryBuilderModal from './studio/StudioGalleryBuilderModal.vue';
import StudioFloatingLineToolbar from './studio/StudioFloatingLineToolbar.vue';
import AdminTrashModal from './studio/AdminTrashModal.vue';

const props = defineProps<{
  user?: any;
}>();

const router = useRouter();

// ── Types ──
interface DocItem {
  slug: string;
  relativePath?: string;
  category: string;
  title: string;
}

interface DocVersionItem {
  id: string;
  slug: string;
  timestamp: string;
  savedBy: string;
  content: string;
  charCount: number;
}

interface OpenTab {
  slug: string;
  title: string;
  category: string;
  content: string;
  originalContent: string;
  isDirty: boolean;
  cursorLine?: number;
  cursorCol?: number;
}

interface MediaAsset {
  filename: string;
  relativePath?: string;
  url: string;
  sizeFormatted?: string;
  extension?: string;
  type?: 'image' | 'video' | 'other';
}

interface CategoryDefinition {
  label: string;
  icon: string;
  color: string;
  description?: string;
  order?: number;
}

// ── Standard Categories ──
const DEFAULT_CATEGORIES: Record<string, CategoryDefinition> = {
  informatii: { label: 'Informații Generale', icon: 'lucide:book-open', color: '#3b82f6', description: 'Ghiduri, regulamente și informații esențiale de pornire', order: 1 },
  currency: { label: 'Economie & Resurse', icon: 'lucide:coins', color: '#f59e0b', description: 'Monede Phoenix Coins, credite, economie și inventar', order: 2 },
  systems: { label: 'Sisteme & Arhitectură', icon: 'lucide:cpu', color: '#8b5cf6', description: 'Sisteme integrate de joc, statistici și comenzi de server', order: 3 },
  market: { label: 'Servicii & Pachete', icon: 'lucide:shopping-bag', color: '#ec4899', description: 'Magazin in-game, upgrade-uri, pachete VIP și beneficii', order: 4 },
  general: { label: 'Documentație Generală', icon: 'lucide:folder', color: '#64748b', description: 'Documente generale și ghiduri diverse', order: 5 },
};

// ── Custom Categories from LocalStorage & Server API ──
const customCategories = ref<Record<string, CategoryDefinition>>({});

function loadCustomCategories() {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem('wf_custom_categories');
    if (raw) {
      customCategories.value = JSON.parse(raw);
    }
  } catch {}
}

function saveCustomCategories() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('wf_custom_categories', JSON.stringify(customCategories.value));
  } catch {}
}

async function fetchCategoriesList() {
  try {
    const data = await api('/api/admin/categories');
    if (data && data.categories) {
      customCategories.value = { ...customCategories.value, ...data.categories };
      saveCustomCategories();
    }
  } catch {}
}

// ── Merged Categories Map ──
const categoryMap = computed<Record<string, CategoryDefinition>>(() => {
  const merged: Record<string, CategoryDefinition> = { ...DEFAULT_CATEGORIES, ...customCategories.value };
  docs.value.forEach((d) => {
    const cat = d.category || 'general';
    if (!merged[cat]) {
      merged[cat] = {
        label: cat.charAt(0).toUpperCase() + cat.slice(1).replace(/[-_]/g, ' '),
        icon: 'lucide:folder',
        color: '#06b6d4',
      };
    }
  });
  return merged;
});

// ── Professional Documentation Templates ──
const TEMPLATES: Record<
  string,
  { label: string; desc: string; icon: string; content: (title: string, category: string) => string }
> = {
  guide: {
    label: 'Ghid Standard',
    desc: 'Prezentare, pași de configurare, comenzi și alerte esențiale',
    icon: 'lucide:book-open',
    content: (title, category) => `---
title: "${title}"
description: "Ghid detaliat pentru configurarea și utilizarea modulului ${title}."
category: "${category}"
date: "${new Date().toISOString().split('T')[0]}"
author: "Wildfire Docs"
tags: ["${category}", "ghid", "manual"]
draft: false
---

# ${title}

Descriere introductivă completă despre acest ghid și scopul principal al funcționalității.

> [!NOTE]
> Asigură-te că deții permisiunile necesare înainte de a continua cu instrucțiunile descrise mai jos.

## 1.0 Prezentare Generală

Explică aici modul de funcționare și arhitectura principală a acestui modul.

## 2.0 Pași de Configurare

<Steps>
  <Step title="Pasul 1: Verificarea inițială">
    Accesează panoul de control și verifică statusul modulului.
  </Step>
  <Step title="Pasul 2: Aplicarea parametrilor">
    Introdu setările recomandate în fișierul de configurare.
  </Step>
  <Step title="Pasul 3: Salvare și reîncărcare">
    Confirmă modificările și reîncarcă serviciul pentru aplicare.
  </Step>
</Steps>

## 3.0 Comenzi & Parametri

| Comandă | Descriere | Permisiune |
| :--- | :--- | :--- |
| \`!status\` | Verifică starea curentă a modulului | Public |
| \`!reload\` | Reîncarcă configurația din memorie | Administrator |
`,
  },
  technical: {
    label: 'Specificație Tehnică',
    desc: 'Arhitectură, cod de configurare, parametri și matrice de opțiuni',
    icon: 'lucide:cpu',
    content: (title, category) => `---
title: "${title}"
description: "Documentație tehnică și specificații de arhitectură pentru ${title}."
category: "${category}"
date: "${new Date().toISOString().split('T')[0]}"
author: "Wildfire Docs"
tags: ["${category}", "tehnic", "arhitectura"]
draft: false
---

# ${title}

Specificații tehnice de referință pentru dezvoltatori și administratori de sistem.

> [!IMPORTANT]
> Modificarea opțiunilor de sistem necesită drepturi de administrator și repornirea serviciului aferent.

## 1.0 Arhitectură & Dependințe

\`\`\`json
{
  "module": "${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}",
  "version": "1.0.0",
  "enabled": true,
  "options": {
    "syncIntervalSeconds": 60,
    "maxRetries": 3
  }
}
\`\`\`

## 2.0 Parametri Configurație

| Parametru | Tip | Valoare Implicită | Descriere |
| :--- | :--- | :--- | :--- |
| \`enabled\` | Boolean | \`true\` | Activează sau dezactivează modulul |
| \`timeout\` | Număr | \`5000\` | Limita de timp pentru cereri în milisecunde |
| \`logLevel\` | Text | \`"info"\` | Nivelul de detaliere al jurnalului de evenimente |
`,
  },
  steps: {
    label: 'Tutorial Pas-cu-Pas',
    desc: 'Procedură ghidată cu componente vizuale Steps și alerte contextuale',
    icon: 'lucide:list-ordered',
    content: (title, category) => `---
title: "${title}"
description: "Tutorial pas-cu-pas pentru implementarea cu succes a procedurii ${title}."
category: "${category}"
date: "${new Date().toISOString().split('T')[0]}"
author: "Wildfire Docs"
tags: ["${category}", "tutorial", "pasi"]
draft: false
---

# ${title}

Urmează pașii indicați mai jos pentru a finaliza procedura rapid și în siguranță.

<Steps>
  <Step title="Etapa 1: Pregătirea mediului">
    Asigură-te că toate serviciile dependente sunt pornite și funcționează optim.
  </Step>
  <Step title="Etapa 2: Execuția instrucțiunilor">
    Rulează comanda de sincronizare:
    \`\`\`bash
    wf-cli sync --module=${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
    \`\`\`
  </Step>
  <Step title="Etapa 3: Validarea rezultatului">
    Verifică jurnalul de activitate pentru a confirma că procesul s-a încheiat fără erori.
  </Step>
</Steps>

> [!TIP]
> Poți automatiza acest proces prin programarea unei sarcini de sistem recurente.
`,
  },
  cards: {
    label: 'Hub & Carduri',
    desc: 'Pagină de navigare și index de categorii cu componente interactive Cards',
    icon: 'lucide:layout-grid',
    content: (title, category) => `---
title: "${title}"
description: "Index central și ghid de navigare pentru secțiunea ${title}."
category: "${category}"
date: "${new Date().toISOString().split('T')[0]}"
author: "Wildfire Docs"
tags: ["${category}", "index", "prezentare"]
draft: false
---

# ${title}

Explorează documentele și ghidurile asociate acestei categorii.

<Cards>
  <Card title="Ghid Inițial" href="/${category}/ghid-rapid" icon="lucide:book-open" desc="Începe cu instrucțiunile esențiale și cerințele de bază." />
  <Card title="Specificații Sistem" href="/${category}/specificatii" icon="lucide:cpu" desc="Consultă parametrii tehnici și opțiunile de configurare avansată." />
  <Card title="Întrebări Frecvente" href="/${category}/faq" icon="lucide:help-circle" desc="Răspunsuri la cele mai comune întrebări și rezolvări de probleme." />
</Cards>

## Despre această secțiune

Această secțiune este actualizată continuu de către echipa de documentație.
`,
  },
  blank: {
    label: 'Document Minimal',
    desc: 'Document curat cu antet YAML Frontmatter de bază',
    icon: 'lucide:file',
    content: (title, category) => `---
title: "${title}"
description: "Documentație pentru ${title}."
category: "${category}"
date: "${new Date().toISOString().split('T')[0]}"
author: "Wildfire Docs"
tags: ["${category}"]
draft: false
---

# ${title}

Scrie aici conținutul documentului...
`,
  },
};

// ── State ──
const docs = ref<DocItem[]>([]);
const openTabs = ref<OpenTab[]>([]);
const activeTabSlug = ref<string>('');
const loading = ref(true);
const saving = ref(false);
const statusMessage = ref<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

// Activity Bar Selection ('explorer' | 'search' | 'snippets' | 'media' | 'git')
const activeActivity = ref<'explorer' | 'search' | 'snippets' | 'media' | 'git'>('explorer');

// Explorer & Sidebar
const searchQuery = ref('');
const collapsedCategories = ref<Record<string, boolean>>({});
const sidebarOpen = ref(true);

// Modals
const isCreatingNew = ref(false);
const isCreatingNewCategory = ref(false);
const showTrashModal = ref(false);

// New Doc Form
const newCategory = ref('informatii');
const newSlugName = ref('ghid-nou');
const newTitleName = ref('Ghid Nou');
const selectedTemplateKey = ref('guide');

// New Category Form
const newCatTitle = ref('');
const newCatSlug = ref('');
const newCatIcon = ref('lucide:folder');
const newCatColor = ref('#3b82f6');
const newCatCreateIndex = ref(true);

// Category Editing & Management State
const isEditingCategory = ref(false);
const editingCatKey = ref('');
const editCatTitle = ref('');
const editCatSlug = ref('');
const editCatIcon = ref('lucide:folder');
const editCatColor = ref('#3b82f6');
const editCatDesc = ref('');
const isManagingCategories = ref(false);

const editingCatDocsCount = computed(() => {
  if (!editingCatKey.value) return 0;
  return docs.value.filter((d) => (d.category || 'general') === editingCatKey.value).length;
});

const AVAILABLE_ICONS = [
  'lucide:book-open',
  'lucide:cpu',
  'lucide:shield',
  'lucide:terminal',
  'lucide:layers',
  'lucide:code-2',
  'lucide:database',
  'lucide:sparkles',
  'lucide:settings',
  'lucide:file-text',
  'lucide:help-circle',
  'lucide:archive',
  'lucide:coins',
  'lucide:shopping-bag',
  'lucide:layout-grid',
  'lucide:workflow',
  'lucide:folder',
  'lucide:flame',
  'lucide:award',
  'lucide:users',
  'lucide:zap',
  'lucide:compass',
  'lucide:bar-chart-2',
  'lucide:server',
  'lucide:key',
];

const AVAILABLE_COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#f97316',
  '#ef4444',
  '#6366f1',
  '#14b8a6',
  '#64748b',
];

// Editor View Mode
const viewMode = ref<'split' | 'edit' | 'preview' | 'diff'>('split');
const isFullscreen = ref(false);

// Diagnostics & Guardrails
const lintResult = ref<LintResult>({
  isValid: true,
  hasErrors: false,
  errorCount: 0,
  warningCount: 0,
  infoCount: 0,
  diagnostics: [],
  integrityScore: 100,
});
const bypassGuardrail = ref(false);
const bottomDockTab = ref<'problems' | 'diff' | 'assets' | 'console'>('problems');
const showBottomDock = ref(false);

// Cursor & Position
const cursorPos = ref<{ line: number; col: number; offset: number }>({ line: 1, col: 1, offset: 0 });

// Interactive Tool Builders
const showTableBuilder = ref(false);
const showCalloutBuilder = ref(false);
const calloutInitialType = ref<CalloutType>('NOTE');
const showCodeBuilder = ref(false);
const showGalleryBuilder = ref(false);

// Find & Replace
const showFindBar = ref(false);
const findText = ref('');
const replaceText = ref('');
const matchCase = ref(false);

// Upload & Media Modal
const isDraggingFile = ref(false);
const uploadingAsset = ref(false);
const mediaAssets = ref<MediaAsset[]>([]);
const showMediaModal = ref(false);
const mediaModalTab = ref<'upload' | 'vault' | 'embed'>('upload');
const mediaTargetFolder = ref('media');
const mediaAltTitle = ref('');
const mediaEmbedUrl = ref('');
const mediaVaultSearch = ref('');
const mediaVaultFilter = ref<'all' | 'image' | 'video' | 'gif'>('all');
const selectedMediaFile = ref<File | null>(null);
const mediaFilePreview = ref<string | null>(null);
const copiedAssetUrl = ref<string | null>(null);

// Versions
const versions = ref<DocVersionItem[]>([]);
const showVersionsMenu = ref(false);

// Refs
const editorRef = ref<HTMLTextAreaElement | null>(null);
const gutterRef = ref<HTMLDivElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const versionsMenuRef = ref<HTMLDivElement | null>(null);

// Computed Session & Root
const isRoot = computed(() => {
  const u = props.user?.username?.toLowerCase()?.trim();
  return Boolean(props.user?.isRoot || u === 'iannc' || u === 'iannc69');
});

// Active Tab Content Helper
const activeTab = computed(() => {
  return openTabs.value.find((t) => t.slug === activeTabSlug.value) || null;
});

const activeContent = computed(() => (activeTab.value ? activeTab.value.content : ''));
const activeOriginalContent = computed(() => (activeTab.value ? activeTab.value.originalContent : ''));

const lineCount = computed(() => {
  return activeContent.value ? activeContent.value.split('\n').length : 1;
});

const wordCount = computed(() => {
  return activeContent.value.trim() ? activeContent.value.trim().split(/\s+/).length : 0;
});

const charCount = computed(() => {
  return activeContent.value.length;
});

const findMatchCount = computed(() => {
  if (!findText.value || !activeContent.value) return 0;
  const flags = matchCase.value ? 'g' : 'gi';
  const escaped = findText.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matches = activeContent.value.match(new RegExp(escaped, flags));
  return matches ? matches.length : 0;
});

// Breadcrumbs computation
const currentBreadcrumb = computed(() => {
  if (!activeTab.value) return ['docs', 'Niciun fișier deschis'];
  const parts = activeTab.value.slug.split('/');
  const cat = parts.length > 1 ? parts[0] : 'general';
  const catLabel = categoryMap.value[cat]?.label || cat;
  const filename = `${parts[parts.length - 1]}.md`;
  return ['docs', catLabel, filename];
});

// Real-Time Linting
watch(
  () => [activeTab.value?.content, activeTab.value?.slug],
  () => {
    if (!activeTab.value) {
      lintResult.value = {
        isValid: true,
        hasErrors: false,
        errorCount: 0,
        warningCount: 0,
        infoCount: 0,
        diagnostics: [],
        integrityScore: 100,
      };
      return;
    }
    lintResult.value = lintMarkdown(activeTab.value.content);
  },
  { immediate: true }
);

// Grouped Docs
const groupedDocs = computed(() => {
  const groups: Record<string, DocItem[]> = {};
  Object.keys(categoryMap.value).forEach((cat) => (groups[cat] = []));

  docs.value.forEach((doc) => {
    const matchSearch =
      !searchQuery.value ||
      doc.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      doc.slug.toLowerCase().includes(searchQuery.value.toLowerCase());

    if (matchSearch) {
      const cat = doc.category || 'general';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(doc);
    }
  });

  return groups;
});

// Filtered Vault Assets
const filteredVaultAssets = computed(() => {
  return mediaAssets.value.filter((asset) => {
    const matchesSearch =
      !mediaVaultSearch.value ||
      asset.filename.toLowerCase().includes(mediaVaultSearch.value.toLowerCase()) ||
      asset.url.toLowerCase().includes(mediaVaultSearch.value.toLowerCase());
    if (!matchesSearch) return false;

    if (mediaVaultFilter.value === 'image') return asset.type === 'image' && !asset.filename.endsWith('.gif');
    if (mediaVaultFilter.value === 'video') return asset.type === 'video';
    if (mediaVaultFilter.value === 'gif') return asset.filename.endsWith('.gif');
    return true;
  });
});

// Update Active Content
function updateActiveContent(newContent: string) {
  if (!activeTabSlug.value) return;
  const currentScrollTop = editorRef.value?.scrollTop ?? 0;

  const tab = openTabs.value.find((t) => t.slug === activeTabSlug.value);
  if (tab) {
    tab.content = newContent;
    tab.isDirty = newContent !== tab.originalContent;
  }

  nextTick(() => {
    if (editorRef.value) {
      editorRef.value.scrollTop = currentScrollTop;
    }
    if (gutterRef.value) {
      gutterRef.value.scrollTop = currentScrollTop;
    }
  });
}

// Cursor & Scroll
function handleEditorScroll(e: UIEvent) {
  if (gutterRef.value) {
    gutterRef.value.scrollTop = (e.currentTarget as HTMLElement).scrollTop;
  }
}

function handleCursorActivity() {
  if (!editorRef.value) return;
  const el = editorRef.value;
  const val = el.value.substring(0, el.selectionStart);
  const lines = val.split('\n');
  const currentLine = lines.length;
  const currentCol = lines[lines.length - 1].length + 1;
  cursorPos.value = { line: currentLine, col: currentCol, offset: el.selectionStart };
}

function jumpToLine(targetLine: number) {
  if (!editorRef.value || !activeContent.value) return;
  const lines = activeContent.value.split('\n');
  let offset = 0;
  for (let i = 0; i < Math.min(targetLine - 1, lines.length); i++) {
    offset += lines[i].length + 1;
  }
  editorRef.value.focus();
  editorRef.value.setSelectionRange(offset, offset);
  handleCursorActivity();

  const lineHeight = 21;
  editorRef.value.scrollTop = Math.max(0, (targetLine - 4) * lineHeight);
}

// Keydown handler for editor: Tab indent support
function handleEditorKeydown(e: KeyboardEvent) {
  if (e.key === 'Tab') {
    e.preventDefault();
    const el = editorRef.value;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const val = el.value;
    const indent = '  ';
    el.value = val.substring(0, start) + indent + val.substring(end);
    el.selectionStart = el.selectionEnd = start + indent.length;
    updateActiveContent(el.value);
    handleCursorActivity();
  }
}

// Open Document
async function openDocument(slug: string) {
  const existing = openTabs.value.find((t) => t.slug === slug);
  if (existing) {
    activeTabSlug.value = slug;
    return;
  }

  try {
    loading.value = true;
    const data = await api(`/api/admin/doc?slug=${encodeURIComponent(slug)}`);

    const newTab: OpenTab = {
      slug: data.slug,
      title: data.title || slug,
      category: data.category || 'informatii',
      content: data.content || '',
      originalContent: data.content || '',
      isDirty: false,
      cursorLine: 1,
      cursorCol: 1,
    };

    openTabs.value.push(newTab);
    activeTabSlug.value = data.slug;
    loadVersions(data.slug);
  } catch (err: any) {
    statusMessage.value = { type: 'error', text: err.message };
  } finally {
    loading.value = false;
  }
}

// Close Tab
function closeTab(slugToClose: string, e?: MouseEvent) {
  if (e) e.stopPropagation();
  const tab = openTabs.value.find((t) => t.slug === slugToClose);
  if (tab?.isDirty) {
    const confirmClose = window.confirm(`Fișierul "${tab.title}" are modificări nesalvate. Ești sigur că vrei să îl închizi?`);
    if (!confirmClose) return;
  }

  openTabs.value = openTabs.value.filter((t) => t.slug !== slugToClose);

  if (activeTabSlug.value === slugToClose) {
    if (openTabs.value.length > 0) {
      activeTabSlug.value = openTabs.value[openTabs.value.length - 1].slug;
    } else {
      activeTabSlug.value = '';
    }
  }
}

// Fetch Docs List
async function fetchDocsList() {
  try {
    loading.value = true;
    const data = await api('/api/admin/doc');
    docs.value = data.docs || [];

    if (typeof window !== 'undefined' && data.docs?.length > 0 && openTabs.value.length === 0) {
      const params = new URLSearchParams(window.location.search);
      const urlSlug = params.get('slug');
      const targetSlug = urlSlug && data.docs.some((d: any) => d.slug === urlSlug)
        ? urlSlug
        : data.docs[0].slug;
      openDocument(targetSlug);
    }
  } catch (err: any) {
    statusMessage.value = { type: 'error', text: err.message };
  } finally {
    loading.value = false;
  }
}

// Fetch Media Assets
async function fetchMediaAssets() {
  try {
    const data = await api('/api/admin/media');
    mediaAssets.value = data.assets || [];
  } catch {}
}

// Versions
async function loadVersions(slug: string) {
  try {
    const data = await api(`/api/admin/doc/versions?slug=${encodeURIComponent(slug)}`);
    versions.value = data.versions || [];
  } catch {
    versions.value = [];
  }
}

function restoreVersion(v: DocVersionItem) {
  if (!activeTab.value) return;
  updateActiveContent(v.content);
  showVersionsMenu.value = false;
  statusMessage.value = {
    type: 'info',
    text: `Versiunea restaurată: Salvată de ${v.savedBy} la ${new Date(v.timestamp).toLocaleString('ro-RO')}`,
  };
}

// Auto-Fix
function handleAutoFix() {
  if (!activeTab.value) return;
  const { fixedContent, appliedFixes } = autoFixMarkdown(activeTab.value.content);
  updateActiveContent(fixedContent);
  if (appliedFixes.length > 0) {
    statusMessage.value = {
      type: 'info',
      text: `Auto-Fix aplicat: ${appliedFixes.join(', ')}.`,
    };
  } else {
    statusMessage.value = {
      type: 'info',
      text: 'Nu s-au găsit erori reparabile automat.',
    };
  }
}

// Format Document
function handleFormatDocument() {
  if (!activeTab.value) return;
  const { fixedContent } = autoFixMarkdown(activeTab.value.content);
  updateActiveContent(fixedContent);
  statusMessage.value = { type: 'success', text: 'Documentul a fost formatat și optimizat!' };
}

// Insert Snippet
function insertSnippet(snippet: string, isBlock = false) {
  if (!editorRef.value) return;
  const el = editorRef.value;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const current = activeContent.value;

  let prefix = '';
  let suffix = '';

  if (isBlock) {
    if (start > 0 && current[start - 1] !== '\n') {
      prefix = '\n\n';
    } else if (start > 1 && current[start - 2] !== '\n') {
      prefix = '\n';
    }
    if (end < current.length && current[end] !== '\n') {
      suffix = '\n\n';
    } else if (end < current.length - 1 && current[end + 1] !== '\n') {
      suffix = '\n';
    }
  }

  const cleanSnippet = isBlock ? snippet.trim() : snippet;
  const nextContent = current.substring(0, start) + prefix + cleanSnippet + suffix + current.substring(end);
  updateActiveContent(nextContent);

  setTimeout(() => {
    el.focus();
    const newPos = start + prefix.length + cleanSnippet.length + suffix.length;
    el.setSelectionRange(newPos, newPos);
    handleCursorActivity();
  }, 10);
}

// Dedicated Snippet Inserters (Preventing Template String Escaping Issues)
function insertStepsSnippet() {
  insertSnippet(
`<Steps>
  <Step title="Pasul 1: Inițializare">
    Descrierea primului pas.
  </Step>
  <Step title="Pasul 2: Configurare">
    Descrierea pasului doi.
  </Step>
</Steps>
`, true);
}

function insertTabsSnippet() {
  insertSnippet(
`<Tabs>
  <Tab label="Opțiunea A">
    Conținut pentru prima variantă.
  </Tab>
  <Tab label="Opțiunea B">
    Conținut pentru a doua variantă.
  </Tab>
</Tabs>
`, true);
}

function insertCardsSnippet() {
  insertSnippet(
`<Cards>
  <Card title="Ghid Rapid" href="/informatii/ghid" icon="lucide:book-open" desc="Instrucțiuni rapide de pornire." />
  <Card title="Specificații" href="/systems/arhitectura" icon="lucide:cpu" desc="Detalii despre arhitectură." />
</Cards>
`, true);
}

function insertDetailsSnippet() {
  insertSnippet(
`<details>
<summary>Apasă pentru detalii suplimentare</summary>

Informații extinse ce pot fi pliate.
</details>
`, true);
}

function insertNoteSnippet() {
  insertSnippet('> [!NOTE]\n> Introdu aici informația sau detaliul util.\n', true);
}

function insertTipSnippet() {
  insertSnippet('> [!TIP]\n> Recomandare sau sfat practic util.\n', true);
}

function insertImportantSnippet() {
  insertSnippet('> [!IMPORTANT]\n> Specificație obligatorie înainte de continuare.\n', true);
}

function insertWarningSnippet() {
  insertSnippet('> [!WARNING]\n> Avertisment privind posibile incompatibilități.\n', true);
}

function insertCautionSnippet() {
  insertSnippet('> [!CAUTION]\n> Acțiune ireversibilă sau impact major asupra datelor.\n', true);
}

function insertBadgeSnippet() {
  insertSnippet('<Badge type="info" text="Recomandat" />');
}

function insertKbdSnippet() {
  insertSnippet('<kbd>Ctrl</kbd> + <kbd>S</kbd>');
}

function insertFeedbackSnippet() {
  insertSnippet('\n<FeedbackWidget />\n', true);
}

function insertContributorsSnippet() {
  insertSnippet('\n<ContributorsWF />\n', true);
}

function insertMediaAsset(asset: MediaAsset) {
  if (asset.type === 'video') {
    insertSnippet(`\n<DocVideo src="${asset.url}" title="${asset.filename}" />\n`, true);
  } else {
    insertSnippet(`\n![${asset.filename}](${asset.url})\n`, true);
  }
  statusMessage.value = { type: 'success', text: `Asset-ul ${asset.filename} a fost inserat!` };
}

// Find & Replace Handlers
function handleReplaceCurrent() {
  if (!findText.value || !activeTab.value) return;
  const cur = activeContent.value;
  const flags = matchCase.value ? '' : 'i';
  const escaped = findText.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const reg = new RegExp(escaped, flags);
  const next = cur.replace(reg, replaceText.value);
  updateActiveContent(next);
}

function handleReplaceAll() {
  if (!findText.value || !activeTab.value) return;
  const cur = activeContent.value;
  const flags = matchCase.value ? 'g' : 'gi';
  const escaped = findText.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const reg = new RegExp(escaped, flags);
  const next = cur.replace(reg, replaceText.value);
  updateActiveContent(next);
}

// Upload & Insert
async function uploadFileAndInsert(file: File, folder = 'media', customTitle = '') {
  if (!file) return;

  if (file.name.endsWith('.md') || file.name.endsWith('.mdx') || file.name.endsWith('.txt')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text && activeTab.value) {
        updateActiveContent(text);
        statusMessage.value = { type: 'success', text: `Conținutul din \`${file.name}\` a fost importat!` };
      }
    };
    reader.readAsText(file);
    return;
  }

  const isVideo = /\.(mp4|webm|mov|mkv)$/i.test(file.name);
  const targetFolder = isVideo && folder === 'media' ? 'videos' : folder;

  try {
    uploadingAsset.value = true;
    statusMessage.value = { type: 'info', text: `Se încarcă \`${file.name}\` în \`/${targetFolder}/\`...` };

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', targetFolder);

    const res = await fetch('/api/admin/media', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload-ul a eșuat.');

    const titleToUse = customTitle.trim() || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ');
    let tagToInsert = '';

    if (isVideo) {
      tagToInsert = `\n<DocVideo src="${data.url}" title="${titleToUse}" />\n`;
    } else {
      tagToInsert = `\n![${titleToUse}](${data.url})\n`;
    }

    insertSnippet(tagToInsert);
    fetchMediaAssets();

    statusMessage.value = {
      type: 'success',
      text: `${isVideo ? 'Videoclipul' : 'Imaginea'} \`${file.name}\` a fost încărcat(ă) și inserat(ă) cu succes!`,
    };
    showMediaModal.value = false;
    selectedMediaFile.value = null;
    mediaFilePreview.value = null;
    mediaAltTitle.value = '';
  } catch (err: any) {
    statusMessage.value = { type: 'error', text: `Eroare upload: ${err.message}` };
  } finally {
    uploadingAsset.value = false;
  }
}

// Paste Handler (Screenshot upload)
function handlePaste(e: ClipboardEvent) {
  const items = e.clipboardData?.items;
  if (!items) return;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.type.indexOf('image') !== -1) {
      e.preventDefault();
      const file = item.getAsFile();
      if (file) {
        const now = new Date();
        const timeString = `${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}_${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
        const ext = file.type.split('/')[1] || 'png';
        const customFileName = `screenshot_${timeString}.${ext}`;
        const renamedFile = new File([file], customFileName, { type: file.type });
        uploadFileAndInsert(renamedFile, 'media', `Screenshot ${timeString}`);
      }
      return;
    }
  }
}

// Direct Screen Capture in Browser
async function handleTakeScreenshot() {
  try {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getDisplayMedia) {
      statusMessage.value = { type: 'error', text: 'Browserul nu suportă funcția de captură ecran directă.' };
      return;
    }
    statusMessage.value = { type: 'info', text: 'Selectează fereastra sau ecranul pentru captură...' };
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { cursor: 'always' } as any,
    });
    const track = stream.getVideoTracks()[0];
    const video = document.createElement('video');
    video.srcObject = stream;
    await video.play();

    // Small delay to ensure frame is loaded
    await new Promise((r) => setTimeout(r, 150));

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1920;
    canvas.height = video.videoHeight || 1080;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

    track.stop();
    stream.getTracks().forEach((t) => t.stop());

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'));
    if (blob) {
      const now = new Date();
      const timeString = `${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}_${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
      const fileName = `screenshot_${timeString}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });
      await uploadFileAndInsert(file, 'media', `Screenshot ${timeString}`);
      statusMessage.value = { type: 'success', text: 'Captura de ecran a fost salvată și inserată!' };
    }
  } catch (err: any) {
    if (err.name !== 'NotAllowedError') {
      statusMessage.value = { type: 'error', text: `Captură anulată sau eșuată: ${err.message}` };
    }
  }
}

function handleInsertYouTubeEmbed() {
  if (!mediaEmbedUrl.value.trim()) {
    statusMessage.value = { type: 'error', text: 'Introdu un link valid de YouTube sau video extern.' };
    return;
  }

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = mediaEmbedUrl.value.match(regExp);
  const videoId = match && match[2].length === 11 ? match[2] : null;
  const titleToUse = mediaAltTitle.value.trim() || 'Demonstrație Video Externă';

  if (videoId) {
    const embedTag = `\n<DocVideo src="https://www.youtube.com/embed/${videoId}" title="${titleToUse}" />\n`;
    insertSnippet(embedTag);
    statusMessage.value = { type: 'success', text: 'Player-ul video extern a fost inserat!' };
  } else {
    const embedTag = `\n<DocVideo src="${mediaEmbedUrl.value.trim()}" title="${titleToUse}" />\n`;
    insertSnippet(embedTag);
    statusMessage.value = { type: 'success', text: 'Video-ul a fost inserat!' };
  }

  showMediaModal.value = false;
  mediaEmbedUrl.value = '';
  mediaAltTitle.value = '';
}

function handleCopyAssetUrl(url: string) {
  navigator.clipboard.writeText(url);
  copiedAssetUrl.value = url;
  setTimeout(() => (copiedAssetUrl.value = null), 2000);
  statusMessage.value = { type: 'info', text: `Link copiat în clipboard: \`${url}\`` };
}

function copyCurrentPath() {
  if (!activeTab.value) return;
  const fullPath = `docs/${activeTab.value.slug}.md`;
  navigator.clipboard.writeText(fullPath);
  statusMessage.value = { type: 'info', text: `Calea copiată: \`${fullPath}\`` };
}

function openPublicPreview() {
  if (!activeTab.value) return;
  window.open(`/${activeTab.value.slug}`, '_blank');
}

// Drag & Drop
function handleDragOver(e: DragEvent) {
  e.preventDefault();
  e.stopPropagation();
  isDraggingFile.value = true;
}

function handleDragLeave(e: DragEvent) {
  e.preventDefault();
  e.stopPropagation();
  isDraggingFile.value = false;
}

function handleDrop(e: DragEvent) {
  e.preventDefault();
  e.stopPropagation();
  isDraggingFile.value = false;

  if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
    uploadFileAndInsert(e.dataTransfer.files[0]);
  }
}

async function handleDeleteAsset(e: MouseEvent, relPath: string) {
  e.stopPropagation();
  if (!isRoot.value) {
    statusMessage.value = { type: 'error', text: 'Doar administratorii Super Root pot șterge fișiere din Asset Manager.' };
    return;
  }

  if (!confirm(`Sigur vrei să ștergi definitiv asset-ul: ${relPath}?`)) return;

  try {
    await api(`/api/admin/media?path=${encodeURIComponent(relPath)}`, undefined, 'DELETE');
    statusMessage.value = { type: 'success', text: `Asset-ul ${relPath} a fost șters!` };
    fetchMediaAssets();
  } catch (err: any) {
    statusMessage.value = { type: 'error', text: `Eroare la ștergerea asset-ului: ${err.message}` };
  }
}

// Save Document
async function handleSave() {
  if (!activeTab.value || saving.value) return;

  if (lintResult.value.hasErrors && !bypassGuardrail.value) {
    showBottomDock.value = true;
    bottomDockTab.value = 'problems';
    statusMessage.value = {
      type: 'error',
      text: `Salvare blocată: Documentul conține ${lintResult.value.errorCount} eroare(i) de sintaxă. Corectează erorile sau folosește Auto-Fix înainte de salvare.`,
    };
    return;
  }

  try {
    saving.value = true;
    statusMessage.value = null;

    const data = await api('/api/admin/doc', {
      slug: activeTab.value.slug,
      content: activeTab.value.content,
      action: 'update',
    });

    activeTab.value.originalContent = activeTab.value.content;
    activeTab.value.isDirty = false;

    try {
      const stored = localStorage.getItem('wf_doc_drafts');
      if (stored) {
        const drafts = JSON.parse(stored).filter((d: any) => d.slug !== activeTab.value?.slug);
        if (drafts.length > 0) localStorage.setItem('wf_doc_drafts', JSON.stringify(drafts));
        else localStorage.removeItem('wf_doc_drafts');
      }
    } catch {}

    statusMessage.value = {
      type: 'success',
      text: `Documentul \`${activeTab.value.slug}\` a fost salvat și sincronizat pe disc!${data.commitHash ? ` (Git: ${data.commitHash.substring(0, 7)})` : ''}`,
    };

    loadVersions(activeTab.value.slug);
  } catch (err: any) {
    statusMessage.value = { type: 'error', text: err.message };
  } finally {
    saving.value = false;
  }
}

function handleDiscardChanges() {
  if (!activeTab.value) return;
  if (confirm('Ești sigur că vrei să renunți la modificările nesalvate? Acestea vor fi pierdute definitiv.')) {
    updateActiveContent(activeTab.value.originalContent);
    statusMessage.value = { type: 'info', text: 'Modificările au fost anulate.' };
  }
}

function handleUploadFileClick() {
  if (selectedMediaFile.value) {
    uploadFileAndInsert(selectedMediaFile.value, mediaTargetFolder.value, mediaAltTitle.value);
  }
}

function handleFileInputChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target?.files && target.files[0]) {
    const file = target.files[0];
    selectedMediaFile.value = file;
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => (mediaFilePreview.value = ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      mediaFilePreview.value = null;
    }
    if (!mediaAltTitle.value) {
      mediaAltTitle.value = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ');
    }
  }
}

// ── Create New Document Handler ──
async function handleCreateNewDoc() {
  const cleanSlug = newSlugName.value.trim().replace(/^\/+/, '').replace(/\.(md|mdx)$/, '');
  if (!cleanSlug) {
    statusMessage.value = { type: 'error', text: 'Numele slug-ului este obligatoriu.' };
    return;
  }

  const fullSlug = `${newCategory.value}/${cleanSlug}`;
  const initialContent = TEMPLATES[selectedTemplateKey.value]?.content(newTitleName.value || cleanSlug, newCategory.value) || `# ${newTitleName.value}\n`;

  try {
    saving.value = true;
    await api('/api/admin/doc', {
      slug: fullSlug,
      content: initialContent,
      action: 'create',
    });

    isCreatingNew.value = false;
    await fetchDocsList();
    openDocument(fullSlug);
    statusMessage.value = { type: 'success', text: `Documentul \`${fullSlug}\` a fost creat cu succes!` };
  } catch (err: any) {
    statusMessage.value = { type: 'error', text: err.message };
  } finally {
    saving.value = false;
  }
}

// ── Create New Category Handler ──
async function handleCreateNewCategory() {
  const cleanSlug = newCatSlug.value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/^-+|-+$/g, '');
  if (!cleanSlug) {
    statusMessage.value = { type: 'error', text: 'Slug-ul categoriei este obligatoriu.' };
    return;
  }

  const title = newCatTitle.value.trim() || cleanSlug.charAt(0).toUpperCase() + cleanSlug.slice(1);

  customCategories.value[cleanSlug] = {
    label: title,
    icon: newCatIcon.value,
    color: newCatColor.value,
  };
  saveCustomCategories();

  if (newCatCreateIndex.value) {
    const fullSlug = `${cleanSlug}/index`;
    const initialContent = `---
title: "${title}"
description: "Prezentare și ghiduri pentru categoria ${title}."
category: "${cleanSlug}"
date: "${new Date().toISOString().split('T')[0]}"
author: "Wildfire Docs"
tags: ["${cleanSlug}", "index"]
draft: false
---

# ${title}

Bine ați venit în secțiunea de documentație dedicată categoriei **${title}**.

<Cards>
  <Card title="Ghid de Inițiere" href="/${cleanSlug}/ghid" icon="${newCatIcon.value}" desc="Consultă instrucțiunile introductive pentru această secțiune." />
</Cards>

## Prezentare Generală

Descrieți aici scopul și structura acestei categorii.
`;

    try {
      saving.value = true;
      await api('/api/admin/doc', {
        slug: fullSlug,
        content: initialContent,
        action: 'create',
      });
      await fetchDocsList();
      openDocument(fullSlug);
    } catch (err: any) {
      statusMessage.value = { type: 'error', text: `Categoria a fost definită, dar crearea paginii index a eșuat: ${err.message}` };
    } finally {
      saving.value = false;
    }
  }

  isCreatingNewCategory.value = false;
  newCategory.value = cleanSlug;
  statusMessage.value = { type: 'success', text: `Categoria "${title}" (${cleanSlug}) a fost creată cu succes!` };

  // Persist to server API
  api('/api/admin/categories', {
    action: 'create',
    key: cleanSlug,
    label: title,
    icon: newCatIcon.value,
    color: newCatColor.value,
    description: `Categoria ${title}`,
  }).catch(() => {});
}

// ── Category Editing Handlers ──
function openEditCategoryModal(catKey: string, e?: MouseEvent) {
  if (e) e.stopPropagation();
  const catDef = categoryMap.value[catKey];
  editingCatKey.value = catKey;
  editCatTitle.value = catDef?.label || catKey;
  editCatSlug.value = catKey;
  editCatIcon.value = catDef?.icon || 'lucide:folder';
  editCatColor.value = catDef?.color || '#3b82f6';
  editCatDesc.value = (catDef as any)?.description || '';
  isEditingCategory.value = true;
}

async function handleSaveEditedCategory() {
  const cleanSlug = editCatSlug.value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/^-+|-+$/g, '');
  if (!cleanSlug) {
    statusMessage.value = { type: 'error', text: 'Slug-ul categoriei este obligatoriu.' };
    return;
  }
  const title = editCatTitle.value.trim() || cleanSlug.charAt(0).toUpperCase() + cleanSlug.slice(1);

  saving.value = true;
  try {
    const res = await api('/api/admin/categories', {
      action: 'update',
      oldKey: editingCatKey.value,
      newKey: cleanSlug,
      label: title,
      icon: editCatIcon.value,
      color: editCatColor.value,
      description: editCatDesc.value.trim(),
    });

    if (res && res.categories) {
      customCategories.value = res.categories;
      saveCustomCategories();
    } else {
      const next = { ...customCategories.value };
      if (cleanSlug !== editingCatKey.value) {
        delete next[editingCatKey.value];
      }
      next[cleanSlug] = {
        label: title,
        icon: editCatIcon.value,
        color: editCatColor.value,
        description: editCatDesc.value.trim(),
      };
      customCategories.value = next;
      saveCustomCategories();
    }

    statusMessage.value = {
      type: 'success',
      text: `Categoria "${title}" a fost actualizată cu succes.`,
    };
    isEditingCategory.value = false;

    // Refresh docs list if slug changed or files were moved
    if (cleanSlug !== editingCatKey.value) {
      await fetchDocsList();
    }
  } catch (err: any) {
    statusMessage.value = { type: 'error', text: `Eroare la actualizarea categoriei: ${err.message}` };
  } finally {
    saving.value = false;
  }
}

async function handleDeleteCategory(catKey: string) {
  const catDef = categoryMap.value[catKey];
  const catLabel = catDef?.label || catKey;
  const count = (groupedDocs.value[catKey] || []).length;

  const msg = count > 0
    ? `Categoria "${catLabel}" conține ${count} documente. Sigur dorești să o elimini din lista categoriilor stilizate? (Fișierele fizice nu vor fi șterse)`
    : `Sigur dorești să ștergi categoria "${catLabel}"?`;

  if (!window.confirm(msg)) return;

  saving.value = true;
  try {
    const res = await api('/api/admin/categories', {
      action: 'delete',
      key: catKey,
    });
    if (res && res.categories) {
      customCategories.value = res.categories;
    } else {
      const next = { ...customCategories.value };
      delete next[catKey];
      customCategories.value = next;
    }
    saveCustomCategories();
    statusMessage.value = { type: 'success', text: `Categoria "${catLabel}" a fost ștearsă.` };
    isEditingCategory.value = false;
    await fetchDocsList();
  } catch (err: any) {
    statusMessage.value = { type: 'error', text: `Eroare la ștergerea categoriei: ${err.message}` };
  } finally {
    saving.value = false;
  }
}

function openNewDocForCategory(catKey: string, e?: MouseEvent) {
  if (e) e.stopPropagation();
  newCategory.value = catKey;
  newTitleName.value = 'Ghid Nou';
  newSlugName.value = 'ghid-nou';
  selectedTemplateKey.value = 'guide';
  isCreatingNew.value = true;
}

async function handleDeleteDoc(e: MouseEvent, slugToDelete: string) {
  e.stopPropagation();
  if (!isRoot.value) {
    statusMessage.value = { type: 'error', text: 'Doar administratorii Super Root pot șterge documente.' };
    return;
  }

  if (!confirm(`Sigur vrei să ștergi definitiv documentul: ${slugToDelete}? Această acțiune este ireversibilă.`)) return;

  try {
    await api(`/api/admin/doc?slug=${encodeURIComponent(slugToDelete)}`, undefined, 'DELETE');
    statusMessage.value = { type: 'success', text: `Documentul ${slugToDelete} a fost șters!` };
    openTabs.value = openTabs.value.filter((t) => t.slug !== slugToDelete);
    if (activeTabSlug.value === slugToDelete) {
      activeTabSlug.value = '';
    }
    fetchDocsList();
  } catch (err: any) {
    statusMessage.value = { type: 'error', text: err.message };
  }
}

function toggleCollapseAll() {
  const allCollapsed = Object.keys(categoryMap.value).every((k) => collapsedCategories.value[k]);
  const nextVal = !allCollapsed;
  Object.keys(categoryMap.value).forEach((k) => {
    collapsedCategories.value[k] = nextVal;
  });
}

function toggleZenMode() {
  isFullscreen.value = !isFullscreen.value;
  // If the browser was in native HTML5 fullscreen, exit it so OS screenshot tools like Win+Shift+S work smoothly
  if (typeof document !== 'undefined' && document.fullscreenElement && document.exitFullscreen) {
    document.exitFullscreen().catch(() => {});
  }
}

function handleFullscreenChange() {
  if (typeof document !== 'undefined') {
    if (!document.fullscreenElement && isFullscreen.value) {
      isFullscreen.value = false;
    }
  }
}

function handleGlobalKeydown(e: KeyboardEvent) {
  const isMac = typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform || navigator.userAgent);
  const isModifier = isMac ? (e.metaKey && !e.ctrlKey) : (e.ctrlKey && !e.metaKey);

  if (isModifier && !e.shiftKey && e.key.toLowerCase() === 's') {
    e.preventDefault();
    handleSave();
  }
  if (isModifier && !e.shiftKey && e.key.toLowerCase() === 'f') {
    e.preventDefault();
    showFindBar.value = !showFindBar.value;
  }
  if (e.key === 'Escape' && isFullscreen.value) {
    e.preventDefault();
    toggleZenMode();
  }
  if ((e.altKey && e.key.toLowerCase() === 'z') || (e.key === 'F11' && !e.ctrlKey)) {
    e.preventDefault();
    toggleZenMode();
  }
  if (e.altKey && e.shiftKey && e.key.toLowerCase() === 'f') {
    e.preventDefault();
    handleFormatDocument();
  }
}

function handleBeforeUnload(e: BeforeUnloadEvent) {
  if (openTabs.value.some((t) => t.isDirty)) {
    e.preventDefault();
    e.returnValue = 'Ai modificări nesalvate. Sigur vrei să părăsești pagina?';
    return e.returnValue;
  }
}

let draftDebounceTimer: ReturnType<typeof setTimeout>;
watch(
  openTabs,
  () => {
    if (openTabs.value.length === 0) return;
    clearTimeout(draftDebounceTimer);
    draftDebounceTimer = setTimeout(() => {
      const drafts = openTabs.value
        .filter((t) => t.isDirty)
        .map((t) => ({ slug: t.slug, content: t.content }));
      if (drafts.length > 0) {
        localStorage.setItem('wf_doc_drafts', JSON.stringify(drafts));
      } else {
        localStorage.removeItem('wf_doc_drafts');
      }
    }, 1500);
  },
  { deep: true }
);

onMounted(() => {
  loadCustomCategories();
  fetchCategoriesList();
  fetchDocsList();
  fetchMediaAssets();
  window.addEventListener('keydown', handleGlobalKeydown);
  window.addEventListener('beforeunload', handleBeforeUnload);
  window.addEventListener('fullscreenchange', handleFullscreenChange);
  window.addEventListener('paste', handlePaste);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown);
  window.removeEventListener('beforeunload', handleBeforeUnload);
  window.removeEventListener('fullscreenchange', handleFullscreenChange);
  window.removeEventListener('paste', handlePaste);
});
</script>

<template>
  <Teleport to="body" :disabled="!isFullscreen">
    <div class="vs-root" :class="{ 'vs-root--fullscreen': isFullscreen }">

      <!-- ─── 1. TOP WINDOW BAR (VS Code Titlebar & Controls) ─── -->
      <header class="vs-titlebar">
        <div class="vs-titlebar-left">
          <a
            href="/admin"
            class="vs-nav-btn"
            title="Înapoi la Panoul Principal"
            @click.prevent="router.go('/admin')"
          >
            <Icon icon="lucide:arrow-left" width="14" height="14" />
            <span>Mission Control</span>
          </a>

          <div class="vs-divider-v" />

          <!-- Workspace branding -->
          <div class="vs-titlebar-tag">
            <Icon icon="lucide:code-2" width="14" height="14" class="text-indigo-400" />
            <span class="vs-titlebar-tag-text">Wildfire Docs Studio</span>
          </div>

          <div class="vs-divider-v" />

          <!-- Breadcrumb Path in Titlebar -->
          <nav class="vs-breadcrumbs" aria-label="Calea documentului curent">
            <span
              v-for="(crumb, idx) in currentBreadcrumb"
              :key="idx"
              class="vs-crumb"
            >
              <span v-if="idx > 0" class="vs-crumb-sep">/</span>
              <span :class="{ 'vs-crumb-active': idx === currentBreadcrumb.length - 1 }">{{ crumb }}</span>
            </span>
            <button
              v-if="activeTab"
              type="button"
              class="vs-crumb-copy"
              title="Copiază calea relativă pe disc"
              @click="copyCurrentPath"
            >
              <Icon icon="lucide:copy" width="11" height="11" />
            </button>
            <button
              v-if="activeTab"
              type="button"
              class="vs-crumb-copy"
              title="Deschide în documentația publică"
              @click="openPublicPreview"
            >
              <Icon icon="lucide:external-link" width="11" height="11" />
            </button>
          </nav>
        </div>

        <div class="vs-titlebar-right">
          <!-- View Modes -->
          <div class="vs-segmented-control">
            <button
              type="button"
              class="vs-seg-btn"
              :class="{ 'vs-seg-btn--active': viewMode === 'split' }"
              title="Split IDE (Editor + Live Preview)"
              @click="viewMode = 'split'"
            >
              <Icon icon="lucide:split" width="13" height="13" />
              <span>Split IDE</span>
            </button>
            <button
              type="button"
              class="vs-seg-btn"
              :class="{ 'vs-seg-btn--active': viewMode === 'edit' }"
              title="Doar Editor Cod"
              @click="viewMode = 'edit'"
            >
              <Icon icon="lucide:code" width="13" height="13" />
              <span>Cod</span>
            </button>
            <button
              type="button"
              class="vs-seg-btn"
              :class="{ 'vs-seg-btn--active': viewMode === 'preview' }"
              title="Doar Previzualizare Rendered"
              @click="viewMode = 'preview'"
            >
              <Icon icon="lucide:eye" width="13" height="13" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              class="vs-seg-btn"
              :class="{ 'vs-seg-btn--active': viewMode === 'diff' }"
              title="Comparație Git Diff"
              @click="viewMode = 'diff'"
            >
              <Icon icon="lucide:git-compare" width="13" height="13" />
              <span>Diff</span>
            </button>
          </div>

          <div class="vs-divider-v" />

          <!-- History versions -->
          <div v-if="versions.length > 0" ref="versionsMenuRef" class="vs-dropdown-wrapper">
            <button
              type="button"
              class="vs-btn"
              title="Istoric Versiuni Salvate"
              @click="showVersionsMenu = !showVersionsMenu"
            >
              <Icon icon="lucide:history" width="13" height="13" />
              <span>Istoric ({{ versions.length }})</span>
            </button>
            <div v-if="showVersionsMenu" class="vs-dropdown-menu">
              <div class="vs-dropdown-head">
                <Icon icon="lucide:history" width="13" height="13" />
                <span>Versiuni Salvate</span>
              </div>
              <div class="vs-dropdown-scroll">
                <button
                  v-for="v in versions"
                  :key="v.id"
                  type="button"
                  class="vs-dropdown-item"
                  @click="restoreVersion(v)"
                >
                  <div class="vs-version-actor">
                    <Icon icon="lucide:user" width="12" height="12" />
                    <strong>{{ v.savedBy }}</strong>
                  </div>
                  <div class="vs-version-meta">
                    <Icon icon="lucide:clock" width="11" height="11" />
                    <span>{{ new Date(v.timestamp).toLocaleString('ro-RO') }}</span>
                    <span>· {{ v.charCount }} caractere</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Format Document -->
          <button
            type="button"
            class="vs-btn"
            title="Formatează & Curăță Markdown (Alt+Shift+F)"
            @click="handleFormatDocument"
          >
            <Icon icon="lucide:sparkles" width="13" height="13" />
            <span>Format</span>
          </button>

          <!-- Screenshot Capture -->
          <button
            type="button"
            class="vs-btn"
            title="Captură Ecran (Screenshot) - Captură directă din browser sau lipește cu Ctrl+V"
            @click="handleTakeScreenshot"
          >
            <Icon icon="lucide:camera" width="13" height="13" />
            <span>Screenshot</span>
          </button>

          <!-- Zen Fullscreen -->
          <button
            type="button"
            class="vs-btn"
            :class="{ 'vs-btn--active': isFullscreen }"
            :title="isFullscreen ? 'Ieși din modul Zen (Esc)' : 'Mod Zen Fullscreen (Alt+Z / F11)'"
            @click="toggleZenMode"
          >
            <Icon :icon="isFullscreen ? 'lucide:minimize-2' : 'lucide:maximize-2'" width="13" height="13" />
            <span>{{ isFullscreen ? 'Restrânge' : 'Zen' }}</span>
          </button>

          <div class="vs-divider-v" />

          <!-- Save Button Group -->
          <div class="vs-save-group">
            <button
              v-if="activeTab?.isDirty"
              type="button"
              class="vs-btn vs-btn--danger"
              title="Anulează modificările nesalvate"
              @click="handleDiscardChanges"
            >
              <Icon icon="lucide:x" width="13" height="13" />
              <span>Anulează</span>
            </button>

            <!-- Save blocked by guardrail -->
            <button
              v-if="lintResult.hasErrors && !bypassGuardrail"
              type="button"
              class="vs-btn vs-btn--blocked"
              :title="`Salvare Blocată: ${lintResult.errorCount} erori de sintaxă detectate.`"
              @click="handleSave"
            >
              <Icon icon="lucide:shield-alert" width="13" height="13" />
              <span>Blocat ({{ lintResult.errorCount }} Erori)</span>
            </button>

            <!-- Normal Save Button -->
            <button
              v-else
              type="button"
              class="vs-btn vs-btn--primary"
              :class="{ 'vs-btn--dirty': activeTab?.isDirty }"
              :disabled="saving || !activeTab"
              title="Salvează & Efectuează Commit Git (Ctrl+S)"
              @click="handleSave"
            >
              <Icon
                :icon="saving ? 'lucide:refresh-cw' : 'lucide:save'"
                width="13"
                height="13"
                :class="{ 'vs-spin': saving }"
              />
              <span>{{ saving ? 'Se salvează...' : activeTab?.isDirty ? 'Salvează Fișier' : 'Salvat' }}</span>
            </button>

            <!-- Root Super Admin Guardrail Bypass -->
            <button
              v-if="isRoot && lintResult.hasErrors"
              type="button"
              class="vs-btn vs-btn--bypass"
              :class="{ 'vs-btn--bypass-active': bypassGuardrail }"
              title="Root Override: Comută bypass guardrail pentru salvare forțată"
              @click="bypassGuardrail = !bypassGuardrail"
            >
              <Icon :icon="bypassGuardrail ? 'lucide:unlock' : 'lucide:lock'" width="12" height="12" />
              <span>{{ bypassGuardrail ? 'Bypass Activ' : 'Override' }}</span>
            </button>
          </div>
        </div>
      </header>

      <!-- ─── STATUS BANNER ─── -->
      <div v-if="statusMessage" class="vs-banner" :class="`vs-banner--${statusMessage.type}`">
        <div class="vs-banner-left">
          <Icon v-if="statusMessage.type === 'success'" icon="lucide:check-circle-2" width="14" height="14" />
          <Icon v-else-if="statusMessage.type === 'error'" icon="lucide:alert-circle" width="14" height="14" />
          <Icon v-else icon="lucide:info" width="14" height="14" />
          <span>{{ statusMessage.text }}</span>
        </div>
        <button type="button" class="vs-banner-close" @click="statusMessage = null">
          <Icon icon="lucide:x" width="13" height="13" />
        </button>
      </div>

      <!-- ─── 2. MAIN WORKSPACE (Activity Bar + Side Panel + Editor + Statusbar) ─── -->
      <div class="vs-workspace">

        <!-- ── ACTIVITY BAR (Vertical Left Strip 48px) ── -->
        <aside class="vs-activitybar">
          <div class="vs-activitybar-top">
            <button
              type="button"
              class="vs-activity-icon"
              :class="{ 'vs-activity-icon--active': sidebarOpen && activeActivity === 'explorer' }"
              title="Explorer: Fișiere & Categorii"
              @click="if (activeActivity === 'explorer') sidebarOpen = !sidebarOpen; else { activeActivity = 'explorer'; sidebarOpen = true; }"
            >
              <Icon icon="lucide:files" width="18" height="18" />
            </button>

            <button
              type="button"
              class="vs-activity-icon"
              :class="{ 'vs-activity-icon--active': sidebarOpen && activeActivity === 'search' }"
              title="Căutare & Înlocuire Globală"
              @click="if (activeActivity === 'search') sidebarOpen = !sidebarOpen; else { activeActivity = 'search'; sidebarOpen = true; }"
            >
              <Icon icon="lucide:search" width="18" height="18" />
            </button>

            <button
              type="button"
              class="vs-activity-icon"
              :class="{ 'vs-activity-icon--active': sidebarOpen && activeActivity === 'snippets' }"
              title="Bibliotecă Componente & Widgeturi Docs"
              @click="if (activeActivity === 'snippets') sidebarOpen = !sidebarOpen; else { activeActivity = 'snippets'; sidebarOpen = true; }"
            >
              <Icon icon="lucide:layout-grid" width="18" height="18" />
            </button>

            <button
              type="button"
              class="vs-activity-icon"
              :class="{ 'vs-activity-icon--active': sidebarOpen && activeActivity === 'media' }"
              title="Centru Media & Video Vault"
              @click="if (activeActivity === 'media') sidebarOpen = !sidebarOpen; else { activeActivity = 'media'; sidebarOpen = true; }"
            >
              <Icon icon="lucide:image" width="18" height="18" />
            </button>

            <button
              type="button"
              class="vs-activity-icon"
              :class="{ 'vs-activity-icon--active': sidebarOpen && activeActivity === 'git' }"
              title="Control Sursă & Istoric Git"
              @click="if (activeActivity === 'git') sidebarOpen = !sidebarOpen; else { activeActivity = 'git'; sidebarOpen = true; }"
            >
              <Icon icon="lucide:git-branch" width="18" height="18" />
            </button>
          </div>

          <div class="vs-activitybar-bottom">
            <button
              v-if="isRoot"
              type="button"
              class="vs-activity-icon"
              title="Recycle Bin (Coș de Gunoi)"
              @click="showTrashModal = true"
            >
              <Icon icon="lucide:trash-2" width="18" height="18" />
            </button>

            <button
              type="button"
              class="vs-activity-icon"
              title="Comută Vizualizare Sidebar"
              @click="sidebarOpen = !sidebarOpen"
            >
              <Icon :icon="sidebarOpen ? 'lucide:panel-left-close' : 'lucide:panel-left-open'" width="18" height="18" />
            </button>
          </div>
        </aside>

        <!-- ── SIDEBAR PANEL (Explorer, Search, Snippets, Media, Git) ── -->
        <section v-if="sidebarOpen" class="vs-sidepanel">

          <!-- PANEL 1: EXPLORER -->
          <div v-if="activeActivity === 'explorer'" class="vs-explorer">
            <div class="vs-panel-header">
              <span class="vs-panel-title">EXPLORER: WILDFIRE DOCS</span>
              <div class="vs-panel-actions">
                <button
                  type="button"
                  class="vs-icon-action"
                  title="Pagină Nouă în Documentație"
                  @click="isCreatingNew = true"
                >
                  <Icon icon="lucide:file-plus" width="14" height="14" />
                </button>
                <button
                  type="button"
                  class="vs-icon-action"
                  title="Categorie Nouă (Folder Nou)"
                  @click="isCreatingNewCategory = true"
                >
                  <Icon icon="lucide:folder-plus" width="14" height="14" />
                </button>
                <button
                  type="button"
                  class="vs-icon-action"
                  title="Gestionează Toate Categoriile"
                  @click="isManagingCategories = true"
                >
                  <Icon icon="lucide:folder-cog" width="14" height="14" />
                </button>
                <button
                  type="button"
                  class="vs-icon-action"
                  title="Reîmprospătează Fișierele"
                  @click="fetchDocsList"
                >
                  <Icon icon="lucide:refresh-cw" width="14" height="14" />
                </button>
                <button
                  type="button"
                  class="vs-icon-action"
                  title="Colapsează / Expandează Tot"
                  @click="toggleCollapseAll"
                >
                  <Icon icon="lucide:chevrons-up-down" width="14" height="14" />
                </button>
              </div>
            </div>

            <!-- Quick search filter -->
            <div class="vs-search-box">
              <Icon icon="lucide:search" width="13" height="13" class="vs-search-ico" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Filtrează pagini..."
                class="vs-search-inp"
              />
              <button v-if="searchQuery" type="button" class="vs-search-clr" @click="searchQuery = ''">
                <Icon icon="lucide:x" width="11" height="11" />
              </button>
            </div>

            <!-- File Tree -->
            <div class="vs-tree">
              <div
                v-for="(catDocs, catKey) in groupedDocs"
                :key="catKey"
                class="vs-tree-folder"
              >
                <!-- Category Folder Row -->
                <div
                  class="vs-tree-folder-head"
                  @click="collapsedCategories[catKey] = !collapsedCategories[catKey]"
                >
                  <Icon
                    :icon="collapsedCategories[catKey] ? 'lucide:chevron-right' : 'lucide:chevron-down'"
                    width="12"
                    height="12"
                    class="vs-folder-arrow"
                  />
                  <Icon
                    :icon="categoryMap[catKey]?.icon || 'lucide:folder'"
                    width="14"
                    height="14"
                    :style="{ color: categoryMap[catKey]?.color || '#3b82f6' }"
                  />
                  <span class="vs-folder-name">{{ categoryMap[catKey]?.label || catKey }}</span>
                  <span class="vs-folder-count">{{ catDocs.length }}</span>

                  <!-- Hover actions: edit category & add doc into this category -->
                  <div class="vs-folder-actions">
                    <button
                      type="button"
                      class="vs-folder-action-btn"
                      title="Editează această categorie"
                      @click.stop="openEditCategoryModal(catKey as string, $event)"
                    >
                      <Icon icon="lucide:settings-2" width="11" height="11" />
                    </button>
                    <button
                      type="button"
                      class="vs-folder-action-btn vs-folder-add-btn"
                      title="Adaugă pagină nouă în această categorie"
                      @click.stop="openNewDocForCategory(catKey as string, $event)"
                    >
                      <Icon icon="lucide:plus" width="11" height="11" />
                    </button>
                  </div>
                </div>

                <!-- Files inside Folder -->
                <div v-if="!collapsedCategories[catKey]" class="vs-tree-folder-children">
                  <div
                    v-for="doc in catDocs"
                    :key="doc.slug"
                    class="vs-tree-file"
                    :class="{ 'vs-tree-file--active': activeTabSlug === doc.slug }"
                    @click="openDocument(doc.slug)"
                  >
                    <Icon icon="lucide:file-text" width="13" height="13" class="vs-file-icon" />
                    <span class="vs-file-label" :title="doc.title || doc.slug">
                      {{ doc.title || doc.slug }}
                    </span>
                    <span
                      v-if="openTabs.find((t) => t.slug === doc.slug)?.isDirty"
                      class="vs-dirty-dot"
                      title="Modificări nesalvate"
                    />

                    <!-- Delete button (Super Root) -->
                    <button
                      v-if="isRoot"
                      type="button"
                      class="vs-file-del-btn"
                      title="Șterge documentul"
                      @click="handleDeleteDoc($event, doc.slug)"
                    >
                      <Icon icon="lucide:trash-2" width="11" height="11" />
                    </button>
                  </div>

                  <div v-if="catDocs.length === 0" class="vs-tree-empty-folder">
                    <span>Niciun document.</span>
                    <button
                      type="button"
                      class="vs-tree-empty-add"
                      @click="openNewDocForCategory(catKey as string)"
                    >
                      + Adaugă pagină
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Add Category / Doc Footer in Explorer -->
            <div class="vs-explorer-footer">
              <button
                type="button"
                class="vs-quick-action-btn"
                @click="isCreatingNew = true"
              >
                <Icon icon="lucide:file-plus" width="13" height="13" />
                <span>Pagină Nouă</span>
              </button>
              <button
                type="button"
                class="vs-quick-action-btn"
                @click="isCreatingNewCategory = true"
              >
                <Icon icon="lucide:folder-plus" width="13" height="13" />
                <span>Categorie Nouă</span>
              </button>
            </div>
          </div>

          <!-- PANEL 2: SEARCH & REPLACE -->
          <div v-else-if="activeActivity === 'search'" class="vs-search-panel">
            <div class="vs-panel-header">
              <span class="vs-panel-title">CĂUTARE & ÎNLOCUIRE</span>
            </div>
            <div class="vs-search-panel-body">
              <div class="vs-input-group">
                <label class="vs-label">Caută</label>
                <div class="vs-input-wrapper">
                  <input
                    v-model="findText"
                    type="text"
                    placeholder="Text de căutat..."
                    class="vs-panel-input"
                  />
                  <button
                    type="button"
                    class="vs-match-btn"
                    :class="{ 'vs-match-btn--active': matchCase }"
                    title="Match Case (Aa)"
                    @click="matchCase = !matchCase"
                  >
                    Aa
                  </button>
                </div>
                <span class="vs-sublabel">{{ findText ? `${findMatchCount} potriviri în document` : '0 potriviri' }}</span>
              </div>

              <div class="vs-input-group">
                <label class="vs-label">Înlocuiește</label>
                <input
                  v-model="replaceText"
                  type="text"
                  placeholder="Text înlocuitor..."
                  class="vs-panel-input"
                />
              </div>

              <div class="vs-btn-row">
                <button
                  type="button"
                  class="vs-btn vs-btn--primary"
                  :disabled="!findMatchCount"
                  @click="handleReplaceCurrent"
                >
                  Înlocuiește Următorul
                </button>
                <button
                  type="button"
                  class="vs-btn"
                  :disabled="!findMatchCount"
                  @click="handleReplaceAll"
                >
                  Înlocuiește Tot
                </button>
              </div>
            </div>
          </div>

          <!-- PANEL 3: SNIPPETS & DOCS WIDGET LIBRARY -->
          <div v-else-if="activeActivity === 'snippets'" class="vs-snippets-panel">
            <div class="vs-panel-header">
              <span class="vs-panel-title">BIBLIOTECĂ COMPONENTE DOCS</span>
            </div>
            <div class="vs-snippets-scroll">
              <div class="vs-snippet-group">
                <span class="vs-snippet-group-title">Alerte GitHub (Callouts)</span>
                <div class="vs-snippet-grid">
                  <button
                    type="button"
                    class="vs-snippet-card"
                    @click="insertNoteSnippet"
                  >
                    <Icon icon="lucide:info" width="14" height="14" class="text-blue-400" />
                    <strong>Note</strong>
                    <span>Informații & detalii</span>
                  </button>
                  <button
                    type="button"
                    class="vs-snippet-card"
                    @click="insertTipSnippet"
                  >
                    <Icon icon="lucide:sparkles" width="14" height="14" class="text-emerald-400" />
                    <strong>Tip</strong>
                    <span>Recomandare utilă</span>
                  </button>
                  <button
                    type="button"
                    class="vs-snippet-card"
                    @click="insertImportantSnippet"
                  >
                    <Icon icon="lucide:shield-alert" width="14" height="14" class="text-indigo-400" />
                    <strong>Important</strong>
                    <span>Cerință critică</span>
                  </button>
                  <button
                    type="button"
                    class="vs-snippet-card"
                    @click="insertWarningSnippet"
                  >
                    <Icon icon="lucide:triangle-alert" width="14" height="14" class="text-amber-400" />
                    <strong>Warning</strong>
                    <span>Atenționare risc</span>
                  </button>
                  <button
                    type="button"
                    class="vs-snippet-card"
                    @click="insertCautionSnippet"
                  >
                    <Icon icon="lucide:alert-octagon" width="14" height="14" class="text-rose-400" />
                    <strong>Caution</strong>
                    <span>Avertizare critică</span>
                  </button>
                </div>
              </div>

              <div class="vs-snippet-group">
                <span class="vs-snippet-group-title">Structură & Navigare</span>
                <div class="vs-snippet-grid">
                  <button
                    type="button"
                    class="vs-snippet-card"
                    @click="insertStepsSnippet"
                  >
                    <Icon icon="lucide:list-ordered" width="14" height="14" class="text-blue-400" />
                    <strong>Pași (Steps)</strong>
                    <span>Tutorial numerotat</span>
                  </button>
                  <button
                    type="button"
                    class="vs-snippet-card"
                    @click="insertTabsSnippet"
                  >
                    <Icon icon="lucide:layers" width="14" height="14" class="text-purple-400" />
                    <strong>Taburi (Tabs)</strong>
                    <span>Comutator conținut</span>
                  </button>
                  <button
                    type="button"
                    class="vs-snippet-card"
                    @click="insertCardsSnippet"
                  >
                    <Icon icon="lucide:layout-grid" width="14" height="14" class="text-amber-400" />
                    <strong>Carduri (Cards)</strong>
                    <span>Grilă de linkuri</span>
                  </button>
                  <button
                    type="button"
                    class="vs-snippet-card"
                    @click="insertDetailsSnippet"
                  >
                    <Icon icon="lucide:chevron-down" width="14" height="14" class="text-slate-400" />
                    <strong>Acordeon</strong>
                    <span>Secțiune pliabilă</span>
                  </button>
                </div>
              </div>

              <div class="vs-snippet-group">
                <span class="vs-snippet-group-title">Conținut & Generatoare</span>
                <div class="vs-snippet-grid">
                  <button
                    type="button"
                    class="vs-snippet-card"
                    @click="showTableBuilder = true"
                  >
                    <Icon icon="lucide:table" width="14" height="14" class="text-emerald-400" />
                    <strong>Tabel Builder</strong>
                    <span>Generator tabel</span>
                  </button>
                  <button
                    type="button"
                    class="vs-snippet-card"
                    @click="showCodeBuilder = true"
                  >
                    <Icon icon="lucide:code-2" width="14" height="14" class="text-cyan-400" />
                    <strong>Bloc de Cod</strong>
                    <span>Generator sintaxă</span>
                  </button>
                  <button
                    type="button"
                    class="vs-snippet-card"
                    @click="showMediaModal = true; mediaModalTab = 'upload'"
                  >
                    <Icon icon="lucide:image" width="14" height="14" class="text-rose-400" />
                    <strong>Imagine / Media</strong>
                    <span>Upload & inserare</span>
                  </button>
                  <button
                    type="button"
                    class="vs-snippet-card"
                    @click="showMediaModal = true; mediaModalTab = 'embed'"
                  >
                    <Icon icon="lucide:video" width="14" height="14" class="text-red-400" />
                    <strong>Player Video</strong>
                    <span>DocVideo player</span>
                  </button>
                  <button
                    type="button"
                    class="vs-snippet-card"
                    @click="insertBadgeSnippet"
                  >
                    <Icon icon="lucide:tag" width="14" height="14" class="text-indigo-400" />
                    <strong>Insignă (Badge)</strong>
                    <span>Status & etichetă</span>
                  </button>
                  <button
                    type="button"
                    class="vs-snippet-card"
                    @click="insertKbdSnippet"
                  >
                    <Icon icon="lucide:command" width="14" height="14" class="text-slate-300" />
                    <strong>Tastă (KBD)</strong>
                    <span>Scurtătură tastatură</span>
                  </button>
                  <button
                    type="button"
                    class="vs-snippet-card"
                    @click="insertFeedbackSnippet"
                  >
                    <Icon icon="lucide:message-square" width="14" height="14" class="text-emerald-400" />
                    <strong>Feedback Widget</strong>
                    <span>Rating utilizatori</span>
                  </button>
                  <button
                    type="button"
                    class="vs-snippet-card"
                    @click="insertContributorsSnippet"
                  >
                    <Icon icon="lucide:users" width="14" height="14" class="text-purple-400" />
                    <strong>Contributori</strong>
                    <span>Autori document</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- PANEL 4: MEDIA VAULT GALLERY -->
          <div v-else-if="activeActivity === 'media'" class="vs-media-panel">
            <div class="vs-panel-header">
              <span class="vs-panel-title">ASSET VAULT ({{ mediaAssets.length }})</span>
              <button
                type="button"
                class="vs-icon-action"
                title="Upload Fișier Nou"
                @click="showMediaModal = true; mediaModalTab = 'upload'"
              >
                <Icon icon="lucide:upload" width="14" height="14" />
              </button>
            </div>
            <div class="vs-search-box">
              <Icon icon="lucide:search" width="13" height="13" class="vs-search-ico" />
              <input
                v-model="mediaVaultSearch"
                type="text"
                placeholder="Caută în asset-uri..."
                class="vs-search-inp"
              />
            </div>
            <div class="vs-media-list">
              <div
                v-for="asset in filteredVaultAssets"
                :key="asset.url"
                class="vs-media-card"
                @click="insertMediaAsset(asset)"
              >
                <img
                  v-if="asset.type !== 'video'"
                  :src="asset.url"
                  :alt="asset.filename"
                  class="vs-media-thumb"
                  loading="lazy"
                />
                <div v-else class="vs-media-video-thumb">
                  <Icon icon="lucide:film" width="20" height="20" />
                </div>
                <div class="vs-media-info">
                  <span class="vs-media-name" :title="asset.filename">{{ asset.filename }}</span>
                  <span class="vs-media-size">{{ asset.sizeFormatted }}</span>
                </div>
                <button
                  type="button"
                  class="vs-media-insert-btn"
                  title="Inserează în document"
                >
                  <Icon icon="lucide:plus" width="12" height="12" />
                </button>
              </div>
            </div>
          </div>

          <!-- PANEL 5: GIT & HISTORY -->
          <div v-else-if="activeActivity === 'git'" class="vs-git-panel">
            <div class="vs-panel-header">
              <span class="vs-panel-title">CONTROL SURSĂ (GIT)</span>
            </div>
            <div class="vs-git-body">
              <div class="vs-git-status-card">
                <Icon icon="lucide:git-commit" width="16" height="16" class="text-indigo-400" />
                <div>
                  <strong>Branch Principal</strong>
                  <span>Auto-commit la salvare document</span>
                </div>
              </div>
              <div v-if="activeTab" class="vs-git-file-status">
                <span class="vs-git-file-name">{{ activeTab.slug }}.md</span>
                <span
                  class="vs-git-badge"
                  :class="activeTab.isDirty ? 'vs-git-badge--modified' : 'vs-git-badge--clean'"
                >
                  {{ activeTab.isDirty ? 'Modificat' : 'Comis' }}
                </span>
              </div>
              <div class="vs-btn-col">
                <button
                  type="button"
                  class="vs-btn vs-btn--primary"
                  :disabled="!activeTab?.isDirty || saving"
                  @click="handleSave"
                >
                  <Icon icon="lucide:git-commit" width="13" height="13" />
                  <span>Commit & Salvează</span>
                </button>
                <button
                  type="button"
                  class="vs-btn"
                  @click="viewMode = 'diff'"
                >
                  <Icon icon="lucide:git-compare" width="13" height="13" />
                  <span>Vizualizează Diferențe (Diff)</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- ── 3. MAIN EDITOR & PREVIEW AREA ── -->
        <main class="vs-main">

          <!-- ── TABS BAR (VS Code Document Tabs) ── -->
          <div class="vs-tabbar">
            <div class="vs-tabs-list">
              <div
                v-for="tab in openTabs"
                :key="tab.slug"
                class="vs-tab"
                :class="{ 'vs-tab--active': tab.slug === activeTabSlug }"
                @click="activeTabSlug = tab.slug"
              >
                <Icon icon="lucide:file-text" width="13" height="13" class="vs-tab-icon" />
                <span class="vs-tab-title">{{ tab.title }}</span>
                <span v-if="tab.isDirty" class="vs-tab-dirty" title="Modificări nesalvate" />
                <button
                  type="button"
                  class="vs-tab-close"
                  title="Închide fișierul"
                  @click.stop="closeTab(tab.slug, $event)"
                >
                  <Icon icon="lucide:x" width="11" height="11" />
                </button>
              </div>
            </div>

            <button
              type="button"
              class="vs-new-tab-btn"
              title="Creează Document Nou"
              @click="isCreatingNew = true"
            >
              <Icon icon="lucide:plus" width="13" height="13" />
            </button>
          </div>

          <!-- ── SNIPPET & FORMAT RIBBON TOOLBAR ── -->
          <div v-if="activeTab" class="vs-ribbon">
            <div class="vs-ribbon-group">
              <button type="button" class="vs-ribbon-btn" title="Bold (Ctrl+B)" @click="insertSnippet('**text îngroșat**')">
                <Icon icon="lucide:bold" width="13" height="13" />
              </button>
              <button type="button" class="vs-ribbon-btn" title="Italic (Ctrl+I)" @click="insertSnippet('*text cursiv*')">
                <Icon icon="lucide:italic" width="13" height="13" />
              </button>
              <button type="button" class="vs-ribbon-btn" title="Titlu H1" @click="insertSnippet('# Titlu H1\n', true)">
                <Icon icon="lucide:heading-1" width="13" height="13" />
              </button>
              <button type="button" class="vs-ribbon-btn" title="Titlu H2" @click="insertSnippet('## 1.0 Secțiune H2\n', true)">
                <Icon icon="lucide:heading-2" width="13" height="13" />
              </button>
              <button type="button" class="vs-ribbon-btn" title="Titlu H3" @click="insertSnippet('### 1.1 Subsecțiune H3\n', true)">
                <Icon icon="lucide:heading-3" width="13" height="13" />
              </button>
            </div>

            <div class="vs-divider-v" />

            <!-- Alerte Rapide -->
            <div class="vs-ribbon-group">
              <button
                type="button"
                class="vs-ribbon-btn"
                title="Alertă Note"
                @click="calloutInitialType = 'NOTE'; showCalloutBuilder = true"
              >
                <Icon icon="lucide:info" width="13" height="13" class="text-blue-400" />
                <span>Note</span>
              </button>
              <button
                type="button"
                class="vs-ribbon-btn"
                title="Alertă Tip"
                @click="calloutInitialType = 'TIP'; showCalloutBuilder = true"
              >
                <Icon icon="lucide:sparkles" width="13" height="13" class="text-emerald-400" />
                <span>Tip</span>
              </button>
              <button
                type="button"
                class="vs-ribbon-btn"
                title="Alertă Important"
                @click="calloutInitialType = 'IMPORTANT'; showCalloutBuilder = true"
              >
                <Icon icon="lucide:shield-alert" width="13" height="13" class="text-indigo-400" />
                <span>Important</span>
              </button>
              <button
                type="button"
                class="vs-ribbon-btn"
                title="Alertă Warning"
                @click="calloutInitialType = 'WARNING'; showCalloutBuilder = true"
              >
                <Icon icon="lucide:triangle-alert" width="13" height="13" class="text-amber-400" />
                <span>Warning</span>
              </button>
            </div>

            <div class="vs-divider-v" />

            <!-- Componente Docs -->
            <div class="vs-ribbon-group">
              <button
                type="button"
                class="vs-ribbon-btn"
                title="Inserează Pași Ghid (<Steps>)"
                @click="insertStepsSnippet"
              >
                <Icon icon="lucide:list-ordered" width="13" height="13" />
                <span>Pași</span>
              </button>
              <button
                type="button"
                class="vs-ribbon-btn"
                title="Inserează Grup Taburi (<Tabs>)"
                @click="insertTabsSnippet"
              >
                <Icon icon="lucide:layers" width="13" height="13" />
                <span>Taburi</span>
              </button>
              <button
                type="button"
                class="vs-ribbon-btn"
                title="Inserează Carduri (<Cards>)"
                @click="insertCardsSnippet"
              >
                <Icon icon="lucide:layout-grid" width="13" height="13" />
                <span>Carduri</span>
              </button>
              <button
                type="button"
                class="vs-ribbon-btn"
                title="Deschide Generator Tabel"
                @click="showTableBuilder = true"
              >
                <Icon icon="lucide:table" width="13" height="13" />
                <span>Tabel</span>
              </button>
              <button
                type="button"
                class="vs-ribbon-btn"
                title="Deschide Generator Bloc Cod"
                @click="showCodeBuilder = true"
              >
                <Icon icon="lucide:code" width="13" height="13" />
                <span>Cod</span>
              </button>
              <button
                type="button"
                class="vs-ribbon-btn"
                title="Încarcă sau Alege Imagine"
                @click="showMediaModal = true; mediaModalTab = 'upload'"
              >
                <Icon icon="lucide:image" width="13" height="13" />
                <span>Imagine</span>
              </button>
              <button
                type="button"
                class="vs-ribbon-btn"
                title="Inserează Video Player"
                @click="showMediaModal = true; mediaModalTab = 'embed'"
              >
                <Icon icon="lucide:video" width="13" height="13" />
                <span>Video</span>
              </button>
            </div>

            <div class="vs-divider-v" />

            <!-- Find & Replace Toggle -->
            <button
              type="button"
              class="vs-ribbon-btn"
              :class="{ 'vs-ribbon-btn--active': showFindBar }"
              title="Căutare & Înlocuire în Document (Ctrl+F)"
              @click="showFindBar = !showFindBar"
            >
              <Icon icon="lucide:search" width="13" height="13" />
              <span>Căutare</span>
            </button>
          </div>

          <!-- ── FIND & REPLACE BAR ── -->
          <div v-if="showFindBar" class="vs-findbar">
            <div class="vs-findbar-row">
              <Icon icon="lucide:search" width="13" height="13" class="vs-find-icon" />
              <input
                v-model="findText"
                type="text"
                placeholder="Caută în text..."
                class="vs-find-input"
              />
              <button
                type="button"
                class="vs-find-match"
                :class="{ 'vs-find-match--active': matchCase }"
                title="Match Case (Aa)"
                @click="matchCase = !matchCase"
              >
                Aa
              </button>
              <span class="vs-find-count">
                {{ findText ? `${findMatchCount} potriviri` : '0 potriviri' }}
              </span>
              <input
                v-model="replaceText"
                type="text"
                placeholder="Înlocuiește cu..."
                class="vs-find-input"
              />
              <button
                type="button"
                class="vs-btn vs-btn--primary vs-btn--sm"
                :disabled="!findMatchCount"
                @click="handleReplaceCurrent"
              >
                Înlocuiește
              </button>
              <button
                type="button"
                class="vs-btn vs-btn--sm"
                :disabled="!findMatchCount"
                @click="handleReplaceAll"
              >
                Tot
              </button>
              <button type="button" class="vs-findbar-close" @click="showFindBar = false">
                <Icon icon="lucide:x" width="13" height="13" />
              </button>
            </div>
          </div>

          <!-- ── VIEWPORT (Empty state / Diff / Split / Edit / Preview) ── -->
          <div
            class="vs-viewport"
            :class="{ 'vs-viewport--dragging': isDraggingFile }"
            @dragover="handleDragOver"
            @dragleave="handleDragLeave"
            @drop="handleDrop"
          >
            <!-- Drag & Drop overlay -->
            <div v-if="isDraggingFile" class="vs-drag-overlay">
              <Icon icon="lucide:upload-cloud" width="48" height="48" class="text-indigo-400" />
              <h3>Trage fișierul aici pentru a-l încărca</h3>
              <p>Imaginile și clipurile video vor fi sincronizate și inserate automat în poziția cursorului.</p>
            </div>

            <!-- Empty State (No file open) -->
            <div v-if="!activeTab" class="vs-empty-state">
              <div class="vs-empty-card">
                <div class="vs-empty-icon-wrap">
                  <Icon icon="lucide:code-2" width="40" height="40" class="text-indigo-400" />
                </div>
                <h3>Wildfire Docs Studio</h3>
                <p>Selectează un fișier din panoul Explorer sau creează o pagină nouă pentru a începe editarea.</p>
                <div class="vs-empty-actions">
                  <button
                    type="button"
                    class="vs-btn vs-btn--primary"
                    @click="isCreatingNew = true"
                  >
                    <Icon icon="lucide:file-plus" width="14" height="14" />
                    <span>Pagină Nouă</span>
                  </button>
                  <button
                    type="button"
                    class="vs-btn"
                    @click="isCreatingNewCategory = true"
                  >
                    <Icon icon="lucide:folder-plus" width="14" height="14" />
                    <span>Categorie Nouă</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- DIFF VIEW -->
            <div v-else-if="viewMode === 'diff'" class="vs-diff-view">
              <div class="vs-diff-head">
                <Icon icon="lucide:git-compare" width="14" height="14" />
                <span>Comparație Versiune Modificată (Editor) vs. Versiunea Salvată pe Disc</span>
              </div>
              <div class="vs-diff-body">
                <div
                  v-for="(chunk, i) in computeLineDiff(activeOriginalContent, activeContent)"
                  :key="i"
                  class="vs-diff-row"
                  :class="`vs-diff-row--${chunk.type}`"
                >
                  <span class="vs-diff-symbol">
                    {{ chunk.type === 'added' ? '+' : chunk.type === 'removed' ? '-' : ' ' }}
                  </span>
                  <span class="vs-diff-content">{{ chunk.value }}</span>
                </div>
              </div>
            </div>

            <!-- SPLIT CONTAINER (EDITOR + PREVIEW) -->
            <div v-else class="vs-editor-split">
              <!-- EDITOR PANE -->
              <div
                v-if="viewMode === 'split' || viewMode === 'edit'"
                class="vs-editor-pane"
                :class="{ 'vs-editor-pane--full': viewMode === 'edit' }"
              >
                <!-- Line Number Gutter -->
                <div ref="gutterRef" class="vs-gutter">
                  <div
                    v-for="idx in lineCount"
                    :key="idx"
                    class="vs-gutter-line"
                    :class="{ 'vs-gutter-line--active': cursorPos.line === idx }"
                    @click="jumpToLine(idx)"
                  >
                    <span class="vs-gutter-num">{{ idx }}</span>
                    <span
                      v-if="lintResult.diagnostics.find((d) => d.line === idx)"
                      class="vs-gutter-marker"
                      :class="`vs-gutter-marker--${lintResult.diagnostics.find((d) => d.line === idx)?.severity}`"
                      :title="`Linia ${idx}: ${lintResult.diagnostics.find((d) => d.line === idx)?.message}`"
                    />
                  </div>
                </div>

                <!-- Textarea Code Area -->
                <textarea
                  ref="editorRef"
                  :value="activeContent"
                  class="vs-textarea"
                  placeholder="Scrie documentația în format Markdown / MDX..."
                  spellcheck="false"
                  @input="updateActiveContent(($event.target as HTMLTextAreaElement).value); handleCursorActivity()"
                  @keydown="handleEditorKeydown"
                  @keyup="handleCursorActivity"
                  @click="handleCursorActivity"
                  @scroll="handleEditorScroll"
                  @paste="handlePaste"
                />

                <!-- Floating line action toolbar tracking cursor line -->
                <StudioFloatingLineToolbar
                  :cursor-line="cursorPos.line"
                  @open-table-builder="showTableBuilder = true"
                  @open-callout-builder="calloutInitialType = 'NOTE'; showCalloutBuilder = true"
                  @open-code-builder="showCodeBuilder = true"
                  @open-media-modal="(tab) => { mediaModalTab = tab; showMediaModal = true; }"
                  @open-gallery-builder="showGalleryBuilder = true"
                  @insert-quick-snippet="(s) => insertSnippet(s, true)"
                  @jump-to-line="jumpToLine"
                />
              </div>

              <!-- PREVIEW PANE -->
              <div
                v-if="viewMode === 'split' || viewMode === 'preview'"
                class="vs-preview-pane"
                :class="{ 'vs-preview-pane--full': viewMode === 'preview' }"
              >
                <AdminMarkdownPreview
                  :raw-content="activeContent"
                  :slug="activeTabSlug"
                  @content-change="updateActiveContent"
                  @open-table-builder="showTableBuilder = true"
                  @open-callout-builder="(type) => { calloutInitialType = type || 'NOTE'; showCalloutBuilder = true; }"
                  @open-code-builder="showCodeBuilder = true"
                  @open-media-modal="mediaModalTab = 'upload'; showMediaModal = true;"
                  @open-gallery-builder="showGalleryBuilder = true"
                />
              </div>
            </div>
          </div>

          <!-- ─── BOTTOM DOCK (PROBLEMS, LOGS, DIFF, ASSETS) ─── -->
          <div v-if="activeTab && showBottomDock" class="vs-dock">
            <div class="vs-dock-tabs">
              <button
                type="button"
                class="vs-dock-tab"
                :class="{ 'vs-dock-tab--active': bottomDockTab === 'problems' }"
                @click="bottomDockTab = 'problems'"
              >
                <Icon icon="lucide:alert-circle" width="12" height="12" />
                <span>Problems</span>
                <span v-if="lintResult.errorCount > 0" class="vs-dock-badge vs-dock-badge--error">
                  {{ lintResult.errorCount }}
                </span>
                <span v-if="lintResult.warningCount > 0" class="vs-dock-badge vs-dock-badge--warn">
                  {{ lintResult.warningCount }}
                </span>
              </button>

              <button
                type="button"
                class="vs-dock-tab"
                :class="{ 'vs-dock-tab--active': bottomDockTab === 'diff' }"
                @click="bottomDockTab = 'diff'"
              >
                <Icon icon="lucide:git-compare" width="12" height="12" />
                <span>Git Diff</span>
              </button>

              <button
                type="button"
                class="vs-dock-tab"
                :class="{ 'vs-dock-tab--active': bottomDockTab === 'assets' }"
                @click="bottomDockTab = 'assets'"
              >
                <Icon icon="lucide:image" width="12" height="12" />
                <span>Asset Gallery ({{ mediaAssets.length }})</span>
              </button>

              <button
                type="button"
                class="vs-dock-tab"
                :class="{ 'vs-dock-tab--active': bottomDockTab === 'console' }"
                @click="bottomDockTab = 'console'"
              >
                <Icon icon="lucide:terminal" width="12" height="12" />
                <span>Integritate</span>
              </button>

              <!-- Auto-fix button in dock -->
              <button
                v-if="lintResult.hasErrors"
                type="button"
                class="vs-dock-fix-btn"
                title="Repară automat problemele de sintaxă reparabile"
                @click="handleAutoFix"
              >
                <Icon icon="lucide:wand-2" width="12" height="12" />
                <span>Auto-Fix</span>
              </button>

              <button
                type="button"
                class="vs-dock-close"
                title="Închide panoul de jos"
                @click="showBottomDock = false"
              >
                <Icon icon="lucide:x" width="13" height="13" />
              </button>
            </div>

            <div class="vs-dock-body">
              <!-- Tab 1: Problems -->
              <div v-if="bottomDockTab === 'problems'" class="vs-problems-list">
                <div v-if="lintResult.diagnostics.length === 0" class="vs-no-problems">
                  <Icon icon="lucide:check-circle-2" width="16" height="16" class="text-emerald-400" />
                  <span>Nicio problemă detectată. Sintaxa Markdown este curată și conformă cu standardele Docs.</span>
                </div>
                <div
                  v-for="diag in lintResult.diagnostics"
                  :key="diag.id"
                  class="vs-problem-row"
                  :class="`vs-problem-row--${diag.severity}`"
                  @click="jumpToLine(diag.line)"
                >
                  <Icon v-if="diag.severity === 'error'" icon="lucide:x-circle" width="14" height="14" class="text-rose-400" />
                  <Icon v-else-if="diag.severity === 'warning'" icon="lucide:triangle-alert" width="14" height="14" class="text-amber-400" />
                  <Icon v-else icon="lucide:info" width="14" height="14" class="text-blue-400" />
                  <span class="vs-prob-loc">Ln {{ diag.line }}, Col {{ diag.column }}</span>
                  <span class="vs-prob-msg">{{ diag.message }}</span>
                  <span class="vs-prob-rule">[{{ diag.rule }}]</span>
                  <span v-if="diag.fixable" class="vs-prob-fix">Auto-fixabil</span>
                </div>
              </div>

              <!-- Tab 2: Diff -->
              <div v-else-if="bottomDockTab === 'diff'" class="vs-dock-diff">
                <div
                  v-for="(chunk, i) in computeLineDiff(activeOriginalContent, activeContent)"
                  :key="i"
                  class="vs-diff-row"
                  :class="`vs-diff-row--${chunk.type}`"
                >
                  <span class="vs-diff-symbol">{{ chunk.type === 'added' ? '+' : chunk.type === 'removed' ? '-' : ' ' }}</span>
                  <span class="vs-diff-content">{{ chunk.value }}</span>
                </div>
              </div>

              <!-- Tab 3: Assets -->
              <div v-else-if="bottomDockTab === 'assets'" class="vs-dock-assets">
                <div
                  v-for="asset in filteredVaultAssets"
                  :key="asset.url"
                  class="vs-dock-asset-thumb"
                  :title="`Click pentru a insera ${asset.filename}`"
                  @click="insertMediaAsset(asset)"
                >
                  <img v-if="asset.type !== 'video'" :src="asset.url" :alt="asset.filename" />
                  <div v-else class="vs-dock-video-icon">
                    <Icon icon="lucide:film" width="20" height="20" />
                  </div>
                  <span>{{ asset.filename }}</span>
                </div>
              </div>

              <!-- Tab 4: Console -->
              <div v-else-if="bottomDockTab === 'console'" class="vs-dock-console">
                <div class="vs-console-row">
                  <span class="vs-console-time">{{ new Date().toLocaleTimeString() }}</span>
                  <span class="vs-console-tag">[AST_LINTER]</span>
                  <span>Scor de integritate: {{ lintResult.integrityScore }}% ({{ lintResult.errorCount }} erori, {{ lintResult.warningCount }} avertismente)</span>
                </div>
                <div class="vs-console-row">
                  <span class="vs-console-time">{{ new Date().toLocaleTimeString() }}</span>
                  <span class="vs-console-tag">[GUARDRAIL]</span>
                  <span>Stare: {{ lintResult.hasErrors ? 'Blocat pentru salvare (corectează erorile)' : 'Permis pentru salvare și sincronizare Git' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- ─── 4. VS CODE STATUS BAR (Bottom 24px) ─── -->
          <footer class="vs-statusbar">
            <div class="vs-statusbar-left">
              <button
                type="button"
                class="vs-status-item vs-status-item--btn"
                @click="showBottomDock = !showBottomDock; bottomDockTab = 'problems'"
              >
                <Icon
                  :icon="lintResult.hasErrors ? 'lucide:x-circle' : 'lucide:check-circle-2'"
                  width="12"
                  height="12"
                  :class="lintResult.hasErrors ? 'text-rose-400' : 'text-emerald-400'"
                />
                <span>{{ lintResult.errorCount }} Erori, {{ lintResult.warningCount }} Warnings</span>
              </button>

              <div class="vs-divider-v-sm" />

              <span class="vs-status-item">
                <Icon icon="lucide:shield-check" width="12" height="12" class="text-emerald-400" />
                <span>Integritate: {{ lintResult.integrityScore }}%</span>
              </span>

              <div class="vs-divider-v-sm" />

              <span class="vs-status-item">
                <span v-if="bypassGuardrail" class="text-amber-400 font-bold">Guardrail: Bypass Root</span>
                <span v-else>Guardrail: Activ</span>
              </span>
            </div>

            <div class="vs-statusbar-right">
              <span class="vs-status-item">
                Ln {{ cursorPos.line }}, Col {{ cursorPos.col }}
              </span>
              <div class="vs-divider-v-sm" />
              <span class="vs-status-item">{{ wordCount }} cuvinte · {{ charCount }} caractere</span>
              <div class="vs-divider-v-sm" />
              <span class="vs-status-item">Spaces: 2</span>
              <div class="vs-divider-v-sm" />
              <span class="vs-status-item">UTF-8</span>
              <div class="vs-divider-v-sm" />
              <span class="vs-status-item">Markdown / MDX</span>
              <div class="vs-divider-v-sm" />
              <span class="vs-status-item" :class="activeTab?.isDirty ? 'text-amber-400' : 'text-emerald-400'">
                {{ activeTab?.isDirty ? 'Modificări nesalvate' : 'Sincronizat pe disc' }}
              </span>
            </div>
          </footer>
        </main>
      </div>

      <!-- ─── MODAL 1: CREATE NEW DOCUMENT ─── -->
      <div v-if="isCreatingNew" class="vs-modal-backdrop" @click.self="isCreatingNew = false">
        <div class="vs-modal">
          <div class="vs-modal-header">
            <div>
              <div class="vs-modal-pretitle">PAGINĂ NOUĂ ÎN DOCS</div>
              <h3 class="vs-modal-title">Creează Pagină de Documentație</h3>
            </div>
            <button type="button" class="vs-modal-close" @click="isCreatingNew = false">
              <Icon icon="lucide:x" width="16" height="16" />
            </button>
          </div>

          <div class="vs-modal-body">
            <div class="vs-form-group">
              <label class="vs-form-label">Titlu Pagină</label>
              <input
                v-model="newTitleName"
                type="text"
                class="vs-form-input"
                placeholder="ex: Configurare Server și Rețea"
                @input="
                  newSlugName = ($event.target as HTMLInputElement).value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '')
                "
              />
            </div>

            <div class="vs-form-group">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <label class="vs-form-label" style="margin: 0;">Categorie & Folder Destinație</label>
                <button
                  type="button"
                  class="vs-link-btn"
                  @click="isCreatingNewCategory = true"
                >
                  + Categorie Nouă
                </button>
              </div>
              <select v-model="newCategory" class="vs-form-input">
                <option v-for="(cat, key) in categoryMap" :key="key" :value="key">
                  {{ cat.label }} ({{ key }}/)
                </option>
              </select>
            </div>

            <div class="vs-form-group">
              <label class="vs-form-label">Slug URL Fișier (.md)</label>
              <input
                v-model="newSlugName"
                type="text"
                class="vs-form-input vs-mono"
                placeholder="nume-pagina"
              />
              <span class="vs-form-hint">
                Calea fișierului pe disc: <code>docs/{{ newCategory }}/{{ newSlugName }}.md</code>
              </span>
            </div>

            <div class="vs-form-group">
              <label class="vs-form-label">Șablon Inițial</label>
              <div class="vs-templates-grid">
                <button
                  v-for="(tmpl, key) in TEMPLATES"
                  :key="key"
                  type="button"
                  class="vs-template-card"
                  :class="{ 'vs-template-card--active': selectedTemplateKey === key }"
                  @click="selectedTemplateKey = key"
                >
                  <Icon :icon="tmpl.icon" width="16" height="16" class="vs-tmpl-icon" />
                  <strong>{{ tmpl.label }}</strong>
                  <span>{{ tmpl.desc }}</span>
                </button>
              </div>
            </div>
          </div>

          <div class="vs-modal-footer">
            <button type="button" class="vs-btn" @click="isCreatingNew = false">
              Anulează
            </button>
            <button
              type="button"
              class="vs-btn vs-btn--primary"
              :disabled="saving || !newSlugName.trim()"
              @click="handleCreateNewDoc"
            >
              <Icon :icon="saving ? 'lucide:refresh-cw' : 'lucide:file-plus'" width="14" height="14" :class="{ 'vs-spin': saving }" />
              <span>Creează & Deschide în Editor</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ─── MODAL 2: CREATE NEW CATEGORY (FOLDER) ─── -->
      <div v-if="isCreatingNewCategory" class="vs-modal-backdrop" @click.self="isCreatingNewCategory = false">
        <div class="vs-modal">
          <div class="vs-modal-header">
            <div>
              <div class="vs-modal-pretitle">CATEGORIE NOUĂ</div>
              <h3 class="vs-modal-title">Configurare Categorie & Folder Documentație</h3>
            </div>
            <button type="button" class="vs-modal-close" @click="isCreatingNewCategory = false">
              <Icon icon="lucide:x" width="16" height="16" />
            </button>
          </div>

          <div class="vs-modal-body">
            <div class="vs-form-group">
              <label class="vs-form-label">Nume Categorie</label>
              <input
                v-model="newCatTitle"
                type="text"
                class="vs-form-input"
                placeholder="ex: Ghiduri și Proceduri"
                @input="
                  newCatSlug = ($event.target as HTMLInputElement).value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '')
                "
              />
            </div>

            <div class="vs-form-group">
              <label class="vs-form-label">Slug Folder pe Disc</label>
              <input
                v-model="newCatSlug"
                type="text"
                class="vs-form-input vs-mono"
                placeholder="ghiduri"
              />
              <span class="vs-form-hint">
                Folder creat: <code>docs/{{ newCatSlug || 'categorie' }}/</code>
              </span>
            </div>

            <div class="vs-form-group">
              <label class="vs-form-label">Pictogramă Categorie</label>
              <div class="vs-icon-picker">
                <button
                  v-for="ico in AVAILABLE_ICONS"
                  :key="ico"
                  type="button"
                  class="vs-icon-choice"
                  :class="{ 'vs-icon-choice--active': newCatIcon === ico }"
                  @click="newCatIcon = ico"
                >
                  <Icon :icon="ico" width="16" height="16" />
                </button>
              </div>
            </div>

            <div class="vs-form-group">
              <label class="vs-form-label">Culoare Accent</label>
              <div class="vs-color-picker">
                <button
                  v-for="col in AVAILABLE_COLORS"
                  :key="col"
                  type="button"
                  class="vs-color-choice"
                  :style="{ backgroundColor: col }"
                  :class="{ 'vs-color-choice--active': newCatColor === col }"
                  @click="newCatColor = col"
                />
              </div>
            </div>

            <div class="vs-form-group vs-checkbox-group">
              <label class="vs-checkbox-label">
                <input v-model="newCatCreateIndex" type="checkbox" />
                <span>Generează automat pagina introductivă <code>index.md</code></span>
              </label>
            </div>
          </div>

          <div class="vs-modal-footer">
            <button type="button" class="vs-btn" @click="isCreatingNewCategory = false">
              Anulează
            </button>
            <button
              type="button"
              class="vs-btn vs-btn--primary"
              :disabled="saving || !newCatSlug.trim()"
              @click="handleCreateNewCategory"
            >
              <Icon :icon="saving ? 'lucide:refresh-cw' : 'lucide:folder-plus'" width="14" height="14" :class="{ 'vs-spin': saving }" />
              <span>Creează Categoria</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ─── MODAL 2.5: EDIT EXISTING CATEGORY ─── -->
      <div v-if="isEditingCategory" class="vs-modal-backdrop" @click.self="isEditingCategory = false">
        <div class="vs-modal">
          <div class="vs-modal-header">
            <div>
              <div class="vs-modal-pretitle">CONFIGURARE CATEGORIE</div>
              <h3 class="vs-modal-title">Editează Categoria: {{ editCatTitle || editingCatKey }}</h3>
            </div>
            <button type="button" class="vs-modal-close" @click="isEditingCategory = false">
              <Icon icon="lucide:x" width="16" height="16" />
            </button>
          </div>

          <div class="vs-modal-body">
            <!-- Category Badge & Live Preview -->
            <div class="vs-cat-preview-banner">
              <div class="vs-cat-preview-badge" :style="{ borderColor: editCatColor, background: `${editCatColor}15` }">
                <Icon :icon="editCatIcon || 'lucide:folder'" width="22" height="22" :style="{ color: editCatColor }" />
                <div>
                  <div class="vs-cat-preview-title" :style="{ color: editCatColor }">{{ editCatTitle || 'Denumire Categorie' }}</div>
                  <div class="vs-cat-preview-slug">docs/{{ editCatSlug || editingCatKey }}/</div>
                </div>
              </div>
              <div class="vs-cat-preview-count">
                <span class="vs-cat-preview-num">{{ editingCatDocsCount }}</span>
                <span class="vs-cat-preview-lbl">{{ editingCatDocsCount === 1 ? 'pagină' : 'pagini' }}</span>
              </div>
            </div>

            <div class="vs-form-group">
              <label class="vs-form-label">Denumire Categorie (Afișată în Meniu & Explorer)</label>
              <input
                v-model="editCatTitle"
                type="text"
                class="vs-form-input"
                placeholder="ex: Economie & Resurse"
              />
            </div>

            <div class="vs-form-group">
              <label class="vs-form-label">Identificator Folder pe Disc (Slug URL)</label>
              <input
                v-model="editCatSlug"
                type="text"
                class="vs-form-input vs-mono"
                placeholder="ex: currency"
              />
              <span class="vs-form-hint">
                Folder: <code>docs/{{ editCatSlug || editingCatKey }}/</code>
                <template v-if="editCatSlug !== editingCatKey">
                  &bull; <strong style="color: #f59e0b;">Notă:</strong> Schimbarea slug-ului va rearanja directorul și va actualiza frontmatter-ul fișierelor conținute.
                </template>
              </span>
            </div>

            <div class="vs-form-group">
              <label class="vs-form-label">Descriere Categorie (Opțional)</label>
              <input
                v-model="editCatDesc"
                type="text"
                class="vs-form-input"
                placeholder="Scurt rezumat al conținutului din această categorie..."
              />
            </div>

            <div class="vs-form-group">
              <label class="vs-form-label">Pictogramă Categorie</label>
              <div class="vs-icon-picker">
                <button
                  v-for="ico in AVAILABLE_ICONS"
                  :key="ico"
                  type="button"
                  class="vs-icon-choice"
                  :class="{ 'vs-icon-choice--active': editCatIcon === ico }"
                  @click="editCatIcon = ico"
                >
                  <Icon :icon="ico" width="16" height="16" />
                </button>
              </div>
            </div>

            <div class="vs-form-group">
              <label class="vs-form-label">Culoare Accent</label>
              <div class="vs-color-picker">
                <button
                  v-for="col in AVAILABLE_COLORS"
                  :key="col"
                  type="button"
                  class="vs-color-choice"
                  :style="{ backgroundColor: col }"
                  :class="{ 'vs-color-choice--active': editCatColor === col }"
                  @click="editCatColor = col"
                />
              </div>
            </div>
          </div>

          <div class="vs-modal-footer vs-modal-footer--split">
            <button
              type="button"
              class="vs-btn vs-btn--danger"
              :disabled="saving"
              @click="handleDeleteCategory(editingCatKey)"
            >
              <Icon icon="lucide:trash-2" width="14" height="14" />
              <span>Șterge Categoria</span>
            </button>

            <div class="vs-modal-footer-actions">
              <button type="button" class="vs-btn" @click="isEditingCategory = false">
                Anulează
              </button>
              <button
                type="button"
                class="vs-btn vs-btn--primary"
                :disabled="saving || !editCatSlug.trim() || !editCatTitle.trim()"
                @click="handleSaveEditedCategory"
              >
                <Icon :icon="saving ? 'lucide:refresh-cw' : 'lucide:check'" width="14" height="14" :class="{ 'vs-spin': saving }" />
                <span>Salvează Modificările</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ─── MODAL 2.6: MANAGE ALL CATEGORIES ─── -->
      <div v-if="isManagingCategories" class="vs-modal-backdrop" @click.self="isManagingCategories = false">
        <div class="vs-modal vs-modal--lg">
          <div class="vs-modal-header">
            <div>
              <div class="vs-modal-pretitle">ORGANIZARE DOCS</div>
              <h3 class="vs-modal-title">Gestionare Structură Categorii</h3>
            </div>
            <button type="button" class="vs-modal-close" @click="isManagingCategories = false">
              <Icon icon="lucide:x" width="16" height="16" />
            </button>
          </div>

          <div class="vs-modal-body">
            <div class="vs-cat-mgr-top">
              <p class="vs-cat-mgr-desc">
                Personalizează denumirile, pictogramele și culorile secțiunilor din documentație. Poți edita orice categorie existentă sau adăuga altele noi.
              </p>
              <button
                type="button"
                class="vs-btn vs-btn--primary"
                @click="isManagingCategories = false; isCreatingNewCategory = true"
              >
                <Icon icon="lucide:folder-plus" width="14" height="14" />
                <span>Adaugă Categorie Nouă</span>
              </button>
            </div>

            <div class="vs-cat-grid">
              <div
                v-for="(catDef, catKey) in categoryMap"
                :key="catKey"
                class="vs-cat-card"
                :style="{ borderLeftColor: catDef?.color || '#3b82f6' }"
              >
                <div class="vs-cat-card-header">
                  <div class="vs-cat-card-icon" :style="{ backgroundColor: `${catDef?.color || '#3b82f6'}20`, color: catDef?.color || '#3b82f6' }">
                    <Icon :icon="catDef?.icon || 'lucide:folder'" width="18" height="18" />
                  </div>
                  <div class="vs-cat-card-info">
                    <h4 class="vs-cat-card-title">{{ catDef?.label || catKey }}</h4>
                    <span class="vs-cat-card-slug">docs/{{ catKey }}/</span>
                  </div>
                  <span class="vs-cat-card-badge">
                    {{ (groupedDocs[catKey] || []).length }} pagini
                  </span>
                </div>

                <div class="vs-cat-card-actions">
                  <button
                    type="button"
                    class="vs-btn vs-btn--sm"
                    @click="isManagingCategories = false; openEditCategoryModal(catKey as string)"
                  >
                    <Icon icon="lucide:settings-2" width="13" height="13" />
                    <span>Editează</span>
                  </button>
                  <button
                    type="button"
                    class="vs-btn vs-btn--sm"
                    @click="isManagingCategories = false; openNewDocForCategory(catKey as string)"
                  >
                    <Icon icon="lucide:plus" width="13" height="13" />
                    <span>Adaugă Pagină</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="vs-modal-footer">
            <button type="button" class="vs-btn vs-btn--primary" @click="isManagingCategories = false">
              Închide
            </button>
          </div>
        </div>
      </div>

      <!-- ─── MODAL 3: MEDIA & VIDEO VAULT INSERTER ─── -->
      <div v-if="showMediaModal" class="vs-modal-backdrop" @click.self="showMediaModal = false">
        <div class="vs-modal vs-modal--lg">
          <div class="vs-modal-header">
            <div>
              <div class="vs-modal-pretitle">MEDIA & ASSET VAULT</div>
              <h3 class="vs-modal-title">Inserare Imagini, GIF-uri & Video-uri</h3>
            </div>
            <button type="button" class="vs-modal-close" @click="showMediaModal = false">
              <Icon icon="lucide:x" width="16" height="16" />
            </button>
          </div>

          <!-- Subtabs -->
          <div class="vs-modal-tabs">
            <button
              type="button"
              class="vs-modal-tab"
              :class="{ 'vs-modal-tab--active': mediaModalTab === 'upload' }"
              @click="mediaModalTab = 'upload'"
            >
              <Icon icon="lucide:upload" width="14" height="14" />
              <span>Upload Fișier Local</span>
            </button>
            <button
              type="button"
              class="vs-modal-tab"
              :class="{ 'vs-modal-tab--active': mediaModalTab === 'vault' }"
              @click="mediaModalTab = 'vault'"
            >
              <Icon icon="lucide:layers" width="14" height="14" />
              <span>Galerie Server ({{ mediaAssets.length }})</span>
            </button>
            <button
              type="button"
              class="vs-modal-tab"
              :class="{ 'vs-modal-tab--active': mediaModalTab === 'embed' }"
              @click="mediaModalTab = 'embed'"
            >
              <Icon icon="lucide:external-link" width="14" height="14" />
              <span>Video Extern (YouTube)</span>
            </button>
          </div>

          <div class="vs-modal-body">
            <!-- TAB 1: UPLOAD -->
            <div v-if="mediaModalTab === 'upload'" class="vs-upload-tab">
              <div class="vs-dropzone" @click="fileInputRef?.click()">
                <div v-if="selectedMediaFile" class="vs-dropzone-preview">
                  <img v-if="mediaFilePreview" :src="mediaFilePreview" alt="Preview" />
                  <Icon v-else icon="lucide:film" width="40" height="40" class="text-amber-400" />
                  <div>
                    <strong>{{ selectedMediaFile.name }}</strong>
                    <span>{{ (selectedMediaFile.size / 1024).toFixed(1) }} KB</span>
                  </div>
                </div>
                <div v-else class="vs-dropzone-empty">
                  <Icon icon="lucide:upload-cloud" width="36" height="36" class="text-indigo-400" />
                  <span class="vs-dropzone-title">Click pentru a selecta sau trage fișierul aici</span>
                  <span class="vs-dropzone-sub">Suportă imagini PNG, JPG, WEBP, GIF, SVG și video MP4, WEBM</span>
                </div>
              </div>

              <div class="vs-upload-quick-actions" style="display: flex; gap: 8px; justify-content: center; margin-top: 4px;">
                <button
                  type="button"
                  class="vs-btn"
                  @click="handleTakeScreenshot"
                >
                  <Icon icon="lucide:camera" width="14" height="14" />
                  <span>Captură Ecran Instant (Screenshot)</span>
                </button>
              </div>

              <input
                ref="fileInputRef"
                type="file"
                style="display: none;"
                accept="image/*,video/mp4,video/webm,.gif"
                @change="handleFileInputChange"
              />

              <div class="vs-form-group">
                <label class="vs-form-label">Folder Destinație pe Server</label>
                <select v-model="mediaTargetFolder" class="vs-form-input">
                  <option value="media">/media/ — Imagini & Diagrame Generale</option>
                  <option value="videos">/videos/ — Demonstrații Video MP4/WebM</option>
                  <option value="screenshots">/screenshots/ — Capturi de Ecran & Interfață</option>
                  <option value="architecture">/architecture/ — Diagrame de Sistem</option>
                </select>
              </div>

              <div class="vs-form-group">
                <label class="vs-form-label">Titlu / Text Alternativ (Alt Text / Caption)</label>
                <input
                  v-model="mediaAltTitle"
                  type="text"
                  class="vs-form-input"
                  placeholder="ex: Diagrama fluxului de execuție"
                />
              </div>
            </div>

            <!-- TAB 2: VAULT GALLERY -->
            <div v-else-if="mediaModalTab === 'vault'" class="vs-vault-tab">
              <div class="vs-vault-toolbar">
                <div class="vs-search-box" style="flex: 1;">
                  <Icon icon="lucide:search" width="13" height="13" class="vs-search-ico" />
                  <input
                    v-model="mediaVaultSearch"
                    type="text"
                    placeholder="Caută în asset-uri..."
                    class="vs-search-inp"
                  />
                </div>
                <div class="vs-filter-btns">
                  <button
                    type="button"
                    class="vs-filter-btn"
                    :class="{ 'vs-filter-btn--active': mediaVaultFilter === 'all' }"
                    @click="mediaVaultFilter = 'all'"
                  >
                    Toate
                  </button>
                  <button
                    type="button"
                    class="vs-filter-btn"
                    :class="{ 'vs-filter-btn--active': mediaVaultFilter === 'image' }"
                    @click="mediaVaultFilter = 'image'"
                  >
                    Imagini
                  </button>
                  <button
                    type="button"
                    class="vs-filter-btn"
                    :class="{ 'vs-filter-btn--active': mediaVaultFilter === 'video' }"
                    @click="mediaVaultFilter = 'video'"
                  >
                    Video-uri
                  </button>
                  <button
                    type="button"
                    class="vs-filter-btn"
                    :class="{ 'vs-filter-btn--active': mediaVaultFilter === 'gif' }"
                    @click="mediaVaultFilter = 'gif'"
                  >
                    GIF-uri
                  </button>
                </div>
              </div>

              <div class="vs-vault-grid">
                <div
                  v-for="asset in filteredVaultAssets"
                  :key="asset.url"
                  class="vs-vault-card"
                >
                  <div class="vs-vault-card-thumb">
                    <img
                      v-if="asset.type !== 'video'"
                      :src="asset.url"
                      :alt="asset.filename"
                      loading="lazy"
                    />
                    <div v-else class="vs-vault-video-badge">
                      <Icon icon="lucide:film" width="24" height="24" />
                    </div>
                  </div>
                  <div class="vs-vault-card-meta">
                    <span class="vs-vault-filename" :title="asset.filename">{{ asset.filename }}</span>
                    <span class="vs-vault-size">{{ asset.sizeFormatted }}</span>
                  </div>
                  <div class="vs-vault-card-actions">
                    <button
                      type="button"
                      class="vs-btn vs-btn--primary vs-btn--sm"
                      @click="insertMediaAsset(asset)"
                    >
                      <Icon icon="lucide:plus" width="12" height="12" />
                      <span>Inserează</span>
                    </button>
                    <button
                      type="button"
                      class="vs-icon-action"
                      title="Copiază linkul URL"
                      @click="handleCopyAssetUrl(asset.url)"
                    >
                      <Icon icon="lucide:copy" width="12" height="12" />
                    </button>
                    <button
                      v-if="isRoot"
                      type="button"
                      class="vs-icon-action vs-icon-action--danger"
                      title="Șterge definitiv asset-ul"
                      @click="asset.relativePath && handleDeleteAsset($event, asset.relativePath)"
                    >
                      <Icon icon="lucide:trash-2" width="12" height="12" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- TAB 3: EXTERNAL EMBED -->
            <div v-else-if="mediaModalTab === 'embed'" class="vs-embed-tab">
              <div class="vs-form-group">
                <label class="vs-form-label">Link Video YouTube / Streamable</label>
                <input
                  v-model="mediaEmbedUrl"
                  type="text"
                  class="vs-form-input"
                  placeholder="https://www.youtube.com/watch?v=... sau https://youtu.be/..."
                />
              </div>

              <div class="vs-form-group">
                <label class="vs-form-label">Titlu Video / Descriere</label>
                <input
                  v-model="mediaAltTitle"
                  type="text"
                  class="vs-form-input"
                  placeholder="ex: Demonstrație Video Funcționalitate"
                />
              </div>
            </div>
          </div>

          <div class="vs-modal-footer">
            <button type="button" class="vs-btn" @click="showMediaModal = false">
              Închide
            </button>
            <button
              v-if="mediaModalTab === 'upload'"
              type="button"
              class="vs-btn vs-btn--primary"
              :disabled="!selectedMediaFile || uploadingAsset"
              @click="handleUploadFileClick"
            >
              <Icon :icon="uploadingAsset ? 'lucide:refresh-cw' : 'lucide:upload'" width="14" height="14" :class="{ 'vs-spin': uploadingAsset }" />
              <span>Încarcă & Inserează</span>
            </button>
            <button
              v-else-if="mediaModalTab === 'embed'"
              type="button"
              class="vs-btn vs-btn--primary"
              :disabled="!mediaEmbedUrl.trim()"
              @click="handleInsertYouTubeEmbed"
            >
              <Icon icon="lucide:play" width="14" height="14" />
              <span>Inserează Player Video</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ─── MODAL 4: INTERACTIVE TABLE BUILDER ─── -->
      <StudioTableBuilderModal
        v-if="showTableBuilder"
        :cursor-line="cursorPos.line"
        @insert="
          (md) => {
            insertSnippet(md, true);
            showTableBuilder = false;
            statusMessage = { type: 'success', text: `Tabelul a fost inserat la linia ${cursorPos.line}!` };
          }
        "
        @close="showTableBuilder = false"
      />

      <!-- ─── MODAL 5: INTERACTIVE CALLOUT BUILDER ─── -->
      <StudioCalloutBuilderModal
        v-if="showCalloutBuilder"
        :cursor-line="cursorPos.line"
        :initial-type="calloutInitialType"
        @insert="
          (md) => {
            insertSnippet(md, true);
            showCalloutBuilder = false;
            statusMessage = { type: 'success', text: `Alerta a fost inserată la linia ${cursorPos.line}!` };
          }
        "
        @close="showCalloutBuilder = false"
      />

      <!-- ─── MODAL 6: INTERACTIVE CODE BUILDER ─── -->
      <StudioCodeBuilderModal
        v-if="showCodeBuilder"
        :cursor-line="cursorPos.line"
        @insert="
          (md) => {
            insertSnippet(md, true);
            showCodeBuilder = false;
            statusMessage = { type: 'success', text: `Blocul de cod a fost inserat la linia ${cursorPos.line}!` };
          }
        "
        @close="showCodeBuilder = false"
      />

      <!-- ─── MODAL 7: INTERACTIVE GALLERY BUILDER ─── -->
      <StudioGalleryBuilderModal
        v-if="showGalleryBuilder"
        :cursor-line="cursorPos.line"
        :available-assets="mediaAssets"
        @insert="
          (md) => {
            insertSnippet(md, true);
            showGalleryBuilder = false;
            statusMessage = { type: 'success', text: `Galeria a fost inserată la linia ${cursorPos.line}!` };
          }
        "
        @close="showGalleryBuilder = false"
      />

      <!-- ─── MODAL 8: RECYCLE BIN / TRASH ─── -->
      <AdminTrashModal
        :is-open="showTrashModal"
        @close="showTrashModal = false"
        @restored="fetchDocsList"
      />

    </div>
  </Teleport>
</template>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════════════
   VS CODE DARK CARBON STUDIO DESIGN SYSTEM
   ═══════════════════════════════════════════════════════════════════════════ */

.vs-root {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 90px);
  min-height: 720px;
  background: #090d16;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.06);
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #e2e8f0;
}

.vs-root--fullscreen {
  position: fixed !important;
  inset: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  max-width: 100vw !important;
  max-height: 100vh !important;
  z-index: 999999 !important;
  border-radius: 0 !important;
  border: none !important;
}

/* ── Titlebar ── */
.vs-titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 14px;
  background: #070a12;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  flex-shrink: 0;
  gap: 12px;
}

.vs-titlebar-left,
.vs-titlebar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.vs-nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  text-decoration: none;
  transition: all 0.15s ease;
}

.vs-nav-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #f8fafc;
}

.vs-titlebar-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #cbd5e1;
  letter-spacing: 0.3px;
}

.vs-breadcrumbs {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: #64748b;
  margin-left: 6px;
}

.vs-crumb {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.vs-crumb-sep {
  color: #475569;
}

.vs-crumb-active {
  color: #cbd5e1;
  font-weight: 600;
}

.vs-crumb-copy {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px 5px;
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.15s ease;
}

.vs-crumb-copy:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #cbd5e1;
}

.vs-divider-v {
  width: 1px;
  height: 18px;
  background: rgba(255, 255, 255, 0.08);
  margin: 0 4px;
}

.vs-divider-v-sm {
  width: 1px;
  height: 12px;
  background: rgba(255, 255, 255, 0.08);
  margin: 0 2px;
}

/* ── Segmented Control (View Modes) ── */
.vs-segmented-control {
  display: flex;
  align-items: center;
  background: #090d16;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 2px;
  gap: 2px;
}

.vs-seg-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  background: transparent;
  border: none;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 600;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.15s ease;
}

.vs-seg-btn:hover {
  color: #e2e8f0;
}

.vs-seg-btn--active {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* ── General Buttons ── */
.vs-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.74rem;
  font-weight: 600;
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: all 0.15s ease;
}

.vs-btn:hover {
  background: rgba(255, 255, 255, 0.09);
  color: #ffffff;
}

.vs-btn--sm {
  padding: 3px 8px;
  font-size: 0.7rem;
}

.vs-btn--primary {
  background: #4f46e5;
  color: #ffffff;
  border-color: #6366f1;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.vs-btn--primary:hover {
  background: #4338ca;
}

.vs-btn--dirty {
  background: #2563eb;
  border-color: #3b82f6;
}

.vs-btn--danger {
  color: #fb7185;
  border-color: rgba(244, 63, 94, 0.3);
}

.vs-btn--danger:hover {
  background: rgba(244, 63, 94, 0.15);
}

.vs-btn--blocked {
  background: rgba(244, 63, 94, 0.2);
  color: #fda4af;
  border-color: rgba(244, 63, 94, 0.4);
}

.vs-btn--bypass {
  font-size: 0.7rem;
  padding: 3px 7px;
  background: rgba(245, 158, 11, 0.15);
  color: #fcd34d;
  border-color: rgba(245, 158, 11, 0.3);
}

.vs-btn--bypass-active {
  background: #f59e0b;
  color: #000;
  font-weight: 700;
}

.vs-save-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ── Status Banner ── */
.vs-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 14px;
  font-size: 0.76rem;
  font-weight: 500;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.vs-banner--success {
  background: rgba(16, 185, 129, 0.12);
  color: #34d399;
  border-color: rgba(16, 185, 129, 0.25);
}

.vs-banner--error {
  background: rgba(244, 63, 94, 0.12);
  color: #fb7185;
  border-color: rgba(244, 63, 94, 0.25);
}

.vs-banner--info {
  background: rgba(59, 130, 246, 0.12);
  color: #60a5fa;
  border-color: rgba(59, 130, 246, 0.25);
}

.vs-banner-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.vs-banner-close {
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  opacity: 0.7;
}

.vs-banner-close:hover {
  opacity: 1;
}

/* ── Workspace Layout ── */
.vs-workspace {
  display: flex;
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: hidden;
}

/* ── Activity Bar (Far Left Strip 48px) ── */
.vs-activitybar {
  width: 48px;
  background: #060911;
  border-right: 1px solid rgba(255, 255, 255, 0.07);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  flex-shrink: 0;
  z-index: 20;
}

.vs-activitybar-top,
.vs-activitybar-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.vs-activity-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
}

.vs-activity-icon:hover {
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.04);
}

.vs-activity-icon--active {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
}

.vs-activity-icon--active::before {
  content: "";
  position: absolute;
  left: -6px;
  top: 8px;
  bottom: 8px;
  width: 3px;
  background: #6366f1;
  border-radius: 0 2px 2px 0;
}

/* ── Sidepanel (260px - 300px) ── */
.vs-sidepanel {
  width: 270px;
  background: #080c15;
  border-right: 1px solid rgba(255, 255, 255, 0.07);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
}

.vs-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.vs-panel-title {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.6px;
  color: #94a3b8;
  text-transform: uppercase;
}

.vs-panel-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.vs-icon-action {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.15s ease;
}

.vs-icon-action:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #f8fafc;
}

.vs-icon-action--danger:hover {
  color: #fb7185;
}

.vs-search-box {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  margin: 8px 10px;
  background: #0b0f19;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  gap: 6px;
}

.vs-search-ico {
  color: #64748b;
  flex-shrink: 0;
}

.vs-search-inp {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.74rem;
  color: #f8fafc;
  min-width: 0;
}

.vs-search-clr {
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
}

/* ── Tree View ── */
.vs-tree {
  flex: 1;
  overflow-y: auto;
  padding: 4px 6px;
}

.vs-tree-folder {
  margin-bottom: 3px;
}

.vs-tree-folder-head {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  border-radius: 5px;
  cursor: pointer;
  user-select: none;
  font-size: 0.75rem;
  font-weight: 600;
  color: #cbd5e1;
  transition: background 0.15s ease;
}

.vs-tree-folder-head:hover {
  background: rgba(255, 255, 255, 0.04);
}

.vs-folder-arrow {
  color: #64748b;
  flex-shrink: 0;
}

.vs-folder-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vs-folder-count {
  font-size: 0.65rem;
  padding: 1px 5px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  color: #94a3b8;
}

.vs-folder-actions {
  display: flex;
  align-items: center;
  gap: 3px;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.vs-tree-folder-head:hover .vs-folder-actions {
  opacity: 1;
}

.vs-folder-action-btn {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  border-radius: 4px;
  color: #cbd5e1;
  cursor: pointer;
  transition: all 0.15s ease;
}

.vs-folder-action-btn:hover {
  background: rgba(255, 255, 255, 0.18);
  color: #ffffff;
}

.vs-folder-add-btn {
  /* Inherits from vs-folder-action-btn */
}

.vs-tree-folder-children {
  padding-left: 14px;
  margin-top: 1px;
}

.vs-tree-file {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.73rem;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.12s ease;
  position: relative;
}

.vs-tree-file:hover {
  background: rgba(255, 255, 255, 0.04);
  color: #f1f5f9;
}

.vs-tree-file--active {
  background: rgba(99, 102, 241, 0.12);
  color: #ffffff;
  font-weight: 600;
}

.vs-file-icon {
  color: #64748b;
  flex-shrink: 0;
}

.vs-tree-file--active .vs-file-icon {
  color: #818cf8;
}

.vs-file-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vs-dirty-dot {
  width: 6px;
  height: 6px;
  background: #f59e0b;
  border-radius: 50%;
  flex-shrink: 0;
}

.vs-file-del-btn {
  opacity: 0;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #f43f5e;
  cursor: pointer;
}

.vs-tree-file:hover .vs-file-del-btn {
  opacity: 1;
}

.vs-tree-empty-folder {
  padding: 6px 8px;
  font-size: 0.7rem;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.vs-tree-empty-add {
  background: transparent;
  border: none;
  color: #818cf8;
  cursor: pointer;
  font-size: 0.68rem;
}

.vs-explorer-footer {
  display: flex;
  gap: 6px;
  padding: 8px 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: #070a12;
}

.vs-quick-action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 5px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 5px;
  color: #cbd5e1;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.vs-quick-action-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

/* ── Snippets Library Panel ── */
.vs-snippets-panel,
.vs-search-panel,
.vs-media-panel,
.vs-git-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.vs-snippets-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.vs-snippet-group {
  margin-bottom: 14px;
}

.vs-snippet-group-title {
  display: block;
  font-size: 0.68rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.vs-snippet-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.vs-snippet-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 7px 9px;
  background: #0b0f19;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 6px;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
}

.vs-snippet-card:hover {
  background: #111726;
  border-color: rgba(99, 102, 241, 0.3);
}

.vs-snippet-card strong {
  font-size: 0.73rem;
  color: #e2e8f0;
  margin-top: 3px;
}

.vs-snippet-card span {
  font-size: 0.65rem;
  color: #64748b;
}

/* ── Search Panel & Git Panel ── */
.vs-search-panel-body,
.vs-git-body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.vs-input-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.vs-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #94a3b8;
}

.vs-sublabel {
  font-size: 0.68rem;
  color: #64748b;
}

.vs-input-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.vs-panel-input {
  width: 100%;
  padding: 5px 8px;
  background: #0b0f19;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 5px;
  color: #f8fafc;
  font-size: 0.74rem;
  outline: none;
}

.vs-panel-input:focus {
  border-color: #6366f1;
}

.vs-match-btn {
  position: absolute;
  right: 4px;
  padding: 2px 5px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  font-size: 0.65rem;
  color: #64748b;
  cursor: pointer;
}

.vs-match-btn--active {
  background: rgba(99, 102, 241, 0.2);
  color: #818cf8;
  border-color: #6366f1;
}

.vs-btn-row {
  display: flex;
  gap: 6px;
  margin-top: 6px;
}

.vs-btn-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.vs-git-status-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: #0b0f19;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 6px;
  font-size: 0.72rem;
}

.vs-git-status-card strong {
  display: block;
  color: #e2e8f0;
}

.vs-git-status-card span {
  color: #64748b;
}

.vs-git-file-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 5px;
  font-size: 0.72rem;
}

.vs-git-file-name {
  color: #cbd5e1;
}

.vs-git-badge {
  font-size: 0.65rem;
  padding: 1px 6px;
  border-radius: 10px;
  font-weight: 600;
}

.vs-git-badge--modified {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.vs-git-badge--clean {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

/* ── Media Panel ── */
.vs-media-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.vs-media-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 8px;
  background: #0b0f19;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.vs-media-card:hover {
  background: #111726;
  border-color: rgba(99, 102, 241, 0.3);
}

.vs-media-thumb {
  width: 32px;
  height: 32px;
  object-fit: cover;
  border-radius: 4px;
}

.vs-media-video-thumb {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  color: #94a3b8;
}

.vs-media-info {
  flex: 1;
  overflow: hidden;
}

.vs-media-name {
  display: block;
  font-size: 0.72rem;
  color: #e2e8f0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vs-media-size {
  display: block;
  font-size: 0.65rem;
  color: #64748b;
}

.vs-media-insert-btn {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.06);
  border: none;
  border-radius: 4px;
  color: #cbd5e1;
  cursor: pointer;
}

/* ── Main Column (Tabs, Ribbon, Viewport, Dock, Statusbar) ── */
.vs-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: #080b12;
  overflow: hidden;
}

/* ── Tabs Bar (VS Code Tabs) ── */
.vs-tabbar {
  display: flex;
  align-items: center;
  background: #070910;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  overflow-x: auto;
  flex-shrink: 0;
}

.vs-tabs-list {
  display: flex;
  align-items: stretch;
  flex: 1;
  overflow-x: auto;
}

.vs-tab {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 12px;
  background: #070910;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.74rem;
  color: #94a3b8;
  cursor: pointer;
  user-select: none;
  transition: all 0.12s ease;
  position: relative;
  border-top: 2px solid transparent;
}

.vs-tab:hover {
  background: #0b0f19;
  color: #e2e8f0;
}

.vs-tab--active {
  background: #0a0e18;
  color: #ffffff;
  border-top: 2px solid #6366f1;
}

.vs-tab-icon {
  color: #64748b;
}

.vs-tab--active .vs-tab-icon {
  color: #818cf8;
}

.vs-tab-title {
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vs-tab-dirty {
  width: 6px;
  height: 6px;
  background: #f59e0b;
  border-radius: 50%;
}

.vs-tab-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: transparent;
  border: none;
  border-radius: 3px;
  color: #64748b;
  cursor: pointer;
  margin-left: 2px;
}

.vs-tab-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.vs-new-tab-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
}

.vs-new-tab-btn:hover {
  color: #ffffff;
}

/* ── Ribbon Toolbar ── */
.vs-ribbon {
  display: flex;
  align-items: center;
  padding: 4px 12px;
  background: #090d16;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  gap: 6px;
  overflow-x: auto;
  flex-shrink: 0;
}

.vs-ribbon-group {
  display: flex;
  align-items: center;
  gap: 3px;
}

.vs-ribbon-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 7px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 500;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.12s ease;
  white-space: nowrap;
}

.vs-ribbon-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.08);
  color: #f8fafc;
}

.vs-ribbon-btn--active {
  background: rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.3);
  color: #ffffff;
}

/* ── Find Bar ── */
.vs-findbar {
  padding: 6px 14px;
  background: #0b0f19;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.vs-findbar-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.vs-find-icon {
  color: #64748b;
}

.vs-find-input {
  padding: 4px 8px;
  background: #070a12;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  font-size: 0.74rem;
  color: #ffffff;
  outline: none;
}

.vs-find-input:focus {
  border-color: #6366f1;
}

.vs-find-match {
  padding: 3px 6px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  font-size: 0.65rem;
  color: #64748b;
  cursor: pointer;
}

.vs-find-match--active {
  background: rgba(99, 102, 241, 0.2);
  color: #818cf8;
}

.vs-find-count {
  font-size: 0.7rem;
  color: #94a3b8;
}

.vs-findbar-close {
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
  margin-left: auto;
}

/* ── Viewport Area ── */
.vs-viewport {
  flex: 1;
  display: flex;
  min-height: 0;
  position: relative;
  overflow: hidden;
}

.vs-viewport--dragging {
  outline: 2px dashed #6366f1;
  outline-offset: -4px;
}

.vs-drag-overlay {
  position: absolute;
  inset: 0;
  background: rgba(9, 13, 22, 0.95);
  backdrop-filter: blur(8px);
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #e2e8f0;
}

/* ── Empty State ── */
.vs-empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
}

.vs-empty-card {
  max-width: 420px;
  text-align: center;
  background: #090d16;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 30px 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.vs-empty-icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(99, 102, 241, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.vs-empty-card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #f8fafc;
  margin: 0 0 8px;
}

.vs-empty-card p {
  font-size: 0.8rem;
  color: #94a3b8;
  margin: 0 0 20px;
  line-height: 1.5;
}

.vs-empty-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}

/* ── Diff View ── */
.vs-diff-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #070a12;
  overflow: hidden;
}

.vs-diff-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: #090d16;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 0.74rem;
  font-weight: 600;
  color: #94a3b8;
}

.vs-diff-body {
  flex: 1;
  overflow-y: auto;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.78rem;
  line-height: 1.6;
}

.vs-diff-row {
  display: flex;
  padding: 1px 10px;
}

.vs-diff-row--added {
  background: rgba(16, 185, 129, 0.12);
  color: #6ee7b7;
}

.vs-diff-row--removed {
  background: rgba(244, 63, 94, 0.12);
  color: #fda4af;
}

.vs-diff-symbol {
  width: 20px;
  font-weight: 700;
  user-select: none;
}

.vs-diff-content {
  white-space: pre-wrap;
  word-break: break-all;
}

/* ── Editor Split (Textarea + Preview) ── */
.vs-editor-split {
  flex: 1;
  display: flex;
  min-height: 0;
}

.vs-editor-pane {
  flex: 1;
  display: flex;
  min-width: 0;
  background: #080b12;
  position: relative;
  border-right: 1px solid rgba(255, 255, 255, 0.07);
}

.vs-editor-pane--full {
  border-right: none;
}

.vs-gutter {
  width: 44px;
  background: #060910;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  overflow: hidden;
  user-select: none;
  padding-top: 10px;
  flex-shrink: 0;
}

.vs-gutter-line {
  height: 21px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  position: relative;
  cursor: pointer;
}

.vs-gutter-num {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.72rem;
  color: #475569;
}

.vs-gutter-line--active .vs-gutter-num {
  color: #cbd5e1;
  font-weight: 700;
}

.vs-gutter-marker {
  position: absolute;
  left: 6px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.vs-gutter-marker--error {
  background: #f43f5e;
}

.vs-gutter-marker--warning {
  background: #f59e0b;
}

.vs-gutter-marker--info {
  background: #3b82f6;
}

.vs-textarea {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  padding: 10px 14px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.8rem;
  line-height: 21px;
  color: #e2e8f0;
  white-space: pre-wrap;
  tab-size: 2;
  overflow-y: auto;
}

.vs-preview-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: #090d16;
  overflow-y: auto;
}

.vs-preview-pane--full {
  flex: 1;
}

/* ── Bottom Dock ── */
.vs-dock {
  height: 180px;
  background: #070a12;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.vs-dock-tabs {
  display: flex;
  align-items: center;
  background: #060810;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 0 10px;
  gap: 4px;
}

.vs-dock-tab {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 10px;
  background: transparent;
  border: none;
  font-size: 0.72rem;
  font-weight: 600;
  color: #94a3b8;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.vs-dock-tab--active {
  color: #ffffff;
  border-bottom-color: #6366f1;
}

.vs-dock-badge {
  font-size: 0.62rem;
  padding: 1px 5px;
  border-radius: 10px;
  font-weight: 700;
}

.vs-dock-badge--error {
  background: rgba(244, 63, 94, 0.2);
  color: #fb7185;
}

.vs-dock-badge--warn {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
}

.vs-dock-fix-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  padding: 3px 8px;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 4px;
  font-size: 0.68rem;
  font-weight: 600;
  color: #818cf8;
  cursor: pointer;
}

.vs-dock-close {
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
}

.vs-dock-body {
  flex: 1;
  overflow-y: auto;
  padding: 8px 12px;
}

.vs-problems-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.vs-no-problems {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  color: #94a3b8;
  padding: 12px 0;
}

.vs-problem-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.72rem;
  cursor: pointer;
}

.vs-problem-row:hover {
  background: rgba(255, 255, 255, 0.04);
}

.vs-prob-loc {
  font-family: ui-monospace, monospace;
  color: #94a3b8;
}

.vs-prob-msg {
  color: #e2e8f0;
  flex: 1;
}

.vs-prob-rule {
  color: #64748b;
}

.vs-prob-fix {
  font-size: 0.62rem;
  padding: 1px 5px;
  background: rgba(99, 102, 241, 0.2);
  color: #818cf8;
  border-radius: 4px;
}

.vs-dock-assets {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 8px;
}

.vs-dock-asset-thumb {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px;
  background: #090d16;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  cursor: pointer;
}

.vs-dock-asset-thumb img {
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.vs-dock-video-icon {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}

.vs-dock-asset-thumb span {
  font-size: 0.65rem;
  color: #94a3b8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  text-align: center;
  margin-top: 4px;
}

.vs-console-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: ui-monospace, monospace;
  font-size: 0.72rem;
  line-height: 1.6;
}

.vs-console-time {
  color: #475569;
}

.vs-console-tag {
  color: #818cf8;
}

/* ── Status Bar (Bottom 24px) ── */
.vs-statusbar {
  height: 24px;
  background: #05070e;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  font-size: 0.68rem;
  color: #94a3b8;
  flex-shrink: 0;
  user-select: none;
}

.vs-statusbar-left,
.vs-statusbar-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.vs-status-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.vs-status-item--btn {
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 3px;
}

.vs-status-item--btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

/* ── Modals ── */
.vs-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.vs-modal {
  width: 100%;
  max-width: 540px;
  background: #0f1422;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.vs-modal--lg {
  max-width: 760px;
}

.vs-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.vs-modal-pretitle {
  font-size: 0.65rem;
  font-weight: 700;
  color: #818cf8;
  letter-spacing: 0.6px;
  text-transform: uppercase;
}

.vs-modal-title {
  font-size: 1rem;
  font-weight: 700;
  color: #f8fafc;
  margin: 2px 0 0;
}

.vs-modal-close {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
}

.vs-modal-close:hover {
  color: #ffffff;
}

.vs-modal-tabs {
  display: flex;
  background: #090d16;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  padding: 0 16px;
  gap: 6px;
}

.vs-modal-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: transparent;
  border: none;
  font-size: 0.74rem;
  font-weight: 600;
  color: #94a3b8;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.vs-modal-tab--active {
  color: #ffffff;
  border-bottom-color: #6366f1;
}

.vs-modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-height: 65vh;
  overflow-y: auto;
}

.vs-form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.vs-form-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #cbd5e1;
}

.vs-form-input {
  padding: 7px 10px;
  background: #090d16;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #ffffff;
  font-size: 0.78rem;
  outline: none;
}

.vs-form-input:focus {
  border-color: #6366f1;
}

.vs-mono {
  font-family: ui-monospace, monospace;
}

.vs-form-hint {
  font-size: 0.68rem;
  color: #64748b;
}

.vs-form-hint code {
  color: #a5b4fc;
}

.vs-link-btn {
  background: transparent;
  border: none;
  color: #818cf8;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
}

.vs-link-btn:hover {
  text-decoration: underline;
}

.vs-templates-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.vs-template-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px;
  background: #090d16;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
}

.vs-template-card:hover {
  background: #111726;
  border-color: rgba(99, 102, 241, 0.3);
}

.vs-template-card--active {
  background: rgba(99, 102, 241, 0.15);
  border-color: #6366f1;
}

.vs-tmpl-icon {
  color: #818cf8;
  margin-bottom: 4px;
}

.vs-template-card strong {
  font-size: 0.78rem;
  color: #f8fafc;
}

.vs-template-card span {
  font-size: 0.68rem;
  color: #94a3b8;
  margin-top: 2px;
  line-height: 1.3;
}

/* ── Icon & Color Pickers ── */
.vs-icon-picker {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 6px;
}

.vs-icon-choice {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #090d16;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.12s ease;
}

.vs-icon-choice:hover {
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.2);
}

.vs-icon-choice--active {
  background: #6366f1;
  color: #ffffff;
  border-color: #818cf8;
}

.vs-color-picker {
  display: flex;
  gap: 8px;
}

.vs-color-choice {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
}

.vs-color-choice--active {
  border-color: #ffffff;
  transform: scale(1.15);
}

.vs-checkbox-group {
  margin-top: 6px;
}

.vs-checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.76rem;
  color: #cbd5e1;
  cursor: pointer;
}

.vs-checkbox-label input {
  accent-color: #6366f1;
}

.vs-modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 14px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  background: #090d16;
}

/* ── Media Modal Tabs ── */
.vs-upload-tab,
.vs-vault-tab,
.vs-embed-tab {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.vs-dropzone {
  border: 2px dashed rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.vs-dropzone:hover {
  border-color: #6366f1;
  background: rgba(99, 102, 241, 0.05);
}

.vs-dropzone-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.vs-dropzone-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #e2e8f0;
}

.vs-dropzone-sub {
  font-size: 0.7rem;
  color: #64748b;
}

.vs-dropzone-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
}

.vs-dropzone-preview img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}

.vs-vault-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.vs-filter-btns {
  display: flex;
  gap: 4px;
}

.vs-filter-btn {
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  font-size: 0.7rem;
  color: #94a3b8;
  cursor: pointer;
}

.vs-filter-btn--active {
  background: #6366f1;
  color: #ffffff;
  border-color: #818cf8;
}

.vs-vault-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 10px;
  max-height: 280px;
  overflow-y: auto;
}

.vs-vault-card {
  display: flex;
  flex-direction: column;
  padding: 6px;
  background: #090d16;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 6px;
  gap: 6px;
}

.vs-vault-card-thumb {
  height: 80px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vs-vault-card-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.vs-vault-video-badge {
  color: #94a3b8;
}

.vs-vault-card-meta {
  overflow: hidden;
}

.vs-vault-filename {
  display: block;
  font-size: 0.7rem;
  color: #e2e8f0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vs-vault-size {
  font-size: 0.62rem;
  color: #64748b;
}

.vs-vault-card-actions {
  display: flex;
  gap: 4px;
}

/* ── Versions Dropdown Menu ── */
.vs-dropdown-wrapper {
  position: relative;
}

.vs-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 6px;
  width: 260px;
  background: #0f1422;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
  z-index: 50;
  overflow: hidden;
}

.vs-dropdown-head {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #090d16;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 0.72rem;
  font-weight: 700;
  color: #94a3b8;
}

.vs-dropdown-scroll {
  max-height: 200px;
  overflow-y: auto;
  padding: 4px;
}

.vs-dropdown-item {
  width: 100%;
  padding: 6px 8px;
  background: transparent;
  border: none;
  border-radius: 4px;
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 2px;
  transition: background 0.12s ease;
}

.vs-dropdown-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.vs-version-actor {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.72rem;
  color: #f8fafc;
}

.vs-version-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.65rem;
  color: #64748b;
}

/* ── Animation ── */
.vs-spin {
  animation: vs-rotate 1s linear infinite;
}

@keyframes vs-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ── Category Editing & Manager Modal Styles ── */
.vs-modal-footer--split {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.vs-modal-footer-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.vs-btn--danger {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
}

.vs-btn--danger:hover {
  background: rgba(239, 68, 68, 0.25);
  border-color: rgba(239, 68, 68, 0.5);
  color: #ffffff;
}

.vs-cat-preview-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  margin-bottom: 16px;
}

.vs-cat-preview-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border: 1px solid;
  border-radius: 6px;
}

.vs-cat-preview-title {
  font-weight: 600;
  font-size: 0.85rem;
}

.vs-cat-preview-slug {
  font-family: monospace;
  font-size: 0.7rem;
  color: #94a3b8;
}

.vs-cat-preview-count {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.vs-cat-preview-num {
  font-size: 1.1rem;
  font-weight: 700;
  color: #f8fafc;
}

.vs-cat-preview-lbl {
  font-size: 0.65rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Category Manager Styles */
.vs-cat-mgr-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 14px;
  margin-bottom: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.vs-cat-mgr-desc {
  font-size: 0.8rem;
  color: #94a3b8;
  margin: 0;
  line-height: 1.4;
}

.vs-cat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  max-height: 480px;
  overflow-y: auto;
  padding-right: 4px;
}

.vs-cat-card {
  background: #0d121f;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-left: 3px solid #3b82f6;
  border-radius: 6px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.15s ease;
}

.vs-cat-card:hover {
  background: #111827;
  border-color: rgba(255, 255, 255, 0.14);
}

.vs-cat-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.vs-cat-card-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.vs-cat-card-info {
  flex: 1;
  min-width: 0;
}

.vs-cat-card-title {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 600;
  color: #f1f5f9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vs-cat-card-slug {
  font-family: monospace;
  font-size: 0.68rem;
  color: #64748b;
  display: block;
}

.vs-cat-card-badge {
  font-size: 0.65rem;
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  color: #94a3b8;
  white-space: nowrap;
}

.vs-cat-card-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-top: 6px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}
</style>
