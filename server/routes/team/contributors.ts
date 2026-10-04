import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { getAllTeamRepoStats } from '@server/lib/repoContributions';
import { getPublicTeamMembers } from '@server/lib/security/teamStore';

const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'WildFiire';
const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME || 'docs';

import { getGitOpsSettings } from '@server/lib/gitops/store';

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  try {
    const { statsMap, githubGraphContributors, unlinkedGithubContributors } =
      await getAllTeamRepoStats();
    const members = await getPublicTeamMembers();
    const gitops = getGitOpsSettings();
    const owner = gitops.publicRepo?.owner || GITHUB_REPO_OWNER;
    const repo = gitops.publicRepo?.repo || GITHUB_REPO_NAME;

    const contributors = members.map((m) => {
      const stats = statsMap[m.username.toLowerCase()];
      return {
        ...m,
        stats: stats || {
          totalCommits: 0,
          docsCommits: 0,
          monthlyActivity: [],
          recentFiles: [],
          recentCommits: [],
          isMatchedWithGithub: false,
          matchType: 'unlinked',
        },
      };
    });

    const totalRepoCommits = Object.values(statsMap).reduce((acc, s) => acc + s.totalCommits, 0);

    return jsonReply(
      expressResponse,
      {
        totalRepoCommits,
        contributors,
        githubGraphContributors,
        unlinkedGithubContributors,
        githubGraphUrl: `https://github.com/${owner}/${repo}/graphs/contributors`,
        syncedAt: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      },
    );
  } catch (err) {
    console.error('[API Contributors] Error:', err);
    return jsonReply(expressResponse, { error: 'Failed to load contributors' }, { status: 500 });
  }
}
