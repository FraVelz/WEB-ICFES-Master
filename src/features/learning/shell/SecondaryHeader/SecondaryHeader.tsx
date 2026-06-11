'use client';

import Link from 'next/link';
import { cn } from '@/utils/cn';
import { useState, useMemo } from 'react';
import { Icon } from '@/shared/components/Icon';
import { getAreaInfo } from '@/shared/constants';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useGamification } from '@/hooks/gamification';
import { useUiSessionStore } from '@/store/uiSessionStore';
import { getStreakScope } from '@/services/streak';
import type { PathSection } from '@/features/learning/roadmap/AreaPath';
import { AreasModal } from './AreasModal';
import { StreakModal } from './StreakModal';
import { CoinsModal } from './CoinsModal';
import { SectionStageBanner } from './SectionStageBanner';
import { SectionsModal } from './SectionsModal';

/**
 * Navegación secundaria tipo Duolingo:
 * 1. Fila superior — selector de área + racha + monedas
 * 2. Banner de etapa — submenu para la sección/lección activa del tema
 */
export interface SecondaryHeaderProps {
  currentArea?: string;
  onAreaChange?: (area: string) => void;
  sections?: PathSection[];
  currentSectionId?: string;
  onSectionChange?: (sectionId: string) => void;
  areaColorClass?: string;
}

export const SecondaryHeader = ({
  currentArea = 'lectura-critica',
  onAreaChange,
  sections = [],
  currentSectionId,
  onSectionChange,
  areaColorClass = 'from-blue-500 to-blue-600',
}: SecondaryHeaderProps) => {
  const [activeModal, setActiveModal] = useState<'areas' | 'streak' | 'coins' | 'sections' | null>(null);
  const { user } = useAuth();
  const demoMode = useUiSessionStore((state) => state.demoMode);
  const streakScope = getStreakScope(user?.uid, demoMode) ?? undefined;

  const { currentStreak = 0, longestStreak = 0, coins = 0, streak = [], loading } = useGamification(streakScope);

  const isBadgeUnlocked = useMemo(() => currentStreak >= 7, [currentStreak]);
  const daysUntilBadge = useMemo(() => Math.max(0, 7 - currentStreak), [currentStreak]);
  const currentAreaInfo = getAreaInfo(currentArea);

  const currentSection = sections.find((s) => s.id === currentSectionId);
  const currentSectionIndex = sections.findIndex((s) => s.id === currentSectionId);
  const hasSectionNav = sections.length > 0 && currentSection && onSectionChange;

  const streakData = {
    currentStreak,
    longestStreak,
    streakHistory: streak,
    isBadgeUnlocked,
    daysUntilBadge,
  };

  const handleSelectArea = (areaKey: string) => {
    onAreaChange?.(areaKey);
    setActiveModal(null);
  };

  const handleSelectSection = (sectionId: string) => {
    onSectionChange?.(sectionId);
    setActiveModal(null);
  };

  const closeModals = () => setActiveModal(null);

  const goToAdjacentSection = (direction: -1 | 1) => {
    if (!onSectionChange || currentSectionIndex < 0) return;
    const nextIndex = currentSectionIndex + direction;
    const nextSection = sections[nextIndex];
    if (nextSection) onSectionChange(nextSection.id);
  };

  return (
    <div className="relative z-50">
      {/* Fila 1: selector de tema + stats */}
      <div
        className={cn(
          'border-surface-border flex h-14 items-center justify-between border-b sm:h-16',
          'bg-surface-elevated/90 px-3 shadow-sm backdrop-blur-md sm:px-4'
        )}
      >
        <button
          type="button"
          onClick={() => setActiveModal(activeModal === 'areas' ? null : 'areas')}
          className={cn(
            'hover:bg-surface-elevated/80 flex cursor-pointer items-center gap-2 rounded-xl p-2 transition-colors sm:gap-3',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            'focus-visible:ring-offset-surface'
          )}
          title={`Área: ${currentAreaInfo.name}`}
          aria-expanded={activeModal === 'areas'}
          aria-haspopup="dialog"
        >
          <div
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg shadow-lg sm:h-8 sm:w-8',
              `bg-linear-to-br ${currentAreaInfo.color}`
            )}
          >
            <Icon name={currentAreaInfo.icon ?? 'book'} className="text-sm text-white" />
          </div>
          <div className="hidden flex-col items-start md:flex">
            <span className="text-on-surface-muted text-xs font-bold tracking-wider uppercase">Área actual</span>
            <span className="text-on-surface text-sm font-bold">{currentAreaInfo.name}</span>
          </div>
          <Icon
            name="chevron-down"
            className={cn(
              'text-on-surface-muted text-xs transition-transform',
              activeModal === 'areas' && 'rotate-180'
            )}
          />
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setActiveModal(activeModal === 'streak' ? null : 'streak')}
            className={cn(
              'group border-surface-border flex cursor-pointer items-center gap-2 rounded-full border',
              'bg-surface-elevated px-2.5 py-1.5 transition-colors hover:border-orange-500/50 sm:px-3',
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

          <Link
            href="/tienda"
            className={cn(
              'group border-surface-border flex cursor-pointer items-center gap-2 rounded-full border',
              'bg-surface-elevated px-2.5 py-1.5 transition-colors hover:border-yellow-500/50 sm:px-3',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              'focus-visible:ring-offset-surface'
            )}
            title="Ir a la tienda"
          >
            <Icon name="coins" className="text-sm text-yellow-500" />
            <span className={cn('text-sm font-bold text-yellow-500', loading && 'animate-pulse opacity-60')}>
              {coins}
            </span>
          </Link>
        </div>
      </div>

      {/* Fila 2: submenu de etapa/sección (Duolingo) */}
      {hasSectionNav && currentSection && (
        <SectionStageBanner
          section={currentSection}
          areaColorClass={areaColorClass}
          onOpenSections={() => setActiveModal(activeModal === 'sections' ? null : 'sections')}
          onPrevSection={() => goToAdjacentSection(-1)}
          onNextSection={() => goToAdjacentSection(1)}
          hasPrev={currentSectionIndex > 0}
          hasNext={currentSectionIndex < sections.length - 1}
        />
      )}

      <AreasModal
        isOpen={activeModal === 'areas'}
        onClose={closeModals}
        currentArea={currentArea}
        onSelectArea={handleSelectArea}
      />

      {hasSectionNav && currentSectionId && (
        <SectionsModal
          isOpen={activeModal === 'sections'}
          onClose={closeModals}
          currentSectionId={currentSectionId}
          onSelectSection={handleSelectSection}
          sections={sections}
          areaColorClass={areaColorClass}
        />
      )}

      <StreakModal isOpen={activeModal === 'streak'} onClose={closeModals} streakData={streakData} />

      <CoinsModal isOpen={activeModal === 'coins'} onClose={closeModals} coins={coins} />
    </div>
  );
};
