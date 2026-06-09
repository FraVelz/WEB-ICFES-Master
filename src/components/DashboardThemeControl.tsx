'use client';

import { ThemeToggle } from '@/shared/components/ThemeToggle';

/** Tema flotante en escritorio; en móvil el layout usa barra inferior y /configuracion. */
export function DashboardThemeControl() {
  return (
    <div className="pointer-events-none fixed top-4 right-4 z-50 hidden lg:block">
      <div className="pointer-events-auto">
        <ThemeToggle compact />
      </div>
    </div>
  );
}
