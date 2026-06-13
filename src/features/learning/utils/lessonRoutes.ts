import type { AreaId } from '@/shared/constants';
import { AREA_INFO } from '@/shared/constants';
import { ROADMAP_AREA_TO_STATIC_DATA_KEY } from '@/features/learning/constants/roadmapAreaKeys';
import { parseAreaFromMinimumRequirementsId } from '@/features/learning/data/phaseMinimumRequirements';

export const LESSON_PATH_PREFIX = '/ruta-aprendizaje/leccion';

export function isLessonRoute(pathname: string): boolean {
  return pathname.startsWith(`${LESSON_PATH_PREFIX}/`);
}

/** Extrae el slug del paso desde la URL de lección (`1`, `2`, `examen`, …). */
export function getLessonStepSlugFromPathname(pathname: string, lessonId: string): string | null {
  const prefix = `${LESSON_PATH_PREFIX}/${lessonId}/`;
  if (!pathname.startsWith(prefix)) return null;
  const slug = pathname.slice(prefix.length).split('/')[0]?.trim();
  return slug || null;
}

const SUPABASE_AREA_TO_ROADMAP: Record<string, AreaId> = {
  lectura_critica: 'lectura-critica',
  ciencias_naturales: 'ciencias-naturales',
  sociales: 'sociales-ciudadanas',
  matematicas: 'matematicas',
  ingles: 'ingles',
};

/** Convierte `area` de Supabase o slug de ruta al id usado en el roadmap. */
export function normalizeRoadmapAreaId(area: string | undefined): AreaId {
  if (!area) return 'lectura-critica';
  if (area in AREA_INFO) return area as AreaId;
  const underscored = area.replace(/-/g, '_');
  return SUPABASE_AREA_TO_ROADMAP[underscored] ?? SUPABASE_AREA_TO_ROADMAP[area] ?? 'lectura-critica';
}

const STATIC_DATA_KEY_TO_AREA = Object.entries(ROADMAP_AREA_TO_STATIC_DATA_KEY).reduce(
  (acc, [areaId, staticKey]) => {
    if (!(staticKey in acc)) acc[staticKey] = areaId as AreaId;
    return acc;
  },
  {} as Record<string, AreaId>
);

/** Área ICFES asociada a una lección (ruta, requisitos mínimos, catálogo estático o Supabase). */
export function resolveLessonAreaId(lessonId: string, lesson?: unknown): AreaId {
  const lessonRecord = lesson as { area?: unknown } | null | undefined;
  const fromMinimum = parseAreaFromMinimumRequirementsId(lessonId);
  if (fromMinimum) return fromMinimum;

  if (lessonRecord?.area != null && String(lessonRecord.area).trim() !== '') {
    return normalizeRoadmapAreaId(String(lessonRecord.area));
  }

  const staticPrefix = Object.keys(STATIC_DATA_KEY_TO_AREA).find((key) => lessonId.startsWith(`${key}_`));
  if (staticPrefix) return STATIC_DATA_KEY_TO_AREA[staticPrefix];

  return 'lectura-critica';
}

export function getLessonIdFromPathname(pathname: string): string | null {
  const prefix = `${LESSON_PATH_PREFIX}/`;
  if (!pathname.startsWith(prefix)) return null;
  return pathname.slice(prefix.length).split('/')[0]?.trim() || null;
}

export type LessonStepSlug = `${number}` | 'examen';

export function getLessonStepHref(lessonId: string, step: number | 'examen'): string {
  const slug = step === 'examen' ? 'examen' : String(step);
  return `${LESSON_PATH_PREFIX}/${lessonId}/${slug}`;
}

export function getLessonStartHref(lessonId: string, options: { hasContent: boolean; hasQuiz: boolean }): string {
  if (options.hasContent) return getLessonStepHref(lessonId, 1);
  if (options.hasQuiz) return getLessonStepHref(lessonId, 'examen');
  return getLessonStepHref(lessonId, 1);
}

export function parseLessonStepSlug(
  slug: string,
  contentStepCount: number,
  hasQuiz: boolean
): { kind: 'content'; index: number } | { kind: 'examen' } | null {
  if (slug === 'examen') {
    return hasQuiz ? { kind: 'examen' } : null;
  }

  const stepNumber = Number.parseInt(slug, 10);
  if (!Number.isFinite(stepNumber) || stepNumber < 1) return null;

  const index = stepNumber - 1;
  if (index >= contentStepCount) {
    if (index === contentStepCount && hasQuiz) return { kind: 'examen' };
    return null;
  }

  return { kind: 'content', index };
}

export function getAdjacentLessonStepHrefs(
  lessonId: string,
  current: { kind: 'content'; index: number } | { kind: 'examen' },
  contentStepCount: number,
  hasQuiz: boolean
): { prev: string | null; next: string | null } {
  const totalSteps = contentStepCount + (hasQuiz ? 1 : 0);

  if (current.kind === 'content') {
    const position = current.index;
    return {
      prev: position > 0 ? getLessonStepHref(lessonId, position) : null,
      next:
        position < contentStepCount - 1
          ? getLessonStepHref(lessonId, position + 2)
          : hasQuiz
            ? getLessonStepHref(lessonId, 'examen')
            : null,
    };
  }

  const examPosition = contentStepCount;
  return {
    prev: contentStepCount > 0 ? getLessonStepHref(lessonId, contentStepCount) : null,
    next: null,
  };
}

export function getLessonStepLabel(
  current: { kind: 'content'; index: number } | { kind: 'examen' },
  contentStepCount: number,
  hasQuiz: boolean
): string {
  const totalSteps = Math.max(contentStepCount + (hasQuiz ? 1 : 0), 1);
  if (current.kind === 'examen') return `${totalSteps} / ${totalSteps}`;
  const position = current.index + 1;
  return `${position} / ${totalSteps}`;
}
