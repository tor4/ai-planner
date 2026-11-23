## ADDED Requirements

### Requirement: Pull-request checks
Every push to any branch, and every pull request, SHALL run Prettier, ESLint, a strict TypeScript check across all workspaces, unit tests, end-to-end tests on Chromium, Firefox and WebKit, secret scanning and dependency scanning, and a pull request SHALL NOT be mergeable when any of them fails.

#### Scenario: All checks pass
- **WHEN** a pull request has formatted, lint-clean, type-correct code with passing tests and no high or critical vulnerable dependencies
- **THEN** the CI run finishes green

#### Scenario: Push to a branch without a pull request
- **WHEN** a commit is pushed to any branch
- **THEN** the checks run on that commit, except dependency review, which needs a pull request

#### Scenario: A check fails
- **WHEN** a pull request introduces a type error, a lint error, a failing unit or end-to-end test (on any of the three engines), a committed secret, or a new high or critical dependency vulnerability
- **THEN** the CI run fails and names the failing check

### Requirement: Lockfile is committed and enforced
The repository SHALL commit `package-lock.json`, and CI SHALL install from it exactly.

#### Scenario: Lockfile out of date
- **WHEN** `package.json` changes without a matching `package-lock.json` change
- **THEN** CI fails at install

### Requirement: Workspaces
The repository SHALL contain the workspaces `apps/web`, `apps/api`, `apps/scheduler`, `packages/core` and `packages/db`, each type-checked in strict mode.

#### Scenario: Strict mode applies everywhere
- **WHEN** code in any workspace has an implicit `any`
- **THEN** the type check fails

### Requirement: Core has no input or output
Code in `packages/core` SHALL NOT import database, network or file-system modules, call `fetch`, or read the current time with `Date.now()` or `new Date()` with no arguments. Lint SHALL fail on each.

#### Scenario: Reading the clock in core
- **WHEN** a file in `packages/core` calls `Date.now()`
- **THEN** lint fails

#### Scenario: Importing I/O in core
- **WHEN** a file in `packages/core` imports `node:fs`, `node:http` or the database package
- **THEN** lint fails

#### Scenario: Same code outside core
- **WHEN** a file in `apps/api` calls `Date.now()`
- **THEN** this rule does not report it
