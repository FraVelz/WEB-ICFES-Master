import { describe, expect, it } from 'vitest';
import {
  getDemotionIndices,
  getEffectiveLeagueRules,
  getPromotionIndices,
} from './leagueRules';

describe('leagueRules', () => {
  it('novato no tiene descensos', () => {
    const rules = getEffectiveLeagueRules('novato', 30);
    expect(rules.demoteCount).toBe(0);
    expect(rules.promoteCount).toBe(15);
  });

  it('maestro no tiene ascensos', () => {
    const rules = getEffectiveLeagueRules('maestro', 30);
    expect(rules.promoteCount).toBe(0);
    expect(rules.demoteCount).toBe(5);
  });

  it('grupos pequeños no descienden y limitan ascensos', () => {
    const rules = getEffectiveLeagueRules('explorador', 8);
    expect(rules.demoteCount).toBe(0);
    expect(rules.promoteCount).toBe(4);
  });

  it('calcula índices de ascenso y descenso sin solapamiento', () => {
    const size = 30;
    const { promoteCount, demoteCount } = getEffectiveLeagueRules('aprendiz', size);
    const promoted = getPromotionIndices(size, promoteCount);
    const demoted = getDemotionIndices(size, demoteCount, promoted);

    expect(promoted).toHaveLength(10);
    expect(demoted).toHaveLength(10);
    expect(promoted.every((i) => !demoted.includes(i))).toBe(true);
  });

  it('grupo de 5 en novato permite hasta 2 ascensos en beta', () => {
    const rules = getEffectiveLeagueRules('novato', 5);
    expect(rules.promoteCount).toBe(2);
    expect(rules.demoteCount).toBe(0);
  });
});
