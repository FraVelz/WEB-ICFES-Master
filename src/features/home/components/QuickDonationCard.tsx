import { useState } from 'react';
import { Icon } from '@/shared/components/Icon';

export const QuickDonationCard = ({ isVisible = true }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isVisible) return null;

  const donationOptions = [
    { amount: 500, label: '☕ Un café', color: 'from-orange-500 to-orange-600' },
    { amount: 2000, label: '🍕 Una pizza', color: 'from-red-500 to-orange-600' },
    { amount: 5000, label: '🎮 Un juego', color: 'from-purple-500 to-pink-600' },
    { amount: 10000, label: '💻 Upgrade', color: 'from-blue-500 to-cyan-600' },
  ];

  return (
    <div className={`fixed ${isExpanded ? 'bottom-0 right-0 left-0' : 'bottom-6 right-6'} z-30 transition-all duration-300`}>
      {isExpanded ? (
        <div className="bg-linear-to-t from-slate-900 to-slate-800 rounded-t-3xl p-6 border-t border-slate-700 shadow-2xl max-w-md mx-auto md:max-w-none">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Icon name="heart" className="text-red-500" />
              Apoya nuestro proyecto
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <Icon name="times" size="lg" />
            </button>
          </div>

          <p className="text-slate-300 text-sm mb-6">
            Ayuda a estudiantes sin recursos a prepararse para el ICFES. 100% transparencia en el uso de fondos.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {donationOptions.map((option) => (
              <button
                key={option.amount}
                className={`bg-linear-to-r ${option.color} p-4 rounded-lg text-white font-bold hover:shadow-lg hover:shadow-current/50 transition-all transform hover:scale-105`}
              >
                <div className="text-sm">{option.label}</div>
                <div className="text-xs mt-1 opacity-90">${option.amount}</div>
              </button>
            ))}
          </div>

          <p className="text-xs text-slate-500 mt-4 text-center">
            También puedes aportar cantidad personalizada
          </p>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-linear-to-r from-red-500 to-pink-600 rounded-full p-4 shadow-lg hover:shadow-red-500/50 text-white font-bold flex items-center gap-2 hover:scale-110 transition-transform"
        >
          <Icon name="gift" size="lg" />
          <span className="hidden sm:inline">Donar</span>
        </button>
      )}
    </div>
  );
};
