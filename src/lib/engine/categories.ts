import type { CategoryId } from "./types";

export interface SignalGroup {
  key: string;
  patterns: string[];
  primary?: boolean;
}

export interface CategoryDef {
  id: CategoryId;
  label: string;
  signals: SignalGroup[];
}

export const CATEGORIES: CategoryDef[] = [
  {
    id: "deliverables",
    label: "Deliverables",
    signals: [
      {
        key: "items",
        patterns: [
          "pages",
          "page",
          "screens",
          "screen",
          "posts",
          "post",
          "features",
          "feature",
          "sections",
          "section",
        ],
        primary: true,
      },
      {
        key: "design",
        patterns: [
          "design",
          "deliverables",
          "deliverable",
          "wireframe",
          "wireframes",
          "mockup",
          "mockups",
        ],
      },
      {
        key: "campaign",
        patterns: ["campaign", "campaigns"],
      },
      {
        key: "quantified",
        patterns: [
          "per month",
          "per week",
          "monthly",
          "weekly",
          "articles",
          "banners",
          "variations",
        ],
      },
    ],
  },
  {
    id: "timeline",
    label: "Timeline",
    signals: [
      {
        key: "duration",
        patterns: [
          "weeks",
          "week",
          "months",
          "month",
          "days",
          "day",
          "duration",
          "sprint",
          "sprints",
        ],
        primary: true,
      },
      {
        key: "deadline",
        patterns: [
          "deadline",
          "start date",
          "launch",
          "go-live",
          "go live",
          "by",
          "within",
        ],
      },
    ],
  },
  {
    id: "revisions",
    label: "Revisions",
    signals: [
      {
        key: "revision",
        patterns: [
          "revision",
          "revisions",
          "round",
          "rounds",
          "iteration",
          "iterations",
          "amendments",
          "amendment",
        ],
        primary: true,
      },
      {
        key: "feedback",
        patterns: ["feedback cycle", "feedback cycles", "changes", "change"],
      },
    ],
  },
  {
    id: "payment",
    label: "Payment",
    signals: [
      {
        key: "payment",
        patterns: [
          "payment",
          "payments",
          "invoice",
          "invoices",
          "milestone",
          "milestones",
          "deposit",
          "retainer",
          "retainer fee",
        ],
        primary: true,
      },
      {
        key: "currency",
        patterns: ["usd", "$", "%", "upon", "net"],
      },
    ],
  },
  {
    id: "client",
    label: "Client Responsibility",
    signals: [
      {
        key: "content",
        patterns: [
          "content",
          "copy",
          "copywriting",
          "who provides",
          "provided by client",
          "client provides",
        ],
        primary: true,
      },
      {
        key: "assets",
        patterns: ["assets", "brand", "logo", "logos", "images", "photos"],
      },
    ],
  },
  {
    id: "technical",
    label: "Technical Responsibility",
    signals: [
      {
        key: "hosting",
        patterns: [
          "hosting",
          "domain",
          "server",
          "ssl",
          "cdn",
          "dns",
        ],
        primary: true,
      },
      {
        key: "integration",
        patterns: [
          "api",
          "apis",
          "integration",
          "integrations",
          "third-party",
          "third party",
          "plugin",
          "plugins",
        ],
      },
      {
        key: "stack",
        patterns: [
          "license",
          "licenses",
          "subscription",
          "subscriptions",
          "tech stack",
          "framework",
          "frameworks",
        ],
      },
    ],
  },
  {
    id: "acceptance",
    label: "Acceptance",
    signals: [
      {
        key: "approval",
        patterns: [
          "acceptance",
          "sign-off",
          "sign off",
          "approval",
          "approvals",
          "handover",
          "hand-over",
        ],
        primary: true,
      },
      {
        key: "testing",
        patterns: ["uat", "go-live criteria", "testing", "test", "review"],
      },
    ],
  },
  {
    id: "maintenance",
    label: "Maintenance / Support",
    signals: [
      {
        key: "support",
        patterns: [
          "support",
          "warranty",
          "maintenance",
          "bug fix",
          "bug fixes",
          "post-launch",
          "post launch",
        ],
        primary: true,
      },
      {
        key: "period",
        patterns: [
          "months of support",
          "months of maintenance",
          "retainer",
          "ongoing",
        ],
      },
    ],
  },
  {
    id: "exclusions",
    label: "Exclusions",
    signals: [
      {
        key: "out_of_scope",
        patterns: [
          "out of scope",
          "excluded",
          "exclusions",
          "exclusion",
          "not included",
          "scope creep",
        ],
        primary: true,
      },
      {
        key: "change_request",
        patterns: [
          "change request",
          "change requests",
          "additional work",
          "additional cost",
          "extra work",
        ],
      },
    ],
  },
];
