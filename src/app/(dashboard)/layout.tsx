import React from 'react';

import { LevelAssessmentGate } from '@/components/LevelAssessmentGate';
import { DashboardLayoutChrome } from '@/features/dashboard/shell/DashboardLayoutChrome';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="from-surface via-surface-via to-surface text-on-surface relative flex min-h-dvh bg-linear-to-b">
      <LevelAssessmentGate />
      <DashboardLayoutChrome>{children}</DashboardLayoutChrome>
    </div>
  );
}
