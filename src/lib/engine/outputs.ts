import type {
  CategoryResult,
  MissingItem,
  Outputs,
  ProjectType,
  RiskHit,
} from "./types";
import { getProjectType } from "./project-types";

export function buildOutputs(params: {
  categories: CategoryResult[];
  missing: MissingItem[];
  risks: RiskHit[];
  projectType: ProjectType;
  score: number;
  band: string;
}): Outputs {
  const { categories, missing, risks, projectType, score, band } = params;
  const pt = getProjectType(projectType);

  return {
    internalRiskSummary: buildInternalRiskSummary(
      categories,
      missing,
      risks,
      pt.label,
      score,
      band,
    ),
    clientFriendlyNote: buildClientFriendlyNote(missing, risks, pt.label),
    proposalAdditionalInfo: buildProposalAdditionalInfo(missing, risks),
    rewrittenScope: buildRewrittenScope(missing, pt.label, projectType),
  };
}

function bandLabel(band: string): string {
  switch (band) {
    case "clear":
      return "Clear";
    case "review":
      return "Needs Review";
    case "risky":
      return "Risky";
    default:
      return band;
  }
}

function buildInternalRiskSummary(
  categories: CategoryResult[],
  missing: MissingItem[],
  risks: RiskHit[],
  ptLabel: string,
  score: number,
  band: string,
): string {
  const parts: string[] = [];

  parts.push(
    `${ptLabel} scope scored ${score}/100 (${bandLabel(band)}).`,
  );

  const weakCats = categories
    .filter((c) => c.score < 50)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  if (weakCats.length > 0) {
    const names = weakCats.map((c) => c.label).join(", ");
    parts.push(`Weakest areas: ${names}.`);
  }

  const highMissing = missing.filter((m) => m.severity === "high");
  if (highMissing.length > 0) {
    parts.push(
      `${highMissing.length} high-severity item(s) missing: ${highMissing.map((m) => m.label).join(", ")}.`,
    );
  }

  if (risks.length > 0) {
    const topRisks = risks
      .sort((a, b) => {
        const sev = { high: 3, medium: 2, low: 1 };
        return sev[b.severity] - sev[a.severity];
      })
      .slice(0, 3)
      .map((r) => `"${r.phrase}" (${r.count}x)`);
    parts.push(`Top risky phrases: ${topRisks.join(", ")}.`);
  }

  return parts.join(" ");
}

function buildClientFriendlyNote(
  missing: MissingItem[],
  risks: RiskHit[],
  ptLabel: string,
): string {
  const parts: string[] = [];

  parts.push(
    `Thank you for sharing the ${ptLabel.toLowerCase()} scope. To ensure a smooth project, we recommend clarifying a few details:`,
  );

  const keyItems = missing
    .filter((m) => m.severity === "high" || m.severity === "medium")
    .slice(0, 4);

  if (keyItems.length > 0) {
    const points = keyItems.map((m) => m.label.toLowerCase()).join(", ");
    parts.push(
      `Specifically, the scope could benefit from more detail on ${points}.`,
    );
  }

  if (risks.length > 0) {
    parts.push(
      `Some phrasing may be open to interpretation — defining specifics will help avoid misunderstandings.`,
    );
  }

  parts.push(
    `These are suggestions to strengthen the scope, not requirements. We are happy to help refine it together.`,
  );

  return parts.join(" ");
}

function buildProposalAdditionalInfo(
  missing: MissingItem[],
  risks: RiskHit[],
): string {
  const lines: string[] = [];
  lines.push("**Additional Information**\n");

  const keyMissing = missing
    .filter((m) => m.severity === "high" || m.severity === "medium")
    .slice(0, 6);

  if (keyMissing.length > 0) {
    lines.push("**Clarifications needed:**");
    for (const item of keyMissing) {
      lines.push(`- ${item.label}: ${item.guidance}`);
    }
    lines.push("");
  }

  if (risks.length > 0) {
    lines.push("**Wording to reconsider:**");
    for (const risk of risks.slice(0, 4)) {
      lines.push(`- ${risk.guidance}`);
    }
    lines.push("");
  }

  if (keyMissing.length === 0 && risks.length === 0) {
    lines.push(
      "The scope appears well-defined. No additional clarifications needed at this time.",
    );
  }

  return lines.join("\n");
}

function buildRewrittenScope(
  missing: MissingItem[],
  ptLabel: string,
  projectType: ProjectType,
): string {
  const lines: string[] = [];
  lines.push(`## ${ptLabel} Scope\n`);

  const sections = getScopeSections(projectType);

  for (const section of sections) {
    const relatedMissing = missing.filter((m) =>
      section.missingIds.includes(m.id),
    );

    lines.push(`**${section.title}:**`);
    if (relatedMissing.length > 0) {
      lines.push(`___ (${section.placeholder})`);
    } else {
      lines.push(section.defaultText);
    }
    lines.push("");
  }

  const unaddressed = missing.filter(
    (m) => !sections.some((s) => s.missingIds.includes(m.id)),
  );

  if (unaddressed.length > 0) {
    lines.push("**Additional items to address:**");
    for (const item of unaddressed) {
      lines.push(`- ${item.label}: ___`);
    }
  }

  return lines.join("\n");
}

interface ScopeSection {
  title: string;
  missingIds: string[];
  placeholder: string;
  defaultText: string;
}

function getScopeSections(projectType: ProjectType): ScopeSection[] {
  const base: ScopeSection[] = [
    {
      title: "Deliverables",
      missingIds: ["final-deliverables", "quantified-deliverables"],
      placeholder: "List specific deliverables with quantities",
      defaultText: "As defined in the scope document.",
    },
    {
      title: "Timeline",
      missingIds: ["timeline-deadline"],
      placeholder: "e.g., 6 weeks from project start, with milestones",
      defaultText: "Timeline as agreed upon project kickoff.",
    },
    {
      title: "Revisions",
      missingIds: ["revision-limits"],
      placeholder: "e.g., 2 rounds of revisions per deliverable",
      defaultText: "Revision rounds as specified in the agreement.",
    },
    {
      title: "Payment",
      missingIds: ["payment-milestones"],
      placeholder: "e.g., 50% upfront, 50% on completion",
      defaultText: "Payment terms as per the signed agreement.",
    },
    {
      title: "Client Responsibilities",
      missingIds: [
        "content-responsibility",
        "brand-assets-responsibility",
        "communication-channel",
      ],
      placeholder: "List content, assets, and feedback the client provides",
      defaultText: "Client to provide necessary assets and feedback as scheduled.",
    },
    {
      title: "Technical",
      missingIds: ["hosting-domain-responsibility", "third-party-responsibility"],
      placeholder: "Hosting, domain, third-party tools — who manages and pays",
      defaultText: "Technical infrastructure as agreed in the proposal.",
    },
    {
      title: "Acceptance",
      missingIds: ["acceptance-criteria"],
      placeholder: "Define testing and sign-off criteria",
      defaultText: "Acceptance criteria as outlined in the project plan.",
    },
    {
      title: "Maintenance & Support",
      missingIds: ["support-period", "maintenance-terms"],
      placeholder: "e.g., 30 days post-launch support, then monthly retainer",
      defaultText: "Post-launch support as per the maintenance agreement.",
    },
    {
      title: "Exclusions",
      missingIds: ["out-of-scope", "change-request-process"],
      placeholder: "List items explicitly NOT included",
      defaultText: "Out-of-scope items as listed in the agreement.",
    },
  ];

  if (projectType === "maintenance") {
    return base.filter(
      (s) =>
        s.title !== "Deliverables" ||
        s.missingIds.some((id) =>
          ["support-period", "maintenance-terms"].includes(id),
        ),
    );
  }

  return base;
}
