import { describe, expect, it } from 'vitest';
import { getMinimumRequirementsLessonId } from '@/features/learning/data/phaseMinimumRequirements';
import { normalizeQuizQuestions } from '@/features/learning/roadmap/lessonQuiz/normalizeQuizQuestions';
import { prepareLessonQuizQuestions } from '@/features/learning/roadmap/lessonQuiz/prepareLessonQuizQuestions';
import { buildMinimumRequirementsLesson } from '@/features/learning/data/phaseMinimumRequirements';

describe('prepareLessonQuizQuestions', () => {
  it('no mezcla opciones en requisitos mínimos', () => {
    const lesson = buildMinimumRequirementsLesson('lectura-critica');
    const base = normalizeQuizQuestions(lesson?.questions as never[], lesson?.quiz as never);
    const literal = base.find((q) => q.id === 'req_lc_2');
    expect(literal).toBeDefined();

    const prepared = prepareLessonQuizQuestions(getMinimumRequirementsLessonId('lectura-critica'), base);
    const preparedLiteral = prepared.find((q) => q.id === 'req_lc_2');

    expect(preparedLiteral?.options.map((o) => o.text)).toEqual(literal?.options.map((o) => o.text));
    expect(preparedLiteral?.correctAnswer).toBe('a');
    expect(preparedLiteral?.options[0]?.text).toContain('explícita');
  });
});
