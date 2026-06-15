/** Contenedor de página del dashboard: respeta tokens de tema claro/oscuro. */
export const PAGE_SHELL_CLASS =
  'min-h-dvh bg-linear-to-b from-surface via-surface-via to-surface pb-24 text-on-surface md:pb-0';

/** Landing y páginas públicas largas — sin min-height ni padding de nav móvil del dashboard. */
export const PUBLIC_PAGE_SHELL_CLASS = 'bg-linear-to-b from-surface via-surface-via to-surface text-on-surface';

/** Pantalla completa sin padding de dashboard (loading, bloqueos demo, auth callback). */
export const FULL_PAGE_SHELL_CLASS = 'min-h-dvh bg-linear-to-b from-surface via-surface-via to-surface text-on-surface';
