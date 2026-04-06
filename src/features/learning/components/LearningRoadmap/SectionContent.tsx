import { SUBJECTS, BASICO_TOPICS, INTERMEDIO_TOPICS } from '../../data/roadmapData';
import { SubjectCard } from '../BasicoComponents';
import { IntermediaExamCard } from '../IntermediaComponents';
import type { Exam } from '../IntermediaComponents';
import { AvanzadoStats, AvanzadoExamComposition, AvanzadoNote, AvanzadoButton } from '../LevelComponents';
import { Icon } from '@/shared/components/Icon';

/**
 * Componente para la sección de contenido Avanzado
 */
export const AdvancedContent = () => {
  return (
    <div className="mb-6 rounded-xl bg-slate-900/50 p-6">
      <div className="mb-4 flex items-center gap-3">
        <Icon name="microchip" size="lg" className="text-red-400" />
        <h3 className="text-xl font-bold text-white">Examen Completo ICFES 500</h3>
      </div>
      <p className="mb-6 text-slate-300">
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
export interface BasicContentProps {
  expandedSubject: string | null;
  onToggleSubject: (level: string, subjectId: string) => void;
}

export const BasicContent = ({ expandedSubject, onToggleSubject }: BasicContentProps) => {
  return (
    <>
      {SUBJECTS.map((subject) => (
        <SubjectCard
          key={subject.id}
          subject={subject}
          isExpanded={expandedSubject === subject.id}
          topics={
            (BASICO_TOPICS as Record<string, { title: string; duration: string; content: string }[]>)[subject.id] ?? []
          }
          onToggle={() => onToggleSubject('basico', subject.id)}
        />
      ))}
    </>
  );
};

/**
 * Componente para renderizar el contenido de Intermedio
 */
export interface IntermediaContentProps {
  expandedSubject: string | null;
  onToggleSubject: (level: string, subjectId: string) => void;
}

export const IntermediaContent = ({ expandedSubject, onToggleSubject }: IntermediaContentProps) => {
  return (
    <>
      {SUBJECTS.map((subject) => (
        <IntermediaExamCard
          key={subject.id}
          subject={subject}
          exam={
            (INTERMEDIO_TOPICS as Record<string, Exam>)[subject.id] ?? {
              description: '',
              topics: [],
              questions: 0,
              duration: '',
              difficulty: '',
            }
          }
          isExpanded={expandedSubject === subject.id}
          onToggle={() => onToggleSubject('intermedio', subject.id)}
        />
      ))}
    </>
  );
};
