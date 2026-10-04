import type { TeamMemberPermissions } from './teamStore';

export interface RoutePermissionSpec {
  pathname: string;
  permKey?: keyof TeamMemberPermissions;
  rootOnly?: boolean;
  label: string;
  category: string;
  description: string;
}

export const ROUTE_PERMISSIONS: Record<string, RoutePermissionSpec> = {
  '/admin/tasks': {
    pathname: '/admin/tasks',
    permKey: 'canManageTasks',
    label: 'Task Hub & Gestiune Sarcini',
    category: 'Workspace',
    description: 'Creare, atribuire și mutare sarcini în Kanban & Lista Echipei.',
  },
  '/admin/ai-analytics': {
    pathname: '/admin/ai-analytics',
    permKey: 'canViewAiStats',
    label: 'AI Engine Telemetry & Costuri',
    category: 'Telemetrie AI',
    description: 'Vizualizare statistici tokeni, latență, costuri USD și interogări AI Helper.',
  },
  '/admin/database': {
    pathname: '/admin/database',
    permKey: 'canManageDb',
    label: 'Database & Metrics (Supabase Sync)',
    category: 'Bază de Date',
    description: 'Configurare conexiune Supabase PostgreSQL, tabele și telemetrie.',
  },
  '/admin/backups': {
    pathname: '/admin/backups',
    permKey: 'canManageSnapshots',
    label: 'Snapshot Vault & Backup-uri',
    category: 'Infrastructură',
    description: 'Creare, restaurare și descărcare snapshot-uri de siguranță ale bazei de date.',
  },
  '/admin/team': {
    pathname: '/admin/team',
    permKey: 'canManageTeam',
    label: 'Gestiune Echipă & Matrice Permisiuni',
    category: 'Administrare Root',
    description:
      'Adăugare administratori, configurare parole, editare profiluri și acordare permisiuni.',
  },
  '/admin/content': {
    pathname: '/admin/content',
    permKey: 'canEditDocs',
    label: 'Content Studio (Editare Articole)',
    category: 'Conținut',
    description: 'Creare, modificare și formatare ghiduri Markdown în editorul Studio IDE.',
  },
  '/admin/health': {
    pathname: '/admin/health',
    permKey: 'canManageHealth',
    label: 'Doc Health & Linter',
    category: 'Conținut',
    description: 'Inspectare integritate link-uri, documente orfane și erori de formatare MDX.',
  },
  '/admin/media': {
    pathname: '/admin/media',
    permKey: 'canManageMedia',
    label: 'Media & Asset Vault',
    category: 'Conținut',
    description: 'Încărcare, sortare și optimizare imagini / fișiere media pentru ghiduri.',
  },
  '/admin/search-analytics': {
    pathname: '/admin/search-analytics',
    permKey: 'canViewAnalytics',
    label: 'Search Telemetry & Content Gaps',
    category: 'Telemetrie Căutare',
    description: 'Monitorizare interogări căutate de jucători și gap-uri de conținut.',
  },
  '/admin/security': {
    pathname: '/admin/security',
    permKey: 'canManageSecurity',
    label: 'Securitate 2FA & Sesiuni Active',
    category: 'Securitate',
    description:
      'Activare 2FA TOTP, revocare sesiuni administrative și monitorizare Panic Lockdown.',
  },
  '/admin/api-keys': {
    pathname: '/admin/api-keys',
    permKey: 'canManageApiKeys',
    label: 'API Tokens & Webhook Credentials',
    category: 'Integrări',
    description: 'Generare și revocare chei API semnate criptografic pentru servicii externe.',
  },
  '/admin/audit': {
    pathname: '/admin/audit',
    permKey: 'canViewAudit',
    label: 'Audit Ledger SHA-256',
    category: 'Securitate',
    description: 'Verificare lanț criptografic imutabil și istoric detaliat al acțiunilor echipei.',
  },
  '/admin/webhooks': {
    pathname: '/admin/webhooks',
    permKey: 'canManageWebhooks',
    label: 'Discord Webhooks & Notificări',
    category: 'Integrări',
    description: 'Trimitere manuală și configurare rapoarte pe canalele Discord ale comunității.',
  },
  '/admin/settings': {
    pathname: '/admin/settings',
    permKey: 'canManageSettings',
    label: 'Setări Globale & Mod Mentenanță',
    category: 'Infrastructură',
    description:
      'Configurare bannere publice, activare mentenanță platformă și regenerare cache ISR.',
  },
  '/admin/gitops': {
    pathname: '/admin/gitops',
    rootOnly: true,
    label: 'GitOps & Multi-Repo Sync (Root Only)',
    category: 'Infrastructură GitOps',
    description:
      'Sincronizare repo public de conținut (wildfiire/docs-public) cu motorul privat de pe VPS.',
  },
  '/admin/inbox': {
    pathname: '/admin/inbox',
    // No permKey — accessible to all authenticated admins
    label: 'Inbox Notificări & Alerte',
    category: 'Workspace',
    description:
      'Inbox Gmail-style pentru notificările, alertele și mesajele echipei administrative.',
  },
  '/admin/discord-bot': {
    pathname: '/admin/discord-bot',
    permKey: 'canManageDiscordBot',
    label: 'Discord Bot Control Center',
    category: 'Discord Bot',
    description:
      'Dashboard de gestionare al botului Discord: tickete, staff, statistici, watchlist și module.',
  },
};

/**
 * Validates if the given session has permission to access the specified pathname.
 */
export function checkRoutePermission(
  pathname: string,
  session: {
    username?: string;
    isRoot?: boolean;
    permissions?: TeamMemberPermissions;
  } | null,
): { allowed: boolean; requiredSpec?: RoutePermissionSpec } {
  if (!pathname || pathname === '/admin' || pathname.startsWith('/admin/login')) {
    return { allowed: true };
  }

  // Root Super Admin (iannC69 / iannC) has permanent bypass for all routes
  const isRoot =
    session?.isRoot ||
    session?.username?.toLowerCase() === 'iannc69' ||
    session?.username?.toLowerCase() === 'iannc';

  if (isRoot) {
    return { allowed: true };
  }

  // Find exact or base route matching
  const cleanPath = pathname.split('?')[0].replace(/\/$/, '');
  const rule = ROUTE_PERMISSIONS[cleanPath];

  if (!rule) {
    // If not a specially protected sub-route, allow general access
    return { allowed: true };
  }

  if (rule.rootOnly) {
    return { allowed: false, requiredSpec: rule };
  }

  if (rule.permKey) {
    const hasPerm = Boolean(session?.permissions?.[rule.permKey]);
    if (!hasPerm) {
      return { allowed: false, requiredSpec: rule };
    }
  }

  return { allowed: true, requiredSpec: rule };
}
