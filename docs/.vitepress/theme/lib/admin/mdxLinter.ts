/**
 * MDX & Markdown High-Precision Syntax Validator & Linter
 * Provides IDE-grade error diagnostics, line/column mapping, and auto-fix utilities.
 */

export interface LintDiagnostic {
  id: string;
  line: number;
  column: number;
  length?: number;
  message: string;
  severity: "error" | "warning" | "info";
  rule: string;
  fixable?: boolean;
  suggestedFix?: string;
}

export interface LintResult {
  isValid: boolean;
  hasErrors: boolean;
  errorCount: number;
  warningCount: number;
  infoCount: number;
  diagnostics: LintDiagnostic[];
  integrityScore: number;
}

// Void HTML elements that do not require closing tags
const VOID_ELEMENTS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr"
]);

export function lintMarkdown(content: string): LintResult {
  const diagnostics: LintDiagnostic[] = [];
  const lines = content.split(/\r?\n/);

  if (!content.trim()) {
    return {
      isValid: false,
      hasErrors: true,
      errorCount: 1,
      warningCount: 0,
      infoCount: 0,
      diagnostics: [
        {
          id: "empty-doc",
          line: 1,
          column: 1,
          message: "Documentul este complet gol.",
          severity: "error",
          rule: "document/not-empty",
        },
      ],
      integrityScore: 0,
    };
  }

  // 1. FRONTMATTER VALIDATION
  const trimmed = content.trim();
  let frontmatterEndLine = -1;
  let hasFrontmatterTitle = false;

  if (!trimmed.startsWith("---")) {
    diagnostics.push({
      id: "fm-missing",
      line: 1,
      column: 1,
      message: "Blocul Frontmatter YAML lipsește (trebuie să înceapă cu `---`).",
      severity: "error",
      rule: "frontmatter/required",
      fixable: true,
    });
  } else {
    // Check for closing ---
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === "---") {
        frontmatterEndLine = i + 1;
        break;
      }
    }

    if (frontmatterEndLine === -1) {
      diagnostics.push({
        id: "fm-unclosed",
        line: 1,
        column: 1,
        message: "Blocul Frontmatter nu este închis cu `---`.",
        severity: "error",
        rule: "frontmatter/unclosed",
        fixable: true,
      });
    } else {
      // Validate Frontmatter fields
      const fmLines = lines.slice(1, frontmatterEndLine - 1);
      let hasTitle = false;
      let hasDescription = false;
      const seenKeys = new Set<string>();

      fmLines.forEach((lineText, idx) => {
        const lineNum = idx + 2;
        const trimmedLine = lineText.trim();
        if (!trimmedLine || trimmedLine.startsWith("#")) return;

        const colonIndex = lineText.indexOf(":");
        if (colonIndex === -1) {
          diagnostics.push({
            id: `fm-syntax-${lineNum}`,
            line: lineNum,
            column: 1,
            message: `Sintaxă YAML invalidă: lipsește separatorul \`:\` în linia Frontmatter.`,
            severity: "error",
            rule: "frontmatter/syntax",
          });
          return;
        }

        const key = lineText.slice(0, colonIndex).trim();
        const val = lineText.slice(colonIndex + 1).trim();

        if (seenKeys.has(key)) {
          diagnostics.push({
            id: `fm-dup-${key}-${lineNum}`,
            line: lineNum,
            column: 1,
            message: `Cheie duplicată \`${key}\` în Frontmatter.`,
            severity: "warning",
            rule: "frontmatter/no-duplicate-keys",
          });
        }
        seenKeys.add(key);

        if (key === "title") {
          hasTitle = true;
          if (val) {
            hasFrontmatterTitle = true;
          } else {
            diagnostics.push({
              id: `fm-empty-title-${lineNum}`,
              line: lineNum,
              column: colonIndex + 2,
              message: "Câmpul `title` din Frontmatter nu poate fi gol.",
              severity: "error",
              rule: "frontmatter/title-required",
            });
          }
        }
        if (key === "description") {
          hasDescription = true;
          if (!val) {
            diagnostics.push({
              id: `fm-empty-desc-${lineNum}`,
              line: lineNum,
              column: colonIndex + 2,
              message: "Câmpul `description` din Frontmatter este gol.",
              severity: "warning",
              rule: "frontmatter/description-recommended",
            });
          }
        }

        // Check unclosed quotes in values
        if ((val.startsWith('"') && !val.endsWith('"')) || (val.startsWith("'") && !val.endsWith("'"))) {
          if (val.length > 1) {
            diagnostics.push({
              id: `fm-unclosed-quote-${lineNum}`,
              line: lineNum,
              column: colonIndex + 2,
              message: `Ghilimele neînchise în valoarea cheii \`${key}\`.`,
              severity: "error",
              rule: "frontmatter/unclosed-quotes",
            });
          }
        }
      });

      if (!hasTitle) {
        diagnostics.push({
          id: "fm-missing-title",
          line: 1,
          column: 1,
          message: "Câmpul obligatoriu `title` lipsește din Frontmatter.",
          severity: "error",
          rule: "frontmatter/title-required",
        });
      }
      if (!hasDescription) {
        diagnostics.push({
          id: "fm-missing-desc",
          line: 1,
          column: 1,
          message: "Câmpul `description` este recomandat pentru SEO și căutare.",
          severity: "info",
          rule: "frontmatter/description-recommended",
        });
      }
    }
  }

  // 2. CODE BLOCK INTEGRITY
  let inCodeBlock = false;
  let codeBlockStartLine = -1;
  let codeFenceChar = "";

  lines.forEach((lineText, idx) => {
    const lineNum = idx + 1;
    const trimmedLine = lineText.trim();

    if (trimmedLine.startsWith("```") || trimmedLine.startsWith("~~~")) {
      const fence = trimmedLine.slice(0, 3);
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockStartLine = lineNum;
        codeFenceChar = fence;
      } else {
        if (fence === codeFenceChar) {
          inCodeBlock = false;
          codeBlockStartLine = -1;
        }
      }
    }
  });

  if (inCodeBlock && codeBlockStartLine !== -1) {
    diagnostics.push({
      id: `unclosed-code-block-${codeBlockStartLine}`,
      line: codeBlockStartLine,
      column: 1,
      message: `Bloc de cod deschis la linia ${codeBlockStartLine} nu este închis cu \`${codeFenceChar}\`.`,
      severity: "error",
      rule: "code-block/unclosed",
      fixable: true,
      suggestedFix: `\n${codeFenceChar}\n`,
    });
  }

  // 3. COMPREHENSIVE MDX / JSX / HTML TAG TOKENIZER & BALANCE CHECK
  const tagStack: { tag: string; line: number; col: number; raw: string }[] = [];
  let isInFencedCode = false;

  lines.forEach((lineText, idx) => {
    const lineNum = idx + 1;
    const trimmedLine = lineText.trim();

    // Toggle fenced code
    if (trimmedLine.startsWith("```") || trimmedLine.startsWith("~~~")) {
      isInFencedCode = !isInFencedCode;
      return;
    }
    if (isInFencedCode) return;
    if (frontmatterEndLine !== -1 && lineNum <= frontmatterEndLine) return;

    // Check unclosed markdown links: [text](url without closing )
    const unclosedLinkMatch = lineText.match(/\[([^\]]+)\]\(([^)]*)$/);
    if (unclosedLinkMatch && !lineText.includes(")")) {
      diagnostics.push({
        id: `unclosed-link-${lineNum}`,
        line: lineNum,
        column: (unclosedLinkMatch.index || 0) + 1,
        message: `Link Markdown neînchis (lipsește paranteza dreaptă \`)\`).`,
        severity: "error",
        rule: "markdown/unclosed-link",
      });
    }

    // Check empty link url: [text]()
    if (/\[([^\]]+)\]\(\s*\)/.test(lineText)) {
      diagnostics.push({
        id: `empty-link-url-${lineNum}`,
        line: lineNum,
        column: 1,
        message: `Link Markdown cu URL gol \`[text]()\`.`,
        severity: "error",
        rule: "markdown/no-empty-link",
      });
    }

    // Check invalid alert syntax: > [!NOTE without ]
    if (/^>\s*\[![A-Z_]+(?!\w*\])/i.test(trimmedLine)) {
      diagnostics.push({
        id: `invalid-alert-${lineNum}`,
        line: lineNum,
        column: 1,
        message: `Alertă Markdown incompletă (lipsește paranteza \`]\` la \`> [!NOTE]\`).`,
        severity: "error",
        rule: "markdown/alert-syntax",
      });
    }

    // Check valid alert type
    const alertMatch = trimmedLine.match(/^>\s*\[!([A-Z_]+)\]/i);
    if (alertMatch) {
      const alertType = alertMatch[1].toUpperCase();
      const validAlerts = ["NOTE", "TIP", "IMPORTANT", "WARNING", "CAUTION"];
      if (!validAlerts.includes(alertType)) {
        diagnostics.push({
          id: `unknown-alert-type-${lineNum}`,
          line: lineNum,
          column: 1,
          message: `Tip de alertă necunoscut \`[!${alertType}]\`. Tipuri valide: ${validAlerts.join(", ")}.`,
          severity: "warning",
          rule: "markdown/alert-type",
        });
      }
    }

    // Check odd single backticks on a single line (unclosed inline code)
    const backticks = (lineText.match(/`/g) || []).length;
    if (backticks % 2 !== 0 && !lineText.includes("```")) {
      diagnostics.push({
        id: `unclosed-inline-code-${lineNum}`,
        line: lineNum,
        column: lineText.lastIndexOf("`") + 1,
        message: `Caracter backtick (\` ) neînchis pentru cod inline.`,
        severity: "warning",
        rule: "markdown/unclosed-inline-code",
      });
    }

    // Comprehensive Tag Tokenizer (matches <Tag ...>, </Tag>, <Tag ... />)
    const tagRegex = /<(\/)?([A-Za-z][A-Za-z0-9_.-]*)([\s\S]*?)>/g;
    let match: RegExpExecArray | null;

    while ((match = tagRegex.exec(lineText)) !== null) {
      const fullTag = match[0].trim();
      const isClosing = Boolean(match[1]) || fullTag.startsWith("</");
      const tagName = match[2];
      const rawAttrs = match[3] || "";
      const isSelfClosing =
        fullTag.endsWith("/>") ||
        rawAttrs.trimEnd().endsWith("/") ||
        VOID_ELEMENTS.has(tagName.toLowerCase());
      const col = match.index + 1;

      // Skip self-closing tags (e.g. <DocVideo ... />, <img ... />, <br />)
      if (isSelfClosing) {
        continue;
      }

      if (isClosing) {
        // Tag </TagName>
        if (tagStack.length === 0) {
          diagnostics.push({
            id: `unexpected-close-${tagName}-${lineNum}`,
            line: lineNum,
            column: col,
            message: `Tag de închidere neașteptat \`</${tagName}>\` fără tag de deschidere corespunzător.`,
            severity: "error",
            rule: "mdx/unbalanced-tags",
          });
        } else {
          const top = tagStack[tagStack.length - 1];
          if (top.tag === tagName) {
            tagStack.pop();
          } else {
            // Check if it matches an earlier tag in the stack
            const foundIdx = tagStack.map((t) => t.tag).lastIndexOf(tagName);
            if (foundIdx !== -1) {
              // Tags opened after this one were never closed
              const unclosed = tagStack.splice(foundIdx);
              unclosed.forEach((u) => {
                if (u.tag !== tagName) {
                  diagnostics.push({
                    id: `unclosed-inner-tag-${u.tag}-${u.line}`,
                    line: u.line,
                    column: u.col,
                    message: `Tag-ul \`<${u.tag}>\` deschis la linia ${u.line} nu este închis (s-a întâlnit \`</${tagName}>\` la linia ${lineNum}).`,
                    severity: "error",
                    rule: "mdx/unclosed-tag",
                    fixable: true,
                    suggestedFix: `\n</${u.tag}>\n`,
                  });
                }
              });
            } else {
              diagnostics.push({
                id: `mismatched-close-${tagName}-${lineNum}`,
                line: lineNum,
                column: col,
                message: `Tag nebalansat: s-a găsit \`</${tagName}>\`, dar se aștepta \`</${top.tag}>\` (deschis la linia ${top.line}).`,
                severity: "error",
                rule: "mdx/mismatched-tags",
              });
            }
          }
        }
      } else {
        // Opening Tag <TagName>
        // Check if there is an unclosed tag of the same type that might have been accidentally repeated instead of closing (e.g. <Cards> ... <Cards>)
        tagStack.push({
          tag: tagName,
          line: lineNum,
          col,
          raw: match[0],
        });
      }
    }
  });

  // Report all remaining unclosed tags
  while (tagStack.length > 0) {
    const unclosed = tagStack.pop()!;
    diagnostics.push({
      id: `unclosed-tag-${unclosed.tag}-${unclosed.line}`,
      line: unclosed.line,
      column: unclosed.col,
      message: `Tag-ul \`<${unclosed.tag}>\` deschis la linia ${unclosed.line} nu este închis cu \`</${unclosed.tag}>\`.`,
      severity: "error",
      rule: "mdx/unclosed-tag",
      fixable: true,
      suggestedFix: `\n</${unclosed.tag}>\n`,
    });
  }

  // 4. HEADING H1 VALIDATION
  const h1Lines: number[] = [];
  lines.forEach((lineText, idx) => {
    if (idx + 1 <= (frontmatterEndLine || 0)) return;
    if (lineText.startsWith("# ") || lineText === "#") {
      h1Lines.push(idx + 1);
    }
  });

  // If Frontmatter title is not present AND body has no H1, report warning
  if (!hasFrontmatterTitle && h1Lines.length === 0) {
    diagnostics.push({
      id: "missing-h1",
      line: frontmatterEndLine > 0 ? frontmatterEndLine + 1 : 1,
      column: 1,
      message: "Niciun titlu principal H1 (`# Titlu`) nu a fost găsit în corpul documentului.",
      severity: "warning",
      rule: "markdown/h1-required",
    });
  } else if (h1Lines.length > 1) {
    diagnostics.push({
      id: "multiple-h1",
      line: h1Lines[1],
      column: 1,
      message: `Documentul conține ${h1Lines.length} titluri H1 (la liniile ${h1Lines.join(", ")}). Pentru un SEO optim, folosiți un singur H1.`,
      severity: "info",
      rule: "markdown/single-h1",
    });
  }

  // Calculate error counts and integrity score
  const errorCount = diagnostics.filter((d) => d.severity === "error").length;
  const warningCount = diagnostics.filter((d) => d.severity === "warning").length;
  const infoCount = diagnostics.filter((d) => d.severity === "info").length;

  const scorePenalty = errorCount * 25 + warningCount * 8 + infoCount * 2;
  const integrityScore = Math.max(0, Math.min(100, 100 - scorePenalty));

  return {
    isValid: errorCount === 0,
    hasErrors: errorCount > 0,
    errorCount,
    warningCount,
    infoCount,
    diagnostics: diagnostics.sort((a, b) => a.line - b.line),
    integrityScore,
  };
}

/**
 * Auto-fix common markdown & frontmatter issues.
 */
export function autoFixMarkdown(content: string): { fixedContent: string; appliedFixes: string[] } {
  const appliedFixes: string[] = [];
  let result = content;

  // 1. Fix missing frontmatter
  if (!result.trim().startsWith("---")) {
    const today = new Date().toISOString().split("T")[0];
    result = `---\ntitle: "Document Nou"\ndescription: "Ghid creat prin Content Studio."\ncategory: "informatii"\ndate: "${today}"\nauthor: "iannC69"\ntags: ["cs2", "wildfire"]\ndraft: false\n---\n\n${result}`;
    appliedFixes.push("Generat bloc Frontmatter YAML standard");
  }

  // 2. Fix unclosed frontmatter
  if (result.trim().startsWith("---")) {
    const lines = result.split(/\r?\n/);
    let closeCount = 0;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === "---") {
        closeCount++;
        break;
      }
    }
    if (closeCount === 0) {
      const idx = lines.findIndex((l, i) => i > 0 && l.startsWith("#"));
      if (idx !== -1) {
        lines.splice(idx, 0, "---");
        result = lines.join("\n");
      } else {
        result = `${result}\n---`;
      }
      appliedFixes.push("Închis blocul Frontmatter cu `---`");
    }
  }

  // 3. Fix unclosed code blocks
  const lines = result.split(/\r?\n/);
  let codeCount = 0;
  lines.forEach((l) => {
    if (l.trim().startsWith("```")) codeCount++;
  });
  if (codeCount % 2 !== 0) {
    result = `${result}\n\`\`\`\n`;
    appliedFixes.push("Închis automat blocul de cod ```` ``` ````");
  }

  // 4. Auto-close remaining open tags
  const tagRegex = /<(\/)?([A-Za-z][A-Za-z0-9_.-]*)([\s\S]*?)>/g;
  const tagStack: string[] = [];
  let isInFencedCode = false;

  lines.forEach((lineText) => {
    const trimmed = lineText.trim();
    if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
      isInFencedCode = !isInFencedCode;
      return;
    }
    if (isInFencedCode) return;

    let match: RegExpExecArray | null;
    while ((match = tagRegex.exec(lineText)) !== null) {
      const fullTag = match[0].trim();
      const isClosing = Boolean(match[1]) || fullTag.startsWith("</");
      const tagName = match[2];
      const rawAttrs = match[3] || "";
      const isSelfClosing =
        fullTag.endsWith("/>") ||
        rawAttrs.trimEnd().endsWith("/") ||
        VOID_ELEMENTS.has(tagName.toLowerCase());

      if (isSelfClosing) continue;

      if (isClosing) {
        if (tagStack.length > 0 && tagStack[tagStack.length - 1] === tagName) {
          tagStack.pop();
        }
      } else {
        tagStack.push(tagName);
      }
    }
  });

  if (tagStack.length > 0) {
    while (tagStack.length > 0) {
      const unclosed = tagStack.pop()!;
      result = `${result}\n</${unclosed}>\n`;
      appliedFixes.push(`Închis automat tag-ul \`<${unclosed}>\` cu \`</${unclosed}>\``);
    }
  }

  return { fixedContent: result, appliedFixes };
}
