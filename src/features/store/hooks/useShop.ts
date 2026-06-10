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
  type ShopInventoryState,
} from '@/services/persistence';
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

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([loadCoins(), loadInventory()]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando la tienda');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [coinsUserId, loadCoins, loadInventory]);

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
    await Promise.all([loadCoins(), loadInventory()]);
  };

  const hasItem = (itemId: string) => hasShopInventoryItem(inventory, itemId);

  const isEquipped = (itemId: string) => equippedLogoId === itemId;

  const buyItem = async (item: ShopItem) => {
    if (!coinsUserId) throw new Error('Debes iniciar sesión o usar el modo demo');
    if (item.category !== 'powerup' && hasItem(item.id)) {
      throw new Error('Ya tienes este artículo');
    }
    if (coins < item.price) {
      throw new Error('Monedas insuficientes');
    }

    setProcessing(true);
    try {
      await spendCoinsBalance(coinsUserId, item.price, `shop_${item.id}`);
      const state = await addShopInventoryItem(coinsUserId, nextPurchaseId(item));
      applyInventoryState(state);
      return true;
    } finally {
      setProcessing(false);
    }
  };

  const equipLogo = async (logoId: string) => {
    if (!coinsUserId) throw new Error('Debes iniciar sesión o usar el modo demo');
    if (!hasItem(logoId)) throw new Error('No tienes este logo');
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
    refreshData,
  };
};
