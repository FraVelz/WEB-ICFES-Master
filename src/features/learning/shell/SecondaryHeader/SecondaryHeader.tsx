'use client';

import { cn } from '@/utils/cn';
import { useRef, useState, useMemo } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useGamification } from '@/hooks/gamification';
import { useUiSessionStore } from '@/store/uiSessionStore';
import { getStreakScope } from '@/services/streak';
import type { PathSection } from '@/features/learning/roadmap/AreaPath';
import { getLearningPhasesHref } from '@/features/learning/data/competencyPhases';
import { AreasModal } from './AreasModal';
import { StreakModal } from './StreakModal';
import { CoinsModal } from './CoinsModal';
import { SectionStageBanner } from './SectionStageBanner';
import { RoadmapStatsBar } from './RoadmapStatsBar';

/**
 * Navegación secundaria móvil (stacked): stats arriba + banner de etapa abajo.
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
  const [activeModal, setActiveModal] = useState<'areas' | 'streak' | 'coins' | null>(null);
  const { user } = useAuth();
  const demoMode = useUiSessionStore((state) => state.demoMode);
  const streakScope = getStreakScope(user?.uid, demoMode) ?? undefined;

  const { currentStreak = 0, longestStreak = 0, coins = 0, streak = [], loading } = useGamification(streakScope);

  const isBadgeUnlocked = useMemo(() => currentStreak >= 7, [currentStreak]);
  const daysUntilBadge = useMemo(() => Math.max(0, 7 - currentStreak), [currentStreak]);

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

  const closeModals = () => setActiveModal(null);

  const goToAdjacentSection = (direction: -1 | 1) => {
    if (!onSectionChange || currentSectionIndex < 0) return;
    const nextIndex = currentSectionIndex + direction;
    const nextSection = sections[nextIndex];
    if (nextSection) onSectionChange(nextSection.id);
  };

  const areaSelectorRef = useRef<HTMLButtonElement>(null);
  const streakButtonRef = useRef<HTMLButtonElement>(null);

  const guideHref = getLearningPhasesHref(currentArea);

  return (
    <div className="relative z-50 lg:hidden">
      <div
        className={cn(
          'border-surface-border flex h-14 items-center justify-between border-b sm:h-16',
          'bg-surface-elevated/90 px-3 shadow-sm backdrop-blur-md sm:px-4'
        )}
      >
        <RoadmapStatsBar
          currentArea={currentArea}
          currentStreak={currentStreak}
          coins={coins}
          loading={loading}
          areasOpen={activeModal === 'areas'}
          streakOpen={activeModal === 'streak'}
          onToggleAreas={() => setActiveModal(activeModal === 'areas' ? null : 'areas')}
          onToggleStreak={() => setActiveModal(activeModal === 'streak' ? null : 'streak')}
          areaSelectorRef={areaSelectorRef}
          streakButtonRef={streakButtonRef}
        />
      </div>

      {hasSectionNav && currentSection && (
        <SectionStageBanner
          section={currentSection}
          areaColorClass={areaColorClass}
          guideHref={guideHref}
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
        anchorRef={areaSelectorRef}
      />

      <StreakModal
        isOpen={activeModal === 'streak'}
        onClose={closeModals}
        streakData={streakData}
        anchorRef={streakButtonRef}
      />

      <CoinsModal isOpen={activeModal === 'coins'} onClose={closeModals} coins={coins} />
    </div>
  );
};
