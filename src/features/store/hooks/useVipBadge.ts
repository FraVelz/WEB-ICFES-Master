import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useUiSessionStore } from '@/store/uiSessionStore';
import { resolveCoinsUserId } from '@/services/demo/demoCoins';
import { getShopInventoryState, SHOP_INVENTORY_CHANGE_EVENT, type ShopInventoryState } from '@/services/persistence';
import { hasVipBadge } from '../constants/vipBadge';

/** Insignia VIP comprada — efecto visual en clasificatoria. */
export function useVipBadge() {
  const { user } = useAuth();
  const demoMode = useUiSessionStore((state) => state.demoMode);
  const userId = resolveCoinsUserId(user?.uid, demoMode);
  const [isVip, setIsVip] = useState(false);

  const load = useCallback(async () => {
    if (!userId) {
      setIsVip(false);
      return;
    }
    const state = await getShopInventoryState(userId);
    setIsVip(hasVipBadge(state.inventory));
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const onInventoryChanged = (event: Event) => {
      const detail = (event as CustomEvent<ShopInventoryState>).detail;
      if (detail?.inventory) {
        setIsVip(hasVipBadge(detail.inventory));
        return;
      }
      void load();
    };
    window.addEventListener(SHOP_INVENTORY_CHANGE_EVENT, onInventoryChanged);
    return () => window.removeEventListener(SHOP_INVENTORY_CHANGE_EVENT, onInventoryChanged);
  }, [load]);

  return isVip;
}
