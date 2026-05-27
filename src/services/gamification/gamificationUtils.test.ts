import { describe, expect, it } from 'vitest';
import { calculateLevel, getLevelInfo } from './gamificationUtils';

describe('gamificationUtils', () => {
  it('calcula nivel a partir de XP', () => {
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(500)).toBeGreaterThanOrEqual(1);
  });

  it('expone metadatos del nivel actual', () => {
    const info = getLevelInfo(1200);
    expect(info.level).toBeGreaterThanOrEqual(1);
    expect(info.levelData.name).toBeTruthy();
  });
});
