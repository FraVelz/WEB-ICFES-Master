/** Rutas del dashboard que requieren sesión (cuenta o demo). */
export const PROTECTED_DASHBOARD_PREFIXES = [
  '/ruta-aprendizaje',
  '/fases',
  '/clasificatoria',
  '/logros',
  '/perfil',
  '/configuracion',
  '/tienda',
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
