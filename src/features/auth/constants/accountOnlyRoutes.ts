/** Rutas disponibles solo con cuenta (no en modo demo). */
export const ACCOUNT_ONLY_PATHS = ['/clasificatoria', '/desafios-diarios', '/perfil', '/configuracion'] as const;

export type AccountOnlyPath = (typeof ACCOUNT_ONLY_PATHS)[number];

export function isAccountOnlyPath(pathname: string): boolean {
  return ACCOUNT_ONLY_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
