<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { Icon } from '@iconify/vue';
import type {
  AdminTask,
  TaskStatus,
  TaskPriority,
  TaskCategory,
  TaskStats,
  TaskSubtask,
  PublicTeamMember,
} from '../../types/tasks';

// ── Category & Priority Definition Dictionaries ───────────────────────────────
const PRIORITY_META: Record<TaskPriority, { label: string; color: string; bg: string; border: string }> = {
  urgent: { label: 'URGENT', color: '#f43f5e', bg: 'hsl(350 89% 60% / 0.14)', border: 'hsl(350 89% 60% / 0.35)' },
  high:   { label: 'HIGH',   color: '#ff6b00', bg: 'hsl(26 100% 52% / 0.14)',  border: 'hsl(26 100% 52% / 0.35)' },
  medium: { label: 'MEDIUM', color: '#f59e0b', bg: 'hsl(43 96% 52% / 0.14)',   border: 'hsl(43 96% 52% / 0.35)' },
  low:    { label: 'LOW',    color: '#06b6d4', bg: 'hsl(186 100% 50% / 0.12)', border: 'hsl(186 100% 50% / 0.3)' },
};

const CATEGORY_META: Record<TaskCategory, { label: string; color: string; bg: string }> = {
  docs_creation: { label: 'Ghid Nou',            color: '#10b981', bg: 'hsl(142 71% 45% / 0.12)' },
  docs_update:   { label: 'Update Ghid',         color: '#06b6d4', bg: 'hsl(186 100% 50% / 0.12)' },
  review:        { label: 'Audit & Review',      color: '#a855f7', bg: 'hsl(280 100% 65% / 0.12)' },
  media:         { label: 'Media Assets',        color: '#f59e0b', bg: 'hsl(43 96% 52% / 0.12)' },
  system:        { label: 'Sistem & Mentenanta', color: '#6366f1', bg: 'hsl(235 85% 65% / 0.12)' },
  bug_fix:       { label: 'Bug Fix',             color: '#f43f5e', bg: 'hsl(350 89% 60% / 0.12)' },
};

const STATUS_COLUMNS: { key: TaskStatus; label: string; color: string }[] = [
  { key: 'todo',        label: 'To Do (Backlog)',      color: '#94a3b8' },
  { key: 'in_progress', label: 'In Progress (Active)', color: '#06b6d4' },
  { key: 'in_review',   label: 'In Review (Audit)',    color: '#a855f7' },
  { key: 'completed',   label: 'Done (Completed)',     color: '#10b981' },
];

const tasks = ref<AdminTask[]>([]);
const members = ref<PublicTeamMember[]>([]);
const docSlugs = ref<{ slug: string; title: string }[]>([]);
const stats = ref<TaskStats | null>(null);
const currentUser = ref<string>('');
const loading = ref<boolean>(true);
const refreshing = ref<boolean>(false);

// View & Filters
const activeTab = ref<'kanban' | 'table' | 'workload' | 'archive'>('kanban');
const searchQuery = ref<string>('');
const assigneeFilter = ref<string>('all');
const priorityFilter = ref<string>('all');
const categoryFilter = ref<string>('all');

// Modal Inspector State
const modalOpen = ref<boolean>(false);
const editingTask = ref<AdminTask | null>(null);
const formTitle = ref<string>('');
const formDesc = ref<string>('');
const formPriority = ref<TaskPriority>('medium');
const formCategory = ref<TaskCategory>('docs_update');
const formAssignees = ref<string[]>([]);
const formTargetDoc = ref<string>('');
const formDueDate = ref<string>('');
const formSubtasks = ref<TaskSubtask[]>([]);
const newSubtaskInput = ref<string>('');
const newCommentInput = ref<string>('');
const savingTask = ref<boolean>(false);

async function loadData(isRefresh = false) {
  if (isRefresh) refreshing.value = true;
  else loading.value = true;

  try {
    const res = await fetch('/api/admin/tasks');
    if (res.status === 401) {
      window.location.href = '/admin/login';
      return;
    }

    if (res.ok) {
      const data = await res.json();
      tasks.value = data.tasks || [];
      members.value = data.members || [];
      docSlugs.value = data.docSlugs || [];
      stats.value = data.stats || null;
      currentUser.value = data.currentUser || '';
    }
  } catch (err) {
    console.error('[Admin Tasks] Failed to fetch data:', err);
  } finally {
    loading.value = false;
    refreshing.value = false;
  }
}

onMounted(() => {
  loadData();
});

// Filtered Tasks
const filteredTasks = computed(() => {
  return tasks.value.filter((t) => {
    if (activeTab.value === 'archive') {
      if (!t.archived) return false;
    } else {
      if (t.archived) return false;
    }

    if (assigneeFilter.value === 'my_tasks' && !t.assignees.includes(currentUser.value)) return false;
    if (assigneeFilter.value !== 'all' && assigneeFilter.value !== 'my_tasks' && !t.assignees.includes(assigneeFilter.value)) return false;
    if (priorityFilter.value !== 'all' && t.priority !== priorityFilter.value) return false;
    if (categoryFilter.value !== 'all' && t.category !== categoryFilter.value) return false;

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      const matchDoc = t.targetDoc?.toLowerCase().includes(q);
      const matchAssignee = t.assignees.some((a) => a.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchDoc || matchAssignee;
    }
    return true;
  });
});

function openCreateModal() {
  editingTask.value = null;
  formTitle.value = '';
  formDesc.value = '';
  formPriority.value = 'medium';
  formCategory.value = 'docs_update';
  formAssignees.value = currentUser.value ? [currentUser.value] : [];
  formTargetDoc.value = '';
  formDueDate.value = '';
  formSubtasks.value = [];
  newSubtaskInput.value = '';
  newCommentInput.value = '';
  modalOpen.value = true;
}

function openEditModal(task: AdminTask) {
  editingTask.value = task;
  formTitle.value = task.title;
  formDesc.value = task.description || '';
  formPriority.value = task.priority;
  formCategory.value = task.category;
  formAssignees.value = task.assignees || [];
  formTargetDoc.value = task.targetDoc || '';
  formDueDate.value = task.dueDate || '';
  formSubtasks.value = task.subtasks ? [...task.subtasks] : [];
  newSubtaskInput.value = '';
  newCommentInput.value = '';
  modalOpen.value = true;
}

function handleAddSubtask() {
  if (!newSubtaskInput.value.trim()) return;
  formSubtasks.value.push({
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title: newSubtaskInput.value.trim(),
    completed: false,
  });
  newSubtaskInput.value = '';
}

function handleToggleSubtaskInModal(id: string) {
  formSubtasks.value = formSubtasks.value.map((s) =>
    s.id === id ? { ...s, completed: !s.completed } : s
  );
}

function handleRemoveSubtaskInModal(id: string) {
  formSubtasks.value = formSubtasks.value.filter((s) => s.id !== id);
}

async function handleSaveTask(e: Event) {
  e.preventDefault();
  if (
    !formTitle.value.trim() ||
    formAssignees.value.length === 0 ||
    !formTargetDoc.value.trim() ||
    !formDueDate.value ||
    !formDesc.value.trim() ||
    savingTask.value
  ) {
    return;
  }

  savingTask.value = true;
  try {
    if (editingTask.value) {
      // PATCH
      const res = await fetch('/api/admin/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingTask.value.id,
          updates: {
            title: formTitle.value.trim(),
            description: formDesc.value.trim(),
            priority: formPriority.value,
            category: formCategory.value,
            assignees: formAssignees.value,
            targetDoc: formTargetDoc.value.trim() || undefined,
            dueDate: formDueDate.value || undefined,
            subtasks: formSubtasks.value,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        tasks.value = tasks.value.map((t) => (t.id === editingTask.value?.id ? data.task : t));
        modalOpen.value = false;
      }
    } else {
      // POST
      const res = await fetch('/api/admin/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle.value.trim(),
          description: formDesc.value.trim(),
          priority: formPriority.value,
          category: formCategory.value,
          assignees: formAssignees.value,
          targetDoc: formTargetDoc.value.trim() || undefined,
          dueDate: formDueDate.value || undefined,
          subtasks: formSubtasks.value,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        tasks.value = [data.task, ...tasks.value];
        modalOpen.value = false;
      }
    }
  } catch (err) {
    console.error('Failed to save task', err);
  } finally {
    savingTask.value = false;
  }
}

async function handleMoveStatus(taskId: string, newStatus: TaskStatus) {
  try {
    const res = await fetch('/api/admin/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: taskId,
        updates: { status: newStatus },
      }),
    });

    if (res.ok) {
      const data = await res.json();
      tasks.value = tasks.value.map((t) => (t.id === taskId ? data.task : t));
    }
  } catch (err) {
    console.error('Failed to move task status', err);
  }
}

async function handleArchiveTask(taskId: string) {
  try {
    const res = await fetch('/api/admin/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: taskId,
        updates: { archived: true },
      }),
    });

    if (res.ok) {
      const data = await res.json();
      tasks.value = tasks.value.map((t) => (t.id === taskId ? data.task : t));
    }
  } catch (err) {
    console.error('Failed to archive task', err);
  }
}

async function handleAddComment(taskId: string) {
  if (!newCommentInput.value.trim()) return;
  try {
    const res = await fetch('/api/admin/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: taskId,
        action: 'add_comment',
        comment: newCommentInput.value.trim(),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      tasks.value = tasks.value.map((t) => (t.id === taskId ? data.task : t));
      if (editingTask.value && editingTask.value.id === taskId) {
        editingTask.value = data.task;
      }
      newCommentInput.value = '';
    }
  } catch (err) {
    console.error('Failed to add comment', err);
  }
}

async function handleDeleteTask(taskId: string) {
  if (!confirm('Sigur dorești să ștergi această sarcină?')) return;
  try {
    const res = await fetch(`/api/admin/tasks?id=${encodeURIComponent(taskId)}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      tasks.value = tasks.value.filter((t) => t.id !== taskId);
      if (editingTask.value?.id === taskId) modalOpen.value = false;
    }
  } catch (err) {
    console.error('Failed to delete task', err);
  }
}

function toggleAssignee(username: string) {
  if (formAssignees.value.includes(username)) {
    formAssignees.value = formAssignees.value.filter((u) => u !== username);
  } else {
    formAssignees.value.push(username);
  }
}

function getMemberAvatar(username: string) {
  const m = members.value.find((mem) => mem.username.toLowerCase() === username.toLowerCase());
  return m?.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`;
}

function handleInsertMention(username: string) {
  const trimmed = newCommentInput.value.trim();
  if (!trimmed) {
    newCommentInput.value = `@${username} `;
  } else {
    newCommentInput.value = `${trimmed} @${username} `;
  }
}

function renderChatParts(text: string) {
  const parts = text.split(/(@[a-zA-Z0-9_-]+)/g);
  return parts.map((part) => {
    if (part.startsWith('@')) {
      const u = part.substring(1);
      const isTarget = members.value.some((m) => m.username.toLowerCase() === u.toLowerCase());
      return { text: part, isMention: isTarget };
    }
    return { text: part, isMention: false };
  });
}
</script>

<template>
  <div class="admin-page-container">
    <!-- ── Header ──────────────────────────────────────────────────────── -->
    <div class="admin-page-header">
      <div>
        <div class="admin-page-pretitle-tag">
          <Icon icon="lucide:list-todo" class="text-orange-400" width="11" height="11" />
          <span>TASK HUB &amp; WORKFLOW MANAGER</span>
        </div>
        <h1 class="admin-page-title">Gestiune Sarcini &amp; TODO Echipă</h1>
        <p class="admin-page-desc">
          Asignare, organizare pe Kanban și urmărire a ghidurilor și cerințelor echipei WildFire Docs.
        </p>
      </div>

      <div class="admin-header-actions">
        <button
          type="button"
          @click="loadData(true)"
          :disabled="refreshing"
          class="admin-btn admin-btn--secondary"
          title="Reîncarcă datele"
        >
          <Icon icon="lucide:refresh-cw" :class="{ 'admin-spin': refreshing }" width="13" height="13" />
          <span>{{ refreshing ? 'Actualizare...' : 'Sincronizează' }}</span>
        </button>

        <button
          type="button"
          @click="openCreateModal"
          class="admin-btn admin-btn--primary"
        >
          <Icon icon="lucide:plus" width="14" height="14" />
          <span>Adaugă Sarcină Nouă</span>
        </button>
      </div>
    </div>

    <!-- ── KPI Metric Grid ─────────────────────────────────────────────── -->
    <div class="admin-db-kpi-grid">
      <div class="admin-db-kpi-card">
        <div class="admin-db-kpi-header">
          <span class="admin-db-kpi-title">Total Sarcini Înregistrate</span>
          <div class="admin-db-kpi-icon-box admin-db-kpi-icon-box--cyan">
            <Icon icon="lucide:list-todo" width="16" height="16" />
          </div>
        </div>
        <div class="admin-db-kpi-body">
          <span class="admin-db-kpi-value admin-db-kpi-value--cyan">
            {{ stats?.total || tasks.length }}
          </span>
          <span class="admin-db-kpi-badge admin-db-kpi-badge--cyan">
            <Icon icon="lucide:trending-up" width="10" height="10" /> Active
          </span>
        </div>
        <p class="admin-db-kpi-subtitle">Flux complet de redactare și audit</p>
      </div>

      <div class="admin-db-kpi-card">
        <div class="admin-db-kpi-header">
          <span class="admin-db-kpi-title">În Lucru / De Făcut</span>
          <div class="admin-db-kpi-icon-box admin-db-kpi-icon-box--amber">
            <Icon icon="lucide:clock" width="16" height="16" />
          </div>
        </div>
        <div class="admin-db-kpi-body">
          <span class="admin-db-kpi-value admin-db-kpi-value--amber">
            {{ (stats?.inProgress || 0) + (stats?.todo || 0) }}
          </span>
          <span class="admin-db-kpi-badge admin-db-kpi-badge--amber">
            {{ stats?.inProgress || 0 }} În Lucru
          </span>
        </div>
        <p class="admin-db-kpi-subtitle">{{ stats?.todo || 0 }} sarcini în așteptare backlog</p>
      </div>

      <div class="admin-db-kpi-card">
        <div class="admin-db-kpi-header">
          <span class="admin-db-kpi-title">Rată de Finalizare</span>
          <div class="admin-db-kpi-icon-box admin-db-kpi-icon-box--emerald">
            <Icon icon="lucide:check-circle-2" width="16" height="16" />
          </div>
        </div>
        <div class="admin-db-kpi-body">
          <span class="admin-db-kpi-value admin-db-kpi-value--emerald">
            {{ stats?.completionRate || 0 }}%
          </span>
          <span class="admin-db-kpi-badge admin-db-kpi-badge--emerald">
            {{ stats?.completed || 0 }} Finalizate
          </span>
        </div>
        <p class="admin-db-kpi-subtitle">Eficiența generală de completare a echipei</p>
      </div>

      <div class="admin-db-kpi-card">
        <div class="admin-db-kpi-header">
          <span class="admin-db-kpi-title">Sarcini Urgente</span>
          <div class="admin-db-kpi-icon-box" style="background: hsl(350 89% 60% / 0.12); color: #f43f5e; border-color: hsl(350 89% 60% / 0.3);">
            <Icon icon="lucide:alert-triangle" width="16" height="16" />
          </div>
        </div>
        <div class="admin-db-kpi-body">
          <span class="admin-db-kpi-value" style="color: #f43f5e;">
            {{ stats?.urgentCount || 0 }}
          </span>
          <span class="admin-db-kpi-badge" style="background: hsl(350 89% 60% / 0.15); color: #fda4af;">
            Prioritate 1
          </span>
        </div>
        <p class="admin-db-kpi-subtitle">Necesită atenție prioritară imediată</p>
      </div>
    </div>

    <!-- ── View Navigation Tabs & Filters ───────────────────────────────── -->
    <div class="admin-tasks-top-bar">
      <div class="admin-tasks-views-nav">
        <button
          type="button"
          @click="activeTab = 'kanban'"
          class="admin-tasks-view-btn"
          :class="{ 'admin-tasks-view-btn--active': activeTab === 'kanban' }"
        >
          <Icon icon="lucide:layers" width="14" height="14" />
          <span>Panou Kanban</span>
        </button>
        <button
          type="button"
          @click="activeTab = 'table'"
          class="admin-tasks-view-btn"
          :class="{ 'admin-tasks-view-btn--active': activeTab === 'table' }"
        >
          <Icon icon="lucide:check-square" width="14" height="14" />
          <span>Tabel Structurat</span>
          <span class="admin-tasks-tab-badge">{{ filteredTasks.length }}</span>
        </button>
        <button
          type="button"
          @click="activeTab = 'workload'"
          class="admin-tasks-view-btn"
          :class="{ 'admin-tasks-view-btn--active': activeTab === 'workload' }"
        >
          <Icon icon="lucide:users" width="14" height="14" />
          <span>Workload Echipă</span>
        </button>
        <button
          type="button"
          @click="activeTab = 'archive'"
          class="admin-tasks-view-btn"
          :class="{ 'admin-tasks-view-btn--active': activeTab === 'archive' }"
        >
          <Icon icon="lucide:database" width="14" height="14" />
          <span>Arhivă</span>
        </button>
      </div>

      <!-- Global Toolbar Filters -->
      <div class="admin-tasks-filters-row">
        <div class="admin-tasks-search-wrap">
          <Icon icon="lucide:search" class="text-zinc-500" width="13" height="13" />
          <input
            type="text"
            placeholder="Caută sarcini..."
            v-model="searchQuery"
            class="admin-tasks-search-input"
          />
        </div>

        <select
          v-model="assigneeFilter"
          class="admin-tasks-select"
        >
          <option value="all">Toți Membrii</option>
          <option v-if="currentUser" value="my_tasks">Doar ale mele (@{{ currentUser }})</option>
          <option v-for="m in members" :key="m.username" :value="m.username">
            @{{ m.username }} ({{ m.displayName }})
          </option>
        </select>

        <select
          v-model="priorityFilter"
          class="admin-tasks-select"
        >
          <option value="all">Toate Prioritățile</option>
          <option value="urgent">Urgent</option>
          <option value="high">Ridicată</option>
          <option value="medium">Medie</option>
          <option value="low">Scăzută</option>
        </select>

        <select
          v-model="categoryFilter"
          class="admin-tasks-select"
        >
          <option value="all">Toate Categoriile</option>
          <option value="docs_creation">Ghid Nou</option>
          <option value="docs_update">Actualizare Ghid</option>
          <option value="review">Audit &amp; Review</option>
          <option value="media">Asset-uri Media</option>
          <option value="system">Mentenanță Sistem</option>
          <option value="bug_fix">Rezolvare Eroare</option>
        </select>
      </div>
    </div>

    <!-- ── TAB 1: KANBAN BOARD VIEW ─────────────────────────────────────── -->
    <div v-if="activeTab === 'kanban'" class="admin-kanban-board">
      <div v-for="col in STATUS_COLUMNS" :key="col.key" class="admin-kanban-col">
        <div class="admin-kanban-col-header" :style="{ borderColor: `${col.color}40` }">
          <div class="admin-kanban-col-title-group">
            <span class="admin-kanban-col-dot" :style="{ background: col.color }" />
            <h3 class="admin-kanban-col-title">{{ col.label }}</h3>
          </div>
          <span class="admin-kanban-col-count" :style="{ color: col.color, borderColor: `${col.color}30` }">
            {{ filteredTasks.filter((t) => t.status === col.key).length }}
          </span>
        </div>

        <div class="admin-kanban-cards-stack">
          <div v-if="filteredTasks.filter((t) => t.status === col.key).length === 0" class="admin-kanban-empty-slot">
            <span>Nicio sarcină în această coloană</span>
          </div>

          <div
            v-else
            v-for="task in filteredTasks.filter((t) => t.status === col.key)"
            :key="task.id"
            class="admin-kanban-card"
            :style="{
              '--card-priority-border': PRIORITY_META[task.priority].border,
              '--card-priority-glow': `${PRIORITY_META[task.priority].color}15`,
            }"
          >
            <!-- Priority Indicator Line -->
            <div class="admin-kanban-card-top-line" :style="{ background: PRIORITY_META[task.priority].color }" />

            <!-- Header Tags -->
            <div class="admin-kanban-card-meta-row">
              <span
                class="admin-task-pill"
                :style="{
                  color: CATEGORY_META[task.category].color,
                  background: CATEGORY_META[task.category].bg,
                  borderColor: `${CATEGORY_META[task.category].color}35`,
                }"
              >
                {{ CATEGORY_META[task.category].label }}
              </span>
              <span
                class="admin-task-pill"
                :style="{
                  color: PRIORITY_META[task.priority].color,
                  background: PRIORITY_META[task.priority].bg,
                  borderColor: PRIORITY_META[task.priority].border,
                }"
              >
                {{ PRIORITY_META[task.priority].label }}
              </span>
            </div>

            <!-- Task Title & Description -->
            <h4
              class="admin-kanban-card-title"
              @click="openEditModal(task)"
              title="Click pentru a edita sau vedea detalii"
            >
              {{ task.title }}
            </h4>

            <p v-if="task.description" class="admin-kanban-card-desc">{{ task.description }}</p>

            <!-- Target Doc Link -->
            <a
              v-if="task.targetDoc"
              :href="`/docs/${task.targetDoc}`"
              target="_blank"
              rel="noopener noreferrer"
              class="admin-kanban-doc-pill"
            >
              <Icon icon="lucide:book-open" class="text-cyan-400" width="10" height="10" />
              <span>/docs/{{ task.targetDoc }}</span>
              <Icon icon="lucide:external-link" class="opacity-50" width="9" height="9" />
            </a>

            <!-- Subtasks Progress -->
            <div v-if="task.subtasks && task.subtasks.length > 0" class="admin-kanban-subtasks-preview">
              <div class="admin-kanban-subtasks-header">
                <span class="admin-kanban-subtasks-lbl">
                  <Icon icon="lucide:check-square" class="text-emerald-400" width="11" height="11" />
                  {{ task.subtasks.filter((s) => s.completed).length }}/{{ task.subtasks.length }} Subtask-uri
                </span>
                <span class="admin-kanban-subtasks-pct">
                  {{ Math.round((task.subtasks.filter((s) => s.completed).length / task.subtasks.length) * 100) }}%
                </span>
              </div>
              <div class="admin-kanban-progress-track">
                <div
                  class="admin-kanban-progress-fill"
                  :style="{
                    width: `${(task.subtasks.filter((s) => s.completed).length / task.subtasks.length) * 100}%`,
                    background: task.subtasks.filter((s) => s.completed).length === task.subtasks.length ? '#10b981' : '#06b6d4',
                  }"
                />
              </div>
            </div>

            <!-- Card Footer: Assignees & Dates -->
            <div class="admin-kanban-card-footer">
              <div class="admin-kanban-assignees-strip">
                <span v-if="task.assignees.length === 0" class="admin-kanban-unassigned">Neasignat</span>
                <div
                  v-else
                  v-for="u in task.assignees"
                  :key="u"
                  class="admin-kanban-avatar-wrap"
                  :title="`Asignat lui @${u}`"
                >
                  <img
                    :src="getMemberAvatar(u)"
                    :alt="u"
                    class="admin-kanban-avatar-img"
                    @error="($event.target as HTMLImageElement).src = 'https://cdn.discordapp.com/embed/avatars/0.png'"
                  />
                </div>
              </div>

              <span v-if="task.dueDate" class="admin-kanban-due-chip">
                <Icon icon="lucide:calendar" width="10" height="10" />
                {{ task.dueDate }}
              </span>

              <span v-if="task.comments && task.comments.length > 0" class="admin-kanban-chat-chip" :title="`${task.comments.length} note în discuție`">
                <Icon icon="lucide:message-square" width="10" height="10" />
                {{ task.comments.length }}
              </span>
            </div>

            <!-- Quick Status Transition Actions -->
            <div class="admin-kanban-quick-actions">
              <button
                v-if="col.key !== 'todo'"
                type="button"
                @click="handleMoveStatus(task.id, col.key === 'completed' ? 'in_review' : col.key === 'in_review' ? 'in_progress' : 'todo')"
                class="admin-kanban-move-btn"
                title="Mută înapoi"
              >
                <Icon icon="lucide:chevron-left" width="12" height="12" />
              </button>

              <button
                type="button"
                @click="openEditModal(task)"
                class="admin-kanban-edit-btn"
              >
                <Icon icon="lucide:edit-3" width="11" height="11" /> Detalii
              </button>

              <button
                v-if="col.key === 'completed'"
                type="button"
                @click="handleArchiveTask(task.id)"
                class="admin-kanban-edit-btn"
                style="background: hsl(280 100% 65% / 0.15); color: #a855f7; border-color: hsl(280 100% 65% / 0.3);"
                title="Mută în arhivă"
              >
                <Icon icon="lucide:database" width="11" height="11" /> Arhivă
              </button>

              <button
                v-if="col.key !== 'completed'"
                type="button"
                @click="handleMoveStatus(task.id, col.key === 'todo' ? 'in_progress' : col.key === 'in_progress' ? 'in_review' : 'completed')"
                class="admin-kanban-move-btn"
                title="Avasează status"
              >
                <Icon icon="lucide:chevron-right" width="12" height="12" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── TAB 2 & 4: STRUCTURED TABLE VIEW / ARCHIVE ───────────────────── -->
    <div v-if="activeTab === 'table' || activeTab === 'archive'" class="admin-panel-card">
      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th style="width: 130px;">Status</th>
              <th style="width: 110px;">Prioritate</th>
              <th style="width: 130px;">Categorie</th>
              <th>Titlu &amp; Descriere Sarcină</th>
              <th style="width: 160px;">Membru Asignat</th>
              <th style="width: 120px;">Termen Limită</th>
              <th style="text-align: right; width: 110px;">Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredTasks.length === 0">
              <td colspan="7" class="admin-table-empty">
                <Icon icon="lucide:list-todo" width="24" height="24" style="margin: 0 auto 8px; opacity: 0.35;" />
                <p>Nicio sarcină nu corespunde filtrelor selectate.</p>
              </td>
            </tr>
            <tr v-else v-for="task in filteredTasks" :key="task.id">
              <td>
                <select
                  :value="task.status"
                  @change="handleMoveStatus(task.id, ($event.target as HTMLSelectElement).value as TaskStatus)"
                  class="admin-table-status-select"
                  :style="{
                    color: STATUS_COLUMNS.find((c) => c.key === task.status)?.color,
                    borderColor: `${STATUS_COLUMNS.find((c) => c.key === task.status)?.color}40`,
                  }"
                >
                  <option value="todo">De Făcut</option>
                  <option value="in_progress">În Lucru</option>
                  <option value="in_review">În Review</option>
                  <option value="completed">Finalizat</option>
                </select>
              </td>
              <td>
                <span
                  class="admin-status-pill"
                  :style="{
                    color: PRIORITY_META[task.priority].color,
                    background: PRIORITY_META[task.priority].bg,
                    borderColor: PRIORITY_META[task.priority].border,
                    fontSize: '0.68rem',
                  }"
                >
                  {{ PRIORITY_META[task.priority].label }}
                </span>
              </td>
              <td>
                <span
                  class="admin-status-pill"
                  :style="{
                    color: CATEGORY_META[task.category].color,
                    background: CATEGORY_META[task.category].bg,
                    borderColor: `${CATEGORY_META[task.category].color}35`,
                    fontSize: '0.68rem',
                  }"
                >
                  {{ CATEGORY_META[task.category].label }}
                </span>
              </td>
              <td>
                <div style="display: flex; flexDirection: column; gap: 4px;">
                  <span
                    style="font-weight: 700; color: #f8fafc; cursor: pointer;"
                    @click="openEditModal(task)"
                  >
                    {{ task.title }}
                  </span>
                  <a
                    v-if="task.targetDoc"
                    :href="`/docs/${task.targetDoc}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="admin-perm-tag admin-perm-tag--cyan"
                    style="width: fit-content; text-decoration: none; font-size: 0.68rem; padding: 1px 6px;"
                  >
                    <Icon icon="lucide:book-open" width="9" height="9" />
                    /docs/{{ task.targetDoc }}
                  </a>
                  <span
                    v-if="task.comments && task.comments.length > 0"
                    class="admin-perm-tag admin-perm-tag--purple"
                    style="font-size: 0.65rem; padding: 1px 6px; width: fit-content;"
                  >
                    <Icon icon="lucide:message-square" width="9" height="9" />
                    {{ task.comments.length }} {{ task.comments.length === 1 ? 'notă' : 'note' }}
                  </span>
                </div>
              </td>
              <td>
                <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                  <span v-if="task.assignees.length === 0" class="admin-table-muted">—</span>
                  <span
                    v-else
                    v-for="u in task.assignees"
                    :key="u"
                    class="admin-perm-tag admin-perm-tag--blue"
                    style="font-size: 0.7rem;"
                  >
                    @{{ u }}
                  </span>
                </div>
              </td>
              <td>
                <span class="admin-table-mono admin-table-muted" style="font-size: 0.74rem;">
                  {{ task.dueDate || '—' }}
                </span>
              </td>
              <td style="text-align: right;">
                <div style="display: inline-flex; align-items: center; gap: 6px;">
                  <button
                    v-if="task.status === 'completed' && !task.archived"
                    type="button"
                    @click="handleArchiveTask(task.id)"
                    class="admin-btn"
                    style="padding: 4px 8px; font-size: 0.72rem; background: hsl(280 100% 65% / 0.15); color: #a855f7; border-color: hsl(280 100% 65% / 0.3);"
                    title="Mută în Arhivă"
                  >
                    <Icon icon="lucide:database" width="11" height="11" />
                  </button>
                  <button
                    type="button"
                    @click="openEditModal(task)"
                    class="admin-btn admin-btn--secondary"
                    style="padding: 4px 8px; font-size: 0.72rem;"
                    title="Editează"
                  >
                    <Icon icon="lucide:edit-3" width="11" height="11" />
                  </button>
                  <button
                    type="button"
                    @click="handleDeleteTask(task.id)"
                    class="admin-feedback-delete-action"
                    title="Șterge"
                  >
                    <Icon icon="lucide:trash-2" width="12" height="12" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── TAB 3: TEAM WORKLOAD & CAPACITY ──────────────────────────────── -->
    <div v-if="activeTab === 'workload'" class="admin-workload-grid">
      <div
        v-for="member in members"
        :key="member.id || member.username"
        class="admin-workload-card"
      >
        <div class="admin-workload-header">
          <div class="admin-workload-user-info">
            <img
              :src="member.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${member.username}`"
              :alt="member.displayName"
              class="admin-workload-avatar"
              @error="($event.target as HTMLImageElement).src = 'https://cdn.discordapp.com/embed/avatars/0.png'"
            />
            <div>
              <h4 class="admin-workload-name">{{ member.displayName }}</h4>
              <span class="admin-workload-handle">@{{ member.username }}</span>
            </div>
          </div>

          <span class="admin-perm-tag admin-perm-tag--orange">
            {{ tasks.filter((t) => t.assignees.includes(member.username) && t.status !== 'completed').length }} Sarcini Active
          </span>
        </div>

        <!-- Capacity Meter -->
        <div class="admin-workload-meter-box">
          <div class="admin-workload-meter-header">
            <span class="admin-workload-meter-label">Completare Sarcini Asignate</span>
            <span class="admin-workload-meter-pct">
              {{
                tasks.filter((t) => t.assignees.includes(member.username)).length > 0
                  ? Math.round(
                      (tasks.filter((t) => t.assignees.includes(member.username) && t.status === 'completed').length /
                        tasks.filter((t) => t.assignees.includes(member.username)).length) *
                        100
                    )
                  : 100
              }}%
            </span>
          </div>
          <div class="admin-workload-track">
            <div
              class="admin-workload-fill"
              :style="{
                width: `${
                  tasks.filter((t) => t.assignees.includes(member.username)).length > 0
                    ? Math.round(
                        (tasks.filter((t) => t.assignees.includes(member.username) && t.status === 'completed').length /
                          tasks.filter((t) => t.assignees.includes(member.username)).length) *
                          100
                      )
                    : 100
                }%`,
                background:
                  (tasks.filter((t) => t.assignees.includes(member.username)).length > 0
                    ? Math.round(
                        (tasks.filter((t) => t.assignees.includes(member.username) && t.status === 'completed').length /
                          tasks.filter((t) => t.assignees.includes(member.username)).length) *
                          100
                      )
                    : 100) === 100
                    ? '#10b981'
                    : 'linear-gradient(90deg, #ff6b00, #f59e0b)',
              }"
            />
          </div>
        </div>

        <!-- Quick stats strip -->
        <div class="admin-workload-stats-row">
          <div class="admin-workload-stat-chip">
            <Icon icon="lucide:check-circle-2" class="text-emerald-400" width="11" height="11" />
            <span>{{ tasks.filter((t) => t.assignees.includes(member.username) && t.status === 'completed').length }} Finalizate</span>
          </div>
          <div
            v-if="tasks.filter((t) => t.assignees.includes(member.username) && t.priority === 'urgent' && t.status !== 'completed').length > 0"
            class="admin-workload-stat-chip"
            style="color: #fda4af; border-color: hsl(350 89% 60% / 0.3);"
          >
            <Icon icon="lucide:alert-triangle" class="text-rose-400" width="11" height="11" />
            <span>{{ tasks.filter((t) => t.assignees.includes(member.username) && t.priority === 'urgent' && t.status !== 'completed').length }} Urgente</span>
          </div>
        </div>

        <!-- Top upcoming tasks -->
        <div class="admin-workload-tasks-list">
          <span class="admin-workload-section-lbl">Sarcini curente:</span>
          <div
            v-for="t in tasks.filter((task) => task.assignees.includes(member.username) && task.status !== 'completed').slice(0, 3)"
            :key="t.id"
            class="admin-workload-task-item"
            @click="openEditModal(t)"
          >
            <span
              class="admin-workload-task-dot"
              :style="{ background: PRIORITY_META[t.priority].color }"
            />
            <span class="admin-workload-task-title">{{ t.title }}</span>
            <Icon icon="lucide:chevron-right" class="opacity-40" width="11" height="11" />
          </div>
          <span
            v-if="tasks.filter((task) => task.assignees.includes(member.username) && task.status !== 'completed').length === 0"
            class="admin-workload-all-clear"
          >
            Toate sarcinile sunt finalizate!
          </span>
        </div>
      </div>
    </div>

    <!-- ── TASK INSPECTOR & CREATE/EDIT MODAL ───────────────────────────── -->
    <div v-if="modalOpen" class="doc-report-overlay" @click="modalOpen = false">
      <div
        class="doc-report-modal"
        style="max-width: 620px;"
        @click.stop
      >
        <div class="doc-report-glow" />

        <div class="doc-report-header">
          <div class="doc-report-header-title-box">
            <div class="doc-report-header-icon-wrap" style="color: #ff6b00; border-color: hsl(26 100% 52% / 0.3);">
              <Icon icon="lucide:list-todo" width="18" height="18" />
            </div>
            <div>
              <h3 class="doc-report-title">
                {{ editingTask ? 'Inspector & Editare Sarcină' : 'Creează Sarcină Nouă' }}
              </h3>
              <p class="doc-report-sub">
                {{ editingTask ? `ID: ${editingTask.id} · Creat de @${editingTask.assignedBy}` : 'Asignează obiective și ghiduri echipei de documentație' }}
              </p>
            </div>
          </div>

          <button
            type="button"
            class="doc-report-close-btn"
            @click="modalOpen = false"
          >
            <Icon icon="lucide:x" width="16" height="16" />
          </button>
        </div>

        <form @submit="handleSaveTask" class="doc-report-form">
          <!-- Title Field -->
          <div class="doc-report-field">
            <label class="doc-report-label">Titlul Sarcinii *</label>
            <input
              type="text"
              required
              v-model="formTitle"
              placeholder="Ex: Actualizare ghid Anti-Rush cu noile penalizări"
              class="doc-report-input"
              maxlength="120"
            />
          </div>

          <!-- Priority & Category Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="doc-report-field">
              <label class="doc-report-label">Prioritate</label>
              <select
                v-model="formPriority"
                class="admin-tasks-select"
                style="width: 100%; padding: 9px 12px;"
              >
                <option value="urgent">Urgent (Critic)</option>
                <option value="high">Ridicată</option>
                <option value="medium">Medie</option>
                <option value="low">Scăzută</option>
              </select>
            </div>

            <div class="doc-report-field">
              <label class="doc-report-label">Categorie</label>
              <select
                v-model="formCategory"
                class="admin-tasks-select"
                style="width: 100%; padding: 9px 12px;"
              >
                <option value="docs_creation">Ghid Nou</option>
                <option value="docs_update">Actualizare Ghid</option>
                <option value="review">Audit &amp; Review</option>
                <option value="media">Asset-uri Media</option>
                <option value="system">Mentenanță Sistem</option>
                <option value="bug_fix">Rezolvare Eroare</option>
              </select>
            </div>
          </div>

          <!-- Assignee Multi-Picker -->
          <div class="doc-report-field">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <label class="doc-report-label" style="margin: 0;">
                <Icon icon="lucide:users" class="text-blue-400" width="12" height="12" />
                Membri Asignați
              </label>
              <span class="admin-micro-pill" style="color: #38bdf8; background: hsl(190 90% 50% / 0.12); border-color: hsl(190 90% 50% / 0.35);">
                <Icon icon="lucide:bell" width="10" height="10" /> Ping Direct Discord
              </span>
            </div>

            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button
                v-for="m in members"
                :key="m.username"
                type="button"
                @click="toggleAssignee(m.username)"
                class="doc-report-pill-choice"
                :class="{ 'doc-report-pill-choice--active': formAssignees.includes(m.username) }"
                :style="formAssignees.includes(m.username) ? { borderColor: '#3b82f6', color: '#60a5fa', background: 'hsl(215 90% 60% / 0.15)' } : undefined"
              >
                <img
                  :src="m.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${m.username}`"
                  :alt="m.displayName"
                  style="width: 16px; height: 16px; border-radius: 50%;"
                />
                <span>@{{ m.displayName || m.username }}</span>
                <span
                  v-if="Boolean(m.discord && /^\d+$/.test(m.discord.trim()))"
                  :style="{
                    fontSize: '0.6rem',
                    opacity: 0.75,
                    fontFamily: 'var(--font-mono)',
                    color: formAssignees.includes(m.username) ? '#93c5fd' : '#a1a1aa'
                  }"
                >
                  • #{{ m.discord?.slice(0, 4) }}
                </span>
                <Icon v-if="formAssignees.includes(m.username)" icon="lucide:check" width="11" height="11" />
              </button>
            </div>

            <p class="admin-form-help" style="margin-top: 6px; display: flex; align-items: center; gap: 5px; color: var(--color-text-tertiary);">
              <Icon icon="lucide:radio" class="text-cyan-400" width="10" height="10" />
              <span>Membrii selectați primesc automat notificare și ping direct pe Discord (<code style="color: #fb923c;">&lt;@Discord_ID&gt;</code>) prin Webhook.</span>
            </p>
          </div>

          <!-- Target Doc & Due Date -->
          <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 12px;">
            <div class="doc-report-field">
              <label class="doc-report-label">
                <Icon icon="lucide:book-open" class="text-cyan-400" width="12" height="12" />
                Ghid Asociat *
              </label>
              <input
                type="text"
                list="docs-slugs-list"
                v-model="formTargetDoc"
                placeholder="Ex: systems/other/anti-rush"
                class="doc-report-input"
              />
              <datalist id="docs-slugs-list">
                <option v-for="d in docSlugs" :key="d.slug" :value="d.slug">
                  {{ d.title }}
                </option>
              </datalist>
            </div>

            <div class="doc-report-field">
              <label class="doc-report-label">
                <Icon icon="lucide:calendar" class="text-amber-400" width="12" height="12" />
                Termen Limită (Due Date)
              </label>
              <input
                type="date"
                v-model="formDueDate"
                class="doc-report-input"
              />
            </div>
          </div>

          <!-- Description -->
          <div class="doc-report-field">
            <label class="doc-report-label">Descriere &amp; Cerințe Detaliate</label>
            <textarea
              rows="3"
              v-model="formDesc"
              placeholder="Instrucțiuni specifice pentru membrii desemnați..."
              class="doc-report-textarea"
            />
          </div>

          <!-- Subtasks Checklist Builder -->
          <div class="doc-report-field">
            <label class="doc-report-label">
              <Icon icon="lucide:check-square" class="text-emerald-400" width="12" height="12" />
              Checklist Subtask-uri ({{ formSubtasks.filter((s) => s.completed).length }}/{{ formSubtasks.length }})
            </label>

            <div v-if="formSubtasks.length > 0" class="admin-modal-subtasks-list">
              <div v-for="st in formSubtasks" :key="st.id" class="admin-modal-subtask-row">
                <button
                  type="button"
                  @click="handleToggleSubtaskInModal(st.id)"
                  class="admin-modal-subtask-toggle"
                >
                  <Icon v-if="st.completed" icon="lucide:check-square" class="text-emerald-400" width="14" height="14" />
                  <Icon v-else icon="lucide:square" class="text-zinc-500" width="14" height="14" />
                  <span :style="{ textDecoration: st.completed ? 'line-through' : 'none', color: st.completed ? '#94a3b8' : '#f1f5f9' }">
                    {{ st.title }}
                  </span>
                </button>
                <button
                  type="button"
                  @click="handleRemoveSubtaskInModal(st.id)"
                  class="admin-modal-subtask-del"
                  title="Elimină subtask"
                >
                  <Icon icon="lucide:x" width="12" height="12" />
                </button>
              </div>
            </div>

            <div style="display: flex; gap: 8px; margin-top: 4px;">
              <input
                type="text"
                v-model="newSubtaskInput"
                @keydown.enter.prevent="handleAddSubtask"
                placeholder="Adaugă un pas în checklist..."
                class="doc-report-input"
              />
              <button
                type="button"
                @click="handleAddSubtask"
                class="admin-btn admin-btn--secondary"
                style="padding: 0 14px; flex-shrink: 0;"
              >
                <Icon icon="lucide:plus" width="13" height="13" />
                <span>Adaugă</span>
              </button>
            </div>
          </div>

          <!-- Comments / Discussion Thread (Chat Style) -->
          <div v-if="editingTask" class="admin-chat-section">
            <div class="admin-chat-header">
              <div class="admin-chat-title-row">
                <Icon icon="lucide:message-square" class="text-purple-400" width="13" height="13" />
                <span class="admin-chat-title">Note &amp; Discuție</span>
                <span class="admin-chat-badge">{{ editingTask.comments?.length || 0 }}</span>
              </div>
              <div class="admin-chat-db-tag">
                <Icon icon="lucide:database" width="10" height="10" />
                <span>Persistent DB</span>
              </div>
            </div>

            <div class="admin-chat-timeline">
              <div v-if="!editingTask.comments || editingTask.comments.length === 0" class="admin-chat-empty">
                <div class="admin-chat-empty-icon">
                  <Icon icon="lucide:message-square" width="20" height="20" />
                </div>
                <p class="admin-chat-empty-title">Nicio notă adăugată încă</p>
                <span class="admin-chat-empty-sub">
                  Fii primul care lasă un update, o cerință tehnică sau o notă de progres. Toate mesajele se salvează automat în baza de date.
                </span>
              </div>

              <template v-else>
                <div
                  v-for="c in editingTask.comments"
                  :key="c.id"
                  class="admin-chat-message-row"
                  :class="c.author.toLowerCase() === (currentUser || '').toLowerCase() ? 'admin-chat-message-row--me' : 'admin-chat-message-row--other'"
                >
                  <!-- Other user avatar -->
                  <div v-if="c.author.toLowerCase() !== (currentUser || '').toLowerCase()" class="admin-chat-avatar-wrap">
                    <img
                      v-if="c.avatarUrl || members.find((m) => m.username.toLowerCase() === c.author.toLowerCase())?.avatarUrl"
                      :src="c.avatarUrl || members.find((m) => m.username.toLowerCase() === c.author.toLowerCase())?.avatarUrl"
                      :alt="c.author"
                      class="admin-chat-avatar"
                    />
                    <div
                      v-else
                      class="admin-chat-avatar admin-chat-avatar--initials"
                      :style="{ background: members.find((m) => m.username.toLowerCase() === c.author.toLowerCase())?.avatarColor || 'hsl(280 100% 65%)' }"
                    >
                      {{ c.author[0].toUpperCase() }}
                    </div>
                  </div>

                  <div class="admin-chat-bubble-wrap">
                    <div class="admin-chat-bubble-header">
                      <span class="admin-chat-bubble-author">
                        {{ members.find((m) => m.username.toLowerCase() === c.author.toLowerCase())?.displayName || `@${c.author}` }}
                      </span>
                      <span
                        v-if="members.find((m) => m.username.toLowerCase() === c.author.toLowerCase())?.isRoot || c.author.toLowerCase() === 'iannc69' || c.author.toLowerCase() === 'iannc'"
                        class="adx-badge adx-badge--orange"
                        style="font-size: 0.55rem; padding: 1px 5px;"
                      >
                        ROOT
                      </span>
                      <span class="admin-chat-bubble-time">
                        {{ new Date(c.createdAt).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }) }} · {{ new Date(c.createdAt).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' }) }}
                      </span>
                    </div>
                    <div
                      class="admin-chat-bubble"
                      :class="c.author.toLowerCase() === (currentUser || '').toLowerCase() ? 'admin-chat-bubble--me' : 'admin-chat-bubble--other'"
                    >
                      <p class="admin-chat-text">
                        <template v-for="(part, pIdx) in renderChatParts(c.text)" :key="pIdx">
                          <span v-if="part.isMention" class="admin-chat-mention-tag">{{ part.text }}</span>
                          <span v-else>{{ part.text }}</span>
                        </template>
                      </p>
                    </div>
                    <div class="admin-chat-bubble-footer">
                      <span class="admin-chat-synced-pill">
                        <Icon icon="lucide:check-check" class="text-emerald-400" width="10" height="10" />
                        <span>Salvat în DB</span>
                      </span>
                    </div>
                  </div>

                  <!-- Me avatar -->
                  <div v-if="c.author.toLowerCase() === (currentUser || '').toLowerCase()" class="admin-chat-avatar-wrap">
                    <img
                      v-if="members.find((m) => m.username.toLowerCase() === c.author.toLowerCase())?.avatarUrl"
                      :src="members.find((m) => m.username.toLowerCase() === c.author.toLowerCase())?.avatarUrl"
                      :alt="c.author"
                      class="admin-chat-avatar"
                    />
                    <div
                      v-else
                      class="admin-chat-avatar admin-chat-avatar--initials"
                      :style="{ background: members.find((m) => m.username.toLowerCase() === c.author.toLowerCase())?.avatarColor || 'hsl(26 100% 52%)' }"
                    >
                      {{ c.author[0].toUpperCase() }}
                    </div>
                  </div>
                </div>
              </template>
            </div>

            <!-- Quick Mention Picker -->
            <div class="admin-chat-mention-bar">
              <span class="admin-chat-mention-bar-label">
                <Icon icon="lucide:at-sign" class="text-purple-400" width="11" height="11" />
                <span>Tag responsabil:</span>
              </span>
              <div class="admin-chat-mention-pills">
                <button
                  v-for="m in members"
                  :key="m.username"
                  type="button"
                  @click="handleInsertMention(m.username)"
                  class="admin-chat-mention-pill"
                  :class="{ 'admin-chat-mention-pill--assigned': editingTask.assignees?.includes(m.username) }"
                  :title="`Dă tag lui @${m.displayName || m.username} pentru ping direct Discord pe #notificari`"
                >
                  <Icon icon="lucide:at-sign" width="9" height="9" />
                  <span>{{ m.displayName || m.username }}</span>
                  <span v-if="editingTask.assignees?.includes(m.username)" class="admin-chat-mention-assigned-dot" title="Responsabil asignat pe sarcină" />
                </button>
              </div>
            </div>

            <!-- Chat Input Box -->
            <div class="admin-chat-input-box">
              <div class="admin-chat-input-inner">
                <input
                  type="text"
                  v-model="newCommentInput"
                  @keydown.enter.prevent="handleAddComment(editingTask.id)"
                  placeholder="Scrie o notă sau un update... (Enter pentru trimitere)"
                  class="admin-chat-input"
                />
                <button
                  type="button"
                  @click="handleAddComment(editingTask.id)"
                  :disabled="!newCommentInput.trim()"
                  class="admin-chat-send-btn"
                  title="Trimite și salvează în DB"
                >
                  <Icon icon="lucide:send" width="13" height="13" />
                  <span>Trimite</span>
                </button>
              </div>
              <div class="admin-chat-input-hint">
                <Icon icon="lucide:corner-down-left" width="10" height="10" />
                <span>Apasă <strong>Enter</strong> pentru a salva nota în timp real pe sarcină.</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="doc-report-actions">
            <button
              v-if="editingTask"
              type="button"
              @click="handleDeleteTask(editingTask.id)"
              class="admin-btn admin-btn--danger"
              style="margin-right: auto;"
            >
              <Icon icon="lucide:trash-2" width="13" height="13" />
              <span>Șterge</span>
            </button>

            <button
              type="button"
              class="doc-report-cancel-btn"
              @click="modalOpen = false"
            >
              Anulează
            </button>

            <button
              type="submit"
              :disabled="
                savingTask ||
                !formTitle.trim() ||
                formAssignees.length === 0 ||
                !formTargetDoc.trim() ||
                !formDueDate ||
                !formDesc.trim()
              "
              class="doc-report-submit-action"
            >
              {{ savingTask ? 'Se salvează...' : editingTask ? 'Salvează Modificările' : 'Creează Sarcină' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-kanban-card {
  border-color: var(--card-priority-border);
  box-shadow: 0 4px 20px -5px var(--card-priority-glow);
}
</style>
