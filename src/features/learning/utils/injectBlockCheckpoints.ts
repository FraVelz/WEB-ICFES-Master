import type { LearningPhaseNumber } from '@/features/learning/constants/learningPhases';
import { getBlockCheckpointId } from '@/features/learning/data/phase1Blocks';
import {
  getBlockCheckpointDifficulty,
  getPhaseBlockDef,
  getPhaseBlocksForArea,
  resolveLessonBlockIdForPhase,
} from '@/features/learning/data/phaseBlocks';
import { isMinimumRequirementsLessonId } from '@/features/learning/data/phaseMinimumRequirements';
import type { LearningPathLesson } from '@/features/learning/services/LearningService';
import type { AreaId } from '@/shared/constants';

const BLOCK_CHECKPOINT_MODULE_TYPE = 'block-checkpoint';

function isInjectedCheckpoint(lesson: LearningPathLesson): boolean {
  return lesson.moduleType === BLOCK_CHECKPOINT_MODULE_TYPE || lesson.type === 'checkpoint';
}

function buildBlockCheckpoint(
  areaId: AreaId,
  blockId: string,
  lessonIds: string[],
  phase: LearningPhaseNumber
): LearningPathLesson {
  const block = getPhaseBlockDef(areaId, blockId, phase);
  return {
    id: getBlockCheckpointId(areaId, blockId),
    title: `Examen: ${block?.title ?? blockId}`,
    description: 'Preguntas aleatorias del bloque. Necesitas al menos 70% para continuar.',
    order: 0,
    phase,
    difficulty: getBlockCheckpointDifficulty(phase),
    type: 'checkpoint',
    moduleType: BLOCK_CHECKPOINT_MODULE_TYPE,
    blockId,
    lessonIds,
    rewards: { xp: 80, coins: 40 },
    xp: 80,
    coins: 40,
  };
}

/**
 * Agrupa lecciones por bloque e inserta un checkpoint al final de cada uno (fases 1–3).
 */
export function injectBlockCheckpoints(
  areaId: string,
  lessons: LearningPathLesson[],
  phase: LearningPhaseNumber = 1
): LearningPathLesson[] {
  const area = areaId as AreaId;
  const blockDefs = getPhaseBlocksForArea(area, phase);
  if (blockDefs.length === 0) return lessons;

  const prefix: LearningPathLesson[] = [];
  const phaseLessons: LearningPathLesson[] = [];
  const suffix: LearningPathLesson[] = [];

  for (const lesson of lessons) {
    if (lesson.phase !== phase) {
      suffix.push(lesson);
      continue;
    }
    if (isMinimumRequirementsLessonId(String(lesson.id)) || isInjectedCheckpoint(lesson)) {
      prefix.push(lesson);
      continue;
    }
    phaseLessons.push({
      ...lesson,
      blockId: resolveLessonBlockIdForPhase(area, phase, lesson) ?? lesson.blockId,
    });
  }

  const lessonsByBlock = new Map<string, LearningPathLesson[]>();
  for (const lesson of phaseLessons) {
    const blockId = lesson.blockId;
    if (!blockId) continue;
    const group = lessonsByBlock.get(blockId) ?? [];
    group.push(lesson);
    lessonsByBlock.set(blockId, group);
  }

  const blockPath: LearningPathLesson[] = [];
  for (const block of blockDefs) {
    const group = lessonsByBlock.get(block.blockId) ?? [];
    if (group.length === 0) continue;
    const sorted = [...group].sort((a, b) => a.order - b.order);
    blockPath.push(...sorted);
    blockPath.push(
      buildBlockCheckpoint(
        area,
        block.blockId,
        sorted.map((lesson) => String(lesson.id)),
        phase
      )
    );
  }

  const ungrouped = phaseLessons.filter((lesson) => !lesson.blockId);
  if (ungrouped.length > 0) {
    blockPath.push(...ungrouped.sort((a, b) => a.order - b.order));
  }

  return [...prefix, ...blockPath, ...suffix];
}
