import type { LearningPhaseNumber } from '@/features/learning/constants/learningPhases';

export const LESSON_REWARD_BASE_XP = 50;
export const LESSON_REWARD_BASE_COINS = 25;

export function getLessonPhaseRewardMultiplier(phase: LearningPhaseNumber): number {
  return phase;
}

export function getLessonRewardsForPhase(phase: LearningPhaseNumber): { xp: number; coins: number } {
  const multiplier = getLessonPhaseRewardMultiplier(phase);
  return {
    xp: LESSON_REWARD_BASE_XP * multiplier,
    coins: LESSON_REWARD_BASE_COINS * multiplier,
  };
}
