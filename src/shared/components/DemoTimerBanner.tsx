import { Icon } from '@/shared/components/Icon';

/**
 * Componente que indica que el usuario está en modo demo
 * Se muestra solo en modo demo
 */
export const DemoTimerBanner = ({ isDemoMode = false }) => {
  if (!isDemoMode) return null;

  return (
    <div
      className="fixed top-0 right-0 left-0 z-50 border-b-2 border-cyan-400 bg-cyan-500/90 transition-all duration-300 md:top-auto md:bottom-0 md:border-t-2 md:border-b-0"
      style={{
        paddingTop: '1rem',
        paddingBottom: '1rem',
        maxHeight: 'fit-content',
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-3">
        <div className="flex items-center gap-3">
          <Icon name="play" className="text-xl text-cyan-100" />
          <p className="text-sm font-semibold text-cyan-100">
            Modo Demo Activo
          </p>
        </div>
      </div>
    </div>
  );
};
