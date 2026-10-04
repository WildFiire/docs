import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { resetAllRateLimits } from '@server/lib/security/rateLimit';

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  if (process.env.NODE_ENV === 'production') {
    return jsonReply(expressResponse, { error: 'NOT_FOUND' }, { status: 404 });
  }
  resetAllRateLimits();
  return jsonReply(expressResponse, {
    success: true,
    message: 'Toate cooldown-urile și blocările IP au fost resetate cu succes.',
  });
}

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  if (process.env.NODE_ENV === 'production') {
    return jsonReply(expressResponse, { error: 'NOT_FOUND' }, { status: 404 });
  }
  resetAllRateLimits();
  return jsonReply(expressResponse, {
    success: true,
    message: 'Toate cooldown-urile și blocările IP au fost resetate cu succes.',
  });
}
