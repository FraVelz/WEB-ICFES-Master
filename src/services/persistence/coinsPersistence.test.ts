import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('./gamificationPersistence', () => ({
  gamificationPersistence: {
    getProfile: vi.fn(async () => ({ totalCoins: 0, spentCoins: 0 })),
    addCoins: vi.fn(async () => ({})),
    spendCoins: vi.fn(async () => ({})),
  },
}));

vi.mock('@/storage/userProfile', () => ({
  getVirtualMoney: vi.fn(() => 200),
  updateUserProfile: vi.fn(),
}));

import { gamificationPersistence } from './gamificationPersistence';
import { getVirtualMoney, updateUserProfile } from '@/storage/userProfile';
import { getCoinsBalance, addCoinsBalance, spendCoinsBalance, COINS_CHANGE_EVENT } from './coinsPersistence';

describe('coinsPersistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(gamificationPersistence.getProfile).mockResolvedValue({
      totalCoins: 200,
      spentCoins: 0,
    } as Awaited<ReturnType<typeof gamificationPersistence.getProfile>>);
    vi.mocked(getVirtualMoney).mockReturnValue(200);
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

  it('migra saldo legacy solo cuando el balance Supabase es cero', async () => {
    await getCoinsBalance('user-1');
    expect(updateUserProfile).not.toHaveBeenCalled();
  });
});
