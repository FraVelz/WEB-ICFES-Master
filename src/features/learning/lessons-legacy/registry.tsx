import type { ComponentType } from 'react';

import { LegacyLessonLayout } from './LegacyLessonLayout';
import { LEGACY_LESSON_CONTENT } from './lessonContents';
import { LEGACY_AREA_THEMES } from './types';

function createLegacyLesson(area: string, topic: string): ComponentType {
  const entry = LEGACY_LESSON_CONTENT[area]?.[topic];
  const theme = LEGACY_AREA_THEMES[area];

  if (!entry || !theme) {
    return function MissingLegacyLesson() {
      return null;
    };
  }

  return function LegacyLesson() {
    return <LegacyLessonLayout entry={entry} theme={theme} />;
  };
}

/** Static legacy lesson components keyed by `/lessons/[area]/[topic]` */
export const LEGACY_LESSON_REGISTRY: Record<string, Record<string, ComponentType>> = {
  matematicas: {
    algebra: createLegacyLesson('matematicas', 'algebra'),
    geometria: createLegacyLesson('matematicas', 'geometria'),
    calculo: createLegacyLesson('matematicas', 'calculo'),
    trigonometria: createLegacyLesson('matematicas', 'trigonometria'),
    'numeros-complejos': createLegacyLesson('matematicas', 'numeros-complejos'),
  },
  lenguaje: {
    gramatica: createLegacyLesson('lenguaje', 'gramatica'),
    comprension: createLegacyLesson('lenguaje', 'comprension'),
    literatura: createLegacyLesson('lenguaje', 'literatura'),
    ortografia: createLegacyLesson('lenguaje', 'ortografia'),
    semantica: createLegacyLesson('lenguaje', 'semantica'),
  },
  ciencias: {
    biologia: createLegacyLesson('ciencias', 'biologia'),
    fisica: createLegacyLesson('ciencias', 'fisica'),
    quimica: createLegacyLesson('ciencias', 'quimica'),
    ecologia: createLegacyLesson('ciencias', 'ecologia'),
    termodinamica: createLegacyLesson('ciencias', 'termodinamica'),
  },
  sociales: {
    historia: createLegacyLesson('sociales', 'historia'),
    geografia: createLegacyLesson('sociales', 'geografia'),
    economia: createLegacyLesson('sociales', 'economia'),
    ciudadania: createLegacyLesson('sociales', 'ciudadania'),
    filosofia: createLegacyLesson('sociales', 'filosofia'),
  },
  ingles: {
    gramatica: createLegacyLesson('ingles', 'gramatica'),
    vocabulario: createLegacyLesson('ingles', 'vocabulario'),
    lectura: createLegacyLesson('ingles', 'lectura'),
    'tiempos-verbales': createLegacyLesson('ingles', 'tiempos-verbales'),
    conectores: createLegacyLesson('ingles', 'conectores'),
  },
};

export function getLegacyLessonComponent(area: string, topic: string): ComponentType | undefined {
  return LEGACY_LESSON_REGISTRY[area]?.[topic];
}
