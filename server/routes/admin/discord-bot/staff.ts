import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { getAuthenticatedAdminSession } from '@server/lib/security/auth';
import { botDb } from '@server/lib/db/discordBotDb';

function forbidden(expressResponse: ExpressResponse) {
  return jsonReply(expressResponse, { error: 'FORBIDDEN' }, { status: 403 });
}
function dbUnavailable(expressResponse: ExpressResponse) {
  return jsonReply(expressResponse, { error: 'BOT_DB_UNAVAILABLE' }, { status: 503 });
}

async function checkAccess() {
  const session = await getAuthenticatedAdminSession();
  if (!session) return null;
  if (!session.isRoot && !session.permissions?.canManageDiscordBot) return null;
  return session;
}

// ─── GET: Staff list with ticket counts ─────────────────────────────────────
export async function GET(_req: ExpressRequest, expressResponse: ExpressResponse) {
  const session = await checkAccess();
  if (!session)
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED_OR_FORBIDDEN' }, { status: 403 });
  if (!botDb) return dbUnavailable(expressResponse);

  try {
    const { data: admins, error } = await botDb.from('admins').select('*');
    if (error) throw error;

    // Ticket counts per staff user_id (closed tickets only)
    const { data: closedTickets } = await botDb
      .from('tickets')
      .select('ticket_id, suspect_name, closed_by, verdict, created_at, closed_at')
      .not('closed_by', 'is', null)
      .in('status', ['archived', 'deleted'])
      .order('closed_at', { ascending: false });

    // Watchlist counts per staff
    const { data: watchlistData } = await botDb.from('watchlist').select('added_by');
    const watchlistCountMap: Record<string, number> = {};
    for (const w of watchlistData || []) {
      if (w.added_by) watchlistCountMap[w.added_by] = (watchlistCountMap[w.added_by] || 0) + 1;
    }

    // Build leaderboard map
    const countMap: Record<
      string,
      {
        total: number;
        lastClosed?: string;
        curat: number;
        codat: number;
        insuficient: number;
        deleted: number;
        totalMs: number;
        recentTickets: Array<{ id: string; name: string; verdict: string | null }>;
      }
    > = {};

    for (const t of closedTickets || []) {
      if (!t.closed_by) continue;
      if (!countMap[t.closed_by]) {
        countMap[t.closed_by] = {
          total: 0,
          curat: 0,
          codat: 0,
          insuficient: 0,
          deleted: 0,
          totalMs: 0,
          recentTickets: [],
        };
      }

      countMap[t.closed_by].total++;

      if (t.verdict === 'curat') countMap[t.closed_by].curat++;
      else if (t.verdict === 'codat') countMap[t.closed_by].codat++;
      else if (t.verdict === 'insuficient') countMap[t.closed_by].insuficient++;
      else countMap[t.closed_by].deleted++;

      if (t.created_at && t.closed_at) {
        const ms = new Date(t.closed_at).getTime() - new Date(t.created_at).getTime();
        if (ms > 0) countMap[t.closed_by].totalMs += ms;
      }

      if (countMap[t.closed_by].recentTickets.length < 3) {
        countMap[t.closed_by].recentTickets.push({
          id: t.ticket_id,
          name: t.suspect_name,
          verdict: t.verdict,
        });
      }

      if (
        !countMap[t.closed_by].lastClosed ||
        t.closed_at > (countMap[t.closed_by].lastClosed ?? '')
      ) {
        countMap[t.closed_by].lastClosed = t.closed_at;
      }
    }

    const staffWithStats = (admins || []).map((a) => {
      const stats = countMap[a.user_id] || {
        total: 0,
        curat: 0,
        codat: 0,
        insuficient: 0,
        deleted: 0,
        totalMs: 0,
        recentTickets: [],
      };
      const validVerdicts = stats.curat + stats.codat;
      const totalVerdicts = validVerdicts + stats.insuficient;
      const success_rate =
        totalVerdicts > 0 ? Math.round((validVerdicts / totalVerdicts) * 100) : null;
      const avg_close_time_mins =
        stats.total > 0 ? Math.round(stats.totalMs / stats.total / (1000 * 60)) : null;

      return {
        ...a,
        tickets_resolved: stats.total,
        last_resolved_at: stats.lastClosed || null,
        avg_close_time_mins,
        success_rate,
        watchlist_count: watchlistCountMap[a.user_id] || 0,
        recent_activity: stats.recentTickets,
        verdicts: {
          curat: stats.curat,
          codat: stats.codat,
          insuficient: stats.insuficient,
          deleted: stats.deleted,
        },
      };
    });

    // Fetch avatars from Discord API
    const botToken = process.env.DISCORD_BOT_TOKEN;
    let staffWithAvatars = staffWithStats;

    if (botToken && staffWithStats.length > 0) {
      const avatarPromises = staffWithStats.map(async (a) => {
        try {
          const res = await fetch(`https://discord.com/api/v10/users/${a.user_id}`, {
            headers: { Authorization: `Bot ${botToken}` },
            // cache for 1 hour to prevent rate limits
          });
          if (res.ok) {
            const discordUser = await res.json();
            if (discordUser.avatar) {
              return {
                ...a,
                avatar_url: `https://cdn.discordapp.com/avatars/${a.user_id}/${discordUser.avatar}.png?size=128`,
              };
            }
          }
        } catch (e) {
          console.error(`Failed to fetch avatar for ${a.user_id}`, e);
        }

        // Fallback default avatar
        try {
          const defaultIndex = Number((BigInt(a.user_id) >> BigInt(22)) % BigInt(6));
          return {
            ...a,
            avatar_url: `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`,
          };
        } catch {
          return { ...a, avatar_url: `https://cdn.discordapp.com/embed/avatars/0.png` };
        }
      });
      staffWithAvatars = await Promise.all(avatarPromises);
    } else {
      // Fallback if no token
      staffWithAvatars = staffWithStats.map((a) => {
        try {
          const defaultIndex = Number((BigInt(a.user_id) >> BigInt(22)) % BigInt(6));
          return {
            ...a,
            avatar_url: `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`,
          };
        } catch {
          return { ...a, avatar_url: `https://cdn.discordapp.com/embed/avatars/0.png` };
        }
      });
    }

    return jsonReply(expressResponse, { staff: staffWithAvatars });
  } catch (err) {
    console.error('[BotStaff GET]', err);
    return jsonReply(expressResponse, { error: 'DB_ERROR' }, { status: 500 });
  }
}

// ─── POST: Add new admin to bot DB ──────────────────────────────────────────
export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  const session = await checkAccess();
  if (!session)
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED_OR_FORBIDDEN' }, { status: 403 });
  if (!botDb) return dbUnavailable(expressResponse);

  try {
    const { user_id, name } = req.body;
    if (!user_id || !name)
      return jsonReply(expressResponse, { error: 'BAD_REQUEST' }, { status: 400 });

    const { error } = await botDb.from('admins').insert({ user_id, name });
    if (error) {
      if (error.code === '23505') {
        // Unique violation
        return jsonReply(expressResponse, { error: 'ALREADY_EXISTS' }, { status: 409 });
      }
      throw error;
    }

    return jsonReply(expressResponse, { success: true });
  } catch (err) {
    console.error('[BotStaff POST]', err);
    return jsonReply(expressResponse, { error: 'DB_ERROR' }, { status: 500 });
  }
}

// ─── DELETE: Remove admin from bot DB ───────────────────────────────────────
export async function DELETE(req: ExpressRequest, expressResponse: ExpressResponse) {
  const session = await checkAccess();
  if (!session)
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED_OR_FORBIDDEN' }, { status: 403 });
  if (!botDb) return dbUnavailable(expressResponse);

  try {
    const { user_id } = req.body;
    if (!user_id) return jsonReply(expressResponse, { error: 'BAD_REQUEST' }, { status: 400 });

    const { error } = await botDb.from('admins').delete().eq('user_id', user_id);
    if (error) throw error;

    return jsonReply(expressResponse, { success: true });
  } catch (err) {
    console.error('[BotStaff DELETE]', err);
    return jsonReply(expressResponse, { error: 'DB_ERROR' }, { status: 500 });
  }
}
