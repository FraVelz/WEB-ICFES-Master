import { describe, expect, it } from 'vitest';
import { getLessonRewardsForPhase } from './lessonRewards';

describe('getLessonRewardsForPhase', () => {
  it('fase 1: 50 XP y 25 monedas', () => {
    expect(getLessonRewardsForPhase(1)).toEqual({ xp: 50, coins: 25 });
  });

  it('fase 2: x2 (100 XP y 50 monedas)', () => {
    expect(getLessonRewardsForPhase(2)).toEqual({ xp: 100, coins: 50 });
  });

  it('fase 3: x3 (150 XP y 75 monedas)', () => {
    expect(getLessonRewardsForPhase(3)).toEqual({ xp: 150, coins: 75 });
  });
});
