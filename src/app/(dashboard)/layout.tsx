'use client';

import { MainLayout } from '@/shared/components/MainLayout';
import { DemoTimerBanner } from '@/shared/components/DemoTimerBanner';
import { usePlanScheduleChecker } from '@/features/store/hooks/usePlanScheduleChecker';
import { useEffect, useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false);
  usePlanScheduleChecker();

  useEffect(() => {
    const check = () => setIsDemoMode(localStorage.getItem('demoMode') === 'true');
    check();
    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MainLayout>
      {isDemoMode && <DemoTimerBanner isDemoMode={isDemoMode} />}
      {children}
    </MainLayout>
  );
}
