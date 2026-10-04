export type TaskStatus = "todo" | "in_progress" | "in_review" | "completed";
export type TaskPriority = "urgent" | "high" | "medium" | "low";
export type TaskCategory =
  | "docs_creation"
  | "docs_update"
  | "review"
  | "media"
  | "system"
  | "bug_fix";

export interface TaskSubtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskComment {
  id: string;
  author: string;
  avatarUrl?: string;
  text: string;
  createdAt: string;
}

export interface AdminTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  assignees: string[];
  assignedBy: string;
  targetDoc?: string;
  dueDate?: string;
  subtasks: TaskSubtask[];
  comments: TaskComment[];
  archived?: boolean;
  discordThreadId?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  inReview: number;
  completed: number;
  urgentCount: number;
  dueSoonCount: number;
  completionRate: number;
}

export interface PublicTeamMember {
  id: string;
  username: string;
  displayName: string;
  role: string;
  avatarUrl?: string;
  avatarColor?: string;
  discord?: string;
  isRoot?: boolean;
}
