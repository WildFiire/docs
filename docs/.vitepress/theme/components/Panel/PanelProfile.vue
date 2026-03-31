<!-- docs\.vitepress\theme\components\Panel\PanelProfile.vue -->
<template>
  <div class="panel-profile" :class="{ 'light-theme': isLightTheme }">

    <!-- ── HERO ── -->
    <div class="pp-hero">
      <div class="pp-hero-bg" :style="heroBgStyle"></div>
      <div class="pp-hero-overlay"></div>
      <div class="pp-hero-body">

        <!-- Avatar + animated level ring -->
        <div class="pp-avatar-wrap">
          <svg class="pp-level-ring" viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="54" stroke="rgba(255,255,255,0.07)" stroke-width="7"/>
            <circle
              cx="60" cy="60" r="54"
              :stroke="levelRingColor"
              stroke-width="7"
              stroke-linecap="round"
              :stroke-dasharray="339.3"
              :stroke-dashoffset="ringOffset"
              transform="rotate(-90 60 60)"
              style="transition: stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1), stroke 0.5s"
              filter="url(#pp-ring-glow)"
            />
            <defs>
              <filter id="pp-ring-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="3.5" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
          </svg>
          <img :src="userAvatar" :alt="userLogin" class="pp-avatar">
          <div class="pp-online-dot"></div>
          <div class="pp-ring-badge" :class="contributionLevel.key">
            <span v-html="getLevelIcon(contributionLevel.key)"></span>
          </div>
        </div>

        <!-- Info block -->
        <div class="pp-hero-info">
          <div class="pp-name-row">
            <h2 class="pp-name">{{ githubUser.name || userLogin }}</h2>
            <span class="pp-lvl-chip" :class="contributionLevel.key">
              <span v-html="getLevelIcon(contributionLevel.key)"></span>
              {{ contributionLevel.label }}
            </span>
          </div>
          <span class="pp-login">@{{ userLogin }}</span>
          <p class="pp-bio" v-if="githubUser.bio">{{ githubUser.bio }}</p>
          <div class="pp-meta">
            <span v-if="githubUser.location">
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {{ githubUser.location }}
            </span>
            <span v-if="githubUser.company">
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
              {{ githubUser.company }}
            </span>
            <a :href="`https://github.com/${userLogin}`" target="_blank" class="pp-gh-link">
              <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              github.com/{{ userLogin }}
            </a>
          </div>
          <div class="pp-gh-stats">
            <div class="pp-gs-item">
              <span class="pp-gs-val">{{ formatNumber(githubUser.public_repos || 0) }}</span>
              <span class="pp-gs-lbl">Repos</span>
            </div>
            <div class="pp-gs-sep"></div>
            <div class="pp-gs-item">
              <span class="pp-gs-val">{{ formatNumber(githubUser.followers || 0) }}</span>
              <span class="pp-gs-lbl">Followers</span>
            </div>
            <div class="pp-gs-sep"></div>
            <div class="pp-gs-item">
              <span class="pp-gs-val">{{ formatNumber(githubUser.following || 0) }}</span>
              <span class="pp-gs-lbl">Following</span>
            </div>
          </div>
        </div>

        <!-- Rank chip -->
        <div class="pp-rank-chip" v-if="myStats.rank !== '—'">
          <div class="pp-rank-num">#{{ myStats.rank }}</div>
          <div class="pp-rank-lbl">RANK</div>
        </div>
      </div>
    </div>

    <!-- ── KPI STRIP ── -->
    <div class="pp-kpi-strip">
      <div class="pp-kpi commits">
        <div class="pp-kpi-top">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></svg>
          <span class="pp-kpi-lbl">Commits</span>
        </div>
        <div class="pp-kpi-val">{{ formatNumber(myStats.commits) }}</div>
        <div class="pp-kpi-bar-wrap"><div class="pp-kpi-bar commits" :style="{ width: Math.min(myStats.impactPct, 100) + '%' }"></div></div>
      </div>
      <div class="pp-kpi prs">
        <div class="pp-kpi-top">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/></svg>
          <span class="pp-kpi-lbl">Pull Requests</span>
        </div>
        <div class="pp-kpi-val">{{ formatNumber(myStats.prs) }}</div>
      </div>
      <div class="pp-kpi impact">
        <div class="pp-kpi-top">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          <span class="pp-kpi-lbl">Repo Impact</span>
        </div>
        <div class="pp-kpi-val">{{ myStats.impactPct }}%</div>
        <div class="pp-kpi-bar-wrap"><div class="pp-kpi-bar impact" :style="{ width: Math.min(myStats.impactPct, 100) + '%' }"></div></div>
      </div>
      <div class="pp-kpi level">
        <div class="pp-kpi-top">
          <span v-html="getLevelIcon(contributionLevel.key)" style="opacity:0.7"></span>
          <span class="pp-kpi-lbl">Level</span>
        </div>
        <div class="pp-kpi-val pp-kpi-val-sm">{{ contributionLevel.label }}</div>
        <div class="pp-kpi-bar-wrap"><div class="pp-kpi-bar level" :class="contributionLevel.key" :style="{ width: xpProgress + '%' }"></div></div>
      </div>
    </div>

    <!-- ── PROGRESSION PATH ── -->
    <div class="pp-card">
      <div class="pp-card-header">
        <div class="pp-card-title">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
          PROGRESSION PATH
        </div>
        <span class="pp-card-badge">{{ myStats.commits }} commits</span>
      </div>

      <div class="pp-track">
        <div class="pp-track-rail"></div>
        <div class="pp-track-progress" :style="{ width: trackFillPct + '%' }"></div>
        <div
          v-for="(lvl, i) in levels"
          :key="lvl.key"
          class="pp-track-node"
          :class="[lvl.key, { achieved: i <= currentLevelIndex, current: i === currentLevelIndex }]"
          :style="{ left: (i / (levels.length - 1) * 100) + '%' }"
        >
          <div class="pp-node-you" v-if="i === currentLevelIndex">YOU</div>
          <div class="pp-node-dot"><span v-html="getLevelIcon(lvl.key)"></span></div>
          <div class="pp-node-name">{{ lvl.label }}</div>
          <div class="pp-node-req">{{ lvl.minCommits === 0 ? 'Start' : lvl.minCommits + '+' }}</div>
        </div>
      </div>

      <div class="pp-xp-row" v-if="nextLevel">
        <span class="pp-xp-label">{{ contributionLevel.label }}</span>
        <div class="pp-xp-track"><div class="pp-xp-fill" :class="contributionLevel.key" :style="{ width: xpProgress + '%' }"></div></div>
        <span class="pp-xp-label right">{{ nextLevel.label }}</span>
        <span class="pp-xp-pct">{{ Math.round(xpProgress) }}%</span>
      </div>
      <div class="pp-xp-row" v-else>
        <span class="pp-xp-label legend">★ MAX LEVEL</span>
        <div class="pp-xp-track"><div class="pp-xp-fill legend" style="width:100%"></div></div>
        <span class="pp-xp-pct">100%</span>
      </div>
    </div>

    <!-- ── COMMIT ACTIVITY ── -->
    <div class="pp-card">
      <div class="pp-card-header">
        <div class="pp-card-title">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          COMMIT ACTIVITY · 30 DAYS
        </div>
        <div class="pp-act-meta">
          <span><strong>{{ activityStats.total }}</strong> total</span>
          <span class="pp-act-sep">·</span>
          <span><strong>{{ activityStats.streak }}</strong> streak</span>
          <span class="pp-act-sep">·</span>
          <span>peak <strong>{{ activityStats.peak }}</strong>/day</span>
        </div>
      </div>

      <div class="pp-act-wrap" @mouseleave="actHovered = -1">
        <svg viewBox="0 0 660 150" preserveAspectRatio="xMidYMid meet" width="100%" height="150" style="display:block;overflow:visible">
          <defs>
            <linearGradient id="pp-bar-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#ff6030" stop-opacity="1"/>
              <stop offset="100%" stop-color="#cc1a00" stop-opacity="0.55"/>
            </linearGradient>
            <linearGradient id="pp-bar-hot" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#ffcc00" stop-opacity="1"/>
              <stop offset="100%" stop-color="#ff5500" stop-opacity="0.7"/>
            </linearGradient>
            <filter id="pp-bar-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <!-- grid lines -->
          <line v-for="gy in [30,60,90,120]" :key="'g'+gy" x1="4" :y1="gy" x2="656" :y2="gy" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
          <!-- bars -->
          <g v-for="(bar, i) in actBars" :key="'b'+i">
            <rect
              :x="bar.x" :y="bar.y" :width="bar.w" :height="bar.h"
              :fill="bar.hot ? 'url(#pp-bar-hot)' : 'url(#pp-bar-grad)'"
              rx="2"
              :fill-opacity="bar.commits === 0 ? 0.12 : (actHovered >= 0 && actHovered !== i ? 0.35 : 1)"
              :filter="actHovered === i && bar.commits > 0 ? 'url(#pp-bar-glow)' : ''"
            />
            <rect :x="bar.x - 1" y="0" :width="bar.w + 2" height="150" fill="transparent" style="cursor:crosshair" @mouseenter="actHovered = i"/>
          </g>
          <!-- peak glow dot -->
          <circle v-if="actPeak" :cx="actPeak.cx" :cy="actPeak.y - 5" r="4.5" fill="#ffcc00" filter="url(#pp-bar-glow)" opacity="0.95"/>
          <!-- day labels every 7 days -->
          <text v-for="bar in actLabelBars" :key="'al'+bar.i" :x="bar.cx" y="147" text-anchor="middle" font-size="8.5" fill="rgba(255,255,255,0.28)" font-family="system-ui,sans-serif">{{ bar.dayLabel }}</text>
        </svg>
        <div v-if="actHovered >= 0 && actBars[actHovered]" class="pp-act-tip" :style="actTipStyle">
          <div class="pp-tip-val">{{ actBars[actHovered].commits }}<span>{{ actBars[actHovered].commits !== 1 ? ' commits' : ' commit' }}</span></div>
          <div class="pp-tip-date">{{ actBars[actHovered].label }}</div>
        </div>
      </div>
    </div>

    <!-- ── VS TOP CONTRIBUTORS ── -->
    <div class="pp-card" v-if="topContributors.length > 1">
      <div class="pp-card-header">
        <div class="pp-card-title">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          VS TOP CONTRIBUTORS
        </div>
      </div>
      <div class="pp-cmp-list">
        <div
          v-for="(c, i) in comparisonList"
          :key="c.login"
          class="pp-cmp-row"
          :class="{ 'is-me': c.login === userLogin }"
        >
          <span class="pp-cmp-rank" :class="getRankClass(i + 1)">#{{ i + 1 }}</span>
          <img :src="c.avatar_url" :alt="c.login" class="pp-cmp-avatar">
          <span class="pp-cmp-name">{{ c.login }}<span class="pp-you-tag" v-if="c.login === userLogin">YOU</span></span>
          <div class="pp-cmp-bar-wrap">
            <div class="pp-cmp-bar" :class="{ me: c.login === userLogin }" :style="{ width: (c.commits / comparisonList[0].commits * 100) + '%' }"></div>
          </div>
          <span class="pp-cmp-count">{{ formatNumber(c.commits) }}</span>
        </div>
      </div>
    </div>

    <!-- ── ACHIEVEMENTS ── -->
    <div class="pp-card">
      <div class="pp-card-header">
        <div class="pp-card-title">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15c3.31 0 6-2.69 6-6V3H6v6c0 3.31 2.69 6 6 6z"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>
          ACHIEVEMENTS
        </div>
        <span class="pp-card-badge accent">{{ unlockedAchievementsCount }}/{{ achievementsList.length }} unlocked</span>
      </div>
      <div class="pp-ach-grid">
        <div
          v-for="ach in achievementsList"
          :key="ach.id"
          class="pp-ach-item"
          :class="[ach.rarity, { unlocked: ach.unlocked }]"
          :title="ach.unlocked ? ach.title + ' — ' + ach.desc : 'Locked: ' + ach.desc"
        >
          <div class="pp-ach-icon" :style="ach.unlocked ? { color: ach.color, background: ach.color + '18', borderColor: ach.color + '55' } : {}">
            <span v-html="ach.icon"></span>
            <div class="pp-ach-lock" v-if="!ach.unlocked">
              <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
          </div>
          <div class="pp-ach-info">
            <span class="pp-ach-name" :style="ach.unlocked ? { color: ach.color } : {}">{{ ach.title }}</span>
            <span class="pp-ach-rarity" :class="ach.rarity">{{ ach.rarity }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── PROFILE BACKGROUND ── -->
    <div class="pp-card">
      <div class="pp-card-header">
        <div class="pp-card-title">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
          PROFILE BACKGROUND
        </div>
        <div class="pp-sync-pill" :class="bgSyncStatus">
          <span class="pp-sync-dot"></span>
          {{ bgSyncLabel }}
        </div>
      </div>

      <!-- 12 presets grid -->
      <div class="pp-bg-grid">
        <button
          v-for="preset in bgPresets"
          :key="preset.id"
          class="pp-bg-btn"
          :class="{ active: activeBgId === preset.id }"
          :title="preset.label"
          @click="setBg(preset)"
        >
          <div class="pp-bg-preview" :style="preset.value ? { background: preset.value } : {}">
            <svg v-if="preset.id === 'default'" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            <svg v-else-if="activeBgId === preset.id" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <span class="pp-bg-lbl">{{ preset.label }}</span>
        </button>
      </div>

      <!-- Custom controls -->
      <div class="pp-bg-custom">
        <div class="pp-bg-custom-col">
          <label class="pp-bg-custom-label">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>
            Solid Color
          </label>
          <div class="pp-bg-custom-row">
            <input type="color" v-model="customBgColor" class="pp-color-input" @input="applyCustomBg">
            <button class="pp-bg-apply" :class="{ active: activeBgId === 'custom' }" @click="applyCustomBg">Apply</button>
          </div>
        </div>
        <div class="pp-bg-custom-col">
          <label class="pp-bg-custom-label" :class="{ error: urlError }">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            {{ urlError ? 'Invalid URL!' : 'Image URL' }}
          </label>
          <div class="pp-bg-custom-row">
            <input type="url" v-model="customBgUrlInput" class="pp-url-input" :class="{ error: urlError }" placeholder="https://i.imgur.com/..." @keyup.enter="applyUrlBg">
            <button class="pp-bg-apply" :class="{ active: activeBgId === 'url' }" @click="applyUrlBg">Apply</button>
            <button v-if="activeBgId === 'url'" class="pp-bg-apply danger" @click="resetUrl">
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── SETTINGS ── -->
    <div class="pp-card">
      <div class="pp-card-header">
        <div class="pp-card-title">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          SETTINGS
        </div>
      </div>
      <div class="pp-settings">
        <div class="pp-setting-row">
          <div class="pp-setting-info">
            <span class="pp-setting-name">Theme</span>
            <span class="pp-setting-desc">Toggle dark / light mode</span>
          </div>
          <button class="pp-toggle" :class="{ on: isLightTheme }" @click="$emit('toggle-theme')">
            <div class="pp-toggle-thumb">
              <svg v-if="isLightTheme" viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>
              <svg v-else viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </div>
          </button>
        </div>
        <div class="pp-setting-row">
          <div class="pp-setting-info">
            <span class="pp-setting-name">GitHub Profile</span>
            <span class="pp-setting-desc">View your public GitHub profile</span>
          </div>
          <a :href="`https://github.com/${userLogin}`" target="_blank" class="pp-btn">
            Open
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>
        <div class="pp-setting-row">
          <div class="pp-setting-info">
            <span class="pp-setting-name">Repository</span>
            <span class="pp-setting-desc">Open Wildfire docs repository</span>
          </div>
          <a href="https://github.com/Wildfiire/docs" target="_blank" class="pp-btn">
            Open
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>
        <div class="pp-setting-row danger">
          <div class="pp-setting-info">
            <span class="pp-setting-name">Sign Out</span>
            <span class="pp-setting-desc">Log out from your GitHub account</span>
          </div>
          <button class="pp-btn danger" @click="$emit('logout')">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign Out
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'PanelProfile',

  emits: ['toggle-theme', 'logout'],

  props: {
    userLogin:    { type: String,  default: '' },
    userAvatar:   { type: String,  default: '' },
    githubToken:  { type: String,  default: '' },
    isLightTheme: { type: Boolean, default: false },
    contributors: { type: Array,   default: () => [] },
    dailyCommits: { type: Array,   default: () => [] },
    totalCommits: { type: Number,  default: 0 }
  },

  data() {
    return {
      githubUser: {},
      actHovered: -1,
      bgSyncStatus: 'idle',
      bgSyncLabel: 'Synced',
      levels: [
        { key: 'newcomer', label: 'Newcomer', minCommits: 0   },
        { key: 'bronze',   label: 'Bronze',   minCommits: 5   },
        { key: 'silver',   label: 'Silver',   minCommits: 20  },
        { key: 'gold',     label: 'Gold',     minCommits: 50  },
        { key: 'platinum', label: 'Platinum', minCommits: 100 },
        { key: 'legend',   label: 'Legend',   minCommits: 200 }
      ],
      achievements: [
        { id: 'first_commit',  title: 'First Blood',     desc: 'Make your first commit',          type: 'commits', threshold: 1,   color: '#ff4500', rarity: 'common',    icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></svg>' },
        { id: 'commits_5',     title: 'Getting Started', desc: 'Reach 5 commits',                 type: 'commits', threshold: 5,   color: '#cd7f32', rarity: 'common',    icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
        { id: 'commits_20',    title: 'Silver Coder',    desc: 'Reach 20 commits',                type: 'commits', threshold: 20,  color: '#c0c0c0', rarity: 'rare',      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>' },
        { id: 'commits_50',    title: 'Gold Coder',      desc: 'Reach 50 commits',                type: 'commits', threshold: 50,  color: '#ffd700', rarity: 'rare',      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>' },
        { id: 'commits_100',   title: 'Platinum Coder',  desc: 'Reach 100 commits',               type: 'commits', threshold: 100, color: '#88d4e8', rarity: 'epic',      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>' },
        { id: 'commits_200',   title: 'Wildfire Legend', desc: 'Reach 200 commits',               type: 'commits', threshold: 200, color: '#ff4500', rarity: 'legendary', icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>' },
        { id: 'first_pr',      title: 'Open Sesame',     desc: 'Open your first pull request',    type: 'prs',     threshold: 1,   color: '#22c55e', rarity: 'common',    icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/></svg>' },
        { id: 'prs_5',         title: 'PR Machine',      desc: 'Open 5 pull requests',            type: 'prs',     threshold: 5,   color: '#4ade80', rarity: 'rare',      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/></svg>' },
        { id: 'prs_10',        title: 'PR Legend',       desc: 'Open 10 pull requests',           type: 'prs',     threshold: 10,  color: '#22c55e', rarity: 'epic',      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/></svg>' },
        { id: 'top10',         title: 'Top 10',          desc: 'Reach top 10 contributors',       type: 'rank',    threshold: 10,  color: '#3b82f6', rarity: 'common',    icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
        { id: 'top5',          title: 'Elite',           desc: 'Reach top 5 contributors',        type: 'rank',    threshold: 5,   color: '#8b5cf6', rarity: 'rare',      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
        { id: 'top3',          title: 'Podium',          desc: 'Reach top 3 contributors',        type: 'rank',    threshold: 3,   color: '#f59e0b', rarity: 'epic',      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6l4-4 4 4"/><path d="M12 2v10.3"/><path d="M2 20h20"/><path d="M6 20v-4"/><path d="M10 20v-8"/><path d="M14 20v-6"/><path d="M18 20v-10"/></svg>' },
        { id: 'rank1',         title: 'Champion',        desc: '#1 contributor of all time',      type: 'rank',    threshold: 1,   color: '#ffd700', rarity: 'legendary', icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>' }
      ],
      activeBgId: 'default',
      customBgColor: '#1a1a2e',
      customBgUrl: '',
      customBgUrlInput: '',
      urlError: false,
      bgPresets: [
        { id: 'default',  label: 'None',     value: null },
        { id: 'fire',     label: 'Fire',     value: 'linear-gradient(135deg,#200800 0%,#5c1500 50%,#8b1500 100%)' },
        { id: 'ocean',    label: 'Ocean',    value: 'linear-gradient(135deg,#001428 0%,#003060 50%,#005980 100%)' },
        { id: 'forest',   label: 'Forest',   value: 'linear-gradient(135deg,#0a150a 0%,#1a3c1a 50%,#2d5a27 100%)' },
        { id: 'galaxy',   label: 'Galaxy',   value: 'linear-gradient(135deg,#0d0221 0%,#2d1b69 50%,#11998e 100%)' },
        { id: 'gold',     label: 'Gold',     value: 'linear-gradient(135deg,#1a1000 0%,#4a3000 50%,#8a6000 100%)' },
        { id: 'neon',     label: 'Neon',     value: 'linear-gradient(135deg,#001a00 0%,#003a00 50%,#005a10 100%)' },
        { id: 'midnight', label: 'Midnight', value: 'linear-gradient(135deg,#0a0015 0%,#1a0035 50%,#2a0050 100%)' },
        { id: 'rose',     label: 'Rose',     value: 'linear-gradient(135deg,#1a0010 0%,#3d0025 50%,#6b0040 100%)' },
        { id: 'aurora',   label: 'Aurora',   value: 'linear-gradient(135deg,#000d1a 0%,#002a1f 45%,#1a0035 100%)' },
        { id: 'carbon',   label: 'Carbon',   value: 'linear-gradient(135deg,#0a0a0a 0%,#1a1a1a 50%,#111 100%)' },
        { id: 'sunset',   label: 'Sunset',   value: 'linear-gradient(135deg,#1a0500 0%,#5a1500 40%,#9b3400 75%,#c85000 100%)' }
      ]
    }
  },

  computed: {
    myStats() {
      const me = this.contributors.find(c => c.login === this.userLogin)
      if (!me) return { commits: 0, prs: 0, impactPct: 0, rank: '—' }
      const sorted = [...this.contributors].sort((a, b) => (b.commits || 0) - (a.commits || 0))
      const rank = sorted.findIndex(c => c.login === this.userLogin) + 1
      return {
        commits: me.commits || me.contributions || 0,
        prs: me.prs || 0,
        impactPct: me.impact ? parseFloat(me.impact.toFixed(1)) : 0,
        rank
      }
    },

    currentLevelIndex() {
      const c = this.myStats.commits
      let idx = 0
      this.levels.forEach((lvl, i) => { if (c >= lvl.minCommits) idx = i })
      return idx
    },

    contributionLevel() { return this.levels[this.currentLevelIndex] },
    nextLevel()         { return this.levels[this.currentLevelIndex + 1] || null },

    xpProgress() {
      if (!this.nextLevel) return 100
      const curr = this.levels[this.currentLevelIndex].minCommits
      const next = this.nextLevel.minCommits
      return Math.min(Math.max(((this.myStats.commits - curr) / (next - curr)) * 100, 0), 100)
    },

    trackFillPct() {
      return (this.currentLevelIndex + this.xpProgress / 100) / (this.levels.length - 1) * 100
    },

    levelRingColor() {
      const colors = { newcomer: '#8a8a95', bronze: '#cd7f32', silver: '#c0c0c0', gold: '#ffd700', platinum: '#88d4e8', legend: '#ff4500' }
      return colors[this.contributionLevel.key] || '#ff4500'
    },

    ringOffset() {
      return 339.3 * (1 - this.xpProgress / 100)
    },

    topContributors() {
      return [...this.contributors].sort((a, b) => (b.commits || 0) - (a.commits || 0))
    },

    heroBgStyle() {
      if (!this.activeBgId || this.activeBgId === 'default') return {}
      if (this.activeBgId === 'url' && this.customBgUrl)
        return { backgroundImage: `url('${this.customBgUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' }
      if (this.activeBgId === 'custom') return { background: this.customBgColor }
      const p = this.bgPresets.find(p => p.id === this.activeBgId)
      return p && p.value ? { background: p.value } : {}
    },

    comparisonList() {
      const top5 = this.topContributors.slice(0, 5)
      if (!top5.find(c => c.login === this.userLogin)) {
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
    },

    actBars() {
      const days = 30, W = 660, baseline = 130, maxH = 115
      const step = W / days
      const raw = this.dailyCommits
      const commits = raw.length >= days
        ? raw.slice(-days)
        : [...Array(Math.max(0, days - raw.length)).fill(0), ...raw]
      const maxVal = Math.max(...commits, 1)
      const hotIdx = commits.indexOf(Math.max(...commits))
      const now = new Date()
      return commits.map((val, i) => {
        const d = new Date(now)
        d.setDate(d.getDate() - (days - 1 - i))
        const h = val > 0 ? Math.max((val / maxVal) * maxH, 5) : 3
        const x = parseFloat((step * i + 2).toFixed(1))
        const w = parseFloat((step - 4).toFixed(1))
        return {
          x, w, y: parseFloat((baseline - h).toFixed(1)), h: parseFloat(h.toFixed(1)),
          cx: parseFloat((x + w / 2).toFixed(1)),
          commits: val, hot: i === hotIdx,
          label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          dayLabel: String(d.getDate()),
          i
        }
      })
    },

    actPeak() {
      if (!this.actBars.length) return null
      const peak = this.actBars.reduce((a, b) => b.commits > a.commits ? b : a, this.actBars[0])
      return peak.commits > 0 ? peak : null
    },

    actLabelBars() {
      return this.actBars.filter((_, i) => i % 7 === 0)
    },

    actTipStyle() {
      if (this.actHovered < 0 || !this.actBars[this.actHovered]) return { display: 'none' }
      const bar = this.actBars[this.actHovered]
      const pct = (bar.cx / 660) * 100
      return { left: `calc(${pct}% - 52px)`, top: '4px' }
    },

    activityStats() {
      const c = this.dailyCommits
      if (!c.length) return { total: 0, streak: 0, peak: 0 }
      const total = c.reduce((a, b) => a + b, 0)
      const peak = Math.max(...c)
      let streak = 0
      for (let i = c.length - 1; i >= 0; i--) { if (c[i] > 0) streak++; else break }
      return { total, streak, peak }
    }
  },

  watch: {
    userLogin(val) { if (val) { this.fetchUserInfo(); this.loadProfileBg() } }
  },

  mounted() {
    if (this.userLogin) { this.fetchUserInfo(); this.loadProfileBg() }
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
      } catch (e) { console.error('[PanelProfile] fetchUserInfo:', e) }
    },

    loadProfileBg() {
      if (!this.userLogin) return
      if (typeof localStorage === 'undefined') return
      try {
        const saved = JSON.parse(localStorage.getItem(`wildfire-bg-${this.userLogin}`) || 'null')
        if (saved) {
          this.activeBgId = saved.presetId || 'default'
          this.customBgColor = saved.customColor || '#1a1a2e'
          this.customBgUrl = saved.customUrl || ''
          this.customBgUrlInput = saved.customUrl || ''
        }
        this.bgSyncStatus = 'synced'
        this.bgSyncLabel = 'Saved'
      } catch (e) {
        this.bgSyncStatus = 'local'
        this.bgSyncLabel = 'Error'
      }
    },

    saveBg() {
      if (!this.userLogin || typeof localStorage === 'undefined') return
      const data = { login: this.userLogin, presetId: this.activeBgId, customColor: this.customBgColor, customUrl: this.customBgUrl }
      try {
        localStorage.setItem(`wildfire-bg-${this.userLogin}`, JSON.stringify(data))
        this.bgSyncStatus = 'synced'
        this.bgSyncLabel = 'Saved'
      } catch (e) {
        this.bgSyncStatus = 'local'
        this.bgSyncLabel = 'Error'
      }
    },

    setBg(preset) {
      this.activeBgId = preset.id
      this.saveBg()
    },

    applyCustomBg() {
      this.activeBgId = 'custom'
      this.saveBg()
    },

    applyUrlBg() {
      const url = this.customBgUrlInput.trim()
      if (!url) return
      this.urlError = false
      if (typeof Image !== 'undefined') {
        const img = new Image()
        img.onload = () => { this.customBgUrl = url; this.activeBgId = 'url'; this.saveBg() }
        img.onerror = () => { this.urlError = true }
        img.src = url
      } else {
        this.customBgUrl = url; this.activeBgId = 'url'; this.saveBg()
      }
    },

    resetUrl() {
      this.customBgUrl = ''
      this.customBgUrlInput = ''
      this.activeBgId = 'default'
      this.saveBg()
    },

    formatNumber(num) {
      if (!num) return '0'
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
      if (num >= 1000)    return (num / 1000).toFixed(1) + 'K'
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
        newcomer: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/></svg>`,
        bronze:   `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M8.5 13L6 22h12l-2.5-9"/></svg>`,
        silver:   `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.37 7.28L12 17l-6.18 4.18 2.37-7.28L2 9.4h7.6z"/></svg>`,
        gold:     `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H3l2 10h14l2-10h-3M6 9V5h12v4M6 9h12"/><path d="M9 5V3h6v2"/></svg>`,
        platinum: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/></svg>`,
        legend:   `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 20h20"/><path d="M4 20l2-8 4 4 2-7 2 7 4-4 2 8"/></svg>`
      }
      return icons[key] || icons.newcomer
    }
  }
}
</script>

<style scoped>
.panel-profile {
  --bg-secondary: #0f0f12;
  --bg-tertiary:  #1a1a20;
  --bg-primary:   #0a0a0c;
  --border-color: #1f1f24;
  --text-primary: #ffffff;
  --text-secondary: #e0e0e0;
  --text-muted:   #8a8a95;
  --accent:       #ff4500;
  --accent-glow:  rgba(255,69,0,0.2);
  display: flex; flex-direction: column; gap: 16px;
  animation: pp-fade 0.3s ease;
}
.panel-profile.light-theme {
  --bg-primary: #f4f4f7; --bg-secondary: #ffffff; --bg-tertiary: #e8e8ed;
  --border-color: #ddd; --text-primary: #222; --text-secondary: #444; --text-muted: #777;
  --accent-glow: rgba(255,69,0,0.1);
}
@keyframes pp-fade { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

/* ── HERO ── */
.pp-hero { position:relative; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:20px; overflow:hidden; }
.pp-hero-bg { position:absolute; inset:0; background-size:cover; background-position:center; transition:all 0.4s ease; pointer-events:none; }
.pp-hero-overlay { position:absolute; inset:0; background:linear-gradient(160deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.55) 100%); pointer-events:none; }
.pp-hero-body { position:relative; display:flex; align-items:flex-start; gap:24px; padding:28px 32px; flex-wrap:wrap; }

/* Avatar ring */
.pp-avatar-wrap { position:relative; flex-shrink:0; width:120px; height:120px; }
.pp-level-ring { position:absolute; inset:0; width:120px; height:120px; }
.pp-avatar { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:90px; height:90px; border-radius:50%; object-fit:cover; border:3px solid var(--bg-secondary); box-shadow:0 4px 20px rgba(0,0,0,0.5); transition:transform 0.2s; }
.pp-avatar:hover { transform:translate(-50%,-50%) scale(1.05); }
.pp-online-dot { position:absolute; bottom:8px; right:8px; width:14px; height:14px; border-radius:50%; background:#22c55e; border:2px solid var(--bg-secondary); box-shadow:0 0 8px rgba(34,197,94,0.6); }
.pp-ring-badge { position:absolute; bottom:-2px; left:50%; transform:translateX(-50%); display:flex; align-items:center; justify-content:center; width:22px; height:22px; border-radius:50%; border:2px solid var(--bg-secondary); }
.pp-ring-badge.newcomer { background:#2a2a35; color:#8a8a95; }
.pp-ring-badge.bronze   { background:#3a2510; color:#cd7f32; }
.pp-ring-badge.silver   { background:#252530; color:#c0c0c0; }
.pp-ring-badge.gold     { background:#2a2000; color:#ffd700; box-shadow:0 0 10px rgba(255,215,0,0.4); }
.pp-ring-badge.platinum { background:#102030; color:#88d4e8; box-shadow:0 0 10px rgba(136,212,232,0.4); }
.pp-ring-badge.legend   { background:#2a0800; color:#ff4500; box-shadow:0 0 12px rgba(255,69,0,0.5); }

/* Hero info */
.pp-hero-info { flex:1; min-width:180px; }
.pp-name-row { display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:4px; }
.pp-name { margin:0; font-size:22px; font-weight:800; color:var(--text-primary); text-shadow:0 2px 12px rgba(0,0,0,0.4); }
.pp-lvl-chip { display:inline-flex; align-items:center; gap:5px; font-size:10px; font-weight:700; padding:3px 9px; border-radius:20px; letter-spacing:0.4px; text-transform:uppercase; }
.pp-lvl-chip.newcomer { background:rgba(138,138,149,0.15); color:#8a8a95; border:1px solid rgba(138,138,149,0.25); }
.pp-lvl-chip.bronze   { background:rgba(205,127,50,0.15);  color:#cd7f32; border:1px solid rgba(205,127,50,0.3); }
.pp-lvl-chip.silver   { background:rgba(192,192,192,0.15); color:#c0c0c0; border:1px solid rgba(192,192,192,0.3); }
.pp-lvl-chip.gold     { background:rgba(255,215,0,0.12);   color:#ffd700; border:1px solid rgba(255,215,0,0.35); box-shadow:0 0 12px rgba(255,215,0,0.15); }
.pp-lvl-chip.platinum { background:rgba(136,212,232,0.12); color:#88d4e8; border:1px solid rgba(136,212,232,0.3); box-shadow:0 0 12px rgba(136,212,232,0.15); }
.pp-lvl-chip.legend   { background:rgba(255,69,0,0.15);   color:#ff6030; border:1px solid rgba(255,69,0,0.4);   box-shadow:0 0 14px rgba(255,69,0,0.2); }
.pp-login { font-size:13px; color:var(--text-muted); display:block; margin-bottom:6px; }
.pp-bio { font-size:12px; color:var(--text-secondary); margin:0 0 8px; line-height:1.5; opacity:0.85; }
.pp-meta { display:flex; align-items:center; gap:12px; flex-wrap:wrap; font-size:11px; color:var(--text-muted); margin-bottom:12px; }
.pp-meta span { display:flex; align-items:center; gap:4px; }
.pp-gh-link { color:var(--accent); text-decoration:none; display:flex; align-items:center; gap:4px; }
.pp-gh-stats { display:inline-flex; align-items:stretch; background:rgba(0,0,0,0.25); border:1px solid rgba(255,255,255,0.1); border-radius:10px; overflow:hidden; backdrop-filter:blur(4px); }
.pp-gs-item { display:flex; flex-direction:column; align-items:center; padding:8px 14px; gap:1px; }
.pp-gs-val { font-size:15px; font-weight:700; color:var(--text-primary); }
.pp-gs-lbl { font-size:9px; color:rgba(255,255,255,0.45); text-transform:uppercase; letter-spacing:0.4px; }
.pp-gs-sep { width:1px; background:rgba(255,255,255,0.08); align-self:stretch; }
.pp-rank-chip { display:flex; flex-direction:column; align-items:center; justify-content:center; background:rgba(255,69,0,0.1); border:1px solid rgba(255,69,0,0.3); border-radius:14px; padding:14px 20px; gap:2px; flex-shrink:0; margin-left:auto; }
.pp-rank-num { font-size:28px; font-weight:900; color:var(--accent); line-height:1; }
.pp-rank-lbl { font-size:9px; color:var(--text-muted); letter-spacing:0.8px; text-transform:uppercase; }

/* ── KPI STRIP ── */
.pp-kpi-strip { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
.pp-kpi { background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:14px; padding:16px; display:flex; flex-direction:column; gap:6px; position:relative; overflow:hidden; transition:transform 0.2s; }
.pp-kpi:hover { transform:translateY(-2px); }
.pp-kpi::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; }
.pp-kpi.commits::before { background:linear-gradient(90deg,#ff4500,#ff6030); }
.pp-kpi.prs::before     { background:linear-gradient(90deg,#22c55e,#4ade80); }
.pp-kpi.impact::before  { background:linear-gradient(90deg,#3b82f6,#60a5fa); }
.pp-kpi.level::before   { background:linear-gradient(90deg,#ffd700,#ffaa00); }
.pp-kpi-top { display:flex; align-items:center; gap:7px; color:var(--text-muted); }
.pp-kpi-lbl { font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.4px; }
.pp-kpi-val { font-size:28px; font-weight:800; color:var(--text-primary); line-height:1; }
.pp-kpi-val-sm { font-size:18px; }
.pp-kpi-bar-wrap { width:100%; height:3px; background:var(--bg-tertiary); border-radius:2px; overflow:hidden; margin-top:auto; }
.pp-kpi-bar { height:100%; border-radius:2px; transition:width 0.9s cubic-bezier(0.4,0,0.2,1); }
.pp-kpi-bar.commits { background:linear-gradient(90deg,#ff4500,#ff6030); }
.pp-kpi-bar.impact  { background:linear-gradient(90deg,#3b82f6,#60a5fa); }
.pp-kpi-bar.level.newcomer { background:#8a8a95; }
.pp-kpi-bar.level.bronze   { background:#cd7f32; }
.pp-kpi-bar.level.silver   { background:#c0c0c0; }
.pp-kpi-bar.level.gold     { background:linear-gradient(90deg,#ffd700,#ffaa00); }
.pp-kpi-bar.level.platinum { background:linear-gradient(90deg,#88d4e8,#5ab4d0); }
.pp-kpi-bar.level.legend   { background:linear-gradient(90deg,#ff4500,#ff6030); }

/* ── SHARED CARD ── */
.pp-card { background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:16px; padding:22px 24px; }
.pp-card-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
.pp-card-title { display:flex; align-items:center; gap:8px; font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.6px; }
.pp-card-badge { font-size:11px; background:var(--bg-tertiary); color:var(--text-muted); padding:3px 10px; border-radius:10px; border:1px solid var(--border-color); }
.pp-card-badge.accent { background:rgba(255,69,0,0.1); color:var(--accent); border-color:rgba(255,69,0,0.25); }

/* ── PROGRESSION TRACK ── */
.pp-track { position:relative; height:90px; margin:0 28px 24px; }
.pp-track-rail { position:absolute; top:28px; left:0; right:0; height:3px; background:var(--bg-tertiary); border-radius:2px; }
.pp-track-progress { position:absolute; top:28px; left:0; height:3px; background:linear-gradient(90deg,#ff4500,#ff6030); border-radius:2px; transition:width 1s cubic-bezier(0.4,0,0.2,1); }
.pp-track-node { position:absolute; top:0; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; }
.pp-node-you { font-size:8px; font-weight:800; background:var(--accent); color:#fff; padding:2px 5px; border-radius:4px; margin-bottom:3px; letter-spacing:0.3px; }
.pp-node-dot { width:28px; height:28px; border-radius:50%; background:var(--bg-tertiary); border:2px solid var(--border-color); display:flex; align-items:center; justify-content:center; color:var(--text-muted); transition:all 0.3s; z-index:1; position:relative; }
.pp-track-node.achieved .pp-node-dot { border-color:rgba(255,69,0,0.5); color:var(--accent); background:rgba(255,69,0,0.08); }
.pp-track-node.gold.achieved .pp-node-dot     { border-color:rgba(255,215,0,0.6); color:#ffd700; background:rgba(255,215,0,0.1); }
.pp-track-node.platinum.achieved .pp-node-dot { border-color:rgba(136,212,232,0.5); color:#88d4e8; background:rgba(136,212,232,0.08); }
.pp-track-node.current .pp-node-dot { background:var(--accent); border-color:var(--accent); color:#fff; box-shadow:0 0 14px rgba(255,69,0,0.5); }
.pp-track-node.gold.current .pp-node-dot     { background:#ffd700; border-color:#ffd700; color:#000; box-shadow:0 0 14px rgba(255,215,0,0.6); }
.pp-track-node.platinum.current .pp-node-dot { background:#88d4e8; border-color:#88d4e8; color:#000; }
.pp-node-name { font-size:9.5px; color:var(--text-muted); margin-top:5px; text-align:center; white-space:nowrap; }
.pp-track-node.achieved .pp-node-name { color:var(--text-secondary); }
.pp-track-node.current .pp-node-name { color:var(--accent); font-weight:700; }
.pp-node-req { font-size:8.5px; color:var(--text-muted); opacity:0.6; }
.pp-xp-row { display:flex; align-items:center; gap:10px; }
.pp-xp-label { font-size:11px; color:var(--text-muted); white-space:nowrap; }
.pp-xp-label.right { }
.pp-xp-label.legend { color:#ff4500; font-weight:700; }
.pp-xp-track { flex:1; height:8px; background:var(--bg-tertiary); border-radius:4px; overflow:hidden; }
.pp-xp-fill { height:100%; border-radius:4px; transition:width 0.9s cubic-bezier(0.4,0,0.2,1); }
.pp-xp-fill.newcomer { background:#8a8a95; }
.pp-xp-fill.bronze   { background:linear-gradient(90deg,#8b4e10,#cd7f32); }
.pp-xp-fill.silver   { background:linear-gradient(90deg,#909090,#d4d4d4); }
.pp-xp-fill.gold     { background:linear-gradient(90deg,#b8860b,#ffd700); box-shadow:0 0 8px rgba(255,215,0,0.3); }
.pp-xp-fill.platinum { background:linear-gradient(90deg,#5ab4d0,#88d4e8); box-shadow:0 0 8px rgba(136,212,232,0.3); }
.pp-xp-fill.legend   { background:linear-gradient(90deg,#cc1500,#ff4500); box-shadow:0 0 10px rgba(255,69,0,0.4); }
.pp-xp-pct { font-size:11px; font-weight:700; color:var(--accent); min-width:32px; text-align:right; }

/* ── ACTIVITY CHART ── */
.pp-act-meta { display:flex; align-items:center; gap:8px; font-size:11px; color:var(--text-muted); }
.pp-act-meta strong { color:var(--text-primary); font-weight:700; }
.pp-act-sep { opacity:0.3; }
.pp-act-wrap { position:relative; }
.pp-act-tip { position:absolute; background:rgba(10,10,15,0.9); border:1px solid var(--border-color); border-radius:8px; padding:7px 11px; pointer-events:none; z-index:10; backdrop-filter:blur(6px); min-width:100px; text-align:center; }
.pp-tip-val { font-size:15px; font-weight:700; color:var(--text-primary); }
.pp-tip-val span { font-size:11px; font-weight:400; color:var(--text-muted); }
.pp-tip-date { font-size:10px; color:var(--text-muted); margin-top:2px; }

/* ── COMPARISON ── */
.pp-cmp-list { display:flex; flex-direction:column; }
.pp-cmp-row { display:flex; align-items:center; gap:10px; padding:9px 0; border-bottom:1px solid var(--border-color); }
.pp-cmp-row:last-child { border-bottom:none; }
.pp-cmp-row.is-me { background:rgba(255,69,0,0.04); border-radius:8px; padding-inline:8px; margin-inline:-8px; }
.pp-cmp-rank { width:26px; font-size:11px; font-weight:700; text-align:right; color:var(--text-muted); flex-shrink:0; }
.pp-cmp-rank.gold   { color:#ffd700; }
.pp-cmp-rank.silver { color:#c0c0c0; }
.pp-cmp-rank.bronze { color:#cd7f32; }
.pp-cmp-avatar { width:26px; height:26px; border-radius:50%; border:1px solid var(--border-color); flex-shrink:0; }
.pp-cmp-name { width:90px; flex-shrink:0; font-size:12px; font-weight:600; color:var(--text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.pp-you-tag { display:inline-block; font-size:8px; background:var(--accent); color:#fff; padding:1px 4px; border-radius:4px; margin-left:4px; vertical-align:middle; font-weight:700; }
.pp-cmp-bar-wrap { flex:1; height:6px; background:var(--bg-tertiary); border-radius:3px; overflow:hidden; }
.pp-cmp-bar { height:100%; border-radius:3px; background:rgba(255,255,255,0.15); transition:width 0.6s ease; }
.pp-cmp-bar.me { background:linear-gradient(90deg,#ff4500,#ff6030); box-shadow:0 0 6px rgba(255,69,0,0.3); }
.pp-cmp-count { font-size:11px; font-weight:600; color:var(--text-muted); width:38px; text-align:right; flex-shrink:0; }

/* ── ACHIEVEMENTS ── */
.pp-ach-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(148px,1fr)); gap:10px; }
.pp-ach-item { display:flex; align-items:center; gap:10px; padding:10px 12px; background:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:12px; cursor:help; transition:all 0.2s; }
.pp-ach-item:hover { transform:translateY(-1px); }
.pp-ach-item.unlocked { border-color:rgba(255,255,255,0.08); }
.pp-ach-item.unlocked.legendary { box-shadow:0 0 12px rgba(255,215,0,0.12); }
.pp-ach-item.unlocked.epic      { box-shadow:0 0 10px rgba(139,92,246,0.12); }
.pp-ach-icon { width:38px; height:38px; flex-shrink:0; border-radius:10px; border:1px solid var(--border-color); background:var(--bg-secondary); display:flex; align-items:center; justify-content:center; position:relative; }
.pp-ach-lock { position:absolute; top:-4px; right:-4px; width:16px; height:16px; background:var(--bg-tertiary); border-radius:50%; display:flex; align-items:center; justify-content:center; color:var(--text-muted); border:1px solid var(--border-color); }
.pp-ach-info { display:flex; flex-direction:column; gap:2px; min-width:0; }
.pp-ach-name { font-size:12px; font-weight:600; color:var(--text-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.pp-ach-item.unlocked .pp-ach-name { color:var(--text-primary); }
.pp-ach-rarity { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.3px; }
.pp-ach-rarity.common    { color:#8a8a95; }
.pp-ach-rarity.rare      { color:#3b82f6; }
.pp-ach-rarity.epic      { color:#8b5cf6; }
.pp-ach-rarity.legendary { color:#ffd700; }

/* ── BACKGROUND PICKER ── */
.pp-bg-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:10px; margin-bottom:20px; }
.pp-bg-btn { background:none; border:none; padding:0; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:4px; }
.pp-bg-preview { width:100%; aspect-ratio:3/2; border-radius:10px; border:2px solid var(--border-color); display:flex; align-items:center; justify-content:center; transition:all 0.2s; overflow:hidden; background:var(--bg-tertiary); }
.pp-bg-btn:hover .pp-bg-preview { border-color:rgba(255,69,0,0.4); transform:scale(1.04); }
.pp-bg-btn.active .pp-bg-preview { border-color:var(--accent); box-shadow:0 0 14px rgba(255,69,0,0.3); }
.pp-bg-lbl { font-size:10px; color:var(--text-muted); }
.pp-bg-btn.active .pp-bg-lbl { color:var(--accent); }
.pp-bg-custom { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.pp-bg-custom-col { display:flex; flex-direction:column; gap:8px; }
.pp-bg-custom-label { display:flex; align-items:center; gap:6px; font-size:11px; color:var(--text-muted); }
.pp-bg-custom-label.error { color:#ef4444; }
.pp-bg-custom-row { display:flex; align-items:center; gap:8px; }
.pp-color-input { width:42px; height:34px; border-radius:8px; border:1px solid var(--border-color); cursor:pointer; padding:2px; background:var(--bg-tertiary); }
.pp-url-input { flex:1; padding:7px 10px; background:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:8px; font-size:12px; color:var(--text-primary); outline:none; }
.pp-url-input:focus { border-color:rgba(255,69,0,0.4); }
.pp-url-input.error { border-color:#ef4444; }
.pp-bg-apply { padding:6px 13px; background:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:8px; font-size:12px; cursor:pointer; color:var(--text-muted); transition:all 0.2s; white-space:nowrap; }
.pp-bg-apply:hover { border-color:rgba(255,69,0,0.4); color:var(--accent); }
.pp-bg-apply.active { background:rgba(255,69,0,0.15); border-color:rgba(255,69,0,0.5); color:var(--accent); }
.pp-bg-apply.danger { border-color:rgba(239,68,68,0.3); color:#ef4444; padding:6px 8px; }

/* sync pill */
.pp-sync-pill { display:flex; align-items:center; gap:6px; font-size:10px; color:var(--text-muted); padding:3px 9px; border-radius:10px; background:var(--bg-tertiary); border:1px solid var(--border-color); }
.pp-sync-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; background:var(--text-muted); }
.pp-sync-pill.synced .pp-sync-dot { background:#22c55e; box-shadow:0 0 6px rgba(34,197,94,0.5); }
.pp-sync-pill.saving .pp-sync-dot { background:#f59e0b; animation:pp-pulse 1s infinite; }
.pp-sync-pill.local  .pp-sync-dot { background:#f59e0b; }
@keyframes pp-pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }

/* ── SETTINGS ── */
.pp-settings { border:1px solid var(--border-color); border-radius:12px; overflow:hidden; }
.pp-setting-row { display:flex; align-items:center; gap:16px; padding:13px 18px; border-bottom:1px solid var(--border-color); background:transparent; transition:background 0.15s; }
.pp-setting-row:last-child { border-bottom:none; }
.pp-setting-row:hover { background:rgba(255,255,255,0.02); }
.pp-setting-row.danger:hover { background:rgba(239,68,68,0.03); }
.pp-setting-info { flex:1; }
.pp-setting-name { display:block; font-size:13px; font-weight:600; color:var(--text-primary); margin-bottom:2px; }
.pp-setting-desc { display:block; font-size:11px; color:var(--text-muted); }
.pp-toggle { width:46px; height:26px; border-radius:13px; background:var(--bg-tertiary); border:1px solid var(--border-color); cursor:pointer; position:relative; transition:background 0.3s,border-color 0.3s; flex-shrink:0; }
.pp-toggle.on { background:var(--accent); border-color:var(--accent); }
.pp-toggle-thumb { position:absolute; top:3px; left:3px; width:18px; height:18px; border-radius:50%; background:#fff; display:flex; align-items:center; justify-content:center; transition:left 0.25s; box-shadow:0 1px 4px rgba(0,0,0,0.3); }
.pp-toggle.on .pp-toggle-thumb { left:23px; }
.pp-btn { display:inline-flex; align-items:center; gap:6px; padding:7px 16px; background:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:8px; font-size:12px; cursor:pointer; color:var(--text-muted); text-decoration:none; transition:all 0.2s; }
.pp-btn:hover { border-color:rgba(255,69,0,0.4); color:var(--accent); }
.pp-btn.danger { border-color:rgba(239,68,68,0.3); color:#ef4444; }
.pp-btn.danger:hover { background:rgba(239,68,68,0.08); border-color:#ef4444; }

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .pp-bg-grid { grid-template-columns:repeat(4,1fr); }
}
@media (max-width: 640px) {
  .pp-hero-body { padding:20px; gap:16px; }
  .pp-kpi-strip { grid-template-columns:repeat(2,1fr); }
  .pp-bg-grid { grid-template-columns:repeat(3,1fr); }
  .pp-bg-custom { grid-template-columns:1fr; }
  .pp-ach-grid { grid-template-columns:repeat(2,1fr); }
  .pp-rank-chip { display:none; }
  .pp-track { margin:0 16px 24px; }
}
@media (max-width: 420px) {
  .pp-kpi-strip { grid-template-columns:1fr 1fr; }
  .pp-bg-grid { grid-template-columns:repeat(3,1fr); }
}
</style>
