'use client';

import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { cn } from '@/utils/cn';

type PageThemeControlProps = {
  className?: string;
  /** `viewport`: esquina de la pantalla; `container`: dentro del layout de página. */
  placement?: 'container' | 'viewport';
};

/** Toggle de tema flotante en la esquina superior derecha. */
export function PageThemeControl({ className, placement = 'container' }: PageThemeControlProps) {
  return (
    <div
      className={cn(
        'pointer-events-none z-50',
        placement === 'viewport'
          ? 'fixed top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))]'
          : 'absolute top-4 right-4 z-20',
        className
      )}
    >
      <div className="pointer-events-auto">
        <ThemeToggle compact />
      </div>
    </div>
  );
}
