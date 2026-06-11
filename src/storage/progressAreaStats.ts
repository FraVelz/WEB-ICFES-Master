import type { AreaStatItem } from './progressStorageTypes';

const AREA_LABELS = ['Matemáticas', 'Lectura Crítica', 'Ciencias Naturales', 'Sociales y Ciudadanas'] as const;

type AreaKey = 'matematicas' | 'lenguaje' | 'ciencias' | 'sociales';

const AREA_CONFIG: Record<AreaKey, { icon: string; color: string }> = {
  matematicas: { icon: 'calculator', color: 'from-yellow-500 to-yellow-600' },
  lenguaje: { icon: 'book-open', color: 'from-blue-500 to-blue-600' },
  ciencias: { icon: 'flask', color: 'from-green-500 to-green-600' },
  sociales: { icon: 'landmark', color: 'from-orange-500 to-orange-600' },
};

const AREA_KEYS: AreaKey[] = ['matematicas', 'lenguaje', 'ciencias', 'sociales'];

export function createEmptyAreaTotals(): Record<string, { total: number; correct: number }> {
  return {
    Matemáticas: { total: 0, correct: 0 },
    'Lectura Crítica': { total: 0, correct: 0 },
    'Ciencias Naturales': { total: 0, correct: 0 },
    'Sociales y Ciudadanas': { total: 0, correct: 0 },
  };
}

function buildAreaStat(name: string, totals: { total: number; correct: number }, key: AreaKey): AreaStatItem {
  const { icon, color } = AREA_CONFIG[key];
  const percentage = totals.total > 0 ? Math.round((totals.correct / totals.total) * 100) : 0;
  return { name, correct: totals.correct, total: totals.total, percentage, icon, color };
}

export function buildAreaStats(
  areaTotals: Record<string, { total: number; correct: number }>
): Record<string, AreaStatItem> {
  const stats: Record<string, AreaStatItem> = {};
  AREA_KEYS.forEach((key, index) => {
    const label = AREA_LABELS[index];
    stats[key] = buildAreaStat(label, areaTotals[label], key);
  });
  return stats;
}

export function buildDefaultAreaStats(): Record<string, AreaStatItem> {
  return buildAreaStats(createEmptyAreaTotals());
}

export function pickBestAndWeakAreas(areaStats: Record<string, AreaStatItem>): {
  bestArea: AreaStatItem | null;
  weakArea: AreaStatItem | null;
} {
  const areas = Object.values(areaStats).filter((area) => area.total > 0);
  if (areas.length === 0) return { bestArea: null, weakArea: null };
  const bestArea = areas.reduce<AreaStatItem>(
    (prev, current) => (prev.percentage > current.percentage ? prev : current),
    areas[0]
  );
  const weakArea = areas.reduce<AreaStatItem>(
    (prev, current) => (prev.percentage < current.percentage ? prev : current),
    areas[0]
  );
  return { bestArea, weakArea };
}
