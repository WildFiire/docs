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

// ── Constants ──
const CATEGORY_MAP: Record<string, { label: string; icon: string; color: string }> = {
  informatii: { label: 'Informații Generale', icon: 'lucide:book-open', color: 'var(--color-primary)' },
  currency: { label: 'Currency & Economie', icon: 'lucide:coins', color: '#f59e0b' },
  systems: { label: 'Sisteme & Mecanici', icon: 'lucide:cpu', color: '#8b5cf6' },
  market: { label: 'Market & Donații VIP', icon: 'lucide:shopping-bag', color: '#ec4899' },
  general: { label: 'General', icon: 'lucide:folder', color: '#6b7280' },
};

const TEMPLATES: Record<
  string,
  { label: string; desc: string; content: (title: string, category: string) => string }
> = {
  guide: {
    label: 'Ghid Standard',
    desc: 'Ghid pas-cu-pas cu introducere, pași și alerte',
    content: (title, category) => `---
title: "${title}"
description: "Ghid detaliat pentru configurarea și utilizarea modulului ${title} pe serverele Wildfire CS2."
category: "${category}"
date: "${new Date().toISOString().split('T')[0]}"
author: "iannC69"
tags: ["${category}", "ghid", "cs2"]
draft: false
---

# ${title}

Descriere introductivă completă despre acest modul sau funcționalitate.

> [!NOTE]
> Asigură-te că ești conectat pe serverul oficial de CS2 înainte de a rula comenzile menționate.

## 1.0 Prezentare Generală

Explică aici modul de funcționare și scopul principal al acestui sistem.

## 2.0 Pași de Utilizare

- **Pasul 1:** Deschide chat-ul în joc (\`Y\` sau \`U\`).
- **Pasul 2:** Introdu comanda principală specificată mai jos.
- **Pasul 3:** Confirmă selecția în meniul interactiv.

## 3.0 Comenzi Utile

| Comandă Chat | Comandă Consolă | Descriere |
| :--- | :--- | :--- |
| \`!meniu\` | \`css_meniu\` | Deschide interfața grafică |
| \`!ajutor\` | \`css_ajutor\` | Afișează instrucțiunile rapide |
`,
  },
  system: {
    label: 'Sistem Tehnic',
    desc: 'Specificație pentru plugin-uri, comenzi și cvar-uri',
    content: (title, category) => `---
title: "${title}"
description: "Documentație tehnică și specificații detaliate pentru sistemul ${title}."
category: "${category}"
date: "${new Date().toISOString().split('T')[0]}"
author: "iannC69"
tags: ["${category}", "sistem", "tehnic"]
draft: false
---

# ${title}

Documentație oficială pentru dezvoltatori, administratori și jucători avansați.

> [!IMPORTANT]
> Modificarea setărilor de sistem necesită drepturi de administrator (\`ADMIN_GENERIC\`).

## 1.0 Comenzi & Permisiuni

\`\`\`bash
# Exemplu comenzi de sistem
!settings_reload
!system_status
\`\`\`

## 2.0 Sintaxă & Argumente

| Parametru | Tip | Implicit | Descriere |
| :--- | :--- | :--- | :--- |
| \`enabled\` | Boolean | \`true\` | Activează/dezactivează mecanica |
| \`cooldown\` | Număr | \`30\` | Timpul de așteptare în secunde |
`,
  },
  market: {
    label: 'Pachet VIP & Shop',
    desc: 'Grade VIP, prețuri, avantaje exclusive și comenzi',
    content: (title, category) => `---
title: "${title}"
description: "Prezentare pachet, beneficii exclusive și comenzi dedicate pe Wildfire CS2."
category: "${category}"
date: "${new Date().toISOString().split('T')[0]}"
author: "iannC69"
tags: ["${category}", "vip", "market"]
draft: false
---

# ${title}

Descoperă toate avantajele și beneficiile incluse în gradul **${title}**.

> [!TIP]
> Gradele VIP se activează instantaneu pe server după confirmarea comenzii în magazin.

## 1.0 Beneficii Exclusive

- **Tag Chat Special:** \`[${title.toUpperCase()}]\` colorat în chat.
- **Bonus Credite:** +25% credite la fiecare rundă câștigată.
- **Acces la Skin-uri:** Deblochează toate cuțitele și mănușile exclusive.
- **Rezervare Slot:** Conectare garantată chiar dacă serverul este plin (\`99/99\`).

## 2.0 Comenzi VIP

- \`!vip\` — Deschide meniul de configurare VIP.
- \`!vips\` — Afișează membrii VIP conectați pe server.
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

// Search & Sidebar
const searchQuery = ref('');
const collapsedCategories = ref<Record<string, boolean>>({});
const sidebarOpen = ref(true);

// Creation Modal
const isCreatingNew = ref(false);
const showTrashModal = ref(false);
const newCategory = ref('informatii');
const newSlugName = ref('ghid-nou');
const newTitleName = ref('Ghid Nou');
const selectedTemplateKey = ref('guide');

// Editor View Mode
const viewMode = ref<'split' | 'edit' | 'preview' | 'diff'>('edit');
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
const showBottomDock = ref(true);

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

const findMatchCount = computed(() => {
  if (!findText.value || !activeContent.value) return 0;
  const flags = matchCase.value ? 'g' : 'gi';
  const escaped = findText.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matches = activeContent.value.match(new RegExp(escaped, flags));
  return matches ? matches.length : 0;
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
  Object.keys(CATEGORY_MAP).forEach((cat) => (groups[cat] = []));

  docs.value.forEach((doc) => {
    const matchSearch =
      !searchQuery.value ||
      doc.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      doc.slug.toLowerCase().includes(searchQuery.value.toLowerCase());

    if (matchSearch) {
      const cat = doc.category || 'informatii';
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

    if (typeof window !== 'undefined' && data.docs?.length > 0) {
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
  statusMessage.value = { type: 'success', text: 'Documentul a fost formatat și curățat!' };
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

function handleInsertYouTubeEmbed() {
  if (!mediaEmbedUrl.value.trim()) {
    statusMessage.value = { type: 'error', text: 'Introdu un link valid de YouTube sau video extern.' };
    return;
  }

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = mediaEmbedUrl.value.match(regExp);
  const videoId = match && match[2].length === 11 ? match[2] : null;
  const titleToUse = mediaAltTitle.value.trim() || 'Demonstrație Video YouTube';

  if (videoId) {
    const embedTag = `\n<DocVideo src="https://www.youtube.com/embed/${videoId}" title="${titleToUse}" />\n`;
    insertSnippet(embedTag);
    statusMessage.value = { type: 'success', text: 'Player-ul video YouTube a fost inserat!' };
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
    statusMessage.value = { type: 'error', text: 'Doar Super Root (iannC69) poate șterge fișiere din Asset Manager!' };
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
      text: `Salvare blocată: Documentul conține ${lintResult.value.errorCount} eroare(i) de sintaxă. Corectează erorile sau folosește Auto-Fix înainte de a trimite.`,
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

    // Clear draft from localStorage
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
      text: `Documentul \`${activeTab.value.slug}\` a fost salvat și sincronizat cu succes!${data.commitHash ? ` (Git: ${data.commitHash.substring(0, 7)})` : ''}`,
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

// Create New Document
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
    statusMessage.value = { type: 'success', text: `Documentul \`${fullSlug}\` a fost creat!` };
  } catch (err: any) {
    statusMessage.value = { type: 'error', text: err.message };
  } finally {
    saving.value = false;
  }
}

// Delete Document
async function handleDeleteDoc(e: MouseEvent, slugToDelete: string) {
  e.stopPropagation();
  if (!isRoot.value) {
    statusMessage.value = { type: 'error', text: 'Doar Super Root (iannC69) poate șterge documente!' };
    return;
  }

  if (!confirm(`Sigur vrei să ștergi definitiv documentul: ${slugToDelete}? Această acțiune este ireversibilă.`)) return;

  try {
    await api(`/api/admin/doc?slug=${encodeURIComponent(slugToDelete)}`, undefined, 'DELETE');
    statusMessage.value = { type: 'success', text: `Documentul ${slugToDelete} a fost șters cu succes!` };
    openTabs.value = openTabs.value.filter((t) => t.slug !== slugToDelete);
    if (activeTabSlug.value === slugToDelete) {
      activeTabSlug.value = '';
    }
    fetchDocsList();
  } catch (err: any) {
    statusMessage.value = { type: 'error', text: err.message };
  }
}

// Fullscreen & Zen Mode handler
async function toggleZenMode() {
  isFullscreen.value = !isFullscreen.value;
  if (typeof document !== 'undefined') {
    try {
      if (isFullscreen.value) {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen().catch(() => {});
        }
      } else {
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen().catch(() => {});
        }
      }
    } catch {}
  }
}

function handleFullscreenChange() {
  if (typeof document !== 'undefined') {
    if (!document.fullscreenElement && isFullscreen.value) {
      isFullscreen.value = false;
    }
  }
}

// Keyboard shortcuts
function handleGlobalKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    handleSave();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
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
}

function handleBeforeUnload(e: BeforeUnloadEvent) {
  if (openTabs.value.some((t) => t.isDirty)) {
    e.preventDefault();
    e.returnValue = 'Ai modificări nesalvate. Sigur vrei să părăsești pagina?';
    return e.returnValue;
  }
}

// Debounced draft saver
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
  fetchDocsList();
  fetchMediaAssets();
  window.addEventListener('keydown', handleGlobalKeydown);
  window.addEventListener('beforeunload', handleBeforeUnload);
  document.addEventListener('fullscreenchange', handleFullscreenChange);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown);
  window.removeEventListener('beforeunload', handleBeforeUnload);
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
});
</script>

<template>
  <Teleport to="body" :disabled="!isFullscreen">
    <div class="studio-ide-root" :class="{ 'studio-ide-root--fullscreen': isFullscreen }">
    <!-- ─── TOP CONTROL BAR ─── -->
    <div class="studio-ide-topbar">
      <div class="studio-ide-topbar-left">
        <!-- Back to Mission Control -->
        <a
          href="/admin"
          class="studio-ide-back-btn"
          title="Înapoi la Panoul Principal (Mission Control)"
          @click.prevent="router.go('/admin')"
        >
          <Icon icon="lucide:chevron-left" width="14" height="14" />
          <span>Mission Control</span>
        </a>

        <div class="studio-ide-divider" />

        <button
          type="button"
          class="studio-ide-btn"
          :class="{ 'studio-ide-btn--active': sidebarOpen }"
          title="Toggle File Explorer (Ctrl+Shift+B)"
          @click="sidebarOpen = !sidebarOpen"
        >
          <Icon icon="lucide:folder" width="14" height="14" />
          <span class="studio-ide-btn-label">Explorer</span>
        </button>

        <div class="studio-ide-divider" />

        <!-- New Document Button -->
        <button
          type="button"
          class="studio-ide-btn studio-ide-btn--primary"
          title="Creează Document Nou"
          @click="isCreatingNew = true"
        >
          <Icon icon="lucide:plus" width="14" height="14" />
          <span>Document Nou</span>
        </button>

        <!-- Media & Video Vault Button -->
        <button
          type="button"
          class="studio-ide-btn"
          title="Centru Media & Video (Imagini, GIF-uri, Video-uri & Galerie)"
          @click="showMediaModal = true; mediaModalTab = 'upload'"
        >
          <Icon icon="lucide:image" width="14" height="14" />
          <span>Media & Video</span>
        </button>
      </div>

      <!-- View Switchers -->
      <div class="studio-ide-view-modes">
        <button
          type="button"
          class="studio-ide-mode-btn"
          :class="{ 'studio-ide-mode-btn--active': viewMode === 'split' }"
          title="Vizualizare Split Editor + Live Preview"
          @click="viewMode = 'split'"
        >
          <Icon icon="lucide:split" width="14" height="14" />
          <span>Split IDE</span>
        </button>
        <button
          type="button"
          class="studio-ide-mode-btn"
          :class="{ 'studio-ide-mode-btn--active': viewMode === 'edit' }"
          title="Doar Editor Cod"
          @click="viewMode = 'edit'"
        >
          <Icon icon="lucide:code" width="14" height="14" />
          <span>Cod</span>
        </button>
        <button
          type="button"
          class="studio-ide-mode-btn"
          :class="{ 'studio-ide-mode-btn--active': viewMode === 'preview' }"
          title="Doar Previzualizare"
          @click="viewMode = 'preview'"
        >
          <Icon icon="lucide:eye" width="14" height="14" />
          <span>Preview</span>
        </button>
        <button
          type="button"
          class="studio-ide-mode-btn"
          :class="{ 'studio-ide-mode-btn--active': viewMode === 'diff' }"
          title="Comparație Git Diff"
          @click="viewMode = 'diff'"
        >
          <Icon icon="lucide:git-compare" width="14" height="14" />
          <span>Diff</span>
        </button>
      </div>

      <!-- Top Right Actions -->
      <div class="studio-ide-topbar-right">
        <!-- Versions Dropdown -->
        <div v-if="versions.length > 0" ref="versionsMenuRef" class="studio-ide-relative">
          <button
            type="button"
            class="studio-ide-btn"
            title="Istoric Versiuni & Revisions"
            @click="showVersionsMenu = !showVersionsMenu"
          >
            <Icon icon="lucide:history" width="14" height="14" />
            <span>Istoric ({{ versions.length }})</span>
          </button>
          <div v-if="showVersionsMenu" class="studio-ide-dropdown">
            <div class="studio-ide-dropdown-header">
              <Icon icon="lucide:history" width="13" height="13" />
              <span>Versiuni Salvate</span>
            </div>
            <div class="studio-ide-dropdown-list">
              <button
                v-for="v in versions"
                :key="v.id"
                type="button"
                class="studio-ide-dropdown-item"
                @click="restoreVersion(v)"
              >
                <div class="studio-ide-version-title">
                  <Icon icon="lucide:user" width="12" height="12" />
                  <strong>{{ v.savedBy }}</strong>
                </div>
                <div class="studio-ide-version-time">
                  <Icon icon="lucide:clock" width="11" height="11" />
                  <span>{{ new Date(v.timestamp).toLocaleString('ro-RO') }}</span>
                  <span>· {{ v.charCount }} chars</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Format Document Button -->
        <button
          type="button"
          class="studio-ide-btn"
          title="Formatează & Curăță Documentul (Alt+Shift+F)"
          @click="handleFormatDocument"
        >
          <Icon icon="lucide:sparkles" width="14" height="14" />
          <span>Format</span>
        </button>

        <!-- Fullscreen Toggle -->
        <button
          type="button"
          class="studio-ide-btn"
          :class="{ 'studio-ide-btn--active': isFullscreen }"
          :title="isFullscreen ? 'Ieși din Zen / Fullscreen (Esc)' : 'Mod Zen Fullscreen (Alt+Z / F11)'"
          @click="toggleZenMode"
        >
          <Icon :icon="isFullscreen ? 'lucide:minimize-2' : 'lucide:maximize-2'" width="14" height="14" />
          <span class="studio-ide-btn-label">{{ isFullscreen ? 'Fereastră' : 'Zen' }}</span>
        </button>

        <!-- Open in Dedicated Window / Tab -->
        <a
          href="/admin/content"
          target="_blank"
          rel="noopener noreferrer"
          class="studio-ide-btn"
          title="Deschide Content Studio în Fereastră / Tab Separat"
        >
          <Icon icon="lucide:external-link" width="14" height="14" />
          <span class="studio-ide-btn-label">Tab Nou</span>
        </a>

        <!-- SAVE BUTTON WITH GUARDRAIL ENFORCEMENT -->
        <button
          v-if="lintResult.hasErrors && !bypassGuardrail"
          type="button"
          class="studio-ide-save-btn studio-ide-save-btn--blocked"
          :title="`Salvare Blocată: ${lintResult.errorCount} erori de sintaxă detectate.`"
          @click="handleSave"
        >
          <Icon icon="lucide:shield-alert" width="14" height="14" />
          <span>Blocat ({{ lintResult.errorCount }} Erori)</span>
        </button>
        <div v-else style="display: flex; gap: 6px;">
          <button
            v-if="activeTab?.isDirty"
            type="button"
            class="studio-ide-btn"
            title="Anulează modificările nesalvate (Discard)"
            style="color: hsl(0 84% 60%); border-color: rgba(244, 63, 94, 0.3);"
            @click="handleDiscardChanges"
          >
            <Icon icon="lucide:x" width="14" height="14" />
            <span>Anulează</span>
          </button>
          <button
            type="button"
            class="studio-ide-save-btn"
            :class="{ 'studio-ide-save-btn--dirty': activeTab?.isDirty }"
            :disabled="saving || !activeTab"
            title="Salvează & Efectuează Commit (Ctrl+S)"
            @click="handleSave"
          >
            <Icon :icon="saving ? 'lucide:refresh-cw' : 'lucide:save'" width="14" height="14" :class="{ 'studio-spin': saving }" />
            <span>{{ saving ? 'Se salvează...' : activeTab?.isDirty ? 'Salvează Modificări' : 'Salvat' }}</span>
          </button>
        </div>

        <!-- Root Super Admin Guardrail Bypass Lock Toggle -->
        <button
          v-if="isRoot && lintResult.hasErrors"
          type="button"
          class="studio-ide-bypass-btn"
          :class="{ 'studio-ide-bypass-btn--active': bypassGuardrail }"
          title="Root Override: Comută bypass guardrail pentru salvare forțată"
          @click="bypassGuardrail = !bypassGuardrail"
        >
          <Icon :icon="bypassGuardrail ? 'lucide:unlock' : 'lucide:lock'" width="12" height="12" />
          <span>{{ bypassGuardrail ? 'Bypass Activ' : 'Override' }}</span>
        </button>
      </div>
    </div>

    <!-- ─── STATUS NOTIFICATION BANNER ─── -->
    <div v-if="statusMessage" class="studio-ide-banner" :class="`studio-ide-banner--${statusMessage.type}`">
      <div class="studio-ide-banner-content">
        <Icon v-if="statusMessage.type === 'success'" icon="lucide:check-circle-2" width="14" height="14" />
        <Icon v-else-if="statusMessage.type === 'error'" icon="lucide:alert-circle" width="14" height="14" />
        <Icon v-else icon="lucide:info" width="14" height="14" />
        <span>{{ statusMessage.text }}</span>
      </div>
      <button type="button" class="studio-ide-banner-close" @click="statusMessage = null">
        <Icon icon="lucide:x" width="13" height="13" />
      </button>
    </div>

    <!-- ─── MAIN WORKSPACE (Explorer + Editor + Preview) ─── -->
    <div class="studio-ide-body">
      <!-- ── SIDEBAR / FILE EXPLORER ── -->
      <aside v-if="sidebarOpen" class="studio-ide-sidebar">
        <div style="padding: 12px 12px 0 12px; display: flex; gap: 6px; align-items: center;">
          <div class="studio-ide-sidebar-search" style="margin: 0; flex: 1;">
            <Icon icon="lucide:search" width="13" height="13" class="studio-ide-search-icon" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Caută în ghiduri..."
              class="studio-ide-search-input"
            />
            <button v-if="searchQuery" type="button" class="studio-ide-search-clear" @click="searchQuery = ''">
              <Icon icon="lucide:x" width="11" height="11" />
            </button>
          </div>
          <button
            v-if="isRoot"
            type="button"
            style="width: 28px; height: 28px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 6px; color: var(--text-muted); display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;"
            title="Recycle Bin (Documente Șterse)"
            @click="showTrashModal = true"
          >
            <Icon icon="lucide:trash-2" width="13" height="13" />
          </button>
        </div>

        <div class="studio-ide-tree" style="margin-top: 12px;">
          <template v-for="(catDocs, catKey) in groupedDocs" :key="catKey">
            <div v-if="!(catDocs.length === 0 && searchQuery)" class="studio-ide-tree-group">
              <button
                type="button"
                class="studio-ide-tree-group-header"
                @click="collapsedCategories[catKey] = !collapsedCategories[catKey]"
              >
                <Icon
                  :icon="collapsedCategories[catKey] ? 'lucide:chevron-right' : 'lucide:chevron-down'"
                  width="13"
                  height="13"
                />
                <Icon
                  :icon="CATEGORY_MAP[catKey]?.icon || 'lucide:folder'"
                  width="14"
                  height="14"
                  :style="{ color: CATEGORY_MAP[catKey]?.color || 'var(--color-primary)' }"
                />
                <span class="studio-ide-tree-group-title">{{ CATEGORY_MAP[catKey]?.label || catKey }}</span>
                <span class="studio-ide-tree-badge">{{ catDocs.length }}</span>
              </button>

              <div v-if="!collapsedCategories[catKey]" class="studio-ide-tree-items">
                <div v-for="doc in catDocs" :key="doc.slug" style="display: flex; align-items: center;">
                  <button
                    type="button"
                    class="studio-ide-tree-item"
                    :class="{ 'studio-ide-tree-item--active': activeTabSlug === doc.slug }"
                    :style="{ flex: 1, paddingRight: isRoot ? '24px' : undefined }"
                    @click="openDocument(doc.slug)"
                  >
                    <Icon icon="lucide:file-code" width="13" height="13" class="studio-ide-tree-file-icon" />
                    <span class="studio-ide-tree-file-name" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                      {{ doc.title || doc.slug }}
                    </span>
                    <span
                      v-if="openTabs.find((t) => t.slug === doc.slug)?.isDirty"
                      class="studio-ide-dirty-dot"
                      title="Modificări nesalvate"
                      style="margin-left: auto; margin-right: 4px;"
                    />
                  </button>
                  <button
                    v-if="isRoot"
                    type="button"
                    style="background: transparent; border: none; color: hsl(0 84% 60%); cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center; margin-left: -28px; z-index: 10;"
                    title="Șterge definitiv documentul"
                    @click="handleDeleteDoc($event, doc.slug)"
                  >
                    <Icon icon="lucide:trash-2" width="12" height="12" />
                  </button>
                </div>
              </div>
            </div>
          </template>
        </div>
      </aside>

      <!-- ── EDITOR & PREVIEW WORKSPACE ── -->
      <div class="studio-ide-main-col">
        <!-- TABS HEADER BAR -->
        <div class="studio-ide-tabs-bar">
          <div class="studio-ide-tabs-list">
            <div
              v-for="tab in openTabs"
              :key="tab.slug"
              class="studio-ide-tab"
              :class="{ 'studio-ide-tab--active': tab.slug === activeTabSlug }"
              @click="activeTabSlug = tab.slug"
            >
              <Icon icon="lucide:file-text" width="13" height="13" class="studio-ide-tab-icon" />
              <span class="studio-ide-tab-title">{{ tab.title }}</span>
              <span v-if="tab.isDirty" class="studio-ide-tab-dirty-indicator" title="Nesalvat" />
              <button
                type="button"
                class="studio-ide-tab-close"
                title="Închide fișierul"
                @click.stop="closeTab(tab.slug, $event)"
              >
                <Icon icon="lucide:x" width="11" height="11" />
              </button>
            </div>
          </div>

          <button
            type="button"
            class="studio-ide-new-tab-btn"
            title="Adaugă Document Nou"
            @click="isCreatingNew = true"
          >
            <Icon icon="lucide:plus" width="13" height="13" />
          </button>
        </div>

        <!-- SNIPPET & MARKDOWN TOOLBAR -->
        <div v-if="activeTab" class="studio-ide-toolbar">
          <div class="studio-ide-toolbar-group">
            <button type="button" class="studio-ide-tool-btn" title="Bold (Ctrl+B)" @click="insertSnippet('**text îngroșat**')">
              <Icon icon="lucide:bold" width="13" height="13" />
            </button>
            <button type="button" class="studio-ide-tool-btn" title="Italic (Ctrl+I)" @click="insertSnippet('*text cursiv*')">
              <Icon icon="lucide:italic" width="13" height="13" />
            </button>
            <button type="button" class="studio-ide-tool-btn" title="Heading 1" @click="insertSnippet('# Titlu H1\n')">
              <Icon icon="lucide:heading-1" width="13" height="13" />
            </button>
            <button type="button" class="studio-ide-tool-btn" title="Heading 2" @click="insertSnippet('## 1.0 Secțiune H2\n')">
              <Icon icon="lucide:heading-2" width="13" height="13" />
            </button>
            <button type="button" class="studio-ide-tool-btn" title="Heading 3" @click="insertSnippet('### 1.1 Subsecțiune H3\n')">
              <Icon icon="lucide:heading-3" width="13" height="13" />
            </button>
          </div>

          <div class="studio-ide-toolbar-divider" />

          <div class="studio-ide-toolbar-group">
            <button
              type="button"
              class="studio-ide-tool-btn"
              title="GitHub Alert Note"
              @click="calloutInitialType = 'NOTE'; showCalloutBuilder = true"
            >
              <Icon icon="lucide:info" width="13" height="13" />
              <span class="studio-ide-tool-text">Note</span>
            </button>
            <button
              type="button"
              class="studio-ide-tool-btn"
              title="GitHub Alert Tip"
              @click="calloutInitialType = 'TIP'; showCalloutBuilder = true"
            >
              <Icon icon="lucide:sparkles" width="13" height="13" />
              <span class="studio-ide-tool-text">Tip</span>
            </button>
            <button
              type="button"
              class="studio-ide-tool-btn"
              title="GitHub Alert Important"
              @click="calloutInitialType = 'IMPORTANT'; showCalloutBuilder = true"
            >
              <Icon icon="lucide:triangle-alert" width="13" height="13" />
              <span class="studio-ide-tool-text">Important</span>
            </button>
            <button
              type="button"
              class="studio-ide-tool-btn"
              title="Deschide Generator Bloc de Cod"
              @click="showCodeBuilder = true"
            >
              <Icon icon="lucide:code" width="13" height="13" />
              <span class="studio-ide-tool-text">Code</span>
            </button>
            <button
              type="button"
              class="studio-ide-tool-btn"
              title="Deschide Generator Interactiv de Tabel"
              @click="showTableBuilder = true"
            >
              <Icon icon="lucide:table" width="13" height="13" />
              <span class="studio-ide-tool-text">Tabel</span>
            </button>
          </div>

          <div class="studio-ide-toolbar-divider" />

          <div class="studio-ide-toolbar-group">
            <button
              type="button"
              class="studio-ide-tool-btn"
              title="Încarcă sau Inserează Imagine / GIF"
              @click="showMediaModal = true; mediaModalTab = 'upload'"
            >
              <Icon icon="lucide:image" width="13" height="13" />
              <span class="studio-ide-tool-text">Imagine</span>
            </button>
            <button
              type="button"
              class="studio-ide-tool-btn"
              title="Încarcă sau Inserează Video MP4 / YouTube"
              @click="showMediaModal = true; mediaModalTab = 'embed'"
            >
              <Icon icon="lucide:play" width="13" height="13" />
              <span class="studio-ide-tool-text">Video</span>
            </button>
            <button
              type="button"
              class="studio-ide-tool-btn"
              title="Deschide Constructor Galerie Multi-Slide"
              @click="showGalleryBuilder = true"
            >
              <Icon icon="lucide:layers" width="13" height="13" />
              <span class="studio-ide-tool-text">Galerie</span>
            </button>
          </div>

          <div class="studio-ide-toolbar-divider" />

          <!-- Find Bar Toggle -->
          <button
            type="button"
            class="studio-ide-tool-btn"
            :class="{ 'studio-ide-tool-btn--active': showFindBar }"
            title="Căutare și Înlocuire (Ctrl+F)"
            @click="showFindBar = !showFindBar"
          >
            <Icon icon="lucide:search" width="13" height="13" />
            <span class="studio-ide-tool-text">Find / Replace</span>
          </button>
        </div>

        <!-- FIND & REPLACE BAR -->
        <div v-if="showFindBar" class="studio-ide-findbar">
          <div class="studio-ide-findbar-row">
            <Icon icon="lucide:search" width="13" height="13" class="studio-ide-find-icon" />
            <input
              v-model="findText"
              type="text"
              placeholder="Caută în text..."
              class="studio-ide-find-input"
            />
            <button
              type="button"
              class="studio-ide-find-btn"
              :class="{ 'studio-ide-find-btn--active': matchCase }"
              title="Match Case (Aa)"
              @click="matchCase = !matchCase"
            >
              Aa
            </button>
            <span class="studio-ide-find-count">
              {{ findText ? `${findMatchCount} potriviri` : '0 potriviri' }}
            </span>
            <input
              v-model="replaceText"
              type="text"
              placeholder="Înlocuiește cu..."
              class="studio-ide-find-input"
            />
            <button
              type="button"
              class="studio-ide-action-btn"
              :disabled="!findMatchCount"
              @click="handleReplaceCurrent"
            >
              Înlocuiește
            </button>
            <button
              type="button"
              class="studio-ide-action-btn"
              :disabled="!findMatchCount"
              @click="handleReplaceAll"
            >
              Tot
            </button>
            <button type="button" class="studio-ide-findbar-close" @click="showFindBar = false">
              <Icon icon="lucide:x" width="13" height="13" />
            </button>
          </div>
        </div>

        <!-- EDITOR / PREVIEW / DIFF SPLIT VIEWPORT -->
        <div
          class="studio-ide-viewport"
          :class="{ 'studio-ide-viewport--dragging': isDraggingFile }"
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
          @drop="handleDrop"
        >
          <div v-if="isDraggingFile" class="studio-ide-drag-overlay">
            <Icon icon="lucide:upload" width="36" height="36" class="studio-ide-drag-icon" />
            <span class="studio-ide-drag-title">Trage fișierul aici pentru a-l insera</span>
            <span class="studio-ide-drag-subtitle">Imaginile vor fi încărcate în `/media/` și inserate automat</span>
          </div>

          <div v-if="!activeTab" class="studio-ide-empty-state">
            <div class="studio-ide-empty-card">
              <div class="studio-ide-empty-icon-box">
                <Icon icon="lucide:file-code" width="36" height="36" class="studio-ide-empty-icon" />
              </div>
              <h3 class="studio-ide-empty-title">Niciun Document Selectat</h3>
              <p class="studio-ide-empty-desc">
                Alege un ghid din panoul din stânga sau creează un articol nou pentru a începe editarea în Studio IDE.
              </p>
              <button
                type="button"
                class="studio-ide-btn studio-ide-btn--primary studio-ide-empty-btn"
                @click="isCreatingNew = true"
              >
                <Icon icon="lucide:plus" width="14" height="14" />
                <span>Creează Document Nou</span>
              </button>
            </div>
          </div>

          <!-- DIFF VIEW -->
          <div v-else-if="viewMode === 'diff'" class="studio-ide-diff-view">
            <div class="studio-ide-diff-header">
              <span>Comparație Versiune Modificată față de Versiunea Salvată pe Disc</span>
            </div>
            <div class="studio-ide-diff-body">
              <div
                v-for="(chunk, i) in computeLineDiff(activeOriginalContent, activeContent)"
                :key="i"
                class="studio-ide-diff-line"
                :class="`studio-ide-diff-line--${chunk.type}`"
              >
                <span class="studio-ide-diff-symbol">
                  {{ chunk.type === 'added' ? '+' : chunk.type === 'removed' ? '-' : ' ' }}
                </span>
                <span class="studio-ide-diff-text">{{ chunk.value }}</span>
              </div>
            </div>
          </div>

          <!-- SPLIT CONTAINER (EDITOR & PREVIEW) -->
          <div v-else class="studio-ide-split-container">
            <!-- EDITOR PANE -->
            <div
              v-if="viewMode === 'split' || viewMode === 'edit'"
              class="studio-ide-editor-pane"
              :class="{ 'studio-ide-editor-pane--full': viewMode === 'edit' }"
            >
              <!-- GUTTER WITH LINE NUMBERS & ERROR ICONS -->
              <div ref="gutterRef" class="studio-ide-gutter">
                <div
                  v-for="idx in lineCount"
                  :key="idx"
                  class="studio-ide-gutter-row"
                  :class="{ 'studio-ide-gutter-row--active': cursorPos.line === idx }"
                  @click="jumpToLine(idx)"
                >
                  <span class="studio-ide-line-num">{{ idx }}</span>
                  <span
                    v-if="lintResult.diagnostics.find((d) => d.line === idx)"
                    class="studio-ide-gutter-marker"
                    :class="`studio-ide-gutter-marker--${lintResult.diagnostics.find((d) => d.line === idx)?.severity}`"
                    :title="`L${idx}: ${lintResult.diagnostics.find((d) => d.line === idx)?.message}`"
                  />
                </div>
              </div>

              <!-- MAIN TEXTAREA -->
              <textarea
                ref="editorRef"
                :value="activeContent"
                class="studio-ide-textarea"
                placeholder="Scrie documentația în Markdown / MDX..."
                spellcheck="false"
                @input="updateActiveContent(($event.target as HTMLTextAreaElement).value); handleCursorActivity()"
                @keyup="handleCursorActivity"
                @click="handleCursorActivity"
                @scroll="handleEditorScroll"
                @paste="handlePaste"
              />

              <!-- FLOATING LINE ACTION TOOLBAR TRACKING CARET LINE -->
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
              class="studio-ide-preview-pane"
              :class="{ 'studio-ide-preview-pane--full': viewMode === 'preview' }"
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

        <!-- ─── BOTTOM DOCK (PROBLEMS, LOGS, DIFF, ASSET VAULT) ─── -->
        <div v-if="activeTab && showBottomDock" class="studio-ide-dock">
          <div class="studio-ide-dock-tabs">
            <button
              type="button"
              class="studio-ide-dock-tab"
              :class="{ 'studio-ide-dock-tab--active': bottomDockTab === 'problems' }"
              @click="bottomDockTab = 'problems'"
            >
              <Icon icon="lucide:alert-circle" width="12" height="12" />
              <span>Problems</span>
              <span v-if="lintResult.errorCount > 0" class="studio-ide-dock-badge studio-ide-dock-badge--error">
                {{ lintResult.errorCount }}
              </span>
              <span v-if="lintResult.warningCount > 0" class="studio-ide-dock-badge studio-ide-dock-badge--warn">
                {{ lintResult.warningCount }}
              </span>
            </button>

            <button
              type="button"
              class="studio-ide-dock-tab"
              :class="{ 'studio-ide-dock-tab--active': bottomDockTab === 'diff' }"
              @click="bottomDockTab = 'diff'"
            >
              <Icon icon="lucide:git-compare" width="12" height="12" />
              <span>Git Diff</span>
            </button>

            <button
              type="button"
              class="studio-ide-dock-tab"
              :class="{ 'studio-ide-dock-tab--active': bottomDockTab === 'assets' }"
              @click="bottomDockTab = 'assets'"
            >
              <Icon icon="lucide:image" width="12" height="12" />
              <span>Asset Gallery ({{ mediaAssets.length }})</span>
            </button>

            <button
              type="button"
              class="studio-ide-dock-tab"
              :class="{ 'studio-ide-dock-tab--active': bottomDockTab === 'console' }"
              @click="bottomDockTab = 'console'"
            >
              <Icon icon="lucide:terminal" width="12" height="12" />
              <span>Integrity Console</span>
            </button>

            <!-- Auto-Fix button inside Dock -->
            <button
              v-if="lintResult.hasErrors"
              type="button"
              class="studio-ide-dock-fix-btn"
              title="Repară automat problemele de sintaxă reparabile"
              @click="handleAutoFix"
            >
              <Icon icon="lucide:wand-2" width="12" height="12" />
              <span>Auto-Fix Issues</span>
            </button>

            <button
              type="button"
              class="studio-ide-dock-close"
              title="Ascunde Dock"
              @click="showBottomDock = false"
            >
              <Icon icon="lucide:chevron-down" width="14" height="14" />
            </button>
          </div>

          <!-- DOCK CONTENT BODY -->
          <div class="studio-ide-dock-body">
            <!-- Problems -->
            <div v-if="bottomDockTab === 'problems'" class="studio-ide-problems-list">
              <div v-if="lintResult.diagnostics.length === 0" class="studio-ide-no-problems">
                <Icon icon="lucide:check-circle-2" width="16" height="16" class="text-emerald-400" />
                <span>Nicio problemă detectată în document. Sintaxa Markdown / MDX este 100% curată și validată.</span>
              </div>
              <div
                v-for="diag in lintResult.diagnostics"
                :key="diag.id"
                class="studio-ide-problem-row"
                :class="`studio-ide-problem-row--${diag.severity}`"
                @click="jumpToLine(diag.line)"
              >
                <Icon v-if="diag.severity === 'error'" icon="lucide:x-circle" width="14" height="14" class="studio-ide-prob-icon--error" />
                <Icon v-else-if="diag.severity === 'warning'" icon="lucide:triangle-alert" width="14" height="14" class="studio-ide-prob-icon--warn" />
                <Icon v-else icon="lucide:info" width="14" height="14" class="studio-ide-prob-icon--info" />
                <span class="studio-ide-prob-loc">Ln {{ diag.line }}, Col {{ diag.column }}</span>
                <span class="studio-ide-prob-msg">{{ diag.message }}</span>
                <span class="studio-ide-prob-rule">[{{ diag.rule }}]</span>
                <span v-if="diag.fixable" class="studio-ide-prob-fix-tag">Auto-fixabil</span>
              </div>
            </div>

            <!-- Diff -->
            <div v-else-if="bottomDockTab === 'diff'" class="studio-ide-diff-mini">
              <div
                v-for="(chunk, i) in computeLineDiff(activeOriginalContent, activeContent)"
                :key="i"
                class="studio-ide-diff-line"
                :class="`studio-ide-diff-line--${chunk.type}`"
              >
                <span class="studio-ide-diff-symbol">{{ chunk.type === 'added' ? '+' : chunk.type === 'removed' ? '-' : ' ' }}</span>
                <span class="studio-ide-diff-text">{{ chunk.value }}</span>
              </div>
            </div>

            <!-- Assets -->
            <div v-else-if="bottomDockTab === 'assets'" class="studio-ide-assets-panel">
              <div
                class="studio-ide-assets-header"
                style="display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; border-bottom: 1px solid var(--glass-border); background: rgba(0,0,0,0.2);"
              >
                <div
                  class="admin-search-wrapper"
                  style="margin: 0; width: 300px; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 6px; display: flex; align-items: center; padding: 4px 8px;"
                >
                  <Icon icon="lucide:search" width="14" height="14" style="color: #a1a1aa; margin-right: 8px;" />
                  <input
                    v-model="mediaVaultSearch"
                    type="text"
                    placeholder="Caută în asset-uri..."
                    style="border: none; background: transparent; outline: none; color: #fff; width: 100%; font-size: 12px;"
                  />
                </div>
                <span style="font-size: 12px; color: #a1a1aa; font-weight: 500;">
                  {{ filteredVaultAssets.length }} asset(uri) găsite
                </span>
              </div>
              <div
                class="studio-ide-assets-grid"
                style="padding: 16px; max-height: 250px; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px;"
              >
                <div
                  v-for="asset in filteredVaultAssets"
                  :key="asset.url"
                  class="studio-ide-asset-card-wrapper"
                  style="position: relative;"
                >
                  <div
                    class="studio-ide-asset-card"
                    :title="`Click pentru a insera ${asset.filename}`"
                    @click="
                      if (asset.type === 'video') {
                        insertSnippet(`\n<DocVideo src='${asset.url}' title='${asset.filename}' />\n`);
                      } else {
                        insertSnippet(`\n![${asset.filename}](${asset.url})\n`);
                      }
                    "
                  >
                    <div
                      v-if="asset.type === 'video'"
                      style="height: 80px; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.5); border-radius: 4px;"
                    >
                      <Icon icon="lucide:film" width="24" height="24" style="color: #a1a1aa;" />
                    </div>
                    <img v-else :src="asset.url" :alt="asset.filename" class="studio-ide-asset-thumb" />
                    <span style="display: block; font-size: 11px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; margin-top: 4px; color: #e4e4e7;">
                      {{ asset.filename }}
                    </span>
                  </div>
                  <button
                    v-if="isRoot"
                    type="button"
                    title="Șterge definitiv acest asset (Root-Only)"
                    style="position: absolute; top: -6px; right: -6px; background: hsl(0 84% 60%); color: #fff; border: none; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.5);"
                    @click="asset.relativePath && handleDeleteAsset($event, asset.relativePath)"
                  >
                    <Icon icon="lucide:trash-2" width="10" height="10" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Console -->
            <div v-else-if="bottomDockTab === 'console'" class="studio-ide-console-view">
              <div class="studio-ide-console-line">
                <span class="studio-ide-console-time">{{ new Date().toLocaleTimeString() }}</span>
                <span class="studio-ide-console-tag">[AST_VALIDATOR]</span>
                <span>Scor de Integritate: {{ lintResult.integrityScore }}% ({{ lintResult.errorCount }} erori, {{ lintResult.warningCount }} avertismente)</span>
              </div>
              <div class="studio-ide-console-line">
                <span class="studio-ide-console-time">{{ new Date().toLocaleTimeString() }}</span>
                <span class="studio-ide-console-tag">[GUARDRAILS]</span>
                <span>Status: {{ lintResult.hasErrors ? 'BLOCAT (Necesită corectare)' : 'VALIDAT & GATA DE PUSH' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ─── STATUS BAR (IDE BOTTOM) ─── -->
        <div class="studio-ide-statusbar">
          <div class="studio-ide-statusbar-left">
            <button
              type="button"
              class="studio-ide-status-item studio-ide-status-item--button"
              @click="showBottomDock = !showBottomDock; bottomDockTab = 'problems'"
            >
              <Icon
                :icon="lintResult.hasErrors ? 'lucide:x-circle' : 'lucide:check-circle-2'"
                width="12"
                height="12"
                :class="lintResult.hasErrors ? 'studio-ide-status-icon--error' : 'studio-ide-status-icon--ok'"
              />
              <span>{{ lintResult.errorCount }} Erori, {{ lintResult.warningCount }} Warnings</span>
            </button>

            <div class="studio-ide-status-divider" />

            <span class="studio-ide-status-item">
              <Icon icon="lucide:shield-check" width="12" height="12" class="text-emerald-400" />
              <span>Integritate: {{ lintResult.integrityScore }}%</span>
            </span>

            <div class="studio-ide-status-divider" />

            <span class="studio-ide-status-item">
              <span v-if="bypassGuardrail" class="text-amber-400 font-bold">Guardrail: Bypass Root</span>
              <span v-else>Guardrail: Activ & Securizat</span>
            </span>
          </div>

          <div class="studio-ide-statusbar-right">
            <span class="studio-ide-status-item">
              Ln {{ cursorPos.line }}, Col {{ cursorPos.col }}
            </span>
            <div class="studio-ide-status-divider" />
            <span class="studio-ide-status-item">{{ wordCount }} cuvinte</span>
            <div class="studio-ide-status-divider" />
            <span class="studio-ide-status-item">UTF-8</span>
            <div class="studio-ide-status-divider" />
            <span class="studio-ide-status-item">Markdown / MDX</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── MODAL: CREATE NEW DOCUMENT ─── -->
    <div v-if="isCreatingNew" class="admin-modal-overlay">
      <div class="admin-modal-container">
        <div class="admin-modal-header">
          <div>
            <div class="admin-modal-pretitle">CREARE DOCUMENT NOU</div>
            <h3 class="admin-modal-title">Configurare Ghid sau Articol Nou</h3>
          </div>
          <button type="button" class="admin-modal-close-btn" @click="isCreatingNew = false">
            <Icon icon="lucide:x" width="16" height="16" />
          </button>
        </div>

        <div class="admin-modal-body">
          <div class="admin-form-group">
            <label class="admin-form-label">Titlu Document</label>
            <input
              v-model="newTitleName"
              type="text"
              class="admin-form-input"
              placeholder="ex: Ghid Comenzi VIP CS2"
              @input="
                newSlugName = ($event.target as HTMLInputElement).value
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/^-|-$/g, '')
              "
            />
          </div>

          <div class="admin-form-group">
            <label class="admin-form-label">Categorie & Folder</label>
            <select v-model="newCategory" class="admin-form-input">
              <option v-for="(cat, key) in CATEGORY_MAP" :key="key" :value="key">
                {{ cat.label }} ({{ key }}/)
              </option>
            </select>
          </div>

          <div class="admin-form-group">
            <label class="admin-form-label">Slug URL Fișier</label>
            <input
              v-model="newSlugName"
              type="text"
              class="admin-form-input admin-table-mono"
              placeholder="nume-articol"
            />
            <span class="admin-form-help">
              Calea generată: <code>content/docs/{{ newCategory }}/{{ newSlugName }}.md</code>
            </span>
          </div>

          <div class="admin-form-group">
            <label class="admin-form-label">Șablon Inițial (Template)</label>
            <div class="studio-ide-templates-grid">
              <button
                v-for="(tmpl, key) in TEMPLATES"
                :key="key"
                type="button"
                class="studio-ide-tmpl-card"
                :class="{ 'studio-ide-tmpl-card--active': selectedTemplateKey === key }"
                @click="selectedTemplateKey = key"
              >
                <strong>{{ tmpl.label }}</strong>
                <span>{{ tmpl.desc }}</span>
              </button>
            </div>
          </div>
        </div>

        <div class="admin-modal-footer">
          <button type="button" class="admin-btn admin-btn--secondary" @click="isCreatingNew = false">
            Anulează
          </button>
          <button
            type="button"
            class="admin-btn admin-btn--primary"
            :disabled="saving || !newSlugName.trim()"
            @click="handleCreateNewDoc"
          >
            <Icon :icon="saving ? 'lucide:refresh-cw' : 'lucide:plus'" width="14" height="14" :class="{ 'studio-spin': saving }" />
            <span>Creează & Deschide în Editor</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ─── MODAL: MEDIA & VIDEO VAULT INSERTER ─── -->
    <div v-if="showMediaModal" class="admin-modal-overlay">
      <div class="admin-modal-container studio-media-modal-container">
        <div class="admin-modal-header">
          <div>
            <div class="admin-modal-pretitle">CENTRUL DE ASSET-URI & MEDIA</div>
            <h3 class="admin-modal-title">Inserare Imagini, GIF-uri & Videoclipuri</h3>
          </div>
          <button
            type="button"
            class="admin-modal-close-btn"
            @click="showMediaModal = false; selectedMediaFile = null; mediaFilePreview = null;"
          >
            <Icon icon="lucide:x" width="16" height="16" />
          </button>
        </div>

        <!-- Modal Sub-Tabs -->
        <div class="studio-media-modal-tabs">
          <button
            type="button"
            class="studio-media-modal-tab"
            :class="{ 'studio-media-modal-tab--active': mediaModalTab === 'upload' }"
            @click="mediaModalTab = 'upload'"
          >
            <Icon icon="lucide:upload" width="14" height="14" />
            <span>Upload Nou (Local)</span>
          </button>
          <button
            type="button"
            class="studio-media-modal-tab"
            :class="{ 'studio-media-modal-tab--active': mediaModalTab === 'vault' }"
            @click="mediaModalTab = 'vault'"
          >
            <Icon icon="lucide:layers" width="14" height="14" />
            <span>Galerie Server ({{ mediaAssets.length }})</span>
          </button>
          <button
            type="button"
            class="studio-media-modal-tab"
            :class="{ 'studio-media-modal-tab--active': mediaModalTab === 'embed' }"
            @click="mediaModalTab = 'embed'"
          >
            <Icon icon="lucide:external-link" width="14" height="14" />
            <span>Video Extern (YouTube)</span>
          </button>
        </div>

        <div class="admin-modal-body">
          <!-- TAB 1: UPLOAD LOCAL FILE -->
          <div v-if="mediaModalTab === 'upload'" class="studio-media-upload-view">
            <div class="studio-media-dropzone" @click="fileInputRef?.click()">
              <div v-if="selectedMediaFile" class="studio-media-preview-box">
                <img v-if="mediaFilePreview" :src="mediaFilePreview" alt="Preview" class="studio-media-preview-img" />
                <Icon v-else icon="lucide:film" width="40" height="40" class="text-amber-400" />
                <div class="studio-media-preview-info">
                  <strong>{{ selectedMediaFile.name }}</strong>
                  <span>{{ (selectedMediaFile.size / 1024).toFixed(1) }} KB</span>
                </div>
              </div>
              <div v-else class="studio-media-dropzone-placeholder">
                <Icon icon="lucide:upload" width="32" height="32" class="text-amber-400" />
                <span class="studio-media-dropzone-title">Apasă pentru a alege un fișier sau trage-l aici</span>
                <span class="studio-media-dropzone-desc">Suportă PNG, JPG, WEBP, GIF, SVG, MP4, WEBM</span>
              </div>
            </div>

            <input
              ref="fileInputRef"
              type="file"
              style="display: none;"
              accept="image/*,video/mp4,video/webm,.gif"
              @change="handleFileInputChange"
            />

            <div class="admin-form-group">
              <label class="admin-form-label">Folder Destinație pe Server</label>
              <select v-model="mediaTargetFolder" class="admin-form-input">
                <option value="media">/media/ — Imagini & Asset-uri Generale</option>
                <option value="videos">/videos/ — Demonstrații Video MP4/WebM</option>
                <option value="crates">/crates/ — Cutii & Case Openings</option>
                <option value="knives">/knives/ — Skin-uri Cuțite CS2</option>
                <option value="gloves">/gloves/ — Mănuși CS2</option>
                <option value="shop">/shop/ — Meniu Shop & Chat Tags</option>
                <option value="utility">/utility/ — Inventar & HUD</option>
                <option value="sank">/sank/ — Sunete & Meme-uri</option>
              </select>
            </div>

            <div class="admin-form-group">
              <label class="admin-form-label">Titlu / Text Alternativ (Alt Text / Caption)</label>
              <input
                v-model="mediaAltTitle"
                type="text"
                class="admin-form-input"
                placeholder="ex: Demonstrație MVP Anthem CS2"
              />
            </div>
          </div>

          <!-- TAB 2: VAULT GALLERY -->
          <div v-else-if="mediaModalTab === 'vault'" class="studio-media-vault-view">
            <div class="studio-media-vault-toolbar">
              <div class="studio-media-vault-search">
                <Icon icon="lucide:search" width="13" height="13" class="studio-ide-search-icon" />
                <input
                  v-model="mediaVaultSearch"
                  type="text"
                  placeholder="Caută în fișierele existente..."
                  class="studio-media-vault-search-input"
                />
              </div>

              <div class="studio-media-vault-filters">
                <button
                  type="button"
                  class="studio-media-filter-btn"
                  :class="{ 'studio-media-filter-btn--active': mediaVaultFilter === 'all' }"
                  @click="mediaVaultFilter = 'all'"
                >
                  Toate ({{ mediaAssets.length }})
                </button>
                <button
                  type="button"
                  class="studio-media-filter-btn"
                  :class="{ 'studio-media-filter-btn--active': mediaVaultFilter === 'image' }"
                  @click="mediaVaultFilter = 'image'"
                >
                  Imagini
                </button>
                <button
                  type="button"
                  class="studio-media-filter-btn"
                  :class="{ 'studio-media-filter-btn--active': mediaVaultFilter === 'video' }"
                  @click="mediaVaultFilter = 'video'"
                >
                  Video-uri
                </button>
                <button
                  type="button"
                  class="studio-media-filter-btn"
                  :class="{ 'studio-media-filter-btn--active': mediaVaultFilter === 'gif' }"
                  @click="mediaVaultFilter = 'gif'"
                >
                  GIF-uri
                </button>
              </div>
            </div>

            <div class="studio-media-vault-grid">
              <div
                v-for="asset in filteredVaultAssets"
                :key="asset.url"
                class="studio-media-vault-card"
              >
                <div class="studio-media-vault-thumb">
                  <div v-if="asset.type === 'video'" class="studio-media-vault-video-badge">
                    <Icon icon="lucide:play" width="20" height="20" />
                  </div>
                  <img
                    v-else
                    :src="asset.url"
                    :alt="asset.filename"
                    loading="lazy"
                    @error="($event.target as HTMLElement).style.display = 'none'"
                  />
                  <span class="studio-media-vault-tag">{{ asset.extension }}</span>
                </div>

                <div class="studio-media-vault-card-body">
                  <span class="studio-media-vault-filename" :title="asset.filename">
                    {{ asset.filename }}
                  </span>
                  <span class="studio-media-vault-size">{{ asset.sizeFormatted }}</span>
                </div>

                <div class="studio-media-vault-card-actions">
                  <button
                    type="button"
                    class="studio-media-vault-insert-btn"
                    @click="
                      const tag = asset.type === 'video'
                        ? `\n<DocVideo src='${asset.url}' title='${asset.filename.replace(/\.[^/.]+$/, '')}' />\n`
                        : `\n![${asset.filename.replace(/\.[^/.]+$/, '')}](${asset.url})\n`;
                      insertSnippet(tag);
                      showMediaModal = false;
                      statusMessage = { type: 'success', text: `Asset-ul \`${asset.filename}\` a fost inserat!` };
                    "
                  >
                    <Icon icon="lucide:plus" width="12" height="12" />
                    <span>Inserează</span>
                  </button>
                  <button
                    type="button"
                    class="studio-media-vault-copy-btn"
                    title="Copiază calea URL"
                    @click="handleCopyAssetUrl(asset.url)"
                  >
                    <Icon :icon="copiedAssetUrl === asset.url ? 'lucide:check' : 'lucide:copy'" width="12" height="12" :class="{ 'text-emerald-400': copiedAssetUrl === asset.url }" />
                  </button>
                </div>
              </div>
            </div>

            <div v-if="filteredVaultAssets.length === 0" class="studio-media-vault-empty">
              <Icon icon="lucide:image" width="32" height="32" class="text-slate-500" />
              <span>Nu s-au găsit asset-uri conform căutării.</span>
            </div>
          </div>

          <!-- TAB 3: EMBED EXTERNAL VIDEO -->
          <div v-else-if="mediaModalTab === 'embed'" class="studio-media-embed-view">
            <div class="admin-form-group">
              <label class="admin-form-label">Link Video YouTube / Streamable</label>
              <input
                v-model="mediaEmbedUrl"
                type="text"
                class="admin-form-input"
                placeholder="https://www.youtube.com/watch?v=... sau https://youtu.be/..."
              />
              <span class="admin-form-help">
                Platforma va genera automat un player video integrat cu titlu și stilizare responsivă.
              </span>
            </div>

            <div class="admin-form-group">
              <label class="admin-form-label">Titlu Video / Descriere</label>
              <input
                v-model="mediaAltTitle"
                type="text"
                class="admin-form-input"
                placeholder="ex: Prezentare Gameplay WildFire CS2"
              />
            </div>
          </div>
        </div>

        <div class="admin-modal-footer">
          <button
            type="button"
            class="admin-btn admin-btn--secondary"
            @click="showMediaModal = false; selectedMediaFile = null; mediaFilePreview = null;"
          >
            Anulează
          </button>

          <button
            v-if="mediaModalTab === 'upload'"
            type="button"
            class="admin-btn admin-btn--primary"
            :disabled="!selectedMediaFile || uploadingAsset"
            @click="handleUploadFileClick"
          >
            <Icon :icon="uploadingAsset ? 'lucide:refresh-cw' : 'lucide:upload'" width="14" height="14" :class="{ 'studio-spin': uploadingAsset }" />
            <span>Încarcă & Inserează în Document</span>
          </button>

          <button
            v-else-if="mediaModalTab === 'embed'"
            type="button"
            class="admin-btn admin-btn--primary"
            :disabled="!mediaEmbedUrl.trim()"
            @click="handleInsertYouTubeEmbed"
          >
            <Icon icon="lucide:play" width="14" height="14" />
            <span>Inserează Player Video</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ─── MODAL: INTERACTIVE TABLE BUILDER ─── -->
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

    <!-- ─── MODAL: INTERACTIVE CALLOUT BUILDER ─── -->
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

    <!-- ─── MODAL: INTERACTIVE CODE BUILDER ─── -->
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

    <!-- ─── MODAL: INTERACTIVE GALLERY BUILDER ─── -->
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

    <!-- ─── MODAL: TRASH / RECYCLE BIN ─── -->
    <AdminTrashModal
      :is-open="showTrashModal"
      @close="showTrashModal = false"
      @restored="fetchDocsList"
    />
    </div>
  </Teleport>
</template>
