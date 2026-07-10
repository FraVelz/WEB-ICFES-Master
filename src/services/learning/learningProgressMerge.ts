import type { BlockExamPassRecord } from '@/services/persistence/blockExamPersistence';
import type { PhaseSkipRecord } from '@/services/persistence/phaseSkipPersistence';
import type { LearningProgressSnapshot } from './learningProgressTypes';

export function mergeCompletedLessons(a: string[], b: string[]): string[] {
  return [...new Set([...a, ...b])];
}

export function mergePhaseSkips(a: PhaseSkipRecord[], b: PhaseSkipRecord[]): PhaseSkipRecord[] {
  const byKey = new Map<string, PhaseSkipRecord>();

  for (const record of [...a, ...b]) {
    const key = `${record.areaId}:${record.sectionId}`;
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, record);
      continue;
    }

    const existingTime = Date.parse(existing.passedAt);
    const nextTime = Date.parse(record.passedAt);
    if (nextTime >= existingTime || record.score > existing.score) {
      byKey.set(key, record);
    }
  }

  return [...byKey.values()];
}

function mergeBlockExamPasses(a: BlockExamPassRecord[], b: BlockExamPassRecord[]): BlockExamPassRecord[] {
  const byKey = new Map<string, BlockExamPassRecord>();

  for (const record of [...a, ...b]) {
    const key = `${record.areaId}:${record.blockId}`;
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, record);
      continue;
    }

    const existingTime = Date.parse(existing.passedAt);
    const nextTime = Date.parse(record.passedAt);
    if (nextTime >= existingTime || record.score > existing.score) {
      byKey.set(key, record);
    }
  }

  return [...byKey.values()];
}

export function mergeLearningProgress(
  local: LearningProgressSnapshot,
  remote: LearningProgressSnapshot
): LearningProgressSnapshot {
  return {
    completedLessons: mergeCompletedLessons(local.completedLessons, remote.completedLessons),
    phaseSkips: mergePhaseSkips(local.phaseSkips, remote.phaseSkips),
    blockExamPasses: mergeBlockExamPasses(local.blockExamPasses, remote.blockExamPasses),
  };
}

export function learningProgressEqual(a: LearningProgressSnapshot, b: LearningProgressSnapshot): boolean {
  if (a.completedLessons.length !== b.completedLessons.length) return false;
  if (a.phaseSkips.length !== b.phaseSkips.length) return false;
  if (a.blockExamPasses.length !== b.blockExamPasses.length) return false;

  const lessonsA = [...a.completedLessons].sort().join('|');
  const lessonsB = [...b.completedLessons].sort().join('|');
  if (lessonsA !== lessonsB) return false;

  const skipsA = a.phaseSkips
    .map((s) => `${s.areaId}:${s.sectionId}:${s.score}:${s.passedAt}`)
    .sort()
    .join('|');
  const skipsB = b.phaseSkips
    .map((s) => `${s.areaId}:${s.sectionId}:${s.score}:${s.passedAt}`)
    .sort()
    .join('|');
  if (skipsA !== skipsB) return false;

  const blockA = a.blockExamPasses
    .map((s) => `${s.areaId}:${s.blockId}:${s.score}:${s.passedAt}`)
    .sort()
    .join('|');
  const blockB = b.blockExamPasses
    .map((s) => `${s.areaId}:${s.blockId}:${s.score}:${s.passedAt}`)
    .sort()
    .join('|');
  return blockA === blockB;
}

export function skippedSectionIdsByAreaFromRecords(phaseSkips: PhaseSkipRecord[]): Record<string, Set<string>> {
  const map: Record<string, Set<string>> = {};
  for (const skip of phaseSkips) {
    if (!map[skip.areaId]) map[skip.areaId] = new Set<string>();
    map[skip.areaId].add(skip.sectionId);
  }
  return map;
}
