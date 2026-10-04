import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { getSearchIndex } from '@server/lib/search';
import { recordSearchQuery } from '@server/lib/security/searchAnalytics';

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  try {
    const index = getSearchIndex();
    return jsonReply(
      expressResponse,
      { results: index, count: index.length, timestamp: Date.now() },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      },
    );
  } catch (error) {
    console.error('Search index error:', error);
    return jsonReply(
      expressResponse,
      { error: 'Failed to generate search index' },
      { status: 500 },
    );
  }
}

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  try {
    const { query, resultCount, latencyMs } = req.body;
    const ip = req.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

    if (query && typeof query === 'string') {
      recordSearchQuery({
        query,
        resultCount: Number(resultCount) || 0,
        latencyMs: Number(latencyMs) || 1.5,
        ip,
      });
    }

    return jsonReply(expressResponse, { success: true });
  } catch (err) {
    return jsonReply(expressResponse, { error: 'Failed to log search telemetry' }, { status: 500 });
  }
}
