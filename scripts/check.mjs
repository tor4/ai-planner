#!/usr/bin/env node
// Runs every check, keeps going after a failure, and exits 1 if any failed.
// Usage: node scripts/check.mjs [--quick]   (--quick skips the end-to-end tests)
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

process.chdir(resolve(import.meta.dirname, '..'));
const quick = process.argv.includes('--quick');

const steps = [
  ['Prettier', 'npx', ['prettier', '--check', 'apps/web']],
  ['ESLint', 'npx', ['eslint', 'apps/web']],
  ['tsc (frontend)', 'npx', ['tsc', '-p', 'apps/web']],
  ['tsc (backend)', 'npx', ['tsc', '-p', 'apps/api']],
  ['gitleaks (history)', 'gitleaks', ['git', '--no-banner', '--redact', '.']],
  ['gitleaks (working tree)', 'gitleaks', ['dir', '--no-banner', '--redact', '.']],
  ['Unit tests, 80% coverage', 'npm', ['test']],
  ...(quick ? [] : [['End-to-end tests', 'npm', ['run', 'test:e2e']]]),
];

const failed = [];
for (const [name, command, args] of steps) {
  console.log(`\n=== ${name} ===`);
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (result.error) {
    console.error(
      result.error.code === 'ENOENT'
        ? `${command} is not installed or not on PATH.`
        : String(result.error),
    );
  }
  const ok = result.status === 0;
  console.log(`--- ${name}: ${ok ? 'ok' : 'FAILED'}`);
  if (!ok) failed.push(name);
}

console.log();
if (failed.length > 0) {
  console.log(`check FAILED: ${failed.join(', ')}`);
  process.exit(1);
}
console.log('check passed');
