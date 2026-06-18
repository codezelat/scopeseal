# UI / UX Guidelines — ScopeSeal

ScopeSeal must feel like a **serious operator tool** — professional, calm,
precise, agency-aware. Not a legal-tech product, not a generic AI writer. Every
surface should reward attention with subtle, purposeful motion.

## Brand metaphor

**Scope** (a precision lens/sight — clarity, focus) × **Seal** (a wax seal of
approval — trust, quality, a stamp). The brand unites *engineering precision*
with *institutional trust*.

The **signature interaction** is the **seal-stamp**: when a report completes,
a circular seal ring rotates and "stamps" down to reveal the 0–100 Scope Clarity
Score, like a notary stamping a document. This motif recurs in the loader, the
logo, and score components.

## Color palette

Deep navy authority + a signature violet→indigo "seal" accent + clear status
colors. Defined as Tailwind v4 `@theme` tokens in `src/app/globals.css`.

| Token | Hex | Use |
| --- | --- | --- |
| `ink-950` | `#070B22` | deepest background (dark mode) |
| `ink-900` | `#0A0F2C` | primary dark base |
| `ink-800` | `#141B3F` | raised dark surfaces |
| `ink-700` | `#1F2A55` | borders on dark |
| `seal-violet` | `#8B5CF6` | accent start / glow |
| `seal-indigo` | `#6366F1` | accent end / interactive |
| `seal-cyan` | `#22D3EE` | subtle highlight (use sparingly) |
| `surface` | `#F8FAFC` | light background |
| `clear` (emerald) | `#10B981` | score band "clear" / positive |
| `risk` (amber) | `#F59E0B` | score band "review" / possible risk |
| `missing` (rose) | `#F43F5E` | score band "risky" / missing item |

**Gradients:** primary `linear-gradient(135deg, #8B5CF6, #6366F1)` for seal
accents, primary CTAs, score ring. Soft radial glow behind the score.

**Dark mode is first-class** (the tool feels premium in dark). Light mode must
also be fully supported and accessible.

## Typography

Loaded via `next/font`, zero layout shift.

- **Display / headings — Sora** (variable, 600–800). Geometric, precise — the
  "scope" voice. Used for hero, section titles, score labels.
- **Body / UI — Geist** (variable, 400–600). Crisp, modern, highly legible.
- **Numerals / code — Geist Mono**. Score numerals, word counts, code-like data.

**Scale (rem):** display 3.75 / 3 / 2.25 · h2 1.875 · h3 1.5 · body 1 · small
0.875. Tight tracking on display (`-0.02em`), relaxed on body.

## Components

- **Rounded panels** (`rounded-2xl`), soft borders, layered shadows with a faint
  seal-violet tint.
- **Status labels** are pill chips with semantic colors (clear/risk/missing) +
  lucide icons.
- **Dashboard layout**: structured, generous whitespace, clear hierarchy.
- shadcn/ui base (Button, Card, Dialog, Input, Tabs, Select, Toast, Badge,
  Tooltip, Separator) customized with brand tokens.

## Animation inventory (Motion / `motion/react`)

All animations respect `prefers-reduced-motion` (variants check the media query).

1. **Seal-stamp score reveal** — circular ring draws + rotates + scales-in
   ("stamps") to reveal score; number count-up via `useMotionValue` + `animate`.
2. **Staggered fade-up** — sections/cards reveal in sequence on scroll
   (`whileInView`, `staggerChildren`).
3. **Spring-in cards** — risk/missing cards pop with spring transition on mount.
4. **Magnetic primary CTA** — button nudges toward cursor on hover (useMotionValue).
5. **Seal-ring loader** — rotating dashed ring during analysis.
6. **View transitions** — `AnimatePresence` between review flow steps.
7. **Micro-interactions** — tap-scale on buttons, hover-lift on cards,
   focus-ring on inputs, animated underlines on links.
8. **Count-up stats** — landing page metrics animate on view.

## Tone of voice

Confident, practical, agency-aware, non-legal.
✅ "Revision limits are not clearly defined."
✅ "This may create scope creep if the client expects unlimited changes."
❌ "This contract is invalid." ❌ "Legal risk detected." ❌ "You will lose money."

Risky wording is always framed as "possible risk", never "wrong".

## Accessibility

- WCAG AA contrast on all text + controls (verify both themes).
- Keyboard-first: visible focus rings, logical tab order, escape-to-close
  dialogs, enter-to-submit.
- Semantic landmarks (`header`, `nav`, `main`, `footer`), aria labels on
  icon-only controls.
- `prefers-reduced-motion`: Motion variants reduce/disable non-essential motion.
- Form errors announced (aria-live). Score has an accessible text label
  alongside the visual ring.
