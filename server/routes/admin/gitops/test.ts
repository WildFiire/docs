import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { validateSessionToken, SESSION_COOKIE_NAME } from '@server/lib/security/auth';
import { getGitOpsSettings } from '@server/lib/gitops/store';

export interface DiagnosticStep {
  id: string;
  name: string;
  category: 'github_api' | 'public_repo' | 'branch' | 'content_dir' | 'media_dir' | 'local_git';
  status: 'pass' | 'fail' | 'warn' | 'skipped';
  latencyMs?: number;
  message: string;
  details?: any;
}

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;

  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  if (!session.isRoot) {
    return jsonReply(
      expressResponse,
      {
        error: 'FORBIDDEN',
        message:
          'Acces Refuzat: Doar Super Administratorul (Root) poate executa teste de diagnosticare GitOps.',
      },
      { status: 403 },
    );
  }

  const startTime = Date.now();
  const steps: DiagnosticStep[] = [];

  try {
    const body = req.body || {};
    const settings = getGitOpsSettings();

    const publicOwner = body.publicRepo?.owner || settings.publicRepo.owner;
    const publicRepo = body.publicRepo?.repo || settings.publicRepo.repo;
    const publicBranch = body.publicRepo?.branch || settings.publicRepo.branch || 'main';
    const contentPath =
      body.publicRepo?.contentPath || settings.publicRepo.contentPath || 'content';
    const mediaPath = body.publicRepo?.mediaPath || settings.publicRepo.mediaPath || 'public/media';
    const githubToken =
      typeof body.sync?.githubToken === 'string' && !body.sync.githubToken.includes('••••')
        ? body.sync.githubToken.trim()
        : settings.sync.githubToken;

    const authHeaders: Record<string, string> = {
      'User-Agent': 'Wildfire-Docs-Engine/1.5',
      Accept: 'application/vnd.github.v3+json',
    };
    if (githubToken) {
      authHeaders['Authorization'] = `Bearer ${githubToken}`;
    }

    // ── 1. GitHub API Connectivity & Rate Limit Check ────────────────────────
    const t0 = Date.now();
    try {
      const rateRes = await fetch('https://api.github.com/rate_limit', {
        headers: authHeaders,
      });
      const tRate = Date.now() - t0;

      if (rateRes.ok) {
        const rateData = await rateRes.json();
        const remaining = rateData?.resources?.core?.remaining ?? 'N/A';
        const limit = rateData?.resources?.core?.limit ?? 'N/A';
        const resetUnix = rateData?.resources?.core?.reset;
        const resetDate = resetUnix
          ? new Date(resetUnix * 1000).toLocaleTimeString('ro-RO')
          : 'N/A';

        steps.push({
          id: 'step_github_api',
          name: 'Conexiune GitHub REST API & Rate Limits',
          category: 'github_api',
          status: 'pass',
          latencyMs: tRate,
          message: `Conectat cu succes la GitHub API. Rata de cereri: ${remaining}/${limit} rămase (resetare la ${resetDate}).`,
          details: { remaining, limit, resetDate, authenticated: Boolean(githubToken) },
        });
      } else {
        steps.push({
          id: 'step_github_api',
          name: 'Conexiune GitHub REST API & Rate Limits',
          category: 'github_api',
          status: 'fail',
          latencyMs: tRate,
          message: `GitHub API a răspuns cu status HTTP ${rateRes.status} (${rateRes.statusText}).`,
        });
      }
    } catch (err: any) {
      steps.push({
        id: 'step_github_api',
        name: 'Conexiune GitHub REST API & Rate Limits',
        category: 'github_api',
        status: 'fail',
        latencyMs: Date.now() - t0,
        message: `Eroare de rețea la contactarea GitHub API: ${err?.message}`,
      });
    }

    // ── 2. Public Content Repository Verification ─────────────────────────────
    const t1 = Date.now();
    try {
      const repoUrl = `https://api.github.com/repos/${publicOwner}/${publicRepo}`;
      const repoRes = await fetch(repoUrl, {
        headers: authHeaders,
      });
      const tRepo = Date.now() - t1;

      if (repoRes.ok) {
        const repoData = await repoRes.json();
        const isPrivate = repoData.private;
        const defaultBranch = repoData.default_branch;
        const stars = repoData.stargazers_count;
        const forks = repoData.forks_count;
        const description = repoData.description || 'Fără descriere';

        steps.push({
          id: 'step_public_repo',
          name: `Verificare Existență Repo (${publicOwner}/${publicRepo})`,
          category: 'public_repo',
          status: 'pass',
          latencyMs: tRepo,
          message: `Repo găsit: ${repoData.full_name} (${isPrivate ? 'Privat' : 'Public'}), Default Branch: ${defaultBranch}, Stars: ${stars}, Forks: ${forks}.`,
          details: {
            fullName: repoData.full_name,
            private: isPrivate,
            defaultBranch,
            description,
            htmlUrl: repoData.html_url,
            pushedAt: repoData.pushed_at,
          },
        });
      } else if (repoRes.status === 404) {
        steps.push({
          id: 'step_public_repo',
          name: `Verificare Existență Repo (${publicOwner}/${publicRepo})`,
          category: 'public_repo',
          status: 'fail',
          latencyMs: tRepo,
          message: `Repo-ul "${publicOwner}/${publicRepo}" nu a fost găsit pe GitHub (404 Not Found). Asigură-te că repository-ul a fost creat pe GitHub și este public, sau că token-ul PAT are drepturi de citire.`,
        });
      } else {
        steps.push({
          id: 'step_public_repo',
          name: `Verificare Existență Repo (${publicOwner}/${publicRepo})`,
          category: 'public_repo',
          status: 'fail',
          latencyMs: tRepo,
          message: `Verificarea repo-ului a eșuat cu status HTTP ${repoRes.status}: ${repoRes.statusText}`,
        });
      }
    } catch (err: any) {
      steps.push({
        id: 'step_public_repo',
        name: `Verificare Existență Repo (${publicOwner}/${publicRepo})`,
        category: 'public_repo',
        status: 'fail',
        latencyMs: Date.now() - t1,
        message: `Eroare conexiune verificare repo: ${err?.message}`,
      });
    }

    // ── 3. Branch Verification & Latest Commit Check ─────────────────────────
    const t2 = Date.now();
    try {
      const branchUrl = `https://api.github.com/repos/${publicOwner}/${publicRepo}/branches/${publicBranch}`;
      const branchRes = await fetch(branchUrl, {
        headers: authHeaders,
      });
      const tBranch = Date.now() - t2;

      if (branchRes.ok) {
        const branchData = await branchRes.json();
        const commitSha = branchData.commit?.sha?.slice(0, 7) || 'N/A';
        const commitMsg = branchData.commit?.commit?.message?.split('\n')[0] || '';
        const commitAuthor = branchData.commit?.commit?.author?.name || 'N/A';
        const commitDate = branchData.commit?.commit?.author?.date || '';

        steps.push({
          id: 'step_branch',
          name: `Verificare Branch Activ ("${publicBranch}")`,
          category: 'branch',
          status: 'pass',
          latencyMs: tBranch,
          message: `Branch activ identificat. Ultimul commit: [${commitSha}] de @${commitAuthor}: "${commitMsg}"`,
          details: {
            commitSha,
            fullSha: branchData.commit?.sha,
            commitMsg,
            commitAuthor,
            commitDate,
          },
        });
      } else if (branchRes.status === 404) {
        steps.push({
          id: 'step_branch',
          name: `Verificare Branch Activ ("${publicBranch}")`,
          category: 'branch',
          status: 'fail',
          latencyMs: tBranch,
          message: `Branch-ul "${publicBranch}" nu există în repo-ul "${publicOwner}/${publicRepo}".`,
        });
      } else {
        steps.push({
          id: 'step_branch',
          name: `Verificare Branch Activ ("${publicBranch}")`,
          category: 'branch',
          status: 'warn',
          latencyMs: tBranch,
          message: `Branch check status HTTP ${branchRes.status}.`,
        });
      }
    } catch (err: any) {
      steps.push({
        id: 'step_branch',
        name: `Verificare Branch Activ ("${publicBranch}")`,
        category: 'branch',
        status: 'fail',
        latencyMs: Date.now() - t2,
        message: `Eroare verificare branch: ${err?.message}`,
      });
    }

    // ── 4. Content Directory Discovery ───────────────────────────────────────
    const t3 = Date.now();
    try {
      const cleanContent = contentPath.replace(/^\/+/, '').replace(/\/+$/, '');
      const contentUrl = `https://api.github.com/repos/${publicOwner}/${publicRepo}/contents/${cleanContent}?ref=${publicBranch}`;
      const contentRes = await fetch(contentUrl, {
        headers: authHeaders,
      });
      const tContent = Date.now() - t3;

      if (contentRes.ok) {
        const items = await contentRes.json();
        const count = Array.isArray(items) ? items.length : 1;
        const dirNames = Array.isArray(items)
          ? items
              .map((i: any) => i.name)
              .slice(0, 6)
              .join(', ')
          : '';

        steps.push({
          id: 'step_content_dir',
          name: `Scanare Director Conținut ("${cleanContent}/")`,
          category: 'content_dir',
          status: 'pass',
          latencyMs: tContent,
          message: `Directorul de conținut a fost localizat (${count} elemente identificate: ${dirNames}...).`,
          details: { count, itemsSummary: dirNames },
        });
      } else if (contentRes.status === 404) {
        steps.push({
          id: 'step_content_dir',
          name: `Scanare Director Conținut ("${cleanContent}/")`,
          category: 'content_dir',
          status: 'warn',
          latencyMs: tContent,
          message: `Directorul "${cleanContent}" nu a fost găsit încă în repo. Va fi inițializat la primul sync sau push.`,
        });
      } else {
        steps.push({
          id: 'step_content_dir',
          name: `Scanare Director Conținut ("${cleanContent}/")`,
          category: 'content_dir',
          status: 'warn',
          latencyMs: tContent,
          message: `Scanare director status HTTP ${contentRes.status}.`,
        });
      }
    } catch (err: any) {
      steps.push({
        id: 'step_content_dir',
        name: `Scanare Director Conținut ("${contentPath}/")`,
        category: 'content_dir',
        status: 'warn',
        latencyMs: Date.now() - t3,
        message: `Verificare conținut omită: ${err?.message}`,
      });
    }

    // ── 5. Local VPS Git / Worktree Environment ──────────────────────────────
    try {
      let isInsideGit = false;
      let localHeadSha = 'N/A';
      let isSubmodule = false;

      try {
        execSync('git rev-parse --is-inside-work-tree', { cwd: process.cwd(), stdio: 'ignore' });
        isInsideGit = true;
        localHeadSha = execSync('git rev-parse --short HEAD', {
          cwd: process.cwd(),
          encoding: 'utf-8',
        }).trim();
      } catch {}

      const gitmodulesPath = path.join(process.cwd(), '.gitmodules');
      if (fs.existsSync(gitmodulesPath)) {
        const gitmodulesContent = fs.readFileSync(gitmodulesPath, 'utf-8');
        if (gitmodulesContent.includes(publicRepo) || gitmodulesContent.includes('content')) {
          isSubmodule = true;
        }
      }

      steps.push({
        id: 'step_local_git',
        name: 'Infrastructură Git Locală VPS',
        category: 'local_git',
        status: 'pass',
        message: isInsideGit
          ? `Engine-ul rulează într-un arbore Git valid (HEAD: ${localHeadSha}). ${isSubmodule ? 'Git Submodule detectat în .gitmodules.' : 'Structură locală pregătită.'}`
          : 'Engine-ul rulează în mod standalone (fără arbore Git local). Sincronizarea prin API / Webhook este complet funcțională.',
        details: { isInsideGit, localHeadSha, isSubmodule },
      });
    } catch (err: any) {
      steps.push({
        id: 'step_local_git',
        name: 'Infrastructură Git Locală VPS',
        category: 'local_git',
        status: 'warn',
        message: `Diagnostic Git local: ${err?.message}`,
      });
    }

    const totalDurationMs = Date.now() - startTime;
    const hasFailures = steps.some((s) => s.status === 'fail');
    const hasWarnings = steps.some((s) => s.status === 'warn');

    return jsonReply(expressResponse, {
      success: !hasFailures,
      summary: hasFailures
        ? 'Diagnosticul a întâmpinat erori la verificarea repo-ului sau API-ului GitHub.'
        : hasWarnings
          ? 'Conexiunea este stabilă, dar există avertismente minore privind structura.'
          : 'Toate verificările GitOps au trecut cu succes! Topologia este 100% operațională.',
      totalDurationMs,
      steps,
      testedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[GitOps Test API] Unexpected failure:', err);
    return jsonReply(
      expressResponse,
      {
        error: 'Eroare internă în timpul executării diagnosticului GitOps.',
        details: err?.message,
        totalDurationMs: Date.now() - startTime,
        steps,
      },
      { status: 500 },
    );
  }
}
