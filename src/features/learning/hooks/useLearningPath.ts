import { useState, useEffect, useCallback } from 'react';
import { LearningService } from '../services/LearningService';
import { useAuth } from '@/features/auth/context/AuthContext';
import { LEARNING_PROGRESS_UPDATED_EVENT } from '@/services/learning';
import { LESSON_COMPLETED_EVENT } from '@/services/persistence';
import { debounceFn } from '@/utils/debounceFn';
import {
  LEARNING_PHASE_SECTION_IDS,
  phaseToSectionId,
  sectionIdToPhase,
  type LearningPhaseSectionId,
} from '@/features/learning/constants/learningPhases';
import { applyLessonStatusesToNodes } from '@/features/learning/utils/lessonPathStatus';

/**
 * Learning-path state: maps Supabase/local lessons into UI "sections".
 */
import type { PathSection, PathNodeData } from '@/features/learning/roadmap/AreaPath';

export type { PathSection, PathNodeData };

const SECTION_META: Record<LearningPhaseSectionId, { title: string; description: string }> = {
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

  const fetchPath = useCallback(async () => {
    if (!areaId) return;

    setLoading(true);
    try {
      const [lessons, progress] = await Promise.all([
        LearningService.getLearningPath(areaId, phaseFilter),
        user ? LearningService.getUserProgress(user.uid, areaId) : Promise.resolve(null),
      ]);

      const activePhase = sectionIdToPhase(sectionId);
      const sectionIds = loadAllPhases ? LEARNING_PHASE_SECTION_IDS : [phaseToSectionId(activePhase)];

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
        } as PathNodeData);
      });

      const completedSet = new Set(completedIds);
      for (const section of groupedSections) {
        section.nodes = applyLessonStatusesToNodes(section.nodes, completedSet);
      }

      const activeSections = groupedSections.filter((s) => s.nodes.length > 0);
      setSections(loadAllPhases ? groupedSections : activeSections.length > 0 ? activeSections : groupedSections);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error al cargar la ruta de aprendizaje');
    } finally {
      setLoading(false);
    }
  }, [areaId, user, phaseFilter, loadAllPhases, sectionId]);

  useEffect(() => {
    void fetchPath();
  }, [fetchPath]);

  useEffect(() => {
    const refresh = debounceFn(() => void fetchPath(), 400);
    window.addEventListener(LESSON_COMPLETED_EVENT, refresh);
    window.addEventListener(LEARNING_PROGRESS_UPDATED_EVENT, refresh);
    return () => {
      window.removeEventListener(LESSON_COMPLETED_EVENT, refresh);
      window.removeEventListener(LEARNING_PROGRESS_UPDATED_EVENT, refresh);
    };
  }, [fetchPath]);

  return { sections, loading, error };
};
