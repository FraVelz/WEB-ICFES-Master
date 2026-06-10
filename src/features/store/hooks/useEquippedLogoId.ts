import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useUiSessionStore } from '@/store/uiSessionStore';
import { resolveCoinsUserId } from '@/services/demo/demoCoins';
import { getShopInventoryState, SHOP_INVENTORY_CHANGE_EVENT, type ShopInventoryState } from '@/services/persistence';

/** Logo equipado — sincronizado entre tienda, ajustes y avatar del shell. */
export function useEquippedLogoId() {
  const { user } = useAuth();
  const demoMode = useUiSessionStore((state) => state.demoMode);
  const userId = resolveCoinsUserId(user?.uid, demoMode);
  const [equippedLogoId, setEquippedLogoId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) {
      setEquippedLogoId(null);
      return;
    }
    const state = await getShopInventoryState(userId);
    setEquippedLogoId(state.equippedLogoId);
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const onInventoryChanged = (event: Event) => {
      const detail = (event as CustomEvent<ShopInventoryState>).detail;
      if (detail && 'equippedLogoId' in detail) {
        setEquippedLogoId(detail.equippedLogoId ?? null);
        return;
      }
      void load();
    };
    window.addEventListener(SHOP_INVENTORY_CHANGE_EVENT, onInventoryChanged);
    return () => window.removeEventListener(SHOP_INVENTORY_CHANGE_EVENT, onInventoryChanged);
  }, [load]);

  return equippedLogoId;
}
