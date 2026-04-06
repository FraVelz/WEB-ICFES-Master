/**
 * TimelineContent - Componente para mostrar líneas de tiempo
 *
 * Estructura de datos:
 * [
 *   { year: "1492", event: "Descubrimiento de América" },
 *   { year: "1776", event: "Independencia de EE.UU." },
 *   { year: "1810", event: "Independencia de Colombia" }
 * ]
 *
 * Uso:
 * <TimelineContent
 *   events={[
 *     { year: "1492", event: "Descubrimiento" },
 *     { year: "1810", event: "Independencia" }
 *   ]}
 *   title="Historia de América"
 * />
 */
interface TimelineEvent {
  year?: string;
  event?: string;
}

interface TimelineContentProps {
  events?: TimelineEvent[];
  title?: string;
  orientation?: 'vertical' | 'horizontal';
}

export const TimelineContent = ({ events = [], title, orientation = 'vertical' }: TimelineContentProps) => {
  if (orientation === 'vertical') {
    return (
      <div className="my-6 rounded-lg border border-orange-500/20 bg-linear-to-r from-slate-700/20 to-slate-800/20 p-6">
        {title && <h4 className="mb-6 text-center text-sm font-semibold text-orange-300">{title}</h4>}

        <div className="relative space-y-4">
          {/* Línea vertical */}
          <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-linear-to-b from-orange-500/50 to-orange-500/20"></div>

          {events.map((event: TimelineEvent, idx: number) => (
            <div key={idx} className="relative pl-20">
              {/* Punto en la línea */}
              <div className="absolute top-2 left-0 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-orange-500 to-red-500 text-sm font-bold text-white shadow-lg">
                {event.year}
              </div>
              {/* Contenido del evento */}
              <div className="rounded-lg border border-orange-500/20 bg-white/5 p-3">
                <p className="text-sm text-gray-200">{event.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Horizontal timeline
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-orange-500/20 bg-linear-to-r from-slate-700/20 to-slate-800/20 p-6">
      {title && <h4 className="mb-6 text-center text-sm font-semibold text-orange-300">{title}</h4>}

      <div className="flex min-w-max gap-4">
        {events.map((event: TimelineEvent, idx: number) => (
          <div key={idx} className="w-40 shrink-0 text-center">
            <div className="mb-2 flex h-12 items-center justify-center rounded-lg bg-linear-to-br from-orange-500 to-red-500 text-sm font-bold text-white shadow-lg">
              {event.year}
            </div>
            <p className="text-xs text-gray-300">{event.event}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
