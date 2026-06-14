'use client';

import { useState } from 'react';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';

const MONTH_NAMES = [
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
const DAY_NAMES = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

type StreakCalendarProps = {
  streakHistory: string[];
};

function getDaysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function getFirstDayOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
}

export function StreakCalendar({ streakHistory }: StreakCalendarProps) {
  const [viewDate, setViewDate] = useState(new Date());

  const changeMonth = (offset: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setViewDate(newDate);
  };

  const daysInMonth = getDaysInMonth(viewDate);
  const firstDay = getFirstDayOfMonth(viewDate);

  const isStreakDay = (day: number) => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth() + 1;
    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    return streakHistory.includes(`${year}-${monthStr}-${dayStr}`);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      viewDate.getMonth() === today.getMonth() &&
      viewDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="border-surface-border bg-surface-via rounded-xl border p-3">
      <div className="mb-3 flex items-center justify-between px-1">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          aria-label="Mes anterior"
          className={cn(
            'text-on-surface-muted hover:text-on-surface cursor-pointer rounded-lg p-1 transition-colors',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            'focus-visible:ring-offset-surface-via'
          )}
        >
          <Icon name="chevron-left" size="sm" />
        </button>
        <span className="text-on-surface text-sm font-bold">
          {MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}
        </span>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          aria-label="Mes siguiente"
          className={cn(
            'text-on-surface-muted hover:text-on-surface cursor-pointer rounded-lg p-1 transition-colors',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            'focus-visible:ring-offset-surface-via'
          )}
        >
          <Icon name="chevron-right" size="sm" />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1 text-center">
        {DAY_NAMES.map((d, i) => (
          <div key={i} className="text-on-surface-muted py-1 text-xs font-medium">
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
                  : 'text-on-surface-muted hover:bg-surface-overlay',
                today && !active && 'border-surface-border text-on-surface border'
              )}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
