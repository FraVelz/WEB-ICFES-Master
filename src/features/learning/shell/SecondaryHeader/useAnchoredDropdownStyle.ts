'use client';

import { useLayoutEffect, useState, type CSSProperties, type RefObject } from 'react';

type Align = 'start' | 'end' | 'stretch';

/** Mismo breakpoint que `lg:` de Tailwind (sidebar / layout escritorio). */
const MOBILE_BOTTOM_SHEET_MQ = '(max-width: 1023px)';

function isMobileBottomSheetViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(MOBILE_BOTTOM_SHEET_MQ).matches;
}

type AnchoredDropdownOptions = {
  align?: Align;
  offset?: number;
  minWidth?: number;
  maxWidth?: number;
  /** En móvil abre como hoja inferior (Duolingo). Default: true */
  bottomSheetOnMobile?: boolean;
};

export type AnchoredPanelStyle = {
  style: CSSProperties | undefined;
  isBottomSheet: boolean;
};

/** Por encima del FAB del chat (`z-90`) y del nav móvil (`z-40`–`z-50`). */
export const ROADMAP_SHEET_Z_INDEX = 95;
export const ROADMAP_SHEET_OVERLAY_Z_CLASS = 'z-94';

const BOTTOM_SHEET_STYLE: CSSProperties = {
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  maxHeight: 'min(85vh, 32rem)',
  zIndex: ROADMAP_SHEET_Z_INDEX,
};

export function useAnchoredDropdownStyle(
  isOpen: boolean,
  anchorRef: RefObject<HTMLElement | null> | undefined,
  options: AnchoredDropdownOptions = {}
): AnchoredPanelStyle {
  const { align = 'start', offset = 4, minWidth = 0, maxWidth = 400, bottomSheetOnMobile = true } = options;
  const [result, setResult] = useState<AnchoredPanelStyle>({ style: undefined, isBottomSheet: false });

  useLayoutEffect(() => {
    if (!isOpen) {
      setResult({ style: undefined, isBottomSheet: false });
      return;
    }

    const update = () => {
      if (bottomSheetOnMobile && isMobileBottomSheetViewport()) {
        setResult({ style: BOTTOM_SHEET_STYLE, isBottomSheet: true });
        return;
      }

      const el = anchorRef?.current;
      if (!el) {
        setResult({ style: undefined, isBottomSheet: false });
        return;
      }

      const rect = el.getBoundingClientRect();
      const width = Math.min(Math.max(minWidth, rect.width), maxWidth, window.innerWidth - 16);

      let left = rect.left;
      if (align === 'end') {
        left = rect.right - width;
      }

      left = Math.max(8, Math.min(left, window.innerWidth - width - 8));

      setResult({
        style: {
          position: 'fixed',
          top: rect.bottom + offset,
          left,
          width,
          zIndex: ROADMAP_SHEET_Z_INDEX,
        },
        isBottomSheet: false,
      });
    };

    update();

    const mq = window.matchMedia(MOBILE_BOTTOM_SHEET_MQ);
    mq.addEventListener('change', update);
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);

    return () => {
      mq.removeEventListener('change', update);
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [isOpen, anchorRef, align, offset, minWidth, maxWidth, bottomSheetOnMobile]);

  return result;
}

export function getRoadmapPanelClassName(isBottomSheet: boolean, hasAnchor: boolean, alignRight = false) {
  if (isBottomSheet) {
    return (
      'max-h-[min(85vh,32rem)] overflow-y-auto rounded-t-2xl border border-surface-border border-b-0 ' +
      'bg-surface-elevated shadow-2xl pb-[env(safe-area-inset-bottom,0px)]'
    );
  }

  if (hasAnchor) {
    return 'max-h-[min(70vh,32rem)] overflow-y-auto rounded-2xl border border-surface-border bg-surface-elevated shadow-2xl';
  }

  const anchoredPanel =
    'absolute top-full z-50 w-full rounded-b-2xl border-x border-b border-surface-border ' +
    'bg-surface-elevated shadow-2xl sm:w-80';

  return alignRight ? `${anchoredPanel} right-0` : `${anchoredPanel} left-0`;
}
