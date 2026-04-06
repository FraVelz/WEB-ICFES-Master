import { LessonFlowClient } from '@/features/learning/components/LessonFlow/LessonFlowClient';
import { getLessonWithSteps } from '@/features/learning/server/getLessonWithSteps';

import { LessonPageClient } from './LessonPageClient';

/** Los pasos vienen de Supabase; evitar HTML estático desactualizado. */
export const dynamic = 'force-dynamic';

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

export default async function LessonPage({ params }: { params: Promise<{ area: string; topic: string }> }) {
  const { area, topic } = await params;
  const flow = await getLessonWithSteps(area, topic);

  if (flow && flow.steps.length > 0) {
    return <LessonFlowClient lessonId={flow.lesson.id} lessonTitle={flow.lesson.title} steps={flow.steps} />;
  }

  return <LessonPageClient />;
}
