import { describe, expect, it } from 'vitest';

import {
  organizeChainViewsForDisplay,
  resolveAchievementChainViews,
  getAchievementChainSummary,
} from './achievementChainDisplay';

describe('resolveAchievementChainViews', () => {
  const sample = [
    {
      id: 'study_1',
      category: 'estudio',
      group: 'estudio_general',
      status: 'completed',
      progress: 5,
      target: 5,
      title: 'T1',
      icon: 'book',
    },
    {
      id: 'study_2',
      category: 'estudio',
      group: 'estudio_general',
      status: 'in_progress',
      progress: 1,
      target: 20,
      title: 'T2',
      icon: 'book',
    },
    {
      id: 'perf_1',
      category: 'rendimiento',
      group: 'rendimiento_resultados',
      status: 'incomplete',
      progress: 0,
      target: 1,
      title: 'Perf',
      icon: 'brain',
    },
  ];

  it('muestra solo el escalón activo de una cadena', () => {
    const views = resolveAchievementChainViews(sample, 'logros');
    const study = views.find((item) => item.chainId === 'estudio_lecciones');
    expect(study?.id).toBe('study_2');
    expect(study?.tierLevel).toBe(2);
  });

  it('en perfil omite cadenas bloqueadas y sueltas sin avance', () => {
    const views = resolveAchievementChainViews(sample, 'profile');
    expect(views.some((item) => item.id === 'study_2')).toBe(true);
    expect(views.some((item) => item.id === 'perf_1')).toBe(false);
  });

  it('agrupa cadenas por categoría', () => {
    const views = resolveAchievementChainViews(sample, 'logros');
    const sections = organizeChainViewsForDisplay(views, 'all');
    expect(sections.some((section) => section.categoryKey === 'estudio')).toBe(true);
    expect(sections.find((section) => section.categoryKey === 'estudio')?.totalCount).toBe(1);
  });

  it('resume tiers y metas visibles', () => {
    const summary = getAchievementChainSummary(sample);
    expect(summary.completedTiers).toBe(1);
    expect(summary.totalTiers).toBe(3);
    expect(summary.inProgressChains).toBe(1);
  });
});
