'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { AchievementUnlockHost } from '@/features/achievements/components/AchievementUnlockHost';
import { isLessonRoute } from '@/features/learning/utils/lessonRoutes';
import { cn } from '@/utils/cn';
import { DashboardShellGate } from './DashboardShellGate';
import { DashboardDataProviders } from './DashboardDataProviders';

function DashboardLayoutBody({ children, isFullscreenLesson }: { children: ReactNode; isFullscreenLesson: boolean }) {
  if (isFullscreenLesson) {
    return (
      <>
        <a href="#main-content" className="skip-link">
          Saltar al contenido
        </a>
        <main id="main-content" className="relative min-h-dvh w-full flex-1 overflow-hidden">
          <DashboardShellGate>{children}</DashboardShellGate>
        </main>
        <AchievementUnlockHost />
      </>
    );
  }

  return (
    <>
      <a href="#main-content" className="skip-link">
        Saltar al contenido
      </a>
      <div
        className={cn(
          'flex h-dvh max-h-dvh w-full flex-col overflow-hidden',
          'lg:h-auto lg:max-h-none lg:min-h-dvh lg:flex-row lg:overflow-visible'
        )}
      >
        <DashboardHeader
          className={cn(
            'z-40 order-2 shrink-0',
            'border-app-ring/20 border-t lg:order-1 lg:min-h-dvh lg:w-20 lg:border-t-0'
          )}
        />

        <main
          id="main-content"
          className={cn(
            'relative order-1 min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain',
            'lg:order-2 lg:overflow-visible'
          )}
        >
          <DashboardShellGate>{children}</DashboardShellGate>
        </main>
      </div>
      <AchievementUnlockHost />
    </>
  );
}

export function DashboardLayoutChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isFullscreenLesson = isLessonRoute(pathname);

  return (
    <DashboardDataProviders>
      <DashboardLayoutBody isFullscreenLesson={isFullscreenLesson}>{children}</DashboardLayoutBody>
    </DashboardDataProviders>
  );
}
