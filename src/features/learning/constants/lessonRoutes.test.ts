import { describe, expect, it } from 'vitest';

import {
  LESSON_ROUTE_PAIRS,
  buildLessonHrefFromNode,
  getLessonAreaSlugForRoadmap,
  getLessonRoutesForRoadmapArea,
  getStaticRoadmapDataKey,
  groupLessonRoutePairsByArea,
} from './lessonRoutes';

describe('lessonRoutes', () => {
  it('expone 25 pares área/topic alineados con legacy y SSG', () => {
    expect(LESSON_ROUTE_PAIRS).toHaveLength(25);
    expect(groupLessonRoutePairsByArea().matematicas).toHaveLength(5);
  });

  it('mapea slugs de roadmap a segmentos de lección', () => {
    expect(getLessonAreaSlugForRoadmap('lectura-critica')).toBe('lenguaje');
    expect(getLessonAreaSlugForRoadmap('sociales-ciudadanas')).toBe('sociales');
    expect(getLessonAreaSlugForRoadmap('desconocido')).toBeNull();
  });

  it('normaliza claves de roadmapData estático', () => {
    expect(getStaticRoadmapDataKey('sociales-ciudadanas')).toBe('sociales');
    expect(getStaticRoadmapDataKey('matematicas')).toBe('matematicas');
  });

  it('construye hrefs de lección desde nodos del roadmap', () => {
    expect(getLessonRoutesForRoadmapArea('matematicas')[0]?.href).toBe('/lessons/matematicas/algebra');
    expect(buildLessonHrefFromNode('ciencias-naturales', { topic_slug: 'biologia' })).toBe(
      '/lessons/ciencias/biologia'
    );
  });
});
