import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

function getFiles(dir, files = []) {
  try {
    const list = fs.readdirSync(dir)
    for (const file of list) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      if (stat.isDirectory()) {
        if (!filePath.includes('.vitepress') && !filePath.includes('node_modules') && !filePath.includes('public')) {
          getFiles(filePath, files)
        }
      } else if (filePath.endsWith('.md')) {
        files.push(filePath)
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err)
  }
  return files
}

function buildGitStats(repoRoot) {
  const stats = new Map()
  try {
    const raw = execSync('git log --format="COMMIT|%aI|%an" --name-only', {
      cwd: repoRoot,
      encoding: 'utf-8',
      maxBuffer: 1024 * 1024 * 10
    })
    let current = null
    for (const line of raw.split('\n')) {
      if (line.startsWith('COMMIT|')) {
        const parts = line.split('|')
        current = { date: parts[1] || '', author: parts[2] || 'Unknown' }
      } else if (line.trim() && current) {
        const filepath = line.trim()
        if (!stats.has(filepath)) stats.set(filepath, current)
      }
    }
  } catch (e) {
    console.error('contentDecay: failed to read git log:', e)
  }
  return stats
}

export default {
  load() {
    const repoRoot = process.cwd()
    const docsDir = path.resolve(repoRoot, 'docs')
    const files = getFiles(docsDir)
    const gitStats = buildGitStats(repoRoot)

    return files.map(file => {
      const relPath = path.relative(repoRoot, file).replace(/\\/g, '/')
      const stat = gitStats.get(relPath)

      let lastModified = stat ? new Date(stat.date).getTime() : fs.statSync(file).mtimeMs
      if (isNaN(lastModified)) lastModified = fs.statSync(file).mtimeMs
      const author = stat ? stat.author : 'Unknown'

      const content = fs.readFileSync(file, 'utf-8')
      let title = path.basename(file, '.md')

      const frontmatterTitle = content.match(/title:\s*['"]?(.*?)['"]?\s*$/m)
      const h1Match = content.match(/^#\s+(.*)/m)

      if (frontmatterTitle && frontmatterTitle[1]) {
        title = frontmatterTitle[1]
      } else if (h1Match && h1Match[1]) {
        title = h1Match[1]
      }

      let urlPath = '/' + path.relative(docsDir, file).replace(/\\/g, '/').replace(/\.md$/, '')
      if (urlPath.endsWith('/index')) {
        urlPath = urlPath.replace('/index', '/')
      }

      return {
        path: relPath,
        url: urlPath,
        title,
        lastModified,
        author
      }
    })
  }
}
