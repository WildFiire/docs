import express from 'express'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
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

app.use(express.static(join(__dirname, 'docs/.vitepress/dist')))

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'docs/.vitepress/dist/index.html'))
})

app.listen(PORT, () => {
  console.log(`Wildfire Docs server running on http://localhost:${PORT}`)
})
