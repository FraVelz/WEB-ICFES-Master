import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFire, 
  faCalendarAlt, 
  faChevronLeft, 
  faChevronRight,
  faSpinner,
  faGift
} from '@fortawesome/free-solid-svg-icons';
import { useDailyChallenges } from '../hooks/useDailyChallenges';
import { ChallengeCard } from '../components/ChallengeCard';
import { ConstructionAlert } from '@/shared/components';

export const DailyChallengesPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Formato YYYY-MM-DD para el hook
  const dateString = selectedDate.toISOString().split('T')[0];
  
  const { challenges, loading, stats, completeChallenge } = useDailyChallenges(dateString);

  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    
    // No permitir ir al futuro más allá de hoy (opcional, pero lógico para desafíos)
    if (newDate <= new Date()) {
      setSelectedDate(newDate);
    }
  };

  const isToday = dateString === new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-dvh bg-slate-950 text-white pb-24 md:pb-0">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-96 bg-linear-to-b from-orange-900/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <ConstructionAlert moduleName="Desafíos Diarios" className="mb-8" />

        {/* Header & Date Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FontAwesomeIcon icon={faFire} className="text-orange-500" />
              Desafíos Diarios
            </h1>
            <p className="text-slate-400 mt-1">
              Completa tareas diarias para ganar XP y monedas extra.
            </p>
          </div>

          <div className="flex items-center bg-slate-900 rounded-full p-1 border border-slate-800">
            <button 
              onClick={handlePrevDay}
              className="w-10 h-10 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            
            <div className="px-4 flex items-center gap-2 font-medium min-w-[140px] justify-center">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-cyan-500" />
              {selectedDate.toLocaleDateString('es-CO', { 
                weekday: 'short', 
                day: 'numeric', 
                month: 'short' 
              })}
            </div>

            <button 
              onClick={handleNextDay}
              disabled={isToday}
              className={`cursor-pointer w-10 h-10 rounded-full transition-colors ${
                isToday 
                  ? 'text-slate-700 cursor-not-allowed' 
                  : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="bg-linear-to-r from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <FontAwesomeIcon icon={faGift} className="text-9xl" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="text-sm text-slate-400 uppercase tracking-wider font-bold mb-1">Tu Progreso Hoy</div>
              <div className="text-4xl font-bold text-white">
                {stats.completed} <span className="text-slate-500 text-2xl">/ {stats.total}</span>
              </div>
            </div>

            <div className="flex-1 w-full max-w-md">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-300">Completado</span>
                <span className="text-orange-400 font-bold">
                  {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                </span>
              </div>
              <div className="h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className="h-full bg-linear-to-r from-orange-500 to-red-500 transition-all duration-1000 relative"
                  style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center md:text-right">
                ¡Completa todos para un bonus de 100 XP!
              </p>
            </div>
          </div>
        </div>

        {/* Challenges List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-cyan-400 mb-4" />
              <p className="text-slate-400">Cargando desafíos...</p>
            </div>
          ) : challenges.length > 0 ? (
            challenges.map((challenge) => (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge} 
                onComplete={completeChallenge}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800">
              <p className="text-slate-400">No hay desafíos disponibles para esta fecha.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
