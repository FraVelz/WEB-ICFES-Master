import { AdvancedGamificationHub } from '../components/AdvancedGamificationHub';

/**
 * Página de Gamificación Avanzada
 * Muestra badges, niveles, recompensas y logros
 */
export const GamificationPage = () => {
  return (
    <div className="min-h-dvh bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 px-4 pt-24 pb-12 md:px-8">
      <div className="mx-auto max-w-7xl">
        <AdvanedGamificationHub />
      </div>
    </div>
  );
};
