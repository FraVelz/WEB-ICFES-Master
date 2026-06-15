import { loadLessonQuizQuestions } from '@/services/supabase/LearningSupabaseServer';
import { getLessonRewardsForPhase } from '@/features/learning/utils/lessonRewards';
import {
  addCoinsServer,
  addXpServer,
  hasRewardReason,
} from '@/services/supabase/gamification/gamificationServerEconomy';
import { gradeLessonQuizAnswersPure } from './gradeLessonQuizAnswersPure';
import type { LessonQuizGradeResult } from './quizTypes';

export async function gradeLessonQuizAnswers(
  lessonId: string,
  answers: Record<string, string>
): Promise<{ results: LessonQuizGradeResult[]; allCorrect: boolean }> {
  const lesson = await loadLessonQuizQuestions(lessonId);
  if (!lesson) {
    throw new Error('Lección no encontrada');
  }

  return gradeLessonQuizAnswersPure(lesson.questions, answers);
}

export async function awardLessonQuizRewards(
  userId: string,
  lessonId: string
): Promise<{ xp: number; coins: number; alreadyAwarded: boolean }> {
  const reason = `lesson_quiz_${lessonId}`;

  if (await hasRewardReason(userId, reason)) {
    return { xp: 0, coins: 0, alreadyAwarded: true };
  }

  const lesson = await loadLessonQuizQuestions(lessonId);
  const phase = lesson?.phase ?? 1;
  const { xp, coins } = getLessonRewardsForPhase(phase);

  const [xpResult, coinsResult] = await Promise.all([
    addXpServer(userId, xp, reason),
    addCoinsServer(userId, coins, reason),
  ]);

  return {
    xp: xpResult.awarded ? xp : 0,
    coins: coinsResult.awarded ? coins : 0,
    alreadyAwarded: !xpResult.awarded && !coinsResult.awarded,
  };
}
