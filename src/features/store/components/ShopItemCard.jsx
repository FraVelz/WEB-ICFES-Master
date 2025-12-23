import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faCheck, faLock } from '@fortawesome/free-solid-svg-icons';

export const ShopItemCard = ({ item, isPurchased, canAfford, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`relative group rounded-2xl border-2 p-6 transition-all duration-300 cursor-pointer overflow-hidden ${
        isPurchased
          ? 'bg-slate-900/50 border-green-500/30 hover:border-green-500/50'
          : canAfford
            ? 'bg-slate-800/40 border-slate-700 hover:border-cyan-500 hover:bg-slate-800/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10'
            : 'bg-slate-900/30 border-slate-800 opacity-70 hover:opacity-100'
      }`}
    >
      {/* Background Gradient Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

      {/* Status Badge */}
      <div className="absolute top-3 right-3">
        {isPurchased ? (
          <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 border border-green-500/30">
            <FontAwesomeIcon icon={faCheck} />
            ADQUIRIDO
          </span>
        ) : !canAfford && (
          <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 border border-red-500/30">
            <FontAwesomeIcon icon={faLock} />
            FALTAN MONEDAS
          </span>
        )}
      </div>

      {/* Icon / Image */}
      <div className="flex justify-center mb-6 mt-2">
        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} p-0.5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center overflow-hidden">
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <FontAwesomeIcon icon={item.icon} className="text-4xl text-white" />
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="text-center">
        <h3 className="font-bold text-lg text-white mb-1 group-hover:text-cyan-400 transition-colors">
          {item.name}
        </h3>
        <p className="text-sm text-slate-400 mb-4 line-clamp-2 h-10">
          {item.description}
        </p>

        {/* Price Button */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
          isPurchased
            ? 'bg-slate-800 text-slate-400'
            : canAfford
              ? 'bg-yellow-500/10 text-yellow-400 group-hover:bg-yellow-500 group-hover:text-black'
              : 'bg-slate-800 text-slate-500'
        }`}>
          {isPurchased ? (
            <span>En inventario</span>
          ) : (
            <>
              <FontAwesomeIcon icon={faCoins} />
              {item.price}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
