import { PHASE_SKIP_PASS_PERCENT } from '@/services/persistence/phaseSkipPersistence';

export { PHASE_SKIP_PASS_PERCENT };

export const PHASE_SKIP_MIN_QUESTIONS = 120;

export const PHASE_SKIP_REWARD_XP = 1000;
export const PHASE_SKIP_REWARD_COINS = 500;

/** Duración estimada del examen: 2 min por pregunta × 120 ≈ 4 h. */
export const PHASE_SKIP_SESSION_TTL_MS = 5 * 60 * 60 * 1000;

export function getPhaseSkipRewardReason(areaId: string, sectionId: string): string {
  return `phase_skip_${areaId}_${sectionId}`;
}
