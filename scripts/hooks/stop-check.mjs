#!/usr/bin/env node
// Stop hook: run `npm run check:quick` when Claude finishes a turn, but only when
// code or tooling files changed since the last run. On failure, block the stop once
// and send the output back to Claude to fix. When Claude stops again after that
// (stop_hook_active is true), let it stop, so the hook can't loop forever.
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { readInput } from './lib.mjs';

const input = readInput();
if (input?.stop_hook_active) process.exit(0);

const root = process.env.CLAUDE_PROJECT_DIR ?? resolve(import.meta.dirname, '../..');
process.chdir(root);

// Fingerprint of the changed, relevant files (names and contents).
const relevant = [
  'apps',
  'packages',
  'e2e',
  'package.json',
  'package-lock.json',
  'eslint.config.mjs',
  'tsconfig.base.json',
  'vitest.config.mts',
  'playwright.config.ts',
  '.prettierrc.json',
  '.gitleaks.toml',
  'lefthook.yml',
  'scripts',
];
let files;
try {
  files = execFileSync(
    'git',
    ['ls-files', '-m', '-o', '--exclude-standard', '--', ...relevant],
    { encoding: 'utf8' },
  )
    .split('\n')
    .filter(Boolean);
} catch {
  process.exit(0); // not a git repo: nothing to compare
}
if (files.length === 0) process.exit(0);

const hash = createHash('sha1');
for (const file of files) {
  hash.update(`${file}\n`);
  if (existsSync(file)) hash.update(readFileSync(file));
}
const fingerprint = hash.digest('hex');

const stateFile = resolve(root, 'node_modules/.cache/stop-check-state'); // git-ignored
if (existsSync(stateFile) && readFileSync(stateFile, 'utf8') === fingerprint) {
  process.exit(0); // nothing changed since the last check
}
mkdirSync(dirname(stateFile), { recursive: true });
writeFileSync(stateFile, fingerprint);

// `2>&1` keeps stdout and stderr in the order they were printed.
const result = spawnSync(`(${process.env.CHECK_CMD ?? 'npm run check:quick'}) 2>&1`, {
  shell: true,
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024,
});
if (result.status === 0) process.exit(0);

// Keep the tail: the summary of failed steps is at the end.
const output = `${result.stdout}${result.stderr}`
  .replace(/\x1b\[[0-9;]*m/g, '')
  .split('\n')
  .slice(-60)
  .join('\n');
console.log(
  JSON.stringify({
    decision: 'block',
    reason: `npm run check:quick failed. Fix what it found without weakening any rule, or tell the user why it cannot be fixed. Last lines of the output:\n\n${output}`,
  }),
);
