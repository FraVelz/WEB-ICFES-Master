import type { Metadata } from 'next';
import React from 'react';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LevelAssessmentGate } from '@/components/LevelAssessmentGate';
import { DashboardLayoutChrome } from '@/features/dashboard/shell/DashboardLayoutChrome';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="from-surface via-surface-via to-surface text-on-surface relative flex min-h-dvh bg-linear-to-b">
      <LevelAssessmentGate />
      <DashboardLayoutChrome>
        <ErrorBoundary title="Error en el panel">{children}</ErrorBoundary>
      </DashboardLayoutChrome>
    </div>
  );
}
