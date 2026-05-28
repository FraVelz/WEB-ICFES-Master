import ProtectedPage from '@/components/ProtectedPage';
import { LessonFlowClient } from '@/features/learning/lesson-flow/LessonFlowClient';
import { LESSON_ROUTE_PAIRS } from '@/features/learning/constants/lessonRoutes';
import { getLessonWithSteps } from '@/features/learning/server/getLessonWithSteps';

import { LessonPageClient } from './_components/LessonPageClient';

/** Steps load from Supabase — avoid stale static HTML. */
export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return [...LESSON_ROUTE_PAIRS];
}

export default async function LessonPage({ params }: { params: Promise<{ area: string; topic: string }> }) {
  const { area, topic } = await params;
  const flow = await getLessonWithSteps(area, topic);

  const content =
    flow && flow.steps.length > 0 ? (
      <LessonFlowClient lessonId={flow.lesson.id} lessonTitle={flow.lesson.title} steps={flow.steps} />
    ) : (
      <LessonPageClient />
    );

  return <ProtectedPage blockDemoContent={false}>{content}</ProtectedPage>;
}
