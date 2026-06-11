import { cn } from '@/utils/cn';
import React from 'react';
import { DOUBLE_XP_ITEM_ID } from '../constants/doubleXp';
import { MAX_STREAK_SHIELDS, STREAK_SHIELD_ITEM_ID } from '../constants/streakShield';
import type { ShopItem } from '../data/shopItems';
import { ShopItemPreview } from './ShopItemPreview';
import { ShopItemCardBadge } from './ShopItemCardBadge';
import { ShopItemCardFooter } from './ShopItemCardFooter';

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
      ? cn(
          'border-orange-500/60 bg-orange-50 shadow-md shadow-orange-200/60',
          'dark:border-orange-500/50 dark:bg-orange-500/5 dark:shadow-lg dark:shadow-orange-500/10'
        )
      : isOwnedPermanent
        ? 'border-green-600/35 bg-surface-elevated dark:border-green-500/30 dark:bg-surface-elevated/50'
        : canAfford
          ? cn(
              'border-surface-border bg-surface-elevated hover:border-app-ring hover:shadow-app-ring/10',
              'cursor-pointer hover:-translate-y-1 hover:shadow-xl dark:border-surface-border',
              'dark:bg-surface-overlay/40 dark:hover:bg-surface-overlay/60'
            )
          : cn(
              'border-surface-border bg-surface-elevated/60 cursor-pointer opacity-80 hover:opacity-100',
              'dark:border-surface-border dark:bg-surface-elevated/30 dark:opacity-70'
            )
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
        <ShopItemCardBadge
          item={item}
          isPurchased={isPurchased}
          isPurchasedLogo={isPurchasedLogo}
          isEquipped={isEquipped}
          canAfford={canAfford}
          isDoubleXpActive={isDoubleXpActive}
          isStreakShield={isStreakShield}
          streakShieldCount={streakShieldCount}
        />
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

        <ShopItemCardFooter
          item={item}
          isPurchased={isPurchased}
          isPurchasedLogo={isPurchasedLogo}
          isEquipped={isEquipped}
          canAfford={canAfford}
          processing={processing}
          isDoubleXpActive={isDoubleXpActive}
          isStreakShield={isStreakShield}
          streakShieldFull={streakShieldFull}
          doubleXpRemainingMs={doubleXpRemainingMs}
          streakShieldCount={streakShieldCount}
          onEquip={onEquip}
          onUnequip={onUnequip}
        />
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
        'focus-visible:ring-offset-surface-via'
      )}
    >
      {content}
    </button>
  );
};
