import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { getAuthenticatedAdminSession } from '@server/lib/security/auth';
import { recordAuditEvent } from '@server/lib/security/audit';

interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

interface CustomEmbedPayload {
  mode?: 'create' | 'edit' | 'delete';
  messageId?: string;
  channelPreset?: string;
  customWebhookUrl?: string;
  content?: string;
  embed: {
    title?: string;
    url?: string;
    description?: string;
    color?: string | number;
    author?: {
      name?: string;
      icon_url?: string;
      url?: string;
    };
    fields?: DiscordEmbedField[];
    thumbnail?: {
      url?: string;
    };
    image?: {
      url?: string;
    };
    footer?: {
      text?: string;
      icon_url?: string;
    };
    timestamp?: boolean | string;
  };
}

function resolveTargetWebhookUrl(channelPreset?: string, customUrl?: string): string | null {
  if (customUrl && customUrl.trim().startsWith('http')) {
    return customUrl.trim();
  }

  const logsWebhook = process.env.DISCORD_LOGS_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL;
  const proceduraWebhook =
    process.env.DISCORD_PROCEDURA_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL;
  const anunturiWebhook =
    process.env.DISCORD_ANUNTURI_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL;
  const tasksWebhook = process.env.DISCORD_TASKS_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL;
  const securityWebhook =
    process.env.DISCORD_SECURITY_WEBHOOK_URL ||
    process.env.DISCORD_LOGS_WEBHOOK_URL ||
    process.env.DISCORD_WEBHOOK_URL;
  const teamWebhook = process.env.DISCORD_TEAM_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL;
  const contentWebhook = process.env.DISCORD_CONTENT_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL;
  const systemWebhook = process.env.DISCORD_SYSTEM_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL;
  const generalWebhook = process.env.DISCORD_WEBHOOK_URL;

  switch (channelPreset) {
    case '#procedura':
      return proceduraWebhook || null;
    case '#anunturi':
      return anunturiWebhook || null;
    case '#logs':
      return logsWebhook || null;
    case '#tasks':
      return tasksWebhook || null;
    case '#security':
      return securityWebhook || null;
    case '#team':
      return teamWebhook || null;
    case '#content':
      return contentWebhook || null;
    case '#system':
      return systemWebhook || null;
    default:
      return generalWebhook || null;
  }
}

function parseHexColor(color?: string | number): number {
  if (typeof color === 'number') return color;
  if (!color) return 0xff6b00; // Default WildFire Orange

  const cleaned = color.replace('#', '').trim();
  const parsed = parseInt(cleaned, 16);
  return isNaN(parsed) ? 0xff6b00 : parsed;
}

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  const session = await getAuthenticatedAdminSession();
  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  if (
    !session.isRoot &&
    !session.permissions?.canManageWebhooks &&
    !session.permissions?.canManageSettings
  ) {
    return jsonReply(expressResponse, { error: 'FORBIDDEN' }, { status: 403 });
  }

  try {
    const body: CustomEmbedPayload = req.body;
    const {
      mode = 'create',
      messageId,
      channelPreset = '#procedura',
      customWebhookUrl,
      content,
      embed,
    } = body;

    if (mode === 'edit' && (!messageId || !messageId.trim())) {
      return jsonReply(
        expressResponse,
        {
          error:
            'Pentru a edita un mesaj existent, trebuie să specifici un Message ID Discord valid.',
        },
        { status: 400 },
      );
    }

    if (
      !embed ||
      (!embed.title && !embed.description && (!embed.fields || embed.fields.length === 0))
    ) {
      return jsonReply(
        expressResponse,
        {
          error: 'Embed-ul trebuie sa contina cel putin un titlu, o descriere sau un camp (field).',
        },
        { status: 400 },
      );
    }

    const baseWebhookUrl = resolveTargetWebhookUrl(channelPreset, customWebhookUrl);
    if (!baseWebhookUrl) {
      return jsonReply(
        expressResponse,
        {
          error:
            'Niciun webhook Discord nu este configurat pentru aceasta destinatie. Te rugam sa introduci un Custom Webhook URL valid.',
        },
        { status: 400 },
      );
    }

    // Build standard Discord Embed structure
    const discordEmbed: Record<string, any> = {
      color: parseHexColor(embed.color),
    };

    if (embed.title?.trim()) {
      discordEmbed.title = embed.title.trim().slice(0, 256);
    }

    if (embed.url?.trim() && embed.url.trim().startsWith('http')) {
      discordEmbed.url = embed.url.trim();
    }

    if (embed.description?.trim()) {
      discordEmbed.description = embed.description.trim().slice(0, 4096);
    }

    if (embed.author?.name?.trim()) {
      discordEmbed.author = {
        name: embed.author.name.trim().slice(0, 256),
        icon_url: embed.author.icon_url?.trim() || undefined,
        url: embed.author.url?.trim() || undefined,
      };
    }

    if (Array.isArray(embed.fields) && embed.fields.length > 0) {
      discordEmbed.fields = embed.fields
        .filter((f) => f.name?.trim() && f.value?.trim())
        .slice(0, 25)
        .map((f) => ({
          name: f.name.trim().slice(0, 256),
          value: f.value.trim().slice(0, 1024),
          inline: Boolean(f.inline),
        }));
    }

    if (embed.thumbnail?.url?.trim() && embed.thumbnail.url.trim().startsWith('http')) {
      discordEmbed.thumbnail = { url: embed.thumbnail.url.trim() };
    }

    if (embed.image?.url?.trim() && embed.image.url.trim().startsWith('http')) {
      discordEmbed.image = { url: embed.image.url.trim() };
    }

    if (embed.footer?.text?.trim()) {
      discordEmbed.footer = {
        text: embed.footer.text.trim().slice(0, 2048),
        icon_url: embed.footer.icon_url?.trim() || undefined,
      };
    }

    if (embed.timestamp) {
      discordEmbed.timestamp =
        typeof embed.timestamp === 'string' ? embed.timestamp : new Date().toISOString();
    }

    const explicitAvatar = process.env.DISCORD_BOT_AVATAR_URL?.trim();

    const discordPayload: Record<string, any> = {
      username: 'WildFire Docs Engine',
      embeds: [discordEmbed],
    };

    if (explicitAvatar) {
      discordPayload.avatar_url = explicitAvatar;
    }

    if (content !== undefined) {
      discordPayload.content = content.trim().slice(0, 2000);
    }

    let targetUrl: string;
    let httpMethod: 'POST' | 'PATCH' = 'POST';

    if (mode === 'edit' && messageId) {
      // In-place Discord Webhook message edit: PATCH /messages/{messageId}
      const cleanBase = baseWebhookUrl.split('?')[0].replace(/\/messages\/.*$/, '');
      targetUrl = `${cleanBase}/messages/${messageId.trim()}`;
      httpMethod = 'PATCH';
    } else {
      // Create new message with wait=true to get back the message ID
      const hasQuery = baseWebhookUrl.includes('?');
      targetUrl = `${baseWebhookUrl}${hasQuery ? '&' : '?'}wait=true`;
      httpMethod = 'POST';
    }

    // Dispatch to Discord
    const discordRes = await fetch(targetUrl, {
      method: httpMethod,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordPayload),
    });

    if (!discordRes.ok) {
      const errText = await discordRes.text().catch(() => '');
      console.error(
        `[Discord Custom Embed] Dispatch error (${httpMethod}):`,
        discordRes.status,
        errText,
      );
      return jsonReply(
        expressResponse,
        {
          error: `Discord API a returnat eroarea ${discordRes.status}: ${errText || 'Verifică Webhook URL sau Message ID.'}`,
        },
        { status: discordRes.status },
      );
    }

    const responseData = await discordRes.json().catch(() => ({}));
    const returnedMessageId = responseData?.id || messageId || undefined;

    // Record Audit Event
    recordAuditEvent({
      action: 'WEBHOOK_CUSTOM_DISPATCHED',
      actor: session.username,
      ip: req.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.get('user-agent') || undefined,
      details: {
        mode,
        messageId: returnedMessageId,
        channelPreset,
        embedTitle: embed.title || '(Fara Titlu)',
        fieldsCount: discordEmbed.fields?.length || 0,
        targetMasked: baseWebhookUrl.slice(0, 45) + '...',
      },
    });

    return jsonReply(expressResponse, {
      success: true,
      mode,
      messageId: returnedMessageId,
      channelPreset,
      message:
        mode === 'edit'
          ? `Mesajul Discord (${returnedMessageId}) a fost actualizat cu succes pe canalul ${channelPreset}!`
          : `Embed nou transmis cu succes pe canalul Discord (${channelPreset})!`,
      dispatchedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[Discord Custom Embed Route] Error:', err);
    return jsonReply(
      expressResponse,
      { error: err?.message || 'A aparut o eroare interna la procesarea embed-ului.' },
      { status: 500 },
    );
  }
}

export async function PATCH(req: ExpressRequest, expressResponse: ExpressResponse) {
  return POST(req, expressResponse);
}
