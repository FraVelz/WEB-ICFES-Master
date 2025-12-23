import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStore, 
  faCoins, 
  faShoppingBag, 
  faSpinner,
  faFilter
} from '@fortawesome/free-solid-svg-icons';
import { useShopFirebase } from '../hooks/useShopFirebase';
import { ShopItemCard } from '../components/ShopItemCard';
import { ShopItemModal } from '../components/ShopItemModal';

export const StorePage = () => {
  const { coins, purchases, loading, processing, buyItem, shopItems } = useShopFirebase();
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState('all'); // all, avatar, theme, powerup

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

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-cyan-400" />
          <p className="text-slate-300">Cargando tienda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-white pb-24 md:pb-0">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-yellow-900/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <FontAwesomeIcon icon={faStore} className="text-purple-400" />
              Tienda de Recompensas
            </h1>
            <p className="text-slate-400">
              Canjea tus monedas por avatares exclusivos, temas y potenciadores.
            </p>
          </div>

          {/* Wallet Card */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-4 px-6 flex items-center gap-4 shadow-lg shadow-yellow-500/10">
            <div className="text-right">
              <div className="text-xs text-slate-400 uppercase font-bold">Tu Saldo</div>
              <div className="text-2xl font-bold text-yellow-400">{coins}</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-xl border border-yellow-500/50">
              <FontAwesomeIcon icon={faCoins} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex overflow-x-auto pb-4 mb-8 gap-2 no-scrollbar">
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
              className={` cursor-pointer px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all border ${
                filter === f.id
                  ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => {
            const isPurchased = purchases.includes(item.id) && item.category !== 'powerup';
            const canAfford = coins >= item.price;

            return (
              <ShopItemCard
                key={item.id}
                item={item}
                isPurchased={isPurchased}
                canAfford={canAfford}
                // onClick={() => setSelectedItem(item)}
                onClick={() => {}}
              />
            );
          })}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800 border-dashed">
            <FontAwesomeIcon icon={faShoppingBag} className="text-4xl text-slate-600 mb-4" />
            <p className="text-slate-400 text-lg">No hay artículos en esta categoría aún.</p>
          </div>
        )}

        {/* Purchase Modal */}
        <ShopItemModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          onBuy={handleBuy}
          processing={processing}
          canAfford={selectedItem && coins >= selectedItem.price}
          isPurchased={selectedItem && purchases.includes(selectedItem.id)}
        />

      </div>
    </div>
  );
};
