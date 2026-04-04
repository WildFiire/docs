<template>
  <div class="wiki-home-updates">
    <!-- LEFT SIDE - CARDURI CU PERSONALITATE (MULT SPRE STÂNGA) -->
    <div class="cards-zone">
      <div class="cards-header">
        <div class="header-decoration">
          <span class="header-line"></span>
          <span class="header-tag"> ACTIVITATE</span>
          <span class="header-line"></span>
        </div>
      </div>

      <div class="cards-grid">
        <!-- RÂNDUL 1: Card 1 (Top Contribuitor) ocupă tot -->
        <div class="feature-card card-contributor clickable-card scroll-reveal" 
             @click="openProfile(topContributor.login)"
             :style="{ animationDelay: '0.2s' }"
             ref="card1Ref">
          <div class="card-glow"></div>
          <div class="card-border"></div>
          <div class="click-indicator">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
          
          <div class="contributor-header">
            <div class="contributor-avatar">
              <img :src="`https://github.com/${topContributor.login}.png`" :alt="topContributor.login">
              <span class="avatar-ring"></span>
              <span class="avatar-crown">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="gold" stroke="none">
                  <path d="M12 2L15 8.5L22 9L17 14L19 21L12 17.5L5 21L7 14L2 9L9 8.5L12 2Z"/>
                </svg>
              </span>
            </div>
            <div class="contributor-info">
              <span class="contributor-badge">TOP CONTRIBUTOR</span>
              <h4 class="contributor-name">{{ topContributor.login }}</h4>
              <div class="contributor-stats">
                <span class="contributor-stat">
                  <span class="stat-icon">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                    </svg>
                  </span>
                  <span class="stat-value">{{ formatNumber(topContributor.contributions) }}</span>
                  <span class="stat-label">commits</span>
                </span>
                <span class="contributor-stat">
                  <span class="stat-icon">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  </span>
                  <span class="stat-value">{{ formatNumber(topContributor.prs || 0) }}</span>
                  <span class="stat-label">PR-uri</span>
                </span>
              </div>
            </div>
          </div>
          
          <div class="contributor-footer">
            <a :href="`https://github.com/${topContributor.login}`" target="_blank" class="contributor-link clickable-link">
              Vezi profil 
              <span class="link-arrow">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </a>
          </div>
        </div>

        <!-- RÂNDUL 2: Două coloane -->
        <!-- Coloana STÂNGA: Card 2 (Timeline) și Card 5 (Contribuie) -->
        <div class="left-column">
          <!-- Card 2: Timeline -->
          <div class="feature-card card-timeline scroll-reveal" 
               :style="{ animationDelay: '0.8s' }"
               ref="card2Ref">
            <div class="card-glow"></div>
            <div class="card-border"></div>
            
            <div class="timeline-header">
              <span class="timeline-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </span>
              <h4 class="timeline-title">Ultimele 4 update-uri</h4>
            </div>
            
            <div class="timeline-list">
              <div v-for="(commit, index) in recentCommits" :key="commit.id" 
                   class="timeline-item clickable-item" 
                   @click="openCommit(commit.url)">
                <div class="timeline-dot" :style="{ animationDelay: `${index * 0.2}s` }"></div>
                <div class="timeline-content">
                  <div class="timeline-top">
                    <span class="timeline-emoji" v-html="commit.emoji"></span>
                    <span class="timeline-message">{{ commit.message }}</span>
                  </div>
                  <div class="timeline-meta">
                    <span class="timeline-author">@{{ commit.author }}</span>
                    <span class="timeline-date">{{ formatDate(commit.date) }}</span>
                  </div>
                </div>
                <span class="item-click-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>
              <div v-if="isLoading && recentCommits.length === 0" class="timeline-loading">
                <span class="loading-spinner"></span>
                <span>Se încarcă...</span>
              </div>
            </div>
            
            <div class="view-all-updates-wrapper">
              <a :href="`https://github.com/Wildfiire/docs/commits/main`" target="_blank" class="view-all-updates-btn">
                <span>Vezi toate update-urile</span>
                <span class="btn-arrow">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </a>
            </div>
          </div>

          <!-- Card 5: + Card (Contribuie) - SUB TIMELINE în stânga -->
          <div class="feature-card card-plus clickable-card scroll-reveal" 
               @click="openContributing"
               :style="{ animationDelay: '2.4s' }"
               ref="card4Ref">
            <div class="card-glow"></div>
            <div class="card-border"></div>
            <div class="click-indicator">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
            
            <div class="plus-content">
              <div class="plus-icon">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#ff4500" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v8M8 12h8"/>
                </svg>
              </div>
              <h4 class="plus-title">Contribuie și tu</h4>
              <p class="plus-description">Vrei să ajuți? Orice contribuție contează.</p>
              <div class="plus-stats">
                <span class="plus-stat">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="16"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                  </svg>
                  {{ repoStats.openIssues }} issue-uri deschise
                </span>
                <span class="plus-stat">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="23 4 23 10 17 10"/>
                    <polyline points="1 20 1 14 7 14"/>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                  </svg>
                  {{ repoStats.openPRs }} PR-uri deschise
                </span>
              </div>
              <a :href="`https://github.com/Wildfiire/docs/issues`" target="_blank" class="plus-link clickable-link">
                Află cum 
                <span class="link-arrow">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>

        <!-- Coloana DREAPTA: Card 3 (Repo în cifre) SUS și Card 4 (TOP 3) JOS -->
        <div class="right-column">
          <!-- Card 3: Statistici Rapide - SUS în dreapta -->
          <div class="feature-card card-stats-quick scroll-reveal" 
               :style="{ animationDelay: '1.6s' }"
               ref="card3Ref">
            <div class="card-glow"></div>
            <div class="card-border"></div>
            
            <div class="stats-quick-header">
              <span class="stats-quick-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 3v18h18"/>
                  <path d="M18 17V9M12 17V5M6 17v-3"/>
                </svg>
              </span>
              <h4 class="stats-quick-title">Repo în cifre</h4>
            </div>
            
            <div class="stats-quick-grid">
              <div class="stats-quick-item">
                <span class="stats-quick-value">{{ formatNumber(repoStats.totalCommits) }}</span>
                <span class="stats-quick-label">commits</span>
              </div>
              <div class="stats-quick-item">
                <span class="stats-quick-value">{{ formatNumber(repoStats.contributors) }}</span>
                <span class="stats-quick-label">contribuitori</span>
              </div>
              <div class="stats-quick-item">
                <span class="stats-quick-value">{{ formatNumber(repoStats.files) }}</span>
                <span class="stats-quick-label">fișiere</span>
              </div>
              <div class="stats-quick-item">
                <span class="stats-quick-value">{{ formatNumber(repoStats.stars) }}</span>
                <span class="stats-quick-label">stars</span>
              </div>
            </div>
          </div>

          <!-- Card 4: TOP 3 CONTRIBUITORI - JOS în dreapta -->
          <div class="feature-card card-top3 scroll-reveal" 
               :style="{ animationDelay: '2.0s' }"
               ref="cardTop3Ref">
            <div class="card-glow"></div>
            <div class="card-border"></div>
            
            <div class="top3-header">
              <span class="top3-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </span>
              <h4 class="top3-title">TOP 3 Contribuitori</h4>
              <!-- <span class="top3-badge">Hall of Fame</span>X -->
            </div>
            
            <div class="top3-list">
              <div v-for="(contributor, index) in topContributors" :key="contributor.login" 
                   class="top3-item clickable-item" 
                   :class="{ 'gold': index === 0, 'silver': index === 1, 'bronze': index === 2 }"
                   @click="openProfile(contributor.login)">
                
                <div class="top3-rank">
                  <span class="rank-badge" :class="'rank-' + (index + 1)">{{ index + 1 }}</span>
                </div>
                
                <div class="top3-avatar">
                  <img :src="`https://github.com/${contributor.login}.png`" :alt="contributor.login">
                  <span class="avatar-glow"></span>
                </div>
                
                <div class="top3-info">
                  <span class="top3-name">{{ contributor.login }}</span>
                  <span class="top3-commits">{{ formatNumber(contributor.contributions) }} commits</span>
                </div>
                
                <span class="top3-arrow">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>
              
              <!-- Placeholder pentru useri lipsă -->
              <template v-if="topContributors.length < 3 && !isLoading">
                <div v-for="n in (3 - topContributors.length)" :key="'placeholder-'+n" 
                     class="top3-item placeholder-item">
                  <div class="top3-rank">
                    <span class="rank-badge rank-placeholder">{{ topContributors.length + n }}</span>
                  </div>
                  <div class="top3-avatar placeholder-avatar">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M5 20v-2a7 7 0 0 1 14 0v2" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                  </div>
                  <div class="top3-info">
                    <span class="top3-name placeholder-name">În așteptare</span>
                    <span class="top3-commits placeholder-commits">0 commits</span>
                  </div>
                </div>
              </template>
              
              <div v-if="isLoading && topContributors.length === 0" class="top3-loading">
                <span class="loading-spinner"></span>
                <span>Se încarcă topul...</span>
              </div>
            </div>
            
            <div class="top3-footer">
              <a href="https://github.com/Wildfiire/docs/graphs/contributors" target="_blank" class="top3-link clickable-link">
                Vezi toți contributorii
                <span class="link-arrow">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- WIDGET ISSUES & PULL REQUESTS -->
      <div class="issues-widget scroll-reveal feature-card" 
           :style="{ animationDelay: '2.8s' }"
           ref="issuesWidgetRef">
        <div class="card-glow"></div>
        <div class="card-border"></div>
        
        <div class="widget-header">
          <div class="header-left">
            <span class="widget-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </span>
            <h4 class="widget-title">Activitate în timp real</h4>
          </div>
          <div class="header-right">
            <span class="widget-badge">{{ repoStats.openIssues + repoStats.openPRs }} deschise</span>
          </div>
        </div>
        
        <div class="widget-stats-bar">
          <button class="stat-chip clickable-button" @click="filterType = 'all'" :class="{ active: filterType === 'all' }">
            <span>
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="2" width="20" height="20" rx="2.18"/>
              </svg>
            </span> Toate 
            <span class="chip-count">{{ repoStats.openIssues + repoStats.openPRs }}</span>
          </button>
          <button class="stat-chip clickable-button" @click="filterType = 'issues'" :class="{ active: filterType === 'issues' }">
            <span class="chip-icon issue">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </span> Issue-uri 
            <span class="chip-count issue">{{ repoStats.openIssues }}</span>
          </button>
          <button class="stat-chip clickable-button" @click="filterType = 'prs'" :class="{ active: filterType === 'prs' }">
            <span class="chip-icon pr">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 4 23 10 17 10"/>
                <polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
            </span> PR-uri 
            <span class="chip-count pr">{{ repoStats.openPRs }}</span>
          </button>
        </div>
        
        <div class="widget-content">
          <!-- ISSUE-URI -->
          <div class="widget-section" v-show="filterType !== 'prs'">
            <div v-for="issue in filteredIssues" :key="issue.id" 
                 class="list-item clickable-item" 
                 @click="openIssue(issue.url)">
              
              <div class="item-avatar">
                <img :src="`https://github.com/${issue.author}.png`" :alt="issue.author">
              </div>
              
              <div class="item-badge issue">#{{ issue.number }}</div>
              
              <div class="item-content">
                <div class="item-title">{{ issue.title }}</div>
                <div class="item-meta">
                  <span>@{{ issue.author }}</span>
                  <span>•</span>
                  <span>{{ formatDate(issue.date) }}</span>
                  <span v-if="issue.comments">• 💬 {{ issue.comments }}</span>
                </div>
              </div>
              
              <button class="item-button clickable-button" @click.stop="openIssue(issue.url)">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
            
            <div v-if="filteredIssues.length === 0 && filterType !== 'prs'" class="empty-section">
              <span>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="2" width="20" height="20" rx="2.18"/>
                </svg>
              </span> Niciun issue deschis
            </div>
          </div>

          <!-- PULL REQUESTS -->
          <div class="widget-section" v-show="filterType !== 'issues'">
            <div v-for="pr in filteredPRs" :key="pr.id" 
                 class="list-item clickable-item" 
                 @click="openPR(pr.url)">
              
              <div class="item-avatar">
                <img :src="`https://github.com/${pr.author}.png`" :alt="pr.author">
              </div>
              
              <div class="item-badge pr">#{{ pr.number }}</div>
              
              <div class="item-content">
                <div class="item-title">{{ pr.title }}</div>
                <div class="item-meta">
                  <span>@{{ pr.author }}</span>
                  <span>•</span>
                  <span>{{ formatDate(pr.date) }}</span>
                  <span v-if="pr.branch">• {{ pr.branch }}</span>
                </div>
              </div>
              
              <button class="item-button clickable-button" @click.stop="openPR(pr.url)">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
            
            <div v-if="filteredPRs.length === 0 && filterType !== 'issues'" class="empty-section">
              <span>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="2" width="20" height="20" rx="2.18"/>
                </svg>
              </span> Niciun PR deschis
            </div>
          </div>
        </div>

        <!-- QUICK ACTIONS -->
        <div class="quick-actions">
          <button class="quick-action-btn clickable-button" @click="refreshData">
            <span>
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M23 4v6h-6M1 20v-6h6"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
            </span> Refresh
          </button>
          <button class="quick-action-btn clickable-button" @click="openNewIssue">
            <span>
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
            </span> New Issue
          </button>
          <button class="quick-action-btn clickable-button" @click="openNewPR">
            <span>
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 4 23 10 17 10"/>
                <polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
            </span> New PR
          </button>
        </div>

        <div class="widget-footer">
          <a href="https://github.com/Wildfiire/docs/issues" 
             target="_blank" 
             class="widget-link clickable-link">
            Vezi toate issue-urile 
            <span class="link-arrow">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </a>
          <a href="https://github.com/Wildfiire/docs/pulls" 
             target="_blank" 
             class="widget-link clickable-link">
            Vezi toate PR-urile 
            <span class="link-arrow">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </a>
        </div>
      </div>
    </div>

    <!-- RIGHT SIDE - DESPRE CONTRIBUITORI (CENTRAT) -->
    <div class="text-zone">
      <div class="text-content">
        <!-- Header cu vertical line -->
        <div class="header-block scroll-reveal" 
             :style="{ animationDelay: '0.1s' }"
             ref="headerRef">
          <div class="vertical-line"></div>
          <div class="header-text">
            <span class="header-tag">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              COMUNITATE
            </span>
            <h2 class="main-title">
              <span class="title-static">DESPRE</span>
              <span class="title-gradient">CONTRIBUITORI</span>
            </h2>
          </div>
        </div>
        
        <!-- Description -->
        <div class="description-block scroll-reveal" 
             :style="{ animationDelay: '0.3s' }"
             ref="descRef">
          <p class="description-main">
            Documentația asta nu se scrie singură. În spatele ei sunt oameni care 
            au contribuit cu timp, cunoștințe și răbdare ca tu să ai toate informațiile la îndemână.
          </p>
          <p class="description-secondary">
            <span class="description-highlight">{{ formatNumber(repoStats.totalCommits) }} de commit-uri</span> au fost necesare 
            până acum. Unele au adăugat pagini noi, altele au corectat greșeli, 
            altele au clarificat explicații. Fiecare a contat.
          </p>
        </div>

        <!-- Cum poți contribui -->
        <div class="how-to-block">
          <div class="how-to-item scroll-reveal" 
               :style="{ animationDelay: '0.5s' }"
               ref="howToItem1Ref">
            <div class="how-to-svg">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5" fill="none"/>
                <path d="M21 21L17 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="how-to-content">
              <div class="how-to-header">
                <span class="how-to-tag">PASUL 01</span>
                <div class="how-to-line"></div>
              </div>
              <h3>Găsește ceva de îmbunătățit</h3>
              <p>O greșeală, un exemplu neclar, o pagină lipsă. Orice pagină poate fi mai bună.</p>
            </div>
          </div>
          
          <div class="how-to-item scroll-reveal" 
               :style="{ animationDelay: '0.7s' }"
               ref="howToItem2Ref">
            <div class="how-to-svg">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M6 5L18 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M6 12L18 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M6 19L18 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <circle cx="6" cy="5" r="2" fill="none" stroke="currentColor" stroke-width="1.5"/>
                <circle cx="18" cy="5" r="2" fill="none" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </div>
            <div class="how-to-content">
              <div class="how-to-header">
                <span class="how-to-tag">PASUL 02</span>
                <div class="how-to-line"></div>
              </div>
              <h3>Deschide un Pull Request</h3>
              <p>Fork, modifici, faci PR. Durează 5 minute și ajută pe toată lumea.</p>
            </div>
          </div>
          
          <div class="how-to-item scroll-reveal" 
               :style="{ animationDelay: '0.9s' }"
               ref="howToItem3Ref">
            <div class="how-to-svg">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M12 2L15 9H22L16 14L19 21L12 16.5L5 21L8 14L2 9H9L12 2Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
              </svg>
            </div>
            <div class="how-to-content">
              <div class="how-to-header">
                <span class="how-to-tag">PASUL 03</span>
                <div class="how-to-line"></div>
              </div>
              <h3>Apari în istoric</h3>
              <p>Contribuția ta rămâne în wiki și e vizibilă pentru toată lumea.</p>
            </div>
          </div>
        </div>

        <!-- Stats și CTA -->
        <div class="cta-block scroll-reveal" 
             :style="{ animationDelay: '1.1s' }"
             ref="ctaRef">
          <a href="https://github.com/Wildfiire/docs" target="_blank" class="cta-button primary clickable-button">
            <span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
            </span>
            <span>GitHub</span>
            <span class="button-arrow">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </a>
          <a href="/updates_wiki/contribute" class="cta-button secondary clickable-button">
            <span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </span>
            <span>Ghid contribuție</span>
            <span class="button-arrow">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WikiUpdatesGrid',
  
  data() {
    return {
      repoStats: {
        totalCommits: 0,
        contributors: 0,
        files: 0,
        stars: 0,
        openIssues: 0,
        openPRs: 0
      },
      topContributor: {
        login: '',
        contributions: 0,
        prs: 0
      },
      recentCommits: [],
      topContributors: [],
      recentIssues: [],
      recentPRs: [],
      isLoading: true,
      filterType: 'all',
      refreshInterval: null,
      observer: null,
      
      // Referințe pentru scroll reveal
      card1Ref: null,
      card2Ref: null,
      card3Ref: null,
      card4Ref: null,
      cardTop3Ref: null,
      issuesWidgetRef: null,
      headerRef: null,
      descRef: null,
      howToItem1Ref: null,
      howToItem2Ref: null,
      howToItem3Ref: null,
      ctaRef: null
    }
  },

  computed: {
    filteredIssues() {
      if (this.filterType === 'prs') return [];
      return this.recentIssues || [];
    },
    
    filteredPRs() {
      if (this.filterType === 'issues') return [];
      return this.recentPRs || [];
    },
    
    filteredItems() {
      if (this.filterType === 'issues') return this.recentIssues;
      if (this.filterType === 'prs') return this.recentPRs;
      return [...this.recentIssues, ...this.recentPRs];
    }
  },

  async mounted() {
    const githubToken = this.$githubToken || window.__GITHUB_TOKEN || import.meta.env.VITE_GITHUB_TOKEN
    
    if (!githubToken) {
      console.error('❌ Token GitHub lipsește! Verifică variabila VITE_GITHUB_TOKEN din .env');
      this.isLoading = false;
      return;
    }

    // Setează referințele într-un nextTick pentru a fi sigur că DOM-ul e gata
    this.$nextTick(() => {
      this.card1Ref = this.$refs.card1Ref;
      this.card2Ref = this.$refs.card2Ref;
      this.card3Ref = this.$refs.card3Ref;
      this.card4Ref = this.$refs.card4Ref;
      this.cardTop3Ref = this.$refs.cardTop3Ref;
      this.issuesWidgetRef = this.$refs.issuesWidgetRef;
      this.headerRef = this.$refs.headerRef;
      this.descRef = this.$refs.descRef;
      this.howToItem1Ref = this.$refs.howToItem1Ref;
      this.howToItem2Ref = this.$refs.howToItem2Ref;
      this.howToItem3Ref = this.$refs.howToItem3Ref;
      this.ctaRef = this.$refs.ctaRef;
      
      this.setupScrollReveal();
      
      // Aplică efectul inițial după un mic delay
      setTimeout(() => {
        this.applyRevealEffect();
      }, 100);
    });

    // Adaugă event listener pentru scroll
    window.addEventListener('scroll', this.handleScroll);

    // Funcție pentru pornirea fetch-ului și a refresh-urilor
    const startFetching = async () => {
      await this.fetchAllGitHubData(githubToken);

      // Refresh la 30 SECUNDE
      this.refreshInterval = setInterval(() => {
        this.fetchAllGitHubData(githubToken);
      }, 30000);

      // Refresh la focus
      window.addEventListener('focus', () => {
        this.fetchAllGitHubData(githubToken);
      });

      // Refresh la visibility change
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.fetchAllGitHubData(githubToken);
        }
      });

      // Aplică efectul de scroll după ce datele sunt încărcate
      setTimeout(() => {
        this.handleScroll();
      }, 500);
    };

    // Defer fetch until component enters viewport (300px margin ahead)
    if (typeof window !== 'undefined' && window.IntersectionObserver) {
      const fetchObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchObserver.disconnect();
          startFetching();
        }
      }, { rootMargin: '300px' });
      this.$nextTick(() => fetchObserver.observe(this.$el));
    } else {
      startFetching();
    }
  },

  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    if (this.observer) {
      this.observer.disconnect();
    }
  },

  methods: {
    async fetchAllGitHubData(token) {
      this.isLoading = true;
      
      const owner = 'Wildfiire';
      const repo = 'docs';
      const baseUrl = `https://api.github.com/repos/${owner}/${repo}`;
      
      const headers = {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      };

      // Cache buster
      const timestamp = Date.now();

      try {
        
        // ===== 1. FETCH COMMITS (ultimele 4) CU CACHE BUSTER =====
        const commitsRes = await fetch(`${baseUrl}/commits?per_page=4&_=${timestamp}`, { headers });
        if (commitsRes.ok) {
          const commits = await commitsRes.json();
          
          this.recentCommits = commits.map((commit, index) => ({
            id: commit.sha.substring(0, 7),
            message: commit.commit.message.split('\n')[0],
            emoji: this.getCommitEmoji(commit.commit.message),
            author: commit.author?.login || commit.commit.author.name,
            date: commit.commit.author.date,
            url: commit.html_url
          }));
          
        }

        // ===== 2. FETCH REPO INFO =====
        const repoRes = await fetch(`${baseUrl}?_=${timestamp}`, { headers });
        if (!repoRes.ok) throw new Error(`Repo error: ${repoRes.status}`);
        const repoData = await repoRes.json();
        
        // ===== 3. FETCH CONTRIBUTORS - METODĂ NOUĂ DIN COMMIT-URI =====
        
        let contributors = [];
        let totalContributors = 0;
        let topContributorsList = [];
        let topContributorData = null;
        
        try {
          // Luăm ultimele 500 commit-uri pentru a extrage toți contributorii
          let allCommits = [];
          let page = 1;
          let hasMore = true;
          
          while (hasMore && page <= 5) { // 5 pagini x 100 = 500 commit-uri
            const commitsPageRes = await fetch(
              `${baseUrl}/commits?per_page=100&page=${page}&_=${timestamp}`, 
              { headers }
            );
            
            if (commitsPageRes.ok) {
              const commitsPage = await commitsPageRes.json();
              if (commitsPage.length === 0) {
                hasMore = false;
              } else {
                allCommits = [...allCommits, ...commitsPage];
                page++;
              }
            } else {
              hasMore = false;
            }
          }
          
          // Creează un Map de contributori unici
          const contributorMap = new Map();
          
          allCommits.forEach(commit => {
            let login = null;
            let avatar = null;
            let html_url = null;
            
            if (commit.author) {
              login = commit.author.login;
              avatar = commit.author.avatar_url;
              html_url = commit.author.html_url;
            } else if (commit.committer) {
              login = commit.committer.login;
              avatar = commit.committer.avatar_url;
              html_url = commit.committer.html_url;
            } else {
              login = commit.commit.author.name?.replace(/\s+/g, '').toLowerCase();
              avatar = `https://github.com/${login}.png`;
              html_url = `https://github.com/${login}`;
            }
            
            if (login) {
              if (!contributorMap.has(login)) {
                contributorMap.set(login, {
                  login: login,
                  avatar_url: avatar,
                  html_url: html_url,
                  contributions: 1
                });
              } else {
                contributorMap.get(login).contributions++;
              }
            }
          });
          
          contributors = Array.from(contributorMap.values());
          totalContributors = contributors.length;
          
          
          // Sortează după contribuții
          const sorted = [...contributors].sort((a, b) => b.contributions - a.contributions);
          
          // Top 3 contribuitori
          topContributorsList = sorted.slice(0, 3).map(c => ({
            login: c.login,
            contributions: c.contributions
          }));
          
          // Top contributor
          if (sorted.length > 0) {
            topContributorData = sorted[0];
            
            // Încerci să calculezi PR-urile pentru top contributor
            try {
              const prsRes = await fetch(
                `https://api.github.com/search/issues?q=repo:${owner}/${repo}+type:pr+author:${topContributorData.login}&_=${timestamp}`, 
                { headers }
              );
              if (prsRes.ok) {
                const prsData = await prsRes.json();
                topContributorData.prs = prsData.total_count || 0;
              }
            } catch (e) {
            }
          }
          
        } catch (e) {
          console.error('❌ Eroare la extragerea contributorilor din commit-uri:', e);
        }

        // Setează top contributor
        this.topContributor = {
          login: topContributorData?.login || 'Niciun contributor',
          contributions: topContributorData?.contributions || 0,
          prs: topContributorData?.prs || 0
        };
        
        // Setează top 3 contribuitori
        this.topContributors = topContributorsList;

        // ===== 4. CALCULEAZĂ TOTAL COMMITS =====
        let totalCommits = 0;
        try {
          const allCommitsRes = await fetch(`${baseUrl}/commits?per_page=1&_=${timestamp}`, { headers });
          if (allCommitsRes.ok) {
            const allCommitsLink = allCommitsRes.headers.get('Link');
            if (allCommitsLink) {
              const match = allCommitsLink.match(/&page=(\d+)>; rel="last"/);
              if (match && match[1]) {
                totalCommits = parseInt(match[1], 10);
              }
            }
          }
        } catch (e) {
        }

        // ===== 5. FETCH TREE PENTRU NUMĂRUL DE FIȘIERE =====
        let totalFiles = 0;
        try {
          const treeRes = await fetch(`${baseUrl}/git/trees/main?recursive=1&_=${timestamp}`, { headers });
          if (treeRes.ok) {
            const treeData = await treeRes.json();
            totalFiles = treeData.tree?.filter(item => item.type === 'blob').length || 0;
          }
        } catch (e) {
        }

        // ===== 6. FETCH ISSUE-URI =====
        let openIssues = 0;
        let recentIssues = [];
        try {
          const issuesRes = await fetch(`${baseUrl}/issues?state=open&per_page=100&_=${timestamp}`, { headers });
          
          if (issuesRes.ok) {
            const allIssues = await issuesRes.json();
            const realIssues = allIssues.filter(issue => !issue.pull_request);
            openIssues = realIssues.length;
            
            // Recent issues (ultimele 5)
            recentIssues = realIssues.slice(0, 5).map(issue => ({
              id: issue.id,
              number: issue.number,
              title: issue.title,
              author: issue.user?.login,
              date: issue.updated_at,
              url: issue.html_url,
              comments: issue.comments,
              labels: issue.labels?.map(l => l.name) || [],
              repo: repo
            }));
            
          }
        } catch (e) {
        }

        // ===== 7. FETCH PR-URI =====
        let openPRs = 0;
        let recentPRs = [];
        try {
          const pullsRes = await fetch(`${baseUrl}/pulls?state=open&per_page=5&_=${timestamp}`, { headers });
          
          if (pullsRes.ok) {
            const prs = await pullsRes.json();
            openPRs = prs.length;
            recentPRs = prs.map(pr => ({
              id: pr.id,
              number: pr.number,
              title: pr.title,
              author: pr.user?.login,
              date: pr.updated_at,
              url: pr.html_url,
              state: pr.state,
              branch: pr.head?.ref,
              commits: pr.commits,
              labels: pr.labels?.map(l => l.name) || []
            }));
            
          }
        } catch (e) {
        }

        // Actualizează stats
        this.repoStats = {
          totalCommits: totalCommits,
          contributors: totalContributors,
          files: totalFiles,
          stars: repoData.stargazers_count || 0,
          openIssues: openIssues,
          openPRs: openPRs
        };

        this.recentIssues = recentIssues;
        this.recentPRs = recentPRs;


      } catch (error) {
        console.error('❌ Eroare la fetch date GitHub:', error);
      } finally {
        this.isLoading = false;
      }
    },

    getCommitEmoji(message) {
      const msg = message.toLowerCase();
      if (msg.includes('fix') || msg.includes('bug')) {
        return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
      }
      if (msg.includes('add') || msg.includes('nou')) {
        return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>';
      }
      if (msg.includes('update') || msg.includes('actualiz')) {
        return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>';
      }
      if (msg.includes('doc') || msg.includes('readme')) {
        return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>';
      }
      if (msg.includes('style') || msg.includes('css')) {
        return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><circle cx="15.5" cy="15.5" r="1.5"/></svg>';
      }
      if (msg.includes('refactor')) {
        return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>';
      }
      return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>';
    },

    formatNumber(num) {
      if (!num && num !== 0) return '0';
      if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
      return num.toString();
    },

    formatDate(date) {
      const d = new Date(date);
      const now = new Date();
      const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
      
      if (diff === 0) return 'azi';
      if (diff === 1) return 'ieri';
      if (diff < 7) return `acum ${diff} zile`;
      return d.toLocaleDateString('ro-RO', { 
        day: 'numeric', 
        month: 'short'
      });
    },

    openProfile(username) {
      if (username && username !== 'Niciun contributor') {
        window.open(`https://github.com/${username}`, '_blank');
      }
    },

    openCommit(url) {
      window.open(url, '_blank');
    },

    openIssue(url) {
      window.open(url, '_blank');
    },

    openPR(url) {
      window.open(url, '_blank');
    },

    openContributing() {
      window.location.href = '/updates_wiki/contribute';
    },

    getLabelColor(label) {
      const colors = {
        'bug': '#e74c3c',
        'feature': '#2ecc71',
        'enhancement': '#3498db',
        'documentation': '#f39c12',
        'help wanted': '#9b59b6',
        'good first issue': '#1abc9c',
        'question': '#e67e22',
        'duplicate': '#7f8c8d',
        'invalid': '#95a5a6',
        'wontfix': '#34495e'
      };
      return colors[label.toLowerCase()] || '#95a5a6';
    },

    toggleStar(item) {
    },

    refreshData() {
      const token = this.$githubToken || window.__GITHUB_TOKEN || import.meta.env.VITE_GITHUB_TOKEN;
      this.fetchAllGitHubData(token);
    },

    openNewIssue() {
      window.open('https://github.com/Wildfiire/docs/issues/new', '_blank');
    },

    openNewPR() {
      window.open('https://github.com/Wildfiire/docs/compare', '_blank');
    },

    isElementInViewport(el) {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      return rect.top < windowHeight * 0.85 && rect.bottom > 0;
    },

    applyRevealEffect() {
      const elements = [
        this.card1Ref,
        this.card2Ref,
        this.card3Ref,
        this.card4Ref,
        this.cardTop3Ref,
        this.issuesWidgetRef,
        this.headerRef,
        this.descRef,
        this.howToItem1Ref,
        this.howToItem2Ref,
        this.howToItem3Ref,
        this.ctaRef
      ].filter(el => el !== null && el !== undefined);

      elements.forEach(el => {
        if (this.isElementInViewport(el)) {
          el.classList.add('revealed');
        } else {
          el.classList.remove('revealed');
        }
      });
    },

    handleScroll() {
      this.applyRevealEffect();
    },

    setupScrollReveal() {
      // Folosim Intersection Observer pentru un effect mai smooth
      if (typeof window !== 'undefined' && window.IntersectionObserver) {
        this.observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
            }
          });
        }, {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        });

        // Observă toate elementele cu clasa scroll-reveal
        this.$nextTick(() => {
          document.querySelectorAll('.scroll-reveal').forEach(el => {
            this.observer.observe(el);
          });
        });
      }
    }
  }
}
</script>

<style scoped>
/* ===== FONT ORBITRON DOAR PENTRU TITLURI ȘI ELEMENTE IMPORTANTE ===== */
.header-tag,
.cards-title,
.contributor-name,
.contributor-badge,
.timeline-title,
.stats-quick-title,
.plus-title,
.widget-title,
.widget-badge,
.top3-title,
.top3-badge,
.main-title,
.title-static,
.title-gradient,
.how-to-tag,
.how-to-content h4,
.cta-button,
.view-all-updates-btn,
.stat-chip,
.item-badge,
.quick-action-btn,
.widget-link,
.top3-name,
.rank-badge,
.contributor-link,
.plus-link,
.top3-link,
.timeline-author,
.stat-label {
  font-family: 'Orbitron', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
  letter-spacing: 0.3px;
}

/* Ajustări individuale pentru diferite greutăți */
.header-tag {
  font-weight: 600 !important;
  letter-spacing: 3px;
  text-transform: uppercase;
  font-size: 12px;
}

.cards-title {
  font-weight: 600 !important;
  font-size: 24px;
}

.contributor-name {
  font-weight: 700 !important;
  font-size: 28px;
}

.contributor-badge {
  font-weight: 600 !important;
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  background: #ff4500;
  color: white;
  padding: 4px 12px;
  border-radius: 30px;
  display: inline-block;
}

.timeline-title,
.stats-quick-title,
.plus-title,
.widget-title,
.top3-title {
  font-weight: 600 !important;
  font-size: 16px;
}

.widget-badge,
.top3-badge {
  font-weight: 600 !important;
  font-size: 10px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.main-title {
  font-weight: 800 !important;
  font-size: 42px;
  line-height: 1.2;
}

.title-static {
  font-weight: 700 !important;
  display: block;
}

.title-gradient {
  font-weight: 800 !important;
  background: linear-gradient(135deg, #ff4500, #ff8c00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
}

.how-to-tag {
  font-weight: 600 !important;
  font-size: 8px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.how-to-content h4 {
  font-weight: 600 !important;
  font-size: 14px;
}

.cta-button,
.view-all-updates-btn {
  font-weight: 500 !important;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-chip {
  font-weight: 500 !important;
  font-size: 10px;
  text-transform: uppercase;
}

.item-badge {
  font-weight: 600 !important;
  font-size: 8px;
  text-transform: uppercase;
}

.quick-action-btn {
  font-weight: 500 !important;
  font-size: 9px;
  text-transform: uppercase;
}

.widget-link {
  font-weight: 500 !important;
  font-size: 9px;
  text-transform: uppercase;
}

.top3-name {
  font-weight: 600 !important;
  font-size: 14px;
}

.rank-badge {
  font-weight: 700 !important;
  font-size: 12px;
}

.contributor-link,
.plus-link,
.top3-link {
  font-weight: 500 !important;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.timeline-author {
  font-weight: 500 !important;
  font-size: 11px;
  color: #ff4500;
}

.stat-label {
  font-weight: 400 !important;
  font-size: 11px;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
}

/* ===== EFFECT DE SCROLL REVEAL ===== */
.scroll-reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s cubic-bezier(0.2, 0.9, 0.3, 1), 
              transform 0.8s cubic-bezier(0.2, 0.9, 0.3, 1);
  will-change: opacity, transform;
}

.scroll-reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* Staggered delays for children inside cards */
.card-timeline .timeline-item {
  opacity: 0;
  transform: translateX(-10px);
  animation: itemReveal 0.5s ease forwards;
  animation-play-state: paused;
}

.card-timeline.revealed .timeline-item {
  animation-play-state: running;
}

.card-timeline.revealed .timeline-item:nth-child(1) {
  animation-delay: 0.1s;
}

.card-timeline.revealed .timeline-item:nth-child(2) {
  animation-delay: 0.3s;
}

.card-timeline.revealed .timeline-item:nth-child(3) {
  animation-delay: 0.5s;
}

.card-timeline.revealed .timeline-item:nth-child(4) {
  animation-delay: 0.7s;
}

@keyframes itemReveal {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Stats items staggered reveal */
.card-stats-quick.revealed .stats-quick-item {
  animation: statsPop 0.4s cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
  opacity: 0;
  transform: scale(0.9);
}

.card-stats-quick.revealed .stats-quick-item:nth-child(1) {
  animation-delay: 0.1s;
}

.card-stats-quick.revealed .stats-quick-item:nth-child(2) {
  animation-delay: 0.2s;
}

.card-stats-quick.revealed .stats-quick-item:nth-child(3) {
  animation-delay: 0.3s;
}

.card-stats-quick.revealed .stats-quick-item:nth-child(4) {
  animation-delay: 0.4s;
}

@keyframes statsPop {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ===== CONTAINER PRINCIPAL ===== */
.wiki-home-updates {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 60px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 40px;
}

/* ===== LEFT ZONE ===== */
.cards-zone {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.cards-header {
  margin-bottom: 10px;
}

.header-decoration {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.header-line {
  width: 30px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ff4500, #ff8c00, transparent);
}

.header-tag {
  font-size: 11px;
  color: #ff4500;
  text-transform: uppercase;
}

.cards-title {
  font-size: 24px;
  margin: 0;
  color: var(--vp-c-text-1);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

/* ===== FEATURE CARDS ===== */
.feature-card {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-6px);
}

/* Glow */
.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, rgba(255, 69, 0, 0.3), transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: 1;
}

.feature-card:hover .card-glow {
  opacity: 0.6;
}

/* Gradient border */
.card-border {
  position: absolute;
  inset: 0;
  border-radius: 24px;
  padding: 1px;
  background: linear-gradient(145deg, rgba(255, 69, 0, 0.3), #ff4500, transparent);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0.3;
  transition: opacity 0.3s ease;
}

.feature-card:hover .card-border {
  opacity: 1;
}

/* ===== ELEMENTE CLICKABLE ===== */
.clickable-card {
  cursor: pointer;
  position: relative;
}

.clickable-card:hover .click-indicator {
  opacity: 1;
  transform: scale(1);
}

.click-indicator {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 69, 0, 0.2);
  backdrop-filter: blur(4px);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 69, 0, 0.3);
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: #ff4500;
}

.click-indicator svg {
  width: 18px;
  height: 18px;
}

.clickable-item {
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.clickable-item:hover {
  background: rgba(255, 69, 0, 0.15);
  transform: translateX(4px);
}

.clickable-item:hover .item-click-icon {
  opacity: 1;
  transform: translateX(0);
}

.item-click-icon {
  opacity: 0;
  transform: translateX(-5px);
  transition: all 0.2s ease;
  color: #ff4500;
  margin-left: 4px;
  display: flex;
  align-items: center;
}

.item-click-icon svg {
  width: 16px;
  height: 16px;
}

.clickable-link {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  position: relative;
  padding: 4px 8px;
  border-radius: 20px;
  text-decoration: none;
  color: #ff4500;
}

.clickable-link:hover {
  color: white !important;
  background: #ff4500;
  gap: 10px;
  padding: 4px 12px;
}

.clickable-link:hover .link-arrow svg {
  transform: translateX(4px);
}

.link-arrow {
  display: inline-flex;
  align-items: center;
}

.link-arrow svg {
  transition: transform 0.2s ease;
}

.clickable-footer {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  text-decoration: none;
  padding: 10px;
  border-radius: 30px;
}

.clickable-footer:hover {
  background: rgba(255, 69, 0, 0.15);
  gap: 12px;
}

.clickable-footer:hover .footer-arrow {
  transform: translateX(4px);
}

.footer-arrow {
  transition: transform 0.2s ease;
}

.clickable-button {
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.clickable-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(255, 69, 0, 0.4);
}

.clickable-button:hover .button-arrow svg {
  transform: translateX(4px);
}

.button-arrow {
  display: inline-flex;
  align-items: center;
}

.button-arrow svg {
  transition: transform 0.3s ease;
}

/* ===== CARD 1: TOP CONTRIBUTOR ===== */
.card-contributor {
  grid-column: span 2;
  background: linear-gradient(145deg, rgba(255, 69, 0, 0.1), rgba(255, 140, 0, 0.05));
  backdrop-filter: blur(10px);
  padding: 24px;
}

.dark .card-contributor {
  background: linear-gradient(145deg, rgba(255, 69, 0, 0.15), rgba(0, 0, 0, 0.3));
}

.contributor-header {
  display: flex;
  gap: 24px;
  align-items: center;
  margin-bottom: 20px;
}

.contributor-avatar {
  position: relative;
  width: 80px;
  height: 80px;
}

.contributor-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid #ff4500;
  position: relative;
  z-index: 2;
}

.avatar-ring {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border-radius: 50%;
  border: 1px solid #ff4500;
  animation: ringPulse 2s infinite;
}

@keyframes ringPulse {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.2); opacity: 0; }
}

.avatar-crown {
  position: absolute;
  top: -15px;
  right: -10px;
  font-size: 24px;
  transform: rotate(15deg);
  filter: drop-shadow(0 4px 8px gold);
  z-index: 3;
}

.avatar-crown svg {
  width: 24px;
  height: 24px;
}

.contributor-info {
  flex: 1;
}

.contributor-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #ff4500;
  color: white;
  border-radius: 30px;
  font-size: 11px;
  margin-bottom: 8px;
}

.contributor-name {
  font-size: 28px;
  margin: 0 0 8px;
  color: var(--vp-c-text-1);
}

.contributor-stats {
  display: flex;
  gap: 20px;
}

.contributor-stat {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-icon {
  display: inline-flex;
  align-items: center;
  opacity: 0.8;
}

.stat-icon svg {
  width: 14px;
  height: 14px;
  stroke: currentColor;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #ff4500;
}

.stat-label {
  font-size: 11px;
  color: var(--vp-c-text-2);
}

.contributor-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 69, 0, 0.2);
}

.contributor-quote {
  font-style: italic;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.contributor-link {
  color: #ff4500;
  text-decoration: none;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* ===== CARD 2: TIMELINE ===== */
.card-timeline {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  padding: 20px;
}

.dark .card-timeline {
  background: rgba(0, 0, 0, 0.3);
}

.timeline-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.timeline-icon {
  display: inline-flex;
  align-items: center;
}

.timeline-icon svg {
  width: 20px;
  height: 20px;
  stroke: #ff4500;
}

.timeline-title {
  font-size: 16px;
  margin: 0;
  color: var(--vp-c-text-1);
}

.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.timeline-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 8px;
  border-radius: 12px;
}

.timeline-dot {
  width: 8px;
  height: 8px;
  background: #ff4500;
  border-radius: 50%;
  margin-top: 6px;
  animation: dotPulse 2s infinite;
  opacity: 0;
}

@keyframes dotPulse {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.3); }
  100% { opacity: 1; transform: scale(1); }
}

.timeline-content {
  flex: 1;
}

.timeline-top {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
  align-items: center;
}

.timeline-emoji {
  display: inline-flex;
  align-items: center;
}

.timeline-emoji svg {
  width: 14px;
  height: 14px;
  stroke: #ff4500;
}

.timeline-message {
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.timeline-meta {
  display: flex;
  gap: 12px;
  font-size: 11px;
}

.timeline-author {
  color: #ff4500;
}

.timeline-date {
  color: var(--vp-c-text-3);
}

/* ===== CARD 3: STATS RAPIDE ===== */
.card-stats-quick {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  padding: 20px;
}

.stats-quick-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.stats-quick-icon {
  display: inline-flex;
  align-items: center;
}

.stats-quick-icon svg {
  width: 20px;
  height: 20px;
  stroke: #ff4500;
}

.stats-quick-title {
  font-size: 16px;
  margin: 0;
  color: var(--vp-c-text-1);
}

.stats-quick-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stats-quick-item {
  text-align: center;
  padding: 12px;
  background: rgba(255, 69, 0, 0.05);
  border-radius: 12px;
  transition: all 0.2s;
}

.stats-quick-item:hover {
  background: rgba(255, 69, 0, 0.1);
  transform: scale(1.05);
}

.stats-quick-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #ff4500;
  line-height: 1.2;
}

.stats-quick-label {
  font-size: 11px;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
}

/* ===== CARD 4: PLUS ===== */
.card-plus {
  background: linear-gradient(145deg, rgba(255, 69, 0, 0.05), rgba(255, 140, 0, 0.02));
  backdrop-filter: blur(10px);
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.plus-content {
  text-align: center;
}

.plus-icon {
  margin-bottom: 12px;
  animation: pulse 2s infinite;
}

.plus-icon svg {
  width: 48px;
  height: 48px;
  stroke: #ff4500;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.plus-title {
  font-size: 18px;
  margin: 0 0 8px;
  color: var(--vp-c-text-1);
}

.plus-description {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin: 0 0 12px;
}

.plus-stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.plus-stat {
  background: rgba(255, 69, 0, 0.05);
  padding: 4px 8px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: center;
}

.plus-stat svg {
  width: 12px;
  height: 12px;
  stroke: currentColor;
}

.plus-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #ff4500;
  font-size: 13px;
  padding: 8px 16px;
  border: 1px solid rgba(255, 69, 0, 0.3);
  border-radius: 30px;
  text-decoration: none;
}

/* ===== ISSUES & PR WIDGET ===== */
.issues-widget {
  padding: 16px;
  margin-top: 16px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
}

.dark .issues-widget {
  background: rgba(0, 0, 0, 0.3);
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 69, 0, 0.15);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.widget-icon {
  display: inline-flex;
  align-items: center;
}

.widget-icon svg {
  width: 16px;
  height: 16px;
  stroke: #ff4500;
}

.widget-title {
  font-size: 13px;
  margin: 0;
  color: var(--vp-c-text-1);
}

.widget-badge {
  background: linear-gradient(135deg, #ff4500, #ff8c00);
  color: white;
  padding: 3px 8px;
  border-radius: 30px;
  font-size: 10px;
}

.widget-stats-bar {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
  padding: 2px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 40px;
  border: 1px solid rgba(255, 69, 0, 0.1);
}

.stat-chip {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 4px 6px;
  background: transparent;
  border: none;
  border-radius: 30px;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 10px;
}

.stat-chip.active {
  background: rgba(255, 69, 0, 0.15);
  color: #ff4500;
}

.chip-count {
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 5px;
  border-radius: 20px;
  font-size: 9px;
  margin-left: 2px;
}

.chip-icon {
  display: inline-flex;
  align-items: center;
}

.chip-icon.issue svg {
  stroke: #3498db;
}

.chip-icon.pr svg {
  stroke: #2ecc71;
}

.chip-count.issue {
  background: rgba(52, 152, 219, 0.15);
  color: #3498db;
  border: 1px solid rgba(52, 152, 219, 0.3);
}

.chip-count.pr {
  background: rgba(46, 204, 113, 0.15);
  color: #2ecc71;
  border: 1px solid rgba(46, 204, 113, 0.3);
}

.stat-chip.active .chip-count.issue,
.stat-chip.active .chip-count.pr {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.widget-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.widget-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 30px;
  border: 1px solid rgba(255, 69, 0, 0.1);
  transition: all 0.2s ease;
  min-height: 32px;
}

.list-item:hover {
  background: rgba(255, 69, 0, 0.1);
  transform: translateX(4px);
  border-color: rgba(255, 69, 0, 0.3);
}

.item-avatar {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}

.item-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1.5px solid #ff4500;
  object-fit: cover;
}

.item-badge {
  padding: 2px 5px;
  border-radius: 30px;
  font-size: 8px;
  white-space: nowrap;
  flex-shrink: 0;
}

.item-badge.issue {
  background: rgba(52, 152, 219, 0.15);
  color: #3498db;
  border: 1px solid rgba(52, 152, 219, 0.3);
}

.item-badge.pr {
  background: rgba(46, 204, 113, 0.15);
  color: #2ecc71;
  border: 1px solid rgba(46, 204, 113, 0.3);
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 1px;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 8px;
  color: var(--text-tertiary);
  line-height: 1.2;
}

.item-meta span:first-child {
  color: #ff4500;
}

.item-button {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 69, 0, 0.1);
  border: 1px solid rgba(255, 69, 0, 0.2);
  border-radius: 50%;
  color: #ff4500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  padding: 0;
}

.item-button svg {
  width: 12px;
  height: 12px;
}

.item-button:hover {
  background: #ff4500;
  color: white;
  transform: scale(1.05);
}

.empty-section {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 30px;
  border: 1px dashed rgba(255, 69, 0, 0.2);
  color: var(--text-tertiary);
  font-size: 9px;
  justify-content: center;
  min-height: 32px;
}

.empty-section svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
}

.quick-actions {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
}

.quick-action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 4px 6px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 69, 0, 0.2);
  border-radius: 30px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 9px;
}

.quick-action-btn svg {
  width: 12px;
  height: 12px;
  stroke: currentColor;
}

.quick-action-btn:hover {
  background: rgba(255, 69, 0, 0.1);
  border-color: #ff4500;
  color: #ff4500;
}

.widget-footer {
  display: flex;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 69, 0, 0.15);
}

.widget-link {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 4px 8px;
  background: rgba(255, 69, 0, 0.05);
  border: 1px solid rgba(255, 69, 0, 0.2);
  border-radius: 30px;
  color: #ff4500;
  font-size: 9px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.widget-link:hover {
  background: rgba(255, 69, 0, 0.1);
  gap: 5px;
}

.widget-link:hover .link-arrow svg {
  transform: translateX(4px);
}

.link-arrow {
  display: inline-flex;
  align-items: center;
}

.link-arrow svg {
  transition: transform 0.2s ease;
}

/* ===== RIGHT ZONE ===== */
.text-zone {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.text-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 480px;
  margin-left: 0;
  margin-right: auto;
  width: 100%;
}

/* Header block */
.header-block {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.vertical-line {
  width: 4px;
  height: 80px;
  background: linear-gradient(to bottom, #ff4500, #ff8c00, transparent);
  margin-top: 8px;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.header-tag {
  font-size: 12px;
  letter-spacing: 3px;
  color: #ff4500;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 6px;
}

.header-tag svg {
  width: 12px;
  height: 12px;
  stroke: currentColor;
}

.main-title {
  font-size: 42px;
  margin: 0;
  color: var(--vp-c-text-1);
  line-height: 1.2;
}

.title-static {
  display: block;
}

.title-gradient {
  background: linear-gradient(135deg, #ff4500, #ff8c00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
}

/* Description */
.description-block {
  padding-left: 24px;
}

.description-main {
  font-size: 16px;
  line-height: 1.7;
  color: var(--vp-c-text-1);
  margin: 0 0 12px;
  border-left: 2px solid rgba(255, 69, 0, 0.3);
  padding-left: 20px;
}

.description-secondary {
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0;
  padding-left: 20px;
}

.description-highlight {
  color: #ff4500;
  font-weight: 600;
}

/* ===== HOW TO ===== */
.how-to-block {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-left: 20px;
  margin: 15px 0 20px;
  position: relative;
}

.how-to-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  position: relative;
  padding-bottom: 18px;
  transition: all 0.3s ease;
}

.how-to-item:hover {
  transform: translateX(5px);
}

.how-to-item:hover::after {
  opacity: 1;
  height: 20px;
  width: 3px;
  box-shadow: 0 0 6px rgba(255, 69, 0, 0.5);
}

.how-to-item:last-child {
  padding-bottom: 0;
}

.how-to-svg {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 69, 0, 0.05);
  border: 1.5px solid rgba(255, 69, 0, 0.3);
  border-radius: 50%;
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 69, 0, 0.1);
}

.how-to-item:hover .how-to-svg {
  background: #ff4500;
  border-color: #ff4500;
  box-shadow: 0 4px 12px rgba(255, 69, 0, 0.3);
  transform: scale(1.03);
}

.how-to-svg svg {
  width: 18px;
  height: 18px;
  stroke: #ff4500;
  stroke-width: 2;
  transition: all 0.3s ease;
}

.how-to-item:hover .how-to-svg svg {
  stroke: white;
}

.how-to-content {
  flex: 1;
  padding-top: 3px;
}

.how-to-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.how-to-tag {
  font-size: 8px;
  letter-spacing: 1px;
  color: #ff4500;
  text-transform: uppercase;
  background: rgba(255, 69, 0, 0.1);
  padding: 1px 6px;
  border-radius: 16px;
  border: 1px solid rgba(255, 69, 0, 0.2);
  line-height: 1.2;
  white-space: nowrap;
}

.how-to-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, #ff4500, transparent);
  opacity: 0.3;
  transition: opacity 0.3s ease;
}

.how-to-item:hover .how-to-line {
  opacity: 0.8;
}

.how-to-content h4 {
  font-size: 14px;
  margin: 0 0 3px;
  color: var(--vp-c-text-1);
  transition: color 0.2s ease;
}

.how-to-item:hover .how-to-content h4 {
  color: #ff4500;
}

.how-to-content p {
  font-size: 12px;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.4;
}

/* Dark mode adjustments */
.dark .how-to-svg {
  background: rgba(20, 20, 20, 0.9);
  border-color: rgba(255, 69, 0, 0.5);
}

.dark .how-to-item:hover .how-to-svg {
  background: #ff4500;
  border-color: #ff4500;
}

/* CTA */
.cta-block {
  display: flex;
  gap: 10px;
  padding-left: 24px;
  margin-top: 10px;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 30px;
  font-size: 13px;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
}

.cta-button.primary {
  background: linear-gradient(135deg, #ff4500, #ff8c00);
  color: white;
  border: none;
}

.cta-button.secondary {
  background: rgba(255, 69, 0, 0.1);
  border: 1px solid rgba(255, 69, 0, 0.3);
  color: var(--vp-c-text-1);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px -5px rgba(255, 69, 0, 0.4);
}

.cta-button.secondary:hover {
  background: #ff4500;
  color: white;
}

.cta-button:hover .button-arrow svg {
  transform: translateX(4px);
}

.cta-button svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
}

.button-arrow {
  display: inline-flex;
  align-items: center;
}

.button-arrow svg {
  width: 14px;
  height: 14px;
  transition: transform 0.2s ease;
}

/* ===== BUTON SEPARAT PENTRU VIEW ALL UPDATES ===== */
.view-all-updates-wrapper {
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 69, 0, 0.15);
  width: 100%;
}

.view-all-updates-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 69, 0, 0.25);
  border-radius: 30px;
  color: #ff4500;
  font-size: 12px;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  backdrop-filter: blur(4px);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.3px;
}

.dark .view-all-updates-btn {
  background: rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 69, 0, 0.3);
}

.view-all-updates-btn:hover {
  background: rgba(255, 69, 0, 0.1);
  border-color: #ff4500;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(255, 69, 0, 0.2);
}

.view-all-updates-btn .btn-arrow {
  display: inline-flex;
  align-items: center;
}

.view-all-updates-btn .btn-arrow svg {
  width: 14px;
  height: 14px;
  transition: transform 0.2s ease;
}

.view-all-updates-btn:hover .btn-arrow svg {
  transform: translateX(4px);
}

/* ===== LOADING ===== */
.timeline-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 69, 0, 0.3);
  border-top-color: #ff4500;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 1100px) {
  .wiki-home-updates {
    grid-template-columns: 1fr;
    gap: 60px;
  }
  
  .text-content {
    margin-left: 0;
    margin-right: auto;
    max-width: 600px;
  }
  
  .widget-content {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .widget-footer {
    flex-direction: column;
  }
  
  .widget-link {
    width: 100%;
  }
}

@media (max-width: 700px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
  
  .card-contributor {
    grid-column: span 1;
  }
  
  .contributor-header {
    flex-direction: column;
    text-align: center;
  }
  
  .contributor-stats {
    justify-content: center;
  }
  
  .main-title {
    font-size: 36px;
  }
  
  .header-block {
    flex-direction: column;
    gap: 10px;
  }
  
  .vertical-line {
    width: 80px;
    height: 4px;
  }
  
  .cta-block {
    flex-direction: column;
  }
  
  .click-indicator {
    display: none;
  }
  
  .text-content {
    max-width: 100%;
    padding: 0 20px;
  }
  
  .list-item {
    flex-wrap: wrap;
  }
  
  .item-meta {
    gap: 8px;
  }
  
  .item-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .widget-stats-bar {
    flex-wrap: wrap;
  }
}

/* ===== CARD TOP 3 CONTRIBUITORI ===== */
.card-top3 {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  padding: 18px;
}

.dark .card-top3 {
  background: rgba(0, 0, 0, 0.3);
}

.top3-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
}

.top3-icon {
  display: inline-flex;
  align-items: center;
}

.top3-icon svg {
  width: 20px;
  height: 20px;
  stroke: #ff4500;
}

.top3-title {
  font-size: 15px;
  margin: 0;
  color: var(--vp-c-text-1);
  flex: 1;
}

.top3-badge {
  background: linear-gradient(135deg, #ff4500, #ff8c00);
  color: white;
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 10px;
}

.top3-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.top3-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 69, 0, 0.1);
  background: rgba(0, 0, 0, 0.2);
}

.top3-item.gold {
  background: linear-gradient(90deg, rgba(255, 215, 0, 0.15), rgba(255, 215, 0, 0.05));
  border-color: rgba(255, 215, 0, 0.3);
}

.top3-item.silver {
  background: linear-gradient(90deg, rgba(192, 192, 192, 0.15), rgba(192, 192, 192, 0.05));
  border-color: rgba(192, 192, 192, 0.3);
}

.top3-item.bronze {
  background: linear-gradient(90deg, rgba(205, 127, 50, 0.15), rgba(205, 127, 50, 0.05));
  border-color: rgba(205, 127, 50, 0.3);
}

.top3-item.placeholder-item {
  opacity: 0.6;
  cursor: default;
  background: rgba(0, 0, 0, 0.1);
}

.top3-item:hover:not(.placeholder-item) {
  transform: translateX(5px);
  border-color: #ff4500;
}

.top3-rank {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rank-badge {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.rank-badge.rank-1 {
  background: linear-gradient(135deg, #FFD700, #FDB931);
  color: #000;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.4);
}

.rank-badge.rank-2 {
  background: linear-gradient(135deg, #C0C0C0, #E8E8E8);
  color: #333;
  box-shadow: 0 2px 8px rgba(192, 192, 192, 0.4);
}

.rank-badge.rank-3 {
  background: linear-gradient(135deg, #CD7F32, #B87333);
  color: #fff;
  box-shadow: 0 2px 8px rgba(205, 127, 50, 0.4);
}

.rank-badge.rank-placeholder {
  background: rgba(255, 255, 255, 0.1);
  color: #666;
  border: 1px dashed rgba(255, 69, 0, 0.3);
}

.top3-avatar {
  position: relative;
  width: 32px;
  height: 32px;
}

.top3-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid #ff4500;
  object-fit: cover;
}

.placeholder-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 69, 0, 0.1);
  border-radius: 50%;
  border: 2px dashed rgba(255, 69, 0, 0.3);
  color: #ff4500;
}

.placeholder-avatar svg {
  width: 20px;
  height: 20px;
  opacity: 0.5;
  stroke: currentColor;
}

.avatar-glow {
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #ff4500, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.top3-item:hover .avatar-glow {
  opacity: 0.5;
}

.top3-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.top3-name {
  font-size: 14px;
  color: var(--vp-c-text-1);
  line-height: 1.3;
}

.placeholder-name {
  color: #666;
  font-style: italic;
}

.top3-commits {
  font-size: 11px;
  color: #ff8c00;
}

.placeholder-commits {
  color: #444;
}

.top3-arrow {
  display: flex;
  align-items: center;
  opacity: 0;
  transform: translateX(-5px);
  transition: all 0.2s ease;
}

.top3-arrow svg {
  width: 16px;
  height: 16px;
  stroke: #ff4500;
}

.top3-item:hover:not(.placeholder-item) .top3-arrow {
  opacity: 1;
  transform: translateX(0);
}

.top3-footer {
  display: flex;
  justify-content: center;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 69, 0, 0.15);
  margin-top: 4px;
}

.top3-link {
  color: #ff4500;
  text-decoration: none;
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.top3-link:hover {
  gap: 8px;
}

.top3-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px;
  justify-content: center;
  color: var(--vp-c-text-2);
}

/* Animații pentru top3 */
.card-top3.revealed .top3-item {
  animation: slideInRight 0.5s ease forwards;
  opacity: 0;
  transform: translateX(-15px);
}

.card-top3.revealed .top3-item:nth-child(1) {
  animation-delay: 0.1s;
}

.card-top3.revealed .top3-item:nth-child(2) {
  animation-delay: 0.2s;
}

.card-top3.revealed .top3-item:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes slideInRight {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Coloane pentru grid */
.left-column, .right-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* List transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.list-move {
  transition: transform 0.3s ease;
}

:root:not(.dark) .feature-card,
:root:not(.dark) .card-timeline,
:root:not(.dark) .card-stats-quick,
:root:not(.dark) .card-plus,
:root:not(.dark) .card-top3,
:root:not(.dark) .issues-widget {
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
}
</style>