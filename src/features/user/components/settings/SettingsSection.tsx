import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import type { ReactNode } from 'react';

export function SettingsSection({
  title,
  icon,
  children,
  className = '',
}: {
  title?: string;
  icon?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'border-surface-border bg-surface-elevated/80 mb-6 rounded-2xl border p-5 backdrop-blur-md sm:p-6',
        className
      )}
    >
      {title && (
        <h2
          className={cn(
            'border-surface-border text-on-surface mb-6 flex items-center gap-3 border-b',
            'pb-4 text-lg font-bold sm:text-xl'
          )}
        >
          <div
            className={cn(
              'text-app-accent bg-surface-elevated flex h-8 w-8 items-center justify-center',
              'rounded-lg shadow-inner'
            )}
          >
            <Icon name={icon ?? 'cog'} />
          </div>
          {title}
        </h2>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function SettingOption({
  label,
  description,
  icon,
  action,
  danger = false,
  onClick,
}: {
  label: string;
  description?: string;
  icon?: string;
  action: ReactNode;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? label : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={cn(
        'group flex flex-col justify-between rounded-xl border ' +
          'p-4 transition-all duration-200 sm:flex-row sm:items-center',
        danger
          ? 'cursor-pointer border-red-500/20 bg-red-500/5 hover:border-red-500/30 hover:bg-red-500/10'
          : 'border-surface-border bg-surface-elevated/70 hover:border-surface-border hover:bg-surface-elevated',
        onClick && 'focus-visible:ring-offset-surface outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        onClick && (danger ? 'focus-visible:ring-red-400' : 'focus-visible:ring-app-accent')
      )}
    >
      <div className="mb-3 flex items-start gap-4 sm:mb-0">
        {icon && (
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors',
              danger
                ? 'bg-red-500/10 text-red-400 group-hover:bg-red-500/20'
                : 'group-hover:text-app-accent bg-surface-elevated text-on-surface-muted ' +
                    'group-hover:bg-surface-elevated'
            )}
          >
            <Icon name={icon ?? 'cog'} />
          </div>
        )}
        <div>
          <h3 className={cn('text-base font-medium', danger ? 'text-red-400' : 'text-on-surface')}>{label}</h3>
          {description && <p className="text-on-surface-muted mt-0.5 text-sm leading-relaxed">{description}</p>}
        </div>
      </div>
      <div className="flex w-full items-center justify-end pl-14 sm:w-auto sm:pl-0">{action}</div>
    </div>
  );
}
