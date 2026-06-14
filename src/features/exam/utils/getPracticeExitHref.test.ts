import { describe, expect, it } from 'vitest';
import { getFullExamExitHref, getPracticeExitHref } from './getPracticeExitHref';

describe('getPracticeExitHref', () => {
  it('returns phases page when saltar-fase is present', () => {
    expect(
      getPracticeExitHref({
        areaSlug: 'lectura-critica',
        phaseSkipSectionId: 'facil',
      })
    ).toBe('/fases/lectura-critica');
  });

  it('uses from query param when safe', () => {
    const params = new URLSearchParams('from=%2Fruta-aprendizaje%3Farea%3Dmatematicas');
    expect(
      getPracticeExitHref({
        areaSlug: 'matematicas',
        searchParams: params,
      })
    ).toBe('/ruta-aprendizaje?area=matematicas');
  });

  it('uses etapa query param for roadmap exit', () => {
    const params = new URLSearchParams('etapa=intermedio');
    expect(
      getPracticeExitHref({
        areaSlug: 'lectura-critica',
        searchParams: params,
      })
    ).toBe('/ruta-aprendizaje?area=lectura-critica&etapa=intermedio');
  });

  it('falls back to referrer when provided', () => {
    expect(
      getPracticeExitHref({
        areaSlug: 'lectura-critica',
        referrerPath: '/fases/lectura-critica',
      })
    ).toBe('/fases/lectura-critica');
  });

  it('falls back to simulacro area when no context', () => {
    expect(
      getPracticeExitHref({
        areaSlug: 'lectura-critica',
      })
    ).toBe('/simulacro/lectura-critica');
  });

  it('uses from query param for simulacro hub', () => {
    const params = new URLSearchParams('from=%2Fsimulacro');
    expect(
      getPracticeExitHref({
        areaSlug: 'matematicas',
        searchParams: params,
      })
    ).toBe('/simulacro');
  });
});

describe('getFullExamExitHref', () => {
  it('defaults to simulacro completo section when from is missing', () => {
    expect(getFullExamExitHref({})).toBe('/simulacro-completo');
  });

  it('uses from query param when safe', () => {
    const params = new URLSearchParams('from=%2Fruta-aprendizaje%3Farea%3Dmatematicas%26etapa%3Dintermedio');
    expect(getFullExamExitHref({ searchParams: params })).toBe('/ruta-aprendizaje?area=matematicas&etapa=intermedio');
  });

  it('uses from for fases route', () => {
    const params = new URLSearchParams('from=%2Ffases%2Fmatematicas');
    expect(getFullExamExitHref({ searchParams: params })).toBe('/fases/matematicas');
  });

  it('falls back to simulacro completo section when from is empty', () => {
    const params = new URLSearchParams('from=');
    expect(getFullExamExitHref({ searchParams: params })).toBe('/simulacro-completo');
  });

  it('falls back to simulacro completo section when from is unsafe', () => {
    const params = new URLSearchParams('from=%2Fexamen-completo');
    expect(getFullExamExitHref({ searchParams: params })).toBe('/simulacro-completo');
  });
});
