import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { validateSessionToken, SESSION_COOKIE_NAME } from '@server/lib/security/auth';
import { pullContentFromGitHub } from '@server/lib/gitops/syncEngine';
import { getGitOpsSettings } from '@server/lib/gitops/store';
import { recordAuditEvent } from '@server/lib/security/audit';

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;

  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  if (!session.isRoot) {
    return jsonReply(
      expressResponse,
      {
        error: 'FORBIDDEN',
        message:
          'Acces Refuzat: Doar Super Administratorul (Root) poate declanșa sincronizarea manuală a repo-urilor.',
      },
      { status: 403 },
    );
  }

  const result = await pullContentFromGitHub();
  const settings = getGitOpsSettings();

  recordAuditEvent({
    action: 'GITOPS_MANUAL_SYNC',
    actor: session.username,
    details: {
      publicRepo: `${settings.publicRepo.owner}/${settings.publicRepo.repo}`,
      status: result.success ? 'SUCCESS' : 'ERROR',
      commit: result.commitSha,
      filesUpdated: result.filesUpdated,
    },
  });

  if (result.success) {
    return jsonReply(expressResponse, {
      success: true,
      message: `Sincronizare finalizată: commit [${result.commitSha}] de @${result.commitAuthor} (${result.filesUpdated} fișiere actualizate)`,
      logs: result.logs,
      settings: { ...settings, sync: { ...settings.sync, githubToken: undefined } },
    });
  } else {
    return jsonReply(
      expressResponse,
      {
        success: false,
        error: result.error || 'Sincronizarea a eșuat.',
        logs: result.logs,
        conflicts: result.conflicts,
        settings: { ...settings, sync: { ...settings.sync, githubToken: undefined } },
      },
      { status: result.error === 'LOCAL_CONTENT_CONFLICT' || result.error === 'SYNC_IN_PROGRESS' ? 409 : 500 },
    );
  }
}
