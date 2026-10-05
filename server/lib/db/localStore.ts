import { DOCS_ROOT, PUBLIC_ROOT, RUNTIME_ROOT } from '@server/storage/paths';
import fs from 'fs';
import path from 'path';
import type {
  DocViewRecord,
  DocFeedbackRecord,
  DocReportRecord,
  FeedbackStats,
  DatabaseConfig,
} from './types';
import type { AdminTask } from '@server/types/tasks';
import type { AdminNotification, NotificationFilterOptions } from '@server/types/notifications';
import {
  supabaseIncrementDocView,
  supabaseSubmitFeedback,
  supabaseDeleteFeedback,
  supabaseSaveReport,
  supabaseDeleteReport,
  supabaseSaveTask,
  supabaseDeleteTask,
  supabaseSaveNotification,
  supabaseDeleteNotification,
  supabaseSaveTeamMember,
  supabaseSavePlatformSettings,
  supabaseSaveAuditEntry,
  supabaseSaveSearchQuery,
  supabaseSaveDocVersion,
} from './supabase';

const DATA_DIR = path.join(RUNTIME_ROOT, 'data');
const ANALYTICS_FILE = path.join(DATA_DIR, 'doc_analytics.json');
const DB_CONFIG_FILE = path.join(DATA_DIR, 'db_config.json');

interface LocalAnalyticsStore {
  views: Record<string, DocViewRecord>;
  feedbacks: DocFeedbackRecord[];
  reports: DocReportRecord[];
  tasks: AdminTask[];
  notifications: AdminNotification[];
  updatedAt: string;
}

function autoSyncSupabase(
  fn: (cfg: { url: string; anonKey: string; serviceKey?: string }) => Promise<any>,
) {
  try {
    const config = getLocalDatabaseConfig();
    if (config.provider === 'supabase' && config.supabaseUrl && config.supabaseAnonKey) {
      fn({
        url: config.supabaseUrl,
        anonKey: config.supabaseAnonKey,
        serviceKey: config.supabaseServiceKey,
      }).catch((err) => {
        console.warn('[AutoSync Supabase] Background sync error:', err);
      });
    }
  } catch {}
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readAnalyticsStore(): LocalAnalyticsStore {
  ensureDataDir();
  if (fs.existsSync(ANALYTICS_FILE)) {
    try {
      const raw = fs.readFileSync(ANALYTICS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (!parsed.reports) parsed.reports = [];
      if (!parsed.tasks) parsed.tasks = [];
      if (!parsed.notifications) parsed.notifications = [];
      return parsed;
    } catch (err) {
      console.error('[LocalDB] Error reading analytics file, initializing new store', err);
    }
  }

  const initial: LocalAnalyticsStore = {
    views: {},
    feedbacks: [],
    reports: [],
    tasks: [],
    notifications: [],
    updatedAt: new Date().toISOString(),
  };
  saveAnalyticsStore(initial);
  return initial;
}

function saveAnalyticsStore(store: LocalAnalyticsStore) {
  ensureDataDir();
  try {
    store.updatedAt = new Date().toISOString();
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('[LocalDB] Error saving analytics file', err);
  }
}

// ─── Views Operations ─────────────────────────────────────────────────────────

function cleanDocSlug(slug: string): string {
  return (slug || '')
    .trim()
    .replace(/^\/+|\/+$/g, '')
    .replace(/\.(md|html)$/i, '')
    .replace(/^docs\//i, '');
}

export function localIncrementDocView(slug: string): DocViewRecord {
  const store = readAnalyticsStore();
  const normalizedSlug = cleanDocSlug(slug);
  if (!normalizedSlug) {
    return {
      slug: 'index',
      total_views: 0,
      today_views: 0,
      last_viewed_at: new Date().toISOString(),
    };
  }
  const now = new Date().toISOString();

  let record = store.views[normalizedSlug];
  if (!record && store.views[`docs/${normalizedSlug}`]) {
    record = store.views[`docs/${normalizedSlug}`];
    record.slug = normalizedSlug;
    delete store.views[`docs/${normalizedSlug}`];
  }

  if (!record) {
    record = {
      slug: normalizedSlug,
      total_views: 1,
      today_views: 1,
      last_viewed_at: now,
    };
  } else {
    record.total_views += 1;
    record.today_views += 1;
    record.last_viewed_at = now;
  }

  store.views[normalizedSlug] = record;
  saveAnalyticsStore(store);

  // Background Auto-Sync to Supabase
  autoSyncSupabase((cfg) => supabaseIncrementDocView(cfg, normalizedSlug));

  return record;
}

export function localGetDocViews(slug: string): DocViewRecord {
  const store = readAnalyticsStore();
  const normalizedSlug = cleanDocSlug(slug);
  return (
    store.views[normalizedSlug] ||
    store.views[`docs/${normalizedSlug}`] || {
      slug: normalizedSlug,
      total_views: 0,
      today_views: 0,
      last_viewed_at: new Date().toISOString(),
    }
  );
}

export function localGetAllDocViews(): DocViewRecord[] {
  const store = readAnalyticsStore();
  return Object.values(store.views).sort((a, b) => b.total_views - a.total_views);
}

// ─── Feedback Operations ──────────────────────────────────────────────────────

export function localSubmitDocFeedback(
  slug: string,
  rating: 'helpful' | 'unhelpful',
  comment?: string,
  ipHash?: string,
  feedbackId?: string,
): DocFeedbackRecord {
  const store = readAnalyticsStore();
  const normalizedSlug = cleanDocSlug(slug);

  // If existing feedbackId provided, update it in place
  if (feedbackId) {
    const existing = store.feedbacks.find((f) => f.id === feedbackId);
    if (existing) {
      existing.rating = rating;
      if (comment !== undefined) existing.comment = comment.trim();
      saveAnalyticsStore(store);
      autoSyncSupabase((cfg) =>
        supabaseSubmitFeedback(cfg, normalizedSlug, rating, comment, existing.id),
      );
      return existing;
    }
  }

  const record: DocFeedbackRecord = {
    id: feedbackId || `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    slug: normalizedSlug,
    rating,
    comment: comment ? comment.trim() : undefined,
    created_at: new Date().toISOString(),
    ip_hash: ipHash,
  };

  store.feedbacks.unshift(record);
  saveAnalyticsStore(store);

  // Background Auto-Sync to Supabase
  autoSyncSupabase((cfg) =>
    supabaseSubmitFeedback(cfg, normalizedSlug, rating, comment, record.id),
  );

  return record;
}

export function localGetDocFeedbackStats(slug: string): FeedbackStats {
  const store = readAnalyticsStore();
  const normalizedSlug = cleanDocSlug(slug);
  const docFeedbacks = store.feedbacks.filter(
    (f) => cleanDocSlug(f.slug) === normalizedSlug,
  );

  const helpful = docFeedbacks.filter((f) => f.rating === 'helpful').length;
  const unhelpful = docFeedbacks.filter((f) => f.rating === 'unhelpful').length;
  const total = helpful + unhelpful;
  const percentage = total > 0 ? Math.round((helpful / total) * 100) : 100;

  return { helpful, unhelpful, total, percentage };
}

export function localGetAllFeedbacks(): DocFeedbackRecord[] {
  const store = readAnalyticsStore();
  return store.feedbacks;
}

export function localDeleteFeedback(id: string): boolean {
  const store = readAnalyticsStore();
  const initialCount = store.feedbacks.length;
  store.feedbacks = store.feedbacks.filter((f) => f.id !== id);
  const deleted = store.feedbacks.length < initialCount;
  if (deleted) {
    saveAnalyticsStore(store);
    autoSyncSupabase((cfg) => supabaseDeleteFeedback(cfg, id));
  }
  return deleted;
}

// ─── Report & Guide Request Operations ────────────────────────────────────────

export function localSubmitDocReport(
  params: Omit<DocReportRecord, 'id' | 'created_at' | 'status'>,
): DocReportRecord {
  const store = readAnalyticsStore();
  const normalizedSlug = params.slug.replace(/^\/+|\/+$/g, '');

  const record: DocReportRecord = {
    ...params,
    id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    slug: normalizedSlug,
    status: 'open',
    created_at: new Date().toISOString(),
  };

  store.reports.unshift(record);
  saveAnalyticsStore(store);

  // Background Auto-Sync to Supabase
  autoSyncSupabase((cfg) => supabaseSaveReport(cfg, record));

  return record;
}

export function localGetAllReports(): DocReportRecord[] {
  const store = readAnalyticsStore();
  return store.reports || [];
}

export function localUpdateReportStatus(
  id: string,
  status: 'open' | 'in_progress' | 'resolved',
  resolvedBy?: string,
): DocReportRecord | null {
  const store = readAnalyticsStore();
  const target = (store.reports || []).find((r) => r.id === id);
  if (!target) return null;

  target.status = status;
  if (status === 'resolved') {
    target.resolved_at = new Date().toISOString();
    target.resolved_by = resolvedBy || 'Admin';
  } else {
    target.resolved_at = undefined;
    target.resolved_by = undefined;
  }

  saveAnalyticsStore(store);

  // Background Auto-Sync to Supabase
  autoSyncSupabase((cfg) => supabaseSaveReport(cfg, target));

  return target;
}

export function localDeleteReport(id: string): boolean {
  const store = readAnalyticsStore();
  const initialCount = (store.reports || []).length;
  store.reports = (store.reports || []).filter((r) => r.id !== id);
  const deleted = store.reports.length < initialCount;
  if (deleted) {
    saveAnalyticsStore(store);
    autoSyncSupabase((cfg) => supabaseDeleteReport(cfg, id));
  }
  return deleted;
}

// ─── Task & TODO Management Operations ────────────────────────────────────────

export function localCreateTask(
  taskData: Omit<AdminTask, 'id' | 'createdAt' | 'updatedAt'>,
): AdminTask {
  const store = readAnalyticsStore();
  const now = new Date().toISOString();

  const task: AdminTask = {
    ...taskData,
    id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    subtasks: taskData.subtasks || [],
    comments: taskData.comments || [],
    createdAt: now,
    updatedAt: now,
  };

  store.tasks = store.tasks || [];
  store.tasks.unshift(task);
  saveAnalyticsStore(store);

  // Background Auto-Sync to Supabase
  autoSyncSupabase((cfg) => supabaseSaveTask(cfg, task));

  return task;
}

export function localGetAllTasks(): AdminTask[] {
  const store = readAnalyticsStore();
  return store.tasks || [];
}

export function localGetTaskById(id: string): AdminTask | null {
  const store = readAnalyticsStore();
  return (store.tasks || []).find((t) => t.id === id) || null;
}

export function localUpdateTask(id: string, updates: Partial<AdminTask>): AdminTask | null {
  const store = readAnalyticsStore();
  const target = (store.tasks || []).find((t) => t.id === id);
  if (!target) return null;

  const wasCompleted = target.status === 'completed';
  const now = new Date().toISOString();

  Object.assign(target, updates);
  target.updatedAt = now;

  if (updates.status === 'completed' && !wasCompleted) {
    target.completedAt = now;
  } else if (updates.status && updates.status !== 'completed') {
    target.completedAt = undefined;
  }

  saveAnalyticsStore(store);

  // Background Auto-Sync to Supabase
  autoSyncSupabase((cfg) => supabaseSaveTask(cfg, target));

  return target;
}

export function localDeleteTask(id: string): boolean {
  const store = readAnalyticsStore();
  const initialCount = (store.tasks || []).length;
  store.tasks = (store.tasks || []).filter((t) => t.id !== id);
  const deleted = store.tasks.length < initialCount;
  if (deleted) {
    saveAnalyticsStore(store);
    autoSyncSupabase((cfg) => supabaseDeleteTask(cfg, id));
  }
  return deleted;
}

export function localToggleTaskSubtask(taskId: string, subtaskId: string): AdminTask | null {
  const store = readAnalyticsStore();
  const target = (store.tasks || []).find((t) => t.id === taskId);
  if (!target) return null;

  const sub = target.subtasks?.find((s) => s.id === subtaskId);
  if (!sub) return null;

  sub.completed = !sub.completed;
  target.updatedAt = new Date().toISOString();

  saveAnalyticsStore(store);

  // Background Auto-Sync to Supabase
  autoSyncSupabase((cfg) => supabaseSaveTask(cfg, target));

  return target;
}

export function localAddTaskComment(
  taskId: string,
  comment: { author: string; text: string; avatarUrl?: string },
): AdminTask | null {
  const store = readAnalyticsStore();
  const target = (store.tasks || []).find((t) => t.id === taskId);
  if (!target) return null;

  target.comments = target.comments || [];
  target.comments.push({
    id: `cmt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    author: comment.author,
    avatarUrl: comment.avatarUrl,
    text: comment.text.trim(),
    createdAt: new Date().toISOString(),
  });

  target.updatedAt = new Date().toISOString();
  saveAnalyticsStore(store);

  // Background Auto-Sync to Supabase
  autoSyncSupabase((cfg) => supabaseSaveTask(cfg, target));

  return target;
}

// ─── Database Config Operations ───────────────────────────────────────────────

export function getLocalDatabaseConfig(): DatabaseConfig {
  ensureDataDir();
  if (fs.existsSync(DB_CONFIG_FILE)) {
    try {
      const raw = fs.readFileSync(DB_CONFIG_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed.supabaseUrl && parsed.supabaseAnonKey) {
        return parsed;
      }
    } catch {}
  }
  const defaultCfg: DatabaseConfig = {
    provider: 'supabase',
    supabaseUrl: process.env.SUPABASE_URL || 'https://afsrekeoovvtucijbgze.supabase.co',
    supabaseAnonKey:
      process.env.SUPABASE_ANON_KEY || 'sb_publishable_AU18xRupAGK4208l0hLG8w_7qN45RJJ',
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    lastConnectedAt: new Date().toISOString(),
  };
  try {
    fs.writeFileSync(DB_CONFIG_FILE, JSON.stringify(defaultCfg, null, 2), 'utf-8');
  } catch {}
  return defaultCfg;
}

export function saveLocalDatabaseConfig(config: DatabaseConfig): void {
  ensureDataDir();
  try {
    fs.writeFileSync(DB_CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch (err) {
    console.error('[LocalDB] Error saving db config', err);
  }
}

// ─── Admin Notification Operations ──────────────────────────────────────────

export function localCreateNotification(
  notif: Omit<AdminNotification, 'id' | 'createdAt' | 'readBy'> & {
    id?: string;
    readBy?: string[];
    createdAt?: string;
  },
): AdminNotification {
  const store = readAnalyticsStore();
  store.notifications = store.notifications || [];

  const newNotification: AdminNotification = {
    id: notif.id || `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    targetUser: notif.targetUser ? notif.targetUser.trim() : undefined,
    isGlobal: notif.isGlobal ?? !notif.targetUser,
    title: notif.title.trim(),
    message: notif.message.trim(),
    category: notif.category,
    severity: notif.severity || 'info',
    link: notif.link,
    readBy: notif.readBy || [],
    createdAt: notif.createdAt || new Date().toISOString(),
    metadata: notif.metadata || {},
  };

  // Prepend to show newest first
  store.notifications.unshift(newNotification);

  // Cap at 200 notifications to prevent unbounded growth
  if (store.notifications.length > 200) {
    store.notifications = store.notifications.slice(0, 200);
  }

  saveAnalyticsStore(store);

  // Background Auto-Sync to Supabase
  autoSyncSupabase((cfg) => supabaseSaveNotification(cfg, newNotification));

  return newNotification;
}

export function localGetNotifications(
  username: string,
  filter?: NotificationFilterOptions,
): {
  notifications: AdminNotification[];
  unreadCount: number;
  personalCount: number;
  globalCount: number;
} {
  const store = readAnalyticsStore();
  const rawList = store.notifications || [];
  const normalizedUser = (username || '').toLowerCase().trim();

  // If store has 0 notifications, seed initial starter notifications
  if (rawList.length === 0) {
    const starterNotifs: AdminNotification[] = [
      {
        id: `notif_sys_init`,
        isGlobal: true,
        title: 'Centru de Notificări & Alerte Activ',
        message:
          'Toate alertele de sistem, asignările de sarcini, rapoartele jucătorilor și evenimentele de audit sunt acum agregate live.',
        category: 'system',
        severity: 'success',
        link: '/admin',
        readBy: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
      {
        id: `notif_task_seed_1`,
        targetUser: 'Yakuza',
        isGlobal: false,
        title: 'Sarcină Asignată: Actualizare Anti-Rush',
        message:
          'Ai fost asignat pentru revizuirea regulilor de penalizări și adăugarea excepțiilor de pauză.',
        category: 'task',
        severity: 'urgent',
        link: '/admin/tasks',
        readBy: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        metadata: { taskId: 'task_seed_1' },
      },
      {
        id: `notif_task_seed_2`,
        targetUser: 'V1ccX',
        isGlobal: false,
        title: 'Sarcină Asignată: Ghid Nou VIP Custom',
        message: 'Redactarea ghidului complet pentru pachetele VIP și beneficiile donatorilor.',
        category: 'task',
        severity: 'info',
        link: '/admin/tasks',
        readBy: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        metadata: { taskId: 'task_seed_2' },
      },
      {
        id: `notif_report_seed_1`,
        isGlobal: true,
        title: 'Raport Nou de la Jucător: Link Rupt în FAQ',
        message: 'Un vizitator a raportat o ancoră nefuncțională în ghidul /docs/informatii/faq.',
        category: 'report',
        severity: 'warning',
        link: '/admin/database',
        readBy: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        metadata: { slug: 'informatii/faq' },
      },
    ];

    store.notifications = starterNotifs;
    saveAnalyticsStore(store);
  }

  // Filter notifications visible to this user (global OR targeted to this user)
  let visible = (store.notifications || []).filter((n) => {
    if (n.isGlobal || !n.targetUser) return true;
    return n.targetUser.toLowerCase().trim() === normalizedUser;
  });

  // Apply user notification preferences
  let activeUserPreferences: Record<string, boolean> = {
    task: true,
    system: true,
    security: true,
    content: true,
    report: true,
    feedback: true,
    ai: true,
    health: true,
    ignoreAudit: false,
    ignoreSnapshots: false,
  };

  try {
    const teamFilePath = path.join(RUNTIME_ROOT, 'content', 'team.json');
    if (fs.existsSync(teamFilePath)) {
      const teamData = JSON.parse(fs.readFileSync(teamFilePath, 'utf8'));
      const member = teamData.find((m: any) => m.username?.toLowerCase() === normalizedUser);
      if (member && member.notificationPreferences) {
        activeUserPreferences = {
          ...activeUserPreferences,
          ...member.notificationPreferences,
        };
      }
    }
  } catch (err) {
    console.error('[LocalStore] Error reading notification preferences:', err);
  }

  // Filter out disabled categories and routine noise
  visible = visible.filter((n) => {
    if (n.category === 'task' && activeUserPreferences.task === false) return false;
    if (n.category === 'system' && activeUserPreferences.system === false) return false;
    if (n.category === 'security' && activeUserPreferences.security === false) return false;
    if ((n.category as any) === 'content' && activeUserPreferences.content === false) return false;
    if (n.category === 'report' && activeUserPreferences.report === false) return false;
    if (n.category === 'feedback' && activeUserPreferences.feedback === false) return false;
    if (n.category === 'ai' && activeUserPreferences.ai === false) return false;
    if (n.category === 'health' && activeUserPreferences.health === false) return false;

    // Filter out routine audit spam if user requested
    if (
      activeUserPreferences.ignoreAudit &&
      (n.title.startsWith('Audit:') || n.title.includes('AUDIT:'))
    ) {
      return false;
    }

    // Filter out automated backup snapshots if user requested
    if (
      activeUserPreferences.ignoreSnapshots &&
      (n.title.toLowerCase().includes('snapshot') || n.title.toLowerCase().includes('backup'))
    ) {
      return false;
    }

    return true;
  });

  let unreadCount = 0;
  let personalCount = 0;
  let globalCount = 0;

  for (const n of visible) {
    const isRead = n.readBy?.includes(username) || n.readBy?.includes(normalizedUser);
    if (!isRead) unreadCount++;
    if (n.targetUser && n.targetUser.toLowerCase().trim() === normalizedUser) {
      personalCount++;
    } else {
      globalCount++;
    }
  }

  let result = [...visible];

  // Apply scope filtering
  if (filter?.scope === 'personal') {
    result = result.filter(
      (n) => n.targetUser && n.targetUser.toLowerCase().trim() === normalizedUser,
    );
  } else if (filter?.scope === 'global') {
    result = result.filter((n) => n.isGlobal || !n.targetUser);
  } else if (filter?.scope === 'unread') {
    result = result.filter(
      (n) => !(n.readBy?.includes(username) || n.readBy?.includes(normalizedUser)),
    );
  }

  // Apply category filtering
  if (filter?.category && filter.category !== 'all') {
    result = result.filter((n) => n.category === filter.category);
  }

  // Apply severity filtering
  if (filter?.severity && filter.severity !== 'all') {
    result = result.filter((n) => n.severity === filter.severity);
  }

  if (filter?.limit && filter.limit > 0) {
    result = result.slice(0, filter.limit);
  }

  return {
    notifications: result,
    unreadCount,
    personalCount,
    globalCount,
    preferences: activeUserPreferences,
  };
}

export function localMarkNotificationRead(id: string, username: string): boolean {
  const store = readAnalyticsStore();
  const target = (store.notifications || []).find((n) => n.id === id);
  if (!target) return false;

  target.readBy = target.readBy || [];
  const normalized = username.toLowerCase().trim();
  if (!target.readBy.includes(username) && !target.readBy.includes(normalized)) {
    target.readBy.push(username);
  }

  saveAnalyticsStore(store);

  // Background Auto-Sync to Supabase
  autoSyncSupabase((cfg) => supabaseSaveNotification(cfg, target));

  return true;
}

export function localMarkAllNotificationsRead(username: string): number {
  const store = readAnalyticsStore();
  const normalizedUser = (username || '').toLowerCase().trim();
  let count = 0;

  for (const n of store.notifications || []) {
    // Only mark read for notifications visible to this user
    if (n.isGlobal || !n.targetUser || n.targetUser.toLowerCase().trim() === normalizedUser) {
      n.readBy = n.readBy || [];
      if (!n.readBy.includes(username) && !n.readBy.includes(normalizedUser)) {
        n.readBy.push(username);
        count++;
        autoSyncSupabase((cfg) => supabaseSaveNotification(cfg, n));
      }
    }
  }

  if (count > 0) {
    saveAnalyticsStore(store);
  }
  return count;
}

export function localDeleteNotification(id: string): boolean {
  const store = readAnalyticsStore();
  const initialLength = (store.notifications || []).length;
  store.notifications = (store.notifications || []).filter((n) => n.id !== id);

  if (store.notifications.length !== initialLength) {
    saveAnalyticsStore(store);
    autoSyncSupabase((cfg) => supabaseDeleteNotification(cfg, id));
    return true;
  }
  return false;
}

export function localClearOldNotifications(days = 30): number {
  const store = readAnalyticsStore();
  const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
  const initialLength = (store.notifications || []).length;

  store.notifications = (store.notifications || []).filter((n) => {
    const time = new Date(n.createdAt).getTime();
    return time >= threshold;
  });

  const removed = initialLength - store.notifications.length;
  if (removed > 0) {
    saveAnalyticsStore(store);
  }
  return removed;
}

// ─── Full Push All Local Data to Supabase ─────────────────────────────────────

export async function syncAllLocalDataToSupabase(config?: DatabaseConfig): Promise<{
  viewsCount: number;
  feedbacksCount: number;
  reportsCount: number;
  tasksCount: number;
  notificationsCount: number;
  teamCount: number;
  settingsCount: number;
  auditCount: number;
  telemetryCount: number;
  versionsCount: number;
}> {
  const cfg = config || getLocalDatabaseConfig();
  if (!cfg.supabaseUrl || !cfg.supabaseAnonKey) {
    throw new Error('Configurația Supabase lipsește (URL sau Anon Key).');
  }

  const store = readAnalyticsStore();
  const supabaseCfg = {
    url: cfg.supabaseUrl,
    anonKey: cfg.supabaseAnonKey,
    serviceKey: cfg.supabaseServiceKey,
  };

  // 1. Sync Views
  let viewsCount = 0;
  for (const view of Object.values(store.views || {})) {
    try {
      await supabaseIncrementDocView(supabaseCfg, view.slug);
      viewsCount++;
    } catch {}
  }

  // 2. Sync Feedbacks
  let feedbacksCount = 0;
  for (const fb of store.feedbacks || []) {
    try {
      await supabaseSubmitFeedback(supabaseCfg, fb.slug, fb.rating, fb.comment, fb.id);
      feedbacksCount++;
    } catch {}
  }

  // 3. Sync Reports
  let reportsCount = 0;
  for (const rep of store.reports || []) {
    try {
      await supabaseSaveReport(supabaseCfg, rep);
      reportsCount++;
    } catch {}
  }

  // 4. Sync Tasks
  let tasksCount = 0;
  for (const task of store.tasks || []) {
    try {
      await supabaseSaveTask(supabaseCfg, task);
      tasksCount++;
    } catch {}
  }

  // 5. Sync Notifications
  let notificationsCount = 0;
  for (const notif of store.notifications || []) {
    try {
      await supabaseSaveNotification(supabaseCfg, notif);
      notificationsCount++;
    } catch {}
  }

  // 6. Sync Team Members
  let teamCount = 0;
  try {
    const teamFilePath = path.join(RUNTIME_ROOT, 'content', 'team.json');
    if (fs.existsSync(teamFilePath)) {
      const teamData = JSON.parse(fs.readFileSync(teamFilePath, 'utf-8'));
      const membersList = Array.isArray(teamData) ? teamData : teamData.members || [];
      for (const member of membersList) {
        await supabaseSaveTeamMember(supabaseCfg, member);
        teamCount++;
      }
    }
  } catch {}

  // 7. Sync Platform Settings
  let settingsCount = 0;
  try {
    const settingsPath = path.join(RUNTIME_ROOT, 'content', 'settings.json');
    if (fs.existsSync(settingsPath)) {
      const settingsData = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
      await supabaseSavePlatformSettings(supabaseCfg, settingsData);
      settingsCount++;
    }
  } catch {}

  // 8. Sync Audit Ledger
  let auditCount = 0;
  try {
    const auditPaths = [
      path.join(RUNTIME_ROOT, 'data', 'audit_log.json'),
      path.join(RUNTIME_ROOT, 'content', 'audit.json'),
    ];
    for (const aPath of auditPaths) {
      if (fs.existsSync(aPath)) {
        const auditData = JSON.parse(fs.readFileSync(aPath, 'utf-8'));
        const entries = Array.isArray(auditData)
          ? auditData
          : auditData.events || auditData.entries || [];
        for (const entry of entries) {
          await supabaseSaveAuditEntry(supabaseCfg, entry);
          auditCount++;
        }
      }
    }
  } catch {}

  // 9. Sync Search Telemetry
  let telemetryCount = 0;
  try {
    const telemetryPath = path.join(RUNTIME_ROOT, 'data', 'search_telemetry.json');
    if (fs.existsSync(telemetryPath)) {
      const telData = JSON.parse(fs.readFileSync(telemetryPath, 'utf-8'));
      const queries = Array.isArray(telData) ? telData : telData.queries || telData.history || [];
      for (const q of queries) {
        await supabaseSaveSearchQuery(supabaseCfg, q);
        telemetryCount++;
      }
    }
  } catch {}

  // 10. Sync Doc Versions
  let versionsCount = 0;
  try {
    const versionsPath = path.join(RUNTIME_ROOT, 'data', 'doc_versions.json');
    if (fs.existsSync(versionsPath)) {
      const verData = JSON.parse(fs.readFileSync(versionsPath, 'utf-8'));
      const versionList = Array.isArray(verData) ? verData : verData.versions || [];
      for (const ver of versionList) {
        await supabaseSaveDocVersion(supabaseCfg, ver);
        versionsCount++;
      }
    }
  } catch {}

  return {
    viewsCount,
    feedbacksCount,
    reportsCount,
    tasksCount,
    notificationsCount,
    teamCount,
    settingsCount,
    auditCount,
    telemetryCount,
    versionsCount,
  };
}
