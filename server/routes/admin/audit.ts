import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { validateSessionToken, SESSION_COOKIE_NAME } from '@server/lib/security/auth';
import {
  getAuditEvents,
  verifyAuditChainIntegrity,
  resealAuditChain,
  AuditAction,
} from '@server/lib/security/audit';

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;

  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  if (!session.isRoot && !session.permissions?.canViewAudit) {
    return jsonReply(
      expressResponse,
      {
        error: 'FORBIDDEN',
        message: 'Acces Refuzat: Nu ai permisiunea canViewAudit pentru a accesa Audit Ledger.',
      },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(req.originalUrl, 'http://localhost');
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const actionFilter = searchParams.get('action') as AuditAction | undefined;

  const events = getAuditEvents(limit, actionFilter);
  const integrity = verifyAuditChainIntegrity();

  return jsonReply(expressResponse, {
    integrity,
    total: events.length,
    events,
  });
}

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;

  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  if (!session.isRoot && !session.permissions?.canManageSecurity) {
    return jsonReply(
      expressResponse,
      {
        error: 'FORBIDDEN',
        message: 'Acces Refuzat: Doar Root sau Administratorii de Securitate pot resigila Audit Ledger.',
      },
      { status: 403 },
    );
  }

  const result = resealAuditChain();
  const integrity = verifyAuditChainIntegrity();

  return jsonReply(expressResponse, {
    ok: true,
    result,
    integrity,
  });
}

