/** Páginas públicas indexables (sitemap, footer, JSON-LD, llms.txt). */
export const PUBLIC_CONTENT_PAGES = [
  {
    href: '/lectura/',
    label: 'Lectura ICFES',
    description: 'Guías y recursos de lectura sobre el ICFES y la preparación académica.',
  },
  {
    href: '/consejos/',
    label: 'Consejos ICFES',
    description: 'Consejos de estudio, gestión del tiempo y estrategias para el día del examen.',
  },
  {
    href: '/importancia/',
    label: 'Importancia del ICFES',
    description: 'Por qué el bachillerato y el ICFES abren opciones en empleo y proyectos de vida.',
  },
  {
    href: '/informacion/',
    label: 'Información oficial',
    description: 'Enlaces e infografías oficiales del Saber 11°: tarifas, fechas e inscripción.',
  },
] as const;

export const PUBLIC_LEGAL_PAGES = [
  { href: '/privacidad/', label: 'Política de Privacidad' },
  { href: '/terminos/', label: 'Términos y Condiciones' },
] as const;
