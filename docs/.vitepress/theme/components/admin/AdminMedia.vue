<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';

/* ── types ──────────────────────────────────────────────────────────── */
export interface MediaAsset {
  filename: string;
  relativePath: string;
  url: string;
  sizeBytes: number;
  sizeFormatted: string;
  extension: string;
  type: 'image' | 'video' | 'other';
  lastModified: string;
  usageCount: number;
  usedInDocs: string[];
}

export interface MediaScanResult {
  totalAssets: number;
  totalSizeBytes: number;
  totalSizeFormatted: string;
  imagesCount: number;
  videosCount: number;
  usedCount: number;
  unusedCount: number;
  assets: MediaAsset[];
}

type FilterKey = 'all' | 'image' | 'video' | 'used' | 'unused';
type SortKey = 'used' | 'name' | 'size-desc' | 'size-asc';
type ViewMode = 'grid' | 'list';

const props = defineProps<{
  user?: any;
}>();

/* ── filter definitions ─────────────────────────────────────────────── */
const FILTERS: { key: FilterKey; label: string; icon: string }[] = [
  { key: 'all',    label: 'Toate',       icon: 'lucide:database' },
  { key: 'image',  label: 'Imagini',     icon: 'lucide:image' },
  { key: 'video',  label: 'Video',       icon: 'lucide:film' },
  { key: 'used',   label: 'Utilizate',   icon: 'lucide:trending-up' },
  { key: 'unused', label: 'Neutilizate', icon: 'lucide:file-warning' },
];

/* ── state ──────────────────────────────────────────────────────────── */
const data = ref<MediaScanResult | null>(null);
const loading = ref<boolean>(true);
const filter = ref<FilterKey>('all');
const selectedFolder = ref<string>('all');
const searchQuery = ref<string>('');
const sortBy = ref<SortKey>('used');
const copiedId = ref<string | null>(null);
const displayLimit = ref<number>(48);
const viewMode = ref<ViewMode>('grid');

// Upload & Drag/Drop state
const showUploadModal = ref<boolean>(false);
const isDraggingOver = ref<boolean>(false);
const uploadFolder = ref<string>('media');
const uploading = ref<boolean>(false);
const uploadStatus = ref<{ type: 'success' | 'error'; message: string } | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

// Lightbox state
const lightboxAsset = ref<MediaAsset | null>(null);
const lightboxZoom = ref<number>(1);
const lightboxRotation = ref<number>(0);

/* ── helper: extension badge color ──────────────────────────────────── */
function extColor(ext: string): string {
  const e = ext.toLowerCase().replace('.', '');
  if (['jpg', 'jpeg', 'webp', 'png', 'avif'].includes(e)) return 'mv-ext--img';
  if (['gif'].includes(e)) return 'mv-ext--gif';
  if (['svg'].includes(e)) return 'mv-ext--svg';
  if (['mp4', 'webm', 'mov', 'avi'].includes(e)) return 'mv-ext--video';
  return 'mv-ext--other';
}

/* ── fetch media ────────────────────────────────────────────────────── */
async function fetchMedia() {
  loading.value = true;
  try {
    const res = await fetch('/api/admin/media', { cache: 'no-store' });
    if (res.status === 401) {
      window.location.href = '/admin/login';
      return;
    }
    const json = await res.json();
    data.value = json;
  } catch (err) {
    console.error('Failed to load media', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchMedia();
  window.addEventListener('keydown', handleGlobalKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeyDown);
});

/* ── copy markdown ──────────────────────────────────────────────────── */
function handleCopyMarkdown(asset: MediaAsset) {
  const snippet =
    asset.type === 'video'
      ? `<video src="${asset.url}" controls className="docs-video-player" />`
      : `![${asset.filename.replace(/\.[^/.]+$/, '')}](${asset.url})`;
  navigator.clipboard.writeText(snippet);
  copiedId.value = asset.url;
  setTimeout(() => {
    copiedId.value = null;
  }, 2200);
}

/* ── delete asset ───────────────────────────────────────────────────── */
async function handleDeleteAsset(asset: MediaAsset) {
  if (
    !confirm(
      `Ești sigur că vrei să ștergi permanent ${asset.filename}? Acest lucru va rupe linkurile în documentele unde este folosit (dacă există)!`
    )
  )
    return;

  try {
    const res = await fetch(`/api/admin/media?path=${encodeURIComponent(asset.relativePath)}`, {
      method: 'DELETE',
    });
    const json = await res.json();

    if (!res.ok) {
      alert('Eroare la ștergere: ' + json.error);
      return;
    }

    if (lightboxAsset.value?.url === asset.url) {
      closeLightbox();
    }

    // Remove from UI
    if (data.value) {
      data.value = {
        ...data.value,
        assets: data.value.assets.filter((a) => a.url !== asset.url),
        totalAssets: data.value.totalAssets - 1,
      };
    }
  } catch (err) {
    console.error(err);
    alert('A apărut o eroare la ștergere.');
  }
}

/* ── folders extraction ─────────────────────────────────────────────── */
const folderList = computed(() => {
  if (!data.value?.assets) return [];
  const set = new Set<string>();
  for (const asset of data.value.assets) {
    const parts = asset.relativePath.replace(/\\/g, '/').split('/');
    if (parts.length > 1) {
      set.add(parts[0]);
    } else {
      set.add('root');
    }
  }
  return Array.from(set).sort();
});

/* ── filter & sort logic ────────────────────────────────────────────── */
const assets = computed(() => data.value?.assets || []);

const filteredAssets = computed(() => {
  let result = assets.value.filter((asset) => {
    if (filter.value === 'image' && asset.type !== 'image') return false;
    if (filter.value === 'video' && asset.type !== 'video') return false;
    if (filter.value === 'unused' && asset.usageCount > 0) return false;
    if (filter.value === 'used' && asset.usageCount === 0) return false;

    // Folder filter
    if (selectedFolder.value !== 'all') {
      const parts = asset.relativePath.replace(/\\/g, '/').split('/');
      const assetFolder = parts.length > 1 ? parts[0] : 'root';
      if (assetFolder !== selectedFolder.value) return false;
    }

    // Search query
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      return (
        asset.filename.toLowerCase().includes(q) ||
        asset.relativePath.toLowerCase().includes(q) ||
        asset.extension.toLowerCase().includes(q)
      );
    }
    return true;
  });

  result.sort((a, b) => {
    if (sortBy.value === 'used')
      return b.usageCount !== a.usageCount
        ? b.usageCount - a.usageCount
        : a.filename.localeCompare(b.filename);
    if (sortBy.value === 'name') return a.filename.localeCompare(b.filename);
    if (sortBy.value === 'size-desc') return b.sizeBytes - a.sizeBytes;
    if (sortBy.value === 'size-asc') return a.sizeBytes - b.sizeBytes;
    return 0;
  });

  return result;
});

const visibleAssets = computed(() => filteredAssets.value.slice(0, displayLimit.value));

/* ── counts for filter tabs ─────────────────────────────────────────── */
const counts = computed(() => ({
  all: assets.value.length,
  image: assets.value.filter((a) => a.type === 'image').length,
  video: assets.value.filter((a) => a.type === 'video').length,
  used: assets.value.filter((a) => a.usageCount > 0).length,
  unused: assets.value.filter((a) => a.usageCount === 0).length,
}));

/* ── drag & drop upload handlers ────────────────────────────────────── */
function handleDragOver(e: DragEvent) {
  e.preventDefault();
  isDraggingOver.value = true;
}

function handleDragLeave(e: DragEvent) {
  e.preventDefault();
  isDraggingOver.value = false;
}

function handleDrop(e: DragEvent) {
  e.preventDefault();
  isDraggingOver.value = false;
  if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
    processFilesUpload(e.dataTransfer.files);
  }
}

function handleFileInputChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    processFilesUpload(target.files);
  }
}

async function processFilesUpload(files: FileList) {
  uploading.value = true;
  uploadStatus.value = null;

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', uploadFolder.value || 'media');

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      const resJson = await res.json();
      if (!res.ok) {
        throw new Error(resJson.error || `Eroare la încărcarea ${file.name}`);
      }
    }

    uploadStatus.value = {
      type: 'success',
      message: `${files.length} fișier(e) încărcat(e) cu succes în /${uploadFolder.value || 'media'}!`,
    };

    if (fileInputRef.value) {
      fileInputRef.value.value = '';
    }

    // Refresh media vault
    await fetchMedia();

    setTimeout(() => {
      showUploadModal.value = false;
      uploadStatus.value = null;
    }, 1800);
  } catch (err: any) {
    uploadStatus.value = {
      type: 'error',
      message: err.message || 'Eroare la încărcare.',
    };
  } finally {
    uploading.value = false;
  }
}

/* ── lightbox handlers ──────────────────────────────────────────────── */
function openLightbox(asset: MediaAsset) {
  lightboxAsset.value = asset;
  lightboxZoom.value = 1;
  lightboxRotation.value = 0;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightboxAsset.value = null;
  lightboxZoom.value = 1;
  lightboxRotation.value = 0;
  document.body.style.overflow = '';
}

function zoomIn() {
  lightboxZoom.value = Math.min(lightboxZoom.value + 0.25, 4);
}

function zoomOut() {
  lightboxZoom.value = Math.max(lightboxZoom.value - 0.25, 0.5);
}

function resetZoom() {
  lightboxZoom.value = 1;
  lightboxRotation.value = 0;
}

function rotateMedia() {
  lightboxRotation.value = (lightboxRotation.value + 90) % 360;
}

function handleGlobalKeyDown(e: KeyboardEvent) {
  if (!lightboxAsset.value) return;
  if (e.key === 'Escape') {
    closeLightbox();
  } else if (e.key === '+' || e.key === '=') {
    zoomIn();
  } else if (e.key === '-') {
    zoomOut();
  } else if (e.key === '0') {
    resetZoom();
  }
}
</script>

<template>
  <div class="admin-page-container">

    <!-- ── HEADER ──────────────────────────────────────────────────── -->
    <div class="mv-header">
      <div class="mv-header-left">
        <div class="mv-breadcrumb">
          <Icon icon="lucide:archive" width="11" height="11" />
          <span>CONTENT MANAGEMENT</span>
          <span class="mv-breadcrumb-sep">/</span>
          <span>MEDIA &amp; ASSET VAULT</span>
        </div>
        <h1 class="mv-title">Media &amp; Asset Vault</h1>
        <p class="mv-subtitle">
          Explorează, verifică utilizarea în cele {{ data?.totalAssets ?? "0" }}+ resurse și copiază
          instantaneu sintaxa Markdown pentru orice fișier media din platformă.
        </p>
      </div>

      <div class="mv-header-actions">
        <button
          type="button"
          class="mv-upload-trigger-btn"
          @click="showUploadModal = true"
        >
          <Icon icon="lucide:upload" width="13" height="13" />
          <span>Încarcă Media</span>
        </button>

        <button
          type="button"
          id="media-rescan-btn"
          :disabled="loading"
          class="mv-scan-btn"
          @click="fetchMedia"
        >
          <Icon icon="lucide:refresh-cw" width="13" height="13" :class="{ 'mv-spin': loading }" />
          <span>{{ loading ? "Se scanează..." : "Rescanează" }}</span>
        </button>
      </div>
    </div>

    <!-- ── KPI STRIP ───────────────────────────────────────────────── -->
    <div class="mv-kpi-strip">
      <div class="mv-kpi-cell mv-kpi-cell--primary">
        <div class="mv-kpi-icon mv-kpi-icon--orange">
          <Icon icon="lucide:folder-open" width="20" height="20" />
        </div>
        <div class="mv-kpi-body">
          <span class="mv-kpi-number">{{ loading ? "—" : (data?.totalAssets ?? 0) }}</span>
          <span class="mv-kpi-label">Total Assets</span>
          <span class="mv-kpi-desc">
            {{ data?.imagesCount ?? 0 }} imagini · {{ data?.videosCount ?? 0 }} video
          </span>
        </div>
      </div>

      <div class="mv-kpi-sep" />

      <div class="mv-kpi-cell">
        <div class="mv-kpi-icon mv-kpi-icon--blue">
          <Icon icon="lucide:hard-drive" width="20" height="20" />
        </div>
        <div class="mv-kpi-body">
          <span class="mv-kpi-number mv-kpi-number--blue">
            {{ loading ? "—" : (data?.totalSizeFormatted ?? "0 B") }}
          </span>
          <span class="mv-kpi-label">Stocare Ocupată</span>
          <span class="mv-kpi-desc">Directorul public/</span>
        </div>
      </div>

      <div class="mv-kpi-sep" />

      <div class="mv-kpi-cell">
        <div class="mv-kpi-icon mv-kpi-icon--green">
          <Icon icon="lucide:trending-up" width="20" height="20" />
        </div>
        <div class="mv-kpi-body">
          <span class="mv-kpi-number mv-kpi-number--green">
            {{ loading ? "—" : (data?.usedCount ?? 0) }}
          </span>
          <span class="mv-kpi-label">Assets Utilizate</span>
          <span class="mv-kpi-desc">Referențiate în docs</span>
        </div>
      </div>

      <div class="mv-kpi-sep" />

      <div class="mv-kpi-cell">
        <div class="mv-kpi-icon mv-kpi-icon--amber">
          <Icon icon="lucide:file-warning" width="20" height="20" />
        </div>
        <div class="mv-kpi-body">
          <span class="mv-kpi-number mv-kpi-number--amber">
            {{ loading ? "—" : (data?.unusedCount ?? 0) }}
          </span>
          <span class="mv-kpi-label">Neutilizate</span>
          <span class="mv-kpi-desc">Fără referințe Markdown</span>
        </div>
        <Icon
          v-if="(data?.unusedCount ?? 0) === 0 && !loading"
          icon="lucide:check"
          width="13"
          height="13"
          class="mv-kpi-ok"
        />
      </div>
    </div>

    <!-- ── DRAG & DROP QUICK BANNER ────────────────────────────────── -->
    <div
      class="mv-dropzone-banner"
      :class="{ 'mv-dropzone-banner--active': isDraggingOver }"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      @click="showUploadModal = true"
    >
      <div class="mv-dropzone-icon">
        <Icon icon="lucide:upload-cloud" width="22" height="22" />
      </div>
      <div class="mv-dropzone-text">
        <span class="mv-dropzone-title">Trage fișiere media direct aici sau apasă pentru încărcare</span>
        <span class="mv-dropzone-sub">Suportă PNG, JPG, WEBP, GIF, SVG, MP4, WEBM în directorul /public</span>
      </div>
      <button type="button" class="mv-dropzone-btn" @click.stop="showUploadModal = true">
        Selectează Fișiere
      </button>
    </div>

    <!-- ── TOOLBAR ─────────────────────────────────────────────────── -->
    <div class="mv-toolbar">
      <!-- Filter tabs -->
      <div class="mv-filter-tabs">
        <button
          v-for="item in FILTERS"
          :key="item.key"
          type="button"
          :id="`media-filter-${item.key}`"
          :class="['mv-filter-tab', { 'mv-filter-tab--active': filter === item.key }]"
          @click="filter = item.key; displayLimit = 48"
        >
          <Icon :icon="item.icon" width="12" height="12" />
          <span>{{ item.label }}</span>
          <span :class="['mv-filter-count', { 'mv-filter-count--active': filter === item.key }]">
            {{ counts[item.key] }}
          </span>
        </button>
      </div>

      <div class="mv-toolbar-right">
        <!-- Folder filter -->
        <div v-if="folderList.length > 0" class="mv-sort-wrap">
          <Icon icon="lucide:folder" width="12" height="12" class="mv-sort-icon" />
          <select
            v-model="selectedFolder"
            class="mv-sort-select"
            id="media-folder-select"
          >
            <option value="all">Toate Folderele</option>
            <option v-for="folder in folderList" :key="folder" :value="folder">
              📁 {{ folder }}/
            </option>
          </select>
        </div>

        <!-- Sort -->
        <div class="mv-sort-wrap">
          <Icon icon="lucide:arrow-up-down" width="12" height="12" class="mv-sort-icon" />
          <select
            v-model="sortBy"
            class="mv-sort-select"
            id="media-sort-select"
          >
            <option value="used">Cele Mai Folosite</option>
            <option value="name">Nume (A–Z)</option>
            <option value="size-desc">Dimensiune (Mari)</option>
            <option value="size-asc">Dimensiune (Mici)</option>
          </select>
        </div>

        <!-- Search -->
        <div class="mv-search-wrap">
          <Icon icon="lucide:search" width="13" height="13" class="mv-search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            id="media-search-input"
            placeholder="Caută fișier, cale, extensie..."
            class="mv-search-input"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="mv-search-clear"
            @click="searchQuery = ''"
          >
            <Icon icon="lucide:x" width="12" height="12" />
          </button>
        </div>

        <!-- View toggle -->
        <div class="mv-view-toggle">
          <button
            type="button"
            id="media-view-grid"
            :class="['mv-view-btn', { 'mv-view-btn--active': viewMode === 'grid' }]"
            title="Grid view"
            @click="viewMode = 'grid'"
          >
            <Icon icon="lucide:grid-3x3" width="14" height="14" />
          </button>
          <button
            type="button"
            id="media-view-list"
            :class="['mv-view-btn', { 'mv-view-btn--active': viewMode === 'list' }]"
            title="List view"
            @click="viewMode = 'list'"
          >
            <Icon icon="lucide:list" width="14" height="14" />
          </button>
        </div>
      </div>
    </div>

    <!-- ── RESULTS META ────────────────────────────────────────────── -->
    <div v-if="!loading && filteredAssets.length > 0" class="mv-results-meta">
      <span>
        Afișând <strong>{{ Math.min(visibleAssets.length, filteredAssets.length) }}</strong> din
        <strong>{{ filteredAssets.length }}</strong> assets
        <template v-if="searchQuery"> pentru „<em>{{ searchQuery }}</em>"</template>
        <template v-if="selectedFolder !== 'all'"> în directorul „<em>{{ selectedFolder }}/</em>"</template>
      </span>
    </div>

    <!-- ── GRID / LIST ─────────────────────────────────────────────── -->
    <div v-if="loading" class="mv-loading">
      <div class="mv-loading-orb">
        <Icon icon="lucide:refresh-cw" width="22" height="22" class="mv-spin" />
      </div>
      <p class="mv-loading-text">Se scanează {{ data?.totalAssets || "193" }} fișiere media...</p>
      <p class="mv-loading-sub">Imaginile, videoclipurile și metadatele se încarcă</p>
    </div>

    <div v-else-if="filteredAssets.length === 0" class="mv-empty">
      <div class="mv-empty-orb">
        <Icon icon="lucide:image" width="26" height="26" />
      </div>
      <p class="mv-empty-title">Niciun fișier media găsit</p>
      <p class="mv-empty-sub">
        {{ searchQuery ? `Nu există rezultate pentru „${searchQuery}".` : "Schimbă filtrul sau adaugă fișiere media în public/." }}
      </p>
    </div>

    <!-- ── GRID VIEW ──────────────────────────────────────────────── -->
    <div v-else-if="viewMode === 'grid'" class="mv-grid">
      <div v-for="asset in visibleAssets" :key="asset.url" class="mv-card">
        <!-- Preview Box (click to open Lightbox) -->
        <div class="mv-card-preview" @click="openLightbox(asset)" title="Apasă pentru previzualizare mărită">
          <img
            v-if="asset.type === 'image'"
            :src="asset.url"
            :alt="asset.filename"
            class="mv-card-img"
            loading="lazy"
          />

          <div v-else-if="asset.type === 'video'" class="mv-card-video-wrap">
            <video
              :src="`${asset.url}#t=0.1`"
              preload="metadata"
              muted
              playsinline
              class="mv-card-video"
              @mouseenter="(e) => (e.currentTarget as HTMLVideoElement).play().catch(() => {})"
              @mouseleave="(e) => {
                const vid = e.currentTarget as HTMLVideoElement;
                vid.pause();
                vid.currentTime = 0.1;
              }"
            />
            <div class="mv-card-video-overlay">
              <Icon icon="lucide:play" width="14" height="14" />
              <span>HOVER</span>
            </div>
          </div>

          <div v-else class="mv-card-other">
            <Icon icon="lucide:layers" width="26" height="26" />
            <span>{{ asset.extension }}</span>
          </div>

          <!-- Usage badge -->
          <span :class="['mv-usage-badge', asset.usageCount > 0 ? 'mv-usage-badge--used' : 'mv-usage-badge--unused']">
            {{ asset.usageCount > 0 ? `${asset.usageCount} docs` : "Neutilizat" }}
          </span>

          <!-- Type badge -->
          <span :class="['mv-type-badge', asset.type === 'video' ? 'mv-type-badge--video' : 'mv-type-badge--image']">
            <Icon v-if="asset.type === 'video'" icon="lucide:film" width="10" height="10" />
            <Icon v-else icon="lucide:image" width="10" height="10" />
          </span>
        </div>

        <!-- Info -->
        <div class="mv-card-info">
          <div class="mv-card-name-row">
            <span class="mv-card-name" :title="asset.filename">{{ asset.filename }}</span>
            <span :class="['mv-ext-badge', extColor(asset.extension)]">{{ asset.extension }}</span>
          </div>

          <div class="mv-card-meta">
            <span class="mv-card-size">{{ asset.sizeFormatted }}</span>
            <div v-if="asset.usedInDocs.length > 0" class="mv-card-doc-tags">
              <span
                v-for="(slug, i) in asset.usedInDocs.slice(0, 1)"
                :key="i"
                class="mv-doc-chip"
                :title="slug"
              >
                {{ slug }}
              </span>
              <span v-if="asset.usedInDocs.length > 1" class="mv-doc-more">
                +{{ asset.usedInDocs.length - 1 }}
              </span>
            </div>
          </div>

          <div class="mv-card-actions">
            <button
              type="button"
              :class="['mv-copy-btn', { 'mv-copy-btn--copied': copiedId === asset.url }]"
              title="Copiază sintaxa Markdown"
              @click="handleCopyMarkdown(asset)"
            >
              <Icon v-if="copiedId === asset.url" icon="lucide:check" width="12" height="12" />
              <Icon v-else icon="lucide:copy" width="12" height="12" />
              <span>{{ copiedId === asset.url ? "Copiat!" : "Copiază MD" }}</span>
            </button>

            <a
              :href="asset.url"
              target="_blank"
              rel="noopener noreferrer"
              class="mv-open-btn"
              title="Deschide resursa"
            >
              <Icon icon="lucide:external-link" width="12" height="12" />
            </a>

            <button
              type="button"
              class="mv-open-btn mv-delete-btn"
              title="Șterge definitiv"
              @click="handleDeleteAsset(asset)"
            >
              <Icon icon="lucide:trash-2" width="12" height="12" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── LIST VIEW ──────────────────────────────────────────────── -->
    <div v-else class="mv-list">
      <div class="mv-list-header">
        <span class="mv-list-col-preview">Preview</span>
        <span class="mv-list-col-name">Fișier</span>
        <span class="mv-list-col-size">Dimensiune</span>
        <span class="mv-list-col-usage">Utilizare</span>
        <span class="mv-list-col-path">Cale</span>
        <span class="mv-list-col-actions">Acțiuni</span>
      </div>

      <div v-for="asset in visibleAssets" :key="asset.url" class="mv-list-row">
        <div class="mv-list-col-preview" @click="openLightbox(asset)" style="cursor: pointer;">
          <img
            v-if="asset.type === 'image'"
            :src="asset.url"
            alt=""
            class="mv-list-thumb"
            loading="lazy"
          />
          <div v-else-if="asset.type === 'video'" class="mv-list-thumb mv-list-thumb--video">
            <Icon icon="lucide:film" width="16" height="16" />
          </div>
          <div v-else class="mv-list-thumb mv-list-thumb--other">
            <Icon icon="lucide:layers" width="16" height="16" />
          </div>
        </div>

        <div class="mv-list-col-name">
          <span class="mv-list-filename" :title="asset.filename">{{ asset.filename }}</span>
          <span :class="['mv-ext-badge', extColor(asset.extension)]">{{ asset.extension }}</span>
        </div>

        <div class="mv-list-col-size">
          <span class="mv-list-size">{{ asset.sizeFormatted }}</span>
        </div>

        <div class="mv-list-col-usage">
          <span :class="['mv-usage-pill', asset.usageCount > 0 ? 'mv-usage-pill--used' : 'mv-usage-pill--unused']">
            {{ asset.usageCount > 0 ? `${asset.usageCount} doc${asset.usageCount > 1 ? 's' : ''}` : "Neutilizat" }}
          </span>
        </div>

        <div class="mv-list-col-path">
          <span class="mv-list-path" :title="asset.relativePath">{{ asset.relativePath }}</span>
        </div>

        <div class="mv-list-col-actions">
          <button
            type="button"
            :class="['mv-copy-btn', { 'mv-copy-btn--copied': copiedId === asset.url }]"
            @click="handleCopyMarkdown(asset)"
          >
            <Icon v-if="copiedId === asset.url" icon="lucide:check" width="12" height="12" />
            <Icon v-else icon="lucide:copy" width="12" height="12" />
            <span>{{ copiedId === asset.url ? "Copiat!" : "Markdown" }}</span>
          </button>

          <a :href="asset.url" target="_blank" rel="noopener noreferrer" class="mv-open-btn">
            <Icon icon="lucide:external-link" width="12" height="12" />
          </a>

          <button
            type="button"
            class="mv-open-btn mv-delete-btn"
            title="Șterge definitiv"
            @click="handleDeleteAsset(asset)"
          >
            <Icon icon="lucide:trash-2" width="12" height="12" />
          </button>
        </div>
      </div>
    </div>

    <!-- ── LOAD MORE ───────────────────────────────────────────────── -->
    <div v-if="filteredAssets.length > displayLimit && !loading" class="mv-load-more-wrap">
      <button
        type="button"
        id="media-load-more-btn"
        class="mv-load-more-btn"
        @click="displayLimit += 48"
      >
        <span>Încarcă mai multe</span>
        <span class="mv-load-more-count">{{ filteredAssets.length - displayLimit }} rămase</span>
      </button>
    </div>

    <!-- ── UPLOAD MODAL & DRAG/DROP ────────────────────────────────── -->
    <div v-if="showUploadModal" class="mv-modal-backdrop" @click.self="showUploadModal = false">
      <div class="mv-modal-card">
        <div class="mv-modal-header">
          <div class="mv-modal-title-wrap">
            <Icon icon="lucide:upload-cloud" width="18" height="18" class="mv-accent-color" />
            <h3 class="mv-modal-title">Încărcare Media & Assets</h3>
          </div>
          <button type="button" class="mv-modal-close-btn" @click="showUploadModal = false">
            <Icon icon="lucide:x" width="16" height="16" />
          </button>
        </div>

        <div class="mv-modal-body">
          <div class="mv-form-group">
            <label class="mv-form-label">Director Țintă în public/</label>
            <div class="mv-folder-selector-wrap">
              <input
                v-model="uploadFolder"
                type="text"
                class="mv-input-field"
                placeholder="ex: media, utility, guides"
              />
              <div class="mv-preset-chips">
                <button
                  type="button"
                  class="mv-chip-btn"
                  :class="{ 'mv-chip-btn--active': uploadFolder === 'media' }"
                  @click="uploadFolder = 'media'"
                >
                  media
                </button>
                <button
                  type="button"
                  class="mv-chip-btn"
                  :class="{ 'mv-chip-btn--active': uploadFolder === 'utility' }"
                  @click="uploadFolder = 'utility'"
                >
                  utility
                </button>
                <button
                  type="button"
                  class="mv-chip-btn"
                  :class="{ 'mv-chip-btn--active': uploadFolder === 'guides' }"
                  @click="uploadFolder = 'guides'"
                >
                  guides
                </button>
              </div>
            </div>
            <p class="mv-form-hint">
              Fișierele vor fi salvate pe disc în <code>public/{{ uploadFolder || 'media' }}/</code> și sincronizate.
            </p>
          </div>

          <!-- Dropzone inside modal -->
          <div
            class="mv-modal-dropzone"
            :class="{ 'mv-modal-dropzone--drag': isDraggingOver }"
            @dragover="handleDragOver"
            @dragleave="handleDragLeave"
            @drop="handleDrop"
            @click="fileInputRef?.click()"
          >
            <input
              ref="fileInputRef"
              type="file"
              multiple
              accept="image/*,video/*"
              class="mv-hidden-input"
              @change="handleFileInputChange"
            />
            <Icon icon="lucide:upload-cloud" width="40" height="40" class="mv-modal-drop-icon" />
            <h4 class="mv-modal-drop-title">Trage fișierele aici sau apasă pentru a răsfoi</h4>
            <p class="mv-modal-drop-desc">Imagini PNG, JPG, WEBP, SVG, GIF sau Video MP4, WEBM</p>
          </div>

          <!-- Status Message -->
          <div v-if="uploadStatus" :class="['mv-status-alert', `mv-status-alert--${uploadStatus.type}`]">
            <Icon
              :icon="uploadStatus.type === 'success' ? 'lucide:check-circle-2' : 'lucide:alert-circle'"
              width="16"
              height="16"
            />
            <span>{{ uploadStatus.message }}</span>
          </div>
        </div>

        <div class="mv-modal-footer">
          <span v-if="uploading" class="mv-uploading-indicator">
            <Icon icon="lucide:refresh-cw" width="14" height="14" class="mv-spin" />
            Se încarcă pe server...
          </span>
          <button
            type="button"
            class="mv-btn-ghost"
            :disabled="uploading"
            @click="showUploadModal = false"
          >
            Închide
          </button>
          <button
            type="button"
            class="mv-btn-primary"
            :disabled="uploading"
            @click="fileInputRef?.click()"
          >
            <Icon icon="lucide:upload" width="14" height="14" />
            <span>Selectează Fișiere</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ── PREVIEW LIGHTBOX ────────────────────────────────────────── -->
    <div
      v-if="lightboxAsset"
      class="mv-lightbox-overlay"
      @click.self="closeLightbox"
    >
      <div class="mv-lightbox-toolbar">
        <div class="mv-lightbox-title-wrap">
          <span class="mv-lightbox-filename">{{ lightboxAsset.filename }}</span>
          <span class="mv-lightbox-meta">{{ lightboxAsset.sizeFormatted }} · {{ lightboxAsset.relativePath }}</span>
        </div>

        <div class="mv-lightbox-controls">
          <button type="button" class="mv-lightbox-btn" title="Zoom In (+)" @click="zoomIn">
            <Icon icon="lucide:zoom-in" width="16" height="16" />
          </button>
          <button type="button" class="mv-lightbox-btn" title="Zoom Out (-)" @click="zoomOut">
            <Icon icon="lucide:zoom-out" width="16" height="16" />
          </button>
          <button type="button" class="mv-lightbox-btn" title="Rotește 90°" @click="rotateMedia">
            <Icon icon="lucide:rotate-cw" width="16" height="16" />
          </button>
          <button type="button" class="mv-lightbox-btn" title="Reset Zoom (0)" @click="resetZoom">
            <Icon icon="lucide:maximize-2" width="16" height="16" />
          </button>
          <button
            type="button"
            class="mv-lightbox-btn"
            title="Copiază sintaxa Markdown"
            @click="handleCopyMarkdown(lightboxAsset)"
          >
            <Icon :icon="copiedId === lightboxAsset.url ? 'lucide:check' : 'lucide:copy'" width="16" height="16" />
          </button>
          <a
            :href="lightboxAsset.url"
            target="_blank"
            download
            class="mv-lightbox-btn"
            title="Descarcă fișier"
          >
            <Icon icon="lucide:download" width="16" height="16" />
          </a>
          <button
            type="button"
            class="mv-lightbox-btn mv-lightbox-btn--delete"
            title="Șterge fișier"
            @click="handleDeleteAsset(lightboxAsset)"
          >
            <Icon icon="lucide:trash-2" width="16" height="16" />
          </button>
          <button type="button" class="mv-lightbox-btn mv-lightbox-btn--close" title="Închide (Esc)" @click="closeLightbox">
            <Icon icon="lucide:x" width="18" height="18" />
          </button>
        </div>
      </div>

      <div class="mv-lightbox-viewport" @click.self="closeLightbox">
        <img
          v-if="lightboxAsset.type === 'image'"
          :src="lightboxAsset.url"
          :alt="lightboxAsset.filename"
          class="mv-lightbox-media"
          :style="{
            transform: `scale(${lightboxZoom}) rotate(${lightboxRotation}deg)`,
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }"
        />
        <video
          v-else-if="lightboxAsset.type === 'video'"
          :src="lightboxAsset.url"
          controls
          autoplay
          class="mv-lightbox-media mv-lightbox-video"
          :style="{
            transform: `scale(${lightboxZoom}) rotate(${lightboxRotation}deg)`
          }"
        />
        <div v-else class="mv-lightbox-unknown">
          <Icon icon="lucide:layers" width="64" height="64" />
          <p>{{ lightboxAsset.filename }}</p>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* ── Additional scoped styles for Dropzone, Modal & Lightbox ── */
.mv-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

.mv-upload-trigger-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 16px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 800;
  color: #fff;
  background: hsl(0 0% 100% / 0.08);
  border: 1px solid var(--glass-border);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
}
.mv-upload-trigger-btn:hover {
  background: hsl(0 0% 100% / 0.15);
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.mv-delete-btn {
  color: #ef4444 !important;
  border-color: rgba(239, 68, 68, 0.2) !important;
  background: rgba(239, 68, 68, 0.08) !important;
}
.mv-delete-btn:hover {
  background: rgba(239, 68, 68, 0.2) !important;
  color: #ff6b6b !important;
}

.mv-dropzone-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 20px;
  margin-bottom: 20px;
  border: 1px dashed var(--glass-border);
  background: var(--glass-bg);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.mv-dropzone-banner:hover,
.mv-dropzone-banner--active {
  border-color: hsl(26 100% 52% / 0.7);
  background: hsl(26 100% 52% / 0.05);
}
.mv-dropzone-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: hsl(26 100% 52% / 0.12);
  border: 1px solid hsl(26 100% 52% / 0.3);
  color: #ff6b00;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.mv-dropzone-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}
.mv-dropzone-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-text);
}
.mv-dropzone-sub {
  font-size: 0.72rem;
  color: var(--color-text-muted);
}
.mv-dropzone-btn {
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  background: hsl(0 0% 100% / 0.08);
  border: 1px solid var(--glass-border);
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.15s ease;
}
.mv-dropzone-btn:hover {
  background: hsl(0 0% 100% / 0.14);
}

/* Modal */
.mv-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.mv-modal-card {
  width: 100%;
  max-width: 540px;
  background: #11141b;
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.mv-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--glass-border);
}
.mv-modal-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}
.mv-accent-color {
  color: #ff6b00;
}
.mv-modal-title {
  font-size: 1rem;
  font-weight: 800;
  color: #fff;
  margin: 0;
}
.mv-modal-close-btn {
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: color 0.15s;
}
.mv-modal-close-btn:hover {
  color: #fff;
}
.mv-modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.mv-form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.mv-form-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-text);
}
.mv-folder-selector-wrap {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}
.mv-input-field {
  flex: 1;
  min-width: 160px;
  padding: 8px 12px;
  border-radius: 8px;
  background: #090b0e;
  border: 1px solid var(--glass-border);
  color: #fff;
  font-size: 0.8rem;
  outline: none;
}
.mv-input-field:focus {
  border-color: #ff6b00;
}
.mv-preset-chips {
  display: flex;
  gap: 4px;
}
.mv-chip-btn {
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 600;
  background: hsl(0 0% 100% / 0.06);
  border: 1px solid var(--glass-border);
  color: var(--color-text-muted);
  cursor: pointer;
}
.mv-chip-btn--active {
  background: hsl(26 100% 52% / 0.2);
  border-color: hsl(26 100% 52% / 0.5);
  color: #ff6b00;
}
.mv-form-hint {
  font-size: 0.7rem;
  color: var(--color-text-muted);
  margin: 0;
}
.mv-form-hint code {
  color: #ff6b00;
}
.mv-modal-dropzone {
  border: 2px dashed var(--glass-border);
  border-radius: 12px;
  padding: 32px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  background: hsl(0 0% 0% / 0.2);
  transition: all 0.2s ease;
}
.mv-modal-dropzone:hover,
.mv-modal-dropzone--drag {
  border-color: #ff6b00;
  background: hsl(26 100% 52% / 0.05);
}
.mv-hidden-input {
  display: none;
}
.mv-modal-drop-icon {
  color: #ff6b00;
  margin-bottom: 4px;
}
.mv-modal-drop-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
}
.mv-modal-drop-desc {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin: 0;
}
.mv-status-alert {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
}
.mv-status-alert--success {
  background: hsl(158 84% 45% / 0.15);
  border: 1px solid hsl(158 84% 45% / 0.4);
  color: #34d399;
}
.mv-status-alert--error {
  background: hsl(0 84% 60% / 0.15);
  border: 1px solid hsl(0 84% 60% / 0.4);
  color: #f87171;
}
.mv-modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 20px;
  border-top: 1px solid var(--glass-border);
  background: hsl(0 0% 0% / 0.15);
}
.mv-uploading-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #ff6b00;
  margin-right: auto;
}
.mv-btn-ghost {
  padding: 8px 14px;
  border-radius: 8px;
  background: transparent;
  border: 1px solid var(--glass-border);
  color: var(--color-text-muted);
  font-size: 0.78rem;
  cursor: pointer;
}
.mv-btn-ghost:hover {
  color: #fff;
  background: hsl(0 0% 100% / 0.05);
}
.mv-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  background: linear-gradient(135deg, hsl(26 100% 52%) 0%, hsl(18 100% 46%) 100%);
  border: 1px solid hsl(26 100% 58% / 0.7);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
}

/* Lightbox */
.mv-lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.mv-lightbox-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: rgba(15, 17, 23, 0.85);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 10;
}
.mv-lightbox-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.mv-lightbox-filename {
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mv-lightbox-meta {
  font-size: 0.72rem;
  font-family: var(--font-mono);
  color: var(--color-text-muted);
}
.mv-lightbox-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}
.mv-lightbox-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #e2e8f0;
  cursor: pointer;
  transition: all 0.15s ease;
  text-decoration: none;
}
.mv-lightbox-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  transform: translateY(-1px);
}
.mv-lightbox-btn--delete:hover {
  background: rgba(239, 68, 68, 0.3);
  color: #f87171;
  border-color: rgba(239, 68, 68, 0.5);
}
.mv-lightbox-btn--close {
  background: rgba(255, 255, 255, 0.15);
}
.mv-lightbox-btn--close:hover {
  background: #ef4444;
  color: #fff;
}
.mv-lightbox-viewport {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 30px;
  user-select: none;
}
.mv-lightbox-media {
  max-width: 90vw;
  max-height: 82vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7);
}
.mv-lightbox-video {
  outline: none;
}
.mv-lightbox-unknown {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--color-text-muted);
}
</style>
