import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';

type ProfileCoursesSectionProps = {
  coursesProgress: Record<string, unknown>;
  emptyMessage: string;
  onStartLearning?: () => void;
};

export function ProfileCoursesSection({ coursesProgress, emptyMessage, onStartLearning }: ProfileCoursesSectionProps) {
  const entries = Object.entries(coursesProgress);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
      <h2 className="mb-6 flex items-center gap-3 text-xl font-bold">
        <Icon name="book-open" className="text-purple-400" />
        {onStartLearning ? 'Mis Cursos' : 'Progreso en Cursos'}
      </h2>

      <div className="space-y-6">
        {entries.length > 0 ? (
          entries.map(([courseId, progress]) => (
            <div key={courseId} className="group">
              <div className="mb-2 flex justify-between">
                <span className="font-medium text-slate-200 capitalize">{courseId.replace('-', ' ')}</span>
                <span className="font-bold text-purple-400">{Number(progress)}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className={cn(
                    'h-full rounded-full bg-purple-500 transition-all duration-500',
                    onStartLearning && 'group-hover:bg-purple-400'
                  )}
                  style={{ width: `${Number(progress)}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-slate-500">
            <p>{emptyMessage}</p>
            {onStartLearning && (
              <button
                type="button"
                onClick={onStartLearning}
                className="mt-4 cursor-pointer rounded-lg bg-purple-500/10 px-4 py-2 text-purple-400 transition-colors hover:bg-purple-500/20"
              >
                Comenzar a aprender
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
