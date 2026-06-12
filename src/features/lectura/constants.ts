export type LecturaSectionId = 'importancia' | 'informacion' | 'consejos' | 'ruta-al-500';

/** El dashboard shell usa `px-0` en móvil; las rutas de lectura aportan su propio margen lateral. */
export const LECTURA_PAGE_SHELL_CLASS = 'relative z-10 mx-auto w-full px-4 sm:px-5 lg:px-0';

/** Consejos: violeta legible en claro y coherente con el ambiente frío de Lectura */
export const LECTURA_CONSEJOS_ACCENT = {
  iconClassName: 'text-xl text-violet-700 dark:text-violet-400',
  iconWrapClassName: 'bg-violet-100 dark:bg-violet-500/10',
  hoverTitleClassName: 'group-hover:text-violet-700 dark:group-hover:text-violet-400',
  hoverChevronClassName: 'group-hover:text-violet-700 dark:group-hover:text-violet-400',
  headerIconClassName: 'text-violet-700 dark:text-violet-400',
} as const;

export type LecturaSectionMeta = {
  id: LecturaSectionId;
  path: string;
  title: string;
  description: string;
  icon: string;
  iconClassName: string;
  iconWrapClassName: string;
  hoverTitleClassName: string;
  hoverChevronClassName: string;
};

export const LECTURA_SECTIONS: LecturaSectionMeta[] = [
  {
    id: 'ruta-al-500',
    path: '/ruta-al-500',
    title: 'Ruta al 500',
    description:
      'Cómo avanzar por competencias ICFES: fases de aprendizaje, simulacros y la diferencia entre puntaje, ND y progreso en la app.',
    icon: 'map',
    iconClassName: 'text-app-accent text-xl',
    iconWrapClassName: 'bg-app-ring/10',
    hoverTitleClassName: 'group-hover:text-app-accent',
    hoverChevronClassName: 'group-hover:text-app-accent',
  },
  {
    id: 'importancia',
    path: '/importancia',
    title: 'Importancia',
    description:
      'Por qué terminar el bachillerato y prepararte para el Saber 11° o la Prueba de Validación abre ' +
      'opciones reales en empleo, ingresos y proyectos de vida.',
    icon: 'info-circle',
    iconClassName: 'text-app-accent text-xl',
    iconWrapClassName: 'bg-app-ring/10',
    hoverTitleClassName: 'group-hover:text-app-accent',
    hoverChevronClassName: 'group-hover:text-app-accent',
  },
  {
    id: 'informacion',
    path: '/informacion',
    title: 'Información',
    description:
      'Infografías oficiales del Saber 11° y enlaces al sitio del ICFES: tarifas, fechas, inscripción y requisitos.',
    icon: 'clipboard-list',
    iconClassName: 'text-app-accent text-xl',
    iconWrapClassName: 'bg-app-ring/10',
    hoverTitleClassName: 'group-hover:text-app-accent',
    hoverChevronClassName: 'group-hover:text-app-accent',
  },
  {
    id: 'consejos',
    path: '/consejos',
    title: 'Consejos',
    description: 'Guías prácticas para gestionar tu tiempo, estudiar con método y llegar al examen con confianza.',
    icon: 'lightbulb',
    ...LECTURA_CONSEJOS_ACCENT,
  },
];
