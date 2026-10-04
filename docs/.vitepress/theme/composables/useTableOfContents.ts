import { ref, computed } from 'vue';

export interface TocItem {
  id: string;
  title: string;
  depth: number;
}

// Global shared reactive state for TOC across Desktop & Mobile
const items = ref<TocItem[]>([]);
const activeId = ref<string>('');
const scrollProgress = ref<number>(0);
const isClicking = ref<boolean>(false);
let clickTimer: ReturnType<typeof setTimeout> | null = null;
let ticking = false;

/**
 * Normalizes text or slug for fuzzy comparison.
 * Strips unicode accents, em-dashes, punctuation, and whitespace.
 */
export function normalizeText(str: string): string {
  return (str || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[—–]/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Resolves a heading element from the DOM with 100% resilience.
 * Handles VitePress's leading underscore prefix (_1-...), em-dashes (— vs - vs ---),
 * URI encoding, and normalized text/id matching.
 */
export function resolveHeadingElement(id: string): HTMLElement | null {
  if (!id || typeof document === 'undefined') return null;

  // 1. Direct ID match
  let el = document.getElementById(id);
  if (el) return el;

  // 2. Decode URI component (%C4%83 etc.)
  try {
    const decoded = decodeURIComponent(id);
    if (decoded !== id) {
      el = document.getElementById(decoded);
      if (el) return el;
    }
  } catch {}

  // 3. VitePress underscore prefix (_1-...)
  if (!id.startsWith('_')) {
    el = document.getElementById('_' + id);
    if (el) return el;
  } else {
    el = document.getElementById(id.slice(1));
    if (el) return el;
  }

  // 4. Em-dash and multi-hyphen variations (— vs - vs ---)
  const dashed = id.replace(/—/g, '-').replace(/-{2,}/g, '-');
  el = document.getElementById(dashed) || document.getElementById('_' + dashed);
  if (el) return el;

  const emDashed = id.replace(/-{1,3}/g, '—');
  el = document.getElementById(emDashed) || document.getElementById('_' + emDashed);
  if (el) return el;

  // 5. CSS escape selector query
  try {
    el = document.querySelector(`.vp-doc [id="${CSS.escape(id)}"], .prose [id="${CSS.escape(id)}"]`);
    if (el) return el;
  } catch {}

  // 6. Comprehensive normalized search across all headings in the article
  const container = document.querySelector('.vp-doc, .prose') || document.getElementById('main-content') || document.body;
  const headings = Array.from(
    container.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6')
  ).filter((h) => !h.closest('.doc-end-ai-card, .ai-panel-empty, .feedback-widget, .no-toc, .print-sheet-header, .page-header'));

  const targetNorm = normalizeText(id);

  // 6a. Match by heading.id normalized
  for (const h of headings) {
    if (h.id && normalizeText(h.id) === targetNorm) {
      return h;
    }
  }

  // 6b. Match by heading.textContent normalized
  for (const h of headings) {
    const textNorm = normalizeText(h.textContent || '');
    if (textNorm === targetNorm) {
      return h;
    }
  }

  // 6c. Substring match
  for (const h of headings) {
    const hNorm = normalizeText(h.id);
    if (hNorm && targetNorm && (hNorm.includes(targetNorm) || targetNorm.includes(hNorm))) {
      return h;
    }
  }

  return null;
}

/**
 * Scans and synchronizes headings from the live DOM (#, ##, ###, ####)
 * matching wf-docscore's extractToc #{1,4} behavior 1:1.
 */
export function syncHeadings(seedItems?: TocItem[]) {
  if (typeof document === 'undefined') return;

  const container = document.querySelector('.vp-doc, .prose') || document.getElementById('main-content');
  
  // If container not ready, seed directly with seedItems if available
  if (!container) {
    if (seedItems && seedItems.length > 0) {
      items.value = seedItems;
      if (!activeId.value) activeId.value = seedItems[0]?.id || '';
    }
    return;
  }

  // Query live document headings (h1-h4) while strictly ignoring non-article elements
  const elements = Array.from(
    container.querySelectorAll<HTMLElement>('h1, h2, h3, h4')
  ).filter((el) => {
    return !el.closest('.doc-end-ai-card, .ai-panel-empty, .feedback-widget, .no-toc, .print-sheet-header, .page-header');
  });

  if (elements.length === 0) {
    if (seedItems && seedItems.length > 0) {
      items.value = seedItems;
      if (!activeId.value) activeId.value = seedItems[0]?.id || '';
    } else {
      items.value = [];
      activeId.value = '';
    }
    return;
  }

  // Build live DOM list
  const domList: TocItem[] = elements.map((el, idx) => {
    let id = el.id;
    if (!id) {
      id = el.textContent?.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || `heading-${idx}`;
      el.id = id;
    }
    const tagDepth = parseInt(el.tagName.replace(/^H/i, ''), 10) || 2;
    const title = (el.textContent || '').replace(/^#\s*/, '').replace(/\u200b/g, '').trim();
    return {
      id,
      title,
      depth: Math.min(Math.max(tagDepth, 1), 4),
    };
  });

  // If seedItems provided, harmonize IDs to point to real DOM elements
  if (seedItems && seedItems.length > 0) {
    const reconciled: TocItem[] = [];
    for (const seed of seedItems) {
      const matchedEl = resolveHeadingElement(seed.id);
      if (matchedEl) {
        reconciled.push({
          ...seed,
          id: matchedEl.id,
        });
      } else {
        // Match by title
        const cleanSeedTitle = normalizeText(seed.title);
        const titleMatch = domList.find(d => normalizeText(d.title) === cleanSeedTitle);
        if (titleMatch) {
          reconciled.push({
            ...seed,
            id: titleMatch.id,
          });
        } else {
          reconciled.push(seed);
        }
      }
    }
    items.value = reconciled;
  } else {
    items.value = domList;
  }

  // Restore active ID from URL hash if valid
  if (typeof window !== 'undefined' && window.location.hash) {
    const rawHash = window.location.hash.replace(/^#/, '');
    const matched = resolveHeadingElement(rawHash);
    if (matched) {
      activeId.value = matched.id;
      return;
    }
  }

  // Fallback: activeId to first item
  if (!activeId.value || !items.value.some(i => i.id === activeId.value)) {
    activeId.value = items.value[0]?.id || '';
  }
}

/**
 * High-performance viewport scroll spy matching wf-docscore 1:1.
 * Uses requestAnimationFrame with ticking lock, 120px trigger line,
 * and bottom-of-page lock.
 */
export function onScrollSpy() {
  if (isClicking.value || typeof window === 'undefined' || items.value.length === 0) return;

  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const windowH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      const totalHeight = docH - windowH;

      // Calculate reading progress percentage
      if (totalHeight > 0) {
        scrollProgress.value = Math.min(100, Math.max(0, Math.round((scrollY / totalHeight) * 100)));
      }

      const list = items.value;
      if (list.length === 0) {
        ticking = false;
        return;
      }

      // Top of page: if scrolled near top, select the first item
      if (scrollY < 70) {
        const firstId = list[0]?.id;
        if (firstId && activeId.value !== firstId) {
          activeId.value = firstId;
        }
        ticking = false;
        return;
      }

      // Bottom of page lock: if scrolled to the very bottom, highlight the last heading (1:1 with wf-docscore)
      if (scrollY + windowH >= docH - 35) {
        const lastId = list[list.length - 1].id;
        if (activeId.value !== lastId) {
          activeId.value = lastId;
        }
        ticking = false;
        return;
      }

      // Dynamic live check against headings in viewport (120px trigger line from wf-docscore)
      const triggerLine = 120;
      let candidateId = list[0].id;

      for (let i = 0; i < list.length; i++) {
        const el = resolveHeadingElement(list[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerLine) {
            candidateId = list[i].id;
          } else {
            break;
          }
        }
      }

      if (candidateId && candidateId !== activeId.value) {
        activeId.value = candidateId;
      }

      ticking = false;
    });
    ticking = true;
  }
}

/**
 * Smooth click handler that sends the user EXACTLY to the clicked heading.
 * Uses native scrollIntoView honoring CSS scroll-margin-top with window.scrollTo fallback,
 * lock preventing scroll spy flicker, and updates the URL hash.
 */
export function scrollToHeading(id: string, offset = 80) {
  if (typeof window === 'undefined') return;
  const el = resolveHeadingElement(id);
  if (el) {
    isClicking.value = true;
    if (clickTimer) clearTimeout(clickTimer);

    activeId.value = el.id || id;

    // 1. First attempt native scrollIntoView which cleanly respects CSS scroll-margin-top
    try {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }

    // 2. Fallback secondary check: ensure the heading is exactly at scroll-margin-top offset
    setTimeout(() => {
      const rect = el.getBoundingClientRect();
      if (rect.top < 50 || rect.top > 120) {
        const exactY = rect.top + window.scrollY - offset;
        window.scrollTo({ top: exactY, behavior: 'smooth' });
      }
    }, 50);

    // 3. Update browser history hash
    try {
      window.history.pushState(null, '', `#${el.id || id}`);
    } catch {}

    // 4. Release clicking lock after scroll finishes
    clickTimer = setTimeout(() => {
      isClicking.value = false;
      onScrollSpy();
    }, 700);
  }
}

/**
 * Handles smooth scrolling to the target heading if the page was opened with a URL hash.
 */
export function handleInitialHash() {
  if (typeof window === 'undefined' || !window.location.hash) return;
  const rawHash = window.location.hash.replace(/^#/, '');
  if (!rawHash) return;

  setTimeout(() => {
    scrollToHeading(rawHash, 80);
  }, 300);
}

export function useTableOfContents() {
  const activeItem = computed(() => items.value.find((i) => i.id === activeId.value));

  return {
    items,
    activeId,
    activeItem,
    scrollProgress,
    isClicking,
    syncHeadings,
    onScrollSpy,
    scrollToHeading,
    resolveHeadingElement,
    handleInitialHash,
  };
}
