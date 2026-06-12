'use client';

import { cn } from '@/utils/cn';
import { deferAfterPointer } from '@/utils/deferAfterPointer';

type ModalOverlayProps = {
  onClose: () => void;
  className?: string;
};

/** Backdrop clickeable para cerrar modales. El focus trap vive en el panel `role="dialog"`. */
export function ModalOverlay({ onClose, className }: ModalOverlayProps) {
  return (
    <div
      role="presentation"
      className={cn('fixed inset-0 z-40 cursor-default', className)}
      onClick={() => deferAfterPointer(onClose)}
    />
  );
}
