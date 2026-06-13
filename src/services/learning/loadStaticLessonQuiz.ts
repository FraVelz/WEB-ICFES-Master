import {
  buildMinimumRequirementsLesson,
  parseAreaFromMinimumRequirementsId,
} from '@/features/learning/data/phaseMinimumRequirements';
import { normalizeQuizQuestions } from '@/features/learning/roadmap/lessonQuiz/normalizeQuizQuestions';
import type { QuizInput, QuizQuestionInput } from '@/features/learning/roadmap/lessonQuiz/quizTypes';

export function loadStaticLessonQuiz(lessonId: string) {
  const areaId = parseAreaFromMinimumRequirementsId(lessonId);
  if (!areaId) return null;

  const lesson = buildMinimumRequirementsLesson(areaId);
  if (!lesson) return null;

  const normalized = normalizeQuizQuestions(
    lesson.questions as QuizQuestionInput[] | undefined,
    lesson.quiz as QuizInput | undefined
  );

  if (normalized.length === 0) return null;

  return {
    lessonId,
    questions: normalized,
    rewards: lesson.rewards ?? (lesson.quiz as QuizInput | undefined)?.rewards,
  };
}
