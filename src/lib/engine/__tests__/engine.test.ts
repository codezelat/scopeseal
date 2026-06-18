import { describe, it, expect } from "vitest";
import { analyze } from "../index";
import type { ProjectType } from "../types";
import { PROJECT_TYPES, getProjectType } from "../project-types";
import { detectRisks } from "../risk-detector";
import { detectMissingItems } from "../missing-items";
import { hasSensitiveContent } from "../sensitive";
import { countWords, splitSentences, findPhrase, hasAny } from "../text-utils";

const VAGUE_WEBSITE = `We need a simple website. It should be quick to build. Just a basic website with some pages. We'll figure out the details later. Make it like our competitor's site. Handle everything for us.`;

const DETAILED_WEBSITE = `Project: Corporate Website Redesign

Deliverables:
- 8-page responsive website (Home, About, Services, Blog, Contact, FAQ, Team, Careers)
- Desktop and mobile wireframes for all pages
- High-fidelity mockups with 2 design concepts for homepage
- Final source files in Figma format

Timeline: 8 weeks from project kickoff
- Week 1-2: Discovery and wireframes
- Week 3-4: Visual design
- Week 5-6: Development
- Week 7: Testing and QA
- Week 8: Launch and handover

Revisions: 2 rounds of revisions per deliverable. Additional rounds billed at $150/hour.

Payment:
- 40% upon contract signing ($12,000)
- 30% upon design approval ($9,000)
- 30% upon final delivery ($9,000)
- Total project cost: $30,000
- Net 15 payment terms

Client Responsibilities:
- Provide all brand assets (logo, brand guidelines, color codes) within 5 business days
- Provide website copy and images for all pages
- Designate a single point of contact for feedback
- Weekly check-in meetings every Tuesday at 2pm

Technical:
- Hosting on AWS (client-provided, we will configure)
- Domain already registered (client manages DNS)
- SSL certificate via Let's Encrypt (we will install)
- Third-party: Google Analytics, Mailchimp integration (client provides API keys)

Acceptance:
- UAT period of 5 business days after staging delivery
- Sign-off required before launch
- Go-live criteria: all pages functional, forms working, mobile responsive

Maintenance:
- 30 days of post-launch bug-fix support included
- Optional monthly maintenance retainer: $500/month

Exclusions:
- Content writing or copywriting
- Photography or videography
- SEO optimization beyond basic meta tags
- E-commerce functionality
- Multi-language support
- Any features not listed above require a change request`;

const SEO_MONTHLY = `Monthly SEO Package

Deliverables:
- Monthly keyword research report (20 keywords)
- 4 blog articles per month (1,500 words each)
- Monthly performance report with rankings, traffic, and recommendations
- Technical SEO audit quarterly
- 10 backlinks per month from DA30+ sites

Timeline: 6-month minimum commitment, month-to-month after
- Reports delivered by the 5th of each month
- Articles published on the 10th, 15th, 20th, 25th

Revisions: 1 round of revisions per article

Payment: $3,000/month, invoiced on the 1st, net 15

Client Responsibilities:
- Provide access to Google Analytics, Google Search Console
- Provide target keywords and topics
- Approve article outlines within 3 business days

Technical:
- Client manages hosting and CMS access
- We use Ahrefs, SEMrush, and Surfer SEO for analysis

Acceptance:
- Monthly review call to discuss performance
- Quarterly strategy review

Exclusions:
- Paid advertising (Google Ads, Facebook Ads)
- Social media management
- Website development or design changes
- Content for pages other than blog posts`;

const SOCIAL_MEDIA = `Social Media Marketing Package

Platforms: Instagram, Facebook, LinkedIn

Deliverables:
- 12 posts per month per platform (36 total)
- Custom graphics for each post
- Content calendar delivered 2 weeks in advance
- Hashtag research and strategy
- Monthly analytics report

Timeline: 3-month minimum, ongoing monthly after

Revisions: 2 rounds of revisions per content calendar

Payment: $2,500/month, due on the 1st

Client Responsibilities:
- Provide brand assets, product photos, and access to social accounts
- Approve content calendar within 48 hours
- Provide timely responses for trending content opportunities

Exclusions:
- Paid social advertising
- Influencer outreach
- Video production
- Community management beyond scheduled posts`;

const SOFTWARE_FEATURE = `Custom CRM Software Development

Features:
- Contact management with custom fields
- Deal pipeline with drag-and-drop stages
- Email integration (Gmail, Outlook)
- Reporting dashboard with charts
- User roles and permissions (Admin, Manager, User)
- API for third-party integrations

Technology: React frontend, Node.js backend, PostgreSQL database
Hosting: AWS (we manage)

Timeline: 16 weeks
- Weeks 1-3: Requirements and architecture
- Weeks 4-8: Backend development
- Weeks 9-13: Frontend development
- Weeks 14-15: Testing and QA
- Week 16: Deployment and training

Revisions: Iterative development with sprint reviews every 2 weeks

Payment:
- 25% at project start
- 25% after backend complete
- 25% after frontend complete
- 25% after deployment and training

Acceptance:
- 2-week UAT period
- Acceptance criteria defined per feature
- Bug severity classification (Critical: 24hr, High: 48hr, Low: 1 week)

Maintenance: 90-day warranty period for bug fixes

Exclusions:
- Mobile app development
- Data migration from existing systems
- Third-party API costs
- Advanced AI/ML features`;

const MAINTENANCE_REQ = `Website Maintenance and Support Agreement

Scope: Ongoing maintenance for existing WordPress website

Deliverables:
- Monthly WordPress core and plugin updates
- Daily automated backups
- Uptime monitoring (24/7)
- Security scanning monthly
- Performance optimization quarterly
- Monthly report on updates and uptime

Support:
- Email support during business hours (9am-5pm EST)
- Response time: Critical issues within 4 hours, non-critical within 24 hours
- Up to 5 hours of content updates per month

Timeline: 12-month contract, auto-renewing

Payment: $800/month, invoiced on the 1st, net 30

Exclusions:
- New feature development
- Design changes
- Content creation
- Domain or hosting costs
- Issues caused by client-installed plugins`;

const SHORT_WHATSAPP = `Hey, I need a logo and a website. Can you do it? Budget is small. Let me know what you can do.`;

const PROFESSIONAL_PROPOSAL = `Website Development Proposal — ABC Corp

Scope: 5-page corporate website

Pages: Home, About, Services, Portfolio, Contact

Features:
- Responsive design
- Contact form with email notifications
- Google Maps integration
- Social media links
- Basic SEO setup

Timeline: 4 weeks

Revisions: 2 rounds of design revisions included

Investment: $8,000
- 50% deposit ($4,000) to begin
- 50% balance ($4,000) upon completion

What We Provide:
- Custom design
- Mobile-responsive development
- Content management system (WordPress)
- Training session (1 hour) for content updates
- 30 days of post-launch support

What You Provide:
- Brand assets (logo, brand colors, fonts)
- Website content (text and images)
- Domain and hosting credentials
- Timely feedback during design phase

Exclusions:
- Content writing
- Photography
- Ongoing maintenance beyond 30-day support period
- E-commerce functionality
- Custom functionality beyond listed features`;

describe("Engine: Determinism", () => {
  it("returns deeply-equal results for the same input", () => {
    const a = analyze(VAGUE_WEBSITE, "website");
    const b = analyze(VAGUE_WEBSITE, "website");
    expect(a).toEqual(b);
  });

  it("returns deeply-equal results for detailed scope", () => {
    const a = analyze(DETAILED_WEBSITE, "website");
    const b = analyze(DETAILED_WEBSITE, "website");
    expect(a).toEqual(b);
  });
});

describe("Engine: Empty/whitespace text", () => {
  it("empty string returns score 0, band risky, all categories 0", () => {
    const result = analyze("", "website");
    expect(result.score).toBe(0);
    expect(result.band).toBe("risky");
    expect(result.sensitiveWarning).toBe(false);
    expect(result.wordCount).toBe(0);
    for (const cat of result.categories) {
      expect(cat.score).toBe(0);
    }
    expect(result.missing.length).toBeGreaterThanOrEqual(10);
  });

  it("whitespace-only returns score 0, band risky", () => {
    const result = analyze("   \n\t  ", "general");
    expect(result.score).toBe(0);
    expect(result.band).toBe("risky");
    expect(result.wordCount).toBe(0);
  });
});

describe("Engine: Vague website brief", () => {
  const result = analyze(VAGUE_WEBSITE, "website");

  it("score < 45", () => {
    expect(result.score).toBeLessThan(45);
  });

  it("band is risky or review", () => {
    expect(["risky", "review"]).toContain(result.band);
  });

  it("risks include simple and quick", () => {
    const phrases = result.risks.map((r) => r.phrase);
    expect(phrases).toContain("simple");
    expect(phrases).toContain("quick");
  });

  it("missing includes payment, timeline, revisions", () => {
    const ids = result.missing.map((m) => m.id);
    expect(ids).toContain("payment-milestones");
    expect(ids).toContain("timeline-deadline");
    expect(ids).toContain("revision-limits");
  });
});

describe("Engine: Detailed website scope", () => {
  const result = analyze(DETAILED_WEBSITE, "website");

  it("score >= 70", () => {
    expect(result.score).toBeGreaterThanOrEqual(70);
  });

  it("band is clear", () => {
    expect(result.band).toBe("clear");
  });

  it("few missing items", () => {
    expect(result.missing.length).toBeLessThanOrEqual(5);
  });

  it("risks are empty or very few", () => {
    expect(result.risks.length).toBeLessThanOrEqual(2);
  });
});

describe("Engine: All project types", () => {
  const allTypes: ProjectType[] = [
    "website",
    "seo",
    "social",
    "branding",
    "software",
    "mobile",
    "maintenance",
    "general",
  ];

  for (const pt of allTypes) {
    it(`project type "${pt}" returns valid weights summing > 0`, () => {
      const meta = getProjectType(pt);
      const totalWeight = Object.values(meta.weights).reduce(
        (a, b) => a + b,
        0,
      );
      expect(totalWeight).toBeGreaterThan(0);
    });

    it(`project type "${pt}" returns a valid result`, () => {
      const result = analyze(DETAILED_WEBSITE, pt);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(["clear", "review", "risky"]).toContain(result.band);
      expect(result.categories).toHaveLength(9);
      expect(result.wordCount).toBeGreaterThan(0);
    });
  }
});

describe("Engine: Risky-phrase detector", () => {
  it("detects multiple risky phrases with correct counts", () => {
    const text =
      "This is a simple project. We need a simple website. It should be quick. No unlimited revisions.";
    const risks = detectRisks(text);
    const simpleRisk = risks.find((r) => r.phrase === "simple");
    const quickRisk = risks.find((r) => r.phrase === "quick");
    const unlimitedRisk = risks.find((r) => r.phrase === "unlimited");

    expect(simpleRisk).toBeDefined();
    expect(simpleRisk!.count).toBe(2);
    expect(quickRisk).toBeDefined();
    expect(quickRisk!.count).toBe(1);
    expect(unlimitedRisk).toBeUndefined();
  });

  it("provides context snippets", () => {
    const text =
      "We need a simple website with a basic website design. Make it quick.";
    const risks = detectRisks(text);
    for (const risk of risks) {
      expect(risk.context.length).toBeGreaterThan(0);
    }
  });

  it("negated forms are NOT flagged", () => {
    const text =
      "This is not a simple project. We don't want a quick turnaround. Not unlimited support.";
    const risks = detectRisks(text);
    const phrases = risks.map((r) => r.phrase);
    expect(phrases).not.toContain("simple");
    expect(phrases).not.toContain("quick");
    expect(phrases).not.toContain("unlimited");
  });

  it("detects asap, everything included, make it like", () => {
    const text = "Need this asap. Everything included please. Make it like Stripe.";
    const risks = detectRisks(text);
    const phrases = risks.map((r) => r.phrase);
    expect(phrases).toContain("asap");
    expect(phrases).toContain("everything included");
    expect(phrases).toContain("make it like");
  });
});

describe("Engine: Missing items", () => {
  it("barebones brief misses payment, timeline, revisions", () => {
    const missing = detectMissingItems("I need a website built.", "website");
    const ids = missing.map((m) => m.id);
    expect(ids).toContain("payment-milestones");
    expect(ids).toContain("timeline-deadline");
    expect(ids).toContain("revision-limits");
  });

  it("detailed scope has fewer missing items", () => {
    const missing = detectMissingItems(DETAILED_WEBSITE, "website");
    const ids = missing.map((m) => m.id);
    expect(ids).not.toContain("payment-milestones");
    expect(ids).not.toContain("timeline-deadline");
    expect(ids).not.toContain("revision-limits");
  });
});

describe("Engine: Outputs", () => {
  it("all 4 output strings are non-empty", () => {
    const result = analyze(VAGUE_WEBSITE, "website");
    expect(result.outputs.internalRiskSummary.length).toBeGreaterThan(0);
    expect(result.outputs.clientFriendlyNote.length).toBeGreaterThan(0);
    expect(result.outputs.proposalAdditionalInfo.length).toBeGreaterThan(0);
    expect(result.outputs.rewrittenScope.length).toBeGreaterThan(0);
  });

  it("none contain legal advice claims", () => {
    const result = analyze(VAGUE_WEBSITE, "website");
    const allOutputs = [
      result.outputs.internalRiskSummary,
      result.outputs.clientFriendlyNote,
      result.outputs.proposalAdditionalInfo,
      result.outputs.rewrittenScope,
    ].join(" ").toLowerCase();
    expect(allOutputs).not.toContain("legal advice");
  });
});

describe("Engine: Sensitive content detection", () => {
  it("detects credit card numbers", () => {
    expect(hasSensitiveContent("card 4111111111111111")).toBe(true);
  });

  it("detects social security numbers", () => {
    expect(hasSensitiveContent("social security 123-45-6789")).toBe(true);
  });

  it("detects email + password combo", () => {
    expect(hasSensitiveContent("email: test@example.com password: secret123")).toBe(true);
  });

  it("detects NDA mentions", () => {
    expect(hasSensitiveContent("This NDA and confidential contract shall remain in effect")).toBe(true);
  });

  it("does not flag normal text", () => {
    expect(hasSensitiveContent("We need a 5-page website with 2 revisions.")).toBe(false);
  });

  it("sensitiveWarning is true for sensitive text in analyze()", () => {
    const result = analyze("Build a form that collects card 4111111111111111", "website");
    expect(result.sensitiveWarning).toBe(true);
  });
});

describe("Engine: Very long text", () => {
  it("handles ~2000 word text without crashing", () => {
    const paragraph =
      "We need a professional website with 10 pages, responsive design, contact forms, Google Maps integration, social media links, SEO optimization, and a content management system. The project timeline is 8 weeks with 2 rounds of revisions. Payment is 50% upfront and 50% on completion. Client provides content and brand assets. Hosting on AWS with SSL. 30 days post-launch support included. Excludes e-commerce and multi-language features. ";
    const longText = paragraph.repeat(Math.ceil(2000 / countWords(paragraph)));

    const start = Date.now();
    const result = analyze(longText, "website");
    const elapsed = Date.now() - start;

    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.wordCount).toBeGreaterThan(1500);
    expect(elapsed).toBeLessThan(5000);
  });
});

describe("Engine: Spec QA inputs", () => {
  const qaInputs: { name: string; text: string; type: ProjectType }[] = [
    { name: "vague website brief", text: VAGUE_WEBSITE, type: "website" },
    { name: "detailed scope", text: DETAILED_WEBSITE, type: "website" },
    { name: "SEO monthly package", text: SEO_MONTHLY, type: "seo" },
    { name: "social media package", text: SOCIAL_MEDIA, type: "social" },
    { name: "software feature list", text: SOFTWARE_FEATURE, type: "software" },
    { name: "maintenance request", text: MAINTENANCE_REQ, type: "maintenance" },
    { name: "short WhatsApp message", text: SHORT_WHATSAPP, type: "general" },
    { name: "professional proposal", text: PROFESSIONAL_PROPOSAL, type: "website" },
  ];

  for (const { name, text, type } of qaInputs) {
    it(`"${name}" returns a result without throwing`, () => {
      const result = analyze(text, type);
      expect(result).toBeDefined();
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(["clear", "review", "risky"]).toContain(result.band);
      expect(result.categories).toHaveLength(9);
      expect(typeof result.wordCount).toBe("number");
      expect(typeof result.sensitiveWarning).toBe("boolean");
    });
  }
});

describe("Text utilities", () => {
  it("countWords handles empty and normal text", () => {
    expect(countWords("")).toBe(0);
    expect(countWords("  ")).toBe(0);
    expect(countWords("hello world")).toBe(2);
    expect(countWords("  one  two  three  ")).toBe(3);
  });

  it("splitSentences handles multiple sentences", () => {
    const sentences = splitSentences("Hello world. How are you? I am fine.");
    expect(sentences).toHaveLength(3);
  });

  it("findPhrase returns matches with negation detection", () => {
    const matches = findPhrase("This is not a simple task.", "simple");
    expect(matches).toHaveLength(1);
    expect(matches[0].negated).toBe(true);
  });

  it("findPhrase returns non-negated matches", () => {
    const matches = findPhrase("This is a simple task.", "simple");
    expect(matches).toHaveLength(1);
    expect(matches[0].negated).toBe(false);
  });

  it("hasAny returns true when non-negated phrase exists", () => {
    expect(hasAny("We need payment terms.", ["payment"])).toBe(true);
    expect(hasAny("No payment required.", ["payment"])).toBe(false);
  });
});

describe("Project types metadata", () => {
  it("PROJECT_TYPES has exactly 8 entries", () => {
    expect(PROJECT_TYPES).toHaveLength(8);
  });

  it("all project types have positive weight sums", () => {
    for (const pt of PROJECT_TYPES) {
      const sum = Object.values(pt.weights).reduce((a, b) => a + b, 0);
      expect(sum).toBeGreaterThan(0);
    }
  });

  it("all project types have all 9 category weights", () => {
    const categoryIds = [
      "deliverables",
      "timeline",
      "revisions",
      "payment",
      "client",
      "technical",
      "acceptance",
      "maintenance",
      "exclusions",
    ];
    for (const pt of PROJECT_TYPES) {
      for (const catId of categoryIds) {
        expect(pt.weights[catId as keyof typeof pt.weights]).toBeDefined();
      }
    }
  });
});

describe("Calibration regression", () => {
  const detailedWebsite = "Scope: 6-page website (Home, About, Services, Blog, Contact, Privacy). Timeline: 6 weeks, launch by July 31. 2 revision rounds. Payment: 30% deposit, 40% on approval, 30% on launch. Client provides copy and brand assets. Hosting/domain on client account. 3 months post-launch support. Out of scope: e-commerce. Change requests billed per hour. Communication via email.";

  it("detailed website scores >= 70", () => {
    const result = analyze(detailedWebsite, "website");
    expect(result.score).toBeGreaterThanOrEqual(70);
  });

  it("detailed website band is clear", () => {
    const result = analyze(detailedWebsite, "website");
    expect(result.band).toBe("clear");
  });

  it("deliverables category score >= 70", () => {
    const result = analyze(detailedWebsite, "website");
    const deliverables = result.categories.find((c) => c.id === "deliverables");
    expect(deliverables).toBeDefined();
    expect(deliverables!.score).toBeGreaterThanOrEqual(70);
  });

  it("missing does NOT include Final deliverables", () => {
    const result = analyze(detailedWebsite, "website");
    const finalDeliv = result.missing.find((m) =>
      m.label.startsWith("Final deliverables"),
    );
    expect(finalDeliv).toBeUndefined();
  });

  it("vague brief stays risky/review and score < 45", () => {
    const result = analyze(VAGUE_WEBSITE, "website");
    expect(["risky", "review"]).toContain(result.band);
    expect(result.score).toBeLessThan(45);
  });

  it("hyphenated/slash terms are matched", () => {
    const text = "Hosting/domain on a 5-page site with 2 revisions.";
    const result = analyze(text, "website");
    const technical = result.categories.find((c) => c.id === "technical");
    expect(technical).toBeDefined();
    expect(technical!.score).toBeGreaterThanOrEqual(70);

    const missing = detectMissingItems(text, "website");
    const finalDeliv = missing.find((m) =>
      m.label.startsWith("Final deliverables"),
    );
    expect(finalDeliv).toBeUndefined();
  });
});
