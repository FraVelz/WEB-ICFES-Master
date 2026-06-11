'use client';

import { cn } from '@/utils/cn';
import { useDialogA11y } from '@/shared/hooks/useDialogA11y';

type ModalOverlayProps = {
  onClose: () => void;
  className?: string;
  /** Cuando false, no bloquea scroll ni escucha Escape (overlay decorativo). */
  active?: boolean;
};

/** Backdrop clickeable para cerrar modales y dropdowns. */
export function ModalOverlay({ onClose, className, active = true }: ModalOverlayProps) {
  useDialogA11y(active, onClose);

  return (
    <div className={cn('fixed inset-0 z-40', className)} onClick={onClose} aria-hidden="true" role="presentation" />
  );
}
