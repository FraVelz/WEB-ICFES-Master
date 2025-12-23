import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faTimes, faShoppingCart, faSpinner, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export const ShopItemModal = ({ item, isOpen, onClose, onBuy, processing, canAfford, isPurchased }) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative animate-scaleIn">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white flex items-center justify-center transition-colors z-10"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        {/* Header Image */}
        <div className={`h-32 bg-gradient-to-br ${item.color} relative flex items-center justify-center`}>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="w-24 h-24 rounded-2xl bg-slate-900 p-1 shadow-2xl translate-y-8 relative z-10">
            <div className="w-full h-full rounded-xl overflow-hidden flex items-center justify-center bg-slate-800">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <FontAwesomeIcon icon={item.icon} className="text-4xl text-white" />
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-12 pb-8 px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">{item.name}</h2>
          <div className="inline-block px-3 py-1 rounded-full bg-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            {item.category === 'powerup' ? 'Consumible' : 'Cosmético'}
          </div>
          
          <p className="text-slate-300 mb-8 leading-relaxed">
            {item.description}
          </p>

          {/* Action Button */}
          {isPurchased && item.category !== 'powerup' ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center justify-center gap-3 text-green-400 font-bold">
              <FontAwesomeIcon icon={faCheckCircle} className="text-xl" />
              <span>¡Ya tienes este artículo!</span>
            </div>
          ) : (
            <button
              onClick={() => onBuy(item)}
              disabled={!canAfford || processing}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                processing 
                  ? 'bg-slate-700 text-slate-400 cursor-wait'
                  : canAfford
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transform hover:-translate-y-0.5'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {processing ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  Procesando...
                </>
              ) : canAfford ? (
                <>
                  <span>Comprar por</span>
                  <span className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded-lg">
                    <FontAwesomeIcon icon={faCoins} /> {item.price}
                  </span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faLock} />
                  Insuficientes Monedas ({item.price})
                </>
              )}
            </button>
          )}
          
          {!canAfford && !isPurchased && (
            <p className="text-red-400 text-sm mt-3 font-medium">
              Te faltan {item.price - (canAfford ? 0 : 999999)} monedas para comprar esto.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
