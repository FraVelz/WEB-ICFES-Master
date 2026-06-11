import { useState, useEffect } from 'react';
import { LearningService } from '../services/LearningService';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  LEARNING_PHASE_SECTION_IDS,
  phaseToSectionId,
  sectionIdToPhase,
  type LearningPhaseSectionId,
} from '@/features/learning/constants/learningPhases';

/**
 * Learning-path state: maps Supabase/local lessons into UI "sections".
 */
import type { PathSection, PathNodeData } from '@/features/learning/roadmap/AreaPath';

export type { PathSection, PathNodeData };

const SECTION_META: Record<
  LearningPhaseSectionId,
  { title: string; description: string }
> = {
  facil: {
    title: 'Nivel Básico – Fundamentos',
    description: 'Domina los conceptos esenciales',
  },
  intermedio: {
    title: 'Nivel Intermedio – Práctica',
    description: 'Aplica lo aprendido en preguntas tipo ICFES',
  },
  dificil: {
    title: 'Nivel Avanzado – Maestría',
    description: 'Retos complejos para expertos',
  },
};

export type UseLearningPathOptions = {
  /** Etapa activa en la ruta (`facil`, `intermedio`, `dificil`). Solo pide esa fase en Supabase. */
  sectionId?: string;
  /** Si true, carga las 3 fases (p. ej. pantalla /fases). */
  loadAllPhases?: boolean;
};

export const useLearningPath = (areaId: string | undefined, options: UseLearningPathOptions = {}) => {
  const { sectionId, loadAllPhases = false } = options;
  const [sections, setSections] = useState<PathSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const phaseFilter = loadAllPhases ? undefined : sectionIdToPhase(sectionId);

  useEffect(() => {
    const fetchPath = async () => {
      if (!areaId) return;

      setLoading(true);
      try {
        const [lessons, progress] = await Promise.all([
          LearningService.getLearningPath(areaId, phaseFilter),
          user ? LearningService.getUserProgress(user.uid, areaId) : Promise.resolve(null),
        ]);

        const activePhase = sectionIdToPhase(sectionId);
        const sectionIds = loadAllPhases
          ? LEARNING_PHASE_SECTION_IDS
          : [phaseToSectionId(activePhase)];

        const groupedSections: PathSection[] = sectionIds.map((id) => ({
          id,
          ...SECTION_META[id],
          nodes: [],
        }));

        const completedIds = (progress as { completedLessons?: string[] } | null)?.completedLessons ?? [];

        lessons.forEach((lesson) => {
          const sectionIdForLesson = phaseToSectionId(lesson.phase);
          const section = groupedSections.find((s) => s.id === sectionIdForLesson);
          if (!section) return;

          const isCompleted = completedIds.includes(lesson.id ?? '');
          const status = isCompleted ? 'completed' : 'available';
          const xp = lesson.rewards?.xp || lesson.xp || 0;
          const coins = lesson.rewards?.coins || lesson.coins || 0;

          section.nodes.push({
            ...lesson,
            id: lesson.id ?? '',
            title: (lesson as { title?: string }).title,
            description: (lesson as { description?: string }).description,
            xp,
            coins,
            type: 'lesson',
            status,
          } as PathNodeData);
        });

        const activeSections = groupedSections.filter((s) => s.nodes.length > 0);
        setSections(loadAllPhases ? groupedSections : activeSections.length > 0 ? activeSections : groupedSections);
      } catch (err) {
        console.error(err);
        setError('Error al cargar la ruta de aprendizaje');
      } finally {
        setLoading(false);
      }
    };

    fetchPath();
  }, [areaId, user, phaseFilter, loadAllPhases]);

  return { sections, loading, error };
};
