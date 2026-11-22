# AGENTS.md

This file provides guidance to AI coding agents (Claude Code, Codex and others) when working with code in this repository.

## What this repo is

AI Planner: a personal planner that schedules tasks into time blocks around Google Calendar events, asks the user to confirm how each block went, and reports weekly metrics. The product name is undecided; don't invent one.

The project is in the requirements and design phase, with **no application code yet**. `docs/STATUS.md` has the current phase, next steps and blockers; update it when the project's state changes.

## Read first

1. `docs/spec.md`, before anything else.
2. The current change's folder, `openspec/changes/<change-name>/`. The change name is the current branch (`git branch --show-current`) with any `/` replaced by `-`. It holds `proposal.md` (what the change is for and why), `design.md`, `tasks.md`, delta specs in `specs/`, and `plan.md` (detailed implementation plan, when one is needed). Every change gets its own folder.

Read only the current change's folder. Don't open other folders under `openspec/changes/`, including `archive/`.

## Documents

- `docs/spec.md`: requirements. IDs like "Must 3" or "A4" point here; use its glossary terms. Edit it only when a change requires it or I ask; never move or rename it.
- `docs/design/user-flows/`: flows and screens, one file per feature area.
- `docs/architecture.md`: how to build it, including conventions (section 19).
- `docs/design/design-system/`: edit `tokens.json`; `tokens.css` is generated.
- `openspec/specs/`: detailed behavior specs, updated only by archiving a change. `docs/spec.md` wins if they disagree.

Carry a behavior change through spec, user flows and architecture together, and bump the changed document's version and changelog.

Never create `docs/superpowers/` or any other planning folder.

## Change workflow (OpenSpec + Superpowers)

1. **Explore.** If the idea is fuzzy, brainstorm in chat. Don't write design files yet.
2. **Propose.** Create the OpenSpec change (`/opsx:propose <change-name>`). Superpowers brainstorming and writing-plans use this change instead of their own files: extra design detail goes into `design.md`; `tasks.md` is the plan, and if more detail is needed, write `plan.md` in the same folder. The proposal cites the spec IDs it implements and lists which of spec, user flows and architecture it changes.
3. **Wait for my approval** of the proposal before changing anything else.
4. **Implement** with Superpowers: one task at a time, TDD once test setup exists. Tick off each item in `tasks.md` when done. Update `docs/spec.md`, user flows and architecture (with version bump and changelog) as part of the tasks, not afterwards.
5. **Verify** before saying it's done: run verification and request code review.
6. **Archive** (`/opsx:archive <change-name>`). Before archiving, confirm the `docs/` documents and `docs/STATUS.md` reflect the change; if anything is missing, list it and ask.

If a request or proposal contradicts `docs/spec.md`, stop and point out the conflict instead of choosing one silently.

## Commands

```bash
python3 docs/design/design-system/build.py                   # regenerate tokens.css from tokens.json
npm run eval:skill -- <skill-name> [--case <case>]           # run a project skill's test cases
npx openspec list                                            # list active changes
npx openspec validate <change-name>                          # check a change's structure
```

No build, lint or test setup exists yet.

## When code starts

Follow `docs/architecture.md`. Key rules: TypeScript
