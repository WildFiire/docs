import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { DocViewRecord, DocFeedbackRecord, FeedbackStats } from './types';

interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceKey?: string;
}

const clientCache = new Map<string, SupabaseClient>();

function getClient(url: string, anonKey: string, serviceKey?: string): SupabaseClient {
  const activeKey = serviceKey || anonKey;
  const cacheKey = `${url}__${activeKey}`;
  let client = clientCache.get(cacheKey);
  if (!client) {
    client = createClient(url, activeKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    clientCache.set(cacheKey, client);
  }
  return client;
}

/**
 * Test connectivity with Supabase by performing a ping query
 */
export async function testSupabaseConnection(
  url: string,
  anonKey: string,
): Promise<{ success: boolean; message: string; latencyMs?: number }> {
  if (!url || !anonKey) {
    return { success: false, message: 'URL-ul sau Cheia Anon sunt goale.' };
  }

  const startTime = Date.now();
  try {
    const supabase = getClient(url, anonKey);
    const { error, status } = await supabase.from('doc_views').select('slug').limit(1);

    const latencyMs = Date.now() - startTime;

    if (!error || status === 200) {
      return {
        success: true,
        message: `Conexiune Supabase activă! (Latență: ${latencyMs}ms)`,
        latencyMs,
      };
    }

    if (
      error.code === 'PGRST204' ||
      error.code === 'PGRST116' ||
      error.message.includes('does not exist') ||
      error.message.includes('not found')
    ) {
      return {
        success: true,
        message: `Conexiune stabilită (${latencyMs}ms), dar tabelele lipsesc. Rulează scriptul SQL din butonul 'Copiază SQL' în Supabase.`,
        latencyMs,
      };
    }

    if (error.code === '401' || error.message.includes('JWT') || error.message.includes('apikey')) {
      return {
        success: false,
        message: 'Eroare de autentificare: Cheia Anon / Publishable Key este invalidă.',
      };
    }

    return {
      success: true,
      message: `Conectat la Supabase (${latencyMs}ms)`,
      latencyMs,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Eșec conectare Supabase: ${err.message || 'Timeout rețea'}`,
    };
  }
}

// ─── Remote Supabase Operations ───────────────────────────────────────────────

export async function supabaseIncrementDocView(
  config: SupabaseConfig,
  slug: string,
): Promise<DocViewRecord | null> {
  const normalizedSlug = slug.replace(/^\/+|\/+$/g, '');
  const now = new Date().toISOString();

  try {
    const supabase = getClient(config.url, config.anonKey, config.serviceKey);

    // 1. Fetch current views
    const { data, error } = await supabase
      .from('doc_views')
      .select('total_views, today_views')
      .eq('slug', normalizedSlug)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.warn('[Supabase] Query doc_views error:', error.message);
    }

    if (data) {
      const updatedTotal = (data.total_views || 0) + 1;
      const updatedToday = (data.today_views || 0) + 1;

      const { error: updateErr } = await supabase
        .from('doc_views')
        .update({
          total_views: updatedTotal,
          today_views: updatedToday,
          last_viewed_at: now,
        })
        .eq('slug', normalizedSlug);

      if (!updateErr) {
        return {
          slug: normalizedSlug,
          total_views: updatedTotal,
          today_views: updatedToday,
          last_viewed_at: now,
        };
      }
    } else {
      const { error: insertErr } = await supabase.from('doc_views').insert({
        slug: normalizedSlug,
        total_views: 1,
        today_views: 1,
        last_viewed_at: now,
      });

      if (!insertErr) {
        return {
          slug: normalizedSlug,
          total_views: 1,
          today_views: 1,
          last_viewed_at: now,
        };
      }
    }
  } catch (err) {
    console.error('[Supabase] Error in incrementDocView', err);
  }

  return null;
}

export async function supabaseGetDocViews(
  config: SupabaseConfig,
  slug: string,
): Promise<DocViewRecord | null> {
  const normalizedSlug = slug.replace(/^\/+|\/+$/g, '');

  try {
    const supabase = getClient(config.url, config.anonKey, config.serviceKey);
    const { data, error } = await supabase
      .from('doc_views')
      .select('*')
      .eq('slug', normalizedSlug)
      .maybeSingle();

    if (!error && data) {
      return data as DocViewRecord;
    }
  } catch (err) {
    console.error('[Supabase] Error in getDocViews', err);
  }

  return null;
}

export async function supabaseGetAllDocViews(
  config: SupabaseConfig,
): Promise<DocViewRecord[] | null> {
  try {
    const supabase = getClient(config.url, config.anonKey, config.serviceKey);
    const { data, error } = await supabase
      .from('doc_views')
      .select('*')
      .order('total_views', { ascending: false });

    if (!error && data) {
      return data as DocViewRecord[];
    }
  } catch (err) {
    console.error('[Supabase] Error in getAllDocViews', err);
  }

  return null;
}

export async function supabaseSubmitFeedback(
  config: SupabaseConfig,
  slug: string,
  rating: 'helpful' | 'unhelpful',
  comment?: string,
  feedbackId?: string,
): Promise<DocFeedbackRecord | null> {
  const normalizedSlug = slug.replace(/^\/+|\/+$/g, '');
  const recordId = feedbackId || `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  try {
    const supabase = getClient(config.url, config.anonKey, config.serviceKey);
    const { error } = await supabase.from('doc_feedbacks').upsert({
      id: recordId,
      slug: normalizedSlug,
      rating,
      comment: comment ? comment.trim() : null,
      created_at: now,
    });

    if (!error) {
      return {
        id: recordId,
        slug: normalizedSlug,
        rating,
        comment: comment ? comment.trim() : undefined,
        created_at: now,
      };
    } else {
      console.warn('[Supabase] Error submitting feedback:', error.message);
    }
  } catch (err) {
    console.error('[Supabase] Error in submitFeedback', err);
  }

  return null;
}

export async function supabaseGetFeedbackStats(
  config: SupabaseConfig,
  slug: string,
): Promise<FeedbackStats | null> {
  const normalizedSlug = slug.replace(/^\/+|\/+$/g, '');

  try {
    const supabase = getClient(config.url, config.anonKey, config.serviceKey);
    const { data, error } = await supabase
      .from('doc_feedbacks')
      .select('rating')
      .eq('slug', normalizedSlug);

    if (!error && data) {
      const helpful = data.filter((d: any) => d.rating === 'helpful').length;
      const unhelpful = data.filter((d: any) => d.rating === 'unhelpful').length;
      const total = helpful + unhelpful;
      const percentage = total > 0 ? Math.round((helpful / total) * 100) : 100;
      return { helpful, unhelpful, total, percentage };
    }
  } catch (err) {
    console.error('[Supabase] Error in getFeedbackStats', err);
  }

  return null;
}

export async function supabaseGetAllFeedbacks(
  config: SupabaseConfig,
): Promise<DocFeedbackRecord[] | null> {
  try {
    const supabase = getClient(config.url, config.anonKey, config.serviceKey);
    const { data, error } = await supabase
      .from('doc_feedbacks')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data as DocFeedbackRecord[];
    }
  } catch (err) {
    console.error('[Supabase] Error in getAllFeedbacks', err);
  }

  return null;
}

export async function supabaseDeleteFeedback(config: SupabaseConfig, id: string): Promise<boolean> {
  try {
    const supabase = getClient(config.url, config.anonKey, config.serviceKey);
    const { error } = await supabase.from('doc_feedbacks').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.error('[Supabase] Error in deleteFeedback', err);
  }

  return false;
}

// ─── Team Members DB Sync ───────────────────────────────────────────────────

export async function supabaseGetTeamMembers(config: SupabaseConfig): Promise<any[] | null> {
  try {
    const supabase = getClient(config.url, config.anonKey, config.serviceKey);
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data) {
      return data.map((row: any) => ({
        id: row.id,
        username: row.username,
        displayName: row.display_name,
        email: row.email,
        role: row.role,
        customTitle: row.custom_title,
        avatarUrl: row.avatar_url,
        avatarColor: row.avatar_color,
        bio: row.bio,
        responsibilities: row.responsibilities || [],
        badges: row.badges || [],
        discord: row.discord,
        steamId: row.steam_id,
        githubUsername: row.github_username,
        docsModifiedCount: row.docs_modified_count || 0,
        passwordHash: row.password_hash,
        salt: row.salt,
        totpEnabled: Boolean(row.totp_enabled),
        totpSecret: row.totp_secret,
        permissions: row.permissions || {},
        status: row.status || 'active',
        isRoot: Boolean(row.is_root),
        createdAt: row.created_at,
        lastLoginAt: row.last_login_at,
      }));
    }
  } catch (err) {
    console.error('[Supabase] Error in getTeamMembers', err);
  }
  return null;
}

export async function supabaseSaveTeamMember(
  config: SupabaseConfig,
  member: any,
): Promise<boolean> {
  try {
    const supabase = getClient(config.url, config.anonKey, config.serviceKey);
    const row = {
      id: member.id,
      username: member.username,
      display_name: member.displayName,
      email: member.email || null,
      role: member.role,
      custom_title: member.customTitle || null,
      avatar_url: member.avatarUrl || null,
      avatar_color: member.avatarColor || '#ff6b00',
      bio: member.bio || null,
      responsibilities: member.responsibilities || [],
      badges: member.badges || [],
      discord: member.discord || null,
      steam_id: member.steamId || null,
      github_username: member.githubUsername || null,
      docs_modified_count: member.docsModifiedCount || 0,
      password_hash: member.passwordHash,
      salt: member.salt,
      totp_enabled: Boolean(member.totpEnabled),
      totp_secret: member.totpSecret || null,
      permissions: member.permissions || {},
      status: member.status || 'active',
      is_root: Boolean(member.isRoot),
      created_at: member.createdAt,
      last_login_at: member.lastLoginAt || null,
    };

    const { error } = await supabase.from('team_members').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('[Supabase] Failed to upsert team member:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Error in saveTeamMember', err);
    return false;
  }
}

export async function supabaseDeleteTeamMember(
  config: SupabaseConfig,
  id: string,
): Promise<boolean> {
  try {
    const supabase = getClient(config.url, config.anonKey, config.serviceKey);
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.error('[Supabase] Error in deleteTeamMember', err);
    return false;
  }
}

// ─── Player Reports Sync (doc_reports) ───────────────────────────────────────

export async function supabaseSaveReport(config: SupabaseConfig, report: any): Promise<boolean> {
  try {
    const supabase = getClient(config.url, config.anonKey, config.serviceKey);
    const row = {
      id: report.id,
      type: report.type || 'issue',
      slug: report.slug || null,
      title: report.title,
      description: report.description,
      author: report.author || 'Vizitator Anonim',
      status: report.status || 'open',
      created_at: report.createdAt || new Date().toISOString(),
      resolved_at: report.resolvedAt || null,
      resolved_by: report.resolvedBy || null,
    };

    const { error } = await supabase.from('doc_reports').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('[Supabase] Failed to upsert report:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Error in saveReport', err);
    return false;
  }
}

export async function supabaseDeleteReport(config: SupabaseConfig, id: string): Promise<boolean> {
  try {
    const supabase = getClient(config.url, config.anonKey, config.serviceKey);
    const { error } = await supabase.from('doc_reports').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.error('[Supabase] Error in deleteReport', err);
    return false;
  }
}

// ─── Admin Tasks Sync (admin_tasks) ──────────────────────────────────────────

export async function supabaseSaveTask(config: SupabaseConfig, task: any): Promise<boolean> {
  try {
    const supabase = getClient(config.url, config.anonKey, config.serviceKey);
    const assignedUser =
      task.assignedTo || (Array.isArray(task.assignees) && task.assignees[0]) || 'iannC69';
    const creatorUser = task.createdBy || task.assignedBy || 'iannC69';
    const row = {
      id: task.id,
      title: task.title,
      description: task.description || null,
      category: task.category || 'DOCS_UPDATE',
      priority: task.priority || 'medium',
      status: task.status || 'todo',
      assigned_to: assignedUser,
      created_by: creatorUser,
      target_doc: task.targetDoc || null,
      deadline: task.deadline || task.dueDate || null,
      subtasks: task.subtasks || [],
      comments: task.comments || [],
      archived: Boolean(task.archived),
      discord_thread_id: task.discordThreadId || null,
      created_at: task.createdAt || new Date().toISOString(),
      updated_at: task.updatedAt || new Date().toISOString(),
      completed_at: task.completedAt || null,
    };

    const { error } = await supabase.from('admin_tasks').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('[Supabase] Failed to upsert task:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Error in saveTask', err);
    return false;
  }
}

export async function supabaseDeleteTask(config: SupabaseConfig, id: string): Promise<boolean> {
  try {
    const supabase = getClient(config.url, config.anonKey, config.serviceKey);
    const { error } = await supabase.from('admin_tasks').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.error('[Supabase] Error in deleteTask', err);
    return false;
  }
}

export async function supabaseGetAllTasks(config: SupabaseConfig): Promise<any[] | null> {
  try {
    const supabase = getClient(config.url, config.anonKey, config.serviceKey);
    const { data, error } = await supabase
      .from('admin_tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data.map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description || '',
        category: row.category,
        priority: row.priority,
        status: row.status,
        assignees: row.assigned_to ? [row.assigned_to] : [],
        assignedBy: row.created_by,
        targetDoc: row.target_doc,
        dueDate: row.deadline,
        subtasks: row.subtasks || [],
        comments: row.comments || [],
        archived: Boolean(row.archived),
        discordThreadId: row.discord_thread_id,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        completedAt: row.completed_at,
      }));
    }
  } catch (err) {
    console.error('[Supabase] Error in getAllTasks', err);
  }
  return null;
}

// ─── Admin Notifications Sync (admin_notifications) ──────────────────────────

export async function supabaseSaveNotification(
  config: SupabaseConfig,
  notif: any,
): Promise<boolean> {
  try {
    const supabase = getClient(config.url, config.anonKey, config.serviceKey);
    const row = {
      id: notif.id,
      target_user: notif.targetUser || null,
      is_global: Boolean(notif.isGlobal),
      title: notif.title,
      message: notif.message,
      category: notif.category || 'system',
      severity: notif.severity || 'info',
      link: notif.link || null,
      read_by: notif.readBy || [],
      created_at: notif.createdAt || new Date().toISOString(),
      metadata: notif.metadata || {},
    };

    const { error } = await supabase.from('admin_notifications').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('[Supabase] Failed to upsert notification:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Error in saveNotification', err);
    return false;
  }
}

export async function supabaseDeleteNotification(
  config: SupabaseConfig,
  id: string,
): Promise<boolean> {
  try {
    const supabase = getClient(config.url, config.anonKey, config.serviceKey);
    const { error } = await supabase.from('admin_notifications').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.error('[Supabase] Error in deleteNotification', err);
    return false;
  }
}

// ─── Platform Settings Sync (platform_settings) ──────────────────────────────

export async function supabaseSavePlatformSettings(
  config: SupabaseConfig,
  settings: any,
): Promise<boolean> {
  try {
    const supabase = getClient(config.url, config.anonKey, config.serviceKey);
    const row = {
      id: 'global',
      settings: settings,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('platform_settings').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('[Supabase] Failed to upsert platform_settings:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Error in savePlatformSettings', err);
    return false;
  }
}

// ─── Audit Ledger Sync (audit_ledger) ────────────────────────────────────────

export async function supabaseSaveAuditEntry(config: SupabaseConfig, entry: any): Promise<boolean> {
  try {
    const supabase = getClient(config.url, config.anonKey, config.serviceKey);
    const row = {
      id: entry.id || `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      event_id: entry.eventId || entry.id || null,
      action: entry.action || 'UNKNOWN_ACTION',
      actor: entry.actor || 'System',
      ip: entry.ip || null,
      user_agent: entry.userAgent || null,
      details: entry.details || {},
      sha256_hash: entry.hash || entry.sha256_hash || null,
      previous_hash: entry.previousHash || entry.previous_hash || null,
      created_at: entry.timestamp || new Date().toISOString(),
    };
    const { error } = await supabase.from('audit_ledger').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('[Supabase] Failed to upsert audit_ledger:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Error in saveAuditEntry', err);
    return false;
  }
}

// ─── Search Telemetry Sync (search_telemetry) ────────────────────────────────

export async function supabaseSaveSearchQuery(
  config: SupabaseConfig,
  queryData: any,
): Promise<boolean> {
  try {
    const supabase = getClient(config.url, config.anonKey, config.serviceKey);
    const row = {
      id: queryData.id || `st_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      query: queryData.query || '',
      hits: queryData.hits || 1,
      results_count: queryData.resultsCount || 0,
      category: queryData.category || null,
      created_at: queryData.timestamp || new Date().toISOString(),
    };
    const { error } = await supabase.from('search_telemetry').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('[Supabase] Failed to upsert search_telemetry:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Error in saveSearchQuery', err);
    return false;
  }
}

// ─── Doc Versions Sync (doc_versions) ────────────────────────────────────────

export async function supabaseSaveDocVersion(
  config: SupabaseConfig,
  version: any,
): Promise<boolean> {
  try {
    const supabase = getClient(config.url, config.anonKey, config.serviceKey);
    const row = {
      id: version.id || `ver_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      slug: version.slug,
      version_number: version.versionNumber || version.version || 1,
      content: version.content || '',
      summary: version.summary || null,
      author: version.author || 'System',
      created_at: version.createdAt || new Date().toISOString(),
    };
    const { error } = await supabase.from('doc_versions').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('[Supabase] Failed to upsert doc_versions:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Error in saveDocVersion', err);
    return false;
  }
}

// ─── AI Telemetry Sync (ai_telemetry) ────────────────────────────────────────

export async function supabaseSaveAiLog(config: SupabaseConfig, log: any): Promise<boolean> {
  try {
    const supabase = getClient(config.url, config.anonKey, config.serviceKey);
    const row = {
      id: log.id,
      timestamp: log.timestamp,
      query_snippet: log.querySnippet,
      response_chars: log.responseChars,
      prompt_tokens: log.promptTokens,
      candidates_tokens: log.candidatesTokens,
      total_tokens: log.totalTokens,
      latency_ms: log.latencyMs,
      status: log.status,
      model: log.model,
      estimated_cost_usd: log.estimatedCostUsd,
      ip: log.ip,
      error_message: log.errorMessage,
      feedback: log.feedback,
      feedback_timestamp: log.feedbackTimestamp,
      feedback_reason: log.feedbackReason,
    };
    const { error } = await supabase.from('ai_telemetry').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('[Supabase] Failed to upsert ai_telemetry:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Error in saveAiLog', err);
    return false;
  }
}

export async function supabaseUpdateAiFeedback(
  config: SupabaseConfig,
  interactionId: string,
  feedbackData: {
    feedback: 'helpful' | 'unhelpful' | null;
    feedbackTimestamp?: string;
    feedbackReason?: string;
  },
): Promise<boolean> {
  try {
    const supabase = getClient(config.url, config.anonKey, config.serviceKey);
    const { error } = await supabase
      .from('ai_telemetry')
      .update({
        feedback: feedbackData.feedback,
        feedback_timestamp: feedbackData.feedbackTimestamp,
        feedback_reason: feedbackData.feedbackReason,
      })
      .eq('id', interactionId);
    if (error) {
      console.warn('[Supabase] Failed to update ai_telemetry feedback:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Error in updateAiFeedback', err);
    return false;
  }
}
