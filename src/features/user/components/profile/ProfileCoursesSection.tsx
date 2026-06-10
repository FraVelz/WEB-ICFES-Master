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
    <div
      className={cn(
        'rounded-2xl border border-surface-border bg-surface-elevated/80 p-6 shadow-sm',
        'dark:border-slate-800 dark:bg-slate-900/50'
      )}
    >
      <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-on-surface">
        <Icon name="book-open" className="text-purple-600 dark:text-purple-400" />
        {onStartLearning ? 'Mis Cursos' : 'Progreso en Cursos'}
      </h2>

      <div className="space-y-6">
        {entries.length > 0 ? (
          entries.map(([courseId, progress]) => (
            <div key={courseId} className="group">
              <div className="mb-2 flex justify-between">
                <span className="font-medium text-on-surface capitalize">{courseId.replace('-', ' ')}</span>
                <span className="font-bold text-purple-700 dark:text-purple-400">{Number(progress)}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-surface-via dark:bg-slate-800">
                <div
                  className={cn(
                    'h-full rounded-full bg-purple-600 transition-all duration-500 dark:bg-purple-500',
                    onStartLearning && 'group-hover:bg-purple-500'
                  )}
                  style={{ width: `${Number(progress)}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-on-surface-muted">
            <p>{emptyMessage}</p>
            {onStartLearning && (
              <button
                type="button"
                onClick={onStartLearning}
                className={cn(
                  'mt-4 cursor-pointer rounded-lg border border-purple-500/25 bg-purple-50 px-4 py-2',
                  'font-medium text-purple-800 transition-colors hover:bg-purple-100',
                  'dark:border-transparent dark:bg-purple-500/10 dark:text-purple-400 dark:hover:bg-purple-500/20'
                )}
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
