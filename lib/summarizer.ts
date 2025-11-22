// lib/summarizer.ts

export function summarizeText(text: string, maxSentences: number = 5): string {
  const cleaned = text
    .replace(/\s+/g, " ")
    .replace(/\n+/g, " ")
    .trim();

  if (!cleaned) return "No content to summarize.";

  const sentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.length > 0);

  if (sentences.length <= maxSentences) {
    return sentences.join(" ");
  }

  return sentences.slice(0, maxSentences).join(" ");
}
