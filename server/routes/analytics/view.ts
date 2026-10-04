import { DOCS_ROOT, PUBLIC_ROOT, RUNTIME_ROOT } from '@server/storage/paths';
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { incrementDocView, getDocViews, getAllDocViews } from '@server/lib/db';
import { resolveIpGeo } from '@server/lib/security/geoip';
import fs from 'fs';
import path from 'path';

const GEO_STATS_FILE = path.join(RUNTIME_ROOT, 'data', 'view-geo-stats.json');

function readGeoStats() {
  try {
    if (fs.existsSync(GEO_STATS_FILE)) {
      return JSON.parse(fs.readFileSync(GEO_STATS_FILE, 'utf-8'));
    }
  } catch {}
  return {
    countries: {},
    hourly: Object.fromEntries(Array.from({ length: 24 }, (_, i) => [String(i), 0])),
    daily: {},
    peakHour: 0,
    updatedAt: new Date().toISOString(),
  };
}

function saveGeoStats(stats: any) {
  try {
    fs.writeFileSync(GEO_STATS_FILE, JSON.stringify(stats, null, 2), 'utf-8');
  } catch {}
}

async function updateGeoStatsFromIp(ip: string) {
  try {
    const geo = await resolveIpGeo(ip);
    const countryCode = geo.countryCode || 'UNKNOWN';
    const countryName = geo.country || 'Unknown';

    const stats = readGeoStats();

    // Update country count
    if (!stats.countries[countryCode]) {
      stats.countries[countryCode] = {
        code: countryCode,
        name: countryName,
        views: 0,
        percentage: 0,
      };
    }
    stats.countries[countryCode].views += 1;
    stats.countries[countryCode].name = countryName;

    // Recompute exact percentages across all recorded visits
    const totalCountryViews = Object.values(stats.countries).reduce<number>(
      (s: number, c: any) => s + (c.views || 0),
      0,
    );
    for (const cc of Object.keys(stats.countries)) {
      stats.countries[cc].percentage =
        totalCountryViews > 0
          ? Math.round((stats.countries[cc].views / totalCountryViews) * 100)
          : 0;
    }

    // Update hourly distribution
    const hour = new Date().getHours();
    stats.hourly = stats.hourly || {};
    stats.hourly[String(hour)] = (stats.hourly[String(hour)] || 0) + 1;

    // Update daily history
    const today = new Date().toISOString().split('T')[0];
    stats.daily = stats.daily || {};
    stats.daily[today] = (stats.daily[today] || 0) + 1;

    // Keep last 7 days only
    const sortedDays = Object.keys(stats.daily).sort();
    if (sortedDays.length > 7) {
      for (const oldDay of sortedDays.slice(0, sortedDays.length - 7)) {
        delete stats.daily[oldDay];
      }
    }

    // Compute peak hour
    const hourlyEntries = Object.entries(stats.hourly as Record<string, number>);
    stats.peakHour = Number(hourlyEntries.sort((a, b) => (b[1] || 0) - (a[1] || 0))[0]?.[0] || 0);
    stats.updatedAt = new Date().toISOString();

    saveGeoStats(stats);
  } catch (err) {
    console.error('[GeoStats] Error updating geo stats:', err);
  }
}

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  try {
    const body = req.body;
    const { slug } = body;

    if (!slug || typeof slug !== 'string') {
      return jsonReply(expressResponse, { error: 'Slug is required' }, { status: 400 });
    }

    const ip =
      req.get('cf-connecting-ip') ||
      req.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.get('x-real-ip') ||
      'unknown';

    const record = await incrementDocView(slug, ip);

    // Completely automated, dynamic geo-tracking per real request
    updateGeoStatsFromIp(ip).catch(() => {});

    return jsonReply(expressResponse, { success: true, views: record.total_views, record });
  } catch (err: any) {
    console.error('[API Analytics View] Error:', err);
    return jsonReply(expressResponse, { error: 'Failed to record view' }, { status: 500 });
  }
}

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  const { searchParams } = new URL(req.originalUrl, 'http://localhost');
  const slug = searchParams.get('slug');

  try {
    if (slug) {
      const record = await getDocViews(slug);
      return jsonReply(expressResponse, { success: true, views: record.total_views, record });
    }

    const allViews = await getAllDocViews();
    return jsonReply(expressResponse, { success: true, total: allViews.length, views: allViews });
  } catch (err: any) {
    console.error('[API Analytics View GET] Error:', err);
    return jsonReply(expressResponse, { error: 'Failed to fetch views' }, { status: 500 });
  }
}
