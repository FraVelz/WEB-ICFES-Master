import { LearningRoadmap } from '@/features/learning/components';

/**
 * Página de Ruta de Aprendizaje
 * Muestra la ruta estructurada por áreas y niveles
 */
export const LearningRoadmapPage = () => {
  return (
    <div className="min-h-[100dvh] bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 p-0">
      <div className="max-w-7xl mx-auto">
        <LearningRoadmap />
      </div>
    </div>
  );
};
