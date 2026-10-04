import path from 'node:path';
import fs from 'node:fs';
export const RUNTIME_ROOT = path.resolve(process.env.WF_RUNTIME_DIR || process.cwd());
export const DOCS_ROOT = path.resolve(process.env.WF_DOCS_DIR || path.join(process.cwd(), 'docs'));
export const PUBLIC_ROOT = path.resolve(
  process.env.WF_PUBLIC_DIR || path.join(DOCS_ROOT, 'public'),
);
export function inside(root: string, relative: string): string {
  if (
    typeof relative !== 'string' ||
    relative.includes('\0') ||
    relative.includes('\\') ||
    path.isAbsolute(relative)
  )
    throw new Error('Invalid relative path');
  const resolved = path.resolve(root, relative);
  if (!resolved.startsWith(root + path.sep)) throw new Error('Path outside allowed directory');
  let parent = resolved;
  while (parent.startsWith(root + path.sep) || parent === root) {
    if (fs.existsSync(parent) && fs.lstatSync(parent).isSymbolicLink())
      throw new Error('Symlink paths are not allowed');
    parent = path.dirname(parent);
  }
  return resolved;
}
