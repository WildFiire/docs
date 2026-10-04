import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { validateSessionToken, SESSION_COOKIE_NAME } from '@server/lib/security/auth';
import {
  getGitOpsSettings,
  updateGitOpsSettings,
  type GitOpsSettings,
} from '@server/lib/gitops/store';

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;

  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  // Strict Super Root Only Check
  if (!session.isRoot) {
    return jsonReply(
      expressResponse,
      {
        error: 'FORBIDDEN',
        message:
          'Acces Refuzat: Doar Super Administratorul (Root) poate accesa panoul GitOps & Repos.',
      },
      { status: 403 },
    );
  }

  const settings = getGitOpsSettings();

  // Mask sensitive GitHub token for UI display
  const maskedToken = settings.sync.githubToken
    ? `${settings.sync.githubToken.slice(0, 4)}••••••••${settings.sync.githubToken.slice(-4)}`
    : '';

  return jsonReply(expressResponse, {
    settings: {
      ...settings,
      sync: {
        ...settings.sync,
        githubToken: maskedToken,
      },
    },
    hasCustomToken: Boolean(settings.sync.githubToken),
  });
}

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;

  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  // Strict Super Root Only Check
  if (!session.isRoot) {
    return jsonReply(
      expressResponse,
      {
        error: 'FORBIDDEN',
        message:
          'Acces Refuzat: Doar Super Administratorul (Root) poate modifica topologia de sincronizare a repo-urilor.',
      },
      { status: 403 },
    );
  }

  try {
    const body = req.body;
    const current = getGitOpsSettings();

    // Preserve existing token if not changed in UI (or empty string/masked)
    let finalToken = current.sync.githubToken;
    if (typeof body.sync?.githubToken === 'string') {
      const trimmed = body.sync.githubToken.trim();
      if (trimmed && !trimmed.includes('••••')) {
        finalToken = trimmed;
      } else if (trimmed === '') {
        finalToken = '';
      }
    }

    const updated = updateGitOpsSettings(
      {
        publicRepo: body.publicRepo,
        privateRepo: body.privateRepo,
        sync: {
          ...body.sync,
          githubToken: finalToken,
        },
      },
      session.username,
    );

    return jsonReply(expressResponse, {
      success: true,
      message: 'Configurația GitOps a fost salvată cu succes!',
      settings: { ...updated, sync: { ...updated.sync, githubToken: undefined } },
    });
  } catch (err: any) {
    console.error('[GitOps API] Failed to update settings:', err);
    return jsonReply(
      expressResponse,
      { error: 'Eroare la salvarea setărilor GitOps.', details: err?.message },
      { status: 500 },
    );
  }
}
