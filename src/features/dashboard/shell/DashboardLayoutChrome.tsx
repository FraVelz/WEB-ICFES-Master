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

  if (isFullscreenLesson) {
    return (
      <main id="main-content" className="relative min-h-dvh w-full flex-1">
        <DashboardShellGate>{children}</DashboardShellGate>
      </main>
    );
  }

  return (
    <div className="flex min-h-dvh w-full flex-col lg:flex-row">
      <DashboardHeader
        className={cn(
          'border-app-ring/20 bg-surface-elevated/95 z-40 order-2 shrink-0',
          'sticky bottom-0 border-t lg:top-0 lg:bottom-auto lg:order-1 lg:self-start',
          'lg:h-dvh lg:max-h-dvh lg:border-t-0 lg:border-r',
          'shadow-app-ring/10 shadow-2xl backdrop-blur-xl transition-all duration-300'
        )}
      />

      <main id="main-content" className="relative order-1 min-w-0 flex-1 lg:order-2">
        <DashboardShellGate>{children}</DashboardShellGate>
      </main>
    </div>
  );
}
