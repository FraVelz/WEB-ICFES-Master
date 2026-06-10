import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useUiSessionStore } from '@/store/uiSessionStore';
import { resolveCoinsUserId } from '@/services/demo/demoCoins';
import { SHOP_ITEMS } from '../data/shopItems';
import {
  getCoinsBalance,
  spendCoinsBalance,
  COINS_CHANGE_EVENT,
  getShopInventoryState,
  addShopInventoryItem,
  setEquippedShopLogo,
  hasShopInventoryItem,
  SHOP_INVENTORY_CHANGE_EVENT,
  activateDoubleXp,
  canEquipLogo,
  getStreakShieldCount,
  addStreakShield,
  STREAK_SHIELD_CHANGE_EVENT,
  type ShopInventoryState,
} from '@/services/persistence';
import { DOUBLE_XP_ITEM_ID } from '../constants/doubleXp';
import { MAX_STREAK_SHIELDS, STREAK_SHIELD_ITEM_ID } from '../constants/streakShield';
import type { ShopItem } from '../data/shopItems';

function nextPurchaseId(item: ShopItem): string {
  return item.category === 'powerup' ? `${item.id}_${Date.now()}` : item.id;
}

/**
 * Hook de tienda — monedas e inventario unificados vía Supabase (demo: localStorage).
 */
export const useShop = () => {
  const { user } = useAuth();
  const demoMode = useUiSessionStore((state) => state.demoMode);
  const coinsUserId = resolveCoinsUserId(user?.uid, demoMode);
  const [coins, setCoins] = useState(0);
  const [inventory, setInventory] = useState<string[]>([]);
  const [equippedLogoId, setEquippedLogoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [streakShieldCount, setStreakShieldCount] = useState(0);

  const applyInventoryState = useCallback((state: ShopInventoryState) => {
    setInventory(state.inventory);
    setEquippedLogoId(state.equippedLogoId);
  }, []);

  const loadCoins = useCallback(async () => {
    if (!coinsUserId) {
      setCoins(0);
      return;
    }
    const balance = await getCoinsBalance(coinsUserId);
    setCoins(balance);
  }, [coinsUserId]);

  const loadInventory = useCallback(async () => {
    if (!coinsUserId) {
      setInventory([]);
      setEquippedLogoId(null);
      return;
    }
    const state = await getShopInventoryState(coinsUserId);
    applyInventoryState(state);
  }, [applyInventoryState, coinsUserId]);

  const loadStreakShields = useCallback(async () => {
    if (!coinsUserId) {
      setStreakShieldCount(0);
      return;
    }
    const count = await getStreakShieldCount(coinsUserId);
    setStreakShieldCount(count);
  }, [coinsUserId]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
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
  }, [coinsUserId, loadCoins, loadInventory, loadStreakShields]);

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

  const hasItem = (itemId: string) => hasShopInventoryItem(inventory, itemId);

  const isEquipped = (itemId: string) => equippedLogoId === itemId;

  const buyItem = async (item: ShopItem) => {
    if (!coinsUserId) throw new Error('Debes iniciar sesión o usar el modo demo');
    if (item.category !== 'powerup' && hasItem(item.id)) {
      throw new Error('Ya tienes este artículo');
    }
    if (item.id === STREAK_SHIELD_ITEM_ID && streakShieldCount >= MAX_STREAK_SHIELDS) {
      throw new Error(`Ya tienes el máximo de protectores de racha (${MAX_STREAK_SHIELDS})`);
    }
    if (coins < item.price) {
      throw new Error('Monedas insuficientes');
    }

    setProcessing(true);
    try {
      await spendCoinsBalance(coinsUserId, item.price, `shop_${item.id}`);
      if (item.id === DOUBLE_XP_ITEM_ID) {
        await activateDoubleXp(coinsUserId);
      } else if (item.id === STREAK_SHIELD_ITEM_ID) {
        const count = await addStreakShield(coinsUserId);
        setStreakShieldCount(count);
      } else {
        const state = await addShopInventoryItem(coinsUserId, nextPurchaseId(item));
        applyInventoryState(state);
      }
      return true;
    } finally {
      setProcessing(false);
    }
  };

  const equipLogo = async (logoId: string) => {
    if (!coinsUserId) throw new Error('Debes iniciar sesión o usar el modo demo');
    const allowed = await canEquipLogo(coinsUserId, logoId, inventory);
    if (!allowed) throw new Error('No tienes este logo');
    setProcessing(true);
    try {
      const state = await setEquippedShopLogo(coinsUserId, logoId);
      applyInventoryState(state);
    } finally {
      setProcessing(false);
    }
  };

  const unequipLogo = async () => {
    if (!coinsUserId) throw new Error('Debes iniciar sesión o usar el modo demo');
    setProcessing(true);
    try {
      const state = await setEquippedShopLogo(coinsUserId, null);
      applyInventoryState(state);
    } finally {
      setProcessing(false);
    }
  };

  return {
    coins,
    inventory,
    equippedLogoId,
    hasItem,
    isEquipped,
    loading,
    error,
    processing,
    buyItem,
    equipLogo,
    unequipLogo,
    shopItems: SHOP_ITEMS,
    streakShieldCount,
    refreshData,
  };
};
