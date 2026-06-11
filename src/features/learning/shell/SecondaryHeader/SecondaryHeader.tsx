'use client';

import { cn } from '@/utils/cn';
import { useState, useMemo } from 'react';
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
import { RoadmapStatsBar } from './RoadmapStatsBar';

/**
 * Navegación secundaria móvil (stacked): stats arriba + banner de etapa abajo.
 * En escritorio el layout vive en LearningRoadmap (centro + aside).
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
          onToggleAreas={() => setActiveModal(activeModal === 'areas' ? null : 'areas')}
          onToggleStreak={() => setActiveModal(activeModal === 'streak' ? null : 'streak')}
        />
      </div>

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
