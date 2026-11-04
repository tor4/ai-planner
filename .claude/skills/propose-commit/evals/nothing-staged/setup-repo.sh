#!/usr/bin/env bash
set -eu
git init -q -b main . && git config user.email t@example.com && git config user.name Tester
mkdir -p docs
printf '# PRD\n\nDraft.\n' > docs/PRD.md
git add . && git commit -qm "Add PRD draft"
printf '# PRD\n\nDraft, revised after the first review.\n' > docs/PRD.md
printf 'x' > .DS_Store
mkdir -p .obsidian && printf '{}' > .obsidian/app.json
