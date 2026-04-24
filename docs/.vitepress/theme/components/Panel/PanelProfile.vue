<!-- docs\.vitepress\theme\components\Panel\PanelProfile.vue -->
<template>
  <div class="panel-profile" :class="{ 'light-theme': isLightTheme }">

    <!-- ── HERO ── -->
    <div class="pp-hero">
      <!-- Full background banner -->
      <div class="pp-banner">
        <div class="pp-banner-bg" :style="bannerBgStyle"></div>
        <div class="pp-banner-vignette"></div>
        <div class="pp-banner-rank" v-if="myStats.rank !== '—'">
          <span class="pp-banner-rank-num">#{{ myStats.rank }}</span>
          <span class="pp-banner-rank-lbl">RANK</span>
        </div>
      </div>

      <!-- Profile row: avatar overlaps banner -->
      <div class="pp-profile-row">
        <div class="pp-avatar-wrap">
          <svg class="pp-level-ring" viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="54" :stroke="isLightTheme ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.07)'" stroke-width="7"/>
            <circle cx="60" cy="60" r="54" :style="{ stroke: levelRingColor, transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1), stroke 0.5s' }" stroke-width="7"
              stroke-linecap="round" :stroke-dasharray="339.3" :stroke-dashoffset="ringOffset"
              transform="rotate(-90 60 60)"
              filter="url(#pp-ring-glow)"/>
            <defs>
              <filter id="pp-ring-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="3.5" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
          </svg>
          <img :src="userAvatar" :alt="userLogin" class="pp-avatar">
          <div class="pp-online-dot"></div>
          <img :src="'/medals/' + contributionLevel.key + '.svg'" class="pp-level-pin" :alt="contributionLevel.label" :title="contributionLevel.label">
        </div>

        <div class="pp-profile-info">
          <div class="pp-name-row">
            <h2 class="pp-name">{{ githubUser.name || userLogin }}</h2>
            <span class="pp-lvl-chip" :class="contributionLevel.key">
              <span v-html="getLevelIcon(contributionLevel.key)"></span>
              {{ contributionLevel.label }}
            </span>
          </div>
          <span class="pp-login">@{{ userLogin }}</span>
          <p class="pp-bio" v-if="githubUser.bio">{{ githubUser.bio }}</p>
          <div class="pp-meta-row">
            <span class="pp-meta-tag" v-if="githubUser.location">
              <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {{ githubUser.location }}
            </span>
            <span class="pp-meta-tag" v-if="githubUser.company">
              <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
              {{ githubUser.company }}
            </span>
            <a v-if="githubUser.blog" :href="githubUser.blog.startsWith('http') ? githubUser.blog : 'https://' + githubUser.blog" target="_blank" class="pp-meta-tag link">
              <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              Website
            </a>
            <a v-if="githubUser.twitter_username" :href="'https://twitter.com/' + githubUser.twitter_username" target="_blank" class="pp-meta-tag link">
              <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              @{{ githubUser.twitter_username }}
            </a>
            <span class="pp-meta-tag" v-if="githubUser.created_at">
              <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Joined {{ new Date(githubUser.created_at).getFullYear() }}
            </span>
            <a :href="`https://github.com/${userLogin}`" target="_blank" class="pp-meta-tag link">
              <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub
            </a>
          </div>
        </div>

        <div class="pp-gh-pill-row">
          <div class="pp-gh-pill">
            <span class="pp-gh-pill-val">{{ formatNumber(githubUser.public_repos || 0) }}</span>
            <span class="pp-gh-pill-lbl">Repos</span>
          </div>
          <div class="pp-gh-pill">
            <span class="pp-gh-pill-val">{{ formatNumber(githubUser.followers || 0) }}</span>
            <span class="pp-gh-pill-lbl">Followers</span>
          </div>
          <div class="pp-gh-pill">
            <span class="pp-gh-pill-val">{{ formatNumber(githubUser.following || 0) }}</span>
            <span class="pp-gh-pill-lbl">Following</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── STAT TILES ── -->
    <div class="pp-stat-tiles">
      <div class="pp-tile commits">
        <div class="pp-tile-accent"></div>
        <div class="pp-tile-icon">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></svg>
        </div>
        <div class="pp-tile-body">
          <span class="pp-tile-val">{{ formatNumber(myStats.commits) }}</span>
          <span class="pp-tile-lbl">Commits</span>
          <div class="pp-tile-bar"><div class="pp-tile-fill commits" :style="{ width: Math.min(myStats.impactPct * 2, 100) + '%' }"></div></div>
        </div>
      </div>
      <div class="pp-tile prs">
        <div class="pp-tile-accent"></div>
        <div class="pp-tile-icon">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/></svg>
        </div>
        <div class="pp-tile-body">
          <span class="pp-tile-val">{{ formatNumber(myStats.prs) }}</span>
          <span class="pp-tile-lbl">Pull Requests</span>
        </div>
      </div>
      <div class="pp-tile impact">
        <div class="pp-tile-accent"></div>
        <div class="pp-tile-icon">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        </div>
        <div class="pp-tile-body">
          <span class="pp-tile-val">{{ myStats.impactPct }}<span class="pp-tile-unit">%</span></span>
          <span class="pp-tile-lbl">Repo Impact</span>
          <div class="pp-tile-bar"><div class="pp-tile-fill impact" :style="{ width: Math.min(myStats.impactPct, 100) + '%' }"></div></div>
        </div>
      </div>
      <div class="pp-tile level">
        <div class="pp-tile-accent"></div>
        <div class="pp-tile-icon">
          <img :src="'/medals/' + contributionLevel.key + '.svg'" width="26" height="26" :alt="contributionLevel.label">
        </div>
        <div class="pp-tile-body">
          <span class="pp-tile-val pp-tile-val-sm">{{ contributionLevel.label }}</span>
          <span class="pp-tile-lbl">Level — {{ Math.round(xpProgress) }}% XP</span>
          <div class="pp-tile-bar"><div class="pp-tile-fill level" :class="contributionLevel.key" :style="{ width: xpProgress + '%' }"></div></div>
        </div>
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

      <!-- Milestone segments -->
      <div class="pp-milestones">
        <div v-for="(lvl, i) in levels" :key="lvl.key"
          class="pp-ms"
          :class="[lvl.key, { earned: i < currentLevelIndex, current: i === currentLevelIndex, upcoming: i > currentLevelIndex }]">
          <div class="pp-ms-fill"></div>
          <div class="pp-ms-inner">
            <img :src="'/medals/' + lvl.key + '.svg'" class="pp-ms-medal" :alt="lvl.label">
            <span class="pp-ms-name">{{ lvl.label }}</span>
            <span class="pp-ms-req">{{ lvl.minCommits === 0 ? 'Start' : lvl.minCommits + '+' }}</span>
          </div>
          <div class="pp-ms-you" v-if="i === currentLevelIndex">YOU ARE HERE</div>
        </div>
      </div>

      <!-- XP Progress bar -->
      <div class="pp-xp-block" v-if="nextLevel">
        <div class="pp-xp-endpoints">
          <div class="pp-xp-ep">
            <img :src="'/medals/' + contributionLevel.key + '.svg'" width="16" height="16">
            <div>
              <span class="pp-xp-ep-name">{{ contributionLevel.label }}</span>
              <span class="pp-xp-ep-val">{{ myStats.commits }} commits</span>
            </div>
          </div>
          <div class="pp-xp-ep right">
            <div class="right">
              <span class="pp-xp-ep-name">{{ nextLevel.label }}</span>
              <span class="pp-xp-ep-val">{{ nextLevel.minCommits }} commits</span>
            </div>
            <img :src="'/medals/' + nextLevel.key + '.svg'" width="16" height="16">
          </div>
        </div>
        <div class="pp-xp-bar-wrap">
          <div class="pp-xp-bar-bg"></div>
          <div class="pp-xp-bar-fill" :class="contributionLevel.key" :style="{ width: xpProgress + '%' }"></div>
          <div class="pp-xp-bar-glow" :class="contributionLevel.key" :style="{ width: xpProgress + '%' }"></div>
          <div class="pp-xp-thumb" :style="{ left: xpProgress + '%' }">
            <span class="pp-xp-pct-label">{{ Math.round(xpProgress) }}%</span>
          </div>
        </div>
        <div class="pp-xp-need">
          <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          {{ Math.max(nextLevel.minCommits - myStats.commits, 0) }} more commits to reach {{ nextLevel.label }}
        </div>
      </div>
      <div class="pp-xp-block" v-else>
        <div class="pp-xp-max">
          <img :src="'/medals/legend.svg'" width="22" height="22">
          <span>★ MAX LEVEL — LEGEND</span>
        </div>
        <div class="pp-xp-bar-wrap">
          <div class="pp-xp-bar-bg"></div>
          <div class="pp-xp-bar-fill legend" style="width:100%"></div>
          <div class="pp-xp-bar-glow legend" style="width:100%"></div>
        </div>
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
      <div class="pp-act-wrap">
        <svg viewBox="0 0 660 150" preserveAspectRatio="xMidYMid meet" width="100%" height="150" style="display:block;overflow:visible;cursor:crosshair" @mousemove="onActMouseMove($event)" @mouseleave="actHovered = -1">
          <defs>
            <linearGradient id="pp-bar-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style="stop-color:var(--accent-alt)" stop-opacity="1"/>
              <stop offset="100%" style="stop-color:var(--accent)" stop-opacity="0.55"/>
            </linearGradient>
            <linearGradient id="pp-bar-hot" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style="stop-color:var(--accent-alt2)" stop-opacity="1"/>
              <stop offset="100%" style="stop-color:var(--accent)" stop-opacity="0.7"/>
            </linearGradient>
            <filter id="pp-bar-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <line v-for="gy in [30,60,90,120]" :key="'g'+gy" x1="4" :y1="gy" x2="656" :y2="gy" :stroke="isLightTheme ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.04)'" stroke-width="1" pointer-events="none"/>
          <g v-for="(bar, i) in actBars" :key="'b'+i" pointer-events="none">
            <rect :x="bar.x" :y="bar.y" :width="bar.w" :height="bar.h"
              :fill="bar.hot ? 'url(#pp-bar-hot)' : 'url(#pp-bar-grad)'"
              rx="2"
              :fill-opacity="bar.commits === 0 ? 0.12 : (actHovered >= 0 && actHovered !== i ? 0.35 : 1)"
              :filter="actHovered === i && bar.commits > 0 ? 'url(#pp-bar-glow)' : ''"
            />
          </g>
          <circle v-if="actPeak" :cx="actPeak.cx" :cy="actPeak.y - 5" r="4.5" style="fill:var(--accent-alt2)" filter="url(#pp-bar-glow)" opacity="0.95" pointer-events="none"/>
          <text v-for="bar in actLabelBars" :key="'al'+bar.i" :x="bar.cx" y="147" text-anchor="middle" font-size="8.5" :fill="isLightTheme ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.28)'" font-family="system-ui,sans-serif" pointer-events="none">{{ bar.dayLabel }}</text>
          <rect x="0" y="0" width="660" height="150" fill="transparent"/>
        </svg>
        <div v-if="actHovered >= 0 && actBars[actHovered]" class="pp-act-tip" :style="actTipStyle">
          <div class="pp-tip-val">{{ actBars[actHovered].commits }}<span>{{ actBars[actHovered].commits !== 1 ? ' commits' : ' commit' }}</span></div>
          <div class="pp-tip-date">{{ actBars[actHovered].label }}</div>
        </div>
      </div>
    </div>

    <!-- ── RECENT ACTIVITY ── -->
    <div class="pp-card">
      <div class="pp-card-header">
        <div class="pp-card-title">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          RECENT ACTIVITY
        </div>
        <span class="pp-card-badge" v-if="loadingActivity">Loading…</span>
      </div>

      <div v-if="loadingActivity" class="pp-act-loading">
        <div class="pp-act-spinner"></div>
        <span>Analysing your commits…</span>
      </div>
      <template v-else>
        <!-- Favourite Languages -->
        <div class="pp-act-section-title" v-if="activityLangs.length">
          <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          FAVOURITE LANGUAGES
        </div>
        <div class="pp-lang-list" v-if="activityLangs.length">
          <div class="pp-lang-row" v-for="lang in activityLangs" :key="lang.ext">
            <span class="pp-lang-dot" :style="{ background: lang.color }"></span>
            <span class="pp-lang-name">{{ lang.name }}</span>
            <div class="pp-lang-track">
              <div class="pp-lang-fill" :style="{ width: lang.pct + '%', background: lang.color }"></div>
            </div>
            <span class="pp-lang-pct">{{ lang.pct }}%</span>
          </div>
        </div>

        <!-- Most Edited Files -->
        <div class="pp-act-section-title" :style="activityFiles.length && activityLangs.length ? 'margin-top:18px' : ''" v-if="activityFiles.length">
          <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
          MOST EDITED FILES
        </div>
        <div class="pp-file-list" v-if="activityFiles.length">
          <div class="pp-file-row" v-for="(file, idx) in activityFiles" :key="file.path">
          <span class="pp-file-rank" :class="['r' + (idx+1)]">
            <!-- Locul 1 - Coroană -->
            <svg v-if="idx === 0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>
            
            <!-- Locul 2 - Medalie -->
            <svg v-else-if="idx === 1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
            
            <!-- Locul 3 - Award -->
            <svg v-else-if="idx === 2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
            
            <!-- Restul -->
            <span v-else>#{{ idx+1 }}</span>
          </span>
            <span class="pp-file-icon"><svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg></span>
            <span class="pp-file-name" :title="file.path">{{ file.name }}</span>
            <span class="pp-file-count">{{ file.count }}×</span>
          </div>
        </div>

        <!-- Wiki Pages Updated -->
        <div class="pp-act-section-title" style="margin-top:18px" v-if="wikiPages.length">
          <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          WIKI PAGES UPDATED
        </div>
        <div class="pp-wiki-list" v-if="wikiPages.length">
          <div class="pp-wiki-row" v-for="(file, idx) in wikiPages" :key="file.path">
            <span class="pp-wiki-dot"></span>
            <span class="pp-wiki-name" :title="file.path">{{ file.name.replace('.md','') }}</span>
            <span class="pp-wiki-path">{{ file.path.split('/').slice(0,-1).join('/') || 'root' }}</span>
            <span class="pp-wiki-count">{{ file.count }}×</span>
          </div>
        </div>

        <div class="pp-act-empty" v-if="!activityLangs.length && !activityFiles.length">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          No commit activity found yet
        </div>
      </template>
    </div>

    <!-- ── RECENT COMMITS ── -->
    <div class="pp-card" v-if="recentCommits.length">
      <div class="pp-card-header">
        <div class="pp-card-title">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></svg>
          RECENT COMMITS
        </div>
        <a :href="`https://github.com/${repoOwner}/${repoName}/commits?author=${userLogin}`" target="_blank" class="pp-card-badge accent">View all →</a>
      </div>
      <div class="pp-rc-list">
        <a v-for="c in recentCommits" :key="c.sha" :href="c.url" target="_blank" class="pp-rc-row">
          <code class="pp-rc-sha">{{ c.sha }}</code>
          <span class="pp-rc-msg">{{ c.message }}</span>
          <span class="pp-rc-date">{{ new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}</span>
        </a>
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
        <div v-for="(c, i) in comparisonList" :key="c.login" class="pp-cmp-row" :class="{ 'is-me': c.login === userLogin }">
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
        <div v-for="ach in achievementsList" :key="ach.id" class="pp-ach-item"
          :class="[ach.rarity, { unlocked: ach.unlocked }]"
          :title="ach.unlocked ? ach.title + ' — ' + ach.desc : 'Locked: ' + ach.desc">
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

    <!-- ── PROFILE SETTINGS (bg + settings merged) ── -->
    <div class="pp-card pp-settings-card">

      <!-- Section: Background -->
      <div class="pp-settings-section">
        <div class="pp-section-head">
          <div class="pp-card-title">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            PROFILE BACKGROUND
          </div>
          <div class="pp-sync-pill" :class="readmeBgStatus === 'found' ? 'synced' : readmeBgStatus === 'loading' ? 'saving' : 'local'">
            <span class="pp-sync-dot"></span>
            {{ readmeBgLabel }}
          </div>
        </div>

        <!-- README bg info banner -->
        <div class="pp-readme-bg-info">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
          <span>
            Add an image to your
            <a :href="`https://github.com/${userLogin}/${userLogin}/edit/main/README.md`" target="_blank" class="pp-readme-link">GitHub profile README</a>
            (e.g. <code>![bg](https://i.imgur.com/abc.jpg)</code>) and it will appear here automatically.
          </span>
        </div>

        <!-- Live preview strip -->
        <div class="pp-bg-live-preview" :style="bannerBgStyle">
          <div class="pp-bg-live-overlay">
            <span v-if="profileBgUrl">README image active</span>
            <span v-else-if="activeBgId === 'default'">No background — gradient fallback</span>
            <span v-else>{{ bgPresets.find(p => p.id === activeBgId)?.label }} gradient</span>
          </div>
        </div>

        <!-- Fallback preset grid (only active when no README image found) -->
        <div class="pp-bg-fallback-label" v-if="!profileBgUrl">
          <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"/></svg>
          Fallback gradient (used when no README image found)
        </div>
        <div class="pp-bg-grid" :class="{ 'pp-bg-grid-dim': !!profileBgUrl }">
          <button v-for="preset in bgPresets" :key="preset.id" class="pp-bg-btn"
            :class="{ active: activeBgId === preset.id && !profileBgUrl }" :title="preset.label" @click="setBg(preset)">
            <div class="pp-bg-swatch" :style="preset.value ? { background: preset.value } : {}">
              <svg v-if="preset.id === 'default'" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              <svg v-else-if="activeBgId === preset.id && !profileBgUrl" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <span class="pp-bg-label">{{ preset.label }}</span>
          </button>
        </div>
      </div>

      <div class="pp-divider"></div>

      <!-- Section: Settings -->
      <div class="pp-settings-section">
        <div class="pp-section-head" style="margin-bottom:14px">
          <div class="pp-card-title">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            GENERAL SETTINGS
          </div>
        </div>
        <div class="pp-settings-list">
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
          <div class="pp-setting-row pp-accent-row">
            <div class="pp-setting-info">
              <span class="pp-setting-name">Accent Color</span>
              <span class="pp-setting-desc">Panel-wide color theme</span>
            </div>
            <div class="pp-accent-swatches">
              <button
                v-for="t in accentThemes" :key="t.key"
                class="pp-accent-swatch"
                :class="{ active: panelTheme === t.key }"
                :style="{ background: t.color }"
                :title="t.label"
                @click="$emit('set-theme', t.key)"
              >
                <svg v-if="panelTheme === t.key" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              </button>
            </div>
          </div>
          <div class="pp-setting-row">
            <div class="pp-setting-info">
              <span class="pp-setting-name">GitHub Profile</span>
              <span class="pp-setting-desc">View your public GitHub profile</span>
            </div>
            <a :href="`https://github.com/${userLogin}`" target="_blank" class="pp-btn">
              Open <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          </div>
          <div class="pp-setting-row">
            <div class="pp-setting-info">
              <span class="pp-setting-name">Repository</span>
              <span class="pp-setting-desc">Open Wildfire docs repository</span>
            </div>
            <a href="https://github.com/Wildfiire/docs" target="_blank" class="pp-btn">
              Open <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
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

  </div>
</template>

<script>
export default {
  name: 'PanelProfile',

  emits: ['toggle-theme', 'logout', 'set-theme'],

  props: {
    userLogin:    { type: String,  default: '' },
    userAvatar:   { type: String,  default: '' },
    githubToken:  { type: String,  default: '' },
    isLightTheme: { type: Boolean, default: false },
    panelTheme:   { type: String,  default: 'fire' },
    contributors: { type: Array,   default: () => [] },
    dailyCommits: { type: Array,   default: () => [] },
    totalCommits: { type: Number,  default: 0 },
    repoOwner:    { type: String,  default: 'Wildfiire' },
    repoName:     { type: String,  default: 'docs' }
  },

  data() {
    return {
      githubUser: {},
      actHovered: -1,
      activityFiles: [],
      activityLangs: [],
      recentCommits: [],
      loadingActivity: false,
      accentThemes: [
        { key: 'fire',     label: 'Fire',     color: '#ff7800' },
        { key: 'crimson',  label: 'Crimson',  color: '#dc2626' },
        { key: 'violet',   label: 'Violet',   color: '#7c3aed' },
        { key: 'emerald',  label: 'Emerald',  color: '#059669' },
        { key: 'sapphire', label: 'Sapphire', color: '#2563eb' },
        { key: 'gold',     label: 'Gold',     color: '#d97706' },
        { key: 'rose',     label: 'Rose',     color: '#db2777' },
        { key: 'cyan',     label: 'Cyan',     color: '#0891b2' }
      ],
      levels: [
        { key: 'newcomer', label: 'Newcomer', minCommits: 0   },
        { key: 'bronze',   label: 'Bronze',   minCommits: 5   },
        { key: 'silver',   label: 'Silver',   minCommits: 20  },
        { key: 'gold',     label: 'Gold',     minCommits: 50  },
        { key: 'platinum', label: 'Platinum', minCommits: 100 },
        { key: 'legend',   label: 'Legend',   minCommits: 200 }
      ],
      achievements: [
        { id: 'first_commit',  title: 'First Blood',     desc: 'Make your first commit',          type: 'commits', threshold: 1,   color: '#ff7800', rarity: 'common',    icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></svg>' },
        { id: 'commits_5',     title: 'Getting Started', desc: 'Reach 5 commits',                 type: 'commits', threshold: 5,   color: '#cd7f32', rarity: 'common',    icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
        { id: 'commits_20',    title: 'Silver Coder',    desc: 'Reach 20 commits',                type: 'commits', threshold: 20,  color: '#c0c0c0', rarity: 'rare',      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>' },
        { id: 'commits_50',    title: 'Gold Coder',      desc: 'Reach 50 commits',                type: 'commits', threshold: 50,  color: '#ffd700', rarity: 'rare',      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>' },
        { id: 'commits_100',   title: 'Platinum Coder',  desc: 'Reach 100 commits',               type: 'commits', threshold: 100, color: '#88d4e8', rarity: 'epic',      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>' },
        { id: 'commits_200',   title: 'Wildfire Legend', desc: 'Reach 200 commits',               type: 'commits', threshold: 200, color: '#ff7800', rarity: 'legendary', icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>' },
        { id: 'first_pr',      title: 'Open Sesame',     desc: 'Open your first pull request',    type: 'prs',     threshold: 1,   color: '#22c55e', rarity: 'common',    icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/></svg>' },
        { id: 'prs_5',         title: 'PR Machine',      desc: 'Open 5 pull requests',            type: 'prs',     threshold: 5,   color: '#4ade80', rarity: 'rare',      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/></svg>' },
        { id: 'prs_10',        title: 'PR Legend',       desc: 'Open 10 pull requests',           type: 'prs',     threshold: 10,  color: '#22c55e', rarity: 'epic',      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/></svg>' },
        { id: 'top10',         title: 'Top 10',          desc: 'Reach top 10 contributors',       type: 'rank',    threshold: 10,  color: '#3b82f6', rarity: 'common',    icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
        { id: 'top5',          title: 'Elite',           desc: 'Reach top 5 contributors',        type: 'rank',    threshold: 5,   color: '#8b5cf6', rarity: 'rare',      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
        { id: 'top3',          title: 'Podium',          desc: 'Reach top 3 contributors',        type: 'rank',    threshold: 3,   color: '#f59e0b', rarity: 'epic',      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6l4-4 4 4"/><path d="M12 2v10.3"/><path d="M2 20h20"/><path d="M6 20v-4"/><path d="M10 20v-8"/><path d="M14 20v-6"/><path d="M18 20v-10"/></svg>' },
        { id: 'rank1',         title: 'Champion',        desc: '#1 contributor of all time',      type: 'rank',    threshold: 1,   color: '#ffd700', rarity: 'legendary', icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>' }
      ],
      profileBgUrl: '',
      readmeBgStatus: 'idle',
      activeBgId: 'default',
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
      const colors = { newcomer: '#8a8a95', bronze: '#cd7f32', silver: '#c0c0c0', gold: '#ffd700', platinum: '#88d4e8', legend: 'var(--accent)' }
      return colors[this.contributionLevel.key] || 'var(--accent)'
    },

    ringOffset() {
      return 339.3 * (1 - this.xpProgress / 100)
    },

    topContributors() {
      return [...this.contributors].sort((a, b) => (b.commits || 0) - (a.commits || 0))
    },

    wikiPages() {
      return this.activityFiles.filter(f => f.path.endsWith('.md')).slice(0, 6)
    },

    heroBgStyle() {
      return this.bannerBgStyle
    },

    bannerBgStyle() {
      if (this.profileBgUrl)
        return { backgroundImage: `url('${this.profileBgUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' }
      const p = this.bgPresets.find(p => p.id === this.activeBgId)
      if (p && p.value) return { background: p.value }
      return { background: 'linear-gradient(135deg,#0d0a0f 0%,#1a0800 60%,#0a0a10 100%)' }
    },

    readmeBgLabel() {
      if (this.readmeBgStatus === 'loading') return 'Fetching README…'
      if (this.readmeBgStatus === 'found')   return 'Background synced from GitHub README'
      if (this.readmeBgStatus === 'none')    return 'No image found in profile README'
      if (this.readmeBgStatus === 'error')   return 'Could not fetch README'
      return 'Checking profile README…'
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
    userLogin(val) { if (val) { this.fetchUserInfo(); this.loadProfileBg(); this.fetchProfileReadmeBg(); this.fetchMyActivity() } }
  },

  mounted() {
    if (this.userLogin) { this.fetchUserInfo(); this.loadProfileBg(); this.fetchProfileReadmeBg(); this.fetchMyActivity() }
  },

  methods: {
    onActMouseMove(e) {
      const svg = e.currentTarget
      const rect = svg.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 660
      const idx = Math.min(Math.max(Math.floor(x / (660 / 30)), 0), 29)
      this.actHovered = idx
    },

    checkAchievement(a) {
      if (a.type === 'commits') return this.myStats.commits >= a.threshold
      if (a.type === 'prs')     return this.myStats.prs >= a.threshold
      if (a.type === 'rank')    return typeof this.myStats.rank === 'number' && this.myStats.rank <= a.threshold
      return false
    },

    async fetchMyActivity() {
      if (!this.githubToken || !this.userLogin || !this.repoOwner || !this.repoName) return
      this.loadingActivity = true
      const EXT_LANGS = {
        vue:  { name: 'Vue',        color: '#42b883' },
        js:   { name: 'JavaScript', color: '#f7df1e' },
        ts:   { name: 'TypeScript', color: '#3178c6' },
        md:   { name: 'Markdown',   color: '#888888' },
        json: { name: 'JSON',       color: '#f5a623' },
        css:  { name: 'CSS',        color: '#264de4' },
        scss: { name: 'SCSS',       color: '#cd6799' },
        html: { name: 'HTML',       color: '#e34c26' },
        py:   { name: 'Python',     color: '#3572A5' },
        sh:   { name: 'Shell',      color: '#89e051' }
      }
      try {
        const h = { 'Authorization': `token ${this.githubToken}`, 'Accept': 'application/vnd.github.v3+json' }
        const res = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/commits?author=${this.userLogin}&per_page=30`, { headers: h })
        if (!res.ok) return
        const commits = await res.json()
        this.recentCommits = commits.slice(0, 8).map(c => ({
          sha: c.sha.slice(0, 7),
          message: (c.commit?.message || '').split('\n')[0].slice(0, 80),
          date: c.commit?.author?.date || '',
          url: c.html_url
        }))
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
        this.activityFiles = Object.entries(fileCounts)
          .sort((a, b) => b[1] - a[1]).slice(0, 6)
          .map(([path, count]) => ({ path, name: path.split('/').pop(), count }))
        const total = Object.values(langCounts).reduce((a, b) => a + b, 0) || 1
        this.activityLangs = Object.entries(langCounts)
          .sort((a, b) => b[1] - a[1]).slice(0, 5)
          .map(([ext, count]) => ({ ext, count, name: EXT_LANGS[ext].name, color: EXT_LANGS[ext].color, pct: Math.round((count / total) * 100) }))
      } catch (e) { console.error('[PanelProfile] fetchMyActivity:', e) }
      finally { this.loadingActivity = false }
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

    async fetchProfileReadmeBg() {
      const username = this.userLogin
      if (!username) return
      this.readmeBgStatus = 'loading'
      const branches = ['main', 'master']
      for (const branch of branches) {
        try {
          const res = await fetch(`https://raw.githubusercontent.com/${username}/${username}/${branch}/README.md`)
          if (!res.ok) continue
          const text = await res.text()
          const url = this._extractImageFromReadme(text)
          if (url) {
            this.profileBgUrl = url
            this.readmeBgStatus = 'found'
            return
          }
        } catch (_) {}
      }
      if (this.readmeBgStatus === 'loading') this.readmeBgStatus = 'none'
    },

    _extractImageFromReadme(text) {
      const mdImg = text.match(/!\[.*?\]\((https?:\/\/[^\s)]+\.(?:jpg|jpeg|png|webp|gif)(?:\?[^\s)]*)?)\)/i)
      if (mdImg) return mdImg[1]
      const imgur = text.match(/(https?:\/\/i\.imgur\.com\/[A-Za-z0-9]+\.(?:jpg|jpeg|png|webp|gif))/i)
      if (imgur) return imgur[1]
      const htmlImg = text.match(/<img[^>]+src=["'](https?:\/\/[^\s"']+)["']/i)
      if (htmlImg) return htmlImg[1]
      return null
    },

    loadProfileBg() {
      if (!this.userLogin || typeof localStorage === 'undefined') return
      try {
        const saved = JSON.parse(localStorage.getItem(`wildfire-bg-${this.userLogin}`) || 'null')
        if (saved) this.activeBgId = saved.presetId || 'default'
      } catch (_) {}
    },

    saveBg() {
      if (!this.userLogin || typeof localStorage === 'undefined') return
      try {
        localStorage.setItem(`wildfire-bg-${this.userLogin}`, JSON.stringify({ presetId: this.activeBgId }))
      } catch (_) {}
    },

    setBg(preset) {
      this.activeBgId = preset.id
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
/* ── CSS VARIABLES ── */
.panel-profile {
  --bg-secondary: #0f0f12; --bg-tertiary: #1a1a20; --bg-primary: #0a0a0c;
  --border-color: #1f1f24; --text-primary: #fff; --text-secondary: #e0e0e0;
  --text-muted: #8a8a95; --accent: #ff7800; --accent-glow: rgba(255, 120, 0,0.2);
  --accent-dim: rgba(255, 120, 0,0.08); --accent-soft: rgba(255, 120, 0,0.15);
  --accent-mid: rgba(255, 120, 0,0.28); --accent-strong: rgba(255, 120, 0,0.45);
  --accent-heavy: rgba(255, 120, 0,0.68); --accent-solid: rgba(255, 120, 0,0.88);
  --accent-alt: #ff6030; --accent-alt2: #ff8c42;
  display:flex; flex-direction:column; gap:16px; animation:pp-fade 0.3s ease;
}
.panel-profile.light-theme {
  --bg-primary:#f0f0f5; --bg-secondary:#fff; --bg-tertiary:#e2e2ea;
  --border-color:#c4c4d0; --text-primary:#0f0f14; --text-secondary:#2a2a38;
  --text-muted:#4a4a5a; --accent-glow:rgba(255, 120, 0,0.1);
  --accent-dim: rgba(255, 120, 0,0.07); --accent-soft: rgba(255, 120, 0,0.12);
  --accent-mid: rgba(255, 120, 0,0.22); --accent-strong: rgba(255, 120, 0,0.4);
}
@keyframes pp-fade { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
@keyframes pp-pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }

/* ── HERO ── */
.pp-hero { position:relative; background:rgba(6,6,18,0.7); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,0.10); border-radius:20px; overflow:hidden; min-height:240px; box-shadow:0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12); }
.pp-banner { position:absolute; inset:0; height:100%; z-index:0; }
.pp-banner-bg { position:absolute; inset:0; background-size:cover; background-position:center; transition:background 0.5s ease, background-image 0.5s ease; }
.pp-banner-vignette { position:absolute; inset:0; background:linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.82) 100%); }
.pp-banner-rank { position:absolute; top:14px; right:18px; background:var(--accent-soft); border:1px solid var(--accent-strong); border-radius:12px; padding:8px 16px; text-align:center; backdrop-filter:blur(8px); z-index:2; }
.pp-banner-rank-num { display:block; font-size:24px; font-weight:900; color:var(--accent-alt); line-height:1; }
.pp-banner-rank-lbl { font-size:8px; color:rgba(255,255,255,0.6); letter-spacing:1px; text-transform:uppercase; }

/* Profile row */
.pp-profile-row { position:relative; z-index:1; display:flex; align-items:flex-end; gap:20px; padding:150px 24px 24px; flex-wrap:wrap; }
.pp-avatar-wrap { position:relative; flex-shrink:0; width:110px; height:110px; margin-top:0; z-index:2; }
.pp-level-ring { position:absolute; inset:0; width:110px; height:110px; }
.pp-avatar { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:82px; height:82px; border-radius:50%; object-fit:cover; border:3px solid rgba(255,255,255,0.15); box-shadow:0 6px 24px rgba(0,0,0,0.6); transition:transform 0.2s; }
.pp-avatar:hover { transform:translate(-50%,-50%) scale(1.06); }
.pp-online-dot { position:absolute; bottom:6px; right:6px; width:13px; height:13px; border-radius:50%; background:#22c55e; border:2px solid rgba(0,0,0,0.5); box-shadow:0 0 8px rgba(34,197,94,0.6); z-index:3; }
.pp-level-pin { position:absolute; bottom:-4px; left:50%; transform:translateX(-50%); width:28px; height:28px; z-index:3; filter:drop-shadow(0 2px 6px rgba(0,0,0,0.5)); }

/* Profile info */
.pp-profile-info { flex:1; min-width:180px; padding-top:14px; }
.pp-name-row { display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:4px; }
.pp-name { margin:0; font-size:21px; font-weight:800; color:var(--text-primary); }
.pp-lvl-chip { display:inline-flex; align-items:center; gap:5px; font-size:10px; font-weight:700; padding:3px 9px; border-radius:20px; letter-spacing:0.4px; text-transform:uppercase; }
.pp-lvl-chip.newcomer { background:rgba(138,138,149,0.15); color:#8a8a95; border:1px solid rgba(138,138,149,0.25); }
.pp-lvl-chip.bronze   { background:rgba(205,127,50,0.15); color:#cd7f32; border:1px solid rgba(205,127,50,0.3); }
.pp-lvl-chip.silver   { background:rgba(192,192,192,0.15); color:#c0c0c0; border:1px solid rgba(192,192,192,0.3); }
.pp-lvl-chip.gold     { background:rgba(255,215,0,0.12); color:#ffd700; border:1px solid rgba(255,215,0,0.35); box-shadow:0 0 10px rgba(255,215,0,0.12); }
.pp-lvl-chip.platinum { background:rgba(136,212,232,0.12); color:#88d4e8; border:1px solid rgba(136,212,232,0.3); box-shadow:0 0 10px rgba(136,212,232,0.12); }
.pp-lvl-chip.legend   { background:var(--accent-dim); color:var(--accent-alt); border:1px solid var(--accent-strong); box-shadow:0 0 12px var(--accent-soft); }
.pp-login { font-size:12px; color:var(--text-muted); display:block; margin-bottom:5px; }
.pp-bio { font-size:12px; color:var(--text-secondary); margin:0 0 8px; line-height:1.5; opacity:0.85; }
.pp-meta-row { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.pp-meta-tag { display:inline-flex; align-items:center; gap:4px; font-size:11px; color:var(--text-muted); background:var(--bg-tertiary); border:1px solid var(--border-color); padding:3px 9px; border-radius:8px; }
.pp-meta-tag.link { color:var(--accent); text-decoration:none; border-color:var(--accent-glow); }
.pp-meta-tag.link:hover { border-color:var(--accent-strong); }

/* GitHub pills */
.pp-gh-pill-row { display:flex; align-items:stretch; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.10); border-radius:12px; overflow:hidden; align-self:flex-start; margin-top:14px; flex-shrink:0; backdrop-filter:blur(12px); }
.pp-gh-pill { display:flex; flex-direction:column; align-items:center; padding:10px 16px; gap:2px; }
.pp-gh-pill + .pp-gh-pill { border-left:1px solid rgba(255,255,255,0.08); }
.pp-gh-pill-val { font-size:16px; font-weight:700; color:var(--text-primary); line-height:1; }
.pp-gh-pill-lbl { font-size:9px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.4px; }

/* ── STAT TILES ── */
.pp-stat-tiles { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
.pp-tile { background:rgba(6,6,18,0.46); backdrop-filter:blur(40px) saturate(175%); -webkit-backdrop-filter:blur(40px) saturate(175%); border:1px solid rgba(255,255,255,0.09); border-radius:16px; padding:16px 16px 14px; display:flex; gap:13px; align-items:flex-start; position:relative; overflow:hidden; transition:transform 0.18s, border-color 0.18s, box-shadow 0.18s; box-shadow:0 4px 24px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.10); }
.pp-tile:hover { transform:translateY(-3px); border-color:rgba(255,255,255,0.14); box-shadow:0 12px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.14); }
.pp-tile-accent { position:absolute; top:0; left:0; right:0; height:2px; }
.pp-tile.commits .pp-tile-accent { background:linear-gradient(90deg,var(--accent),var(--accent-alt)); }
.pp-tile.prs .pp-tile-accent     { background:linear-gradient(90deg,#22c55e,#4ade80); }
.pp-tile.impact .pp-tile-accent  { background:linear-gradient(90deg,#3b82f6,#60a5fa); }
.pp-tile.level .pp-tile-accent   { background:linear-gradient(90deg,#ffd700,#ffaa00); }
.pp-tile-icon { width:40px; height:40px; border-radius:10px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.10); display:flex; align-items:center; justify-content:center; color:var(--text-muted); flex-shrink:0; }
.pp-tile.commits .pp-tile-icon { color:var(--accent); }
.pp-tile.prs .pp-tile-icon     { color:#22c55e; }
.pp-tile.impact .pp-tile-icon  { color:#3b82f6; }
.pp-tile-body { flex:1; min-width:0; display:flex; flex-direction:column; gap:4px; }
.pp-tile-val { font-size:26px; font-weight:800; color:var(--text-primary); line-height:1; }
.pp-tile-val-sm { font-size:17px; }
.pp-tile-unit { font-size:14px; font-weight:600; }
.pp-tile-lbl { font-size:10px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.3px; }
.pp-tile-bar { width:100%; height:3px; background:var(--bg-tertiary); border-radius:2px; overflow:hidden; margin-top:4px; }
.pp-tile-fill { height:100%; border-radius:2px; transition:width 0.9s cubic-bezier(0.4,0,0.2,1); }
.pp-tile-fill.commits { background:linear-gradient(90deg,var(--accent),var(--accent-alt)); }
.pp-tile-fill.impact  { background:linear-gradient(90deg,#3b82f6,#60a5fa); }
.pp-tile-fill.level.newcomer { background:#8a8a95; }
.pp-tile-fill.level.bronze   { background:#cd7f32; }
.pp-tile-fill.level.silver   { background:#c0c0c0; }
.pp-tile-fill.level.gold     { background:linear-gradient(90deg,#ffd700,#ffaa00); }
.pp-tile-fill.level.platinum { background:linear-gradient(90deg,#88d4e8,#5ab4d0); }
.pp-tile-fill.level.legend   { background:linear-gradient(90deg,var(--accent),var(--accent-alt)); }

/* ── SHARED CARD ── */
.pp-card { background:rgba(6,6,18,0.46); backdrop-filter:blur(40px) saturate(175%); -webkit-backdrop-filter:blur(40px) saturate(175%); border:1px solid rgba(255,255,255,0.09); border-radius:16px; padding:22px 24px; box-shadow:0 4px 24px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.10); }
.pp-card-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
.pp-card-title { display:flex; align-items:center; gap:8px; font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.6px; }
.pp-card-badge { font-size:11px; background:rgba(255,255,255,0.05); color:var(--text-muted); padding:3px 10px; border-radius:10px; border:1px solid rgba(255,255,255,0.09); }
.pp-card-badge.accent { background:var(--accent-dim); color:var(--accent); border-color:var(--accent-mid); }

/* ── PROGRESSION MILESTONES ── */
.pp-milestones { display:grid; grid-template-columns:repeat(6,1fr); gap:4px; margin-bottom:20px; }
.pp-ms { position:relative; border:1px solid rgba(255,255,255,0.08); border-radius:10px; overflow:hidden; min-height:78px; cursor:default; transition:border-color 0.2s; }
.pp-ms-fill { position:absolute; inset:0; opacity:0; transition:opacity 0.4s; }
.pp-ms.earned .pp-ms-fill { opacity:1; background:rgba(255,255,255,0.04); }
.pp-ms.current .pp-ms-fill { opacity:1; background:var(--accent-dim); }
.pp-ms.earned { border-color:rgba(255,255,255,0.09); }
.pp-ms.current { border-color:var(--accent-strong); box-shadow:0 0 14px var(--accent-dim); }
.pp-ms.upcoming { opacity:0.38; filter:grayscale(0.6); }
.pp-ms-inner { position:relative; z-index:1; display:flex; flex-direction:column; align-items:center; gap:4px; padding:10px 6px 8px; }
.pp-ms-medal { width:26px; height:26px; transition:transform 0.2s; }
.pp-ms.current .pp-ms-medal { transform:scale(1.18); filter:drop-shadow(0 0 6px var(--accent-strong)); }
.pp-ms-name { font-size:9px; font-weight:700; color:var(--text-muted); text-align:center; }
.pp-ms.earned .pp-ms-name { color:var(--text-secondary); }
.pp-ms.current .pp-ms-name { color:var(--accent); }
.pp-ms-req { font-size:8px; color:var(--text-muted); opacity:0.55; text-align:center; }
.pp-ms-you { position:absolute; bottom:4px; left:0; right:0; text-align:center; font-size:7.5px; font-weight:800; color:var(--accent); letter-spacing:0.4px; text-transform:uppercase; }

/* ── XP PROGRESS BLOCK ── */
.pp-xp-block { margin-top:4px; }
.pp-xp-endpoints { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; gap:10px; }
.pp-xp-ep { display:flex; align-items:center; gap:8px; }
.pp-xp-ep.right { flex-direction:row; justify-content:flex-end; }
.pp-xp-ep.right .right { text-align:right; }
.pp-xp-ep-name { display:block; font-size:12px; font-weight:700; color:var(--text-primary); line-height:1.2; }
.pp-xp-ep-val { display:block; font-size:10px; color:var(--text-muted); }
.pp-xp-bar-wrap { position:relative; height:14px; margin-bottom:10px; }
.pp-xp-bar-bg { position:absolute; inset:0; background:var(--bg-tertiary); border-radius:7px; }
.pp-xp-bar-fill { position:absolute; top:0; left:0; height:100%; border-radius:7px; transition:width 1s cubic-bezier(0.34,1.56,0.64,1); z-index:1; }
.pp-xp-bar-fill.newcomer { background:#8a8a95; }
.pp-xp-bar-fill.bronze   { background:linear-gradient(90deg,#8b4e10,#cd7f32); }
.pp-xp-bar-fill.silver   { background:linear-gradient(90deg,#909090,#d4d4d4); }
.pp-xp-bar-fill.gold     { background:linear-gradient(90deg,#b8860b,#ffd700); }
.pp-xp-bar-fill.platinum { background:linear-gradient(90deg,#5ab4d0,#88d4e8); }
.pp-xp-bar-fill.legend   { background:linear-gradient(90deg,var(--accent),var(--accent-alt)); }
.pp-xp-bar-glow { position:absolute; top:2px; left:0; height:10px; border-radius:5px; filter:blur(5px); opacity:0.55; transition:width 1s cubic-bezier(0.34,1.56,0.64,1); z-index:0; }
.pp-xp-bar-glow.bronze   { background:#cd7f32; }
.pp-xp-bar-glow.silver   { background:#c0c0c0; }
.pp-xp-bar-glow.gold     { background:#ffd700; }
.pp-xp-bar-glow.platinum { background:#88d4e8; }
.pp-xp-bar-glow.legend   { background:var(--accent); }
.pp-xp-thumb { position:absolute; top:50%; z-index:2; transform:translate(-50%,-50%); pointer-events:none; transition:left 1s cubic-bezier(0.34,1.56,0.64,1); }
.pp-xp-pct-label { display:block; background:rgba(6,6,18,0.7); border:1px solid rgba(255,255,255,0.12); border-radius:6px; font-size:9.5px; font-weight:800; color:var(--accent); padding:2px 6px; white-space:nowrap; box-shadow:0 2px 8px rgba(0,0,0,0.35); }
.pp-xp-need { display:flex; align-items:center; gap:5px; font-size:11px; color:var(--text-muted); }
.pp-xp-max { display:flex; align-items:center; gap:10px; font-size:13px; font-weight:700; color:var(--accent); margin-bottom:10px; }

/* ── RECENT ACTIVITY ── */
.pp-act-loading { display:flex; align-items:center; gap:12px; padding:20px 0; color:var(--text-muted); font-size:12px; }
.pp-act-spinner { width:20px; height:20px; border:2px solid var(--border-color); border-top-color:var(--accent); border-radius:50%; animation:pp-spin 0.7s linear infinite; flex-shrink:0; }
@keyframes pp-spin { to { transform:rotate(360deg) } }
.pp-act-section-title { display:flex; align-items:center; gap:6px; font-size:9px; font-weight:800; color:var(--text-muted); letter-spacing:0.7px; text-transform:uppercase; margin-bottom:10px; }
.pp-lang-list { display:flex; flex-direction:column; gap:7px; margin-bottom:4px; }
.pp-lang-row { display:flex; align-items:center; gap:9px; }
.pp-lang-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.pp-lang-name { width:80px; flex-shrink:0; font-size:12px; font-weight:600; color:var(--text-secondary); }
.pp-lang-track { flex:1; height:6px; background:var(--bg-tertiary); border-radius:3px; overflow:hidden; }
.pp-lang-fill { height:100%; border-radius:3px; transition:width 0.7s ease; }
.pp-lang-pct { font-size:11px; font-weight:700; color:var(--text-muted); width:32px; text-align:right; flex-shrink:0; }
.pp-file-list { display:flex; flex-direction:column; gap:5px; }
.pp-file-row { display:flex; align-items:center; gap:8px; padding:7px 10px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:9px; transition:border-color 0.15s; }
.pp-file-row:hover { border-color:rgba(255,255,255,0.1); }
.pp-file-rank { font-size:13px; flex-shrink:0; width:22px; text-align:center; }
.pp-file-icon { color:var(--text-muted); flex-shrink:0; }
.pp-file-name { flex:1; font-size:11px; font-weight:600; color:var(--text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; min-width:0; }
.pp-file-count { font-size:10px; font-weight:700; color:var(--text-muted); background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09); padding:1px 7px; border-radius:6px; flex-shrink:0; }
.pp-act-empty { display:flex; align-items:center; gap:10px; color:var(--text-muted); font-size:12px; padding:16px 0; }

/* ── ACTIVITY CHART ── */
.pp-act-meta { display:flex; align-items:center; gap:8px; font-size:11px; color:var(--text-muted); }
.pp-act-meta strong { color:var(--text-primary); font-weight:700; }
.pp-act-sep { opacity:0.3; }
.pp-act-wrap { position:relative; }
.pp-act-tip { position:absolute; background:rgba(10,10,15,0.92); border:1px solid var(--border-color); border-radius:8px; padding:7px 11px; pointer-events:none; z-index:10; backdrop-filter:blur(6px); min-width:100px; text-align:center; }
.pp-tip-val { font-size:15px; font-weight:700; color:var(--text-primary); }
.pp-tip-val span { font-size:11px; font-weight:400; color:var(--text-muted); }
.pp-tip-date { font-size:10px; color:var(--text-muted); margin-top:2px; }

/* ── COMPARISON ── */
.pp-cmp-list { display:flex; flex-direction:column; }
.pp-cmp-row { display:flex; align-items:center; gap:10px; padding:9px 0; border-bottom:1px solid rgba(255,255,255,0.07); }
.pp-cmp-row:last-child { border-bottom:none; }
.pp-cmp-row.is-me { background:var(--accent-dim); border-radius:8px; padding-inline:8px; margin-inline:-8px; }
.pp-cmp-rank { width:26px; font-size:11px; font-weight:700; text-align:right; color:var(--text-muted); flex-shrink:0; }
.pp-cmp-rank.gold   { color:#ffd700; }
.pp-cmp-rank.silver { color:#c0c0c0; }
.pp-cmp-rank.bronze { color:#cd7f32; }
.pp-cmp-avatar { width:26px; height:26px; border-radius:50%; border:1px solid rgba(255,255,255,0.10); flex-shrink:0; }
.pp-cmp-name { width:90px; flex-shrink:0; font-size:12px; font-weight:600; color:var(--text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.pp-you-tag { display:inline-block; font-size:8px; background:var(--accent); color:#fff; padding:1px 4px; border-radius:4px; margin-left:4px; vertical-align:middle; font-weight:700; }
.pp-cmp-bar-wrap { flex:1; height:6px; background:var(--bg-tertiary); border-radius:3px; overflow:hidden; }
.pp-cmp-bar { height:100%; border-radius:3px; background:rgba(255,255,255,0.12); transition:width 0.6s ease; }
.pp-cmp-bar.me { background:linear-gradient(90deg,var(--accent),var(--accent-alt)); box-shadow:0 0 6px var(--accent-mid); }
.pp-cmp-count { font-size:11px; font-weight:600; color:var(--text-muted); width:38px; text-align:right; flex-shrink:0; }

/* ── ACHIEVEMENTS ── */
.pp-ach-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(148px,1fr)); gap:10px; }
.pp-ach-item { display:flex; align-items:center; gap:10px; padding:10px 12px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:12px; cursor:help; transition:all 0.2s; }
.pp-ach-item:hover { transform:translateY(-1px); }
.pp-ach-item.unlocked { border-color:rgba(255,255,255,0.08); }
.pp-ach-item.unlocked.legendary { box-shadow:0 0 12px rgba(255,215,0,0.12); }
.pp-ach-item.unlocked.epic      { box-shadow:0 0 10px rgba(139,92,246,0.12); }
.pp-ach-icon { width:38px; height:38px; flex-shrink:0; border-radius:10px; border:1px solid rgba(255,255,255,0.09); background:rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:center; position:relative; }
.pp-ach-lock { position:absolute; top:-4px; right:-4px; width:16px; height:16px; background:rgba(6,6,18,0.7); border-radius:50%; display:flex; align-items:center; justify-content:center; color:var(--text-muted); border:1px solid rgba(255,255,255,0.10); }
.pp-ach-info { display:flex; flex-direction:column; gap:2px; min-width:0; }
.pp-ach-name { font-size:12px; font-weight:600; color:var(--text-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.pp-ach-item.unlocked .pp-ach-name { color:var(--text-primary); }
.pp-ach-rarity { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.3px; }
.pp-ach-rarity.common    { color:#8a8a95; }
.pp-ach-rarity.rare      { color:#3b82f6; }
.pp-ach-rarity.epic      { color:#8b5cf6; }
.pp-ach-rarity.legendary { color:#ffd700; }

/* ── PROFILE SETTINGS CARD ── */
.pp-settings-card { padding:0; overflow:hidden; }
.pp-settings-section { padding:22px 24px; }
.pp-section-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
.pp-divider { height:1px; background:rgba(255,255,255,0.07); margin:0; }

/* Live bg preview */
.pp-bg-live-preview { width:100%; height:80px; border-radius:10px; border:1px solid rgba(255,255,255,0.09); background-size:cover; background-position:center; background-color:rgba(255,255,255,0.04); display:flex; align-items:flex-end; overflow:hidden; margin-bottom:16px; transition:background 0.4s; }
.pp-bg-live-overlay { width:100%; padding:6px 12px; background:linear-gradient(to top, rgba(0,0,0,0.65), transparent); font-size:10px; color:rgba(255,255,255,0.7); font-weight:600; }

/* README bg info */
.pp-readme-bg-info { display:flex; align-items:flex-start; gap:8px; padding:10px 14px; background:var(--accent-dim); border:1px solid var(--accent-soft); border-radius:10px; margin-bottom:14px; font-size:11px; color:var(--text-muted); line-height:1.5; }
.pp-readme-bg-info svg { flex-shrink:0; margin-top:1px; color:var(--accent-heavy); }
.pp-readme-link { color:var(--accent); text-decoration:underline; text-underline-offset:2px; }
.pp-readme-bg-info code { font-family:monospace; font-size:10px; background:rgba(255,255,255,0.08); padding:1px 5px; border-radius:4px; color:var(--text-secondary); }
.pp-bg-fallback-label { display:flex; align-items:center; gap:6px; font-size:10px; color:var(--text-muted); margin-bottom:8px; opacity:0.7; }
.pp-bg-grid-dim { opacity:0.45; pointer-events:none; }
.panel-profile.light-theme .pp-readme-bg-info { background:var(--accent-dim); border-color:var(--accent-soft); }
.panel-profile.light-theme .pp-readme-bg-info code { background:rgba(0,0,0,0.06); color:var(--text-secondary); }

/* Preset grid */
.pp-bg-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:8px; margin-bottom:18px; }
.pp-bg-btn { background:none; border:none; padding:0; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:4px; }
.pp-bg-swatch { width:100%; aspect-ratio:3/2; border-radius:8px; border:2px solid rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; transition:all 0.18s; overflow:hidden; background:rgba(255,255,255,0.04); }
.pp-bg-btn:hover .pp-bg-swatch { border-color:var(--accent-strong); transform:scale(1.04); }
.pp-bg-btn.active .pp-bg-swatch { border-color:var(--accent); box-shadow:0 0 12px var(--accent-mid); }
.pp-bg-label { font-size:9px; color:var(--text-muted); white-space:nowrap; overflow:hidden; max-width:100%; text-overflow:ellipsis; }
.pp-bg-btn.active .pp-bg-label { color:var(--accent); }

/* Sync pill */
.pp-sync-pill { display:flex; align-items:center; gap:6px; font-size:10px; color:var(--text-muted); padding:3px 9px; border-radius:10px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09); }
.pp-sync-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; background:var(--text-muted); }
.pp-sync-pill.synced .pp-sync-dot { background:#22c55e; box-shadow:0 0 6px rgba(34,197,94,0.5); }
.pp-sync-pill.saving .pp-sync-dot { background:#f59e0b; animation:pp-pulse 1s infinite; }
.pp-sync-pill.local  .pp-sync-dot { background:#f59e0b; }

/* Settings list */
.pp-settings-list { border:1px solid rgba(255,255,255,0.09); border-radius:14px; overflow:hidden; background:rgba(6,6,18,0.3); }
.pp-setting-row { display:flex; align-items:center; gap:16px; padding:13px 18px; border-bottom:1px solid rgba(255,255,255,0.07); background:transparent; transition:background 0.15s; }
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
.pp-btn { display:inline-flex; align-items:center; gap:6px; padding:7px 16px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.10); border-radius:8px; font-size:12px; cursor:pointer; color:var(--text-muted); text-decoration:none; transition:all 0.2s; }
.pp-btn:hover { border-color:var(--accent-strong); color:var(--accent); }
.pp-btn.danger { border-color:rgba(239,68,68,0.3); color:#ef4444; }
.pp-btn.danger:hover { background:rgba(239,68,68,0.08); border-color:#ef4444; }

/* ── HERO TEXT (always white on image bg) ── */
.pp-profile-row .pp-name { color:#fff; text-shadow:0 1px 6px rgba(0,0,0,0.7); }
.pp-profile-row .pp-login { color:rgba(255,255,255,0.65); }
.pp-profile-row .pp-hero-meta { color:rgba(255,255,255,0.55); }
.pp-profile-row .pp-hero-meta a { color:rgba(255,255,255,0.7); }

/* ── RECENT COMMITS ── */
.pp-rc-list { display:flex; flex-direction:column; }
.pp-rc-row { display:flex; align-items:center; gap:10px; padding:9px 0; border-bottom:1px solid var(--border-color); text-decoration:none; transition:background 0.12s; cursor:pointer; }
.pp-rc-row:last-child { border-bottom:none; }
.pp-rc-row:hover .pp-rc-msg { color:var(--accent); }
.pp-rc-sha { font-size:10px; font-family:monospace; background:rgba(255,120,0,0.08); color:var(--accent); border:1px solid rgba(255,120,0,0.22); padding:2px 6px; border-radius:5px; flex-shrink:0; letter-spacing:0.3px; }
.pp-rc-msg { flex:1; font-size:12px; font-weight:500; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; min-width:0; transition:color 0.15s; }
.pp-rc-date { font-size:10px; color:var(--text-muted); flex-shrink:0; white-space:nowrap; }

/* ── WIKI PAGES ── */
.pp-wiki-list { display:flex; flex-direction:column; gap:4px; }
.pp-wiki-row { display:flex; align-items:center; gap:8px; padding:6px 8px; border-radius:8px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); transition:border-color 0.15s; }
.pp-wiki-row:hover { border-color:rgba(255,255,255,0.1); }
.pp-wiki-dot { width:6px; height:6px; border-radius:50%; background:var(--accent); flex-shrink:0; opacity:0.8; }
.pp-wiki-name { font-size:12px; font-weight:600; color:var(--text-secondary); flex-shrink:0; white-space:nowrap; }
.pp-wiki-path { flex:1; font-size:10px; color:var(--text-muted); font-family:monospace; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; min-width:0; opacity:0.6; }
.pp-wiki-count { font-size:10px; font-weight:700; color:var(--text-muted); background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09); padding:1px 6px; border-radius:5px; flex-shrink:0; }

/* ── ACCENT COLOR THEME SWATCHES ── */
.pp-accent-row { align-items:center !important; flex-wrap:wrap; gap:8px; }
.pp-accent-swatches { display:flex; gap:6px; flex-wrap:wrap; align-items:center; }
.pp-accent-swatch { width:28px; height:28px; border-radius:50%; border:2.5px solid transparent; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:transform 0.18s, box-shadow 0.18s, border-color 0.18s; padding:0; flex-shrink:0; }
.pp-accent-swatch:hover { transform:scale(1.22); box-shadow:0 0 0 3px rgba(255,255,255,0.2); }
.pp-accent-swatch.active { border-color:#fff; box-shadow:0 0 0 3px rgba(255,255,255,0.35), 0 2px 8px rgba(0,0,0,0.4); transform:scale(1.18); }
.panel-profile.light-theme .pp-accent-swatch:hover { box-shadow:0 0 0 3px rgba(0,0,0,0.15); }
.panel-profile.light-theme .pp-accent-swatch.active { border-color:#1a1a1a; box-shadow:0 0 0 3px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.15); }

/* ── LIGHT THEME ── */
.panel-profile.light-theme .pp-hero { background:#ddd; }
.panel-profile.light-theme .pp-banner-vignette { background:linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.7) 100%); }
.panel-profile.light-theme .pp-banner-rank { background:var(--accent-dim); border-color:var(--accent-mid); }
.panel-profile.light-theme .pp-banner-rank-lbl { color:rgba(0,0,0,0.5); }
.panel-profile.light-theme .pp-gh-pill-row { background:rgba(0,0,0,0.03); }
.panel-profile.light-theme .pp-cmp-bar { background:rgba(0,0,0,0.08); }
.panel-profile.light-theme .pp-act-tip { background:rgba(255,255,255,0.97); border-color:#c4c4d0; color:#0f0f14; }
.panel-profile.light-theme .pp-ach-item.unlocked { border-color:rgba(0,0,0,0.1); }
.panel-profile.light-theme .pp-setting-row:hover { background:rgba(0,0,0,0.03); }
.panel-profile.light-theme .pp-bg-live-overlay { background:linear-gradient(to top, rgba(255,255,255,0.6), transparent); color:rgba(0,0,0,0.6); }

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .pp-stat-tiles { grid-template-columns:repeat(2,1fr); }
  .pp-bg-grid { grid-template-columns:repeat(4,1fr); }
  .pp-bg-inputs { grid-template-columns:1fr; }
}
@media (max-width: 640px) {
  .pp-stat-tiles { grid-template-columns:repeat(2,1fr); }
  .pp-profile-row { gap:14px; padding:110px 16px 20px; }
  .pp-avatar-wrap { width:90px; height:90px; }
  .pp-level-ring { width:90px; height:90px; }
  .pp-avatar { width:66px; height:66px; }
  .pp-hero { min-height:200px; }
  .pp-bg-grid { grid-template-columns:repeat(3,1fr); }
  .pp-track { margin:0 16px 24px; }
  .pp-banner-rank { display:none; }
}
</style>
