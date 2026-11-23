import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

const eslint = new ESLint({ overrideConfigFile: 'eslint.config.mjs' });

async function messages(filePath: string, code: string) {
  const [result] = await eslint.lintText(code, { filePath });
  return result?.messages.map((m) => m.message) ?? [];
}

const core = 'packages/core/src/example.ts';

describe('packages/core purity rule', () => {
  it.each([
    ['Date.now()', 'export const t = Date.now();'],
    ['new Date() with no arguments', 'export const t = new Date();'],
    ['fetch', "export const r = fetch('https://example.com');"],
    [
      'node:fs',
      "import { readFileSync } from 'node:fs';\nexport const f = readFileSync;",
    ],
    ['Date() without new', 'export const t = Date();'],
    ['performance.now()', 'export const t = performance.now();'],
    ['Math.random()', 'export const r = Math.random();'],
    [
      'globalThis.fetch',
      "export const r = globalThis.fetch('https://example.com');",
    ],
    ['globalThis.Date.now()', 'export const t = globalThis.Date.now();'],
    [
      'os without the node: prefix',
      "import { cpus } from 'os';\nexport const c = cpus;",
    ],
    ['http2', "import http2 from 'http2';\nexport const h = http2;"],
    [
      'stream',
      "import { Readable } from 'stream';\nexport const s = Readable;",
    ],
    ['node-fetch', "import fetch from 'node-fetch';\nexport const f = fetch;"],
    [
      'postgres',
      "import postgres from 'postgres';\nexport const p = postgres;",
    ],
    ['node:http', "import http from 'node:http';\nexport const h = http;"],
    [
      'the db package',
      "import { packageName } from '@ai-planner/db';\nexport const n = packageName;",
    ],
  ])('reports %s', async (_name, code) => {
    const found = await messages(core, code);
    expect(found.some((m) => m.includes('packages/core must'))).toBe(true);
  });

  it('allows new Date with an argument', async () => {
    expect(await messages(core, 'export const t = new Date(0);')).toEqual([]);
  });

  it('does not apply outside packages/core', async () => {
    expect(
      await messages('apps/api/src/example.ts', 'export const t = Date.now();'),
    ).toEqual([]);
  });
});
