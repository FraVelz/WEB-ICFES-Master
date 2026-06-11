import { isNavPathActive, LECTURA_SUB_PATHS, type NavOption } from '@/components/DashboardHeader/constants';
import { isLessonRoute } from '@/features/learning/utils/lessonRoutes';

export type DashboardShellSection = 'learning' | 'achievements' | 'leaderboard' | 'lectura';

const SHELL_PREFIXES = [
  '/ruta-aprendizaje',
  '/fases',
  '/logros',
  '/clasificatoria',
  '/lectura',
  ...LECTURA_SUB_PATHS,
] as const;

export function isDashboardShellRoute(pathname: string): boolean {
  if (isLessonRoute(pathname)) return false;
  return SHELL_PREFIXES.some((prefix) => isNavPathActive(pathname, prefix));
}

export function resolveDashboardShellSection(pathname: string): DashboardShellSection {
  if (isNavPathActive(pathname, '/fases') || isNavPathActive(pathname, '/ruta-aprendizaje')) {
    return 'learning';
  }
  if (isNavPathActive(pathname, '/logros')) return 'achievements';
  if (isNavPathActive(pathname, '/clasificatoria')) return 'leaderboard';
  if (isNavPathActive(pathname, '/lectura') || LECTURA_SUB_PATHS.some((path) => isNavPathActive(pathname, path))) {
    return 'lectura';
  }
  return 'learning';
}

export function isLearningPhasesRoute(pathname: string): boolean {
  return isNavPathActive(pathname, '/fases');
}

/** Etiquetas del banner superior según apartado (img 2). */
export const SHELL_SECTION_META: Record<
  DashboardShellSection,
  { title: string; subtitle: string; gradient: string; icon: string }
> = {
  learning: {
    title: 'Ruta de aprendizaje',
    subtitle: 'Tu camino por fases',
    gradient: 'from-blue-600 to-indigo-700',
    icon: 'graduation-cap',
  },
  achievements: {
    title: 'Logros',
    subtitle: 'Metas, XP y medallas',
    gradient: 'from-violet-600 to-purple-800',
    icon: 'medal',
  },
  leaderboard: {
    title: 'Clasificatoria',
    subtitle: 'Liga semanal y ranking',
    gradient: 'from-amber-600 to-orange-700',
    icon: 'trophy',
  },
  lectura: {
    title: 'Lectura',
    subtitle: 'Material informativo ICFES',
    gradient: 'from-teal-600 to-cyan-800',
    icon: 'book-open',
  },
};

export function getActiveNavOption(pathname: string, options: NavOption[]): NavOption | undefined {
  return options.find((option) => {
    if (isNavPathActive(pathname, option.path)) return true;
    return option.activePaths?.some((path) => isNavPathActive(pathname, path)) ?? false;
  });
}
