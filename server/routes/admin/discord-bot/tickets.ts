import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { getAuthenticatedAdminSession } from '@server/lib/security/auth';
import { botDb } from '@server/lib/db/discordBotDb';

function forbidden(expressResponse: ExpressResponse) {
  return jsonReply(expressResponse, { error: 'FORBIDDEN' }, { status: 403 });
}

function dbUnavailable(expressResponse: ExpressResponse) {
  return jsonReply(
    expressResponse,
    {
      error: 'BOT_DB_UNAVAILABLE',
      message: 'Variabilele BOT_SUPABASE_URL / BOT_SUPABASE_KEY nu sunt configurate în .env.local',
    },
    { status: 503 },
  );
}

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  const session = await getAuthenticatedAdminSession();
  if (!session) return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });

  const isRoot = session.isRoot;
  const canAccess = isRoot || session.permissions?.canManageDiscordBot;
  if (!canAccess) return forbidden(expressResponse);

  if (!botDb) return dbUnavailable(expressResponse);

  try {
    const { searchParams } = new URL(req.originalUrl, 'http://localhost');
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '25', 10);
    const offset = (page - 1) * limit;

    let query = botDb.from('tickets').select('*', { count: 'exact' });

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(
        `suspect_name.ilike.%${search}%,suspect_steamid.ilike.%${search}%,ticket_id.ilike.%${search}%`,
      );
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Stat counts
    const [active, archived, pending, deleted, total] = await Promise.all([
      botDb.from('tickets').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      botDb.from('tickets').select('*', { count: 'exact', head: true }).eq('status', 'archived'),
      botDb
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending_evidence'),
      botDb.from('tickets').select('*', { count: 'exact', head: true }).eq('status', 'deleted'),
      botDb.from('tickets').select('*', { count: 'exact', head: true }),
    ]);

    // Avg close time for archived/deleted tickets
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

    // Verdict rate: percentage of archived tickets that have a verdict set
    const { count: archivedWithVerdict } = await botDb
      .from('tickets')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'archived')
      .not('verdict', 'is', null);

    const archivedCount = archived.count || 0;
    const verdict_rate_pct =
      archivedCount > 0 ? Math.round(((archivedWithVerdict || 0) / archivedCount) * 100) : null;

    return jsonReply(expressResponse, {
      tickets: data || [],
      total: count || 0,
      page,
      limit,
      stats: {
        total: total.count || 0,
        active: active.count || 0,
        archived: archivedCount,
        pending_evidence: pending.count || 0,
        deleted: deleted.count || 0,
        avg_close_time_hours,
        verdict_rate_pct,
      },
    });
  } catch (err) {
    console.error('[BotTickets GET]', err);
    return jsonReply(expressResponse, { error: 'DB_ERROR' }, { status: 500 });
  }
}

export async function PATCH(req: ExpressRequest, expressResponse: ExpressResponse) {
  const session = await getAuthenticatedAdminSession();
  if (!session) return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });

  const isRoot = session.isRoot;
  const canAccess = isRoot || session.permissions?.canManageDiscordBot;
  if (!canAccess) return forbidden(expressResponse);

  if (!botDb) return dbUnavailable(expressResponse);

  try {
    const { ticket_id, status } = req.body;
    if (!ticket_id || !status) {
      return jsonReply(
        expressResponse,
        { error: 'BAD_REQUEST', message: 'ticket_id și status sunt obligatorii.' },
        { status: 400 },
      );
    }

    const allowed = ['active', 'archived', 'deleted', 'pending_evidence'];
    if (!allowed.includes(status)) {
      return jsonReply(
        expressResponse,
        { error: 'BAD_REQUEST', message: 'Status invalid.' },
        { status: 400 },
      );
    }

    const { error } = await botDb
      .from('tickets')
      .update({
        status,
        closed_at: ['archived', 'deleted'].includes(status) ? new Date().toISOString() : null,
      })
      .eq('ticket_id', ticket_id);

    if (error) throw error;

    return jsonReply(expressResponse, { success: true });
  } catch (err) {
    console.error('[BotTickets PATCH]', err);
    return jsonReply(expressResponse, { error: 'DB_ERROR' }, { status: 500 });
  }
}
