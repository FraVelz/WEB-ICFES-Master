import { describe, expect, it } from 'vitest';
import { getMinimumRequirementsLessonId } from '@/features/learning/data/phaseMinimumRequirements';
import { gradeLessonQuizAnswersPure } from '@/features/learning/roadmap/lessonQuiz/gradeLessonQuizAnswersPure';
import { loadStaticLessonQuiz } from '@/services/learning/loadStaticLessonQuiz';

describe('loadStaticLessonQuiz', () => {
  it('carga el quiz de requisitos mínimos por área', () => {
    const lessonId = getMinimumRequirementsLessonId('lectura-critica');
    const loaded = loadStaticLessonQuiz(lessonId);

    expect(loaded?.lessonId).toBe(lessonId);
    expect(loaded?.questions.length).toBeGreaterThan(0);
  });
});

describe('gradeLessonQuizAnswersPure', () => {
  it('califica respuestas contra la clave del módulo estático', () => {
    const lessonId = getMinimumRequirementsLessonId('lectura-critica');
    const loaded = loadStaticLessonQuiz(lessonId);
    expect(loaded).not.toBeNull();
    if (!loaded) return;

    const first = loaded.questions[0];
    const { results, allCorrect } = gradeLessonQuizAnswersPure(loaded.questions, {
      [first.id]: first.correctAnswer,
    });

    expect(results[0]?.correct).toBe(true);
    expect(allCorrect).toBe(loaded.questions.length === 1);
  });
});
