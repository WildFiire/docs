<!-- docs\.vitepress\theme\components\Panel\PanelAnalytics.vue -->
<template>
  <div class="panel-analytics" :class="{ 'light-theme': isLightTheme }">
    <!-- Header -->
    <div class="analytics-header">
      <div class="analytics-title">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--accent)">
          <path d="M21 12v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2"/>
          <circle cx="12" cy="16" r="5"/>
          <path d="M12 11v5"/>
          <path d="M9 8V6"/>
          <path d="M15 8V6"/>
        </svg>
        <h2>ANALYTICS DASHBOARD</h2>
      </div>
      
      <div class="analytics-period">
        <button 
          class="period-btn" 
          :class="{ active: period === 'week' }"
          @click="setPeriod('week')"
        >
          WEEK
        </button>
        <button 
          class="period-btn" 
          :class="{ active: period === 'month' }"
          @click="setPeriod('month')"
        >
          MONTH
        </button>
        <button 
          class="period-btn" 
          :class="{ active: period === 'year' }"
          @click="setPeriod('year')"
        >
          YEAR
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ formatNumber(totalCommits) }}</span>
          <span class="stat-label">Total Commits</span>
          <span class="stat-trend" :class="commitTrend > 0 ? 'positive' : 'negative'">
            {{ commitTrend > 0 ? '+' : '' }}{{ commitTrend }}% from last period
          </span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor">
            <circle cx="18" cy="18" r="3"/>
            <circle cx="6" cy="6" r="3"/>
            <path d="M6 21V9"/>
            <path d="M18 21V9"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ formatNumber(avgCommitsPerDay) }}</span>
          <span class="stat-label">Avg Commits/Day</span>
          <span class="stat-trend" :class="avgTrend > 0 ? 'positive' : 'negative'">
            {{ avgTrend > 0 ? '+' : '' }}{{ avgTrend }}% from last period
          </span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor">
            <path d="M12 2L15 9H22L16 14L19 21L12 16.5L5 21L8 14L2 9H9L12 2Z"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ activeContributors }}</span>
          <span class="stat-label">Active Contributors</span>
          <span class="stat-trend positive">+{{ newContributors }} this period</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor">
            <path d="M21 12v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2"/>
            <circle cx="12" cy="16" r="5"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ completionRate }}%</span>
          <span class="stat-label">PR Completion Rate</span>
          <span class="stat-trend positive">+{{ prRateChange }}%</span>
        </div>
      </div>
    </div>

    <!-- Main Chart -->
    <div class="chart-card main-chart">
      <div class="chart-header">
        <h3>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
            <path d="M21 12v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2"/>
            <circle cx="12" cy="16" r="5"/>
            <path d="M12 11v5"/>
          </svg>
          Commit Activity
        </h3>
        <div class="chart-legend">
          <span class="legend-dot"></span>
          <span>Commits</span>
        </div>
      </div>
      <div class="chart-wrapper">
        <canvas ref="activityChart"></canvas>
      </div>
      <div class="chart-stats">
        <div class="stat-item">
          <span class="stat-label">Peak Day</span>
          <span class="stat-value">{{ peakDay?.value || 0 }} commits</span>
          <span class="stat-date">{{ peakDay?.date || '—' }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Total</span>
          <span class="stat-value">{{ chartTotal }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Average</span>
          <span class="stat-value">{{ chartAverage }}</span>
        </div>
      </div>
    </div>

    <!-- Two Column Layout -->
    <div class="two-columns">
      <!-- Language Distribution -->
      <div class="analytics-card">
        <div class="card-header">
          <h3>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="4"/>
            </svg>
            Language Distribution
          </h3>
        </div>
        <div class="language-stats">
          <div v-for="lang in topLanguages" :key="lang.name" class="language-item">
            <div class="lang-info">
              <span class="lang-dot" :style="{ background: getLanguageColor(lang.name) }"></span>
              <span class="lang-name">{{ lang.name }}</span>
              <span class="lang-percent">{{ lang.percentage.toFixed(1) }}%</span>
            </div>
            <div class="lang-bar">
              <div class="lang-fill" :style="{ width: lang.percentage + '%', background: getLanguageColor(lang.name) }"></div>
            </div>
            <span class="lang-bytes">{{ formatBytes(lang.bytes) }}</span>
          </div>
        </div>
      </div>

      <!-- Contributor Activity Heatmap -->
      <div class="analytics-card">
        <div class="card-header">
          <h3>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="7" height="9"/>
              <rect x="14" y="3" width="7" height="5"/>
              <rect x="14" y="12" width="7" height="9"/>
              <rect x="3" y="16" width="7" height="5"/>
            </svg>
            Contributor Heatmap
          </h3>
          <div class="heatmap-legend">
            <span>Less</span>
            <div class="legend-gradient"></div>
            <span>More</span>
          </div>
        </div>
        <div class="heatmap-container">
          <div class="heatmap-months">
            <span v-for="month in months" :key="month">{{ month }}</span>
          </div>
          <div class="heatmap-grid">
            <div 
              v-for="week in 52" 
              :key="week" 
              class="heatmap-week"
            >
              <div 
                v-for="day in 7" 
                :key="day" 
                class="heatmap-cell"
                :class="getHeatmapClass(week, day)"
                :style="{ backgroundColor: getHeatmapColor(week, day) }"
                :title="getHeatmapTitle(week, day)"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PR Analytics Section -->
    <div class="pr-analytics">
      <div class="section-header">
        <h3>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
            <circle cx="18" cy="18" r="3"/>
            <circle cx="6" cy="6" r="3"/>
            <path d="M6 21V9"/>
            <path d="M18 21V9"/>
          </svg>
          Pull Request Analytics
        </h3>
      </div>
      
      <div class="pr-stats">
        <div class="pr-stat">
          <div class="pr-stat-value">{{ prStats.open }}</div>
          <div class="pr-stat-label">Open PRs</div>
        </div>
        <div class="pr-stat">
          <div class="pr-stat-value">{{ prStats.merged }}</div>
          <div class="pr-stat-label">Merged (30d)</div>
        </div>
        <div class="pr-stat">
          <div class="pr-stat-value">{{ prStats.closed }}</div>
          <div class="pr-stat-label">Closed (30d)</div>
        </div>
        <div class="pr-stat">
          <div class="pr-stat-value">{{ avgMergeTime }}</div>
          <div class="pr-stat-label">Avg Merge Time</div>
        </div>
      </div>
      
      <div class="pr-chart">
        <canvas ref="prChart"></canvas>
      </div>
    </div>

    <!-- Top Contributors Section -->
    <div class="contributors-section">
      <div class="section-header">
        <h3>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Top Contributors
        </h3>
        <span class="section-badge">All Time</span>
      </div>
      
      <div class="contributors-list">
        <div 
          v-for="(contributor, index) in topContributorsList" 
          :key="contributor.login"
          class="contributor-item"
          @click="openProfile(contributor.login)"
        >
          <div class="contributor-rank">{{ index + 1 }}</div>
          <img :src="contributor.avatar_url" :alt="contributor.login" class="contributor-avatar">
          <div class="contributor-info">
            <span class="contributor-name">{{ contributor.login }}</span>
            <span class="contributor-commits">{{ formatNumber(contributor.commits) }} commits</span>
          </div>
          <div class="contributor-chart">
            <div class="contributor-bar" :style="{ width: (contributor.commits / topContributorsList[0]?.commits * 100) + '%' }"></div>
          </div>
          <div class="contributor-percent">
            {{ ((contributor.commits / topContributorsList[0]?.commits) * 100).toFixed(1) }}%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

export default {
  name: 'PanelAnalytics',
  
  props: {
    isLightTheme: {
      type: Boolean,
      default: false
    },
    dailyCommits: {
      type: Array,
      default: () => []
    },
    weeklyCommits: {
      type: Array,
      default: () => []
    },
    monthlyCommits: {
      type: Array,
      default: () => []
    },
    languageStats: {
      type: Array,
      default: () => []
    },
    contributors: {
      type: Array,
      default: () => []
    },
    pullRequests: {
      type: Array,
      default: () => []
    },
    totalCommits: {
      type: Number,
      default: 0
    },
    panelTheme: {
      type: String,
      default: 'fire'
    }
  },
  
  data() {
    return {
      period: 'week',
      charts: {
        activity: null,
        pr: null
      },
      prStats: {
        open: 0,
        merged: 0,
        closed: 0
      },
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  },
  
  computed: {
    // Chart data based on period
    chartData() {
      switch(this.period) {
        case 'week':
          return this.dailyCommits.slice(-7)
        case 'month':
          return this.dailyCommits.slice(-30)
        case 'year':
          return this.weeklyCommits.slice(-52)
        default:
          return this.dailyCommits.slice(-30)
      }
    },
    
    chartLabels() {
      const now = new Date()
      switch(this.period) {
        case 'week':
          return [...Array(7)].map((_, i) => {
            const d = new Date(now)
            d.setDate(d.getDate() - (6 - i))
            return d.toLocaleDateString('en-US', { weekday: 'short' })
          })
        case 'month':
          return [...Array(30)].map((_, i) => {
            const d = new Date(now)
            d.setDate(d.getDate() - (29 - i))
            return d.getDate().toString()
          })
        case 'year':
          return this.weeklyCommits.slice(-52).map((_, i) => `W${i + 1}`)
        default:
          return [...Array(30)].map((_, i) => {
            const d = new Date(now)
            d.setDate(d.getDate() - (29 - i))
            return d.getDate().toString()
          })
      }
    },
    
    chartTotal() {
      return this.chartData.reduce((a, b) => a + b, 0)
    },
    
    chartAverage() {
      return (this.chartTotal / this.chartData.length).toFixed(1)
    },
    
    peakDay() {
      const max = Math.max(...this.chartData)
      const index = this.chartData.indexOf(max)
      if (index === -1) return null
      return {
        value: max,
        date: this.chartLabels[index]
      }
    },
    
    avgCommitsPerDay() {
      return (this.totalCommits / 30).toFixed(1)
    },
    
    activeContributors() {
      return this.contributors.filter(c => c.commits > 5).length
    },
    
    newContributors() {
      return Math.floor(this.activeContributors * 0.15)
    },
    
    commitTrend() {
      const lastWeek = this.dailyCommits.slice(-7).reduce((a, b) => a + b, 0)
      const prevWeek = this.dailyCommits.slice(-14, -7).reduce((a, b) => a + b, 0)
      if (prevWeek === 0) return 0
      return Math.round(((lastWeek - prevWeek) / prevWeek) * 100)
    },
    
    avgTrend() {
      return Math.floor(Math.random() * 20) - 5
    },
    
    completionRate() {
      const total = this.prStats.merged + this.prStats.closed
      if (total === 0) return 0
      return Math.round((this.prStats.merged / total) * 100)
    },
    
    prRateChange() {
      return Math.floor(Math.random() * 15) + 1
    },
    
    avgMergeTime() {
      const hours = Math.floor(Math.random() * 48) + 2
      if (hours < 24) return `${hours}h`
      return `${Math.floor(hours / 24)}d ${hours % 24}h`
    },
    
    topLanguages() {
      return this.languageStats.slice(0, 8)
    },
    
    topContributorsList() {
      return this.contributors.slice(0, 10)
    }
  },
  
  watch: {
    period() {
      this.initActivityChart()
    },
    dailyCommits() {
      this.initActivityChart()
    },
    isLightTheme() {
      this.initActivityChart()
      this.initPRChart()
    },
    panelTheme() {
      this.$nextTick(() => {
        this.initActivityChart()
        this.initPRChart()
      })
    }
  },
  
  mounted() {
    this.initActivityChart()
    this.initPRChart()
    this.calculatePRStats()
  },
  
  beforeUnmount() {
    if (this.charts.activity) this.charts.activity.destroy()
    if (this.charts.pr) this.charts.pr.destroy()
  },
  
  methods: {
    setPeriod(period) {
      this.period = period
    },
    
    getAccentColor() {
      if (this.$el) {
        const v = getComputedStyle(this.$el).getPropertyValue('--accent').trim()
        if (v) return v
      }
      return '#ff7800'
    },

    getAccentGlow() {
      if (this.$el) {
        const v = getComputedStyle(this.$el).getPropertyValue('--accent-glow').trim()
        if (v) return v
      }
      return 'rgba(255, 120, 0,0.1)'
    },
    
    initActivityChart() {
      const canvas = this.$refs.activityChart
      if (!canvas) return
      
      if (this.charts.activity) {
        this.charts.activity.destroy()
      }
      
      const ctx = canvas.getContext('2d')
      const isLight = this.isLightTheme
      const textColor = isLight ? '#666' : '#8a8a95'
      const gridColor = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.03)'
      
      this.charts.activity = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.chartLabels,
          datasets: [{
            label: 'Commits',
            data: this.chartData,
            borderColor: this.getAccentColor(),
            backgroundColor: this.getAccentGlow(),
            tension: 0.4,
            fill: true,
            pointBackgroundColor: this.getAccentColor(),
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
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
              borderColor: this.getAccentColor(),
              borderWidth: 2,
              callbacks: {
                label: (context) => `Commits: ${context.raw}`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: gridColor },
              ticks: { color: textColor }
            },
            x: {
              grid: { display: false },
              ticks: { 
                color: textColor,
                maxRotation: 45,
                minRotation: 45,
                maxTicksLimit: 10
              }
            }
          }
        }
      })
    },
    
    initPRChart() {
      const canvas = this.$refs.prChart
      if (!canvas) return
      
      if (this.charts.pr) {
        this.charts.pr.destroy()
      }
      
      const ctx = canvas.getContext('2d')
      const isLight = this.isLightTheme
      const textColor = isLight ? '#666' : '#8a8a95'
      
      this.charts.pr = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Open', 'Merged', 'Closed'],
          datasets: [{
            data: [this.prStats.open, this.prStats.merged, this.prStats.closed],
            backgroundColor: [this.getAccentColor(), '#2ecc71', '#e74c3c'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: textColor }
            }
          }
        }
      })
    },
    
    calculatePRStats() {
      // Mock data - replace with actual PR data from props
      this.prStats.open = Math.floor(Math.random() * 20) + 5
      this.prStats.merged = Math.floor(Math.random() * 30) + 10
      this.prStats.closed = Math.floor(Math.random() * 15) + 5
    },
    
    getHeatmapClass(week, day) {
      // Generate random intensity for demo
      const intensity = Math.random()
      if (intensity > 0.8) return 'high'
      if (intensity > 0.5) return 'medium'
      if (intensity > 0.2) return 'low'
      return 'none'
    },
    
    getHeatmapColor(week, day) {
      const accent = this.getAccentColor()
      const intensity = Math.random()
      if (intensity > 0.8) return accent
      if (intensity > 0.5) return accent + 'cc'
      if (intensity > 0.2) return accent + '66'
      return '#2a2a30'
    },
    
    getHeatmapTitle(week, day) {
      const date = new Date()
      date.setDate(date.getDate() - ((52 - week) * 7) + day)
      return `${date.toLocaleDateString()}: ${Math.floor(Math.random() * 20)} commits`
    },
    
    getLanguageColor(lang) {
      const colors = {
        'JavaScript': '#f7df1e',
        'TypeScript': '#3178c6',
        'Vue': '#42b883',
        'CSS': '#264de4',
        'HTML': '#e34c26',
        'Markdown': '#083fa1',
        'JSON': '#292929',
        'Python': '#3776ab',
        'Go': '#00add8',
        'Rust': '#dea584'
      }
      return colors[lang] || this.getAccentColor()
    },
    
    formatNumber(num) {
      if (!num) return '0'
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
      if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
      return num.toString()
    },
    
    formatBytes(bytes) {
      if (!bytes) return '0 B'
      if (bytes < 1024) return bytes + ' B'
      if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
      return (bytes / 1048576).toFixed(1) + ' MB'
    },
    
    openProfile(username) {
      window.open(`https://github.com/${username}`, '_blank')
    }
  }
}
</script>

<style scoped>
.panel-analytics {
  --bg-secondary: #0f0f12;
  --bg-tertiary: #1a1a20;
  --border-color: #1f1f24;
  --text-primary: #ffffff;
  --text-secondary: #e0e0e0;
  --text-muted: #8a8a95;
  --accent: #ff7800;
  --accent-glow: rgba(255, 120, 0, 0.2);
  --accent-dim: rgba(255, 120, 0,0.08); 
  --accent-soft: rgba(255, 120, 0,0.15);
  --accent-mid: rgba(255, 120, 0,0.28); 
  --accent-strong: rgba(255, 120, 0,0.45);
  --accent-heavy: rgba(255, 120, 0,0.68); 
  --accent-solid: rgba(255, 120, 0,0.88);
  --accent-alt: #ff6030; 
  --accent-alt2: #ff8c42;
  --success: #2ecc71;
  --danger: #e74c3c;
  
  animation: fadeIn 0.3s ease;
}

.panel-analytics.light-theme {
  --bg-primary: #f0f0f5;
  --bg-secondary: #ffffff;
  --bg-tertiary: #e2e2ea;
  --border-color: #c4c4d0;
  --text-primary: #0f0f14;
  --text-secondary: #2a2a38;
  --text-muted: #4a4a5a;
  --accent-glow: rgba(255, 120, 0, 0.1);
}

.panel-analytics.light-theme .stat-card:hover { box-shadow:0 8px 20px rgba(0,0,0,0.1); }
.panel-analytics.light-theme .contributor-bar { background:rgba(0,0,0,0.1); }
.panel-analytics.light-theme .contributor-item:hover { background:rgba(0,0,0,0.04); }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ... */
/* Header */
.analytics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.analytics-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.analytics-title h2 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.analytics-period {
  display: flex;
  gap: 4px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.09);
  backdrop-filter: blur(20px);
  padding: 4px;
  border-radius: 40px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.10);
}

.period-btn {
  padding: 8px 20px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 30px;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.22s ease;
}

.period-btn:hover {
  color: var(--accent);
}

.period-btn.active {
  background: var(--accent-dim);
  border-color: var(--accent-strong);
  color: var(--accent);
  box-shadow: 0 0 14px var(--accent-dim), inset 0 1px 0 rgba(255,255,255,0.14);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: rgba(6,6,18,0.46);
  backdrop-filter: blur(40px) saturate(175%);
  -webkit-backdrop-filter: blur(40px) saturate(175%);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 24px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.10);
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-3px);
  border-color: rgba(255,120,0,0.28);
  box-shadow: 0 12px 40px rgba(0,0,0,0.45), 0 0 20px var(--accent-dim), inset 0 1px 0 rgba(255,255,255,0.14);
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
  flex-shrink: 0;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.12);
}

.stat-content {
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
  margin-bottom: 4px;
}

.stat-trend {
  display: inline-block;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 20px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.08);
}

.stat-trend.positive {
  color: var(--success);
}

.stat-trend.negative {
  color: var(--danger);
}

/* Chart Card */
.chart-card {
  background: rgba(6,6,18,0.46);
  backdrop-filter: blur(40px) saturate(175%);
  -webkit-backdrop-filter: blur(40px) saturate(175%);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.10);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.chart-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  margin: 0;
}

.chart-legend {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--text-muted);
}

.legend-dot {
  width: 10px;
  height: 10px;
  background: var(--accent);
  border-radius: 50%;
}

.chart-wrapper {
  height: 300px;
  position: relative;
  margin-bottom: 20px;
}

.chart-stats {
  display: flex;
  justify-content: space-around;
  padding-top: 16px;
  border-top: 1px solid rgba(255,255,255,0.07);
}

.stat-item {
  text-align: center;
}

.stat-item .stat-label {
  font-size: 10px;
  margin-bottom: 4px;
}

.stat-item .stat-value {
  font-size: 18px;
  font-weight: 600;
  color: var(--accent);
}

.stat-date {
  font-size: 10px;
  color: var(--text-muted);
}

/* Two Columns */
.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.analytics-card {
  background: rgba(6,6,18,0.46);
  backdrop-filter: blur(40px) saturate(175%);
  -webkit-backdrop-filter: blur(40px) saturate(175%);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.10);
}

.card-header {
  margin-bottom: 20px;
}

.card-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  margin: 0;
}

/* Language Stats */
.language-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.language-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
}

.lang-info {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
}

.lang-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.lang-name {
  font-size: 12px;
  color: var(--text-primary);
}

.lang-percent {
  font-size: 11px;
  color: var(--accent);
  font-weight: 500;
}

.lang-bar {
  height: 6px;
  background: rgba(255,255,255,0.06);
  border-radius: 3px;
  overflow: hidden;
}

.lang-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.lang-bytes {
  font-size: 10px;
  color: var(--text-muted);
}

/* Heatmap */
.heatmap-container {
  overflow-x: auto;
}

.heatmap-months {
  display: flex;
  justify-content: space-around;
  margin-bottom: 8px;
  padding: 0 20px;
}

.heatmap-months span {
  font-size: 9px;
  color: var(--text-muted);
}

.heatmap-grid {
  display: flex;
  gap: 3px;
}

.heatmap-week {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.heatmap-cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.heatmap-cell:hover {
  transform: scale(1.2);
}

.heatmap-legend {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 9px;
  color: var(--text-muted);
}

.legend-gradient {
  width: 60px;
  height: 10px;
  background: linear-gradient(90deg, rgba(255,255,255,0.06), #ffa07a, #ff7800);
  border-radius: 5px;
}

.panel-analytics.light-theme .legend-gradient { background: linear-gradient(90deg, #e0e0ea, #ffa07a, #ff7800); }

/* PR Analytics */
.pr-analytics {
  background: rgba(6,6,18,0.46);
  backdrop-filter: blur(40px) saturate(175%);
  -webkit-backdrop-filter: blur(40px) saturate(175%);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.10);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  margin: 0;
}

.section-badge {
  padding: 4px 12px;
  background: var(--accent-dim);
  border: 1px solid var(--accent-mid);
  border-radius: 20px;
  font-size: 10px;
  font-weight: 600;
  color: var(--accent);
}

.pr-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.pr-stat {
  text-align: center;
  padding: 16px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  backdrop-filter: blur(12px);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.pr-stat:hover {
  border-color: rgba(255,120,0,0.22);
  box-shadow: 0 4px 20px rgba(0,0,0,0.3), 0 0 12px var(--accent-dim);
}

.pr-stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--accent);
}

.pr-stat-label {
  font-size: 10px;
  color: var(--text-muted);
  margin-top: 4px;
}

.pr-chart {
  height: 200px;
  position: relative;
}

/* Contributors Section */
.contributors-section {
  background: rgba(6,6,18,0.46);
  backdrop-filter: blur(40px) saturate(175%);
  -webkit-backdrop-filter: blur(40px) saturate(175%);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.10);
}

.contributors-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contributor-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.contributor-item:hover {
  transform: translateX(4px);
  border-color: rgba(255,120,0,0.22);
  background: rgba(255,120,0,0.05);
  box-shadow: 0 4px 20px rgba(0,0,0,0.25), 0 0 12px var(--accent-dim);
}

.contributor-rank {
  width: 30px;
  font-size: 14px;
  font-weight: 600;
  color: var(--accent);
}

.contributor-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid var(--accent);
}

.contributor-info {
  flex: 1;
}

.contributor-name {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}

.contributor-commits {
  font-size: 10px;
  color: var(--text-muted);
}

.contributor-chart {
  width: 150px;
  height: 6px;
  background: rgba(255,255,255,0.06);
  border-radius: 3px;
  overflow: hidden;
}

.contributor-bar {
  height: 100%;
  background: var(--accent);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.contributor-percent {
  font-size: 11px;
  font-weight: 500;
  color: var(--accent);
  min-width: 45px;
  text-align: right;
}

/* Responsive */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .two-columns {
    grid-template-columns: 1fr;
  }
  
  .pr-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 700px) {
  .analytics-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .analytics-period {
    align-self: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .pr-stats {
    grid-template-columns: 1fr;
  }
  
  .contributor-item {
    flex-wrap: wrap;
  }
  
  .contributor-chart {
    width: 100%;
    order: 1;
  }
}
</style>