<template>
  <div v-if="contributors.length > 0 || loading" class="ctr-section">
    <div class="ctr-card">

      <!-- Header -->
      <div class="ctr-header">
        <div class="ctr-header-left">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="ctr-icon">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <span class="ctr-title">Contributors on this page:</span>
        </div>
        <span v-if="!loading" class="ctr-count">{{ contributors.length }}</span>
      </div>

      <!-- Skeleton -->
      <div v-if="loading" class="ctr-grid">
        <div v-for="i in 6" :key="i" class="ctr-skeleton">
          <div class="ctr-skeleton-avatar"></div>
          <div class="ctr-skeleton-name"></div>
        </div>
      </div>

      <!-- Avatars -->
      <div v-else class="ctr-grid">
        <a
          v-for="(c, i) in contributors"
          :key="c.login"
          :href="c.html_url"
          target="_blank"
          rel="noopener noreferrer"
          class="ctr-avatar-wrap"
          :title="c.login"
          :style="{ animationDelay: `${i * 40}ms` }"
        >
          <div class="ctr-avatar-ring">
            <img :src="c.avatar_url" :alt="c.login" class="ctr-avatar-img" loading="lazy" />
          </div>
          <span class="ctr-name">{{ c.login }}</span>
        </a>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()
const contributors = ref([])
const loading = ref(false)
const token = import.meta.env.VITE_GITHUB_TOKEN

async function fetchContributors(filePath) {
  if (!filePath) return
  contributors.value = []
  loading.value = true
  try {
    const fullPath = `docs/${filePath}`
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
    const commitsRes = await fetch(
      `https://api.github.com/repos/Wildfiire/docs/commits?path=${fullPath}&per_page=50`,
      { headers }
    )
    const commits = await commitsRes.json()
    if (!Array.isArray(commits)) return
    const map = new Map()
    commits.forEach(commit => {
      const user = commit.author || commit.committer
      if (user?.login && !map.has(user.login)) {
        map.set(user.login, {
          login: user.login,
          avatar_url: user.avatar_url,
          html_url: user.html_url
        })
      }
    })
    contributors.value = Array.from(map.values()).slice(0, 15)
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
/* ── Section ─────────────────────────── */
.ctr-section {
  margin-top: 2.5rem;
}

/* ── Card ────────────────────────────── */
.ctr-card {
  padding: 14px 18px 18px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: transparent;
  position: relative;
  overflow: hidden;
}

/* Brand accent line at top */
.ctr-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  border-radius: 10px 10px 0 0;
}

/* ── Header ──────────────────────────── */
.ctr-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.ctr-header-left {
  display: flex;
  align-items: center;
  gap: 7px;
}

.ctr-icon {
  color: var(--vp-c-brand-1);
  flex-shrink: 0;
  opacity: 0.85;
}

.ctr-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  letter-spacing: 0.01em;
}

.ctr-count {
  font-size: 10px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 999px;
  padding: 1px 8px;
  line-height: 1.6;
  opacity: 0.9;
}

/* ── Grid ────────────────────────────── */
.ctr-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 14px 10px;
}

/* ── Avatar ──────────────────────────── */
.ctr-avatar-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  animation: ctr-pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes ctr-pop-in {
  from { opacity: 0; transform: translateY(6px) scale(0.88); }
  to   { opacity: 1; transform: translateY(0)   scale(1); }
}

.ctr-avatar-wrap:hover {
  transform: translateY(-3px);
  transition: transform 0.2s ease;
}

.ctr-avatar-ring {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  padding: 2px;
  background: var(--vp-c-brand-1);
  box-shadow: 0 2px 6px rgba(255, 69, 0, 0.15);
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

/* Shine sweep */
.ctr-avatar-ring::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -75%;
  width: 50%;
  height: 200%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.38),
    transparent
  );
  transform: skewX(-15deg);
  opacity: 0;
  pointer-events: none;
  z-index: 2;
}

.ctr-avatar-wrap:hover .ctr-avatar-ring {
  box-shadow: 0 6px 20px rgba(255, 69, 0, 0.30);
}

.ctr-avatar-wrap:hover .ctr-avatar-ring::before {
  animation: ctr-shine 0.55s ease forwards;
}

@keyframes ctr-shine {
  0%   { left: -75%; opacity: 1; }
  100% { left: 125%; opacity: 1; }
}

.ctr-avatar-img {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  transition: filter 0.3s ease;
}

.ctr-avatar-wrap:hover .ctr-avatar-img {
  filter: brightness(1.07);
}

/* ── Username ────────────────────────── */
.ctr-name {
  font-size: 10px;
  font-weight: 500;
  color: var(--vp-c-text-3);
  max-width: 52px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  transition: color 0.2s ease;
}

.ctr-avatar-wrap:hover .ctr-name {
  color: var(--vp-c-brand-1);
}

/* ── Skeleton ────────────────────────── */
.ctr-skeleton {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.ctr-skeleton-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--vp-c-divider);
  animation: ctr-shimmer 1.4s ease infinite;
}

.ctr-skeleton-name {
  width: 36px;
  height: 8px;
  border-radius: 4px;
  background: var(--vp-c-divider);
  animation: ctr-shimmer 1.4s ease infinite 0.2s;
}

@keyframes ctr-shimmer {
  0%, 100% { opacity: 0.4; }
  50%       { opacity: 0.9; }
}

/* ── Responsive ──────────────────────── */
@media (max-width: 480px) {
  .ctr-card {
    padding: 12px 14px 16px;
  }
  .ctr-grid {
    gap: 12px 8px;
  }
  .ctr-avatar-ring {
    width: 38px;
    height: 38px;
  }
}
</style>