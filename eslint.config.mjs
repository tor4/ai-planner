import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

// packages/core has no input or output (architecture 19.4): no database, network or
// file-system imports, and no reading the clock. The current time is passed in.
const ioModules = [
  'node:*',
  'fs',
  'fs/*',
  'http',
  'https',
  'net',
  'tls',
  'dns',
  'child_process',
  'pg',
  '@neondatabase/*',
  'drizzle-orm',
  'drizzle-orm/*',
  '@ai-planner/db',
  'undici',
  'axios',
];
const corePurity = {
  'no-restricted-imports': [
    'error',
    {
      patterns: ioModules.map((group) => ({
        group: [group],
        message:
          'packages/core must not do input or output. Pass data in instead.',
      })),
    },
  ],
  'no-restricted-syntax': [
    'error',
    {
      selector:
        "CallExpression[callee.object.name='Date'][callee.property.name='now']",
      message:
        'packages/core must not read the clock. Pass the current time in.',
    },
    {
      selector: "NewExpression[callee.name='Date'][arguments.length=0]",
      message:
        'packages/core must not read the clock. Pass the current time in.',
    },
    {
      selector: "CallExpression[callee.name='fetch']",
      message: 'packages/core must not use the network.',
    },
  ],
};

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      'coverage/**',
      'test-results/**',
      'playwright-report/**',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    rules: { complexity: ['error', 15] },
  },
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    extends: [
      reactHooks.configs.flat.recommended,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: { globals: globals.browser },
  },
  {
    files: [
      'apps/api/**/*.ts',
      'apps/scheduler/**/*.ts',
      'packages/db/**/*.ts',
      'eslint-rules/**/*.ts',
      'e2e/**/*.ts',
      '*.ts',
    ],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['packages/core/**/*.ts'],
    rules: corePurity,
  },
);
