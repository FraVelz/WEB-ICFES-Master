'use client';

import { useLayoutEffect, useState, type CSSProperties, type RefObject } from 'react';

type Align = 'start' | 'end' | 'stretch';

type AnchoredDropdownOptions = {
  align?: Align;
  offset?: number;
  minWidth?: number;
  maxWidth?: number;
};

export function useAnchoredDropdownStyle(
  isOpen: boolean,
  anchorRef: RefObject<HTMLElement | null> | undefined,
  options: AnchoredDropdownOptions = {}
): CSSProperties | undefined {
  const { align = 'start', offset = 4, minWidth = 0, maxWidth = 400 } = options;
  const [style, setStyle] = useState<CSSProperties | undefined>();

  useLayoutEffect(() => {
    if (!isOpen || !anchorRef?.current) {
      setStyle(undefined);
      return;
    }

    const update = () => {
      const el = anchorRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const width = Math.min(Math.max(minWidth, rect.width), maxWidth, window.innerWidth - 16);

      let left = rect.left;
      if (align === 'end') {
        left = rect.right - width;
      }

      left = Math.max(8, Math.min(left, window.innerWidth - width - 8));

      setStyle({
        position: 'fixed',
        top: rect.bottom + offset,
        left,
        width,
        zIndex: 50,
      });
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [isOpen, anchorRef, align, offset, minWidth, maxWidth]);

  return style;
}
