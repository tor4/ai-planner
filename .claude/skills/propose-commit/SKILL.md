---
name: propose-commit
description: Write a git commit message for the current changes and commit after the user confirms. Use this whenever the user asks to commit, wants a commit message, says "commit this", "save this to git", "write a commit msg", or finishes a piece of work and wants it recorded, even if they don't mention the message itself.
metadata:
  version: "0.2.0"
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

**Body: only when the subject isn't enough, and then as bullet points**
If the subject line fully explains the commit, so a reader understands what is in it without opening the diff, use the subject alone. A typo fix, a one-line config change or a single small edit usually fits in one line.

If the subject can't say it all (several changes, changes across areas, or a reason the reader would ask about), add a body of bullet points:

- Leave a blank line after the subject.
- One change per bullet, written as `- ` plus an imperative phrase: "- Remove the 7-day restore". No long sentences or paragraphs.
- Describe changes in terms the reader cares about, not a list of every file touched.
- When the commit spans areas, group the bullets under short headings such as `PRD:` and `Architecture:`, with a blank line between groups.
- When a reader of the diff would ask "why?" (a non-obvious decision, a trade-off, a workaround), give the reason in its own bullet, for example "- Count by cohort week so postponed tasks stay in the denominator".
- Wrap at 72 characters; indent continuation lines by two spaces.
- Keep it short: a few bullets for a medium change; a large one rarely needs more than ten.

**No attribution lines**
Don't add `Co-Authored-By:` or any other trailer lines, even if the session suggests them. The user wants commits to contain only the subject and, when needed, the body.

## 4. Show it and wait

Present the full message, subject and body, in a code block, with one line on what will be committed (for example "3 staged files in docs/"). Then ask whether to commit. Edit the message if the user asks for changes.

If the current branch is the default branch (usually `main`), propose a short branch name that fits the change (for example `docs/prd-metrics`) and ask whether to create it or commit on the default branch. Ask this together with the message, so the user answers once. In a solo repo committing on `main` is often fine, so this is the user's call, not a rule. If the session's own rules require a branch, say so and propose one.

Only run `git commit` after a clear yes. Don't push: pushing publishes the work, and it's a separate request the user makes themselves.

When committing, pass the message through a heredoc so line breaks survive:

```bash
git commit -F - <<'EOF'
Subject line here

- First change, if a body is needed
- Second change
EOF
```

Afterwards, report the short hash and the subject line.

## Examples

**Small change, subject only**
Diff: one typo fixed in README.md. The subject says everything.

```
Fix typo in setup instructions
```

**Change whose reason isn't obvious**
Diff: the completion metric switches from "done on the planned block's date" to "done by the end of the cohort week".

```
Count completion by cohort week in PRD metrics

- Count a task as done by the end of its frozen cohort week
- Stop counting by the planned block's date, which let postponed
  tasks drop out of the denominator and raised the completion rate
```

**Change across several areas**
Diff: Drop is replaced by "Not now" in the PRD and the architecture.

```
Replace Drop with Not now in PRD and architecture

PRD:
- Remove Drop and the 7-day restore from Must 6
- Add "Not now", which unplans a task and keeps it open

Architecture:
- Remove the drop and undoDrop routes
- Add notNow and undoNotNow
```

**Mixed changes**
Diff: PRD rewrite plus a new `.gitignore` entry for `.DS_Store`.
Suggest two commits: "Revise PRD after requirements review", with bullets for what was revised, and "Ignore macOS .DS_Store files", which needs no body.
