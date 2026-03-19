/**
 * @deprecated Usar AnimatedReveal de @/shared/components/AnimatedReveal con GSAP
 * getAnimationStyle ha sido reemplazado por animaciones GSAP
 */

// Hook para lógica de demo
export const useDemoMode = () => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return { formatTime };
};
