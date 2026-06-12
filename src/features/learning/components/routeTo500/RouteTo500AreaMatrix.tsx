'use client';

import { useState } from 'react';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { AREA_INFO, type AreaId } from '@/shared/constants';
import { COMPETENCY_PHASES } from '@/features/learning/data/competencyPhases';

const AREA_IDS = Object.keys(AREA_INFO) as AreaId[];

export function RouteTo500AreaMatrix() {
  const [open, setOpen] = useState(false);

  return (
    <section aria-labelledby="route-matrix-title" className="border-surface-border bg-surface-elevated/60 rounded-2xl border">
      <button
        type="button"
        id="route-matrix-title"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'flex w-full items-center justify-between gap-3 px-4 py-4 text-left sm:px-5',
          'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
        )}
        aria-expanded={open}
      >
        <span className="text-on-surface text-base font-bold sm:text-lg">Qué significa cada fase por área</span>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} className="text-on-surface-muted shrink-0" />
      </button>

      {open ? (
        <div className="border-surface-border border-t px-2 pb-4 sm:px-4">
          <div className="overflow-x-auto">
            <table className="mt-3 w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="text-on-surface-muted border-surface-border border-b">
                  <th scope="col" className="px-2 py-2 font-semibold">
                    Área
                  </th>
                  {COMPETENCY_PHASES.map((phase) => (
                    <th key={phase.id} scope="col" className="px-2 py-2 font-semibold">
                      {phase.title.replace('Fase de ', '')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {AREA_IDS.map((areaId) => (
                  <tr key={areaId} className="border-surface-border/60 border-b last:border-0">
                    <th scope="row" className="text-on-surface px-2 py-3 align-top font-semibold">
                      {AREA_INFO[areaId].name}
                    </th>
                    {COMPETENCY_PHASES.map((phase) => (
                      <td key={phase.id} className="text-on-surface-muted px-2 py-3 align-top leading-relaxed">
                        {phase.areaFocus[areaId] ?? '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </section>
  );
}
