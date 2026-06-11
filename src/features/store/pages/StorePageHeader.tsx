'use client';

import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components';
import { ThemeToggle } from '@/shared/components/ThemeToggle';

type StorePageHeaderProps = {
  coins: number;
  loading: boolean;
};

export function StorePageHeader({ coins, loading }: StorePageHeaderProps) {
  return (
    <div
      className={cn(
        'border-surface-border bg-surface-elevated/95 relative z-20 flex shrink-0 items-center',
        'justify-between border-b p-4 backdrop-blur-md lg:p-6'
      )}
    >
      <div className="flex w-10 shrink-0 justify-start lg:w-12">
        <ThemeToggle compact />
      </div>
      <div className="flex flex-1 items-center justify-center gap-3">
        <h1 className="text-on-surface text-xl font-bold lg:text-2xl">Tienda</h1>
        <div
          className={cn(
            'flex items-center gap-2 rounded-full border border-amber-600/35 bg-amber-100 px-3 py-1.5',
            'dark:border-yellow-500/30 dark:bg-yellow-500/10'
          )}
        >
          <Icon name="coins" size="md" className="text-sm text-amber-800 lg:text-base dark:text-yellow-400" />
          <span className="text-sm font-bold text-amber-800 lg:text-base dark:text-yellow-400">
            {loading ? '…' : coins}
          </span>
        </div>
      </div>
      <Link
        href="/ruta-aprendizaje"
        aria-label="Cerrar tienda"
        className={cn(
          'text-on-surface-muted hover:bg-surface-elevated hover:text-on-surface -mr-2 shrink-0',
          'cursor-pointer rounded-full p-2 transition-colors',
          'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          'focus-visible:ring-offset-surface-elevated'
        )}
      >
        <Icon name="times" size="xl" className="text-lg lg:text-xl" />
      </Link>
    </div>
  );
}
