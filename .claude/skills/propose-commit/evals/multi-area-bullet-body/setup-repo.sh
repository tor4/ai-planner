#!/usr/bin/env bash
set -eu
git init -q -b main . && git config user.email t@example.com && git config user.name Tester
mkdir -p docs
cat > docs/PRD.md <<'MD'
# PRD

## Must 6: Tasks
- Given a task is dropped, its future blocks are removed. A drop can be undone for 7 days.
- Dropped tasks are listed in "Recently removed" and can be restored for 7 days.
- Deleting a task can be undone only from the undo message.
MD
cat > docs/architecture.md <<'MD'
# Architecture

## API routes
| Area | Routes |
|---|---|
| tasks | create, update, drop, undoDrop, delete, undoDelete |
| removed | list (Recently removed) |
MD
git add . && git commit -qm "Add PRD and architecture"
cat > docs/PRD.md <<'MD'
# PRD

## Must 6: Tasks
- Given the user chooses "Not now", the task's future blocks are removed and the task stays open with its time unscheduled.
- Delete is the only way to remove a task. There is no "Recently removed" list.
- Deleting a task can be undone only from the undo message.
MD
cat > docs/architecture.md <<'MD'
# Architecture

## API routes
| Area | Routes |
|---|---|
| tasks | create, update, notNow, undoNotNow, delete, undoDelete |
MD
git add docs/PRD.md docs/architecture.md
