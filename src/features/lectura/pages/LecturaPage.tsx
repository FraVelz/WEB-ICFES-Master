'use client';

import { Icon } from '@/shared/components/Icon';
import { LecturaSectionCard } from '../components/LecturaSectionCard';
import { LECTURA_SECTIONS } from '../constants';
import { useLecturaRead } from '../hooks/useLecturaRead';

export function LecturaPage() {
  const { isRead, readSections } = useLecturaRead();
  const readCount = readSections.length;
  const totalCount = LECTURA_SECTIONS.length;

  return (
    <div className="relative z-10 mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
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
  );
}
