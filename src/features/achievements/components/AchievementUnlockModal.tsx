'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { useDialogA11y } from '@/shared/hooks/useDialogA11y';
import { gsap } from '@/lib/gsap';
import { ACHIEVEMENT_CATEGORIES, type AchievementCategoryKey } from '@/shared/constants/achievements/achievementCategories';
import type { AchievementUnlockPayload } from '@/services/achievements/achievementUnlockEvents';

type AchievementUnlockModalProps = {
  achievement: AchievementUnlockPayload | null;
  isOpen: boolean;
  onClose: () => void;
  queueCount?: number;
};

function getCategoryLabel(category: string): string {
  const meta = ACHIEVEMENT_CATEGORIES[category as AchievementCategoryKey];
  return meta?.label ?? 'Logro';
}

export function AchievementUnlockModal({
  achievement,
  isOpen,
  onClose,
  queueCount = 0,
}: AchievementUnlockModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useDialogA11y(isOpen, onClose, contentRef);

  useEffect(() => {
    if (!isOpen || !overlayRef.current || !contentRef.current) return;
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, scale: 0.92, y: 16 },
      { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'back.out(1.4)' }
    );
  }, [isOpen, achievement?.id]);

  if (!isOpen || !achievement) return null;

  const categoryLabel = getCategoryLabel(achievement.category);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
    >
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="achievement-unlock-title"
        aria-describedby="achievement-unlock-description"
        className={cn(
          'border-amber-500/30 bg-surface-elevated relative w-full max-w-md overflow-hidden rounded-3xl border',
          'shadow-2xl shadow-amber-500/10 dark:border-amber-500/25'
        )}
      >
        <div className="from-amber-500/20 via-app-ring/10 absolute inset-x-0 top-0 h-32 bg-linear-to-b to-transparent" />

        <div className="relative px-6 pt-8 pb-6 text-center">
          <p className="text-app-accent-strong dark:text-app-accent mb-2 text-xs font-bold tracking-[0.2em] uppercase">
            ¡Logro desbloqueado!
          </p>

          <div
            className={cn(
              'mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border',
              'border-amber-500/40 bg-amber-50 text-amber-700 shadow-lg shadow-amber-500/15',
              'dark:border-yellow-500/35 dark:bg-yellow-500/10 dark:text-yellow-300'
            )}
          >
            <Icon name={achievement.icon} className="text-4xl" />
          </div>

          <span
            className={cn(
              'mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
              'bg-app-ring/15 text-app-accent-strong dark:text-app-accent'
            )}
          >
            <Icon name="trophy" size="sm" />
            {categoryLabel}
          </span>

          <h2 id="achievement-unlock-title" className="text-on-surface text-2xl font-bold">
            {achievement.title}
          </h2>

          <p id="achievement-unlock-description" className="text-on-surface-muted mt-3 text-sm leading-relaxed">
            {achievement.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold">
            {achievement.xpReward > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-100 px-3 py-1.5 text-cyan-900 dark:bg-cyan-500/15 dark:text-cyan-200">
                <Icon name="star" size="sm" />+{achievement.xpReward} XP
              </span>
            )}
            {achievement.coinsReward > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-amber-900 dark:bg-yellow-500/15 dark:text-yellow-200">
                <Icon name="coins" size="sm" />+{achievement.coinsReward.toLocaleString('es-CO')}
              </span>
            )}
          </div>

          {queueCount > 0 && (
            <p className="text-on-surface-muted mt-4 text-xs">
              {queueCount} logro{queueCount === 1 ? '' : 's'} más por ver
            </p>
          )}

          <button
            type="button"
            onClick={onClose}
            className={cn(
              'mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3',
              'bg-app-accent text-app-on-accent text-sm font-bold transition hover:brightness-110',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              'focus-visible:ring-offset-surface-elevated'
            )}
          >
            ¡Genial!
            <Icon name="chevron-right" size="sm" />
          </button>
        </div>
      </div>
    </div>
  );
}
