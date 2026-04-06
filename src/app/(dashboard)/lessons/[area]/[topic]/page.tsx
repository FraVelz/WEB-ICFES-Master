import { LessonFlowClient } from '@/features/learning/components/LessonFlow/LessonFlowClient';
import { LESSON_ROUTE_PAIRS } from '@/features/learning/constants/lessonDynamicRoutes';
import { getLessonWithSteps } from '@/features/learning/server/getLessonWithSteps';

import { LessonPageClient } from './LessonPageClient';

/** Steps load from Supabase — avoid stale static HTML. */
export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return [...LESSON_ROUTE_PAIRS];
}

export default async function LessonPage({ params }: { params: Promise<{ area: string; topic: string }> }) {
  const { area, topic } = await params;
  const flow = await getLessonWithSteps(area, topic);

  if (flow && flow.steps.length > 0) {
    return <LessonFlowClient lessonId={flow.lesson.id} lessonTitle={flow.lesson.title} steps={flow.steps} />;
  }

  return <LessonPageClient />;
}
