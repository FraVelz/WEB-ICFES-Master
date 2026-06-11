import type { PathNodeData } from '@/features/learning/roadmap/AreaPath';

export type LessonPathStatus = 'pending' | 'current' | 'completed';

/**
 * Asigna estado por orden en la etapa: la primera pendiente es `current`, el resto `pending`.
 */
export function resolveLessonStatuses(
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
