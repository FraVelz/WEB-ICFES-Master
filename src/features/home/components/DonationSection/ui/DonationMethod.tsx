import { Icon } from '@/shared/components/Icon';

import { paymentMethods } from '../paymentMethods';
import type { selectedAmountType } from '../types';

export const DonationMethod = ({
  selectedAmount,
  customAmount,
  selectedMethod,
  setSelectedMethod,
  handleAmountSelect,
  handleCustomAmountChange,
}: {
  selectedAmount: string;
  customAmount: string;
  selectedMethod: string;
  setSelectedMethod: React.Dispatch<React.SetStateAction<string>>;
  handleAmountSelect: (amount: selectedAmountType) => void;
  handleCustomAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="space-y-8 md:col-span-7">
      {/* Selector de Monto */}
      <div>
        <label className="mb-3 block text-sm font-medium tracking-wider text-gray-400 uppercase">
          1. Elige un monto de apoyo
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(['2000', '5000', '10000'] as selectedAmountType[]).map((amount) => (
            <button
              key={amount}
              onClick={() => handleAmountSelect(amount)}
              className={`cursor-pointer rounded-xl border px-2 py-3 text-sm font-semibold transition-all duration-200 ${
                selectedAmount === amount
                  ? 'scale-105 transform border-purple-500 bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                  : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              ${amount.toLocaleString()}
            </button>
          ))}
          <div className="relative">
            <button
              onClick={() => handleAmountSelect('custom')}
              className={`h-full w-full cursor-pointer rounded-xl border px-2 py-3 text-sm font-semibold transition-all duration-200 ${
                selectedAmount === 'custom'
                  ? 'border-purple-500 bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                  : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              Otro
            </button>
          </div>
        </div>
        {selectedAmount === 'custom' && (
          <div className="animate-fadeIn mt-3">
            <div className="relative">
              <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="text"
                value={customAmount}
                onChange={handleCustomAmountChange}
                placeholder="Ingresa el valor (COP)"
                className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pr-4 pl-8 text-white placeholder-gray-500 transition-all focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Selector de Método */}
      <div>
        <label className="mb-3 block text-sm font-medium tracking-wider text-gray-400 uppercase">
          2. Elige el medio de donación
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`group relative cursor-pointer rounded-xl border p-4 text-left transition-all duration-200 ${
                selectedMethod === method.id
                  ? 'border-purple-500 bg-white/10 ring-1 ring-purple-500/50'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              } ${method.highlight ? 'sm:col-span-2' : ''}`}
            >
              {method.highlight && (
                <div className="absolute -top-3 -right-2 rotate-3 transform rounded-full bg-linear-to-r from-yellow-400 to-orange-500 px-2 py-1 text-[10px] font-bold text-black shadow-lg">
                  RECOMENDADO
                </div>
              )}
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    method.highlight ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-gray-300'
                  }`}
                >
                  <Icon name={method.icon} className="text-lg" />
                </div>
                <div>
                  <h4 className={`font-bold ${selectedMethod === method.id ? 'text-white' : 'text-gray-300'}`}>
                    {method.name}
                  </h4>
                  <p className="text-xs text-gray-400">{method.info}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
