import React, { useState } from 'react';
import { Icon } from '@/shared/components/Icon';
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
    <div className="min-h-dvh bg-slate-950 pb-24 text-white md:pb-0">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 h-96 w-full bg-linear-to-b from-orange-900/20 to-transparent"></div>
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto max-w-4xl px-4 py-8">
        <ConstructionAlert moduleName="Desafíos Diarios" className="mb-8" />

        {/* Header & Date Navigation */}
        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold">
              <Icon name="fire" className="text-orange-500" />
              Desafíos Diarios
            </h1>
            <p className="mt-1 text-slate-400">Completa tareas diarias para ganar XP y monedas extra.</p>
          </div>

          <div className="flex items-center rounded-full border border-slate-800 bg-slate-900 p-1">
            <button
              onClick={handlePrevDay}
              className="h-10 w-10 rounded-full text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <Icon name="chevron-left" />
            </button>

            <div className="flex min-w-[140px] items-center justify-center gap-2 px-4 font-medium">
              <Icon name="calendar-alt" className="text-cyan-500" />
              {selectedDate.toLocaleDateString('es-CO', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              })}
            </div>

            <button
              onClick={handleNextDay}
              disabled={isToday}
              className={`h-10 w-10 cursor-pointer rounded-full transition-colors ${
                isToday ? 'cursor-not-allowed text-slate-700' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon name="chevron-right" />
            </button>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="relative mb-8 overflow-hidden rounded-2xl border border-slate-700 bg-linear-to-r from-slate-900 to-slate-800 p-6">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Icon name="gift" className="text-9xl" />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="text-center md:text-left">
              <div className="mb-1 text-sm font-bold tracking-wider text-slate-400 uppercase">Tu Progreso Hoy</div>
              <div className="text-4xl font-bold text-white">
                {stats.completed} <span className="text-2xl text-slate-500">/ {stats.total}</span>
              </div>
            </div>

            <div className="w-full max-w-md flex-1">
              <div className="mb-2 flex justify-between text-xs">
                <span className="text-slate-300">Completado</span>
                <span className="font-bold text-orange-400">
                  {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                </span>
              </div>
              <div className="h-4 overflow-hidden rounded-full border border-slate-700 bg-slate-950">
                <div
                  className="relative h-full bg-linear-to-r from-orange-500 to-red-500 transition-all duration-1000"
                  style={{
                    width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%`,
                  }}
                >
                  <div className="absolute inset-0 animate-pulse bg-white/20"></div>
                </div>
              </div>
              <p className="mt-2 text-center text-xs text-slate-500 md:text-right">
                ¡Completa todos para un bonus de 100 XP!
              </p>
            </div>
          </div>
        </div>

        {/* Challenges List */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-12 text-center">
              <Icon name="spinner" className="mb-4 animate-spin text-4xl text-cyan-400" />
              <p className="text-slate-400">Cargando desafíos...</p>
            </div>
          ) : challenges.length > 0 ? (
            challenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} onComplete={completeChallenge} />
            ))
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 py-12 text-center">
              <p className="text-slate-400">No hay desafíos disponibles para esta fecha.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
