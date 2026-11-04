#!/usr/bin/env bash
set -eu
git init -q -b main . && git config user.email t@example.com && git config user.name Tester
mkdir -p docs
printf '# PRD\n\n## Goals\nTasks get done instead of being postponed.\nPlanning a day should take only a couple of minutes.\n' > docs/PRD.md
printf 'node_modules/\n' > .gitignore
git add . && git commit -qm "Add PRD"
printf '# PRD\n\n## Goals\nTasks get done instead of being postponed.\nPlanning and confirming a day takes at most 5 minutes (median over a week).\n' > docs/PRD.md
printf 'node_modules/\n.DS_Store\n' > .gitignore
git add docs/PRD.md .gitignore
