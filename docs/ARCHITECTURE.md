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
  (`USER` | `ADMIN`), `authVersion`, timestamps.
- **PasswordResetToken** — one hashed, 30-minute, single-use token per user.
- **Account / Session / VerificationToken** — standard Auth.js adapter tables.
- **Review** — `id`, `userId` (nullable for pre-login guests), `projectType`,
  `inputText`, `inputWordCount`, `score Int`, `sensitiveWarning`, `categories Json`, `missing Json`,
  `risks Json`, `suggestions Json`, `outputs Json`, `shareSlug` (unique,
  unguessable), `isShared Boolean @default(false)`, timestamps.
- **Template** — `id`, `projectType`, `title`, `body`, `sortOrder`, timestamps.
- **Setting** — `key` (unique), `value Json`. Active settings:
  `guestReportQuota`, `maintenanceMode`, and `branding`.
- **AiConfig** — `id` (singleton), `provider`, `baseUrl`, `apiKeyEncrypted`
  (AES-GCM at rest), `model`, `enabled Boolean`. One row.

Relations: `User 1—* Review`. `Review.shareSlug` is the private-share key
(24-character base64url, 144 bits), served with `X-Robots-Tag: noindex` and
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
| POST | `/api/analyze` | guest+ (quota) or user | run analysis, persist, return result |
| POST | `/api/analyze/enhance` | user | optional, admin-gated AI rewrite |
| DELETE | `/api/reviews/:id` | owner | delete report |
| PATCH | `/api/reviews/:id/share` | owner | enable or disable the private share link |
| GET | `/api/templates` | public | list templates |
| PATCH | `/api/user/update-name` | user | update profile name |
| PATCH | `/api/user/change-password` | user | verify, rotate, and invalidate sessions |
| DELETE | `/api/user/delete` | user | password-confirmed account deletion |
| GET/PATCH | `/api/admin/settings` | ADMIN | global settings |
| GET/PUT/PATCH/DELETE | `/api/admin/ai-config` | ADMIN | encrypted provider configuration |
| PATCH | `/api/admin/users/:id/role` | ADMIN | role management with self-demotion guard |

All mutations are Zod-validated. Rate-limited per IP for guests.

## Security

- Provider API keys are **AES-256-GCM encrypted at rest** (env `AI_ENCRYPTION_KEY`).
  Keys never appear in client bundles or logs.
- Analysis and sensitive authentication/account actions are rate-limited by IP.
  Upstash provides distributed production limits when configured, with a bounded
  per-instance fallback for local development.
- Provider base URLs require public HTTPS addresses before server-side requests.
- Selected/pasted text from the extension is sent to the web app **only on
  explicit user action** (button click). No auto-upload, no background capture.
- Private share links use unguessable slugs + `noindex`. Reports are not public
  by default; delete is always available.
- Security headers via `vercel.json` (HSTS, X-Frame-Options DENY, etc.).
