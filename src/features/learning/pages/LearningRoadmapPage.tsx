import { LearningRoadmap } from '@/features/learning/components';
import { ChatAssistant } from '@/features/learning/components/ChatAssistant/ChatAssistant';

/**
 * Página de Ruta de Aprendizaje
 * Muestra la ruta estructurada por áreas y niveles
 */
export const LearningRoadmapPage = () => {
  return (
    <>
      <div className="min-h-dvh bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 p-0">
        <div className="mx-auto max-w-7xl">
          <LearningRoadmap />
        </div>
      </div>

      <ChatAssistant />
    </>
  );
};
