import {
  LEARNING_ROADMAP_PATH,
  getLearningPhasesHref,
  getRoadmapHref,
  isPhasesAreaSlug,
} from '@/features/learning/data/competencyPhases';
import {
  getSimulacroCompletoExamHref,
  getSimulacroCompletoSectionHref,
} from '@/features/exam/utils/simulacroNavigation';

const DEFAULT_FULL_EXAM_EXIT_AREA = 'lectura-critica' as const;

export function getDefaultFullExamExitHref(): string {
  return getRoadmapHref('facil', DEFAULT_FULL_EXAM_EXIT_AREA);
}

/** Ruta interna de retorno codificada en `?from=` al abrir el simulacro completo. */
export function buildFullExamHref(fromPath?: string | null): string {
  return getSimulacroCompletoExamHref(fromPath ?? getSimulacroCompletoSectionHref());
}

function buildCurrentLocationPath(pathname: string, searchParams: Pick<URLSearchParams, 'toString'>): string {
  const qs = searchParams.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function buildFullExamHrefFromLearningContext(options: {
  pathname: string;
  searchParams: Pick<URLSearchParams, 'toString'>;
  isPhasesRoute: boolean;
  area: string;
  sectionId?: string;
}): string {
  const { pathname, searchParams, isPhasesRoute, area, sectionId } = options;

  if (isPhasesRoute) {
    const phasesArea = isPhasesAreaSlug(area) ? area : DEFAULT_FULL_EXAM_EXIT_AREA;
    return buildFullExamHref(getLearningPhasesHref(phasesArea));
  }

  if (pathname === '/ruta-al-500' || pathname.startsWith('/ruta-al-500/')) {
    return buildFullExamHref(buildCurrentLocationPath(pathname, searchParams));
  }

  if (pathname === LEARNING_ROADMAP_PATH || pathname.startsWith(`${LEARNING_ROADMAP_PATH}/`)) {
    return buildFullExamHref(buildCurrentLocationPath(pathname, searchParams));
  }

  if (isPhasesAreaSlug(area)) {
    const params = new URLSearchParams({ area });
    if (sectionId) params.set('etapa', sectionId);
    return buildFullExamHref(`${LEARNING_ROADMAP_PATH}?${params.toString()}`);
  }

  return buildFullExamHref(getDefaultFullExamExitHref());
}
