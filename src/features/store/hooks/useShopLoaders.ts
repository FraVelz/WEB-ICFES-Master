import { useState, useEffect, useCallback } from 'react';
import { resolveCoinsUserId, getDemoCoins, isDemoUserId } from '@/services/demo/demoCoins';
import {
  getCoinsBalance,
  COINS_CHANGE_EVENT,
  getShopInventoryState,
  readDemoShopInventorySync,
  getStreakShieldCount,
  STREAK_SHIELD_CHANGE_EVENT,
  SHOP_INVENTORY_CHANGE_EVENT,
  type ShopInventoryState,
} from '@/services/persistence';

export function useShopLoaders(userId: string | null) {
  const [coins, setCoins] = useState(0);
  const [inventory, setInventory] = useState<string[]>([]);
  const [equippedLogoId, setEquippedLogoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streakShieldCount, setStreakShieldCount] = useState(0);

  const applyInventoryState = useCallback((state: ShopInventoryState) => {
    setInventory(state.inventory);
    setEquippedLogoId(state.equippedLogoId);
  }, []);

  const loadCoins = useCallback(async () => {
    if (!userId) {
      setCoins(0);
      return;
    }
    const balance = await getCoinsBalance(userId);
    setCoins(balance);
  }, [userId]);

  const loadInventory = useCallback(async () => {
    if (!userId) {
      setInventory([]);
      setEquippedLogoId(null);
      return;
    }
    const state = await getShopInventoryState(userId);
    applyInventoryState(state);
  }, [applyInventoryState, userId]);

  const loadStreakShields = useCallback(async () => {
    if (!userId) {
      setStreakShieldCount(0);
      return;
    }
    const count = await getStreakShieldCount(userId);
    setStreakShieldCount(count);
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setCoins(0);
      setInventory([]);
      setEquippedLogoId(null);
      setStreakShieldCount(0);
      setLoading(false);
      return;
    }

    let hydratedFromCache = false;

    if (isDemoUserId(userId)) {
      setCoins(getDemoCoins());
      applyInventoryState(readDemoShopInventorySync());
      hydratedFromCache = true;
      setLoading(false);
    }

    const load = async () => {
      if (!hydratedFromCache) setLoading(true);
      setError(null);
      try {
        await Promise.all([loadCoins(), loadInventory(), loadStreakShields()]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando la tienda');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [userId, loadCoins, loadInventory, loadStreakShields, applyInventoryState]);

  useEffect(() => {
    const onShieldChanged = (event: Event) => {
      const detail = (event as CustomEvent<{ count?: number }>).detail;
      if (detail?.count != null) {
        setStreakShieldCount(detail.count);
        return;
      }
      void loadStreakShields();
    };
    window.addEventListener(STREAK_SHIELD_CHANGE_EVENT, onShieldChanged);
    return () => window.removeEventListener(STREAK_SHIELD_CHANGE_EVENT, onShieldChanged);
  }, [loadStreakShields]);

  useEffect(() => {
    const onCoinsChanged = (event: Event) => {
      const detail = (event as CustomEvent<{ balance?: number }>).detail;
      if (detail?.balance != null) {
        setCoins(detail.balance);
        return;
      }
      void loadCoins();
    };
    window.addEventListener(COINS_CHANGE_EVENT, onCoinsChanged);
    return () => window.removeEventListener(COINS_CHANGE_EVENT, onCoinsChanged);
  }, [loadCoins]);

  useEffect(() => {
    const onInventoryChanged = (event: Event) => {
      const detail = (event as CustomEvent<ShopInventoryState>).detail;
      if (detail?.inventory) {
        applyInventoryState(detail);
        return;
      }
      void loadInventory();
    };
    window.addEventListener(SHOP_INVENTORY_CHANGE_EVENT, onInventoryChanged);
    return () => window.removeEventListener(SHOP_INVENTORY_CHANGE_EVENT, onInventoryChanged);
  }, [applyInventoryState, loadInventory]);

  const refreshData = async () => {
    await Promise.all([loadCoins(), loadInventory(), loadStreakShields()]);
  };

  return {
    coins,
    inventory,
    equippedLogoId,
    loading,
    error,
    streakShieldCount,
    setStreakShieldCount,
    applyInventoryState,
    refreshData,
  };
}

export function resolveShopUserId(userUid: string | undefined, demoMode: boolean): string | null {
  return resolveCoinsUserId(userUid, demoMode);
}
