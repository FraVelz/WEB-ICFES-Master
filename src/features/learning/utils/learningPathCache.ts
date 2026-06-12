import type { PathSection } from '@/features/learning/roadmap/AreaPath';

type CacheEntry = {
  sections: PathSection[];
};

const cache = new Map<string, CacheEntry>();

export function getLearningPathCacheKey(
  areaId: string,
  options: { loadAllPhases: boolean; sectionId?: string }
): string {
  const phaseKey = options.loadAllPhases ? 'all-phases' : (options.sectionId ?? 'default-phase');
  return `${areaId}:${phaseKey}`;
}

export function readLearningPathCache(key: string): PathSection[] | null {
  return cache.get(key)?.sections ?? null;
}

export function writeLearningPathCache(key: string, sections: PathSection[]): void {
  cache.set(key, { sections });
}

export function clearLearningPathCache(): void {
  cache.clear();
}
