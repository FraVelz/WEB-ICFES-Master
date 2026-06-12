import { beforeEach, describe, expect, it, vi } from 'vitest';

import { computePhaseAchievementMetrics } from './achievementPhaseMetrics';
import { phaseAchievementId } from '@/shared/constants/achievements/achievementsPhases';

vi.mock('@/services/learning/learningCatalogCache', () => ({
  fetchLearningCatalog: vi.fn(async () => ({
    'lectura-critica': [
      { id: 'lectura-critica-lesson-1', title: 'L1', order: 0, phase: 1, difficulty: 'facil', rewards: {} },
      { id: 'lectura-critica-lesson-2', title: 'L2', order: 1, phase: 1, difficulty: 'facil', rewards: {} },
    ],
    matematicas: [
      { id: 'matematicas-lesson-1', title: 'L1', order: 0, phase: 1, difficulty: 'facil', rewards: {} },
      { id: 'matematicas-lesson-2', title: 'L2', order: 1, phase: 1, difficulty: 'facil', rewards: {} },
    ],
    'ciencias-naturales': [],
    'sociales-ciudadanas': [],
    ingles: [],
  })),
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
