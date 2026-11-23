import { describe, expect, it } from 'vitest';
import { packageName } from './index';

describe('@ai-planner/web', () => {
  it('exports its package name', () => {
    expect(packageName).toBe('@ai-planner/web');
  });
});
