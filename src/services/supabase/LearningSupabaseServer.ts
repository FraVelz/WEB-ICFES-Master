import { createServerSupabaseClient } from '@/config/supabaseClient';
import { normalizeQuizQuestions } from '@/features/learning/roadmap/lessonQuiz/normalizeQuizQuestions';
import type { QuizInput, QuizQuestionInput } from '@/features/learning/roadmap/lessonQuiz/quizTypes';

const TABLE = 'learning_content';

type LessonQuizContent = {
  questions?: QuizQuestionInput[];
  quiz?: QuizInput;
  rewards?: { xp?: number; coins?: number };
};

export async function loadLessonQuizQuestions(lessonId: string) {
  const sb = createServerSupabaseClient();
  if (!sb) return null;

  const { data, error } = await sb.from(TABLE).select('id, content').eq('id', lessonId).eq('published', true).maybeSingle();

  if (error) throw new Error(`Error leyendo lección: ${error.message}`);
  if (!data) return null;

  const content = (data.content ?? {}) as LessonQuizContent;
  const normalized = normalizeQuizQuestions(content.questions, content.quiz);

  if (normalized.length === 0) return null;

  return {
    lessonId: data.id as string,
    questions: normalized,
    rewards: content.quiz?.rewards,
  };
}
