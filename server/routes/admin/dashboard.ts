import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply } from '@server/http';
import {
  validateSessionToken,
  SESSION_COOKIE_NAME,
  getActiveSessions,
  isPanicLockdown,
} from '@server/lib/security/auth';
import { getAuditEvents, verifyAuditChainIntegrity } from '@server/lib/security/audit';
import { getMaintenanceState } from '@server/lib/security/maintenance';
import { getSearchAnalytics } from '@server/lib/security/searchAnalytics';
import { listApiKeys } from '@server/lib/security/apiKeys';
import { CURRENT_VERSION } from '@server/lib/version';
import { findTeamMemberByUsername, loadTeamMembers } from '@server/lib/security/teamStore';
import { scanMediaLibrary } from '@server/lib/admin/mediaScanner';
import { getRealDocsCount } from '@server/lib/admin/realTelemetry';
import { RUNTIME_ROOT } from '@server/storage/paths';
import fs from 'fs';
import path from 'path';

function getDocAnalytics() {
  try {
    const p = path.join(RUNTIME_ROOT, 'data', 'doc_analytics.json');
    if (!fs.existsSync(p))
      return {
        totalViews: 0,
        todayViews: 0,
        topDocs: [],
        docCount: 0,
        helpful: 0,
        unhelpful: 0,
        satisfactionRate: 100,
        totalFeedbacks: 0,
      };
    const raw = JSON.parse(fs.readFileSync(p, 'utf-8'));
    const views = Object.values(raw.views || {}) as any[];
    const totalViews = views.reduce((s: number, v: any) => s + (v.total_views || 0), 0);
    const todayViews = views.reduce((s: number, v: any) => s + (v.today_views || 0), 0);
    const topDocs = [...views]
      .sort((a: any, b: any) => (b.today_views || 0) - (a.today_views || 0))
      .slice(0, 5)
      .map((v: any) => ({
        slug: v.slug,
        todayViews: v.today_views || 0,
        totalViews: v.total_views || 0,
        lastViewedAt: v.last_viewed_at,
      }));
    const feedbacks = raw.feedbacks || [];
    const helpful = feedbacks.filter((f: any) => f.rating === 'helpful').length;
    const unhelpful = feedbacks.filter((f: any) => f.rating === 'unhelpful').length;
    const satisfactionRate =
      helpful + unhelpful > 0 ? Math.round((helpful / (helpful + unhelpful)) * 100) : 100;
    return {
      totalViews,
      todayViews,
      topDocs,
      docCount: views.length,
      helpful,
      unhelpful,
      satisfactionRate,
      totalFeedbacks: feedbacks.length,
    };
  } catch {
    return {
      totalViews: 0,
      todayViews: 0,
      topDocs: [],
      docCount: 0,
      helpful: 0,
      unhelpful: 0,
      satisfactionRate: 100,
      totalFeedbacks: 0,
    };
  }
}

function getGeoStats() {
  try {
    const p = path.join(RUNTIME_ROOT, 'data', 'view-geo-stats.json');
    if (!fs.existsSync(p))
      return { countries: [], hourly: {}, daily: {}, peakHour: 0, totalGeoViews: 0 };
    const raw = JSON.parse(fs.readFileSync(p, 'utf-8'));
    const countries = Object.values(raw.countries || {}) as any[];
    const sorted = [...countries].sort((a: any, b: any) => b.views - a.views).slice(0, 6);
    const totalGeoViews = countries.reduce((s: number, c: any) => s + (c.views || 0), 0);
    return {
      countries: sorted,
      hourly: raw.hourly || {},
      daily: raw.daily || {},
      peakHour: raw.peakHour || 0,
      totalGeoViews,
    };
  } catch {
    return { countries: [], hourly: {}, daily: {}, peakHour: 0, totalGeoViews: 0 };
  }
}

function getDailyComparison(daily: Record<string, number>) {
  const days = Object.entries(daily).sort((a, b) => a[0].localeCompare(b[0]));
  const labeled = days.map(([date, views]) => {
    const d = new Date(date);
    const dayNames = ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm'];
    return {
      date,
      label: dayNames[d.getDay()],
      views,
      isToday: date === new Date().toISOString().split('T')[0],
    };
  });
  const max = Math.max(...labeled.map((d) => d.views), 1);
  return labeled.map((d) => ({ ...d, heightPercent: Math.round((d.views / max) * 100) }));
}

function getAiTelemetry() {
  try {
    const p = path.join(RUNTIME_ROOT, 'content', 'ai-telemetry.json');
    if (!fs.existsSync(p))
      return {
        lifetimeQueries: 0,
        totalCostUsd: 0,
        totalTokens: 0,
        recentLogs: [],
        successRate: 100,
        avgLatency: 0,
      };
    const raw = JSON.parse(fs.readFileSync(p, 'utf-8'));
    const logs: any[] = raw.logs || [];
    const successLogs = logs.filter((l: any) => l.status === 'success');
    const avgLatency =
      successLogs.length > 0
        ? Math.round(
            successLogs.reduce((s: number, l: any) => s + l.latencyMs, 0) / successLogs.length,
          )
        : 0;
    const successRate =
      logs.length > 0
        ? Math.round(
            (successLogs.length / logs.filter((l: any) => l.status !== 'rate_limited').length) *
              100,
          )
        : 100;
    return {
      lifetimeQueries: raw.lifetimeQueries || 0,
      totalCostUsd: raw.totalCostUsd || 0,
      totalTokens: (raw.totalPromptTokens || 0) + (raw.totalCandidatesTokens || 0),
      recentLogs: logs.slice(0, 5),
      successRate: isNaN(successRate) ? 100 : Math.min(100, successRate),
      avgLatency,
    };
  } catch {
    return {
      lifetimeQueries: 0,
      totalCostUsd: 0,
      totalTokens: 0,
      recentLogs: [],
      successRate: 100,
      avgLatency: 0,
    };
  }
}

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;

  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const member = await findTeamMemberByUsername(session.username);
  const isRoot = Boolean(
    session.isRoot ||
      member?.isRoot ||
      session.username.toLowerCase() === 'iannc69' ||
      session.username.toLowerCase() === 'iannc',
  );
  const isLocked = isPanicLockdown();
  const maintenance = getMaintenanceState();
  const searchAnalytics = getSearchAnalytics();
  const apiKeys = listApiKeys();
  const totalDocs = getRealDocsCount().total;
  const activeSessions = getActiveSessions();
  const recentEvents = getAuditEvents(8);
  const chainIntegrity = verifyAuditChainIntegrity();
  const docAnalytics = getDocAnalytics();
  const aiTelemetry = getAiTelemetry();
  const allTeamMembers = loadTeamMembers();
  const mediaStats = scanMediaLibrary();
  const geoStats = getGeoStats();
  const dailyChart = getDailyComparison(geoStats.daily as Record<string, number>);

  const memoryUsage = process.memoryUsage();
  const heapUsedMb = Math.round(memoryUsage.heapUsed / 1024 / 1024);
  const heapTotalMb = Math.round(memoryUsage.heapTotal / 1024 / 1024);
  const rssMb = Math.round(memoryUsage.rss / 1024 / 1024);
  const heapPercent = Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100);

  const activeSessionCount = activeSessions.length;
  const uptimeSeconds = process.uptime();
  const uptimeHrs = Math.floor(uptimeSeconds / 3600);
  const uptimeMins = Math.floor((uptimeSeconds % 3600) / 60);

  const now = new Date();
  const greeting =
    now.getHours() < 12 ? 'Bună dimineața' : now.getHours() < 17 ? 'Bună ziua' : 'Bună seara';

  return jsonReply(expressResponse, {
    user: session,
    isRoot,
    isLocked,
    maintenance,
    searchAnalytics,
    apiKeysCount: apiKeys.length,
    totalDocs,
    activeSessionCount,
    recentEvents,
    chainIntegrity,
    docAnalytics,
    aiTelemetry,
    allTeamMembers,
    mediaStats,
    geoStats,
    dailyChart,
    memory: {
      heapUsedMb,
      heapTotalMb,
      rssMb,
      heapPercent,
    },
    uptime: {
      uptimeSeconds,
      uptimeHrs,
      uptimeMins,
    },
    greeting,
    version: CURRENT_VERSION,
  });
}
