import { gamificationPersistence } from '@/services/persistence/gamificationPersistence';
import {
  FULL_EXAM_COMPLETION_XP,
  FULL_EXAM_XP_PER_CORRECT,
  PRACTICE_XP_PER_CORRECT,
} from '@/shared/constants/gamification';

export async function awardPracticeXp(userId: string, correctCount: number): Promise<void> {
  const points = Math.max(0, correctCount) * PRACTICE_XP_PER_CORRECT;
  if (points <= 0) return;
  await gamificationPersistence.addXP(userId, points, `practice_${Date.now()}`);
}

export async function awardFullExamXp(userId: string, correctCount: number): Promise<void> {
  const points = FULL_EXAM_COMPLETION_XP + Math.max(0, correctCount) * FULL_EXAM_XP_PER_CORRECT;
  if (points <= 0) return;
  await gamificationPersistence.addXP(userId, points, `exam_full_${Date.now()}`);
}
