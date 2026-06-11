'use client';

import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { useTheme } from '@/features/theme/context/ThemeContext';

type ThemeToggleProps = {
  className?: string;
  compact?: boolean;
  onToggle?: () => void;
};

export function ThemeToggle({ className, compact = false, onToggle }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const label = isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro';

  const handleToggle = () => {
    toggleTheme();
    onToggle?.();
  };

  if (compact) {
    return (
      <button
        type="button"
        aria-label={label}
        title={label}
        onClick={handleToggle}
        className={cn(
          'border-surface-border/60 inline-flex cursor-pointer items-center justify-center rounded-xl border',
          'bg-surface-elevated/40 text-on-surface-muted p-2 shadow-sm backdrop-blur-sm',
          'hover:border-app-ring/40 hover:bg-surface-elevated/80 hover:text-app-accent transition-colors',
          'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          'focus-visible:ring-offset-surface',
          className
        )}
      >
        <Icon name={isDark ? 'sun' : 'moon'} size="lg" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={label}
      className={cn(
        'border-surface-border flex w-full cursor-pointer items-center justify-between rounded-xl border',
        'bg-surface-elevated/60 px-4 py-3 text-left transition-all duration-200',
        'hover:border-app-ring/30 hover:bg-surface-elevated',
        'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        'focus-visible:ring-offset-surface',
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'bg-surface-elevated text-on-surface-muted flex h-10 w-10 shrink-0',
            'items-center justify-center rounded-full'
          )}
        >
          <Icon name={isDark ? 'sun' : 'moon'} />
        </div>
        <div>
          <p className="text-on-surface text-base font-medium">Tema de la aplicación</p>
          <p className="text-on-surface-muted mt-0.5 text-sm leading-relaxed">
            {isDark ? 'Modo oscuro activo' : 'Modo claro activo'}
          </p>
        </div>
      </div>
      <span className="text-app-accent inline-flex items-center gap-2 text-sm font-semibold">
        {isDark ? 'Usar claro' : 'Usar oscuro'}
        <Icon name="chevron-right" size="sm" />
      </span>
    </button>
  );
}
