export type IcfesInfographic = {
  id: string;
  title: string;
  description: string;
  filename: string;
};

export type IcfesInfographicGroup = {
  id: string;
  area: string;
  items: IcfesInfographic[];
};

export const ICFES_INFOGRAPHIC_GROUPS: IcfesInfographicGroup[] = [
  {
    id: 'general',
    area: 'Examen Saber 11°',
    items: [
      {
        id: 'generalidades',
        title: 'Generalidades del examen',
        description: 'Información general sobre el examen Saber 11°.',
        filename: '15-septiembre-infografia-generalidades-examen-saber-11.pdf',
      },
    ],
  },
  {
    id: 'validacion-bachillerato',
    area: 'Validación del Bachillerato',
    items: [
      {
        id: 'validacion-infografia',
        title: 'Infografía – Validación del Bachillerato',
        description: 'Requisitos, áreas evaluadas y funcionamiento del examen de validación del bachillerato académico.',
        filename: '02-Febrero_Infografia-Validacion-del-Bachillerato-2023.pdf',
      },
    ],
  },
  {
    id: 'lectura-critica',
    area: 'Lectura Crítica',
    items: [
      {
        id: 'lectura-infografia',
        title: 'Infografía – Lectura Crítica',
        description: 'Estructura y enfoque de la prueba de Lectura Crítica.',
        filename: '17-septiembre-infografia-prueba-lectura-critica-saber-11.pdf',
      },
      {
        id: 'lectura-niveles',
        title: 'Niveles de desempeño – Lectura Crítica',
        description: 'Qué significa cada nivel de desempeño en esta área.',
        filename: '22-septiembre-nd-prueba-lectura-critica-saber-11.pdf',
      },
    ],
  },
  {
    id: 'matematicas',
    area: 'Matemáticas',
    items: [
      {
        id: 'matematicas-infografia',
        title: 'Infografía – Matemáticas',
        description: 'Estructura y enfoque de la prueba de Matemáticas.',
        filename: '17-septiembre-infografia-prueba-matematicas-saber-11.pdf',
      },
      {
        id: 'matematicas-niveles',
        title: 'Niveles de desempeño – Matemáticas',
        description: 'Qué significa cada nivel de desempeño en esta área.',
        filename: '22-septiembre-nd-prueba-matematicas-saber-11.pdf',
      },
    ],
  },
  {
    id: 'ciencias-naturales',
    area: 'Ciencias Naturales',
    items: [
      {
        id: 'ciencias-infografia',
        title: 'Infografía – Ciencias Naturales',
        description: 'Estructura y enfoque de la prueba de Ciencias Naturales.',
        filename: '17-septiembre-infografia-prueba-ciencias-naturales-saber-11.pdf',
      },
      {
        id: 'ciencias-niveles',
        title: 'Niveles de desempeño – Ciencias Naturales',
        description: 'Qué significa cada nivel de desempeño en esta área.',
        filename: '22-septiembre-nd-prueba-ciencias-naturales-saber-11.pdf',
      },
    ],
  },
  {
    id: 'ingles',
    area: 'Inglés',
    items: [
      {
        id: 'ingles-infografia',
        title: 'Infografía – Inglés',
        description: 'Estructura y enfoque de la prueba de Inglés.',
        filename: '17-septiembre-infografia-prueba-ingles-saber-11.pdf',
      },
      {
        id: 'ingles-niveles',
        title: 'Niveles de desempeño – Inglés',
        description: 'Qué significa cada nivel de desempeño en esta área.',
        filename: '22-septiembre-nd-prueba-ingles-saber-11.pdf',
      },
    ],
  },
  {
    id: 'sociales',
    area: 'Sociales y Ciudadanas',
    items: [
      {
        id: 'sociales-infografia',
        title: 'Infografía – Sociales y Ciudadanas',
        description: 'Estructura y enfoque de la prueba de Sociales y Ciudadanas.',
        filename: '17-septiembre-infografia-prueba-sociales-y-ciudadanas-saber-11.pdf',
      },
      {
        id: 'sociales-niveles',
        title: 'Niveles de desempeño – Sociales y Ciudadanas',
        description: 'Qué significa cada nivel de desempeño en esta área.',
        filename: '22-septiembre-nd-prueba-sociales-y-ciudadanas-saber-11.pdf',
      },
    ],
  },
];

const ICFES_INFOGRAPHIC_BY_ID = new Map<string, IcfesInfographic>(
  ICFES_INFOGRAPHIC_GROUPS.flatMap((group) => group.items.map((item) => [item.id, item] as const))
);

export function findIcfesInfographicById(id: string): IcfesInfographic | undefined {
  return ICFES_INFOGRAPHIC_BY_ID.get(id);
}
