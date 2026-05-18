import React from 'react';
import { PathNode } from './PathNode';

// Area → icon name
const AREA_ICONS: Record<string, string> = {
  matematicas: 'calculator',
  'lectura-critica': 'book',
  'ciencias-naturales': 'flask',
  'sociales-ciudadanas': 'landmark',
  ingles: 'globe',
  'examen-completo': 'brain',
};

export interface PathNodeData {
  id: string;
  title?: string;
  description?: string;
  type?: string;
  /** `/lessons/...` when `learning_content.content` has `topic_slug` or `topic` */
  lessonHref?: string;
  [key: string]: unknown;
}

export interface PathSection {
  id: string;
  title: string;
  description: string;
  nodes: PathNodeData[];
}

export interface AreaPathProps {
  areaId: string;
  onNodeClick: (node: PathNodeData) => void;
  colorClass: string;
  sections?: PathSection[];
}

export const AreaPath = ({ areaId, onNodeClick, colorClass, sections = [] }: AreaPathProps) => {
  const areaIcon = AREA_ICONS[areaId] ?? 'book';

  return (
    <div className="mx-auto w-full max-w-md px-4 pb-20">
      {sections.map((section: PathSection) => (
        <div key={section.id} className="relative mb-12">
          {/* Section vertical connector line */}
          <div className="absolute top-12 bottom-0 left-8 -z-10 w-1 bg-slate-800" />

          {/* Section header */}
          <div className="mb-6 ml-2 border-l-4 border-slate-700 pl-4">
            <h3 className="text-lg font-bold text-white">{section.title}</h3>
            <p className="text-sm text-slate-400">{section.description}</p>
          </div>

          {/* Nodes */}
          <div className="space-y-6">
            {section.nodes.map((node: PathNodeData) => (
              <div key={node.id} className="relative pl-2">
                {/* Small connector toward the node */}
                <div className="absolute top-1/2 left-2 -z-10 h-1 w-6 bg-slate-800" />

                <PathNode
                  {...node}
                  type={node.type === 'checkpoint' ? 'checkpoint' : 'lesson'}
                  icon={node.type === 'checkpoint' ? 'trophy' : areaIcon}
                  colorClass={colorClass}
                  lessonHref={typeof node.lessonHref === 'string' ? node.lessonHref : undefined}
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
