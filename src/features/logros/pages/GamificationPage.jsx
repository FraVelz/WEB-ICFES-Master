import { AdvancedGamificationHub } from '../components/AdvancedGamificationHub';

/**
 * Página de Gamificación Avanzada
 * Muestra badges, niveles, recompensas y logros
 */
export const GamificationPage = () => {
  return (
    <div className="min-h-[100dvh] bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <AdvanedGamificationHub />
      </div>
    </div>
  );
};
