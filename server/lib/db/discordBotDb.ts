import { createClient } from '@supabase/supabase-js';

const url = process.env.BOT_SUPABASE_URL;
const key = process.env.BOT_SUPABASE_KEY;

if (!url || !key) {
  // Warn at module load time — the dashboard will return 503 if these are missing
  console.warn('[DiscordBotDb] BOT_SUPABASE_URL or BOT_SUPABASE_KEY is not set in .env.local');
}

export const botDb = url && key ? createClient(url, key) : null;

// ─── Type definitions (mirror of Discord bot Supabase schema) ─────────────────

export type BotTicketStatus = 'active' | 'pending_evidence' | 'archived' | 'deleted';
export type BotTicketVerdict = 'curat' | 'codat' | 'insuficient' | null;

export interface BotTicket {
  ticket_id: string;
  user_id: string;
  channel_id: string;
  status: BotTicketStatus;
  created_at: string;
  closed_at?: string | null;
  closed_by?: string | null;
  suspect_steamid?: string | null;
  suspect_name?: string | null;
  verdict?: BotTicketVerdict;
  evidence_requested_at?: string | null;
}

export interface BotAdmin {
  id?: number;
  user_id: string;
  name: string;
  channel_posted_id?: string | null;
  channel_resolved_id?: string | null;
}

export interface BotWatchlistEntry {
  id?: number;
  steam_id: string;
  added_by: string;
  original_ticket_id?: string | null;
  created_at?: string;
}

export interface BotRoleTracker {
  id: number;
  guild_id: string;
  role_id: string;
  channel_id: string;
}
