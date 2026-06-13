'use client';

import { useState } from 'react';
import { useUiSessionStore } from '@/store/uiSessionStore';
import { DesktopSidebar } from './DesktopSidebar';
import { MobileNav } from './MobileNav';

export const DashboardHeader = ({ className }: { className?: string }) => {
  const [mobileOptionsMenuOpen, setMobileOptionsMenuOpen] = useState(false);
  const sidebarExpanded = useUiSessionStore((s) => s.sidebarExpanded);
  const toggleSidebarExpanded = useUiSessionStore((s) => s.toggleSidebarExpanded);

  return (
    <>
      <DesktopSidebar className={className} sidebarExpanded={sidebarExpanded} onToggleSidebar={toggleSidebarExpanded} />

      <MobileNav
        menuOpen={mobileOptionsMenuOpen}
        onToggleMenu={() => setMobileOptionsMenuOpen((open) => !open)}
        onCloseMenu={() => setMobileOptionsMenuOpen(false)}
      />
    </>
  );
};
