import fs from "fs";
import path from "path";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const DOCS_DIR = path.join(process.cwd(), "content", "docs");

export interface MediaAsset {
  filename: string;
  relativePath: string;
  url: string;
  sizeBytes: number;
  sizeFormatted: string;
  extension: string;
  type: "image" | "video" | "other";
  lastModified: string;
  usageCount: number;
  usedInDocs: string[];
}

export interface MediaScanResult {
  totalAssets: number;
  totalSizeBytes: number;
  totalSizeFormatted: string;
  imagesCount: number;
  videosCount: number;
  usedCount: number;
  unusedCount: number;
  assets: MediaAsset[];
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function scanDirForMedia(dir: string, base = ""): { relativePath: string; fullPath: string }[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let results: { relativePath: string; fullPath: string }[] = [];

  const mediaExts = new Set([".png", ".jpg", ".jpeg", ".svg", ".webp", ".gif", ".ico", ".mp4", ".webm"]);

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const rel = path.join(base, entry.name);

    if (entry.isDirectory()) {
      results = results.concat(scanDirForMedia(fullPath, rel));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (mediaExts.has(ext)) {
        results.push({ relativePath: rel, fullPath });
      }
    }
  }

  return results;
}

export function scanMediaLibrary(): MediaScanResult {
  const rawMediaFiles = scanDirForMedia(PUBLIC_DIR);
  
  // Read all markdown files to build usage map
  const docContents: { slug: string; content: string }[] = [];
  function scanDocs(dir = DOCS_DIR, base = "") {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const rel = path.join(base, entry.name);
      if (entry.isDirectory()) {
        scanDocs(fullPath, rel);
      } else if (entry.isFile() && (entry.name.endsWith(".md") || entry.name.endsWith(".mdx"))) {
        try {
          const content = fs.readFileSync(fullPath, "utf-8");
          docContents.push({ slug: rel.replace(/\\/g, "/").replace(/\.(md|mdx)$/, ""), content });
        } catch {}
      }
    }
  }
  scanDocs();

  let totalBytes = 0;
  let unusedCount = 0;
  let imagesCount = 0;
  let videosCount = 0;
  const assets: MediaAsset[] = [];

  for (const media of rawMediaFiles) {
    try {
      const stat = fs.statSync(media.fullPath);
      totalBytes += stat.size;
      const cleanRel = media.relativePath.replace(/\\/g, "/");
      const url = `/${cleanRel}`;
      const ext = path.extname(media.relativePath).toLowerCase();

      let type: "image" | "video" | "other" = "image";
      if (ext === ".mp4" || ext === ".webm") {
        type = "video";
        videosCount++;
      } else {
        imagesCount++;
      }

      // Check usage in docs
      const usedIn: string[] = [];
      for (const doc of docContents) {
        if (doc.content.includes(url) || doc.content.includes(cleanRel) || doc.content.includes(path.basename(cleanRel))) {
          usedIn.push(doc.slug);
        }
      }

      if (usedIn.length === 0) {
        unusedCount++;
      }

      assets.push({
        filename: path.basename(media.relativePath),
        relativePath: cleanRel,
        url,
        sizeBytes: stat.size,
        sizeFormatted: formatBytes(stat.size),
        extension: ext.replace(".", "").toUpperCase(),
        type,
        lastModified: stat.mtime.toISOString(),
        usageCount: usedIn.length,
        usedInDocs: usedIn,
      });
    } catch {}
  }

  // Sort by: Used first, then alphabetically by filename
  assets.sort((a, b) => {
    if (b.usageCount !== a.usageCount) {
      return b.usageCount - a.usageCount;
    }
    return a.filename.localeCompare(b.filename);
  });

  return {
    totalAssets: assets.length,
    totalSizeBytes: totalBytes,
    totalSizeFormatted: formatBytes(totalBytes),
    imagesCount,
    videosCount,
    usedCount: assets.length - unusedCount,
    unusedCount,
    assets,
  };
}
