'use client';

import { useState, useMemo } from 'react';
import { Icon } from '@/shared/components/Icon';
import { AREA_INFO } from '@/shared/constants';
import { useAuth } from '@/context/AuthContext';
import { useGamification } from '@/features/logros/hooks/useGamification';
import { AreasModal } from './AreasModal';
import { StreakModal } from './StreakModal';
import { CoinsModal } from './CoinsModal';
import { StoreModal } from '@/features/store/components/StoreModal';

/**
 * Header secundario tipo Duolingo para la página de ruta de aprendizaje
 * Visible en móvil y desktop
 * Contiene 3 elementos interactivos principales
 */
export interface SecondaryHeaderProps {
  currentArea?: string;
  onAreaChange?: (area: string) => void;
}

export const SecondaryHeader = ({ currentArea = 'lectura-critica', onAreaChange }: SecondaryHeaderProps) => {
  const [activeModal, setActiveModal] = useState<'areas' | 'streak' | 'store' | 'coins' | null>(null);
  const { user } = useAuth();

  // Hook de gamificación para obtener datos del usuario
  const {
    currentStreak = 0,
    longestStreak = 0,
    coins = 0,
    streak = [], // Array de fechas
    loading,
  } = useGamification(user?.uid);

  // Calcular si la insignia está desbloqueada
  const isBadgeUnlocked = useMemo(() => {
    return currentStreak >= 7;
  }, [currentStreak]);

  // Calcular días faltantes para insignia
  const daysUntilBadge = useMemo(() => {
    return Math.max(0, 7 - currentStreak);
  }, [currentStreak]);

  // Obtener información del área actual
  const currentAreaInfo =
    (AREA_INFO as Record<string, { name?: string; color?: string; icon?: string }>)[currentArea] ||
    (AREA_INFO as Record<string, { name?: string; color?: string; icon?: string }>)['lectura-critica'];

  // Datos de racha
  const streakData = {
    currentStreak,
    longestStreak,
    streakHistory: streak, // Pasamos el historial completo
    isBadgeUnlocked,
    daysUntilBadge,
  };

  const handleSelectArea = (areaKey: string) => {
    if (onAreaChange) onAreaChange(areaKey);
    setActiveModal(null);
  };

  const closeModals = () => setActiveModal(null);

  if (loading) {
    return (
      <div className="sticky top-0 z-50 flex h-16 items-center justify-center border-b border-slate-700 bg-linear-to-b from-slate-950 to-slate-900">
        <div className="animate-pulse text-slate-400">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="relative z-50">
      {/* Header Secundario - Sticky, Visible en móvil y desktop */}
      <div className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 shadow-lg backdrop-blur-md">
        {/* Elemento 1: Área Actual */}
        <button
          onClick={() => setActiveModal(activeModal === 'areas' ? null : 'areas')}
          className="flex cursor-pointer items-center gap-3 rounded-xl p-2 transition-colors hover:bg-slate-800/50"
          title="Cambiar área"
        >
          {/* Ícono del área */}
          <div
            className={`h-8 w-8 rounded-lg bg-linear-to-br ${currentAreaInfo.color} flex items-center justify-center shadow-lg`}
          >
            <Icon name={currentAreaInfo.icon ?? 'book'} className="text-xs text-white" />
          </div>
          {/* Nombre del área - Oculto en móvil muy pequeño */}
          <div className="hidden flex-col items-start sm:flex">
            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Área actual</span>
            <span className="text-sm font-bold text-slate-200">{currentAreaInfo.name}</span>
          </div>
          <Icon
            name="chevron-down"
            className={`ml-1 text-xs text-slate-500 transition-transform ${activeModal === 'areas' ? 'rotate-180' : ''}`}
          />
        </button>

        <div className="flex items-center gap-3">
          {/* Elemento 2: Racha de Días */}
          <button
            onClick={() => setActiveModal(activeModal === 'streak' ? null : 'streak')}
            className="group flex cursor-pointer items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 transition-colors hover:border-orange-500/50"
            title="Ver información de racha"
          >
            <Icon
              name="fire"
              className={`text-sm transition-colors ${currentStreak > 0 ? 'text-orange-500' : 'text-slate-600 group-hover:text-orange-500/50'}`}
            />
            <span
              className={`text-sm font-bold ${currentStreak > 0 ? 'text-orange-500' : 'text-slate-400 group-hover:text-orange-500/50'}`}
            >
              {currentStreak}
            </span>
          </button>

          {/* Elemento 3: Monedas / Tienda */}
          <button
            onClick={() => setActiveModal(activeModal === 'store' ? null : 'store')}
            className="group flex cursor-pointer items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 transition-colors hover:border-yellow-500/50"
            title="Abrir tienda"
          >
            <Icon name="coins" className="text-sm text-yellow-500" />
            <span className="text-sm font-bold text-yellow-500">{coins}</span>
          </button>
        </div>
      </div>

      {/* Modales */}
      <AreasModal
        isOpen={activeModal === 'areas'}
        onClose={closeModals}
        currentArea={currentArea}
        onSelectArea={handleSelectArea}
      />

      <StreakModal isOpen={activeModal === 'streak'} onClose={closeModals} streakData={streakData} />

      <CoinsModal isOpen={activeModal === 'coins'} onClose={closeModals} coins={coins} />

      <StoreModal isOpen={activeModal === 'store'} onClose={closeModals} />
    </div>
  );
};
