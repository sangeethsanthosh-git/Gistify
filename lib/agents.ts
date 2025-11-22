// lib/agents.ts
import { classifyDocumentType } from "./classifier";
import { summarizeText } from "./summarizer";
import { extractEntities, Entities } from "./entity-extractor";
import { buildActionPlan, ActionPlan } from "./planner";

export interface AnalysisResult {
  type: string;
  summary: string;
  entities: Entities;
  action_plan: ActionPlan;
}

export async function analyzeDocument(text: string): Promise<AnalysisResult> {
  let workingText = text;
  if (workingText.length > 12000) {
    workingText = workingText.slice(0, 12000);
  }

  const [docType, summary] = await Promise.all([
    classifyDocumentType(workingText),
    Promise.resolve(summarizeText(workingText, 5))
  ]);

  const entities = extractEntities(workingText);
  const actionPlan = buildActionPlan(docType, summary, entities);

  return {
    type: docType,
    summary,
    entities,
    action_plan: actionPlan
  };
}
