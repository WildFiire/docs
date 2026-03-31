<!-- docs\.vitepress\theme\components\Panel\PanelContributors.vue -->
<template>
  <div class="panel-contributors" :class="{ 'light-theme': isLightTheme }">
    <!-- Header Stats -->
    <div class="contributors-header">
      <div class="stat-card">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ formatNumber(contributors.length) }}</span>
          <span class="stat-label">TOTAL CONTRIBUTORS</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ formatNumber(totalCommits) }}</span>
          <span class="stat-label">TOTAL COMMITS</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ avgCommits }}</span>
          <span class="stat-label">AVG COMMITS</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor">
            <path d="M12 2L15 9H22L16 14L19 21L12 16.5L5 21L8 14L2 9H9L12 2Z"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ topContributor }}</span>
          <span class="stat-label">TOP CONTRIBUTOR</span>
        </div>
      </div>
    </div>

    <!-- Top Contributor Spotlight + Podium -->
    <div class="ct-spotlight" v-if="topContributorData">
      <!-- #1 Hero -->
      <div class="ct-hero" @click="openProfile(topContributorData.login)">
        <div class="ct-hero-glow"></div>
        <div class="ct-crown">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="#ffd700" stroke="none"><path d="M2 20h20M4 20l2-8 4 4 2-7 2 7 4-4 2 8"/></svg>
        </div>
        <div class="ct-hero-avatar-wrap">
          <img :src="topContributorData.avatar_url" :alt="topContributorData.login" class="ct-hero-avatar">
          <span class="ct-rank-badge">#1</span>
        </div>
        <div class="ct-hero-body">
          <div class="ct-hero-name">{{ topContributorData.login }}</div>
          <div class="ct-hero-label">CHAMPION · ALL TIME LEADER</div>
          <div class="ct-hero-stats">
            <div class="ct-hs-item">
              <span class="ct-hs-val">{{ formatNumber(topContributorData.commits || 0) }}</span>
              <span class="ct-hs-lbl">Commits</span>
            </div>
            <div class="ct-hs-sep"></div>
            <div class="ct-hs-item">
              <span class="ct-hs-val">{{ topContributorData.prs || 0 }}</span>
              <span class="ct-hs-lbl">PRs</span>
            </div>
            <div class="ct-hs-sep"></div>
            <div class="ct-hs-item">
              <span class="ct-hs-val">{{ topContributorData.impact ? topContributorData.impact.toFixed(1) : 0 }}%</span>
              <span class="ct-hs-lbl">Impact</span>
            </div>
          </div>
          <div class="ct-hero-bar-wrap">
            <div class="ct-hero-bar" style="width:100%"></div>
          </div>
        </div>
        <div class="ct-view-btn">VIEW →</div>
      </div>
      <!-- #2 + #3 podium -->
      <div class="ct-podium">
        <div v-for="(c, i) in podiumContributors.slice(1, 3)" :key="c.login" class="ct-pod-card" :class="i === 0 ? 'pod-silver' : 'pod-bronze'" @click="openProfile(c.login)">
          <span class="ct-pod-rank">{{ i === 0 ? '#2' : '#3' }}</span>
          <img :src="c.avatar_url" :alt="c.login" class="ct-pod-avatar">
          <span class="ct-pod-name">{{ c.login }}</span>
          <span class="ct-pod-commits">{{ formatNumber(c.commits || 0) }} commits</span>
          <div class="ct-pod-bar-wrap">
            <div class="ct-pod-bar" :style="{ width: (c.commits / topContributorData.commits * 100) + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="contributors-toolbar">
      <div class="search-box">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21L17 17"/>
        </svg>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search contributors..."
        >
        <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      
      <div class="sort-controls">
        <button 
          class="sort-btn" 
          :class="{ active: sortBy === 'commits' }"
          @click="sortBy = 'commits'"
        >
          By Commits
          <svg v-if="sortBy === 'commits'" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
            <path v-if="sortOrder === 'desc'" d="M12 5L19 12M12 5L5 12M12 5V19"/>
            <path v-else d="M12 19L5 12M12 19L19 12M12 19V5"/>
          </svg>
        </button>
        <button 
          class="sort-btn" 
          :class="{ active: sortBy === 'prs' }"
          @click="sortBy = 'prs'"
        >
          By PRs
          <svg v-if="sortBy === 'prs'" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
            <path v-if="sortOrder === 'desc'" d="M12 5L19 12M12 5L5 12M12 5V19"/>
            <path v-else d="M12 19L5 12M12 19L19 12M12 19V5"/>
          </svg>
        </button>
        <button 
          class="sort-btn" 
          :class="{ active: sortBy === 'impact' }"
          @click="sortBy = 'impact'"
        >
          By Impact
          <svg v-if="sortBy === 'impact'" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
            <path v-if="sortOrder === 'desc'" d="M12 5L19 12M12 5L5 12M12 5V19"/>
            <path v-else d="M12 19L5 12M12 19L19 12M12 19V5"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Contributors Table -->
    <div class="contributors-table-wrapper">
      <table class="contributors-table">
        <thead>
          <tr>
            <th>RANK</th>
            <th>CONTRIBUTOR</th>
            <th>COMMITS</th>
            <th>PULL REQUESTS</th>
            <th>IMPACT</th>
            <th>ACTIVITY</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(contributor, index) in paginatedContributors" :key="contributor.login" class="contributor-row" @click="openProfile(contributor.login)">
            <td class="rank-cell">
              <span class="rank-badge" :class="getRankClass(index + 1)">
                #{{ index + 1 }}
              </span>
            </td>
            <td class="user-cell">
              <img :src="contributor.avatar_url" :alt="contributor.login">
              <div class="user-info">
                <span class="user-name">{{ contributor.login }}</span>
                <span class="user-email" v-if="contributor.email">{{ contributor.email }}</span>
              </div>
            </td>
            <td class="commits-cell">
              <span class="commits-number">{{ formatNumber(contributor.commits) }}</span>
              <div class="commits-bar">
                <div class="commits-fill" :style="{ width: (contributor.commits / maxCommits * 100) + '%' }"></div>
              </div>
            </td>
            <td class="prs-cell">
              <span class="prs-number">{{ contributor.prs || 0 }}</span>
            </td>
            <td class="impact-cell">
              <div class="impact-bar">
                <div class="impact-fill" :style="{ width: contributor.impact + '%' }"></div>
              </div>
              <span class="impact-value">{{ contributor.impact.toFixed(1) }}%</span>
            </td>
            <td class="activity-cell">
              <div class="activity-dots">
                <span v-for="i in 5" :key="i" class="dot" :class="{ active: i <= getActivityLevel(contributor) }"></span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Pagination -->
      <div class="pagination" v-if="filteredContributors.length > itemsPerPage">
        <button 
          class="page-btn" 
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
            <path d="M15 18L9 12L15 6"/>
          </svg>
        </button>
        
        <div class="page-numbers">
          <button 
            v-for="page in totalPages" 
            :key="page"
            class="page-num"
            :class="{ active: currentPage === page }"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          class="page-btn" 
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
            <path d="M9 18L15 12L9 6"/>
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Contributor Profile Modal -->
  <transition name="modal-fade">
    <div class="modal-backdrop" v-if="showModal" @click.self="closeModal">
      <div class="contributor-modal" :class="{ 'light-theme': isLightTheme }">

        <div class="modal-loader" v-if="loadingModal && !contributorGHData.login">
          <svg class="spin-icon" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--accent)" stroke-width="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
        </div>

        <button class="modal-close" @click="closeModal">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <template v-if="selectedContributor">
          <div class="modal-hero">
            <div class="modal-hero-bg" :style="contributorBgStyle"></div>
            <div class="modal-hero-content">
              <div class="modal-avatar-wrap">
                <img :src="selectedContributor.avatar_url" :alt="selectedContributor.login" class="modal-avatar">
              </div>
              <div class="modal-user-info">
                <div class="modal-name-row">
                  <h3>{{ contributorGHData.name || selectedContributor.login }}</h3>
                  <span class="level-badge" :class="selectedLevel.key">
                    <span v-html="getLevelIcon(selectedLevel.key)"></span>
                    {{ selectedLevel.label }}
                  </span>
                </div>
                <span class="modal-login">@{{ selectedContributor.login }}</span>
                <p class="modal-bio" v-if="contributorGHData.bio">{{ contributorGHData.bio }}</p>
                <div class="modal-meta">
                  <span v-if="contributorGHData.location">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {{ contributorGHData.location }}
                  </span>
                  <span v-if="contributorGHData.company">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                    {{ contributorGHData.company }}
                  </span>
                </div>
                <div class="modal-gh-stats">
                  <div class="mgs-item">
                    <span class="mgs-val">{{ formatNumber(contributorGHData.public_repos || 0) }}</span>
                    <span class="mgs-lbl">Repos</span>
                  </div>
                  <div class="mgs-item">
                    <span class="mgs-val">{{ formatNumber(contributorGHData.followers || 0) }}</span>
                    <span class="mgs-lbl">Followers</span>
                  </div>
                  <div class="mgs-item">
                    <span class="mgs-val">{{ formatNumber(contributorGHData.following || 0) }}</span>
                    <span class="mgs-lbl">Following</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-repo-stats">
            <div class="mrs-card">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--accent)"><circle cx="12" cy="12" r="3"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></svg>
              <span class="mrs-val">{{ formatNumber(selectedContributor.commits || 0) }}</span>
              <span class="mrs-lbl">Commits</span>
            </div>
            <div class="mrs-card">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--accent)"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/></svg>
              <span class="mrs-val">{{ selectedContributor.prs || 0 }}</span>
              <span class="mrs-lbl">Pull Requests</span>
            </div>
            <div class="mrs-card">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--accent)"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              <span class="mrs-val">{{ selectedContributor.impact ? selectedContributor.impact.toFixed(1) : 0 }}%</span>
              <span class="mrs-lbl">Impact</span>
            </div>
            <div class="mrs-card">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--accent)"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              <span class="mrs-val">#{{ selectedRank }}</span>
              <span class="mrs-lbl">Rank</span>
            </div>
          </div>

          <div class="modal-bar-section">
            <div class="mbs-labels">
              <span>Contribution vs #1</span>
              <span class="mbs-pct">{{ Math.round(selectedContributor.commits / maxCommits * 100) }}%</span>
            </div>
            <div class="mbs-track">
              <div class="mbs-fill" :style="{ width: (selectedContributor.commits / maxCommits * 100) + '%' }"></div>
            </div>
          </div>

          <!-- Level XP Progress -->
          <div class="modal-level-section">
            <div class="mls-header">
              <span class="mls-label">LEVEL PROGRESS</span>
              <span class="level-badge" :class="selectedLevel.key">
                <span v-html="getLevelIcon(selectedLevel.key)"></span>
                {{ selectedLevel.label }}
              </span>
            </div>
            <div class="mls-bar-info">
              <span>{{ selectedContributor.commits || 0 }} commits</span>
              <span v-if="selectedNextLevel">→ {{ selectedNextLevel.minCommits }} for {{ selectedNextLevel.label }}</span>
              <span v-else>MAX LEVEL</span>
            </div>
            <div class="mls-track">
              <div class="mls-fill" :class="selectedLevel.key" :style="{ width: selectedXpProgress + '%' }"></div>
            </div>
          </div>

          <!-- Achievements -->
          <div class="modal-achievements">
            <div class="mach-header">
              <span class="mach-title">ACHIEVEMENTS</span>
              <span class="mach-count">{{ selectedUnlockedCount }}/{{ achievements.length }} unlocked</span>
            </div>
            <div class="mach-grid">
              <div v-for="ach in selectedAchievements" :key="ach.id"
                class="mach-item"
                :class="[ach.rarity, { unlocked: ach.unlocked, locked: !ach.unlocked }]"
                :title="ach.unlocked ? ach.title + ': ' + ach.desc : ' ' + ach.desc"
              >
                <div class="mach-icon" :style="ach.unlocked ? { color: ach.color, background: ach.color + '18' } : {}">
                  <span v-html="ach.icon"></span>
                </div>
                <span class="mach-name" :style="ach.unlocked ? { color: ach.color } : {}">{{ ach.title }}</span>
                <span class="mach-rarity" :class="ach.rarity">{{ ach.rarity }}</span>
              </div>
            </div>
          </div>

          <div class="modal-actions">
            <a :href="`https://github.com/${selectedContributor.login}`" target="_blank" class="modal-btn primary">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              View on GitHub
            </a>
            <button class="modal-btn secondary" @click="closeModal">Close</button>
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
    githubToken:   { type: String,  default: '' }
  },

  data() {
    return {
      searchQuery: '',
      sortBy: 'commits',
      sortOrder: 'desc',
      currentPage: 1,
      itemsPerPage: 10,
      showModal: false,
      selectedContributor: null,
      contributorGHData: {},
      loadingModal: false,
      contributorBgStyle: {},
      levels: [
        { key: 'newcomer', label: 'Newcomer', minCommits: 0   },
        { key: 'bronze',   label: 'Bronze',   minCommits: 5   },
        { key: 'silver',   label: 'Silver',   minCommits: 20  },
        { key: 'gold',     label: 'Gold',     minCommits: 50  },
        { key: 'platinum', label: 'Platinum', minCommits: 100 },
        { key: 'legend',   label: 'Legend',   minCommits: 200 }
      ],
      achievements: [
        { id: 'first_commit',   title: 'First Blood',    desc: 'Make your first commit',         type: 'commits', threshold: 1,   color: '#ff4500', rarity: 'common',    icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></svg>' },
        { id: 'commits_5',      title: 'Getting Started',desc: 'Reach 5 commits',                type: 'commits', threshold: 5,   color: '#cd7f32', rarity: 'common',    icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
        { id: 'commits_20',     title: 'Silver Coder',   desc: 'Reach 20 commits',               type: 'commits', threshold: 20,  color: '#c0c0c0', rarity: 'rare',      icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>' },
        { id: 'commits_50',     title: 'Gold Coder',     desc: 'Reach 50 commits',               type: 'commits', threshold: 50,  color: '#ffd700', rarity: 'rare',      icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>' },
        { id: 'commits_100',    title: 'Platinum Coder', desc: 'Reach 100 commits',              type: 'commits', threshold: 100, color: '#88d4e8', rarity: 'epic',      icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>' },
        { id: 'commits_200',    title: 'Wildfire Legend',desc: 'Reach 200 commits',              type: 'commits', threshold: 200, color: '#ff4500', rarity: 'legendary', icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>' },
        { id: 'first_pr',       title: 'Open Sesame',    desc: 'Open your first PR',             type: 'prs',     threshold: 1,   color: '#22c55e', rarity: 'common',    icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/></svg>' },
        { id: 'prs_5',          title: 'PR Machine',     desc: 'Open 5 pull requests',           type: 'prs',     threshold: 5,   color: '#4ade80', rarity: 'rare',      icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/></svg>' },
        { id: 'prs_10',         title: 'PR Legend',      desc: 'Open 10 pull requests',          type: 'prs',     threshold: 10,  color: '#22c55e', rarity: 'epic',      icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/></svg>' },
        { id: 'top10',          title: 'Top 10',         desc: 'Reach top 10 contributors',      type: 'rank',    threshold: 10,  color: '#3b82f6', rarity: 'common',    icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>' },
        { id: 'top5',           title: 'Elite',          desc: 'Reach top 5 contributors',       type: 'rank',    threshold: 5,   color: '#8b5cf6', rarity: 'rare',      icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>' },
        { id: 'top3',           title: 'Podium',         desc: 'Reach top 3 contributors',       type: 'rank',    threshold: 3,   color: '#f59e0b', rarity: 'epic',      icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6l4-4 4 4"/><path d="M12 2v10.3"/><path d="M2 20h20"/></svg>' },
        { id: 'rank1',          title: 'Champion',       desc: '#1 Top contributor of all time', type: 'rank',    threshold: 1,   color: '#ffd700', rarity: 'legendary', icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>' }
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

    topContributorData() {
      if (!this.contributors.length) return null
      return [...this.contributors].sort((a, b) => (b.commits || 0) - (a.commits || 0))[0] || null
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
    }
  },

  watch: {
    searchQuery() { this.currentPage = 1 },
    sortBy()      { this.currentPage = 1 }
  },

  methods: {
    bgPresetMap() {
      return {
        fire:     'linear-gradient(135deg,#200800 0%,#5c1500 50%,#8b1500 100%)',
        ocean:    'linear-gradient(135deg,#001428 0%,#003060 50%,#005980 100%)',
        forest:   'linear-gradient(135deg,#0a150a 0%,#1a3c1a 50%,#2d5a27 100%)',
        galaxy:   'linear-gradient(135deg,#0d0221 0%,#2d1b69 50%,#11998e 100%)',
        gold:     'linear-gradient(135deg,#1a1000 0%,#4a3000 50%,#8a6000 100%)',
        neon:     'linear-gradient(135deg,#001a00 0%,#003a00 50%,#005a10 100%)',
        midnight: 'linear-gradient(135deg,#0a0015 0%,#1a0035 50%,#2a0050 100%)',
        rose:     'linear-gradient(135deg,#1a0010 0%,#3d0025 50%,#6b0040 100%)',
        aurora:   'linear-gradient(135deg,#000d1a 0%,#002a1f 45%,#1a0035 100%)',
        carbon:   'linear-gradient(135deg,#0a0a0a 0%,#1a1a1a 50%,#111 100%)',
        sunset:   'linear-gradient(135deg,#1a0500 0%,#5a1500 40%,#9b3400 75%,#c85000 100%)'
      }
    },

    bgStyleFromData(data) {
      if (!data || !data.presetId || data.presetId === 'default') return {}
      if (data.presetId === 'url' && data.customUrl)
        return { backgroundImage: `url('${data.customUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' }
      if (data.presetId === 'custom' && data.customColor)
        return { background: data.customColor }
      const val = this.bgPresetMap()[data.presetId]
      return val ? { background: val } : {}
    },

    readBgStyleLocal(login) {
      if (typeof localStorage === 'undefined') return {}
      try {
        const saved = JSON.parse(localStorage.getItem(`wildfire-bg-${login}`) || 'null')
        return this.bgStyleFromData(saved)
      } catch (e) { return {} }
    },

    openProfile(login) {
      const contributor = this.contributors.find(c => c.login === login)
      if (!contributor) return
      this.selectedContributor = contributor
      this.contributorGHData = {}
      this.contributorBgStyle = this.readBgStyleLocal(login)
      this.showModal = true
      this.fetchContributorData(login)
      if (typeof document !== 'undefined') document.body.style.overflow = 'hidden'
    },

    closeModal() {
      this.showModal = false
      this.selectedContributor = null
      this.contributorGHData = {}
      this.contributorBgStyle = {}
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
      } catch (e) {
        console.error('[PanelContributors] fetchContributorData:', e)
      } finally {
        this.loadingModal = false
      }
    },

    checkContributorAchievement(a) {
      if (!this.selectedContributor) return false
      const commits = this.selectedContributor.commits || 0
      const prs = this.selectedContributor.prs || 0
      const rank = this.selectedRank
      if (a.type === 'commits') return commits >= a.threshold
      if (a.type === 'prs')     return prs >= a.threshold
      if (a.type === 'rank')    return typeof rank === 'number' && rank <= a.threshold
      return false
    },

    getRankClass(rank) {
      if (rank === 1) return 'gold'
      if (rank === 2) return 'silver'
      if (rank === 3) return 'bronze'
      return ''
    },

    getActivityLevel(contributor) {
      const ratio = (contributor.commits || 0) / this.maxCommits
      if (ratio > 0.8) return 5
      if (ratio > 0.6) return 4
      if (ratio > 0.4) return 3
      if (ratio > 0.2) return 2
      return 1
    },

    getLevelIcon(key) {
      const icons = {
        newcomer: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/></svg>`,
        bronze:   `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M8.5 13L6 22h12l-2.5-9"/></svg>`,
        silver:   `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.37 7.28L12 17l-6.18 4.18 2.37-7.28L2 9.4h7.6z"/></svg>`,
        gold:     `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H3l2 10h14l2-10h-3M6 9h12"/><path d="M9 5V3h6v2"/></svg>`,
        platinum: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/></svg>`,
        legend:   `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 20h20"/><path d="M4 20l2-8 4 4 2-7 2 7 4-4 2 8"/></svg>`
      }
      return icons[key] || icons.newcomer
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
  --bg-tertiary: #1a1a20;
  --border-color: #1f1f24;
  --text-primary: #ffffff;
  --text-secondary: #e0e0e0;
  --text-muted: #8a8a95;
  --accent: #ff4500;
  --accent-glow: rgba(255, 69, 0, 0.2);
  --success: #2ecc71;
  --warning: #f39c12;
  --gold: #ffd700;
  --silver: #c0c0c0;
  --bronze: #cd7f32;
  
  animation: fadeIn 0.3s ease;
}

.panel-contributors.light-theme {
  --bg-secondary: #ffffff;
  --bg-tertiary: #e8e8ed;
  --border-color: #ddd;
  --text-primary: #333;
  --text-secondary: #4a4a55;
  --text-muted: #666;
  --accent-glow: rgba(255, 69, 0, 0.1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Header Stats */
.contributors-header {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  border-color: var(--accent);
  box-shadow: 0 8px 20px var(--shadow-color);
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: var(--bg-tertiary);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
}

.stat-info {
  flex: 1;
}

.stat-value {
  display: block;
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}

.stat-label {
  display: block;
  font-size: 11px;
  color: var(--text-muted);
  letter-spacing: 0.5px;
}

/* Spotlight + Podium */
.ct-spotlight { display: grid; grid-template-columns: 1fr 260px; gap: 16px; margin-bottom: 20px; }

.ct-hero { position: relative; background: linear-gradient(135deg, rgba(255,215,0,0.08) 0%, rgba(255,69,0,0.07) 100%); border: 1px solid rgba(255,215,0,0.2); border-radius: 16px; padding: 20px 20px 16px; display: flex; align-items: center; gap: 18px; cursor: pointer; overflow: hidden; transition: all 0.2s ease; }
.ct-hero:hover { border-color: rgba(255,215,0,0.4); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(255,215,0,0.12); }
.ct-hero-glow { position: absolute; top: -40px; left: -40px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%); pointer-events: none; }
.ct-crown { position: absolute; top: 12px; right: 16px; opacity: 0.7; }
.ct-hero-avatar-wrap { position: relative; flex-shrink: 0; }
.ct-hero-avatar { width: 72px; height: 72px; border-radius: 50%; border: 3px solid rgba(255,215,0,0.7); box-shadow: 0 0 20px rgba(255,215,0,0.25); }
.ct-rank-badge { position: absolute; bottom: -4px; right: -4px; background: linear-gradient(135deg, #ffd700, #ffb700); color: #000; font-size: 9px; font-weight: 900; padding: 2px 5px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.1); }
.ct-hero-body { flex: 1; min-width: 0; }
.ct-hero-name { font-size: 18px; font-weight: 800; color: var(--text-primary); margin-bottom: 2px; }
.ct-hero-label { font-size: 9px; font-weight: 700; color: rgba(255,215,0,0.7); letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 12px; }
.ct-hero-stats { display: flex; align-items: center; gap: 0; margin-bottom: 10px; }
.ct-hs-item { display: flex; flex-direction: column; align-items: center; padding: 0 14px; }
.ct-hs-item:first-child { padding-left: 0; }
.ct-hs-val { font-size: 15px; font-weight: 700; color: var(--text-primary); line-height: 1.2; }
.ct-hs-lbl { font-size: 9px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.3px; }
.ct-hs-sep { width: 1px; height: 24px; background: var(--border-color); flex-shrink: 0; }
.ct-hero-bar-wrap { height: 4px; background: rgba(255,215,0,0.1); border-radius: 2px; overflow: hidden; }
.ct-hero-bar { height: 100%; background: linear-gradient(90deg, #ffd700, #ff8c42); border-radius: 2px; }
.ct-view-btn { position: absolute; bottom: 14px; right: 16px; font-size: 9px; font-weight: 700; color: rgba(255,215,0,0.6); letter-spacing: 0.5px; }

.ct-podium { display: flex; flex-direction: column; gap: 10px; }
.ct-pod-card { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 12px 14px; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: all 0.15s ease; position: relative; overflow: hidden; }
.ct-pod-card:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,0.2); }
.pod-silver { border-color: rgba(192,192,192,0.25); }
.pod-silver:hover { border-color: rgba(192,192,192,0.5); }
.pod-bronze { border-color: rgba(205,127,50,0.25); }
.pod-bronze:hover { border-color: rgba(205,127,50,0.5); }
.ct-pod-rank { font-size: 12px; font-weight: 900; flex-shrink: 0; width: 26px; text-align: center; }
.pod-silver .ct-pod-rank { color: #c0c0c0; }
.pod-bronze .ct-pod-rank { color: #cd7f32; }
.ct-pod-avatar { width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; border: 2px solid var(--border-color); }
.pod-silver .ct-pod-avatar { border-color: rgba(192,192,192,0.5); }
.pod-bronze .ct-pod-avatar { border-color: rgba(205,127,50,0.5); }
.ct-pod-name { font-size: 12px; font-weight: 600; color: var(--text-primary); flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ct-pod-commits { font-size: 10px; color: var(--text-muted); flex-shrink: 0; white-space: nowrap; }
.ct-pod-bar-wrap { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--border-color); }
.ct-pod-bar { height: 100%; border-radius: 1px; }
.pod-silver .ct-pod-bar { background: linear-gradient(90deg, #a0a0a0, #c0c0c0); }
.pod-bronze .ct-pod-bar { background: linear-gradient(90deg, #a05a20, #cd7f32); }

/* Toolbar */
.contributors-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 40px;
  min-width: 280px;
  transition: all 0.2s ease;
}

.search-box:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.search-box input {
  flex: 1;
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 13px;
  outline: none;
}

.search-box input::placeholder {
  color: var(--text-muted);
}

.clear-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  color: var(--accent);
  background: var(--bg-tertiary);
}

.sort-controls {
  display: flex;
  gap: 8px;
}

.sort-btn {
  padding: 8px 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 30px;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.sort-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.sort-btn.active {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}

/* Table */
.contributors-table-wrapper {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow-x: auto;
}

.contributors-table {
  width: 100%;
  min-width: 800px;
  border-collapse: collapse;
}

.contributors-table th {
  text-align: left;
  padding: 16px 20px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--border-color);
}

.contributors-table td {
  padding: 14px 20px;
  border-bottom: 1px solid var(--border-color);
}

.contributor-row {
  cursor: pointer;
  transition: all 0.2s ease;
}

.contributor-row:hover {
  background: var(--bg-tertiary);
}

/* Rank Cell */
.rank-cell {
  width: 80px;
}

.rank-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}

.rank-badge.gold {
  background: linear-gradient(135deg, var(--gold), #b8860b);
  color: #1a1a2e;
}

.rank-badge.silver {
  background: linear-gradient(135deg, var(--silver), #808080);
  color: #1a1a2e;
}

.rank-badge.bronze {
  background: linear-gradient(135deg, var(--bronze), #8b4513);
  color: #1a1a2e;
}

/* User Cell */
.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-cell img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--accent);
}

.user-info {
  flex: 1;
}

.user-name {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.user-email {
  display: block;
  font-size: 10px;
  color: var(--text-muted);
}

/* Commits Cell */
.commits-cell {
  min-width: 120px;
}

.commits-number {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: var(--accent);
  margin-bottom: 6px;
}

.commits-bar {
  height: 4px;
  background: var(--bg-tertiary);
  border-radius: 2px;
  overflow: hidden;
}

.commits-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* PRs Cell */
.prs-cell {
  width: 100px;
}

.prs-number {
  font-size: 14px;
  font-weight: 500;
  color: var(--success);
  background: rgba(46, 204, 113, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  display: inline-block;
}

/* Impact Cell */
.impact-cell {
  min-width: 140px;
}

.impact-bar {
  height: 6px;
  background: var(--bg-tertiary);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 6px;
}

.impact-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.impact-value {
  font-size: 11px;
  color: var(--text-muted);
}

/* Activity Cell */
.activity-cell {
  width: 100px;
}

.activity-dots {
  display: flex;
  gap: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  background: var(--bg-tertiary);
  border-radius: 50%;
  transition: all 0.2s ease;
}

.dot.active {
  background: var(--accent);
  box-shadow: 0 0 4px var(--accent-glow);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid var(--border-color);
}

.page-btn {
  width: 36px;
  height: 36px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--accent);
  color: var(--accent);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 6px;
}

.page-num {
  width: 36px;
  height: 36px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-num:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.page-num.active {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}

/* Responsive */
@media (max-width: 1200px) {
  .contributors-header {
    grid-template-columns: repeat(2, 1fr);
  }
  .ct-spotlight { grid-template-columns: 1fr; }
  .ct-podium { flex-direction: row; }
  .ct-pod-card { flex: 1; }
}

/* ── Contributor Modal ── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.contributor-modal {
  --bg-secondary: #0f0f12;
  --bg-tertiary: #1a1a20;
  --border-color: #1f1f24;
  --text-primary: #ffffff;
  --text-secondary: #e0e0e0;
  --text-muted: #8a8a95;
  --accent: #ff4500;
  --accent-glow: rgba(255,69,0,0.2);
  --success: #2ecc71;
  --gold: #ffd700;
  --silver: #c0c0c0;
  --bronze: #cd7f32;

  position: relative;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 24px 60px rgba(0,0,0,0.6);
}

.contributor-modal.light-theme {
  --bg-secondary: #ffffff;
  --bg-tertiary: #e8e8ed;
  --border-color: #ddd;
  --text-primary: #333;
  --text-secondary: #4a4a55;
  --text-muted: #666;
  --accent-glow: rgba(255,69,0,0.1);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: all 0.2s;
}
.modal-close:hover { border-color: var(--accent); color: var(--accent); }

.modal-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
}

@keyframes spin { to { transform: rotate(360deg); } }
.spin-icon { animation: spin 1s linear infinite; }

.modal-hero {
  position: relative;
  overflow: hidden;
  border-radius: 18px 18px 0 0;
}

.modal-hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,69,0,0.12), transparent 70%);
  pointer-events: none;
}

.modal-hero-content {
  position: relative;
  display: flex;
  gap: 20px;
  padding: 28px 24px 20px;
  flex-wrap: wrap;
}

.modal-avatar-wrap { position: relative; flex-shrink: 0; }

.modal-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid var(--bg-secondary);
  box-shadow: 0 0 0 2px var(--accent);
}

.modal-user-info { flex: 1; min-width: 180px; }

.modal-name-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.modal-name-row h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.modal-login {
  font-size: 12px;
  color: var(--text-muted);
  display: block;
  margin-bottom: 8px;
}

.modal-bio {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0 0 8px;
  line-height: 1.4;
}

.modal-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 12px;
}
.modal-meta span { display: flex; align-items: center; gap: 4px; }

.modal-gh-stats { display: flex; gap: 20px; }
.mgs-item { display: flex; flex-direction: column; gap: 2px; }
.mgs-val { font-size: 16px; font-weight: 700; color: var(--text-primary); }
.mgs-lbl { font-size: 10px; color: var(--text-muted); text-transform: uppercase; }

.modal-repo-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--border-color);
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.mrs-card {
  background: var(--bg-secondary);
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
}

.mrs-val { font-size: 18px; font-weight: 700; color: var(--text-primary); }
.mrs-lbl { font-size: 10px; color: var(--text-muted); text-transform: uppercase; }

.modal-bar-section { padding: 20px 24px; }

.mbs-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 8px;
}
.mbs-pct { font-weight: 700; color: var(--accent); }

.mbs-track {
  height: 8px;
  background: var(--bg-tertiary);
  border-radius: 4px;
  overflow: hidden;
}

.mbs-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff6b35, #ff4500);
  border-radius: 4px;
  transition: width 0.6s ease;
}

/* Level badge used inside modal */
.level-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid;
}
.level-badge.newcomer  { background: rgba(100,100,100,0.15); border-color: #666;    color: #999;    }
.level-badge.bronze    { background: rgba(205,127,50,0.15);  border-color: #cd7f32; color: #cd7f32; }
.level-badge.silver    { background: rgba(192,192,192,0.15); border-color: #c0c0c0; color: #c0c0c0; }
.level-badge.gold      { background: rgba(255,215,0,0.15);   border-color: #ffd700; color: #ffd700; }
.level-badge.platinum  { background: rgba(168,216,234,0.15); border-color: #a8d8ea; color: #a8d8ea; }
.level-badge.legend    { background: rgba(255,69,0,0.15);    border-color: #ff4500; color: #ff4500; }

.modal-actions {
  display: flex;
  gap: 12px;
  padding: 0 24px 24px;
}

.modal-btn {
  flex: 1;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  transition: all 0.2s;
  border: none;
}

.modal-btn.primary {
  background: var(--accent);
  color: #fff;
}
.modal-btn.primary:hover { opacity: 0.85; }

.modal-btn.secondary {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
}
.modal-btn.secondary:hover { border-color: var(--accent); color: var(--accent); }

/* Level XP Progress */
.modal-level-section { padding: 16px 24px; border-top: 1px solid var(--border-color); }
.mls-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.mls-label { font-size: 10px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.6px; text-transform: uppercase; }
.mls-bar-info { display: flex; justify-content: space-between; font-size: 10px; color: var(--text-muted); margin-bottom: 6px; }
.mls-track { height: 6px; background: var(--bg-tertiary); border-radius: 99px; overflow: hidden; }
.mls-fill { height: 100%; border-radius: 99px; transition: width 0.4s ease; }
.mls-fill.newcomer { background: #6b7280; }
.mls-fill.bronze   { background: #cd7f32; }
.mls-fill.silver   { background: #c0c0c0; }
.mls-fill.gold     { background: #ffd700; }
.mls-fill.platinum { background: #88d4e8; }
.mls-fill.legend   { background: linear-gradient(90deg, #ff4500, #ff8c00); }

/* Modal Achievements Grid */
.modal-achievements { padding: 16px 24px 20px; border-top: 1px solid var(--border-color); }
.mach-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.mach-title { font-size: 10px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.6px; text-transform: uppercase; }
.mach-count { font-size: 10px; color: var(--accent); font-weight: 600; background: rgba(255,69,0,0.1); padding: 2px 8px; border-radius: 10px; }
.mach-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); gap: 8px; }
.mach-item {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 10px 8px 8px; border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--bg-tertiary);
  text-align: center; cursor: default;
  transition: transform 0.15s ease;
}
.mach-item.unlocked:hover { transform: translateY(-2px); }
.mach-item.locked { opacity: 0.35; filter: grayscale(0.7); }
.mach-item.legendary.unlocked { border-color: rgba(255,215,0,0.35); box-shadow: 0 0 10px rgba(255,215,0,0.08); }
.mach-item.epic.unlocked      { border-color: rgba(139,92,246,0.35); }
.mach-item.rare.unlocked      { border-color: rgba(59,130,246,0.3); }
.mach-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: var(--bg-secondary); color: var(--text-muted); }
.mach-name { font-size: 9px; font-weight: 700; color: var(--text-muted); line-height: 1.2; }
.mach-rarity { font-size: 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; }
.mach-rarity.common    { color: #9ca3af; }
.mach-rarity.rare      { color: #3b82f6; }
.mach-rarity.epic      { color: #8b5cf6; }
.mach-rarity.legendary { color: #ffd700; }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

@media (max-width: 700px) {
  .contributors-header {
    grid-template-columns: 1fr;
  }
  
  .contributors-toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    width: 100%;
  }
  
  .sort-controls {
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .ct-spotlight { grid-template-columns: 1fr; }
  .ct-hero { flex-wrap: wrap; gap: 12px; padding: 14px; }
  .ct-hero-avatar { width: 56px; height: 56px; }
  .ct-hero-name { font-size: 15px; }
  .ct-hero-stats { gap: 0; }
  .ct-hs-item { padding: 0 10px; }
  .ct-podium { flex-direction: column; }
  .contributors-header { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .stat-card { padding: 14px; gap: 10px; }
  .stat-value { font-size: 20px; }
  .sort-controls { flex-wrap: wrap; }
  .sort-btn { padding: 6px 12px; font-size: 11px; }
  .contributors-table { min-width: 600px; }
  .impact-cell { display: none; }
  .activity-cell { display: none; }
}
</style>