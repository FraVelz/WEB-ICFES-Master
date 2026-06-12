'use client';

import { Icon } from '@/shared/components/Icon';
import { LecturaSectionCard } from '../components/LecturaSectionCard';
import { LECTURA_PAGE_SHELL_CLASS, LECTURA_SECTIONS } from '../constants';
import { cn } from '@/utils/cn';
import { useLecturaRead } from '../hooks/useLecturaRead';
import { useContentVariant } from '@/features/content/components/ContentPageShell';

export function LecturaPage() {
  const variant = useContentVariant();
  const { isRead, readSections } = useLecturaRead();
  const readCount = variant === 'full' ? readSections.length : 0;
  const totalCount = LECTURA_SECTIONS.length;

  return (
    <div className={cn(LECTURA_PAGE_SHELL_CLASS, 'max-w-3xl space-y-6')}>
      <header className="space-y-2">
        <p className="text-on-surface-muted max-w-2xl leading-relaxed">
          Material informativo de solo lectura sobre el ICFES, el bachillerato y cómo prepararte. Elige una sección para
          explorar.
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
          <LecturaSectionCard
            key={section.id}
            section={section}
            isRead={variant === 'full' ? isRead(section.id) : false}
          />
        ))}
      </nav>
    </div>
  );
}
