import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faTrophy
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export const LevelHeader = ({ icon, color, title, subtitle, isExpanded, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full p-6 flex items-center justify-between hover:${color}/30 transition-colors`}
  >
    <div className="flex items-center gap-4">
      <div className={`p-4 rounded-xl bg-${color}/30`}>
        <FontAwesomeIcon icon={icon} className={`text-3xl text-${color}`} />
      </div>
      <div className="text-left">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className={`text-${color}`}>{subtitle}</p>
      </div>
    </div>
    <FontAwesomeIcon
      icon={faChevronDown}
      className={`text-${color} text-2xl transition-transform duration-300 ${
        isExpanded ? 'rotate-180' : ''
      }`}
    />
  </button>
);

export const AvanzadoExamComposition = ({ subjects }) => (
  <div className="mb-6">
    <p className="text-white font-semibold mb-3">Composición del Examen:</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {subjects.map(subject => (
        <div key={subject.id} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
          <FontAwesomeIcon icon={subject.icon} className={`text-lg ${subject.color}`} />
          <div className="flex-1">
            <p className="text-white font-medium">{subject.name}</p>
            <p className="text-xs text-slate-400">24 preguntas</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const AvanzadoStats = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <div className="bg-slate-800/50 p-4 rounded-lg">
      <p className="text-slate-400 text-sm">Total de Preguntas</p>
      <p className="text-3xl font-bold text-white">120</p>
    </div>
    <div className="bg-slate-800/50 p-4 rounded-lg">
      <p className="text-slate-400 text-sm">Duración</p>
      <p className="text-3xl font-bold text-white">3h 15m</p>
    </div>
    <div className="bg-slate-800/50 p-4 rounded-lg">
      <p className="text-slate-400 text-sm">Materias</p>
      <p className="text-3xl font-bold text-white">5</p>
    </div>
    <div className="bg-slate-800/50 p-4 rounded-lg">
      <p className="text-slate-400 text-sm">Puntaje Máximo</p>
      <p className="text-3xl font-bold text-white">500</p>
    </div>
  </div>
);

export const AvanzadoNote = () => (
  <div className="bg-linear-to-r from-red-900/30 to-purple-900/30 border border-red-600/50 rounded-lg p-4 mb-6">
    <p className="text-slate-300 text-sm">
      <strong>Nota:</strong> Este simulacro incluye cronómetro, retroalimentación detallada y análisis de desempeño por materia.
    </p>
  </div>
);

export const AvanzadoButton = () => (
  <Link
    href="/examen/simulacro/completo"
    className="block w-full py-4 bg-linear-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all duration-300 text-center text-lg hover:shadow-lg hover:shadow-red-600/50"
  >
    <FontAwesomeIcon icon={faTrophy} className="mr-2" />
    Iniciar Simulacro Completo
  </Link>
);
