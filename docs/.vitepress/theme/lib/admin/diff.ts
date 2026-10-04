export interface DiffChange {
  type: "added" | "removed" | "unchanged";
  value: string;
  lineOld?: number;
  lineNew?: number;
}

/**
 * Line-by-line diff calculator between old text and new text
 */
export function computeLineDiff(oldText: string, newText: string): DiffChange[] {
  const oldLines = oldText.split(/\r?\n/);
  const newLines = newText.split(/\r?\n/);
  const changes: DiffChange[] = [];

  let i = 0;
  let j = 0;
  let oldLineNum = 1;
  let newLineNum = 1;

  while (i < oldLines.length || j < newLines.length) {
    if (i < oldLines.length && j < newLines.length && oldLines[i] === newLines[j]) {
      changes.push({
        type: "unchanged",
        value: oldLines[i],
        lineOld: oldLineNum++,
        lineNew: newLineNum++,
      });
      i++;
      j++;
    } else if (j < newLines.length && (i >= oldLines.length || !oldLines.slice(i).includes(newLines[j]))) {
      changes.push({
        type: "added",
        value: newLines[j],
        lineNew: newLineNum++,
      });
      j++;
    } else if (i < oldLines.length) {
      changes.push({
        type: "removed",
        value: oldLines[i],
        lineOld: oldLineNum++,
      });
      i++;
    }
  }

  return changes;
}
