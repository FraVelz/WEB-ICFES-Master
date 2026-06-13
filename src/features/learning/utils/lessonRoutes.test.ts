import { describe, expect, it } from 'vitest';
import { getMinimumRequirementsLessonId } from '@/features/learning/data/phaseMinimumRequirements';
import { getRoadmapHref } from '@/features/learning/data/competencyPhases';
import { resolveLessonAreaId } from '@/features/learning/utils/lessonRoutes';

describe('resolveLessonAreaId', () => {
  it('resuelve el área desde requisitos mínimos', () => {
    expect(resolveLessonAreaId(getMinimumRequirementsLessonId('matematicas'))).toBe('matematicas');
  });

  it('resuelve el área desde lecciones estáticas', () => {
    expect(resolveLessonAreaId('matematicas_basico_0')).toBe('matematicas');
    expect(resolveLessonAreaId('sociales_basico_1')).toBe('sociales-ciudadanas');
  });
});

describe('getRoadmapHref', () => {
  it('incluye área y etapa en la URL de vuelta', () => {
    expect(getRoadmapHref('facil', 'matematicas')).toBe('/ruta-aprendizaje?area=matematicas&etapa=facil');
  });
});
