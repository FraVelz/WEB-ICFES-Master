import { normalizeLessonPhase, phaseToSectionId } from '@/features/learning/constants/learningPhases';
import type { LearningPathLesson } from '@/features/learning/services/LearningService';
import { HOME_AREA_IDS, type AreaId } from '@/shared/constants';
import { stripQuizAnswersFromContent } from '@/utils/stripQuizAnswers';

export const LEARNING_ROADMAP_COLUMNS = 'id, area, phase, order_index, content' as const;

const DB_AREA_TO_SLUG: Record<string, AreaId> = {
  lectura_critica: 'lectura-critica',
  lenguaje: 'lectura-critica',
  matematicas: 'matematicas',
  mathematics: 'matematicas',
  ciencias_naturales: 'ciencias-naturales',
  ciencias: 'ciencias-naturales',
  sociales: 'sociales-ciudadanas',
  sociales_ciudadanas: 'sociales-ciudadanas',
  ingles: 'ingles',
};

export function mapRoadmapRowToLesson(row: Record<string, unknown>, index: number): LearningPathLesson | null {
  const areaKey = String(row.area ?? '');
  const areaSlug = DB_AREA_TO_SLUG[areaKey];
  if (!areaSlug) return null;

  const content = stripQuizAnswersFromContent((row.content || {}) as Record<string, unknown>);
  const phase = normalizeLessonPhase(row.phase ?? content.phase ?? content.fase ?? content.difficulty);
  const quiz = (content.quiz ?? {}) as Record<string, unknown>;

  return {
    id: String(row.id ?? `${areaSlug}_${index}`),
    title: (content.title as string) || row.id,
    order: Number(row.order_index ?? index),
    phase,
    difficulty: phaseToSectionId(phase),
    rewards: (quiz.rewards as { xp?: number; coins?: number }) || { xp: 50, coins: 25 },
    duration: content.duration,
  };
}

export function groupRoadmapRowsByArea(rows: Record<string, unknown>[]): Partial<Record<AreaId, LearningPathLesson[]>> {
  const grouped: Partial<Record<AreaId, LearningPathLesson[]>> = Object.fromEntries(
    HOME_AREA_IDS.map((id) => [id, [] as LearningPathLesson[]])
  ) as Partial<Record<AreaId, LearningPathLesson[]>>;

  for (const [index, row] of rows.entries()) {
    const lesson = mapRoadmapRowToLesson(row, index);
    if (!lesson) continue;
    const areaKey = String(row.area ?? '');
    const areaSlug = DB_AREA_TO_SLUG[areaKey];
    if (!areaSlug) continue;
    grouped[areaSlug]?.push(lesson);
  }

  return grouped;
}
