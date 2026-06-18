import type { CategoryId, ProjectType, ProjectTypeMeta } from "./types";

const defaultWeights: Record<CategoryId, number> = {
  deliverables: 1.0,
  timeline: 1.0,
  revisions: 1.0,
  payment: 1.0,
  client: 1.0,
  technical: 1.0,
  acceptance: 1.0,
  maintenance: 1.0,
  exclusions: 1.0,
};

function w(overrides: Partial<Record<CategoryId, number>>): Record<CategoryId, number> {
  return { ...defaultWeights, ...overrides };
}

export const PROJECT_TYPES: ProjectTypeMeta[] = [
  {
    id: "website",
    label: "Website",
    icon: "Globe",
    blurb: "Marketing sites, landing pages, e-commerce builds",
    weights: w({
      deliverables: 1.2,
      timeline: 1.1,
      technical: 1.3,
      acceptance: 1.2,
      revisions: 1.1,
    }),
  },
  {
    id: "seo",
    label: "SEO",
    icon: "Search",
    blurb: "Search engine optimization campaigns and audits",
    weights: w({
      deliverables: 1.3,
      client: 1.2,
      timeline: 1.1,
      maintenance: 1.1,
    }),
  },
  {
    id: "social",
    label: "Social Media Marketing",
    icon: "Share2",
    blurb: "Social content creation, scheduling, and campaigns",
    weights: w({
      deliverables: 1.3,
      client: 1.3,
      timeline: 1.1,
      revisions: 1.1,
    }),
  },
  {
    id: "branding",
    label: "Branding",
    icon: "Palette",
    blurb: "Logo design, brand identity, style guides",
    weights: w({
      deliverables: 1.3,
      client: 1.3,
      revisions: 1.2,
      acceptance: 1.1,
    }),
  },
  {
    id: "software",
    label: "Custom Software",
    icon: "Code2",
    blurb: "Web apps, APIs, custom development projects",
    weights: w({
      technical: 1.3,
      acceptance: 1.3,
      timeline: 1.2,
      revisions: 1.1,
      exclusions: 1.1,
    }),
  },
  {
    id: "mobile",
    label: "Mobile App",
    icon: "Smartphone",
    blurb: "iOS and Android app development",
    weights: w({
      technical: 1.3,
      acceptance: 1.3,
      timeline: 1.2,
      deliverables: 1.1,
      exclusions: 1.1,
    }),
  },
  {
    id: "maintenance",
    label: "Maintenance / Support",
    icon: "Wrench",
    blurb: "Ongoing support, bug fixes, retainer agreements",
    weights: w({
      maintenance: 1.4,
      exclusions: 1.3,
      technical: 1.2,
      timeline: 1.1,
      deliverables: 1.1,
    }),
  },
  {
    id: "general",
    label: "General Service",
    icon: "Briefcase",
    blurb: "Consulting, design, or other professional services",
    weights: w({
      deliverables: 1.0,
      timeline: 1.0,
      revisions: 1.0,
      payment: 1.0,
      client: 1.0,
      technical: 1.0,
      acceptance: 1.0,
      maintenance: 1.0,
      exclusions: 1.0,
    }),
  },
];

export function getProjectType(id: ProjectType): ProjectTypeMeta {
  const found = PROJECT_TYPES.find((p) => p.id === id);
  if (!found) {
    throw new Error(`Unknown project type: ${id}`);
  }
  return found;
}

export const PROJECT_TYPE_OPTIONS: { value: ProjectType; label: string; blurb: string }[] =
  PROJECT_TYPES.map((p) => ({
    value: p.id,
    label: p.label,
    blurb: p.blurb,
  }));
