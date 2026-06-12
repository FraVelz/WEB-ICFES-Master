import type { ReactNode } from 'react';

type ProfileMainGridProps = {
  stats: ReactNode;
  courses: ReactNode;
  store: ReactNode;
  league: ReactNode;
  achievements: ReactNode;
};

/**
 * Layout de perfil (privado y público):
 * - Arriba: estadísticas + cursos (2/3) | torneo (1/3)
 * - Colección tienda: ancho completo
 * - Logros: ancho completo
 */
export function ProfileMainGrid({ stats, courses, store, league, achievements }: ProfileMainGridProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2">
          {stats}
          {courses}
        </div>
        <div className="lg:col-span-1">{league}</div>
      </div>

      {store}
      {achievements}
    </div>
  );
}
