# Architecture — ScopeSeal

## Overview

ScopeSeal is a server-first Next.js 16 App Router app backed by Postgres
(NeonDB) via Prisma 7. Auth is Auth.js v5. The core value is a **deterministic
analysis engine** (pure TypeScript, no server dependencies) that scores scope
text. An optional **AI enhancement layer** can be enabled by an admin through an
OpenAI-compatible provider; AI never replaces the deterministic core.

Two surfaces share the engine: the web app (full review) and the Chrome
extension (quick capture + subset review).

```
┌─────────────────┐   explicit action   ┌──────────────────────────────────┐
│ Chrome ext (WXT)│ ───────────────────▶│  scopeseal.codezela.com (Next 16) │
│  quick capture  │   text → /api/...    │  ┌───────────┐  ┌─────────────┐  │
│  local scan     │ ◀───────────────────│  │ API routes│─▶│ lib/engine  │  │
└─────────────────┘   result/handoff     │  │  (Zod)    │  │ (pure TS)   │  │
                                        │  └─────┬─────┘  └──────┬──────┘  │
                                        │        │               │         │
                                        │   ┌────▼─────┐   ┌─────▼──────┐  │
                                        │   │ Prisma 7 │   │ lib/ai     │  │
                                        │   │ NeonDB   │   │ (optional, │  │
                                        │   └──────────┘   │  gated)    │  │
                                        │                  └────────────┘  │
                                        │  Auth.js v5 (email/pw + guests)  │
                                        └──────────────────────────────────┘
```

## Data model (Prisma)

- **User** — `id`, `email` (unique), `passwordHash`, `name`, `role`
  (`USER` | `ADMIN`), `guestReportsUsed Int @default(0)`, timestamps.
- **Account / Session / VerificationToken** — standard Auth.js adapter tables.
- **Review** — `id`, `userId` (nullable for pre-login guests), `projectType`,
  `inputText`, `inputWordCount`, `score Int`, `categories Json`, `missing Json`,
  `risks Json`, `suggestions Json`, `outputs Json`, `shareSlug` (unique,
  unguessable), `isShared Boolean @default(false)`, timestamps.
- **Template** — `id`, `projectType`, `title`, `body`, `sortOrder`, timestamps.
- **Setting** — `key` (unique), `value Json`. Singletons: `aiModeEnabled`,
  `guestQuota`, `rateLimit`.
- **AiConfig** — `id` (singleton), `provider`, `baseUrl`, `apiKeyEncrypted`
  (AES-GCM at rest), `model`, `enabled Boolean`. One row.

Relations: `User 1—* Review`. `Review.shareSlug` is the private-share key
(28-char base62, unguessable), served with `X-Robots-Tag: noindex` and
`<meta name="robots" content="noindex">`. Shared reports are never in the sitemap.

## Deterministic analysis engine (`src/lib/engine/`)

Pure functions, deterministic, zero runtime deps beyond a small tokenizer. Input:
`{ text: string, projectType: ProjectType }`. Output (frozen shape —
`src/lib/engine/types.ts`):

```ts
type AnalysisResult = {
  score: number;                 // 0..100 weighted
  band: "clear" | "review" | "risky"; // >=70 / 40-69 / <40
  categories: { id: CategoryId; label: string; score: number; weight: number; note?: string }[];
  missing: { id: string; label: string; severity: "high"|"medium"|"low"; guidance: string }[];
  risks:    { phrase: string; count: number; context: string; guidance: string }[];
  suggestions: string[];         // practical, specific
  outputs: {
    internalRiskSummary: string;
    clientFriendlyNote: string;
    proposalAdditionalInfo: string;
    rewrittenScope: string;
  };
  wordCount: number;
};
```

**9 categories** (weighted, weights shift by project type): Deliverables,
Timeline, Revision/Change Control, Payment/Milestone, Client Responsibility,
Technical Responsibility, Acceptance/Handover, Maintenance/Support, Exclusion.

**8 project types** (change checklist + weighting): Website, SEO, Social Media
Marketing, Branding, Custom Software, Mobile App, Maintenance/Support, General
Service.

**Missing-item detector (15+ items)** and **risky-wording detector (15+ phrases)**
are rule-based with light NLP (tokenization, phrase boundaries, negation
awareness so "not unlimited" is not flagged). Risky wording is always "possible
risk", never "wrong".

**Copy-ready outputs** are deterministic/template-based — AI is not required.

## API contract (server routes)

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/api/reviews` | guest+ (quota) or user | run analysis, persist, return result |
| GET | `/api/reviews/:slug` | public if `isShared` | fetch shared report (noindex) |
| GET | `/api/reviews` | user | paginated saved reviews |
| DELETE | `/api/reviews/:id` | owner | delete report |
| POST | `/api/reviews/:id/share` | owner | enable private share link |
| GET | `/api/project-types` | public | list project types + metadata |
| GET | `/api/templates` | public | list templates |
| POST | `/api/ai/enhance` | user | optional AI enhancement (only if enabled) |
| Admin | `/api/admin/*` | ADMIN | settings, ai-config, analytics, users |

All mutations are Zod-validated. Rate-limited per IP for guests.

## Security

- Provider API keys are **AES-256-GCM encrypted at rest** (env `AI_ENCRYPTION_KEY`).
  Keys never appear in client bundles or logs.
- Guest analysis is rate-limited (IP) and quota-capped.
- Selected/pasted text from the extension is sent to the web app **only on
  explicit user action** (button click). No auto-upload, no background capture.
- Private share links use unguessable slugs + `noindex`. Reports are not public
  by default; delete is always available.
- Security headers via `vercel.json` (HSTS, X-Frame-Options DENY, etc.).
