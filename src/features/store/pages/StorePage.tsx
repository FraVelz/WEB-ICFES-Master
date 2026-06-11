'use client';

import { useState } from 'react';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components';
import { SkeletonGrid } from '@/shared/components/SkeletonCard';
import { useToast } from '@/shared/components/Toast/ToastProvider';
import { PAGE_SHELL_CLASS } from '@/shared/constants/pageShell';
import { MAX_STREAK_SHIELDS, STREAK_SHIELD_ITEM_ID } from '../constants/streakShield';
import { useDoubleXpTimer } from '../hooks/useDoubleXpTimer';
import { useShop } from '../hooks/useShop';
import { ShopItemCard } from '../components/ShopItemCard';
import { ShopItemModal } from '../components/ShopItemModal';
import type { ShopItem } from '../data/shopItems';
import { STORE_FILTERS } from './storePageConstants';
import { StoreDoubleXpBanner } from './StoreDoubleXpBanner';
import { StorePageHeader } from './StorePageHeader';
import { useStorePageHandlers } from './useStorePageHandlers';
import { EmptyState } from '@/shared/components/EmptyState';

export function StorePage() {
  const shop = useShop();
  const { coins, hasItem, isEquipped, loading, error, processing, shopItems, streakShieldCount } = shop;
  const { remainingMs: doubleXpRemainingMs, isActive: isDoubleXpActive } = useDoubleXpTimer();
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const { showToast } = useToast();

  const { handleBuy, handleCardClick, handleEquip, handleUnequip } = useStorePageHandlers(
    shop,
    showToast,
    setSelectedItem,
    hasItem
  );

  const showStoreLoading = loading && coins === 0 && shop.inventory.length === 0;
  const filteredItems = filter === 'all' ? shopItems : shopItems.filter((item) => item.category === filter);

  return (
    <div className={cn(PAGE_SHELL_CLASS, 'flex min-h-dvh flex-col pb-0')}>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="from-app-ring/10 absolute top-0 left-0 h-96 w-full bg-linear-to-b to-transparent" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-yellow-500/5 blur-3xl" />
      </div>

      <StorePageHeader coins={coins} loading={loading} />

      <div className="relative z-10 container mx-auto max-w-5xl flex-1 space-y-6 px-4 py-6 lg:py-8">
        {showStoreLoading ? (
          <SkeletonGrid count={6} columnsClassName="grid-cols-2 md:grid-cols-3" />
        ) : error ? (
          <EmptyState
            icon="exclamation-triangle"
            title="No se pudo cargar la tienda"
            description={error}
          />
        ) : (
          <>
            {isDoubleXpActive && <StoreDoubleXpBanner remainingMs={doubleXpRemainingMs} />}

            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
              {STORE_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'cursor-pointer rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-all',
                    'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2',
                    'focus-visible:outline-none',
                    'focus-visible:ring-offset-surface',
                    filter === f.id
                      ? 'border-purple-500 bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                      : 'border-surface-border bg-surface-elevated text-on-surface-muted hover:text-on-surface'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <ShopItemCard
                  key={item.id}
                  item={item}
                  isPurchased={item.category !== 'powerup' && hasItem(item.id)}
                  isEquipped={item.category === 'logo' && isEquipped(item.id)}
                  canAfford={coins >= item.price}
                  processing={processing}
                  doubleXpRemainingMs={doubleXpRemainingMs}
                  streakShieldCount={streakShieldCount}
                  onClick={() => handleCardClick(item)}
                  onEquip={handleEquip}
                  onUnequip={() => {
                    void handleUnequip();
                  }}
                />
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div
                className={cn(
                  'border-surface-border bg-surface-elevated/40 rounded-3xl border border-dashed py-20 text-center'
                )}
              >
                <Icon name="shopping-bag" size="2xl" className="text-on-surface-muted mb-4 opacity-50" />
                <p className="text-on-surface-muted text-lg">No hay artículos en esta categoría aún.</p>
              </div>
            )}
          </>
        )}

        <ShopItemModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          onBuy={handleBuy}
          onEquip={handleEquip}
          onUnequip={handleUnequip}
          purchase={{
            processing,
            canAfford:
              !!selectedItem &&
              coins >= selectedItem.price &&
              (selectedItem.id !== STREAK_SHIELD_ITEM_ID || streakShieldCount < MAX_STREAK_SHIELDS),
            isPurchased: !!selectedItem && selectedItem.category !== 'powerup' && hasItem(selectedItem.id),
            isEquipped: !!selectedItem && isEquipped(selectedItem.id),
          }}
          coins={coins}
          streakShieldCount={streakShieldCount}
          doubleXpRemainingMs={doubleXpRemainingMs}
        />
      </div>
    </div>
  );
}
