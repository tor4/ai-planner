#!/usr/bin/env node
// PreToolUse hook for Bash: block commands that write to .env files
// (redirects, tee, sed -i, perl -i, cp, mv, rm, touch, truncate, ln, install, dd, rsync).
// Reading (cat) is not blocked, and .env.example and .env.sample are allowed.
// It checks the command text only, so a script that writes the file on its own is not caught.
// Fails closed: input it cannot read is blocked.
import { block, readInput } from './lib.mjs';

const input = readInput();
if (!input) block('Blocked: the .env guard could not read the hook input.');

const command = input.tool_input?.command;
if (command) {
  // Drop harmless forms: .env.example/.env.sample, and fd redirects like 2>&1.
  const cleaned = command.replace(/\.env\.(example|sample)/g, '').replace(/\d*>&\d/g, '');
  const mentionsEnv = /(^|[^A-Za-z0-9_.-])\.env(\.[A-Za-z0-9_-]+)?($|[^A-Za-z0-9_.-])/.test(
    cleaned,
  );
  const writes =
    />>?\s*\S*\.env/.test(cleaned) ||
    /(^|[^A-Za-z0-9_-])(tee|cp|mv|rm|touch|truncate|ln|install|dd|rsync)([^A-Za-z0-9_-]|$)/.test(
      cleaned,
    ) ||
    /(sed|perl)[^|;&]*\s-[A-Za-z]*i/.test(cleaned);
  if (mentionsEnv && writes) {
    block(
      'Blocked: this command writes to a .env file. Edits to .env files are not allowed. Ask the user to edit it, and keep real values out of the conversation.',
    );
  }
}
