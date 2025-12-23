import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export const ExamDetailHeader = ({ exam }) => (
  <div>
    <p className="text-white mb-2">{exam.description}</p>
    <div className="flex flex-wrap gap-2 mb-4">
      {exam.topics.map((topic, i) => (
        <span key={i} className="text-xs px-3 py-1 rounded-full bg-slate-700/50 text-slate-300">
          {topic}
        </span>
      ))}
    </div>
  </div>
);

export const ExamStats = ({ exam }) => (
  <div className="grid grid-cols-3 gap-4 py-4 border-y border-slate-700">
    <div>
      <p className="text-slate-400 text-sm">Preguntas</p>
      <p className="text-2xl font-bold text-white">{exam.questions}</p>
    </div>
    <div>
      <p className="text-slate-400 text-sm">Duración</p>
      <p className="text-2xl font-bold text-white">{exam.duration}</p>
    </div>
    <div>
      <p className="text-slate-400 text-sm">Dificultad</p>
      <p className="text-lg font-bold text-yellow-400">{exam.difficulty}</p>
    </div>
  </div>
);

export const ExamButton = ({ subject }) => (
  <Link
    to={`/examen/${subject}/intermedio`}
    className="block w-full py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors text-center"
  >
    Iniciar Examen
  </Link>
);

export const ExamHeader = ({ subject, exam, isExpanded }) => (
  <button className="w-full p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors">
    <div className="flex items-center gap-3 text-left">
      <FontAwesomeIcon icon={subject.icon} className={`text-xl ${subject.color}`} />
      <div>
        <h3 className="text-lg font-semibold text-white">{exam.title}</h3>
        <p className="text-xs text-slate-400">
          {exam.questions} preguntas • {exam.duration}
        </p>
      </div>
    </div>
    <FontAwesomeIcon
      icon={faChevronDown}
      className={`text-slate-400 transition-transform duration-300 ${
        isExpanded ? 'rotate-180' : ''
      }`}
    />
  </button>
);

export const IntermediaExamCard = ({ subject, exam, isExpanded, onToggle }) => (
  <div
    className={`border-2 rounded-xl overflow-hidden transition-all ${
      isExpanded ? `${subject.borderColor} ${subject.bgColor}` : 'border-slate-700'
    }`}
  >
    <button onClick={onToggle} className="w-full">
      <ExamHeader subject={subject} exam={exam} isExpanded={isExpanded} />
    </button>

    {isExpanded && (
      <div className="border-t border-slate-700 bg-slate-900/50 p-6 space-y-4">
        <ExamDetailHeader exam={exam} subject={subject} />
        <ExamStats exam={exam} />
        <ExamButton subject={subject.id} />
      </div>
    )}
  </div>
);
