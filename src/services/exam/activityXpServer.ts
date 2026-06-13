import { addXpServerWithMultiplier } from '@/services/supabase/gamification/gamificationServerEconomy';
import {
  FULL_EXAM_COMPLETION_XP,
  FULL_EXAM_XP_PER_CORRECT,
  PRACTICE_XP_PER_CORRECT,
} from '@/shared/constants/gamification';

export type ActivityAttemptType = 'practice' | 'full-exam';

function activityReason(attemptType: ActivityAttemptType, attemptId: number): string {
  return attemptType === 'full-exam' ? `exam_full_${attemptId}` : `practice_${attemptId}`;
}

function activityPoints(attemptType: ActivityAttemptType, correctCount: number): number {
  const safeCorrect = Math.max(0, correctCount);
  if (attemptType === 'full-exam') {
    return FULL_EXAM_COMPLETION_XP + safeCorrect * FULL_EXAM_XP_PER_CORRECT;
  }
  return safeCorrect * PRACTICE_XP_PER_CORRECT;
}

/** Otorga XP de práctica o examen completo solo desde Route Handlers verificados. */
export async function awardActivityXpServer(
  userId: string,
  attemptType: ActivityAttemptType,
  correctCount: number,
  attemptId: number
): Promise<{ awarded: boolean; xp: number; points: number }> {
  if (!Number.isFinite(attemptId) || attemptId <= 0) {
    throw new Error('ID de intento inválido');
  }

  const points = activityPoints(attemptType, correctCount);
  if (points <= 0) {
    return { awarded: false, xp: 0, points: 0 };
  }

  const result = await addXpServerWithMultiplier(userId, points, activityReason(attemptType, attemptId));
  return { awarded: result.awarded, xp: result.xp, points };
}
