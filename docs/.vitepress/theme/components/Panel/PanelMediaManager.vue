<template>
  <div class="media-manager-view" data-lenis-prevent>
    <div class="mm-header">
      <div>
        <h2 class="mm-title">Media &amp; Asset Library</h2>
        <p class="mm-subtitle">Browse, preview, and copy markdown tags for all repository assets.</p>
      </div>
      <button class="scan-btn" @click="fetchAssets" :disabled="isLoading">
        <svg v-if="!isLoading" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        <svg v-else viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" class="spin"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
        {{ isLoading ? 'SCANNING...' : 'SCAN REPOSITORY' }}
      </button>
    </div>

    <!-- KPIs -->
    <div class="mm-kpis" v-if="assets.length > 0">
      <div class="kpi-pill">
        <span class="kp-val">{{ assets.length }}</span>
        <span class="kp-lbl">TOTAL ASSETS</span>
      </div>
      <div class="kpi-pill">
        <span class="kp-val">{{ imageAssets.length }}</span>
        <span class="kp-lbl">IMAGES</span>
      </div>
      <div class="kpi-pill">
        <span class="kp-val">{{ svgAssets.length }}</span>
        <span class="kp-lbl">VECTORS</span>
      </div>
      <div class="kpi-pill">
        <span class="kp-val">{{ formatSize(totalSize) }}</span>
        <span class="kp-lbl">TOTAL SIZE</span>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="mm-filters" v-if="assets.length > 0">
      <button v-for="f in filters" :key="f.id" class="filter-btn" :class="{ active: activeFilter === f.id }" @click="activeFilter = f.id">
        {{ f.label }}
        <span class="filter-count">{{ f.count }}</span>
      </button>
      <div class="mm-search">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input v-model="searchQuery" placeholder="Filter by filename..." />
      </div>
    </div>

    <!-- Empty / Loading States -->
    <div v-if="isLoading" class="mm-empty">
      <div class="empty-spinner"></div>
      <p>Scanning repository for assets...</p>
    </div>
    <div v-else-if="!hasFetched" class="mm-empty">
      <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.3"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
      <p>Click "Scan Repository" to load all images and assets from your GitHub repository.</p>
    </div>
    <div v-else-if="filteredAssets.length === 0" class="mm-empty">
      <p>No assets found matching your filter.</p>
    </div>

    <!-- Asset Grid -->
    <div v-else class="asset-grid">
      <div v-for="asset in filteredAssets" :key="asset.path" class="asset-card" @click="openLightbox(asset)">
        <div class="asset-preview">
          <img v-if="isImage(asset)" :src="asset.rawUrl" :alt="asset.name" loading="lazy" @error="onImgError($event)" />
          <div v-else-if="isVideo(asset)" class="asset-icon-preview video-preview">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            <span>{{ asset.ext.toUpperCase() }}</span>
          </div>
          <div v-else class="asset-icon-preview">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <span>{{ asset.ext.toUpperCase() }}</span>
          </div>
          <div class="asset-ext-badge">{{ asset.ext }}</div>
          <div class="asset-hover-overlay">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="white" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
        </div>
        <div class="asset-info">
          <span class="asset-name" :title="asset.name">{{ asset.name }}</span>
          <span class="asset-size">{{ formatSize(asset.size) }}</span>
        </div>
      </div>
    </div>

    <!-- LIGHTBOX MODAL -->
    <teleport to="body">
      <transition name="lb-fade">
        <div v-if="lightboxAsset" class="mm-lightbox" @click.self="closeLightbox" @keydown.esc="closeLightbox">
          <!-- Nav: prev -->
          <button class="lb-nav lb-prev" @click="navLightbox(-1)" v-if="filteredAssets.length > 1">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>

          <div class="lb-box">
            <!-- Header -->
            <div class="lb-header">
              <div class="lb-meta">
                <span class="lb-name">{{ lightboxAsset.name }}</span>
                <span class="lb-path">{{ lightboxAsset.path }}</span>
              </div>
              <div class="lb-header-actions">
                <span class="adp-pill">{{ lightboxAsset.ext.toUpperCase() }}</span>
                <span class="adp-pill">{{ formatSize(lightboxAsset.size) }}</span>
                <button class="lb-icon-btn" @click="copyMarkdown(lightboxAsset)" :title="copiedPath === lightboxAsset.path ? 'Copied!' : 'Copy Markdown Tag'">
                  <svg v-if="copiedPath !== lightboxAsset.path" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  <svg v-else viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#22c55e" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                </button>
                <button class="lb-icon-btn" @click="copyPath(lightboxAsset)" title="Copy Path">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                </button>
                <button class="lb-icon-btn lb-close-btn" @click="closeLightbox" title="Close (Esc)">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>

            <!-- Preview area -->
            <div class="lb-media">
              <img v-if="isImage(lightboxAsset)" :src="lightboxAsset.rawUrl" :alt="lightboxAsset.name" class="lb-img" />
              <video v-else-if="isVideo(lightboxAsset)" :src="lightboxAsset.rawUrl" controls autoplay class="lb-video"></video>
              <div v-else class="lb-file-fallback">
                <svg viewBox="0 0 24 24" width="60" height="60" fill="none" stroke="currentColor" stroke-width="1" opacity="0.4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <p>Preview not available for <strong>.{{ lightboxAsset.ext }}</strong> files.</p>
                <a :href="lightboxAsset.rawUrl" target="_blank" class="lb-open-link">Open in new tab ↗</a>
              </div>
            </div>

            <!-- Counter -->
            <div class="lb-counter">{{ lightboxIndex + 1 }} / {{ filteredAssets.length }}</div>
          </div>

          <!-- Nav: next -->
          <button class="lb-nav lb-next" @click="navLightbox(1)" v-if="filteredAssets.length > 1">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </transition>
    </teleport>

  </div>
</template>

<script>
export default {
  name: 'PanelMediaManager',
  props: {
    githubToken: { type: String, default: '' },
    repoOwner: { type: String, default: '' },
    repoName: { type: String, default: '' },
    repoBranch: { type: String, default: 'main' }
  },
  data() {
    return {
      assets: [],
      isLoading: false,
      hasFetched: false,
      lightboxAsset: null,
      lightboxIndex: 0,
      activeFilter: 'all',
      searchQuery: '',
      copiedPath: null
    }
  },
  mounted() {
    window.addEventListener('keydown', this.onKey);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onKey);
  },
  computed: {
    totalSize() {
      return this.assets.reduce((sum, a) => sum + (a.size || 0), 0);
    },
    imageAssets() {
      return this.assets.filter(a => ['png', 'jpg', 'jpeg', 'webp', 'gif', 'avif'].includes(a.ext));
    },
    svgAssets() {
      return this.assets.filter(a => a.ext === 'svg');
    },
    filters() {
      return [
        { id: 'all', label: 'ALL', count: this.assets.length },
        { id: 'image', label: 'IMAGES', count: this.imageAssets.length },
        { id: 'svg', label: 'SVG', count: this.svgAssets.length },
        { id: 'other', label: 'OTHER', count: this.assets.filter(a => !['png','jpg','jpeg','webp','gif','avif','svg'].includes(a.ext)).length }
      ];
    },
    filteredAssets() {
      let list = this.assets;
      if (this.activeFilter === 'image') list = this.imageAssets;
      else if (this.activeFilter === 'svg') list = this.svgAssets;
      else if (this.activeFilter === 'other') list = list.filter(a => !['png','jpg','jpeg','webp','gif','avif','svg'].includes(a.ext));
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        list = list.filter(a => a.name.toLowerCase().includes(q) || a.path.toLowerCase().includes(q));
      }
      return list;
    }
  },
  methods: {
    getHeaders() {
      const h = { 'Accept': 'application/vnd.github.v3+json' };
      if (this.githubToken) h['Authorization'] = `token ${this.githubToken}`;
      return h;
    },
    async fetchAssets() {
      if (!this.repoOwner || !this.repoName || this.isLoading) return;
      this.isLoading = true;
      this.assets = [];
      this.selectedAsset = null;
      try {
        const res = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/git/trees/${this.repoBranch}?recursive=1`, { headers: this.getHeaders() });
        if (!res.ok) throw new Error(`API Error ${res.status}`);
        const data = await res.json();

        const exts = ['png','jpg','jpeg','webp','gif','svg','ico','avif','mp4','pdf','zip'];
        this.assets = (data.tree || [])
          .filter(f => f.type === 'blob' && exts.some(e => f.path.toLowerCase().endsWith('.' + e)))
          .map(f => {
            const name = f.path.split('/').pop();
            const ext = name.split('.').pop().toLowerCase();
            return {
              path: f.path,
              name,
              ext,
              size: f.size || 0,
              sha: f.sha,
              rawUrl: `https://raw.githubusercontent.com/${this.repoOwner}/${this.repoName}/${this.repoBranch}/${f.path}`
            };
          })
          .sort((a, b) => b.size - a.size);

        this.hasFetched = true;
      } catch (e) {
        console.error('Media scan failed:', e);
      } finally {
        this.isLoading = false;
      }
    },
    isImage(asset) {
      return ['png','jpg','jpeg','webp','gif','avif'].includes(asset.ext);
    },
    isVideo(asset) {
      return ['mp4','webm','mov'].includes(asset.ext);
    },
    formatSize(bytes) {
      if (!bytes) return '0 B';
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    },
    openLightbox(asset) {
      this.lightboxIndex = this.filteredAssets.findIndex(a => a.path === asset.path);
      this.lightboxAsset = asset;
    },
    closeLightbox() {
      this.lightboxAsset = null;
    },
    navLightbox(dir) {
      const len = this.filteredAssets.length;
      this.lightboxIndex = (this.lightboxIndex + dir + len) % len;
      this.lightboxAsset = this.filteredAssets[this.lightboxIndex];
    },
    onKey(e) {
      if (!this.lightboxAsset) return;
      if (e.key === 'Escape') this.closeLightbox();
      if (e.key === 'ArrowRight') this.navLightbox(1);
      if (e.key === 'ArrowLeft') this.navLightbox(-1);
    },
    copyMarkdown(asset) {
      const tag = this.isImage(asset) ? `![${asset.name}](/${asset.path})` : `[${asset.name}](/${asset.path})`;
      navigator.clipboard.writeText(tag);
      this.copiedPath = asset.path;
      setTimeout(() => { this.copiedPath = null; }, 2000);
    },
    copyPath(asset) {
      navigator.clipboard.writeText('/' + asset.path);
      this.copiedPath = 'path_' + asset.path;
      setTimeout(() => { this.copiedPath = null; }, 2000);
    },
    onImgError(e) {
      e.target.style.display = 'none';
      e.target.parentElement.classList.add('img-error');
    }
  }
}
</script>

<style scoped>
.media-manager-view { padding: 20px 24px 80px; animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.mm-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; gap: 16px; flex-wrap: wrap; }
.mm-title { font-size: 24px; font-weight: 800; color: var(--text-primary); margin: 0 0 4px; }
.mm-subtitle { font-size: 13px; color: var(--text-muted); margin: 0; }

.scan-btn { display: flex; align-items: center; gap: 8px; background: var(--accent, #6366f1); color: #fff; border: none; padding: 10px 18px; border-radius: 8px; font-size: 11px; font-weight: 800; letter-spacing: 0.8px; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
.scan-btn:hover:not(:disabled) { filter: brightness(1.15); transform: translateY(-1px); }
.scan-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.mm-kpis { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
.kpi-pill { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 40px; padding: 8px 18px; display: flex; align-items: center; gap: 10px; }
.kp-val { font-size: 18px; font-weight: 900; color: var(--text-primary); font-family: monospace; }
.kp-lbl { font-size: 10px; font-weight: 700; color: var(--text-muted); letter-spacing: 1px; }

.mm-filters { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; align-items: center; }
.filter-btn { display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); color: var(--text-muted); font-size: 10px; font-weight: 700; letter-spacing: 0.8px; padding: 6px 12px; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
.filter-btn.active { background: rgba(var(--accent-rgb, 99,102,241),0.15); border-color: rgba(var(--accent-rgb, 99,102,241),0.4); color: var(--accent, #6366f1); }
.filter-count { background: rgba(255,255,255,0.08); border-radius: 10px; padding: 1px 6px; font-size: 9px; }
.mm-search { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 6px; padding: 6px 12px; flex: 1; min-width: 180px; }
.mm-search svg { opacity: 0.4; flex-shrink: 0; }
.mm-search input { background: none; border: none; outline: none; color: var(--text-primary); font-size: 12px; width: 100%; }
.mm-search input::placeholder { color: var(--text-muted); }

.mm-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; padding: 80px 40px; color: var(--text-muted); font-size: 13px; text-align: center; }
.empty-spinner { width: 32px; height: 32px; border: 2px solid rgba(255,255,255,0.1); border-top-color: var(--accent, #6366f1); border-radius: 50%; animation: spin 0.8s linear infinite; }

.asset-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; }
.asset-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; overflow: hidden; cursor: pointer; transition: all 0.2s; }
.asset-card:hover { border-color: rgba(var(--accent-rgb, 99,102,241),0.4); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
.asset-card.selected { border-color: var(--accent, #6366f1); box-shadow: 0 0 0 2px rgba(var(--accent-rgb, 99,102,241),0.25); }

.asset-preview { position: relative; width: 100%; aspect-ratio: 1; overflow: hidden; background: rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; }
.asset-preview img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
.asset-card:hover .asset-preview img { transform: scale(1.05); }
.asset-icon-preview { display: flex; flex-direction: column; align-items: center; gap: 6px; opacity: 0.5; }
.asset-icon-preview span { font-size: 10px; font-weight: 700; letter-spacing: 1px; }
.asset-ext-badge { position: absolute; top: 6px; right: 6px; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); color: #fff; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; letter-spacing: 0.5px; }

.asset-info { padding: 8px 10px; }
.asset-name { display: block; font-size: 11px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
.asset-size { font-size: 10px; color: var(--text-muted); font-family: monospace; }

/* Hover overlay on card */
.asset-hover-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; backdrop-filter: blur(2px); }
.asset-card:hover .asset-hover-overlay { opacity: 1; }
.video-preview { color: rgba(255,255,255,0.7); }

/* LIGHTBOX */
.lb-fade-enter-active, .lb-fade-leave-active { transition: opacity 0.25s ease; }
.lb-fade-enter-from, .lb-fade-leave-to { opacity: 0; }

.mm-lightbox { position: fixed; inset: 0; z-index: 99999; background: rgba(0,0,0,0.92); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; gap: 16px; padding: 16px; }

.lb-nav { flex-shrink: 0; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); color: #fff; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; z-index: 1; }
.lb-nav:hover { background: rgba(255,255,255,0.15); transform: scale(1.1); }

.lb-box { flex: 1; max-width: 900px; max-height: 90vh; background: rgba(15,15,28,0.95); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; }

.lb-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.08); flex-shrink: 0; }
.lb-meta { min-width: 0; }
.lb-name { display: block; font-size: 14px; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lb-path { display: block; font-size: 11px; font-family: monospace; color: rgba(255,255,255,0.4); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lb-header-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.adp-pill { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 3px 10px; font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.5); letter-spacing: 0.5px; }
.lb-icon-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); width: 30px; height: 30px; border-radius: 7px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
.lb-icon-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }
.lb-close-btn:hover { background: rgba(239,68,68,0.2); border-color: rgba(239,68,68,0.5); color: #ef4444; }

.lb-media { flex: 1; display: flex; align-items: center; justify-content: center; overflow: hidden; background: rgba(0,0,0,0.3); min-height: 300px; }
.lb-img { max-width: 100%; max-height: 70vh; object-fit: contain; display: block; }
.lb-video { max-width: 100%; max-height: 70vh; display: block; outline: none; }
.lb-file-fallback { display: flex; flex-direction: column; align-items: center; gap: 12px; color: rgba(255,255,255,0.5); font-size: 13px; text-align: center; padding: 40px; }
.lb-open-link { color: var(--accent, #6366f1); font-size: 12px; font-weight: 700; text-decoration: none; border: 1px solid rgba(99,102,241,0.4); padding: 6px 14px; border-radius: 6px; transition: all 0.2s; }
.lb-open-link:hover { background: rgba(99,102,241,0.15); }

.lb-counter { padding: 10px; text-align: center; font-size: 11px; color: rgba(255,255,255,0.3); font-family: monospace; border-top: 1px solid rgba(255,255,255,0.06); flex-shrink: 0; }

/* Light Theme */
:global(.wildfire-dashboard.light-theme) .kpi-pill { background: #fff; border-color: rgba(0,0,0,0.08); box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
:global(.wildfire-dashboard.light-theme) .filter-btn { background: #fff; border-color: rgba(0,0,0,0.1); color: #64748b; }
:global(.wildfire-dashboard.light-theme) .mm-search { background: #fff; border-color: rgba(0,0,0,0.1); }
:global(.wildfire-dashboard.light-theme) .asset-card { background: #fff; border-color: rgba(0,0,0,0.08); box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
:global(.wildfire-dashboard.light-theme) .asset-preview { background: #f1f5f9; }
:global(.wildfire-dashboard.light-theme) .asset-detail-panel { background: rgba(255,255,255,0.98); border-color: rgba(99,102,241,0.3); box-shadow: 0 -8px 40px rgba(0,0,0,0.12); }
</style>
