# ScopeSeal

> **Seal the gaps before they become unpaid work.**
> A professional project scope & brief clarity tool for agencies, freelancers, project managers, and delivery teams.

ScopeSeal reviews messy client briefs, scope sections, project messages, and proposal drafts, then highlights missing details and risky wording before the work begins. It ships as a **Chrome extension** (quick capture + lightweight review) and a **full web app** (deeper analysis, editing, saved reports, export, sharing).

**Publisher:** Codezela Technologies · **Contact:** info@codezela.com · **Web app:** scopeseal.codezela.com

This is a **proprietary** product. See [`LICENSE`](./LICENSE). All rights reserved.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack, React 19.2) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (CSS-first config) |
| Components | shadcn/ui, customized to brand |
| Animation | Motion (`motion/react`, formerly Framer Motion) |
| Database | Postgres (NeonDB) via Prisma 7 |
| Auth | Auth.js v5 (NextAuth) — email/password + guests + admin role |
| Validation | Zod |
| Icons | lucide-react |
| Testing | Vitest (unit) + Playwright (E2E) |
| Deployment | Vercel |

## Quick start

```bash
pnpm install
cp .env.example .env   # fill in DATABASE_URL, AUTH_SECRET, AI_ENCRYPTION_KEY
pnpm dlx prisma generate
pnpm dlx prisma db push
pnpm db:seed
pnpm dev
```

## Documentation

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — data model, services, API contract, security
- [`docs/UI_UX_GUIDELINES.md`](./docs/UI_UX_GUIDELINES.md) — brand, palette, typography, animation inventory, accessibility
- [`AGENTS.md`](./AGENTS.md) — instructions for coding agents

## Repositories

- **Web app** — `codezelat/scopeseal` (this repo)
- **Chrome extension** — `codezelat/scopeseal-chrome-ext`
