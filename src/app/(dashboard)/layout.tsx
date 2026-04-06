'use client';

import { MainLayout } from '@/shared/components/MainLayout';
import { usePlanScheduleChecker } from '@/features/store/hooks/usePlanScheduleChecker';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  usePlanScheduleChecker();

  return <MainLayout>{children}</MainLayout>;
}
