import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { LessonStepRow, LessonSummary, StepType } from '@/features/learning/types/lessonFlow';

function getServerSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

/**
 * Resuelve la lección por slug `area/topic` (coincide con la ruta dinámica).
 */
export async function getLessonWithSteps(
  area: string,
  topic: string
): Promise<{ lesson: LessonSummary; steps: LessonStepRow[] } | null> {
  const slug = `${area}/${topic}`;
  const sb = getServerSupabase();
  if (!sb) return null;

  const { data: lesson, error: le } = await sb.from('lessons').select('id, title').eq('slug', slug).maybeSingle();

  if (le || !lesson) return null;

  const { data: steps, error: se } = await sb
    .from('steps')
    .select('id, lesson_id, type, order_index, data')
    .eq('lesson_id', lesson.id)
    .order('order_index', { ascending: true });

  if (se) return null;

  const raw = steps ?? [];
  if (raw.length === 0) return null;

  const rows: LessonStepRow[] = raw.map((row) => ({
    id: row.id as string,
    lesson_id: row.lesson_id as string,
    type: row.type as StepType,
    order_index: row.order_index as number,
    data: row.data as LessonStepRow['data'],
  }));

  return {
    lesson: { id: lesson.id, title: lesson.title },
    steps: rows,
  };
}
