import { useState } from 'react';
import {
  spendCoinsBalance,
  addShopInventoryItem,
  setEquippedShopLogo,
  hasShopInventoryItem,
  activateDoubleXp,
  canEquipLogo,
  addStreakShield,
  type ShopInventoryState,
} from '@/services/persistence';
import { DOUBLE_XP_ITEM_ID } from '../constants/doubleXp';
import { MAX_STREAK_SHIELDS, STREAK_SHIELD_ITEM_ID } from '../constants/streakShield';
import type { ShopItem } from '../data/shopItems';

function nextPurchaseId(item: ShopItem): string {
  return item.category === 'powerup' ? `${item.id}_${Date.now()}` : item.id;
}

type ShopActionsDeps = {
  coinsUserId: string | null;
  coins: number;
  inventory: string[];
  streakShieldCount: number;
  applyInventoryState: (state: ShopInventoryState) => void;
  setStreakShieldCount: (count: number) => void;
};

export function useShopActions({
  coinsUserId,
  coins,
  inventory,
  streakShieldCount,
  applyInventoryState,
  setStreakShieldCount,
}: ShopActionsDeps) {
  const [processing, setProcessing] = useState(false);

  const hasItem = (itemId: string) => hasShopInventoryItem(inventory, itemId);

  const buyItem = async (item: ShopItem) => {
    if (!coinsUserId) throw new Error('Debes iniciar sesión o usar el modo demo');
    if (item.category !== 'powerup' && hasItem(item.id)) {
      throw new Error('Ya tienes este artículo');
    }
    if (item.id === STREAK_SHIELD_ITEM_ID && streakShieldCount >= MAX_STREAK_SHIELDS) {
      throw new Error(`Ya tienes el máximo de protectores de racha (${MAX_STREAK_SHIELDS})`);
    }
    if (coins < item.price) throw new Error('Monedas insuficientes');

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

  return { processing, hasItem, buyItem, equipLogo, unequipLogo };
}
