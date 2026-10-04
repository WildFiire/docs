export type BackupType = 'manual' | 'auto';

export interface BackupSnapshotMetadata {
  id: string; // e.g. snap_20260821_123456_abc12
  createdAt: string; // ISO 8601
  type: BackupType;
  createdBy: string; // "SYSTEM_SCHEDULER" or username (e.g. "iannC69")
  label: string;
  totalDocs: number;
  totalTasks: number;
  totalReports: number;
  totalFeedbacks: number;
  totalNotifications: number;
  sizeBytes: number;
  sha256: string;
}

export interface BackupDocItem {
  slug: string;
  relativePath: string;
  rawContent: string;
  frontmatter: Record<string, any>;
  sha256: string;
}

export interface BackupSnapshotPayload {
  version: string;
  metadata: BackupSnapshotMetadata;
  database: {
    views: Record<string, any>;
    feedbacks: any[];
    reports: any[];
    tasks: any[];
    notifications: any[];
    updatedAt: string;
  };
  team: {
    members: any[];
    updatedAt?: string;
  };
  docs: BackupDocItem[];
  settings: Record<string, any>;
}

export interface BackupManifest {
  version: string;
  autoBackupEnabled: boolean;
  intervalDays: number; // default 3 days
  retentionLimit: number; // default 10 snapshots
  lastAutoBackupAt: string | null;
  snapshots: BackupSnapshotMetadata[];
  totalStorageBytes: number;
  updatedAt: string;
}

export interface BackupVaultStats {
  totalSnapshots: number;
  autoSnapshotsCount: number;
  manualSnapshotsCount: number;
  lastBackupAt: string | null;
  totalStorageBytes: number;
  autoBackupEnabled: boolean;
  intervalDays: number;
  daysUntilNextAuto: number;
}
