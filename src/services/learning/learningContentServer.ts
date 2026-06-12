import type { SupabaseClient } from '@supabase/supabase-js';
import type { LearningPathLesson } from '@/features/learning/services/LearningService';
import type { AreaId } from '@/shared/constants';
import { groupRoadmapRowsByArea, LEARNING_ROADMAP_COLUMNS } from '@/services/learning/learningCatalogMap';

export async function fetchPublishedLessonsByArea(
  sb: SupabaseClient
): Promise<Partial<Record<AreaId, LearningPathLesson[]>>> {
  const { data, error } = await sb
    .from('learning_content')
    .select(LEARNING_ROADMAP_COLUMNS)
    .eq('published', true)
    .order('order_index');

  if (error) {
    console.error('fetchPublishedLessonsByArea:', error.message);
    return {};
  }

  return groupRoadmapRowsByArea((data ?? []) as Record<string, unknown>[]);
}
