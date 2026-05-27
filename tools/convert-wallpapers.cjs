// tools/convert-wallpapers.cjs
// Converts PNG/JPEG wallpaper images to WebP and reports size savings.
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const wallpaperDir = path.join(__dirname, '../docs/public/wallpaper')

const targets = [
  { src: 'present.png',      quality: 82 },
  { src: 'poza.jpg',         quality: 80 },
  { src: 'community.png',    quality: 82 },
  { src: 'panel.png',        quality: 82 },
  { src: 'contributors.png', quality: 82 },
  { src: 'cases.jpg',        quality: 80 },
]

async function convert() {
  let totalSaved = 0
  for (const { src, quality } of targets) {
    const srcPath = path.join(wallpaperDir, src)
    if (!fs.existsSync(srcPath)) {
      console.log(`⚠️  Skipping ${src} — file not found`)
      continue
    }
    const ext = path.extname(src)
    const base = path.basename(src, ext)
    const destPath = path.join(wallpaperDir, `${base}.webp`)

    const originalSize = fs.statSync(srcPath).size
    await sharp(srcPath)
      .webp({ quality, effort: 6 })
      .toFile(destPath)

    const newSize = fs.statSync(destPath).size
    const saved = originalSize - newSize
    const pct = ((saved / originalSize) * 100).toFixed(1)
    totalSaved += saved
    console.log(`✅  ${src} → ${base}.webp  |  ${(originalSize/1024).toFixed(0)} KiB → ${(newSize/1024).toFixed(0)} KiB  (saved ${(saved/1024).toFixed(0)} KiB, ${pct}%)`)
  }
  console.log(`\n🎉  Total saved: ${(totalSaved/1024).toFixed(0)} KiB`)
}

convert().catch(err => { console.error(err); process.exit(1) })
