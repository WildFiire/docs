import { execSync } from 'child_process'

export interface GitInfo {
  timestamp: number
  email: string
  name: string
}

let cachedGitStats: Map<string, GitInfo> | null = null

export function getAllGitStats(repoRoot: string): Map<string, GitInfo> {
  if (cachedGitStats) return cachedGitStats

  cachedGitStats = new Map<string, GitInfo>()
  try {
    const raw = execSync('git log --format="COMMIT|%ct|%ae|%an" --name-only', {
      cwd: repoRoot,
      encoding: 'utf-8',
      maxBuffer: 1024 * 1024 * 10 // 10MB
    })

    let currentCommit: GitInfo | null = null
    for (const line of raw.split('\n')) {
      if (line.startsWith('COMMIT|')) {
        const parts = line.split('|')
        currentCommit = {
          timestamp: parseInt(parts[1]) || 0,
          email: parts[2] || '',
          name: parts[3] || ''
        }
      } else if (line.trim() && currentCommit) {
        const filepath = line.trim()
        if (!cachedGitStats.has(filepath)) {
          cachedGitStats.set(filepath, currentCommit)
        }
      }
    }
  } catch (e) {
    console.error('Failed to get git stats:', e)
  }

  return cachedGitStats
}

export function invalidateGitStats() {
  cachedGitStats = null
}
