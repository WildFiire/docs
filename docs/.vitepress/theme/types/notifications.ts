export type NotificationCategory =
  | "task"
  | "report"
  | "feedback"
  | "security"
  | "system"
  | "ai"
  | "health";

export type NotificationSeverity = "info" | "success" | "warning" | "urgent";

export interface AdminNotification {
  id: string;
  targetUser?: string; // If undefined or empty, it's global or for the whole team
  isGlobal?: boolean; // Explicit flag for team/system wide broadcast
  title: string;
  message: string;
  category: NotificationCategory;
  severity: NotificationSeverity;
  link?: string; // Action URL (e.g. /admin/tasks, /admin/database)
  readBy: string[]; // List of usernames who marked this as read
  createdAt: string; // ISO 8601 string
  metadata?: Record<string, any>;
}

export interface NotificationFilterOptions {
  scope?: "all" | "personal" | "global" | "unread";
  category?: NotificationCategory | "all";
  severity?: NotificationSeverity | "all";
  limit?: number;
}
