import express from 'express'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { config } from 'dotenv'

config()

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.get('/api/config', (req, res) => {
  res.json({ githubClientId: process.env.VITE_GITHUB_CLIENT_ID || '' })
})

app.post('/api/github/device-code', async (req, res) => {
  try {
    const response = await fetch('https://github.com/login/device/code', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    })
    const data = await response.json()
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/github/token', async (req, res) => {
  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    })
    const data = await response.json()
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Persistent JSON file store for profile backgrounds
const bgFilePath = join(__dirname, 'profile-backgrounds.json')

function loadBgs() {
  try {
    if (existsSync(bgFilePath)) {
      return JSON.parse(readFileSync(bgFilePath, 'utf-8'))
    }
  } catch (e) { console.error('Failed to load profile backgrounds:', e) }
  return {}
}

function saveBgs(data) {
  try {
    writeFileSync(bgFilePath, JSON.stringify(data, null, 2), 'utf-8')
  } catch (e) { console.error('Failed to save profile backgrounds:', e) }
}

let profileBgs = loadBgs()

app.get('/api/profile-bg/:login', (req, res) => {
  const bg = profileBgs[req.params.login]
  res.json(bg || { presetId: 'default', customColor: '#1a1a2e', customUrl: '' })
})

app.post('/api/profile-bg', (req, res) => {
  const { login, presetId, customColor, customUrl } = req.body
  if (!login) return res.status(400).json({ error: 'login required' })
  profileBgs[login] = { presetId: presetId || 'default', customColor: customColor || '#1a1a2e', customUrl: customUrl || '' }
  saveBgs(profileBgs)
  res.json({ ok: true })
})

app.use(express.static(join(__dirname, 'docs/.vitepress/dist')))

app.get('/*splat', (req, res) => {
  res.sendFile(join(__dirname, 'docs/.vitepress/dist/index.html'))
})

app.listen(PORT, () => {
  console.log(`Wildfire Docs server running on http://localhost:${PORT}`)
})
