/**
 * `/lessons/[area]/[topic]` pairs aligned with `generateStaticParams` and `lessons.slug` (`area/topic`).
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
] as const;

/** Roadmap area id (header) → `/lessons/...` URL segment */
export const ROADMAP_AREA_TO_LESSON_AREA: Record<string, string> = {
  matematicas: 'matematicas',
  'lectura-critica': 'lenguaje',
  'ciencias-naturales': 'ciencias',
  'sociales-ciudadanas': 'sociales',
};

export function getLessonAreaSlugForRoadmap(roadmapAreaId: string): string | null {
  return ROADMAP_AREA_TO_LESSON_AREA[roadmapAreaId] ?? null;
}

export function getLessonRoutesForRoadmapArea(roadmapAreaId: string): { href: string; topic: string }[] {
  const lessonArea = getLessonAreaSlugForRoadmap(roadmapAreaId);
  if (!lessonArea) return [];
  return LESSON_ROUTE_PAIRS.filter((p) => p.area === lessonArea).map((p) => ({
    href: `/lessons/${p.area}/${p.topic}`,
    topic: p.topic,
  }));
}

/** Construye `/lessons/...` si hay `topic_slug` o `topic` en datos de `learning_content` */
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
