import {
  buildMinimumRequirementsLesson,
  getMinimumRequirementsLessonId,
} from '@/features/learning/data/phaseMinimumRequirements';
import type { LearningPhaseNumber } from '@/features/learning/constants/learningPhases';
import type { LearningPathLesson } from '@/features/learning/services/LearningService';
import type { AreaId } from '@/shared/constants';

/**
 * Inserta el módulo de requisitos mínimos al inicio de la fase 1.
 * No duplica si ya existe (mismo id) o si Supabase publicó ese módulo.
 */
export function injectPhaseMinimumRequirements(
  areaId: string,
  lessons: LearningPathLesson[],
  phase?: LearningPhaseNumber
): LearningPathLesson[] {
  if (phase === 2 || phase === 3) return lessons;

  const requirement = buildMinimumRequirementsLesson(areaId as AreaId);
  if (!requirement) return lessons;

  const requirementId = getMinimumRequirementsLessonId(areaId as AreaId);
  if (lessons.some((lesson) => lesson.id === requirementId)) return lessons;

  if (phase === 1) {
    const phaseLessons = lessons.filter((lesson) => lesson.phase === 1);
    return [requirement, ...phaseLessons];
  }

  const firstPhaseOneIndex = lessons.findIndex((lesson) => lesson.phase === 1);
  if (firstPhaseOneIndex === -1) return lessons;

  const result = [...lessons];
  result.splice(firstPhaseOneIndex, 0, requirement);
  return result;
}
