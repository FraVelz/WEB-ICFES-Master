import { Icon } from '@/shared/components/Icon';
import Link from 'next/link';

export interface LevelHeaderProps {
  icon: string;
  color: string;
  title: string;
  subtitle: string;
  isExpanded: boolean;
  onClick: () => void;
}

export const LevelHeader = ({
  icon,
  color,
  title,
  subtitle,
  isExpanded,
  onClick,
}: LevelHeaderProps) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center justify-between p-6 hover:${color}/30 transition-colors`}
  >
    <div className="flex items-center gap-4">
      <div className={`rounded-xl p-4 bg-${color}/30`}>
        <Icon name={icon} className={`text-3xl text-${color}`} />
      </div>
      <div className="text-left">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className={`text-${color}`}>{subtitle}</p>
      </div>
    </div>
    <Icon
      name="chevron-down"
      className={`text-${color} text-2xl transition-transform duration-300 ${
        isExpanded ? 'rotate-180' : ''
      }`}
    />
  </button>
);

export interface SubjectItem {
  id: string;
  icon?: string;
  color?: string;
  name?: string;
}

export const AvanzadoExamComposition = ({ subjects }: { subjects: SubjectItem[] }) => (
  <div className="mb-6">
    <p className="mb-3 font-semibold text-white">Composición del Examen:</p>
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {subjects.map((subject) => (
        <div
          key={subject.id}
          className="flex items-center gap-3 rounded-lg bg-slate-800/50 p-3"
        >
          <Icon name={subject.icon ?? 'book'} className={`text-lg ${subject.color ?? ''}`} />
          <div className="flex-1">
            <p className="font-medium text-white">{subject.name}</p>
            <p className="text-xs text-slate-400">24 preguntas</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const AvanzadoStats = () => (
  <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
    <div className="rounded-lg bg-slate-800/50 p-4">
      <p className="text-sm text-slate-400">Total de Preguntas</p>
      <p className="text-3xl font-bold text-white">120</p>
    </div>
    <div className="rounded-lg bg-slate-800/50 p-4">
      <p className="text-sm text-slate-400">Duración</p>
      <p className="text-3xl font-bold text-white">3h 15m</p>
    </div>
    <div className="rounded-lg bg-slate-800/50 p-4">
      <p className="text-sm text-slate-400">Materias</p>
      <p className="text-3xl font-bold text-white">5</p>
    </div>
    <div className="rounded-lg bg-slate-800/50 p-4">
      <p className="text-sm text-slate-400">Puntaje Máximo</p>
      <p className="text-3xl font-bold text-white">500</p>
    </div>
  </div>
);

export const AvanzadoNote = () => (
  <div className="mb-6 rounded-lg border border-red-600/50 bg-linear-to-r from-red-900/30 to-purple-900/30 p-4">
    <p className="text-sm text-slate-300">
      <strong>Nota:</strong> Este simulacro incluye cronómetro,
      retroalimentación detallada y análisis de desempeño por materia.
    </p>
  </div>
);

export const AvanzadoButton = () => (
  <Link
    href="/examen/simulacro/completo"
    className="block w-full rounded-lg bg-linear-to-r from-red-600 to-purple-600 py-4 text-center text-lg font-bold text-white transition-all duration-300 hover:from-red-700 hover:to-purple-700 hover:shadow-lg hover:shadow-red-600/50"
  >
    <Icon name="trophy" className="mr-2" />
    Iniciar Simulacro Completo
  </Link>
);
