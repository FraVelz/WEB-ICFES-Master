export type NavOption = {
  path: string;
  label: string;
  icon: string;
  accent?: 'default' | 'orange';
  showActiveIndicator?: boolean;
  /** Rutas hijas que también marcan este ítem como activo (p. ej. subsecciones de Lectura). */
  activePaths?: string[];
};

export const FOCUS_RING =
  'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none ' +
  'focus-visible:ring-offset-2 focus-visible:ring-offset-surface-via';

/** Hover visible en sidebar (claro y oscuro): borde + tinte accent + sombra suave. */
export const SIDEBAR_NAV_HOVER =
  'border border-transparent text-on-surface-muted hover:border-app-ring/35 hover:bg-app-ring/12 ' +
  'hover:text-app-accent hover:shadow-md hover:shadow-app-ring/15 dark:hover:border-app-ring/40 ' +
  'dark:hover:bg-app-ring/18';

/** Hover en barra inferior móvil. */
export const MOBILE_TAB_HOVER =
  'hover:bg-app-ring/12 hover:text-app-accent active:bg-app-ring/20 dark:hover:bg-app-ring/18';

/** Hover en ítems del menú desplegable móvil. */
export const MOBILE_MENU_ITEM_HOVER =
  'hover:border-app-ring/25 hover:bg-app-ring/12 hover:text-app-accent active:bg-app-ring/20 dark:hover:bg-app-ring/18';

/** Coincidencia exacta o subruta (p. ej. `/logros` y `/logros/...`). */
export function isNavPathActive(pathname: string, path: string): boolean {
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function isNavOptionActive(pathname: string, option: NavOption): boolean {
  if (isNavPathActive(pathname, option.path)) return true;
  return option.activePaths?.some((path) => isNavPathActive(pathname, path)) ?? false;
}

export const LECTURA_SUB_PATHS = ['/ruta-al-500', '/importancia', '/informacion', '/consejos'] as const;

/** Rutas donde no se muestra la barra de navegación principal en móvil. */
export const HIDE_MOBILE_MAIN_NAV_PATHS = [] as const;

export function shouldHideMobileMainNav(pathname: string): boolean {
  return HIDE_MOBILE_MAIN_NAV_PATHS.some((path) => isNavPathActive(pathname, path));
}

export const mainNavOptions: NavOption[] = [
  { path: '/ruta-aprendizaje', label: 'Aprendizaje', icon: 'graduation-cap', activePaths: ['/fases'] },
  { path: '/logros', label: 'Logros', icon: 'medal' },
  { path: '/clasificatoria', label: 'Clasificatoria', icon: 'trophy' },
  { path: '/tienda', label: 'Tienda', icon: 'shopping-bag' },
];

export const secondaryNavOptions: NavOption[] = [
  {
    path: '/lectura',
    label: 'Lectura',
    icon: 'book-open',
    showActiveIndicator: false,
    activePaths: [...LECTURA_SUB_PATHS],
  },
];

export const mobileMenuOptions: NavOption[] = [
  { path: '/perfil', label: 'Perfil', icon: 'circle-user' },
  {
    path: '/lectura',
    label: 'Lectura',
    icon: 'book-open',
    activePaths: [...LECTURA_SUB_PATHS],
  },
  { path: '/configuracion', label: 'Configuración', icon: 'cog' },
];
