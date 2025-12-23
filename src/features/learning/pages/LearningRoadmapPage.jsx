import { LearningRoadmap } from '@/features/learning/components';

/**
 * Página de Ruta de Aprendizaje
 * Contenedor principal que renderiza el componente LearningRoadmap.
 * El header secundario y la lógica de áreas ahora viven dentro de LearningRoadmap.
 */
export const LearningRoadmapPage = () => {
  return (
    <div className="min-h-[100dvh] bg-slate-950">
      <LearningRoadmap />
    </div>
  );
};
