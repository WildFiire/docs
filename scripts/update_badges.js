import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

const SEVEN_DAYS_SEC = 7 * 24 * 60 * 60;
const NOW_SEC = Math.floor(Date.now() / 1000);

function getTrackedMarkdownFiles() {
  const output = execSync('git ls-files "*.md"', { cwd: ROOT_DIR, encoding: 'utf-8' });
  return output.split('\n').filter(Boolean).map(f => path.join(ROOT_DIR, f));
}

function getLineTimestamps(filePath) {
  try {
    const output = execSync(`git blame --line-porcelain "${filePath}"`, { cwd: ROOT_DIR, encoding: 'utf-8' });
    const lines = output.split('\n');
    const timestamps = [];
    let currentTime = null;
    for (const line of lines) {
      if (line.startsWith('author-time ')) {
        currentTime = parseInt(line.split(' ')[1], 10);
      } else if (line.startsWith('\t')) {
        timestamps.push(currentTime);
      }
    }
    return timestamps;
  } catch (err) {
    console.error(`Failed to blame ${filePath}:`, err.message);
    return [];
  }
}

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf-8');
  const timestamps = getLineTimestamps(filePath);
  if (!timestamps.length) return;

  const lines = content.split('\n');

  let modified = false;
  let inCard = false;
  let cardStartLine = -1;
  let openDivs = 0;
  
  const evaluateCard = (start, end) => {
    const startTs = timestamps[start] || 0;
    
    let isNew = (NOW_SEC - startTs) <= SEVEN_DAYS_SEC;
    let isUpdated = false;
    
    if (!isNew) {
      for (let j = start + 1; j <= end; j++) {
        const ts = timestamps[j] || 0;
        if ((NOW_SEC - ts) <= SEVEN_DAYS_SEC) {
          isUpdated = true;
          break;
        }
      }
    }
    
    let originalLine = lines[start];
    let newLine = originalLine.replace(/\s*wf-new\b/g, '').replace(/\s*wf-updated\b/g, '');
    
    if (isNew) {
      newLine = newLine.replace(/class="([^"]+)"/, 'class="$1 wf-new"');
    } else if (isUpdated) {
      newLine = newLine.replace(/class="([^"]+)"/, 'class="$1 wf-updated"');
    }
    
    newLine = newLine.replace(/class="([^"]+)"/, (match, c) => `class="${c.replace(/\s+/g, ' ').trim()}"`);
    
    if (originalLine !== newLine) {
      lines[start] = newLine;
      modified = true;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (!inCard) {
      if (line.match(/<div[^>]*class="[^"]*-card[^"]*"[^>]*>/)) {
        inCard = true;
        cardStartLine = i;
        const opens = (line.match(/<div/g) || []).length;
        const closes = (line.match(/<\/div>/g) || []).length;
        openDivs = opens - closes;
        
        if (openDivs <= 0) {
          inCard = false;
          evaluateCard(cardStartLine, i);
        }
      }
    } else {
      const opens = (line.match(/<div/g) || []).length;
      const closes = (line.match(/<\/div>/g) || []).length;
      openDivs += opens - closes;
      
      if (openDivs <= 0) {
        inCard = false;
        evaluateCard(cardStartLine, i);
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
    console.log(`Updated badges in ${path.basename(filePath)}`);
  }
}

const files = getTrackedMarkdownFiles();
console.log(`Found ${files.length} markdown files to scan...`);
for (const f of files) {
  processFile(f);
}
console.log('Badge update complete!');
