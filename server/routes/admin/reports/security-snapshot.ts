import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { getAuthenticatedAdminSession } from '@server/lib/security/auth';
import { getAuditEvents, verifyAuditChainIntegrity } from '@server/lib/security/audit';
import { getActiveSessions, isPanicLockdown } from '@server/lib/security/auth';
import { listApiKeys } from '@server/lib/security/apiKeys';

function getDiscordWebhookUrl(): string | null {
  return (
    process.env.DISCORD_LOGS_WEBHOOK_URL ||
    process.env.DISCORD_WEBHOOK_LOGS ||
    process.env.DISCORD_WEBHOOK_AUDIT ||
    process.env.DISCORD_WEBHOOK_SECURITY ||
    process.env.DISCORD_WEBHOOK_URL ||
    null
  );
}

async function dispatchSecuritySnapshot() {
  const webhookUrl = getDiscordWebhookUrl();
  if (!webhookUrl) {
    throw new Error(
      'Webhook-ul Discord nu este configurat (DISCORD_LOGS_WEBHOOK_URL sau DISCORD_WEBHOOK_URL).',
    );
  }

  const isLocked = isPanicLockdown();
  const sessions = getActiveSessions();
  const apiKeys = listApiKeys();
  const chain = verifyAuditChainIntegrity();
  const recentEvents = getAuditEvents(5);

  const eventsText =
    recentEvents
      .map(
        (e) =>
          `🛡️ \`${e.action.replace(/_/g, ' ')}\` — **${e.actor}** (\`${e.hash.slice(0, 8)}…\`)`,
      )
      .join('\n') || '_Niciun eveniment recent._';

  const embed = {
    title: 'Security Snapshot — WF-DOCSCORE',
    description: `>>> **Raport de securitate generat la ${new Date().toLocaleString('ro-RO')}**`,
    color: isLocked ? 0xef4444 : 0x10b981,
    fields: [
      {
        name: 'Panic Lockdown',
        value: isLocked ? '**ACTIV (URGENT)**' : 'Clear (Operațional)',
        inline: true,
      },
      {
        name: 'Audit Chain',
        value: chain.isValid ? 'Verificată (Integritate 100%)' : '**COMPROMISĂ**',
        inline: true,
      },
      {
        name: 'Sesiuni Active',
        value: `**${sessions.length}** sesiune/i active`,
        inline: true,
      },
      {
        name: 'API Keys Active',
        value: `**${apiKeys.length}** chei active`,
        inline: true,
      },
      {
        name: 'Ultimele 5 Evenimente de Audit',
        value: eventsText,
        inline: false,
      },
    ],
    footer: { text: 'WF-DOCSCORE Admin · Security Operations' },
    timestamp: new Date().toISOString(),
  };

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embeds: [embed] }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Discord a raspuns cu statusul ${res.status}: ${txt || 'Eroare retea'}`);
  }
}

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  const session = await getAuthenticatedAdminSession();
  if (
    !session?.isRoot &&
    !session?.permissions?.canManageWebhooks &&
    !session?.permissions?.canManageSecurity
  ) {
    return jsonReply(expressResponse, { error: 'FORBIDDEN' }, { status: 403 });
  }

  try {
    await dispatchSecuritySnapshot();
    return jsonReply(expressResponse, {
      success: true,
      message: 'Security Snapshot a fost transmis cu succes pe Discord (#logs).',
    });
  } catch (err: any) {
    return jsonReply(expressResponse, { error: err.message }, { status: 500 });
  }
}

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  return jsonReply(expressResponse, { success: true, dispatchMethod: 'POST', message: 'Raportul se trimite doar prin acțiunea explicită POST.' });
}
