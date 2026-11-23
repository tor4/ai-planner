## Why

There is no application code, workspace layout or CI yet. Linear AI-21 (S1) is the first build step: later work needs a place to put code and a pull-request gate that fails fast. The rule that keeps `packages/core` pure (architecture 19.4) must exist before any core code is written.

## What Changes

- Turn the repo into an npm-workspaces monorepo: `apps/web`, `apps/api`, `apps/scheduler`, `packages/core`, `packages/db`. `apps/site` is not created (after 1b).
- Each workspace gets a `package.json`, a strict `tsconfig.json` extending `tsconfig.base.json`, and a minimal `src/index.ts` with one unit test, so the checks have something to run.
- ESLint covers all workspaces. In `packages/core` a lint rule blocks I/O imports (database, network, Node `fs`/`net`/`http`, `fetch`) and `Date.now()` / `new Date()` without arguments.
- GitHub Actions workflow on every push to any branch and on every pull request: Prettier, ESLint, strict `tsc`, unit tests, end-to-end tests on Chromium, Firefox and WebKit, gitleaks, dependency scanning (`npm audit` at high severity, plus GitHub dependency review).
- `package-lock.json` stays committed; CI installs with `npm ci` and fails if the lockfile is out of date.
- One smoke end-to-end test, so Playwright has something to run before any screen exists.
- `npm run check` and `check:quick` extended to cover every workspace.

## Capabilities

### New Capabilities
- `repo-quality-gates`: what the pull-request checks must enforce, and the purity rule for `packages/core`.

### Modified Capabilities
None. `openspec/specs/` has no existing capability for this.

## Impact

- Spec IDs implemented: Q3 (lint and strict type checks in CI), S6 (dependency scanning, lockfile committed), A8 (CI gate exists; the axe checks themselves wait for UI screens).
- Architecture §4 (repo layout, CI) and §19.4 (core purity rule) are implemented. No behavior change, so `docs/spec.md`, user flows and architecture need no edit beyond a `docs/STATUS.md` update.
- Touches: root `package.json`, `eslint.config.mjs`, `scripts/check.mjs`, `.github/workflows/`, new workspace folders. Adds no runtime dependencies; dev dependencies stay as they are.
- No conflict with `docs/spec.md` found. Note: spec 6.9 also asks for axe; that waits for screens and is a follow-up.
