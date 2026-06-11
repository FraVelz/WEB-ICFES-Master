'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { DashboardShell } from './DashboardShell';
import { isDashboardShellRoute } from './shellRoutes';

export function DashboardShellGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (!isDashboardShellRoute(pathname)) {
    return children;
  }

  return <DashboardShell>{children}</DashboardShell>;
}
