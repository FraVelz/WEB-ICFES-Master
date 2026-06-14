'use client';

import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { ModalOverlay } from '@/shared/components/ModalOverlay';
import { useDialogA11y } from '@/shared/hooks/useDialogA11y';
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

  useDialogA11y(isOpen, onClose, dropdownRef);

  if (!isOpen) return null;

  return (
    <>
      <ModalOverlay onClose={onClose} />

      <div
        ref={dropdownRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="coins-modal-title"
        className={cn(
          'border-surface-border absolute top-full right-0 z-50 w-full rounded-b-2xl border-x border-b',
          'bg-surface-elevated shadow-2xl sm:w-80'
        )}
      >
        <div className="p-4">
          <div className="border-surface-border mb-4 flex items-center justify-between border-b pb-3">
            <h2
              id="coins-modal-title"
              className="text-on-surface-muted flex items-center gap-2 text-sm font-bold tracking-wider uppercase"
            >
              <Icon name="coins" className="text-yellow-400" />
              Mis Monedas
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className={cn(
                'text-on-surface-muted hover:text-on-surface cursor-pointer rounded-lg p-1 transition-colors',
                'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
                'focus-visible:ring-offset-2',
                'focus-visible:ring-offset-surface-elevated'
              )}
            >
              <Icon name="times" />
            </button>
          </div>

          <div className="border-surface-border bg-surface-overlay/50 rounded-xl border p-4 text-center">
            <div className="mb-1 text-4xl font-bold text-yellow-400">{coins}</div>
            <div className="text-on-surface-muted text-sm font-medium">Monedas disponibles</div>
          </div>
        </div>
      </div>
    </>
  );
};
