import React, { useState } from 'react';
import { AreaPath } from './AreaPath';
import { LessonPreview } from './LessonPreview';
import { LessonContentModal } from './LessonContentModal';
import { SecondaryHeader } from '../SecondaryHeader';
import { AREA_INFO } from '@/shared/constants';
import { useLearningPath } from '../../hooks/useLearningPath';

/**
 * Componente principal de la Ruta de Aprendizaje
 * Muestra el camino visual de progreso para el área seleccionada.
 * Ahora incluye el Header Secundario internamente.
 */
export const LearningRoadmap = ({ initialArea = 'lectura-critica' }) => {
  const [currentArea, setCurrentArea] = useState(initialArea);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [viewingLesson, setViewingLesson] = useState(null);
  
  const currentAreaData = AREA_INFO[currentArea] || AREA_INFO['lectura-critica'];
  
  // Hook para obtener datos de gamificación
  const { sections, loading, error } = useLearningPath(currentArea);
  
  const getColorClass = (gradient) => {
    if (gradient.includes('blue')) return 'bg-blue-500';
    if (gradient.includes('green')) return 'bg-green-500';
    if (gradient.includes('purple')) return 'bg-purple-500';
    if (gradient.includes('orange')) return 'bg-orange-500';
    if (gradient.includes('pink')) return 'bg-pink-500';
    if (gradient.includes('indigo')) return 'bg-indigo-500';
    return 'bg-slate-500';
  };

  const colorClass = getColorClass(currentAreaData.color);

  const handleNodeClick = (node) => {
    setSelectedLesson(node);
  };

  const handleStartLesson = (lesson) => {
    setSelectedLesson(null);
    setViewingLesson(lesson);
  };

  return (
    <div className={`bg-slate-950 flex flex-col relative ${viewingLesson ? 'h-dvh overflow-hidden' : 'min-h-dvh'}`}>
      {/* Header Secundario Sticky - Ahora parte del componente */}
      <div className="sticky top-0 z-50">
        <SecondaryHeader 
          currentArea={currentArea} 
          onAreaChange={setCurrentArea} 
        />
      </div>

      <div className="flex-1 relative pb-24 pt-8 px-4">
        {/* Título del Área (Contexto) */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <h2 className={`text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r ${currentAreaData.color}`}>
            {currentAreaData.name}
          </h2>
          <p className="text-slate-400 text-sm mt-2 font-medium tracking-wide uppercase">
            Ruta de Aprendizaje
          </p>
        </div>

        {/* Estado de Carga y Error */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {error && (
          <div className="text-center text-red-400 py-10">
            {error}
          </div>
        )}

        {/* Camino Visual */}
        {!loading && !error && (
          <AreaPath 
            areaId={currentArea} 
            onNodeClick={handleNodeClick}
            colorClass={colorClass}
            sections={sections}
          />
        )}

        {/* Modal de Previsualización */}
        <LessonPreview 
          isOpen={!!selectedLesson}
          onClose={() => setSelectedLesson(null)}
          lesson={selectedLesson}
          onStart={handleStartLesson}
        />

        {/* Modal de Contenido de Lección */}
        <LessonContentModal 
          isOpen={!!viewingLesson}
          onClose={() => setViewingLesson(null)}
          lesson={viewingLesson}
        />
      </div>
    </div>
  );
};
