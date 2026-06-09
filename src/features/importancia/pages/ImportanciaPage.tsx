'use client';

import { Icon } from '@/shared/components/Icon';
import { PAGE_SHELL_CLASS } from '@/shared/constants/pageShell';
import { ImportanciaSection } from '../components/ImportanciaSection';
import { ImportanciaTrackPanel } from '../components/ImportanciaTrackPanel';
import {
  IMPORTANCIA_CLOSING,
  IMPORTANCIA_GENERAL_SECTIONS,
  IMPORTANCIA_INTRO,
  IMPORTANCIA_TRACKS,
} from '../data/importanciaContent';

export function ImportanciaPage() {
  return (
    <div className={PAGE_SHELL_CLASS}>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="from-app-ring/10 absolute top-0 left-0 h-96 w-full bg-linear-to-b to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto max-w-4xl space-y-10 px-4 py-8">
        <header className="space-y-2">
          <h1 className="text-on-surface flex items-center gap-3 text-3xl font-bold">
            <Icon name="info-circle" className="text-app-accent" />
            Importancia del ICFES y el bachiller
          </h1>
          <p className="text-on-surface-muted max-w-3xl leading-relaxed">{IMPORTANCIA_INTRO}</p>
        </header>

        {IMPORTANCIA_GENERAL_SECTIONS.map((section) => (
          <ImportanciaSection key={section.id} section={section} />
        ))}

        <div className="space-y-4">
          <h2 className="text-on-surface text-xl font-bold">Elige tu camino</h2>
          <p className="text-on-surface-muted text-sm leading-relaxed">
            Despliega el menú que corresponda a tu situación para ver requisitos, áreas y consejos específicos.
          </p>
          {IMPORTANCIA_TRACKS.map((track) => (
            <ImportanciaTrackPanel key={track.id} track={track} />
          ))}
        </div>

        <aside className="border-app-ring/20 bg-surface-elevated/60 rounded-2xl border p-6">
          <p className="text-on-surface leading-relaxed">{IMPORTANCIA_CLOSING}</p>
        </aside>
      </div>
    </div>
  );
}
