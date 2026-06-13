import { describe, expect, it } from 'vitest';
import { isAllowedSpendCoinsItem } from './gamificationAwardReasons';

describe('gamificationAwardReasons', () => {
  it('permite ítems de gasto legítimos', () => {
    expect(isAllowedSpendCoinsItem('shop_logo_7')).toBe(true);
    expect(isAllowedSpendCoinsItem('purchase')).toBe(true);
    expect(isAllowedSpendCoinsItem('user_wallet')).toBe(true);
  });

  it('rechaza ítems arbitrarios', () => {
    expect(isAllowedSpendCoinsItem('arbitrary')).toBe(false);
    expect(isAllowedSpendCoinsItem('')).toBe(false);
  });
});
