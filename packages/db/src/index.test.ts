import { describe, expect, it } from 'vitest';
import { packageName } from './index';

describe('@ai-planner/db', () => {
  it('exports its package name', () => {
    expect(packageName).toBe('@ai-planner/db');
  });
});
