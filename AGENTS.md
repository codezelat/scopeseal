# AGENTS.md — instructions for coding agents (OpenCode)

You are building **ScopeSeal**, a proprietary production product by Codezela
Technologies. Follow this file exactly. It encodes the stack, conventions, the
exact brand/design system, and known pitfalls. Verify the latest stable
versions before adding dependencies. **Write production-grade code** — typed,
tested, accessible, performant. No placeholders, no TODOs in committed code.

## Stack (pinned, verified June 2026)

- **Next.js 16.x** (App Router, Turbopack default, React 19.2). `src/` dir,
  import alias `@/*`.
- **TypeScript** strict.
- **Tailwind CSS v4** — CSS-first config in `src/app/globals.css` via
  `@import "tailwindcss"`. Do NOT create `tailwind.config.ts` unless required.
- **shadcn/ui** components customized to brand. Components live in
  `src/components/ui/`.
- **Motion** (`motion/react`) for all animation. Prefer `motion/react` imports.
- **Prisma 7** + **NeonDB** Postgres. Connection in `prisma.config.ts`, NOT in
  `schema.prisma`.
- **Auth.js v5** (`next-auth@beta`, `@auth/prisma-adapter`).
- **Zod**, **lucide-react**, **Vitest**, **Playwright**.

## Shell / commands

Node is via **nvm**. Prefix EVERY npm/node/pnpm command with:
```
source ~/.nvm/nvm.sh && <command>
```
Package manager: **pnpm**. Use `pnpm dlx` for one-off CLIs (prisma).

Verification commands (include at the end of your work):
```
source ~/.nvm/nvm.sh && pnpm type-check && pnpm lint && pnpm build
```

## Brand & design system (authoritative — see docs/UI_UX_GUIDELINES.md)

**Metaphor:** a precision *lens* (scope) + a *wax seal* of approval.
**Signature interaction:** an animated circular **seal-stamp** that stamps down
to reveal the 0–100 Scope Clarity Score.

**Palette (Tailwind tokens, defined in globals.css `@theme`):**
- `--color-ink` deep navy base `#0A0F2C` (also `ink-950/900/800` ramp)
- `--color-seal` violet→indigo gradient `#8B5CF6`→`#6366F1` (use as gradient + glow)
- `--color-surface` off-white `#F8FAFC` / white panels
- status: `--color-clear emerald #10B981`, `--color-risk amber #F59E0B`,
  `--color-missing rose #F43F5E`

**Typography (`next/font`):** Sora (display/headings), Geist (body), Geist Mono
(score numerals / code).

**Animation inventory (Motion):** staggered fade-up reveals, spring-in cards,
animated seal-stamp score ring, number count-up, magnetic primary CTAs,
seal-ring loaders, `AnimatePresence` view transitions. Micro-interactions are a
requirement, not decoration.

## Project structure (web app, at repo root)

```
src/
  app/
    (public)/        # landing, privacy, terms, support, product demo
    (auth)/          # signin, signup
    app/             # authenticated app: reviews, templates, settings
    admin/           # admin-gated
    api/             # route handlers
    globals.css      # Tailwind v4 + theme tokens
    layout.tsx
  components/
    ui/              # shadcn/ui base (brand-customized)
    brand/           # logo, seal-ring, score-stamp
    animations/      # Motion primitives (Reveal, Stagger, MagneticButton)
    reviews/         # review-flow + result components
    admin/
  lib/
    engine/          # deterministic analysis engine (PURE, shared w/ extension)
    auth.ts          # Auth.js config
    db.ts            # prisma client singleton
    crypto.ts        # AES encrypt/decrypt for provider keys
    rate-limit.ts
    ai/              # optional AI enhancement (gated by admin config)
  generated/prisma/  # prisma client output
prisma/
  schema.prisma
  seed.ts
prisma.config.ts
```

## Conventions

- **Server-first.** Use React Server Components by default; mark client
  components with `"use client"` only when needed (interactivity, hooks, Motion).
- **Validation at the edge.** Every API route validates input with a Zod schema.
  Never trust client data.
- **Typed API contract.** Define request/response types in
  `src/lib/engine/types.ts` (frozen shapes) and reuse across server + client +
  extension.
- **Errors:** return structured JSON `{ error: string, code: string }` with
  correct HTTP status. Never leak stack traces to clients.
- **Accessibility:** semantic HTML, focus-visible rings, aria labels, keyboard
  navigable, `prefers-reduced-motion` respected by Motion variants.
- **No content scripts, no `<all_urls>`** in the extension (separate repo).
- **Clean repos:** NO `.github/workflows/`, NO `dependabot.yml`, NO CI files.

## Known pitfalls (DO NOT repeat)

- **`@custom-variant dark` MUST come AFTER `@import "tailwindcss"`** in
  `globals.css`, or dark utilities silently produce nothing.
- **Prisma 7 REQUIRES a driver adapter** (this is the #1 Prisma 7 gotcha). `new
  PrismaClient()` / `new PrismaClient({ datasourceUrl })` are REMOVED in v7 and
  throw "needs non-empty valid PrismaClientOptions". You MUST install
  `@prisma/adapter-pg` + `pg` and instantiate like:
  ```ts
  import { PrismaPg } from "@prisma/adapter-pg";
  import { PrismaClient } from "@/generated/prisma/client";
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  export const db = new PrismaClient({ adapter });
  ```
  Also explicitly install `@prisma/client-runtime-utils` (the generated client
  `require()`s it; pnpm does not always hoist it). **`tsx` scripts do NOT load
  `.env`** — seed scripts use `node --env-file-if-exists=.env --import tsx …`
  (Next.js loads `.env` automatically for the app). NeonDB + Prisma 7: connection
  URL goes in `prisma.config.ts` (`datasource: { url: env("DATABASE_URL") }`) for
  the CLI. `schema.prisma` datasource has ONLY `provider = "postgresql"` (no
  `url`/`directUrl`). Remove `channel_binding=require` from NeonDB URLs.
- **Auth.js `signOut` is a server export** — do NOT import it from `@/lib/auth`
  in client components (pulls `node:module` into client bundle). Use
  `import { signOut } from "next-auth/react"` in client code.
- **lucide-react** has no brand icons (`Github`, etc.). Use `Code2`, `Globe`,
  `ExternalLink`.
- **Security headers on Vercel:** use `vercel.json` `headers`, NOT `proxy.ts`.
  A `proxy.ts` that sets headers breaks auth redirects.
- **`useSearchParams()`** in a client component needs a `<Suspense>` boundary on
  statically-prerendered pages or the build fails.
- **`prisma` in `dependencies`** (not devDeps) + `"postinstall": "prisma
  generate"` so Vercel `npm ci` works.
- **Prisma `Json` fields:** cast with `as unknown as Prisma.InputJsonValue`.
- **Never `git add -A` blindly** — the PM stages explicit paths after your runs.
