const STUDY_PATH_PREFIXES = [
  '/ruta-aprendizaje',
  '/simulacro',
  '/practica/',
  '/examen-completo',
  '/lectura',
  '/importancia',
  '/informacion',
  '/consejos',
  '/evaluacion-nivel',
] as const;

export function isStudyPathname(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return STUDY_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix));
}
