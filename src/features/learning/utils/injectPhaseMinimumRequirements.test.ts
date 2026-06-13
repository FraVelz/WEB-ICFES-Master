import { describe, expect, it } from 'vitest';
import { getMinimumRequirementsLessonId } from '@/features/learning/data/phaseMinimumRequirements';
import type { LearningPathLesson } from '@/features/learning/services/LearningService';
import { injectPhaseMinimumRequirements } from '@/features/learning/utils/injectPhaseMinimumRequirements';

const sampleLesson = (id: string, phase: 1 | 2 | 3): LearningPathLesson => ({
  id,
  order: 1,
  phase,
  difficulty: phase === 1 ? 'facil' : phase === 2 ? 'intermedio' : 'dificil',
  rewards: { xp: 50, coins: 25 },
});

describe('injectPhaseMinimumRequirements', () => {
  it('antepone el módulo al inicio de la fase 1', () => {
    const lessons = [sampleLesson('a', 1), sampleLesson('b', 2)];
    const result = injectPhaseMinimumRequirements('matematicas', lessons);

    expect(result[0]?.id).toBe(getMinimumRequirementsLessonId('matematicas'));
    expect(result[1]?.id).toBe('a');
    expect(result).toHaveLength(3);
  });

  it('no inserta en fases 2 o 3', () => {
    const lessons = [sampleLesson('a', 2)];
    expect(injectPhaseMinimumRequirements('matematicas', lessons, 2)).toEqual(lessons);
    expect(injectPhaseMinimumRequirements('matematicas', lessons, 3)).toEqual(lessons);
  });

  it('no duplica si el id ya existe', () => {
    const reqId = getMinimumRequirementsLessonId('lectura-critica');
    const lessons = [sampleLesson(reqId, 1), sampleLesson('otra', 1)];
    const result = injectPhaseMinimumRequirements('lectura-critica', lessons, 1);
    expect(result).toHaveLength(2);
  });
});
