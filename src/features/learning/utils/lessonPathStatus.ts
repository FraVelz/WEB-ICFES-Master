import type { PathNodeData } from '@/features/learning/roadmap/AreaPath';
import { getPhase1BlocksForArea } from '@/features/learning/data/phase1Blocks';
import { getMinimumRequirementsLessonId } from '@/features/learning/data/phaseMinimumRequirements';
import type { AreaId } from '@/shared/constants';

export type LessonPathStatus = 'pending' | 'current' | 'completed' | 'locked';

/**
 * Asigna estado por orden en la etapa: la primera pendiente es `current`, el resto `pending`.
 */
function resolveLessonStatuses(
  nodes: Pick<PathNodeData, 'id'>[],
  completedIds: Set<string> | string[]
): LessonPathStatus[] {
  const completedSet = completedIds instanceof Set ? completedIds : new Set(completedIds);
  let foundCurrent = false;

  return nodes.map((node) => {
    if (completedSet.has(node.id)) return 'completed';
    if (!foundCurrent) {
      foundCurrent = true;
      return 'current';
    }
    return 'pending';
  });
}

export function applyLessonStatusesToNodes(
  nodes: PathNodeData[],
  completedIds: Set<string> | string[]
): PathNodeData[] {
  const statuses = resolveLessonStatuses(nodes, completedIds);
  return nodes.map((node, index) => ({
    ...node,
    status: statuses[index],
  }));
}

function isBlockUnlocked(blockId: string, passedBlockIds: Set<string>, blockOrder: string[]): boolean {
  const index = blockOrder.indexOf(blockId);
  if (index <= 0) return true;
  const previousBlockId = blockOrder[index - 1];
  return passedBlockIds.has(previousBlockId);
}

function blockLessonsComplete(nodes: PathNodeData[], blockId: string, completedIds: Set<string>): boolean {
  const lessons = nodes.filter(
    (node) =>
      node.blockId === blockId &&
      node.type !== 'checkpoint' &&
      node.type !== 'minimum-requirements' &&
      node.moduleType !== 'block-checkpoint'
  );
  return lessons.length > 0 && lessons.every((lesson) => completedIds.has(lesson.id));
}

/**
 * Desbloqueo por bloques (fase 1): checkpoint ≥70% habilita el bloque siguiente.
 */
function applyBlockAwareLessonStatuses(
  nodes: PathNodeData[],
  completedIds: Set<string> | string[],
  passedBlockIds: Set<string> | string[],
  areaId: AreaId
): PathNodeData[] {
  const completedSet = completedIds instanceof Set ? completedIds : new Set(completedIds);
  const passedSet = passedBlockIds instanceof Set ? passedBlockIds : new Set(passedBlockIds);
  const blockOrder = getPhase1BlocksForArea(areaId).map((block) => block.blockId);
  const requirementsId = getMinimumRequirementsLessonId(areaId);
  const hasRequirements = nodes.some((node) => node.id === requirementsId);
  const requirementsDone = !hasRequirements || completedSet.has(requirementsId);

  let foundCurrent = false;

  return nodes.map((node) => {
    const blockId = typeof node.blockId === 'string' ? node.blockId : undefined;
    const isCheckpoint =
      node.type === 'checkpoint' || node.moduleType === 'block-checkpoint' || node.type === 'minimum-requirements';

    if (node.type === 'minimum-requirements') {
      if (completedSet.has(node.id)) return { ...node, status: 'completed' as LessonPathStatus };
      if (!foundCurrent) {
        foundCurrent = true;
        return { ...node, status: 'current' as LessonPathStatus };
      }
      return { ...node, status: 'pending' as LessonPathStatus };
    }

    if (node.moduleType === 'block-checkpoint' || node.type === 'checkpoint') {
      if (blockId && passedSet.has(blockId)) {
        return { ...node, status: 'completed' as LessonPathStatus };
      }
      if (!blockId || !isBlockUnlocked(blockId, passedSet, blockOrder)) {
        return { ...node, status: 'locked' as LessonPathStatus };
      }
      if (!requirementsDone || !blockLessonsComplete(nodes, blockId, completedSet)) {
        return { ...node, status: 'locked' as LessonPathStatus };
      }
      if (!foundCurrent) {
        foundCurrent = true;
        return { ...node, status: 'current' as LessonPathStatus };
      }
      return { ...node, status: 'pending' as LessonPathStatus };
    }

    if (blockId && blockOrder.length > 0) {
      if (!isBlockUnlocked(blockId, passedSet, blockOrder)) {
        return { ...node, status: 'locked' as LessonPathStatus };
      }
      if (blockId === blockOrder[0] && !requirementsDone) {
        return { ...node, status: 'locked' as LessonPathStatus };
      }
    }

    if (completedSet.has(node.id)) {
      return { ...node, status: 'completed' as LessonPathStatus };
    }

    if (!foundCurrent) {
      foundCurrent = true;
      return { ...node, status: 'current' as LessonPathStatus };
    }

    return { ...node, status: isCheckpoint ? ('locked' as LessonPathStatus) : ('pending' as LessonPathStatus) };
  });
}

export function applyLessonStatusesForArea(
  nodes: PathNodeData[],
  completedIds: Set<string> | string[],
  passedBlockIds: Set<string> | string[],
  areaId: AreaId,
  useBlockGating: boolean
): PathNodeData[] {
  if (!useBlockGating) {
    return applyLessonStatusesToNodes(nodes, completedIds);
  }
  return applyBlockAwareLessonStatuses(nodes, completedIds, passedBlockIds, areaId);
}
