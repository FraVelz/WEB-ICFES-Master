/** Slug de área en roadmap/práctica → clave en `roadmapData` estático (`sociales`, no `sociales-ciudadanas`) */
export const ROADMAP_AREA_TO_STATIC_DATA_KEY: Record<string, string> = {
  matematicas: 'matematicas',
  'lectura-critica': 'lectura-critica',
  'ciencias-naturales': 'ciencias-naturales',
  'sociales-ciudadanas': 'sociales',
  sociales: 'sociales',
  ingles: 'ingles',
};

export function getStaticRoadmapDataKey(roadmapAreaId: string): string {
  return ROADMAP_AREA_TO_STATIC_DATA_KEY[roadmapAreaId] ?? roadmapAreaId;
}
