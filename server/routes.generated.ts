import * as route0 from './routes/admin/ai-analytics.ts';
import * as route1 from './routes/admin/api-keys.ts';
import * as route2 from './routes/admin/audit.ts';
import * as route3 from './routes/admin/auth/2fa.ts';
import * as route4 from './routes/admin/auth/login.ts';
import * as route5 from './routes/admin/auth/logout.ts';
import * as route6 from './routes/admin/auth/me.ts';
import * as route7 from './routes/admin/auth/panic.ts';
import * as route8 from './routes/admin/auth/reset-cooldown.ts';
import * as route9 from './routes/admin/auth/totp.ts';
import * as route10 from './routes/admin/backup.ts';
import * as route11 from './routes/admin/backups/download.ts';
import * as route12 from './routes/admin/backups.ts';
import * as route13 from './routes/admin/database.ts';
import * as route14 from './routes/admin/discord-bot/overview.ts';
import * as route15 from './routes/admin/discord-bot/role-trackers.ts';
import * as route16 from './routes/admin/discord-bot/staff.ts';
import * as route17 from './routes/admin/discord-bot/tickets.ts';
import * as route18 from './routes/admin/discord-bot/watchlist.ts';
import * as route19 from './routes/admin/doc.ts';
import * as route20 from './routes/admin/doc/trash.ts';
import * as route21 from './routes/admin/doc/versions.ts';
import * as route22 from './routes/admin/gitops/auto-poll.ts';
import * as route23 from './routes/admin/gitops/export-initial.ts';
import * as route24 from './routes/admin/gitops.ts';
import * as route25 from './routes/admin/gitops/sync.ts';
import * as route26 from './routes/admin/gitops/test.ts';
import * as route27 from './routes/admin/health.ts';
import * as route28 from './routes/admin/maintenance.ts';
import * as route29 from './routes/admin/media.ts';
import * as route30 from './routes/admin/notifications/preferences.ts';
import * as route31 from './routes/admin/notifications.ts';
import * as route32 from './routes/admin/profile/2fa.ts';
import * as route33 from './routes/admin/profile.ts';
import * as route34 from './routes/admin/reports/ai-telemetry.ts';
import * as route35 from './routes/admin/reports/daily-digest.ts';
import * as route36 from './routes/admin/reports/security-snapshot.ts';
import * as route37 from './routes/admin/reports/system-health.ts';
import * as route38 from './routes/admin/search-analytics.ts';
import * as route39 from './routes/admin/sessions.ts';
import * as route40 from './routes/admin/settings.ts';
import * as route41 from './routes/admin/tasks.ts';
import * as route42 from './routes/admin/team.ts';
import * as route43 from './routes/admin/webhooks/custom-embed.ts';
import * as route44 from './routes/ai-helper/feedback.ts';
import * as route45 from './routes/ai-helper.ts';
import * as route46 from './routes/ai-helper/summary.ts';
import * as route47 from './routes/ai-helper/trending.ts';
import * as route48 from './routes/analytics/view.ts';
import * as route49 from './routes/discord/avatar.ts';
import * as route50 from './routes/docs/feedback.ts';
import * as route51 from './routes/docs/report.ts';
import * as route52 from './routes/search.ts';
import * as route53 from './routes/steam/avatar.ts';
import * as route54 from './routes/system/logs.ts';
import * as route55 from './routes/system/subscribe.ts';
import * as route56 from './routes/team/contributors.ts';
import * as route57 from './routes/team/github.ts';
import * as route58 from './routes/team/profile.ts';
import * as route59 from './routes/webhooks/github.ts';
import * as route60 from './routes/admin/dashboard.ts';
import * as route61 from './routes/admin/publication.ts';
import * as route62 from './routes/og.ts';
export const routes = [{path:"/api/admin/ai-analytics",handlers:route0},
{path:"/api/admin/api-keys",handlers:route1},
{path:"/api/admin/audit",handlers:route2},
{path:"/api/admin/auth/2fa",handlers:route3},
{path:"/api/admin/auth/login",handlers:route4},
{path:"/api/admin/auth/logout",handlers:route5},
{path:"/api/admin/auth/me",handlers:route6},
{path:"/api/admin/auth/panic",handlers:route7},
{path:"/api/admin/auth/reset-cooldown",handlers:route8},
{path:"/api/admin/auth/totp",handlers:route9},
{path:"/api/admin/backup",handlers:route10},
{path:"/api/admin/backups/download",handlers:route11},
{path:"/api/admin/backups",handlers:route12},
{path:"/api/admin/database",handlers:route13},
{path:"/api/admin/discord-bot/overview",handlers:route14},
{path:"/api/admin/discord-bot/role-trackers",handlers:route15},
{path:"/api/admin/discord-bot/staff",handlers:route16},
{path:"/api/admin/discord-bot/tickets",handlers:route17},
{path:"/api/admin/discord-bot/watchlist",handlers:route18},
{path:"/api/admin/doc",handlers:route19},
{path:"/api/admin/doc/trash",handlers:route20},
{path:"/api/admin/doc/versions",handlers:route21},
{path:"/api/admin/gitops/auto-poll",handlers:route22},
{path:"/api/admin/gitops/export-initial",handlers:route23},
{path:"/api/admin/gitops",handlers:route24},
{path:"/api/admin/gitops/sync",handlers:route25},
{path:"/api/admin/gitops/test",handlers:route26},
{path:"/api/admin/health",handlers:route27},
{path:"/api/admin/maintenance",handlers:route28},
{path:"/api/admin/media",handlers:route29},
{path:"/api/admin/notifications/preferences",handlers:route30},
{path:"/api/admin/notifications",handlers:route31},
{path:"/api/admin/profile/2fa",handlers:route32},
{path:"/api/admin/profile",handlers:route33},
{path:"/api/admin/reports/ai-telemetry",handlers:route34},
{path:"/api/admin/reports/daily-digest",handlers:route35},
{path:"/api/admin/reports/security-snapshot",handlers:route36},
{path:"/api/admin/reports/system-health",handlers:route37},
{path:"/api/admin/search-analytics",handlers:route38},
{path:"/api/admin/sessions",handlers:route39},
{path:"/api/admin/settings",handlers:route40},
{path:"/api/admin/tasks",handlers:route41},
{path:"/api/admin/team",handlers:route42},
{path:"/api/admin/webhooks/custom-embed",handlers:route43},
{path:"/api/ai-helper/feedback",handlers:route44},
{path:"/api/ai-helper",handlers:route45},
{path:"/api/ai-helper/summary",handlers:route46},
{path:"/api/ai-helper/trending",handlers:route47},
{path:"/api/analytics/view",handlers:route48},
{path:"/api/discord/avatar",handlers:route49},
{path:"/api/docs/feedback",handlers:route50},
{path:"/api/docs/report",handlers:route51},
{path:"/api/search",handlers:route52},
{path:"/api/steam/avatar",handlers:route53},
{path:"/api/system/logs",handlers:route54},
{path:"/api/system/subscribe",handlers:route55},
{path:"/api/team/contributors",handlers:route56},
{path:"/api/team/github",handlers:route57},
{path:"/api/team/profile",handlers:route58},
{path:"/api/webhooks/github",handlers:route59},
{path:"/api/admin/dashboard",handlers:route60},
{path:"/api/admin/publication",handlers:route61},
{path:"/api/og",handlers:route62}];
