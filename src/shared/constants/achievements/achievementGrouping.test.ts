import { describe, expect, it } from 'vitest';

import { organizeAchievementsForDisplay } from './achievementGrouping';

describe('organizeAchievementsForDisplay', () => {
  const sample = [
    { id: '1', category: 'estudio', group: 'estudio_general', title: 'A', status: 'completed' },
    { id: '2', category: 'fases', group: 'fases_lectura_critica', title: 'B', status: 'incomplete' },
    { id: '3', category: 'fases', group: 'fases_matematicas', title: 'C', status: 'completed' },
    { id: '4', category: 'lectura', group: 'lectura_guias', title: 'D', status: 'incomplete' },
  ];

  it('agrupa por categoría y subgrupo', () => {
    const sections = organizeAchievementsForDisplay(sample, 'all');
    expect(sections.map((section) => section.categoryKey)).toEqual(['estudio', 'fases', 'lectura']);
    expect(sections[1]?.groups.map((group) => group.groupKey)).toEqual(['fases_lectura_critica', 'fases_matematicas']);
  });

  it('filtra por categoría fases', () => {
    const sections = organizeAchievementsForDisplay(sample, 'fases');
    expect(sections).toHaveLength(1);
    expect(sections[0]?.totalCount).toBe(2);
  });
});
