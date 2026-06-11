'use client';

import { cn } from '@/utils/cn';

type ModalOverlayProps = {
  onClose: () => void;
  className?: string;
};

/** Backdrop clickeable para cerrar modales. El focus trap vive en el panel `role="dialog"`. */
export function ModalOverlay({ onClose, className }: ModalOverlayProps) {
  return (
    <button
      type="button"
      tabIndex={-1}
      className={cn('fixed inset-0 z-40 cursor-default border-0 bg-transparent p-0', className)}
      onClick={onClose}
      aria-label="Cerrar"
    />
  );
}
