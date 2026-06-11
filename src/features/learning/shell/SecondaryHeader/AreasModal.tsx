'use client';

import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { ModalOverlay } from '@/shared/components/ModalOverlay';
import { AREA_INFO } from '@/shared/constants';
import { useGSAPModalEntrance } from '@/hooks/useGSAPModalEntrance';
import { useAnchoredDropdownStyle } from './useAnchoredDropdownStyle';
import type { RefObject } from 'react';

export interface AreasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArea: (area: string) => void;
  currentArea: string;
  /** Ancla el dropdown debajo del selector (portal + fixed). */
  anchorRef?: RefObject<HTMLElement | null>;
}

export const AreasModal = ({ isOpen, onClose, onSelectArea, currentArea, anchorRef }: AreasModalProps) => {
  const dropdownRef = useGSAPModalEntrance({
    isOpen,
    type: 'slideFromTop',
    duration: 0.2,
  });

  const anchoredStyle = useAnchoredDropdownStyle(isOpen, anchorRef, {
    align: 'stretch',
    minWidth: 280,
    maxWidth: 360,
  });

  if (!isOpen) return null;

  const areas = Object.entries(AREA_INFO);

  const panel = (
    <div
      ref={dropdownRef}
      style={anchorRef ? anchoredStyle : undefined}
      className={cn(
        'rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl',
        anchorRef ? 'max-h-[min(70vh,32rem)] overflow-y-auto' : 'absolute top-full left-0 z-50 w-full sm:w-80',
        !anchorRef && 'rounded-b-2xl border-x border-b'
      )}
    >
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase">Mis Cursos</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className={cn(
              'cursor-pointer rounded-lg p-1 text-slate-500 transition-colors hover:text-white',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              'focus-visible:ring-offset-slate-900'
            )}
          >
            <Icon name="times" />
          </button>
        </div>

        <div className="max-h-[60vh] space-y-2 overflow-y-auto">
          {areas.map(([areaKey, areaData]: [string, { name?: string; color?: string; icon?: string }]) => (
            <button
              type="button"
              key={areaKey}
              onClick={() => {
                onSelectArea(areaKey);
                onClose();
              }}
              className={cn(
                'flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 transition-all',
                'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                'focus-visible:ring-offset-slate-950',
                currentArea === areaKey
                  ? ['bg-linear-to-r text-white shadow-lg', areaData.color]
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'
              )}
            >
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg',
                  currentArea === areaKey ? 'bg-white/20' : 'bg-slate-700/50'
                )}
              >
                <Icon
                  name={areaData.icon ?? 'book'}
                  className={currentArea === areaKey ? 'text-white' : 'text-slate-400'}
                />
              </div>
              <span className="text-left text-sm font-semibold">{areaData.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (anchorRef && typeof document !== 'undefined') {
    return createPortal(
      <>
        <ModalOverlay onClose={onClose} />
        {panel}
      </>,
      document.body
    );
  }

  return (
    <>
      <ModalOverlay onClose={onClose} />
      {panel}
    </>
  );
};
