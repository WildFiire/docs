import { AdminTask } from '@server/lib/db';
import { getPublicTeamMembers } from '@server/lib/security/teamStore';
import { getPlatformSettings } from '@server/lib/security/settingsStore';
import { CURRENT_VERSION } from '@server/lib/version';

export type DiscordTaskAction =
  'created' | 'assigned' | 'completed' | 'urgent' | 'updated' | 'deleted' | 'archived';

const CATEGORY_NAMES: Record<string, { label: string }> = {
  docs_creation: { label: 'Ghid Nou' },
  docs_update: { label: 'Update Ghid' },
  review: { label: 'Audit & Review' },
  media: { label: 'Media Assets' },
  system: { label: 'Sistem & Mentenanta' },
  bug_fix: { label: 'Bug Fix' },
};

export const PRIORITY_META: Record<string, { label: string; color: number }> = {
  urgent: { label: 'URGENT', color: 0xef4444 },
  high: { label: 'HIGH', color: 0xf97316 },
  medium: { label: 'MEDIUM', color: 0xf59e0b },
  low: { label: 'LOW', color: 0x06b6d4 },
};

const STATUS_META: Record<string, { label: string }> = {
  todo: { label: 'To Do' },
  in_progress: { label: 'In Progress' },
  in_review: { label: 'In Review' },
  completed: { label: 'Done' },
};

function resolveWebhookUrl(): string | null {
  const settings = getPlatformSettings();
  return (
    (settings as any).discordWebhookUrl ||
    process.env.DISCORD_NOTIFICATIONS_WEBHOOK_URL ||
    process.env.DISCORD_TASKS_WEBHOOK_URL ||
    process.env.DISCORD_WEBHOOK_URL ||
    process.env.DISCORD_LOGS_WEBHOOK_URL ||
    null
  );
}

import DISCORD_FORUM_TAGS_DATA from './discordForumTags.json';
export const DISCORD_FORUM_TAGS = DISCORD_FORUM_TAGS_DATA;

export async function sendDiscordTaskNotification(
  task: AdminTask,
  action: DiscordTaskAction = 'created',
  updateContext?: string,
): Promise<{ success: boolean; pingsCount: number; error?: string; threadId?: string }> {
  const webhookUrl = resolveWebhookUrl();

  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    console.log('[Discord Task Webhook] No valid webhook URL configured in env or settings.');
    return { success: false, pingsCount: 0, error: 'No webhook URL configured' };
  }

  const siteUrl = process.env.PUBLIC_ORIGIN || 'http://localhost:3000';
  const members = await getPublicTeamMembers();

  // 1. Resolve assignees and their Discord Snowflake IDs
  const assignedMembers = (task.assignees || []).map((assigneeName) => {
    const found = members.find(
      (m) =>
        m.username.toLowerCase() === assigneeName.toLowerCase() ||
        m.displayName.toLowerCase() === assigneeName.toLowerCase(),
    );
    return {
      username: assigneeName,
      displayName: found?.displayName || assigneeName,
      customTitle: found?.customTitle || found?.role || 'Membru Echipă',
      avatarUrl: found?.avatarUrl || null,
      githubUsername: found?.githubUsername || null,
      discordId: found?.discord && /^\d+$/.test(found.discord.trim()) ? found.discord.trim() : null,
    };
  });

  // 2. Resolve creator / assigner
  const assignerMember = members.find(
    (m) =>
      m.username.toLowerCase() === (task.assignedBy || '').toLowerCase() ||
      m.displayName.toLowerCase() === (task.assignedBy || '').toLowerCase(),
  );
  const assignerDiscordId =
    assignerMember?.discord && /^\d+$/.test(assignerMember.discord.trim())
      ? assignerMember.discord.trim()
      : null;

  const assignerTag = assignerDiscordId
    ? `<@${assignerDiscordId}>`
    : `**@${task.assignedBy || 'Admin'}**`;

  // 3. Build Discord mention strings for notification header (<@DISCORD_ID>)
  const discordPings = assignedMembers.filter((m) => m.discordId).map((m) => `<@${m.discordId}>`);

  const pingsHeader =
    discordPings.length > 0
      ? discordPings.join(' ')
      : assignedMembers.map((m) => `@${m.displayName}`).join(', ');

  const priorityInfo = PRIORITY_META[task.priority] || PRIORITY_META.medium;
  const statusInfo = STATUS_META[task.status] || STATUS_META.todo;
  const categoryInfo = CATEGORY_NAMES[task.category] || { label: task.category };

  let embedColor = priorityInfo.color;
  let contentString = '';
  let embedTitle = '';

  if (action === 'completed') {
    embedColor = 0x10b981; // Emerald Green
    embedTitle = `✅ TASK FINALIZAT: ${task.title}`;
    contentString = `🎉 **SARCINĂ COMPLETATĂ** | Felicitări ${pingsHeader}, task-ul a fost validat cu succes!`;
  } else if (action === 'deleted') {
    embedColor = 0xef4444; // Red
    embedTitle = `🗑️ TASK ȘTERS: ${task.title}`;
    contentString = `🛑 **SARCINĂ ȘTEARSĂ** | ${pingsHeader} ${updateContext || 'Acest task a fost șters definitiv.'}`;
  } else if (action === 'archived') {
    embedColor = 0x6b7280; // Gray
    embedTitle = `📦 TASK ARHIVAT: ${task.title}`;
    contentString = `📦 **SARCINĂ ARHIVATĂ** | ${pingsHeader} ${updateContext || 'Task mutat în arhivă.'}`;
  } else if (action === 'updated') {
    embedColor = 0x3b82f6; // Blue Accent
    embedTitle = `🔄 UPDATE TASK: ${task.title}`;
    contentString = `📝 **UPDATE SARCINĂ** | ${pingsHeader} ${updateContext || 'Au fost înregistrate modificări.'}`;
  } else if (action === 'urgent') {
    embedColor = 0xf43f5e; // Rose Red
    embedTitle = `🚨 TASK URGENT: ${task.title}`;
    contentString = `⚠️ **URGENȚĂ MAXIMĂ** | ${pingsHeader} e nevoie de intervenție imediată!`;
  } else {
    embedColor = 0xff6b00; // WildFire Orange
    embedTitle = `📌 SARCINĂ NOUĂ: ${task.title}`;
    contentString = `🔔 **NOU** | ${pingsHeader} ai primit o sarcină nouă de la ${assignerTag}.`;
  }

  const responsabili =
    assignedMembers.length > 0
      ? assignedMembers
          .map((m) => (m.discordId ? `<@${m.discordId}>` : `@${m.displayName}`))
          .join(', ')
      : '_Neasignat_';

  const fields: Array<{ name: string; value: string; inline: boolean }> = [
    {
      name: '📁 CONTEXT',
      value: `**Categorie:** ${categoryInfo.label}\n**Țintă:** ${task.targetDoc ? `[Link Documentație](${siteUrl}/docs/${task.targetDoc})` : '*N/A*'}`,
      inline: true,
    },
    {
      name: '👥 ECHIPĂ',
      value: `**De la:** ${assignerTag}\n**Către:** ${responsabili}`,
      inline: true,
    },
    {
      name: '📊 STARE',
      value: `**Status:** ${task.archived ? '📦 ARHIVAT' : statusInfo.label}\n**Deadline:** ${task.dueDate ? `\`${task.dueDate}\`` : '*Nespecificat*'}`,
      inline: true,
    },
  ];

  if (task.subtasks && task.subtasks.length > 0) {
    const completedCount = task.subtasks.filter((s) => s.completed).length;
    const checklistFormatted = task.subtasks
      .map((s) => `${s.completed ? '✅' : '⭕'} ${s.title}`)
      .join('\n');

    fields.push({
      name: `📋 OBIECTIVE [ ${completedCount} / ${task.subtasks.length} ]`,
      value: checklistFormatted,
      inline: false,
    });
  }

  const descriptionText =
    task.description && task.description.trim()
      ? `**DETALII SARCINĂ:**\n\`\`\`text\n${task.description.slice(0, 1000)}\n\`\`\``
      : '*Nicio descriere suplimentară.*';

  const publicSiteUrl = process.env.PUBLIC_ORIGIN || 'https://wildfire.ro';
  const explicitAvatar = process.env.DISCORD_BOT_AVATAR_URL?.trim() || `${publicSiteUrl}/logo.png`;
  const mainAvatar =
    assignedMembers.find((m) => m.avatarUrl)?.avatarUrl ||
    (assignedMembers[0]?.githubUsername
      ? `https://github.com/${assignedMembers[0]?.githubUsername}.png`
      : null);

  const embed: any = {
    title: embedTitle,
    url: `${siteUrl}/admin/tasks`,
    description: descriptionText,
    color: embedColor,
    fields,
    author: {
      name: '🔥 WildFire Task Manager',
      url: `${siteUrl}/admin/tasks`,
      icon_url: explicitAvatar,
    },
    footer: {
      text: `WildFire Docs v${CURRENT_VERSION} • Click pe titlu pentru a deschide panoul`,
    },
    timestamp: new Date().toISOString(),
  };

  if (mainAvatar) {
    embed.thumbnail = { url: mainAvatar };
  }

  try {
    const payload: any = {
      username: 'WF-DOCSCORE Task Hub',
      content: contentString,
      embeds: [embed],
      allowed_mentions: {
        parse: ['users'],
      },
    };

    if (explicitAvatar) {
      payload.avatar_url = explicitAvatar;
    }

    // Dacă e un webhook trimis către un canal de tip Forum și vrem să creeze o postare nouă,
    // adăugăm parametrul thread_name și tag-urile asociate
    if (action === 'created' || action === 'urgent') {
      const mainAssignee =
        task.assignees && task.assignees[0] ? task.assignees[0] : task.assignedBy || 'Admin';
      payload.thread_name = `[${priorityInfo.label}] [${mainAssignee}] ${task.title}`.slice(0, 100);

      const appliedTags: string[] = [];
      const tags = DISCORD_FORUM_TAGS as any;
      if (task.status && tags.status && tags.status[task.status])
        appliedTags.push(tags.status[task.status]);
      if (task.priority && tags.priority && tags.priority[task.priority])
        appliedTags.push(tags.priority[task.priority]);
      if (task.category && tags.category && tags.category[task.category])
        appliedTags.push(tags.category[task.category]);

      if (task.assignees && task.assignees.length > 0 && tags.team) {
        task.assignees.forEach((assignee) => {
          if (tags.team[assignee]) {
            appliedTags.push(tags.team[assignee]);
          }
        });
      }

      // Discord max is 5 tags applied per thread
      if (appliedTags.length > 0) {
        payload.applied_tags = appliedTags.slice(0, 5);
      }
    }

    let urlWithWait = webhookUrl.includes('?')
      ? `${webhookUrl}&wait=true`
      : `${webhookUrl}?wait=true`;
    if (
      (action === 'completed' ||
        action === 'updated' ||
        action === 'deleted' ||
        action === 'archived') &&
      task.discordThreadId
    ) {
      urlWithWait += `&thread_id=${task.discordThreadId}`;
    }

    const res = await fetch(urlWithWait, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.error(`[Discord Task Webhook] Error response (${res.status}):`, errText);
      return {
        success: false,
        pingsCount: discordPings.length,
        error: `HTTP ${res.status}: ${errText}`,
      };
    }

    let threadId: string | undefined;
    try {
      const data = await res.json();
      if (data && data.channel_id) {
        threadId = data.channel_id;
      }
    } catch (e) {
      // Ignorăm erorile de parsare JSON, poate nu a returnat nimic util
    }

    return { success: true, pingsCount: discordPings.length, threadId };
  } catch (err: any) {
    console.error('[Discord Task Webhook] Dispatch network error:', err);
    return { success: false, pingsCount: 0, error: err.message };
  }
}

/**
 * Dispatches an instant, rich Discord webhook notification when a team member adds a comment / chat note.
 * Pings the assigned admin(s) and task creator with their Discord Snowflake ID (<@DISCORD_ID>).
 */
export async function sendDiscordTaskCommentNotification(
  task: AdminTask,
  comment: { author: string; text: string; avatarUrl?: string },
): Promise<{ success: boolean; pingsCount: number; error?: string }> {
  const webhookUrl = resolveWebhookUrl();

  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    return { success: false, pingsCount: 0, error: 'No webhook URL configured' };
  }

  const siteUrl = process.env.PUBLIC_ORIGIN || 'http://localhost:3000';
  const members = await getPublicTeamMembers();

  // 1. Extract @mentions from comment text (e.g. @Yakuza, @V1ccX, @iannC69)
  const textMentions = (comment.text.match(/@([a-zA-Z0-9_-]+)/g) || []).map((m) =>
    m.replace('@', '').trim(),
  );

  // 2. Resolve recipients: assignees + creator + explicitly tagged members, excluding comment author
  const recipientUsernames = Array.from(
    new Set([...(task.assignees || []), task.assignedBy, ...textMentions]),
  ).filter((u) => u && u.toLowerCase() !== comment.author.toLowerCase());

  const recipientMembers = recipientUsernames.map((username) => {
    const found = members.find(
      (m) =>
        m.username.toLowerCase() === username.toLowerCase() ||
        m.displayName.toLowerCase() === username.toLowerCase(),
    );
    return {
      username,
      displayName: found?.displayName || username,
      discordId: found?.discord && /^\d+$/.test(found.discord.trim()) ? found.discord.trim() : null,
      avatarUrl: found?.avatarUrl || null,
      githubUsername: found?.githubUsername || null,
    };
  });

  const discordPings = recipientMembers.filter((m) => m.discordId).map((m) => `<@${m.discordId}>`);

  const authorMember = members.find(
    (m) =>
      m.username.toLowerCase() === comment.author.toLowerCase() ||
      m.displayName.toLowerCase() === comment.author.toLowerCase(),
  );

  const authorDiscordId =
    authorMember?.discord && /^\d+$/.test(authorMember.discord.trim())
      ? authorMember.discord.trim()
      : null;

  const authorTag = authorDiscordId ? `<@${authorDiscordId}>` : `**@${comment.author}**`;

  const recipientTags = recipientMembers.map((m) =>
    m.discordId ? `<@${m.discordId}>` : `**@${m.displayName}**`,
  );
  const recipientTagsStr = recipientTags.length > 0 ? recipientTags.join(', ') : '_Toată echipa_';

  const pingsHeader = discordPings.join(' ');

  const contentString =
    discordPings.length > 0
      ? `**UPDATE** ${pingsHeader} — ${authorTag} a trimis o nota noua pentru **"${task.title}"**.`
      : `**UPDATE** ${authorTag} a trimis un comentariu pentru **"${task.title}"**.`;

  const defaultAvatar =
    process.env.DISCORD_BOT_AVATAR_URL && process.env.DISCORD_BOT_AVATAR_URL.startsWith('http')
      ? process.env.DISCORD_BOT_AVATAR_URL
      : siteUrl && siteUrl.startsWith('https://')
        ? `${siteUrl.replace(/\/$/, '')}/logo.png`
        : 'https://github.com/iannC69.png';

  const authorAvatar =
    comment.avatarUrl ||
    authorMember?.avatarUrl ||
    (authorMember?.githubUsername
      ? `https://github.com/${authorMember.githubUsername}.png`
      : null) ||
    defaultAvatar;

  const embed = {
    title: `[ COMENTARIU NOU ] ${task.title}`,
    url: `${siteUrl}/admin/tasks`,
    description: `>>> **NOTA DE LA ${authorTag}**\n\n${comment.text.slice(0, 1000)}`,
    color: 0xa855f7, // Purple Accent
    fields: [
      {
        name: 'DESTINATARI',
        value: recipientTagsStr,
        inline: true,
      },
      {
        name: 'ACTIUNI',
        value: `[ Deschide Panoul Admin & Raspunde ](${siteUrl}/admin/tasks)`,
        inline: false,
      },
    ],
    thumbnail: {
      url: authorAvatar,
    },
    author: {
      name: `WF-DOCSCORE • @${comment.author}`,
      url: `${siteUrl}/admin/tasks`,
      icon_url: authorAvatar,
    },
    footer: {
      text: `WildFire Docs v${CURRENT_VERSION} • Task Discussion Thread`,
    },
    timestamp: new Date().toISOString(),
  };

  try {
    let urlWithWait = webhookUrl.includes('?')
      ? `${webhookUrl}&wait=true`
      : `${webhookUrl}?wait=true`;
    if (task.discordThreadId) {
      urlWithWait += `&thread_id=${task.discordThreadId}`;
    }

    const res = await fetch(urlWithWait, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: `WF-DOCSCORE (@${comment.author})`,
        avatar_url: authorAvatar,
        content: contentString,
        embeds: [embed],
        allowed_mentions: {
          parse: ['users'],
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.error(`[Discord Task Comment Webhook] Error (${res.status}):`, errText);
      return {
        success: false,
        pingsCount: discordPings.length,
        error: `HTTP ${res.status}: ${errText}`,
      };
    }

    return { success: true, pingsCount: discordPings.length };
  } catch (err: any) {
    console.error('[Discord Task Comment Webhook] Network error:', err);
    return { success: false, pingsCount: 0, error: err.message };
  }
}
