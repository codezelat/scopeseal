export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[/\\]+/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

let _normalizedCache: { input: string; output: string } | null = null;

function getNormalized(text: string): string {
  if (_normalizedCache && _normalizedCache.input === text) {
    return _normalizedCache.output;
  }
  const output = normalizeText(text);
  _normalizedCache = { input: text, output };
  return output;
}

export function splitSentences(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  return trimmed
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export interface PhraseMatch {
  index: number;
  before: string;
  after: string;
  negated: boolean;
}

const NEGATION_WORDS = [
  "not",
  "no",
  "without",
  "excluding",
  "isn't",
  "aren't",
  "don't",
  "doesn't",
  "never",
  "n/a",
];

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getNegationWindow(normalizedText: string, position: number): string[] {
  const beforeText = normalizedText.slice(Math.max(0, position - 80), position);
  const tokens = beforeText.split(/\s+/);
  return tokens.slice(-6);
}

export function findPhrase(
  text: string,
  phrase: string,
  options: { negatable?: boolean } = {},
): PhraseMatch[] {
  const { negatable = true } = options;
  const normalized = getNormalized(text);
  const normalizedPhrase = normalizeText(phrase);
  const pattern = new RegExp(`\\b${escapeRegExp(normalizedPhrase)}\\b`, "gi");
  const results: PhraseMatch[] = [];
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(normalized)) !== null) {
    const idx = match.index;
    const before = text.slice(Math.max(0, idx - 40), idx);
    const afterEnd = Math.min(text.length, idx + phrase.length + 40);
    const after = text.slice(idx + phrase.length, afterEnd);

    let negated = false;
    if (negatable) {
      const lastTokens = getNegationWindow(normalized, idx);
      negated = NEGATION_WORDS.some((nw) => lastTokens.includes(nw));
    }

    results.push({ index: idx, before, after, negated });
  }

  return results;
}

export function hasAny(text: string, phrases: string[]): boolean {
  const normalized = getNormalized(text);
  return phrases.some((phrase) => {
    const normalizedPhrase = normalizeText(phrase);
    const pattern = new RegExp(`\\b${escapeRegExp(normalizedPhrase)}\\b`, "i");
    const match = pattern.exec(normalized);
    if (!match) return false;
    const idx = match.index;
    const lastTokens = getNegationWindow(normalized, idx);
    const negated = NEGATION_WORDS.some((nw) => lastTokens.includes(nw));
    return !negated;
  });
}

export function findFirstContext(
  text: string,
  phrases: string[],
  contextChars: number = 80,
): string | null {
  const normalized = getNormalized(text);
  let earliest = -1;
  let matchedPhrase = "";

  for (const phrase of phrases) {
    const normalizedPhrase = normalizeText(phrase);
    const pattern = new RegExp(`\\b${escapeRegExp(normalizedPhrase)}\\b`, "i");
    const match = pattern.exec(normalized);
    if (match && (earliest === -1 || match.index < earliest)) {
      earliest = match.index;
      matchedPhrase = phrase;
    }
  }

  if (earliest === -1) return null;

  const start = Math.max(0, earliest - contextChars);
  const end = Math.min(text.length, earliest + matchedPhrase.length + contextChars);
  let snippet = text.slice(start, end).trim();
  if (start > 0) snippet = "..." + snippet;
  if (end < text.length) snippet = snippet + "...";
  return snippet;
}

export function findQuantity(text: string, nouns: string[]): number | null {
  const normalized = getNormalized(text);
  for (const noun of nouns) {
    const normalizedNoun = normalizeText(noun);
    const adjPattern = new RegExp(`(\\d+)\\s*${escapeRegExp(normalizedNoun)}\\b`, "i");
    const adjMatch = adjPattern.exec(normalized);
    if (adjMatch) {
      return parseInt(adjMatch[1], 10);
    }
  }
  return null;
}
