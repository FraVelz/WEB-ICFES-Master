import { describe, expect, it } from 'vitest';
import { AREA_INFO, getAreaInfo, getHomeAreas, HOME_AREA_IDS } from './areaInfo';

describe('areaInfo', () => {
  it('expone las cinco áreas principales del home', () => {
    expect(HOME_AREA_IDS).toHaveLength(5);
    expect(getHomeAreas().every((area) => area.name && area.icon && area.gradient)).toBe(true);
  });

  it('devuelve fallback para ids desconocidos', () => {
    expect(getAreaInfo('desconocido').name).toBe('Lectura Crítica');
  });

  it('incluye examen completo en el catálogo', () => {
    expect(AREA_INFO['examen-completo'].name).toContain('Examen Completo');
  });
});
