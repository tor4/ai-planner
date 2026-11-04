#!/usr/bin/env bash
set -eu
git init -q -b main . && git config user.email t@example.com && git config user.name Tester
printf '# Planner\n\nInstall the dependancies, then run the app.\n' > README.md
git add README.md && git commit -qm "Add README"
printf '# Planner\n\nInstall the dependencies, then run the app.\n' > README.md
git add README.md
