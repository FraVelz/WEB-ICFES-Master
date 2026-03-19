'use client';

import React, { useState } from 'react';
import { Icon } from '@/shared/components/Icon';
import { useShop } from '../hooks/useShop';
import { ShopItemCard } from './ShopItemCard';
import { ShopItemModal } from './ShopItemModal';
import { useGSAPModalEntrance } from '@/hooks/useGSAPModalEntrance';

export const StoreModal = ({ isOpen, onClose }) => {
  const { coins, hasItem, loading, processing, buyItem, shopItems } = useShop();
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState('all'); // all, avatar, theme, powerup
  const modalRef = useGSAPModalEntrance({
    isOpen,
    type: 'fade',
    duration: 0.2,
  });

  const handleBuy = async (item) => {
    try {
      await buyItem(item);
      setSelectedItem(null);
      // Aquí podrías mostrar un toast de éxito
      alert(`¡Has comprado ${item.name}!`);
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredItems =
    filter === 'all'
      ? shopItems
      : shopItems.filter((item) => item.category === filter);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-100 flex flex-col bg-slate-950"
    >
      <div className="flex h-full w-full flex-col overflow-hidden bg-slate-900">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 p-4 lg:p-6">
          <div className="flex flex-1 items-center justify-center gap-3">
            <h2 className="text-xl font-bold text-white lg:text-2xl">Tienda</h2>
            <div className="flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1.5">
              <Icon
                name="coins"
                size="md"
                className="text-sm text-yellow-400 lg:text-base"
              />
              <span className="text-sm font-bold text-yellow-400 lg:text-base">
                {coins}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="-mr-2 cursor-pointer rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <Icon name="times" size="xl" className="text-lg lg:text-xl" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto scroll-smooth p-4 lg:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="space-y-4 text-center">
                <Icon
                  name="spinner"
                  size="2xl"
                  className="animate-spin text-4xl text-cyan-400"
                />
                <p className="text-slate-300">Cargando tienda...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Filters */}
              <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-4">
                {[
                  { id: 'all', label: 'Todo' },
                  { id: 'avatar', label: 'Avatares' },
                  { id: 'theme', label: 'Temas' },
                  { id: 'powerup', label: 'Potenciadores' },
                  { id: 'badge', label: 'Insignias' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`cursor-pointer rounded-full border px-4 py-2 font-medium whitespace-nowrap transition-all ${
                      filter === f.id
                        ? 'border-purple-500 bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                        : 'border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {filteredItems.map((item) => {
                  const isPurchased =
                    item.category !== 'powerup' && hasItem(item.id);
                  const canAfford = coins >= item.price;

                  return (
                    <ShopItemCard
                      key={item.id}
                      item={item}
                      isPurchased={isPurchased}
                      canAfford={canAfford}
                      onClick={() => setSelectedItem(item)}
                    />
                  );
                })}
              </div>

              {/* Empty State */}
              {filteredItems.length === 0 && (
                <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 py-20 text-center">
                  <Icon
                    name="shopping-bag"
                    size="2xl"
                    className="mb-4 text-4xl text-slate-600"
                  />
                  <p className="text-lg text-slate-400">
                    No hay artículos en esta categoría aún.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Purchase Modal */}
        <ShopItemModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          onBuy={handleBuy}
          processing={processing}
          canAfford={selectedItem && coins >= selectedItem.price}
          isPurchased={selectedItem && hasItem(selectedItem.id)}
        />
      </div>
    </div>
  );
};
