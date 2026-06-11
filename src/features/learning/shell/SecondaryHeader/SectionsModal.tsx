'use client';

import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { ModalOverlay } from '@/shared/components/ModalOverlay';
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

  if (!isOpen) return null;

  const usePortal = Boolean(anchorRef) || isBottomSheet;

  const panel = (
    <div
      ref={dropdownRef}
      style={usePortal ? panelStyle : undefined}
      className={getRoadmapPanelClassName(isBottomSheet, Boolean(anchorRef))}
    >
      {isBottomSheet && <RoadmapBottomSheetHandle />}
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase">Etapas del curso</h3>
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
                  'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                  'focus-visible:ring-offset-slate-950',
                  isActive
                    ? ['bg-linear-to-r text-white shadow-lg', areaColorClass]
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'
                )}
              >
                <span
                  className={cn(
                    'text-xs font-bold tracking-wider uppercase',
                    isActive ? 'text-white/80' : 'text-slate-500'
                  )}
                >
                  {getStageLabel(section.id)}
                </span>
                <span className="text-sm font-semibold">{section.title}</span>
                <span className={cn('text-xs', isActive ? 'text-white/70' : 'text-slate-500')}>
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
