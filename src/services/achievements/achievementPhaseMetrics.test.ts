import { beforeEach, describe, expect, it, vi } from 'vitest';

import { computePhaseAchievementMetrics } from './achievementPhaseMetrics';
import { phaseAchievementId } from '@/shared/constants/achievements/achievementsPhases';

vi.mock('@/features/learning/services/LearningService', () => ({
  LearningService: {
    getLearningPath: vi.fn(async (areaId: string) => [
      { id: `${areaId}-lesson-1`, title: 'L1', order: 0, phase: 1, difficulty: 'facil', rewards: {} },
      { id: `${areaId}-lesson-2`, title: 'L2', order: 1, phase: 1, difficulty: 'facil', rewards: {} },
    ]),
  },
}));

vi.mock('@/services/learning/learningProgressLocal', () => ({
  getLocalLearningProgress: vi.fn(() => ({
    completedLessons: ['lectura-critica-lesson-1', 'lectura-critica-lesson-2'],
    phaseSkips: [{ areaId: 'matematicas', sectionId: 'facil', passedAt: '2026-01-01', score: 80 }],
  })),
}));

vi.mock('@/storage/progressStorage', () => ({
  getStoredPractices: vi.fn(() => [
    { type: 'practice', practiceArea: 'lectura-critica', percentage: 75, examMode: 'area-general' },
  ]),
}));

describe('computePhaseAchievementMetrics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('marca fase completada por lecciones, salto o simulacro general', async () => {
    const metrics = await computePhaseAchievementMetrics();

    expect(metrics[phaseAchievementId('cimentacion', 'lectura-critica')]).toBe(1);
    expect(metrics[phaseAchievementId('cimentacion', 'matematicas')]).toBe(1);
    expect(metrics[phaseAchievementId('relacion', 'lectura-critica')]).toBe(0);
    expect(metrics[phaseAchievementId('simulacro', 'lectura-critica')]).toBe(1);
  });
});
