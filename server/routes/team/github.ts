import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import fs from 'fs';
import path from 'path';

function getGitHubToken(): string {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      const match = content.match(/^GITHUB_TOKEN=(.*)$/m);
      if (match && match[1]) return match[1].trim();
    }
  } catch {}
  return '';
}

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  const { searchParams } = new URL(req.originalUrl, 'http://localhost');
  const username = searchParams.get('username') || '';
  if (!username) return jsonReply(expressResponse, { error: 'Missing username' }, { status: 400 });

  const token = getGitHubToken();
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'WildfireDocs/1.8',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const [userRes, eventsRes] = await Promise.allSettled([
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers }),
      fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=30`,
        { headers },
      ),
    ]);

    let userData: any = null;
    if (userRes.status === 'fulfilled' && userRes.value.ok) {
      userData = await userRes.value.json();
    } else {
      return jsonReply(expressResponse, { error: 'GitHub user not found' }, { status: 404 });
    }

    let recentEvents: any[] = [];
    if (eventsRes.status === 'fulfilled' && eventsRes.value.ok) {
      const events = await eventsRes.value.json();
      recentEvents = Array.isArray(events)
        ? events
            .filter((e: any) => ['PushEvent', 'CreateEvent', 'PullRequestEvent'].includes(e.type))
            .slice(0, 10)
        : [];
    }

    return jsonReply(
      expressResponse,
      {
        login: userData.login,
        name: userData.name,
        bio: userData.bio,
        avatar_url: userData.avatar_url,
        html_url: userData.html_url,
        followers: userData.followers,
        following: userData.following,
        public_repos: userData.public_repos,
        company: userData.company,
        location: userData.location,
        blog: userData.blog,
        created_at: userData.created_at,
        recentEvents,
      },
      {
        headers: { 'Cache-Control': 'public, max-age=600, stale-while-revalidate=1200' },
      },
    );
  } catch (err: any) {
    return jsonReply(
      expressResponse,
      { error: err.message || 'GitHub API error' },
      { status: 500 },
    );
  }
}
