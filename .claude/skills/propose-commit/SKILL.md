---
name: propose-commit
description: Write a git commit message for the current changes and commit after the user confirms. Plain imperative subject line (no type prefixes, no emoji), plus a short body only when the reason for the change isn't obvious from the diff. Use this whenever the user asks to commit, wants a commit message, says "commit this", "save this to git", "write a commit msg", or finishes a piece of work and wants it recorded, even if they don't mention the message itself.
metadata:
  version: "0.1.0"
---

# Propose commit

Write a clear commit message for the changes, show it, and commit only after the user says yes. A commit is easy to make and annoying to undo once it is shared, so the user stays in control of the final step.

## 1. Look at what is being committed

Run `git status` and `git diff --staged`.

- **Something is staged:** the staged changes are the commit. Mention any unstaged or untracked files briefly so nothing is left out by accident, but don't add them.
- **Nothing is staged:** this is the usual case, so don't point it out. If the user named the files to commit, use those. Otherwise list the changed and untracked files and ask which ones to include. Don't stage everything by default, because untracked folders often hold things the user never meant to commit (editor settings, `.DS_Store`, drafts). Stage the chosen files only after the user confirms the commit.
- **No commits yet in the repo:** that's fine; this will be the first commit.

Read the actual diff, not just file names. The message describes what changed, and you can only know that from the content.

## 2. Check whether it is one change or several

If the staged changes do unrelated things (for example a document rewrite plus a config tweak), say so and offer one message per group. Separate commits are easier to review and to revert. The user decides; if they want one commit, write one message that covers both.

## 3. Write the message

**Subject line**
- Imperative mood, as if completing "This commit will …": "Add staged release plan to PRD", not "Added" or "Adds".
- Capitalize the first word. No trailing period.
- Aim for 50 characters, and stay under 72.
- No type prefixes (`feat:`, `docs:`) and no emoji.
- Say what changed in terms the reader cares about. "Fix overlap check in suggester" beats "Update suggester.py".

**Body: only when the why isn't obvious**
Most small changes need only a subject line. Add a body when a reader of the diff would ask "why?": a non-obvious decision, a trade-off, a workaround, a reverted approach, or context from outside the code. Leave a blank line after the subject and wrap at 72 characters. Explain the reason, not a list of every file touched; the diff already shows that.

**No attribution lines**
Don't add `Co-Authored-By:` or any other trailer lines, even if the session suggests them. The user wants commits to contain only the subject and, when needed, the body.

## 4. Show it and wait

Present the message in a code block, with one line on what will be committed (for example "3 staged files in docs/"). Then ask whether to commit. Edit the message if the user asks for changes.

If the current branch is the default branch (usually `main`), propose a short branch name that fits the change (for example `docs/prd-metrics`) and ask whether to create it or commit on the default branch. Ask this together with the message, so the user answers once. In a solo repo committing on `main` is often fine, so this is the user's call, not a rule. If the session's own rules require a branch, say so and propose one.

Only run `git commit` after a clear yes. Don't push: pushing publishes the work, and it's a separate request the user makes themselves.

When committing, pass the message through a heredoc so line breaks survive:

```bash
git commit -F - <<'EOF'
Subject line here

Optional body here.
EOF
```

Afterwards, report the short hash and the subject line.

## Examples

**Small change, subject only**
Diff: one typo fixed in README.md.
```
Fix typo in setup instructions
```

**Change whose reason isn't obvious**
Diff: the completion metric switches from "done on the planned block's date" to "done by the end of the cohort week".
```
Count completion by cohort week in PRD metrics

Counting by the planned block's date let postponed tasks drop out of
the denominator, so postponing raised the completion rate. A frozen
cohort week keeps every planned task in the count.
```

**Mixed changes**
Diff: PRD rewrite plus a new `.gitignore` entry for `.DS_Store`.
Suggest two commits: "Revise PRD after requirements review" and "Ignore macOS .DS_Store files".
