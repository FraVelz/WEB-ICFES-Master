import { HOME_AREA_IDS, type AreaId } from './areaInfo';

import { getSimulacroAreaHref } from '@/features/exam/utils/simulacroNavigation';

/** Slugs válidos para rutas `/simulacro/[area]`. */
export const PRACTICA_AREA_SLUGS = HOME_AREA_IDS;

export type PracticaAreaSlug = Exclude<AreaId, 'examen-completo'>;

export function isPracticaAreaSlug(id: string): id is PracticaAreaSlug {
  return (PRACTICA_AREA_SLUGS as readonly string[]).includes(id);
}

export function getPracticaHrefForRoadmapArea(roadmapAreaId: string): string | null {
  return getSimulacroAreaHref(roadmapAreaId);
}
