import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { getAuthenticatedAdminSession } from '@server/lib/security/auth';
import { botDb } from '@server/lib/db/discordBotDb';

export async function GET(_req: ExpressRequest, expressResponse: ExpressResponse) {
  const session = await getAuthenticatedAdminSession();
  if (!session) return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  if (!session.isRoot && !session.permissions?.canManageDiscordBot)
    return jsonReply(expressResponse, { error: 'FORBIDDEN' }, { status: 403 });
  if (!botDb) return jsonReply(expressResponse, { error: 'BOT_DB_UNAVAILABLE' }, { status: 503 });

  try {
    const { data, error } = await botDb.from('role_trackers').select('*');
    if (error) throw error;
    return jsonReply(expressResponse, { trackers: data || [] });
  } catch (err) {
    console.error('[BotTrackers GET]', err);
    return jsonReply(expressResponse, { error: 'DB_ERROR' }, { status: 500 });
  }
}

export async function DELETE(req: ExpressRequest, expressResponse: ExpressResponse) {
  const session = await getAuthenticatedAdminSession();
  if (!session) return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  if (!session.isRoot && !session.permissions?.canManageDiscordBot)
    return jsonReply(expressResponse, { error: 'FORBIDDEN' }, { status: 403 });
  if (!botDb) return jsonReply(expressResponse, { error: 'BOT_DB_UNAVAILABLE' }, { status: 503 });

  try {
    const { id } = req.body;
    if (!id) return jsonReply(expressResponse, { error: 'BAD_REQUEST' }, { status: 400 });
    const { error } = await botDb.from('role_trackers').delete().eq('id', id);
    if (error) throw error;
    return jsonReply(expressResponse, { success: true });
  } catch (err) {
    console.error('[BotTrackers DELETE]', err);
    return jsonReply(expressResponse, { error: 'DB_ERROR' }, { status: 500 });
  }
}
