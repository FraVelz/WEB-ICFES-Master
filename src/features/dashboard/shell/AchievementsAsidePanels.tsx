'use client';

import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { useGamificationContext } from '@/hooks/gamification/GamificationContext';
import { getAchievementChainSummary } from '@/shared/constants/achievements/achievementChainDisplay';
import { getLevelInfo } from '@/services/gamification/gamificationUtils';
import { AsideCard } from './AsideCard';
import { useDashboardShell } from './DashboardShellContext';

export function AchievementsAsidePanels() {
  const { currentStreak, coins } = useDashboardShell();
  const { achievements, completedCount, totalXP, level, longestStreak, loading } = useGamificationContext();
  const levelInfo = getLevelInfo(totalXP);
  const summary = getAchievementChainSummary(achievements);

  return (
    <>
      <AsideCard title="Tu progreso XP" icon="star">
        <p className="text-on-surface text-2xl font-bold">
          Nivel {level}
          <span className="text-on-surface-muted ml-2 text-sm font-medium">({levelInfo.levelData.name})</span>
        </p>
        <p className="text-on-surface-muted mt-1 text-sm">{totalXP.toLocaleString('es-CO')} XP acumulados</p>
        <ul className="text-on-surface-muted mt-4 space-y-2 text-sm">
          <li className="flex justify-between gap-2">
            <span>Logros desbloqueados</span>
            <span className="text-on-surface font-semibold">
              {loading ? '…' : `${completedCount}/${summary.totalTiers}`}
            </span>
          </li>
          <li className="flex justify-between gap-2">
            <span>Metas en progreso</span>
            <span className="text-on-surface font-semibold">{loading ? '…' : summary.inProgressChains}</span>
          </li>
          <li className="flex justify-between gap-2">
            <span>Racha</span>
            <span className="text-on-surface font-semibold">{currentStreak} días</span>
          </li>
          <li className="flex justify-between gap-2">
            <span>Mejor racha</span>
            <span className="text-on-surface font-semibold">{longestStreak} días</span>
          </li>
          <li className="flex justify-between gap-2">
            <span>Monedas</span>
            <span className="font-semibold text-yellow-500">{coins.toLocaleString('es-CO')}</span>
          </li>
        </ul>
      </AsideCard>

      <AsideCard title="Consejo" icon="lightbulb">
        <p className="text-on-surface-muted text-sm leading-relaxed">
          {summary.inProgressChains > 0
            ? `Tienes ${summary.inProgressChains} meta${summary.inProgressChains === 1 ? '' : 's'} en camino. Completa lecciones y simulacros para subir de nivel.`
            : 'Prioriza logros de racha y de fase: mantener constancia suele dar más XP que intentar todo de una vez.'}
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
