import type { PathNodeData, PathSection } from '@/features/learning/roadmap/AreaPath';

export function formatStudyTime(minutes: number): string {
  if (minutes <= 0) return '0 min';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest > 0 ? `${hours} h ${rest} min` : `${hours} h`;
}

export function computeSectionProgress(section: PathSection | undefined) {
  if (!section) {
    return { completedLessons: 0, totalLessons: 0, studyTimeMinutes: 0, percent: 0 };
  }
  const totalLessons = section.nodes.length;
  const completedLessons = section.nodes.filter((n: PathNodeData) => n.status === 'completed').length;
  const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  return { completedLessons, totalLessons, studyTimeMinutes: 0, percent };
}
