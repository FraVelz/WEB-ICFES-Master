import { useState } from 'react';
import { Icon } from '@/shared/components/Icon';

export const QuickDonationCard = ({ isVisible = true }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isVisible) return null;

  const donationOptions = [
    {
      amount: 500,
      label: '☕ Un café',
      color: 'from-orange-500 to-orange-600',
    },
    {
      amount: 2000,
      label: '🍕 Una pizza',
      color: 'from-red-500 to-orange-600',
    },
    {
      amount: 5000,
      label: '🎮 Un juego',
      color: 'from-purple-500 to-pink-600',
    },
    { amount: 10000, label: '💻 Upgrade', color: 'from-blue-500 to-cyan-600' },
  ];

  return (
    <div
      className={`fixed ${isExpanded ? 'right-0 bottom-0 left-0' : 'right-6 bottom-6'} z-30 transition-all duration-300`}
    >
      {isExpanded ? (
        <div className="mx-auto max-w-md rounded-t-3xl border-t border-slate-700 bg-linear-to-t from-slate-900 to-slate-800 p-6 shadow-2xl md:max-w-none">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-xl font-bold text-white">
              <Icon name="heart" className="text-red-500" />
              Apoya nuestro proyecto
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-slate-400 transition-colors hover:text-white"
            >
              <Icon name="times" size="lg" />
            </button>
          </div>

          <p className="mb-6 text-sm text-slate-300">
            Ayuda a estudiantes sin recursos a prepararse para el ICFES. 100%
            transparencia en el uso de fondos.
          </p>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {donationOptions.map((option) => (
              <button
                key={option.amount}
                className={`bg-linear-to-r ${option.color} transform rounded-lg p-4 font-bold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-current/50`}
              >
                <div className="text-sm">{option.label}</div>
                <div className="mt-1 text-xs opacity-90">${option.amount}</div>
              </button>
            ))}
          </div>

          <p className="mt-4 text-center text-xs text-slate-500">
            También puedes aportar cantidad personalizada
          </p>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 rounded-full bg-linear-to-r from-red-500 to-pink-600 p-4 font-bold text-white shadow-lg transition-transform hover:scale-110 hover:shadow-red-500/50"
        >
          <Icon name="gift" size="lg" />
          <span className="hidden sm:inline">Donar</span>
        </button>
      )}
    </div>
  );
};
