import { AUTH_DEFAULT_REDIRECT } from '@/features/auth/constants/authRoutes';
import { LEGACY_CLASIFICATORIA_PATH, LIGAS_PATH } from '@/features/exam/utils/leagueNavigation';

const ALLOWED_PREFIXES = [
  '/ruta-aprendizaje',
  '/fases',
  LIGAS_PATH,
  LEGACY_CLASIFICATORIA_PATH,
  '/logros',
  '/perfil',
  '/configuracion',
  '/tienda',
  '/simulacro',
  '/simulacro-completo',
  '/practica',
  '/examen-completo',
  '/consejos',
  '/informacion',
  '/lectura',
  '/evaluacion-nivel',
  '/reset-password',
] as const;

/**
 * Evita open redirects en callbacks OAuth: solo rutas internas relativas.
 */
export function resolveSafeInternalRedirect(next: string | null | undefined): string {
  if (!next || typeof next !== 'string') return AUTH_DEFAULT_REDIRECT;

  const trimmed = next.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.includes('://')) {
    return AUTH_DEFAULT_REDIRECT;
  }

  const pathOnly = trimmed.split('?')[0]?.split('#')[0] ?? trimmed;
  const allowed = ALLOWED_PREFIXES.some((prefix) => pathOnly === prefix || pathOnly.startsWith(`${prefix}/`));

  return allowed ? trimmed : AUTH_DEFAULT_REDIRECT;
}
