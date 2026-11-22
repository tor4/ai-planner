# Design

## Context

Root tooling already exists: `tsconfig.base.json` (strict, `noUncheckedIndexedAccess`), flat ESLint config limited to `apps/web`, Vitest, Playwright, Prettier, gitleaks, lefthook, and `scripts/check.mjs`. `apps/web` and `apps/api` have only a `tsconfig.json`. Architecture §4 and §19.4 define the layout and the core rule. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:** a layout later changes can fill in; CI that is green on an empty scaffold; a purity rule proven by a test.

**Non-Goals:** real app code, Vite/Hono/Drizzle setup, deploy pipelines, axe in CI, `apps/site`, CodeQL.

## Decisions

1. **npm workspaces** with `"workspaces": ["apps/*", "packages/*"]`, as architecture §4 says. Packages are named `@ai-planner/<name>` and reference each other with `*` versions.
2. **Source-only packages.** No build step: `main` points at `src/index.ts` and consumers use the Bundler module resolution already in `tsconfig.base.json`. Alternative, compiled packages with project references, adds a build before it is needed.
3. **Per-workspace tsconfig, root `tsc -b`-free check.** Each workspace has its own tsconfig extending the base; `check.mjs` runs `tsc --noEmit -p` for each. Core and db use `lib: ["ES2022"]` only.
4. **Core purity via ESLint, not a custom plugin.** In a `packages/core/**` block: `no-restricted-imports` (patterns for `node:*`, `fs`, `http`, `net`, `pg`, `@neondatabase/*`, `drizzle-orm`, `@ai-planner/db`) and `no-restricted-syntax` selectors for `Date.now()`, `new Date()` with no arguments, and `fetch(...)`. Alternative, a custom plugin, is more code for the same effect. The rule file gets a test that lints sample snippets with `ESLint` and asserts the messages.
5. **CI = GitHub Actions**, one workflow triggered by `push` (all branches) and `pull_request`, with `concurrency` cancelling superseded runs of the same branch. A commit on a pull-request branch runs twice, once for the push and once for the pull request; that cost is accepted for now, full-history checkout (gitleaks scans history), Node 22, `npm ci`, then `npx playwright install --with-deps`, install gitleaks, then the full `npm run check` (including end-to-end on three engines), then `npm audit --audit-level=high` and `actions/dependency-review-action` (pull requests only, skipped on plain pushes by a step-level `if`). One job keeps it simple and fast; split later if slow.
6. **Scaffold tests.** One Vitest test per workspace so the 80% coverage threshold in `vitest.config.mts` can pass; the root config is widened to `apps/**` and `packages/**`.
7. **ESLint scope** grows from `apps/web` to all workspaces: base TS rules everywhere, React rules only in `apps/web`. Prettier script covers the whole repo.

6a. **Smoke e2e test.** Playwright fails when it finds no tests, so `e2e/smoke.spec.ts` runs a trivial page-free assertion (to be replaced by real flows). Playwright browsers are cached by version in CI.

## Risks / Trade-offs

- [Three-engine e2e slows every pull request] → cache browsers; run in one job now, shard later if it passes ~10 minutes.

- [`npm audit` flags a dev-only issue and blocks unrelated pull requests] → audit production dependencies only (`--omit=dev`), matching S6.
- [Coverage threshold fails on trivial files] → keep scaffold `index.ts` files tiny and tested; revisit with the open 80/90% decision in `docs/STATUS.md`.
- [`new Date(x)` is allowed in core and could still be fed `Date.now()` indirectly] → the second rule bans `Date.now()` itself; time math is routed through the time module later (§19.4).

## Open Questions

- Pinning GitHub Actions by commit SHA versus tags (can be tightened later).
- Whether to add CodeQL for the "static analysis" half of S6 in a follow-up change.
