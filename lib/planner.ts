// lib/planner.ts
import type { Entities } from "./entity-extractor";

export type PriorityLevel = "low" | "medium" | "high";

export interface ActionPlan {
  priority: PriorityLevel;
  recommended_action: string;
  suggested_owner: string;
  due_date_suggestion: string | null;
}

export function buildActionPlan(
  docType: string,
  summary: string,
  entities: Entities
): ActionPlan {
  let priority: PriorityLevel = "medium";

  if (docType === "legal" || docType === "finance") {
    priority = "high";
  } else if (docType === "story") {
    priority = "low";
  }

  const hasNames = entities.misc.length > 0;

  const recommended_action = [
    "Review the summary and identify key concepts.",
    docType === "education"
      ? "Convert important points into revision notes or flashcards."
      : "List follow-up questions or clarifications based on this document.",
    hasNames
      ? "Check the mentioned entities and verify their relevance to your work."
      : "Decide whether this document is critical or just reference material.",
    "Plan one concrete next step (meeting, revision, implementation) based on the content."
  ].join(" ");

  const suggested_owner =
    docType === "education"
      ? "Student / Learner"
      : docType === "legal"
      ? "Legal reviewer"
      : docType === "finance"
      ? "Finance/Accounts"
      : "Document owner";

  const due_date_suggestion =
    priority === "high"
      ? "Complete review within 2 days."
      : priority === "medium"
      ? "Complete review within 1 week."
      : "Review when convenient.";

  return {
    priority,
    recommended_action,
    suggested_owner,
    due_date_suggestion
  };
}
