import fs from 'fs';
import path from 'path';

const root = process.cwd();
const dataDir = path.join(root, 'data');
const contentDir = path.join(root, 'content');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(contentDir)) fs.mkdirSync(contentDir, { recursive: true });

function d(b64) {
  return Buffer.from(b64, 'base64').toString('utf-8');
}

const GH_TOKEN = process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN || '';
const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN || '';
const GEMINI_KEY = process.env.GEMINI_API_KEY || '';

// 1. db_config.json
const dbConfigPath = path.join(dataDir, 'db_config.json');
if (!fs.existsSync(dbConfigPath)) {
  fs.writeFileSync(
    dbConfigPath,
    JSON.stringify(
      {
        provider: 'supabase',
        supabaseUrl: process.env.SUPABASE_URL || 'https://afsrekeoovvtucijbgze.supabase.co',
        supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'sb_publishable_AU18xRupAGK4208l0hLG8w_7qN45RJJ',
        lastConnectedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
    'utf-8',
  );
  console.log('[Seed] Initialized data/db_config.json');
}

// 2. settings.json
const settingsPath = path.join(contentDir, 'settings.json');
if (!fs.existsSync(settingsPath)) {
  fs.writeFileSync(
    settingsPath,
    JSON.stringify(
      {
        maintenance: {
          enabled: false,
          message:
            "Wildfire Docs is currently undergoing scheduled platform upgrades and engine optimizations. We'll be back online shortly.",
          estimatedEndTime: '30 minutes',
          reason: 'Actualizare structură documentație & optimizare index căutare',
          allowAdmins: true,
        },
        announcement: {
          enabled: false,
          text: 'Wildfire Docs v1.5.0 este live cu Ghiduri CS2, Media Vault & Sistem de Securitate!',
          link: '/changelog',
          linkText: 'Vezi Noutățile',
          type: 'fire',
          dismissible: true,
        },
        updatedAt: new Date().toISOString(),
        updatedBy: 'iannC69',
        discordLogThreads: {
          system: '1541503315790266459',
          auth: '1541503512314253332',
          security: '1541503521738981426',
          content: '1541503531507257405',
        },
      },
      null,
      2,
    ),
    'utf-8',
  );
  console.log('[Seed] Initialized content/settings.json');
}

// 3. gitops.json
const gitopsPath = path.join(contentDir, 'gitops.json');
let shouldUpdateGitops = !fs.existsSync(gitopsPath);
if (fs.existsSync(gitopsPath)) {
  try {
    const existing = JSON.parse(fs.readFileSync(gitopsPath, 'utf-8'));
    if (
      existing.publicRepo?.repo !== 'docs' ||
      existing.publicRepo?.owner?.toLowerCase() !== 'wildfiire' ||
      !existing.sync?.githubToken
    ) {
      shouldUpdateGitops = true;
    }
  } catch {
    shouldUpdateGitops = true;
  }
}
if (shouldUpdateGitops) {
  fs.writeFileSync(
    gitopsPath,
    JSON.stringify(
      {
        publicRepo: {
          owner: 'WildFiire',
          repo: 'docs',
          branch: 'main',
          contentPath: 'docs',
          mediaPath: 'public/media',
          editUrlTemplate: 'https://github.com/WildFiire/docs/edit/main/{path}',
        },
        privateRepo: {
          owner: 'WildFiire',
          repo: 'docs',
          branch: 'main',
        },
        sync: {
          mode: 'api_sync',
          githubToken: GH_TOKEN,
          webhookSecret: process.env.GITOPS_WEBHOOK_SECRET || '',
          autoRevalidate: true,
          notifyDiscord: Boolean(process.env.DISCORD_GITOPS_WEBHOOK_URL),
          lastSyncStatus: 'success',
          lastSyncMessage: 'Sincronizat cu succes pe WildFiire/docs',
          syncCount: 20,
          lastSyncTimestamp: new Date().toISOString(),
        },
        updatedAt: new Date().toISOString(),
        updatedBy: 'iannC69',
      },
      null,
      2,
    ),
    'utf-8',
  );
  console.log('[Seed] Initialized/Migrated content/gitops.json to WildFiire/docs');
}

// 4. .env file template
const envPath = path.join(root, '.env');
const canonicalEnv = `# ============================================================
# WF-DOCSCORE — Canonical Environment Template
# ============================================================

NEXT_PUBLIC_SITE_URL=https://docs.wildfire.ro
NEXT_PUBLIC_APP_URL=https://docs.wildfire.ro

ADMIN_SESSION_SECRET=${process.env.ADMIN_SESSION_SECRET || 'wf_docscore_super_fortress_key_2026'}
ADMIN_DEFAULT_SALT=wf_root_salt_2026

GITHUB_REPO_OWNER=WildFiire
GITHUB_REPO_NAME=docs
GITHUB_DOCS_BRANCH=main
GITHUB_TOKEN=${GH_TOKEN}
GITHUB_SYNC_TOKEN=${GH_TOKEN}

DISCORD_WEBHOOK_URL=${process.env.DISCORD_WEBHOOK_URL || ''}
DISCORD_LOGS_WEBHOOK_URL=${process.env.DISCORD_LOGS_WEBHOOK_URL || ''}
DISCORD_PROCEDURA_WEBHOOK_URL=${process.env.DISCORD_PROCEDURA_WEBHOOK_URL || ''}
DISCORD_BOT_TOKEN=${DISCORD_TOKEN}
EMAIL_FROM=Wildfire Docs <docs@wildfire.internal>

GEMINI_API_KEY=${GEMINI_KEY}

NEXT_PUBLIC_SUPABASE_URL=${process.env.SUPABASE_URL || 'https://afsrekeoovvtucijbgze.supabase.co'}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${process.env.SUPABASE_ANON_KEY || 'sb_publishable_AU18xRupAGK4208l0hLG8w_7qN45RJJ'}
SUPABASE_URL=${process.env.SUPABASE_URL || 'https://afsrekeoovvtucijbgze.supabase.co'}
SUPABASE_ANON_KEY=${process.env.SUPABASE_ANON_KEY || 'sb_publishable_AU18xRupAGK4208l0hLG8w_7qN45RJJ'}
SUPABASE_SERVICE_ROLE_KEY=${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}

DISCORD_AUTH_WEBHOOK_URL=${process.env.DISCORD_AUTH_WEBHOOK_URL || ''}
DISCORD_SECURITY_WEBHOOK_URL=${process.env.DISCORD_SECURITY_WEBHOOK_URL || ''}
DISCORD_TEAM_WEBHOOK_URL=${process.env.DISCORD_TEAM_WEBHOOK_URL || ''}
DISCORD_AI_WEBHOOK_URL=${process.env.DISCORD_AI_WEBHOOK_URL || ''}
DISCORD_CONTENT_WEBHOOK_URL=${process.env.DISCORD_CONTENT_WEBHOOK_URL || ''}
DISCORD_MEDIA_WEBHOOK_URL=${process.env.DISCORD_MEDIA_WEBHOOK_URL || ''}
DISCORD_REPORTS_WEBHOOK_URL=${process.env.DISCORD_REPORTS_WEBHOOK_URL || ''}
DISCORD_SYSTEM_WEBHOOK_URL=${process.env.DISCORD_SYSTEM_WEBHOOK_URL || ''}
DISCORD_SNAPSHOTS_WEBHOOK_URL=${process.env.DISCORD_SNAPSHOTS_WEBHOOK_URL || ''}
DISCORD_GITOPS_WEBHOOK_URL=${process.env.DISCORD_GITOPS_WEBHOOK_URL || ''}
DISCORD_SETTINGS_WEBHOOK_URL=${process.env.DISCORD_SETTINGS_WEBHOOK_URL || ''}
DISCORD_TASKS_WEBHOOK_URL=${process.env.DISCORD_TASKS_WEBHOOK_URL || ''}

BOT_SUPABASE_URL=${process.env.BOT_SUPABASE_URL || 'https://iiqftixgiouddlsvxxhf.supabase.co'}
BOT_SUPABASE_KEY=${process.env.BOT_SUPABASE_KEY || ''}
`;

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, canonicalEnv, 'utf-8');
  console.log('[Seed] Created .env file with canonical secrets');
} else {
  const current = fs.readFileSync(envPath, 'utf-8');
  if (!current.includes('SUPABASE_URL=')) {
    fs.appendFileSync(envPath, '\n' + canonicalEnv, 'utf-8');
    console.log('[Seed] Appended missing canonical environment variables to .env');
  }
}
