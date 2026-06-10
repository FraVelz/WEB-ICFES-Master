import { cn } from '@/utils/cn';
import React from 'react';
import { Icon } from '@/shared/components/Icon';

import { DOUBLE_XP_ITEM_ID } from '../constants/doubleXp';
import { MAX_STREAK_SHIELDS, STREAK_SHIELD_ITEM_ID } from '../constants/streakShield';
import type { ShopItem } from '../data/shopItems';
import { formatCountdown } from '../utils/formatCountdown';
import { ShopItemPreview } from './ShopItemPreview';

export interface ShopItemCardProps {
  item: ShopItem;
  isPurchased: boolean;
  isEquipped?: boolean;
  canAfford: boolean;
  processing?: boolean;
  doubleXpRemainingMs?: number;
  streakShieldCount?: number;
  onClick: () => void;
  onEquip?: (item: ShopItem) => void;
  onUnequip?: (item: ShopItem) => void;
}

export const ShopItemCard = ({
  item,
  isPurchased,
  isEquipped = false,
  canAfford,
  processing = false,
  doubleXpRemainingMs = 0,
  streakShieldCount = 0,
  onClick,
  onEquip,
  onUnequip,
}: ShopItemCardProps) => {
  const isPurchasedLogo = isPurchased && item.category === 'logo';
  const isOwnedPermanent = isPurchased && item.category !== 'powerup';
  const isDoubleXpActive = item.id === DOUBLE_XP_ITEM_ID && doubleXpRemainingMs > 0;
  const isStreakShield = item.id === STREAK_SHIELD_ITEM_ID;
  const streakShieldFull = isStreakShield && streakShieldCount >= MAX_STREAK_SHIELDS;

  const cardClassName = cn(
    'group relative w-full overflow-hidden rounded-2xl border-2 p-6 text-left transition-all duration-300',
    isDoubleXpActive
      ? 'border-orange-500/60 bg-orange-50 shadow-md shadow-orange-200/60 dark:border-orange-500/50 dark:bg-orange-500/5 dark:shadow-lg dark:shadow-orange-500/10'
      : isOwnedPermanent
        ? 'border-green-600/35 bg-surface-elevated dark:border-green-500/30 dark:bg-slate-900/50'
        : canAfford
          ? 'border-surface-border bg-surface-elevated hover:border-app-ring hover:shadow-app-ring/10 cursor-pointer hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800/40 dark:hover:bg-slate-800/60'
          : 'border-surface-border bg-surface-elevated/60 cursor-pointer opacity-80 hover:opacity-100 dark:border-slate-800 dark:bg-slate-900/30 dark:opacity-70'
  );

  const content = (
    <>
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500',
          !isPurchasedLogo && 'group-hover:opacity-5',
          `bg-linear-to-br ${item.color}`
        )}
      />

      <div className="absolute top-3 right-3">
        {isStreakShield && streakShieldCount > 0 ? (
          <span className="flex items-center gap-1 rounded-full border border-green-600/35 bg-green-100 px-2 py-1 text-xs font-bold text-green-800 dark:border-green-500/30 dark:bg-green-500/20 dark:text-green-400">
            <Icon name="shield-alt" />
            {streakShieldCount}/{MAX_STREAK_SHIELDS}
          </span>
        ) : isDoubleXpActive ? (
          <span className="flex items-center gap-1 rounded-full border border-orange-600/40 bg-orange-100 px-2 py-1 text-xs font-bold text-orange-900 dark:border-orange-500/40 dark:bg-orange-500/20 dark:text-orange-300">
            <Icon name="bolt" />
            ACTIVO
          </span>
        ) : isPurchasedLogo && isEquipped ? (
          <span
            className={cn(
              'bg-app-ring/20 border-app-ring/30 flex items-center gap-1 rounded-full border px-2 py-1',
              'text-app-accent text-xs font-bold'
            )}
          >
            <Icon name="check" />
            EQUIPADO
          </span>
        ) : isPurchased && item.category !== 'logo' ? (
          <span
            className={cn(
              'flex items-center gap-1 rounded-full border border-green-600/35 bg-green-100 px-2 py-1',
              'dark:bg-lesson-sci-glow-a/20 text-xs font-bold text-green-800 dark:border-green-500/30 dark:text-green-400'
            )}
          >
            <Icon name="check" />
            ADQUIRIDO
          </span>
        ) : (
          !canAfford &&
          !isPurchased && (
            <span className="flex items-center gap-1 rounded-full border border-red-600/30 bg-red-100 px-2 py-1 text-xs font-bold text-red-800 dark:border-red-500/30 dark:bg-red-500/20 dark:text-red-400">
              <Icon name="lock" />
              FALTAN MONEDAS
            </span>
          )
        )}
      </div>

      <div className="mt-2 mb-6 flex justify-center">
        <ShopItemPreview
          item={item}
          variant="card"
          className={cn('transition-transform duration-300', !isPurchasedLogo && 'group-hover:scale-110')}
        />
      </div>

      <div className="relative z-10 text-center">
        <h3
          className={cn(
            'text-on-surface mb-1 text-lg font-bold transition-colors',
            !isPurchasedLogo && 'group-hover:text-app-accent'
          )}
        >
          {item.name}
        </h3>
        <p className="text-on-surface-muted mb-4 line-clamp-2 h-10 text-sm">{item.description}</p>

        {isPurchasedLogo ? (
          <button
            type="button"
            disabled={processing}
            onClick={(e) => {
              e.stopPropagation();
              void (isEquipped ? onUnequip?.(item) : onEquip?.(item));
            }}
            className={cn(
              'inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              'focus-visible:ring-offset-slate-950',
              processing && 'cursor-wait opacity-70',
              isEquipped
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                : 'bg-app-ring/20 text-app-accent hover:bg-app-ring/35 hover:shadow-app-ring/20 hover:shadow-md'
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
        ) : isDoubleXpActive ? (
          <div className="inline-flex items-center gap-2 rounded-lg border border-orange-600/35 bg-orange-100 px-4 py-2 text-sm font-bold text-orange-900 tabular-nums dark:border-orange-500/30 dark:bg-orange-500/15 dark:text-orange-300">
            <Icon name="clock" />
            <span>{formatCountdown(doubleXpRemainingMs)}</span>
          </div>
        ) : streakShieldFull ? (
          <div className="inline-flex items-center gap-2 rounded-lg border border-green-600/35 bg-green-100 px-4 py-2 text-sm font-bold text-green-800 dark:border-green-500/30 dark:bg-green-500/15 dark:text-green-300">
            <Icon name="shield-alt" />
            Inventario lleno
          </div>
        ) : isStreakShield ? (
          <div
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all',
              canAfford
                ? 'border border-emerald-600/35 bg-emerald-100 text-emerald-900 group-hover:bg-emerald-500 group-hover:text-white dark:border-transparent dark:bg-emerald-500/10 dark:text-emerald-300'
                : 'bg-slate-800 text-slate-500'
            )}
          >
            <Icon name="coins" />
            {item.price}
            {streakShieldCount > 0 && (
              <span className="text-xs opacity-80">
                ({streakShieldCount}/{MAX_STREAK_SHIELDS})
              </span>
            )}
          </div>
        ) : (
          <div
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all',
              isPurchased
                ? 'bg-slate-800 text-slate-400'
                : canAfford
                  ? 'border border-amber-300/50 bg-amber-100 text-amber-800 group-hover:border-transparent group-hover:bg-yellow-500 group-hover:text-black dark:border-transparent dark:bg-yellow-500/10 dark:text-yellow-400'
                  : 'bg-slate-800 text-slate-500'
            )}
          >
            {isPurchased ? (
              <span>Adquirido</span>
            ) : (
              <>
                <Icon name="coins" />
                {item.price}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );

  if (isOwnedPermanent) {
    return <div className={cardClassName}>{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        cardClassName,
        'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        'focus-visible:ring-offset-slate-950'
      )}
    >
      {content}
    </button>
  );
};
