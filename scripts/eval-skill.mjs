#!/usr/bin/env node
// Run a project skill's test cases with `claude plugin eval`.
// Usage: npm run eval:skill -- <skill-name> [extra claude plugin eval options]
// Example: npm run eval:skill -- strict-requirements-review --case review-only-no-rewrite
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const skillsDir = resolve(root, '.claude/skills');

const skillsWithTests = () =>
  readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(resolve(skillsDir, entry.name, 'evals')))
    .map((entry) => entry.name);

const fail = (message) => {
  console.error(message);
  console.error('Skills with tests:');
  for (const name of skillsWithTests()) console.error(`  ${name}`);
  process.exit(1);
};

const [skill, ...options] = process.argv.slice(2);
if (!skill) {
  console.error('Usage: npm run eval:skill -- <skill-name> [options]');
  fail('');
}

const skillDir = resolve(skillsDir, skill);
if (!existsSync(resolve(skillDir, 'evals'))) {
  fail(`No tests found for skill '${skill}' (expected ${skillDir}/evals).`);
}

const shell = process.platform === 'win32';
if (spawnSync('claude', ['--version'], { stdio: 'ignore', shell }).status !== 0) {
  console.error('The claude CLI is not installed or not on PATH.');
  process.exit(1);
}

const result = spawnSync(
  'claude',
  ['plugin', 'eval', '.', '--allow-tools', 'Write', 'Edit', 'Bash', '--scaffold', ...options],
  { cwd: skillDir, stdio: 'inherit', shell },
);
process.exit(result.status ?? 1);
