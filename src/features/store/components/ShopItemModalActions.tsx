'use client';

import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { MAX_STREAK_SHIELDS, STREAK_SHIELD_ITEM_ID } from '../constants/streakShield';
import type { ShopItem } from '../data/shopItems';
import type { ShopItemModalPurchase } from './ShopItemModal';

type ShopItemModalActionsProps = {
  item: ShopItem;
  purchase: ShopItemModalPurchase;
  coins: number;
  isDoubleXpActive: boolean;
  isStreakShieldFull: boolean;
  onBuy: (item: ShopItem) => void | Promise<void>;
  onEquip?: (item: ShopItem) => void | Promise<void>;
  onUnequip?: () => void | Promise<void>;
};

export function ShopItemModalActions({
  item,
  purchase,
  coins,
  isDoubleXpActive,
  isStreakShieldFull,
  onBuy,
  onEquip,
  onUnequip,
}: ShopItemModalActionsProps) {
  const { processing, canAfford, isPurchased, isEquipped } = purchase;
  const isConsumible = item.category === 'powerup';
  const showBuyAction = isConsumible || !isPurchased;

  if (isPurchased && item.category === 'logo') {
    return (
      <button
        type="button"
        disabled={processing}
        onClick={() => void (isEquipped ? onUnequip?.() : onEquip?.(item))}
        className={cn(
          'flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3 font-bold transition-all',
          'focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none',
          'focus-visible:ring-offset-surface-via',
          isEquipped
            ? 'bg-surface-overlay text-on-surface-muted hover:bg-on-surface-muted'
            : 'bg-app-ring/20 text-app-accent hover:bg-app-ring/30'
        )}
      >
        {processing ? (
          <>
            <Icon name="spinner" className="animate-spin" />
            Guardando...
          </>
        ) : isEquipped ? (
          <>
            <Icon name="times" />
            Quitar logo
          </>
        ) : (
          <>
            <Icon name="check" />
            Equipar logo
          </>
        )}
      </button>
    );
  }

  if (!showBuyAction) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => onBuy(item)}
        disabled={!canAfford || processing}
        className={cn(
          'flex w-full items-center justify-center gap-3 rounded-xl py-4 text-lg font-bold transition-all',
          'focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none',
          'focus-visible:ring-offset-surface-via',
          processing
            ? 'bg-on-surface-muted text-on-surface-muted cursor-wait'
            : canAfford
              ? cn(
                  'transform cursor-pointer bg-linear-to-r from-yellow-500 to-orange-500 text-black shadow-lg',
                  'shadow-orange-500/20 hover:-translate-y-0.5 hover:from-yellow-400 hover:to-orange-400',
                  'hover:shadow-orange-500/40'
                )
              : 'bg-surface-overlay text-on-surface-muted cursor-not-allowed'
        )}
      >
        {processing ? (
          <>
            <Icon name="spinner" className="animate-spin" />
            Procesando...
          </>
        ) : isStreakShieldFull ? (
          <>
            <Icon name="shield-alt" />
            Inventario lleno ({MAX_STREAK_SHIELDS}/{MAX_STREAK_SHIELDS})
          </>
        ) : canAfford ? (
          <>
            <span>
              {isDoubleXpActive
                ? 'Añadir 1 hora más por'
                : item.id === STREAK_SHIELD_ITEM_ID
                  ? 'Comprar protector por'
                  : 'Comprar por'}
            </span>
            <span className="flex items-center gap-1 rounded-lg bg-black/20 px-2 py-0.5">
              <Icon name="coins" /> {item.price}
            </span>
          </>
        ) : (
          <>
            <Icon name="lock" />
            Insuficientes Monedas ({item.price})
          </>
        )}
      </button>

      {isStreakShieldFull && (
        <p className="text-on-surface-muted mt-3 text-sm">
          Ya tienes el máximo de protectores. Se usarán automáticamente si fallas un día de racha.
        </p>
      )}

      {!canAfford && !isStreakShieldFull && (
        <p className="mt-3 text-sm font-medium text-red-400">
          Te faltan {Math.max(0, item.price - coins)} monedas para comprar esto.
        </p>
      )}
    </>
  );
}
