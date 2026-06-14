import {
  LEARNING_ROADMAP_PATH,
  getCompetencyPhaseBySectionId,
  getLearningPhasesHref,
  getRoadmapHref,
  isPhasesAreaSlug,
} from '@/features/learning/data/competencyPhases';
import { LEARNING_PHASE_SECTION_IDS } from '@/features/learning/constants/learningPhases';
import { getDefaultFullExamExitHref } from './fullExamNavigation';
import { getSkippedSectionIdsForArea } from '@/services/persistence/phaseSkipPersistence';
import { SIMULACRO_PATH, getSimulacroAreaHref } from './simulacroNavigation';

const SAFE_EXIT_PREFIXES = [
  '/fases',
  '/fases/',
  '/ruta-aprendizaje',
  '/ruta-al-500',
  '/simulacro',
  '/logros',
  '/tienda',
  '/perfil',
];

function isSafeInternalPath(pathname: string): boolean {
  if (!pathname.startsWith('/')) return false;
  if (pathname === '/') return true;
  return SAFE_EXIT_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix));
}

function normalizeFromParam(value: string): string | null {
  const decoded = decodeURIComponent(value.trim());
  const path = decoded.split('?')[0];
  if (!isSafeInternalPath(path)) return null;
  return decoded.startsWith('/') ? decoded : `/${decoded}`;
}

/** Primera fase no saltada por simulacro; sirve como destino probable sin contexto en la URL. */
export function inferLikelyPhaseSectionId(areaSlug: string): (typeof LEARNING_PHASE_SECTION_IDS)[number] {
  if (typeof window === 'undefined') return 'facil';
  const skipped = getSkippedSectionIdsForArea(areaSlug);
  for (const sectionId of LEARNING_PHASE_SECTION_IDS) {
    if (!skipped.has(sectionId)) return sectionId;
  }
  return 'dificil';
}

export type PracticeExitContext = {
  areaSlug: string;
  phaseSkipSectionId?: string | null;
  searchParams?: Pick<URLSearchParams, 'get'>;
  referrerPath?: string | null;
};

export function getPracticeExitHref({
  areaSlug,
  phaseSkipSectionId,
  searchParams,
  referrerPath,
}: PracticeExitContext): string {
  if (phaseSkipSectionId && getCompetencyPhaseBySectionId(phaseSkipSectionId)) {
    return getLearningPhasesHref(isPhasesAreaSlug(areaSlug) ? areaSlug : undefined);
  }

  const from = searchParams?.get('from') ?? searchParams?.get('origen');
  if (from) {
    const normalized = normalizeFromParam(from);
    if (normalized) return normalized;
  }

  const etapa = searchParams?.get('etapa');
  if (etapa && getCompetencyPhaseBySectionId(etapa)) {
    return getRoadmapHref(etapa, isPhasesAreaSlug(areaSlug) ? areaSlug : undefined);
  }

  if (referrerPath) {
    const pathname = referrerPath.split('?')[0];
    if (isSafeInternalPath(pathname)) return referrerPath;
  }

  if (isPhasesAreaSlug(areaSlug)) {
    return getSimulacroAreaHref(areaSlug) ?? SIMULACRO_PATH;
  }

  if (areaSlug) {
    return `${LEARNING_ROADMAP_PATH}?area=${encodeURIComponent(areaSlug)}`;
  }

  return SIMULACRO_PATH;
}

export function getResultsBackLabel(returnTo: string): string {
  const path = returnTo.split('?')[0];
  if (path.startsWith('/ruta-aprendizaje')) return 'Volver a la Ruta';
  if (path === '/simulacro' || path.startsWith('/simulacro/')) return 'Volver a Simulacros';
  if (path.startsWith('/fases')) return 'Volver a Fases';
  if (path.startsWith('/ruta-al-500')) return 'Volver a la Ruta al 500';
  return 'Volver';
}

const FULL_EXAM_BLOCKED_REFERRER_PREFIXES = ['/simulacro', '/examen-completo', '/practica'] as const;

function isSafeFullExamReferrer(pathname: string): boolean {
  if (FULL_EXAM_BLOCKED_REFERRER_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return false;
  }
  return isSafeInternalPath(pathname);
}

export type FullExamExitContext = {
  searchParams?: Pick<URLSearchParams, 'get'>;
};

export function getFullExamExitHref({ searchParams }: FullExamExitContext): string {
  const from = searchParams?.get('from') ?? searchParams?.get('origen');
  if (from?.trim()) {
    const normalized = normalizeFromParam(from);
    if (normalized) {
      const pathname = normalized.split('?')[0];
      if (isSafeFullExamReferrer(pathname)) return normalized;
    }
  }

  return getDefaultFullExamExitHref();
}
