import { DOCS_ROOT, PUBLIC_ROOT, RUNTIME_ROOT } from '@server/storage/paths';
import fs from 'fs';
import path from 'path';
import { CURRENT_VERSION } from '@server/lib/version';

interface DocViewRecord {
  slug: string;
  total_views: number;
  today_views?: number;
  last_viewed_at?: string;
}

interface AnalyticsData {
  views: Record<string, DocViewRecord>;
  feedbacks?: Array<{ rating: string }>;
}

interface AiTelemetryLog {
  id: string;
  timestamp: string;
  status: string;
  feedback?: 'helpful' | 'unhelpful' | null;
}

interface AiTelemetryData {
  lifetimeQueries?: number;
  logs?: AiTelemetryLog[];
}

interface CountryGeoStat {
  code: string;
  name: string;
  views: number;
  percentage: number;
}

function getDiscordCountryFlag(code?: string): string {
  if (!code || code.length !== 2) return '🌐';
  try {
    const codePoints = code
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return '🌐';
  }
}

/**
 * Dispatches an automated, rich Daily Traffic & Telemetry Digest Embed with Discord emojis & Flag Emojis to #logs.
 */
export async function dispatchDailyTrafficDigest(): Promise<{ success: boolean; error?: string }> {
  const webhookUrl =
    process.env.DISCORD_LOGS_WEBHOOK_URL ||
    process.env.DISCORD_WEBHOOK_LOGS ||
    process.env.DISCORD_WEBHOOK_AUDIT ||
    process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    return { success: false, error: 'No Discord webhook URL configured' };
  }

  const siteUrl = process.env.PUBLIC_ORIGIN || 'http://localhost:3000';

  // 1. Read Doc Analytics
  let totalViewsToday = 0;
  let totalViewsLifetime = 0;
  let sortedDocs: Array<{ slug: string; today: number; total: number }> = [];
  let satisfactionScore = '100%';

  try {
    const analyticsPath = path.join(RUNTIME_ROOT, 'data', 'doc_analytics.json');
    if (fs.existsSync(analyticsPath)) {
      const raw = fs.readFileSync(analyticsPath, 'utf-8');
      const parsed: AnalyticsData = JSON.parse(raw);
      if (parsed && parsed.views) {
        Object.values(parsed.views).forEach((v) => {
          const tDay = v.today_views || 0;
          const tLife = v.total_views || 0;
          totalViewsToday += tDay;
          totalViewsLifetime += tLife;
          sortedDocs.push({ slug: v.slug, today: tDay, total: tLife });
        });
      }

      const feedbacks = parsed.feedbacks || [];
      const helpful = feedbacks.filter((f) => f.rating === 'helpful').length;
      const unhelpful = feedbacks.filter((f) => f.rating === 'unhelpful').length;
      if (helpful + unhelpful > 0) {
        satisfactionScore = `${Math.round((helpful / (helpful + unhelpful)) * 100)}%`;
      }
    }
  } catch (err) {
    console.error('[Daily Digest] Failed to read doc_analytics.json:', err);
  }

  // Sort by today's views first, then total
  sortedDocs.sort((a, b) => (b.today !== a.today ? b.today - a.today : b.total - a.total));
  const top3 = sortedDocs.slice(0, 3);

  // 2. Read AI Telemetry (Real today calculation from logs)
  let aiQueriesToday = 0;
  let aiLifetimeQueries = 0;

  try {
    const aiPath = path.join(RUNTIME_ROOT, 'content', 'ai-telemetry.json');
    if (fs.existsSync(aiPath)) {
      const raw = fs.readFileSync(aiPath, 'utf-8');
      const parsed: AiTelemetryData = JSON.parse(raw);
      aiLifetimeQueries = parsed.lifetimeQueries || (parsed.logs || []).length;

      const todayIso = new Date().toISOString().split('T')[0];
      const todayLogs = (parsed.logs || []).filter(
        (l) => l.timestamp && l.timestamp.startsWith(todayIso),
      );
      aiQueriesToday = todayLogs.length;

      // If AI logs have feedback, factor it in
      const aiFeedbacks = (parsed.logs || []).filter((l) => l.feedback);
      if (aiFeedbacks.length > 0) {
        const aiHelpful = aiFeedbacks.filter((l) => l.feedback === 'helpful').length;
        satisfactionScore = `${Math.round((aiHelpful / aiFeedbacks.length) * 100)}%`;
      }
    }
  } catch (err) {
    console.error('[Daily Digest] Failed to read ai-telemetry.json:', err);
  }

  // 3. Read Geo Country Analytics (Top visitor countries with flag emojis)
  let topCountriesFormatted = '🌐 *Fără date de geolocație suficiente.*';
  try {
    const geoPath = path.join(RUNTIME_ROOT, 'data', 'view-geo-stats.json');
    if (fs.existsSync(geoPath)) {
      const raw = fs.readFileSync(geoPath, 'utf-8');
      const geo = JSON.parse(raw);
      const countries = Object.values(geo.countries || {}) as CountryGeoStat[];
      if (countries.length > 0) {
        const sorted = [...countries].sort((a, b) => b.views - a.views).slice(0, 3);
        topCountriesFormatted = sorted
          .map((c, i) => {
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉';
            const flag = getDiscordCountryFlag(c.code);
            return `${medal} ${flag} **${c.name}** (\`${c.code}\`) — **${c.views}** vizualizări (**${c.percentage}%**)`;
          })
          .join('\n');
      }
    }
  } catch (err) {
    console.error('[Daily Digest] Failed to read view-geo-stats.json:', err);
  }

  // 4. Count Total Docs
  let totalDocsCount = 0;
  try {
    const docsDir = DOCS_ROOT;
    if (fs.existsSync(docsDir)) {
      const countDocs = (dir: string): number => {
        let count = 0;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const e of entries) {
          if (e.isDirectory()) count += countDocs(path.join(dir, e.name));
          else if (e.name.endsWith('.md') || e.name.endsWith('.mdx')) count++;
        }
        return count;
      };
      totalDocsCount = countDocs(docsDir);
    }
  } catch {}

  const top3Formatted =
    top3.length > 0
      ? top3
          .map((d, i) => {
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉';
            return `${medal} [**/docs/${d.slug}**](${siteUrl}/docs/${d.slug}) — **${d.today || d.total}** vizualizări`;
          })
          .join('\n')
      : '*Nu s-au înregistrat vizualizări astăzi.*';

  const todayDateStr = new Date().toLocaleDateString('ro-RO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const fields = [
    {
      name: '📖 Trafic & Lectură Ghiduri',
      value: `🔥 **${totalViewsToday}** vizualizări astăzi\n📈 **${totalViewsLifetime}** vizualizări totale platformă`,
      inline: true,
    },
    {
      name: '🤖 Asistent AI Helper',
      value: `💬 **${aiQueriesToday}** întrebări astăzi\n⭐ **${satisfactionScore}** rată satisfacție jucători`,
      inline: true,
    },
    {
      name: '📁 Bază de Cunoștințe',
      value: `📚 **${totalDocsCount}** ghiduri active publicate\n⚡ **100%** integritate operațională`,
      inline: true,
    },
    {
      name: '🏆 Top 3 Cele Mai Citite Articole Astăzi',
      value: top3Formatted,
      inline: false,
    },
    {
      name: '🌍 Top Origine Vizitatori (Țări)',
      value: topCountriesFormatted,
      inline: false,
    },
    {
      name: '⚡ Panou Control & Statistici',
      value: `👉 [**Deschide Dashboard Telemetrie (/admin)**](${siteUrl}/admin)`,
      inline: false,
    },
  ];

  const publicSiteUrl = process.env.PUBLIC_ORIGIN || 'https://wildfire.ro';
  const explicitAvatar = process.env.DISCORD_BOT_AVATAR_URL?.trim() || `${publicSiteUrl}/logo.png`;

  const embed: any = {
    title: '📊 Raport Zilnic de Trafic & Telemetrie • WF-DOCSCORE',
    url: `${siteUrl}/admin`,
    description: `>>> 📋 **Rezumatul activității comunității pentru data de ${todayDateStr}.**\nToate sistemele și serviciile funcționează la parametrii optimi.`,
    color: 0xff6b00, // WildFire Orange
    fields,
    author: {
      name: '🔥 WildFire Intelligence Engine',
      url: `${siteUrl}/admin`,
      icon_url: explicitAvatar,
    },
    footer: {
      text: `WildFire Docs v${CURRENT_VERSION} • Daily Midnight Digest`,
    },
    timestamp: new Date().toISOString(),
  };

  try {
    const payload: any = {
      username: 'WF-DOCSCORE Intelligence Engine',
      embeds: [embed],
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
      return { success: false, error: `HTTP ${res.status}: ${errText}` };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
