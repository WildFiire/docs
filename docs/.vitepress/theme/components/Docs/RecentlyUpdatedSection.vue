<script setup lang="ts">
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';
import docs from '../../data/recent-docs.json';

const isCollapsed = ref(false);
const currentPage = ref(0);
const ITEMS_PER_PAGE = 6;
const totalPages = Math.max(1, Math.ceil(docs.length / ITEMS_PER_PAGE));

const currentDocs = computed(() => {
  const start = currentPage.value * ITEMS_PER_PAGE;
  return docs.slice(start, start + ITEMS_PER_PAGE);
});

function handlePrev() {
  currentPage.value = currentPage.value > 0 ? currentPage.value - 1 : totalPages - 1;
}

function handleNext() {
  currentPage.value = currentPage.value < totalPages - 1 ? currentPage.value + 1 : 0;
}

function getCategoryColor(category: string): string {
  const cat = (category || '').toLowerCase();
  if (cat.includes('informa') || cat.includes('about')) return 'orange';
  if (cat.includes('currenc') || cat.includes('moned') || cat.includes('bani')) return 'yellow';
  if (cat.includes('system') || cat.includes('sistem')) return 'blue';
  if (cat.includes('gambl') || cat.includes('casino')) return 'purple';
  if (cat.includes('market') || cat.includes('shop') || cat.includes('vip')) return 'teal';
  return 'orange';
}

const TEAM_AVATAR_MAP: Record<string, string> = {
  v1ccx: 'https://avatars.akamai.steamstatic.com/4963bca91b1b3edf88de548e459b2092a35312e7_full.jpg',
  vicc09: 'https://avatars.akamai.steamstatic.com/4963bca91b1b3edf88de548e459b2092a35312e7_full.jpg',
  iannc: 'https://avatars.fastly.steamstatic.com/f9a2171998ee2677dae87089953177799dbf7dc1_full.jpg',
  iannc69: 'https://avatars.fastly.steamstatic.com/f9a2171998ee2677dae87089953177799dbf7dc1_full.jpg',
  yakuza: 'https://avatars.akamai.steamstatic.com/e2847cb722e1ec8bf9df607659f7f5e3804a0182_full.jpg',
  yakuza2377: 'https://avatars.akamai.steamstatic.com/e2847cb722e1ec8bf9df607659f7f5e3804a0182_full.jpg',
  umpy: 'https://avatars.akamai.steamstatic.com/562c921ff1c8b59f1c5f9642c39608af2984128b_full.jpg',
  umpy04: 'https://avatars.akamai.steamstatic.com/562c921ff1c8b59f1c5f9642c39608af2984128b_full.jpg',
};

function getAuthorAvatar(doc: any): string {
  if (doc?.authorAvatar) return doc.authorAvatar;
  const name = (doc?.authorName || '').toLowerCase().trim();
  if (TEAM_AVATAR_MAP[name]) return TEAM_AVATAR_MAP[name];
  return `https://github.com/${doc?.authorName || 'iannC69'}.png`;
}

function handleAvatarError(event: Event, name?: string) {
  const img = event.target as HTMLImageElement;
  if (!img) return;
  const lowerName = (name || '').toLowerCase().trim();
  if (TEAM_AVATAR_MAP[lowerName] && img.src !== TEAM_AVATAR_MAP[lowerName]) {
    img.src = TEAM_AVATAR_MAP[lowerName];
    return;
  }
  const fallback = encodeURIComponent(name || 'Wildfire');
  img.src = `https://ui-avatars.com/api/?name=${fallback}&background=ff6b00&color=fff&size=64&bold=true`;
}

function formatDate(timestamp?: number): string {
  if (!timestamp) return 'Recent';
  try {
    return new Date(timestamp * 1000).toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return 'Recent';
  }
}
</script>

<template>
  <section v-if="docs.length > 0" class="docs-home-section">
    <div class="section-header section-header--flex">
      <div class="section-header-left-col">
        <div class="section-title-badge-row">
          <h2 class="docs-home-section-title">Recently Updated</h2>

          <!-- Live Git Sync Badge -->
          <span class="live-pulse-badge">
            <span class="pulse-dot" aria-hidden="true" />
            <span>Live Git Sync</span>
          </span>

          <!-- Changed Count Badge -->
          <span class="recent-count-pill" title="Toate documentele modificate și sincronizate recent">
            <Icon icon="lucide:sparkles" width="12" class="text-amber-400" aria-hidden="true" />
            <span><strong>{{ docs.length }}</strong> documente actualizate</span>
          </span>
        </div>
        <span class="section-sub">
          Toate cele <strong>{{ docs.length }}</strong> pagini sincronizate și adaptate recent • Navighează cu săgețile stânga / dreapta
        </span>
      </div>

      <!-- Header Controls: Pagination Arrows + Collapse Toggle -->
      <div class="section-header-actions">
        <!-- Pagination Arrows -->
        <div v-if="!isCollapsed && totalPages > 1" class="recent-pagination-controls">
          <button
            type="button"
            class="recent-page-nav-btn"
            aria-label="Pagina anterioară"
            title="Pagina anterioară"
            @click="handlePrev"
          >
            <Icon icon="lucide:chevron-left" width="16" aria-hidden="true" />
          </button>

          <span class="recent-page-indicator">
            {{ currentPage + 1 }} / {{ totalPages }}
          </span>

          <button
            type="button"
            class="recent-page-nav-btn"
            aria-label="Pagina următoare"
            title="Pagina următoare"
            @click="handleNext"
          >
            <Icon icon="lucide:chevron-right" width="16" aria-hidden="true" />
          </button>
        </div>

        <!-- Collapse Toggle Button -->
        <button
          type="button"
          class="recent-collapse-toggle-btn"
          :aria-expanded="!isCollapsed"
          :aria-label="isCollapsed ? 'Extinde secțiunea' : 'Restrânge secțiunea'"
          @click="isCollapsed = !isCollapsed"
        >
          <span>{{ isCollapsed ? `Afișează (${docs.length})` : 'Restrânge' }}</span>
          <Icon
            :icon="isCollapsed ? 'lucide:chevron-down' : 'lucide:chevron-up'"
            width="14"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>

    <!-- Grid of Updated Documents -->
    <template v-if="!isCollapsed">
      <div class="recent-updates-grid">
        <a
          v-for="doc in currentDocs"
          :key="doc.slug"
          :href="doc.href"
          class="recent-update-card"
        >
          <!-- Top Bar: Category Pill + Relative Time -->
          <div class="recent-card-top">
            <span class="recent-card-category">
              <span class="recent-card-cat-icon">
                <Icon icon="lucide:folder" width="11" />
              </span>
              <span>{{ doc.category }}</span>
            </span>
            <span class="recent-card-time">
              <Icon icon="lucide:clock" width="11" aria-hidden="true" />
              <span>{{ formatDate(doc.timestamp) }}</span>
            </span>
          </div>

          <!-- Title Row with Dynamic Colored Icon from Sidebar -->
          <div class="recent-card-title-row">
            <div class="recent-card-title-wrap">
              <span
                class="recent-card-item-icon"
                :class="`recent-card-item-icon--${getCategoryColor(doc.category)}`"
              >
                <Icon icon="lucide:file-text" width="14" />
              </span>
              <h3 class="recent-card-title">{{ doc.title }}</h3>
            </div>
            <Icon icon="lucide:arrow-right" width="14" class="recent-card-arrow" aria-hidden="true" />
          </div>

          <!-- Excerpt Description -->
          <p class="recent-card-desc">{{ doc.description }}</p>

          <!-- Bottom Footer: Author Avatar + Commit Hash + Read Time -->
          <div class="recent-card-footer">
            <div class="recent-card-author">
              <img
                :src="getAuthorAvatar(doc)"
                :alt="doc.authorName || 'iannC69'"
                class="recent-author-avatar"
                width="18"
                height="18"
                loading="lazy"
                @error="handleAvatarError($event, doc.authorName)"
              />
              <span class="recent-author-name">
                <span class="recent-author-by">by</span>
                {{ doc.authorName || 'iannC69' }}
              </span>
            </div>

            <div class="recent-card-meta-right">
              <span
                v-if="doc.commitHash && doc.commitHash !== 'HEAD'"
                class="recent-commit-badge"
                :title="`Commit ${doc.commitHash}`"
              >
                <Icon icon="lucide:git-commit" width="11" aria-hidden="true" />
                <span>#{{ doc.commitHash.slice(0, 7) }}</span>
              </span>
              <span class="recent-read-time">
                {{ doc.readingTime || 2 }}m read
              </span>
            </div>
          </div>
        </a>
      </div>

      <!-- Bottom Pagination Bar -->
      <div v-if="totalPages > 1" class="recent-bottom-pagination">
        <button
          type="button"
          class="recent-bottom-nav-btn"
          aria-label="Pagina anterioară"
          @click="handlePrev"
        >
          <Icon icon="lucide:chevron-left" width="15" />
          <span>Anterior</span>
        </button>

        <div class="recent-page-pills">
          <button
            v-for="p in totalPages"
            :key="p"
            type="button"
            class="recent-page-dot"
            :class="{ 'recent-page-dot--active': currentPage === p - 1 }"
            :aria-label="`Sari la pagina ${p}`"
            @click="currentPage = p - 1"
          >
            {{ p }}
          </button>
        </div>

        <button
          type="button"
          class="recent-bottom-nav-btn"
          aria-label="Pagina următoare"
          @click="handleNext"
        >
          <span>Următor</span>
          <Icon icon="lucide:chevron-right" width="15" />
        </button>
      </div>
    </template>
  </section>
</template>

<style scoped>
.text-amber-400 { color: hsl(38 92% 50%); }
</style>
