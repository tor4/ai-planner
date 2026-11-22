#!/usr/bin/env node
// PreToolUse hook: block Edit, Write, MultiEdit and NotebookEdit on .env files.
// .env.example and .env.sample stay editable because they hold no secrets.
// Fails closed: input it cannot read is blocked.
import { basename } from 'node:path';
import { block, readInput } from './lib.mjs';

const input = readInput();
if (!input) block('Blocked: the .env guard could not read the hook input.');

const path = input.tool_input?.file_path ?? input.tool_input?.notebook_path;
if (path) {
  const name = basename(path);
  const isSecretsFile =
    name === '.env' ||
    (name.startsWith('.env.') && name !== '.env.example' && name !== '.env.sample');
  if (isSecretsFile) {
    block(
      `Blocked: ${path} is a secrets file. Edits to .env files are not allowed. Ask the user to edit it, and keep real values out of the conversation.`,
    );
  }
}
