'use client';

import { Icon } from '@/shared/components/Icon';
import { cn } from '@/utils/cn';
import type { ImportanciaTrack } from '../data/importanciaContent';
import { ImportanciaSection } from './ImportanciaSection';

type ImportanciaTrackPanelProps = {
  track: ImportanciaTrack;
};

export function ImportanciaTrackPanel({ track }: ImportanciaTrackPanelProps) {
  return (
    <details className="border-app-ring/20 bg-surface-elevated/40 group rounded-2xl border">
      <summary
        className={cn(
          'flex cursor-pointer list-none items-start gap-3 rounded-2xl p-5 transition-colors',
          'hover:bg-surface-elevated/60',
          '[&::-webkit-details-marker]:hidden'
        )}
      >
        <div className="bg-app-ring/15 text-app-accent flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
          <Icon name={track.icon} />
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <h2 className="text-on-surface text-lg font-bold">{track.title}</h2>
          <p className="text-on-surface-muted mt-1 text-sm leading-relaxed">{track.subtitle}</p>
        </div>
        <Icon
          name="chevron-down"
          className={cn(
            'text-on-surface-muted mt-1 shrink-0 transition-transform',
            'group-open:rotate-180'
          )}
        />
      </summary>

      <div className="border-app-ring/10 space-y-8 border-t px-5 pt-2 pb-6">
        {track.sections.map((section) => (
          <ImportanciaSection key={section.id} section={section} nested />
        ))}
      </div>
    </details>
  );
}
