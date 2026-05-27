'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { isAccountOnlyPath } from '@/features/auth/constants/accountOnlyRoutes';
import { useUser } from '@/features/user/hooks/useUser';
import { useAppSelector } from '@/store/hooks';
import { DesktopSidebar } from './DesktopSidebar';
import { MobileNav } from './MobileNav';

export const DashboardHeader = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const { user, rank, virtualMoney } = useUser();
  const demoMode = useAppSelector((s) => s.uiSession.demoMode);
  const [mobileOptionsMenuOpen, setMobileOptionsMenuOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const isLockedInDemo = (path: string) => demoMode && isAccountOnlyPath(path);

  return (
    <>
      <DesktopSidebar
        className={className}
        sidebarExpanded={sidebarExpanded}
        onToggleSidebar={() => setSidebarExpanded((expanded) => !expanded)}
        pathname={pathname}
        isLockedInDemo={isLockedInDemo}
        user={user}
        rank={rank}
        virtualMoney={virtualMoney}
      />

      <MobileNav
        pathname={pathname}
        menuOpen={mobileOptionsMenuOpen}
        onToggleMenu={() => setMobileOptionsMenuOpen((open) => !open)}
        onCloseMenu={() => setMobileOptionsMenuOpen(false)}
        isLockedInDemo={isLockedInDemo}
      />
    </>
  );
};
