<template>
  <div class="all-changelogs">

    <!-- ===== HERO BANNER ===== -->
    <div class="hero-release">
      <div class="hero-bg-orb hero-orb-1"></div>
      <div class="hero-bg-orb hero-orb-2"></div>
      <div class="hero-badge-row">
        <span class="hero-badge major-badge">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor"><path d="M13 2L3 14h8l-2 8 10-12h-8l2-8z"/></svg>
          MAJOR RELEASE
        </span>
        <span class="hero-badge live-badge">
          <span class="live-dot"></span>
          LIVE
        </span>
      </div>
      <div class="hero-version-display">
        <span class="hero-v-prefix">v</span>
        <span class="hero-version-num">3.0.0</span>
      </div>
      <p class="hero-tagline">The most powerful version of Wildfire.ro Docs yet. Fully rebuilt from the ground up with a new design system, advanced interactive components, and real-time GitHub integration.</p>
      <div class="hero-meta-row">
        <span class="hero-meta-item">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Released May 2026
        </span>
        <span class="hero-meta-sep">·</span>
        <span class="hero-meta-item">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
          WildFiire/docs
        </span>
        <span class="hero-meta-sep">·</span>
        <span class="hero-meta-item">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><path d="M6 3v12"/><path d="M18 9c0 1.5-1.5 3-4 3s-4-1.5-4-3 1.5-3 4-3 4 1.5 4 3z"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/></svg>
          main branch
        </span>
      </div>
      <div class="hero-actions">
        <a href="/updates_wiki/updateswiki" class="hero-btn hero-btn-primary">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Commit Log
        </a>
        <a href="/updates_wiki/contribute" class="hero-btn hero-btn-secondary">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Contribuie
        </a>
      </div>
    </div>

    <!-- ===== STATS BAR ===== -->
    <div class="stats-bar">
      <div class="stat-pill" v-for="stat in statsData" :key="stat.label">
        <span class="stat-pill-icon" v-html="stat.icon"></span>
        <div class="stat-pill-body">
          <span class="stat-pill-value">{{ stat.value }}</span>
          <span class="stat-pill-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>

    <!-- ===== TIMELINE HEADER ===== -->
    <div class="timeline-header">
      <div class="timeline-header-left">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <span>Version History</span>
      </div>
      <div class="timeline-header-right">
        <button 
          class="expand-toggle" 
          @click="expandAll = !expandAll"
          @keydown.enter="expandAll = !expandAll"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
            <path v-if="!expandAll" d="M5 12h14M12 5l7 7-7 7"/>
            <path v-else d="M5 9l7-7 7 7M5 15l7 7 7-7"/>
          </svg>
          {{ expandAll ? 'Collapse All' : 'Expand All' }}
        </button>
      </div>
    </div>

    <!-- ===== VERSION TIMELINE ===== -->
    <div class="timeline">
      <div 
        v-for="(version, idx) in versions" 
        :key="version.tag"
        class="timeline-entry"
        :class="{ 'is-latest': idx === 0 }"
      >
        <!-- Node -->
        <div class="timeline-node-col">
          <div class="timeline-node" :class="`node-${version.type}`">
            <span v-html="version.nodeIcon"></span>
          </div>
          <div class="timeline-line" v-if="idx < versions.length - 1"></div>
        </div>

        <!-- Card -->
        <div class="version-card" :class="`card-${version.type}`">
          <!-- Card Header -->
          <div class="version-card-header" @click="toggleVersion(version.tag)">
            <div class="version-card-left">
              <div class="version-tag-row">
                <span class="version-tag-name">{{ version.tag }}</span>
                <span class="version-type-badge" :class="`badge-${version.type}`">{{ version.typeLabel }}</span>
                <span v-if="idx === 0" class="latest-chip">LATEST</span>
              </div>
              <p class="version-title">{{ version.title }}</p>
              <div class="version-meta">
                <span class="version-date">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  {{ version.date }}
                </span>
                <span class="version-commits">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4"/><line x1="1.05" y1="12" x2="7" y2="12"/><line x1="17.01" y1="12" x2="22.96" y2="12"/></svg>
                  {{ version.commitCount }} commits
                </span>
              </div>
            </div>
            <div class="version-card-toggle" :class="{ open: openVersions[version.tag] || expandAll }">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6"/></svg>
            </div>
          </div>

          <!-- Card Body (expandable) -->
          <transition name="version-expand">
            <div v-if="openVersions[version.tag] || expandAll" class="version-card-body">

              <!-- Highlights -->
              <div class="body-section" v-if="version.highlights && version.highlights.length">
                <div class="body-section-label">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  Highlights
                </div>
                <ul class="highlight-list">
                  <li v-for="h in version.highlights" :key="h.text" class="highlight-item">
                    <span class="highlight-dot" :class="`dot-${h.type}`"></span>
                    <span class="highlight-text">{{ h.text }}</span>
                    <span class="highlight-tag" :class="`htag-${h.type}`">{{ h.type }}</span>
                  </li>
                </ul>
              </div>

              <!-- Features -->
              <div class="body-section" v-if="version.features && version.features.length">
                <div class="body-section-label">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                  New Features
                </div>
                <div class="feature-chips">
                  <span v-for="f in version.features" :key="f" class="feature-chip">{{ f }}</span>
                </div>
              </div>

              <!-- Fixes -->
              <div class="body-section" v-if="version.fixes && version.fixes.length">
                <div class="body-section-label">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                  Bug Fixes
                </div>
                <ul class="fix-list">
                  <li v-for="f in version.fixes" :key="f" class="fix-item">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
                    {{ f }}
                  </li>
                </ul>
              </div>

              <!-- Contributors -->
              <div class="body-section contributors-section" v-if="version.contributors && version.contributors.length">
                <div class="body-section-label">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  Contributors
                </div>
                <div class="contributors-row">
                  <a 
                    v-for="c in version.contributors" 
                    :key="c" 
                    :href="`https://github.com/${c}`" 
                    target="_blank"
                    class="contributor-avatar"
                    :title="`@${c}`"
                  >
                    <img :src="`https://github.com/${c}.png?size=40`" :alt="c" loading="lazy">
                    <span class="contributor-tooltip">@{{ c }}</span>
                  </a>
                </div>
              </div>

            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- ===== CONTRIBUTE CTA ===== -->
    <div class="contribute-cta-block">
      <div class="cta-glow-orb"></div>
      <div class="cta-content">
        <div class="cta-icon-wrap">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <h3 class="cta-title">Vrei să contribui la v4.0.0?</h3>
        <p class="cta-desc">Wildfire.ro Docs este construit de comunitate. Orice contributie, de la documentatie la cod, conteaza si iti va fi recunoscuta.</p>
        <div class="cta-buttons">
          <a href="/updates_wiki/contribute" class="cta-btn cta-btn-primary">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Cum poti contribui
          </a>
          <a href="https://github.com/WildFiire/docs" target="_blank" class="cta-btn cta-btn-secondary">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            GitHub Repository
          </a>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'AllChangelogs',

  data() {
    return {
      expandAll: false,
      openVersions: {},

      statsData: [
        {
          label: 'Total Versions',
          value: '3',
          icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>'
        },
        {
          label: 'Major Releases',
          value: '3',
          icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
        },
        {
          label: 'Contributors',
          value: '4+',
          icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
        },
        {
          label: 'Current Branch',
          value: 'main',
          icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"><path d="M6 3v12"/><path d="M18 9c0 1.5-1.5 3-4 3s-4-1.5-4-3 1.5-3 4-3 4 1.5 4 3z"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/></svg>'
        }
      ],

      versions: [
        {
          tag: 'v3.0.0',
          type: 'major',
          typeLabel: 'Major',
          title: 'Rebuilt from scratch — New design system, live GitHub integration, full VitePress 3 overhaul',
          date: 'May 2026',
          commitCount: '100+',
          nodeIcon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"><path d="M13 2L3 14h8l-2 8 10-12h-8l2-8z"/></svg>',
          highlights: [
            { type: 'feat', text: 'Full glassmorphism design system with dark & light mode' },
            { type: 'feat', text: 'Live GitHub commit feed — real-time changelog from API' },
            { type: 'feat', text: 'Interactive Panel with team management, contributors, analytics' },
            { type: 'feat', text: 'Custom VIP Comparison simulator page' },
            { type: 'feat', text: 'Smooth scroll via Lenis, micro-animations throughout' },
            { type: 'feat', text: 'Advanced sidebar with collapse, floating controls, new page badges' },
            { type: 'fix',  text: 'Horizontal scroll lock during text selection drag' },
            { type: 'docs', text: 'All pages rebuilt with CaseHeader + rich content blocks' },
          ],
          features: [
            'Changelogs Live',
            'Team Manager',
            'Panel Dashboard',
            'GitHub Auth',
            'Lenis Smooth Scroll',
            'FluidLightbox',
            'WfSearchModal',
            'MobileScrollSpy',
            'SidebarFloatingControls',
            'AllChangelogs Page',
            'ContributorsWF',
            'FeedbackWidget',
            'StatsGithub',
            'RelatedPages',
          ],
          fixes: [
            'Fixed horizontal shift during text-selection drag',
            'Fixed Lenis not recalculating bounds after async components load',
            'Fixed sidebar overlay on mobile breaking layout',
            'Fixed GitHub API 403 race conditions on rate-limit',
          ],
          contributors: ['iannc69', 'WildFiire'],
        },
        {
          tag: 'v2.0.0',
          type: 'major',
          typeLabel: 'Major',
          title: 'Component overhaul — First structured VitePress setup with custom theme',
          date: 'Late 2025',
          commitCount: '60+',
          nodeIcon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
          highlights: [
            { type: 'feat', text: 'Custom VitePress theme with dark mode support' },
            { type: 'feat', text: 'First structured sidebar with multi-level navigation' },
            { type: 'feat', text: 'CaseHeader component introduced for all doc pages' },
            { type: 'feat', text: 'Discord, Steam and Wildfire.ro integration links' },
            { type: 'fix',  text: 'Multiple sidebar rendering glitches resolved' },
          ],
          features: [
            'Custom VitePress Theme',
            'CaseHeader',
            'Structured Sidebar',
            'Dark Mode',
            'PageTag system',
          ],
          fixes: [
            'Sidebar collapse state not persisted across navigations',
            'Mobile nav overflow clipping content',
          ],
          contributors: ['iannc69'],
        },
        {
          tag: 'v1.0.0',
          type: 'major',
          typeLabel: 'Major',
          title: 'Initial launch — First public version of Wildfire.ro documentation',
          date: '2025',
          commitCount: '20+',
          nodeIcon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
          highlights: [
            { type: 'feat', text: 'First public documentation site for Wildfire.ro' },
            { type: 'feat', text: 'Basic VitePress setup with default theme' },
            { type: 'docs', text: 'Initial pages: About, FAQ, VIP info, Rules' },
          ],
          features: [
            'VitePress Core',
            'About Page',
            'FAQ',
            'VIP Info',
            'Server Rules',
          ],
          fixes: [],
          contributors: ['iannc69'],
        }
      ]
    }
  },

  created() {
    // Default first version open
    this.openVersions['v3.0.0'] = true
  },

  methods: {
    toggleVersion(tag) {
      this.openVersions[tag] = !this.openVersions[tag]
      this.openVersions = { ...this.openVersions }
    }
  }
}
</script>

<style scoped>
/* ===== CSS VARIABLES ===== */
.all-changelogs {
  --primary: #ff7800;
  --primary-dark: #e06500;
  --primary-glow: rgba(255, 120, 0, 0.3);
  --primary-soft: rgba(255, 120, 0, 0.12);
  --primary-xsoft: rgba(255, 120, 0, 0.06);

  --bg-card: rgba(14, 14, 14, 0.88);
  --bg-card-hover: rgba(20, 20, 20, 0.95);
  --bg-surface: rgba(10, 10, 10, 0.7);

  --text-1: #ffffff;
  --text-2: #d0d0d0;
  --text-3: #888888;

  --border: rgba(255, 255, 255, 0.08);
  --border-accent: rgba(255, 120, 0, 0.28);

  --green: #34c759;
  --green-soft: rgba(52, 199, 89, 0.14);
  --red: #ff3b30;
  --red-soft: rgba(255, 59, 48, 0.14);
  --blue: #007aff;
  --blue-soft: rgba(0, 122, 255, 0.14);
  --purple: #af52de;
  --purple-soft: rgba(175, 82, 222, 0.14);

  max-width: 780px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  color: var(--text-1);
  -webkit-font-smoothing: antialiased;
}

/* Light theme overrides */
html:not(.dark) .all-changelogs {
  --bg-card: rgba(255, 255, 255, 0.9);
  --bg-card-hover: rgba(255, 255, 255, 1);
  --bg-surface: rgba(248, 248, 248, 0.8);
  --text-1: #111111;
  --text-2: #333333;
  --text-3: #777777;
  --border: rgba(0, 0, 0, 0.08);
}

/* ===== HERO BANNER ===== */
.hero-release {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--border-accent);
  border-radius: 28px;
  padding: 42px 40px 36px;
  margin-bottom: 24px;
  overflow: hidden;
  box-shadow: 0 0 60px rgba(255, 120, 0, 0.08), 0 20px 60px rgba(0,0,0,0.4);
}

.hero-bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
}
.hero-orb-1 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(255,120,0,0.15), transparent 70%);
  top: -80px; right: -60px;
}
.hero-orb-2 {
  width: 200px; height: 200px;
  background: radial-gradient(circle, rgba(255,60,0,0.1), transparent 70%);
  bottom: -60px; left: 20px;
}

.hero-release > * { position: relative; z-index: 1; }

.hero-badge-row {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.major-badge {
  background: var(--primary-soft);
  border: 1px solid var(--border-accent);
  color: var(--primary);
}
.major-badge svg { stroke: var(--primary); }

.live-badge {
  background: rgba(52, 199, 89, 0.12);
  border: 1px solid rgba(52, 199, 89, 0.3);
  color: var(--green);
}

.live-dot {
  width: 7px; height: 7px;
  background: var(--green);
  border-radius: 50%;
  animation: live-pulse 1.8s ease infinite;
}

@keyframes live-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.hero-version-display {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 14px;
}

.hero-v-prefix {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary);
  opacity: 0.7;
}

.hero-version-num {
  font-size: 64px;
  font-weight: 800;
  background: linear-gradient(135deg, #ff9500, #ff4500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  letter-spacing: -2px;
}

.hero-tagline {
  font-size: 15px;
  line-height: 1.65;
  color: var(--text-2);
  margin: 0 0 20px;
  max-width: 560px;
}

.hero-meta-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 26px;
}

.hero-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--text-3);
}
.hero-meta-item svg { stroke: var(--text-3); }
.hero-meta-sep { color: var(--text-3); font-size: 12px; }

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 24px;
  border-radius: 40px;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.22s ease;
  cursor: pointer;
}

.hero-btn-primary {
  background: linear-gradient(135deg, var(--primary), #e05a00);
  color: white;
  box-shadow: 0 4px 18px rgba(255, 120, 0, 0.35);
}
.hero-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(255, 120, 0, 0.45);
}
.hero-btn-secondary {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  color: var(--text-2);
}
.hero-btn-secondary:hover {
  border-color: var(--border-accent);
  color: var(--primary);
  transform: translateY(-2px);
}
.hero-btn svg { flex-shrink: 0; }

/* ===== STATS BAR ===== */
.stats-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 32px;
}

@media (max-width: 640px) {
  .stats-bar { grid-template-columns: repeat(2, 1fr); }
}

.stat-pill {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 14px 16px;
  transition: border-color 0.2s, transform 0.2s;
}
.stat-pill:hover {
  border-color: var(--border-accent);
  transform: translateY(-2px);
}

.stat-pill-icon {
  width: 36px; height: 36px;
  background: var(--primary-soft);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.stat-pill-icon :deep(svg) { stroke: var(--primary); }

.stat-pill-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.stat-pill-value {
  font-size: 20px;
  font-weight: 800;
  color: var(--text-1);
  line-height: 1;
}
.stat-pill-label {
  font-size: 11px;
  color: var(--text-3);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ===== TIMELINE HEADER ===== */
.timeline-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 0 2px;
}

.timeline-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-1);
}
.timeline-header-left svg { stroke: var(--primary); }

.expand-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 30px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-3);
  cursor: pointer;
  transition: all 0.2s;
}
.expand-toggle:hover {
  border-color: var(--border-accent);
  color: var(--primary);
}
.expand-toggle svg { stroke: currentColor; }

/* ===== TIMELINE ===== */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 32px;
}

.timeline-entry {
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: 16px;
  position: relative;
}

/* Node column */
.timeline-node-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
}

.timeline-node {
  width: 36px; height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  transition: transform 0.2s;
}

.timeline-entry:hover .timeline-node { transform: scale(1.1); }

.node-major {
  background: linear-gradient(135deg, var(--primary), #e05a00);
  box-shadow: 0 0 20px rgba(255, 120, 0, 0.4);
}
.node-major svg { stroke: white; }

.node-minor {
  background: rgba(0, 122, 255, 0.15);
  border: 2px solid var(--blue);
}
.node-minor svg { stroke: var(--blue); }

.node-patch {
  background: rgba(52, 199, 89, 0.12);
  border: 2px solid var(--green);
}
.node-patch svg { stroke: var(--green); }

.timeline-line {
  width: 2px;
  flex: 1;
  min-height: 24px;
  background: linear-gradient(to bottom, var(--border-accent), var(--border));
  margin: 4px 0;
  border-radius: 2px;
}

/* Version card */
.version-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  margin-bottom: 16px;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.version-card:hover { border-color: var(--border-accent); }

.is-latest .version-card {
  border-color: var(--border-accent);
  box-shadow: 0 0 30px rgba(255, 120, 0, 0.1);
}


/* Card header */
.version-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 22px;
  cursor: pointer;
  user-select: none;
}
.version-card-header:hover { background: rgba(255, 120, 0, 0.02); }

.version-card-left { flex: 1; min-width: 0; }

.version-tag-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}

.version-tag-name {
  font-size: 18px;
  font-weight: 800;
  color: var(--primary);
  font-family: 'Share Tech Mono', 'Courier New', monospace;
}

.version-type-badge {
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.badge-major { background: var(--primary-soft); border: 1px solid var(--border-accent); color: var(--primary); }
.badge-minor { background: var(--blue-soft); border: 1px solid rgba(0,122,255,0.3); color: var(--blue); }
.badge-patch { background: var(--green-soft); border: 1px solid rgba(52,199,89,0.3); color: var(--green); }

.latest-chip {
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: linear-gradient(135deg, var(--primary), #e05a00);
  color: white;
  animation: chip-pulse 2.5s ease infinite;
}

@keyframes chip-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255,120,0,0.3); }
  50% { box-shadow: 0 0 0 5px rgba(255,120,0,0); }
}

.version-title {
  font-size: 13.5px;
  color: var(--text-2);
  line-height: 1.5;
  margin: 0 0 8px;
}

.version-meta {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}
.version-date, .version-commits {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-3);
}
.version-date svg, .version-commits svg { stroke: var(--text-3); }

.version-card-toggle {
  width: 28px; height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--primary-xsoft);
  border: 1px solid var(--border);
  flex-shrink: 0;
  margin-top: 4px;
  transition: transform 0.25s ease, background 0.2s;
}
.version-card-toggle svg { stroke: var(--text-3); transition: stroke 0.2s; }
.version-card-toggle.open { transform: rotate(180deg); background: var(--primary-soft); }
.version-card-toggle.open svg { stroke: var(--primary); }

/* Card body */
.version-card-body {
  padding: 0 22px 20px;
  border-top: 1px solid var(--border);
}

/* Expand transition */
.version-expand-enter-active,
.version-expand-leave-active {
  transition: max-height 0.32s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.22s ease;
  overflow: hidden;
  max-height: 800px;
}
.version-expand-enter-from,
.version-expand-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Body sections */
.body-section {
  margin-top: 18px;
}

.body-section-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-3);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 10px;
}
.body-section-label svg { stroke: var(--primary); }

/* Highlights */
.highlight-list {
  list-style: none;
  padding: 0; margin: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  color: var(--text-2);
}

.highlight-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}
.dot-feat { background: var(--green); }
.dot-fix  { background: var(--red); }
.dot-docs { background: var(--blue); }
.dot-refactor { background: var(--purple); }

.highlight-text { flex: 1; }

.highlight-tag {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
  flex-shrink: 0;
}
.htag-feat { background: var(--green-soft); color: var(--green); }
.htag-fix  { background: var(--red-soft);   color: var(--red); }
.htag-docs { background: var(--blue-soft);  color: var(--blue); }
.htag-refactor { background: var(--purple-soft); color: var(--purple); }

/* Feature chips */
.feature-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.feature-chip {
  padding: 4px 12px;
  background: var(--primary-xsoft);
  border: 1px solid rgba(255, 120, 0, 0.18);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);
  transition: background 0.15s, border-color 0.15s;
}
.feature-chip:hover {
  background: var(--primary-soft);
  border-color: var(--border-accent);
}

/* Fix list */
.fix-list {
  list-style: none;
  padding: 0; margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.fix-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13.5px;
  color: var(--text-2);
}
.fix-item svg { stroke: var(--green); margin-top: 3px; flex-shrink: 0; }

/* Contributors */

.contributors-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.contributor-avatar {
  position: relative;
  width: 38px; height: 38px;
  border-radius: 50%;
  overflow: visible;
  text-decoration: none;
  display: block;
}

.contributor-avatar img {
  width: 38px; height: 38px;
  border-radius: 50%;
  border: 2px solid var(--border);
  transition: border-color 0.2s, transform 0.2s;
  object-fit: cover;
}

.contributor-avatar:hover img {
  border-color: var(--primary);
  transform: scale(1.1);
}

.contributor-tooltip {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.9);
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 8px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
}
.contributor-avatar:hover .contributor-tooltip { opacity: 1; }

/* ===== CONTRIBUTE CTA ===== */
.contribute-cta-block {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--border-accent);
  border-radius: 28px;
  padding: 44px 40px;
  text-align: center;
  overflow: hidden;
  margin-top: 8px;
}

.cta-glow-orb {
  position: absolute;
  top: -60px; left: 50%;
  transform: translateX(-50%);
  width: 300px; height: 180px;
  background: radial-gradient(circle, rgba(255,120,0,0.15), transparent 70%);
  filter: blur(30px);
  pointer-events: none;
  z-index: 0;
}

.cta-content { position: relative; z-index: 1; }

.cta-icon-wrap {
  width: 64px; height: 64px;
  background: var(--primary-soft);
  border: 1px solid var(--border-accent);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}
.cta-icon-wrap svg { stroke: var(--primary); }

.cta-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-1);
  margin: 0 0 12px;
  background: linear-gradient(135deg, #ff9500, #ff4500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cta-desc {
  font-size: 14.5px;
  line-height: 1.65;
  color: var(--text-2);
  max-width: 480px;
  margin: 0 auto 28px;
}

.cta-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 40px;
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.22s ease;
  position: relative;
  overflow: hidden;
}

.cta-btn::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
  transition: left 0.5s ease;
}
.cta-btn:hover::before { left: 100%; }

.cta-btn-primary {
  background: linear-gradient(135deg, var(--primary), #e05a00);
  color: white;
  box-shadow: 0 4px 18px rgba(255, 120, 0, 0.3);
}
.cta-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(255, 120, 0, 0.45);
}
.cta-btn-secondary {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  color: var(--text-2);
}
.cta-btn-secondary:hover {
  border-color: var(--border-accent);
  color: var(--primary);
  transform: translateY(-2px);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 640px) {
  .hero-release { padding: 28px 22px 24px; }
  .hero-version-num { font-size: 48px; }
  .version-card-header { padding: 16px 16px; }
  .version-card-body { padding: 0 16px 16px; }
  .contribute-cta-block { padding: 32px 20px; }
  .timeline-entry { grid-template-columns: 36px 1fr; gap: 10px; }
}
</style>
