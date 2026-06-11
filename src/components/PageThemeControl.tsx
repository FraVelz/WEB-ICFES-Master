'use client';

import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { cn } from '@/utils/cn';

type PageThemeControlProps = {
  className?: string;
};

/** Toggle de tema dentro del apartado (absolute respecto al contenedor `relative` padre). */
export function PageThemeControl({ className }: PageThemeControlProps) {
  return (
    <div className={cn('pointer-events-none absolute top-4 right-4 z-20', className)}>
      <div className="pointer-events-auto">
        <ThemeToggle compact />
      </div>
    </div>
  );
}
