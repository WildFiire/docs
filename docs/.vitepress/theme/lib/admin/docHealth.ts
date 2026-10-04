import fs from "fs";
import path from "path";
import matter from "gray-matter";

const DOCS_DIR = path.join(process.cwd(), "content", "docs");

export interface DocHealthIssue {
  type: "broken_link" | "missing_frontmatter" | "orphan_doc" | "empty_content" | "short_description";
  severity: "error" | "warning" | "info";
  file: string;
  slug: string;
  message: string;
  detail?: string;
  line?: number;
}

export interface DocHealthReport {
  timestamp: string;
  totalPages: number;
  healthScore: number; // 0 to 100
  issuesCount: {
    errors: number;
    warnings: number;
    infos: number;
  };
  brokenLinks: number;
  missingFrontmatter: number;
  orphanDocs: number;
  issues: DocHealthIssue[];
}

function getAllMarkdownFiles(dir = DOCS_DIR, base = ""): { slug: string; relativePath: string; fullPath: string }[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let results: { slug: string; relativePath: string; fullPath: string }[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const rel = path.join(base, entry.name);

    if (entry.isDirectory()) {
      results = results.concat(getAllMarkdownFiles(fullPath, rel));
    } else if (entry.isFile() && (entry.name.endsWith(".md") || entry.name.endsWith(".mdx"))) {
      const cleanSlug = rel.replace(/\\/g, "/").replace(/\.(md|mdx)$/, "");
      results.push({ slug: cleanSlug, relativePath: rel, fullPath });
    }
  }

  return results;
}

export function runDocHealthCheck(): DocHealthReport {
  const allDocs = getAllMarkdownFiles();
  const validSlugs = new Set<string>();
  const issues: DocHealthIssue[] = [];

  allDocs.forEach((d) => {
    validSlugs.add(d.slug.toLowerCase());
    if (d.slug.endsWith("/index")) {
      validSlugs.add(d.slug.replace(/\/index$/, "").toLowerCase());
    }
  });

  let brokenLinksCount = 0;
  let missingFrontmatterCount = 0;
  let orphanDocsCount = 0;

  // Track references for orphan detection
  const referencedSlugs = new Set<string>();
  referencedSlugs.add("index");

  for (const doc of allDocs) {
    try {
      const rawContent = fs.readFileSync(doc.fullPath, "utf-8");
      const { data: frontmatter, content: body } = matter(rawContent);

      // 1. Validate Frontmatter
      if (!frontmatter.title || String(frontmatter.title).trim() === "") {
        issues.push({
          type: "missing_frontmatter",
          severity: "error",
          file: doc.relativePath,
          slug: doc.slug,
          message: "Lipsește titlul (title) în frontmatter.",
        });
        missingFrontmatterCount++;
      }

      if (!frontmatter.description || String(frontmatter.description).trim() === "") {
        issues.push({
          type: "missing_frontmatter",
          severity: "warning",
          file: doc.relativePath,
          slug: doc.slug,
          message: "Lipsește descrierea (description) pentru SEO și sumar.",
        });
        missingFrontmatterCount++;
      } else if (String(frontmatter.description).trim().length < 20) {
        issues.push({
          type: "short_description",
          severity: "info",
          file: doc.relativePath,
          slug: doc.slug,
          message: "Descrierea este foarte scurtă (< 20 caractere).",
          detail: frontmatter.description,
        });
      }

      // Check empty body
      if (!body.trim()) {
        issues.push({
          type: "empty_content",
          severity: "error",
          file: doc.relativePath,
          slug: doc.slug,
          message: "Documentul nu conține niciun text în corpul Markdown.",
        });
      }

      // 2. Scan for internal links: [text](/docs/xyz) and <Card href="/docs/xyz"> / <a href="/docs/xyz">
      const lines = rawContent.split(/\r?\n/);

      const processHref = (hrefRaw: string, anchorText?: string, lineNum?: number) => {
        const href = hrefRaw.trim().split("#")[0].split("?")[0];
        if (href.startsWith("/docs/") || href.startsWith("docs/")) {
          const targetSlug = href.replace(/^\/?docs\//, "").replace(/\/$/, "").toLowerCase();
          referencedSlugs.add(targetSlug);

          if (targetSlug && !validSlugs.has(targetSlug) && !validSlugs.has(`${targetSlug}/index`)) {
            issues.push({
              type: "broken_link",
              severity: "error",
              file: doc.relativePath,
              slug: doc.slug,
              message: `Link intern invalid către: /docs/${targetSlug}`,
              detail: anchorText ? `Text ancoră / element: "${anchorText}"` : undefined,
              line: lineNum && lineNum > 0 ? lineNum : undefined,
            });
            brokenLinksCount++;
          }
        }
      };

      // 2a. Markdown Links: [text](href)
      const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let mdMatch;
      while ((mdMatch = mdLinkRegex.exec(rawContent)) !== null) {
        const lineNum = lines.findIndex((l) => l.includes(mdMatch![0])) + 1;
        processHref(mdMatch[2], mdMatch[1], lineNum);
      }

      // 2b. JSX / HTML Attributes: href="/docs/..." or to="/docs/..." (e.g. <Card href="/docs/...">)
      const jsxHrefRegex = /(?:href|to)=["']([^"']+)["']/g;
      let jsxMatch;
      while ((jsxMatch = jsxHrefRegex.exec(rawContent)) !== null) {
        const lineNum = lines.findIndex((l) => l.includes(jsxMatch![0])) + 1;
        processHref(jsxMatch[1], undefined, lineNum);
      }
    } catch (err: any) {
      issues.push({
        type: "missing_frontmatter",
        severity: "error",
        file: doc.relativePath,
        slug: doc.slug,
        message: `Eroare de sintaxă la parsare: ${err.message}`,
      });
    }
  }

  // 3. Orphan Docs Check (Docs with no internal links referencing them, excluding root indices)
  for (const doc of allDocs) {
    const s = doc.slug.toLowerCase();
    const cleanS = s.replace(/\/index$/, "");
    if (
      !referencedSlugs.has(s) &&
      !referencedSlugs.has(cleanS) &&
      !s.includes("getting-started") &&
      !s.includes("index") &&
      !s.includes("about")
    ) {
      issues.push({
        type: "orphan_doc",
        severity: "info",
        file: doc.relativePath,
        slug: doc.slug,
        message: "Document potențial orfan: Niciun alt articol nu face trimitere directă către acest slug.",
      });
      orphanDocsCount++;
    }
  }

  // Calculate Health Score (Max 100, -5 per error, -2 per warning, -0.5 per info)
  const errors = issues.filter((i) => i.severity === "error").length;
  const warnings = issues.filter((i) => i.severity === "warning").length;
  const infos = issues.filter((i) => i.severity === "info").length;

  const penalty = errors * 4 + warnings * 1.5 + infos * 0.5;
  const healthScore = Math.max(0, Math.min(100, Math.round(100 - penalty)));

  return {
    timestamp: new Date().toISOString(),
    totalPages: allDocs.length,
    healthScore,
    issuesCount: { errors, warnings, infos },
    brokenLinks: brokenLinksCount,
    missingFrontmatter: missingFrontmatterCount,
    orphanDocs: orphanDocsCount,
    issues,
  };
}
