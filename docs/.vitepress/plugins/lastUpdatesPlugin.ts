import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const VIRTUAL_ID = 'virtual:last-updates'
const RESOLVED_ID = '\0virtual:last-updates'

const COLOR_MAP: Record<string, string> = {
  PageTagRed: 'red',
  PageTagBlue: 'blue',
  PageTagGreen: 'green',
  PageTagPurple: 'purple',
  PageTagPink: 'pink',
  PageTagOrange: 'orange',
  PageTagTeal: 'teal',
  PageTagAmber: 'amber',
  PageTagYellow: 'amber',
  PageTagIndigo: 'purple',
  PageTagCyan: 'teal',
  PageTagFuchsia: 'pink',
  PageTagEmerald: 'green',
  PageTagGray: 'blue',
}

export interface UpdateCard {
  title: string
  category: string
  tagColor: string
  dotClass: string
  tag1: string
  tag2: string
  link: string
  date: string
  username: string
  avatarUrl: string
  profileUrl: string
  buttonText: string
}

function extractUsername(email: string, name: string): string {
  const m1 = email.match(/^\d+\+(.+)@users\.noreply\.github\.com$/)
  if (m1) return m1[1]
  const m2 = email.match(/^(.+)@users\.noreply\.github\.com$/)
  if (m2) return m2[1]
  return name.toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'unknown'
}

function formatDate(d: Date): string {
  return [
    String(d.getDate()).padStart(2, '0'),
    String(d.getMonth() + 1).padStart(2, '0'),
    d.getFullYear()
  ].join('.')
}

function parseTags(str: string): Array<{ text: string; component: string }> {
  const tags: Array<{ text: string; component: string }> = []
  const re = /\{[^}]*text:\s*['"]([^'"]*)['"]\s*,\s*component:\s*['"]([^'"]*)['"]\s*\}/g
  let m: RegExpExecArray | null
  while ((m = re.exec(str)) !== null) {
    tags.push({ text: m[1], component: m[2] })
  }
  return tags
}

function parsePath(str: string): string[] {
  const result: string[] = []
  const re = /['"]([^'"]+)['"]/g
  let m: RegExpExecArray | null
  while ((m = re.exec(str)) !== null) {
    result.push(m[1])
  }
  return result
}

interface ParsedHeader {
  title: string
  tags: Array<{ text: string; component: string }>
  pathArr: string[]
  badgeText: string
}

function parseCaseHeader(content: string): ParsedHeader | null {
  const blockM = content.match(/<CaseHeader\s+([\s\S]*?)\/>/)
  if (!blockM) return null
  const block = blockM[1]

  const titleM = block.match(/\btitle="([^"]+)"/)
  if (!titleM) return null

  const tagsM = block.match(/:tags="(\[[\s\S]*?\])"/)
  const pathM = block.match(/:path="(\[[\s\S]*?\])"/)
  const badgeM = block.match(/badge-text="([^"]+)"/)

  return {
    title: titleM[1],
    tags: tagsM ? parseTags(tagsM[1]) : [],
    pathArr: pathM ? parsePath(pathM[1]) : [],
    badgeText: badgeM ? badgeM[1] : ''
  }
}

function getGitInfo(filepath: string, repoRoot: string): { timestamp: number; username: string; date: string; sha: string } {
  try {
    const rel = path.relative(repoRoot, filepath).replace(/\\/g, '/')
    const raw = execSync(`git log -1 --format="%ct|%ae|%an|%H" -- "${rel}"`, {
      cwd: repoRoot,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    }).trim().replace(/^"|"$/g, '')

    if (!raw) {
      return { timestamp: Math.floor(Date.now() / 1000), username: 'unknown', date: formatDate(new Date()), sha: '' }
    }

    const [ts, email, name, sha] = raw.split('|')
    const timestamp = parseInt(ts) || 0
    const username = extractUsername(email || '', name || '')
    return { timestamp, username, date: formatDate(new Date(timestamp * 1000)), sha: sha || '' }
  } catch {
    return { timestamp: 0, username: 'unknown', date: '—', sha: '' }
  }
}

async function resolveGitHubLogin(sha: string, token: string): Promise<string | null> {
  if (!sha || !token) return null
  try {
    const res = await fetch(
      `https://api.github.com/repos/Wildfiire/docs/commits/${sha}`,
      { headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' } }
    )
    if (!res.ok) return null
    const data = await res.json() as { author?: { login?: string } }
    return data.author?.login || null
  } catch {
    return null
  }
}

function walkMd(dir: string): string[] {
  const out: string[] = []
  try {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        out.push(...walkMd(full))
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        out.push(full)
      }
    }
  } catch {}
  return out
}

async function buildCards(docsDir: string, repoRoot: string): Promise<UpdateCard[]> {
  const files = walkMd(docsDir)
  const results: Array<UpdateCard & { timestamp: number; sha: string }> = []

  for (const filepath of files) {
    try {
      const content = fs.readFileSync(filepath, 'utf-8')
      const header = parseCaseHeader(content)
      if (!header) continue

      const { title, tags, pathArr, badgeText } = header
      const git = getGitInfo(filepath, repoRoot)
      const rel = path.relative(docsDir, filepath)
      const link = '/' + rel.replace(/\\/g, '/').replace(/\.md$/, '')
      const tagColor = tags[0] ? (COLOR_MAP[tags[0].component] || 'red') : 'red'
      const category = pathArr.length >= 2
        ? pathArr[pathArr.length - 2]
        : (pathArr[0] || title)

      results.push({
        title,
        category: category.toUpperCase(),
        tagColor,
        dotClass: `dot-${tagColor}`,
        tag1: (tags[0]?.text || '').toUpperCase(),
        tag2: (tags[1]?.text || '').toUpperCase(),
        link,
        date: git.date,
        timestamp: git.timestamp,
        sha: git.sha,
        username: git.username,
        avatarUrl: `https://github.com/${git.username}.png`,
        profileUrl: `https://github.com/${git.username}`,
        buttonText: badgeText ? badgeText.toUpperCase() : 'CITESTE'
      })
    } catch {
      // skip unparseable files
    }
  }

  results.sort((a, b) => b.timestamp - a.timestamp)
  const top6 = results.slice(0, 6)

  // Resolve real GitHub login for each card in parallel
  const token = process.env.VITE_GITHUB_TOKEN || ''
  if (!token) {
    console.warn('[lastUpdatesPlugin] VITE_GITHUB_TOKEN not found — falling back to git email heuristic for usernames')
  }
  const logins = await Promise.all(top6.map(c => resolveGitHubLogin(c.sha, token)))

  return top6.map(({ timestamp: _t, sha: _s, ...card }, i) => {
    const login = logins[i]
    if (login) {
      card.username = login
      card.avatarUrl = `https://github.com/${login}.png`
      card.profileUrl = `https://github.com/${login}`
    }
    return card as UpdateCard
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lastUpdatesPlugin(docsDir: string, repoRoot: string): any {
  let cachedPromise: Promise<UpdateCard[]> | null = null

  function getCards(): Promise<UpdateCard[]> {
    if (!cachedPromise) cachedPromise = buildCards(docsDir, repoRoot)
    return cachedPromise
  }

  return {
    name: 'vitepress-last-updates',
    enforce: 'pre',

    resolveId(id: string) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },

    buildStart() {
      cachedPromise = buildCards(docsDir, repoRoot)
    },

    async load(id: string) {
      if (id !== RESOLVED_ID) return
      const cards = await getCards()
      return `export default ${JSON.stringify(cards)}`
    },

    handleHotUpdate({ file, server }: { file: string; server: any }) {
      if (file.endsWith('.md')) {
        cachedPromise = null
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }
    }
  }
}
