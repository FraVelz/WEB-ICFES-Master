'use client';

import { useEffect, type RefObject } from 'react';

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type DialogA11yOptions = {
  /** Bloquea scroll del documento mientras el diálogo está abierto (por defecto true). */
  lockScroll?: boolean;
};

/** Escape, scroll lock, focus trap y restauración de foco para diálogos. */
export function useDialogA11y(
  isOpen: boolean,
  onClose: () => void,
  containerRef?: RefObject<HTMLElement | null>,
  options?: DialogA11yOptions
) {
  const lockScroll = options?.lockScroll ?? true;

  useEffect(() => {
    if (!isOpen) return;

    const previousActive = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    if (lockScroll) {
      document.body.style.overflow = 'hidden';
    }

    const getFocusable = () => {
      const root = containerRef?.current ?? (containerRef === undefined ? document.body : null);
      if (!root) return [];

      return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = getFocusable();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    const focusFirst = () => {
      const focusable = getFocusable();
      focusable[0]?.focus();
    };

    const rafIds: number[] = [];
    if (containerRef) {
      rafIds.push(
        requestAnimationFrame(() => {
          rafIds.push(requestAnimationFrame(focusFirst));
        })
      );
    } else {
      rafIds.push(requestAnimationFrame(focusFirst));
    }

    return () => {
      rafIds.forEach((id) => cancelAnimationFrame(id));
      if (lockScroll) {
        document.body.style.overflow = previousOverflow;
      }
      document.removeEventListener('keydown', onKeyDown);
      previousActive?.focus?.();
    };
  }, [isOpen, onClose, containerRef, lockScroll]);
}
