import type { MissingItem, ProjectType, RiskHit } from "./types";

export function buildSuggestions(
  missing: MissingItem[],
  risks: RiskHit[],
  _projectType: ProjectType, // eslint-disable-line @typescript-eslint/no-unused-vars
): string[] {
  const suggestions: string[] = [];

  const highMissing = missing.filter((m) => m.severity === "high");
  const mediumMissing = missing.filter((m) => m.severity === "medium");

  for (const item of highMissing) {
    suggestions.push(item.guidance);
  }

  const highRisks = risks.filter((r) => r.severity === "high");
  const mediumRisks = risks.filter((r) => r.severity === "medium");

  for (const risk of highRisks) {
    if (suggestions.length < 8) {
      suggestions.push(risk.guidance);
    }
  }

  for (const item of mediumMissing) {
    if (suggestions.length < 8) {
      suggestions.push(item.guidance);
    }
  }

  for (const risk of mediumRisks) {
    if (suggestions.length < 8) {
      suggestions.push(risk.guidance);
    }
  }

  return suggestions.slice(0, 8);
}
