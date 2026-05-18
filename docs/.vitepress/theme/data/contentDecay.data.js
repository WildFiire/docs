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

export default {
  load() {
    const docsDir = path.resolve(process.cwd(), 'docs')
    const files = getFiles(docsDir)
    
    return files.map(file => {
      let lastModified = Date.now()
      let author = 'Unknown'
      
      try {
        const gitInfo = execSync(`git log -1 --format="%aI|%an" -- "${file}"`, { encoding: 'utf-8' }).trim()
        if (gitInfo) {
          const parts = gitInfo.split('|')
          lastModified = new Date(parts[0]).getTime()
          author = parts[1]
        } else {
          lastModified = fs.statSync(file).mtimeMs
        }
      } catch (e) {
        lastModified = fs.statSync(file).mtimeMs
      }

      const content = fs.readFileSync(file, 'utf-8')
      let title = path.basename(file, '.md')
      
      const frontmatterTitle = content.match(/title:\s*['"]?(.*?)['"]?\s*$/m)
      const h1Match = content.match(/^#\s+(.*)/m)
      
      if (frontmatterTitle && frontmatterTitle[1]) {
        title = frontmatterTitle[1]
      } else if (h1Match && h1Match[1]) {
        title = h1Match[1]
      }

      const relPath = path.relative(process.cwd(), file).replace(/\\/g, '/')
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
