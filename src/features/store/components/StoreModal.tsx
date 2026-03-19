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
  const modalRef = useGSAPModalEntrance({ isOpen, type: 'fade', duration: 0.2 });

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

  const filteredItems = filter === 'all' 
    ? shopItems 
    : shopItems.filter(item => item.category === filter);

  if (!isOpen) return null;

  return (
    <div ref={modalRef} className="fixed inset-0 z-100 bg-slate-950 flex flex-col">
      <div className="w-full h-full overflow-hidden flex flex-col bg-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-slate-800 bg-slate-900 shrink-0">
          <div className="flex-1 flex items-center justify-center gap-3">
            <h2 className="text-xl lg:text-2xl font-bold text-white">Tienda</h2>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30">
              <Icon name="coins" size="md" className="text-yellow-400 text-sm lg:text-base" />
              <span className="text-yellow-400 font-bold text-sm lg:text-base">{coins}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-2 -mr-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-800"
          >
            <Icon name="times" size="xl" className="text-lg lg:text-xl" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scroll-smooth p-4 lg:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <Icon name="spinner" size="2xl" className="animate-spin text-4xl text-cyan-400" />
                <p className="text-slate-300">Cargando tienda...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Filters */}
              <div className="flex overflow-x-auto pb-4 mb-6 gap-2 no-scrollbar">
                {[
                  { id: 'all', label: 'Todo' },
                  { id: 'avatar', label: 'Avatares' },
                  { id: 'theme', label: 'Temas' },
                  { id: 'powerup', label: 'Potenciadores' },
                  { id: 'badge', label: 'Insignias' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`cursor-pointer px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all border ${
                      filter === f.id
                        ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/25'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {filteredItems.map(item => {
                  const isPurchased = item.category !== 'powerup' && hasItem(item.id);
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
                <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800 border-dashed">
                  <Icon name="shopping-bag" size="2xl" className="text-4xl text-slate-600 mb-4" />
                  <p className="text-slate-400 text-lg">No hay artículos en esta categoría aún.</p>
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

