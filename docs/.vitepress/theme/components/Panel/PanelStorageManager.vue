<template>
  <div class="storage-view" data-lenis-prevent>
    <div class="sv-header">
      <div>
        <h2 class="sv-title">Repository Health &amp; Storage</h2>
        <p class="sv-sub">Analyze file size distribution and storage usage across your repository.</p>
      </div>
      <button class="scan-btn" @click="fetchStorage" :disabled="isLoading">
        <svg v-if="!isLoading" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        <svg v-else viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" class="spin"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>
        {{ isLoading ? 'SCANNING...' : 'ANALYZE REPO' }}
      </button>
    </div>

    <div v-if="isLoading" class="sv-empty">
      <div class="sv-spinner"></div>
      <p>Analyzing repository structure...</p>
    </div>

    <div v-else-if="!hasFetched" class="sv-empty">
      <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.3"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
      <p>Click "Analyze Repo" to scan your repository storage usage.</p>
    </div>

    <template v-else>
      <!-- KPI Row -->
      <div class="sv-kpis">
        <div class="sv-kpi" v-for="k in kpis" :key="k.label">
          <span class="sk-val">{{ k.val }}</span>
          <span class="sk-lbl">{{ k.label }}</span>
        </div>
      </div>

      <!-- Donut Chart + Legend -->
      <div class="sv-chart-row">
        <div class="donut-wrap">
          <svg viewBox="0 0 200 200" class="donut-svg">
            <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="28"/>
            <circle v-for="(seg, i) in donutSegments" :key="i"
              cx="100" cy="100" r="80"
              fill="none"
              :stroke="seg.color"
              stroke-width="26"
              stroke-linecap="butt"
              :stroke-dasharray="`${seg.dash} ${502 - seg.dash}`"
              :stroke-dashoffset="seg.offset"
              style="transition: stroke-dasharray 0.8s ease;"
            />
            <text x="100" y="94" text-anchor="middle" fill="currentColor" font-size="22" font-weight="900" class="donut-center-val">{{ formatSize(totalSize) }}</text>
            <text x="100" y="114" text-anchor="middle" fill="rgba(150,150,180,0.8)" font-size="11">TOTAL SIZE</text>
          </svg>
        </div>
        <div class="legend-list">
          <div v-for="cat in categories" :key="cat.label" class="legend-item">
            <div class="legend-dot" :style="{ background: cat.color }"></div>
            <div class="legend-info">
              <span class="legend-label">{{ cat.label }}</span>
              <span class="legend-count">{{ cat.count }} files • {{ formatSize(cat.size) }}</span>
            </div>
            <div class="legend-pct">{{ cat.pct }}%</div>
          </div>
        </div>
      </div>

      <!-- Top Largest Files -->
      <div class="sv-table-wrap">
        <div class="sv-table-hdr">LARGEST FILES</div>
        <table class="sv-table">
          <thead><tr><th>FILE</th><th>TYPE</th><th style="text-align:right">SIZE</th><th style="text-align:right">% OF TOTAL</th></tr></thead>
          <tbody>
            <tr v-for="f in topFiles" :key="f.path">
              <td class="file-path">{{ f.path }}</td>
              <td><span class="ext-badge">{{ f.ext.toUpperCase() }}</span></td>
              <td style="text-align:right; font-family:monospace; font-weight:700; color:var(--text-primary)">{{ formatSize(f.size) }}</td>
              <td style="text-align:right">
                <div class="pct-bar-wrap">
                  <div class="pct-bar" :style="{ width: ((f.size / totalSize) * 100).toFixed(1) + '%', background: colorForExt(f.ext) }"></div>
                  <span>{{ ((f.size / totalSize) * 100).toFixed(1) }}%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script>
const EXT_COLORS = {
  png: '#3b82f6', jpg: '#3b82f6', jpeg: '#3b82f6', webp: '#3b82f6', gif: '#3b82f6', avif: '#3b82f6',
  svg: '#8b5cf6', ico: '#8b5cf6',
  mp4: '#ec4899', webm: '#ec4899', mov: '#ec4899',
  md: '#22c55e', mdx: '#22c55e',
  vue: '#f59e0b', js: '#f59e0b', ts: '#f59e0b', css: '#f59e0b', json: '#f59e0b',
  pdf: '#ef4444', zip: '#ef4444', ttf: '#ef4444', woff: '#ef4444', woff2: '#ef4444'
}
const CATEGORIES = [
  { label: 'Images', exts: ['png','jpg','jpeg','webp','gif','avif'], color: '#3b82f6' },
  { label: 'Vectors & Icons', exts: ['svg','ico'], color: '#8b5cf6' },
  { label: 'Video', exts: ['mp4','webm','mov'], color: '#ec4899' },
  { label: 'Markdown', exts: ['md','mdx'], color: '#22c55e' },
  { label: 'Code & Config', exts: ['vue','js','ts','css','json','yaml','toml'], color: '#f59e0b' },
  { label: 'Other', exts: [], color: '#64748b' }
]
const CIRCUMFERENCE = 2 * Math.PI * 80; // ~502.65

export default {
  name: 'PanelStorageManager',
  props: {
    githubToken: { type: String, default: '' },
    repoOwner: { type: String, default: '' },
    repoName: { type: String, default: '' },
    repoBranch: { type: String, default: 'main' }
  },
  data() {
    return { files: [], isLoading: false, hasFetched: false }
  },
  computed: {
    totalSize() { return this.files.reduce((s, f) => s + (f.size || 0), 0) },
    topFiles() { return [...this.files].sort((a,b) => b.size - a.size).slice(0, 20) },
    categories() {
      const known = new Set(CATEGORIES.flatMap(c => c.exts));
      return CATEGORIES.map(cat => {
        const matches = cat.exts.length
          ? this.files.filter(f => cat.exts.includes(f.ext))
          : this.files.filter(f => !known.has(f.ext));
        const size = matches.reduce((s,f) => s + (f.size||0), 0);
        const pct = this.totalSize ? Math.round((size / this.totalSize) * 100) : 0;
        return { ...cat, count: matches.length, size, pct };
      }).filter(c => c.count > 0);
    },
    donutSegments() {
      let offset = CIRCUMFERENCE * 0.25; // start at top
      return this.categories.map(cat => {
        const dash = (cat.pct / 100) * CIRCUMFERENCE;
        const seg = { color: cat.color, dash, offset: -offset + CIRCUMFERENCE };
        offset += dash;
        return seg;
      });
    },
    kpis() {
      return [
        { label: 'TOTAL FILES', val: this.files.length },
        { label: 'TOTAL SIZE', val: this.formatSize(this.totalSize) },
        { label: 'LARGEST FILE', val: this.topFiles[0] ? this.formatSize(this.topFiles[0].size) : '—' },
        { label: 'AVG FILE SIZE', val: this.files.length ? this.formatSize(Math.round(this.totalSize / this.files.length)) : '—' }
      ]
    }
  },
  methods: {
    async fetchStorage() {
      if (!this.repoOwner || !this.repoName || this.isLoading) return;
      this.isLoading = true; this.files = [];
      const headers = { 'Accept': 'application/vnd.github.v3+json' };
      if (this.githubToken) headers['Authorization'] = `token ${this.githubToken}`;
      try {
        const res = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/git/trees/${this.repoBranch}?recursive=1`, { headers });
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        this.files = (data.tree || []).filter(f => f.type === 'blob').map(f => {
          const name = f.path.split('/').pop();
          const ext = name.includes('.') ? name.split('.').pop().toLowerCase() : 'other';
          return { path: f.path, name, ext, size: f.size || 0 };
        });
        this.hasFetched = true;
      } catch(e) { console.error(e); } finally { this.isLoading = false; }
    },
    formatSize(b) {
      if (!b) return '0 B';
      if (b < 1024) return b + ' B';
      if (b < 1048576) return (b/1024).toFixed(1) + ' KB';
      return (b/1048576).toFixed(2) + ' MB';
    },
    colorForExt(ext) { return EXT_COLORS[ext] || '#64748b'; }
  }
}
</script>

<style scoped>
.storage-view { padding: 20px 24px 80px; animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
.sv-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:28px; gap:16px; flex-wrap:wrap; }
.sv-title { font-size:24px; font-weight:800; color:var(--text-primary); margin:0 0 4px; }
.sv-sub { font-size:13px; color:var(--text-muted); margin:0; }
.scan-btn { display:flex; align-items:center; gap:8px; background:var(--accent,#6366f1); color: var(--text-primary); border:none; padding:10px 18px; border-radius:8px; font-size:11px; font-weight:800; letter-spacing:.8px; cursor:pointer; transition:all .2s; white-space:nowrap; }
.scan-btn:hover:not(:disabled) { filter:brightness(1.15); transform:translateY(-1px); }
.scan-btn:disabled { opacity:.6; cursor:not-allowed; }
.spin { animation:spin 1s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
.sv-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; padding:80px 40px; color:var(--text-muted); font-size:13px; text-align:center; }
.sv-spinner { width:32px; height:32px; border:2px solid rgba(255,255,255,0.1); border-top-color:var(--accent,#6366f1); border-radius:50%; animation:spin .8s linear infinite; }
.sv-kpis { display:grid; grid-template-columns:repeat(auto-fill, minmax(160px,1fr)); gap:12px; margin-bottom:28px; }
.sv-kpi { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07); border-radius:12px; padding:16px 20px; display:flex; flex-direction:column; gap:6px; }
.sk-val { font-size:22px; font-weight:900; color:var(--text-primary); font-family:monospace; }
.sk-lbl { font-size:10px; font-weight:700; color:var(--text-muted); letter-spacing:1px; }
.sv-chart-row { display:flex; gap:32px; margin-bottom:32px; align-items:center; flex-wrap:wrap; }
.donut-wrap { width:200px; flex-shrink:0; }
.donut-svg { width:100%; color:var(--text-primary); }
.donut-center-val { font-family:monospace; }
.legend-list { flex:1; display:flex; flex-direction:column; gap:12px; min-width:220px; }
.legend-item { display:flex; align-items:center; gap:12px; }
.legend-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
.legend-info { flex:1; }
.legend-label { display:block; font-size:12px; font-weight:700; color:var(--text-primary); }
.legend-count { display:block; font-size:11px; color:var(--text-muted); }
.legend-pct { font-size:13px; font-weight:800; color:var(--text-primary); font-family:monospace; width:36px; text-align:right; }
.sv-table-wrap { background:rgba(0,0,0,.2); border:1px solid rgba(255,255,255,.05); border-radius:12px; overflow:hidden; }
.sv-table-hdr { padding:14px 20px; font-size:10px; font-weight:700; letter-spacing:1px; color:var(--text-muted); border-bottom:1px solid rgba(255,255,255,.05); }
.sv-table { width:100%; border-collapse:collapse; }
.sv-table th, .sv-table td { padding:12px 20px; text-align:left; border-bottom:1px solid rgba(255,255,255,.04); }
.sv-table th { font-size:10px; font-weight:700; color:var(--text-muted); letter-spacing:1px; }
.file-path { font-family:monospace; font-size:12px; color:var(--text-primary); max-width:280px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.ext-badge { background:rgba(255,255,255,.06); border-radius:4px; padding:2px 6px; font-size:10px; font-weight:700; color:var(--text-muted); }
.pct-bar-wrap { display:flex; align-items:center; gap:8px; justify-content:flex-end; }
.pct-bar { height:4px; border-radius:2px; min-width:2px; transition:width .6s ease; }
.pct-bar-wrap span { font-size:11px; font-family:monospace; color:var(--text-muted); width:40px; text-align:right; }
:global(.wildfire-dashboard.light-theme) .sv-kpi { background: rgba(255,255,255,0.95); border-color:rgba(0,0,0,.08); box-shadow:0 2px 8px rgba(0,0,0,.05); }
:global(.wildfire-dashboard.light-theme) .sv-table-wrap { background: rgba(255,255,255,0.95); border-color:rgba(0,0,0,.08); }
:global(.wildfire-dashboard.light-theme) .sv-table th, :global(.wildfire-dashboard.light-theme) .sv-table td { border-bottom-color:rgba(0,0,0,.05); }
</style>
