import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

/**
 * Componente que muestra un temporizador del tiempo de demo disponible
 * Se muestra solo en modo demo
 */
export const DemoTimerBanner = ({ isDemoMode = false }) => {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isVisible, setIsVisible] = useState(isDemoMode);

  useEffect(() => {
    if (!isDemoMode) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);

    // Obtener tiempo de demo del localStorage
    const demoStartTime = localStorage.getItem('demoStartTime');
    const DEMO_DURATION = 3 * 60 * 1000; // 3 minutos en milisegundos

    const updateTimer = () => {
      if (!demoStartTime) {
        localStorage.setItem('demoStartTime', Date.now().toString());
        setTimeRemaining(DEMO_DURATION);
        return;
      }

      const elapsed = Date.now() - parseInt(demoStartTime);
      const remaining = Math.max(0, DEMO_DURATION - elapsed);

      setTimeRemaining(remaining);

      // Si se acabó el tiempo, redirigir
      if (remaining <= 0) {
        localStorage.removeItem('demoMode');
        localStorage.removeItem('demoStartTime');
        window.location.href = '/login';
      }
    };

    updateTimer();

    // Actualizar cada segundo
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [isDemoMode]);

  if (!isVisible || timeRemaining === null) {
    return null;
  }

  // Convertir milisegundos a minutos y segundos
  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);

  // Determinar color según tiempo restante
  const getColorClass = () => {
    if (minutes >= 2) return 'bg-green-500/90 border-green-400';
    if (minutes >= 1) return 'bg-yellow-500/90 border-yellow-400';
    if (seconds > 30) return 'bg-orange-500/90 border-orange-400';
    return 'bg-red-500/90 border-red-400 animate-pulse';
  };

  const getTextColor = () => {
    if (minutes >= 2) return 'text-green-100';
    if (minutes >= 1) return 'text-yellow-100';
    if (seconds > 30) return 'text-orange-100';
    return 'text-red-100';
  };

  return (
    <div
      className={`fixed top-0 md:top-auto md:bottom-0 left-0 right-0 z-50 border-b-2 md:border-b-0 md:border-t-2 transition-all duration-300 ${getColorClass()}`}
      style={{ paddingTop: '1rem', paddingBottom: '1rem', maxHeight: 'fit-content' }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faClock} className={`text-xl ${getTextColor()}`} />
          <div>
            <p className={`text-sm font-semibold ${getTextColor()}`}>
              Modo Demo Activo
            </p>
            <p className={`text-xs ${getTextColor()} opacity-80`}>
              Tiempo restante: <span className="font-bold text-base">{minutes}:{seconds.toString().padStart(2, '0')}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Barra de progreso visual */}
          <div className="hidden md:block w-32 h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                minutes >= 2
                  ? 'bg-green-300'
                  : minutes >= 1
                  ? 'bg-yellow-300'
                  :  seconds > 30
                  ? 'bg-orange-300'
                  : 'bg-red-300 animate-pulse'
              }`}
              style={{
                width: `${(timeRemaining / (3 * 60 * 1000)) * 100}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Mensaje adicional cuando quedan menos de 1 minuto */}
      {(minutes < 1 && timeRemaining > 0) && (
        <div className="bg-black/50 border-t md:border-t-0 md:border-b border-white/10 px-4 py-2 text-center">
          <p className="text-red-300 text-sm font-semibold animate-pulse">
            ⚠️ Tu sesión de demo expirará pronto. Por favor, crea una cuenta para continuar.
          </p>
        </div>
      )}

      {/* Espaciador para que el contenido no se superponga */}
      {isVisible && <div className="h-2" />}
    </div>
  );
};
