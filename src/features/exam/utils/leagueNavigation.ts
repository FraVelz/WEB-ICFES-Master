export const LIGAS_PATH = '/ligas';

/** Ruta legacy — redirige a {@link LIGAS_PATH} vía `next.config`. */
export const LEGACY_CLASIFICATORIA_PATH = '/clasificatoria';

export function getLigasHref(): string {
  return LIGAS_PATH;
}

export function isLigasRoute(pathname: string): boolean {
  const normalized = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  return normalized === LIGAS_PATH || normalized === LEGACY_CLASIFICATORIA_PATH;
}
