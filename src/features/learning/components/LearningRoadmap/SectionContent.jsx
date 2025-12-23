import { SUBJECTS, BASICO_TOPICS, INTERMEDIO_TOPICS } from '../../data/roadmapData';
import { SubjectCard } from '../BasicoComponents';
import { IntermediaExamCard } from '../IntermediaComponents';
import {
  AvanzadoStats,
  AvanzadoExamComposition,
  AvanzadoNote,
  AvanzadoButton
} from '../LevelComponents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrochip } from '@fortawesome/free-solid-svg-icons';

/**
 * Componente para la sección de contenido Avanzado
 */
export const AdvancedContent = () => {
  return (
    <div className="bg-slate-900/50 rounded-xl p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <FontAwesomeIcon icon={faMicrochip} className="text-2xl text-red-400" />
        <h3 className="text-xl font-bold text-white">Examen Completo ICFES 500</h3>
      </div>
      <p className="text-slate-300 mb-6">
        Simula el examen real completo con todas las materias. Condiciones idénticas al examen oficial.
      </p>

      <AvanzadoStats />
      <AvanzadoExamComposition subjects={SUBJECTS} />
      <AvanzadoNote />
      <AvanzadoButton />
    </div>
  );
};

/**
 * Componente para renderizar el contenido de Básico
 */
export const BasicContent = ({ expandedSubject, onToggleSubject }) => {
  return (
    <>
      {SUBJECTS.map(subject => (
        <SubjectCard
          key={subject.id}
          subject={subject}
          isExpanded={expandedSubject === subject.id}
          topics={BASICO_TOPICS[subject.id]}
          onToggle={() => onToggleSubject('basico', subject.id)}
        />
      ))}
    </>
  );
};

/**
 * Componente para renderizar el contenido de Intermedio
 */
export const IntermediaContent = ({ expandedSubject, onToggleSubject }) => {
  return (
    <>
      {SUBJECTS.map(subject => (
        <IntermediaExamCard
          key={subject.id}
          subject={subject}
          exam={INTERMEDIO_TOPICS[subject.id]}
          isExpanded={expandedSubject === subject.id}
          onToggle={() => onToggleSubject('intermedio', subject.id)}
        />
      ))}
    </>
  );
};
