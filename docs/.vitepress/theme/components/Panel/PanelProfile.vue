<!-- docs\.vitepress\theme\components\Panel\PanelProfile.vue -->
<template>
  <div class="panel-profile" :class="{ 'light-theme': isLightTheme }">

    <!-- Profile Hero -->
    <div class="profile-hero">
      <div class="hero-bg" :style="heroBgStyle"></div>
      <div class="hero-content">
        <div class="avatar-wrapper">
          <img :src="userAvatar" :alt="userLogin" class="profile-avatar">
          <div class="online-dot"></div>
        </div>
        <div class="profile-info">
          <div class="profile-name-row">
            <h2 class="profile-name">{{ githubUser.name || userLogin }}</h2>
            <span class="level-badge" :class="contributionLevel.key">
              <span class="level-icon" v-html="getLevelIcon(contributionLevel.key)"></span>
              {{ contributionLevel.label }}
            </span>
          </div>
          <span class="profile-login">@{{ userLogin }}</span>
          <p class="profile-bio" v-if="githubUser.bio">{{ githubUser.bio }}</p>
          <div class="profile-meta">
            <span v-if="githubUser.location">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {{ githubUser.location }}
            </span>
            <span v-if="githubUser.company">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              </svg>
              {{ githubUser.company }}
            </span>
            <a :href="`https://github.com/${userLogin}`" target="_blank" class="github-link">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              github.com/{{ userLogin }}
            </a>
          </div>
          <div class="github-stats-row">
            <div class="github-stat">
              <span class="gs-value">{{ formatNumber(githubUser.public_repos || 0) }}</span>
              <span class="gs-label">Repos</span>
            </div>
            <div class="github-stat">
              <span class="gs-value">{{ formatNumber(githubUser.followers || 0) }}</span>
              <span class="gs-label">Followers</span>
            </div>
            <div class="github-stat">
              <span class="gs-value">{{ formatNumber(githubUser.following || 0) }}</span>
              <span class="gs-label">Following</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contribution Level Progress -->
    <div class="level-section">
      <div class="level-header">
        <h3>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--accent)">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
          CONTRIBUTION LEVEL
        </h3>
        <span class="level-badge" :class="contributionLevel.key">{{ contributionLevel.label }}</span>
      </div>

      <div class="rank-cards-grid">
        <div
          v-for="(lvl, i) in levels"
          :key="lvl.key"
          class="rank-card"
          :class="[lvl.key, { achieved: i <= currentLevelIndex, current: i === currentLevelIndex, locked: i > currentLevelIndex }]"
        >
          <div class="rc-icon" v-html="getLevelIcon(lvl.key)"></div>
          <span class="rc-name">{{ lvl.label }}</span>
          <span class="rc-req">{{ lvl.minCommits === 0 ? 'Start' : lvl.minCommits + '+' }}</span>
          <div class="rc-current-tag" v-if="i === currentLevelIndex">CURRENT</div>
        </div>
      </div>

      <div class="level-details">
        <div class="level-stat">
          <span class="ld-label">Your commits</span>
          <span class="ld-value accent">{{ myStats.commits }}</span>
        </div>
        <div class="level-stat">
          <span class="ld-label">Contribution</span>
          <span class="ld-value">{{ myStats.impactPct }}%</span>
        </div>
        <div class="level-stat">
          <span class="ld-label">Rank</span>
          <span class="ld-value">#{{ myStats.rank }}</span>
        </div>
        <div class="level-stat" v-if="nextLevel">
          <span class="ld-label">Next level at</span>
          <span class="ld-value">{{ nextLevel.minCommits }} commits</span>
        </div>
      </div>

      <div class="xp-bar-wrapper" v-if="nextLevel">
        <div class="xp-bar-labels">
          <span>{{ contributionLevel.label }}</span>
          <span>{{ myStats.commits }} / {{ nextLevel.minCommits }} commits</span>
          <span>{{ nextLevel.label }}</span>
        </div>
        <div class="xp-bar">
          <div class="xp-fill" :class="contributionLevel.key" :style="{ width: xpProgress + '%' }"></div>
        </div>
      </div>
      <div class="xp-bar-wrapper" v-else>
        <div class="xp-bar-labels">
          <span>MAX LEVEL REACHED</span>
          <span class="accent">{{ myStats.commits }} commits</span>
        </div>
        <div class="xp-bar">
          <div class="xp-fill legend" style="width: 100%"></div>
        </div>
      </div>
    </div>

    <!-- Personal Repo Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon commits">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="3"/>
            <line x1="3" y1="12" x2="9" y2="12"/>
            <line x1="15" y1="12" x2="21" y2="12"/>
          </svg>
        </div>
        <div class="stat-body">
          <span class="stat-val">{{ formatNumber(myStats.commits) }}</span>
          <span class="stat-lbl">Commits to Repo</span>
        </div>
        <div class="stat-bar-wrap">
          <div class="stat-bar" :style="{ height: Math.min(myStats.impactPct, 100) + '%' }"></div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon prs">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor">
            <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/>
            <path d="M6 21V9"/><path d="M18 21V9"/>
          </svg>
        </div>
        <div class="stat-body">
          <span class="stat-val">{{ formatNumber(myStats.prs) }}</span>
          <span class="stat-lbl">Pull Requests</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon impact">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
        </div>
        <div class="stat-body">
          <span class="stat-val">{{ myStats.impactPct }}%</span>
          <span class="stat-lbl">Repo Impact</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon rank">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
        </div>
        <div class="stat-body">
          <span class="stat-val">#{{ myStats.rank }}</span>
          <span class="stat-lbl">Contributor Rank</span>
        </div>
      </div>
    </div>

    <!-- Personal Commit Activity Chart -->
    <div class="activity-card">
      <div class="card-header">
        <h3>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--accent)">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
          MY COMMIT ACTIVITY (30 DAYS)
        </h3>
        <span class="card-badge">{{ myStats.commits }} total</span>
      </div>
      <div class="mini-chart-wrapper">
        <canvas ref="myActivityChart"></canvas>
      </div>
    </div>

    <!-- Compared to Others -->
    <div class="comparison-card" v-if="topContributors.length > 1">
      <div class="card-header">
        <h3>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--accent)">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          COMPARISON WITH TOP CONTRIBUTORS
        </h3>
      </div>
      <div class="comparison-list">
        <div 
          v-for="(c, i) in comparisonList" 
          :key="c.login"
          class="comparison-row"
          :class="{ 'is-me': c.login === userLogin }"
        >
          <span class="cmp-rank" :class="getRankClass(i + 1)">#{{ i + 1 }}</span>
          <img :src="c.avatar_url" :alt="c.login" class="cmp-avatar">
          <span class="cmp-name">{{ c.login }}<span v-if="c.login === userLogin" class="you-tag">YOU</span></span>
          <div class="cmp-bar-track">
            <div class="cmp-bar" :class="{ accent: c.login === userLogin }" :style="{ width: (c.commits / comparisonList[0].commits * 100) + '%' }"></div>
          </div>
          <span class="cmp-commits">{{ formatNumber(c.commits) }}</span>
        </div>
      </div>
    </div>

    <!-- Achievements -->
    <div class="achievements-card">
      <div class="card-header">
        <h3>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--accent)">
            <path d="M12 15c3.31 0 6-2.69 6-6V3H6v6c0 3.31 2.69 6 6 6z"/>
            <path d="M8.21 15.89A7 7 0 0 0 12 17a7 7 0 0 0 3.79-1.11"/>
            <path d="M12 17v4"/><path d="M8 21h8"/>
          </svg>
          ACHIEVEMENTS
        </h3>
        <span class="card-badge">{{ unlockedAchievementsCount }}/{{ achievementsList.length }} Unlocked</span>
      </div>
      <div class="ach-grid">
        <div
          v-for="ach in achievementsList"
          :key="ach.id"
          class="ach-item"
          :class="[ach.rarity, { unlocked: ach.unlocked, locked: !ach.unlocked }]"
          :title="ach.unlocked ? ach.desc : 'Locked: ' + ach.desc"
        >
          <div class="ach-icon-wrap" :style="ach.unlocked ? { background: ach.color + '22', border: '1px solid ' + ach.color + '44' } : {}">
            <span class="ach-icon" v-html="ach.icon"></span>
            <div class="ach-lock" v-if="!ach.unlocked">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
          </div>
          <div class="ach-info">
            <span class="ach-title" :style="ach.unlocked ? { color: ach.color } : {}">{{ ach.title }}</span>
            <span class="ach-desc">{{ ach.desc }}</span>
            <span class="ach-rarity" :class="ach.rarity">{{ ach.rarity }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Appearance -->
    <div class="appearance-card">
      <div class="card-header">
        <h3>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--accent)">
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
          </svg>
          PROFILE BACKGROUND
        </h3>
        <span class="card-badge" v-if="activeBgId !== 'default'">Custom</span>
      </div>
      <div class="bg-swatches">
        <button
          v-for="preset in bgPresets"
          :key="preset.id"
          class="bg-swatch"
          :class="{ active: activeBgId === preset.id }"
          :style="preset.value ? { background: preset.value } : {}"
          :title="preset.label"
          @click="setBg(preset)"
        >
          <svg v-if="preset.id === 'default'" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          <svg v-if="activeBgId === preset.id && preset.id !== 'default'" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" class="swatch-check">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span class="swatch-label">{{ preset.label }}</span>
        </button>
      </div>
      <div class="custom-bg-row">
        <div class="setting-info">
          <span class="setting-name">Custom Color</span>
          <span class="setting-desc">Pick any solid color as your background</span>
        </div>
        <div class="custom-controls">
          <input type="color" v-model="customBgColor" class="color-input" @input="applyCustomBg">
          <button class="setting-btn" :class="{ 'btn-active': activeBgId === 'custom' }" @click="applyCustomBg">Apply</button>
        </div>
      </div>
      <div class="custom-bg-row">
        <div class="setting-info">
          <span class="setting-name">Image URL</span>
          <span class="setting-desc" :class="{ 'url-error': urlError }">{{ urlError ? 'Could not load that image URL' : 'Use any public image URL as background' }}</span>
        </div>
        <div class="custom-controls url-controls">
          <input
            type="url"
            v-model="customBgUrlInput"
            class="url-input"
            placeholder="https://example.com/image.jpg"
            @keyup.enter="applyUrlBg"
          />
          <button class="setting-btn" :class="{ 'btn-active': activeBgId === 'url' }" @click="applyUrlBg">Apply</button>
          <button v-if="activeBgId === 'url'" class="setting-btn danger" @click="customBgUrl = ''; customBgUrlInput = ''; activeBgId = 'default'; saveBg()">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Settings -->
    <div class="settings-card">
      <div class="card-header">
        <h3>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--accent)">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          SETTINGS
        </h3>
      </div>

      <div class="settings-list">
        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-name">Theme</span>
            <span class="setting-desc">Switch between dark and light mode</span>
          </div>
          <button class="theme-switch" :class="{ light: isLightTheme }" @click="$emit('toggle-theme')">
            <div class="switch-thumb">
              <svg v-if="isLightTheme" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </div>
          </button>
        </div>

        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-name">GitHub Profile</span>
            <span class="setting-desc">View your full GitHub profile</span>
          </div>
          <a :href="`https://github.com/${userLogin}`" target="_blank" class="setting-btn">
            Open
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>

        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-name">Repository</span>
            <span class="setting-desc">Open the Wildfire docs repository</span>
          </div>
          <a href="https://github.com/Wildfiire/docs" target="_blank" class="setting-btn">
            Open
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>

        <div class="setting-row danger-row">
          <div class="setting-info">
            <span class="setting-name">Sign Out</span>
            <span class="setting-desc">Log out from your GitHub account</span>
          </div>
          <button class="setting-btn danger" @click="$emit('logout')">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

export default {
  name: 'PanelProfile',

  emits: ['toggle-theme', 'logout'],

  props: {
    userLogin: { type: String, default: '' },
    userAvatar: { type: String, default: '' },
    githubToken: { type: String, default: '' },
    isLightTheme: { type: Boolean, default: false },
    contributors: { type: Array, default: () => [] },
    dailyCommits: { type: Array, default: () => [] },
    totalCommits: { type: Number, default: 0 }
  },

  data() {
    return {
      githubUser: {},
      chart: null,
      levels: [
        { key: 'newcomer', label: 'Newcomer', minCommits: 0   },
        { key: 'bronze',   label: 'Bronze',   minCommits: 5   },
        { key: 'silver',   label: 'Silver',   minCommits: 20  },
        { key: 'gold',     label: 'Gold',     minCommits: 50  },
        { key: 'platinum', label: 'Platinum', minCommits: 100 },
        { key: 'legend',   label: 'Legend',   minCommits: 200 }
      ],
      achievements: [
        { id: 'first_commit',   title: 'First Blood',    desc: 'Make your first commit',           cat: 'commits', type: 'commits', threshold: 1,   color: '#ff4500', rarity: 'common',    icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></svg>' },
        { id: 'commits_5',      title: 'Getting Started',desc: 'Reach 5 commits',                  cat: 'commits', type: 'commits', threshold: 5,   color: '#cd7f32', rarity: 'common',    icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
        { id: 'commits_20',     title: 'Silver Coder',   desc: 'Reach 20 commits',                 cat: 'commits', type: 'commits', threshold: 20,  color: '#c0c0c0', rarity: 'rare',      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>' },
        { id: 'commits_50',     title: 'Gold Coder',     desc: 'Reach 50 commits',                 cat: 'commits', type: 'commits', threshold: 50,  color: '#ffd700', rarity: 'rare',      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>' },
        { id: 'commits_100',    title: 'Platinum Coder', desc: 'Reach 100 commits',                cat: 'commits', type: 'commits', threshold: 100, color: '#88d4e8', rarity: 'epic',      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>' },
        { id: 'commits_200',    title: 'Wildfire Legend',desc: 'Reach 200 commits',                cat: 'commits', type: 'commits', threshold: 200, color: '#ff4500', rarity: 'legendary', icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>' },
        { id: 'first_pr',       title: 'Open Sesame',    desc: 'Open your first pull request',     cat: 'prs',     type: 'prs',     threshold: 1,   color: '#22c55e', rarity: 'common',    icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/></svg>' },
        { id: 'prs_5',          title: 'PR Machine',     desc: 'Open 5 pull requests',             cat: 'prs',     type: 'prs',     threshold: 5,   color: '#4ade80', rarity: 'rare',      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/></svg>' },
        { id: 'prs_10',         title: 'PR Legend',      desc: 'Open 10 pull requests',            cat: 'prs',     type: 'prs',     threshold: 10,  color: '#22c55e', rarity: 'epic',      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/></svg>' },
        { id: 'top10',          title: 'Top 10',         desc: 'Reach top 10 contributors',        cat: 'rank',    type: 'rank',    threshold: 10,  color: '#3b82f6', rarity: 'common',    icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
        { id: 'top5',           title: 'Elite',          desc: 'Reach top 5 contributors',         cat: 'rank',    type: 'rank',    threshold: 5,   color: '#8b5cf6', rarity: 'rare',      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
        { id: 'top3',           title: 'Podium',         desc: 'Reach top 3 contributors',         cat: 'rank',    type: 'rank',    threshold: 3,   color: '#f59e0b', rarity: 'epic',      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6l4-4 4 4"/><path d="M12 2v10.3"/><path d="M2 20h20"/><path d="M6 20v-4"/><path d="M10 20v-8"/><path d="M14 20v-6"/><path d="M18 20v-10"/></svg>' },
        { id: 'rank1',          title: 'Champion',       desc: '#1 Top contributor of all time',   cat: 'rank',    type: 'rank',    threshold: 1,   color: '#ffd700', rarity: 'legendary', icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>' }
      ],
      activeBgId: 'default',
      customBgColor: '#1a1a2e',
      customBgUrl: '',
      customBgUrlInput: '',
      urlError: false,
      bgPresets: [
        { id: 'default', label: 'Default', value: null },
        { id: 'fire',    label: 'Fire',    value: 'linear-gradient(135deg, #200800 0%, #5c1500 50%, #8b1500 100%)' },
        { id: 'ocean',   label: 'Ocean',   value: 'linear-gradient(135deg, #001428 0%, #003060 50%, #005980 100%)' },
        { id: 'forest',  label: 'Forest',  value: 'linear-gradient(135deg, #0a150a 0%, #1a3c1a 50%, #2d5a27 100%)' },
        { id: 'galaxy',  label: 'Galaxy',  value: 'linear-gradient(135deg, #0d0221 0%, #2d1b69 50%, #11998e 100%)' },
        { id: 'gold',    label: 'Gold',    value: 'linear-gradient(135deg, #1a1000 0%, #4a3000 50%, #8a6000 100%)' }
      ]
    }
  },

  computed: {
    myStats() {
      const me = this.contributors.find(c => c.login === this.userLogin)
      if (!me) return { commits: 0, prs: 0, impactPct: 0, rank: '—' }
      const rank = this.contributors.indexOf(me) + 1
      return {
        commits: me.commits || me.contributions || 0,
        prs: me.prs || 0,
        impactPct: me.impact ? me.impact.toFixed(1) : 0,
        rank
      }
    },

    currentLevelIndex() {
      const c = this.myStats.commits
      let idx = 0
      this.levels.forEach((lvl, i) => {
        if (c >= lvl.minCommits) idx = i
      })
      return idx
    },

    contributionLevel() {
      return this.levels[this.currentLevelIndex]
    },

    nextLevel() {
      return this.levels[this.currentLevelIndex + 1] || null
    },

    xpProgress() {
      if (!this.nextLevel) return 100
      const curr = this.levels[this.currentLevelIndex].minCommits
      const next = this.nextLevel.minCommits
      const progress = ((this.myStats.commits - curr) / (next - curr)) * 100
      return Math.min(Math.max(progress, 0), 100)
    },

    topContributors() {
      return [...this.contributors].sort((a, b) => (b.commits || 0) - (a.commits || 0))
    },

    heroBgStyle() {
      if (!this.activeBgId || this.activeBgId === 'default') return {}
      if (this.activeBgId === 'url' && this.customBgUrl) return { backgroundImage: `url('${this.customBgUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' }
      if (this.activeBgId === 'custom') return { background: this.customBgColor }
      const p = this.bgPresets.find(p => p.id === this.activeBgId)
      return p && p.value ? { background: p.value } : {}
    },

    comparisonList() {
      const top5 = this.topContributors.slice(0, 5)
      const meInTop = top5.find(c => c.login === this.userLogin)
      if (!meInTop) {
        const me = this.contributors.find(c => c.login === this.userLogin)
        if (me) top5.push(me)
      }
      return top5.sort((a, b) => (b.commits || 0) - (a.commits || 0))
    },
    achievementsList() {
      return this.achievements.map(a => ({ ...a, unlocked: this.checkAchievement(a) }))
    },
    unlockedAchievementsCount() {
      return this.achievementsList.filter(a => a.unlocked).length
    }
  },

  watch: {
    userLogin(val) {
      if (val) { this.fetchUserInfo(); this.loadProfileBg() }
    },
    isLightTheme() {
      this.initChart()
    },
    dailyCommits() {
      this.initChart()
    }
  },

  mounted() {
    if (this.userLogin) { this.fetchUserInfo(); this.loadProfileBg() }
    this.$nextTick(() => this.initChart())
  },

  beforeUnmount() {
    if (this.chart) this.chart.destroy()
  },

  methods: {
    checkAchievement(a) {
      if (a.type === 'commits') return this.myStats.commits >= a.threshold
      if (a.type === 'prs')     return this.myStats.prs >= a.threshold
      if (a.type === 'rank')    return typeof this.myStats.rank === 'number' && this.myStats.rank <= a.threshold
      return false
    },

    async fetchUserInfo() {
      if (!this.githubToken || !this.userLogin) return
      try {
        const res = await fetch(`https://api.github.com/users/${this.userLogin}`, {
          headers: { 'Authorization': `token ${this.githubToken}`, 'Accept': 'application/vnd.github.v3+json' }
        })
        if (res.ok) this.githubUser = await res.json()
      } catch (e) {
        console.error('[PanelProfile] Failed to fetch user info:', e)
      }
    },

    initChart() {
      const canvas = this.$refs.myActivityChart
      if (!canvas) return
      if (this.chart) this.chart.destroy()

      const isLight = this.isLightTheme
      const textColor = isLight ? '#666' : '#8a8a95'
      const gridColor = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.03)'

      const labels = []
      const now = new Date()
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now)
        d.setDate(d.getDate() - i)
        labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
      }

      this.chart = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            data: this.dailyCommits.length ? this.dailyCommits : Array(30).fill(0),
            backgroundColor: 'rgba(255, 69, 0, 0.7)',
            borderRadius: 4,
            barPercentage: 0.6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: isLight ? '#fff' : '#1a1a22',
              titleColor: isLight ? '#333' : '#fff',
              bodyColor: isLight ? '#666' : '#e0e0e0',
              borderColor: '#ff4500',
              borderWidth: 1
            }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: textColor, stepSize: 1 } },
            x: { grid: { display: false }, ticks: { color: textColor, maxRotation: 45, minRotation: 45, maxTicksLimit: 8 } }
          }
        }
      })
    },

    formatNumber(num) {
      if (!num) return '0'
      if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
      return num.toString()
    },

    getRankClass(rank) {
      if (rank === 1) return 'gold'
      if (rank === 2) return 'silver'
      if (rank === 3) return 'bronze'
      return ''
    },

    getLevelIcon(key) {
      const icons = {
        newcomer: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/></svg>`,
        bronze:   `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M8.5 13L6 22h12l-2.5-9"/></svg>`,
        silver:   `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.37 7.28L12 17l-6.18 4.18 2.37-7.28L2 9.4h7.6z"/></svg>`,
        gold:     `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H3l2 10h14l2-10h-3M6 9V5h12v4M6 9h12"/><path d="M9 5V3h6v2"/></svg>`,
        platinum: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/></svg>`,
        legend:   `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 20h20"/><path d="M4 20l2-8 4 4 2-7 2 7 4-4 2 8"/></svg>`
      }
      return icons[key] || icons.newcomer
    },

    loadProfileBg() {
      if (!this.userLogin) return
      try {
        const saved = JSON.parse(localStorage.getItem(`wildfire-bg-${this.userLogin}`) || 'null')
        if (saved) {
          this.activeBgId = saved.presetId || 'default'
          this.customBgColor = saved.customColor || '#1a1a2e'
          this.customBgUrl = saved.customUrl || ''
          this.customBgUrlInput = saved.customUrl || ''
        }
      } catch (e) {}
    },

    saveBg() {
      if (!this.userLogin) return
      localStorage.setItem(`wildfire-bg-${this.userLogin}`, JSON.stringify({
        presetId: this.activeBgId,
        customColor: this.customBgColor,
        customUrl: this.customBgUrl
      }))
    },

    applyUrlBg() {
      const url = this.customBgUrlInput.trim()
      if (!url) return
      this.urlError = false
      const img = new Image()
      img.onload = () => {
        this.customBgUrl = url
        this.activeBgId = 'url'
        this.saveBg()
      }
      img.onerror = () => { this.urlError = true }
      img.src = url
    },

    setBg(preset) {
      this.activeBgId = preset.id
      this.saveBg()
    },

    applyCustomBg() {
      this.activeBgId = 'custom'
      this.saveBg()
    }
  }
}
</script>

<style scoped>
.panel-profile {
  --bg-secondary: #0f0f12;
  --bg-tertiary: #1a1a20;
  --bg-primary: #0a0a0c;
  --border-color: #1f1f24;
  --text-primary: #ffffff;
  --text-secondary: #e0e0e0;
  --text-muted: #8a8a95;
  --accent: #ff4500;
  --accent-glow: rgba(255, 69, 0, 0.2);
  --success: #2ecc71;

  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: fadeIn 0.3s ease;
}

.panel-profile.light-theme {
  --bg-primary: #f5f5f7;
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

/* ── Hero ── */
.profile-hero {
  position: relative;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,69,0,0.08) 0%, transparent 60%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 28px;
  padding: 32px;
  flex-wrap: wrap;
}

.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.profile-avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--bg-secondary);
  box-shadow: 0 0 0 3px var(--accent);
}

.online-dot {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 14px;
  height: 14px;
  background: var(--success);
  border-radius: 50%;
  border: 2px solid var(--bg-secondary);
}

.profile-info { flex: 1; min-width: 200px; }

.profile-name-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.profile-name {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.profile-login {
  font-size: 13px;
  color: var(--text-muted);
  display: block;
  margin-bottom: 8px;
}

.profile-bio {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0 0 12px;
  line-height: 1.5;
}

.profile-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.profile-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.github-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--accent);
  text-decoration: none;
  font-size: 12px;
}

.github-stats-row {
  display: flex;
  gap: 24px;
}

.github-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.gs-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.gs-label {
  font-size: 10px;
  color: var(--text-muted);
  text-transform: uppercase;
}

/* ── Level Badge ── */
.level-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
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

/* ── Level Section ── */
.level-section {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 24px;
}

.level-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.level-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ── Rank Cards ── */
.rank-cards-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  margin-bottom: 24px;
}

.rank-card {
  position: relative;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  opacity: 0.4;
  filter: grayscale(0.5);
}

.rank-card.achieved {
  opacity: 0.75;
  filter: none;
}

.rank-card.current {
  opacity: 1;
  filter: none;
  border-color: var(--accent);
  background: rgba(255, 69, 0, 0.08);
  box-shadow: 0 0 0 2px var(--accent-glow), 0 4px 16px rgba(255,69,0,0.15);
}

.rc-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  transition: all 0.2s;
}

.rank-card.achieved .rc-icon { color: var(--text-secondary); border-color: rgba(255,255,255,0.2); }
.rank-card.current  .rc-icon { color: var(--accent); border-color: var(--accent); background: rgba(255,69,0,0.1); }

.rank-card.bronze   .rc-icon { color: #cd7f32; }
.rank-card.silver   .rc-icon { color: #c0c0c0; }
.rank-card.gold     .rc-icon { color: #ffd700; }
.rank-card.platinum .rc-icon { color: #a8d8ea; }
.rank-card.legend   .rc-icon { color: var(--accent); }

.rc-name {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  text-align: center;
}
.rank-card.achieved .rc-name { color: var(--text-secondary); }
.rank-card.current  .rc-name { color: var(--accent); }

.rc-req {
  font-size: 9px;
  color: var(--text-muted);
  opacity: 0.7;
}

.rc-current-tag {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--accent);
  color: #fff;
  font-size: 8px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.level-details {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.level-stat { display: flex; flex-direction: column; gap: 2px; }

.ld-label { font-size: 10px; color: var(--text-muted); text-transform: uppercase; }
.ld-value { font-size: 18px; font-weight: 700; color: var(--text-primary); }
.ld-value.accent { color: var(--accent); }

.xp-bar-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--text-muted);
  margin-bottom: 6px;
}
.xp-bar-labels .accent { color: var(--accent); }

.xp-bar {
  height: 8px;
  background: var(--bg-tertiary);
  border-radius: 4px;
  overflow: hidden;
}

.xp-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
  background: var(--accent);
}
.xp-fill.gold    { background: linear-gradient(90deg, #cd7f32, #ffd700); }
.xp-fill.platinum{ background: linear-gradient(90deg, #ffd700, #a8d8ea); }
.xp-fill.legend  { background: linear-gradient(90deg, #ff6b35, #ff4500); }

/* ── Stats Grid ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.stat-icon.commits { background: rgba(255,69,0,0.1);  color: #ff4500; }
.stat-icon.prs     { background: rgba(46,204,113,0.1); color: #2ecc71; }
.stat-icon.impact  { background: rgba(52,152,219,0.1); color: #3498db; }
.stat-icon.rank    { background: rgba(255,215,0,0.1);  color: #ffd700; }

.stat-body { flex: 1; }
.stat-val { display: block; font-size: 26px; font-weight: 700; color: var(--text-primary); }
.stat-lbl { display: block; font-size: 11px; color: var(--text-muted); text-transform: uppercase; }

.stat-bar-wrap {
  width: 4px;
  height: 40px;
  background: var(--bg-tertiary);
  border-radius: 2px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}
.stat-bar {
  width: 100%;
  background: var(--accent);
  border-radius: 2px;
  min-height: 4px;
  transition: height 0.5s ease;
}

/* ── Activity + Comparison + Settings cards ── */
.activity-card, .comparison-card, .settings-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 24px;
}

.activity-card {
  padding-bottom: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.card-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-badge {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 4px 10px;
  font-size: 11px;
  color: var(--accent);
  font-weight: 600;
}

.mini-chart-wrapper {
  height: 240px;
  position: relative;
}

/* ── Comparison ── */
.comparison-list { display: flex; flex-direction: column; gap: 10px; }

.comparison-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 12px;
  background: var(--bg-tertiary);
  transition: all 0.2s;
}

.comparison-row.is-me {
  background: rgba(255,69,0,0.08);
  border: 1px solid rgba(255,69,0,0.3);
}

.cmp-rank {
  width: 28px;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
}
.cmp-rank.gold   { color: #ffd700; }
.cmp-rank.silver { color: #c0c0c0; }
.cmp-rank.bronze { color: #cd7f32; }

.cmp-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.cmp-name {
  width: 110px;
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 6px;
}

.you-tag {
  background: var(--accent);
  color: white;
  font-size: 9px;
  padding: 1px 5px;
  border-radius: 10px;
  font-weight: 700;
}

.cmp-bar-track {
  flex: 1;
  height: 6px;
  background: var(--bg-primary);
  border-radius: 3px;
  overflow: hidden;
}

.cmp-bar {
  height: 100%;
  background: var(--border-color);
  border-radius: 3px;
  transition: width 0.5s ease;
}
.cmp-bar.accent { background: var(--accent); }

.cmp-commits {
  width: 44px;
  text-align: right;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
}

/* ── Settings ── */
.settings-list { display: flex; flex-direction: column; }

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-color);
  gap: 16px;
}

.setting-row:last-child { border-bottom: none; }

.setting-info { flex: 1; }
.setting-name { display: block; font-size: 13px; font-weight: 500; color: var(--text-primary); margin-bottom: 2px; }
.setting-desc { display: block; font-size: 11px; color: var(--text-muted); }

.setting-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
  white-space: nowrap;
}

.setting-btn:hover { border-color: var(--accent); color: var(--accent); }
.setting-btn.danger { color: #e74c3c; border-color: rgba(231,76,60,0.3); }
.setting-btn.danger:hover { background: rgba(231,76,60,0.1); border-color: #e74c3c; }

.theme-switch {
  position: relative;
  width: 52px;
  height: 28px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;
}

.theme-switch.light {
  background: rgba(255,69,0,0.15);
  border-color: var(--accent);
}

.switch-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  background: var(--bg-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.theme-switch.light .switch-thumb {
  left: 27px;
  color: var(--accent);
}

/* ── Appearance card ── */
.appearance-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 24px;
}

.bg-swatches {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.bg-swatch {
  position: relative;
  width: 72px;
  height: 52px;
  border-radius: 10px;
  border: 2px solid var(--border-color);
  cursor: pointer;
  background: var(--bg-tertiary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--text-muted);
  font-size: 9px;
  transition: all 0.2s;
  overflow: hidden;
}

.bg-swatch:hover { border-color: var(--accent); }
.bg-swatch.active { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-glow); }

.swatch-label {
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  color: rgba(255,255,255,0.8);
  text-shadow: 0 1px 2px rgba(0,0,0,0.8);
  position: absolute;
  bottom: 4px;
}

.bg-swatch[title="Default"] .swatch-label { color: var(--text-muted); text-shadow: none; }

.swatch-check {
  position: absolute;
  top: 4px;
  right: 4px;
  color: #fff;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));
}

.custom-bg-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
  gap: 16px;
}

.custom-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-input {
  width: 44px;
  height: 36px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  padding: 2px;
  background: var(--bg-tertiary);
}

.color-input::-webkit-color-swatch-wrapper { padding: 0; }
.color-input::-webkit-color-swatch { border: none; border-radius: 5px; }

.url-controls { flex-wrap: wrap; gap: 8px; }

.url-input {
  flex: 1;
  min-width: 200px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 11px;
  padding: 8px 12px;
  outline: none;
  transition: border-color 0.2s;
}

.url-input:focus { border-color: var(--accent); }
.url-input::placeholder { color: var(--text-muted); }

.url-error { color: #e74c3c !important; }

.setting-btn.btn-active {
  background: rgba(255,69,0,0.15);
  border-color: var(--accent);
  color: var(--accent);
}

@media (max-width: 768px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .hero-content { padding: 20px; }
  .profile-name { font-size: 20px; }
  .level-progress-track { overflow-x: auto; padding-bottom: 8px; }
}

/* Achievements */
.achievements-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
}

.ach-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 10px;
  padding: 16px;
}

.ach-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-tertiary);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.ach-item.unlocked {
  border-color: rgba(255,255,255,0.08);
}

.ach-item.unlocked:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
}

.ach-item.locked {
  opacity: 0.45;
  filter: grayscale(0.6);
}

.ach-item.legendary.unlocked { border-color: rgba(255,215,0,0.3); box-shadow: 0 0 14px rgba(255,215,0,0.08); }
.ach-item.epic.unlocked      { border-color: rgba(139,92,246,0.3); box-shadow: 0 0 14px rgba(139,92,246,0.08); }
.ach-item.rare.unlocked      { border-color: rgba(59,130,246,0.3); }

.ach-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--bg-hover);
  border: 1px solid var(--border-color);
  position: relative;
}

.ach-icon { display: flex; align-items: center; justify-content: center; color: var(--text-muted); }
.ach-item.unlocked .ach-icon { color: inherit; }

.ach-lock {
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: var(--bg-secondary);
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  border: 1px solid var(--border-color);
}

.ach-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ach-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ach-desc {
  font-size: 10px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ach-rarity {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 2px;
}

.ach-rarity.common    { color: #9ca3af; }
.ach-rarity.rare      { color: #3b82f6; }
.ach-rarity.epic      { color: #8b5cf6; }
.ach-rarity.legendary { color: #ffd700; }

@media (max-width: 600px) {
  .ach-grid { grid-template-columns: 1fr 1fr; gap: 8px; padding: 12px; }
  .ach-item { padding: 10px; gap: 8px; }
  .ach-icon-wrap { width: 34px; height: 34px; }
}

@media (max-width: 400px) {
  .ach-grid { grid-template-columns: 1fr; }
}
</style>
