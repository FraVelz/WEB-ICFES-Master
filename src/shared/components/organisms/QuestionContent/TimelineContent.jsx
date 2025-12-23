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
export const TimelineContent = ({ events, title, orientation = "vertical" }) => {
  if (orientation === "vertical") {
    return (
      <div className="my-6 p-6 bg-linear-to-r from-slate-700/20 to-slate-800/20 rounded-lg border border-orange-500/20">
        {title && (
          <h4 className="text-sm font-semibold text-orange-300 mb-6 text-center">
            {title}
          </h4>
        )}

        <div className="space-y-4 relative">
          {/* Línea vertical */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-linear-to-b from-orange-500/50 to-orange-500/20"></div>

          {events.map((event, idx) => (
            <div key={idx} className="pl-20 relative">
              {/* Punto en la línea */}
              <div className="absolute left-0 top-2 w-14 h-14 bg-linear-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {event.year}
              </div>
              {/* Contenido del evento */}
              <div className="bg-white/5 p-3 rounded-lg border border-orange-500/20">
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
    <div className="my-6 p-6 bg-linear-to-r from-slate-700/20 to-slate-800/20 rounded-lg border border-orange-500/20 overflow-x-auto">
      {title && (
        <h4 className="text-sm font-semibold text-orange-300 mb-6 text-center">
          {title}
        </h4>
      )}

      <div className="flex gap-4 min-w-max">
        {events.map((event, idx) => (
          <div key={idx} className="shrink-0 w-40 text-center">
            <div className="h-12 bg-linear-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-2 shadow-lg">
              {event.year}
            </div>
            <p className="text-xs text-gray-300">{event.event}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
