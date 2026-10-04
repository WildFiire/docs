import { steamProfileXml } from '@server/security/steam';
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  const { searchParams } = new URL(req.originalUrl, 'http://localhost');
  const rawId = searchParams.get('id') || '';

  if (!rawId) {
    return jsonReply(expressResponse, { error: 'Missing id parameter' }, { status: 400 });
  }

  let xmlUrl: string;
    try { xmlUrl = steamProfileXml(rawId); } catch { return jsonReply(expressResponse, { error: 'Invalid Steam profile' }, { status: 400 }); }
  try {
    const res = await fetch(xmlUrl, { signal: AbortSignal.timeout(8000), redirect: 'error',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    if (!res.ok) {
      return jsonReply(expressResponse, { error: 'Steam user not found' }, { status: 404 });
    }
    const text = await res.text();
    const match =
      text.match(/<avatarFull><!\[CDATA\[(.*?)\]\]><\/avatarFull>/) ||
      text.match(/<avatarMedium><!\[CDATA\[(.*?)\]\]><\/avatarMedium>/) ||
      text.match(/<avatarIcon><!\[CDATA\[(.*?)\]\]><\/avatarIcon>/);

    if (match && match[1]) {
      return jsonReply(expressResponse, { avatarUrl: match[1] });
    }
    return jsonReply(
      expressResponse,
      { error: 'Avatar not found in profile XML' },
      { status: 404 },
    );
  } catch (err: any) {
    return jsonReply(
      expressResponse,
      { error: err.message || 'Failed to fetch Steam avatar' },
      { status: 500 },
    );
  }
}
