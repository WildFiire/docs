import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { getAuthenticatedAdminSession } from '@server/lib/security/auth';
import { dispatchDailyTrafficDigest } from '@server/lib/notifications/discordDigestWebhook';

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  const session = await getAuthenticatedAdminSession();
  if (!session?.isRoot && !session?.permissions?.canManageWebhooks) {
    return jsonReply(expressResponse, { error: 'FORBIDDEN' }, { status: 403 });
  }

  return jsonReply(expressResponse, {
    success: true,
    message: 'Raportul se trimite doar prin acțiunea explicită POST.',
    dispatchMethod: 'POST',
  });
}

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  const session = await getAuthenticatedAdminSession();
  if (!session?.isRoot && !session?.permissions?.canManageWebhooks) {
    return jsonReply(expressResponse, { error: 'FORBIDDEN' }, { status: 403 });
  }

  const res = await dispatchDailyTrafficDigest();
  if (!res.success) {
    return jsonReply(expressResponse, { error: res.error }, { status: 500 });
  }
  return jsonReply(expressResponse, {
    success: true,
    message: 'Raportul zilnic de trafic a fost transmis cu succes pe Discord (#logs).',
  });
}
