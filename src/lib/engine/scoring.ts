import type { Band, CategoryId, CategoryResult, RiskHit } from "./types";
import type { CategoryDef } from "./categories";
import { hasAny } from "./text-utils";

export function scoreCategory(
  cat: CategoryDef,
  text: string,
  weight: number,
  risks: RiskHit[],
): CategoryResult {
  const totalSignals = cat.signals.length;
  if (totalSignals === 0) {
    return { id: cat.id, label: cat.label, score: 0, weight };
  }

  let found = 0;
  let primaryFound = false;
  let secondaryFound = 0;

  for (const signal of cat.signals) {
    if (hasAny(text, signal.patterns)) {
      found++;
      if (signal.primary) {
        primaryFound = true;
      } else {
        secondaryFound++;
      }
    }
  }

  let score: number;

  if (found === 0) {
    score = 0;
  } else if (primaryFound) {
    const secondaryCount = cat.signals.filter((s) => !s.primary).length;
    let bonus = 0;
    if (secondaryCount > 0 && secondaryFound > 0) {
      const diminishingFactors = [1.0, 0.6, 0.4, 0.3, 0.2];
      for (let i = 0; i < Math.min(secondaryFound, diminishingFactors.length); i++) {
        bonus += diminishingFactors[i];
      }
      bonus = Math.min(bonus, 1.0);
    }
    score = Math.round(78 + bonus * 18);
  } else {
    const proportion = found / totalSignals;
    score = Math.round(proportion * 60);
  }

  const categoryRiskPhrases = getCategoryRiskPhrases(cat.id);
  const riskCount = risks
    .filter((r) =>
      categoryRiskPhrases.some((p) => r.phrase.toLowerCase().includes(p)),
    )
    .reduce((sum, r) => sum + r.count, 0);

  if (riskCount > 0) {
    const riskPenalty = Math.min(12, riskCount * 3);
    score = Math.max(0, score - riskPenalty);
  }

  score = Math.min(100, Math.max(0, score));

  let note: string | undefined;
  if (score < 40) {
    note = `This category needs attention — only ${found} of ${totalSignals} signal groups detected.`;
  } else if (score < 70) {
    note = `Partial coverage — ${found} of ${totalSignals} signal groups detected.`;
  }

  return { id: cat.id, label: cat.label, score, weight, note };
}

function getCategoryRiskPhrases(catId: CategoryId): string[] {
  switch (catId) {
    case "deliverables":
      return ["simple", "basic website", "just one page", "everything included"];
    case "timeline":
      return ["quick", "asap", "as needed"];
    case "revisions":
      return ["unlimited", "final changes", "small change", "minor edit"];
    case "payment":
      return [];
    case "client":
      return ["as needed", "we can decide after"];
    case "technical":
      return ["simple", "basic website"];
    case "acceptance":
      return ["final changes", "everything included"];
    case "maintenance":
      return ["ongoing support", "unlimited"];
    case "exclusions":
      return ["add later", "we can decide after"];
    default:
      return [];
  }
}

export function computeOverall(categories: CategoryResult[]): number {
  const totalWeight = categories.reduce((sum, c) => sum + c.weight, 0);
  if (totalWeight === 0) return 0;

  const weightedSum = categories.reduce(
    (sum, c) => sum + c.score * c.weight,
    0,
  );

  return Math.min(100, Math.max(0, Math.round(weightedSum / totalWeight)));
}

export function bandFor(score: number): Band {
  if (score >= 70) return "clear";
  if (score >= 40) return "review";
  return "risky";
}
