import { normalizeLessonPhase, phaseToSectionId } from '@/features/learning/constants/learningPhases';
import { getLessonRewardsForPhase } from '@/features/learning/utils/lessonRewards';
import { resolveLessonBlockIdForPhase } from '@/features/learning/data/phaseBlocks';
import type { LearningPathLesson } from '@/features/learning/services/LearningService';
import { HOME_AREA_IDS, type AreaId } from '@/shared/constants';

/** Proyección ligera del JSONB — sin body ni preguntas del quiz. */
export const LEARNING_ROADMAP_COLUMNS =
  'id, area, phase, order_index, title:content->>title, summary:content->>summary, block:content->>block, duration:content->>duration, quiz_rewards:content->quiz->rewards' as const;

function readRoadmapContent(row: Record<string, unknown>): Record<string, unknown> {
  const nested = row.content;
  if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
    return nested as Record<string, unknown>;
  }

  const rewards = row.quiz_rewards;
  return {
    title: row.title,
    summary: row.summary,
    block: row.block,
    duration: row.duration,
    quiz:
      rewards && typeof rewards === 'object'
        ? { rewards }
        : typeof rewards === 'string'
          ? { rewards: safeJsonParse(rewards) }
          : undefined,
  };
}

function safeJsonParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

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

  const content = readRoadmapContent(row);
  const phase = normalizeLessonPhase(row.phase ?? content.phase ?? content.fase ?? content.difficulty);
  const quiz = (content.quiz ?? {}) as Record<string, unknown>;
  const order = Number(row.order_index ?? index);
  const blockFromContent = typeof content.block === 'string' ? content.block : undefined;
  const blockId =
    blockFromContent ?? resolveLessonBlockIdForPhase(areaSlug, phase, { order, blockId: undefined }) ?? undefined;

  return {
    id: String(row.id ?? `${areaSlug}_${index}`),
    title: (content.title as string) || row.id,
    description: content.summary,
    order,
    phase,
    difficulty: phaseToSectionId(phase),
    blockId,
    rewards: getLessonRewardsForPhase(phase),
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
