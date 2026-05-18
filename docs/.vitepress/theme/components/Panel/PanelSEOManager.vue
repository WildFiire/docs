<template>
  <div class="seo-manager-view" data-lenis-prevent>
    <div class="header">
      <h2 class="title">SEO Control Center</h2>
      <p class="subtitle">Monitor and optimize the meta tags, titles, and descriptions for your documentation pages.</p>
    </div>

    <div class="seo-kpis">
      <div class="kpi-card">
        <span class="kpi-val">{{ pages.length }}</span>
        <span class="kpi-name">SCANNED PAGES</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-val ok">{{ perfectPages }}</span>
        <span class="kpi-name">OPTIMIZED</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-val err">{{ criticalPages }}</span>
        <span class="kpi-name">MISSING TAGS</span>
      </div>
    </div>

    <div class="seo-table-container">
      <div class="scan-header">
        <button class="edit-btn" @click="runScan" :disabled="isScanning">
           <span v-if="isScanning">SCANNING REPOSITORY...</span>
           <span v-else>RUN SEO SCAN (MAX 30 PAGES)</span>
        </button>
      </div>
      <table class="sm-table">
        <thead>
          <tr>
            <th>PAGE PATH</th>
            <th>TITLE</th>
            <th>DESCRIPTION</th>
            <th>SEO SCORE</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isScanning"><td colspan="4" class="loading-state">Fetching and analyzing markdown files from GitHub...</td></tr>
          <tr v-else-if="pages.length === 0 && !hasScanned"><td colspan="4" class="empty-state">Click Run Scan to analyze your repository frontmatter.</td></tr>
          <tr v-else-if="pages.length === 0 && hasScanned"><td colspan="4" class="empty-state">No pages found.</td></tr>
          
          <tr v-for="page in pages" :key="page.path" v-show="!isScanning && page.score < 100">
            <td class="page-path">{{ page.path }}</td>
            <td>
              <span class="tag" :class="page.hasTitle ? 'tag-ok' : 'tag-err'">{{ page.hasTitle ? 'Found' : 'Missing' }}</span>
            </td>
            <td>
              <span class="tag" :class="page.hasDesc ? 'tag-ok' : 'tag-err'">{{ page.hasDesc ? 'Found' : 'Missing' }}</span>
            </td>
            <td>
              <div class="score-badge" :class="getScoreClass(page.score)">
                {{ page.score }}
              </div>
            </td>
          </tr>
          <tr v-if="hasScanned && !isScanning && perfectPages === pages.length">
            <td colspan="4" class="empty-state" style="color: #22c55e;">All scanned pages are perfectly optimized!</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
export default {
  name: 'PanelSEOManager',
  props: {
    githubToken: { type: String, default: '' },
    repoOwner: { type: String, default: '' },
    repoName: { type: String, default: '' },
    repoBranch: { type: String, default: 'main' }
  },
  data() {
    return {
      pages: [],
      isScanning: false,
      hasScanned: false
    }
  },
  computed: {
    perfectPages() {
      return this.pages.filter(p => p.score === 100).length;
    },
    criticalPages() {
      return this.pages.filter(p => p.score < 100).length;
    }
  },
  methods: {
    getHeaders() {
      const headers = { 'Accept': 'application/vnd.github.v3+json' }
      if (this.githubToken) headers['Authorization'] = `token ${this.githubToken}`
      return headers
    },

    async runScan() {
      if (!this.repoOwner || !this.repoName || this.isScanning) return;
      this.isScanning = true;
      this.pages = [];
      
      try {
        const treeRes = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/git/trees/${this.repoBranch}?recursive=1`, { headers: this.getHeaders() });
        if (!treeRes.ok) throw new Error('Tree API Error');
        const treeData = await treeRes.json();
        
        if (treeData.tree) {
          const mdFiles = treeData.tree.filter(i => i.type === 'blob' && i.path.match(/\.(md|mdx)$/i)).slice(0, 30);
          
          const scanPromises = mdFiles.map(async (file) => {
             const headers = this.getHeaders();
             headers['Accept'] = 'application/vnd.github.v3.raw';
             const contentRes = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/${file.path}?ref=${this.repoBranch}`, { headers });
             const content = await contentRes.text();
             
             // Extract frontmatter block
             let hasTitle = false;
             let hasDesc = false;
             const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
             if (fmMatch) {
                const fm = fmMatch[1];
                if (/^title\s*:/m.test(fm)) hasTitle = true;
                if (/^description\s*:/m.test(fm)) hasDesc = true;
             } else {
                // Check if it uses # Title as fallback
                if (/^#\s+.+/m.test(content)) hasTitle = true;
             }

             let score = 0;
             if (hasTitle) score += 50;
             if (hasDesc) score += 50;

             return {
                path: file.path,
                hasTitle,
                hasDesc,
                score
             };
          });

          this.pages = await Promise.all(scanPromises);
          this.hasScanned = true;
        }
      } catch (e) {
        console.error('Failed to run SEO scan', e);
      } finally {
        this.isScanning = false;
      }
    },

    getScoreClass(score) {
      if (score === 100) return 'score-ok';
      if (score === 50) return 'score-warn';
      return 'score-err';
    }
  }
}
</script>

<style scoped>
.seo-manager-view { padding: 20px 24px 60px; animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.header { margin-bottom: 32px; }
.title { font-size: 24px; font-weight: 800; color: var(--text-primary); margin: 0 0 4px 0; }
.subtitle { font-size: 13px; color: var(--text-muted); margin: 0; }

.seo-kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
.kpi-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; }
.kpi-val { font-size: 32px; font-weight: 900; color: var(--text-primary); font-family: monospace; }
.kpi-val.ok { color: #22c55e; } .kpi-val.err { color: #ef4444; }
.kpi-name { font-size: 11px; font-weight: 700; color: var(--text-muted); letter-spacing: 1px; }

.seo-table-container { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; overflow: hidden; }
.scan-header { padding: 16px 20px; background: rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.05); }
.sm-table { width: 100%; border-collapse: collapse; }
.sm-table th, .sm-table td { padding: 14px 20px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.05); }
.sm-table th { font-size: 10px; font-weight: 700; color: var(--text-muted); letter-spacing: 1px; }
.page-path { font-family: monospace; font-size: 13px; color: var(--text-primary); font-weight: 600; }

.loading-state, .empty-state { text-align: center; padding: 40px !important; color: var(--text-muted); font-style: italic; font-size: 13px; }

.tag { font-size: 11px; font-family: monospace; padding: 4px 8px; border-radius: 4px; font-weight: 600; }
.tag-ok { background: rgba(34,197,94,0.1); color: #22c55e; }
.tag-warn { background: rgba(245,158,11,0.1); color: #f59e0b; }
.tag-err { background: rgba(239,68,68,0.1); color: #ef4444; }

.score-badge { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: #fff; }
.score-ok { background: #22c55e; box-shadow: 0 0 12px rgba(34,197,94,0.4); }
.score-warn { background: #f59e0b; box-shadow: 0 0 12px rgba(245,158,11,0.4); }
.score-err { background: #ef4444; box-shadow: 0 0 12px rgba(239,68,68,0.4); }

.edit-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: var(--text-primary); font-size: 10px; font-weight: 700; padding: 6px 12px; border-radius: 6px; cursor: pointer; transition: background 0.2s; }
.edit-btn:hover:not(:disabled) { background: rgba(255,255,255,0.1); }
.edit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Light Theme Overrides */
:global(.wildfire-dashboard.light-theme) .seo-manager-view .kpi-card { background: #ffffff; border-color: rgba(0,0,0,0.1); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
:global(.wildfire-dashboard.light-theme) .seo-manager-view .seo-table-container { background: #ffffff; border-color: rgba(0,0,0,0.1); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
:global(.wildfire-dashboard.light-theme) .seo-manager-view .sm-table th, :global(.wildfire-dashboard.light-theme) .seo-manager-view .sm-table td { border-bottom-color: rgba(0,0,0,0.05); }
:global(.wildfire-dashboard.light-theme) .seo-manager-view .edit-btn { background: rgba(0,0,0,0.03); border-color: rgba(0,0,0,0.1); color: #0f172a; }
:global(.wildfire-dashboard.light-theme) .seo-manager-view .edit-btn:hover { background: rgba(0,0,0,0.08); }
</style>
