'use client';

import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { ModalOverlay } from '@/shared/components/ModalOverlay';
import { useDialogA11y } from '@/shared/hooks/useDialogA11y';
import { useGSAPModalEntrance } from '@/hooks/useGSAPModalEntrance';
import { getRoadmapPanelClassName, useAnchoredDropdownStyle } from './useAnchoredDropdownStyle';
import { RoadmapBottomSheetHandle } from './RoadmapBottomSheetHandle';
import type { PathSection } from '@/features/learning/roadmap/AreaPath';
import { getStageLabel } from './sectionStageUtils';
import type { RefObject } from 'react';

export interface SectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSection: (sectionId: string) => void;
  currentSectionId: string;
  sections: PathSection[];
  areaColorClass: string;
  anchorRef?: RefObject<HTMLElement | null>;
}

export const SectionsModal = ({
  isOpen,
  onClose,
  onSelectSection,
  currentSectionId,
  sections,
  areaColorClass,
  anchorRef,
}: SectionsModalProps) => {
  const { style: panelStyle, isBottomSheet } = useAnchoredDropdownStyle(isOpen, anchorRef, {
    align: 'stretch',
    minWidth: 280,
    maxWidth: 480,
  });

  const dropdownRef = useGSAPModalEntrance({
    isOpen,
    type: isBottomSheet ? 'slideUp' : 'slideFromTop',
    duration: isBottomSheet ? 0.3 : 0.2,
  });

  useDialogA11y(isOpen, onClose, dropdownRef);

  if (!isOpen) return null;

  const usePortal = Boolean(anchorRef) || isBottomSheet;

  const panel = (
    <div
      ref={dropdownRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sections-modal-title"
      style={usePortal ? panelStyle : undefined}
      className={getRoadmapPanelClassName(isBottomSheet, Boolean(anchorRef))}
    >
      {isBottomSheet && <RoadmapBottomSheetHandle />}
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between border-b border-surface-border pb-2">
          <h3 id="sections-modal-title" className="text-sm font-bold tracking-wider text-on-surface-muted uppercase">
            Fases del curso
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className={cn(
              'cursor-pointer rounded-lg p-1 text-on-surface-muted transition-colors hover:text-white',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
              'focus-visible:ring-offset-2',
              'focus-visible:ring-offset-surface-elevated'
            )}
          >
            <Icon name="times" />
          </button>
        </div>

        <div className="max-h-[60vh] space-y-2 overflow-y-auto">
          {sections.map((section) => {
            const isActive = section.id === currentSectionId;
            return (
              <button
                type="button"
                key={section.id}
                onClick={() => {
                  onSelectSection(section.id);
                  onClose();
                }}
                className={cn(
                  'flex w-full cursor-pointer flex-col items-start gap-1 rounded-xl px-4 py-3 text-left transition-all',
                  'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
              'focus-visible:ring-offset-2',
                  'focus-visible:ring-offset-surface-via',
                  isActive
                    ? ['bg-linear-to-r text-white shadow-lg', areaColorClass]
                    : 'bg-surface-overlay/50 text-on-surface-muted hover:bg-surface-overlay'
                )}
              >
                <span
                  className={cn(
                    'text-xs font-bold tracking-wider uppercase',
                    isActive ? 'text-white/80' : 'text-on-surface-muted'
                  )}
                >
                  {getStageLabel(section.id)}
                </span>
                <span className="text-sm font-semibold">{section.title}</span>
                <span className={cn('text-xs', isActive ? 'text-white/70' : 'text-on-surface-muted')}>
                  {section.description}
                </span>
              </button>
            );
          })}
        </div>
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
