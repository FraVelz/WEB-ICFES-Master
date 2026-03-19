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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Nivel Básico */}
      <div className="bg-slate-800/50 border border-green-600/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <Icon name="book" size="2xl" className="text-2xl text-green-400" />
          <p className="text-sm font-semibold text-slate-300 uppercase">Nivel Básico</p>
        </div>
        <p className="text-3xl font-bold text-white mb-2">5 Materias</p>
        <p className="text-sm text-slate-400">
          <strong>Objetivo:</strong> Domina conceptos fundamentales de Matemáticas, Lenguaje, Ciencias Naturales, Ciencias Sociales e Inglés, para el ICFES.
        </p>
        <p className="text-xs text-green-400 mt-3">50+ lecciones teóricas</p>
      </div>

      {/* Nivel Intermedio */}
      <div className="bg-slate-800/50 border border-yellow-600/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <Icon name="book" size="2xl" className="text-2xl text-yellow-400" />
          <p className="text-sm font-semibold text-slate-300 uppercase">Nivel Intermedio</p>
        </div>
        <p className="text-3xl font-bold text-white mb-2">5 Exámenes</p>
        <p className="text-sm text-slate-400">
          <strong>Objetivo:</strong> Practica exámenes específicos por materia con evaluación inmediata
        </p>
        <p className="text-xs text-yellow-400 mt-3">120+ preguntas prácticas</p>
      </div>

      {/* Nivel Avanzado */}
      <div className="bg-slate-800/50 border border-red-600/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <Icon name="clock" size="2xl" className="text-2xl text-red-400" />
          <p className="text-sm font-semibold text-slate-300 uppercase">Nivel Avanzado</p>
        </div>
        <p className="text-3xl font-bold text-white mb-2">1 Simulacro</p>
        <p className="text-sm text-slate-400">
          <strong>Objetivo:</strong> Resuelve el examen completo bajo condiciones reales
        </p>
        <p className="text-xs text-red-400 mt-3">120 preguntas en 3 horas</p>
      </div>
    </div>
  );
};
