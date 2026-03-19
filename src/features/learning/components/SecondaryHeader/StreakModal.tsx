import { useState } from 'react';
import { Icon } from '@/shared/components/Icon';

/**
 * Dropdown que muestra información detallada de la racha con mini-calendario
 */
export const StreakModal = ({ isOpen, onClose, streakData }) => {
  if (!isOpen) return null;

  const { currentStreak = 0, longestStreak = 0, streakHistory = [] } = streakData || {};
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
  
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const dayNames = ["D", "L", "M", "M", "J", "V", "S"];

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
      return day === today.getDate() && 
             viewDate.getMonth() === today.getMonth() && 
             viewDate.getFullYear() === today.getFullYear();
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      <div className="absolute top-full right-0 w-full sm:w-80 bg-slate-900 border-b border-x border-slate-700 rounded-b-2xl shadow-2xl z-50 animate-in slide-in-from-top-2 duration-200">
        <div className="p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Icon name="fire" className="text-orange-400" />
              Mi Racha
            </h2>
            <button onClick={onClose} className="cursor-pointer text-slate-500 hover:text-white">
              <Icon name="times" />
            </button>
          </div>

          {/* Big Number */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
              <div className="text-3xl font-bold text-orange-500 mb-1">{currentStreak}</div>
              <div className="text-slate-400 text-xs font-medium uppercase">Racha Actual</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
              <div className="text-3xl font-bold text-yellow-500 mb-1">{longestStreak}</div>
              <div className="text-slate-400 text-xs font-medium uppercase">Mejor Racha</div>
            </div>
          </div>
          
          {/* Calendar */}
          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-3 px-1">
                <button onClick={() => changeMonth(-1)} className="cursor-pointer text-slate-500 hover:text-white p-1">
                    <Icon name="chevron-left" size="sm" />
                </button>
                <span className="text-slate-200 font-bold text-sm">
                    {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                </span>
                <button onClick={() => changeMonth(1)} className="cursor-pointer text-slate-500 hover:text-white p-1">
                    <Icon name="chevron-right" size="sm" />
                </button>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1">
                {dayNames.map((d, i) => (
                    <div key={i} className="text-xs text-slate-500 font-medium py-1">{d}</div>
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
                            className={`
                                h-8 w-8 flex items-center justify-center rounded-full text-xs font-bold transition-all
                                ${active 
                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                                    : 'text-slate-400 hover:bg-slate-800'}
                                ${today && !active ? 'border border-slate-600 text-slate-200' : ''}
                            `}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>
          </div>

          <p className="text-slate-500 text-xs text-center mt-4">
            ¡Practica cada día para mantener tu racha!
          </p>
        </div>
      </div>
    </>
  );
};
