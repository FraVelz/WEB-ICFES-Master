'use client';

import { useState } from 'react';

import { useIsMobile } from '@/hooks/useIsMobile';
import { HomePageDesktop } from './HomePageDesktop';
import { HomePageMobile } from './HomePageMobile';

export const HomePage = () => {
  const { isMobile } = useIsMobile();

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleDemoAccess = () => {
    localStorage.setItem('demoMode', 'true');
    window.location.href = '/ruta-aprendizaje';
  };

  return isMobile ? (
    <HomePageMobile />
  ) : (
    <HomePageDesktop
      onDemoAccess={handleDemoAccess}
      expandedFaq={expandedFaq}
      setExpandedFaq={setExpandedFaq}
    />
  );
};
