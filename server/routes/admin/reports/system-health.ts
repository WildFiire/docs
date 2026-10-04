import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { getAuthenticatedAdminSession } from '@server/lib/security/auth';
import { CURRENT_VERSION } from '@server/lib/version';
import { getActiveSessions } from '@server/lib/security/auth';
import { listApiKeys } from '@server/lib/security/apiKeys';
import { scanMediaLibrary } from '@server/lib/admin/mediaScanner';

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

async function dispatchSystemHealth() {
  const webhookUrl = getDiscordWebhookUrl();
  if (!webhookUrl) {
    throw new Error(
      'Webhook-ul Discord nu este configurat (DISCORD_LOGS_WEBHOOK_URL sau DISCORD_WEBHOOK_URL).',
    );
  }

  const mem = process.memoryUsage();
  const heapUsedMb = Math.round(mem.heapUsed / 1024 / 1024);
  const heapTotalMb = Math.round(mem.heapTotal / 1024 / 1024);
  const rssMb = Math.round(mem.rss / 1024 / 1024);
  const heapPct = Math.round((mem.heapUsed / mem.heapTotal) * 100);

  const uptimeSecs = process.uptime();
  const uptimeHrs = Math.floor(uptimeSecs / 3600);
  const uptimeMins = Math.floor((uptimeSecs % 3600) / 60);

  const sessions = getActiveSessions();
  const apiKeys = listApiKeys();
  const media = scanMediaLibrary();

  const statusColor = heapPct > 80 ? 0xef4444 : heapPct > 60 ? 0xf59e0b : 0x10b981;

  const embed = {
    title: `System Health — WF-DOCSCORE v${CURRENT_VERSION}`,
    description: `>>> **Raport de funcționare server generat la ${new Date().toLocaleString('ro-RO')}**`,
    color: statusColor,
    fields: [
      {
        name: 'Heap Memory',
        value: `**${heapUsedMb}MB** / ${heapTotalMb}MB (${heapPct}%)`,
        inline: true,
      },
      {
        name: 'RSS Memory',
        value: `**${rssMb}MB**`,
        inline: true,
      },
      {
        name: 'Uptime Server',
        value: `**${uptimeHrs}h ${uptimeMins}m**`,
        inline: true,
      },
      {
        name: 'Sesiuni Admin Active',
        value: `**${sessions.length}** sesiune/i active`,
        inline: true,
      },
      {
        name: 'API Keys Active',
        value: `**${apiKeys.length}** chei active`,
        inline: true,
      },
      {
        name: 'Asset Vault',
        value: `**${media.totalAssets}** fișiere (${media.totalSizeFormatted})`,
        inline: true,
      },
      {
        name: 'Stack Platformă',
        value: `VitePress 2 + Express · Node.js ${process.version} · WF-DOCSCORE v${CURRENT_VERSION}`,
        inline: false,
      },
    ],
    footer: { text: 'WF-DOCSCORE Admin · System Health' },
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
  if (!session?.isRoot && !session?.permissions?.canManageWebhooks) {
    return jsonReply(expressResponse, { error: 'FORBIDDEN' }, { status: 403 });
  }

  try {
    await dispatchSystemHealth();
    return jsonReply(expressResponse, {
      success: true,
      message: 'System Health Report a fost transmis cu succes pe Discord (#logs).',
    });
  } catch (err: any) {
    return jsonReply(expressResponse, { error: err.message }, { status: 500 });
  }
}

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  return jsonReply(expressResponse, { success: true, dispatchMethod: 'POST', message: 'Raportul se trimite doar prin acțiunea explicită POST.' });
}
