import { pushLearningProgressToRemote } from '@/services/learning';

/** Porcentaje mínimo en el examen de salto para superar una fase bloqueada. */
export const PHASE_SKIP_PASS_PERCENT = 70;

export type PhaseSkipRecord = {
  areaId: string;
  sectionId: string;
  passedAt: string;
  score: number;
};

const STORAGE_KEY = 'icfes_phase_skips';
export const PHASE_SKIP_UPDATED_EVENT = 'icfes_phase_skip_updated';

function readSkips(): PhaseSkipRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PhaseSkipRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSkips(records: PhaseSkipRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  window.dispatchEvent(new Event(PHASE_SKIP_UPDATED_EVENT));
}

export function getPhaseSkips(): PhaseSkipRecord[] {
  return readSkips();
}

export function isPhaseSkipped(areaId: string, sectionId: string): boolean {
  return readSkips().some((r) => r.areaId === areaId && r.sectionId === sectionId);
}

export function getSkippedSectionIdsForArea(areaId: string): Set<string> {
  return new Set(
    readSkips()
      .filter((r) => r.areaId === areaId)
      .map((r) => r.sectionId)
  );
}

export function markPhaseSkipped(userId: string | undefined, areaId: string, sectionId: string, score: number): void {
  const records = readSkips().filter((r) => !(r.areaId === areaId && r.sectionId === sectionId));
  records.push({
    areaId,
    sectionId,
    passedAt: new Date().toISOString(),
    score,
  });
  writeSkips(records);
  if (userId) {
    void pushLearningProgressToRemote(userId);
  }
}
