'use client';

import { useParams } from 'next/navigation';

import { Algebra } from '@/features/learning/lessons/mathematics/Algebra';
import { Geometria } from '@/features/learning/lessons/mathematics/Geometria';
import { Calculo } from '@/features/learning/lessons/mathematics/Calculo';
import { Trigonometria } from '@/features/learning/lessons/mathematics/Trigonometria';
import { NumerosComplejos } from '@/features/learning/lessons/mathematics/NumerosComplejos';

import { Gramatica } from '@/features/learning/lessons/lenguaje/Gramatica';
import { Comprension } from '@/features/learning/lessons/lenguaje/Comprension';
import { Literatura } from '@/features/learning/lessons/lenguaje/Literatura';
import { Ortografia } from '@/features/learning/lessons/lenguaje/Ortografia';
import { Semantica } from '@/features/learning/lessons/lenguaje/Semantica';

import { Biologia } from '@/features/learning/lessons/science/Biologia';
import { Fisica } from '@/features/learning/lessons/science/Fisica';
import { Quimica } from '@/features/learning/lessons/science/Quimica';
import { Ecologia } from '@/features/learning/lessons/science/Ecologia';
import { Termodinamica } from '@/features/learning/lessons/science/Termodinamica';

import { Historia } from '@/features/learning/lessons/social/Historia';
import { Geografia } from '@/features/learning/lessons/social/Geografia';
import { Economia } from '@/features/learning/lessons/social/Economia';
import { Ciudadania } from '@/features/learning/lessons/social/Ciudadania';
import { Filosofia } from '@/features/learning/lessons/social/Filosofia';

const LESSONS: Record<string, Record<string, React.ComponentType>> = {
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
};

export function LessonPageClient() {
  const params = useParams();
  const area = params.area as string;
  const topic = params.topic as string;

  const Component = LESSONS[area]?.[topic];

  if (!Component) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Lección no encontrada</h2>
          <p className="text-slate-400">No se encontró la lección para {area}/{topic}</p>
          <a href="/ruta-aprendizaje" className="mt-4 inline-block text-cyan-400 hover:underline">
            Volver a la ruta de aprendizaje
          </a>
        </div>
      </div>
    );
  }

  return <Component />;
}
