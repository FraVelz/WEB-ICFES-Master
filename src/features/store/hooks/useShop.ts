import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { SHOP_ITEMS } from '../data/shopItems';
import {
  getVirtualMoney,
  removeVirtualMoney,
} from '@/shared/utils/userProfile';
import type { ShopItem } from '../data/shopItems';

const PURCHASES_KEY = 'icfes_shop_purchases';

/**
 * Hook de tienda (localStorage o Supabase según API_MODE)
 */
export const useShop = () => {
  const { user } = useAuth();
  const [coins, setCoins] = useState(0);
  const [purchases, setPurchases] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setLoading(true);
    setCoins(getVirtualMoney());
    const stored = localStorage.getItem(PURCHASES_KEY);
    setPurchases(stored ? (JSON.parse(stored) as string[]) : []);
    setLoading(false);
  }, [user?.uid]);

  const refreshData = () => {
    setCoins(getVirtualMoney());
    const stored = localStorage.getItem(PURCHASES_KEY);
    setPurchases(stored ? (JSON.parse(stored) as string[]) : []);
  };

  const buyItem = async (item: ShopItem) => {
    const currentCoins = getVirtualMoney();
    if (item.category !== 'powerup' && hasItem(item.id)) {
      throw new Error('Ya tienes este artículo');
    }
    if (currentCoins < item.price) {
      throw new Error('Monedas insuficientes');
    }

    setProcessing(true);
    try {
      removeVirtualMoney(item.price);
      const newPurchases =
        item.category === 'powerup'
          ? [...purchases, `${item.id}_${Date.now()}`]
          : [...purchases, item.id];
      localStorage.setItem(PURCHASES_KEY, JSON.stringify(newPurchases));
      setPurchases(newPurchases);
      setCoins(getVirtualMoney());
      return true;
    } catch (error) {
      setProcessing(false);
      throw error;
    } finally {
      setProcessing(false);
    }
  };

  const hasItem = (itemId: string) =>
    purchases.some((p) => p === itemId || (typeof p === 'string' && p.startsWith(`${itemId}_`)));

  return {
    coins,
    purchases,
    hasItem,
    loading,
    processing,
    buyItem,
    shopItems: SHOP_ITEMS,
    refreshData,
  };
};
