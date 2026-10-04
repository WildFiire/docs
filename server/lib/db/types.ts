export interface DocViewRecord {
  slug: string;
  total_views: number;
  today_views: number;
  last_viewed_at: string;
}

export interface DocFeedbackRecord {
  id: string;
  slug: string;
  rating: 'helpful' | 'unhelpful';
  comment?: string;
  created_at: string;
  ip_hash?: string;
}

export interface FeedbackStats {
  helpful: number;
  unhelpful: number;
  total: number;
  percentage: number;
}

export interface DatabaseConfig {
  provider: 'local' | 'supabase';
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  supabaseServiceKey?: string;
  lastConnectedAt?: string;
}

export interface DocReportRecord {
  id: string;
  type: 'issue' | 'new_guide_request';
  slug: string;
  issueType?: string; // "unclear_command" | "broken_link" | "outdated_info" | "typo" | "missing_media" | "other"
  category?: string; // "systems" | "factions" | "rules" | "staff" | "other"
  severity?: 'normal' | 'medium' | 'high';
  title?: string;
  description: string;
  contactDiscord?: string;
  status: 'open' | 'in_progress' | 'resolved';
  created_at: string;
  resolved_at?: string;
  resolved_by?: string;
  ip_hash?: string;
}

export interface DatabaseStatus {
  activeProvider: 'local' | 'supabase';
  isConnected: boolean;
  totalViews: number;
  totalFeedbacks: number;
  totalReports: number;
  totalTrackedDocs: number;
  lastSyncAt: string;
  supabaseUrl?: string;
}
