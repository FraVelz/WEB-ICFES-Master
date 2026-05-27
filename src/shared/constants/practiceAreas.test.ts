import { describe, expect, it } from 'vitest';

import { HOME_AREA_IDS } from './areaInfo';
import { PRACTICA_AREA_SLUGS, getPracticaHrefForRoadmapArea, isPracticaAreaSlug } from './practiceAreas';

describe('practiceAreas', () => {
  it('reutiliza HOME_AREA_IDS como slugs de práctica', () => {
    expect(PRACTICA_AREA_SLUGS).toEqual(HOME_AREA_IDS);
  });

  it('valida slugs y construye hrefs', () => {
    expect(isPracticaAreaSlug('matematicas')).toBe(true);
    expect(isPracticaAreaSlug('examen-completo')).toBe(false);
    expect(getPracticaHrefForRoadmapArea('ingles')).toBe('/practica/ingles');
    expect(getPracticaHrefForRoadmapArea('invalid')).toBeNull();
  });
});
