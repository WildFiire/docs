import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { getAuthenticatedAdminSession } from '@server/lib/security/auth';
import { botDb } from '@server/lib/db/discordBotDb';

function dbUnavailable(expressResponse: ExpressResponse) {
  return jsonReply(expressResponse, { error: 'BOT_DB_UNAVAILABLE' }, { status: 503 });
}

export async function GET(_req: ExpressRequest, expressResponse: ExpressResponse) {
  const session = await getAuthenticatedAdminSession();
  if (!session) return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  if (!session.isRoot && !session.permissions?.canManageDiscordBot)
    return jsonReply(expressResponse, { error: 'FORBIDDEN' }, { status: 403 });

  if (!botDb) return dbUnavailable(expressResponse);

  try {
    const [
      totalTickets,
      activeTickets,
      archivedTickets,
      pendingTickets,
      deletedTickets,
      totalAdmins,
      watchlist,
      trackers,
      recentTickets,
    ] = await Promise.all([
      botDb.from('tickets').select('*', { count: 'exact', head: true }),
      botDb.from('tickets').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      botDb.from('tickets').select('*', { count: 'exact', head: true }).eq('status', 'archived'),
      botDb
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending_evidence'),
      botDb.from('tickets').select('*', { count: 'exact', head: true }).eq('status', 'deleted'),
      botDb.from('admins').select('*', { count: 'exact', head: true }),
      botDb.from('watchlist').select('*', { count: 'exact', head: true }),
      botDb.from('role_trackers').select('*', { count: 'exact', head: true }),
      botDb
        .from('tickets')
        .select(
          'ticket_id,suspect_name,suspect_steamid,status,created_at,closed_at,verdict,user_id,closed_by',
        )
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

    // Verdict breakdown
    const { data: verdictData } = await botDb
      .from('tickets')
      .select('verdict')
      .in('status', ['archived'])
      .not('verdict', 'is', null);

    const verdicts = { curat: 0, codat: 0, insuficient: 0 };
    for (const t of verdictData || []) {
      if (t.verdict === 'curat') verdicts.curat++;
      else if (t.verdict === 'codat') verdicts.codat++;
      else if (t.verdict === 'insuficient') verdicts.insuficient++;
    }

    // Avg close time
    const { data: closedTickets } = await botDb
      .from('tickets')
      .select('created_at, closed_at')
      .in('status', ['archived', 'deleted'])
      .not('closed_at', 'is', null);

    let avg_close_time_hours: number | null = null;
    if (closedTickets && closedTickets.length > 0) {
      const totalMs = closedTickets.reduce((acc, t) => {
        const diff = new Date(t.closed_at as string).getTime() - new Date(t.created_at).getTime();
        return acc + (diff > 0 ? diff : 0);
      }, 0);
      avg_close_time_hours =
        Math.round((totalMs / closedTickets.length / (1000 * 60 * 60)) * 10) / 10;
    }

    // Verdict rate
    const { count: archivedWithVerdict } = await botDb
      .from('tickets')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'archived')
      .not('verdict', 'is', null);

    const archivedCount = archivedTickets.count || 0;
    const verdict_rate_pct =
      archivedCount > 0 ? Math.round(((archivedWithVerdict || 0) / archivedCount) * 100) : null;

    // Top admins by closed tickets
    const { data: topAdminsRaw } = await botDb
      .from('tickets')
      .select('closed_by')
      .not('closed_by', 'is', null)
      .in('status', ['archived', 'deleted']);

    const adminCounts: Record<string, number> = {};
    for (const t of topAdminsRaw || []) {
      if (t.closed_by) adminCounts[t.closed_by] = (adminCounts[t.closed_by] || 0) + 1;
    }
    const top_closers = Object.entries(adminCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([user_id, count]) => ({ user_id, count }));

    return jsonReply(expressResponse, {
      stats: {
        total_tickets: totalTickets.count || 0,
        active_tickets: activeTickets.count || 0,
        archived_tickets: archivedCount,
        pending_evidence: pendingTickets.count || 0,
        deleted_tickets: deletedTickets.count || 0,
        total_admins: totalAdmins.count || 0,
        watchlist_entries: watchlist.count || 0,
        role_trackers: trackers.count || 0,
        avg_close_time_hours,
        verdict_rate_pct,
      },
      verdicts,
      recent_tickets: recentTickets.data || [],
      top_closers,
    });
  } catch (err) {
    console.error('[BotOverview GET]', err);
    return jsonReply(expressResponse, { error: 'DB_ERROR' }, { status: 500 });
  }
}
