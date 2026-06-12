'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { AchievementUnlockHost } from '@/features/achievements/components/AchievementUnlockHost';
import { isLessonRoute } from '@/features/learning/utils/lessonRoutes';
import { cn } from '@/utils/cn';
import { DashboardShellGate } from './DashboardShellGate';

export function DashboardLayoutChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isFullscreenLesson = isLessonRoute(pathname);

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
          'lg:h-auto lg:max-h-none lg:min-h-dvh lg:overflow-visible lg:flex-row'
        )}
      >
        <DashboardHeader
          className={cn(
            'border-app-ring/20 bg-surface-elevated/95 z-40 order-2 shrink-0',
            'border-t lg:top-0 lg:bottom-auto lg:order-1 lg:self-start',
            'lg:sticky lg:h-dvh lg:max-h-dvh lg:border-t-0 lg:border-r',
            'shadow-app-ring/10 shadow-2xl backdrop-blur-xl transition-all duration-300'
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
