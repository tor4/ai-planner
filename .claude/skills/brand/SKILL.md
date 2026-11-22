---
name: brand
description: Use whenever generating or changing any AI Planner UI — a screen, mockup, wireframe, HTML page, component, prototype, email, or app code with styling.
---

# AI Planner brand

The design system lives in `docs/design/design-system/`. Build every UI from it; never invent colours, fonts, sizes or components.

## Before you write anything

1. Read `docs/design/design-system/README.md` (brand book: tokens, type, `aip-` classes).
2. Read `components/<Name>/README.md` (and `preview.html` for markup) for each component you use.
3. For screen content, focus order, states and wording, read the matching flow in `docs/design/user-flows/` (`## Screens`). It is the source of truth for what a screen contains.
4. Use glossary terms from `docs/spec.md`, section 4.

## Rules

- Import the design system's two files once at the root. Use `var(--token)`; never hard-code a hex value, font name or pixel size a token names.
- Citron is the one loud colour: at most one citron button in view (Check in options excepted); never as line, border or text colour.
- One main ink button per area. Hover, pressed, focus and selected states come with the classes; don't restyle them.
- Never convey state by colour alone: add a word or glyph. Falling numbers are plain text, never red. No streaks, countdowns, alarm badges or guilt.
- Fonts: display (Bricolage Grotesque) for `h1`/`h2`/metrics, sans (Atkinson Hyperlegible) for body, mono (IBM Plex Mono) for every time and duration. Block text at least 14px; long titles get an ellipsis. Sentence case.
- Icons: Tabler outline, 20px, `aria-hidden`; icon-only buttons need `aria-label`. No emoji.
- If something is missing, build it from tokens in the same style and list it as an addition in your reply.

## Copy

Plain, no exclamation marks, name the object ("Call bank deleted · 3 actions · Undo all"). Use exactly: "Check in", "New task", "Not now", "Missed", "Unconfirmed". Counts are text ("Check in, 2 blocks"). Errors name the field, keep the input and suggest a fix.

## Accessibility (WCAG 2.2 AA)

- Skip link, landmarks, one `h1`, ordered headings, native elements first, visible labels.
- Targets 44px for capture, Check in options, tabs and rows; 24px minimum elsewhere.
- Every drag has a keyboard alternative. Respect reduced motion. Works at 320px and 200% zoom.

## Breakpoints

Phone under 640px: bottom tabs, Day view. Tablet 640–1024px: top bar, 3 days, panel over grid. Desktop above 1024px: top bar, Week, panel beside grid.

## Check your output

Render in light and dark and look at it. Grep markup for `#` colours and font sizes that bypass tokens. Examples: `docs/design/design-system/screens/*.html`.
