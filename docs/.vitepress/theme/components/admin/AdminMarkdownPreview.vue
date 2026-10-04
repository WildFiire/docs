<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Icon } from '@iconify/vue';

interface AdminMarkdownPreviewProps {
  rawContent: string;
  slug?: string;
}

const props = withDefaults(defineProps<AdminMarkdownPreviewProps>(), {
  slug: '',
});

const emit = defineEmits<{
  (e: 'content-change', newContent: string): void;
  (e: 'open-table-builder'): void;
  (e: 'open-callout-builder', type?: 'NOTE' | 'TIP' | 'IMPORTANT' | 'WARNING' | 'CAUTION'): void;
  (e: 'open-code-builder'): void;
  (e: 'open-media-modal'): void;
  (e: 'open-gallery-builder'): void;
}>();

const CATEGORY_NAMES: Record<string, string> = {
  informatii: 'Informații Generale',
  currency: 'Currency & Economie',
  systems: 'Sisteme & Mecanici',
  market: 'Market & Donații',
  staff: 'Ghiduri Administrative',
  regulamente: 'Regulamente Oficiale',
};

interface DocBlock {
  id: number;
  type: 'heading' | 'paragraph' | 'callout' | 'code' | 'table' | 'list' | 'cards' | 'image' | 'video' | 'hr';
  level?: number;
  calloutType?: string;
  codeLanguage?: string;
  headers?: string[];
  alignments?: string[];
  rows?: string[][];
  listItems?: { text: string; isTask?: boolean; isChecked?: boolean }[];
  cards?: { title: string; href: string; body: string }[];
  alt?: string;
  url?: string;
  src?: string;
  title?: string;
  text?: string;
}

function parseFrontmatter(raw: string): { meta: Record<string, any>; body: string } {
  if (!raw.trim().startsWith('---')) {
    return { meta: {}, body: raw };
  }

  const lines = raw.split(/\r?\n/);
  if (lines[0].trim() !== '---') {
    return { meta: {}, body: raw };
  }

  let endIdx = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      endIdx = i;
      break;
    }
  }

  if (endIdx === -1) {
    return { meta: {}, body: raw };
  }

  const yamlLines = lines.slice(1, endIdx);
  const body = lines.slice(endIdx + 1).join('\n');
  const meta: Record<string, any> = {};

  let currentKey = '';
  for (const line of yamlLines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > -1 && !line.startsWith(' ') && !line.startsWith('\t')) {
      const key = line.slice(0, colonIdx).trim();
      let val = line.slice(colonIdx + 1).trim();
      val = val.replace(/^["'](.*)["']$/, '$1');
      if (val === '>-' || val === '>' || val === '|') {
        currentKey = key;
        meta[key] = '';
      } else if (val.startsWith('[') && val.endsWith(']')) {
        meta[key] = val
          .slice(1, -1)
          .split(',')
          .map((s) => s.trim().replace(/^["'](.*)["']$/, '$1'))
          .filter(Boolean);
        currentKey = '';
      } else {
        meta[key] = val;
        currentKey = '';
      }
    } else if (currentKey && (line.startsWith(' ') || line.startsWith('\t'))) {
      meta[currentKey] = (meta[currentKey] ? meta[currentKey] + ' ' : '') + line.trim();
    }
  }

  return { meta, body };
}

function rebuildMarkdownWithFrontmatter(meta: Record<string, any>, body: string): string {
  const frontmatterLines: string[] = ['---'];
  for (const [key, val] of Object.entries(meta)) {
    if (val === undefined || val === null || val === '') continue;
    if (Array.isArray(val)) {
      frontmatterLines.push(`${key}: [${val.map((v) => `"${v}"`).join(', ')}]`);
    } else {
      frontmatterLines.push(`${key}: ${val}`);
    }
  }
  frontmatterLines.push('---');
  return `${frontmatterLines.join('\n')}\n\n${body.replace(/^\n+/, '')}`;
}

function parseMarkdownToBlocks(body: string, frontmatterTitle = ''): DocBlock[] {
  const lines = body.split('\n');
  const blocks: DocBlock[] = [];
  let inCodeBlock = false;
  let codeLanguage = '';
  let codeBuffer: string[] = [];
  let listBuffer: { text: string; isChecked?: boolean; isTask?: boolean }[] = [];
  let blockId = 0;
  let seenFirstHeading = false;

  const flushList = () => {
    if (listBuffer.length > 0) {
      blocks.push({
        id: blockId++,
        type: 'list',
        listItems: [...listBuffer],
      });
      listBuffer = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code Block Start / End
    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        flushList();
        inCodeBlock = true;
        codeLanguage = line.trim().slice(3).trim() || 'bash';
        codeBuffer = [];
      } else {
        inCodeBlock = false;
        blocks.push({
          id: blockId++,
          type: 'code',
          codeLanguage,
          text: codeBuffer.join('\n'),
        });
        codeBuffer = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Cards Grid (<Cards> ... </Cards>)
    if (line.trim().startsWith('<Cards>')) {
      flushList();
      const cardMatches: { title: string; href: string; body: string }[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().includes('</Cards>')) {
        const cardLine = lines[i];
        const match = cardLine.match(/<Card\s+title=["'](.*?)["'](?:\s+href=["'](.*?)["'])?/i);
        if (match) {
          const cTitle = match[1];
          const cHref = match[2] || '#';
          const cBodyLines: string[] = [];
          i++;
          while (i < lines.length && !lines[i].trim().includes('</Card>') && !lines[i].trim().includes('</Cards>')) {
            if (lines[i].trim()) cBodyLines.push(lines[i].trim());
            i++;
          }
          cardMatches.push({ title: cTitle, href: cHref, body: cBodyLines.join(' ') });
        }
        i++;
      }

      blocks.push({
        id: blockId++,
        type: 'cards',
        cards: cardMatches,
      });
      continue;
    }

    // Markdown Table
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      flushList();
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      i--;

      if (tableLines.length >= 2) {
        const rawHeaders = tableLines[0].split('|').slice(1, -1).map((c) => c.trim());
        const rawAlignments = (tableLines[1] || '').split('|').slice(1, -1).map((c) => {
          const trimmed = c.trim();
          if (trimmed.startsWith(':') && trimmed.endsWith(':')) return 'center';
          if (trimmed.endsWith(':')) return 'right';
          return 'left';
        });
        const rawDataRows = tableLines.slice(2).map((rowLine) =>
          rowLine.split('|').slice(1, -1).map((c) => c.trim())
        );

        blocks.push({
          id: blockId++,
          type: 'table',
          headers: rawHeaders,
          alignments: rawAlignments,
          rows: rawDataRows,
        });
        continue;
      }
    }

    // Headings
    if (line.startsWith('# ')) {
      flushList();
      const titleText = line.slice(2).trim();
      if (!seenFirstHeading && frontmatterTitle && titleText.toLowerCase() === frontmatterTitle.trim().toLowerCase()) {
        seenFirstHeading = true;
        continue;
      }
      seenFirstHeading = true;
      blocks.push({ id: blockId++, type: 'heading', level: 1, text: titleText });
      continue;
    }
    if (line.startsWith('## ')) {
      flushList();
      seenFirstHeading = true;
      blocks.push({ id: blockId++, type: 'heading', level: 2, text: line.slice(3).trim() });
      continue;
    }
    if (line.startsWith('### ')) {
      flushList();
      seenFirstHeading = true;
      blocks.push({ id: blockId++, type: 'heading', level: 3, text: line.slice(4).trim() });
      continue;
    }
    if (line.startsWith('#### ')) {
      flushList();
      seenFirstHeading = true;
      blocks.push({ id: blockId++, type: 'heading', level: 4, text: line.slice(5).trim() });
      continue;
    }

    // Callouts
    if (line.startsWith('> [!')) {
      flushList();
      const alertTypeMatch = line.match(/^>\s*\[!([A-Z]+)\]\s*(.*)?$/i);
      const type = alertTypeMatch ? alertTypeMatch[1].toUpperCase() : 'NOTE';
      const firstLineRest = alertTypeMatch?.[2]?.trim() || '';
      const alertLines: string[] = [];

      if (firstLineRest) alertLines.push(firstLineRest);

      while (i + 1 < lines.length && lines[i + 1].startsWith('>')) {
        i++;
        alertLines.push(lines[i].replace(/^>\s?/, ''));
      }

      blocks.push({
        id: blockId++,
        type: 'callout',
        calloutType: type,
        text: alertLines.join('\n'),
      });
      continue;
    }

    // Images
    const imgMatch = line.trim().match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      flushList();
      blocks.push({
        id: blockId++,
        type: 'image',
        alt: imgMatch[1],
        url: imgMatch[2],
      });
      continue;
    }

    // Video Tags
    const videoMatch = line.trim().match(/<DocVideo\s+src=["'](.*?)["'](?:\s+title=["'](.*?)["'])?/i);
    if (videoMatch) {
      flushList();
      blocks.push({
        id: blockId++,
        type: 'video',
        src: videoMatch[1],
        title: videoMatch[2] || 'Video Player',
      });
      continue;
    }

    // Lists & Checklists
    const taskMatch = line.trim().match(/^[-*]\s+\[([ xX])\]\s+(.+)$/);
    if (taskMatch) {
      const isChecked = taskMatch[1].toLowerCase() === 'x';
      listBuffer.push({ text: taskMatch[2], isChecked, isTask: true });
      continue;
    }

    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      listBuffer.push({ text: line.trim().slice(2), isTask: false });
      continue;
    }

    // Horizontal Rules
    if (line.trim() === '---' || line.trim() === '***') {
      flushList();
      blocks.push({ id: blockId++, type: 'hr' });
      continue;
    }

    // Regular Paragraph
    if (line.trim()) {
      flushList();
      blocks.push({
        id: blockId++,
        type: 'paragraph',
        text: line.trim(),
      });
    }
  }

  flushList();
  return blocks;
}

function serializeBlocksToMarkdown(blocks: DocBlock[]): string {
  const parts: string[] = [];

  for (const b of blocks) {
    if (b.type === 'heading') {
      parts.push(`${'#'.repeat(b.level || 2)} ${b.text || ''}`);
    } else if (b.type === 'paragraph') {
      parts.push(b.text || '');
    } else if (b.type === 'callout') {
      const type = (b.calloutType || 'NOTE').toUpperCase();
      const lines = (b.text || '').split('\n');
      parts.push(`> [!${type}]\n` + lines.map((l) => `> ${l}`).join('\n'));
    } else if (b.type === 'code') {
      parts.push(`\`\`\`${b.codeLanguage || 'bash'}\n${b.text || ''}\n\`\`\``);
    } else if (b.type === 'table') {
      const headers = b.headers || [];
      const alignments = b.alignments || [];
      const rows = b.rows || [];
      const headerLine = `| ${headers.join(' | ')} |`;
      const alignLine = `| ${alignments
        .map((a) => (a === 'center' ? ':---:' : a === 'right' ? '---:' : ':---'))
        .join(' | ')} |`;
      const rowLines = rows.map((r) => `| ${r.join(' | ')} |`);
      parts.push([headerLine, alignLine, ...rowLines].join('\n'));
    } else if (b.type === 'list') {
      const listLines = (b.listItems || []).map((item) => {
        if (item.isTask) {
          return `- [${item.isChecked ? 'x' : ' '}] ${item.text}`;
        }
        return `- ${item.text}`;
      });
      parts.push(listLines.join('\n'));
    } else if (b.type === 'cards') {
      const cardLines = (b.cards || []).map(
        (c) => `  <Card title="${c.title}" href="${c.href}">\n    ${c.body}\n  </Card>`
      );
      parts.push(`<Cards>\n${cardLines.join('\n')}\n</Cards>`);
    } else if (b.type === 'image') {
      parts.push(`![${b.alt || ''}](${b.url || ''})`);
    } else if (b.type === 'video') {
      parts.push(`<DocVideo src="${b.src || ''}" title="${b.title || ''}" />`);
    } else if (b.type === 'hr') {
      parts.push('---');
    }
  }

  return parts.join('\n\n');
}

const parsed = computed(() => parseFrontmatter(props.rawContent));
const meta = computed(() => parsed.value.meta);
const body = computed(() => parsed.value.body);
const blocks = ref<DocBlock[]>([]);

watch(
  () => [body.value, meta.value.title],
  () => {
    blocks.value = parseMarkdownToBlocks(body.value, meta.value.title || '');
  },
  { immediate: true }
);

function syncBlocksToParent(newBlocks: DocBlock[]) {
  blocks.value = newBlocks;
  const serializedBody = serializeBlocksToMarkdown(newBlocks);
  const fullMarkdown = rebuildMarkdownWithFrontmatter(meta.value, serializedBody);
  emit('content-change', fullMarkdown);
}

const totalWords = computed(() => {
  return body.value.trim() ? body.value.trim().split(/\s+/).length : 0;
});

const estimatedReadingTime = computed(() => {
  return Math.max(1, Math.ceil(totalWords.value / 200));
});

const categoryLabel = computed(() => {
  if (meta.value.category) {
    const cat = String(meta.value.category).toLowerCase();
    return CATEGORY_NAMES[cat] || meta.value.category;
  }
  if (props.slug) {
    const root = props.slug.split('/').filter(Boolean)[0] || '';
    return CATEGORY_NAMES[root] || (root ? root.replace(/-/g, ' ') : 'Documentație');
  }
  return 'Documentație';
});

const authorName = computed(() => meta.value.author || meta.value.authors?.[0] || 'iannC69');

function handleTitleBlur(e: FocusEvent) {
  const newTitle = (e.currentTarget as HTMLElement).textContent?.trim() || '';
  if (newTitle !== meta.value.title) {
    const updatedMeta = { ...meta.value, title: newTitle };
    const serializedBody = serializeBlocksToMarkdown(blocks.value);
    const fullMarkdown = rebuildMarkdownWithFrontmatter(updatedMeta, serializedBody);
    emit('content-change', fullMarkdown);
  }
}

function handleDescBlur(e: FocusEvent) {
  const newDesc = (e.currentTarget as HTMLElement).textContent?.trim() || '';
  if (newDesc !== meta.value.description) {
    const updatedMeta = { ...meta.value, description: newDesc };
    const serializedBody = serializeBlocksToMarkdown(blocks.value);
    const fullMarkdown = rebuildMarkdownWithFrontmatter(updatedMeta, serializedBody);
    emit('content-change', fullMarkdown);
  }
}

function handleBlockTextBlur(blockId: number, newText: string) {
  const updated = blocks.value.map((b) => {
    if (b.id === blockId) {
      return { ...b, text: newText.trim() };
    }
    return b;
  });
  syncBlocksToParent(updated);
}

function handleTableCellBlur(blockId: number, rowIdx: number, colIdx: number, newText: string) {
  const updated = blocks.value.map((b) => {
    if (b.id === blockId && b.rows) {
      const nextRows = b.rows.map((r, rI) => {
        if (rI === rowIdx) {
          const nextCols = [...r];
          nextCols[colIdx] = newText.trim();
          return nextCols;
        }
        return r;
      });
      return { ...b, rows: nextRows };
    }
    return b;
  });
  syncBlocksToParent(updated);
}

function handleTableHeaderBlur(blockId: number, colIdx: number, newText: string) {
  const updated = blocks.value.map((b) => {
    if (b.id === blockId && b.headers) {
      const nextHeaders = [...b.headers];
      nextHeaders[colIdx] = newText.trim();
      return { ...b, headers: nextHeaders };
    }
    return b;
  });
  syncBlocksToParent(updated);
}

function handleTaskToggle(blockId: number, itemIdx: number) {
  const updated = blocks.value.map((b) => {
    if (b.id === blockId && b.listItems) {
      const nextItems = b.listItems.map((it, i) => {
        if (i === itemIdx) {
          return { ...it, isChecked: !it.isChecked };
        }
        return it;
      });
      return { ...b, listItems: nextItems };
    }
    return b;
  });
  syncBlocksToParent(updated);
}

function handleListItemBlur(blockId: number, itemIdx: number, newText: string) {
  const updated = blocks.value.map((b) => {
    if (b.id === blockId && b.listItems) {
      const nextItems = b.listItems.map((it, i) => {
        if (i === itemIdx) {
          return { ...it, text: newText.trim() };
        }
        return it;
      });
      return { ...b, listItems: nextItems };
    }
    return b;
  });
  syncBlocksToParent(updated);
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 700; color: var(--color-text);">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="font-style: italic; color: var(--color-text-secondary);">$1</em>')
    .replace(
      /`([^`]+)`/g,
      '<code style="font-family: var(--font-mono); padding: 2px 6px; border-radius: 4px; font-size: 0.85em; background: hsl(26 100% 52% / 0.12); color: hsl(26 100% 55%); border: 1px solid hsl(26 100% 52% / 0.25); font-weight: 600;">$1</code>'
    )
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: hsl(26 100% 55%); text-decoration: underline; text-underline-offset: 3px; font-weight: 500;">$1</a>'
    );
}

// Copy Code Block State
const copiedBlockId = ref<number | null>(null);
function handleCopyCode(blockId: number, codeText: string) {
  navigator.clipboard.writeText(codeText);
  copiedBlockId.value = blockId;
  setTimeout(() => (copiedBlockId.value = null), 2000);
}
</script>

<template>
  <div class="admin-preview-root">
    <article id="main-content" class="docs-content">
      <div class="docs-content-inner">
        <!-- Top Row: Breadcrumbs & Path Badge -->
        <div class="admin-preview-breadcrumbs-row">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <div class="admin-preview-cat-pill">
              <span class="admin-preview-pill-dot" aria-hidden="true" />
              <span>{{ categoryLabel }}</span>
            </div>
            <span
              v-if="meta.badge"
              class="badge page-tag-badge"
              :class="`badge--${String(meta.badge).toLowerCase()}`"
            >
              {{ meta.badge }}
            </span>
          </div>

          <span v-if="slug" class="admin-preview-path-pill">
            /docs/{{ slug.replace(/^\/+/, '') }}
          </span>
        </div>

        <!-- Page Header: Directly Editable Title & Description (Syncs to frontmatter) -->
        <header class="admin-preview-header">
          <h1
            class="admin-preview-title"
            contenteditable="true"
            title="Fă click pentru a edita titlul (se salvează direct în cod)"
            style="outline: none; cursor: text;"
            @blur="handleTitleBlur"
          >
            {{ meta.title || 'Ghid Fără Titlu' }}
          </h1>

          <p
            class="admin-preview-desc"
            contenteditable="true"
            title="Fă click pentru a edita descrierea (se salvează direct în cod)"
            style="outline: none; cursor: text;"
            @blur="handleDescBlur"
          >
            {{ meta.description || 'Adaugă o descriere scurtă pentru acest ghid...' }}
          </p>

          <!-- Comprehensive Metadata: Author, Commit, Read Time, Word Count -->
          <div class="admin-preview-meta-bar">
            <!-- Author Card / Updated By -->
            <div class="admin-preview-author-chip">
              <img
                :src="`https://github.com/${authorName}.png`"
                :alt="authorName"
                class="admin-preview-author-avatar"
                @error="($event.target as HTMLElement).style.display = 'none'"
              />
              <span style="display: inline-flex; align-items: center; gap: 4px;">
                <span style="color: var(--color-text-tertiary);">Updated by</span>
                <span style="font-weight: 600; color: var(--color-text);">{{ authorName }}</span>
              </span>
              <span style="color: var(--color-text-tertiary);">·</span>
              <span style="color: #10b981; font-weight: 600;">Live Preview</span>
            </div>

            <!-- Read Time & Word Count -->
            <div class="admin-preview-read-chip">
              <Icon icon="lucide:clock" width="12" height="12" style="color: hsl(26 100% 55%);" />
              <span>{{ estimatedReadingTime }} min read · {{ totalWords }} cuvinte</span>
            </div>

            <!-- Frontmatter Tags -->
            <div v-if="meta.tags && Array.isArray(meta.tags)" class="admin-preview-tags-wrap">
              <span v-for="(t, i) in meta.tags" :key="i" class="admin-preview-tag-pill">
                #{{ t }}
              </span>
            </div>
          </div>
        </header>

        <!-- Rendered Markdown Body with Direct Click-to-Edit & Real-Time Code Sync -->
        <div class="prose" style="max-width: 100%;">
          <div v-if="blocks.length === 0" class="admin-preview-empty">
            <Icon icon="lucide:file-text" width="42" height="42" style="color: var(--color-text-tertiary); margin: 0 auto 12px;" />
            <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--color-text); margin: 0 0 6px;">Documentul este gol</h4>
            <p style="font-size: 0.82rem; color: var(--color-text-secondary); margin: 0;">Introdu conținut în editorul Cod sau folosește instrumentele de inserare.</p>
          </div>

          <template v-else>
            <template v-for="b in blocks" :key="b.id">
              <!-- 1. Headings -->
              <h1
                v-if="b.type === 'heading' && b.level === 1"
                contenteditable="true"
                style="font-size: 1.85rem; font-weight: 800; margin-top: 28px; margin-bottom: 14px; color: var(--color-text); outline: none; cursor: text;"
                @blur="handleBlockTextBlur(b.id, ($event.target as HTMLElement).textContent || '')"
              >
                {{ b.text }}
              </h1>
              <h2
                v-else-if="b.type === 'heading' && b.level === 2"
                contenteditable="true"
                style="font-size: 1.45rem; font-weight: 750; margin-top: 28px; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid var(--glass-border); color: var(--color-text); outline: none; cursor: text;"
                @blur="handleBlockTextBlur(b.id, ($event.target as HTMLElement).textContent || '')"
              >
                {{ b.text }}
              </h2>
              <h3
                v-else-if="b.type === 'heading' && b.level === 3"
                contenteditable="true"
                style="font-size: 1.2rem; font-weight: 700; margin-top: 22px; margin-bottom: 8px; color: var(--color-text); outline: none; cursor: text;"
                @blur="handleBlockTextBlur(b.id, ($event.target as HTMLElement).textContent || '')"
              >
                {{ b.text }}
              </h3>
              <h4
                v-else-if="b.type === 'heading'"
                contenteditable="true"
                style="font-size: 1.02rem; font-weight: 700; margin-top: 18px; margin-bottom: 6px; color: var(--color-text); outline: none; cursor: text;"
                @blur="handleBlockTextBlur(b.id, ($event.target as HTMLElement).textContent || '')"
              >
                {{ b.text }}
              </h4>

              <!-- 2. Paragraph -->
              <p
                v-else-if="b.type === 'paragraph'"
                contenteditable="true"
                style="margin: 12px 0; color: var(--color-text-secondary); line-height: 1.65; font-size: 0.92rem; outline: none; cursor: text;"
                @blur="handleBlockTextBlur(b.id, ($event.target as HTMLElement).textContent || '')"
                v-html="formatInline(b.text || '')"
              />

              <!-- 3. Callout Alert -->
              <div
                v-else-if="b.type === 'callout'"
                class="callout"
                :class="`callout--${(b.calloutType || 'NOTE').toLowerCase()}`"
                style="margin: 20px 0;"
                role="note"
              >
                <div class="callout-icon-wrapper" aria-hidden="true">
                  <Icon
                    v-if="b.calloutType === 'TIP'"
                    icon="lucide:check-circle-2"
                    width="16"
                    height="16"
                  />
                  <Icon
                    v-else-if="b.calloutType === 'IMPORTANT'"
                    icon="lucide:flame"
                    width="16"
                    height="16"
                  />
                  <Icon
                    v-else-if="b.calloutType === 'WARNING'"
                    icon="lucide:triangle-alert"
                    width="16"
                    height="16"
                  />
                  <Icon
                    v-else-if="b.calloutType === 'CAUTION' || b.calloutType === 'DANGER'"
                    icon="lucide:shield-alert"
                    width="16"
                    height="16"
                  />
                  <Icon
                    v-else
                    icon="lucide:info"
                    width="16"
                    height="16"
                  />
                </div>
                <div class="callout-content">
                  <div class="callout-title">
                    {{
                      b.calloutType === 'TIP'
                        ? 'SFAT PRACTIC'
                        : b.calloutType === 'IMPORTANT'
                        ? 'IMPORTANT'
                        : b.calloutType === 'WARNING'
                        ? 'ATENȚIE'
                        : b.calloutType === 'CAUTION' || b.calloutType === 'DANGER'
                        ? 'PRECAUȚIE'
                        : 'NOTĂ INFORMATIVĂ'
                    }}
                  </div>
                  <div
                    class="callout-body"
                    contenteditable="true"
                    style="outline: none; cursor: text;"
                    @blur="handleBlockTextBlur(b.id, ($event.target as HTMLElement).textContent || '')"
                    v-html="formatInline(b.text || '')"
                  />
                </div>
              </div>

              <!-- 4. Code Block -->
              <div v-else-if="b.type === 'code'" class="admin-preview-codeblock not-prose">
                <div class="admin-preview-code-header">
                  <div class="admin-preview-code-lang">
                    <Icon icon="lucide:terminal" width="13" height="13" style="color: hsl(26 100% 55%);" />
                    <span>{{ b.codeLanguage || 'bash' }}</span>
                  </div>
                  <button
                    type="button"
                    class="admin-preview-copy-btn"
                    title="Copiază codul"
                    @click="handleCopyCode(b.id, b.text || '')"
                  >
                    <Icon
                      :icon="copiedBlockId === b.id ? 'lucide:check' : 'lucide:copy'"
                      width="12"
                      height="12"
                      :style="{ color: copiedBlockId === b.id ? '#10b981' : undefined }"
                    />
                    <span>{{ copiedBlockId === b.id ? 'Copiat' : 'Copy' }}</span>
                  </button>
                </div>
                <pre
                  class="admin-preview-code-pre"
                  contenteditable="true"
                  @blur="handleBlockTextBlur(b.id, ($event.target as HTMLElement).textContent || '')"
                ><code>{{ b.text }}</code></pre>
              </div>

              <!-- 5. Table -->
              <div v-else-if="b.type === 'table'" class="admin-preview-table-wrapper not-prose">
                <button
                  type="button"
                  class="admin-preview-table-btn"
                  title="Deschide generatorul de tabele"
                  @click="emit('open-table-builder')"
                >
                  <Icon icon="lucide:edit-3" width="11" height="11" />
                  <span>Editează Tabel</span>
                </button>
                <table class="admin-preview-table">
                  <thead>
                    <tr>
                      <th
                        v-for="(h, colIdx) in (b.headers || [])"
                        :key="colIdx"
                        :style="{ textAlign: (b.alignments?.[colIdx] as any) || 'left', outline: 'none', cursor: 'text' }"
                        contenteditable="true"
                        @blur="handleTableHeaderBlur(b.id, colIdx, ($event.target as HTMLElement).textContent || '')"
                        v-html="formatInline(h)"
                      />
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, rowIdx) in (b.rows || [])" :key="rowIdx">
                      <td
                        v-for="(cell, colIdx) in row"
                        :key="colIdx"
                        :style="{ textAlign: (b.alignments?.[colIdx] as any) || 'left', outline: 'none', cursor: 'text' }"
                        contenteditable="true"
                        @blur="handleTableCellBlur(b.id, rowIdx, colIdx, ($event.target as HTMLElement).textContent || '')"
                        v-html="formatInline(cell)"
                      />
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- 6. List & Checklist -->
              <ul
                v-else-if="b.type === 'list'"
                style="margin: 14px 0; padding-left: 24px; list-style-type: disc;"
              >
                <template v-for="(item, i) in (b.listItems || [])" :key="i">
                  <li
                    v-if="item.isTask"
                    style="list-style-type: none; margin-left: -20px; display: flex; align-items: flex-start; gap: 8px; color: var(--color-text-secondary);"
                  >
                    <input
                      type="checkbox"
                      :checked="item.isChecked"
                      style="margin-top: 4px; accent-color: hsl(26 100% 52%); cursor: pointer;"
                      @change="handleTaskToggle(b.id, i)"
                    />
                    <span
                      contenteditable="true"
                      style="outline: none; cursor: text;"
                      @blur="handleListItemBlur(b.id, i, ($event.target as HTMLElement).textContent || '')"
                      v-html="formatInline(item.text)"
                    />
                  </li>
                  <li
                    v-else
                    style="color: var(--color-text-secondary); margin-bottom: 4px;"
                  >
                    <span
                      contenteditable="true"
                      style="outline: none; cursor: text;"
                      @blur="handleListItemBlur(b.id, i, ($event.target as HTMLElement).textContent || '')"
                      v-html="formatInline(item.text)"
                    />
                  </li>
                </template>
              </ul>

              <!-- 7. Cards -->
              <div v-else-if="b.type === 'cards'" class="admin-preview-cards-grid not-prose">
                <div v-for="(c, cIdx) in (b.cards || [])" :key="cIdx" class="admin-preview-card">
                  <div>
                    <div class="admin-preview-card-top">
                      <span class="admin-preview-card-title">{{ c.title }}</span>
                      <Icon icon="lucide:arrow-right" width="14" height="14" style="color: var(--color-text-tertiary);" />
                    </div>
                    <p v-if="c.body" class="admin-preview-card-desc">{{ c.body }}</p>
                  </div>
                  <span v-if="c.href" class="admin-preview-card-link">{{ c.href }}</span>
                </div>
              </div>

              <!-- 8. Image -->
              <figure v-else-if="b.type === 'image'" style="margin: 20px 0;" class="not-prose">
                <div style="border-radius: 12px; overflow: hidden; border: 1px solid var(--glass-border); background: hsl(220 22% 7%); box-shadow: 0 4px 16px rgba(0,0,0,0.3);">
                  <img :src="b.url" :alt="b.alt" style="width: 100%; height: auto; display: block;" loading="lazy" />
                </div>
                <figcaption
                  v-if="b.alt"
                  style="text-align: center; font-size: 0.74rem; color: var(--color-text-tertiary); margin-top: 8px; font-weight: 500;"
                >
                  {{ b.alt }}
                </figcaption>
              </figure>

              <!-- 9. Video -->
              <div
                v-else-if="b.type === 'video'"
                style="margin: 20px 0; border-radius: 12px; overflow: hidden; border: 1px solid var(--glass-border); background: rgba(0,0,0,0.6);"
                class="not-prose"
              >
                <iframe
                  v-if="(b.src || '').includes('youtube.com') || (b.src || '').includes('youtu.be')"
                  :src="b.src"
                  style="width: 100%; aspect-ratio: 16/9; border: none;"
                  allowfullscreen
                  :title="b.title || 'Video Player'"
                />
                <video
                  v-else
                  :src="b.src"
                  controls
                  style="width: 100%; aspect-ratio: 16/9; display: block;"
                />
                <div style="padding: 10px 14px; background: hsl(220 22% 9%); font-size: 0.74rem; color: var(--color-text-secondary); font-weight: 600; border-top: 1px solid var(--glass-border); display: flex; align-items: center; gap: 8px;">
                  <Icon icon="lucide:play" width="12" height="12" style="color: hsl(26 100% 55%);" />
                  <span>{{ b.title || 'Video Player' }}</span>
                </div>
              </div>

              <!-- 10. Horizontal Rule -->
              <hr
                v-else-if="b.type === 'hr'"
                style="margin: 28px 0; border: none; border-top: 1px solid var(--glass-border);"
              />
            </template>
          </template>
        </div>
      </div>
    </article>
  </div>
</template>
