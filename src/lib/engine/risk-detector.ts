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
    guidance: '"{phrase}" can signal loose scope. Define specific requirements and acceptance criteria.',
  },
  {
    phrase: "quick",
    severity: "medium",
    guidance: '"{phrase}" can signal loose scope. Define a specific timeline and milestones.',
  },
  {
    phrase: "small change",
    severity: "medium",
    guidance: '"{phrase}" can signal loose scope. Define the exact changes expected.',
  },
  {
    phrase: "minor edit",
    severity: "low",
    guidance: '"{phrase}" can signal loose scope. Specify what edits are included.',
  },
  {
    phrase: "basic website",
    severity: "medium",
    guidance: '"{phrase}" can signal loose scope. List specific pages and features.',
  },
  {
    phrase: "as needed",
    severity: "medium",
    guidance: '"{phrase}" can signal loose scope. Define a specific limit or schedule.',
  },
  {
    phrase: "unlimited",
    severity: "high",
    guidance: '"{phrase}" can signal loose scope. Define a specific limit.',
  },
  {
    phrase: "ongoing support",
    severity: "medium",
    guidance: '"{phrase}" can signal loose scope. Define duration, hours, and response times.',
  },
  {
    phrase: "final changes",
    severity: "low",
    guidance: '"{phrase}" can signal loose scope. Define what "final" means and when it applies.',
  },
  {
    phrase: "everything included",
    severity: "high",
    guidance: '"{phrase}" can signal loose scope. List each included item explicitly.',
  },
  {
    phrase: "make it like",
    severity: "medium",
    guidance: '"{phrase}" can signal loose scope. Define specific requirements instead of referencing others.',
  },
  {
    phrase: "same as the competitor",
    severity: "medium",
    guidance: '"{phrase}" can signal loose scope. Define specific features and requirements.',
  },
  {
    phrase: "same as competitor",
    severity: "medium",
    guidance: '"{phrase}" can signal loose scope. Define specific features and requirements.',
  },
  {
    phrase: "just one page",
    severity: "low",
    guidance: '"{phrase}" can signal loose scope. Define page sections and content requirements.',
  },
  {
    phrase: "add later",
    severity: "medium",
    guidance: '"{phrase}" can signal loose scope. Define what will be added and when.',
  },
  {
    phrase: "we can decide after",
    severity: "medium",
    guidance: '"{phrase}" can signal loose scope. Decide key requirements before starting.',
  },
  {
    phrase: "asap",
    severity: "medium",
    guidance: '"{phrase}" can signal urgency without a clear deadline. Define a specific date.',
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
