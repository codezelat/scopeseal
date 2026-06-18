import type { RiskHit, Severity } from "./types";
import { findPhrase, findFirstContext } from "./text-utils";

interface RiskyPhraseDef {
  phrase: string;
  severity: Severity;
  guidance: string;
}

const RISKY_PHRASES: RiskyPhraseDef[] = [
  {
    phrase: "simple",
    severity: "medium",
    guidance: '"{phrase}" can signal loose scope — define specific requirements and acceptance criteria.',
  },
  {
    phrase: "quick",
    severity: "medium",
    guidance: '"{phrase}" can signal loose scope — define a specific timeline and milestones.',
  },
  {
    phrase: "small change",
    severity: "medium",
    guidance: '"{phrase}" can signal loose scope — define the exact changes expected.',
  },
  {
    phrase: "minor edit",
    severity: "low",
    guidance: '"{phrase}" can signal loose scope — specify what edits are included.',
  },
  {
    phrase: "basic website",
    severity: "medium",
    guidance: '"{phrase}" can signal loose scope — list specific pages and features.',
  },
  {
    phrase: "as needed",
    severity: "medium",
    guidance: '"{phrase}" can signal loose scope — define a specific limit or schedule.',
  },
  {
    phrase: "unlimited",
    severity: "high",
    guidance: '"{phrase}" can signal loose scope — define a specific limit.',
  },
  {
    phrase: "ongoing support",
    severity: "medium",
    guidance: '"{phrase}" can signal loose scope — define duration, hours, and response times.',
  },
  {
    phrase: "final changes",
    severity: "low",
    guidance: '"{phrase}" can signal loose scope — define what "final" means and when it applies.',
  },
  {
    phrase: "everything included",
    severity: "high",
    guidance: '"{phrase}" can signal loose scope — list each included item explicitly.',
  },
  {
    phrase: "make it like",
    severity: "medium",
    guidance: '"{phrase}" can signal loose scope — define specific requirements instead of referencing others.',
  },
  {
    phrase: "same as the competitor",
    severity: "medium",
    guidance: '"{phrase}" can signal loose scope — define specific features and requirements.',
  },
  {
    phrase: "same as competitor",
    severity: "medium",
    guidance: '"{phrase}" can signal loose scope — define specific features and requirements.',
  },
  {
    phrase: "just one page",
    severity: "low",
    guidance: '"{phrase}" can signal loose scope — define page sections and content requirements.',
  },
  {
    phrase: "add later",
    severity: "medium",
    guidance: '"{phrase}" can signal loose scope — define what will be added and when.',
  },
  {
    phrase: "we can decide after",
    severity: "medium",
    guidance: '"{phrase}" can signal loose scope — decide key requirements before starting.',
  },
  {
    phrase: "asap",
    severity: "medium",
    guidance: '"{phrase}" can signal urgency without a clear deadline — define a specific date.',
  },
];

export function detectRisks(text: string): RiskHit[] {
  const hits: RiskHit[] = [];

  for (const def of RISKY_PHRASES) {
    const matches = findPhrase(text, def.phrase, { negatable: true });
    const nonNegated = matches.filter((m) => !m.negated);

    if (nonNegated.length > 0) {
      const context = findFirstContext(text, [def.phrase], 60) ?? "";
      hits.push({
        phrase: def.phrase,
        count: nonNegated.length,
        context,
        severity: def.severity,
        guidance: def.guidance.replace("{phrase}", def.phrase),
      });
    }
  }

  return hits;
}
