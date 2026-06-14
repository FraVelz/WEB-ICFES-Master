import { describe, expect, it } from 'vitest';
import { getPracticeExitHref } from './getPracticeExitHref';

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

  it('falls back to roadmap for the area when no context', () => {
    expect(
      getPracticeExitHref({
        areaSlug: 'lectura-critica',
      })
    ).toBe('/ruta-aprendizaje?area=lectura-critica&etapa=facil');
  });
});
