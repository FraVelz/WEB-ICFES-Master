import React from 'react';

import { DashboardHeader } from '@/components/DashboardHeader';
import { LevelAssessmentGate } from '@/components/LevelAssessmentGate';
import { cn } from '@/utils/cn';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="from-surface via-surface-via to-surface text-on-surface relative flex min-h-screen overflow-hidden bg-linear-to-b">
      <LevelAssessmentGate />

      <div className="flex h-screen w-screen flex-col-reverse lg:flex-row">
        {/* Header - Sidebar */}
        <DashboardHeader
          className={cn(
            'border-app-ring/20 bg-surface-elevated/95 flex hidden h-screen min-h-0 w-fit flex-col border-r',
            'shadow-app-ring/10 shadow-2xl backdrop-blur-xl transition-all duration-300 lg:flex'
          )}
        />

        {/* Main Content Area */}
        <main className="relative h-screen w-full flex-1 overflow-y-scroll transition-all duration-300 lg:w-auto lg:pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}
