import { AdminTask } from '@server/lib/db';
import { DISCORD_FORUM_TAGS, PRIORITY_META } from './discordTaskWebhook';

/**
 * Updates a Discord Forum Thread's applied tags and archived state.
 * This uses the bot token (DISCORD_BOT_TOKEN) rather than a webhook URL,
 * because webhooks cannot edit thread metadata.
 */
export async function updateDiscordThreadTags(
  threadId: string,
  task: AdminTask,
  isArchived: boolean = false,
): Promise<{ success: boolean; error?: string }> {
  const token = process.env.DISCORD_BOT_TOKEN;

  if (!token) {
    console.log('[Discord Bot API] No DISCORD_BOT_TOKEN configured.');
    return { success: false, error: 'No Bot Token configured' };
  }

  // Determine the new tags based on the task's state
  const appliedTags: string[] = [];
  if (task.status && DISCORD_FORUM_TAGS.status[task.status])
    appliedTags.push(DISCORD_FORUM_TAGS.status[task.status]);
  if (task.priority && DISCORD_FORUM_TAGS.priority[task.priority])
    appliedTags.push(DISCORD_FORUM_TAGS.priority[task.priority]);
  if (task.category && DISCORD_FORUM_TAGS.category[task.category])
    appliedTags.push(DISCORD_FORUM_TAGS.category[task.category]);

  const assigner =
    task.assignees && task.assignees[0] ? task.assignees[0] : task.assignedBy || 'Admin';
  const priorityInfo = PRIORITY_META[task.priority || 'medium'] || { label: 'MEDIUM' };
  const newName = `[${priorityInfo.label}] [${assigner}] ${task.title}`.slice(0, 100);

  const payload: any = {
    applied_tags: appliedTags,
    name: newName,
  };

  // If we are archiving it, also lock and archive the thread
  if (isArchived === true) {
    payload.archived = true;
    payload.locked = true;
  } else if (isArchived === false) {
    payload.archived = false;
    payload.locked = false;
  }

  try {
    const res = await fetch(`https://discord.com/api/v10/channels/${threadId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bot ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.error(
        `[Discord Bot API] Failed to update thread ${threadId} (${res.status}):`,
        errText,
      );
      return { success: false, error: `HTTP ${res.status}: ${errText}` };
    }

    return { success: true };
  } catch (err: any) {
    console.error('[Discord Bot API] Network error when updating thread:', err);
    return { success: false, error: err.message };
  }
}
