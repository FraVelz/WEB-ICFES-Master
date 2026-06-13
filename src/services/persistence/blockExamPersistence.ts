import { pushLearningProgressToRemote } from '@/services/learning';

/** Porcentaje mínimo en el examen de bloque para desbloquear el siguiente bloque. */
export const BLOCK_EXAM_PASS_PERCENT = 70;

export type BlockExamPassRecord = {
  areaId: string;
  blockId: string;
  passedAt: string;
  score: number;
};

const STORAGE_KEY = 'icfes_block_exam_passes';
export const BLOCK_EXAM_UPDATED_EVENT = 'icfes_block_exam_updated';

function readPasses(): BlockExamPassRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as BlockExamPassRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writePasses(records: BlockExamPassRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  window.dispatchEvent(new Event(BLOCK_EXAM_UPDATED_EVENT));
}

export function getBlockExamPasses(): BlockExamPassRecord[] {
  return readPasses();
}

export function isBlockExamPassed(areaId: string, blockId: string): boolean {
  return readPasses().some((record) => record.areaId === areaId && record.blockId === blockId);
}

export function getPassedBlockIdsForArea(areaId: string): Set<string> {
  return new Set(
    readPasses()
      .filter((record) => record.areaId === areaId)
      .map((record) => record.blockId)
  );
}

export function markBlockExamPassed(
  userId: string | undefined,
  areaId: string,
  blockId: string,
  score: number
): void {
  const records = readPasses().filter((record) => !(record.areaId === areaId && record.blockId === blockId));
  records.push({
    areaId,
    blockId,
    passedAt: new Date().toISOString(),
    score,
  });
  writePasses(records);
  if (userId) {
    void pushLearningProgressToRemote(userId);
  }
}
