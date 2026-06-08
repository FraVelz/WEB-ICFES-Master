'use client';

import { cn } from '@/utils/cn';
import { useState, useMemo } from 'react';
import { Icon } from '@/shared/components/Icon';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { getAreaInfo } from '@/shared/constants';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useGamification } from '@/hooks/gamification';
import { useUiSessionStore } from '@/store/uiSessionStore';
import { getStreakScope } from '@/services/streak';
import { AreasModal } from './AreasModal';
import { StreakModal } from './StreakModal';
import { CoinsModal } from './CoinsModal';
import { StoreModal } from '@/features/store/components/StoreModal';

import { createPortal } from 'react-dom';

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
  const demoMode = useUiSessionStore((state) => state.demoMode);
  const streakScope = getStreakScope(user?.uid, demoMode) ?? undefined;

  const container_main = document.getElementById('container-main');

  // Gamification snapshot (XP, coins, streak)
  const { currentStreak = 0, longestStreak = 0, coins = 0, streak = [], loading } = useGamification(streakScope);

  // Streak badge unlocked?
  const isBadgeUnlocked = useMemo(() => {
    return currentStreak >= 7;
  }, [currentStreak]);

  // Days until next streak badge
  const daysUntilBadge = useMemo(() => {
    return Math.max(0, 7 - currentStreak);
  }, [currentStreak]);

  // Current subject metadata
  const currentAreaInfo = getAreaInfo(currentArea);

  // Streak modal payload
  const streakData = {
    currentStreak,
    longestStreak,
    streakHistory: streak, // full history for the modal
    isBadgeUnlocked,
    daysUntilBadge,
  };

  const handleSelectArea = (areaKey: string) => {
    if (onAreaChange) onAreaChange(areaKey);
    setActiveModal(null);
  };

  const closeModals = () => setActiveModal(null);

  if (!container_main) return null;

  return (
    <div className="relative z-50">
      {/* Sticky secondary header */}
      <div
        className={cn(
          'border-surface-border sticky top-0 z-50 flex h-16 items-center justify-between border-b',
          'bg-surface-elevated/90 px-4 shadow-sm backdrop-blur-md'
        )}
      >
        {/* Current subject */}
        <button
          type="button"
          onClick={() => setActiveModal(activeModal === 'areas' ? null : 'areas')}
          className={cn(
            'hover:bg-surface-elevated/80 flex cursor-pointer items-center gap-3 rounded-xl p-2 transition-colors',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            'focus-visible:ring-offset-surface'
          )}
          title="Cambiar área"
          aria-expanded={activeModal === 'areas'}
          aria-haspopup="dialog"
        >
          {/* Subject icon */}
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg shadow-lg',
              `bg-linear-to-br ${currentAreaInfo.color}`
            )}
          >
            <Icon name={currentAreaInfo.icon ?? 'book'} className="text-xs text-white" />
          </div>
          <div className="hidden flex-col items-start sm:flex">
            <span className="text-on-surface-muted text-xs font-bold tracking-wider uppercase">Área actual</span>
            <span className="text-on-surface text-sm font-bold">{currentAreaInfo.name}</span>
          </div>
          <Icon
            name="chevron-down"
            className={cn(
              'text-on-surface-muted ml-1 text-xs transition-transform',
              activeModal === 'areas' && 'rotate-180'
            )}
          />
        </button>

        <div className="flex items-center gap-3">
          {/* Streak */}
          <button
            type="button"
            onClick={() => setActiveModal(activeModal === 'streak' ? null : 'streak')}
            className={cn(
              'group border-surface-border flex cursor-pointer items-center gap-2 rounded-full border',
              'bg-surface-elevated px-3 py-1.5 transition-colors hover:border-orange-500/50',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              'focus-visible:ring-offset-surface'
            )}
            title="Ver información de racha"
            aria-expanded={activeModal === 'streak'}
          >
            <Icon
              name="fire"
              className={cn(
                'text-sm transition-colors',
                currentStreak > 0 ? 'text-orange-500' : 'text-on-surface-muted group-hover:text-orange-500/50'
              )}
            />
            <span
              className={cn(
                'text-sm font-bold',
                currentStreak > 0 ? 'text-orange-500' : 'text-on-surface-muted group-hover:text-orange-500/50',
                loading && 'animate-pulse opacity-60'
              )}
            >
              {currentStreak}
            </span>
          </button>

          {/* Coins / store */}
          <button
            type="button"
            onClick={() => setActiveModal(activeModal === 'store' ? null : 'store')}
            className={cn(
              'group border-surface-border flex cursor-pointer items-center gap-2 rounded-full border',
              'bg-surface-elevated px-3 py-1.5 transition-colors hover:border-yellow-500/50',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              'focus-visible:ring-offset-surface'
            )}
            title="Abrir tienda"
            aria-expanded={activeModal === 'store'}
          >
            <Icon name="coins" className="text-sm text-yellow-500" />
            <span className={cn('text-sm font-bold text-yellow-500', loading && 'animate-pulse opacity-60')}>
              {coins}
            </span>
          </button>

          <ThemeToggle compact className="border-surface-border bg-surface-elevated hover:border-app-ring/40" />
        </div>
      </div>

      {/* Modals */}
      <AreasModal
        isOpen={activeModal === 'areas'}
        onClose={closeModals}
        currentArea={currentArea}
        onSelectArea={handleSelectArea}
      />

      <StreakModal isOpen={activeModal === 'streak'} onClose={closeModals} streakData={streakData} />

      <CoinsModal isOpen={activeModal === 'coins'} onClose={closeModals} coins={coins} />

      {createPortal(<StoreModal isOpen={activeModal === 'store'} onClose={closeModals} />, container_main)}
    </div>
  );
};
