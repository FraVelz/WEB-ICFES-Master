import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('@/services/supabase/GamificationSupabaseService', () => ({
  default: {
    getEconomyByUserId: vi.fn(async () => ({ totalCoins: 200, spentCoins: 0 })),
  },
}));

vi.mock('./gamificationPersistence', () => ({
  gamificationPersistence: {
    spendCoins: vi.fn(async () => ({})),
  },
}));

import GamificationSupabaseService from '@/services/supabase/GamificationSupabaseService';
import { gamificationPersistence } from './gamificationPersistence';
import { getCoinsBalance, addCoinsBalance, spendCoinsBalance, COINS_CHANGE_EVENT } from './coinsPersistence';

describe('coinsPersistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(GamificationSupabaseService.getEconomyByUserId).mockResolvedValue({
      totalCoins: 200,
      spentCoins: 0,
    } as Awaited<ReturnType<typeof GamificationSupabaseService.getEconomyByUserId>>);
  });

  it('getCoinsBalance lee el saldo del perfil Supabase', async () => {
    await expect(getCoinsBalance('user-1')).resolves.toBe(200);
    expect(GamificationSupabaseService.getEconomyByUserId).toHaveBeenCalledWith('user-1');
  });

  it('addCoinsBalance rechaza cuentas autenticadas', async () => {
    await expect(addCoinsBalance('user-1', 50, 'test')).rejects.toThrow(
      'Las monedas solo se otorgan desde acciones verificadas en el servidor'
    );
  });

  it('addCoinsBalance permite demo local', async () => {
    const handler = vi.fn();
    window.addEventListener(COINS_CHANGE_EVENT, handler);

    await addCoinsBalance('demo', 50, 'test');

    expect(handler).toHaveBeenCalled();
    window.removeEventListener(COINS_CHANGE_EVENT, handler);
  });

  it('spendCoinsBalance delega en gamificationPersistence', async () => {
    await spendCoinsBalance('user-1', 30, 'shop_item');

    expect(gamificationPersistence.spendCoins).toHaveBeenCalledWith('user-1', 30, 'shop_item');
  });
});
