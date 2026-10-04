import path from 'node:path';

/** Static files share the site's origin; reject executable/polyglot content. */
export function validateMedia(name: string, bytes: Buffer) {
  const extension = path.extname(name).slice(1).toLowerCase();
  const starts = (hex: string) => bytes.subarray(0, hex.length / 2).toString('hex') === hex;
  const ascii = (start: number, end: number) => bytes.subarray(start, end).toString('ascii');
  const signatures: Record<string, boolean> = {
    png: starts('89504e470d0a1a0a'), jpg: starts('ffd8ff'), jpeg: starts('ffd8ff'),
    gif: ['GIF87a', 'GIF89a'].includes(ascii(0, 6)),
    webp: ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP',
    wav: ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WAVE',
    mp4: ascii(4, 8) === 'ftyp', webm: starts('1a45dfa3'),
    mp3: ascii(0, 3) === 'ID3' || (bytes[0] === 255 && (bytes[1] & 224) === 224),
    ogg: ascii(0, 4) === 'OggS', ico: starts('00000100'),
  };
  if (extension === 'svg') {
    const svg = bytes.toString('utf8');
    // Deliberately support self-contained vector artwork only. No active XML,
    // external resources, CSS, namespaces, entities or event handlers.
    if (!/^\s*(?:<\?xml[^?]*\?>\s*)?<svg[\s>]/i.test(svg) ||
        /<!|<\/?(?:script|foreignObject|iframe|object|embed|style|a|animate\w*|set)\b|\bon\w+\s*=|\bstyle\s*=|javascript:|data:|url\s*\(|&#|<\/?[\w-]+:/i.test(svg) ||
        /(?:href|src)\s*=\s*["'](?!#)/i.test(svg))
      throw new Error('SVG must contain only self-contained, inactive vector artwork');
    return;
  }
  if (!signatures[extension]) throw new Error('Media content does not match its extension');
}
