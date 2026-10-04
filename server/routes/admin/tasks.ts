import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { getAuthenticatedAdminSession } from '@server/lib/security/auth';
import { getPublicTeamMembers, findTeamMemberByUsername } from '@server/lib/security/teamStore';
import {
  createAdminTask,
  getAllAdminTasks,
  updateAdminTask,
  deleteAdminTask,
  toggleAdminTaskSubtask,
  addAdminTaskComment,
  localCreateNotification,
  AdminTask,
  TaskStats,
  getAdminTaskById,
} from '@server/lib/db';

import { getNavigation } from '@server/lib/navigation';

import {
  sendDiscordTaskNotification,
  sendDiscordTaskCommentNotification,
} from '@server/lib/notifications/discordTaskWebhook';
import { updateDiscordThreadTags } from '@server/lib/notifications/discordBotApi';

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  const session = await getAuthenticatedAdminSession();
  if (!session) {
    return jsonReply(expressResponse, { error: 'Unauthorized' }, { status: 401 });
  }

  if (!session.isRoot && !session.permissions?.canManageTasks) {
    return jsonReply(
      expressResponse,
      { error: 'FORBIDDEN', message: 'Acces Refuzat: Nu ai permisiunea canManageTasks.' },
      { status: 403 },
    );
  }

  try {
    const tasks = await getAllAdminTasks();
    const members = await getPublicTeamMembers();

    // Extract available docs list for autocomplete
    const nav = await getNavigation().catch(() => []);
    const docSlugs: { slug: string; title: string }[] = [];

    function extractSlugs(items: any[]) {
      for (const item of items) {
        if (item.slug) {
          docSlugs.push({ slug: item.slug, title: item.title || item.slug });
        }
        if (item.items) extractSlugs(item.items);
        if (item.children) extractSlugs(item.children);
      }
    }
    extractSlugs(nav);

    // Compute task stats
    const total = tasks.length;
    const todo = tasks.filter((t) => t.status === 'todo').length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const inReview = tasks.filter((t) => t.status === 'in_review').length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const urgentCount = tasks.filter(
      (t) => t.priority === 'urgent' && t.status !== 'completed',
    ).length;

    const nowStr = new Date().toISOString().slice(0, 10);
    const dueSoonCount = tasks.filter(
      (t) => t.dueDate && t.dueDate <= nowStr && t.status !== 'completed',
    ).length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const stats: TaskStats = {
      total,
      todo,
      inProgress,
      inReview,
      completed,
      urgentCount,
      dueSoonCount,
      completionRate,
    };

    return jsonReply(expressResponse, {
      tasks,
      members,
      docSlugs,
      stats,
      currentUser: session.username,
    });
  } catch (err: any) {
    console.error('[API Admin Tasks GET] Error:', err);
    return jsonReply(expressResponse, { error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  const session = await getAuthenticatedAdminSession();
  if (!session) {
    return jsonReply(expressResponse, { error: 'Unauthorized' }, { status: 401 });
  }

  if (!session.isRoot && !session.permissions?.canManageTasks) {
    return jsonReply(
      expressResponse,
      { error: 'FORBIDDEN', message: 'Acces Refuzat: Nu ai permisiunea canManageTasks.' },
      { status: 403 },
    );
  }

  try {
    const body = req.body;

    // ── Test Discord Webhook Ping Action ──
    if (body.action === 'test_discord_ping') {
      const targetUser = body.username || session.username;
      const testTask: AdminTask = {
        id: 'task_test_ping',
        title: 'Test Conexiune Discord Webhook & Ping',
        description: `Notificare de test trimisă de @${session.username} pentru a verifica ping-ul direct pe Discord ID-ul membrului @${targetUser}.`,
        status: 'todo',
        priority: 'high',
        category: 'system',
        assignees: [targetUser],
        assignedBy: session.username || 'Admin',
        subtasks: [],
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const result = await sendDiscordTaskNotification(testTask, 'assigned');
      return jsonReply(expressResponse, result);
    }

    // ── Handle Add Comment in POST or PATCH ──
    if (body.action === 'add_comment' && body.id && body.comment) {
      const member = await findTeamMemberByUsername(session.username);
      const updated = await addAdminTaskComment(body.id, {
        author: session.username || 'Admin',
        avatarUrl: member?.avatarUrl,
        text: body.comment,
      });

      if (updated) {
        // Find all recipients (assignees + creator + text mentions, excluding comment author)
        const textMentions = (body.comment.match(/@([a-zA-Z0-9_-]+)/g) || []).map((m: string) =>
          m.replace('@', '').trim(),
        );

        const recipientUsernames = Array.from(
          new Set([...(updated.assignees || []), updated.assignedBy, ...textMentions]),
        ).filter((u) => u && u.toLowerCase() !== session.username.toLowerCase());

        if (recipientUsernames.length > 0) {
          for (const recipient of recipientUsernames) {
            localCreateNotification({
              targetUser: recipient,
              isGlobal: false,
              title: `💬 Notă Nouă pe Sarcină: ${updated.title}`,
              message: `@${session.username}: "${body.comment.slice(0, 120)}${body.comment.length > 120 ? '...' : ''}"`,
              category: 'task',
              severity: 'info',
              link: '/admin/tasks',
              metadata: { taskId: updated.id },
            });
          }
        }

        // Dispatch Discord Webhook Notification with direct mentions to assigned admin(s)
        sendDiscordTaskCommentNotification(updated, {
          author: session.username || 'Admin',
          text: body.comment,
          avatarUrl: member?.avatarUrl,
        }).catch((err) => {
          console.error('[Discord Task Comment POST] Webhook error:', err);
        });
      }

      return jsonReply(expressResponse, { success: Boolean(updated), task: updated });
    }

    // ── Handle Toggle Subtask in POST or PATCH ──
    if (body.action === 'toggle_subtask' && body.id && body.subtaskId) {
      const updated = await toggleAdminTaskSubtask(body.id, body.subtaskId);
      return jsonReply(expressResponse, { success: Boolean(updated), task: updated });
    }

    const { title, description, priority, category, assignees, targetDoc, dueDate, subtasks } =
      body;

    if (!title || !title.trim()) {
      return jsonReply(
        expressResponse,
        { error: 'Titlul sarcinii este obligatoriu' },
        { status: 400 },
      );
    }

    const task = await createAdminTask({
      title: title.trim(),
      description: (description || '').trim(),
      status: 'todo',
      priority: priority || 'medium',
      category: category || 'docs_update',
      assignees: Array.isArray(assignees) ? assignees : assignees ? [assignees] : [],
      assignedBy: session.username || 'Admin',
      targetDoc: targetDoc ? targetDoc.trim().replace(/^\/+|\/+$/g, '') : undefined,
      dueDate: dueDate || undefined,
      subtasks: Array.isArray(subtasks) ? subtasks : [],
      comments: [],
    });

    // Notify Discord with direct user ping (<@DISCORD_ID>)
    const discordRes = await sendDiscordTaskNotification(
      task,
      task.priority === 'urgent' ? 'urgent' : 'created',
    ).catch((err) => {
      console.error('[Discord Webhook POST] Dispatch failed:', err);
      return { threadId: undefined };
    });

    if (discordRes && discordRes.threadId) {
      task.discordThreadId = discordRes.threadId;
      await updateAdminTask(task.id, { discordThreadId: discordRes.threadId });
    }

    // Create targeted personal notifications for all assignees
    if (task.assignees && task.assignees.length > 0) {
      for (const assignee of task.assignees) {
        localCreateNotification({
          targetUser: assignee,
          isGlobal: false,
          title: `📋 Sarcină Nouă Asignată: ${task.title}`,
          message: `Ai fost asignat de @${session.username} la sarcina din categoria ${task.category.toUpperCase()}.`,
          category: 'task',
          severity: task.priority === 'urgent' ? 'urgent' : 'info',
          link: '/admin/tasks',
          metadata: { taskId: task.id, priority: task.priority },
        });
      }
    }

    // If urgent, emit a global alert for the entire team
    if (task.priority === 'urgent') {
      localCreateNotification({
        isGlobal: true,
        title: `🚨 [URGENT] ${task.title}`,
        message: `Creată de @${session.username} · Necesită atenție prioritară imediată.`,
        category: 'task',
        severity: 'urgent',
        link: '/admin/tasks',
        metadata: { taskId: task.id },
      });
    }

    return jsonReply(expressResponse, { success: true, task });
  } catch (err: any) {
    console.error('[API Admin Tasks POST] Error:', err);
    return jsonReply(expressResponse, { error: 'Failed to create task' }, { status: 500 });
  }
}

export async function PATCH(req: ExpressRequest, expressResponse: ExpressResponse) {
  const session = await getAuthenticatedAdminSession();
  if (!session) {
    return jsonReply(expressResponse, { error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = req.body;
    const { id, action, updates, subtaskId, comment } = body;

    if (!id) {
      return jsonReply(
        expressResponse,
        { error: 'ID-ul sarcinii este obligatoriu' },
        { status: 400 },
      );
    }

    // Subtask Toggle
    if (action === 'toggle_subtask' && subtaskId) {
      const updated = await toggleAdminTaskSubtask(id, subtaskId);

      if (updated) {
        const recipientUsernames = Array.from(
          new Set([...(updated.assignees || []), updated.assignedBy]),
        ).filter((u) => u && u.toLowerCase() !== session.username.toLowerCase());

        for (const recipient of recipientUsernames) {
          localCreateNotification({
            targetUser: recipient,
            isGlobal: false,
            title: `☑️ Progres Checklist: ${updated.title}`,
            message: `@${session.username} a actualizat o sub-sarcină pe "${updated.title}".`,
            category: 'task',
            severity: 'info',
            link: '/admin/tasks',
            metadata: { taskId: updated.id },
          });
        }

        // Notify Discord thread about the checklist update
        sendDiscordTaskNotification(
          updated,
          'updated',
          `**@${session.username}** a actualizat un sub-task (checklist).`,
        ).catch(() => {});
      }

      return jsonReply(expressResponse, { success: Boolean(updated), task: updated });
    }

    // Add Comment
    if (action === 'add_comment' && comment) {
      const member = await findTeamMemberByUsername(session.username);
      const updated = await addAdminTaskComment(id, {
        author: session.username || 'Admin',
        avatarUrl: member?.avatarUrl,
        text: comment,
      });

      if (updated) {
        // Find all recipients (assignees + creator + text mentions, excluding comment author)
        const textMentions = (comment.match(/@([a-zA-Z0-9_-]+)/g) || []).map((m: string) =>
          m.replace('@', '').trim(),
        );

        const recipientUsernames = Array.from(
          new Set([...(updated.assignees || []), updated.assignedBy, ...textMentions]),
        ).filter((u) => u && u.toLowerCase() !== session.username.toLowerCase());

        if (recipientUsernames.length > 0) {
          for (const recipient of recipientUsernames) {
            localCreateNotification({
              targetUser: recipient,
              isGlobal: false,
              title: `💬 Notă Nouă pe Sarcină: ${updated.title}`,
              message: `@${session.username}: "${comment.slice(0, 120)}${comment.length > 120 ? '...' : ''}"`,
              category: 'task',
              severity: 'info',
              link: '/admin/tasks',
              metadata: { taskId: updated.id },
            });
          }
        } else {
          localCreateNotification({
            isGlobal: true,
            title: `💬 Notă Nouă pe Sarcină: ${updated.title}`,
            message: `@${session.username}: "${comment.slice(0, 120)}${comment.length > 120 ? '...' : ''}"`,
            category: 'task',
            severity: 'info',
            link: '/admin/tasks',
            metadata: { taskId: updated.id },
          });
        }

        // Dispatch Discord Webhook Notification with direct mentions to assigned admin(s)
        sendDiscordTaskCommentNotification(updated, {
          author: session.username || 'Admin',
          text: comment,
          avatarUrl: member?.avatarUrl,
        }).catch((err) => {
          console.error('[Discord Task Comment PATCH] Webhook error:', err);
        });
      }

      return jsonReply(expressResponse, { success: Boolean(updated), task: updated });
    }

    // General update (status, priority, assignees, subtasks, etc.)
    const updated = await updateAdminTask(id, updates || {});
    if (!updated) {
      return jsonReply(expressResponse, { error: 'Sarcina nu a fost găsită' }, { status: 404 });
    }

    // Notify Discord & Team if status became completed
    if (updates?.status === 'completed') {
      sendDiscordTaskNotification(updated, 'completed').catch(() => {});
      if (updated.discordThreadId) {
        updateDiscordThreadTags(updated.discordThreadId, updated, false).catch(() => {});
      }
      const recipientUsernames = Array.from(
        new Set([...(updated.assignees || []), updated.assignedBy]),
      ).filter((u) => u && u.toLowerCase() !== session.username.toLowerCase());

      for (const recipient of recipientUsernames) {
        localCreateNotification({
          targetUser: recipient,
          isGlobal: false,
          title: `Sarcină Finalizată: ${updated.title}`,
          message: `Sarcina a fost marcată ca finalizată de @${session.username}.`,
          category: 'task',
          severity: 'success',
          link: '/admin/tasks',
          metadata: { taskId: updated.id },
        });
      }
    } else if (Object.keys(updates || {}).length > 0) {
      let changes: string[] = [];
      if (updates?.status) changes.push(`Status: **${updates.status.toUpperCase()}**`);
      if (updates?.priority) changes.push(`Prioritate: **${updates.priority.toUpperCase()}**`);
      if (updates?.category) changes.push(`Categorie: **${updates.category.toUpperCase()}**`);
      if (updates?.assignees) changes.push(`Responsabili actualizati`);
      if (updates?.title) changes.push(`Titlu modificat`);
      if (updates?.description) changes.push(`Descriere modificata`);
      if (updates?.targetDoc) changes.push(`Target Doc actualizat`);
      if (updates?.dueDate) changes.push(`Deadline: **${updates.dueDate}**`);

      let contextStr = `**@${session.username}** a actualizat sarcina.`;
      let actionType: any = 'updated';
      let shouldSendWebhook = true;

      if (updates?.archived !== undefined) {
        if (updates.archived) {
          actionType = 'archived';
          contextStr = `**@${session.username}** a arhivat sarcina.`;
        } else {
          contextStr = `**@${session.username}** a dezarhivat sarcina.`;
          changes.push(`Dezarhivat`);
        }
      } else if (changes.length > 0) {
        contextStr = `**@${session.username}** a modificat: ${changes.join(', ')}.`;
      }

      if (
        shouldSendWebhook &&
        (changes.length > 0 || actionType === 'archived' || updates?.archived === false)
      ) {
        sendDiscordTaskNotification(updated, actionType, contextStr).catch(() => {});
      }

      if (updated.discordThreadId) {
        updateDiscordThreadTags(updated.discordThreadId, updated, Boolean(updates?.archived)).catch(
          () => {},
        );
      }

      if (updates?.status && updates.status !== 'todo') {
        const recipientUsernames = Array.from(
          new Set([...(updated.assignees || []), updated.assignedBy]),
        ).filter((u) => u && u.toLowerCase() !== session.username.toLowerCase());

        for (const recipient of recipientUsernames) {
          localCreateNotification({
            targetUser: recipient,
            isGlobal: false,
            title: `⚡ Status Actualizat: ${updated.title}`,
            message: `@${session.username} a mutat sarcina în starea ${updated.status.toUpperCase()}.`,
            category: 'task',
            severity: 'info',
            link: '/admin/tasks',
            metadata: { taskId: updated.id },
          });
        }
      }
    }

    return jsonReply(expressResponse, { success: true, task: updated });
  } catch (err: any) {
    console.error('[API Admin Tasks PATCH] Error:', err);
    return jsonReply(expressResponse, { error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(req: ExpressRequest, expressResponse: ExpressResponse) {
  const session = await getAuthenticatedAdminSession();
  if (!session) {
    return jsonReply(expressResponse, { error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.originalUrl, 'http://localhost');
  const id = searchParams.get('id');

  if (!id) {
    return jsonReply(expressResponse, { error: 'ID is required' }, { status: 400 });
  }

  try {
    const task = await getAdminTaskById(id);
    if (!task) {
      return jsonReply(expressResponse, { error: 'Task not found' }, { status: 404 });
    }

    const success = await deleteAdminTask(id);
    if (!success) {
      return jsonReply(expressResponse, { error: 'Task not found' }, { status: 404 });
    }

    sendDiscordTaskNotification(
      task,
      'deleted',
      `**@${session.username}** a șters această sarcină.`,
    ).catch(() => {});

    return jsonReply(expressResponse, { success: true });
  } catch (err: any) {
    console.error('[API Admin Tasks DELETE] Error:', err);
    return jsonReply(expressResponse, { error: 'Failed to delete task' }, { status: 500 });
  }
}
