<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { RELEASES_DATA, type ChangeType } from '../../data/changelog';

const releases = RELEASES_DATA;
const latestRelease = computed(() => releases.find((r) => r.isLatest) || releases[0]);

function getChangeBadge(type: ChangeType) {
  switch (type) {
    case 'feature':
      return {
        label: 'Feature',
        icon: 'lucide:sparkles',
        className: 'change-badge--feature',
      };
    case 'improvement':
      return {
        label: 'Improvement',
        icon: 'lucide:zap',
        className: 'change-badge--improvement',
      };
    case 'breaking':
      return {
        label: 'Breaking',
        icon: 'lucide:alert-triangle',
        className: 'change-badge--breaking',
      };
    case 'fix':
      return {
        label: 'Bug Fix',
        icon: 'lucide:bug',
        className: 'change-badge--fix',
      };
  }
}
</script>

<template>
  <div class="changelog-page-wrapper">
    <div class="changelog-container">
      <!-- Hero Header -->
      <header class="changelog-hero">
        <div class="changelog-hero-pill">
          <Icon icon="lucide:flame" width="13" class="hero-flame-icon" aria-hidden="true" />
          <span>Wildfire Release Pipeline</span>
          <span class="hero-version-tag">{{ latestRelease.version }}</span>
        </div>

        <h1 class="changelog-hero-title">
          Changelog <span class="title-amp">&amp;</span> Releases
        </h1>

        <p class="changelog-hero-subtitle">
          A chronological timeline of every new capability, performance boost,
          and bug fix shipped to the Wildfire Docs ecosystem.
        </p>

        <div class="changelog-hero-meta-row">
          <div class="hero-stat-chip">
            <Icon icon="lucide:layers" width="13" class="stat-icon" aria-hidden="true" />
            <span>{{ releases.length }} Official Releases</span>
          </div>
          <div class="hero-stat-chip">
            <Icon icon="lucide:git-commit" width="13" class="stat-icon" aria-hidden="true" />
            <span>Live Git Synchronized</span>
          </div>
          <a
            href="https://github.com/iannC69/wf-docscore/releases"
            target="_blank"
            rel="noopener noreferrer"
            class="hero-github-releases-btn"
          >
            <span>GitHub Releases</span>
            <Icon icon="lucide:external-link" width="12" aria-hidden="true" />
          </a>
        </div>
      </header>

      <!-- Vertical Timeline -->
      <div class="changelog-timeline">
        <article
          v-for="(release, idx) in releases"
          :id="release.slug"
          :key="release.slug"
          class="changelog-item"
          :class="{ 'changelog-item--latest': release.isLatest }"
        >
          <!-- Timeline node marker -->
          <div class="timeline-node" aria-hidden="true">
            <div class="timeline-node-dot">
              <span v-if="release.isLatest" class="node-pulse" />
            </div>
            <div v-if="idx < releases.length - 1" class="timeline-line-stem" />
          </div>

          <!-- Release Card -->
          <div class="changelog-card">
            <!-- Top Bar: Version, Date, Author & Git Commit -->
            <div class="changelog-card-header">
              <div class="release-version-wrap">
                <span class="release-version-pill">
                  <Icon icon="lucide:tag" width="12" aria-hidden="true" />
                  <span>{{ release.version }}</span>
                </span>
                <span v-if="release.isLatest" class="release-latest-tag">
                  <Icon icon="lucide:sparkles" width="11" aria-hidden="true" />
                  <span>Latest Release</span>
                </span>
              </div>

              <div class="release-meta-items">
                <div class="release-meta-date">
                  <Icon icon="lucide:calendar" width="12" aria-hidden="true" />
                  <span>{{ release.date }}</span>
                </div>

                <!-- Author Chip -->
                <a
                  :href="`https://github.com/${release.author.username}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="release-author-chip"
                  :title="`Released by @${release.author.username}`"
                >
                  <img
                    :src="release.author.avatar"
                    :alt="release.author.name"
                    class="release-author-avatar"
                    width="18"
                    height="18"
                  />
                  <span>@{{ release.author.username }}</span>
                </a>

                <!-- Git Commit Hash Link -->
                <a
                  :href="release.git.commitUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="release-commit-chip"
                  :title="`View commit ${release.git.commitHash} on GitHub`"
                >
                  <Icon icon="lucide:git-commit" width="12" aria-hidden="true" />
                  <code>{{ release.git.commitHash }}</code>
                  <Icon icon="lucide:external-link" width="10" aria-hidden="true" />
                </a>
              </div>
            </div>

            <!-- Title & Summary -->
            <h2 class="release-title">{{ release.title }}</h2>
            <p class="release-summary">{{ release.summary }}</p>

            <!-- Highlights List if present -->
            <div
              v-if="release.highlights && release.highlights.length > 0"
              class="release-highlights-box"
            >
              <p class="highlights-title">Key Highlights</p>
              <ul class="highlights-list">
                <li
                  v-for="(h, i) in release.highlights"
                  :key="i"
                  class="highlight-item"
                >
                  <Icon
                    icon="lucide:check-circle-2"
                    width="13"
                    class="highlight-icon"
                    aria-hidden="true"
                  />
                  <span>{{ h }}</span>
                </li>
              </ul>
            </div>

            <!-- Categorized Changes List -->
            <div class="release-changes-section">
              <p class="changes-section-label">Included Changes</p>
              <div class="changes-list">
                <div
                  v-for="(item, cIdx) in release.changes"
                  :key="cIdx"
                  class="change-item-row"
                >
                  <div class="change-item-header">
                    <span :class="['change-badge', getChangeBadge(item.type).className]">
                      <Icon :icon="getChangeBadge(item.type).icon" width="11" aria-hidden="true" />
                      <span>{{ getChangeBadge(item.type).label }}</span>
                    </span>
                    <span class="change-item-title">{{ item.title }}</span>
                  </div>
                  <p v-if="item.description" class="change-item-desc">
                    {{ item.description }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Card Footer Actions -->
            <div class="changelog-card-footer">
              <a
                :href="release.git.tagUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="release-tag-link"
              >
                <span>View tag on GitHub</span>
                <Icon icon="lucide:external-link" width="12" aria-hidden="true" />
              </a>
            </div>
          </div>
        </article>
      </div>

      <!-- Bottom CTA Box -->
      <section class="changelog-bottom-cta">
        <div class="cta-content">
          <div class="cta-icon-box">
            <Icon icon="lucide:book-open" width="20" />
          </div>
          <div class="cta-text">
            <h3 class="cta-title">Explore Full Documentation</h3>
            <p class="cta-desc">
              Learn how to integrate Wildfire components, write MDX articles,
              and deploy to production edge.
            </p>
          </div>
        </div>
        <a href="/docs" class="cta-btn">
          <span>Go to Documentation Hub</span>
          <Icon icon="lucide:arrow-right" width="14" aria-hidden="true" />
        </a>
      </section>
    </div>
  </div>
</template>
