---
title: "AI Planner: design system"
owner: Nataly
version: 0.1
date: 2026-11-20
status: draft
related: [Spec v0.4](../../spec.md), [User flows](../user-flows/README.md)
---

# Design system

The one set of components and design tokens the app uses (spec U1). A calm, honest planner with one loud colour. Warm paper, ink-black type, and citron for the moments the loop turns on: adding a task and saying it went as planned. The product name is undecided, so there is no logo: set the name in `display` and do not draw a mark.

The live, editable version is the [AI Planner design system artifact](https://claude.ai/artifact/3Pty97mkUNckocbeDNcVUB) (private to the owner). This folder is the copy the code uses. When they differ, change this folder and re-sync the artifact.

## Files

| File | What |
|---|---|
| [tokens.json](tokens.json) | Every colour (light and dark), type style, spacing, radius and size token, each with a usage note. The source of truth. |
| [tokens.css](tokens.css) | CSS custom properties generated from `tokens.json` by [build.py](build.py). Light by default; dark from the system setting or `data-theme="dark"`. Do not edit by hand. |
| [components.css](components.css) | Component classes (prefix `aip-`). Loads the Google fonts and Tabler Icons. |
| `components/<Name>/` | `README.md` (guidelines) and `preview.html` (live example) for each component. |
| [screens/](screens/README.md) | The main screens built only from these files, with light and dark screenshots. |

## Using it

Load the two stylesheets, in this order, and build with the `aip-` classes. Never hard-code a colour, size or font: use the tokens.

```html
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="components.css">
<body class="aip-body">
```

After changing `tokens.json`, regenerate the CSS:

```bash
python3 docs/design/design-system/build.py
```

To generate new UI with Claude, use the `brand` skill (`.claude/skills/brand/SKILL.md`). It carries these rules and the component markup.

## Content fundamentals
- Plain sentences in sentence case: "No connection. Changes can't be saved right now." "Waking up the server…" "Call bank deleted · 3 actions · Undo all".
- Name the object rather than the user: "Gym ended · 4 occurrences removed".
- Use the glossary terms exactly: block, placeholder, planning slot, hard event, Check in, Missed, Unconfirmed, Not now. The list of blocks to confirm is "Check in".
- No fake urgency, streaks, guilt or alert badges. Counts are text: "Check in, 2 blocks". A falling metric is stated, never coloured red.
- Errors name what failed, keep the user's input and offer one main action.
- No emoji. Icons are the glyphs ● ⊘ ✓ ! ✦, always beside a word.

## Visual foundations
- **Paper and ink.** `paper` is the page, `paper-raised` cards and panels, `paper-sunken` the hours outside the template and the rail. Text is `ink`; times and notes `ink-muted`.
- **Citron is the signature, used sparingly.** `citron` fills New task, "As planned", "Undo all", the selected tab and rail marker, today's date, the now label and rising-trend chips. It is never a line or a text colour: on paper it is too light to carry meaning alone. Text on it is `on-citron`. Planned blocks use the quieter `citron-tint` with a `citron-deep` bar.
- **Main action is ink.** `aip-btn` uses `action` / `on-action`: one per area.
- **Signals.** `vermilion` for Missed and errors; `teal` for confirmed and saved. Teal sits on the blue side, so the pair never depends on red versus green. `amber-tint` with `amber-ink` for suggestions. Each signal comes with a word and an icon.
- **Hatching is the motif.** Hard events, the recovery buffer and baseline weeks are hatched in `line` or `hairline`. Use it for "time you can't use" and nowhere decorative.
- **Three faces.** `display` (Bricolage Grotesque) for `h1`, `h2`, `metric` and empty states; `sans` (Atkinson Hyperlegible, built for legibility) for body, `small`, `label`; `mono` (IBM Plex Mono) for every clock time and duration so they line up. Block text is never under 14px.
- **Soft geometry.** Blocks `radius-sm`; cards, banners, tiles `radius-md`; every button, chip and segmented control `radius-pill`. Spacing in `space-*` steps.
- **Targets.** `target-primary` (44px) for New task, the four Check in options and tabs; `target-min` (24px) elsewhere.
- **States.** Hover lightens ink to `action-hover` and citron to `citron-hover`, and gives quiet controls a `wash` background; pressed uses `action-press`, `citron-press` or `wash-strong` and moves down 1px; disabled is 50% opacity with no hover. See `States`.
- **Focus.** 3px solid `focus` with a 2px offset: ink in light, citron in dark. Never removed.
- **Themes.** Light and dark follow the system. Every text pair named in a token note meets 4.5:1 in both. A higher-contrast theme is a Should (spec U7), not yet defined.
- **Motion.** Short and functional, dropped under reduced motion.
- **Layout.** Phone under 640px: bottom tabs (Plan, Tasks, Check in, Metrics, More). Tablet and desktop: top bar plus a labelled rail with a side panel. Works from 320px and at 200% zoom.

## Iconography
- State glyphs (● ⊘ ✓ ! ✦) are text inside the component, always beside a word.
- Interface icons are Tabler Icons, outline, 20px, in `ink` (loaded by `components.css`). Tab bar: `ti-calendar` Plan, `ti-list-check` Tasks, `ti-circle-check` Check in, `ti-chart-line` Metrics, `ti-dots` More. Rail: `ti-circle-check`, `ti-list-check`, `ti-wand` Proposals, `ti-sparkles` Assistant. Toolbar: `ti-chevron-left`, `ti-chevron-right`, `ti-plus`, `ti-adjustments-horizontal`, `ti-refresh`, `ti-x`, `ti-dots`.
- Icons in navigation always have a visible label; icon-only buttons (`aip-iconbtn`) have an `aria-label`.

## Components

Each links to its guidelines.

- **Frame:** [Navigation](components/Navigation/README.md) (top bar and phone tab bar), [Rail](components/Rail/README.md) (with the side panel), [Calendar](components/Calendar/README.md) (with the toolbar and now marker).
- **Planning:** [Block](components/Block/README.md), [CheckInCard](components/CheckInCard/README.md), [TaskRow](components/TaskRow/README.md).
- **Controls:** [Button](components/Button/README.md) (with icon buttons and the segmented control), [Field](components/Field/README.md) (inputs, selects, checkboxes, capture, link rows).
- **Foundations:** [States](components/States/README.md) (hover, pressed, focused, selected, disabled).
- **Feedback:** [Banner](components/Banner/README.md), [UndoMessage](components/UndoMessage/README.md), [MetricTile](components/MetricTile/README.md) (with the trend chart styles).

Styles live in `components.css` with the prefix `aip-`; it also loads the three Google fonts and Tabler Icons. There is no script bundle: markup and classes are the API.

## Open items

- A higher-contrast theme for the system "more contrast" setting (spec U7, Should).
- The product name and a logo; until then the wordmark is the name set in `display`.
- Remaining components as screens need them: dialogs (overlap warning, delete all), bottom sheet and pop-over (View options), the Review proposals list, Settings pages.
- An automated contrast and axe check in CI over the component previews (spec A8).
