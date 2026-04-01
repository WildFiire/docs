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

function getGitInfo(filepath: string, repoRoot: string): { timestamp: number; username: string; date: string } {
  try {
    const rel = path.relative(repoRoot, filepath).replace(/\\/g, '/')
    const raw = execSync(`git log -1 --format="%ct|%ae|%an" -- "${rel}"`, {
      cwd: repoRoot,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    }).trim().replace(/^"|"$/g, '')

    if (!raw) {
      return { timestamp: Math.floor(Date.now() / 1000), username: 'unknown', date: formatDate(new Date()) }
    }

    const [ts, email, name] = raw.split('|')
    const timestamp = parseInt(ts) || 0
    const username = extractUsername(email || '', name || '')
    return { timestamp, username, date: formatDate(new Date(timestamp * 1000)) }
  } catch {
    return { timestamp: 0, username: 'unknown', date: '—' }
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

function buildCards(docsDir: string, repoRoot: string): UpdateCard[] {
  const files = walkMd(docsDir)
  const results: Array<UpdateCard & { timestamp: number }> = []

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
  return results.slice(0, 6).map(({ timestamp: _t, ...rest }) => rest) as UpdateCard[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lastUpdatesPlugin(docsDir: string, repoRoot: string): any {
  let cached: UpdateCard[] | null = null

  return {
    name: 'vitepress-last-updates',
    enforce: 'pre',

    resolveId(id: string) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },

    buildStart() {
      cached = buildCards(docsDir, repoRoot)
    },

    load(id: string) {
      if (id !== RESOLVED_ID) return
      if (!cached) cached = buildCards(docsDir, repoRoot)
      return `export default ${JSON.stringify(cached)}`
    },

    handleHotUpdate({ file, server }: { file: string; server: any }) {
      if (file.endsWith('.md')) {
        cached = null
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }
    }
  }
}
