import { describe, expect, it } from 'vitest';

import { getStreakScope } from '@/services/streak';

describe('useDailyStreakOnLearningRoute scope', () => {
  it('resolves demo scope when demoMode is true', () => {
    expect(getStreakScope(undefined, true)).toBe('demo');
  });

  it('prefers authenticated user over demo flag', () => {
    expect(getStreakScope('user-1', true)).toBe('user-1');
  });

  it('returns null without user or demo', () => {
    expect(getStreakScope(undefined, false)).toBeNull();
  });
});
