import type { CategoryId, MissingItem, ProjectType } from "./types";
import { getProjectType } from "./project-types";
import { hasAny, findQuantity } from "./text-utils";

interface MissingItemDef {
  id: string;
  label: string;
  defaultSeverity: "high" | "medium" | "low";
  category: CategoryId;
  patterns: string[];
  guidance: string;
  primaryNouns?: string[];
}

const MISSING_ITEM_DEFS: MissingItemDef[] = [
  {
    id: "final-deliverables",
    label: "Final deliverables",
    defaultSeverity: "high",
    category: "deliverables",
    patterns: [
      "deliverable",
      "deliverables",
      "final design",
      "final files",
      "handoff",
      "hand-off",
      "hand-over",
      "file delivery",
      "source files",
    ],
    guidance:
      "Clearly list what will be delivered at project completion (e.g., source files, exported assets, documentation).",
    primaryNouns: [
      "page",
      "pages",
      "screen",
      "screens",
      "post",
      "posts",
      "feature",
      "features",
      "website",
      "site",
      "app",
      "application",
    ],
  },
  {
    id: "timeline-deadline",
    label: "Timeline / deadline",
    defaultSeverity: "high",
    category: "timeline",
    patterns: [
      "timeline",
      "deadline",
      "start date",
      "launch date",
      "go-live",
      "go live",
      "completion date",
      "duration",
      "weeks",
      "months",
    ],
    guidance:
      "Define a clear timeline with milestones and a final delivery date.",
  },
  {
    id: "quantified-deliverables",
    label: "Number of pages/screens/posts/features",
    defaultSeverity: "medium",
    category: "deliverables",
    patterns: [
      "pages",
      "page",
      "screens",
      "screen",
      "posts",
      "features",
      "sections",
      "modules",
      "views",
    ],
    guidance:
      "Specify the exact quantity of deliverables (e.g., 5 pages, 3 screens, 8 posts per month).",
  },
  {
    id: "revision-limits",
    label: "Revision limits",
    defaultSeverity: "high",
    category: "revisions",
    patterns: [
      "revision",
      "revisions",
      "round",
      "rounds",
      "iteration",
      "feedback cycle",
      "amendments",
    ],
    guidance:
      "State how many revision rounds are included and what happens beyond that limit.",
  },
  {
    id: "payment-milestones",
    label: "Payment milestones",
    defaultSeverity: "high",
    category: "payment",
    patterns: [
      "payment",
      "milestone",
      "deposit",
      "invoice",
      "retainer",
      "%",
      "upon signing",
      "upon completion",
      "net",
    ],
    guidance:
      "Define payment milestones (e.g., 50% upfront, 50% on delivery) with clear triggers.",
  },
  {
    id: "content-responsibility",
    label: "Content responsibility",
    defaultSeverity: "medium",
    category: "client",
    patterns: [
      "content",
      "copy",
      "copywriting",
      "who provides",
      "client provides",
      "provided by client",
      "text",
    ],
    guidance:
      "Clarify who is responsible for providing content (text, images, copy) and by when.",
  },
  {
    id: "brand-assets-responsibility",
    label: "Brand/assets responsibility",
    defaultSeverity: "medium",
    category: "client",
    patterns: [
      "brand",
      "logo",
      "assets",
      "brand guidelines",
      "style guide",
      "brand kit",
      "images",
      "photos",
    ],
    guidance:
      "Specify who provides brand assets (logo, fonts, color codes) and in what format.",
  },
  {
    id: "hosting-domain-responsibility",
    label: "Hosting/domain responsibility",
    defaultSeverity: "medium",
    category: "technical",
    patterns: [
      "hosting",
      "domain",
      "server",
      "ssl",
      "cdn",
      "dns",
      "deployment",
    ],
    guidance:
      "Clarify who manages hosting, domain registration, SSL certificates, and related costs.",
  },
  {
    id: "third-party-responsibility",
    label: "Third-party tool/subscription responsibility",
    defaultSeverity: "medium",
    category: "technical",
    patterns: [
      "third-party",
      "third party",
      "plugin",
      "license",
      "subscription",
      "api key",
      "external service",
    ],
    guidance:
      "List all third-party tools/services needed and clarify who pays for and manages each.",
  },
  {
    id: "support-period",
    label: "Support period",
    defaultSeverity: "medium",
    category: "maintenance",
    patterns: [
      "support",
      "post-launch",
      "post launch",
      "warranty",
      "bug fix",
      "bug fixes",
    ],
    guidance:
      "Define the post-launch support period, response times, and what's covered.",
  },
  {
    id: "maintenance-terms",
    label: "Maintenance terms",
    defaultSeverity: "medium",
    category: "maintenance",
    patterns: [
      "maintenance",
      "retainer",
      "ongoing support",
      "monthly support",
      "updates",
    ],
    guidance:
      "Outline maintenance terms: scope, frequency, cost, and what's included vs. extra.",
  },
  {
    id: "acceptance-criteria",
    label: "Acceptance criteria",
    defaultSeverity: "medium",
    category: "acceptance",
    patterns: [
      "acceptance",
      "sign-off",
      "sign off",
      "approval",
      "handover",
      "uat",
      "go-live criteria",
      "testing",
    ],
    guidance:
      "Define clear acceptance criteria so both parties know when the project is complete.",
  },
  {
    id: "out-of-scope",
    label: "Out-of-scope items",
    defaultSeverity: "medium",
    category: "exclusions",
    patterns: [
      "out of scope",
      "excluded",
      "exclusions",
      "not included",
      "scope creep",
      "beyond scope",
    ],
    guidance:
      "Explicitly list what is NOT included to prevent scope creep and disputes.",
  },
  {
    id: "change-request-process",
    label: "Change request process",
    defaultSeverity: "low",
    category: "exclusions",
    patterns: [
      "change request",
      "additional work",
      "extra work",
      "additional cost",
      "scope change",
      "amendment",
    ],
    guidance:
      "Define the process for handling change requests (approval, pricing, timeline impact).",
  },
  {
    id: "communication-channel",
    label: "Communication channel",
    defaultSeverity: "low",
    category: "client",
    patterns: [
      "communication",
      "meeting",
      "meetings",
      "check-in",
      "check in",
      "standup",
      "stand-up",
      "update",
      "updates",
      "email",
      "slack",
    ],
    guidance:
      "Agree on communication channels, meeting frequency, and response time expectations.",
  },
];

export function detectMissingItems(
  text: string,
  projectType: ProjectType,
): MissingItem[] {
  const ptMeta = getProjectType(projectType);
  const missing: MissingItem[] = [];

  for (const def of MISSING_ITEM_DEFS) {
    let found = hasAny(text, def.patterns);

    if (!found && def.id === "final-deliverables" && def.primaryNouns) {
      const quantity = findQuantity(text, def.primaryNouns);
      if (quantity !== null) {
        found = true;
      }
      if (!found) {
        found = hasAny(text, def.primaryNouns);
      }
    }

    if (!found) {
      let severity = def.defaultSeverity;
      const catWeight = ptMeta.weights[def.category];
      if (catWeight >= 1.3 && severity === "medium") {
        severity = "high";
      }

      missing.push({
        id: def.id,
        label: def.label,
        severity,
        guidance: def.guidance,
      });
    }
  }

  return missing;
}
