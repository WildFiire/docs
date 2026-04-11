<!-- docs\.vitepress\theme\components\Panel\PanelContributors.vue -->
<template>
  <div class="panel-contributors" :class="{ 'light-theme': isLightTheme }">

    <!-- ── Header Stats ── -->
    <div class="contributors-header">
      <div class="stat-card">
        <div class="stat-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
        <div class="stat-info"><span class="stat-value">{{ formatNumber(contributors.length) }}</span><span class="stat-label">CONTRIBUTORS</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></svg></div>
        <div class="stat-info"><span class="stat-value">{{ formatNumber(totalCommits) }}</span><span class="stat-label">TOTAL COMMITS</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
        <div class="stat-info"><span class="stat-value">{{ avgCommits }}</span><span class="stat-label">AVG COMMITS</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#ffd700" stroke-width="1.8"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg></div>
        <div class="stat-info"><span class="stat-value champion-name">{{ topContributor }}</span><span class="stat-label">CHAMPION</span></div>
      </div>
    </div>

    <!-- ── Podium ── -->
    <div class="ct-podium-wrap" v-if="podiumContributors.length >= 3">
      <div class="ct-podium">
        <!-- #2 Silver -->
        <div class="ct-pod-slot slot-2" @click="openProfile(podiumContributors[1].login)">
          <div class="ct-pod-avatar-ring silver"><img :src="podiumContributors[1].avatar_url" :alt="podiumContributors[1].login" class="ct-pod-img"></div>
          <div class="ct-pod-rank silver-text">#2</div>
          <div class="ct-pod-name">{{ podiumContributors[1].login }}</div>
          <div class="ct-pod-commits">{{ formatNumber(podiumContributors[1].commits || 0) }}</div>
          <div class="ct-pod-bar silver-bar" style="height:70px"></div>
        </div>
        <!-- #1 Gold -->
        <div class="ct-pod-slot slot-1" @click="openProfile(podiumContributors[0].login)">
          <div class="ct-crown-wrap"><svg viewBox="0 0 24 24" width="26" height="26" fill="#ffd700" stroke="none"><path d="M2 20h20M4 20l2-8 4 4 2-7 2 7 4-4 2 8"/></svg></div>
          <div class="ct-pod-avatar-ring gold"><img :src="podiumContributors[0].avatar_url" :alt="podiumContributors[0].login" class="ct-pod-img"></div>
          <div class="ct-pod-rank gold-text">#1</div>
          <div class="ct-pod-name">{{ podiumContributors[0].login }}</div>
          <div class="ct-pod-commits gold-commits">{{ formatNumber(podiumContributors[0].commits || 0) }}</div>
          <div class="ct-pod-bar gold-bar" style="height:100px"></div>
        </div>
        <!-- #3 Bronze -->
        <div class="ct-pod-slot slot-3" @click="openProfile(podiumContributors[2].login)">
          <div class="ct-pod-avatar-ring bronze"><img :src="podiumContributors[2].avatar_url" :alt="podiumContributors[2].login" class="ct-pod-img"></div>
          <div class="ct-pod-rank bronze-text">#3</div>
          <div class="ct-pod-name">{{ podiumContributors[2].login }}</div>
          <div class="ct-pod-commits">{{ formatNumber(podiumContributors[2].commits || 0) }}</div>
          <div class="ct-pod-bar bronze-bar" style="height:50px"></div>
        </div>
      </div>
    </div>

    <!-- ── Toolbar ── -->
    <div class="ct-toolbar">
      <div class="ct-search" :class="{ focused: searchFocused }">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4-4"/></svg>
        <input v-model="searchQuery" @focus="searchFocused=true" @blur="searchFocused=false" placeholder="Search contributors…" />
        <button v-if="searchQuery" class="ct-clear" @click="searchQuery=''">✕</button>
      </div>
      <div class="ct-sort-group">
        <button class="ct-sort-btn" :class="{ active: sortBy==='commits' }" @click="setSortBy('commits')">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></svg>
          Commits
          <span v-if="sortBy==='commits'" class="ct-sort-dir">{{ sortOrder==='desc' ? '↓' : '↑' }}</span>
        </button>
        <button class="ct-sort-btn" :class="{ active: sortBy==='prs' }" @click="setSortBy('prs')">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/></svg>
          PRs
          <span v-if="sortBy==='prs'" class="ct-sort-dir">{{ sortOrder==='desc' ? '↓' : '↑' }}</span>
        </button>
        <button class="ct-sort-btn" :class="{ active: sortBy==='impact' }" @click="setSortBy('impact')">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          Impact
          <span v-if="sortBy==='impact'" class="ct-sort-dir">{{ sortOrder==='desc' ? '↓' : '↑' }}</span>
        </button>
      </div>
    </div>

    <!-- ── Card Grid ── -->
    <div class="ct-grid">
      <div v-if="!filteredContributors.length" class="ct-empty">No contributors match</div>
      <div
        v-for="(c, idx) in paginatedContributors"
        :key="c.login"
        class="ct-card"
        :class="getCardClass(sortedRankMap[c.login])"
        @click="openProfile(c.login)"
      >
        <div class="ctc-rank-badge" :class="getRankClass(sortedRankMap[c.login])">
          #{{ sortedRankMap[c.login] }}
        </div>
        <div class="ctc-glow" :class="getCardClass(sortedRankMap[c.login])"></div>
        <div class="ctc-avatar-wrap">
          <img :src="c.avatar_url" :alt="c.login" class="ctc-avatar" :class="getCardClass(sortedRankMap[c.login])">
        </div>
        <div class="ctc-body">
          <div class="ctc-name">{{ c.login }}</div>
          <div class="ctc-level">
            <img :src="'/medals/' + getContributorLevel(c).key + '.svg'" class="ctc-level-medal" :alt="getContributorLevel(c).label">
            {{ getContributorLevel(c).label }}
            <span class="ctc-ach-badge" v-if="getAchievementCountFor(c) > 0">{{ getAchievementCountFor(c) }}✦</span>
          </div>
          <div class="ctc-stats">
            <div class="ctcs-item">
              <span class="ctcs-val">{{ formatNumber(c.commits || 0) }}</span>
              <span class="ctcs-lbl">Commits</span>
            </div>
            <div class="ctcs-sep"></div>
            <div class="ctcs-item">
              <span class="ctcs-val">{{ c.prs || 0 }}</span>
              <span class="ctcs-lbl">PRs</span>
            </div>
            <div class="ctcs-sep"></div>
            <div class="ctcs-item">
              <span class="ctcs-val">{{ c.impact ? c.impact.toFixed(1) : 0 }}%</span>
              <span class="ctcs-lbl">Impact</span>
            </div>
          </div>
          <div class="ctc-bar-track">
            <div class="ctc-bar-fill" :class="getCardClass(sortedRankMap[c.login])" :style="{ width: (c.commits / maxCommits * 100) + '%' }"></div>
          </div>
        </div>
        <div class="ctc-arrow">→</div>
      </div>
    </div>

    <!-- ── Pagination ── -->
    <div class="ct-pagination" v-if="filteredContributors.length > itemsPerPage">
      <button class="ct-page-btn" :disabled="currentPage===1" @click="currentPage--">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18L9 12L15 6"/></svg>
      </button>
      <div class="ct-page-nums">
        <button v-for="pg in totalPages" :key="pg" class="ct-page-num" :class="{ active: currentPage===pg }" @click="currentPage=pg">{{ pg }}</button>
      </div>
      <button class="ct-page-btn" :disabled="currentPage===totalPages" @click="currentPage++">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18L15 12L9 6"/></svg>
      </button>
    </div>
  </div>

  <!-- ════════════ MODAL ════════════ -->
  <transition name="modal-fade">
    <div class="cm-backdrop" v-if="showModal" @click.self="closeModal">
      <div class="cm-shell" :class="{ 'light-theme': isLightTheme }">

        <!-- Decorative background layer -->
        <div class="cm-bg-layer">
          <div class="cm-orb cm-orb-1"></div>
          <div class="cm-orb cm-orb-2"></div>
          <div class="cm-scan-line"></div>
        </div>

        <!-- Close -->
        <button class="cm-close" @click="closeModal">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <!-- Loading -->
        <div class="cm-loading" v-if="loadingModal && !contributorGHData.login">
          <div class="cm-spinner"></div>
          <span>Fetching profile…</span>
        </div>

        <template v-if="selectedContributor">

          <!-- ── Hero Section ── -->
          <div class="cm-hero">
            <div class="cm-hero-bg" :style="modalBgUrls[selectedContributor.login] ? { backgroundImage: `url('${modalBgUrls[selectedContributor.login]}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}"></div>
            <div class="cm-avatar-frame">
              <div class="cm-avatar-ring"></div>
              <img :src="selectedContributor.avatar_url" :alt="selectedContributor.login" class="cm-avatar">
              <div class="cm-avatar-pulse"></div>
              <img :src="'/medals/' + selectedLevel.key + '.svg'" class="cm-level-medal-badge" :alt="selectedLevel.label" :title="selectedLevel.label + ' level'">
            </div>
            <div class="cm-hero-info">
              <div class="cm-hero-name-row">
                <h2 class="cm-hero-name">{{ contributorGHData.name || selectedContributor.login }}</h2>
                <div class="cm-level-chip" :class="selectedLevel.key">
                  <span v-html="getLevelIcon(selectedLevel.key)"></span>
                  {{ selectedLevel.label }}
                </div>
              </div>
              <div class="cm-hero-login">@{{ selectedContributor.login }}</div>
              <p class="cm-hero-bio" v-if="contributorGHData.bio">{{ contributorGHData.bio }}</p>
              <div class="cm-hero-chips" v-if="contributorGHData.location || contributorGHData.company || contributorGHData.blog || contributorGHData.twitter_username">
                <span class="cm-hero-chip" v-if="contributorGHData.location">
                  <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {{ contributorGHData.location }}
                </span>
                <span class="cm-hero-chip" v-if="contributorGHData.company">
                  <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                  {{ contributorGHData.company }}
                </span>
                <a v-if="contributorGHData.blog" :href="contributorGHData.blog.startsWith('http') ? contributorGHData.blog : 'https://' + contributorGHData.blog" target="_blank" class="cm-hero-chip link">
                  <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  Website
                </a>
                <a v-if="contributorGHData.twitter_username" :href="'https://twitter.com/' + contributorGHData.twitter_username" target="_blank" class="cm-hero-chip link">
                  <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
                  @{{ contributorGHData.twitter_username }}
                </a>
              </div>
              <div class="cm-hero-rank-row">
                <div class="cm-rank-pill">
                  <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                  Rank #{{ selectedRank }}
                </div>
                <div class="cm-badge-unlocked" v-if="selectedUnlockedCount">
                  <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/></svg>
                  {{ selectedUnlockedCount }} achievements
                </div>
              </div>
            </div>
          </div>

          <!-- ── Quick Stats Bar ── -->
          <div class="cm-quick-stats">
            <div class="cm-qs-item">
              <span class="cm-qs-val" style="color:var(--accent)">{{ formatNumber(selectedContributor.commits || 0) }}</span>
              <span class="cm-qs-lbl">Commits</span>
            </div>
            <div class="cm-qs-div"></div>
            <div class="cm-qs-item">
              <span class="cm-qs-val">{{ selectedContributor.prs || 0 }}</span>
              <span class="cm-qs-lbl">Pull Requests</span>
            </div>
            <div class="cm-qs-div"></div>
            <div class="cm-qs-item">
              <span class="cm-qs-val">{{ selectedContributor.impact ? selectedContributor.impact.toFixed(1) + '%' : '0%' }}</span>
              <span class="cm-qs-lbl">Impact</span>
            </div>
            <div class="cm-qs-div"></div>
            <div class="cm-qs-item">
              <span class="cm-qs-val">#{{ selectedRank }}</span>
              <span class="cm-qs-lbl">Global Rank</span>
            </div>
            <template v-if="contributorGHData.followers !== undefined">
              <div class="cm-qs-div"></div>
              <div class="cm-qs-item">
                <span class="cm-qs-val">{{ formatNumber(contributorGHData.followers || 0) }}</span>
                <span class="cm-qs-lbl">Followers</span>
              </div>
            </template>
            <template v-if="contributorGHData.public_repos !== undefined">
              <div class="cm-qs-div"></div>
              <div class="cm-qs-item">
                <span class="cm-qs-val">{{ formatNumber(contributorGHData.public_repos || 0) }}</span>
                <span class="cm-qs-lbl">Public Repos</span>
              </div>
            </template>
          </div>

          <!-- ── Tab Bar ── -->
          <div class="cm-tabs">
            <button class="cm-tab" :class="{ active: modalTab==='stats' }" @click="modalTab='stats'">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              Stats
            </button>
            <button class="cm-tab" :class="{ active: modalTab==='achievements' }" @click="modalTab='achievements'">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M8.5 13L6 22h12l-2.5-9"/></svg>
              Achievements
              <span class="cm-tab-badge">{{ selectedUnlockedCount }}</span>
            </button>
            <button class="cm-tab" :class="{ active: modalTab==='info' }" @click="modalTab='info'">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Info
            </button>
            <button class="cm-tab" :class="{ active: modalTab==='activity' }" @click="modalTab='activity'">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              Activity
            </button>
          </div>

          <!-- ── STATS TAB ── -->
          <div class="cm-panel" v-show="modalTab==='stats'">
            <div class="cm-stat-grid">
              <div class="cm-stat-tile">
                <div class="cmst-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--accent)" stroke-width="2"><circle cx="12" cy="12" r="3"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></svg></div>
                <span class="cmst-val">{{ formatNumber(selectedContributor.commits || 0) }}</span>
                <span class="cmst-lbl">Commits</span>
              </div>
              <div class="cm-stat-tile">
                <div class="cmst-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#22c55e" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/></svg></div>
                <span class="cmst-val" style="color:#22c55e">{{ selectedContributor.prs || 0 }}</span>
                <span class="cmst-lbl">Pull Requests</span>
              </div>
              <div class="cm-stat-tile">
                <div class="cmst-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3b82f6" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
                <span class="cmst-val" style="color:#3b82f6">{{ selectedContributor.impact ? selectedContributor.impact.toFixed(1) : 0 }}%</span>
                <span class="cmst-lbl">Impact</span>
              </div>
              <div class="cm-stat-tile">
                <div class="cmst-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#ffd700" stroke-width="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg></div>
                <span class="cmst-val" style="color:#ffd700">#{{ selectedRank }}</span>
                <span class="cmst-lbl">Global Rank</span>
              </div>
            </div>

            <div class="cm-section-title">CONTRIBUTION vs #1</div>
            <div class="cm-contrib-bar">
              <div class="cm-contrib-labels">
                <span>{{ selectedContributor.login }}</span>
                <span class="cm-contrib-pct">{{ Math.round(selectedContributor.commits / maxCommits * 100) }}%</span>
              </div>
              <div class="cm-bar-track">
                <div class="cm-bar-fill" :style="{ width: (selectedContributor.commits / maxCommits * 100)+'%' }"></div>
              </div>
            </div>

            <div class="cm-section-title">LEVEL PROGRESS</div>
            <div class="cm-xp-section">
              <div class="cm-xp-labels">
                <span>{{ selectedContributor.commits || 0 }} commits</span>
                <span v-if="selectedNextLevel" style="color:var(--accent)">{{ selectedNextLevel.minCommits }} → {{ selectedNextLevel.label }}</span>
                <span v-else style="color:#ffd700">MAX LEVEL</span>
              </div>
              <div class="cm-xp-track">
                <div class="cm-xp-fill" :style="{ width: selectedXpProgress+'%' }"></div>
                <div class="cm-xp-glow" :style="{ width: selectedXpProgress+'%' }"></div>
              </div>
              <div class="cm-xp-progress-text">{{ selectedXpProgress.toFixed(0) }}% to next level</div>
            </div>

            <div class="cm-section-title" style="margin-top:22px">LEVEL ROADMAP</div>
            <div class="cm-level-track">
              <div v-for="(lvl, li) in levels" :key="lvl.key"
                class="cm-lvl-step"
                :class="{ earned: (selectedContributor.commits || 0) >= lvl.minCommits, active: lvl.key === selectedLevel.key }">
                <div class="cm-lvl-connector" v-if="li > 0" :class="{ filled: (selectedContributor.commits || 0) >= lvl.minCommits }"></div>
                <img :src="'/medals/' + lvl.key + '.svg'" class="cm-lvl-img" :alt="lvl.label">
                <span class="cm-lvl-name">{{ lvl.label }}</span>
                <span class="cm-lvl-min">{{ lvl.minCommits }}+</span>
              </div>
            </div>

            <div class="cm-section-title" style="margin-top:22px">RANK MEDALS</div>
            <div class="cm-rank-medals-row">
              <div v-for="rm in rankMedals" :key="rm.threshold"
                class="cm-rm-item"
                :class="{ earned: typeof selectedRank === 'number' && selectedRank <= rm.threshold }">
                <img :src="rm.img" class="cm-rm-img" :class="{ locked: !(typeof selectedRank === 'number' && selectedRank <= rm.threshold) }">
                <span class="cm-rm-label">{{ rm.label }}</span>
                <span class="cm-rm-val" :style="{ color: rm.color }" v-if="typeof selectedRank === 'number' && selectedRank <= rm.threshold">✓ Earned</span>
                <span class="cm-rm-val" v-else>Top {{ rm.threshold }}</span>
              </div>
            </div>
          </div>

          <!-- ── ACHIEVEMENTS TAB ── -->
          <div class="cm-panel" v-show="modalTab==='achievements'">
            <div class="cm-ach-header">
              <span class="cm-section-title">ACHIEVEMENTS</span>
              <span class="cm-ach-count">{{ selectedUnlockedCount }}/{{ achievements.length }}</span>
            </div>
            <div class="cm-ach-grid">
              <div
                v-for="ach in selectedAchievements"
                :key="ach.id"
                class="cm-ach-item"
                :class="[ach.rarity, { unlocked: ach.unlocked, locked: !ach.unlocked }]"
                :title="ach.unlocked ? ach.title + ': ' + ach.desc : '🔒 ' + ach.desc"
              >
                <div class="cm-ach-glow" v-if="ach.unlocked" :style="{ background: ach.color + '22' }"></div>
                <div class="cm-ach-icon" :style="ach.unlocked ? { color: ach.color, background: ach.color + '18', borderColor: ach.color + '40' } : {}">
                  <span v-html="ach.icon"></span>
                  <div class="cm-ach-shimmer" v-if="ach.unlocked && ach.rarity==='legendary'"></div>
                </div>
                <span class="cm-ach-name" :style="ach.unlocked ? { color: ach.color } : {}">{{ ach.title }}</span>
                <span class="cm-ach-rarity" :class="ach.rarity">{{ ach.rarity }}</span>
              </div>
            </div>
          </div>

          <!-- ── INFO TAB ── -->
          <div class="cm-panel" v-show="modalTab==='info'">
            <div v-if="contributorGHData.bio" class="cm-bio">{{ contributorGHData.bio }}</div>
            <div class="cm-info-chips">
              <div class="cm-info-chip" v-if="contributorGHData.location">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ contributorGHData.location }}
              </div>
              <div class="cm-info-chip" v-if="contributorGHData.company">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                {{ contributorGHData.company }}
              </div>
              <div class="cm-info-chip" v-if="contributorGHData.blog">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                {{ contributorGHData.blog }}
              </div>
            </div>
            <div class="cm-gh-stats">
              <div class="cm-gh-stat">
                <span class="cm-ghs-val">{{ formatNumber(contributorGHData.public_repos || 0) }}</span>
                <span class="cm-ghs-lbl">Public Repos</span>
              </div>
              <div class="cm-gh-stat">
                <span class="cm-ghs-val">{{ formatNumber(contributorGHData.followers || 0) }}</span>
                <span class="cm-ghs-lbl">Followers</span>
              </div>
              <div class="cm-gh-stat">
                <span class="cm-ghs-val">{{ formatNumber(contributorGHData.following || 0) }}</span>
                <span class="cm-ghs-lbl">Following</span>
              </div>
              <div class="cm-gh-stat">
                <span class="cm-ghs-val">{{ formatNumber(contributorGHData.public_gists || 0) }}</span>
                <span class="cm-ghs-lbl">Gists</span>
              </div>
            </div>
            <div class="cm-joined" v-if="contributorGHData.created_at">
              Joined GitHub {{ formatJoined(contributorGHData.created_at) }}
            </div>
          </div>

          <!-- ── ACTIVITY TAB ── -->
          <div class="cm-panel" v-show="modalTab==='activity'">
            <div v-if="loadingActivity" class="cm-act-loading">
              <div class="cm-spinner"></div>
              <span>Analysing commits…</span>
            </div>
            <template v-else>
              <!-- 30-Day Chart -->
              <div class="cm-section-title">30-DAY COMMIT ACTIVITY</div>
              <div class="cm-chart-wrap">
                <svg class="cm-act-chart" viewBox="0 0 300 56" preserveAspectRatio="none" width="100%" height="56">
                  <rect x="0" y="0" width="300" height="56" :fill="isLightTheme ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)'" rx="4"/>
                  <g v-for="(day, i) in contributorActivity" :key="day.date">
                    <rect
                      :x="i * (300/30) + 0.5"
                      :y="day.count > 0 ? 56 - Math.max((day.count / Math.max(activityMax,1)) * 50, 4) : 52"
                      :width="300/30 - 2"
                      :height="day.count > 0 ? Math.max((day.count / Math.max(activityMax,1)) * 50, 4) : 4"
                      :fill="day.count > 0 ? 'var(--accent)' : (isLightTheme ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)')"
                      :opacity="hoveredActivityDay !== null ? (hoveredActivityDay === i ? 1 : 0.22) : (day.count > 0 ? 0.55 + (day.count / Math.max(activityMax,1)) * 0.45 : 1)"
                      rx="2"
                      style="cursor:pointer"
                      @mouseenter="hoveredActivityDay = i"
                      @mouseleave="hoveredActivityDay = null"
                    />
                  </g>
                </svg>
                <div v-if="hoveredActivityDay !== null && contributorActivity[hoveredActivityDay]" class="cm-act-tip"
                  :style="{ left: ((hoveredActivityDay + 0.5) / 30 * 100) + '%' }">
                  <span class="cm-act-tip-count">{{ contributorActivity[hoveredActivityDay].count > 0 ? contributorActivity[hoveredActivityDay].count + (contributorActivity[hoveredActivityDay].count === 1 ? ' commit' : ' commits') : 'No commits' }}</span>
                  <span class="cm-act-tip-date">{{ formatActivityDate(contributorActivity[hoveredActivityDay].date) }}</span>
                </div>
                <div class="cm-chart-labels">
                  <span>30d ago</span>
                  <span style="color:var(--accent)">{{ activityTotal }} commits</span>
                  <span>Today</span>
                </div>
              </div>

              <!-- Favourite Languages -->
              <div class="cm-section-title" style="margin-top:18px">FAVOURITE LANGUAGES</div>
              <div class="cm-langs" v-if="favoriteLanguages.length">
                <div class="cm-lang-row" v-for="lang in favoriteLanguages" :key="lang.ext">
                  <span class="cm-lang-dot" :style="{ background: lang.color }"></span>
                  <span class="cm-lang-name">{{ lang.name }}</span>
                  <div class="cm-lang-track">
                    <div class="cm-lang-fill" :style="{ width: lang.pct + '%', background: lang.color }"></div>
                  </div>
                  <span class="cm-lang-pct">{{ lang.pct }}%</span>
                </div>
              </div>
              <div v-else class="cm-act-empty">No language data yet</div>

              <!-- Favourite Pages -->
              <div class="cm-section-title" style="margin-top:18px">FAVOURITE PAGES EDITED</div>
              <div class="cm-pages" v-if="favoriteFiles.length">
                <div class="cm-page-row" v-for="(file, idx) in favoriteFiles" :key="file.path">
                  <span class="cm-page-rank" :style="{ color: ['#ffd700','#c0c0c0','#cd7f32'][idx] || 'rgba(255,255,255,0.3)' }">#{{ idx+1 }}</span>
                  <span class="cm-page-icon"><svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg></span>
                  <span class="cm-page-name" :title="file.path">{{ file.name }}</span>
                  <span class="cm-page-count">{{ file.count }}×</span>
                </div>
              </div>
              <div v-else class="cm-act-empty">No page data yet</div>
            </template>
          </div>

          <!-- ── Actions ── -->
          <div class="cm-actions">
            <a :href="`https://github.com/${selectedContributor.login}`" target="_blank" class="cm-btn primary">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub Profile
            </a>
            <button class="cm-btn secondary" @click="closeModal">Close</button>
          </div>

        </template>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'PanelContributors',

  props: {
    isLightTheme: { type: Boolean, default: false },
    contributors:  { type: Array,   default: () => [] },
    totalCommits:  { type: Number,  default: 0 },
    githubToken:   { type: String,  default: '' },
    repoOwner:     { type: String,  default: '' },
    repoName:      { type: String,  default: '' }
  },

  data() {
    return {
      searchQuery: '',
      searchFocused: false,
      sortBy: 'commits',
      sortOrder: 'desc',
      currentPage: 1,
      itemsPerPage: 12,
      showModal: false,
      modalTab: 'stats',
      selectedContributor: null,
      contributorGHData: {},
      loadingModal: false,
      loadingActivity: false,
      contributorActivity: [],
      favoriteFiles: [],
      favoriteLanguages: [],
      contributorBgStyle: {},
      modalBgUrls: {},
      hoveredActivityDay: null,
      levels: [
        { key: 'newcomer', label: 'Newcomer', minCommits: 0   },
        { key: 'bronze',   label: 'Bronze',   minCommits: 5   },
        { key: 'silver',   label: 'Silver',   minCommits: 20  },
        { key: 'gold',     label: 'Gold',     minCommits: 50  },
        { key: 'platinum', label: 'Platinum', minCommits: 100 },
        { key: 'legend',   label: 'Legend',   minCommits: 200 }
      ],
      achievements: [
        { id: 'first_commit', title: 'First Blood',     desc: 'Make your first commit',         type: 'commits', threshold: 1,   color: '#ff7800', rarity: 'common',    icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></svg>' },
        { id: 'commits_5',    title: 'Getting Started', desc: 'Reach 5 commits',                type: 'commits', threshold: 5,   color: '#cd7f32', rarity: 'common',    icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
        { id: 'commits_20',   title: 'Silver Coder',    desc: 'Reach 20 commits',               type: 'commits', threshold: 20,  color: '#c0c0c0', rarity: 'rare',      icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>' },
        { id: 'commits_50',   title: 'Gold Coder',      desc: 'Reach 50 commits',               type: 'commits', threshold: 50,  color: '#ffd700', rarity: 'rare',      icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>' },
        { id: 'commits_100',  title: 'Platinum Coder',  desc: 'Reach 100 commits',              type: 'commits', threshold: 100, color: '#88d4e8', rarity: 'epic',      icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>' },
        { id: 'commits_200',  title: 'Legend',          desc: 'Reach 200 commits',              type: 'commits', threshold: 200, color: '#ff7800', rarity: 'legendary', icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>' },
        { id: 'first_pr',     title: 'Open Sesame',     desc: 'Open your first PR',             type: 'prs',     threshold: 1,   color: '#22c55e', rarity: 'common',    icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/></svg>' },
        { id: 'prs_5',        title: 'PR Machine',      desc: 'Open 5 pull requests',           type: 'prs',     threshold: 5,   color: '#4ade80', rarity: 'rare',      icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/></svg>' },
        { id: 'prs_10',       title: 'PR Legend',       desc: 'Open 10 pull requests',          type: 'prs',     threshold: 10,  color: '#22c55e', rarity: 'epic',      icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/></svg>' },
        { id: 'top10',        title: 'Top 10',          desc: 'Reach top 10 contributors',      type: 'rank',    threshold: 10,  color: '#3b82f6', rarity: 'common',    icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>' },
        { id: 'top5',         title: 'Elite',           desc: 'Reach top 5 contributors',       type: 'rank',    threshold: 5,   color: '#8b5cf6', rarity: 'rare',      icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>' },
        { id: 'top3',         title: 'Podium',          desc: 'Reach top 3 contributors',       type: 'rank',    threshold: 3,   color: '#f59e0b', rarity: 'epic',      icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6l4-4 4 4"/><path d="M12 2v10.3"/><path d="M2 20h20"/></svg>' },
        { id: 'rank1',        title: 'Champion',        desc: '#1 Top contributor of all time', type: 'rank',    threshold: 1,   color: '#ffd700', rarity: 'legendary', icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>' },
        { id: 'impact_10',   title: 'Heavy Hitter',    desc: '10%+ repository impact',         type: 'impact',  threshold: 10,  color: '#ec4899', rarity: 'rare',      icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>' },
        { id: 'impact_25',   title: 'Cornerstone',     desc: '25%+ repository impact',         type: 'impact',  threshold: 25,  color: '#f97316', rarity: 'epic',      icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>' },
        { id: 'impact_50',   title: 'Pillar',          desc: '50%+ repository impact',         type: 'impact',  threshold: 50,  color: '#ffd700', rarity: 'legendary', icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><line x1="9" y1="22" x2="9" y2="12"/><line x1="15" y1="22" x2="15" y2="12"/></svg>' },
        { id: 'commits_350', title: 'Titan',           desc: 'Reach 350 commits',              type: 'commits', threshold: 350, color: '#ff6a00', rarity: 'legendary', icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>' },
        { id: 'commits_500', title: 'Immortal',        desc: 'Reach 500 commits',              type: 'commits', threshold: 500, color: '#ff0000', rarity: 'legendary', icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>' }
      ],
      rankMedals: [
        { threshold: 1,  label: 'Champion', img: '/medals/rank1.svg',  color: '#ffd700' },
        { threshold: 3,  label: 'Podium',   img: '/medals/rank3.svg',  color: '#f59e0b' },
        { threshold: 5,  label: 'Elite',    img: '/medals/rank5.svg',  color: '#8b5cf6' },
        { threshold: 10, label: 'Top 10',   img: '/medals/rank10.svg', color: '#3b82f6' }
      ]
    }
  },

  computed: {
    filteredContributors() {
      let list = [...this.contributors]
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase()
        list = list.filter(c => c.login.toLowerCase().includes(q))
      }
      list.sort((a, b) => {
        const m = this.sortOrder === 'desc' ? -1 : 1
        if (this.sortBy === 'commits') return m * ((a.commits || 0) - (b.commits || 0))
        if (this.sortBy === 'prs')     return m * ((a.prs || 0)     - (b.prs || 0))
        if (this.sortBy === 'impact')  return m * ((a.impact || 0)  - (b.impact || 0))
        return 0
      })
      return list
    },

    sortedRankMap() {
      const sorted = [...this.contributors].sort((a, b) => (b.commits || 0) - (a.commits || 0))
      const map = {}
      sorted.forEach((c, i) => { map[c.login] = i + 1 })
      return map
    },

    paginatedContributors() {
      const s = (this.currentPage - 1) * this.itemsPerPage
      return this.filteredContributors.slice(s, s + this.itemsPerPage)
    },

    totalPages() {
      return Math.ceil(this.filteredContributors.length / this.itemsPerPage)
    },

    maxCommits() {
      return Math.max(...this.contributors.map(c => c.commits || 0), 1)
    },

    avgCommits() {
      if (!this.contributors.length) return 0
      return Math.round(this.totalCommits / this.contributors.length)
    },

    topContributor() {
      if (!this.contributors.length) return '—'
      return [...this.contributors].sort((a, b) => (b.commits || 0) - (a.commits || 0))[0]?.login || '—'
    },

    podiumContributors() {
      return [...this.contributors].sort((a, b) => (b.commits || 0) - (a.commits || 0))
    },

    selectedLevel() {
      if (!this.selectedContributor) return this.levels[0]
      const c = this.selectedContributor.commits || 0
      let lvl = this.levels[0]
      this.levels.forEach(l => { if (c >= l.minCommits) lvl = l })
      return lvl
    },

    selectedRank() {
      if (!this.selectedContributor) return '—'
      const sorted = [...this.contributors].sort((a, b) => (b.commits || 0) - (a.commits || 0))
      return sorted.findIndex(c => c.login === this.selectedContributor.login) + 1
    },

    selectedLevelIndex() {
      if (!this.selectedContributor) return 0
      const c = this.selectedContributor.commits || 0
      let idx = 0
      this.levels.forEach((l, i) => { if (c >= l.minCommits) idx = i })
      return idx
    },

    selectedNextLevel() {
      return this.levels[this.selectedLevelIndex + 1] || null
    },

    selectedXpProgress() {
      if (!this.selectedContributor) return 0
      if (!this.selectedNextLevel) return 100
      const curr = this.levels[this.selectedLevelIndex].minCommits
      const next = this.selectedNextLevel.minCommits
      const c = this.selectedContributor.commits || 0
      return Math.min(Math.max(((c - curr) / (next - curr)) * 100, 2), 100)
    },

    selectedAchievements() {
      if (!this.selectedContributor) return []
      return this.achievements.map(a => ({ ...a, unlocked: this.checkContributorAchievement(a) }))
    },

    selectedUnlockedCount() {
      return this.selectedAchievements.filter(a => a.unlocked).length
    },
    activityMax() {
      return Math.max(...this.contributorActivity.map(d => d.count), 1)
    },
    activityTotal() {
      return this.contributorActivity.reduce((s, d) => s + d.count, 0)
    }
  },

  watch: {
    searchQuery() { this.currentPage = 1 },
    sortBy()      { this.currentPage = 1 }
  },

  methods: {
    setSortBy(key) {
      if (this.sortBy === key) { this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc' }
      else { this.sortBy = key; this.sortOrder = 'desc' }
    },

    openProfile(login) {
      const contributor = this.contributors.find(c => c.login === login)
      if (!contributor) return
      this.selectedContributor = contributor
      this.contributorGHData = {}
      this.contributorActivity = []
      this.favoriteFiles = []
      this.favoriteLanguages = []
      this.loadingModal = false
      this.modalTab = 'stats'
      this.showModal = true
      this.fetchContributorData(login)
      this.fetchContributorActivity(login)
      this.fetchContributorReadmeBg(login)
      if (typeof document !== 'undefined') document.body.style.overflow = 'hidden'
    },

    async fetchContributorReadmeBg(login) {
      if (this.modalBgUrls[login] !== undefined) return
      const branches = ['main', 'master']
      for (const branch of branches) {
        try {
          const res = await fetch(`https://raw.githubusercontent.com/${login}/${login}/${branch}/README.md`)
          if (!res.ok) continue
          const text = await res.text()
          const url = this._extractReadmeBgUrl(text)
          this.modalBgUrls = { ...this.modalBgUrls, [login]: url || null }
          return
        } catch (_) {}
      }
      this.modalBgUrls = { ...this.modalBgUrls, [login]: null }
    },

    _extractReadmeBgUrl(text) {
      const mdImg = text.match(/!\[.*?\]\((https?:\/\/[^\s)]+\.(?:jpg|jpeg|png|webp|gif)(?:\?[^\s)]*)?)\)/i)
      if (mdImg) return mdImg[1]
      const imgur = text.match(/(https?:\/\/i\.imgur\.com\/[A-Za-z0-9]+\.(?:jpg|jpeg|png|webp|gif))/i)
      if (imgur) return imgur[1]
      const htmlImg = text.match(/<img[^>]+src=["'](https?:\/\/[^\s"']+)["']/i)
      if (htmlImg) return htmlImg[1]
      return null
    },

    closeModal() {
      this.showModal = false
      this.selectedContributor = null
      this.contributorGHData = {}
      if (typeof document !== 'undefined') document.body.style.overflow = ''
    },

    async fetchContributorData(login) {
      if (!this.githubToken) return
      this.loadingModal = true
      try {
        const res = await fetch(`https://api.github.com/users/${login}`, {
          headers: { 'Authorization': `token ${this.githubToken}`, 'Accept': 'application/vnd.github.v3+json' }
        })
        if (res.ok) this.contributorGHData = await res.json()
      } catch (e) { console.error('[PanelContributors] fetchContributorData:', e) }
      finally { this.loadingModal = false }
    },

    async fetchContributorActivity(login) {
      if (!this.githubToken || !this.repoOwner || !this.repoName) return
      this.loadingActivity = true
      const EXT_LANGS = {
        vue:  { name: 'Vue',        color: '#42b883' },
        js:   { name: 'JavaScript', color: '#f7df1e' },
        ts:   { name: 'TypeScript', color: '#3178c6' },
        tsx:  { name: 'TypeScript', color: '#3178c6' },
        jsx:  { name: 'JavaScript', color: '#f7df1e' },
        md:   { name: 'Markdown',   color: '#ff7800' },
        json: { name: 'JSON',       color: '#ffd700' },
        css:  { name: 'CSS',        color: '#264de4' },
        scss: { name: 'SCSS',       color: '#c6538c' },
        html: { name: 'HTML',       color: '#e44d26' },
        py:   { name: 'Python',     color: '#3572a5' },
        go:   { name: 'Go',         color: '#00add8' },
        yaml: { name: 'YAML',       color: '#cb171e' },
        yml:  { name: 'YAML',       color: '#cb171e' },
        sh:   { name: 'Shell',      color: '#89e051' },
        mts:  { name: 'TypeScript', color: '#3178c6' },
      }
      try {
        const since = new Date()
        since.setDate(since.getDate() - 29)
        const h = { 'Authorization': `token ${this.githubToken}`, 'Accept': 'application/vnd.github.v3+json' }
        const res = await fetch(
          `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/commits?author=${login}&per_page=100&since=${since.toISOString()}`,
          { headers: h }
        )
        const commits = res.ok ? await res.json() : []
        // Build 30-day activity buckets
        const days = {}
        for (let i = 29; i >= 0; i--) {
          const d = new Date(); d.setDate(d.getDate() - i)
          days[d.toISOString().split('T')[0]] = 0
        }
        commits.forEach(c => {
          const key = (c.commit?.author?.date || '').split('T')[0]
          if (key in days) days[key]++
        })
        this.contributorActivity = Object.entries(days).map(([date, count]) => ({ date, count }))
        // Fetch file details for top 15 commits
        const shas = commits.slice(0, 15).map(c => c.sha)
        const fileCounts = {}, langCounts = {}
        await Promise.all(shas.map(async sha => {
          try {
            const r = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/commits/${sha}`, { headers: h })
            if (!r.ok) return
            const d = await r.json()
            ;(d.files || []).forEach(f => {
              fileCounts[f.filename] = (fileCounts[f.filename] || 0) + 1
              const ext = (f.filename.split('.').pop() || '').toLowerCase()
              if (EXT_LANGS[ext]) langCounts[ext] = (langCounts[ext] || 0) + 1
            })
          } catch {}
        }))
        this.favoriteFiles = Object.entries(fileCounts)
          .sort((a, b) => b[1] - a[1]).slice(0, 6)
          .map(([path, count]) => ({ path, name: path.split('/').pop(), count }))
        const total = Object.values(langCounts).reduce((a, b) => a + b, 0) || 1
        this.favoriteLanguages = Object.entries(langCounts)
          .sort((a, b) => b[1] - a[1]).slice(0, 5)
          .map(([ext, count]) => ({ ext, count, name: EXT_LANGS[ext].name, color: EXT_LANGS[ext].color, pct: Math.round((count / total) * 100) }))
      } catch (e) { console.error('[PanelContributors] fetchContributorActivity:', e) }
      finally { this.loadingActivity = false }
    },

    checkContributorAchievement(a) {
      if (!this.selectedContributor) return false
      const commits = this.selectedContributor.commits || 0
      const prs = this.selectedContributor.prs || 0
      const rank = this.selectedRank
      const impact = this.selectedContributor.impact || 0
      if (a.type === 'commits') return commits >= a.threshold
      if (a.type === 'prs')     return prs >= a.threshold
      if (a.type === 'rank')    return typeof rank === 'number' && rank <= a.threshold
      if (a.type === 'impact')  return impact >= a.threshold
      return false
    },

    getAchievementCountFor(c) {
      const commits = c.commits || 0
      const prs = c.prs || 0
      const rank = this.sortedRankMap[c.login]
      const impact = c.impact || 0
      return this.achievements.filter(a => {
        if (a.type === 'commits') return commits >= a.threshold
        if (a.type === 'prs')     return prs >= a.threshold
        if (a.type === 'rank')    return typeof rank === 'number' && rank <= a.threshold
        if (a.type === 'impact')  return impact >= a.threshold
        return false
      }).length
    },

    getContributorLevel(c) {
      const commits = c.commits || 0
      let lvl = this.levels[0]
      this.levels.forEach(l => { if (commits >= l.minCommits) lvl = l })
      return lvl
    },

    getLevelColor(key) {
      if (key === 'legend') {
        return (this.$el ? (getComputedStyle(this.$el).getPropertyValue('--accent') || '').trim() : '') || '#ff7800'
      }
      const map = { newcomer:'#6b7280', bronze:'#cd7f32', silver:'#c0c0c0', gold:'#ffd700', platinum:'#88d4e8' }
      return map[key] || '#8a8a95'
    },

    getLevelGlow(key) {
      if (key === 'legend') {
        return (this.$el ? (getComputedStyle(this.$el).getPropertyValue('--accent-glow') || '').trim() : '') || 'rgba(255, 120, 0,0.3)'
      }
      const map = { newcomer:'rgba(107,114,128,0.3)', bronze:'rgba(205,127,50,0.35)', silver:'rgba(192,192,192,0.3)', gold:'rgba(255,215,0,0.4)', platinum:'rgba(136,212,232,0.35)' }
      return map[key] || 'rgba(100,100,100,0.2)'
    },

    getLevelHeroBg(key) {
      const map = {
        newcomer: 'linear-gradient(135deg, #0c0c10 0%, #1a1a24 100%)',
        bronze:   'linear-gradient(135deg, #1a0c00 0%, #3d2000 100%)',
        silver:   'linear-gradient(135deg, #0d0d14 0%, #2a2a3a 100%)',
        gold:     'linear-gradient(135deg, #1a1000 0%, #3d2d00 100%)',
        platinum: 'linear-gradient(135deg, #001018 0%, #002030 100%)',
        legend:   'linear-gradient(135deg, #1a0800 0%, #3d1000 100%)'
      }
      return map[key] || map.newcomer
    },

    getCardClass(rank) {
      if (rank === 1) return 'rank-gold'
      if (rank === 2) return 'rank-silver'
      if (rank === 3) return 'rank-bronze'
      return ''
    },

    getRankClass(rank) {
      if (rank === 1) return 'badge-gold'
      if (rank === 2) return 'badge-silver'
      if (rank === 3) return 'badge-bronze'
      return ''
    },

    getLevelIcon(key) {
      const icons = {
        newcomer: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/></svg>`,
        bronze:   `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M8.5 13L6 22h12l-2.5-9"/></svg>`,
        silver:   `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.37 7.28L12 17l-6.18 4.18 2.37-7.28L2 9.4h7.6z"/></svg>`,
        gold:     `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H3l2 10h14l2-10h-3M6 9h12"/><path d="M9 5V3h6v2"/></svg>`,
        platinum: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/></svg>`,
        legend:   `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 20h20"/><path d="M4 20l2-8 4 4 2-7 2 7 4-4 2 8"/></svg>`
      }
      return icons[key] || icons.newcomer
    },

    formatActivityDate(dateStr) {
      try {
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      } catch { return dateStr }
    },

    formatJoined(dateStr) {
      try {
        const d = new Date(dateStr)
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
      } catch { return dateStr }
    },

    formatNumber(num) {
      if (!num) return '0'
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
      if (num >= 1000)    return (num / 1000).toFixed(1) + 'K'
      return num.toString()
    }
  }
}
</script>

<style scoped>
.panel-contributors {
  --bg-secondary: #0f0f12;
  --bg-tertiary:  #16161c;
  --bg-primary:   #0a0a0e;
  --border-color: #1f1f28;
  --text-primary: #f0f0f5;
  --text-muted:   #7a7a8a;
  --accent: #ff7800;
  --accent-glow: rgba(255, 120, 0,0.2);
  --accent-dim: rgba(255, 120, 0,0.08); --accent-soft: rgba(255, 120, 0,0.15);
  --accent-mid: rgba(255, 120, 0,0.28); --accent-strong: rgba(255, 120, 0,0.45);
  --accent-heavy: rgba(255, 120, 0,0.68); --accent-solid: rgba(255, 120, 0,0.88);
  --accent-alt: #ff6030; --accent-alt2: #ff8c42;
  --success: #22c55e;
  --gold:   #ffd700;
  --silver: #c0c0c0;
  --bronze: #cd7f32;
  display: flex; flex-direction: column; gap: 16px; animation: ctFade 0.3s ease;
}
@keyframes ctFade { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:none } }
.panel-contributors.light-theme { --bg-primary:#f0f0f5; --bg-secondary:#fff; --bg-tertiary:#e2e2ea; --border-color:#c4c4d0; --text-primary:#0f0f14; --text-secondary:#2a2a38; --text-muted:#4a4a5a; }
.panel-contributors.light-theme .ct-card:hover { box-shadow:0 4px 16px rgba(0,0,0,0.1); }
.panel-contributors.light-theme .ct-toolbar { background:rgba(0,0,0,0.03); border-color:#c4c4d0; }
.panel-contributors.light-theme .ct-search { background:#fff; border-color:#c4c4d0; color:#0f0f14; }

/* ── Header Stats ── */
.contributors-header { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
.stat-card { background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:14px; padding:16px 18px; display:flex; align-items:center; gap:14px; transition:all 0.2s; }
.stat-card:hover { border-color:var(--accent); transform:translateY(-2px); box-shadow:0 6px 20px rgba(0,0,0,0.3); }
.stat-icon { width:42px; height:42px; background:var(--bg-tertiary); border-radius:10px; display:flex; align-items:center; justify-content:center; color:var(--accent); flex-shrink:0; }
.stat-value { display:block; font-size:24px; font-weight:800; color:var(--text-primary); line-height:1.2; }
.stat-value.champion-name { font-size:15px; }
.stat-label { display:block; font-size:9px; font-weight:700; color:var(--text-muted); letter-spacing:0.5px; text-transform:uppercase; margin-top:2px; }

/* ── Podium ── */
.ct-podium-wrap { background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:16px; padding:24px 20px 0; overflow:hidden; }
.ct-podium { display:flex; align-items:flex-end; justify-content:center; gap:12px; }
.ct-pod-slot { display:flex; flex-direction:column; align-items:center; gap:6px; cursor:pointer; transition:transform 0.2s; padding-bottom:0; position:relative; flex:1; max-width:160px; }
.ct-pod-slot:hover { transform:translateY(-4px); }
.ct-crown-wrap { position:absolute; top:-28px; }
.ct-pod-avatar-ring { width:64px; height:64px; border-radius:50%; padding:3px; }
.ct-pod-avatar-ring.gold { background:linear-gradient(135deg,#ffd700,#ff7800); box-shadow:0 0 20px rgba(255,215,0,0.4); }
.ct-pod-avatar-ring.silver { background:linear-gradient(135deg,#c0c0c0,#909090); box-shadow:0 0 14px rgba(192,192,192,0.3); }
.ct-pod-avatar-ring.bronze { background:linear-gradient(135deg,#cd7f32,#8b4513); box-shadow:0 0 12px rgba(205,127,50,0.3); }
.ct-pod-img { width:100%; height:100%; border-radius:50%; object-fit:cover; border:2px solid var(--bg-secondary); }
.ct-pod-rank { font-size:13px; font-weight:900; letter-spacing:0.3px; }
.gold-text { color:#ffd700; text-shadow:0 0 8px rgba(255,215,0,0.5); }
.silver-text { color:#c0c0c0; }
.bronze-text { color:#cd7f32; }
.ct-pod-name { font-size:11px; font-weight:700; color:var(--text-primary); text-align:center; max-width:100px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.ct-pod-commits { font-size:10px; color:var(--text-muted); }
.gold-commits { color:#ffd700; font-weight:600; }
.ct-pod-bar { width:100%; border-radius:4px 4px 0 0; }
.gold-bar { background:linear-gradient(180deg, rgba(255,215,0,0.25) 0%, rgba(255,215,0,0.08) 100%); border-top:2px solid rgba(255,215,0,0.4); }
.silver-bar { background:linear-gradient(180deg, rgba(192,192,192,0.18) 0%, rgba(192,192,192,0.05) 100%); border-top:2px solid rgba(192,192,192,0.3); }
.bronze-bar { background:linear-gradient(180deg, rgba(205,127,50,0.18) 0%, rgba(205,127,50,0.05) 100%); border-top:2px solid rgba(205,127,50,0.3); }
.slot-1 { z-index:2; }

/* ── Toolbar ── */
.ct-toolbar { display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; }
.ct-search { display:flex; align-items:center; gap:8px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:24px; padding:8px 14px; min-width:220px; transition:all 0.15s; color:var(--text-muted); }
.ct-search.focused { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-dim); }
.ct-search input { flex:1; background:none; border:none; outline:none; color:var(--text-primary); font-size:12px; }
.ct-search input::placeholder { color:var(--text-muted); }
.ct-clear { background:none; border:none; cursor:pointer; color:var(--text-muted); padding:0 2px; font-size:12px; transition:color 0.15s; }
.ct-clear:hover { color:var(--accent); }
.ct-sort-group { display:flex; gap:6px; flex-wrap:wrap; }
.ct-sort-btn { display:flex; align-items:center; gap:5px; padding:7px 14px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:20px; color:var(--text-muted); font-size:11px; font-weight:600; cursor:pointer; transition:all 0.15s; }
.ct-sort-btn:hover { border-color:var(--accent); color:var(--accent); }
.ct-sort-btn.active { background:var(--accent-dim); border-color:var(--accent-strong); color:var(--accent); }
.ct-sort-dir { font-size:13px; font-weight:700; }

/* ── Card Grid ── */
.ct-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(240px, 1fr)); gap:12px; }
.ct-empty { grid-column:1/-1; text-align:center; padding:40px; font-size:13px; color:var(--text-muted); }
.ct-card { position:relative; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:16px; padding:18px 16px 14px; cursor:pointer; transition:all 0.2s; overflow:hidden; display:flex; flex-direction:column; gap:10px; }
.ct-card:hover { transform:translateY(-3px); box-shadow:0 8px 28px rgba(0,0,0,0.35); border-color:rgba(255,255,255,0.1); }
.ct-card.rank-gold { border-color:rgba(255,215,0,0.25); }
.ct-card.rank-gold:hover { border-color:rgba(255,215,0,0.5); box-shadow:0 8px 28px rgba(255,215,0,0.1); }
.ct-card.rank-silver { border-color:rgba(192,192,192,0.2); }
.ct-card.rank-silver:hover { border-color:rgba(192,192,192,0.4); }
.ct-card.rank-bronze { border-color:rgba(205,127,50,0.2); }
.ct-card.rank-bronze:hover { border-color:rgba(205,127,50,0.4); }
.ctc-rank-badge { position:absolute; top:12px; right:12px; font-size:10px; font-weight:800; padding:2px 8px; border-radius:12px; background:var(--bg-tertiary); color:var(--text-muted); border:1px solid var(--border-color); }
.ctc-rank-badge.badge-gold { background:linear-gradient(135deg,#ffd700,#b8860b); color:#1a1000; border-color:transparent; }
.ctc-rank-badge.badge-silver { background:linear-gradient(135deg,#c0c0c0,#888); color:#111; border-color:transparent; }
.ctc-rank-badge.badge-bronze { background:linear-gradient(135deg,#cd7f32,#8b4513); color:#fff; border-color:transparent; }
.ctc-glow { position:absolute; top:-30px; left:-30px; width:120px; height:120px; border-radius:50%; pointer-events:none; opacity:0; transition:opacity 0.3s; }
.ct-card:hover .ctc-glow { opacity:1; }
.ctc-glow.rank-gold { background:radial-gradient(circle, rgba(255,215,0,0.12) 0%, transparent 70%); }
.ctc-glow.rank-silver { background:radial-gradient(circle, rgba(192,192,192,0.1) 0%, transparent 70%); }
.ctc-glow.rank-bronze { background:radial-gradient(circle, rgba(205,127,50,0.1) 0%, transparent 70%); }
.ctc-avatar-wrap { display:flex; justify-content:flex-start; }
.ctc-avatar { width:52px; height:52px; border-radius:50%; border:2px solid var(--border-color); transition:border-color 0.2s; }
.ctc-avatar.rank-gold { border-color:rgba(255,215,0,0.6); box-shadow:0 0 12px rgba(255,215,0,0.2); }
.ctc-avatar.rank-silver { border-color:rgba(192,192,192,0.5); }
.ctc-avatar.rank-bronze { border-color:rgba(205,127,50,0.5); }
.ctc-body { display:flex; flex-direction:column; gap:6px; }
.ctc-name { font-size:13px; font-weight:700; color:var(--text-primary); }
.ctc-level { display:flex; align-items:center; gap:5px; font-size:10px; font-weight:600; color:var(--text-muted); }
.ctc-level-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
.ctc-stats { display:flex; align-items:center; gap:0; }
.ctcs-item { display:flex; flex-direction:column; gap:1px; flex:1; }
.ctcs-val { font-size:13px; font-weight:700; color:var(--text-primary); }
.ctcs-lbl { font-size:8px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.3px; }
.ctcs-sep { width:1px; height:24px; background:var(--border-color); flex-shrink:0; margin:0 8px; }
.ctc-bar-track { height:3px; background:var(--bg-tertiary); border-radius:2px; overflow:hidden; }
.ctc-bar-fill { height:100%; background:var(--accent); border-radius:2px; transition:width 0.4s; }
.ctc-bar-fill.rank-gold { background:linear-gradient(90deg,#ffd700,#ff7800); }
.ctc-bar-fill.rank-silver { background:linear-gradient(90deg,#a0a0a0,#c0c0c0); }
.ctc-bar-fill.rank-bronze { background:linear-gradient(90deg,#a05a20,#cd7f32); }
.ctc-arrow { position:absolute; bottom:12px; right:14px; font-size:12px; color:var(--text-muted); opacity:0; transition:all 0.2s; transform:translateX(-4px); }
.ct-card:hover .ctc-arrow { opacity:1; transform:translateX(0); }

/* ── Pagination ── */
.ct-pagination { display:flex; align-items:center; justify-content:center; gap:10px; padding:8px; }
.ct-page-btn { width:34px; height:34px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; color:var(--text-muted); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.15s; }
.ct-page-btn:disabled { opacity:0.4; cursor:not-allowed; }
.ct-page-btn:not(:disabled):hover { border-color:var(--accent); color:var(--accent); }
.ct-page-nums { display:flex; gap:5px; }
.ct-page-num { width:34px; height:34px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; color:var(--text-muted); cursor:pointer; font-size:12px; font-weight:600; transition:all 0.15s; }
.ct-page-num:hover { border-color:var(--accent); color:var(--accent); }
.ct-page-num.active { background:var(--accent); color:#fff; border-color:var(--accent); }

/* ════════════ MODAL ════════════ */
.cm-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.85); backdrop-filter:blur(12px); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px; }
.cm-shell { position:relative; background:#0d0d12; border:1px solid #1f1f2c; border-top:2px solid var(--accent); border-radius:24px; width:100%; max-width:860px; max-height:92vh; overflow-y:auto; overflow-x:hidden; box-shadow:0 30px 80px rgba(0,0,0,0.7), 0 0 40px var(--accent-glow); scrollbar-width:none; -ms-overflow-style:none; }
.cm-shell.light-theme { background:#fff; border-color:#ddd; }
.cm-shell::-webkit-scrollbar { display:none !important; width:0 !important; height:0 !important; }

/* Neutral shell border for all levels */

/* Background layer */
.cm-bg-layer { position:absolute; inset:0; pointer-events:none; overflow:hidden; border-radius:24px; z-index:0; }
.cm-orb { position:absolute; border-radius:50%; filter:blur(60px); }
.cm-orb-1 { width:300px; height:300px; top:-100px; right:-80px; background:var(--accent-dim); opacity:0.7; }
.cm-orb-2 { width:200px; height:200px; bottom:0; left:-60px; background:var(--accent-dim); opacity:0.4; }
.cm-scan-line { position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent); animation:cmScan 4s ease-in-out infinite; }
@keyframes cmScan { 0%,100% { top:0; opacity:0 } 50% { top:100%; opacity:1 } }

/* Close */
.cm-close { position:absolute; top:14px; right:14px; z-index:10; width:32px; height:32px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:8px; color:rgba(255,255,255,0.5); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.15s; }
.cm-close:hover { background:var(--accent-soft); border-color:var(--accent-strong); color:var(--accent); }

/* Loading */
.cm-loading { display:flex; flex-direction:column; align-items:center; gap:14px; padding:60px; color:rgba(255,255,255,0.5); font-size:13px; position:relative; z-index:1; }
.cm-spinner { width:28px; height:28px; border:2px solid rgba(255,255,255,0.1); border-top-color:var(--accent); border-radius:50%; animation:cmSpin 0.7s linear infinite; }
@keyframes cmSpin { to { transform:rotate(360deg) } }

/* ── Hero ── */
.cm-hero { position:relative; padding:32px 28px 24px; display:flex; gap:22px; align-items:flex-start; z-index:1; }
.cm-hero-bg { position:absolute; inset:0; z-index:0; background:linear-gradient(135deg, var(--accent-dim) 0%, transparent 55%); }
.cm-avatar-frame { position:relative; flex-shrink:0; z-index:1; --ring-color:var(--accent); width:88px; height:88px; }
.cm-avatar-ring { position:absolute; inset:-4px; border-radius:50%; border:2px solid var(--ring-color); opacity:0.8; animation:cmRingPulse 2.5s ease-in-out infinite; }
@keyframes cmRingPulse { 0%,100% { transform:scale(1); opacity:0.8 } 50% { transform:scale(1.06); opacity:0.4 } }
.cm-avatar-pulse { position:absolute; inset:-10px; border-radius:50%; border:1px solid var(--ring-color); opacity:0; animation:cmRingPulse 2.5s ease-in-out infinite 0.8s; }
.cm-avatar { width:88px; height:88px; border-radius:50%; border:3px solid #0d0d12; display:block; position:relative; z-index:1; }
.cm-hero-info { flex:1; min-width:0; z-index:1; padding-top:6px; }
.cm-hero-name-row { display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:4px; }
.cm-hero-name { font-size:20px; font-weight:800; color:#fff; margin:0; }
.cm-hero-login { font-size:11px; color:rgba(255,255,255,0.45); margin-bottom:6px; }
.cm-hero-bio { font-size:11px; color:rgba(255,255,255,0.5); margin:0 0 8px; line-height:1.5; max-height:48px; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; line-clamp:2; -webkit-box-orient:vertical; }
.cm-hero-chips { display:flex; flex-wrap:wrap; gap:5px; margin-bottom:8px; }
.cm-hero-chip { display:inline-flex; align-items:center; gap:4px; font-size:9.5px; color:rgba(255,255,255,0.45); background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.08); padding:3px 8px; border-radius:20px; }
.cm-hero-chip.link { color:rgba(136,212,232,0.8); border-color:rgba(136,212,232,0.15); text-decoration:none; }
.cm-hero-chip.link:hover { color:#88d4e8; border-color:rgba(136,212,232,0.35); }
.cm-shell.light-theme .cm-hero-bio { color:rgba(0,0,0,0.5); }
.cm-shell.light-theme .cm-hero-chip { color:rgba(0,0,0,0.45); background:rgba(0,0,0,0.05); border-color:rgba(0,0,0,0.1); }
.cm-hero-rank-row { display:flex; gap:8px; flex-wrap:wrap; }
.cm-rank-pill { display:flex; align-items:center; gap:5px; background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.1); border-radius:20px; padding:4px 10px; font-size:10px; font-weight:700; color:rgba(255,255,255,0.6); }
.cm-badge-unlocked { display:flex; align-items:center; gap:5px; background:var(--accent-dim); border:1px solid var(--accent-mid); border-radius:20px; padding:4px 10px; font-size:10px; font-weight:700; color:var(--accent-heavy); }

/* Level chip */
.cm-level-chip { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:20px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.4px; border:1px solid var(--accent-mid); color:var(--accent); background:var(--accent-dim); }

/* ── Tabs ── */
.cm-tabs { display:flex; border-bottom:1px solid rgba(255,255,255,0.07); padding:0 24px; position:relative; z-index:1; background:rgba(0,0,0,0.2); }
.cm-tab { display:flex; align-items:center; gap:7px; padding:12px 16px; font-size:11px; font-weight:700; color:rgba(255,255,255,0.4); background:none; border:none; border-bottom:2px solid transparent; margin-bottom:-1px; cursor:pointer; transition:all 0.15s; position:relative; }
.cm-tab:hover { color:rgba(255,255,255,0.7); }
.cm-tab.active { color:#fff; border-bottom-color:var(--accent); }
.cm-tab-badge { font-size:9px; font-weight:800; padding:1px 5px; border-radius:8px; color:#fff; margin-left:2px; background:var(--accent); }

/* ── Panels ── */
.cm-panel { padding:20px 24px; position:relative; z-index:1; }
.cm-section-title { font-size:9px; font-weight:800; color:rgba(255,255,255,0.3); letter-spacing:0.8px; text-transform:uppercase; margin-bottom:10px; display:block; }

/* Stats grid */
.cm-stat-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:rgba(255,255,255,0.05); border-radius:14px; overflow:hidden; margin-bottom:20px; }
.cm-stat-tile { background:#0d0d12; padding:16px 10px; display:flex; flex-direction:column; align-items:center; gap:6px; text-align:center; }
.cmst-icon { opacity:0.8; }
.cmst-val { font-size:18px; font-weight:800; color:#fff; line-height:1; }
.cmst-lbl { font-size:9px; font-weight:600; color:rgba(255,255,255,0.3); text-transform:uppercase; letter-spacing:0.4px; }

/* Contribution bar */
.cm-contrib-bar { margin-bottom:20px; }
.cm-contrib-labels { display:flex; justify-content:space-between; font-size:11px; color:rgba(255,255,255,0.4); margin-bottom:6px; }
.cm-contrib-pct { font-weight:800; color:var(--accent); }
.cm-bar-track { height:8px; background:rgba(255,255,255,0.06); border-radius:4px; overflow:hidden; }
.cm-bar-fill { height:100%; border-radius:4px; transition:width 0.6s cubic-bezier(.34,1.56,.64,1); background:var(--accent); }

/* XP bar */
.cm-xp-section { margin-bottom:4px; }
.cm-xp-labels { display:flex; justify-content:space-between; font-size:10px; color:rgba(255,255,255,0.35); margin-bottom:6px; }
.cm-xp-track { height:10px; background:rgba(255,255,255,0.06); border-radius:5px; overflow:hidden; position:relative; }
.cm-xp-fill { height:100%; border-radius:5px; transition:width 0.8s cubic-bezier(.34,1.56,.64,1); position:relative; z-index:1; background:var(--accent); }
.cm-xp-glow { position:absolute; top:0; left:0; height:100%; border-radius:5px; filter:blur(6px); opacity:0.5; transition:width 0.8s; background:var(--accent); }
.cm-xp-progress-text { font-size:9px; color:rgba(255,255,255,0.25); margin-top:4px; text-align:right; }

/* Achievements */
.cm-ach-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; }
.cm-ach-count { font-size:11px; font-weight:700; color:var(--accent); }
.cm-ach-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(88px, 1fr)); gap:8px; }
.cm-ach-item { position:relative; display:flex; flex-direction:column; align-items:center; gap:5px; padding:12px 6px 10px; border-radius:12px; border:1px solid rgba(255,255,255,0.06); background:rgba(255,255,255,0.03); text-align:center; cursor:default; transition:transform 0.15s, box-shadow 0.15s; overflow:hidden; }
.cm-ach-item.unlocked:hover { transform:translateY(-2px); }
.cm-ach-item.locked { opacity:0.28; filter:grayscale(0.8); }
.cm-ach-item.legendary.unlocked { box-shadow:0 0 12px rgba(255,215,0,0.08); }
.cm-ach-item.epic.unlocked { box-shadow:0 0 10px rgba(139,92,246,0.08); }
.cm-ach-glow { position:absolute; inset:0; z-index:0; }
.cm-ach-icon { position:relative; z-index:1; width:36px; height:36px; border-radius:9px; display:flex; align-items:center; justify-content:center; border:1px solid transparent; background:rgba(255,255,255,0.05); transition:all 0.15s; }
.cm-ach-shimmer { position:absolute; inset:0; border-radius:9px; background:linear-gradient(135deg,transparent 40%,rgba(255,255,255,0.25) 50%,transparent 60%); background-size:200% 200%; animation:cmShimmer 2s ease-in-out infinite; }
@keyframes cmShimmer { 0%,100% { background-position:200% 0 } 50% { background-position:-200% 0 } }
.cm-ach-name { position:relative; z-index:1; font-size:9px; font-weight:700; color:rgba(255,255,255,0.4); line-height:1.2; }
.cm-ach-rarity { position:relative; z-index:1; font-size:8px; font-weight:700; text-transform:uppercase; letter-spacing:0.3px; }
.cm-ach-rarity.common { color:#9ca3af; }
.cm-ach-rarity.rare { color:#3b82f6; }
.cm-ach-rarity.epic { color:#8b5cf6; }
.cm-ach-rarity.legendary { color:#ffd700; }

/* Info tab */
.cm-bio { font-size:12px; color:rgba(255,255,255,0.55); line-height:1.6; margin-bottom:16px; padding:14px 16px; background:rgba(255,255,255,0.04); border-radius:10px; border:1px solid rgba(255,255,255,0.06); }
.cm-info-chips { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:16px; }
.cm-info-chip { display:flex; align-items:center; gap:7px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:20px; padding:6px 12px; font-size:11px; color:rgba(255,255,255,0.55); }
.cm-gh-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:rgba(255,255,255,0.05); border-radius:12px; overflow:hidden; margin-bottom:14px; }
.cm-gh-stat { background:#0d0d12; padding:14px 8px; display:flex; flex-direction:column; align-items:center; gap:4px; text-align:center; }
.cm-ghs-val { font-size:16px; font-weight:800; color:#fff; }
.cm-ghs-lbl { font-size:8px; font-weight:600; color:rgba(255,255,255,0.3); text-transform:uppercase; letter-spacing:0.4px; }
.cm-joined { font-size:10px; color:rgba(255,255,255,0.25); text-align:center; }

/* Quick Stats Bar */
.cm-quick-stats { display:flex; align-items:center; justify-content:center; flex-wrap:wrap; gap:0; padding:14px 24px; background:rgba(255,255,255,0.03); border-bottom:1px solid rgba(255,255,255,0.06); position:relative; z-index:1; }
.cm-qs-item { display:flex; flex-direction:column; align-items:center; gap:2px; padding:0 18px; text-align:center; }
.cm-qs-val { font-size:18px; font-weight:800; color:#fff; line-height:1.2; }
.cm-qs-lbl { font-size:9px; font-weight:600; color:rgba(255,255,255,0.35); text-transform:uppercase; letter-spacing:0.5px; }
.cm-qs-div { width:1px; height:30px; background:rgba(255,255,255,0.08); flex-shrink:0; }
.cm-shell.light-theme .cm-quick-stats { background:rgba(0,0,0,0.03); border-color:rgba(0,0,0,0.07); }
.cm-shell.light-theme .cm-qs-val { color:#111; }
.cm-shell.light-theme .cm-qs-lbl { color:rgba(0,0,0,0.4); }
.cm-shell.light-theme .cm-qs-div { background:rgba(0,0,0,0.1); }

/* Actions */
.cm-actions { display:flex; gap:10px; padding:0 24px 24px; position:relative; z-index:1; }
.cm-btn { flex:1; padding:11px 20px; border-radius:11px; font-size:12px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; text-decoration:none; transition:all 0.2s; border:none; }
.cm-btn.primary { background:var(--btn-color, var(--accent)); color:#fff; box-shadow:0 4px 16px rgba(0,0,0,0.3); }
.cm-btn.primary:hover { opacity:0.85; transform:translateY(-1px); }
.cm-btn.secondary { background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); color:rgba(255,255,255,0.6); }
.cm-btn.secondary:hover { background:rgba(255,255,255,0.1); color:#fff; }

/* Light theme modal overrides */
.cm-shell.light-theme .cm-hero-name { color:#111; }
.cm-shell.light-theme .cm-hero-login { color:#888; }
.cm-shell.light-theme .cm-rank-pill { background:rgba(0,0,0,0.05); border-color:rgba(0,0,0,0.1); color:#555; }
.cm-shell.light-theme .cm-stat-tile { background:#f8f8fc; }
.cm-shell.light-theme .cm-stat-grid { background:rgba(0,0,0,0.06); }
.cm-shell.light-theme .cmst-val { color:#111; }
.cm-shell.light-theme .cmst-lbl { color:#888; }
.cm-shell.light-theme .cm-tab { color:rgba(0,0,0,0.35); }
.cm-shell.light-theme .cm-tab.active { color:#111; }
.cm-shell.light-theme .cm-tabs { background:rgba(0,0,0,0.03); border-color:rgba(0,0,0,0.08); }
.cm-shell.light-theme .cm-ach-item { background:rgba(0,0,0,0.03); border-color:rgba(0,0,0,0.08); }
.cm-shell.light-theme .cm-ach-name { color:rgba(0,0,0,0.5); }
.cm-shell.light-theme .cm-bio { color:#555; background:rgba(0,0,0,0.03); border-color:rgba(0,0,0,0.06); }
.cm-shell.light-theme .cm-info-chip { background:rgba(0,0,0,0.04); border-color:rgba(0,0,0,0.08); color:#555; }
.cm-shell.light-theme .cm-gh-stat { background:#f8f8fc; }
.cm-shell.light-theme .cm-ghs-val { color:#111; }
.cm-shell.light-theme .cm-ghs-lbl { color:#888; }
.cm-shell.light-theme .cm-gh-stats { background:rgba(0,0,0,0.06); }
.cm-shell.light-theme .cm-btn.secondary { background:rgba(0,0,0,0.05); border-color:rgba(0,0,0,0.12); color:#555; }
.cm-shell.light-theme .cm-close { background:rgba(0,0,0,0.05); border-color:rgba(0,0,0,0.1); color:#888; }
.cm-shell.light-theme .cm-loading { color:#888; }
.cm-shell.light-theme .cm-spinner { border-color:rgba(0,0,0,0.1); border-top-color:var(--accent); }
.cm-shell.light-theme .cm-section-title { color:rgba(0,0,0,0.4); }
.cm-shell.light-theme .cm-contrib-labels { color:rgba(0,0,0,0.4); }
.cm-shell.light-theme .cm-bar-track { background:rgba(0,0,0,0.07); }
.cm-shell.light-theme .cm-xp-labels { color:rgba(0,0,0,0.4); }
.cm-shell.light-theme .cm-xp-track { background:rgba(0,0,0,0.07); }
.cm-shell.light-theme .cm-xp-progress-text { color:rgba(0,0,0,0.35); }
.cm-shell.light-theme .cm-ach-icon { background:rgba(0,0,0,0.04); }
.cm-shell.light-theme .cm-joined { color:rgba(0,0,0,0.35); }
.cm-shell.light-theme .cm-avatar { border-color:#e0e0e8; }
.cm-shell.light-theme .cm-tab:hover { color:rgba(0,0,0,0.6); }
.panel-contributors.light-theme .ct-card:hover { border-color:rgba(0,0,0,0.15); box-shadow:0 8px 28px rgba(0,0,0,0.1); }

/* ── Activity Tab ── */
.cm-act-loading { display:flex; align-items:center; gap:10px; padding:32px 0; color:rgba(255,255,255,0.4); font-size:12px; }
.cm-act-empty { font-size:11px; color:rgba(255,255,255,0.3); padding:12px 0; }
.cm-chart-wrap { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:12px; position:relative; }
.cm-act-tip { position:absolute; bottom:34px; transform:translateX(-50%); background:#16161e; border:1px solid var(--accent-mid); border-radius:7px; padding:5px 9px; pointer-events:none; z-index:10; display:flex; flex-direction:column; align-items:center; gap:2px; white-space:nowrap; }
.cm-act-tip::after { content:''; position:absolute; top:100%; left:50%; transform:translateX(-50%); border:4px solid transparent; border-top-color:var(--accent-mid); }
.cm-act-tip-count { font-size:11px; font-weight:700; color:var(--accent); }
.cm-act-tip-date { font-size:9px; color:rgba(255,255,255,0.45); }
.cm-shell.light-theme .cm-act-tip { background:#fff; box-shadow:0 4px 14px rgba(0,0,0,0.12); }
.cm-shell.light-theme .cm-act-tip::after { border-top-color:var(--accent-mid); }
.cm-shell.light-theme .cm-act-tip-date { color:rgba(0,0,0,0.45); }
.cm-act-chart { display:block; border-radius:4px; }
.cm-chart-labels { display:flex; justify-content:space-between; margin-top:6px; font-size:9px; color:rgba(255,255,255,0.25); }
.cm-langs { display:flex; flex-direction:column; gap:8px; }
.cm-lang-row { display:flex; align-items:center; gap:8px; }
.cm-lang-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.cm-lang-name { font-size:11px; font-weight:600; color:rgba(255,255,255,0.6); width:80px; flex-shrink:0; }
.cm-lang-track { flex:1; height:6px; background:rgba(255,255,255,0.06); border-radius:3px; overflow:hidden; }
.cm-lang-fill { height:100%; border-radius:3px; transition:width 0.5s cubic-bezier(.34,1.56,.64,1); }
.cm-lang-pct { font-size:10px; font-weight:700; color:rgba(255,255,255,0.4); width:32px; text-align:right; flex-shrink:0; }
.cm-pages { display:flex; flex-direction:column; gap:6px; }
.cm-page-row { display:flex; align-items:center; gap:8px; padding:7px 10px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); border-radius:8px; transition:background 0.12s; }
.cm-page-row:hover { background:rgba(255,255,255,0.06); }
.cm-page-rank { font-size:10px; font-weight:800; width:22px; flex-shrink:0; }
.cm-page-icon { color:rgba(255,255,255,0.3); flex-shrink:0; display:flex; align-items:center; }
.cm-page-name { flex:1; font-size:11px; font-weight:600; color:rgba(255,255,255,0.65); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-family:monospace; }
.cm-page-count { font-size:10px; font-weight:700; color:rgba(255,255,255,0.3); flex-shrink:0; background:rgba(255,255,255,0.05); padding:1px 6px; border-radius:10px; }

/* Light theme overrides for activity tab */
.cm-shell.light-theme .cm-act-loading { color:#888; }
.cm-shell.light-theme .cm-act-empty { color:#aaa; }
.cm-shell.light-theme .cm-chart-wrap { background:rgba(0,0,0,0.02); border-color:rgba(0,0,0,0.08); }
.cm-shell.light-theme .cm-chart-labels { color:#aaa; }
.cm-shell.light-theme .cm-lang-name { color:#444; }
.cm-shell.light-theme .cm-lang-track { background:rgba(0,0,0,0.07); }
.cm-shell.light-theme .cm-lang-pct { color:#888; }
.cm-shell.light-theme .cm-page-row { background:rgba(0,0,0,0.03); border-color:rgba(0,0,0,0.07); }
.cm-shell.light-theme .cm-page-row:hover { background:rgba(0,0,0,0.06); }
.cm-shell.light-theme .cm-page-name { color:#333; }
.cm-shell.light-theme .cm-page-count { color:#888; background:rgba(0,0,0,0.06); }
.cm-shell.light-theme .cm-page-icon { color:#aaa; }

/* Modal transition */
.modal-fade-enter-active, .modal-fade-leave-active { transition:opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity:0; }

/* ── Card level medal + achievement badge ── */
.ctc-level { display:flex; align-items:center; gap:5px; font-size:10px; font-weight:600; color:var(--text-muted); }
.ctc-level-medal { width:18px; height:18px; flex-shrink:0; }
.ctc-ach-badge { font-size:8px; font-weight:800; background:var(--accent-dim); border:1px solid var(--accent-mid); color:var(--accent); padding:1px 6px; border-radius:8px; margin-left:auto; flex-shrink:0; }

/* ── Hero level medal badge ── */
.cm-level-medal-badge { position:absolute; bottom:-6px; right:-6px; width:30px; height:30px; z-index:2; filter:drop-shadow(0 2px 5px rgba(0,0,0,0.5)); }

/* ── Level milestone track ── */
.cm-level-track { display:flex; align-items:flex-start; overflow-x:auto; padding-bottom:6px; }
.cm-level-track::-webkit-scrollbar { height:2px; }
.cm-level-track::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); border-radius:1px; }
.cm-lvl-step { display:flex; flex-direction:column; align-items:center; gap:4px; flex:1; min-width:52px; position:relative; padding:0 4px; }
.cm-lvl-connector { position:absolute; top:15px; right:50%; width:100%; height:2px; background:rgba(255,255,255,0.07); z-index:0; }
.cm-lvl-connector.filled { background:var(--accent-mid); }
.cm-lvl-img { width:32px; height:32px; position:relative; z-index:1; opacity:0.2; filter:grayscale(1) brightness(0.55); transition:all 0.25s; }
.cm-lvl-step.earned .cm-lvl-img { opacity:1; filter:none; }
.cm-lvl-step.active .cm-lvl-img { transform:scale(1.2); filter:drop-shadow(0 0 7px var(--accent-strong)); }
.cm-lvl-name { font-size:8px; font-weight:700; color:rgba(255,255,255,0.22); text-align:center; position:relative; z-index:1; }
.cm-lvl-step.earned .cm-lvl-name { color:rgba(255,255,255,0.62); }
.cm-lvl-step.active .cm-lvl-name { color:var(--accent-alt2); }
.cm-lvl-min { font-size:7px; color:rgba(255,255,255,0.13); position:relative; z-index:1; }
.cm-lvl-step.earned .cm-lvl-min { color:rgba(255,255,255,0.28); }

/* ── Rank medals row ── */
.cm-rank-medals-row { display:flex; gap:8px; flex-wrap:wrap; }
.cm-rm-item { display:flex; flex-direction:column; align-items:center; gap:5px; flex:1; min-width:64px; padding:12px 8px 10px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:12px; transition:all 0.15s; }
.cm-rm-item.earned { background:rgba(255,255,255,0.07); border-color:rgba(255,255,255,0.14); }
.cm-rm-img { width:40px; height:40px; transition:opacity 0.2s, filter 0.2s; }
.cm-rm-img.locked { opacity:0.16; filter:grayscale(1); }
.cm-rm-label { font-size:9px; font-weight:700; color:rgba(255,255,255,0.38); text-align:center; }
.cm-rm-item.earned .cm-rm-label { color:rgba(255,255,255,0.72); }
.cm-rm-val { font-size:9px; font-weight:700; color:rgba(255,255,255,0.18); }

/* ── Light theme: card grid ── */
.panel-contributors.light-theme .stat-card { background:#fff; border-color:#dde0ea; }
.panel-contributors.light-theme .stat-icon { background:#ededf5; }
.panel-contributors.light-theme .ct-podium-wrap { background:#fff; border-color:#dde0ea; }
.panel-contributors.light-theme .ct-pod-img { border-color:#fff; }
.panel-contributors.light-theme .ct-pod-name { color:#1a1a28; }
.panel-contributors.light-theme .ct-pod-commits { color:#555; }
.panel-contributors.light-theme .ct-card { background:#fff; border-color:#dde0ea; }
.panel-contributors.light-theme .ct-card:hover { border-color:rgba(0,0,0,0.18) !important; }
.panel-contributors.light-theme .ctc-rank-badge { background:#ededf5; border-color:#dde0ea; }
.panel-contributors.light-theme .ctc-bar-track { background:#e8e8f2; }
.panel-contributors.light-theme .ctcs-sep { background:#dde0ea; }
.panel-contributors.light-theme .ctc-ach-badge { background:var(--accent-dim); border-color:var(--accent-soft); }
.panel-contributors.light-theme .ct-sort-btn { background:#fff; border-color:#dde0ea; }
.panel-contributors.light-theme .ct-page-btn { background:#fff; border-color:#dde0ea; }
.panel-contributors.light-theme .ct-page-num { background:#fff; border-color:#dde0ea; }

/* ── Light theme: level track ── */
.cm-shell.light-theme .cm-level-track::-webkit-scrollbar-thumb { background:rgba(0,0,0,0.1); }
.cm-shell.light-theme .cm-lvl-connector { background:rgba(0,0,0,0.08); }
.cm-shell.light-theme .cm-lvl-connector.filled { background:var(--accent-mid); }
.cm-shell.light-theme .cm-lvl-name { color:rgba(0,0,0,0.22); }
.cm-shell.light-theme .cm-lvl-step.earned .cm-lvl-name { color:rgba(0,0,0,0.58); }
.cm-shell.light-theme .cm-lvl-step.active .cm-lvl-name { color:var(--accent); }
.cm-shell.light-theme .cm-lvl-min { color:rgba(0,0,0,0.15); }
.cm-shell.light-theme .cm-lvl-step.earned .cm-lvl-min { color:rgba(0,0,0,0.3); }

/* ── Light theme: rank medals ── */
.cm-shell.light-theme .cm-rm-item { background:rgba(0,0,0,0.025); border-color:rgba(0,0,0,0.07); }
.cm-shell.light-theme .cm-rm-item.earned { background:rgba(0,0,0,0.05); border-color:rgba(0,0,0,0.12); }
.cm-shell.light-theme .cm-rm-label { color:rgba(0,0,0,0.38); }
.cm-shell.light-theme .cm-rm-item.earned .cm-rm-label { color:rgba(0,0,0,0.62); }
.cm-shell.light-theme .cm-rm-val { color:rgba(0,0,0,0.22); }

/* Responsive */
@media (max-width: 1200px) { .contributors-header { grid-template-columns:repeat(2,1fr); } }
@media (max-width: 900px) { .ct-grid { grid-template-columns:repeat(2,1fr); } }
@media (max-width: 640px) {
  .contributors-header { grid-template-columns:1fr; }
  .ct-grid { grid-template-columns:1fr; }
  .ct-toolbar { flex-direction:column; align-items:stretch; }
  .ct-search { width:100%; }
  .cm-stat-grid { grid-template-columns:repeat(2,1fr); }
  .cm-gh-stats { grid-template-columns:repeat(2,1fr); }
  .cm-ach-grid { grid-template-columns:repeat(auto-fill, minmax(76px, 1fr)); }
  .cm-hero { flex-direction:column; align-items:center; text-align:center; }
  .cm-hero-rank-row { justify-content:center; }
}
</style>
