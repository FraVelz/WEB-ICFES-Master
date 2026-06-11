import React from 'react';

import { DashboardHeader } from '@/components/DashboardHeader';
import { LevelAssessmentGate } from '@/components/LevelAssessmentGate';
import { DashboardShellGate } from '@/features/dashboard/shell';
import { cn } from '@/utils/cn';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="from-surface via-surface-via to-surface text-on-surface relative flex min-h-dvh bg-linear-to-b">
      <LevelAssessmentGate />

      <div className="flex min-h-dvh w-full flex-col-reverse lg:flex-row">
        {/* Navegación principal: sticky, ocupa ancho/alto en el flujo (no flota sobre el contenido) */}
        <DashboardHeader
          className={cn(
            'border-app-ring/20 bg-surface-elevated/95 z-40 shrink-0',
            'sticky bottom-0 border-t lg:top-0 lg:bottom-auto lg:self-start',
            'lg:h-dvh lg:max-h-dvh lg:border-t-0 lg:border-r',
            'shadow-app-ring/10 shadow-2xl backdrop-blur-xl transition-all duration-300'
          )}
        />

        <main className="relative min-w-0 flex-1">
          <DashboardShellGate>{children}</DashboardShellGate>
        </main>
      </div>
    </div>
  );
}
