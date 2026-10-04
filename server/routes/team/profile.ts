import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { getPublicTeamMembers } from '@server/lib/security/teamStore';
import {
  getMemberRepoStats,
  getGithubGraphContributors,
  getLocalRepoCommits,
} from '@server/lib/repoContributions';
import { calculateMemberAchievements } from '@server/lib/badgesEngine';

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  const { searchParams } = new URL(req.originalUrl, 'http://localhost');
  const usernameParam = searchParams.get('username') || '';

  if (!usernameParam) {
    return jsonReply(expressResponse, { error: 'Missing username parameter' }, { status: 400 });
  }

  const members = await getPublicTeamMembers();
  const member = members.find((m) => m.username.toLowerCase() === usernameParam.toLowerCase());

  if (!member) {
    return jsonReply(expressResponse, { error: 'Member not found' }, { status: 404 });
  }

  const allCommits = getLocalRepoCommits();
  const graphContributors = await getGithubGraphContributors();
  const gitStats = getMemberRepoStats(member, allCommits, graphContributors);
  const achievements = calculateMemberAchievements(member, gitStats, gitStats.githubGraph);

  return jsonReply(
    expressResponse,
    { member, gitStats, achievements },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
