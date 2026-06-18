export type ProjectType =
  | "website"
  | "seo"
  | "social"
  | "branding"
  | "software"
  | "mobile"
  | "maintenance"
  | "general";

export type CategoryId =
  | "deliverables"
  | "timeline"
  | "revisions"
  | "payment"
  | "client"
  | "technical"
  | "acceptance"
  | "maintenance"
  | "exclusions";

export type Band = "clear" | "review" | "risky";
export type Severity = "high" | "medium" | "low";

export interface CategoryResult {
  id: CategoryId;
  label: string;
  score: number;
  weight: number;
  note?: string;
}

export interface MissingItem {
  id: string;
  label: string;
  severity: Severity;
  guidance: string;
}

export interface RiskHit {
  phrase: string;
  count: number;
  context: string;
  severity: Severity;
  guidance: string;
}

export interface Outputs {
  internalRiskSummary: string;
  clientFriendlyNote: string;
  proposalAdditionalInfo: string;
  rewrittenScope: string;
}

export interface AnalysisResult {
  score: number;
  band: Band;
  categories: CategoryResult[];
  missing: MissingItem[];
  risks: RiskHit[];
  suggestions: string[];
  outputs: Outputs;
  wordCount: number;
  sensitiveWarning: boolean;
}

export interface ProjectTypeMeta {
  id: ProjectType;
  label: string;
  icon?: string;
  blurb: string;
  weights: Record<CategoryId, number>;
}
