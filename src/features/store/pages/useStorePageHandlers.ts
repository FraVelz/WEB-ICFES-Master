'use client';

import { useCallback } from 'react';
import { DOUBLE_XP_ITEM_ID } from '../constants/doubleXp';
import { STREAK_SHIELD_ITEM_ID } from '../constants/streakShield';
import { VIP_BADGE_ITEM_ID } from '../constants/vipBadge';
import type { ShopItem } from '../data/shopItems';
import type { StoreToast } from './storePageConstants';

type ShopActions = {
  buyItem: (item: ShopItem) => Promise<unknown>;
  equipLogo: (itemId: string) => Promise<unknown>;
  unequipLogo: () => Promise<unknown>;
};

export function useStorePageHandlers(
  shop: ShopActions,
  showToast: (message: string, type?: StoreToast['type']) => void,
  setSelectedItem: (item: ShopItem | null) => void,
  hasItem: (itemId: string) => boolean
) {
  const handleBuy = useCallback(
    async (item: ShopItem) => {
      try {
        await shop.buyItem(item);
        setSelectedItem(null);
        const message =
          item.id === DOUBLE_XP_ITEM_ID
            ? '¡Doble XP activado! Tienes 1 hora de experiencia doble.'
            : item.id === STREAK_SHIELD_ITEM_ID
              ? '¡Protector de racha adquirido! Se usará automáticamente si fallas un día.'
              : item.id === VIP_BADGE_ITEM_ID
                ? '¡Insignia VIP activa! Borde dorado en tu perfil y en la clasificatoria.'
                : `¡Has comprado ${item.name}!`;
        showToast(message);
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Error en la compra', 'error');
      }
    },
    [shop, setSelectedItem, showToast]
  );

  const handleCardClick = useCallback(
    (item: ShopItem) => {
      const purchased = item.category !== 'powerup' && hasItem(item.id);
      if (purchased) return;
      setSelectedItem(item);
    },
    [hasItem, setSelectedItem]
  );

  const handleEquip = useCallback(
    async (item: ShopItem) => {
      try {
        await shop.equipLogo(item.id);
        showToast(`Logo "${item.name}" equipado.`);
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'No se pudo equipar el logo', 'error');
      }
    },
    [shop, showToast]
  );

  const handleUnequip = useCallback(async () => {
    try {
      await shop.unequipLogo();
      showToast('Logo quitado.');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'No se pudo quitar el logo', 'error');
    }
  }, [shop, showToast]);

  return { handleBuy, handleCardClick, handleEquip, handleUnequip };
}
