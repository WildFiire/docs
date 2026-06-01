<template>
  <div v-if="contributors.length > 0 || loading" class="ctr-cli-section">
    <div class="ctr-cli-window">

      <div class="ctr-cli-topbar">
        <div class="ctr-cli-dots">
          <span class="dot close"></span>
          <span class="dot min"></span>
          <span class="dot max"></span>
        </div>
        <div class="ctr-cli-title">root@wildfiire-sys:~</div>
      </div>

      <div class="ctr-cli-body">
        
        <div class="ctr-cli-row">
          <span class="prompt">root@wildfiire</span><span class="colon">:</span><span class="dir">/docs</span><span class="symbol">#</span>
          <span class="command"> cat active_users.json | top -n 3</span>
        </div>

        <div v-if="loading" class="ctr-cli-row loading-row">
          <span class="muted">[*] Extracting commit history...</span><span class="blink">_</span>
        </div>

        <div v-else class="ctr-cli-results">
          <div class="ctr-cli-row meta-row">
            <span class="success">[ OK ]</span> 
            <span class="muted">Parsed {{ totalCommits }} commits from {{ contributors.length }} entities.</span>
          </div>

          <div class="ctr-cli-scroll-area">
            <div class="ctr-cli-list">
              <a
                v-for="(c, i) in contributors"
                :key="c.login"
                :href="c.html_url"
                target="_blank"
                rel="noopener noreferrer"
                class="ctr-cli-user"
                :title="`View GitHub profile: ${c.login}`"
                :style="{ animationDelay: `${i * 15}ms` }"
              >
                <img :src="c.avatar_url" :alt="c.login" class="ctr-cli-avatar" loading="lazy" width="18" height="18" />
                <div class="ctr-cli-info">
                  <span class="ctr-cli-name">{{ c.login }}</span>
                  <span class="ctr-cli-spacer"></span>
                  <span class="ctr-cli-commits">{{ c.commits }} {{ c.commits === 1 ? 'commit' : 'commits' }}</span>
                </div>
              </a>
            </div>
          </div>
          
          <div class="ctr-cli-row mt-end">
             <span class="prompt">root@wildfiire</span><span class="colon">:</span><span class="dir">/docs</span><span class="symbol">#</span>
             <span class="cursor blink"></span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()
const contributors = ref([])
const totalCommits = ref(0)
const loading = ref(false)
const token = import.meta.env.VITE_GITHUB_TOKEN

async function fetchContributors(filePath) {
  if (!filePath) return
  contributors.value = []
  totalCommits.value = 0
  loading.value = true
  try {
    const fullPath = `docs/${filePath}`
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
    const commitsRes = await fetch(
      `https://api.github.com/repos/Wildfiire/docs/commits?path=${fullPath}&per_page=100`,
      { headers }
    )
    const commits = await commitsRes.json()
    if (!Array.isArray(commits)) return
    
    totalCommits.value = commits.length
    const map = new Map()
    
    commits.forEach(commit => {
      const user = commit.author || commit.committer
      if (user?.login) {
        if (!map.has(user.login)) {
          map.set(user.login, {
            login: user.login,
            avatar_url: user.avatar_url,
            html_url: user.html_url,
            commits: 1
          })
        } else {
          map.get(user.login).commits += 1
        }
      }
    })
    
    contributors.value = Array.from(map.values()).sort((a, b) => b.commits - a.commits)
  } catch (err) {
    console.error('Contributors error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchContributors(page.value.relativePath))
watch(() => page.value.relativePath, (newPath) => fetchContributors(newPath))
</script>

<style scoped>
/* ── Container Global ── */
.ctr-cli-section {
  margin-top: 1.5rem;
  font-family: 'JetBrains Mono', 'Fira Code', Consolas, Monaco, monospace;
}

/* ── FEREASTRA TERMINALULUI ── */
.ctr-cli-window {
  border-radius: 6px;
  overflow: hidden;
  transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
}

/* DARK MODE */
.dark .ctr-cli-window {
  background: #050505; 
  border: 1px solid #1a1a1a;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
}

/* LIGHT MODE */
html:not(.dark) .ctr-cli-window {
  background: #ffffff;
  border: 1px solid #e1e4e8;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

/* ── Top Bar ── */
.ctr-cli-topbar {
  display: flex;
  align-items: center;
  padding: 5px 8px;
  transition: background 0.3s, border-color 0.3s;
}

.dark .ctr-cli-topbar { background: #0a0a0a; border-bottom: 1px solid #1a1a1a; }
html:not(.dark) .ctr-cli-topbar { background: #f6f8fa; border-bottom: 1px solid #e1e4e8; }

.ctr-cli-dots { display: flex; gap: 5px; }
.dot { width: 8px; height: 8px; border-radius: 50%; opacity: 0.9; }
.dot.close { background: #ff5f56; }
.dot.min   { background: #ffbd2e; }
.dot.max   { background: #27c93f; }

.ctr-cli-title {
  flex: 1; text-align: center; font-size: 9px; font-weight: 600; margin-right: 39px;
}
.dark .ctr-cli-title { color: #666; }
html:not(.dark) .ctr-cli-title { color: #888; }

/* ── Corpul Terminalului ── */
.ctr-cli-body {
  padding: 10px;
  font-size: 10.5px;
  line-height: 1.4;
}
.dark .ctr-cli-body { color: #a9b7c6; }
html:not(.dark) .ctr-cli-body { color: #24292f; }

.ctr-cli-row {
  margin-bottom: 4px;
  word-break: break-all;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.ctr-cli-row.mt-end { margin-top: 10px; margin-bottom: 0; }

/* ── Sintaxa Bash ── */
.dark .prompt  { color: var(--vp-c-brand-1); font-weight: 700; }
.dark .colon   { color: #c9d1d9; }
.dark .dir     { color: var(--vp-c-brand-1); font-weight: 700; opacity: 0.8; }
.dark .symbol  { color: #c9d1d9; margin-right: 6px; }
.dark .command { color: #e0e0e0; }
.dark .muted   { color: #555555; }
.dark .success { color: var(--vp-c-brand-1); font-weight: 700; margin-right: 6px; }

html:not(.dark) .prompt  { color: var(--vp-c-brand-1); font-weight: 700; } 
html:not(.dark) .colon   { color: #24292f; }
html:not(.dark) .dir     { color: var(--vp-c-brand-1); font-weight: 700; opacity: 0.8; } 
html:not(.dark) .symbol  { color: #24292f; margin-right: 6px; }
html:not(.dark) .command { color: #24292f; }
html:not(.dark) .muted   { color: #6e7681; }
html:not(.dark) .success { color: var(--vp-c-brand-1); font-weight: 700; margin-right: 6px; }

.meta-row { margin-top: 6px; margin-bottom: 8px; }

/* ── Cursor ── */
.cursor {
  display: inline-block; width: 6px; height: 11px;
  vertical-align: middle; margin-left: 2px;
}
.dark .cursor { background-color: var(--vp-c-brand-1); }
html:not(.dark) .cursor { background-color: var(--vp-c-brand-1); }
.blink { animation: blink-anim 1s step-end infinite; }
@keyframes blink-anim { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

/* ── ZONA DE SCROLL PENTRU FIX 3 OAMENI ── */
.ctr-cli-scroll-area {
  /* 86px = Inaltimea exacta a 3 itemi + gap-ul dintre ei */
  max-height: 86px; 
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
  margin-right: -4px;
  scrollbar-width: thin;
}

/* Custom Scrollbar Webkit */
.dark .ctr-cli-scroll-area::-webkit-scrollbar { width: 4px; }
.dark .ctr-cli-scroll-area::-webkit-scrollbar-track { background: #050505; }
.dark .ctr-cli-scroll-area::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 4px; }
.dark .ctr-cli-scroll-area::-webkit-scrollbar-thumb:hover { background: #333; }

html:not(.dark) .ctr-cli-scroll-area::-webkit-scrollbar { width: 4px; }
html:not(.dark) .ctr-cli-scroll-area::-webkit-scrollbar-track { background: transparent; }
html:not(.dark) .ctr-cli-scroll-area::-webkit-scrollbar-thumb { background: var(--vp-c-brand-1); border-radius: 4px; }

/* ── Lista de utilizatori (O singura coloana) ── */
.ctr-cli-list {
  display: flex;
  flex-direction: column;
  gap: 4px; /* Spatiu fin intre ei */
}

/* ── User Item ── */
.ctr-cli-user {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 6px;
  border-radius: 3px;
  text-decoration: none;
  background: transparent;
  transition: background 0.15s, transform 0.15s;
  animation: pop-in 0.2s ease-out forwards;
  opacity: 0;
}

@keyframes pop-in {
  from { opacity: 0; transform: translateX(-4px); }
  to   { opacity: 1; transform: translateX(0); }
}

.dark .ctr-cli-user:hover { background: #111; }
html:not(.dark) .ctr-cli-user:hover { background: rgba(0, 0, 0, 0.04); }

/* ── Avatar Micro ── */
.ctr-cli-avatar {
  width: 18px;
  height: 18px;
  border-radius: 2px;
  object-fit: cover;
  filter: grayscale(100%);
  opacity: 0.5;
  transition: filter 0.2s, opacity 0.2s;
  flex-shrink: 0;
}

.ctr-cli-user:hover .ctr-cli-avatar {
  filter: grayscale(0%);
  opacity: 1;
}

/* ── Nume & Commits (Formatate cu line punctata pe mijloc) ── */
.ctr-cli-info {
  display: flex;
  align-items: center;
  flex: 1;
  width: 100%;
}

.ctr-cli-name {
  font-size: 10.5px;
  font-weight: 600;
  white-space: nowrap;
}

.dark .ctr-cli-name { color: #aaa; }
.dark .ctr-cli-user:hover .ctr-cli-name { color: #fff; }
html:not(.dark) .ctr-cli-name { color: #24292f; }
html:not(.dark) .ctr-cli-user:hover .ctr-cli-name { color: #000; }

/* Linia punctata a la Terminal */
.ctr-cli-spacer {
  flex: 1;
  border-bottom: 1px dotted;
  margin: 0 8px;
  opacity: 0.3;
  transform: translateY(-3px);
}
.dark .ctr-cli-spacer { border-color: #666; }
html:not(.dark) .ctr-cli-spacer { border-color: #ccc; }

.ctr-cli-commits {
  font-size: 9px;
  white-space: nowrap;
}

.dark .ctr-cli-commits { color: #555; }
.dark .ctr-cli-user:hover .ctr-cli-commits { color: var(--vp-c-brand-1); }
html:not(.dark) .ctr-cli-commits { color: #8c959f; }
html:not(.dark) .ctr-cli-user:hover .ctr-cli-commits { color: var(--vp-c-brand-1); }
</style>