'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/utils/cn';
import { Icon, LoadingState } from '@/shared/components';
import { PAGE_SHELL_CLASS } from '@/shared/constants/pageShell';
import { useShop } from '../hooks/useShop';
import { ShopItemCard } from '../components/ShopItemCard';
import { ShopItemModal } from '../components/ShopItemModal';
import type { ShopItem } from '../data/shopItems';

const FILTERS = [
  { id: 'all', label: 'Todo' },
  { id: 'logo', label: 'Logos' },
  { id: 'avatar', label: 'Avatares' },
  { id: 'theme', label: 'Temas' },
  { id: 'powerup', label: 'Potenciadores' },
  { id: 'badge', label: 'Insignias' },
] as const;

export function StorePage() {
  const { coins, hasItem, isEquipped, loading, error, processing, buyItem, equipLogo, unequipLogo, shopItems } =
    useShop();
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const handleBuy = async (item: ShopItem) => {
    try {
      await buyItem(item);
      setSelectedItem(null);
      alert(`¡Has comprado ${item.name}!`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error en la compra');
    }
  };

  const handleEquip = async (item: ShopItem) => {
    try {
      await equipLogo(item.id);
      alert(`Logo "${item.name}" equipado.`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo equipar el logo');
    }
  };

  const handleUnequip = async () => {
    try {
      await unequipLogo();
      alert('Logo quitado.');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo quitar el logo');
    }
  };

  const filteredItems = filter === 'all' ? shopItems : shopItems.filter((item) => item.category === filter);

  return (
    <div className={cn(PAGE_SHELL_CLASS, 'flex min-h-dvh flex-col')}>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="from-app-ring/10 absolute top-0 left-0 h-96 w-full bg-linear-to-b to-transparent" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-yellow-500/5 blur-3xl" />
      </div>

      <div className="border-surface-border bg-surface-elevated/95 relative z-20 flex shrink-0 items-center justify-between border-b p-4 backdrop-blur-md lg:p-6">
        <div className="w-10 shrink-0 lg:w-12" aria-hidden />
        <div className="flex flex-1 items-center justify-center gap-3">
          <h1 className="text-on-surface text-xl font-bold lg:text-2xl">Tienda</h1>
          <div className="flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1.5">
            <Icon name="coins" size="md" className="text-sm text-yellow-400 lg:text-base" />
            <span className="text-sm font-bold text-yellow-400 lg:text-base">{loading ? '…' : coins}</span>
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
                  canAfford={coins >= item.price}
                  onClick={() => setSelectedItem(item)}
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
          processing={processing}
          canAfford={!!selectedItem && coins >= selectedItem.price}
          isPurchased={!!selectedItem && hasItem(selectedItem.id)}
          isEquipped={!!selectedItem && isEquipped(selectedItem.id)}
        />
      </div>
    </div>
  );
}
