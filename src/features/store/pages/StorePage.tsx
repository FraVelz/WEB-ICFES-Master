'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';
import { Icon, LoadingState } from '@/shared/components';
import { PAGE_SHELL_CLASS } from '@/shared/constants/pageShell';
import { DOUBLE_XP_ITEM_ID } from '../constants/doubleXp';
import { MAX_STREAK_SHIELDS, STREAK_SHIELD_ITEM_ID } from '../constants/streakShield';
import { VIP_BADGE_ITEM_ID } from '../constants/vipBadge';
import { useDoubleXpTimer } from '../hooks/useDoubleXpTimer';
import { useShop } from '../hooks/useShop';
import { formatCountdown } from '../utils/formatCountdown';
import { ShopItemCard } from '../components/ShopItemCard';
import { ShopItemModal } from '../components/ShopItemModal';
import type { ShopItem } from '../data/shopItems';

type StoreToast = { message: string; type: 'success' | 'error' };

const FILTERS = [
  { id: 'all', label: 'Todo' },
  { id: 'logo', label: 'Logos' },
  { id: 'powerup', label: 'Potenciadores' },
  { id: 'badge', label: 'Insignias' },
] as const;

export function StorePage() {
  const {
    coins,
    hasItem,
    isEquipped,
    loading,
    error,
    processing,
    buyItem,
    equipLogo,
    unequipLogo,
    shopItems,
    streakShieldCount,
  } = useShop();
  const { remainingMs: doubleXpRemainingMs, isActive: isDoubleXpActive } = useDoubleXpTimer();
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [toast, setToast] = useState<StoreToast | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, type: StoreToast['type'] = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => setToast(null), 3500);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const handleBuy = async (item: ShopItem) => {
    try {
      await buyItem(item);
      setSelectedItem(null);
      showToast(
        item.id === DOUBLE_XP_ITEM_ID
          ? '¡Doble XP activado! Tienes 1 hora de experiencia doble.'
          : item.id === STREAK_SHIELD_ITEM_ID
            ? '¡Protector de racha adquirido! Se usará automáticamente si fallas un día.'
            : item.id === VIP_BADGE_ITEM_ID
              ? '¡Insignia VIP activa! Tu avatar tendrá borde dorado en la clasificatoria.'
              : `¡Has comprado ${item.name}!`
      );
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error en la compra', 'error');
    }
  };

  const handleCardClick = (item: ShopItem) => {
    const purchased = item.category !== 'powerup' && hasItem(item.id);
    if (purchased) return;
    setSelectedItem(item);
  };

  const handleEquip = async (item: ShopItem) => {
    try {
      await equipLogo(item.id);
      showToast(`Logo "${item.name}" equipado.`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'No se pudo equipar el logo', 'error');
    }
  };

  const handleUnequip = async () => {
    try {
      await unequipLogo();
      showToast('Logo quitado.');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'No se pudo quitar el logo', 'error');
    }
  };

  const filteredItems = filter === 'all' ? shopItems : shopItems.filter((item) => item.category === filter);

  return (
    <div className={cn(PAGE_SHELL_CLASS, 'flex min-h-dvh flex-col')}>
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            'animate-fade-in-up fixed top-20 right-4 z-[60] max-w-sm rounded-xl border p-4 shadow-xl backdrop-blur-md',
            toast.type === 'success'
              ? 'border-green-600/30 bg-green-100 text-green-900 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300'
              : 'border-red-600/30 bg-red-100 text-red-900 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300'
          )}
        >
          <div className="flex items-center gap-3">
            <Icon name={toast.type === 'success' ? 'check-circle' : 'warning'} />
            <p className="text-sm font-medium">{toast.message}</p>
            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Cerrar aviso"
              className="text-on-surface-muted hover:text-on-surface ml-auto cursor-pointer rounded-full p-1 transition-colors"
            >
              <Icon name="times" size="sm" />
            </button>
          </div>
        </div>
      )}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="from-app-ring/10 absolute top-0 left-0 h-96 w-full bg-linear-to-b to-transparent" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-yellow-500/5 blur-3xl" />
      </div>

      <div className="border-surface-border bg-surface-elevated/95 relative z-20 flex shrink-0 items-center justify-between border-b p-4 backdrop-blur-md lg:p-6">
        <div className="w-10 shrink-0 lg:w-12" aria-hidden />
        <div className="flex flex-1 items-center justify-center gap-3">
          <h1 className="text-on-surface text-xl font-bold lg:text-2xl">Tienda</h1>
          <div className="flex items-center gap-2 rounded-full border border-amber-600/35 bg-amber-100 px-3 py-1.5 dark:border-yellow-500/30 dark:bg-yellow-500/10">
            <Icon
              name="coins"
              size="md"
              className="text-sm text-amber-800 lg:text-base dark:text-yellow-400"
            />
            <span className="text-sm font-bold text-amber-800 lg:text-base dark:text-yellow-400">
              {loading ? '…' : coins}
            </span>
          </div>
        </div>
        <Link
          href="/ruta-aprendizaje"
          aria-label="Cerrar tienda"
          className={cn(
            'text-on-surface-muted hover:bg-surface-elevated hover:text-on-surface -mr-2 shrink-0 cursor-pointer rounded-full p-2 transition-colors',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            'focus-visible:ring-offset-surface-elevated'
          )}
        >
          <Icon name="times" size="xl" className="text-lg lg:text-xl" />
        </Link>
      </div>

      <div className="relative z-10 container mx-auto max-w-5xl flex-1 space-y-6 px-4 py-6 lg:py-8">
        {loading ? (
          <LoadingState label="Cargando tienda..." layout="section" />
        ) : error ? (
          <div className="border-surface-border bg-surface-elevated/40 rounded-3xl border border-dashed py-16 text-center">
            <Icon name="exclamation-triangle" size="2xl" className="mb-4 text-red-400" />
            <p className="text-on-surface mb-2 text-lg font-semibold">No se pudo cargar la tienda</p>
            <p className="text-on-surface-muted mx-auto max-w-md text-sm">{error}</p>
          </div>
        ) : (
          <>
            {isDoubleXpActive && (
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-orange-500/40 bg-orange-100 px-4 py-3 dark:border-orange-500/30 dark:bg-orange-500/10">
                <div className="flex items-center gap-3">
                  <Icon name="bolt" className="text-orange-700 dark:text-orange-400" />
                  <div>
                    <p className="text-sm font-bold text-orange-900 dark:text-orange-300">Doble XP activo</p>
                    <p className="text-on-surface-muted text-xs">Ganas el doble de experiencia mientras dure el efecto.</p>
                  </div>
                </div>
                <span className="font-mono text-lg font-bold text-orange-800 tabular-nums dark:text-orange-300">
                  {formatCountdown(doubleXpRemainingMs)}
                </span>
              </div>
            )}

            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'cursor-pointer rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-all',
                    'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
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
              <div className="border-surface-border bg-surface-elevated/40 rounded-3xl border border-dashed py-20 text-center">
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
            isPurchased:
              !!selectedItem && selectedItem.category !== 'powerup' && hasItem(selectedItem.id),
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
