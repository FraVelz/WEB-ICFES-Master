'use client';

import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';

type AsideCardProps = {
  title: string;
  icon: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

export function AsideCard({ title, icon, children, action, className }: AsideCardProps) {
  return (
    <section
      className={cn(
        'border-surface-border bg-surface-elevated/80 rounded-2xl border p-5 shadow-sm',
        'dark:border-slate-800 dark:bg-slate-900/50',
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-on-surface flex items-center gap-2 text-sm font-bold tracking-wide uppercase">
          <Icon name={icon} className="text-app-accent" size="sm" />
          {title}
        </h3>
        {action}
      </div>
      {children}
    </section>
  );
}
