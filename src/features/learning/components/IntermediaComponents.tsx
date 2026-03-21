import { Icon } from '@/shared/components/Icon';
import Link from 'next/link';

export interface Exam {
  description: string;
  topics: string[];
  questions: number;
  duration: string;
  difficulty: string;
  title?: string;
}

interface Subject {
  id: string;
  name?: string;
  icon: string;
  color: string;
  borderColor?: string;
  bgColor?: string;
}

interface ExamDetailHeaderProps {
  exam: Exam;
}

export const ExamDetailHeader = ({ exam }: ExamDetailHeaderProps) => (
  <div>
    <p className="mb-2 text-white">{exam.description}</p>
    <div className="mb-4 flex flex-wrap gap-2">
      {exam.topics.map((topic: string, i: number) => (
        <span
          key={i}
          className="rounded-full bg-slate-700/50 px-3 py-1 text-xs text-slate-300"
        >
          {topic}
        </span>
      ))}
    </div>
  </div>
);

interface ExamStatsProps {
  exam: Exam;
}

export const ExamStats = ({ exam }: ExamStatsProps) => (
  <div className="grid grid-cols-3 gap-4 border-y border-slate-700 py-4">
    <div>
      <p className="text-sm text-slate-400">Preguntas</p>
      <p className="text-2xl font-bold text-white">{exam.questions}</p>
    </div>
    <div>
      <p className="text-sm text-slate-400">Duración</p>
      <p className="text-2xl font-bold text-white">{exam.duration}</p>
    </div>
    <div>
      <p className="text-sm text-slate-400">Dificultad</p>
      <p className="text-lg font-bold text-yellow-400">{exam.difficulty}</p>
    </div>
  </div>
);

interface ExamButtonProps {
  subject: string;
}

export const ExamButton = ({ subject }: ExamButtonProps) => (
  <Link
    href={`/examen/${subject}/intermedio`}
    className="block w-full rounded-lg bg-yellow-600 py-3 text-center font-semibold text-white transition-colors hover:bg-yellow-700"
  >
    Iniciar Examen
  </Link>
);

interface ExamHeaderProps {
  subject: Subject;
  exam: Exam;
  isExpanded: boolean;
}

export const ExamHeader = ({ subject, exam, isExpanded }: ExamHeaderProps) => (
  <button className="flex w-full items-center justify-between p-4 transition-colors hover:bg-slate-700/50">
    <div className="flex items-center gap-3 text-left">
      <Icon
        name={subject.icon}
        size="xl"
        className={`text-xl ${subject.color}`}
      />
      <div>
        <h3 className="text-lg font-semibold text-white">{exam.title}</h3>
        <p className="text-xs text-slate-400">
          {exam.questions} preguntas • {exam.duration}
        </p>
      </div>
    </div>
    <Icon
      name="chevron-down"
      className={`text-slate-400 transition-transform duration-300 ${
        isExpanded ? 'rotate-180' : ''
      }`}
    />
  </button>
);

interface IntermediaExamCardProps {
  subject: Subject;
  exam: Exam;
  isExpanded: boolean;
  onToggle: () => void;
}

export const IntermediaExamCard = ({ subject, exam, isExpanded, onToggle }: IntermediaExamCardProps) => (
  <div
    className={`overflow-hidden rounded-xl border-2 transition-all ${
      isExpanded
        ? `${subject.borderColor} ${subject.bgColor}`
        : 'border-slate-700'
    }`}
  >
    <button onClick={onToggle} className="w-full">
      <ExamHeader subject={subject} exam={exam} isExpanded={isExpanded} />
    </button>

    {isExpanded && (
      <div className="space-y-4 border-t border-slate-700 bg-slate-900/50 p-6">
        <ExamDetailHeader exam={exam} />
        <ExamStats exam={exam} />
        <ExamButton subject={subject.id} />
      </div>
    )}
  </div>
);
