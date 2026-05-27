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
      className={cn('mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md sm:p-6', className)}
    >
      {title && (
        <h2 className="mb-6 flex items-center gap-3 border-b border-slate-800 pb-4 text-lg font-bold text-white sm:text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-app-accent shadow-inner">
            <Icon name={icon ?? 'settings'} />
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
        'group flex flex-col justify-between rounded-xl border p-4 transition-all duration-200 sm:flex-row sm:items-center',
        danger
          ? 'cursor-pointer border-red-500/20 bg-red-500/5 hover:border-red-500/30 hover:bg-red-500/10'
          : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/60',
        onClick &&
          'outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
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
                : 'bg-slate-700/50 text-slate-400 group-hover:bg-slate-700 group-hover:text-app-accent'
            )}
          >
            <Icon name={icon ?? 'settings'} />
          </div>
        )}
        <div>
          <h3 className={cn('text-base font-medium', danger ? 'text-red-400' : 'text-slate-200')}>{label}</h3>
          {description && <p className="mt-0.5 text-sm leading-relaxed text-slate-400">{description}</p>}
        </div>
      </div>
      <div className="flex w-full items-center justify-end pl-14 sm:w-auto sm:pl-0">{action}</div>
    </div>
  );
}
