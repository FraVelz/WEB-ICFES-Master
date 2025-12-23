// Hook para calcular estilos de animación
export const getAnimationStyle = (isVisible, isInitialLoad, delay = 0) => {
  const easing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  const duration = '0.8s';
  
  if (isInitialLoad) {
    return {
      animation: `slideInUp ${duration} ${easing} ${delay}s forwards`,
      willChange: 'transform, opacity'
    };
  }
  
  if (isVisible) {
    return {
      animation: `slideInUp ${duration} ${easing} ${delay}s forwards`,
      willChange: 'transform, opacity'
    };
  }
  
  return { 
    opacity: 0, 
    transform: 'translateY(40px)',
    willChange: 'transform, opacity'
  };
};

// Hook para lógica de demo
export const useDemoMode = () => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return { formatTime };
};
