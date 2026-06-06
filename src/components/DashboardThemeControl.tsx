'use client';

import { ThemeToggle } from '@/shared/components/ThemeToggle';

/** Tema accesible en todas las rutas del dashboard (escritorio). */
export function DashboardThemeControl() {
  return (
    <div className="pointer-events-none fixed top-4 right-4 z-40 hidden lg:block">
      <div className="pointer-events-auto">
        <ThemeToggle compact />
      </div>
    </div>
  );
}
