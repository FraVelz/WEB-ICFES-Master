import { LIGAS_PATH } from '@/features/exam/utils/leagueNavigation';

/** Rutas del dashboard que requieren sesión (cuenta o demo). */
const PROTECTED_DASHBOARD_PREFIXES = [
  '/ruta-aprendizaje',
  '/ruta-al-500',
  '/fases',
  LIGAS_PATH,
  '/logros',
  '/perfil',
  '/configuracion',
  '/tienda',
  '/simulacro',
  '/simulacro-completo',
  '/practica',
  '/examen-completo',
  '/evaluacion-nivel',
  '/dev',
] as const;

const PUBLIC_PROFILE_PREFIX = '/perfil/public';

export function isProtectedDashboardPath(pathname: string): boolean {
  const path = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;

  if (path.startsWith(PUBLIC_PROFILE_PREFIX)) return false;

  return PROTECTED_DASHBOARD_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}
