'use client';

import { type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { ModalOverlay } from '@/shared/components/ModalOverlay';
import { useDialogA11y } from '@/shared/hooks/useDialogA11y';
import { useGSAPModalEntrance } from '@/hooks/useGSAPModalEntrance';
import { getRoadmapPanelClassName, useAnchoredDropdownStyle } from './useAnchoredDropdownStyle';
import { RoadmapBottomSheetHandle } from './RoadmapBottomSheetHandle';
import { StreakCalendar } from './StreakCalendar';

export interface StreakData {
  currentStreak?: number;
  longestStreak?: number;
  streakHistory?: string[];
  isBadgeUnlocked?: boolean;
  daysUntilBadge?: number;
}

export interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  streakData?: StreakData | null;
  anchorRef?: RefObject<HTMLElement | null>;
}

export const StreakModal = ({ isOpen, onClose, streakData, anchorRef }: StreakModalProps) => {
  const { style: panelStyle, isBottomSheet } = useAnchoredDropdownStyle(isOpen, anchorRef, {
    align: 'end',
    minWidth: 280,
    maxWidth: 320,
  });

  const dropdownRef = useGSAPModalEntrance({
    isOpen,
    type: isBottomSheet ? 'slideUp' : 'slideFromTop',
    duration: isBottomSheet ? 0.3 : 0.2,
  });

  useDialogA11y(isOpen, onClose, dropdownRef);

  const { currentStreak = 0, longestStreak = 0, streakHistory = [] } = streakData || {};

  if (!isOpen) return null;

  const usePortal = Boolean(anchorRef) || isBottomSheet;

  const panel = (
    <div
      ref={dropdownRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="streak-modal-title"
      style={usePortal ? panelStyle : undefined}
      className={getRoadmapPanelClassName(isBottomSheet, Boolean(anchorRef), true)}
    >
      {isBottomSheet && <RoadmapBottomSheetHandle />}
      <div className="p-4">
        <div className="border-surface-border mb-4 flex items-center justify-between border-b pb-3">
          <h2
            id="streak-modal-title"
            className="text-on-surface-muted flex items-center gap-2 text-sm font-bold tracking-wider uppercase"
          >
            <Icon name="fire" className="text-orange-400" />
            Mi Racha
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className={cn(
              'text-on-surface-muted cursor-pointer rounded-lg p-1 transition-colors hover:text-white',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2',
              'focus-visible:outline-none',
              'focus-visible:ring-offset-surface-elevated'
            )}
          >
            <Icon name="times" />
          </button>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="border-surface-border bg-surface-overlay/50 rounded-xl border p-4 text-center">
            <div className="mb-1 text-3xl font-bold text-orange-500">{currentStreak}</div>
            <div className="text-on-surface-muted text-xs font-medium uppercase">Racha Actual</div>
          </div>
          <div className="border-surface-border bg-surface-overlay/50 rounded-xl border p-4 text-center">
            <div className="mb-1 text-3xl font-bold text-yellow-500">{longestStreak}</div>
            <div className="text-on-surface-muted text-xs font-medium uppercase">Mejor Racha</div>
          </div>
        </div>

        <StreakCalendar streakHistory={streakHistory} />

        <p className="text-on-surface-muted mt-4 text-center text-xs">¡Practica cada día para mantener tu racha!</p>
      </div>
    </div>
  );

  if (usePortal && typeof document !== 'undefined') {
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
