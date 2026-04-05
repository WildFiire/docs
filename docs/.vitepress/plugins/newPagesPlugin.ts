import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const VIRTUAL_ID = 'virtual:new-pages'
const RESOLVED_ID = '\0virtual:new-pages'

const NEW_COUNT = 5 // badge on the N most recently committed .md files

function getRecentlyUpdatedPaths(docsDir: string, repoRoot: string): string[] {
  const files: Array<{ link: string; ts: number }> = []

  function walk(dir: string) {
    try {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          walk(full)
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          try {
            const rel = path.relative(repoRoot, full).replace(/\\/g, '/')
            const raw = execSync(`git log -1 --format="%ct" -- "${rel}"`, {
              cwd: repoRoot,
              encoding: 'utf-8',
              stdio: ['pipe', 'pipe', 'pipe']
            }).trim().replace(/^"|"$/g, '')
            const ts = parseInt(raw) || 0
            if (ts > 0) {
              const docsRel = path.relative(docsDir, full).replace(/\\/g, '/')
              const link = '/' + docsRel.replace(/\.md$/, '')
              files.push({ link, ts })
            }
          } catch {
            // skip
          }
        }
      }
    } catch {}
  }

  walk(docsDir)
  files.sort((a, b) => b.ts - a.ts)
  return files.slice(0, NEW_COUNT).map(f => f.link)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function newPagesPlugin(docsDir: string, repoRoot: string): any {
  let cachedPromise: Promise<string[]> | null = null

  function getPaths(): Promise<string[]> {
    if (!cachedPromise) {
      cachedPromise = Promise.resolve(getRecentlyUpdatedPaths(docsDir, repoRoot))
    }
    return cachedPromise
  }

  return {
    name: 'vitepress-new-pages',
    enforce: 'pre',

    resolveId(id: string) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },

    buildStart() {
      cachedPromise = Promise.resolve(getRecentlyUpdatedPaths(docsDir, repoRoot))
    },

    async load(id: string) {
      if (id !== RESOLVED_ID) return
      const paths = await getPaths()
      return `export default ${JSON.stringify(paths)}`
    },

    handleHotUpdate({ file, server }: { file: string; server: any }) {
      if (file.endsWith('.md')) {
        cachedPromise = null
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (mod) server.moduleGraph.invalidateModule(mod)
      }
    }
  }
}
