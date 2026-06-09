import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('./gamificationPersistence', () => ({
  gamificationPersistence: {
    getProfile: vi.fn(async () => ({ totalCoins: 200, spentCoins: 0 })),
    addCoins: vi.fn(async () => ({})),
    spendCoins: vi.fn(async () => ({})),
  },
}));

import { gamificationPersistence } from './gamificationPersistence';
import { getCoinsBalance, addCoinsBalance, spendCoinsBalance, COINS_CHANGE_EVENT } from './coinsPersistence';

describe('coinsPersistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(gamificationPersistence.getProfile).mockResolvedValue({
      totalCoins: 200,
      spentCoins: 0,
    } as Awaited<ReturnType<typeof gamificationPersistence.getProfile>>);
  });

  it('getCoinsBalance lee el saldo del perfil Supabase', async () => {
    await expect(getCoinsBalance('user-1')).resolves.toBe(200);
  });

  it('addCoinsBalance delega en gamificationPersistence y emite evento', async () => {
    const handler = vi.fn();
    window.addEventListener(COINS_CHANGE_EVENT, handler);

    await addCoinsBalance('user-1', 50, 'test');

    expect(gamificationPersistence.addCoins).toHaveBeenCalledWith('user-1', 50, 'test');
    expect(handler).toHaveBeenCalled();
    window.removeEventListener(COINS_CHANGE_EVENT, handler);
  });

  it('spendCoinsBalance delega en gamificationPersistence', async () => {
    await spendCoinsBalance('user-1', 30, 'shop_item');

    expect(gamificationPersistence.spendCoins).toHaveBeenCalledWith('user-1', 30, 'shop_item');
  });
});
