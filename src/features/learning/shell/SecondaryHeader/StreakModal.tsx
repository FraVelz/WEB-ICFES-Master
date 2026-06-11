'use client';

import { useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { ModalOverlay } from '@/shared/components/ModalOverlay';
import { useGSAPModalEntrance } from '@/hooks/useGSAPModalEntrance';
import { getRoadmapPanelClassName, useAnchoredDropdownStyle } from './useAnchoredDropdownStyle';
import { RoadmapBottomSheetHandle } from './RoadmapBottomSheetHandle';

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

  const { currentStreak = 0, longestStreak = 0, streakHistory = [] } = streakData || {};
  const [viewDate, setViewDate] = useState(new Date());

  if (!isOpen) return null;

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const changeMonth = (offset: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setViewDate(newDate);
  };

  const daysInMonth = getDaysInMonth(viewDate);
  const firstDay = getFirstDayOfMonth(viewDate);

  const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  const dayNames = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  const isStreakDay = (day: number) => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth() + 1;
    const monthStr = month < 10 ? `0${month}` : month;
    const dayStr = day < 10 ? `0${day}` : day;
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    return streakHistory.includes(dateStr);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      viewDate.getMonth() === today.getMonth() &&
      viewDate.getFullYear() === today.getFullYear()
    );
  };

  const usePortal = Boolean(anchorRef) || isBottomSheet;

  const panel = (
    <div
      ref={dropdownRef}
      style={usePortal ? panelStyle : undefined}
      className={getRoadmapPanelClassName(isBottomSheet, Boolean(anchorRef), true)}
    >
      {isBottomSheet && <RoadmapBottomSheetHandle />}
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="flex items-center gap-2 text-sm font-bold tracking-wider text-slate-400 uppercase">
            <Icon name="fire" className="text-orange-400" />
            Mi Racha
          </h2>
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

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-center">
            <div className="mb-1 text-3xl font-bold text-orange-500">{currentStreak}</div>
            <div className="text-xs font-medium text-slate-400 uppercase">Racha Actual</div>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-center">
            <div className="mb-1 text-3xl font-bold text-yellow-500">{longestStreak}</div>
            <div className="text-xs font-medium text-slate-400 uppercase">Mejor Racha</div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
          <div className="mb-3 flex items-center justify-between px-1">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              aria-label="Mes anterior"
              className={cn(
                'cursor-pointer rounded-lg p-1 text-slate-500 transition-colors hover:text-white',
                'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                'focus-visible:ring-offset-slate-950'
              )}
            >
              <Icon name="chevron-left" size="sm" />
            </button>
            <span className="text-sm font-bold text-slate-200">
              {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              aria-label="Mes siguiente"
              className={cn(
                'cursor-pointer rounded-lg p-1 text-slate-500 transition-colors hover:text-white',
                'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                'focus-visible:ring-offset-slate-950'
              )}
            >
              <Icon name="chevron-right" size="sm" />
            </button>
          </div>

          <div className="mb-1 grid grid-cols-7 gap-1 text-center">
            {dayNames.map((d, i) => (
              <div key={i} className="py-1 text-xs font-medium text-slate-500">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const active = isStreakDay(day);
              const today = isToday(day);

              return (
                <div
                  key={day}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all',
                    active
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                      : 'text-slate-400 hover:bg-slate-800',
                    today && !active && 'border border-slate-600 text-slate-200'
                  )}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">¡Practica cada día para mantener tu racha!</p>
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
