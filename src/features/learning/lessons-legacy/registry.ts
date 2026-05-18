import type { ComponentType } from 'react';

import { Algebra } from './mathematics/Algebra';
import { Geometria } from './mathematics/Geometria';
import { Calculo } from './mathematics/Calculo';
import { Trigonometria } from './mathematics/Trigonometria';
import { NumerosComplejos } from './mathematics/NumerosComplejos';

import { Gramatica } from './lenguaje/Gramatica';
import { Comprension } from './lenguaje/Comprension';
import { Literatura } from './lenguaje/Literatura';
import { Ortografia } from './lenguaje/Ortografia';
import { Semantica } from './lenguaje/Semantica';

import { Biologia } from './science/Biologia';
import { Fisica } from './science/Fisica';
import { Quimica } from './science/Quimica';
import { Ecologia } from './science/Ecologia';
import { Termodinamica } from './science/Termodinamica';

import { Historia } from './social/Historia';
import { Geografia } from './social/Geografia';
import { Economia } from './social/Economia';
import { Ciudadania } from './social/Ciudadania';
import { Filosofia } from './social/Filosofia';

import { GramaticaIngles } from './ingles/GramaticaIngles';
import { Vocabulario } from './ingles/Vocabulario';
import { Lectura } from './ingles/Lectura';
import { TiemposVerbales } from './ingles/TiemposVerbales';
import { Conectores } from './ingles/Conectores';

/** Static legacy lesson components keyed by `/lessons/[area]/[topic]` */
export const LEGACY_LESSON_REGISTRY: Record<string, Record<string, ComponentType>> = {
  matematicas: {
    algebra: Algebra,
    geometria: Geometria,
    calculo: Calculo,
    trigonometria: Trigonometria,
    'numeros-complejos': NumerosComplejos,
  },
  lenguaje: {
    gramatica: Gramatica,
    comprension: Comprension,
    literatura: Literatura,
    ortografia: Ortografia,
    semantica: Semantica,
  },
  ciencias: {
    biologia: Biologia,
    fisica: Fisica,
    quimica: Quimica,
    ecologia: Ecologia,
    termodinamica: Termodinamica,
  },
  sociales: {
    historia: Historia,
    geografia: Geografia,
    economia: Economia,
    ciudadania: Ciudadania,
    filosofia: Filosofia,
  },
  ingles: {
    gramatica: GramaticaIngles,
    vocabulario: Vocabulario,
    lectura: Lectura,
    'tiempos-verbales': TiemposVerbales,
    conectores: Conectores,
  },
};

export function getLegacyLessonComponent(area: string, topic: string): ComponentType | undefined {
  return LEGACY_LESSON_REGISTRY[area]?.[topic];
}
