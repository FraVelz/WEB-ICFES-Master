import { loadLessonQuizQuestions } from '@/services/supabase/LearningSupabaseServer';
import { addCoinsServer, addXpServer, hasRewardReason } from '@/services/supabase/gamification/gamificationServerEconomy';

export type LessonQuizGradeResult = {
  questionId: string;
  correct: boolean;
  correctAnswer: string;
  explanation: string;
};

export async function gradeLessonQuizAnswers(
  lessonId: string,
  answers: Record<string, string>
): Promise<{ results: LessonQuizGradeResult[]; allCorrect: boolean }> {
  const lesson = await loadLessonQuizQuestions(lessonId);
  if (!lesson) {
    throw new Error('Lección no encontrada');
  }

  const results = lesson.questions
    .filter((q) => answers[q.id] != null)
    .map((question) => {
      const userAnswer = answers[question.id] ?? '';
      return {
        questionId: question.id,
        correct: userAnswer === question.correctAnswer,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
      };
    });

  const allCorrect =
    lesson.questions.length > 0 &&
    lesson.questions.every((q) => answers[q.id] === q.correctAnswer);

  return { results, allCorrect };
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
  const xp = lesson?.rewards?.xp ?? 500;
  const coins = lesson?.rewards?.coins ?? 250;

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
