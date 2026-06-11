'use client';

import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { AsideCard } from './AsideCard';
import { useDashboardShell } from './DashboardShellContext';

export function AchievementsAsidePanels() {
  const { currentStreak, coins } = useDashboardShell();

  return (
    <>
      <AsideCard title="Tu progreso XP" icon="star">
        <p className="text-on-surface-muted text-sm">
          Completa retos en la ruta y simulacros para desbloquear medallas y subir de nivel.
        </p>
        <ul className="text-on-surface-muted mt-4 space-y-2 text-sm">
          <li className="flex justify-between gap-2">
            <span>Racha</span>
            <span className="text-on-surface font-semibold">{currentStreak} días</span>
          </li>
          <li className="flex justify-between gap-2">
            <span>Monedas</span>
            <span className="font-semibold text-yellow-500">{coins}</span>
          </li>
        </ul>
      </AsideCard>

      <AsideCard title="Consejo" icon="lightbulb">
        <p className="text-on-surface-muted text-sm leading-relaxed">
          Prioriza logros de racha y de fase: mantener constancia suele dar más XP que intentar todo de una vez.
        </p>
      </AsideCard>

      <AsideCard title="Ir a la ruta" icon="graduation-cap">
        <Link
          href="/ruta-aprendizaje"
          className={cn(
            'inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold',
            'bg-app-accent text-app-on-accent transition-colors hover:brightness-110',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
          )}
        >
          Continuar aprendiendo
          <Icon name="chevron-right" size="sm" />
        </Link>
      </AsideCard>
    </>
  );
}
