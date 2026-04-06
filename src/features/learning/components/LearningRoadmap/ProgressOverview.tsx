import { Icon } from '@/shared/components/Icon';

/**
 * Componente para la sección de progreso general del mapa ICFES
 * Muestra información directa sobre:
 * - Temas disponibles por nivel
 * - Objetivo de cada sección
 * - Tiempo estimado de estudio
 */
export const ProgressOverview = () => {
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* Nivel Básico */}
      <div className="rounded-xl border border-green-600/30 bg-slate-800/50 p-6">
        <div className="mb-3 flex items-center gap-3">
          <Icon name="book" size="2xl" className="text-2xl text-green-400" />
          <p className="text-sm font-semibold text-slate-300 uppercase">Nivel Básico</p>
        </div>
        <p className="mb-2 text-3xl font-bold text-white">5 Materias</p>
        <p className="text-sm text-slate-400">
          <strong>Objetivo:</strong> Domina conceptos fundamentales de Matemáticas, Lenguaje, Ciencias Naturales,
          Ciencias Sociales e Inglés, para el ICFES.
        </p>
        <p className="mt-3 text-xs text-green-400">50+ lecciones teóricas</p>
      </div>

      {/* Nivel Intermedio */}
      <div className="rounded-xl border border-yellow-600/30 bg-slate-800/50 p-6">
        <div className="mb-3 flex items-center gap-3">
          <Icon name="book" size="2xl" className="text-2xl text-yellow-400" />
          <p className="text-sm font-semibold text-slate-300 uppercase">Nivel Intermedio</p>
        </div>
        <p className="mb-2 text-3xl font-bold text-white">5 Exámenes</p>
        <p className="text-sm text-slate-400">
          <strong>Objetivo:</strong> Practica exámenes específicos por materia con evaluación inmediata
        </p>
        <p className="mt-3 text-xs text-yellow-400">120+ preguntas prácticas</p>
      </div>

      {/* Nivel Avanzado */}
      <div className="rounded-xl border border-red-600/30 bg-slate-800/50 p-6">
        <div className="mb-3 flex items-center gap-3">
          <Icon name="clock" size="2xl" className="text-2xl text-red-400" />
          <p className="text-sm font-semibold text-slate-300 uppercase">Nivel Avanzado</p>
        </div>
        <p className="mb-2 text-3xl font-bold text-white">1 Simulacro</p>
        <p className="text-sm text-slate-400">
          <strong>Objetivo:</strong> Resuelve el examen completo bajo condiciones reales
        </p>
        <p className="mt-3 text-xs text-red-400">120 preguntas en 3 horas</p>
      </div>
    </div>
  );
};
