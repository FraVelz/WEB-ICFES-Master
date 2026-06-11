'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { isLessonRoute } from '@/features/learning/utils/lessonRoutes';
import { cn } from '@/utils/cn';
import { DashboardShellGate } from './DashboardShellGate';

export function DashboardLayoutChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isFullscreenLesson = isLessonRoute(pathname);

  const skipLink = (
    <a href="#main-content" className="skip-link">
      Saltar al contenido
    </a>
  );

  if (isFullscreenLesson) {
    return (
      <>
        {skipLink}
        <main id="main-content" className="relative min-h-dvh w-full flex-1">
          <DashboardShellGate>{children}</DashboardShellGate>
        </main>
      </>
    );
  }

  return (
    <div className="flex min-h-dvh w-full flex-col-reverse lg:flex-row">
      {skipLink}
      <DashboardHeader
        className={cn(
          'border-app-ring/20 bg-surface-elevated/95 z-40 shrink-0',
          'sticky bottom-0 border-t lg:top-0 lg:bottom-auto lg:self-start',
          'lg:h-dvh lg:max-h-dvh lg:border-t-0 lg:border-r',
          'shadow-app-ring/10 shadow-2xl backdrop-blur-xl transition-all duration-300'
        )}
      />

      <main id="main-content" className="relative min-w-0 flex-1">
        <DashboardShellGate>{children}</DashboardShellGate>
      </main>
    </div>
  );
}
