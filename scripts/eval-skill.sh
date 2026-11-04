#!/usr/bin/env bash
# Run a project skill's test cases with `claude plugin eval`.
# Usage: npm run eval:skill -- <skill-name> [extra claude plugin eval options]
# Example: npm run eval:skill -- propose-commit --case nothing-staged
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
skills_dir="$root/.claude/skills"

list_skills() {
  for d in "$skills_dir"/*/evals; do
    [ -d "$d" ] && basename "$(dirname "$d")"
  done
}

if [ $# -lt 1 ]; then
  echo "Usage: npm run eval:skill -- <skill-name> [options]" >&2
  echo "Skills with tests:" >&2
  list_skills | sed 's/^/  /' >&2
  exit 1
fi

skill="$1"
shift
skill_dir="$skills_dir/$skill"

if [ ! -d "$skill_dir/evals" ]; then
  echo "No tests found for skill '$skill' (expected $skill_dir/evals)." >&2
  echo "Skills with tests:" >&2
  list_skills | sed 's/^/  /' >&2
  exit 1
fi

if ! command -v claude >/dev/null 2>&1; then
  echo "The claude CLI is not installed or not on PATH." >&2
  exit 1
fi

cd "$skill_dir"
exec claude plugin eval . --allow-tools Write Edit Bash --scaffold "$@"
