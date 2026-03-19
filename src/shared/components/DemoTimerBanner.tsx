import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

/**
 * Componente que indica que el usuario está en modo demo
 * Se muestra solo en modo demo
 */
export const DemoTimerBanner = ({ isDemoMode = false }) => {
  if (!isDemoMode) return null;

  return (
    <div
      className="fixed top-0 md:top-auto md:bottom-0 left-0 right-0 z-50 border-b-2 md:border-b-0 md:border-t-2 bg-cyan-500/90 border-cyan-400 transition-all duration-300"
      style={{ paddingTop: '1rem', paddingBottom: '1rem', maxHeight: 'fit-content' }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faPlay} className="text-xl text-cyan-100" />
          <p className="text-sm font-semibold text-cyan-100">
            Modo Demo Activo
          </p>
        </div>
      </div>
    </div>
  );
};
