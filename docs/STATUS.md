# Project status

Updated 2026-11-22. Owner: Nataly.

**Phase:** requirements and design. No application code yet; Release 1a development has not started.

## Documents

| Document | Version | Status |
|---|---|---|
| [Spec](spec.md) | 0.4, 2026-11-18 | Approved |
| [User flows](design/user-flows/README.md) | 0.4, 2026-11-18 | Approved |
| [Architecture](architecture.md) | 0.6, 2026-11-18 | Draft, awaiting approval |
| [Design system](design/design-system/README.md) | 0.1, 2026-11-20 | Draft, committed |
| [Evidence base](research/2026-10-30-evidence-base.md) | 2026-10-30 | Reference |
| [Standards](STANDARDS.md) | none | Empty, to be written |
| [Review rules](REVIEW.md) | none | Draft: code must match the spec and `STANDARDS.md` |

## Recent changes

- `AGENTS.md` points to `docs/STANDARDS.md`, and `docs/REVIEW.md` says to check changes against it.
- `npm run check`, `check:quick` and `format` added (Prettier, ESLint, tsc, gitleaks, Vitest with 80% coverage, Playwright). Tooling only: with no code in `apps/web` and `apps/api`, the check fails until the first code and tests exist.
- `docs/PRD.md` renamed to `docs/spec.md`; all documents now call it "the spec".
- `docs/design/01-user-flows/` moved to `docs/design/user-flows/`; "Design 1" and design step numbers removed.
- Design system v0.1 drafted: tokens, `aip-` components and main screens, with a live artifact copy.

## Next

1. Finish the design system, and replace the placeholder colors in the user-flow diagrams with its tokens.
2. Approve the architecture (spec section 10).
3. Close the user-flow gaps (user flows, "Gaps"): data model details, final UX copy in message files, the Google sign-in pop-up build check.
4. Run the checks before Release 1a development (architecture section 16). Item 1, Google OAuth status, needs at least 14 days of lead time before build step 1.
5. Write `docs/STANDARDS.md` (currently empty), then commit the check tooling on `chore/check-tooling`.
6. Split build step 1 into pull-request-sized tasks with estimates, then set the Release 1a and 1b dates.

## Blockers and open questions

From spec section 10 and architecture section 17:

- **Release dates** for 1a and 1b are not set. They block the measurement clock (spec section 3).
- **Pre-development checks** (architecture section 16) block Release 1a.
- **LLM provider** and its data policy block the assistant (Must 13) only.
- **Product name and domain** block the public website. Candidates: Second Draft, Strata, Reckon.
- **Coverage threshold:** the check enforces 80%, but spec 6 (Q1) and architecture section 14 require 90% for the planning rules, suggester, time handling and metrics. Decide whether the 90% stays for those modules or the spec and architecture change.
- **Reviews:** no reviewer or sign-off criteria are named. A security review and a legal/privacy review are still to arrange.
