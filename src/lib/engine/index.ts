import type { AnalysisResult, ProjectType } from "./types";
import { CATEGORIES } from "./categories";
import { getProjectType } from "./project-types";
import { countWords } from "./text-utils";
import { detectMissingItems } from "./missing-items";
import { detectRisks } from "./risk-detector";
import { scoreCategory, computeOverall, bandFor } from "./scoring";
import { buildSuggestions } from "./suggestions";
import { buildOutputs } from "./outputs";
import { hasSensitiveContent } from "./sensitive";

export function analyze(text: string, projectType: ProjectType): AnalysisResult {
  const trimmed = text.trim();

  if (!trimmed) {
    const emptyCategories = CATEGORIES.map((cat) => ({
      id: cat.id,
      label: cat.label,
      score: 0,
      weight: 1,
    }));
    return {
      score: 0,
      band: "risky",
      categories: emptyCategories,
      missing: detectMissingItems("", projectType),
      risks: [],
      suggestions: [],
      outputs: {
        internalRiskSummary: "No scope text provided.",
        clientFriendlyNote: "No scope text was provided for analysis.",
        proposalAdditionalInfo: "No scope text provided.",
        rewrittenScope: "No scope text provided.",
      },
      wordCount: 0,
      sensitiveWarning: false,
    };
  }

  const wordCount = countWords(trimmed);
  const ptMeta = getProjectType(projectType);
  const risks = detectRisks(trimmed);
  const missing = detectMissingItems(trimmed, projectType);

  const categories = CATEGORIES.map((cat) => {
    const weight = ptMeta.weights[cat.id];
    return scoreCategory(cat, trimmed, weight, risks);
  });

  const score = computeOverall(categories);
  const band = bandFor(score);
  const suggestions = buildSuggestions(missing, risks, projectType);
  const outputs = buildOutputs({
    categories,
    missing,
    risks,
    projectType,
    score,
    band,
  });
  const sensitiveWarning = hasSensitiveContent(trimmed);

  return {
    score,
    band,
    categories,
    missing,
    risks,
    suggestions,
    outputs,
    wordCount,
    sensitiveWarning,
  };
}

export type {
  ProjectType,
  CategoryId,
  Band,
  Severity,
  CategoryResult,
  MissingItem,
  RiskHit,
  Outputs,
  AnalysisResult,
  ProjectTypeMeta,
} from "./types";

export { PROJECT_TYPES, getProjectType, PROJECT_TYPE_OPTIONS } from "./project-types";
export { CATEGORIES } from "./categories";
export { detectMissingItems } from "./missing-items";
export { detectRisks } from "./risk-detector";
export { hasSensitiveContent } from "./sensitive";
