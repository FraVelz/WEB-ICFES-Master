import { isMinimumRequirementsLessonId } from '@/features/learning/data/phaseMinimumRequirements';
import type { NormalizedQuizQuestion } from './quizTypes';
import { shuffleQuestionOptions, shuffleQuizQuestions } from './shuffleQuizQuestions';

/** Requisitos mínimos: orden fijo para que A/B/C coincida con la calificación del servidor. */
export function prepareLessonQuizQuestions(
  lessonId: string | null | undefined,
  questions: NormalizedQuizQuestion[]
): NormalizedQuizQuestion[] {
  if (lessonId && isMinimumRequirementsLessonId(lessonId)) {
    return questions.map((question) => ({ ...question, options: [...question.options] }));
  }
  return shuffleQuizQuestions(questions);
}

export function reshuffleLessonQuizQuestion(
  lessonId: string | null | undefined,
  question: NormalizedQuizQuestion
): NormalizedQuizQuestion {
  if (lessonId && isMinimumRequirementsLessonId(lessonId)) {
    return { ...question, options: [...question.options] };
  }
  return shuffleQuestionOptions(question);
}
