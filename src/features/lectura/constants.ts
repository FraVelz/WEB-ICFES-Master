export type LecturaSectionId = 'importancia' | 'informacion' | 'consejos';

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
    id: 'importancia',
    path: '/importancia',
    title: 'Importancia',
    description:
      'Por qué terminar el bachillerato y prepararte para el Saber 11° o la Prueba de Validación abre opciones reales en empleo, ingresos y proyectos de vida.',
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
    iconClassName: 'text-xl text-amber-400',
    iconWrapClassName: 'bg-amber-500/10',
    hoverTitleClassName: 'group-hover:text-amber-400',
    hoverChevronClassName: 'group-hover:text-amber-400',
  },
];
