// lib/classifier.ts
import { hfRequest } from "./hf";

interface ZeroShotResult {
  labels: string[];
  scores: number[];
  sequence: string;
}

const CANDIDATE_LABELS = [
  "education",
  "legal",
  "medical",
  "finance",
  "story",
  "research",
  "technical",
  "other"
];

function localHeuristicType(text: string): string {
  const lower = text.toLowerCase();

  if (lower.includes("chapter") || lower.includes("unit") || lower.includes("syllabus")) {
    return "education";
  }
  if (lower.includes("section") && lower.includes("act")) {
    return "legal";
  }
  if (lower.includes("dataset") || lower.includes("experiment") || lower.includes("methodology")) {
    return "research";
  }
  if (lower.includes("invoice") || lower.includes("amount") || lower.includes("payment")) {
    return "finance";
  }
  if (lower.includes("once upon a time") || lower.includes("story")) {
    return "story";
  }
  return "other";
}

export async function classifyDocumentType(text: string): Promise<string> {
  const snippet = text.slice(0, 1000);
  let docType = localHeuristicType(snippet);

  try {
    const result = await hfRequest<ZeroShotResult[]>(
      "facebook/bart-large-mnli",
      {
        inputs: snippet,
        parameters: {
          candidate_labels: CANDIDATE_LABELS,
          multi_label: false
        }
      }
    );

    if (
      Array.isArray(result) &&
      result.length > 0 &&
      result[0].labels &&
      result[0].labels.length > 0
    ) {
      docType = result[0].labels[0];
    }
  } catch {
  }

  return docType;
}
