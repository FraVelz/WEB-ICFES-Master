'use client';

import { Suspense, type ReactNode } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { GamificationProvider } from '@/hooks/gamification/GamificationContext';
import { getStreakScope } from '@/services/streak';
import { useUiSessionStore } from '@/store/uiSessionStore';
import { LoadingState } from '@/shared/components/LoadingState';
import { DashboardShellProvider, useDashboardShell } from './DashboardShellContext';
import { DashboardShellBanner } from './DashboardShellBanner';
import { DashboardShellAside } from './DashboardShellAside';
import { cn } from '@/utils/cn';
import { RoadmapStatsBar } from '@/features/learning/shell/SecondaryHeader/RoadmapStatsBar';
import { AreasModal } from '@/features/learning/shell/SecondaryHeader/AreasModal';
import { StreakModal } from '@/features/learning/shell/SecondaryHeader/StreakModal';
import { CoinsModal } from '@/features/learning/shell/SecondaryHeader/CoinsModal';

function DashboardShellMobileHeader() {
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

  const activeModal = desktopModal;

  return (
    <div className="sticky top-0 z-50 w-full lg:hidden">
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
          loading={statsLoading}
          areasOpen={activeModal === 'areas'}
          streakOpen={activeModal === 'streak'}
          onToggleAreas={() => setDesktopModal(activeModal === 'areas' ? null : 'areas')}
          onToggleStreak={() => setDesktopModal(activeModal === 'streak' ? null : 'streak')}
          areaSelectorRef={areaSelectorRef}
          streakButtonRef={streakButtonRef}
        />
      </div>

      <DashboardShellBanner />

      <AreasModal
        isOpen={activeModal === 'areas'}
        onClose={() => setDesktopModal(null)}
        currentArea={currentArea}
        onSelectArea={setCurrentArea}
        anchorRef={areaSelectorRef}
      />

      <StreakModal
        isOpen={activeModal === 'streak'}
        onClose={() => setDesktopModal(null)}
        streakData={streakData}
        anchorRef={streakButtonRef}
      />

      <CoinsModal isOpen={false} onClose={() => setDesktopModal(null)} coins={coins} />
    </div>
  );
}

function DashboardShellInner({ children }: { children: ReactNode }) {
  const { shellSection } = useDashboardShell();
  const hideAside = shellSection === 'achievements';

  return (
    <div className="bg-surface relative flex min-h-full flex-col lg:min-h-dvh">
      <DashboardShellMobileHeader />

      <div
        className={cn(
          'mx-auto flex min-h-0 w-full flex-1 flex-col lg:flex-row lg:justify-center',
          hideAside ? 'lg:max-w-3xl' : 'lg:max-w-[calc(48rem+22rem)]'
        )}
      >
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col lg:w-full lg:max-w-3xl lg:flex-none">
          <div className="sticky top-0 z-40 hidden lg:block lg:pt-5">
            <DashboardShellBanner className="rounded-2xl" />
          </div>

          <div className="relative flex-1 px-0 pt-4 pb-24 lg:px-0 lg:pt-6 lg:pb-8">{children}</div>
        </div>

        {!hideAside && <DashboardShellAside />}
      </div>
    </div>
  );
}

function DashboardShellWithGamification({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const demoMode = useUiSessionStore((state) => state.demoMode);
  const streakScope = getStreakScope(user?.uid, demoMode) ?? undefined;

  return (
    <GamificationProvider scope={streakScope}>
      <DashboardShellProvider>{children}</DashboardShellProvider>
    </GamificationProvider>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<LoadingState label="Cargando..." layout="section" />}>
      <DashboardShellWithGamification>
        <DashboardShellInner>{children}</DashboardShellInner>
      </DashboardShellWithGamification>
    </Suspense>
  );
}
