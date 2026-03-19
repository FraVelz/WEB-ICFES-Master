'use client';

import { useState } from 'react';
import { Icon } from '@/shared/components/Icon';
import { useGSAPModalEntrance } from '@/hooks/useGSAPModalEntrance';

/**
 * Dropdown que muestra información detallada de la racha con mini-calendario
 */
export const StreakModal = ({ isOpen, onClose, streakData }) => {
  const dropdownRef = useGSAPModalEntrance({
    isOpen,
    type: 'slideFromTop',
    duration: 0.2,
  });

  if (!isOpen) return null;

  const {
    currentStreak = 0,
    longestStreak = 0,
    streakHistory = [],
  } = streakData || {};
  const [viewDate, setViewDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    // 0 = Domingo, 1 = Lunes, ...
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const changeMonth = (offset) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setViewDate(newDate);
  };

  const daysInMonth = getDaysInMonth(viewDate);
  const firstDay = getFirstDayOfMonth(viewDate); // 0 (Sun) - 6 (Sat)

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

  const isStreakDay = (day) => {
    // Construir fecha local para comparar
    // Nota: streakHistory son strings YYYY-MM-DD
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth() + 1; // 1-12
    const monthStr = month < 10 ? `0${month}` : month;
    const dayStr = day < 10 ? `0${day}` : day;
    const dateStr = `${year}-${monthStr}-${dayStr}`;

    return streakHistory.includes(dateStr);
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      viewDate.getMonth() === today.getMonth() &&
      viewDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div
        ref={dropdownRef}
        className="absolute top-full right-0 z-50 w-full rounded-b-2xl border-x border-b border-slate-700 bg-slate-900 shadow-2xl sm:w-80"
      >
        <div className="p-4">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="flex items-center gap-2 text-sm font-bold tracking-wider text-slate-400 uppercase">
              <Icon name="fire" className="text-orange-400" />
              Mi Racha
            </h2>
            <button
              onClick={onClose}
              className="cursor-pointer text-slate-500 hover:text-white"
            >
              <Icon name="times" />
            </button>
          </div>

          {/* Big Number */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-center">
              <div className="mb-1 text-3xl font-bold text-orange-500">
                {currentStreak}
              </div>
              <div className="text-xs font-medium text-slate-400 uppercase">
                Racha Actual
              </div>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-center">
              <div className="mb-1 text-3xl font-bold text-yellow-500">
                {longestStreak}
              </div>
              <div className="text-xs font-medium text-slate-400 uppercase">
                Mejor Racha
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
            {/* Calendar Header */}
            <div className="mb-3 flex items-center justify-between px-1">
              <button
                onClick={() => changeMonth(-1)}
                className="cursor-pointer p-1 text-slate-500 hover:text-white"
              >
                <Icon name="chevron-left" size="sm" />
              </button>
              <span className="text-sm font-bold text-slate-200">
                {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
              </span>
              <button
                onClick={() => changeMonth(1)}
                className="cursor-pointer p-1 text-slate-500 hover:text-white"
              >
                <Icon name="chevron-right" size="sm" />
              </button>
            </div>

            {/* Days Grid */}
            <div className="mb-1 grid grid-cols-7 gap-1 text-center">
              {dayNames.map((d, i) => (
                <div
                  key={i}
                  className="py-1 text-xs font-medium text-slate-500"
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {/* Empty slots for start of month */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {/* Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const active = isStreakDay(day);
                const today = isToday(day);

                return (
                  <div
                    key={day}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      active
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                        : 'text-slate-400 hover:bg-slate-800'
                    } ${today && !active ? 'border border-slate-600 text-slate-200' : ''} `}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-slate-500">
            ¡Practica cada día para mantener tu racha!
          </p>
        </div>
      </div>
    </>
  );
};
