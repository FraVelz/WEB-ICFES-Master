'use client';

import Link from 'next/link';
import { cn } from '@/utils/cn';
import { LECTURA_SECTIONS } from '@/features/lectura/constants';
import { useLecturaRead } from '@/features/lectura/hooks/useLecturaRead';
import { AsideCard } from './AsideCard';
import { useDashboardShell } from './DashboardShellContext';

export function LecturaAsidePanels() {
  const { currentStreak } = useDashboardShell();
  const { readSections } = useLecturaRead();
  const totalSections = LECTURA_SECTIONS.length;
  const readCount = readSections.length;
  const pendingCount = Math.max(0, totalSections - readCount);

  return (
    <>
      <AsideCard title="Lectura guiada" icon="book-open">
        <p className="text-on-surface text-2xl font-bold">
          {readCount}/{totalSections}
        </p>
        <p className="text-on-surface-muted mt-1 text-sm">Secciones marcadas como leídas</p>
        <p className="text-on-surface-muted mt-3 text-xs leading-relaxed">
          {pendingCount > 0
            ? `${pendingCount} sección${pendingCount === 1 ? '' : 'es'} pendiente${pendingCount === 1 ? '' : 's'} por explorar.`
            : 'Has leído todas las secciones disponibles.'}
        </p>
      </AsideCard>

      <AsideCard title="Tu constancia" icon="fire">
        <p className="text-on-surface text-2xl font-bold">{currentStreak} días</p>
        <p className="text-on-surface-muted mt-1 text-sm">Racha activa mientras estudias en la app</p>
      </AsideCard>

      <AsideCard title="Explorar lectura" icon="graduation-cap">
        <Link
          href="/lectura"
          className={cn(
            'inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold',
            'bg-app-accent text-app-on-accent mb-2 transition-colors hover:brightness-110',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
          )}
        >
          Ver índice de lectura
        </Link>
        <Link
          href="/ruta-aprendizaje"
          className={cn(
            'inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold',
            'border-surface-border text-on-surface-muted hover:text-on-surface transition-colors hover:bg-surface-via',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
          )}
        >
          Ir a aprendizaje
        </Link>
      </AsideCard>
    </>
  );
}
