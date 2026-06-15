import { describe, expect, it } from 'vitest';
import { getLigasHref, isLigasRoute, LIGAS_PATH, LEGACY_CLASIFICATORIA_PATH } from './leagueNavigation';

describe('leagueNavigation', () => {
  it('expone la ruta pública de ligas', () => {
    expect(LIGAS_PATH).toBe('/ligas');
    expect(getLigasHref()).toBe('/ligas');
  });

  it('reconoce la ruta nueva y la legacy', () => {
    expect(isLigasRoute('/ligas')).toBe(true);
    expect(isLigasRoute('/ligas/')).toBe(true);
    expect(isLigasRoute(LEGACY_CLASIFICATORIA_PATH)).toBe(true);
    expect(isLigasRoute('/logros')).toBe(false);
  });
});
