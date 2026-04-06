import React from 'react';
import { Icon } from '@/shared/components/Icon';

import type { ShopItem } from '../data/shopItems';

export interface ShopItemCardProps {
  item: ShopItem;
  isPurchased: boolean;
  canAfford: boolean;
  onClick: () => void;
}

export const ShopItemCard = ({ item, isPurchased, canAfford, onClick }: ShopItemCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl border-2 p-6 transition-all duration-300 ${
        isPurchased
          ? 'border-green-500/30 bg-slate-900/50 hover:border-green-500/50'
          : canAfford
            ? 'border-slate-700 bg-slate-800/40 hover:-translate-y-1 hover:border-cyan-500 hover:bg-slate-800/60 hover:shadow-xl hover:shadow-cyan-500/10'
            : 'border-slate-800 bg-slate-900/30 opacity-70 hover:opacity-100'
      }`}
    >
      {/* Background Gradient Effect */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${item.color} opacity-0 transition-opacity duration-500 group-hover:opacity-5`}
      ></div>

      {/* Status Badge */}
      <div className="absolute top-3 right-3">
        {isPurchased ? (
          <span className="flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/20 px-2 py-1 text-xs font-bold text-green-400">
            <Icon name="check" />
            ADQUIRIDO
          </span>
        ) : (
          !canAfford && (
            <span className="flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/20 px-2 py-1 text-xs font-bold text-red-400">
              <Icon name="lock" />
              FALTAN MONEDAS
            </span>
          )
        )}
      </div>

      {/* Icon / Image */}
      <div className="mt-2 mb-6 flex justify-center">
        <div
          className={`h-20 w-20 rounded-2xl bg-linear-to-br ${item.color} p-0.5 shadow-lg transition-transform duration-300 group-hover:scale-110`}
        >
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-slate-900">
            {item.image ? (
              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
            ) : (
              <Icon name={item.icon} className="text-4xl text-white" />
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="text-center">
        <h3 className="mb-1 text-lg font-bold text-white transition-colors group-hover:text-cyan-400">{item.name}</h3>
        <p className="mb-4 line-clamp-2 h-10 text-sm text-slate-400">{item.description}</p>

        {/* Price Button */}
        <div
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
            isPurchased
              ? 'bg-slate-800 text-slate-400'
              : canAfford
                ? 'bg-yellow-500/10 text-yellow-400 group-hover:bg-yellow-500 group-hover:text-black'
                : 'bg-slate-800 text-slate-500'
          }`}
        >
          {isPurchased ? (
            <span>En inventario</span>
          ) : (
            <>
              <Icon name="coins" />
              {item.price}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
