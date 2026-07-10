import type { LearningPhaseNumber } from '@/features/learning/constants/learningPhases';

const LESSON_REWARD_BASE_XP = 50;
const LESSON_REWARD_BASE_COINS = 25;

function getLessonPhaseRewardMultiplier(phase: LearningPhaseNumber): number {
  return phase;
}

export function getLessonRewardsForPhase(phase: LearningPhaseNumber): { xp: number; coins: number } {
  const multiplier = getLessonPhaseRewardMultiplier(phase);
  return {
    xp: LESSON_REWARD_BASE_XP * multiplier,
    coins: LESSON_REWARD_BASE_COINS * multiplier,
  };
}
