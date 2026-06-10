'use client';

import { cn } from '@/utils/cn';
import React, { useEffect, useRef } from 'react';
import { Icon } from '@/shared/components/Icon';
import { gsap } from '@/lib/gsap';
import type { ShopItem } from '../data/shopItems';
import { ShopItemPreview } from './ShopItemPreview';

export interface ShopItemModalProps {
  item: ShopItem | null;
  isOpen: boolean;
  onClose: () => void;
  onBuy: (item: ShopItem) => void | Promise<void>;
  onEquip?: (item: ShopItem) => void | Promise<void>;
  onUnequip?: () => void | Promise<void>;
  processing: boolean;
  canAfford: boolean;
  isPurchased: boolean;
  isEquipped?: boolean;
}

export const ShopItemModal = ({
  item,
  isOpen,
  onClose,
  onBuy,
  onEquip,
  onUnequip,
  processing,
  canAfford,
  isPurchased,
  isEquipped = false,
}: ShopItemModalProps) => {
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
            'absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full',
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

          {/* Action Button */}
          {isPurchased && item.category !== 'powerup' ? (
            item.category === 'logo' ? (
              <div className="space-y-3">
                <div
                  className={cn(
                    'flex items-center justify-center gap-3 rounded-xl border border-green-500/30',
                    'bg-green-500/10 p-4 font-bold text-green-400'
                  )}
                >
                  <Icon name="check-circle" className="text-xl" />
                  <span>¡Ya tienes este logo!</span>
                </div>
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
              </div>
            ) : (
              <div
                className={cn(
                  'flex items-center justify-center gap-3 rounded-xl border border-green-500/30',
                  'bg-green-500/10 p-4 font-bold text-green-400'
                )}
              >
                <Icon name="check-circle" className="text-xl" />
                <span>¡Ya tienes este artículo!</span>
              </div>
            )
          ) : (
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
                    ? 'transform bg-linear-to-r from-yellow-500 to-orange-500 text-black shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 hover:from-yellow-400 hover:to-orange-400 hover:shadow-orange-500/40'
                    : 'cursor-not-allowed bg-slate-800 text-slate-500'
              )}
            >
              {processing ? (
                <>
                  <Icon name="spinner" className="animate-spin" />
                  Procesando...
                </>
              ) : canAfford ? (
                <>
                  <span>Comprar por</span>
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
          )}

          {!canAfford && !isPurchased && (
            <p className="mt-3 text-sm font-medium text-red-400">
              Te faltan {item.price - (canAfford ? 0 : 999999)} monedas para comprar esto.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
