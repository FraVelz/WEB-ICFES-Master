import type { LearningPhaseNumber } from '@/features/learning/constants/learningPhases';

export type PhaseBlockDef = {
  blockId: string;
  title: string;
  description: string;
  order: number;
  orderIndexFrom: number;
  orderIndexTo: number;
};

export function getBlocksForAreaAndPhase(
  blocksByArea: Partial<Record<string, PhaseBlockDef[]>>,
  areaId: string
): PhaseBlockDef[] {
  return blocksByArea[areaId] ?? [];
}

export function resolveBlockIdFromOrder(
  blocks: PhaseBlockDef[],
  orderIndex: number,
  explicitBlockId?: string | null
): string | null {
  if (explicitBlockId && typeof explicitBlockId === 'string') return explicitBlockId;
  if (!Number.isFinite(orderIndex)) return null;
  const block = blocks.find(
    (candidate) => orderIndex >= candidate.orderIndexFrom && orderIndex <= candidate.orderIndexTo
  );
  return block?.blockId ?? null;
}

export function getBlockDef(blocks: PhaseBlockDef[], blockId: string): PhaseBlockDef | undefined {
  return blocks.find((block) => block.blockId === blockId);
}

export function getCheckpointPhaseNumber(phase?: LearningPhaseNumber): LearningPhaseNumber {
  return phase ?? 1;
}
