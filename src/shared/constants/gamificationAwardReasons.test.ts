import { describe, expect, it } from 'vitest';
import {
  isAllowedCoinsAwardReason,
  isAllowedSpendCoinsItem,
  isAllowedXpAwardReason,
} from './gamificationAwardReasons';

describe('gamificationAwardReasons', () => {
  it('permite razones XP legítimas', () => {
    expect(isAllowedXpAwardReason('lesson_quiz_matematicas-1')).toBe(true);
    expect(isAllowedXpAwardReason('practice_1718123456789')).toBe(true);
    expect(isAllowedXpAwardReason('exam_full_1718123456789')).toBe(true);
    expect(isAllowedXpAwardReason('achievement_practice_1')).toBe(true);
    expect(isAllowedXpAwardReason('achievement')).toBe(true);
    expect(isAllowedXpAwardReason('demo_migration')).toBe(true);
  });

  it('rechaza farmeo arbitrario XP', () => {
    expect(isAllowedXpAwardReason('farm_1')).toBe(false);
    expect(isAllowedXpAwardReason('')).toBe(false);
    expect(isAllowedXpAwardReason('activity')).toBe(false);
  });

  it('permite razones de monedas legítimas', () => {
    expect(isAllowedCoinsAwardReason('achievement_practice_1')).toBe(true);
    expect(isAllowedCoinsAwardReason('user_wallet')).toBe(true);
    expect(isAllowedCoinsAwardReason('lesson_quiz_lc-2')).toBe(true);
  });

  it('permite ítems de gasto legítimos', () => {
    expect(isAllowedSpendCoinsItem('shop_logo_7')).toBe(true);
    expect(isAllowedSpendCoinsItem('purchase')).toBe(true);
    expect(isAllowedSpendCoinsItem('arbitrary')).toBe(false);
  });
});
