'use client';

import Link from 'next/link';
import { cn } from '@/utils/cn';
import { AsideCard } from './AsideCard';
import { useDashboardShell } from './DashboardShellContext';

export function LecturaAsidePanels() {
  const { currentStreak } = useDashboardShell();

  return (
    <>
      <AsideCard title="Lectura guiada" icon="book-open">
        <p className="text-on-surface-muted text-sm leading-relaxed">
          Material de solo lectura sobre el ICFES, el bachillerato y cómo prepararte sin presión de examen.
        </p>
      </AsideCard>

      <AsideCard title="Tu constancia" icon="fire">
        <p className="text-on-surface text-2xl font-bold">{currentStreak} días</p>
        <p className="text-on-surface-muted mt-1 text-sm">Racha activa mientras estudias en la app</p>
      </AsideCard>

      <AsideCard title="Practicar" icon="graduation-cap">
        <Link
          href="/ruta-aprendizaje"
          className={cn(
            'inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold',
            'bg-app-accent text-app-on-accent transition-colors hover:brightness-110',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
          )}
        >
          Ir a aprendizaje
        </Link>
      </AsideCard>
    </>
  );
}
