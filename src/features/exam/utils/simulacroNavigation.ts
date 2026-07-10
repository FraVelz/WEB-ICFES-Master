import { isPracticaAreaSlug } from '@/shared/constants/practiceAreas';

export const SIMULACRO_PATH = '/simulacro';
export const SIMULACRO_COMPLETO_PATH = '/simulacro/completo';
/** Sección dedicada (sin fases) con configuración personalizada del simulacro integral. */
export const SIMULACRO_COMPLETO_SECTION_PATH = '/simulacro-completo';

function isSimulacroRoute(pathname: string): boolean {
  const normalized = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  return normalized === SIMULACRO_PATH || normalized.startsWith(`${SIMULACRO_PATH}/`);
}

/** Rutas de examen activo (no el hub `/simulacro`). */
export function isSimulacroExamRoute(pathname: string): boolean {
  const normalized = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  if (normalized === SIMULACRO_PATH) return false;
  return isSimulacroRoute(pathname);
}

function getSimulacroHubHref(): string {
  return SIMULACRO_PATH;
}

export function isSimulacroCompletoSectionRoute(pathname: string): boolean {
  const normalized = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  return normalized === SIMULACRO_COMPLETO_SECTION_PATH;
}

/** Hub del simulacro integral (configuración personalizada, sin layout de fases). */
export function getSimulacroCompletoSectionHref(): string {
  return SIMULACRO_COMPLETO_SECTION_PATH;
}

/** Alias de navegación hacia la sección dedicada del simulacro completo. */
export function getSimulacroCompletoHref(fromPath?: string | null): string {
  void fromPath;
  return getSimulacroCompletoSectionHref();
}

/** Pantalla de examen activo del simulacro integral. */
export function getSimulacroCompletoExamHref(fromPath?: string | null): string {
  const trimmed = fromPath?.trim();
  if (!trimmed) return SIMULACRO_COMPLETO_PATH;

  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  const params = new URLSearchParams();
  params.set('from', path);
  return `${SIMULACRO_COMPLETO_PATH}?${params.toString()}`;
}

export function getSimulacroAreaHref(areaId: string): string | null {
  if (!isPracticaAreaSlug(areaId)) return null;
  return `${SIMULACRO_PATH}/${areaId}`;
}

export function getPhaseSkipExamHref(areaId: string, sectionId: string): string {
  const params = new URLSearchParams({ etapa: sectionId });
  return `${SIMULACRO_PATH}/${areaId}/fase?${params.toString()}`;
}

export function buildLegacyPracticaRedirect(area: string, search?: string): string {
  const base = getSimulacroAreaHref(area) ?? SIMULACRO_PATH;
  return search ? `${base}?${search}` : base;
}

export function buildLegacyFullExamRedirect(search?: string): string {
  void search;
  return getSimulacroCompletoSectionHref();
}

export function buildLegacyPhaseSkipRedirect(area?: string, etapa?: string): string {
  if (area && etapa && isPracticaAreaSlug(area)) {
    return getPhaseSkipExamHref(area, etapa);
  }
  return SIMULACRO_PATH;
}
