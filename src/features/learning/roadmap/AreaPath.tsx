import React from 'react';
import { cn } from '@/utils/cn';
import { getPhase1BlockDef } from '@/features/learning/data/phase1Blocks';
import type { LessonPathStatus } from '@/features/learning/utils/lessonPathStatus';
import type { AreaId } from '@/shared/constants';
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
  moduleType?: string;
  status?: LessonPathStatus;
  blockId?: string;
  lessonIds?: string[];
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
  /** Oculta el encabezado inline; la etapa se muestra en el banner secundario. */
  hideSectionHeader?: boolean;
}

type BlockGroup = {
  blockId: string | null;
  title: string;
  nodes: PathNodeData[];
};

function groupNodesByBlock(areaId: string, nodes: PathNodeData[]): BlockGroup[] {
  const groups: BlockGroup[] = [];
  let current: BlockGroup | null = null;

  for (const node of nodes) {
    const blockId = typeof node.blockId === 'string' ? node.blockId : null;
    const isNewGroup = !current || current.blockId !== blockId;

    if (isNewGroup) {
      const blockDef: ReturnType<typeof getPhase1BlockDef> = blockId
        ? getPhase1BlockDef(areaId as AreaId, blockId)
        : undefined;
      const nextGroup: BlockGroup = {
        blockId,
        title: blockDef?.title ?? (blockId ? blockId : 'Inicio'),
        nodes: [],
      };
      current = nextGroup;
      groups.push(nextGroup);
    }

    current?.nodes.push(node);
  }

  return groups;
}

function getBlockProgress(nodes: PathNodeData[]): { completed: number; total: number } {
  const lessons = nodes.filter((node) => node.type !== 'checkpoint');
  const total = lessons.length;
  const completed = lessons.filter((node) => node.status === 'completed').length;
  return { completed, total };
}

export const AreaPath = ({
  areaId,
  onNodeClick,
  colorClass,
  sections = [],
  hideSectionHeader = false,
}: AreaPathProps) => {
  const areaIcon = AREA_ICONS[areaId] ?? 'book';

  return (
    <div className="mx-auto w-full max-w-md px-4 pb-20">
      {sections.map((section: PathSection) => (
        <div key={section.id} className="relative mb-12">
          <div
            className={cn('bg-surface-overlay absolute top-12 bottom-0 left-8 -z-10 w-1', hideSectionHeader && 'top-4')}
          />

          {!hideSectionHeader && (
            <div className="border-surface-border mb-6 ml-2 border-l-4 pl-4">
              <h3 className="text-lg font-bold text-white">{section.title}</h3>
              <p className="text-on-surface-muted text-sm">{section.description}</p>
            </div>
          )}

          <div className="space-y-8">
            {groupNodesByBlock(areaId, section.nodes).map((group) => {
              const { completed, total } = getBlockProgress(group.nodes);
              const isLocked = group.nodes.every((node) => node.status === 'locked');

              return (
                <div key={`${section.id}-${group.blockId ?? 'intro'}`} className="space-y-4">
                  {group.blockId && (
                    <div
                      className={cn(
                        'border-surface-border ml-2 rounded-xl border px-4 py-3',
                        isLocked ? 'bg-surface-elevated/30 opacity-70' : 'bg-surface-elevated/50'
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold tracking-wide text-amber-400/90 uppercase">Bloque</p>
                          <h4 className="text-base font-bold text-white">{group.title}</h4>
                        </div>
                        <span className="text-on-surface-muted text-sm font-medium">
                          {completed}/{total}
                        </span>
                      </div>
                      {isLocked && (
                        <p className="text-on-surface-muted mt-2 text-xs">
                          Aprueba el examen del bloque anterior para desbloquear estas lecciones.
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-6">
                    {group.nodes.map((node: PathNodeData) => (
                      <div key={node.id} className="relative pl-2">
                        <div className="bg-surface-overlay absolute top-1/2 left-2 -z-10 h-1 w-6" />

                        <PathNode
                          {...node}
                          type={
                            node.type === 'checkpoint'
                              ? 'checkpoint'
                              : node.type === 'minimum-requirements'
                                ? 'minimum-requirements'
                                : 'lesson'
                          }
                          icon={
                            node.type === 'checkpoint'
                              ? 'trophy'
                              : node.type === 'minimum-requirements'
                                ? 'clipboard-list'
                                : areaIcon
                          }
                          colorClass={colorClass}
                          onClick={() => {
                            if (node.status === 'locked') return;
                            onNodeClick(node);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
