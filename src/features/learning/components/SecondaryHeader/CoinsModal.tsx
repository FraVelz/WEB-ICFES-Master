'use client';

import { Icon } from '@/shared/components/Icon';
import { useGSAPModalEntrance } from '@/hooks/useGSAPModalEntrance';

export interface CoinsModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins?: number;
}

/**
 * Dropdown que muestra el dinero virtual
 */
export const CoinsModal = ({ isOpen, onClose, coins = 0 }: CoinsModalProps) => {
  const dropdownRef = useGSAPModalEntrance({
    isOpen,
    type: 'slideFromTop',
    duration: 0.2,
  });

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div
        ref={dropdownRef}
        className="absolute top-full right-0 z-50 w-full rounded-b-2xl border-x border-b border-slate-700 bg-slate-900 shadow-2xl sm:w-80"
      >
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="flex items-center gap-2 text-sm font-bold tracking-wider text-slate-400 uppercase">
              <Icon name="coins" className="text-yellow-400" />
              Mis Monedas
            </h2>
            <button
              onClick={onClose}
              className="cursor-pointer text-slate-500 hover:text-white"
            >
              <Icon name="times" />
            </button>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-center">
            <div className="mb-1 text-4xl font-bold text-yellow-400">
              {coins}
            </div>
            <div className="text-sm font-medium text-slate-400">
              Monedas disponibles
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
