import { describe, expect, it } from 'vitest';
import {
  buildFullExamHref,
  buildFullExamHrefFromLearningContext,
  getDefaultFullExamExitHref,
} from './fullExamNavigation';

describe('fullExamNavigation', () => {
  it('buildFullExamHref omits query when from is empty', () => {
    expect(buildFullExamHref()).toBe('/examen-completo');
    expect(buildFullExamHref('   ')).toBe('/examen-completo');
  });

  it('buildFullExamHref encodes from path', () => {
    expect(buildFullExamHref('/fases/matematicas')).toBe('/examen-completo?from=%2Ffases%2Fmatematicas');
  });

  it('getDefaultFullExamExitHref returns lectura critica roadmap', () => {
    expect(getDefaultFullExamExitHref()).toBe('/ruta-aprendizaje?area=lectura-critica&etapa=facil');
  });

  it('buildFullExamHrefFromLearningContext uses fases route', () => {
    expect(
      buildFullExamHrefFromLearningContext({
        pathname: '/fases/matematicas',
        searchParams: new URLSearchParams(),
        isPhasesRoute: true,
        area: 'matematicas',
      })
    ).toBe('/examen-completo?from=%2Ffases%2Fmatematicas');
  });

  it('buildFullExamHrefFromLearningContext uses roadmap with area and etapa', () => {
    expect(
      buildFullExamHrefFromLearningContext({
        pathname: '/ruta-aprendizaje',
        searchParams: new URLSearchParams('area=matematicas&etapa=intermedio'),
        isPhasesRoute: false,
        area: 'matematicas',
        sectionId: 'intermedio',
      })
    ).toBe('/examen-completo?from=%2Fruta-aprendizaje%3Farea%3Dmatematicas%26etapa%3Dintermedio');
  });

  it('buildFullExamHrefFromLearningContext preserves ruta-al-500 query', () => {
    expect(
      buildFullExamHrefFromLearningContext({
        pathname: '/ruta-al-500',
        searchParams: new URLSearchParams('area=ciencias-naturales'),
        isPhasesRoute: false,
        area: 'ciencias-naturales',
      })
    ).toBe('/examen-completo?from=%2Fruta-al-500%3Farea%3Dciencias-naturales');
  });
});
