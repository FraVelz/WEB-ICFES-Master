'use client';

import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { ModalOverlay } from '@/shared/components/ModalOverlay';
import { useDialogA11y } from '@/shared/hooks/useDialogA11y';
import { AREA_INFO } from '@/shared/constants';
import { useGSAPModalEntrance } from '@/hooks/useGSAPModalEntrance';
import {
  getRoadmapPanelClassName,
  ROADMAP_SHEET_OVERLAY_Z_CLASS,
  useAnchoredDropdownStyle,
} from './useAnchoredDropdownStyle';
import { RoadmapBottomSheetHandle } from './RoadmapBottomSheetHandle';
import type { RefObject } from 'react';

export interface AreasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArea: (area: string) => void;
  currentArea: string;
  anchorRef?: RefObject<HTMLElement | null>;
}

export const AreasModal = ({ isOpen, onClose, onSelectArea, currentArea, anchorRef }: AreasModalProps) => {
  const { style: panelStyle, isBottomSheet } = useAnchoredDropdownStyle(isOpen, anchorRef, {
    align: 'stretch',
    minWidth: 280,
    maxWidth: 360,
  });

  const dropdownRef = useGSAPModalEntrance({
    isOpen,
    type: isBottomSheet ? 'slideUp' : 'slideFromTop',
    duration: isBottomSheet ? 0.3 : 0.2,
  });

  useDialogA11y(isOpen, onClose, dropdownRef);

  if (!isOpen) return null;

  const areas = Object.entries(AREA_INFO);
  const usePortal = Boolean(anchorRef) || isBottomSheet;

  const panel = (
    <div
      ref={dropdownRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="areas-modal-title"
      style={usePortal ? panelStyle : undefined}
      className={getRoadmapPanelClassName(isBottomSheet, Boolean(anchorRef))}
    >
      {isBottomSheet && <RoadmapBottomSheetHandle />}
      <div className="p-4">
        <div className="border-surface-border mb-3 flex items-center justify-between border-b pb-2">
          <h3 id="areas-modal-title" className="text-on-surface-muted text-sm font-bold tracking-wider uppercase">
            Mis Cursos
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className={cn(
              'text-on-surface-muted cursor-pointer rounded-lg p-1 transition-colors hover:text-white',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
              'focus-visible:ring-offset-surface-elevated focus-visible:ring-offset-2'
            )}
          >
            <Icon name="times" />
          </button>
        </div>

        <div className={cn('space-y-2 overflow-y-auto', isBottomSheet ? 'max-h-[60vh]' : 'max-h-[60vh]')}>
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
                'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
                'focus-visible:ring-offset-surface-via focus-visible:ring-offset-2',
                currentArea === areaKey
                  ? ['bg-linear-to-r text-white shadow-lg', areaData.color]
                  : 'bg-surface-overlay/50 text-on-surface-muted hover:bg-surface-overlay'
              )}
            >
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg',
                  currentArea === areaKey ? 'bg-white/20' : 'bg-on-surface-muted/50'
                )}
              >
                <Icon
                  name={areaData.icon ?? 'book'}
                  className={currentArea === areaKey ? 'text-white' : 'text-on-surface-muted'}
                />
              </div>
              <span className="text-left text-sm font-semibold">{areaData.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (usePortal && typeof document !== 'undefined') {
    return createPortal(
      <>
        <ModalOverlay onClose={onClose} className={usePortal ? ROADMAP_SHEET_OVERLAY_Z_CLASS : undefined} />
        {panel}
      </>,
      document.body
    );
  }

  return (
    <>
      <ModalOverlay onClose={onClose} className={usePortal ? ROADMAP_SHEET_OVERLAY_Z_CLASS : undefined} />
      {panel}
    </>
  );
};
