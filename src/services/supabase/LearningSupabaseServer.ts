import { createServerSupabaseClient } from '@/config/supabaseClient';
import { normalizeLessonPhase } from '@/features/learning/constants/learningPhases';
import { normalizeQuizQuestions } from '@/features/learning/roadmap/lessonQuiz/normalizeQuizQuestions';
import type { QuizInput, QuizQuestionInput } from '@/features/learning/roadmap/lessonQuiz/quizTypes';
import { loadStaticLessonQuiz } from '@/services/learning/loadStaticLessonQuiz';

const TABLE = 'learning_content';

type LessonQuizContent = {
  questions?: QuizQuestionInput[];
  quiz?: QuizInput;
  rewards?: { xp?: number; coins?: number };
};

export async function loadLessonQuizQuestions(lessonId: string) {
  const staticLesson = loadStaticLessonQuiz(lessonId);
  if (staticLesson) return staticLesson;

  const sb = createServerSupabaseClient();
  if (!sb) return null;

  const { data, error } = await sb
    .from(TABLE)
    .select('id, phase, content')
    .eq('id', lessonId)
    .eq('published', true)
    .maybeSingle();

  if (error) throw new Error(`Error leyendo lección: ${error.message}`);
  if (!data) return null;

  const content = (data.content ?? {}) as LessonQuizContent;
  const normalized = normalizeQuizQuestions(content.questions, content.quiz);

  if (normalized.length === 0) return null;

  return {
    lessonId: data.id as string,
    questions: normalized,
    phase: normalizeLessonPhase(data.phase),
    rewards: content.quiz?.rewards,
  };
}

export async function loadLessonQuizQuestionsBatch(lessonIds: string[]) {
  if (lessonIds.length === 0) return [];

  const staticResults = lessonIds
    .map((lessonId) => loadStaticLessonQuiz(lessonId))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  const staticIds = new Set(staticResults.map((entry) => entry.lessonId));
  const remoteIds = lessonIds.filter((id) => !staticIds.has(id));

  const sb = createServerSupabaseClient();
  if (!sb && remoteIds.length > 0) {
    return staticResults;
  }

  let remoteResults: Array<{ lessonId: string; questions: ReturnType<typeof normalizeQuizQuestions> }> = [];

  if (sb && remoteIds.length > 0) {
    const { data, error } = await sb.from(TABLE).select('id, content').in('id', remoteIds).eq('published', true);

    if (error) throw new Error(`Error leyendo lecciones: ${error.message}`);

    remoteResults = (data ?? [])
      .map((row) => {
        const content = (row.content ?? {}) as LessonQuizContent;
        const normalized = normalizeQuizQuestions(content.questions, content.quiz);
        if (normalized.length === 0) return null;
        return {
          lessonId: String(row.id),
          questions: normalized,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  }

  return [
    ...staticResults.map((entry) => ({ lessonId: entry.lessonId, questions: entry.questions })),
    ...remoteResults,
  ];
}
