/**
 * Rutas `/practica/[area]` alineadas con `generateStaticParams` de la página de práctica.
 */
export const PRACTICA_AREA_SLUGS = [
  'lectura-critica',
  'matematicas',
  'ciencias-naturales',
  'sociales-ciudadanas',
] as const;

export type PracticaAreaSlug = (typeof PRACTICA_AREA_SLUGS)[number];

export function isPracticaAreaSlug(id: string): id is PracticaAreaSlug {
  return (PRACTICA_AREA_SLUGS as readonly string[]).includes(id);
}

export function getPracticaHrefForRoadmapArea(roadmapAreaId: string): string | null {
  if (!isPracticaAreaSlug(roadmapAreaId)) return null;
  return `/practica/${roadmapAreaId}`;
}
