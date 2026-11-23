# Tasks

## 1. Workspaces

- [x] 1.1 Add `workspaces` to root `package.json`, and `package.json` + `tsconfig.json` + `src/index.ts` for `apps/scheduler`, `packages/core`, `packages/db` and the existing `apps/web`, `apps/api`. Verify `npm install` links `@ai-planner/*` and `npm ls --workspaces` lists five.
- [x] 1.2 Add one Vitest test per workspace (write it first, see it fail, add the export), and widen `vitest.config.mts` to all workspaces. Verify `npm test` passes with coverage.
- [x] 1.3 Add `e2e/smoke.spec.ts` (fails first with no test, passes once added). Verify `npm run test:e2e` passes on all three engines.
- [x] 1.4 Extend `scripts/check.mjs` so tsc runs per workspace and Prettier covers the repo (and `format` script). Verify `npm run check` passes.

## 2. Core purity lint rule

- [x] 2.1 Write `eslint-rules.test` first: lint snippets in `packages/core` for `Date.now()`, `new Date()`, `fetch`, `node:fs`, and the db package must each report; `new Date(0)` and the same code in `apps/api` must not. Verify it fails.
- [x] 2.2 Extend `eslint.config.mjs` to all workspaces and add the `packages/core` block. Verify the 2.1 test passes and `npx eslint .` is clean.

## 3. CI

- [x] 3.1 Add `.github/workflows/ci.yml` (`npm ci`, Playwright browser install with cache, gitleaks install, full `npm run check`, `npm audit --omit=dev --audit-level=high`, dependency review on pull requests only; triggers: push to any branch and pull_request). Verify with `actionlint` or a YAML parse locally.
- [x] 3.2 Push the branch. Verify a CI run starts on the push and is green, then open a draft pull request and verify the PR run, then push a commit with `Date.now()` in `packages/core` and verify CI goes red; revert it.

## 4. Docs

- [x] 4.1 Update `docs/STATUS.md` (phase, recent changes, next steps) and the AGENTS.md "No build setup exists yet" line. Verify with `git diff --stat`.
- [x] 4.2 Run `npm run check` and `npx openspec validate feat-ai-21-repo-scaffold`; request code review.

## Workflow follow-up

- Archive with `/opsx:archive feat-ai-21-repo-scaffold` after merge.
- Follow-ups outside this change: axe in CI, CodeQL, `apps/site`.
