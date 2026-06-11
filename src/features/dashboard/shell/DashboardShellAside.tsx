'use client';

import { cn } from '@/utils/cn';
import { RoadmapStatsBar } from '@/features/learning/shell/SecondaryHeader/RoadmapStatsBar';
import { AreasModal } from '@/features/learning/shell/SecondaryHeader/AreasModal';
import { StreakModal } from '@/features/learning/shell/SecondaryHeader/StreakModal';
import { useDashboardShell } from './DashboardShellContext';
import { DashboardShellAsidePanels } from './DashboardShellAsidePanels';

export function DashboardShellAside() {
  const {
    currentArea,
    currentStreak,
    coins,
    statsLoading,
    desktopModal,
    setDesktopModal,
    setCurrentArea,
    streakData,
    areaSelectorRef,
    streakButtonRef,
  } = useDashboardShell();

  return (
    <aside
      className={cn(
        'bg-surface/95 hidden shrink-0 flex-col lg:flex lg:w-[22rem]',
        'sticky top-0 h-dvh overflow-y-auto'
      )}
    >
      <div className="flex flex-col gap-4 p-5">
        <RoadmapStatsBar
          currentArea={currentArea}
          currentStreak={currentStreak}
          coins={coins}
          loading={statsLoading}
          areasOpen={desktopModal === 'areas'}
          onToggleAreas={() => setDesktopModal(desktopModal === 'areas' ? null : 'areas')}
          onToggleStreak={() => setDesktopModal(desktopModal === 'streak' ? null : 'streak')}
          layout="stacked"
          areaSelectorRef={areaSelectorRef}
          streakButtonRef={streakButtonRef}
        />

        <DashboardShellAsidePanels />
      </div>

      <AreasModal
        isOpen={desktopModal === 'areas'}
        onClose={() => setDesktopModal(null)}
        currentArea={currentArea}
        onSelectArea={setCurrentArea}
        anchorRef={areaSelectorRef}
      />

      <StreakModal
        isOpen={desktopModal === 'streak'}
        onClose={() => setDesktopModal(null)}
        streakData={streakData}
        anchorRef={streakButtonRef}
      />
    </aside>
  );
}
