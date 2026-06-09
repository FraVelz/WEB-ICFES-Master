export type NavOption = {
  path: string;
  label: string;
  icon: string;
  accent?: 'default' | 'orange';
  showActiveIndicator?: boolean;
};

export const FOCUS_RING =
  'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950';

export const mainNavOptions: NavOption[] = [
  { path: '/ruta-aprendizaje', label: 'Aprendizaje', icon: 'graduation-cap' },
  { path: '/logros', label: 'Logros', icon: 'medal' },
  { path: '/clasificatoria', label: 'Clasificatoria', icon: 'trophy' },
];

export const secondaryNavOptions: NavOption[] = [
  { path: '/desafios-diarios', label: 'Desafíos', icon: 'fire', accent: 'orange', showActiveIndicator: false },
  { path: '/importancia', label: 'Importancia', icon: 'info-circle', showActiveIndicator: false },
  { path: '/consejos', label: 'Consejos', icon: 'lightbulb', showActiveIndicator: false },
];

export const mobileMenuOptions: NavOption[] = [
  { path: '/perfil', label: 'Perfil', icon: 'circle-user' },
  { path: '/desafios-diarios', label: 'Desafíos Diarios', icon: 'fire' },
  { path: '/importancia', label: 'Importancia', icon: 'info-circle' },
  { path: '/consejos', label: 'Consejos', icon: 'lightbulb' },
  { path: '/configuracion', label: 'Configuración', icon: 'cog' },
];
