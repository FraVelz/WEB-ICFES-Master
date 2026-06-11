import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import type { PhaseCardStatus } from '@/features/learning/data/phaseProgressUtils';
import { HOME_AREA_IDS } from '@/shared/constants';
import type {
  ProfileAreaCourseSnapshot,
  ProfileCourseProgressSnapshot,
} from '@/features/user/types/profileCourseProgress';

type ProfileCoursesSectionProps = {
  courseProgress: ProfileCourseProgressSnapshot | null;
  loading?: boolean;
  emptyMessage: string;
  onStartLearning?: () => void;
};

function phaseStatusLabel(status: PhaseCardStatus): string {
  switch (status) {
    case 'completed':
      return 'Completada';
    case 'active':
      return 'En curso';
    case 'locked':
      return 'Bloqueada';
    default:
      return 'Pendiente';
  }
}

function phaseStatusClass(status: PhaseCardStatus): string {
  switch (status) {
    case 'completed':
      return 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400';
    case 'active':
      return 'border-app-accent/40 bg-app-accent/10 text-app-accent-strong dark:text-app-accent';
    case 'locked':
      return 'border-surface-border bg-surface-via/60 text-on-surface-muted opacity-70';
    default:
      return 'border-surface-border bg-surface-via/40 text-on-surface-muted';
  }
}

function PhaseChip({ order, title, status }: { order: number; title: string; status: PhaseCardStatus }) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-1 flex-col gap-1 rounded-xl border px-3 py-2',
        phaseStatusClass(status)
      )}
      title={phaseStatusLabel(status)}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold tracking-wide uppercase">Fase {order}</span>
        {status === 'completed' && <Icon name="check" className="size-3.5 shrink-0" />}
        {status === 'active' && <span className="size-2 shrink-0 rounded-full bg-current" />}
      </div>
      <span className="truncate text-xs font-medium">{title.replace('Fase de ', '')}</span>
      <span className="text-[11px] opacity-80">{phaseStatusLabel(status)}</span>
    </div>
  );
}

function ActiveAreaCard({ area }: { area: ProfileAreaCourseSnapshot }) {
  const currentPhase = area.phases.find((p) => p.id === area.currentPhaseId);

  return (
    <div className="border-surface-border bg-surface-via/40 rounded-xl border p-4">
      <div className="mb-4 flex items-center gap-3">
        <div className="bg-app-accent/15 text-app-accent flex size-10 shrink-0 items-center justify-center rounded-lg">
          <Icon name={area.icon} className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-on-surface-muted text-xs font-semibold tracking-wide uppercase">Curso actual</p>
          <p className="text-on-surface truncate text-lg font-bold">{area.areaName}</p>
          {currentPhase && (
            <p className="text-on-surface-muted text-sm">
              Fase actual: <span className="text-on-surface font-medium">{currentPhase.title}</span>
            </p>
          )}
        </div>
      </div>

      {area.phases.length > 0 && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {area.phases.map((phase) => (
            <PhaseChip key={phase.id} order={phase.order} title={phase.title} status={phase.status} />
          ))}
        </div>
      )}
    </div>
  );
}

function AreaGeneralExamsPanel({
  courseProgress,
  activeAreaId,
}: {
  courseProgress: ProfileCourseProgressSnapshot;
  activeAreaId: string | null;
}) {
  const activeArea = activeAreaId
    ? courseProgress.areas.find((area) => area.areaId === activeAreaId)
    : null;

  const areasWithGeneralExams = HOME_AREA_IDS.map((areaId) =>
    courseProgress.areas.find((area) => area.areaId === areaId)
  ).filter((area): area is ProfileAreaCourseSnapshot => Boolean(area && area.areaGeneralExamCount > 0));

  return (
    <div className="border-surface-border bg-surface-via/30 space-y-4 rounded-xl border px-4 py-3">
      <div>
        <p className="text-on-surface-muted text-xs font-semibold tracking-wide uppercase">
          Exámenes generales por área
        </p>
        <p className="text-on-surface mt-1 text-2xl font-bold tabular-nums">
          {courseProgress.totalAreaGeneralExamCount}
        </p>
        <p className="text-on-surface-muted mt-1 text-xs">
          Simulacros generales de cada materia (suma de todas las áreas)
        </p>
      </div>

      {activeArea && activeArea.areaGeneralExamCount > 0 && (
        <div className="border-app-accent/25 bg-app-accent/5 rounded-lg border px-3 py-2">
          <p className="text-on-surface-muted text-[11px] font-semibold tracking-wide uppercase">
            En {activeArea.areaName}
          </p>
          <p className="text-on-surface text-lg font-bold tabular-nums">{activeArea.areaGeneralExamCount}</p>
        </div>
      )}

      {areasWithGeneralExams.length > 0 ? (
        <ul className="space-y-1.5">
          {areasWithGeneralExams.map((area) => (
            <li
              key={area.areaId}
              className={cn(
                'flex items-center justify-between gap-3 rounded-lg px-2 py-1.5',
                area.areaId === activeAreaId && 'bg-app-accent/10'
              )}
            >
              <div className="flex min-w-0 items-center gap-2">
                <Icon name={area.icon} className="text-on-surface-muted size-4 shrink-0" />
                <span className="text-on-surface truncate text-sm">{area.areaName}</span>
              </div>
              <span className="text-on-surface shrink-0 text-sm font-semibold tabular-nums">
                {area.areaGeneralExamCount}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-on-surface-muted text-xs">Aún no has hecho simulacros generales por área.</p>
      )}

      {courseProgress.totalPhaseSkipExamCount > 0 && (
        <p className="text-on-surface-muted border-surface-border border-t pt-3 text-xs">
          + {courseProgress.totalPhaseSkipExamCount}{' '}
          {courseProgress.totalPhaseSkipExamCount === 1 ? 'examen' : 'exámenes'} para saltar fase
        </p>
      )}
    </div>
  );
}

function GlobalExamCounter({ globalExamCount }: { globalExamCount: number }) {
  return (
    <div className="border-surface-border bg-surface-via/30 rounded-xl border px-4 py-3">
      <p className="text-on-surface-muted text-xs font-semibold tracking-wide uppercase">Exámenes globales</p>
      <p className="text-on-surface mt-1 text-2xl font-bold tabular-nums">{globalExamCount}</p>
      <p className="text-on-surface-muted mt-1 text-xs">Simulacros ICFES completos (todas las materias)</p>
    </div>
  );
}

export function ProfileCoursesSection({
  courseProgress,
  loading = false,
  emptyMessage,
  onStartLearning,
}: ProfileCoursesSectionProps) {
  const activeArea =
    courseProgress?.activeAreaId != null
      ? courseProgress.areas.find((a) => a.areaId === courseProgress.activeAreaId)
      : null;

  const hasContent = courseProgress?.hasAnyActivity ?? false;

  return (
    <div
      className={cn(
        'border-surface-border bg-surface-elevated/80 rounded-2xl border p-6 shadow-sm',
        'dark:border-surface-border dark:bg-surface-elevated/50'
      )}
    >
      <h2 className="text-on-surface mb-6 flex items-center gap-3 text-xl font-bold">
        <Icon name="book-open" className="text-purple-600 dark:text-purple-400" />
        {onStartLearning ? 'Mis Cursos' : 'Progreso en Cursos'}
      </h2>

      <div className="space-y-6">
        {loading ? (
          <div className="text-on-surface-muted py-8 text-center text-sm">Cargando progreso...</div>
        ) : hasContent && courseProgress ? (
          <>
            {activeArea && courseProgress.phasesAvailable ? (
              <ActiveAreaCard area={activeArea} />
            ) : activeArea ? (
              <div className="border-surface-border bg-surface-via/40 rounded-xl border p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-app-accent/15 text-app-accent flex size-10 shrink-0 items-center justify-center rounded-lg">
                    <Icon name={activeArea.icon} className="size-5" />
                  </div>
                  <div>
                    <p className="text-on-surface-muted text-xs font-semibold tracking-wide uppercase">
                      Área más practicada
                    </p>
                    <p className="text-on-surface text-lg font-bold">{activeArea.areaName}</p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <AreaGeneralExamsPanel
                courseProgress={courseProgress}
                activeAreaId={courseProgress.activeAreaId}
              />
              <GlobalExamCounter globalExamCount={courseProgress.globalExamCount} />
            </div>

            {!courseProgress.phasesAvailable && (
              <p className="text-on-surface-muted text-xs">
                El detalle de fases por lecciones solo está disponible en el perfil privado del estudiante.
              </p>
            )}
          </>
        ) : (
          <div className="text-on-surface-muted py-8 text-center">
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
