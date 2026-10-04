import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { getRealLiveTerminalLogs } from '@server/lib/admin/realTelemetry';

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  const realData = getRealLiveTerminalLogs();

  return jsonReply(expressResponse, {
    success: true,
    telemetry: realData.telemetry,
    logs: realData.logs,
    commits: realData.commits,
  });
}
