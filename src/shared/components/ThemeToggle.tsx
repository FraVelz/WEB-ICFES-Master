'use client';

import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { useTheme } from '@/features/theme/context/ThemeContext';

type ThemeToggleProps = {
  className?: string;
  compact?: boolean;
  menuItem?: boolean;
  navBar?: boolean;
  sidebar?: boolean;
  sidebarExpanded?: boolean;
  onToggle?: () => void;
};

export function ThemeToggle({
  className,
  compact = false,
  menuItem = false,
  navBar = false,
  sidebar = false,
  sidebarExpanded = true,
  onToggle,
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const label = isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro';

  const handleToggle = () => {
    toggleTheme();
    onToggle?.();
  };

  if (navBar) {
    return (
      <button
        type="button"
        aria-label={label}
        title={label}
        onClick={handleToggle}
        className={cn(
          'text-on-surface-muted flex h-20 w-16 flex-col items-center justify-center rounded-lg transition-all duration-300',
          'hover:text-app-accent focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
          'focus-visible:ring-offset-surface-elevated focus-visible:ring-offset-2',
          className
        )}
      >
        <Icon name={isDark ? 'sun' : 'moon'} size="xl" className="mb-1" />
      </button>
    );
  }

  if (sidebar) {
    return (
      <button
        type="button"
        onClick={handleToggle}
        aria-label={label}
        title={!sidebarExpanded ? label : undefined}
        className={cn(
          'mt-2 flex h-10 w-full cursor-pointer items-center rounded-xl p-2',
          'text-on-surface-muted hover:bg-surface-elevated/60 hover:text-app-accent transition-colors',
          sidebarExpanded ? 'gap-3 px-2' : 'justify-center',
          'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          'focus-visible:ring-offset-surface-elevated',
          className
        )}
      >
        <Icon name={isDark ? 'sun' : 'moon'} size="lg" className="shrink-0" />
        {sidebarExpanded && (
          <>
            <span className="flex-1 text-left text-sm font-medium">Apariencia</span>
            <span className="text-on-surface-muted text-xs">{isDark ? 'Oscuro' : 'Claro'}</span>
          </>
        )}
      </button>
    );
  }

  if (menuItem) {
    return (
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          'hover:bg-app-ring/10 active:bg-app-ring/20 flex w-full cursor-pointer items-center gap-4 px-6 py-4',
          'text-on-surface transition-colors',
          'focus-visible:ring-app-accent rounded-lg focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
          className
        )}
      >
        <Icon name={isDark ? 'sun' : 'moon'} size="xl" className="text-app-accent" />
        <span className="flex flex-1 items-center justify-between text-lg font-semibold">
          Apariencia
          <span className="text-on-surface-muted text-sm font-medium">{isDark ? 'Oscuro' : 'Claro'}</span>
        </span>
      </button>
    );
  }

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
        <div className="group-hover:text-app-accent bg-surface-elevated text-on-surface-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
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
