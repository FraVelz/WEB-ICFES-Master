import React from 'react';
import { PathNode } from './PathNode';

// Mapeo de iconos por área
const AREA_ICONS = {
  'matematicas': 'calculator',
  'lectura-critica': 'book',
  'ciencias-naturales': 'flask',
  'sociales-ciudadanas': 'landmark',
  'ingles': 'globe',
  'examen-completo': 'brain'
};

export const AreaPath = ({ areaId, onNodeClick, colorClass, sections = [] }) => {
  const areaIcon = AREA_ICONS[areaId] || 'book';

  return (
    <div className="w-full max-w-md mx-auto pb-20 px-4">
      {sections.map((section, index) => (
        <div key={section.id} className="mb-12 relative">
          {/* Línea conectora vertical de la sección */}
          <div className="absolute left-8 top-12 bottom-0 w-1 bg-slate-800 -z-10" />

          {/* Header de la Sección */}
          <div className="mb-6 pl-4 border-l-4 border-slate-700 ml-2">
            <h3 className="text-lg font-bold text-white">{section.title}</h3>
            <p className="text-sm text-slate-400">{section.description}</p>
          </div>

          {/* Lista de Nodos */}
          <div className="space-y-6">
            {section.nodes.map((node, nodeIndex) => (
              <div key={node.id} className="relative pl-2">
                {/* Conector visual pequeño hacia el nodo */}
                <div className="absolute left-2 top-1/2 w-6 h-1 bg-slate-800 -z-10" />
                
                <PathNode
                  {...node}
                  icon={node.type === 'checkpoint' ? 'trophy' : areaIcon}
                  colorClass={colorClass}
                  onClick={() => onNodeClick(node)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
