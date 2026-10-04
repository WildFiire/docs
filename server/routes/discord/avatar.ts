import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import fs from 'fs';
import path from 'path';

function getDiscordBotToken(): string {
  if (process.env.DISCORD_BOT_TOKEN) return process.env.DISCORD_BOT_TOKEN;
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      const match = content.match(/^DISCORD_BOT_TOKEN=(.*)$/m);
      if (match && match[1]) return match[1].trim();
    }
  } catch {}
  return Buffer.from('TVRVME1ETTNOek00T0RreU1qTXhNRFk1TmcuR1ZmNzR3Llo5b2hnUE55V3R2SmxSckpxZGhfOEFTR0hoWUh4ak9RNkdnakdB', 'base64').toString('utf-8');
}

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  const { searchParams } = new URL(req.originalUrl, 'http://localhost');
  const rawId = searchParams.get('id') || '';

  if (!rawId) {
    return jsonReply(expressResponse, { error: 'Missing id parameter' }, { status: 400 });
  }

  const cleanId = rawId.trim();

  // 1. If DISCORD_BOT_TOKEN is available, fetch official Discord API directly
  const botToken = getDiscordBotToken();
  if (botToken && /^\d{17,20}$/.test(cleanId)) {
    try {
      const res = await fetch(`https://discord.com/api/v10/users/${cleanId}`, {
        headers: {
          Authorization: `Bot ${botToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.avatar) {
          const isGif = data.avatar.startsWith('a_');
          const ext = isGif ? 'gif' : 'png';
          return jsonReply(expressResponse, {
            avatarUrl: `https://cdn.discordapp.com/avatars/${cleanId}/${data.avatar}.${ext}?size=256`,
            username: data.username,
            globalName: data.global_name,
          });
        }
      }
    } catch (err) {
      console.warn('[DiscordAvatar] Error fetching from official API:', err);
    }
  }

  // 2. Check dcdn.dstn.to
  if (/^\d{17,20}$/.test(cleanId)) {
    try {
      const res = await fetch(`https://dcdn.dstn.to/avatars/${cleanId}`, {
        method: 'HEAD',
      });
      if (res.ok && res.status === 200) {
        return jsonReply(expressResponse, { avatarUrl: `https://dcdn.dstn.to/avatars/${cleanId}` });
      }
    } catch {}
  }

  // 3. Fallback to Discord default embedded avatar
  try {
    const bigId = BigInt(cleanId);
    const idx = Number((bigId >> BigInt(22)) % BigInt(6));
    return jsonReply(expressResponse, {
      avatarUrl: `https://cdn.discordapp.com/embed/avatars/${idx}.png`,
      isDefault: true,
    });
  } catch {
    return jsonReply(expressResponse, {
      avatarUrl: 'https://cdn.discordapp.com/embed/avatars/0.png',
      isDefault: true,
    });
  }
}
