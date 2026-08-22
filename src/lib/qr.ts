/**
 * Generates a deterministic QR-like 21x21 or 25x25 matrix pattern from a string
 * for UI simulation of QRIS and Verification QR codes.
 */
export function generateQrMatrix(payload: string, size = 21): boolean[] {
  let h = 2166136261;
  const src = String(payload || "amanahzakat");
  for (let i = 0; i < src.length; i++) {
    h ^= src.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }

  const cells: boolean[] = [];

  const finderPattern = (r: number, c: number, offsetR = 0, offsetC = 0) => {
    const dr = Math.abs(r - offsetR - 3);
    const dc = Math.abs(c - offsetC - 3);
    const dist = Math.max(dr, dc);
    return dist === 1 || dist === 3 ? false : true;
  };

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      let isDark = false;

      // Top-Left Finder
      if (r < 7 && c < 7) {
        isDark = finderPattern(r, c, 0, 0);
      }
      // Top-Right Finder
      else if (r < 7 && c >= size - 7) {
        isDark = finderPattern(r, c, 0, size - 7);
      }
      // Bottom-Left Finder
      else if (r >= size - 7 && c < 7) {
        isDark = finderPattern(r, c, size - 7, 0);
      }
      // Finder Separators
      else if (
        (r < 8 && c < 8) ||
        (r < 8 && c >= size - 8) ||
        (r >= size - 8 && c < 8)
      ) {
        isDark = false;
      }
      // Timing Patterns
      else if (r === 6 || c === 6) {
        isDark = (r + c) % 2 === 0;
      }
      // Pseudo-random payload hash
      else {
        let x = Math.imul(h ^ ((r * size + c) * 2654435761), 2246822519);
        x ^= x >>> 15;
        isDark = ((x >>> 0) % 1000) / 1000 > 0.48;
      }

      cells.push(isDark);
    }
  }

  return cells;
}
