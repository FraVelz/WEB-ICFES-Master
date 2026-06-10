'use client';

import { cn } from '@/utils/cn';
import React, { useEffect, useRef } from 'react';
import { Icon } from '@/shared/components/Icon';
import { gsap } from '@/lib/gsap';
import { DOUBLE_XP_ITEM_ID } from '../constants/doubleXp';
import { MAX_STREAK_SHIELDS, STREAK_SHIELD_ITEM_ID } from '../constants/streakShield';
import type { ShopItem } from '../data/shopItems';
import { formatCountdown } from '../utils/formatCountdown';
import { ShopItemPreview } from './ShopItemPreview';

export type ShopItemModalPurchase = {
  processing: boolean;
  canAfford: boolean;
  isPurchased: boolean;
  isEquipped: boolean;
};

export interface ShopItemModalProps {
  item: ShopItem | null;
  isOpen: boolean;
  onClose: () => void;
  onBuy: (item: ShopItem) => void | Promise<void>;
  onEquip?: (item: ShopItem) => void | Promise<void>;
  onUnequip?: () => void | Promise<void>;
  purchase: ShopItemModalPurchase;
  coins: number;
  doubleXpRemainingMs?: number;
  streakShieldCount?: number;
}

export const ShopItemModal = ({
  item,
  isOpen,
  onClose,
  onBuy,
  onEquip,
  onUnequip,
  purchase,
  coins,
  doubleXpRemainingMs = 0,
  streakShieldCount = 0,
}: ShopItemModalProps) => {
  const { processing, canAfford, isPurchased, isEquipped } = purchase;
  const isDoubleXpActive = item?.id === DOUBLE_XP_ITEM_ID && doubleXpRemainingMs > 0;
  const isStreakShieldFull =
    item?.id === STREAK_SHIELD_ITEM_ID && streakShieldCount >= MAX_STREAK_SHIELDS;
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !overlayRef.current || !contentRef.current) return;
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
    );
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const isConsumible = item.category === 'powerup';
  const showBuyAction = isConsumible || !isPurchased;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
    >
      <div
        ref={contentRef}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className={cn(
            'absolute top-4 right-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full',
            'bg-slate-800 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            'focus-visible:ring-offset-slate-900'
          )}
        >
          <Icon name="times" />
        </button>

        {/* Header Image */}
        <div className={cn('relative flex h-32 items-center justify-center', `bg-linear-to-br ${item.color}`)}>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 translate-y-8">
            <ShopItemPreview item={item} variant="modal" />
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pt-12 pb-8 text-center">
          <h2 className="mb-2 text-2xl font-bold text-white">{item.name}</h2>
          <div className="mb-4 inline-block rounded-full bg-slate-800 px-3 py-1 text-xs font-bold tracking-wider text-slate-400 uppercase">
            {item.category === 'powerup'
              ? 'Consumible'
              : item.category === 'logo'
                ? 'Logo'
                : 'Cosmético'}
          </div>

          <p className="mb-8 leading-relaxed text-slate-300">{item.description}</p>

          {item.id === STREAK_SHIELD_ITEM_ID && streakShieldCount > 0 && (
            <div className="mb-4 flex items-center justify-center gap-2 rounded-xl border border-green-600/35 bg-green-100 px-4 py-3 text-green-900 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300">
              <Icon name="shield-alt" />
              <span className="text-sm font-bold">
                Tienes {streakShieldCount} protector{streakShieldCount === 1 ? '' : 'es'} ({streakShieldCount}/
                {MAX_STREAK_SHIELDS})
              </span>
            </div>
          )}

          {isDoubleXpActive && (
            <div className="mb-4 flex items-center justify-center gap-2 rounded-xl border border-orange-600/35 bg-orange-100 px-4 py-3 text-orange-900 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-300">
              <Icon name="bolt" />
              <span className="text-sm font-bold">Doble XP activo</span>
              <span className="font-mono text-base font-bold tabular-nums">{formatCountdown(doubleXpRemainingMs)}</span>
            </div>
          )}

          {/* Action Button */}
          {isPurchased && item.category === 'logo' ? (
            <button
              type="button"
              disabled={processing}
              onClick={() => void (isEquipped ? onUnequip?.() : onEquip?.(item))}
              className={cn(
                'flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3 font-bold transition-all',
                'focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none',
                'focus-visible:ring-offset-slate-950',
                isEquipped
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
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
          ) : showBuyAction ? (
            <button
              type="button"
              onClick={() => onBuy(item)}
              disabled={!canAfford || processing}
              className={cn(
                'flex w-full items-center justify-center gap-3 rounded-xl py-4 text-lg font-bold transition-all',
                'focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none',
                'focus-visible:ring-offset-slate-950',
                processing
                  ? 'cursor-wait bg-slate-700 text-slate-400'
                  : canAfford
                    ? 'cursor-pointer transform bg-linear-to-r from-yellow-500 to-orange-500 text-black shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 hover:from-yellow-400 hover:to-orange-400 hover:shadow-orange-500/40'
                    : 'cursor-not-allowed bg-slate-800 text-slate-500'
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
          ) : null}

          {isStreakShieldFull && showBuyAction && (
            <p className="text-on-surface-muted mt-3 text-sm">
              Ya tienes el máximo de protectores. Se usarán automáticamente si fallas un día de racha.
            </p>
          )}

          {!canAfford && showBuyAction && !isStreakShieldFull && (
            <p className="mt-3 text-sm font-medium text-red-400">
              Te faltan {Math.max(0, item.price - coins)} monedas para comprar esto.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
