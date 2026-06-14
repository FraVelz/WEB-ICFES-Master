'use client';

import { cn } from '@/utils/cn';
import React, { useEffect, useRef } from 'react';
import { Icon } from '@/shared/components/Icon';
import { gsap } from '@/lib/gsap';
import { prefersReducedMotion } from '@/utils/prefersReducedMotion';
import { DOUBLE_XP_ITEM_ID } from '../constants/doubleXp';
import { MAX_STREAK_SHIELDS, STREAK_SHIELD_ITEM_ID } from '../constants/streakShield';
import type { ShopItem } from '../data/shopItems';
import { formatCountdown } from '../utils/formatCountdown';
import { ShopItemPreview } from './ShopItemPreview';
import { ShopItemModalActions } from './ShopItemModalActions';
import { useDialogA11y } from '@/shared/hooks/useDialogA11y';

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
  const isDoubleXpActive = item?.id === DOUBLE_XP_ITEM_ID && doubleXpRemainingMs > 0;
  const isStreakShieldFull = item?.id === STREAK_SHIELD_ITEM_ID && streakShieldCount >= MAX_STREAK_SHIELDS;
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useDialogA11y(isOpen, onClose, contentRef);

  useEffect(() => {
    if (!isOpen || !overlayRef.current || !contentRef.current) return;

    if (prefersReducedMotion()) {
      gsap.set(overlayRef.current, { opacity: 1 });
      gsap.set(contentRef.current, { opacity: 1, scale: 1 });
      return;
    }

    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
    );
  }, [isOpen]);

  if (!isOpen || !item) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
    >
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shop-item-title"
        className="border-surface-border bg-surface-elevated relative w-full max-w-md overflow-hidden rounded-3xl border shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className={cn(
            'absolute top-4 right-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full',
            'bg-surface-overlay text-on-surface-muted hover:bg-on-surface-muted hover:text-on-surface transition-colors',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            'focus-visible:ring-offset-surface-elevated'
          )}
        >
          <Icon name="times" />
        </button>

        <div className={cn('relative flex h-32 items-center justify-center', `bg-linear-to-br ${item.color}`)}>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 translate-y-8">
            <ShopItemPreview item={item} variant="modal" />
          </div>
        </div>

        <div className="px-8 pt-12 pb-8 text-center">
          <h2 id="shop-item-title" className="text-on-surface mb-2 text-2xl font-bold">
            {item.name}
          </h2>
          <div
            className={cn(
              'bg-surface-overlay mb-4 inline-block rounded-full px-3 py-1 text-xs font-bold',
              'text-on-surface-muted tracking-wider uppercase'
            )}
          >
            {item.category === 'powerup' ? 'Consumible' : item.category === 'logo' ? 'Logo' : 'Cosmético'}
          </div>

          <p className="text-on-surface-muted mb-8 leading-relaxed">{item.description}</p>

          {item.id === STREAK_SHIELD_ITEM_ID && streakShieldCount > 0 && (
            <div
              className={cn(
                'mb-4 flex items-center justify-center gap-2 rounded-xl border border-green-600/35',
                'bg-green-100 px-4 py-3 text-green-900 dark:border-green-500/30',
                'dark:bg-green-500/10 dark:text-green-300'
              )}
            >
              <Icon name="shield-alt" />
              <span className="text-sm font-bold">
                Tienes {streakShieldCount} protector{streakShieldCount === 1 ? '' : 'es'} ({streakShieldCount}/
                {MAX_STREAK_SHIELDS})
              </span>
            </div>
          )}

          {isDoubleXpActive && (
            <div
              className={cn(
                'mb-4 flex items-center justify-center gap-2 rounded-xl border border-orange-600/35',
                'bg-orange-100 px-4 py-3 text-orange-900 dark:border-orange-500/30',
                'dark:bg-orange-500/10 dark:text-orange-300'
              )}
            >
              <Icon name="bolt" />
              <span className="text-sm font-bold">Doble XP activo</span>
              <span className="font-mono text-base font-bold tabular-nums">{formatCountdown(doubleXpRemainingMs)}</span>
            </div>
          )}

          <ShopItemModalActions
            item={item}
            purchase={purchase}
            coins={coins}
            isDoubleXpActive={isDoubleXpActive}
            isStreakShieldFull={isStreakShieldFull}
            onBuy={onBuy}
            onEquip={onEquip}
            onUnequip={onUnequip}
          />
        </div>
      </div>
    </div>
  );
};
