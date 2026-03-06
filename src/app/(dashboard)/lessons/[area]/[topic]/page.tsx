import { LessonPageClient } from './LessonPageClient';

const LESSON_PARAMS = [
  { area: 'matematicas', topic: 'algebra' },
  { area: 'matematicas', topic: 'geometria' },
  { area: 'matematicas', topic: 'calculo' },
  { area: 'matematicas', topic: 'trigonometria' },
  { area: 'matematicas', topic: 'numeros-complejos' },
  { area: 'lenguaje', topic: 'gramatica' },
  { area: 'lenguaje', topic: 'comprension' },
  { area: 'lenguaje', topic: 'literatura' },
  { area: 'lenguaje', topic: 'ortografia' },
  { area: 'lenguaje', topic: 'semantica' },
  { area: 'ciencias', topic: 'biologia' },
  { area: 'ciencias', topic: 'fisica' },
  { area: 'ciencias', topic: 'quimica' },
  { area: 'ciencias', topic: 'ecologia' },
  { area: 'ciencias', topic: 'termodinamica' },
  { area: 'sociales', topic: 'historia' },
  { area: 'sociales', topic: 'geografia' },
  { area: 'sociales', topic: 'economia' },
  { area: 'sociales', topic: 'ciudadania' },
  { area: 'sociales', topic: 'filosofia' },
];

export function generateStaticParams() {
  return LESSON_PARAMS;
}

export default function LessonPage() {
  return <LessonPageClient />;
}
