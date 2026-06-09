'use client';

import { Icon } from '@/shared/components/Icon';
import { PAGE_SHELL_CLASS } from '@/shared/constants/pageShell';
import { LecturaSectionCard } from '../components/LecturaSectionCard';
import { LECTURA_SECTIONS } from '../constants';
import { useLecturaRead } from '../hooks/useLecturaRead';

export function LecturaPage() {
  const { isRead, readSections } = useLecturaRead();
  const readCount = readSections.length;
  const totalCount = LECTURA_SECTIONS.length;

  return (
    <div className={PAGE_SHELL_CLASS}>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="from-app-ring/10 absolute top-0 left-0 h-96 w-full bg-linear-to-b to-transparent" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto max-w-3xl space-y-8 px-4 py-8">
        <header className="space-y-2">
          <h1 className="text-on-surface flex items-center gap-3 text-3xl font-bold">
            <Icon name="book-open" className="text-app-accent" />
            Lectura
          </h1>
          <p className="text-on-surface-muted max-w-2xl leading-relaxed">
            Material informativo de solo lectura sobre el ICFES, el bachillerato y cómo prepararte. Elige una sección
            para explorar.
          </p>
          {readCount > 0 && (
            <p className="text-on-surface-muted text-sm">
              <Icon name="check-circle" className="mr-1 inline text-emerald-400" />
              {readCount} de {totalCount} secciones leídas
            </p>
          )}
        </header>

        <nav className="space-y-3" aria-label="Secciones de lectura">
          {LECTURA_SECTIONS.map((section) => (
            <LecturaSectionCard key={section.id} section={section} isRead={isRead(section.id)} />
          ))}
        </nav>
      </div>
    </div>
  );
}
