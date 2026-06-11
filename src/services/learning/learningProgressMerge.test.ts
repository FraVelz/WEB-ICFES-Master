import { describe, expect, it } from 'vitest';
import { mergeCompletedLessons, mergeLearningProgress, mergePhaseSkips } from './learningProgressMerge';

describe('learningProgressMerge', () => {
  it('une lecciones sin duplicar', () => {
    expect(mergeCompletedLessons(['a', 'b'], ['b', 'c'])).toEqual(['a', 'b', 'c']);
  });

  it('conserva el salto de fase más reciente por área y sección', () => {
    const merged = mergePhaseSkips(
      [{ areaId: 'lectura-critica', sectionId: 'facil', passedAt: '2026-01-01T00:00:00.000Z', score: 70 }],
      [{ areaId: 'lectura-critica', sectionId: 'facil', passedAt: '2026-02-01T00:00:00.000Z', score: 80 }]
    );
    expect(merged).toHaveLength(1);
    expect(merged[0]?.score).toBe(80);
  });

  it('fusiona snapshot local y remoto', () => {
    const merged = mergeLearningProgress(
      { completedLessons: ['l1'], phaseSkips: [] },
      {
        completedLessons: ['l2'],
        phaseSkips: [{ areaId: 'matematicas', sectionId: 'facil', passedAt: '2026-01-01', score: 75 }],
      }
    );
    expect(merged.completedLessons).toEqual(['l1', 'l2']);
    expect(merged.phaseSkips).toHaveLength(1);
  });
});
