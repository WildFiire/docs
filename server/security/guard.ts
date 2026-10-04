import type { Request, Response, NextFunction } from 'express';
import { getAuthenticatedAdminSession } from '@server/lib/security/auth';
const rules: Record<string, string> = {
  'ai-analytics': 'canViewAiStats',
  'api-keys': 'canManageApiKeys',
  audit: 'canViewAudit',
  backup: 'canManageSnapshots',
  backups: 'canManageSnapshots',
  database: 'canManageDb',
  'discord-bot': 'canManageDiscordBot',
  doc: 'canEditDocs',
  health: 'canManageHealth',
  media: 'canManageMedia',
  'search-analytics': 'canViewAnalytics',
  settings: 'canManageSettings',
  tasks: 'canManageTasks',
  team: 'canManageTeam',
  webhooks: 'canManageWebhooks',
  reports: 'canManageWebhooks',
};
export async function guard(req: Request, res: Response, next: NextFunction) {
  const route = req.path;
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    const origin = req.get('origin');
    const allowed = new Set([
      process.env.PUBLIC_ORIGIN || 'https://docs.wildfire.ro',
      `${req.protocol}://${req.get('host')}`,
    ]);
    if (req.get('sec-fetch-site') === 'cross-site' || (origin && !allowed.has(origin)))
      return res.status(403).json({ error: 'CROSS_ORIGIN_WRITE' });
  }
  const publicAuth = /^\/api\/admin\/auth\/(login|2fa|me|logout|panic)$/.test(route);
  const publicSettings =
    req.method === 'GET' && ['/api/admin/maintenance', '/api/admin/settings'].includes(route);
  const protectedPublic =
    (route === '/api/system/subscribe' && req.method === 'GET') ||
    route === '/api/system/logs' ||
    (route === '/api/docs/report' && req.method !== 'POST') ||
    (route === '/api/docs/feedback' && req.method === 'GET' && !req.query.slug);
  if ((!route.startsWith('/api/admin/') || publicAuth || publicSettings) && !protectedPublic)
    return next();
  const session = await getAuthenticatedAdminSession();
  if (!session) return res.status(401).json({ error: 'UNAUTHORIZED' });
  (req as any).admin = session;
  if (session.isRoot) return next();
  const section = route.split('/')[3];
  if (section === 'gitops' || route === '/api/admin/auth/reset-cooldown')
    return res.status(403).json({ error: 'FORBIDDEN' });
  const perm = protectedPublic ? 'canViewAnalytics' : rules[section];
  const alternatives = [perm];
  if (['health', 'media'].includes(section)) alternatives.push('canEditDocs');
  if (route === '/api/admin/reports/ai-telemetry') alternatives.push('canViewAiStats');
  if (route === '/api/admin/reports/security-snapshot') alternatives.push('canManageSecurity');
  if (perm && !alternatives.some(key => (session.permissions as any)?.[key]))
    return res.status(403).json({ error: 'FORBIDDEN', permission: perm });
  next();
}
