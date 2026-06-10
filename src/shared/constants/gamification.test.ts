import { describe, expect, it } from 'vitest';
import { countsForWeeklyLeagueXp } from './gamification';

describe('countsForWeeklyLeagueXp', () => {
  it('incluye actividad de estudio', () => {
    expect(countsForWeeklyLeagueXp('lesson_quiz_abc')).toBe(true);
    expect(countsForWeeklyLeagueXp('practice_123')).toBe(true);
    expect(countsForWeeklyLeagueXp('exam_full_123')).toBe(true);
  });

  it('excluye logros y migración demo', () => {
    expect(countsForWeeklyLeagueXp('achievement_study_1')).toBe(false);
    expect(countsForWeeklyLeagueXp('league_explorador')).toBe(false);
    expect(countsForWeeklyLeagueXp('demo_migration')).toBe(false);
  });
});
