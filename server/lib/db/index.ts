import type {
  DocViewRecord,
  DocFeedbackRecord,
  DocReportRecord,
  FeedbackStats,
  DatabaseConfig,
  DatabaseStatus,
} from './types';
import type { AdminTask } from '@server/types/tasks';
import type { AdminNotification, NotificationFilterOptions } from '@server/types/notifications';
import {
  localIncrementDocView,
  localGetDocViews,
  localGetAllDocViews,
  localSubmitDocFeedback,
  localGetDocFeedbackStats,
  localGetAllFeedbacks,
  localDeleteFeedback,
  localSubmitDocReport,
  localGetAllReports,
  localUpdateReportStatus,
  localDeleteReport,
  localCreateTask,
  localGetAllTasks,
  localGetTaskById,
  localUpdateTask,
  localDeleteTask,
  localToggleTaskSubtask,
  localAddTaskComment,
  localCreateNotification,
  localGetNotifications,
  localMarkNotificationRead,
  localMarkAllNotificationsRead,
  localDeleteNotification,
  localClearOldNotifications,
  getLocalDatabaseConfig,
  saveLocalDatabaseConfig,
} from './localStore';

export * from './types';
export * from '@server/types/tasks';
export * from '@server/types/notifications';

export {
  localCreateNotification,
  localGetNotifications,
  localMarkNotificationRead,
  localMarkAllNotificationsRead,
  localDeleteNotification,
  localClearOldNotifications,
};

import {
  testSupabaseConnection,
  supabaseIncrementDocView,
  supabaseGetDocViews,
  supabaseGetAllDocViews,
  supabaseSubmitFeedback,
  supabaseGetFeedbackStats,
  supabaseGetAllFeedbacks,
  supabaseDeleteFeedback,
  supabaseSaveTask,
  supabaseDeleteTask,
  supabaseGetAllTasks,
} from './supabase';

export * from './types';
export { testSupabaseConnection };

/**
 * Returns active Supabase credentials if configured
 */
function getActiveSupabaseConfig(): { url: string; anonKey: string } | null {
  const config = getLocalDatabaseConfig();
  if (config.provider === 'supabase' && config.supabaseUrl && config.supabaseAnonKey) {
    return {
      url: config.supabaseUrl,
      anonKey: config.supabaseAnonKey,
    };
  }
  return null;
}

// ─── Unified Views Operations ─────────────────────────────────────────────────

export async function incrementDocView(slug: string, ip?: string): Promise<DocViewRecord> {
  // Always update local store so local stays populated
  const localRecord = localIncrementDocView(slug);

  const supabaseConfig = getActiveSupabaseConfig();
  if (supabaseConfig) {
    try {
      const remoteRecord = await supabaseIncrementDocView(supabaseConfig, slug);
      if (remoteRecord) return remoteRecord;
    } catch (err) {
      console.warn('[DB] Supabase increment view failed, using local fallback', err);
    }
  }

  return localRecord;
}

export async function getDocViews(slug: string): Promise<DocViewRecord> {
  const supabaseConfig = getActiveSupabaseConfig();
  if (supabaseConfig) {
    try {
      const remoteRecord = await supabaseGetDocViews(supabaseConfig, slug);
      if (remoteRecord) return remoteRecord;
    } catch (err) {
      console.warn('[DB] Supabase get views failed, using local fallback', err);
    }
  }

  return localGetDocViews(slug);
}

export async function getAllDocViews(): Promise<DocViewRecord[]> {
  const supabaseConfig = getActiveSupabaseConfig();
  if (supabaseConfig) {
    try {
      const remoteRecords = await supabaseGetAllDocViews(supabaseConfig);
      if (remoteRecords) return remoteRecords;
    } catch (err) {
      console.warn('[DB] Supabase getAllDocViews failed, using local fallback', err);
    }
  }

  return localGetAllDocViews();
}

// ─── Unified Feedback Operations ──────────────────────────────────────────────

export async function submitDocFeedback(
  slug: string,
  rating: 'helpful' | 'unhelpful',
  comment?: string,
  ipHash?: string,
  feedbackId?: string,
): Promise<DocFeedbackRecord> {
  // Always save locally
  const localRecord = localSubmitDocFeedback(slug, rating, comment, ipHash, feedbackId);

  const supabaseConfig = getActiveSupabaseConfig();
  if (supabaseConfig) {
    try {
      const remoteRecord = await supabaseSubmitFeedback(
        supabaseConfig,
        slug,
        rating,
        comment,
        feedbackId,
      );
      if (remoteRecord) return remoteRecord;
    } catch (err) {
      console.warn('[DB] Supabase submit feedback failed, using local fallback', err);
    }
  }

  return localRecord;
}

export async function getDocFeedbackStats(slug: string): Promise<FeedbackStats> {
  const supabaseConfig = getActiveSupabaseConfig();
  if (supabaseConfig) {
    try {
      const remoteStats = await supabaseGetFeedbackStats(supabaseConfig, slug);
      if (remoteStats) return remoteStats;
    } catch (err) {
      console.warn('[DB] Supabase get feedback stats failed, using local fallback', err);
    }
  }

  return localGetDocFeedbackStats(slug);
}

export async function getAllFeedbacks(): Promise<DocFeedbackRecord[]> {
  const supabaseConfig = getActiveSupabaseConfig();
  if (supabaseConfig) {
    try {
      const remoteFeedbacks = await supabaseGetAllFeedbacks(supabaseConfig);
      if (remoteFeedbacks) return remoteFeedbacks;
    } catch (err) {
      console.warn('[DB] Supabase getAllFeedbacks failed, using local fallback', err);
    }
  }

  return localGetAllFeedbacks();
}

export async function deleteFeedback(id: string): Promise<boolean> {
  const localDeleted = localDeleteFeedback(id);

  const supabaseConfig = getActiveSupabaseConfig();
  if (supabaseConfig) {
    try {
      await supabaseDeleteFeedback(supabaseConfig, id);
    } catch {}
  }

  return localDeleted;
}

// ─── Unified Report Operations ──────────────────────────────────────────────

export async function submitDocReport(
  params: Omit<DocReportRecord, 'id' | 'created_at' | 'status'>,
): Promise<DocReportRecord> {
  const localRecord = localSubmitDocReport(params);
  return localRecord;
}

export async function getAllDocReports(): Promise<DocReportRecord[]> {
  return localGetAllReports();
}

export async function updateDocReportStatus(
  id: string,
  status: 'open' | 'in_progress' | 'resolved',
  resolvedBy?: string,
): Promise<DocReportRecord | null> {
  return localUpdateReportStatus(id, status, resolvedBy);
}

export async function deleteDocReport(id: string): Promise<boolean> {
  return localDeleteReport(id);
}

// ─── Unified Task Operations ────────────────────────────────────────────────

export async function createAdminTask(
  taskData: Omit<AdminTask, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<AdminTask> {
  const localTask = await localCreateTask(taskData);
  const supabaseConfig = getActiveSupabaseConfig();
  if (supabaseConfig) {
    supabaseSaveTask(supabaseConfig, localTask).catch((err) =>
      console.warn('[DB] Failed to sync task creation to Supabase', err),
    );
  }
  return localTask;
}

export async function getAllAdminTasks(): Promise<AdminTask[]> {
  const supabaseConfig = getActiveSupabaseConfig();
  if (supabaseConfig) {
    try {
      const remoteTasks = await supabaseGetAllTasks(supabaseConfig);
      if (remoteTasks) {
        return remoteTasks;
      }
    } catch (err) {
      console.warn('[DB] Supabase getAllAdminTasks failed, using local fallback', err);
    }
  }
  return localGetAllTasks();
}

export async function getAdminTaskById(id: string): Promise<AdminTask | null> {
  return localGetTaskById(id);
}

export async function updateAdminTask(
  id: string,
  updates: Partial<AdminTask>,
): Promise<AdminTask | null> {
  const updatedTask = await localUpdateTask(id, updates);
  if (updatedTask) {
    const supabaseConfig = getActiveSupabaseConfig();
    if (supabaseConfig) {
      supabaseSaveTask(supabaseConfig, updatedTask).catch((err) =>
        console.warn('[DB] Failed to sync task update to Supabase', err),
      );
    }
  }
  return updatedTask;
}

export async function deleteAdminTask(id: string): Promise<boolean> {
  const deleted = await localDeleteTask(id);
  const supabaseConfig = getActiveSupabaseConfig();
  if (supabaseConfig) {
    supabaseDeleteTask(supabaseConfig, id).catch((err) =>
      console.warn('[DB] Failed to sync task deletion to Supabase', err),
    );
  }
  return deleted;
}

export async function toggleAdminTaskSubtask(
  taskId: string,
  subtaskId: string,
): Promise<AdminTask | null> {
  const updatedTask = await localToggleTaskSubtask(taskId, subtaskId);
  if (updatedTask) {
    const supabaseConfig = getActiveSupabaseConfig();
    if (supabaseConfig) {
      supabaseSaveTask(supabaseConfig, updatedTask).catch((err) =>
        console.warn('[DB] Failed to sync subtask toggle to Supabase', err),
      );
    }
  }
  return updatedTask;
}

export async function addAdminTaskComment(
  taskId: string,
  comment: { author: string; text: string; avatarUrl?: string },
): Promise<AdminTask | null> {
  const updatedTask = await localAddTaskComment(taskId, comment);
  if (updatedTask) {
    const supabaseConfig = getActiveSupabaseConfig();
    if (supabaseConfig) {
      supabaseSaveTask(supabaseConfig, updatedTask).catch((err) =>
        console.warn('[DB] Failed to sync task comment to Supabase', err),
      );
    }
  }
  return updatedTask;
}

// ─── Unified Database Status & Config ─────────────────────────────────────────

export async function getDatabaseStatus(): Promise<DatabaseStatus> {
  const config = getLocalDatabaseConfig();
  const allViews = await getAllDocViews();
  const allFeedbacks = await getAllFeedbacks();
  const allReports = await getAllDocReports();

  const totalViews = allViews.reduce((sum, v) => sum + (v.total_views || 0), 0);
  const totalTrackedDocs = allViews.length;
  const totalFeedbacks = allFeedbacks.length;
  const totalReports = allReports.length;

  let isConnected = true;
  if (config.provider === 'supabase' && config.supabaseUrl && config.supabaseAnonKey) {
    const test = await testSupabaseConnection(config.supabaseUrl, config.supabaseAnonKey);
    isConnected = test.success;
  }

  return {
    activeProvider: config.provider,
    isConnected,
    totalViews,
    totalFeedbacks,
    totalReports,
    totalTrackedDocs,
    lastSyncAt: new Date().toISOString(),
    supabaseUrl: config.supabaseUrl,
  };
}

export function updateDatabaseConfig(updates: Partial<DatabaseConfig>): DatabaseConfig {
  const current = getLocalDatabaseConfig();
  const next: DatabaseConfig = {
    ...current,
    ...updates,
    lastConnectedAt: new Date().toISOString(),
  };
  saveLocalDatabaseConfig(next);
  return next;
}
