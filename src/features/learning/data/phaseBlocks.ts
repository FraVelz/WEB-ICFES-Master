import type { LearningPhaseNumber } from '@/features/learning/constants/learningPhases';
import { phaseToSectionId } from '@/features/learning/constants/learningPhases';
import type { AreaId } from '@/shared/constants';
import { getPhase1BlocksForArea } from './phase1Blocks';
import { getPhase2BlocksForArea } from './phase2Blocks';
import { getPhase3BlocksForArea } from './phase3Blocks';
import type { PhaseBlockDef } from './phaseBlockTypes';

export function getPhaseBlocksForArea(areaId: AreaId, phase: LearningPhaseNumber): PhaseBlockDef[] {
  if (phase === 2) return getPhase2BlocksForArea(areaId);
  if (phase === 3) return getPhase3BlocksForArea(areaId);
  return getPhase1BlocksForArea(areaId);
}

export function getPhaseBlockDef(
  areaId: AreaId,
  blockId: string,
  phase: LearningPhaseNumber
): PhaseBlockDef | undefined {
  return getPhaseBlocksForArea(areaId, phase).find((block) => block.blockId === blockId);
}

export function findPhaseBlockDef(areaId: AreaId, blockId: string): PhaseBlockDef | undefined {
  for (const phase of [1, 2, 3] as LearningPhaseNumber[]) {
    const block = getPhaseBlockDef(areaId, blockId, phase);
    if (block) return block;
  }
  return undefined;
}

export function resolveLessonBlockIdForPhase(
  areaId: AreaId,
  phase: LearningPhaseNumber,
  lesson: { blockId?: string; order: number }
): string | null {
  if (lesson.blockId && typeof lesson.blockId === 'string') return lesson.blockId;

  const orderIndex = Number(lesson.order);
  if (!Number.isFinite(orderIndex)) return null;

  const block = getPhaseBlocksForArea(areaId, phase).find(
    (candidate) => orderIndex >= candidate.orderIndexFrom && orderIndex <= candidate.orderIndexTo
  );
  return block?.blockId ?? null;
}

export function getBlockCheckpointDifficulty(phase: LearningPhaseNumber): string {
  return phaseToSectionId(phase);
}
