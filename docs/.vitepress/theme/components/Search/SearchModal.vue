<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vitepress';
import { Icon } from '@iconify/vue';

export interface SearchChunk {
  id: string;
  title: string;
  sectionTitle?: string;
  category: string;
  href: string;
  contentSnippet: string;
  keywords?: string[];
}

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const router = useRouter();
const query = ref('');
const activeCategory = ref('all');
const chunks = ref<SearchChunk[]>([]);
const recentSearches = ref<string[]>([]);
const trendingAiQuestions = ref<string[]>([
  'Cum aplic în staff și ce cerințe sunt?',
  'Care sunt beneficiile la gradele VIP?',
  'Cum pot obține Phoenix Coins?',
  'Cum folosesc comanda !ws pe server?',
]);
const selectedIndex = ref(0);
const loading = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);
const resultsContainerRef = ref<HTMLElement | null>(null);

const categoryTabs = [
  { id: 'all', label: 'All Categories' },
  { id: 'Informații', label: 'Informații' },
  { id: 'Currency', label: 'Currency' },
  { id: 'Systems', label: 'Systems' },
  { id: 'Market', label: 'Market & VIP' },
];

function close() {
  emit('close');
}

function askAi(targetQuery?: string) {
  const q = targetQuery ?? query.value;
  close();
  if (q.trim()) {
    saveRecentSearch(q);
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('wf:open-ai', {
        detail: {
          query: q || '',
          autoSubmit: Boolean(q.trim()),
        },
      })
    );
  }
}

function saveRecentSearch(term: string) {
  if (!term.trim()) return;
  const filtered = [term.trim(), ...recentSearches.value.filter((s) => s.toLowerCase() !== term.trim().toLowerCase())].slice(0, 5);
  recentSearches.value = filtered;
  try {
    localStorage.setItem('wf_recent_searches', JSON.stringify(filtered));
  } catch {}
}

function clearRecentSearches() {
  recentSearches.value = [];
  try {
    localStorage.removeItem('wf_recent_searches');
  } catch {}
}

function navigate(href: string) {
  if (query.value.trim()) {
    saveRecentSearch(query.value);
  }
  close();
  router.go(href);
}

// 1. Lock body background scroll while modal is open
watch(() => props.isOpen, (open) => {
  if (typeof document === 'undefined') return;
  if (open) {
    document.body.style.overflow = 'hidden';
    nextTick(() => {
      inputRef.value?.focus();
    });
  } else {
    document.body.style.overflow = '';
  }
});

// 2. Load search index, recent searches, and live AI telemetry suggestions
onMounted(() => {
  try {
    const stored = localStorage.getItem('wf_recent_searches');
    if (stored) {
      recentSearches.value = JSON.parse(stored);
    }
  } catch {}

  fetch('/api/ai-helper/trending')
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data?.suggestions) && data.suggestions.length > 0) {
        trendingAiQuestions.value = data.suggestions;
      }
    })
    .catch(() => {});

  // Fetch search index
  loading.value = true;
  fetch('/api/search')
    .then((res) => res.json())
    .then((data) => {
      if (data.results) {
        chunks.value = data.results;
      }
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
});

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
});

// 3. Search Algorithm (Exact scoring match with wf-docscore)
const results = computed<SearchChunk[]>(() => {
  const q = query.value.trim().toLowerCase();

  let pool = chunks.value;
  if (activeCategory.value !== 'all') {
    pool = pool.filter((c) => c.category.toLowerCase().includes(activeCategory.value.toLowerCase()));
  }

  if (!q) {
    return [
      {
        id: 'quick-getting-started',
        title: 'Ghid de Început & Conectare',
        sectionTitle: 'Informații Generale',
        category: 'Informații',
        href: '/informatii/getting-started',
        contentSnippet: 'Instrucțiuni pas cu pas despre cum te conectezi pe serverul Counter-Strike 2 Wildfire.ro.',
      },
      {
        id: 'quick-currency',
        title: 'Sistemul de Currency',
        sectionTitle: 'Credits & Phoenix Coins',
        category: 'Currency',
        href: '/currency',
        contentSnippet: 'Află cum funcționează monedele oficiale ale serverului, cum câștigi credite și cum le folosești.',
      },
      {
        id: 'quick-vip',
        title: 'Grade VIP & Beneficii',
        sectionTitle: 'Market & Donații',
        category: 'Market',
        href: '/market/vip',
        contentSnippet: 'Prezentare detaliată a gradelor VIP (Immortal, Mythic, Rebirth), comenzi și avantaje exclusive.',
      },
      {
        id: 'quick-skins',
        title: 'Skins & Cuțite CS2',
        sectionTitle: 'Sistemul !ws / !knife',
        category: 'Systems',
        href: '/systems/skins',
        contentSnippet: 'Ghid complet pentru alegerea skin-urilor, mănușilor, agenților și cuțitelor personalizate pe server.',
      },
      {
        id: 'quick-regulamente',
        title: 'Regulamente Oficiale',
        sectionTitle: 'Regulament Jucători & STAFF',
        category: 'Informații',
        href: '/informatii/regulamente',
        contentSnippet: 'Regulamentul oficial al comunității Wildfire CS2, sancțiuni și reguli de conduită.',
      },
    ];
  }

  const words = q.split(/\s+/).filter(Boolean);

  const scored = pool.map((item) => {
    let score = 0;
    const titleLower = item.title.toLowerCase();
    const sectionLower = item.sectionTitle ? item.sectionTitle.toLowerCase() : '';
    const snippetLower = (item.contentSnippet || '').toLowerCase();
    const catLower = item.category.toLowerCase();
    const hrefLower = item.href.toLowerCase();

    if (titleLower === q) score += 120;
    else if (titleLower.startsWith(q)) score += 80;
    else if (titleLower.includes(q)) score += 50;

    if (sectionLower.includes(q)) score += 35;
    if (catLower.includes(q)) score += 25;
    if (hrefLower.includes(q)) score += 30;

    for (const w of words) {
      if (titleLower.includes(w)) score += 20;
      if (sectionLower.includes(w)) score += 14;
      if (snippetLower.includes(w)) score += 10;
      if (item.keywords && item.keywords.some((k) => k.toLowerCase().includes(w))) score += 16;
    }

    return { item, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map((s) => s.item);
});

const hasAiSpotlight = computed(() => Boolean(query.value.trim()));
const totalSelectableCount = computed(() => results.value.length + (hasAiSpotlight.value ? 1 : 0));

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    selectedIndex.value = selectedIndex.value < totalSelectableCount.value - 1 ? selectedIndex.value + 1 : 0;
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    selectedIndex.value = selectedIndex.value > 0 ? selectedIndex.value - 1 : totalSelectableCount.value - 1;
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (hasAiSpotlight.value && selectedIndex.value === 0) {
      askAi(query.value);
    } else {
      const resultIdx = hasAiSpotlight.value ? selectedIndex.value - 1 : selectedIndex.value;
      const target = results.value[resultIdx];
      if (target) {
        navigate(target.href);
      }
    }
  } else if (e.key === 'Escape') {
    e.preventDefault();
    close();
  }
}

// Scroll active item into view
watch(selectedIndex, (idx) => {
  if (resultsContainerRef.value) {
    const activeEl = resultsContainerRef.value.querySelector(`[data-index="${idx}"]`) as HTMLElement | null;
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }
});
</script>

<template>
  <Teleport to="body" v-if="isOpen">
    <div
      class="search-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Search documentation"
      @click="close"
    >
      <div
        class="search-modal-container"
        @click.stop
      >
        <!-- Spotlight-style Search Input Header -->
        <div class="search-input-header">
          <Icon icon="lucide:search" width="19" height="19" class="search-input-icon" aria-hidden="true" />
          <input
            ref="inputRef"
            type="text"
            class="search-input"
            placeholder="Search docs, APIs, commands, variables..."
            v-model="query"
            aria-autocomplete="list"
            autocomplete="off"
            spellcheck="false"
            @input="selectedIndex = 0"
            @keydown="handleKeyDown"
          />
          <button
            v-if="query"
            type="button"
            class="search-clear-btn"
            aria-label="Clear search query"
            @click="query = ''; selectedIndex = 0; inputRef?.focus()"
          >
            <Icon icon="lucide:x" width="15" height="15" />
          </button>
          <button
            type="button"
            class="search-esc-badge"
            aria-label="Close search"
            @click="close"
          >
            ESC
          </button>
        </div>

        <!-- Category Tabs Filter Bar + Ask AI Quick Action -->
        <div class="search-filter-tabs-row">
          <div class="search-filter-tabs">
            <button
              v-for="tab in categoryTabs"
              :key="tab.id"
              type="button"
              class="search-filter-tab"
              :class="{ 'search-filter-tab--active': activeCategory === tab.id }"
              @click="activeCategory = tab.id; selectedIndex = 0; inputRef?.focus()"
            >
              {{ tab.label }}
            </button>
          </div>

          <button
            type="button"
            class="search-ask-ai-quick-btn"
            title="Deschide Asistentul AI WildFire"
            @click="askAi()"
          >
            <Icon icon="lucide:sparkles" width="11" height="11" class="text-amber-400" />
            <span>Ask AI</span>
          </button>
        </div>

        <!-- Recent Searches Row -->
        <div v-if="!query && recentSearches.length > 0" class="search-recent-row">
          <div class="search-recent-label">
            <Icon icon="lucide:clock" width="11" height="11" />
            <span>Recent Searches</span>
          </div>
          <div class="search-recent-chips">
            <button
              v-for="term in recentSearches"
              :key="term"
              type="button"
              class="search-recent-chip"
              @click="query = term; selectedIndex = 0; inputRef?.focus()"
            >
              <span>{{ term }}</span>
            </button>
            <button
              type="button"
              class="search-recent-clear"
              title="Clear recent searches"
              @click="clearRecentSearches"
            >
              <Icon icon="lucide:trash-2" width="11" height="11" />
            </button>
          </div>
        </div>

        <!-- AI Trending Questions -->
        <div v-if="!query" class="search-ai-trending-section">
          <div class="search-ai-trending-header">
            <div class="search-ai-trending-title">
              <Icon icon="lucide:sparkles" width="12" height="12" class="text-amber-400" />
              <span>ÎNTREBĂRI FRECVENTE AI</span>
            </div>
            <button
              type="button"
              class="search-ai-open-chat-link"
              @click="askAi()"
            >
              <span>Deschide Chat AI</span>
              <Icon icon="lucide:chevron-right" width="12" height="12" />
            </button>
          </div>

          <div class="search-ai-chips-list">
            <button
              v-for="(qText, qIdx) in trendingAiQuestions"
              :key="qIdx"
              type="button"
              class="search-ai-prompt-chip"
              @click="askAi(qText)"
            >
              <Icon icon="lucide:sparkles" width="10" height="10" class="search-chip-sparkle" />
              <span>{{ qText }}</span>
            </button>
          </div>
        </div>

        <!-- Search Results / Status -->
        <div class="search-results-wrapper" ref="resultsContainerRef">
          <div v-if="loading" class="search-status-state">
            <div class="search-spinner" aria-hidden="true" />
            <span>Indexing documentation database...</span>
          </div>

          <!-- AI Spotlight Action Row (When typing a query) -->
          <div v-if="hasAiSpotlight" class="search-results-list" role="listbox">
            <div class="search-section-label">AI ASSISTANT SPOTLIGHT</div>
            <div
              :data-index="0"
              role="option"
              :aria-selected="selectedIndex === 0"
              class="search-result-item search-result-item--ai"
              :class="{ 'search-result-item--selected': selectedIndex === 0 }"
              @click="askAi(query)"
              @mouseenter="selectedIndex = 0"
            >
              <div class="result-item-icon-box result-item-icon-box--ai">
                <Icon icon="lucide:sparkles" width="14" height="14" class="result-icon-ai" aria-hidden="true" />
              </div>

              <div class="result-item-content">
                <div class="result-item-title-row">
                  <span class="result-item-title result-item-title--ai">
                    Întreabă AI-ul despre: &ldquo;{{ query }}&rdquo;
                  </span>
                  <span class="result-item-category result-item-category--ai">
                    AI INTEL
                  </span>
                </div>
                <p class="result-item-snippet">
                  Obține un răspuns generat instant din toate cele 62 de ghiduri oficiale WildFire.ro.
                </p>
              </div>

              <div class="result-item-action">
                <span class="search-ai-enter-badge">Ask AI</span>
                <Icon icon="lucide:corner-down-left" width="13" height="13" class="result-item-enter-icon" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div v-if="!loading && results.length === 0 && !hasAiSpotlight" class="search-status-state">
            <p class="search-no-results">
              No matching results found for &ldquo;<strong>{{ query }}</strong>&rdquo;
            </p>
            <span class="search-no-results-hint">
              Try searching for keywords like &ldquo;setup&rdquo;, &ldquo;auth&rdquo;, &ldquo;vip&rdquo;, &ldquo;api&rdquo; or &ldquo;skins&rdquo;.
            </span>
          </div>

          <div v-if="!loading && results.length > 0" class="search-results-list" role="listbox">
            <div class="search-section-label">
              {{ !query.trim() ? 'Suggested Quicklinks' : `Documentation Matches (${results.length})` }}
            </div>

            <div
              v-for="(item, idx) in results"
              :key="item.id"
              :data-index="hasAiSpotlight ? idx + 1 : idx"
              role="option"
              :aria-selected="(hasAiSpotlight ? idx + 1 : idx) === selectedIndex"
              class="search-result-item"
              :class="{ 'search-result-item--selected': (hasAiSpotlight ? idx + 1 : idx) === selectedIndex }"
              @click="navigate(item.href)"
              @mouseenter="selectedIndex = hasAiSpotlight ? idx + 1 : idx"
            >
              <div class="result-item-icon-box">
                <Icon
                  :icon="item.href.includes('#') ? 'lucide:hash' : 'lucide:file-text'"
                  width="14"
                  height="14"
                  :class="item.href.includes('#') ? 'result-icon-heading' : 'result-icon-doc'"
                  aria-hidden="true"
                />
              </div>

              <div class="result-item-content">
                <div class="result-item-title-row">
                  <span class="result-item-title">{{ item.title }}</span>
                  <span
                    v-if="item.sectionTitle && item.sectionTitle !== item.title"
                    class="result-item-parent"
                  >
                    in {{ item.sectionTitle }}
                  </span>
                  <span class="result-item-category">{{ item.category }}</span>
                </div>

                <p v-if="item.contentSnippet" class="result-item-snippet">
                  {{ item.contentSnippet }}
                </p>
              </div>

              <div class="result-item-action">
                <Icon icon="lucide:corner-down-left" width="13" height="13" class="result-item-enter-icon" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Keyboard Helper Footer -->
        <div class="search-modal-footer">
          <div class="search-shortcuts-help">
            <span class="shortcut-tag">
              <kbd>↑</kbd>
              <kbd>↓</kbd>
              <span>Navigate</span>
            </span>
            <span class="shortcut-tag">
              <kbd>↵</kbd>
              <span>Select</span>
            </span>
            <span class="shortcut-tag">
              <kbd>ESC</kbd>
              <span>Dismiss</span>
            </span>
          </div>

          <div class="search-powered-by">
            <span>{{ chunks.length > 0 ? `${chunks.length} Topics Indexed` : 'Wildfire DeepSearch' }}</span>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
