import { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFire,
  faCoins,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import { AREA_INFO } from '@/shared/constants';
import { useAuth } from '@/context/AuthContext';
import { useGamificationFirestore } from '@/features/logros/hooks/useGamificationFirestore';
import { AreasModal } from './AreasModal';
import { StreakModal } from './StreakModal';
import { CoinsModal } from './CoinsModal';

/**
 * Header secundario tipo Duolingo para la página de ruta de aprendizaje
 * Visible en móvil y desktop
 * Contiene 3 elementos interactivos principales
 */
export const SecondaryHeader = ({ currentArea = 'lectura-critica', onAreaChange }) => {
  const [activeModal, setActiveModal] = useState(null);
  const { user } = useAuth();
  
  // Hook de gamificación para obtener datos del usuario
  const { 
    currentStreak = 0, 
    longestStreak = 0,
    coins = 0,
    streak = [], // Array de fechas
    loading 
  } = useGamificationFirestore(user?.uid);

  // Calcular si la insignia está desbloqueada
  const isBadgeUnlocked = useMemo(() => {
    return currentStreak >= 7;
  }, [currentStreak]);

  // Calcular días faltantes para insignia
  const daysUntilBadge = useMemo(() => {
    return Math.max(0, 7 - currentStreak);
  }, [currentStreak]);

  // Obtener información del área actual
  const currentAreaInfo = AREA_INFO[currentArea] || AREA_INFO['lectura-critica'];

  // Datos de racha
  const streakData = {
    currentStreak,
    longestStreak,
    streakHistory: streak, // Pasamos el historial completo
    isBadgeUnlocked,
    daysUntilBadge,
  };

  const handleSelectArea = (areaKey) => {
    if (onAreaChange) onAreaChange(areaKey);
    setActiveModal(null);
  };

  const closeModals = () => setActiveModal(null);

  if (loading) {
    return (
      <div className="h-16 bg-linear-to-b from-slate-950 to-slate-900 border-b border-slate-700 flex items-center justify-center sticky top-0 z-50">
        <div className="animate-pulse text-slate-400">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="relative z-50">
      {/* Header Secundario - Sticky, Visible en móvil y desktop */}
      <div className="h-16 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 shadow-lg sticky top-0 z-50">
        
        {/* Elemento 1: Área Actual */}
        <button
          onClick={() => setActiveModal(activeModal === 'areas' ? null : 'areas')}
          className="cursor-pointer flex items-center gap-3 hover:bg-slate-800/50 p-2 rounded-xl transition-colors"
          title="Cambiar área"
        >
          {/* Ícono del área */}
          <div className={`w-8 h-8 rounded-lg bg-linear-to-br ${currentAreaInfo.color} flex items-center justify-center shadow-lg`}>
            <FontAwesomeIcon icon={currentAreaInfo.icon} className="text-white text-xs" />
          </div>
          {/* Nombre del área - Oculto en móvil muy pequeño */}
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Área actual</span>
            <span className="text-sm font-bold text-slate-200">{currentAreaInfo.name}</span>
          </div>
          <FontAwesomeIcon icon={faChevronDown} className={`text-slate-500 text-xs ml-1 transition-transform ${activeModal === 'areas' ? 'rotate-180' : ''}`} />
        </button>

        <div className="flex items-center gap-3">
          {/* Elemento 2: Racha de Días */}
          <button
            onClick={() => setActiveModal(activeModal === 'streak' ? null : 'streak')}
            className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-orange-500/50 transition-colors group"
            title="Ver información de racha"
          >
            <FontAwesomeIcon
              icon={faFire}
              className={`text-sm transition-colors ${currentStreak > 0 ? 'text-orange-500' : 'text-slate-600 group-hover:text-orange-500/50'}`}
            />
            <span className={`text-sm font-bold ${currentStreak > 0 ? 'text-orange-500' : 'text-slate-400 group-hover:text-orange-500/50'}`}>
              {currentStreak}
            </span>
          </button>

          {/* Elemento 3: Monedas */}
          <button
            onClick={() => setActiveModal(activeModal === 'coins' ? null : 'coins')}
            className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-yellow-500/50 transition-colors group"
            title="Ver tienda"
          >
            <FontAwesomeIcon
              icon={faCoins}
              className="text-yellow-500 text-sm"
            />
            <span className="text-sm font-bold text-yellow-500">
              {coins}
            </span>
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

      <StreakModal
        isOpen={activeModal === 'streak'}
        onClose={closeModals}
        streakData={streakData}
      />

      <CoinsModal
        isOpen={activeModal === 'coins'}
        onClose={closeModals}
        coins={coins}
      />
    </div>
  );
};
