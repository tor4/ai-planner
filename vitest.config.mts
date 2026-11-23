import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'eslint-rules/**/*.test.ts',
      'apps/*/src/**/*.test.{ts,tsx}',
      'packages/*/src/**/*.test.{ts,tsx}',
    ],
    coverage: {
      provider: 'v8',
      include: ['apps/*/src/**/*.{ts,tsx}', 'packages/*/src/**/*.{ts,tsx}'],
      exclude: ['**/*.test.{ts,tsx}', '**/*.d.ts'],
      thresholds: { lines: 80, branches: 80, functions: 80, statements: 80 },
    },
  },
});
