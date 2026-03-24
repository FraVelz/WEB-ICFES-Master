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
      <div className="md:hidden">
        <HomePageMobile />
      </div>
      <div className="hidden md:block">
        <HomePageDesktop
          onDemoAccess={handleDemoAccess}
          expandedFaq={expandedFaq}
          setExpandedFaq={setExpandedFaq}
        />
      </div>
    </>
  );
};
