import { DOCS_ROOT, PUBLIC_ROOT, RUNTIME_ROOT } from '@server/storage/paths';
import fs from 'fs';
import path from 'path';
import { getLocalDatabaseConfig } from '../db/localStore';
import { supabaseSaveSearchQuery } from '../db/supabase';

export interface SearchQueryLog {
  id: string;
  query: string;
  resultCount: number;
  latencyMs: number;
  timestamp: string;
  ip: string;
}

const SEARCH_LOGS_PATH = path.join(RUNTIME_ROOT, 'content', 'search-logs.json');

function loadSearchLogs(): SearchQueryLog[] {
  try {
    if (fs.existsSync(SEARCH_LOGS_PATH)) {
      const raw = fs.readFileSync(SEARCH_LOGS_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load search logs from disk', err);
  }
  return [];
}

function saveSearchLogs(logs: SearchQueryLog[]) {
  try {
    const dir = path.dirname(SEARCH_LOGS_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SEARCH_LOGS_PATH, JSON.stringify(logs.slice(0, 500), null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save search logs to disk', err);
  }
}

export function recordSearchQuery(params: {
  query: string;
  resultCount: number;
  latencyMs: number;
  ip?: string;
}): void {
  const logs = loadSearchLogs();
  const log: SearchQueryLog = {
    id: `srch_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    query: params.query.trim().toLowerCase(),
    resultCount: params.resultCount,
    latencyMs: Math.round(params.latencyMs * 10) / 10,
    timestamp: new Date().toISOString(),
    ip: params.ip || '127.0.0.1',
  };

  logs.unshift(log);
  saveSearchLogs(logs);

  const dbConfig = getLocalDatabaseConfig();
  if (dbConfig.provider === 'supabase' && dbConfig.supabaseUrl && dbConfig.supabaseAnonKey) {
    supabaseSaveSearchQuery(
      { url: dbConfig.supabaseUrl, anonKey: dbConfig.supabaseAnonKey },
      log,
    ).catch(() => {});
  }
}

export function clearSearchLogs(): void {
  saveSearchLogs([]);
}

export function getSearchAnalytics() {
  const logs = loadSearchLogs();
  const totalSearches = logs.length;
  const missedSearches = logs.filter((l) => l.resultCount === 0);
  const avgLatency =
    totalSearches > 0
      ? (logs.reduce((acc, l) => acc + l.latencyMs, 0) / totalSearches).toFixed(1)
      : '0.0';

  // Compute top queries
  const queryCounts = new Map<string, { count: number; lastResultCount: number }>();
  for (const log of logs) {
    const existing = queryCounts.get(log.query) || { count: 0, lastResultCount: log.resultCount };
    existing.count += 1;
    existing.lastResultCount = log.resultCount;
    queryCounts.set(log.query, existing);
  }

  const topQueries = Array.from(queryCounts.entries())
    .map(([query, data]) => ({ query, count: data.count, resultCount: data.lastResultCount }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalSearches,
    missedCount: missedSearches.length,
    missedRate: totalSearches > 0 ? Math.round((missedSearches.length / totalSearches) * 100) : 0,
    avgLatencyMs: avgLatency,
    topQueries,
    recentLogs: logs.slice(0, 30),
    missedLogs: missedSearches.slice(0, 20),
  };
}
