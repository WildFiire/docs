import { AuditEvent, AuditAction } from '@server/lib/security/audit';
import { getPublicTeamMembers } from '@server/lib/security/teamStore';
import { resolveIpGeo } from '@server/lib/security/geoip';
import { getPlatformSettings, updatePlatformSettings } from '@server/lib/security/settingsStore';

interface AuditActionMeta {
  title: string;
  category:
    | 'auth'
    | 'security'
    | 'team'
    | 'ai'
    | 'content'
    | 'media'
    | 'reports'
    | 'system'
    | 'snapshots'
    | 'gitops'
    | 'settings';
  color: number;
  icon: string;
}

const ACTION_METAS: Record<AuditAction, AuditActionMeta> = {
  // ── Authentication & Security ──
  AUTH_LOGIN_SUCCESS: {
    title: 'Autentificare Reușită în Panoul Admin',
    category: 'auth',
    color: 0x10b981, // Emerald
    icon: '🟢 [ LOGIN OK ]',
  },
  AUTH_LOGIN_FAILURE: {
    title: 'Tentativă de Autentificare Eșuată',
    category: 'security',
    color: 0xf43f5e, // Red / Rose
    icon: '🚨 [ LOGIN FAIL ]',
  },
  AUTH_LOGOUT: {
    title: 'Deconectare Sesiune Administrator',
    category: 'auth',
    color: 0x94a3b8, // Slate
    icon: '⚪ [ LOGOUT ]',
  },
  AUTH_2FA_ENABLED: {
    title: 'Autentificare 2FA TOTP Activată',
    category: 'security',
    color: 0x10b981,
    icon: '🔐 [ 2FA OK ]',
  },
  AUTH_2FA_DISABLED: {
    title: 'Autentificare 2FA TOTP Dezactivată',
    category: 'security',
    color: 0xf59e0b, // Amber
    icon: '⚠️ [ 2FA OFF ]',
  },
  SESSION_REVOKED: {
    title: 'Sesiune Revocată Forțat',
    category: 'security',
    color: 0xf43f5e,
    icon: '⛔ [ SESSION REVOKED ]',
  },
  PANIC_LOCKDOWN_TRIGGERED: {
    title: 'PANIC LOCKDOWN ACTIVAT DE URGENȚĂ',
    category: 'security',
    color: 0xf43f5e,
    icon: '🚨 [ PANIC LOCKDOWN ]',
  },
  PANIC_LOCKDOWN_RELEASED: {
    title: 'Panic Lockdown Ridicat',
    category: 'security',
    color: 0x10b981,
    icon: '🛡️ [ LOCKDOWN RELEASED ]',
  },

  // ── Content & Documentation ──
  DOC_CREATE: {
    title: 'Ghid Nou Creat în Documentație',
    category: 'content',
    color: 0x10b981,
    icon: '✨ [ DOC NEW ]',
  },
  DOC_UPDATE: {
    title: 'Ghid Modificat & Salvat',
    category: 'content',
    color: 0x06b6d4, // Cyan
    icon: '📝 [ DOC EDIT ]',
  },
  DOC_DELETE: {
    title: 'Document Șters',
    category: 'content',
    color: 0xe74c3c, // Red
    icon: '🗑️',
  },
  DOC_RESTORE: {
    title: 'Document Restaurat',
    category: 'content',
    color: 0x3498db, // Blue
    icon: '♻️',
  },
  DOC_DELETE_FOREVER: {
    title: 'Document Șters Definitiv',
    category: 'content',
    color: 0x992d22, // Dark Red
    icon: '🔥',
  },
  DOC_ROLLBACK: {
    title: 'Rollback Versiune Ghid Executat',
    category: 'content',
    color: 0xa855f7, // Purple
    icon: '⏪ [ DOC ROLLBACK ]',
  },
  DOC_VERSION_SAVE: {
    title: 'Snapshot Versiune Ghid Salvat',
    category: 'content',
    color: 0x3b82f6,
    icon: '📦 [ DOC SNAPSHOT ]',
  },

  // ── System & Maintenance ──
  MAINTENANCE_TOGGLED: {
    title: 'Stare Mod Mentenanță Comutată',
    category: 'settings',
    color: 0xff6b00, // Wildfire Orange
    icon: '🚧 [ MAINTENANCE ]',
  },
  SETTINGS_UPDATE: {
    title: 'Setări Platformă Actualizate',
    category: 'settings',
    color: 0xf59e0b,
    icon: '⚙️ [ SETTINGS ]',
  },
  BACKUP_SNAPSHOT_CREATED: {
    title: 'Snapshot Backup Generat',
    category: 'snapshots',
    color: 0x10b981,
    icon: '💾 [ BACKUP SNAPSHOT ]',
  },
  BACKUP_SNAPSHOT_RESTORED: {
    title: 'RESTAURARE DIN BACKUP EXECUTATĂ',
    category: 'snapshots',
    color: 0xf43f5e,
    icon: '⚠️ [ BACKUP RESTORED ]',
  },
  BACKUP_EXPORT: {
    title: 'Export Arhivă Backup Descărcat',
    category: 'snapshots',
    color: 0x3b82f6,
    icon: '📥 [ BACKUP EXPORT ]',
  },
  SYSTEM_INIT: {
    title: 'Sistem Inițializat',
    category: 'system',
    color: 0x6366f1,
    icon: '🚀 [ SYSTEM INIT ]',
  },
  CACHE_REVALIDATED: {
    title: 'Cache Revalidat & Curățat',
    category: 'system',
    color: 0x06b6d4,
    icon: '⚡ [ CACHE CLEAR ]',
  },

  // ── Community Reports & Requests ──
  DOC_REPORT_SUBMITTED: {
    title: 'Raportare Ghid / Cerere Nouă de la Jucător',
    category: 'reports',
    color: 0x38bdf8,
    icon: '🚩 [ DOC REPORT ]',
  },

  // ── Media & Assets ──
  MEDIA_UPLOAD: {
    title: 'Fișier Media Încărcat în Asset Vault',
    category: 'media',
    color: 0x10b981,
    icon: '🖼️ [ MEDIA UPLOAD ]',
  },
  MEDIA_DELETE: {
    title: 'Fișier Media Șters din Asset Vault',
    category: 'media',
    color: 0xf43f5e,
    icon: '🗑️ [ MEDIA DELETE ]',
  },

  // ── AI Helper Telemetry & Security ──
  AI_ABUSE_DETECTED: {
    title: 'Activitate Neobișnuită / Alertă AI Helper',
    category: 'ai',
    color: 0xf59e0b,
    icon: '🤖 [ AI ALERT ]',
  },

  // ── Team & Permissions ──
  TEAM_MEMBER_CREATED: {
    title: 'Membru Nou Înregistrat în Echipă',
    category: 'team',
    color: 0x10b981,
    icon: '👤 [ TEAM NEW ]',
  },
  TEAM_MEMBER_UPDATED: {
    title: 'Rol / Permisiuni Membru Modificate',
    category: 'team',
    color: 0xf59e0b,
    icon: '🔄 [ TEAM UPDATE ]',
  },
  TEAM_MEMBER_DELETED: {
    title: 'Membru Șters / Revocat din Echipă',
    category: 'team',
    color: 0xf43f5e,
    icon: '❌ [ TEAM DELETED ]',
  },
  TEAM_MEMBER_UNFROZEN: {
    title: 'Cont Membru Dezghețat & Reactivat',
    category: 'team',
    color: 0x0ea5e9,
    icon: '🔥 [ TEAM UNFROZEN ]',
  },
  WEBHOOK_CUSTOM_DISPATCHED: {
    title: 'Embed / Mesaj Personalizat Transmis pe Discord',
    category: 'system',
    color: 0x5865f2,
    icon: '💬 [ DISCORD ]',
  },
  GITOPS_CONFIG_UPDATED: {
    title: 'Configurație GitOps & Repos Actualizată',
    category: 'gitops',
    color: 0xf97316,
    icon: '⚙️ [ GITOPS CONFIG ]',
  },
  GITOPS_MANUAL_SYNC: {
    title: 'Sincronizare Manuală GitOps Executată',
    category: 'gitops',
    color: 0x10b981,
    icon: '🔄 [ GITOPS SYNC ]',
  },
  GITOPS_WEBHOOK_PUSH: {
    title: 'Push Primit pe Repo-ul Public & Sincronizat',
    category: 'gitops',
    color: 0x38bdf8,
    icon: '📥 [ GITOPS PUSH ]',
  },
  PROFILE_SELF_UPDATED: {
    title: 'Profil Administrator Actualizat',
    category: 'team',
    color: 0x06b6d4,
    icon: '👤 [ PROFILE UPDATE ]',
  },
};

/**
 * Dispatches an automated, rich Discord Audit Log Embed to the dedicated #logs channel.
 */
export async function dispatchDiscordAuditLog(
  event: AuditEvent,
): Promise<{ success: boolean; error?: string }> {
  const meta = ACTION_METAS[event.action] || {
    title: `Eveniment Audit: ${event.action}`,
    category: 'system',
    color: 0xff6b00,
    icon: '📌',
  };

  // Uses dedicated logs webhook URL if set, or falls back to general webhook URL
  let webhookUrl = process.env.DISCORD_LOGS_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL;
  const category = meta.category;

  if (category === 'auth' && process.env.DISCORD_AUTH_WEBHOOK_URL)
    webhookUrl = process.env.DISCORD_AUTH_WEBHOOK_URL;
  else if (category === 'security' && process.env.DISCORD_SECURITY_WEBHOOK_URL)
    webhookUrl = process.env.DISCORD_SECURITY_WEBHOOK_URL;
  else if (category === 'team' && process.env.DISCORD_TEAM_WEBHOOK_URL)
    webhookUrl = process.env.DISCORD_TEAM_WEBHOOK_URL;
  else if (category === 'ai' && process.env.DISCORD_AI_WEBHOOK_URL)
    webhookUrl = process.env.DISCORD_AI_WEBHOOK_URL;
  else if (category === 'content' && process.env.DISCORD_CONTENT_WEBHOOK_URL)
    webhookUrl = process.env.DISCORD_CONTENT_WEBHOOK_URL;
  else if (category === 'media' && process.env.DISCORD_MEDIA_WEBHOOK_URL)
    webhookUrl = process.env.DISCORD_MEDIA_WEBHOOK_URL;
  else if (category === 'reports' && process.env.DISCORD_REPORTS_WEBHOOK_URL)
    webhookUrl = process.env.DISCORD_REPORTS_WEBHOOK_URL;
  else if (category === 'system' && process.env.DISCORD_SYSTEM_WEBHOOK_URL)
    webhookUrl = process.env.DISCORD_SYSTEM_WEBHOOK_URL;
  else if (category === 'snapshots' && process.env.DISCORD_SNAPSHOTS_WEBHOOK_URL)
    webhookUrl = process.env.DISCORD_SNAPSHOTS_WEBHOOK_URL;
  else if (category === 'gitops' && process.env.DISCORD_GITOPS_WEBHOOK_URL)
    webhookUrl = process.env.DISCORD_GITOPS_WEBHOOK_URL;
  else if (category === 'settings' && process.env.DISCORD_SETTINGS_WEBHOOK_URL)
    webhookUrl = process.env.DISCORD_SETTINGS_WEBHOOK_URL;

  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    return { success: false, error: 'No Discord webhook URL configured' };
  }

  const siteUrl = process.env.PUBLIC_ORIGIN || 'http://localhost:3000';
  const members = await getPublicTeamMembers();
  const geo = await resolveIpGeo(event.ip);

  // Resolve Actor
  const actorMember = members.find(
    (m) =>
      m.username.toLowerCase() === (event.actor || '').toLowerCase() ||
      m.displayName.toLowerCase() === (event.actor || '').toLowerCase(),
  );

  const actorDiscordId =
    actorMember?.discord && /^\d+$/.test(actorMember.discord.trim())
      ? actorMember.discord.trim()
      : null;

  const actorTag = actorDiscordId ? `<@${actorDiscordId}>` : `**@${event.actor || 'System'}**`;

  const fields: Array<{ name: string; value: string; inline?: boolean }> = [];
  let contentMention: string | undefined = undefined;
  let customDescription: string | undefined = undefined;

  // ── SPECIAL TAILORED FORMATTING: LOGIN FAILURE ──
  if (event.action === 'AUTH_LOGIN_FAILURE') {
    const d = event.details || {};
    const targetedUser = d.targetedAccount || event.actor || 'nespecificat';
    const attemptNumber = Number(d.attemptNumber) || 1;
    const maxAttempts = Number(d.maxAttemptsAllowed) || 5;
    const remainingAttempts = Number(d.remainingAttempts) ?? maxAttempts - attemptNumber;
    const isLockout = Boolean(d.isLockoutActive) || remainingAttempts <= 0;
    const lockoutSec = Number(d.lockoutRemainingSeconds) || 900;

    // Ping ONLY after 3+ consecutive failed attempts or upon lockout!
    if (attemptNumber >= 3 || isLockout) {
      if (isLockout) {
        contentMention = `🚨 <@371621920162185216> **ALERTA SECURITATE:** Accesul a fost **BLOCAT TEMPORAR (15 MIN)** după 5 încercări eșuate pe contul \`${targetedUser}\` (${geo.countryCityString})!`;
      } else {
        contentMention = `⚠️ <@371621920162185216> **AVERTISMENT:** ${attemptNumber} încercări consecutive eșuate de autentificare pe contul \`${targetedUser}\` (${geo.countryCityString})!`;
      }
    }

    customDescription = isLockout
      ? `>>> ⛔ **ACCESUL A FOST BLOCAT TEMPORAR (15 MINUTE)**\nS-a depășit limita maximă de ${maxAttempts} încercări eșuate pentru această conexiune.`
      : `>>> ⚠️ **Tentativă eșuată de autentificare detectată în sistem.**\nÎncercarea **#${attemptNumber}** din maxim **${maxAttempts}** permise.`;

    const attemptText = remainingAttempts === 1 ? '1 rămasă' : `${remainingAttempts} rămase`;

    fields.push(
      {
        name: '🎯 Cont Vizat (Username Încercat)',
        value: `\`${targetedUser}\``,
        inline: true,
      },
      {
        name: '🔍 Stare Cont în Sistem',
        value:
          d.accountStatus ||
          (actorMember ? `🟢 Existent (${actorMember.displayName})` : '🔴 Cont Inexistent'),
        inline: true,
      },
      {
        name: '🔢 Încercare & Rată',
        value: isLockout
          ? `⛔ **BLOCAT (${Math.round(lockoutSec / 60)} min)**`
          : `⚠️ **Încercarea ${attemptNumber}/${maxAttempts}** (${attemptText})`,
        inline: true,
      },
      {
        name: '📍 Locație (Țară & Oraș)',
        value: `**${geo.countryCityString}**`,
        inline: true,
      },
      {
        name: '💻 Client / Browser',
        value: `\`${d.clientBrowser || event.userAgent || 'Browser Nespecificat'}\``,
        inline: true,
      },
      {
        name: '📋 Motiv Eșec',
        value: `\`${d.reason || 'Parolă sau utilizator incorect'}\``,
        inline: true,
      },
    );

    // ── SPECIAL TAILORED FORMATTING: LOGIN SUCCESS ──
  } else if (event.action === 'AUTH_LOGIN_SUCCESS') {
    fields.push(
      {
        name: '👤 Administrator',
        value: actorTag,
        inline: true,
      },
      {
        name: '👑 Rol / Rang',
        value: actorMember ? `\`${actorMember.role.toUpperCase()}\`` : '`ADMIN`',
        inline: true,
      },
      {
        name: '📍 Locație (Țară & Oraș)',
        value: `**${geo.countryCityString}**`,
        inline: true,
      },
      {
        name: '💻 Dispozitiv / Browser',
        value: `\`${event.userAgent ? event.userAgent.slice(0, 90) : 'Web Browser'}\``,
        inline: false,
      },
    );

    // ── SPECIAL TAILORED FORMATTING: PANIC LOCKDOWN ──
  } else if (event.action === 'PANIC_LOCKDOWN_TRIGGERED') {
    contentMention = `🚨 <@371621920162185216> **ALERTA DE URGENȚĂ: PANIC LOCKDOWN A FOST ACTIVAT DE ${actorTag}!**`;
    customDescription = `>>> 🚨 **SISTEMUL A FOST BLOCAT DE URGENȚĂ!**\nToate sesiunile administrative au fost suspendate și accesul este restricționat exclusiv la Root Admin.`;
    fields.push(
      { name: '👤 Declanșat de', value: actorTag, inline: true },
      { name: '📍 Locație (Țară & Oraș)', value: `**${geo.countryCityString}**`, inline: true },
      { name: '⚡ Stare Sistem', value: '🔴 **LOCKDOWN ACTIV**', inline: true },
    );

    // ── SPECIAL TAILORED FORMATTING: DOC OPERATIONS ──
  } else if (
    event.action === 'DOC_CREATE' ||
    event.action === 'DOC_UPDATE' ||
    event.action === 'DOC_DELETE' ||
    event.action === 'DOC_ROLLBACK'
  ) {
    const d = event.details || {};
    const cleanSlug = d.slug || d.path || 'general';
    const actionLabel =
      event.action === 'DOC_CREATE'
        ? 'Ghid Nou Creat'
        : event.action === 'DOC_DELETE'
          ? 'Ghid ȘTERS'
          : event.action === 'DOC_ROLLBACK'
            ? 'Rollback Versiune'
            : 'Ghid Modificat & Salvat';

    customDescription = `>>> 📖 **${actionLabel}:** \`/docs/${cleanSlug}\``;

    fields.push(
      { name: '👤 Autor / Editor', value: actorTag, inline: true },
      {
        name: '📂 Cale Document',
        value: `\`${d.path || `content/docs/${cleanSlug}.md`}\``,
        inline: true,
      },
      { name: '📍 Locație (Țară & Oraș)', value: `**${geo.countryCityString}**`, inline: true },
      {
        name: '🔗 Link Direct Ghid',
        value:
          event.action === 'DOC_DELETE'
            ? '*Documentul a fost șters din fișiere.*'
            : `📖 [**Deschide /docs/${cleanSlug}**](${siteUrl}/docs/${cleanSlug})`,
        inline: false,
      },
    );

    // ── SPECIAL TAILORED FORMATTING: COMMUNITY DOC REPORTS ──
  } else if (event.action === 'DOC_REPORT_SUBMITTED') {
    const d = event.details || {};
    customDescription = `>>> 🚩 **${d.reportType || 'Raport Problemă Ghid'}:** \`/docs/${d.targetSlug || 'general'}\`\n${d.description ? `*„${d.description.slice(0, 300)}”*` : ''}`;

    fields.push(
      {
        name: '👤 Raportat de',
        value: d.contactDiscord ? `\`${d.contactDiscord}\`` : `*Jucător Anonim*`,
        inline: true,
      },
      { name: '⚡ Tip Problemă', value: `\`${d.issueType || 'Feedback'}\``, inline: true },
      { name: '📍 Locație (Țară & Oraș)', value: `**${geo.countryCityString}**`, inline: true },
      {
        name: '📖 Ghid Vizat',
        value: `[**Deschide /docs/${d.targetSlug || 'general'}**](${siteUrl}/docs/${d.targetSlug || 'general'})`,
        inline: true,
      },
      {
        name: '📊 Gestiune Raport',
        value: `👉 [**Deschide Panoul de Rapoarte**](${siteUrl}/admin/database)`,
        inline: true,
      },
    );

    // ── SPECIAL TAILORED FORMATTING: TEAM MANAGEMENT ──
  } else if (
    event.action === 'TEAM_MEMBER_CREATED' ||
    event.action === 'TEAM_MEMBER_UPDATED' ||
    event.action === 'TEAM_MEMBER_DELETED'
  ) {
    const d = event.details || {};
    fields.push(
      { name: '👑 Modificat de', value: actorTag, inline: true },
      {
        name: '👤 Membru Vizat',
        value: `\`${d.createdUser || d.targetUser || d.targetId || 'Nespecificat'}\``,
        inline: true,
      },
      {
        name: '⚡ Rol / Rang',
        value: `\`${(d.role || d.updatedRole || 'STAFF').toUpperCase()}\``,
        inline: true,
      },
      { name: '📍 Locație (Țară & Oraș)', value: `**${geo.countryCityString}**`, inline: true },
    );

    // ── SPECIAL TAILORED FORMATTING: MAINTENANCE & SETTINGS ──
  } else if (event.action === 'MAINTENANCE_TOGGLED' || event.action === 'SETTINGS_UPDATE') {
    const d = event.details || {};
    fields.push(
      { name: '👤 Administrator', value: actorTag, inline: true },
      { name: '⚙️ Acțiune', value: `\`${event.action}\``, inline: true },
      { name: '📍 Locație (Țară & Oraș)', value: `**${geo.countryCityString}**`, inline: true },
    );
    if (d.reason || d.event) {
      fields.push({
        name: '📋 Detalii Modificare',
        value: `• **Eveniment:** \`${d.event || d.action || 'Update'}\`\n• **Motiv:** \`${d.reason || 'Optimizare platformă'}\``,
        inline: false,
      });
    }

    // ── SPECIAL TAILORED FORMATTING: BACKUPS ──
  } else if (
    event.action === 'BACKUP_SNAPSHOT_CREATED' ||
    event.action === 'BACKUP_SNAPSHOT_RESTORED' ||
    event.action === 'BACKUP_EXPORT'
  ) {
    const d = event.details || {};
    fields.push(
      { name: '👤 Administrator', value: actorTag, inline: true },
      {
        name: '💾 Snapshot / Arhivă',
        value: `\`${d.snapshotId || d.filename || 'Backup Curent'}\``,
        inline: true,
      },
      { name: '📍 Locație (Țară & Oraș)', value: `**${geo.countryCityString}**`, inline: true },
    );

    // ── SPECIAL TAILORED FORMATTING: AI HELPER ALERTS ──
  } else if (event.action === 'AI_ABUSE_DETECTED') {
    const d = event.details || {};
    customDescription = `>>> 🤖 **Incident Detectat la Asistentul AI:** \`${d.reason || 'Activitate Neobișnuită'}\`${d.querySnippet ? `\n*„${d.querySnippet.slice(0, 180)}”*` : ''}`;
    fields.push(
      { name: '⚡ Tip Alertă', value: `\`${d.reason || 'Prompt Abuse'}\``, inline: true },
      { name: '📍 Locație (Țară & Oraș)', value: `**${geo.countryCityString}**`, inline: true },
      {
        name: '📊 Consum Tokeni',
        value: d.tokensConsumed
          ? `\`${d.tokensConsumed.toLocaleString()} tokeni\``
          : '`Nespecificat`',
        inline: true,
      },
      { name: '🛡️ Modul Protecție', value: '`Guardrail Integrity Engine`', inline: true },
      {
        name: '⚡ Panou Telemetrie',
        value: `👉 [**Deschide Telemetrie AI (/admin/ai-stats)**](${siteUrl}/admin/ai-stats)`,
        inline: false,
      },
    );

    // ── SPECIAL TAILORED FORMATTING: ASSET VAULT MEDIA ──
  } else if (event.action === 'MEDIA_UPLOAD' || event.action === 'MEDIA_DELETE') {
    const d = event.details || {};
    const isDel = event.action === 'MEDIA_DELETE';
    customDescription = `>>> 🖼️ **Asset Vault:** Fișierul \`${d.filename || 'media'}\` a fost **${isDel ? 'ȘTERS' : 'ÎNCĂRCAT'}** de ${actorTag}.`;
    fields.push(
      { name: '👤 Administrator', value: actorTag, inline: true },
      { name: '📁 Nume Fișier', value: `\`${d.filename || 'media'}\``, inline: true },
      {
        name: '💾 Mărime & Format',
        value: `\`${d.sizeFormatted || d.extension || 'Nespecificat'}\``,
        inline: true,
      },
      { name: '📍 Locație (Țară & Oraș)', value: `**${geo.countryCityString}**`, inline: true },
      {
        name: '⚡ Galerie Media',
        value: `👉 [**Deschide Asset Vault (/admin/media)**](${siteUrl}/admin/media)`,
        inline: false,
      },
    );

    // ── GENERAL EVENT FORMATTING ──
  } else {
    fields.push(
      {
        name: '👤 Actor / Admin',
        value: actorTag,
        inline: true,
      },
      {
        name: '📍 Locație (Țară & Oraș)',
        value: `**${geo.countryCityString}**`,
        inline: true,
      },
    );

    if (event.details && Object.keys(event.details).length > 0) {
      const detailsLines = Object.entries(event.details).map(([k, v]) => {
        const formattedVal = typeof v === 'object' ? JSON.stringify(v) : String(v);
        return `• **${k}:** \`${formattedVal}\``;
      });
      fields.push({
        name: '📋 Parametri Eveniment',
        value: detailsLines.join('\n').slice(0, 1000),
        inline: false,
      });
    }
  }

  // Cryptographic audit link field
  fields.push({
    name: '🔐 Trasabilitate Criptografică SHA-256',
    value: `\`ID:\` \`${event.id}\` • \`Hash:\` \`${event.hash.slice(0, 16)}...\``,
    inline: false,
  });

  fields.push({
    name: '⚡ Acces Rapid',
    value: `👉 [**Deschide Registrul de Audit (/admin/audit)**](${siteUrl}/admin/audit)`,
    inline: false,
  });

  // Dynamic Webhook Identity & Avatar Resolution
  const publicSiteUrl = process.env.PUBLIC_ORIGIN || 'https://wildfire.ro';
  const explicitAvatar = process.env.DISCORD_BOT_AVATAR_URL?.trim() || `${publicSiteUrl}/logo.png`;
  const isSystemActor = !event.actor || event.actor.toUpperCase() === 'SYSTEM';
  const actorAvatar =
    actorMember?.avatarUrl ||
    (actorMember?.githubUsername ? `https://github.com/${actorMember.githubUsername}.png` : null);
  const webhookBotName = isSystemActor
    ? 'WF-DOCSCORE Audit Stream'
    : `WF-DOCSCORE (@${actorMember?.displayName || event.actor})`;

  const embed: any = {
    title: `${meta.icon} ${meta.title}`,
    url: `${siteUrl}/admin/audit`,
    description: customDescription,
    color: meta.color,
    fields,
    author: {
      name: isSystemActor
        ? '🔥 WildFire Security Audit Stream'
        : `WF-DOCSCORE • @${actorMember?.displayName || event.actor}`,
      url: `${siteUrl}/admin/audit`,
      icon_url: isSystemActor ? explicitAvatar : actorAvatar || explicitAvatar,
    },
    footer: {
      text: `WildFire Docs v1.8.5 • Security Audit Stream`,
    },
    timestamp: event.timestamp || new Date().toISOString(),
  };

  try {
    const payload: any = {
      username: webhookBotName,
      content:
        '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n' + (contentMention || ''),
      embeds: [embed],
      allowed_mentions: {
        parse: ['users'],
      },
    };

    if (explicitAvatar) {
      payload.avatar_url = explicitAvatar;
    }

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.error(`[Discord Audit Webhook] Error response (${res.status}):`, errText);
      return { success: false, error: `HTTP ${res.status}: ${errText}` };
    }

    return { success: true };
  } catch (err: any) {
    console.error('[Discord Audit Webhook] Dispatch error:', err);
    return { success: false, error: err.message };
  }
}
