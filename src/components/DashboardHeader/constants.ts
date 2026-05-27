import type { NavOption } from './types';

export const FOCUS_RING =
  'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950';

export const mainNavOptions: NavOption[] = [
  { path: '/ruta-aprendizaje', label: 'Aprendizaje', icon: 'graduation-cap' },
  { path: '/logros', label: 'Logros', icon: 'medal' },
  { path: '/clasificatoria', label: 'Clasificatoria', icon: 'trophy' },
];

export const secondaryNavOptions: NavOption[] = [
  { path: '/desafios-diarios', label: 'Desafíos', icon: 'fire', accent: 'orange', showActiveIndicator: false },
];

export const mobileMenuOptions: NavOption[] = [
  { path: '/perfil', label: 'Perfil', icon: 'circle-user' },
  { path: '/desafios-diarios', label: 'Desafíos Diarios', icon: 'fire' },
  { path: '/configuracion', label: 'Configuración', icon: 'cog' },
];
