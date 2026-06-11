import { loadLessonQuizQuestions } from '@/services/supabase/LearningSupabaseServer';
import { gamificationPersistence } from '@/services/persistence/gamificationPersistence';
import { addCoinsBalance } from '@/services/persistence/coinsPersistence';

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
  lessonId: string,
  lessonXp?: number,
  lessonCoins?: number
): Promise<{ xp: number; coins: number }> {
  const lesson = await loadLessonQuizQuestions(lessonId);
  const xp = lessonXp ?? lesson?.rewards?.xp ?? 500;
  const coins = lessonCoins ?? lesson?.rewards?.coins ?? 250;

  await gamificationPersistence.addXP(userId, xp, `lesson_quiz_${lessonId}`);
  await addCoinsBalance(userId, coins, `lesson_quiz_${lessonId}`);

  return { xp, coins };
}
