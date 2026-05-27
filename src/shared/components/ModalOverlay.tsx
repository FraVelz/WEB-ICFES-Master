import { cn } from '@/utils/cn';

type ModalOverlayProps = {
  onClose: () => void;
  className?: string;
};

/** Backdrop clickeable para cerrar modales y dropdowns. */
export function ModalOverlay({ onClose, className }: ModalOverlayProps) {
  return <div className={cn('fixed inset-0 z-40', className)} onClick={onClose} aria-hidden="true" />;
}
