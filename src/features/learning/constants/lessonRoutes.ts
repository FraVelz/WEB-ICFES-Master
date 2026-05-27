/**
 * Fuente única para rutas `/lessons/[area]/[topic]` y mapeos entre slugs de roadmap y lección.
 */
export const LESSON_ROUTE_PAIRS = [
  { area: 'matematicas', topic: 'algebra' },
  { area: 'matematicas', topic: 'geometria' },
  { area: 'matematicas', topic: 'calculo' },
  { area: 'matematicas', topic: 'trigonometria' },
  { area: 'matematicas', topic: 'numeros-complejos' },
  { area: 'lenguaje', topic: 'gramatica' },
  { area: 'lenguaje', topic: 'comprension' },
  { area: 'lenguaje', topic: 'literatura' },
  { area: 'lenguaje', topic: 'ortografia' },
  { area: 'lenguaje', topic: 'semantica' },
  { area: 'ciencias', topic: 'biologia' },
  { area: 'ciencias', topic: 'fisica' },
  { area: 'ciencias', topic: 'quimica' },
  { area: 'ciencias', topic: 'ecologia' },
  { area: 'ciencias', topic: 'termodinamica' },
  { area: 'sociales', topic: 'historia' },
  { area: 'sociales', topic: 'geografia' },
  { area: 'sociales', topic: 'economia' },
  { area: 'sociales', topic: 'ciudadania' },
  { area: 'sociales', topic: 'filosofia' },
  { area: 'ingles', topic: 'gramatica' },
  { area: 'ingles', topic: 'vocabulario' },
  { area: 'ingles', topic: 'lectura' },
  { area: 'ingles', topic: 'tiempos-verbales' },
  { area: 'ingles', topic: 'conectores' },
] as const;

export type LessonAreaSlug = (typeof LESSON_ROUTE_PAIRS)[number]['area'];
export type LessonTopicSlug = (typeof LESSON_ROUTE_PAIRS)[number]['topic'];

/** Slug de área en roadmap/práctica → segmento URL `/lessons/...` */
export const ROADMAP_AREA_TO_LESSON_AREA: Record<string, LessonAreaSlug> = {
  matematicas: 'matematicas',
  'lectura-critica': 'lenguaje',
  'ciencias-naturales': 'ciencias',
  'sociales-ciudadanas': 'sociales',
  ingles: 'ingles',
};

/** Slug de área en roadmap/práctica → clave en `roadmapData` estático (`sociales`, no `sociales-ciudadanas`) */
export const ROADMAP_AREA_TO_STATIC_DATA_KEY: Record<string, string> = {
  matematicas: 'matematicas',
  'lectura-critica': 'lectura-critica',
  'ciencias-naturales': 'ciencias-naturales',
  'sociales-ciudadanas': 'sociales',
  sociales: 'sociales',
  ingles: 'ingles',
};

export function getLessonAreaSlugForRoadmap(roadmapAreaId: string): LessonAreaSlug | null {
  return ROADMAP_AREA_TO_LESSON_AREA[roadmapAreaId] ?? null;
}

export function getStaticRoadmapDataKey(roadmapAreaId: string): string {
  return ROADMAP_AREA_TO_STATIC_DATA_KEY[roadmapAreaId] ?? roadmapAreaId;
}

export function getLessonRoutesForRoadmapArea(roadmapAreaId: string): { href: string; topic: string }[] {
  const lessonArea = getLessonAreaSlugForRoadmap(roadmapAreaId);
  if (!lessonArea) return [];
  return LESSON_ROUTE_PAIRS.filter((p) => p.area === lessonArea).map((p) => ({
    href: `/lessons/${p.area}/${p.topic}`,
    topic: p.topic,
  }));
}

export function buildLessonHrefFromNode(
  roadmapAreaId: string,
  node: { topic_slug?: string; topic?: string }
): string | null {
  const lessonArea = getLessonAreaSlugForRoadmap(roadmapAreaId);
  if (!lessonArea) return null;
  const raw = (node.topic_slug ?? node.topic ?? '').trim();
  if (!raw) return null;
  const topic = raw.replace(/^\/+/, '');
  if (!topic) return null;
  return `/lessons/${lessonArea}/${topic}`;
}

export function groupLessonRoutePairsByArea(): Record<LessonAreaSlug, LessonTopicSlug[]> {
  const grouped = {} as Record<LessonAreaSlug, LessonTopicSlug[]>;
  for (const { area, topic } of LESSON_ROUTE_PAIRS) {
    if (!grouped[area]) grouped[area] = [];
    grouped[area].push(topic);
  }
  return grouped;
}
