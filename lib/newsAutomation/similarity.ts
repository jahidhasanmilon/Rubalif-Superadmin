function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function titleSimilarity(a: string, b: string): number {
  const wordsA = new Set(normalizeTitle(a).split(" ").filter(Boolean));
  const wordsB = new Set(normalizeTitle(b).split(" ").filter(Boolean));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let overlap = 0;
  for (const w of wordsA) if (wordsB.has(w)) overlap++;

  const union = new Set([...wordsA, ...wordsB]).size;
  return overlap / union;
}

export const DUPLICATE_TITLE_THRESHOLD = 0.6;

export function isDuplicateTitle(title: string, existingTitles: string[]): boolean {
  return existingTitles.some((t) => titleSimilarity(title, t) >= DUPLICATE_TITLE_THRESHOLD);
}
