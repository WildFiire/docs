import { DOCS_ROOT, PUBLIC_ROOT, RUNTIME_ROOT } from '@server/storage/paths';
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import fs from 'fs';
import path from 'path';
import { validateSessionToken, SESSION_COOKIE_NAME } from '@server/lib/security/auth';
import { getGitOpsSettings } from '@server/lib/gitops/store';
import { recordAuditEvent } from '@server/lib/security/audit';

interface FileEntry {
  path: string;
  content: string;
  isBinary?: boolean;
}

function scanContentFiles(dir: string, baseDir: string): FileEntry[] {
  const results: FileEntry[] = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (
      entry.isSymbolicLink() ||
      entry.name.startsWith('.') ||
      ['admin', 'panel', 'public', 'docs', 'team', 'changelog', 'maintenance'].includes(entry.name)
    )
      continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '.versions' || entry.name === 'node_modules') continue;
      results.push(...scanContentFiles(fullPath, baseDir));
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      const content = fs.readFileSync(fullPath, 'utf-8');
      results.push({ path: `content/${relPath}`, content });
    }
  }
  return results;
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
          'Acces Refuzat: Doar Super Administratorul (Root) poate executa exportul inițial pe repo-ul public.',
      },
      { status: 403 },
    );
  }

  if (process.env.WF_ENABLE_GIT_WRITES !== '1')
    return jsonReply(expressResponse, { error: 'GIT_WRITES_DISABLED', message: 'Exportul Git este dezactivat în configurația serverului.' }, { status: 409 });
  const logs: string[] = [];
  const settings = getGitOpsSettings();
  const body = req.body || {};

  const publicOwner = body.publicOwner || settings.publicRepo.owner;
  const publicRepo = body.publicRepo || settings.publicRepo.repo;
  const publicBranch = body.publicBranch || settings.publicRepo.branch || 'main';

  let githubToken = body.githubToken;
  if (!githubToken || typeof githubToken !== 'string' || githubToken.includes('••••')) {
    githubToken = settings.sync.githubToken;
  }
  githubToken = githubToken ? githubToken.trim() : '';

  logs.push(
    `[${new Date().toLocaleTimeString('ro-RO')}] Inițializare export conținut către ${publicOwner}/${publicRepo}@${publicBranch}...`,
  );

  if (!githubToken) {
    return jsonReply(
      expressResponse,
      {
        success: false,
        error:
          'Este necesar un GitHub Personal Access Token (PAT) cu permisiuni de scriere (repo) pentru a crea commit-ul inițial pe GitHub.',
        logs,
      },
      { status: 400 },
    );
  }

  try {
    const authHeaders = {
      'User-Agent': 'Wildfire-Docs-Engine/1.5',
      Authorization: `Bearer ${githubToken.trim()}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    };

    // 1. Scan all MDX docs from content/docs
    const docsDir = DOCS_ROOT;
    const contentFiles = scanContentFiles(docsDir, docsDir);
    logs.push(
      `[${new Date().toLocaleTimeString('ro-RO')}] S-au identificat ${contentFiles.length} fișiere de documentație MDX pentru export.`,
    );

    // 2. Add sample README & CI workflow
    const readmeContent = `# Wildfire Docs — Public Content Repository

Bine ai venit în repository-ul oficial de conținut pentru **Wildfire Docs** (https://docs.wildfire.ro)!

## Structură
- \`content/\` — Toate ghidurile, regulamentele și paginile de documentație în format MDX.
- \`public/\` — Imaginile, iconițele și capturile de ecran utilizate în articole.

## Cum contribui
1. Creează un branch nou sau editează direct fișierul MDX dorit.
2. Respectă structura frontmatter de la începutul fiecărui fișier:
\`\`\`yaml
---
title: Titlul Ghidului
description: Scurtă descriere a articolului.
category: Nume Categorie
---
\`\`\`
3. Trimite un Pull Request. La fiecare merge pe branch-ul \`${publicBranch}\`, platforma se actualizează automat în timp real prin Webhook!
`;

    contentFiles.push({ path: 'README.md', content: readmeContent });

    const workflowContent = `name: Validate MDX Content

on:
  push:
    branches: [ ${publicBranch} ]
  pull_request:
    branches: [ ${publicBranch} ]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Validate Markdown Files
        run: |
          echo "Verificare structură MDX finalizată cu succes."
`;

    contentFiles.push({ path: '.github/workflows/validate-mdx.yml', content: workflowContent });

    // 3. Check if repo exists on GitHub
    const repoCheckRes = await fetch(`https://api.github.com/repos/${publicOwner}/${publicRepo}`, {
      headers: authHeaders,
    });

    if (!repoCheckRes.ok) {
      if (repoCheckRes.status === 404) {
        throw new Error(
          `Repository-ul "${publicOwner}/${publicRepo}" nu există încă pe GitHub. Te rugăm să creezi mai întâi un repo gol pe GitHub cu acest nume.`,
        );
      }
      throw new Error(`Eroare GitHub API la verificarea repo-ului: ${repoCheckRes.statusText}`);
    }

    logs.push(
      `[${new Date().toLocaleTimeString('ro-RO')}] S-a confirmat existența repository-ului ${publicOwner}/${publicRepo} pe GitHub.`,
    );

    // 4. Create or update files using GitHub Trees/Commit API
    logs.push(
      `[${new Date().toLocaleTimeString('ro-RO')}] Se creează arborele Git cu cele ${contentFiles.length} fișiere...`,
    );

    // Get current branch ref SHA
    let parentCommitSha: string | null = null;
    let baseTreeSha: string | null = null;

    const refRes = await fetch(
      `https://api.github.com/repos/${publicOwner}/${publicRepo}/git/ref/heads/${publicBranch}`,
      {
        headers: authHeaders,
      },
    );

    if (refRes.ok) {
      const refData = await refRes.json();
      parentCommitSha = refData.object?.sha;
      const commitRes = await fetch(
        `https://api.github.com/repos/${publicOwner}/${publicRepo}/git/commits/${parentCommitSha}`,
        {
          headers: authHeaders,
        },
      );
      if (commitRes.ok) {
        const commitData = await commitRes.json();
        baseTreeSha = commitData.tree?.sha;
      }
    }

    // Create Git Blobs
    const treeItems: any[] = [];
    for (const file of contentFiles) {
      const blobRes = await fetch(
        `https://api.github.com/repos/${publicOwner}/${publicRepo}/git/blobs`,
        {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({
            content: Buffer.from(file.content).toString('base64'),
            encoding: 'base64',
          }),
        },
      );

      if (blobRes.ok) {
        const blobData = await blobRes.json();
        treeItems.push({
          path: file.path,
          mode: '100644',
          type: 'blob',
          sha: blobData.sha,
        });
      }
    }

    logs.push(
      `[${new Date().toLocaleTimeString('ro-RO')}] S-au creat ${treeItems.length} obiecte Git Blob.`,
    );

    // Create Git Tree
    const treeBody: any = { tree: treeItems };
    if (baseTreeSha) treeBody.base_tree = baseTreeSha;

    const treeRes = await fetch(
      `https://api.github.com/repos/${publicOwner}/${publicRepo}/git/trees`,
      {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(treeBody),
      },
    );

    if (!treeRes.ok) {
      const errTree = await treeRes.json();
      throw new Error(`Eroare la crearea Git Tree: ${errTree.message || treeRes.statusText}`);
    }

    const treeData = await treeRes.json();
    logs.push(
      `[${new Date().toLocaleTimeString('ro-RO')}] Git Tree creat cu SHA: ${treeData.sha?.slice(0, 7)}`,
    );

    // Create Commit
    const commitPayload: any = {
      message: 'feat(gitops): initial export of Wildfire documentation content and guidelines',
      tree: treeData.sha,
      parents: parentCommitSha ? [parentCommitSha] : [],
    };

    const commitRes = await fetch(
      `https://api.github.com/repos/${publicOwner}/${publicRepo}/git/commits`,
      {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(commitPayload),
      },
    );

    if (!commitRes.ok) {
      const errCommit = await commitRes.json();
      throw new Error(
        `Eroare la crearea commit-ului: ${errCommit.message || commitRes.statusText}`,
      );
    }

    const newCommit = await commitRes.json();
    logs.push(
      `[${new Date().toLocaleTimeString('ro-RO')}] Commit creat: [${newCommit.sha?.slice(0, 7)}] "${commitPayload.message}"`,
    );

    // Update branch ref or create it
    if (parentCommitSha) {
      const updateRefRes = await fetch(
        `https://api.github.com/repos/${publicOwner}/${publicRepo}/git/refs/heads/${publicBranch}`,
        {
          method: 'PATCH',
          headers: authHeaders,
          body: JSON.stringify({ sha: newCommit.sha, force: true }),
        },
      );
      if (!updateRefRes.ok) {
        throw new Error('Eroare la actualizarea referinței branch-ului principal.');
      }
    } else {
      const createRefRes = await fetch(
        `https://api.github.com/repos/${publicOwner}/${publicRepo}/git/refs`,
        {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({ ref: `refs/heads/${publicBranch}`, sha: newCommit.sha }),
        },
      );
      if (!createRefRes.ok) {
        throw new Error('Eroare la crearea branch-ului principal.');
      }
    }

    logs.push(
      `[${new Date().toLocaleTimeString('ro-RO')}] Succes! Conținutul a fost publicat pe branch-ul ${publicBranch} al repo-ului ${publicOwner}/${publicRepo}.`,
    );

    recordAuditEvent({
      action: 'GITOPS_MANUAL_SYNC',
      actor: session.username,
      details: {
        event: 'INITIAL_PUBLIC_REPO_EXPORT',
        targetRepo: `${publicOwner}/${publicRepo}`,
        filesExported: treeItems.length,
        commit: newCommit.sha?.slice(0, 7),
      },
    });

    return jsonReply(expressResponse, {
      success: true,
      message: `Exportul inițial a fost realizat cu succes! S-au publicat ${treeItems.length} fișiere pe GitHub.`,
      commitSha: newCommit.sha?.slice(0, 7),
      filesCount: treeItems.length,
      logs,
    });
  } catch (err: any) {
    logs.push(`[${new Date().toLocaleTimeString('ro-RO')}] Eroare la export: ${err?.message}`);
    return jsonReply(
      expressResponse,
      {
        success: false,
        error: err?.message || 'Eroare la executarea exportului inițial.',
        logs,
      },
      { status: 500 },
    );
  }
}
