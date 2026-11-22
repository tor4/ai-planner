#!/usr/bin/env bash
# Runs every check, keeps going after a failure, and exits 1 if any failed.
# Usage: scripts/check.sh [--quick]   (--quick skips the end-to-end tests)
cd "$(dirname "$0")/.." || exit 1

failed=()
run() {
  local name="$1"; shift
  printf '\n=== %s ===\n' "$name"
  if "$@"; then printf -- '--- %s: ok\n' "$name"; else printf -- '--- %s: FAILED\n' "$name"; failed+=("$name"); fi
}

run "Prettier"          npx prettier --check apps/web
run "ESLint"            npx eslint apps/web
run "tsc (frontend)"    npx tsc -p apps/web
run "tsc (backend)"     npx tsc -p apps/api
run "gitleaks (history)"     gitleaks git --no-banner --redact .
run "gitleaks (working tree)" gitleaks dir --no-banner --redact .
run "Unit tests, 80% coverage" npm test
if [ "$1" != "--quick" ]; then run "End-to-end tests" npm run test:e2e; fi

printf '\n'
if [ ${#failed[@]} -gt 0 ]; then
  printf 'check FAILED: %s\n' "${failed[*]}"
  exit 1
fi
echo "check passed"
