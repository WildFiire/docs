<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRoute } from 'vitepress';
import { Icon } from '@iconify/vue';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string | Date;
  interactionId?: string;
  feedback?: 'helpful' | 'unhelpful' | null;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

type ChatStatus = 'idle' | 'loading' | 'done' | 'error';
type LayoutMode = 'side' | 'modal' | 'fullscreen';

const route = useRoute();
const isOpen = ref(false);
const layoutMode = ref<LayoutMode>('side');
const showSettings = ref(false);
const showHistory = ref(false);
const showMoreMenu = ref(false);
const sessions = ref<ChatSession[]>([]);
const activeSessionId = ref<string>('');
const messages = ref<Message[]>([]);
const input = ref('');
const status = ref<ChatStatus>('idle');
const copiedId = ref<string | null>(null);
const toastMessage = ref<string | null>(null);
const thinkingIndex = ref(0);
const cooldownSeconds = ref<number | null>(null);

const messagesEndRef = ref<HTMLDivElement | null>(null);
const inputRef = ref<HTMLTextAreaElement | null>(null);
let abortCtrl: AbortController | null = null;
let cooldownTimer: ReturnType<typeof setInterval> | null = null;
let thinkingTimer: ReturnType<typeof setInterval> | null = null;

const isAdmin = computed(() => route.path?.startsWith('/admin'));
const isLoading = computed(() => status.value === 'loading');
const isCooldownActive = computed(() => cooldownSeconds.value !== null && cooldownSeconds.value > 0);
const canSubmit = computed(() => !isLoading.value && !isCooldownActive.value && input.value.trim().length > 0);

const thinkingSteps = [
  'Consult indexul de 62 documente...',
  'Analizez regulamentele & comenzile...',
  'Structurez datele relevante...',
  'Formulez răspunsul oficial...',
];

function showToast(msg: string) {
  toastMessage.value = msg;
  setTimeout(() => {
    toastMessage.value = null;
  }, 2500);
}

function handleInputChange(e: Event) {
  const target = e.target as HTMLTextAreaElement;
  input.value = target.value;
  target.style.height = 'auto';
  target.style.height = Math.min(target.scrollHeight, 120) + 'px';
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSubmit();
  }
}

function changeLayoutMode(mode: LayoutMode) {
  layoutMode.value = mode;
  showSettings.value = false;
  try {
    localStorage.setItem('wf_ai_layout_mode', mode);
  } catch {}
}

function cycleLayoutMode() {
  if (layoutMode.value === 'side') changeLayoutMode('modal');
  else if (layoutMode.value === 'modal') changeLayoutMode('fullscreen');
  else changeLayoutMode('side');
}

function syncSessionsToStorage(updatedMessages: Message[], targetSessionId = activeSessionId.value) {
  if (!targetSessionId) return;

  const firstUserQuestion =
    updatedMessages.find((m) => m.role === 'user')?.content.slice(0, 48).trim() ||
    'Conversație Nouă';

  const exists = sessions.value.some((s) => s.id === targetSessionId);
  let nextSessions: ChatSession[];

  if (exists) {
    nextSessions = sessions.value.map((s) => {
      if (s.id === targetSessionId) {
        return {
          ...s,
          title: s.title === 'Conversație Nouă' || !s.messages.length ? firstUserQuestion : s.title,
          messages: updatedMessages,
          updatedAt: Date.now(),
        };
      }
      return s;
    });
  } else {
    nextSessions = [
      {
        id: targetSessionId,
        title: firstUserQuestion,
        messages: updatedMessages,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      ...sessions.value,
    ];
  }

  sessions.value = nextSessions;
  try {
    localStorage.setItem('wf_ai_chat_sessions_v3', JSON.stringify(nextSessions));
    localStorage.setItem('wf_ai_active_session_id', targetSessionId);
  } catch {}
}

function handleNewChat() {
  abortCtrl?.abort();
  const newId = crypto.randomUUID();
  const newSession: ChatSession = {
    id: newId,
    title: 'Conversație Nouă',
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const updated = [newSession, ...sessions.value.filter((s) => s.messages.length > 0)];
  sessions.value = updated;
  try {
    localStorage.setItem('wf_ai_chat_sessions_v3', JSON.stringify(updated));
    localStorage.setItem('wf_ai_active_session_id', newId);
  } catch {}

  activeSessionId.value = newId;
  messages.value = [];
  status.value = 'idle';
  input.value = '';
  showHistory.value = false;
  showSettings.value = false;
  setTimeout(() => inputRef.value?.focus(), 150);
}

function selectSession(id: string) {
  abortCtrl?.abort();
  const target = sessions.value.find((s) => s.id === id);
  if (target) {
    activeSessionId.value = target.id;
    messages.value = target.messages.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
    status.value = target.messages.length > 0 ? 'done' : 'idle';
    showHistory.value = false;
    try {
      localStorage.setItem('wf_ai_active_session_id', target.id);
    } catch {}
    setTimeout(() => inputRef.value?.focus(), 100);
  }
}

function deleteSession(id: string, e: MouseEvent) {
  e.stopPropagation();
  const filtered = sessions.value.filter((s) => s.id !== id);
  let nextActive = activeSessionId.value;

  if (activeSessionId.value === id) {
    if (filtered.length > 0) {
      nextActive = filtered[0].id;
      messages.value = filtered[0].messages.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
      status.value = filtered[0].messages.length > 0 ? 'done' : 'idle';
    } else {
      const freshId = crypto.randomUUID();
      const fresh: ChatSession = {
        id: freshId,
        title: 'Conversație Nouă',
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      filtered.push(fresh);
      nextActive = freshId;
      messages.value = [];
      status.value = 'idle';
    }
    activeSessionId.value = nextActive;
  }

  sessions.value = filtered;
  try {
    localStorage.setItem('wf_ai_chat_sessions_v3', JSON.stringify(filtered));
    localStorage.setItem('wf_ai_active_session_id', nextActive);
  } catch {}
}

function clearAllHistory() {
  abortCtrl?.abort();
  const freshId = crypto.randomUUID();
  const freshSession: ChatSession = {
    id: freshId,
    title: 'Conversație Nouă',
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  sessions.value = [freshSession];
  activeSessionId.value = freshId;
  messages.value = [];
  status.value = 'idle';
  showHistory.value = false;
  try {
    localStorage.removeItem('wf_ai_chat_sessions_v3');
    localStorage.setItem('wf_ai_active_session_id', freshId);
  } catch {}
  setTimeout(() => inputRef.value?.focus(), 100);
}

function handleCopy(id: string, text: string) {
  if (!navigator?.clipboard) return;
  navigator.clipboard.writeText(text);
  copiedId.value = id;
  setTimeout(() => {
    copiedId.value = null;
  }, 2000);
}

function handleClear() {
  abortCtrl?.abort();
  messages.value = [];
  syncSessionsToStorage([]);
  status.value = 'idle';
  inputRef.value?.focus();
}

function handleExportMarkdown() {
  if (messages.value.length === 0) return;
  const currentSession = sessions.value.find((s) => s.id === activeSessionId.value);
  const title = currentSession?.title || 'Conversatie';
  const dateStr = new Date().toLocaleString('ro-RO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  let md = `# Conversație WildFire AI Assistant — ${title}\n\n`;
  md += `*Data:* ${dateStr}\n`;
  md += `*Platformă:* WF-DOCSCORE v1.7.0 (https://wildfire.ro)\n\n`;
  md += `---\n\n`;

  messages.value.forEach((m) => {
    if (m.role === 'user') {
      md += `### Întrebare Utilizator:\n${m.content}\n\n`;
    } else {
      md += `### Răspuns WildFire AI Assistant:\n${m.content}\n\n---\n\n`;
    }
  });

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const cleanSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32) || 'conversatie';
  a.download = `wildfire-ai-${cleanSlug}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Conversația a fost exportată (.md)!');
}

function handleCopyDiscord() {
  if (messages.value.length === 0) return;
  const currentSession = sessions.value.find((s) => s.id === activeSessionId.value);
  const title = currentSession?.title || 'Conversație';

  let text = `**[WildFire AI Support] ${title}**\n\n`;
  messages.value.forEach((m) => {
    if (m.role === 'user') {
      text += `> **Utilizator:** ${m.content}\n\n`;
    } else {
      text += `**WildFire Assistant:**\n${m.content}\n\n`;
    }
  });

  if (navigator?.clipboard) {
    navigator.clipboard.writeText(text);
    showToast('Formatul Discord a fost copiat în clipboard!');
  }
}

async function executeQuery(q: string) {
  const trimmed = q.trim();
  if (!trimmed || isLoading.value) return;

  const userMsg: Message = {
    id: crypto.randomUUID(),
    role: 'user',
    content: trimmed,
    timestamp: new Date(),
  };

  const assistantId = crypto.randomUUID();
  const currentSessionId = activeSessionId.value || crypto.randomUUID();
  if (!activeSessionId.value) activeSessionId.value = currentSessionId;

  const initialMsgs = [...messages.value, userMsg, { id: assistantId, role: 'assistant' as const, content: '', timestamp: new Date() }];
  messages.value = initialMsgs;
  syncSessionsToStorage(initialMsgs, currentSessionId);

  input.value = '';
  status.value = 'loading';
  if (inputRef.value) inputRef.value.style.height = 'auto';

  const ctrl = new AbortController();
  abortCtrl = ctrl;

  try {
    const history = [
      ...messages.value.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        content: m.content,
      })),
      { role: 'user', content: trimmed },
    ];

    const res = await fetch('/api/ai-helper', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history }),
      signal: ctrl.signal,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const code = data.errorCode || 'ERROR_WF-REQ_FAILED';
      if (res.status === 429 || code === 'ERROR_WF-COOLDOWN_ACTIVE') {
        const retrySec = data.retryAfterSeconds || 45;
        cooldownSeconds.value = retrySec;
        const customMsg =
          data.error ||
          `Ai atins limita temporară de tokeni. Cooldown activ: ${retrySec} secunde.\n\n\`Cod Eroare: ${code}\``;
        throw new Error(customMsg);
      }
      const customMsg = `A apărut o problemă temporară la procesarea cererii tale. Te rugăm să reîncerci peste câteva momente.\n\n\`Cod Eroare: ${code}\``;
      throw new Error(customMsg);
    }

    const interactionId = res.headers.get('x-wf-interaction-id') || undefined;
    const text = await res.text();
    const finalMsgs = initialMsgs.map((m) =>
      m.id === assistantId ? { ...m, content: text, interactionId } : m
    );
    messages.value = finalMsgs;
    syncSessionsToStorage(finalMsgs, currentSessionId);

    status.value = 'done';
    setTimeout(() => inputRef.value?.focus(), 100);
  } catch (err: any) {
    if (err.name === 'AbortError') return;
    const msg =
      err.message && err.message.startsWith('A apărut o problemă')
        ? err.message
        : 'A apărut o problemă temporară de conexiune cu serverul. Te rugăm să reîncerci.\n\n`Cod Eroare: ERROR_WF-NETWORK`';

    const errMsgs = initialMsgs.map((m) =>
      m.id === assistantId ? { ...m, content: msg } : m
    );
    messages.value = errMsgs;
    syncSessionsToStorage(errMsgs, currentSessionId);
    status.value = 'error';
  } finally {
    abortCtrl = null;
  }
}

function handleSubmit() {
  executeQuery(input.value);
}

function handleFeedback(msgId: string, type: 'helpful' | 'unhelpful', userQuerySnippet?: string) {
  let interactionIdToSubmit: string | undefined;
  let nextFeedback: 'helpful' | 'unhelpful' | null = null;

  const updated = messages.value.map((m) => {
    if (m.id === msgId) {
      interactionIdToSubmit = m.interactionId;
      nextFeedback = m.feedback === type ? null : type;
      return { ...m, feedback: nextFeedback };
    }
    return m;
  });
  messages.value = updated;
  syncSessionsToStorage(updated, activeSessionId.value);

  setTimeout(() => {
    if (nextFeedback) {
      showToast(
        nextFeedback === 'helpful'
          ? 'Mulțumim pentru feedback! (Răspuns util)'
          : 'Mulțumim! Lucrăm la îmbunătățirea răspunsurilor.'
      );

      fetch('/api/ai-helper/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interactionId: interactionIdToSubmit,
          querySnippet: userQuerySnippet || '',
          feedback: nextFeedback,
        }),
      }).catch((err) => console.warn('[AI Feedback] Failed to sync:', err));
    }
  }, 20);
}

// ── Markdown Parser with exact CSS classes ──────────────────
function parseInlineHtml(text: string): string {
  let out = '';
  let remaining = text;

  while (remaining.length > 0) {
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    const codeMatch = remaining.match(/^`([^`]+)`/);
    const italicMatch = remaining.match(/^\*([^*]+)\*/);

    if (linkMatch) {
      const [full, linkText, linkUrl] = linkMatch;
      const isInternal = linkUrl.startsWith('/') || linkUrl.startsWith('#');
      if (isInternal) {
        out += `<a href="${linkUrl}" class="aimd-link">${escapeHtml(linkText)}</a>`;
      } else {
        out += `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="aimd-link">${escapeHtml(linkText)} <svg class="aimd-link-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>`;
      }
      remaining = remaining.slice(full.length);
      continue;
    }

    if (boldMatch) {
      const [full, boldText] = boldMatch;
      out += `<strong class="aimd-bold">${parseInlineHtml(boldText)}</strong>`;
      remaining = remaining.slice(full.length);
      continue;
    }

    if (codeMatch) {
      const [full, codeText] = codeMatch;
      out += `<code class="aimd-code">${escapeHtml(codeText)}</code>`;
      remaining = remaining.slice(full.length);
      continue;
    }

    if (italicMatch) {
      const [full, italicText] = italicMatch;
      out += `<em class="aimd-italic">${parseInlineHtml(italicText)}</em>`;
      remaining = remaining.slice(full.length);
      continue;
    }

    const nextSpecial = remaining.search(/(\[|\*\*|`|\*)/);
    if (nextSpecial === -1) {
      out += escapeHtml(remaining);
      break;
    } else if (nextSpecial === 0) {
      out += escapeHtml(remaining[0]);
      remaining = remaining.slice(1);
    } else {
      out += escapeHtml(remaining.slice(0, nextSpecial));
      remaining = remaining.slice(nextSpecial);
    }
  }

  return out;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderMarkdownBlocksHtml(content: string): string {
  const lines = content.split(/\r?\n/);
  let out = '';
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    if (trimmed.startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++;
      out += `<pre class="aimd-pre"><code class="aimd-codeblock">${escapeHtml(codeLines.join('\n'))}</code></pre>`;
      continue;
    }

    if (trimmed.startsWith('### ')) {
      out += `<h4 class="aimd-h3">${parseInlineHtml(trimmed.slice(4))}</h4>`;
      i++;
      continue;
    }
    if (trimmed.startsWith('## ')) {
      out += `<h3 class="aimd-h2">${parseInlineHtml(trimmed.slice(3))}</h3>`;
      i++;
      continue;
    }
    if (trimmed.startsWith('# ')) {
      out += `<h2 class="aimd-h1">${parseInlineHtml(trimmed.slice(2))}</h2>`;
      i++;
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      out += `<hr class="aimd-hr" />`;
      i++;
      continue;
    }

    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      if (tableLines.length >= 2) {
        const parseRow = (rowStr: string) =>
          rowStr
            .slice(1, -1)
            .split('|')
            .map((c) => c.trim());

        const headers = parseRow(tableLines[0]);
        const rows = tableLines.slice(2).map(parseRow);

        let tableHtml = `<div class="aimd-table-wrap"><table class="aimd-table"><thead><tr>`;
        headers.forEach((h) => {
          tableHtml += `<th>${parseInlineHtml(h)}</th>`;
        });
        tableHtml += `</tr></thead><tbody>`;
        rows.forEach((row) => {
          tableHtml += `<tr>`;
          row.forEach((cell) => {
            tableHtml += `<td>${parseInlineHtml(cell)}</td>`;
          });
          tableHtml += `</tr>`;
        });
        tableHtml += `</tbody></table></div>`;
        out += tableHtml;
        continue;
      }
    }

    if (/^(\*|-)\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^(\*|-)\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^(\*|-)\s+/, ''));
        i++;
      }
      out += `<ul class="aimd-ul">`;
      items.forEach((it) => {
        out += `<li class="aimd-li"><span class="aimd-bullet" aria-hidden>▸</span><span class="aimd-li-text">${parseInlineHtml(it)}</span></li>`;
      });
      out += `</ul>`;
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: { num: string; text: string }[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        const m = lines[i].trim().match(/^(\d+)\.\s+(.+)$/);
        if (m) {
          items.push({ num: m[1], text: m[2] });
        }
        i++;
      }
      out += `<ol class="aimd-ol">`;
      items.forEach((it) => {
        out += `<li class="aimd-oli"><span class="aimd-num">${it.num}.</span><span class="aimd-li-text">${parseInlineHtml(it.text)}</span></li>`;
      });
      out += `</ol>`;
      continue;
    }

    const calloutMatch = trimmed.match(/^(?:>\s*)?\[!(NOTE|TIP|IMPORTANT|WARNING|DANGER)\]\s*(.*)$/i);
    if (calloutMatch) {
      const type = calloutMatch[1].toLowerCase();
      const firstLine = calloutMatch[2];
      const calloutLines: string[] = firstLine ? [firstLine] : [];
      i++;
      while (
        i < lines.length &&
        lines[i].trim() &&
        !lines[i].trim().startsWith('#') &&
        !lines[i].trim().startsWith('```')
      ) {
        const cLine = lines[i].trim().replace(/^>\s*/, '');
        if (/^\[!(NOTE|TIP|IMPORTANT|WARNING|DANGER)\]/i.test(cLine)) break;
        calloutLines.push(cLine);
        i++;
      }

      out += `<div class="aimd-callout aimd-callout--${type}">`;
      out += `<div class="aimd-callout-header"><span class="aimd-callout-badge">${type.toUpperCase()}</span></div>`;
      out += `<div class="aimd-callout-body">${parseInlineHtml(calloutLines.join(' '))}</div>`;
      out += `</div>`;
      continue;
    }

    if (trimmed.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        quoteLines.push(lines[i].trim().slice(2));
        i++;
      }
      out += `<blockquote class="aimd-quote">${parseInlineHtml(quoteLines.join(' '))}</blockquote>`;
      continue;
    }

    out += `<p class="aimd-p">${parseInlineHtml(trimmed)}</p>`;
    i++;
  }

  return out;
}

function extractDocSources(content: string): { title: string; url: string }[] {
  const sources: { title: string; url: string }[] = [];
  const linkRegex = /\[([^\]]+)\]\((\/docs\/[^)]+)\)/g;
  let match;
  const seen = new Set<string>();

  while ((match = linkRegex.exec(content)) !== null) {
    const title = match[1].trim();
    const url = match[2].trim();
    if (!seen.has(url)) {
      seen.add(url);
      sources.push({ title, url });
    }
  }
  return sources;
}

// ── Lifecycle & Event Listeners ──────────────────────────────
onMounted(() => {
  try {
    const saved = localStorage.getItem('wf_ai_layout_mode') as LayoutMode | null;
    if (saved && (saved === 'side' || saved === 'modal' || saved === 'fullscreen')) {
      layoutMode.value = saved;
    }
  } catch {}

  try {
    const stored = localStorage.getItem('wf_ai_chat_sessions_v3');
    const storedActiveId = localStorage.getItem('wf_ai_active_session_id');

    if (stored) {
      const parsed: ChatSession[] = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        sessions.value = parsed;
        const active = parsed.find((s) => s.id === storedActiveId) || parsed[0];
        activeSessionId.value = active.id;
        messages.value = active.messages.map((m) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }));
        if (active.messages.length > 0) {
          status.value = 'done';
        }
      }
    }
  } catch {}

  if (!sessions.value.length) {
    const freshId = crypto.randomUUID();
    const freshSession: ChatSession = {
      id: freshId,
      title: 'Conversație Nouă',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    sessions.value = [freshSession];
    activeSessionId.value = freshId;
  }

  const handleOpen = () => {
    isOpen.value = true;
  };
  const handleOpenAiEvent = (e: CustomEvent<{ query?: string; autoSubmit?: boolean }>) => {
    isOpen.value = true;
    showSettings.value = false;
    showHistory.value = false;
    const targetQuery = e.detail?.query?.trim();
    if (targetQuery) {
      if (e.detail?.autoSubmit) {
        setTimeout(() => {
          executeQuery(targetQuery);
        }, 60);
      } else {
        input.value = targetQuery;
        setTimeout(() => inputRef.value?.focus(), 120);
      }
    } else {
      setTimeout(() => inputRef.value?.focus(), 120);
    }
  };

  const handleGlobalKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen.value) {
      if (showHistory.value) {
        showHistory.value = false;
        return;
      }
      if (showSettings.value) {
        showSettings.value = false;
        return;
      }
      isOpen.value = false;
    }
  };

  window.addEventListener('open-ai-helper', handleOpen);
  window.addEventListener('wf:open-ai', handleOpenAiEvent as EventListener);
  window.addEventListener('wf-ask-ai', handleOpenAiEvent as EventListener);
  window.addEventListener('keydown', handleGlobalKey);

  cooldownTimer = setInterval(() => {
    if (cooldownSeconds.value !== null && cooldownSeconds.value > 0) {
      cooldownSeconds.value--;
      if (cooldownSeconds.value <= 0) {
        cooldownSeconds.value = null;
        showToast('Cooldown expirat! Bugetul de tokeni a fost restabilit.');
        setTimeout(() => inputRef.value?.focus(), 120);
      }
    }
  }, 1000);

  thinkingTimer = setInterval(() => {
    if (isLoading.value) {
      thinkingIndex.value = (thinkingIndex.value + 1) % thinkingSteps.length;
    }
  }, 1300);
});

onUnmounted(() => {
  abortCtrl?.abort();
  if (cooldownTimer) clearInterval(cooldownTimer);
  if (thinkingTimer) clearInterval(thinkingTimer);
  document.body.classList.remove('ai-drawer-open');
});

watch(
  isOpen,
  (val) => {
    if (val) {
      document.body.classList.add('ai-drawer-open');
      setTimeout(() => inputRef.value?.focus(), 200);
    } else {
      document.body.classList.remove('ai-drawer-open');
    }
  }
);

watch(
  [messages, status],
  () => {
    nextTick(() => {
      messagesEndRef.value?.scrollIntoView({ behavior: 'smooth' });
    });
  }
);
</script>

<template>
  <template v-if="!isAdmin">
    <!-- Sleek 'Ask AI' Glass Pill Trigger Button -->
    <button
      id="ai-helper-toggle"
      class="ai-pill-btn"
      :class="{ 'ai-pill-btn--hidden': isOpen }"
      @click="isOpen = true"
      aria-label="Deschide Ask AI"
      title="Deschide Asistentul AI"
    >
      <span class="ai-pill-icon-box">
        <Icon icon="lucide:message-square" width="17" height="17" />
      </span>
      <span class="ai-pill-label">Ask AI</span>
    </button>

    <!-- Backdrop overlay -->
    <div
      class="ai-backdrop"
      :class="{ 'ai-backdrop--visible': isOpen }"
      @click="showSettings = false; isOpen = false;"
      aria-hidden="true"
    />

    <!-- AI Panel — Responsive Layout Modes (Side Drawer / Centered Window / Fullscreen) -->
    <aside
      id="ai-helper-panel"
      class="ai-panel"
      :class="[`ai-panel--mode-${layoutMode}`, { 'ai-panel--open': isOpen }]"
      role="dialog"
      aria-label="AI Assistant"
      aria-modal="true"
      :aria-hidden="!isOpen"
    >
      <!-- Exact Docs Liquid Fire Background Ambient Aura -->
      <div class="ai-panel-ambient" aria-hidden="true">
        <div class="ai-panel-ambient-blob-1" />
        <div class="ai-panel-ambient-blob-2" />
        <div class="ai-panel-ambient-blob-3" />
      </div>

      <!-- Ambient Embossed WildFire Watermark in Chat Background -->
      <div class="ai-chat-ambient-watermark" aria-hidden="true">
        <div class="ai-chat-watermark-glow" />
        <img
          src="/logo.png"
          alt=""
          width="320"
          height="320"
          class="ai-chat-watermark-logo"
        />
      </div>

      <!-- Header -->
      <div class="ai-panel-header">
        <div class="ai-panel-header-left">
          <div class="ai-panel-avatar">
            <img
              src="/logo.png"
              alt="WildFire"
              width="20"
              height="20"
              class="ai-avatar-logo"
            />
          </div>
          <div class="ai-panel-header-titles">
            <span class="ai-panel-title">AI Assistant</span>
            <span class="ai-panel-subtitle">
              <Icon icon="lucide:book-open" width="10" height="10" />
              <span>WildFire Docs</span>
            </span>
          </div>
        </div>

        <div class="ai-panel-header-actions">
          <!-- New Chat Button -->
          <button
            type="button"
            class="ai-icon-btn"
            @click="handleNewChat"
            title="Conversație Nouă"
            aria-label="Conversație Nouă"
          >
            <Icon icon="lucide:plus" width="14" height="14" />
          </button>

          <!-- Conversation History Button -->
          <button
            type="button"
            class="ai-icon-btn"
            :class="{ 'ai-icon-btn--active': showHistory }"
            @click="showHistory = !showHistory; showSettings = false; showMoreMenu = false;"
            title="Istoric Conversații"
            aria-label="Istoric Conversații"
          >
            <Icon icon="lucide:history" width="14" height="14" />
          </button>

          <!-- Quick Layout Mode Switch -->
          <button
            type="button"
            class="ai-icon-btn ai-header-layout-toggle"
            @click="cycleLayoutMode"
            :title="
              layoutMode === 'side'
                ? 'Comută pe Fereastră Centrală (Modal)'
                : layoutMode === 'modal'
                ? 'Comută pe Ecran Complet'
                : 'Comută pe Panou Lateral'
            "
            aria-label="Comută modul de afișare"
          >
            <Icon v-if="layoutMode === 'side' || layoutMode === 'modal'" icon="lucide:maximize-2" width="14" height="14" />
            <Icon v-else icon="lucide:minimize-2" width="14" height="14" />
          </button>

          <!-- Layout Settings Dropdown -->
          <div class="ai-settings-dropdown-wrap ai-header-settings-wrap">
            <button
              type="button"
              class="ai-icon-btn"
              :class="{ 'ai-icon-btn--active': showSettings }"
              @click="showSettings = !showSettings; showHistory = false; showMoreMenu = false;"
              title="Preferințe layout"
              aria-label="Preferințe layout"
            >
              <Icon icon="lucide:sliders-horizontal" width="14" height="14" />
            </button>

            <div v-if="showSettings" class="ai-settings-popover">
              <div class="ai-settings-popover-title">POZIȚIE & MOD AFIȘARE</div>
              <button
                type="button"
                class="ai-settings-option"
                :class="{ 'ai-settings-option--active': layoutMode === 'side' }"
                @click="changeLayoutMode('side')"
              >
                <Icon icon="lucide:sidebar" width="13" height="13" />
                <div class="ai-settings-opt-text">
                  <span class="ai-settings-opt-name">Panou Lateral</span>
                  <span class="ai-settings-opt-desc">Andocat în dreapta (460px)</span>
                </div>
                <Icon v-if="layoutMode === 'side'" icon="lucide:check" width="12" height="12" class="ai-settings-check" />
              </button>

              <button
                type="button"
                class="ai-settings-option"
                :class="{ 'ai-settings-option--active': layoutMode === 'modal' }"
                @click="changeLayoutMode('modal')"
              >
                <Icon icon="lucide:maximize-2" width="13" height="13" />
                <div class="ai-settings-opt-text">
                  <span class="ai-settings-opt-name">Fereastră Centrală</span>
                  <span class="ai-settings-opt-desc">Modal centrat (820px)</span>
                </div>
                <Icon v-if="layoutMode === 'modal'" icon="lucide:check" width="12" height="12" class="ai-settings-check" />
              </button>

              <button
                type="button"
                class="ai-settings-option"
                :class="{ 'ai-settings-option--active': layoutMode === 'fullscreen' }"
                @click="changeLayoutMode('fullscreen')"
              >
                <Icon icon="lucide:maximize-2" width="13" height="13" />
                <div class="ai-settings-opt-text">
                  <span class="ai-settings-opt-name">Ecran Complet</span>
                  <span class="ai-settings-opt-desc">Spațiu expansiv complet</span>
                </div>
                <Icon v-if="layoutMode === 'fullscreen'" icon="lucide:check" width="12" height="12" class="ai-settings-check" />
              </button>
            </div>
          </div>

          <!-- Conversation Actions Dropdown (Export, Copy, Clear) -->
          <div v-if="messages.length > 0" class="ai-settings-dropdown-wrap">
            <button
              type="button"
              class="ai-icon-btn"
              :class="{ 'ai-icon-btn--active': showMoreMenu }"
              @click="showMoreMenu = !showMoreMenu; showSettings = false; showHistory = false;"
              title="Opțiuni conversație"
              aria-label="Opțiuni conversație"
            >
              <Icon icon="lucide:more-vertical" width="14" height="14" />
            </button>

            <div v-if="showMoreMenu" class="ai-settings-popover">
              <div class="ai-settings-popover-title">OPȚIUNI CONVERSAȚIE</div>
              <button
                type="button"
                class="ai-settings-option"
                @click="showMoreMenu = false; handleExportMarkdown();"
              >
                <Icon icon="lucide:download" width="13" height="13" style="color: #fbbf24;" />
                <div class="ai-settings-opt-text">
                  <span class="ai-settings-opt-name">Exportă în Markdown (.md)</span>
                  <span class="ai-settings-opt-desc">Descarcă sesiunea pe disc</span>
                </div>
              </button>

              <button
                type="button"
                class="ai-settings-option"
                @click="showMoreMenu = false; handleCopyDiscord();"
              >
                <Icon icon="lucide:share-2" width="13" height="13" style="color: #22d3ee;" />
                <div class="ai-settings-opt-text">
                  <span class="ai-settings-opt-name">Copiază pentru Discord</span>
                  <span class="ai-settings-opt-desc">Formatat cu blockquote</span>
                </div>
              </button>

              <button
                type="button"
                class="ai-settings-option"
                @click="showMoreMenu = false; handleClear();"
              >
                <Icon icon="lucide:rotate-ccw" width="13" height="13" style="color: #fb7185;" />
                <div class="ai-settings-opt-text">
                  <span class="ai-settings-opt-name" style="color: #fb7185;">Șterge Conversația</span>
                  <span class="ai-settings-opt-desc">Resetează mesajele curente</span>
                </div>
              </button>
            </div>
          </div>

          <button
            id="ai-helper-close"
            class="ai-icon-btn"
            @click="showSettings = false; showHistory = false; showMoreMenu = false; isOpen = false;"
            title="Închide (Esc)"
            aria-label="Închide"
          >
            <Icon icon="lucide:x" width="16" height="16" />
          </button>
        </div>
      </div>

      <!-- Floating Feedback Toast Notification -->
      <div v-if="toastMessage" class="ai-toast-pill" role="status">
        <Icon icon="lucide:check" width="12" height="12" class="ai-toast-icon" />
        <span>{{ toastMessage }}</span>
      </div>

      <!-- Conversation History Overlay Drawer -->
      <div v-if="showHistory" class="ai-history-overlay">
        <div class="ai-history-header">
          <div class="ai-history-header-title">
            <Icon icon="lucide:history" width="13" height="13" style="color: #fbbf24;" />
            <span>Istoric Conversații ({{ sessions.length }})</span>
          </div>
          <div class="ai-history-header-actions">
            <button
              type="button"
              class="ai-history-new-btn"
              @click="handleNewChat"
              title="Începe o conversație nouă"
            >
              <Icon icon="lucide:plus" width="12" height="12" />
              <span>Conversație Nouă</span>
            </button>
            <button
              type="button"
              class="ai-icon-btn ai-icon-btn--sm"
              @click="showHistory = false"
              title="Închide istoricul"
            >
              <Icon icon="lucide:x" width="13" height="13" />
            </button>
          </div>
        </div>

        <div class="ai-history-list">
          <div
            v-for="sess in sessions"
            :key="sess.id"
            class="ai-history-card"
            :class="{ 'ai-history-card--active': sess.id === activeSessionId }"
            @click="selectSession(sess.id)"
          >
            <div class="ai-history-card-icon">
              <Icon icon="lucide:message-square" width="13" height="13" />
            </div>
            <div class="ai-history-card-info">
              <div class="ai-history-card-top">
                <span class="ai-history-card-title">{{ sess.title }}</span>
                <span v-if="sess.id === activeSessionId" class="ai-history-active-tag">ACTIVĂ</span>
              </div>
              <div class="ai-history-card-meta">
                <Icon icon="lucide:clock" width="10" height="10" />
                <span>{{ new Date(sess.updatedAt || sess.createdAt).toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) }}</span>
                <span class="ai-history-meta-sep">·</span>
                <span>{{ sess.messages.length }} {{ sess.messages.length === 1 ? 'mesaj' : 'mesaje' }}</span>
              </div>
            </div>
            <button
              type="button"
              class="ai-history-card-del"
              @click="deleteSession(sess.id, $event)"
              title="Șterge conversația"
            >
              <Icon icon="lucide:trash-2" width="12" height="12" />
            </button>
          </div>
        </div>

        <div v-if="sessions.length > 1" class="ai-history-footer">
          <button
            type="button"
            class="ai-history-clear-all"
            @click="clearAllHistory"
          >
            <Icon icon="lucide:trash-2" width="11" height="11" />
            <span>Șterge tot istoricul</span>
          </button>
        </div>
      </div>

      <!-- Messages Container -->
      <div class="ai-panel-messages" id="ai-helper-messages">
        <div v-if="messages.length === 0" class="ai-panel-empty">
          <div class="ai-empty-logo-box">
            <img
              src="/logo.png"
              alt="WildFire"
              width="36"
              height="36"
              class="ai-empty-logo"
            />
          </div>

          <h3 class="ai-panel-empty-title">Cum te pot ajuta?</h3>
          <p class="ai-panel-empty-desc">
            Scrie întrebarea sau problema ta legată de server sau documentație în căsuța de mai jos.
          </p>
        </div>

        <div
          v-else
          v-for="(msg, msgIdx) in messages"
          :key="msg.id"
          class="ai-msg"
          :class="msg.role === 'user' ? 'ai-msg--user' : 'ai-msg--ai'"
        >
          <div v-if="msg.role === 'assistant'" class="ai-msg-avatar ai-msg-avatar--ai" aria-hidden="true">
            <img
              src="/logo.png"
              alt="WF"
              width="16"
              height="16"
              class="ai-msg-logo"
            />
          </div>
          <div v-else class="ai-msg-avatar ai-msg-avatar--user" aria-hidden="true">
            <Icon icon="lucide:user" width="13" height="13" />
          </div>

          <div class="ai-msg-bubble">
            <div v-if="msg.role === 'assistant'" class="ai-msg-markdown">
              <div class="ai-msg-meta-bar">
                <span class="ai-meta-badge">
                  <Icon icon="lucide:sparkles" width="10" height="10" /> WildFire Docs Intelligence
                </span>
                <div v-if="msg.content" class="ai-msg-actions-cluster">
                  <div class="ai-feedback-actions" role="group" aria-label="Evaluează răspunsul">
                    <button
                      type="button"
                      class="ai-feedback-btn"
                      :class="{ 'ai-feedback-btn--helpful': msg.feedback === 'helpful' }"
                      @click="handleFeedback(msg.id, 'helpful', messages.slice(0, msgIdx).reverse().find((m) => m.role === 'user')?.content)"
                      :title="msg.feedback === 'helpful' ? 'Ai marcat ca util' : 'Răspuns util'"
                      aria-label="Răspuns util"
                    >
                      <Icon icon="lucide:thumbs-up" width="11" height="11" />
                    </button>
                    <button
                      type="button"
                      class="ai-feedback-btn"
                      :class="{ 'ai-feedback-btn--unhelpful': msg.feedback === 'unhelpful' }"
                      @click="handleFeedback(msg.id, 'unhelpful', messages.slice(0, msgIdx).reverse().find((m) => m.role === 'user')?.content)"
                      :title="msg.feedback === 'unhelpful' ? 'Ai marcat ca nesatisfăcător' : 'Răspuns nesatisfăcător'"
                      aria-label="Răspuns nesatisfăcător"
                    >
                      <Icon icon="lucide:thumbs-down" width="11" height="11" />
                    </button>
                  </div>

                  <button
                    type="button"
                    class="ai-msg-copy-btn"
                    @click="handleCopy(msg.id, msg.content)"
                    title="Copiază răspunsul"
                  >
                    <template v-if="copiedId === msg.id">
                      <Icon icon="lucide:check" width="11" height="11" class="ai-copy-success" />
                      <span>Copiat</span>
                    </template>
                    <template v-else>
                      <Icon icon="lucide:copy" width="11" height="11" />
                      <span>Copiază</span>
                    </template>
                  </button>
                </div>
              </div>

              <template v-if="msg.content">
                <div class="ai-msg-rendered-content" v-html="renderMarkdownBlocksHtml(msg.content)" />
                <div v-if="extractDocSources(msg.content).length > 0" class="ai-msg-sources-row">
                  <div class="ai-msg-sources-label">
                    <Icon icon="lucide:book-open" width="11" height="11" style="color: #fbbf24;" />
                    <span>Ghiduri Oficiale Conexe:</span>
                  </div>
                  <div class="ai-msg-sources-chips">
                    <a
                      v-for="(src, sIdx) in extractDocSources(msg.content)"
                      :key="sIdx"
                      :href="src.url"
                      class="ai-source-chip"
                      @click="layoutMode === 'side' ? isOpen = false : null"
                    >
                      <Icon icon="lucide:book-open" width="10" height="10" />
                      <span>{{ src.title }}</span>
                      <Icon icon="lucide:external-link" width="9" height="9" />
                    </a>
                  </div>
                </div>
              </template>

              <div v-else class="ai-thinking-skeleton">
                <div class="ai-skeleton-line ai-skeleton-line--lg" />
                <div class="ai-skeleton-line ai-skeleton-line--md" />
              </div>
            </div>

            <div v-else class="ai-user-bubble">
              <p class="ai-msg-text">{{ msg.content }}</p>
            </div>
          </div>
        </div>

        <div ref="messagesEndRef" />
      </div>

      <!-- Claude in IDE Floating Thinking Pill (Centru Jos) -->
      <div v-if="isLoading" class="ai-thinking-dock">
        <div class="ai-thinking-pill">
          <div class="ai-thinking-glow-dot">
            <Icon icon="lucide:flame" width="12" height="12" class="ai-thinking-flame" />
          </div>
          <span class="ai-thinking-text">{{ thinkingSteps[thinkingIndex] }}</span>
          <div class="ai-thinking-dots">
            <span class="ai-dot" />
            <span class="ai-dot" />
            <span class="ai-dot" />
          </div>
          <button
            type="button"
            @click="abortCtrl?.abort()"
            class="ai-thinking-cancel-btn"
            title="Oprește generarea"
          >
            <Icon icon="lucide:square" width="9" height="9" />
            <span>Stop</span>
          </button>
        </div>
      </div>

      <!-- Cooldown Status Pill Banner -->
      <div v-if="isCooldownActive" class="ai-cooldown-dock" role="status" aria-live="polite">
        <div class="ai-cooldown-pill">
          <Icon icon="lucide:clock" width="12" height="12" class="ai-cooldown-clock" style="color: #fbbf24;" />
          <span class="ai-cooldown-text">
            Cooldown Activ:
            <strong>
              {{ Math.floor((cooldownSeconds || 0) / 60) }}:{{
                (cooldownSeconds || 0) % 60 < 10
                  ? '0' + ((cooldownSeconds || 0) % 60)
                  : (cooldownSeconds || 0) % 60
              }}
            </strong>
          </span>
          <span class="ai-cooldown-sub">Se regenerează bugetul de tokeni...</span>
        </div>
      </div>

      <!-- Input Area -->
      <div class="ai-panel-input-wrap">
        <textarea
          id="ai-helper-input"
          ref="inputRef"
          class="ai-panel-textarea"
          :placeholder="
            isCooldownActive
              ? `Cooldown activ (${cooldownSeconds}s) — se regenerează bugetul...`
              : isLoading
              ? 'Se generează răspunsul...'
              : 'Întreabă despre server... (Enter = trimite)'
          "
          :value="input"
          @input="handleInputChange"
          @keydown="handleKeyDown"
          rows="1"
          :disabled="isLoading || isCooldownActive"
          aria-label="Întrebare"
        />
        <button
          id="ai-helper-send"
          class="ai-send-btn"
          :class="{ 'ai-send-btn--active': canSubmit }"
          @click="handleSubmit"
          :disabled="!canSubmit"
          aria-label="Trimite"
        >
          <Icon v-if="isLoading" icon="lucide:loader-2" width="15" height="15" class="ai-spin" />
          <Icon v-else icon="lucide:send" width="15" height="15" />
        </button>
      </div>

      <div class="ai-panel-footer">
        Răspunsuri din documentația oficială &nbsp;·&nbsp; Shift+Enter = linie nouă
      </div>
    </aside>
  </template>
</template>
