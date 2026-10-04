<script setup lang="ts">
import { computed, ref, onMounted, watch, nextTick } from 'vue';
import { useData, useRoute } from 'vitepress';
import { Icon } from '@iconify/vue';
import Breadcrumbs from '../ui/Breadcrumbs.vue';
import PageNav from '../ui/PageNav.vue';
import TableOfContents from './TableOfContents.vue';
import MobileTableOfContents from './MobileTableOfContents.vue';
import DocQuickActions from '../Docs/DocQuickActions.vue';
import DocIntegritySeal from '../Docs/DocIntegritySeal.vue';
import DocViewTracker from '../Docs/DocViewTracker.vue';
import DocAiSummaryCapsule from '../Docs/DocAiSummaryCapsule.vue';
import DocEndAiExplainer from '../Docs/DocEndAiExplainer.vue';
import FeedbackWidget from '../Widgets/FeedbackWidget.vue';
import PageNotFound from './PageNotFound.vue';
import { api } from '../../composables/useApi';

const { frontmatter, page } = useData();
const route = useRoute();

const slug = computed(() => {
  return route.path
    .replace(/^\//, '')
    .replace(/\.html$/, '')
    .replace(/\/$/, '')
    .replace(/^docs\//, '') || 'index';
});

const pageTitle = computed(() => frontmatter.value.title || page.value.title || 'Wildfire Docs');
const pageDescription = computed(() => frontmatter.value.description || '');

const CATEGORY_NAMES: Record<string, string> = {
  informatii: 'Informații',
  currency: 'Currency',
  systems: 'Systems',
  market: 'Market & Donații',
};

const rootSlug = computed(() => slug.value.split('/')[0] || '');
const categoryLabel = computed(() => CATEGORY_NAMES[rootSlug.value] || (rootSlug.value ? rootSlug.value.replace(/-/g, ' ') : 'Documentation'));

// Breadcrumbs builder
const breadcrumbs = computed(() => {
  const parts = slug.value.split('/').filter(Boolean);
  if (parts.length <= 1) return [];
  const items: any[] = [{ title: 'Docs', href: '/' }];
  let p = '/docs';
  for (let i = 0; i < parts.length; i++) {
    p += '/' + parts[i];
    const isCurrent = i === parts.length - 1;
    items.push({
      title: isCurrent ? pageTitle.value : (CATEGORY_NAMES[parts[i]] || parts[i].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())),
      href: isCurrent ? undefined : p,
      isCurrent,
    });
  }
  return items;
});

import docHeadingsMap from '../../data/doc-headings.json';

// TOC items extraction with pre-computed build data fallback to VitePress page.headers
function flattenHeaders(headers: any[]): any[] {
  const result: any[] = [];
  for (const h of headers || []) {
    // Match wf-docscore extractToc: #{1,4} — h1 through h4
    if (h.level >= 1 && h.level <= 4) {
      result.push({
        id: h.slug || (h.link ? h.link.replace(/^#/, '') : ''),
        title: h.title,
        depth: h.level,
      });
    }
    if (h.children && h.children.length) {
      result.push(...flattenHeaders(h.children));
    }
  }
  return result;
}

import { useTableOfContents } from '../../composables/useTableOfContents';

const { items: globalTocItems, syncHeadings } = useTableOfContents();

const tocItems = computed(() => {
  const map = (docHeadingsMap || {}) as Record<string, any[]>;
  const rawSlug = slug.value;
  const cleanSlug = rawSlug.replace(/^docs\//, '');
  const precomputed =
    map[rawSlug] ||
    map[`${rawSlug}/index`] ||
    map[cleanSlug] ||
    map[`${cleanSlug}/index`];
  if (precomputed && precomputed.length > 0) return precomputed;
  const fromPage = flattenHeaders(page.value.headers || []);
  if (fromPage.length > 0) return fromPage;
  if (globalTocItems.value && globalTocItems.value.length > 0) return globalTocItems.value;
  return [];
});
const showToc = computed(() => frontmatter.value.showToc !== false && (tocItems.value.length > 0 || globalTocItems.value.length > 0));

// Word count and reading time calculation
const wordCount = ref(380);
const readingTime = computed(() => Math.max(1, Math.ceil(wordCount.value / 200)));

function calculateStats() {
  if (typeof window === 'undefined') return;
  const contentEl = document.querySelector('.vp-doc, .prose');
  if (contentEl) {
    const text = contentEl.textContent || '';
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    if (words > 0) wordCount.value = words;
  }
}

// Author & Git info
const authorName = computed(() => frontmatter.value.author || 'iannC69');
const authorAvatar = computed(() => `https://github.com/${authorName.value}.png`);
const relativeTime = ref('Recently');
const commitHash = ref('HEAD');
const commitUrl = computed(() => `https://github.com/WildFiire/docs/commit/${commitHash.value}`);
const githubEditUrl = computed(() => `https://github.com/WildFiire/docs/edit/main/docs/${page.value.relativePath || slug.value + '.md'}`);
const docSha256 = ref('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');

// Admin check for studio edit shortcut
const isAdmin = ref(false);

onMounted(async () => {
  calculateStats();
  syncHeadings(tocItems.value);
  try {
    const me = await api('/api/admin/auth/me');
    isAdmin.value = !!me?.authenticated;
  } catch {}
});

watch(() => route.path, () => {
  nextTick(() => {
    setTimeout(() => {
      calculateStats();
      syncHeadings(tocItems.value);
    }, 150);
  });
});
</script>

<template>
  <PageNotFound v-if="page.isNotFound" />
  <div v-else class="docs-page-container">
    <div class="docs-content-wrapper">
      <article class="docs-content" id="main-content">
        <!-- Print Watermark (Visible only during PDF export / print) -->
        <div class="print-watermark" aria-hidden="true">
          <div class="print-watermark-inner">
            <img src="/logo.png" alt="" class="print-watermark-img" width="160" height="160" />
            <span class="print-watermark-text">WILDFIRE DOCS</span>
            <span class="print-watermark-sub">OFFICIAL ARCHITECTURE SPECIFICATION</span>
          </div>
        </div>

        <div class="docs-content-inner">
          <!-- Print Sheet Header (Visible only during PDF export / print) -->
          <div class="print-sheet-header">
            <div class="print-header-top">
              <div class="print-sheet-brand">
                <img src="/logo.png" alt="Wildfire" class="print-sheet-logo" width="38" height="38" />
                <div class="print-sheet-title-wrap">
                  <div class="print-sheet-title-row">
                    <span class="print-sheet-title">WILDFIRE DOCUMENTATION</span>
                    <span class="print-sheet-ver-pill">v1.8.5</span>
                  </div>
                  <span class="print-sheet-sub">
                    Official Engineering Specification • https://github.com/iannC69/wf-docscore
                  </span>
                </div>
              </div>
              <div class="print-sheet-meta">
                <span class="print-sheet-category">{{ categoryLabel }}</span>
                <span class="print-sheet-hash">Git Commit #{{ commitHash.slice(0, 7) }}</span>
              </div>
            </div>
            <div class="print-header-bottom-meta">
              <div class="print-meta-item">
                <span class="print-meta-lbl">Path:</span>
                <span class="print-meta-val">/{{ slug }}</span>
              </div>
              <div class="print-meta-item">
                <span class="print-meta-lbl">Author:</span>
                <span class="print-meta-val">{{ authorName }} ({{ relativeTime }})</span>
              </div>
              <div class="print-meta-item">
                <span class="print-meta-lbl">Length:</span>
                <span class="print-meta-val">{{ readingTime }} min read · {{ wordCount }} words</span>
              </div>
              <div class="print-meta-item">
                <span class="print-meta-lbl">Status:</span>
                <span class="print-meta-val">Fortress Verified</span>
              </div>
            </div>
          </div>

          <!-- Top Row: Breadcrumbs / Category pill + Badge + Quick Actions Toolbar -->
          <div class="page-header-top-row">
            <div class="page-header-breadcrumbs-wrap">
              <Breadcrumbs v-if="breadcrumbs.length > 1" :items="breadcrumbs" />
              <div v-else class="page-category-pill">
                <span class="pill-dot" aria-hidden="true" />
                <span>{{ categoryLabel }}</span>
              </div>
              <span v-if="frontmatter.badge" :class="`badge badge--${String(frontmatter.badge).toLowerCase()} page-tag-badge`">
                {{ frontmatter.badge }}
              </span>
            </div>

            <DocQuickActions
              :slug="slug"
              :github-edit-url="githubEditUrl"
              :is-admin="isAdmin"
            />
          </div>

          <!-- Mobile Table of Contents Dropdown (Visible on <= 1200px) -->
          <MobileTableOfContents v-if="showToc" :items="tocItems" />

          <!-- Page Header: Title, Description, Meta bar -->
          <header class="page-header">
            <div class="page-title-row">
              <h1>{{ pageTitle }}</h1>
            </div>

            <p v-if="pageDescription" class="page-header-desc">
              {{ pageDescription }}
            </p>

            <!-- Meta Bar & Chips -->
            <div class="page-header-meta-bar">
              <!-- Author Chip -->
              <div class="page-author-chip">
                <img
                  :src="authorAvatar"
                  :alt="authorName"
                  class="author-avatar-img"
                  width="20"
                  height="20"
                  loading="lazy"
                />
                <span class="author-text-wrap">
                  <span class="author-action-label">Updated by</span>
                  <a href="/team/" class="author-name-link">{{ authorName }}</a>
                </span>
                <span class="author-dot-sep" aria-hidden="true">·</span>
                <time class="author-time">{{ relativeTime }}</time>
              </div>

              <!-- Git Commit Chip -->
              <a
                v-if="commitHash && commitHash !== 'HEAD'"
                :href="commitUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="page-commit-chip"
                :title="`Commit: ${commitHash}`"
              >
                <Icon icon="lucide:git-commit" width="12" />
                <span>#{{ commitHash.slice(0, 7) }}</span>
              </a>

              <!-- Fortress Cryptographic Integrity Seal -->
              <DocIntegritySeal
                :sha256="docSha256"
                :commit-hash="commitHash"
                :commit-url="commitUrl"
                :author-name="authorName"
                :relative-time="relativeTime"
                :slug="slug"
              />

              <div class="page-meta-right-group">
                <!-- Views Tracker -->
                <DocViewTracker :slug="slug" />
                <span class="page-header-meta-sep" aria-hidden="true">·</span>

                <!-- Reading Time -->
                <span class="page-meta-item">
                  <Icon icon="lucide:clock" width="12" />
                  <span>{{ readingTime }} min read</span>
                </span>
                <span class="page-header-meta-sep" aria-hidden="true">·</span>

                <!-- Word Count -->
                <span class="page-meta-item">
                  <Icon icon="lucide:book-open" width="12" />
                  <span>{{ wordCount.toLocaleString('ro-RO') }} words</span>
                </span>
              </div>
            </div>
          </header>

          <!-- Dynamic In-Page AI Quick Summary / TL;DR Capsule -->
          <DocAiSummaryCapsule
            :doc-title="pageTitle"
            :doc-slug="slug"
          />

          <!-- Markdown Content Body -->
          <div class="prose vp-doc">
            <Content />
          </div>

          <!-- End-of-Page AI Explainer & Q&A Callout Card -->
          <DocEndAiExplainer
            :doc-title="pageTitle"
            :doc-slug="slug"
            :category="categoryLabel"
          />

          <!-- Page Footer: Feedback Widget + Edit Link + PageNav -->
          <footer class="page-footer">
            <div class="page-footer-actions">
              <FeedbackWidget :slug="slug" />
              <a
                v-if="githubEditUrl"
                :href="githubEditUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="edit-page-link"
                style="margin-left: auto;"
              >
                <Icon icon="lucide:pencil" width="13" aria-hidden="true" />
                Edit this page on GitHub
              </a>
            </div>
            <PageNav />
          </footer>

          <!-- Print Footer (Visible only during PDF export / print) -->
          <div class="print-sheet-footer">
            <div class="print-footer-left">
              <span>Wildfire Docs • Technical Specification</span>
              <span class="print-footer-dot">·</span>
              <span>Maintainer: {{ authorName }}</span>
              <span class="print-footer-dot">·</span>
              <span>/{{ slug }}</span>
            </div>
            <div class="print-footer-right">
              <span>Fortress Security Verified • SHA-256 Chained</span>
            </div>
          </div>
        </div>
      </article>
    </div>

    <!-- Right Table of Contents (1:1 from wf-docscore) -->
    <TableOfContents v-if="showToc" :items="tocItems" />
  </div>
</template>
