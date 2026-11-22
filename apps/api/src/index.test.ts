import { describe, expect, it } from 'vitest';
import { packageName } from './index';

describe('@ai-planner/api', () => {
  it('exports its package name', () => {
    expect(packageName).toBe('@ai-planner/api');
  });
});
