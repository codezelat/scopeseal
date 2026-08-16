<div align="center">

# ScopeSeal

### Seal the gaps before they become unpaid work.

**A professional project scope & brief clarity tool for agencies, freelancers, project managers, and delivery teams.**

[![Live](https://img.shields.io/badge/Live-scopeseal.codezela.com-8B5CF6?style=flat-square)](https://scopeseal.codezela.com)
[![Chrome Extension](https://img.shields.io/badge/Chrome_Extension-Install-6366F1?style=flat-square)](https://chromewebstore.google.com/detail/scopeseal-by-codezela-bri/ifmmikgdapcipjhoalepidckkpkmicja)
[![License](https://img.shields.io/badge/License-Proprietary-F43F5E?style=flat-square)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square)](https://nextjs.org)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square)](https://prisma.io)

<br>

**Live app:** [scopeseal.codezela.com](https://scopeseal.codezela.com)
**Chrome extension:** [Install from Chrome Web Store](https://chromewebstore.google.com/detail/scopeseal-by-codezela-bri/ifmmikgdapcipjhoalepidckkpkmicja)
**Publisher:** Codezela Technologies · **Contact:** info@codezela.com

</div>

---

## What is ScopeSeal?

ScopeSeal reviews messy client briefs, scope sections, project messages, and
proposal drafts, then highlights **missing details** and **risky wording** before
the work begins — so you don't discover the gaps mid-project when they cost real
money.

Paste a client's brief, pick a project type, and ScopeSeal runs a deterministic
analysis engine that scores the scope **0–100** across **9 weighted categories**,
flags **15+ missing items**, detects **17 risky phrases** (with negation
awareness), and generates **4 copy-ready outputs** you can paste straight into
your internal notes, client reply, proposal, or a rewritten scope.

It ships as:

- **A full web app** (this repo) — deeper analysis, saved reports, templates,
  sharing, export, an admin dashboard, and an optional AI enhancement layer.
- **A Chrome extension** ([`codezelat/scopeseal-chrome-ext`](https://github.com/codezelat/scopeseal-chrome-ext)) —
  quick capture of selected text from any page and a lightweight review, on
  explicit action only (no auto-upload, no background scanning).

> **Important:** ScopeSeal is **not legal advice**. It flags scope-clarity risks
> and missing information — it does not evaluate contract validity or provide
> legal guidance. Risky wording is always framed as *"possible risk,"* never as
> *"wrong"* or *"invalid."*

---

## Table of Contents

- [What is ScopeSeal?](#what-is-scopeseal)
- [Key Features](#key-features)
- [How It Works](#how-it-works)
- [The Analysis Engine](#the-analysis-engine)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Data Model](#data-model)
- [Authentication & Security](#authentication--security)
- [Pages Reference](#pages-reference)
- [API Reference](#api-reference)
- [Brand & Design System](#brand--design-system)
- [Animation Inventory](#animation-inventory)
- [Testing](#testing)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Documentation](#documentation)
- [Chrome Extension](#chrome-extension)
- [License](#license)

---

## Key Features

### Scope Clarity Score (0–100)

Every brief gets a single, weighted score with a band:

| Band | Score | Meaning |
|------|-------|---------|
| **Clear** | ≥ 70 | Scope is well-defined — low scope-creep risk |
| **Needs Review** | 40–69 | Partial coverage — clarify before starting |
| **Risky** | < 40 | Major gaps — likely to cause disputes or unpaid work |

The score is rendered with a signature **animated seal-stamp ring** that draws,
rotates, and stamps down to reveal the number — a precision-lens × wax-seal
metaphor that runs throughout the product.

### 9 Weighted Categories

Each category is scored independently with a weight that shifts based on the
selected project type:

| Category | What it checks |
|----------|----------------|
| **Deliverables** | Pages, screens, posts, features, design files, quantities |
| **Timeline** | Duration, deadlines, milestones, start/launch dates |
| **Revisions** | Revision rounds, feedback cycles, iteration limits |
| **Payment** | Milestones, deposits, retainers, currency, payment terms |
| **Client Responsibility** | Content, copy, brand assets, communication channels |
| **Technical Responsibility** | Hosting, domain, SSL, CDN, APIs, third-party tools, stack |
| **Acceptance** | Sign-off, UAT, go-live criteria, testing |
| **Maintenance / Support** | Warranty, bug fixes, support period, retainer terms |
| **Exclusions** | Out-of-scope items, change-request process |

### 8 Project Types with Weighted Shifts

The same brief scores differently depending on the project type — a website
weights technical responsibility higher, while a maintenance contract weights
support and exclusions more heavily:

| Project Type | Key Weight Shifts |
|--------------|-------------------|
| **Website** | Deliverables, Technical, Acceptance, Revisions ↑ |
| **SEO** | Deliverables, Client, Timeline, Maintenance ↑ |
| **Social Media Marketing** | Deliverables, Client, Revisions ↑ |
| **Branding** | Deliverables, Client, Revisions, Acceptance ↑ |
| **Custom Software** | Technical, Acceptance, Timeline, Exclusions ↑ |
| **Mobile App** | Technical, Acceptance, Timeline, Exclusions ↑ |
| **Maintenance / Support** | Maintenance, Exclusions, Technical ↑ |
| **General Service** | Even weights across all categories |

### Missing-Item Detector (15+ checks)

The engine scans the brief for 15 critical scope elements and reports which are
missing, with severity that escalates based on project-type weights:

- Final deliverables & source files
- Timeline / deadline
- Quantified deliverables (page/screen/post counts)
- Revision limits
- Payment milestones
- Content responsibility (who writes the copy?)
- Brand/assets responsibility (who provides the logo?)
- Hosting/domain responsibility
- Third-party tool/subscription responsibility
- Support period
- Maintenance terms
- Acceptance criteria
- Out-of-scope items
- Change-request process
- Communication channel

Each missing item includes **practical guidance** on what to add.

### Risky-Wording Detector (17 phrases, negation-aware)

The engine flags language that signals loose scope — and it's smart about
negation. "Unlimited revisions" is flagged, but "not unlimited" is not.

| Phrase | Severity |
|--------|----------|
| `unlimited` | High |
| `everything included` | High |
| `simple` | Medium |
| `quick` | Medium |
| `small change` | Medium |
| `basic website` | Medium |
| `as needed` | Medium |
| `ongoing support` | Medium |
| `make it like` | Medium |
| `same as the competitor` | Medium |
| `add later` | Medium |
| `we can decide after` | Medium |
| `asap` | Medium |
| `minor edit` | Low |
| `final changes` | Low |
| `just one page` | Low |

Each flagged phrase includes an occurrence count, a context snippet, and guidance.

### 4 Copy-Ready Outputs

Instead of just telling you what's wrong, ScopeSeal generates text you can use
immediately:

1. **Internal Risk Summary** — a one-paragraph briefing for your team with the
   weakest areas, high-severity missing items, and top risky phrases.
2. **Client-Friendly Note** — a polite, professional message you can send to the
   client requesting clarification without sounding adversarial.
3. **Proposal Additional Info** — a structured Markdown block with
   clarifications needed and wording to reconsider, ready to append to a proposal.
4. **Rewritten Scope** — a template scope document with placeholder markers
   (`___`) exactly where the missing items should go.

### Sensitive Content Warning

The engine detects potentially sensitive data in the submitted text — credit
card numbers, Social Security numbers, email/password combinations, and NDA /
confidentiality mentions — and displays a warning so you don't accidentally
share something you shouldn't.

### Optional AI Enhancement

An admin-configurable, OpenAI-compatible AI layer can rewrite a vague scope into
a clearer version and list specific improvements. It's **gated behind admin
configuration** (disabled by default), API keys are **AES-256-GCM encrypted at
rest**, and it **never replaces** the deterministic engine — it's an optional
enhancement on top of it.

### Accounts, Roles, and Admin Dashboard

- **Guest mode** — analyze up to 3 briefs without an account (cookie-tracked,
  rate-limited). Sign in for unlimited analyses.
- **User accounts** — email/password auth, saved reviews, templates, settings,
  password changes, account deletion.
- **Admin role** — full admin dashboard with platform analytics (user counts,
  review counts, average scores, band distribution, recent activity), user
  management (promote/demote), global settings (guest quota,
  maintenance mode), and AI provider configuration.

### Sharing & Export

- **Shareable report links** — every analysis gets an unguessable 24-character slug;
  reports are shareable via `/result/{slug}` with `noindex` so they don't appear
  in search engines.
- **Markdown export** — download any report as a `.md` file with the full
  breakdown.
- **Copy to clipboard** — one-click copy of the report, any of the 4 outputs, or
  the share link.

---

## How It Works

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ScopeSeal Flow                               │
└─────────────────────────────────────────────────────────────────────┘

  Client brief / scope text
        │
        ▼
  ┌──────────────┐      ┌──────────────────┐      ┌─────────────────┐
  │  Rate limit   │─────▶│  Guest quota /   │─────▶│  Zod validation │
  │  (per-IP)     │      │  auth check      │      │  (50–50k chars) │
  └──────────────┘      └──────────────────┘      └────────┬────────┘
                                                           │
                                                           ▼
                                          ┌────────────────────────────┐
                                          │  DETERMINISTIC ENGINE      │
                                          │  (pure TypeScript)         │
                                          │                            │
                                          │  1. Detect risky phrases   │
                                          │     (negation-aware)       │
                                          │  2. Score 9 categories     │
                                          │     (weighted by type)     │
                                          │  3. Detect missing items   │
                                          │  4. Build 4 outputs         │
                                          │  5. Compute overall score  │
                                          │  6. Sensitive content scan │
                                          └─────────────┬──────────────┘
                                                        │
                                       ┌────────────────┼────────────────┐
                                       ▼                                 ▼
                          ┌────────────────────┐            ┌──────────────────┐
                          │  Persist Review    │            │  Optional AI     │
                          │  (Prisma → Neon)   │            │  Enhancement     │
                          │  + share slug      │            │  (admin-gated,   │
                          └─────────┬──────────┘            │   AES-encrypted) │
                                    │                       └──────────────────┘
                                    ▼
                          ┌────────────────────┐
                          │  Result view       │
                          │  Score ring +      │
                          │  categories +      │
                          │  missing + risks + │
                          │  outputs + export  │
                          └────────────────────┘
```

The analysis engine is **100% deterministic and pure** — given the same input,
it always produces byte-identical output. It has zero database or server
dependencies and is shared as a type contract across the web app and the Chrome
extension.

---

## The Analysis Engine

The engine lives in [`src/lib/engine/`](./src/lib/engine) and is the heart of
the product.

| File | Responsibility |
|------|----------------|
| `types.ts` | Frozen API contract — `AnalysisResult`, `ProjectType`, `CategoryId`, `Band`, `MissingItem`, `RiskHit`, `Outputs` |
| `index.ts` | Main `analyze()` orchestrator + re-exports |
| `categories.ts` | 9 category definitions with signal groups (pattern arrays) |
| `project-types.ts` | 8 project types with per-type weight overrides |
| `scoring.ts` | Category scoring (primary + secondary signal bonus, risk penalty), weighted overall score, band calculation |
| `missing-items.ts` | 15+ missing-item detectors with severity escalation |
| `risk-detector.ts` | 17 risky-phrase detector with negation awareness |
| `suggestions.ts` | Practical, specific recommended actions |
| `outputs.ts` | 4 copy-ready output builders (internal, client, proposal, rewritten scope) |
| `sensitive.ts` | Sensitive content warning detector (cards, SSNs, credentials, NDAs) |
| `text-utils.ts` | Tokenizer, word counter, sentence splitter, phrase finder with negation |

### Scoring Algorithm

Each category is scored on a 0–100 scale:

1. **Signal detection** — the engine searches the text for pattern groups
   (keywords, phrases). Each category has a `primary` signal group and several
   `secondary` groups.
2. **Base score** — if a primary signal is found, the category starts at **78**
   and earns a bonus (up to +18) for each additional secondary signal found, with
   diminishing returns (`1.0, 0.6, 0.4, 0.3, 0.2`). If only secondary signals are
   found, the score is proportional to coverage (`found / total × 60`). If
   nothing is found, the score is **0**.
3. **Risk penalty** — if risky phrases map to this category, a penalty of up to
   **−12** is applied (`min(12, riskCount × 3)`).
4. **Weighted overall** — the final 0–100 score is the weight-adjusted average
   across all 9 categories, where weights come from the selected project type.

### Determinism

The engine is fully deterministic — the same input always yields the same output.
This is enforced by a unit test that runs `analyze()` twice on multiple inputs and
asserts deep equality.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | [Next.js](https://nextjs.org) (App Router, Turbopack, React 19.2) | 16.3.1 |
| **Language** | TypeScript (strict mode) | ^5 |
| **React** | React + React DOM | 19.2.8 |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) v4 (CSS-first config, no `tailwind.config.ts`) | ^4 |
| **Components** | Local, brand-customized shadcn/ui components | source-owned |
| **UI Primitives** | [Radix UI](https://www.radix-ui.com) | ^1.6.7 |
| **Animation** | [Motion](https://motion.dev) (`motion/react`, formerly Framer Motion) | ^13.1.0 |
| **Database** | PostgreSQL ([NeonDB](https://neon.tech)) via [Prisma](https://prisma.io) 7 | ^7.9.1 |
| **DB Driver** | `@prisma/adapter-pg` + `pg` | ^7.9.1 / ^8.23.0 |
| **Auth** | [Auth.js](https://authjs.dev) v5 credentials + JWT sessions | 5.0.0-beta.32 |
| **Validation** | [Zod](https://zod.dev) | ^4.4.3 |
| **Icons** | [lucide-react](https://lucide.dev) + React Icons brand icons | ^1.31.0 / 5.7.0 |
| **Password Hashing** | bcryptjs (cost factor 12) | ^3.0.3 |
| **Theming** | next-themes (dark mode first-class) | ^0.4.6 |
| **Toasts** | sonner | ^2.0.8 |
| **Unit Testing** | [Vitest](https://vitest.dev) | ^4.1.10 |
| **E2E Testing** | [Playwright](https://playwright.dev) | ^1.62.1 |
| **Linting** | ESLint 9 + eslint-config-next | ^9 / 16.3.1 |
| **Script Runner** | tsx (for Prisma seed scripts) | ^4.23.12 |
| **Deployment** | [Vercel](https://vercel.com) | — |
| **Package Manager** | pnpm | — |

---

## Project Structure

```
scopeseal/
├── src/
│   ├── app/
│   │   ├── (public)/            # Landing, privacy, terms, support
│   │   ├── (auth)/              # Sign in, sign up (route group, no URL segment)
│   │   ├── app/                 # Authenticated app: dashboard, reviews, templates, settings
│   │   ├── admin/               # Admin-gated: overview, users, settings, AI config
│   │   ├── analyze/             # Public scope analyzer (guest-capable)
│   │   ├── result/[slug]/       # Shared report viewer (noindex)
│   │   ├── api/                 # Route handlers (Zod-validated)
│   │   ├── globals.css          # Tailwind v4 + brand theme tokens
│   │   ├── layout.tsx           # Root layout (fonts, providers, metadata)
│   │   ├── error.tsx            # Error boundary
│   │   ├── loading.tsx          # Seal loader
│   │   ├── not-found.tsx        # Branded 404
│   │   ├── manifest.ts          # PWA manifest
│   │   ├── robots.ts            # robots.txt route
│   │   └── sitemap.ts           # sitemap.xml route
│   ├── components/
│   │   ├── ui/                  # 21 shadcn/ui base components (brand-customized)
│   │   ├── brand/               # SealLogo, SealScoreRing, SealLoader, ThemeToggle
│   │   ├── animations/          # Reveal, MagneticButton, CountUp, variants
│   │   ├── site/                # Header, Footer, Hero, Features, HowItWorks, etc.
│   │   ├── auth/                # SignOutButton
│   │   └── providers/           # ThemeProvider (next-themes)
│   ├── lib/
│   │   ├── engine/              # Deterministic analysis engine (pure TS)
│   │   ├── auth.ts              # Auth.js v5 config (Credentials, JWT, roles)
│   │   ├── db.ts                # Prisma client singleton (PrismaPg adapter)
│   │   ├── crypto.ts            # AES-256-GCM encrypt/decrypt for provider keys
│   │   ├── admin-guard.ts       # Admin role authorization guard
│   │   ├── ai-client.ts         # OpenAI-compatible AI enhancement client
│   │   ├── rate-limit.ts        # Per-IP sliding-window rate limiter
│   │   ├── guest-quota.ts       # Cookie-based guest report quota
│   │   ├── export.ts            # Report → Markdown export
│   │   └── utils.ts             # cn() className merge utility
│   ├── generated/prisma/        # Prisma client output (gitignored)
│   └── types/next-auth.d.ts     # Session/JWT type augmentation (id, role)
├── prisma/
│   ├── schema.prisma            # 7 models, 2 enums
│   └── seed.ts                  # Admin user, settings, default templates
├── prisma.config.ts             # Prisma 7 config (datasource URL, schema path)
├── docs/
│   ├── ARCHITECTURE.md          # Architecture, data model, API contract, security
│   └── UI_UX_GUIDELINES.md      # Brand, palette, typography, animation, accessibility
├── e2e/
│   └── scope-seal.spec.ts       # Playwright E2E suite (34 tests)
├── AGENTS.md                    # Coding agent instructions (stack, conventions, pitfalls)
├── .env.example                 # Environment variable documentation
├── vercel.json                  # Security headers
├── playwright.config.ts
├── vitest.config.ts
├── components.json              # shadcn/ui config
└── package.json
```

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                     Chrome Extension (WXT)                       │
│            codezelat/scopeseal-chrome-ext                         │
│   Quick capture · explicit action only · no auto-upload           │
└──────────────────────────┬───────────────────────────────────────┘
                           │ selected text + project type
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                   Next.js 16 App (this repo)                      │
│                   scopeseal.codezela.com                          │
│                                                                   │
│  ┌─────────────┐   ┌──────────────┐   ┌───────────────────────┐  │
│  │  Public     │   │  Authenticated│   │  Admin                │  │
│  │  Pages      │   │  App (/app)   │   │  (/admin)             │  │
│  │  + /analyze │   │  Dashboard    │   │  Analytics            │  │
│  │  + /result  │   │  Reviews      │   │  User management      │  │
│  │             │   │  Templates    │   │  Settings             │  │
│  │             │   │  Settings     │   │  AI config            │  │
│  └──────┬──────┘   └──────┬───────┘   └──────────┬────────────┘  │
│         │                 │                      │                │
│         └────────────────┼──────────────────────┘                │
│                          ▼                                        │
│              ┌───────────────────────┐                            │
│              │   API Routes          │   Zod-validated input      │
│              │   (/api/*)            │   Structured error JSON    │
│              └───────┬───────────────┘                            │
│                      │                                            │
│         ┌────────────┼─────────────────────┐                      │
│         ▼            ▼                     ▼                      │
│  ┌────────────┐ ┌──────────┐  ┌────────────────────┐              │
│  │ Engine     │ │ Prisma 7 │  │ AI Client          │              │
│  │ (pure TS)  │ │ → NeonDB │  │ (OpenAI-compat,    │              │
│  │            │ │ Postgres │  │  admin-gated,      │              │
│  │ Determinism│ │          │  │  AES-encrypted key)│              │
│  └────────────┘ └──────────┘  └────────────────────┘              │
│                                                                   │
│  Auth.js v5: Credentials provider, JWT sessions, USER/ADMIN roles │
└──────────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

- **Server-first.** React Server Components by default; `"use client"` only for
  interactivity, hooks, and Motion animations.
- **Validation at the edge.** Every API route validates input with a Zod schema.
  No client data is ever trusted.
- **Typed API contract.** Frozen types in `src/lib/engine/types.ts` are shared
  across server, client, and the Chrome extension.
- **Structured errors.** All API errors return `{ error: string, code: string }`
  with correct HTTP status. Stack traces are never leaked to clients.
- **Deterministic core.** The analysis engine is pure TypeScript with zero
  server dependencies. The optional AI layer enhances — never replaces — it.
- **Security headers on Vercel.** Set via `vercel.json` (not middleware), to
  avoid breaking auth redirects.

---

## Data Model

**Database:** PostgreSQL on NeonDB, accessed via Prisma 7 with the `@prisma/adapter-pg`
driver adapter.

### Models

| Model | Purpose | Key Fields |
|-------|---------|------------|
| **User** | Authentication | `email` (unique), `passwordHash` (bcrypt), `name`, `role`, `authVersion` |
| **PasswordResetToken** | Password recovery | one hashed, expiring, single-use token per user |
| **Review** | Stored analysis | `userId` (nullable for guests), `projectType`, `inputText` (truncated 5k), `score`, `band`, `sensitiveWarning`, JSON findings/outputs, 24-char `shareSlug`, `isShared` |
| **Template** | Reusable scope templates | `projectType`, `title`, `body`, `sortOrder` |
| **Setting** | Key-value platform config | `guestReportQuota`, `maintenanceMode`, and `branding` |
| **AiConfig** | Singleton AI provider config | `provider`, `baseUrl`, `apiKeyEncrypted` (AES-256-GCM), `model`, `enabled` |
| **Account** | Auth.js adapter (future OAuth) | Standard NextAuth fields |
| **Session** | Auth.js adapter (unused — JWT) | Standard NextAuth fields |
| **VerificationToken** | Auth.js adapter | Standard NextAuth fields |

### Enums

- `UserRole`: `USER`, `ADMIN`
- `ReviewBand`: `clear`, `review`, `risky`

### Seed Data

The seed script (`prisma/seed.ts`) creates:
- An **admin user** (email from `ADMIN_EMAIL` env, bcrypt-hashed password)
- 3 **platform settings** (`guestReportQuota`, `maintenanceMode`, and `branding`)
- 4 **default templates** (Website, SEO, Maintenance, General) with bracketed
  placeholders for common scope sections

---

## Authentication & Security

### Auth Flow

- **Auth.js v5** with the **Credentials provider** (email + password).
- **JWT session strategy** (required for Credentials — no database sessions).
- Passwords hashed with **bcrypt at cost factor 12**.
- **Timing-attack mitigation**: a 300ms delay is applied when a user lookup fails,
  to prevent email enumeration.
- Custom `role` (`USER`/`ADMIN`) propagated through the JWT token → session.
- `authVersion` invalidates every existing JWT after password changes or resets.
- Password reset tokens are random, SHA-256 hashed at rest, single use, and expire after 30 minutes.
- `getCurrentUser()` server-side helper for server components and route handlers.

### Route Protection

| Area | Protection |
|------|-----------|
| Public pages (`/`, `/analyze`, `/result/*`, legal pages) | None |
| Authenticated app (`/app/*`) | Layout-level `auth()` check → redirect to `/signin` |
| Admin (`/admin/*`) | `requireAdmin()` → redirect non-admins to `/app` |
| API `/api/analyze` | Rate-limited; guests quota-checked; users unlimited |
| API `/api/analyze/enhance`, `/api/reviews/*`, `/api/user/*` | Session required |
| API `/api/admin/*` | `role === "ADMIN"` required (returns 403) |

### Security Measures

| Measure | Implementation |
|---------|---------------|
| **Password hashing** | bcrypt, cost factor 12 |
| **Provider key encryption** | AES-256-GCM (12-byte IV, 16-byte auth tag), key from `AI_ENCRYPTION_KEY` env. Format: `iv:authTag:ciphertext` (hex). Keys are never returned to the client in plaintext — only a masked hint (`••••last4`). |
| **Rate limiting** | Per-IP sliding windows for analysis, sign-in, sign-up, password, contact, and deletion paths. Upstash Redis is used when configured, with a bounded per-instance fallback. |
| **Guest quota** | Cookie-based (`ss_guest_count`, httpOnly, 30-day), default 3 reports. Bypassed by signing in. |
| **Shared reports** | 144-bit, 24-character slugs plus meta and HTTP `noindex`. Account reports are private until their owner enables sharing. |
| **Security headers** | CSP, HSTS, clickjacking, MIME sniffing, referrer, permissions, opener, resource, and origin isolation headers via `vercel.json`. |
| **Input validation** | Every API route validates with Zod. Analyze endpoint enforces 50–50,000 char range. |
| **No stack traces** | Errors return structured `{ error, code }` JSON. |
| **Extension privacy** | The Chrome extension captures text only on explicit user action — no auto-upload, no background scanning, no `<all_urls>`. |

---

## Pages Reference

### Public Pages

| Route | Type | Description |
|-------|------|-------------|
| `/` | Server | Landing page — hero, how-it-works, project types, features, live score demo, extension CTA |
| `/features` | Server | Product capabilities and report preview |
| `/how-it-works` | Server | Three-step product workflow |
| `/contact` | Server + action | Validated, rate-limited contact form with email fallback |
| `/analyze` | Server + Client | Scope analyzer — project-type selector, textarea, live word count, "paste example" per type, analysis trigger |
| `/result/[slug]` | Server + Client | Shared report viewer — full results dashboard (score ring, categories, missing, risks, outputs, export, AI enhance). `noindex`. |
| `/privacy` | Server | Privacy policy — data processed, extension permissions, shared reports, AI enhancement, retention |
| `/terms` | Server | Terms of service — including explicit "no legal advice" clause |
| `/support` | Server | Support page — email contact, FAQ, extension info |

### Auth Pages

| Route | Description |
|-------|-------------|
| `/signin` | Sign-in form (email + password) with server action |
| `/signup` | Sign-up form (name + email + password, min 8 chars) with server action; auto-login on success |
| `/forgot-password` | Generic, rate-limited password reset request |
| `/reset-password` | Expiring single-use token password reset |

### Authenticated App (`/app`)

| Route | Description |
|-------|-------------|
| `/app` | Dashboard — welcome, review count, quick-link cards, 3 most recent reviews |
| `/app/reviews` | My reviews — paginated list (20/page) with score chips, badges, text preview |
| `/app/templates` | Template library — grouped by project type, "Use template" → pre-fills `/analyze` |
| `/app/settings` | Profile, appearance, session-invalidating password change, and password-confirmed account deletion |

### Admin (`/admin`)

| Route | Description |
|-------|-------------|
| `/admin` | Overview — total users, total reviews, average score, reviews this week, band distribution chart, recent activity table |
| `/admin/users` | User management — searchable, paginated, promote/demote roles (self-demotion guarded) |
| `/admin/settings` | Global guest quota and maintenance mode |
| `/admin/ai-config` | AI provider config — enable/disable, provider select, base URL, API key (masked), model, test connection |

### Special Routes

| Route | Description |
|-------|-------------|
| `/robots.txt` | Allows `/`, disallows `/app`, `/admin`, `/api`, `/result/` |
| `/sitemap.xml` | Lists every indexable public marketing, analyzer, support, and legal route |
| `/manifest.webmanifest` | PWA manifest (ScopeSeal, standalone, dark theme) |

---

## API Reference

All API routes validate input with Zod and return structured errors.
Successful responses return JSON; errors return `{ error: string, code: string }`
with the appropriate HTTP status.

### Core

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/api/analyze` | Guest (quota) or User | Run analysis. Input: `{ text (50–50k), projectType }`. Returns `{ result, reviewId, shareSlug, guestQuota }`. Codes: `RATE_LIMITED` (429), `QUOTA_EXCEEDED` (403), `VALIDATION_ERROR` (400). |
| `POST` | `/api/analyze/enhance` | User | AI enhancement. Input: `{ scopeText, projectType }`. Returns `{ rewrittenScope, improvements }`. Codes: `UNAUTHORIZED` (401), `AI_UNAVAILABLE` (503). |

### Templates

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/api/templates` | Public | List all templates ordered by `sortOrder`. Cached (s-maxage=300, SWR=600). |

### Reviews (owner-scoped)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `DELETE` | `/api/reviews/[id]` | Owner | Delete a review. 403 if not owner, 404 if not found. |
| `PATCH` | `/api/reviews/[id]/share` | Owner | Toggle `isShared`. Returns `{ isShared, shareUrl }`. |

### User (self-service)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `PATCH` | `/api/user/update-name` | User | Update display name (1–100 chars). |
| `PATCH` | `/api/user/change-password` | User | Change password (verify current, min 8 new). Code: `INVALID_PASSWORD` (400). |
| `DELETE` | `/api/user/delete` | User | Password-confirmed permanent account and review deletion. |

### Admin

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/api/admin/ai-config` | Admin | Get AI config (provider, baseUrl, model, enabled, `hasKey`, masked `keyHint`). |
| `PUT` | `/api/admin/ai-config` | Admin | Upsert a public HTTPS provider config. `apiKey` is encrypted before storage. |
| `PATCH` | `/api/admin/ai-config` | Admin | Toggle `enabled` only. |
| `POST` | `/api/admin/ai-config/test` | Admin | Test AI connection — decrypts key, calls `{baseUrl}/models`, verifies model exists. 15s timeout. |
| `GET` | `/api/admin/settings` | Admin | List all settings. |
| `PATCH` | `/api/admin/settings` | Admin | Upsert a single setting by key. |
| `PATCH` | `/api/admin/users/[id]/role` | Admin | Toggle user role. Code: `SELF_DEMOTE` (400) if admin demotes themselves. |

### Auth

| Method | Route | Description |
|--------|-------|-------------|
| `GET, POST` | `/api/auth/[...nextauth]` | Auth.js catch-all handler. |

---

## Brand & Design System

The brand metaphor is a **precision lens (scope)** × a **wax seal of approval
(seal)** — uniting engineering precision with institutional trust. The signature
interaction is an animated circular **seal-stamp** that stamps down to reveal the
score, like a notary stamping a document.

### Color Palette

Defined as Tailwind v4 `@theme` tokens in `src/app/globals.css`:

| Token | Hex | Purpose |
|-------|-----|---------|
| `ink-950` | `#070B22` | Deepest dark background |
| `ink-900` | `#0A0F2C` | Primary dark base |
| `ink-800` | `#141B3F` | Raised dark surfaces |
| `ink-700` | `#1F2A55` | Dark borders |
| `seal-violet` | `#8B5CF6` | Primary accent / glow start |
| `seal-indigo` | `#6366F1` | Accent end / interactive |
| `seal-cyan` | `#22D3EE` | Subtle highlight (used sparingly) |
| `surface` | `#F8FAFC` | Light background |
| `clear` | `#10B981` | Score band "clear" (emerald) |
| `risk` | `#F59E0B` | Score band "review" (amber) |
| `missing` | `#F43F5E` | Score band "risky" (rose) |

Primary gradient: `linear-gradient(135deg, #8B5CF6 → #6366F1)` — used on CTAs,
the score ring, and brand accents. **Dark mode is first-class** (premium feel);
light mode is fully supported and accessible.

### Typography

Loaded via `next/font/google` with zero layout shift:

| Role | Font | Character |
|------|------|-----------|
| Display / headings | **Sora** (variable, 600–800) | Geometric, precise — the "scope" voice |
| Body / UI | **Geist** (variable, 400–600) | Crisp, modern, highly legible |
| Numerals / code | **Geist Mono** | Score numerals, word counts, code-like data |

### Brand Components

| Component | Description |
|-----------|-------------|
| `SealLogo` | 28×28 SVG seal mark (reticle ring + cardinal ticks + center dot) + "Scope**Seal**" wordmark with gradient |
| `SealScoreRing` | The flagship score gauge — 3-stage spring animation (ring sweep → number pop with rotation → band pill), `useId`-scoped gradient, accessible aria-label |
| `SealLoader` | Seal-themed spinner — rotating gradient dashes + cardinal ticks, reduced-motion aware |
| `ThemeToggle` | Light/dark toggle with hydration-safe mount gate |

### Tone of Voice

Confident, practical, agency-aware, non-legal:

| ✅ Good | ❌ Bad |
|---------|--------|
| "Revision limits are not clearly defined." | "This contract is invalid." |
| "This may create scope creep if the client expects unlimited changes." | "Legal risk detected." |
| "Define a specific limit." | "You will lose money." |

### Accessibility

- WCAG AA contrast on all text and controls (both themes)
- Keyboard-first: visible focus rings, logical tab order, escape-to-close, enter-to-submit
- Semantic landmarks (`header`, `nav`, `main`, `footer`), aria labels on icon-only controls
- `prefers-reduced-motion` respected by every Motion variant
- Score ring has an accessible text label alongside the visual

---

## Animation Inventory

All animations use [Motion](https://motion.dev) (`motion/react`) and respect
`prefers-reduced-motion`.

| # | Animation | Where |
|---|-----------|-------|
| 1 | **Seal-stamp score reveal** — ring draws, rotates, scales-in to reveal the score | `SealScoreRing` |
| 2 | **Staggered fade-up** — sections/cards reveal in sequence on scroll | `Reveal`, landing sections |
| 3 | **Spring-in cards** — risk/missing cards pop with spring on mount | Result view |
| 4 | **Magnetic primary CTA** — button nudges toward cursor on hover | `MagneticButton` |
| 5 | **Seal-ring loader** — rotating dashed ring during analysis | `SealLoader` |
| 6 | **Count-up** — numbers animate from 0 on view | `CountUp`, score demo |
| 7 | **Micro-interactions** — tap-scale on buttons, hover-lift on cards, animated underlines | Throughout |
| 8 | **Animated progress bars** — category bars fill on `whileInView` | Score demo, result view |

---

## Testing

### Unit Tests — Vitest (81 tests)

Located under [`src/lib`](./src/lib).
Coverage includes:

- **Determinism** — identical inputs produce deeply-equal outputs
- **Empty/whitespace** — score 0, band risky, all categories 0
- **Vague brief** — score < 45, risky/review band, correct missing items and risks
- **Detailed scope** — score ≥ 70, clear band, few missing items, few risks
- **All 8 project types** — valid weights, valid results, 9 categories
- **Risky-phrase detector** — multi-occurrence counts, context snippets, negation
  awareness ("not unlimited" not flagged)
- **Missing items** — barebones brief misses payment/timeline/revisions; detailed
  scope doesn't
- **Outputs** — all 4 copy-ready outputs non-empty, no legal-advice claims
- **Sensitive content** — credit cards, SSNs, email+password, NDA detection
- **Very long text** — ~2000 words processed in < 5s without crashing
- **8 QA scenario inputs** — vague brief, detailed scope, SEO, social, software,
  maintenance, WhatsApp message, professional proposal
- **Text utilities** — word count, sentence splitting, phrase finding, negation
- **Calibration regression** — detailed website scores ≥ 70, vague stays < 45,
  hyphenated/slash terms matched
- **Password recovery** — token creation, hashing, expiry, URL construction, and validation
- **Provider URL safety** — public HTTPS allowlist behavior and private-network rejection

```bash
pnpm test
```

### E2E Tests — Playwright (34 tests)

Located in [`e2e/scope-seal.spec.ts`](./e2e/scope-seal.spec.ts). Chromium-only,
auto-starts the production server on port 3100. Coverage includes:

- **Landing page** — hero H1, project types, footer → legal page navigation
- **Analyze flow** — paste text → analyze → score visible, no application error
- **9 QA scenarios** — vague brief, detailed scope, SEO, social, software,
  maintenance, WhatsApp message, professional proposal, very long text
- **Button disabled state** — analyze button disabled when textarea empty
- **Auth pages** — signin/signup render with correct headings and form fields
- **Authenticated lifecycle** — sign-up, private review, sharing, saved reviews,
  profile, password rotation, re-authentication, and account deletion
- **Admin workspaces** — overview, users, global settings, AI configuration,
  and protected API access with configured seed credentials
- **No legal advice** — landing page doesn't mention "legal advice", "attorney",
  or "contract is invalid"
- **Public pages** — privacy, terms, support, robots.txt, sitemap.xml,
  manifest.webmanifest, branded 404

```bash
pnpm test:e2e
```

### Verification

```bash
pnpm type-check && pnpm lint && pnpm build
```

---

## Quick Start

### Prerequisites

- **Node.js** managed via [nvm](https://github.com/nvm-sh/nvm)
- **pnpm** package manager
- A **NeonDB** Postgres database (or any Postgres instance)

### Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Copy environment variables and fill them in
cp .env.example .env
# Edit .env: set DATABASE_URL, AUTH_SECRET, AI_ENCRYPTION_KEY, ADMIN_EMAIL, ADMIN_PASSWORD

# 3. Generate the Prisma client
pnpm dlx prisma generate

# 4. Push the schema to your database
pnpm dlx prisma db push

# 5. Seed the database (admin user, settings, templates)
pnpm db:seed

# 6. Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### NVM Note

If you use nvm, prefix all npm/node/pnpm commands:

```bash
source ~/.nvm/nvm.sh && pnpm dev
```

### Production Setup

```bash
pnpm prod:setup   # prisma generate && prisma db push && seed
pnpm build
pnpm start
```

---

## Environment Variables

All variables are documented in [`.env.example`](./.env.example). Copy it to
`.env` and fill in the values.

### Core required

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | NeonDB Postgres pooler URL. Use `-pooler` endpoint, keep `?sslmode=require`, **remove** `channel_binding=require` (Prisma's pg adapter doesn't support it). |
| `AUTH_SECRET` | JWT signing secret. Generate with `openssl rand -base64 32`. |

### Feature and production configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_APP_URL` | localhost fallback | Required in production and used in password reset links |
| `GUEST_REPORT_QUOTA` | `3` | Max guest analyses before sign-in required |
| `RATE_LIMIT_WINDOW_SECONDS` | `60` | Default analysis rate-limit window |
| `RATE_LIMIT_MAX_REQUESTS` | `10` | Default analysis requests per window |
| `ADMIN_EMAIL` | `admin@codezela.com` | Seed admin email |
| `ADMIN_PASSWORD` | none | Required to create or update the seeded administrator |
| `UPSTASH_REDIS_REST_URL` | per-instance fallback | Set with the token for distributed production rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | per-instance fallback | Set with the URL for distributed production rate limiting |
| `RESEND_API_KEY` | email disabled | Required for password recovery and contact delivery |
| `RESEND_EMAIL_FROM` | email disabled | Verified Resend sender used for transactional email |
| `CONTACT_EMAIL_TO` | contact form disabled | Inbox that receives contact submissions |
| `AI_ENCRYPTION_KEY` | AI configuration disabled | 64-character hex key for encrypted provider credentials |

---

## Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `next dev` | Start dev server (Turbopack) |
| `build` | `next build` | Production build |
| `start` | `next start` | Start production server |
| `lint` | `eslint` | Lint the codebase |
| `type-check` | `tsc --noEmit` | TypeScript type check (strict) |
| `test` | `vitest run` | Run unit tests |
| `test:e2e` | `playwright test` | Run E2E tests (auto-starts dev server) |
| `postinstall` | `prisma generate` | Auto-generate Prisma client (for Vercel `npm ci`) |
| `db:push` | `prisma db push` | Push schema to database |
| `db:seed` | `node --env-file-if-exists=.env --import tsx prisma/seed.ts` | Seed database (tsx doesn't load `.env` automatically) |
| `prod:setup` | `prisma generate && prisma db push && db:seed` | Full production setup |

---

## Documentation

| Document | Description |
|----------|-------------|
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Architecture diagram, data model, engine internals, API contract, security model |
| [`docs/UI_UX_GUIDELINES.md`](./docs/UI_UX_GUIDELINES.md) | Brand metaphor, color palette, typography, component patterns, animation inventory, tone of voice, accessibility |
| [`AGENTS.md`](./AGENTS.md) | Instructions for coding agents — stack, shell commands, brand/design system, conventions, known pitfalls |

---

## Chrome Extension

The ScopeSeal Chrome extension is a separate repository that provides quick
capture and lightweight review directly from the browser:

- **Repo:** [`codezelat/scopeseal-chrome-ext`](https://github.com/codezelat/scopeseal-chrome-ext)
- **Chrome Web Store:** [Install ScopeSeal](https://chromewebstore.google.com/detail/scopeseal-by-codezela-bri/ifmmikgdapcipjhoalepidckkpkmicja)

The extension uses **explicit action only** — it captures selected text only
after you trigger it. There is no auto-upload, no background scanning, and no
`<all_urls>` permission. It shares the same deterministic analysis engine and
typed API contract as the web app.

---

## Repositories

| Repository | Description |
|------------|-------------|
| [`codezelat/scopeseal`](https://github.com/codezelat/scopeseal) | **This repo** — the full web app |
| [`codezelat/scopeseal-chrome-ext`](https://github.com/codezelat/scopeseal-chrome-ext) | Chrome extension — quick capture + lightweight review |

---

## License

This is a **proprietary** product. Copyright © 2026 Codezela Technologies. All
rights reserved. No license is granted to use, copy, modify, or distribute this
software without prior written permission. See [`LICENSE`](./LICENSE) for full
terms.

For licensing inquiries, contact: **info@codezela.com**

---

<div align="center">

**[ScopeSeal](https://scopeseal.codezela.com)** · Built by [Codezela Technologies](mailto:info@codezela.com)

Made for agencies, freelancers & delivery teams.

</div>
