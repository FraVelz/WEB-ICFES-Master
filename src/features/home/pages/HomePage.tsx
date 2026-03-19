import { useState, useEffect } from "react";

import { useIsMobile } from "@/hooks/useIsMobile";
import { HomePageDesktop } from "./HomePageDesktop";
import { HomePageMobile } from "./HomePageMobile";

export const HomePage = () => {
  const { isMobile } = useIsMobile();

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Marcar fin de carga inicial después de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleDemoAccess = () => {
    localStorage.setItem('demoMode', 'true');
    window.location.href = '/ruta-aprendizaje';
  };

  return isMobile ? (
    <HomePageMobile />
  ) : (
    <HomePageDesktop
      isInitialLoad={isInitialLoad}
      onDemoAccess={handleDemoAccess}
      expandedFaq={expandedFaq}
      setExpandedFaq={setExpandedFaq}
    />
  );
};
