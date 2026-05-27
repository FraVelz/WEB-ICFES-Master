'use client';

import { useState } from 'react';
import { DesktopSidebar } from './DesktopSidebar';
import { MobileNav } from './MobileNav';

export const DashboardHeader = ({ className }: { className?: string }) => {
  const [mobileOptionsMenuOpen, setMobileOptionsMenuOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <>
      <DesktopSidebar
        className={className}
        sidebarExpanded={sidebarExpanded}
        onToggleSidebar={() => setSidebarExpanded((expanded) => !expanded)}
      />

      <MobileNav
        menuOpen={mobileOptionsMenuOpen}
        onToggleMenu={() => setMobileOptionsMenuOpen((open) => !open)}
        onCloseMenu={() => setMobileOptionsMenuOpen(false)}
      />
    </>
  );
};
