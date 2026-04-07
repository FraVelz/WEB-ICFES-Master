'use client';

import { useState } from 'react';

import { HomePageDesktop } from './HomePageDesktop';
import { HomePageMobile } from './HomePageMobile';

/**
 * Móvil/desktop con CSS (breakpoints Tailwind), no JS con window:
 * mismo HTML en servidor y cliente → sin mismatch de hidratación.
 * Resize en PC actualiza la vista sin listeners.
 */
export const HomePage = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleDemoAccess = () => {
    localStorage.setItem('demoMode', 'true');
    window.location.href = '/ruta-aprendizaje';
  };

  return (
    <>
      {/* Background glow effects - Fixed to viewport */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-1/3 left-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-600/30 blur-3xl"></div>
        <div className="absolute right-1/4 bottom-1/3 h-96 w-96 animate-pulse rounded-full bg-purple-600/30 blur-3xl"></div>
        <div className="absolute top-2/3 left-3/4 h-72 w-72 animate-pulse rounded-full bg-indigo-600/20 blur-3xl"></div>
      </div>

      <div className="md:hidden">
        <HomePageMobile />
      </div>
      <div className="hidden md:block">
        <HomePageDesktop onDemoAccess={handleDemoAccess} expandedFaq={expandedFaq} setExpandedFaq={setExpandedFaq} />
      </div>
    </>
  );
};
