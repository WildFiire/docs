import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { validateSessionToken, SESSION_COOKIE_NAME } from '@server/lib/security/auth';
import { generateApiKey, listApiKeysAsync, revokeApiKey } from '@server/lib/security/apiKeys';

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;

  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  if (!session.isRoot && !session.permissions?.canManageApiKeys) {
    return jsonReply(
      expressResponse,
      {
        error: 'FORBIDDEN',
        message: 'Acces Refuzat: Nu ai permisiunea canManageApiKeys pentru a vizualiza cheile API.',
      },
      { status: 403 },
    );
  }

  const keys = await listApiKeysAsync();
  return jsonReply(expressResponse, { total: keys.length, keys });
}

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;

  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  if (!session.isRoot && !session.permissions?.canManageApiKeys) {
    return jsonReply(
      expressResponse,
      {
        error: 'FORBIDDEN',
        message: 'Acces Refuzat: Nu ai permisiunea canManageApiKeys pentru a modifica cheile API.',
      },
      { status: 403 },
    );
  }

  try {
    const { action, name, scope, keyId } = req.body;

    if (action === 'create') {
      if (!name) {
        return jsonReply(expressResponse, { error: 'Token name is required.' }, { status: 400 });
      }

      const { rawToken, record } = generateApiKey({
        name,
        scope: scope || 'read_only',
        actor: session.username,
      });

      return jsonReply(expressResponse, {
        success: true,
        message:
          "API Key generated successfully. Make sure to copy it now as it won't be shown again.",
        rawToken,
        record,
      });
    }

    if (action === 'revoke') {
      if (!keyId) {
        return jsonReply(expressResponse, { error: 'keyId is required.' }, { status: 400 });
      }

      const success = revokeApiKey(keyId, session.username);
      return jsonReply(expressResponse, {
        success,
        message: 'API Key revoked successfully.',
      });
    }

    return jsonReply(expressResponse, { error: 'Unknown action' }, { status: 400 });
  } catch {
    return jsonReply(expressResponse, { error: 'Server error' }, { status: 500 });
  }
}
