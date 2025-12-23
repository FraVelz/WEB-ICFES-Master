import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { HomePageDesktop } from "./HomePageDesktop";
import { HomePageMobile } from "./HomePageMobile";

export const HomePageWrapper = () => {
  const { isMobile } = useIsMobile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [demoTimeLeft, setDemoTimeLeft] = useState(180);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Marcar fin de carga inicial después de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Contador para la demo - sincronizado con DemoTimerBanner
  useEffect(() => {
    if (!isDemoOpen) return;

    const DEMO_DURATION = 180 * 1000; // 180 segundos en milisegundos (3 minutos)

    const updateTimer = () => {
      const demoStartTime = localStorage.getItem('demoStartTime');
      if (!demoStartTime) return;

      const elapsed = Date.now() - parseInt(demoStartTime);
      const remaining = Math.max(0, DEMO_DURATION - elapsed);
      const remainingSeconds = Math.ceil(remaining / 1000);

      setDemoTimeLeft(remainingSeconds);

      if (remaining <= 0) {
        setIsDemoOpen(false);
        localStorage.removeItem('demoMode');
        localStorage.removeItem('demoStartTime');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [isDemoOpen]);

  const handleDemoAccess = () => {
    const startTime = Date.now();
    localStorage.setItem('demoStartTime', startTime.toString());
    localStorage.setItem('demoMode', 'true');
    setIsDemoOpen(true);
    setDemoTimeLeft(180); // 180 segundos
  };

  const handleStartDemo = () => {
    setIsDemoOpen(false);
    localStorage.setItem('demoMode', 'true');
    window.location.href = '/ruta-aprendizaje';
  };

  return isMobile ? (
    <HomePageMobile
      isInitialLoad={isInitialLoad}
      onDemoAccess={handleDemoAccess}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      isDemoOpen={isDemoOpen}
      setIsDemoOpen={setIsDemoOpen}
      demoTimeLeft={demoTimeLeft}
      onStartDemo={handleStartDemo}
      expandedFaq={expandedFaq}
      setExpandedFaq={setExpandedFaq}
    />
  ) : (
    <HomePageDesktop
      isInitialLoad={isInitialLoad}
      onDemoAccess={handleDemoAccess}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      isDemoOpen={isDemoOpen}
      setIsDemoOpen={setIsDemoOpen}
      demoTimeLeft={demoTimeLeft}
      onStartDemo={handleStartDemo}
      expandedFaq={expandedFaq}
      setExpandedFaq={setExpandedFaq}
    />
  );
};
