import { useState, useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { LearningService } from '../services/LearningService';
import { useAuth } from '@/features/auth/context/AuthContext';
import { LEARNING_PROGRESS_UPDATED_EVENT } from '@/services/learning';
import { BLOCK_EXAM_UPDATED_EVENT } from '@/services/persistence/blockExamPersistence';
import { LESSON_COMPLETED_EVENT } from '@/services/persistence';
import { debounceFn } from '@/utils/debounceFn';
import { queryKeys } from '@/services/query/queryKeys';
import {
  LEARNING_PHASE_SECTION_IDS,
  phaseToSectionId,
  sectionIdToPhase,
  type LearningPhaseSectionId,
} from '@/features/learning/constants/learningPhases';
import { applyLessonStatusesForArea } from '@/features/learning/utils/lessonPathStatus';
import type { AreaId } from '@/shared/constants';

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

type FetchPathOptions = {
  /** Actualiza en segundo plano sin spinner ni ocultar el roadmap. */
  background?: boolean;
};

export const useLearningPath = (areaId: string | undefined, options: UseLearningPathOptions = {}) => {
  const { sectionId, loadAllPhases = false } = options;
  const [sections, setSections] = useState<PathSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const userId = user?.uid;
  const queryClient = useQueryClient();
  const requestSeq = useRef(0);

  const phaseFilter = loadAllPhases ? undefined : sectionIdToPhase(sectionId);

  const fetchPath = useCallback(
    async ({ background = false }: FetchPathOptions = {}) => {
      if (!areaId) {
        setLoading(false);
        return;
      }

      const seq = ++requestSeq.current;
      if (!background) {
        setLoading(true);
      }

      try {
        const lessons = await LearningService.getLearningPath(areaId, phaseFilter);
        const progress =
          userId && areaId
            ? await queryClient.fetchQuery({
                queryKey: queryKeys.learningProgress(userId, areaId),
                queryFn: () => LearningService.getUserProgress(userId, areaId),
              })
            : null;

        if (seq !== requestSeq.current) return;

        const activePhase = sectionIdToPhase(sectionId);
        const sectionIds = loadAllPhases ? LEARNING_PHASE_SECTION_IDS : [phaseToSectionId(activePhase)];

        const groupedSections: PathSection[] = sectionIds.map((id) => ({
          id,
          ...SECTION_META[id],
          nodes: [],
        }));

        const completedIds = (progress as { completedLessons?: string[] } | null)?.completedLessons ?? [];
        const blockExamPasses =
          (progress as { blockExamPasses?: Array<{ areaId: string; blockId: string }> } | null)?.blockExamPasses ?? [];
        const passedBlockIds = new Set(
          blockExamPasses.filter((record) => record.areaId === areaId).map((record) => record.blockId)
        );

        lessons.forEach((lesson) => {
          const sectionIdForLesson = phaseToSectionId(lesson.phase);
          const section = groupedSections.find((s) => s.id === sectionIdForLesson);
          if (!section) return;

          const xp = lesson.rewards?.xp || lesson.xp || 0;
          const coins = lesson.rewards?.coins || lesson.coins || 0;
          const nodeType =
            lesson.moduleType === 'minimum-requirements'
              ? 'minimum-requirements'
              : lesson.moduleType === 'block-checkpoint' || lesson.type === 'checkpoint'
                ? 'checkpoint'
                : 'lesson';

          section.nodes.push({
            ...lesson,
            id: lesson.id ?? '',
            title: (lesson as { title?: string }).title,
            description: (lesson as { description?: string }).description,
            xp,
            coins,
            type: nodeType,
            moduleType: lesson.moduleType,
            blockId: lesson.blockId,
            lessonIds: lesson.lessonIds,
          } as PathNodeData);
        });

        const completedSet = new Set(completedIds);
        const useBlockGating = phaseFilter === 1 || (!loadAllPhases && sectionIdToPhase(sectionId) === 1);

        for (const section of groupedSections) {
          section.nodes = applyLessonStatusesForArea(
            section.nodes,
            completedSet,
            passedBlockIds,
            areaId as AreaId,
            useBlockGating && section.id === 'facil'
          );
        }

        const activeSections = groupedSections.filter((s) => s.nodes.length > 0);
        setSections(loadAllPhases ? groupedSections : activeSections.length > 0 ? activeSections : groupedSections);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Error al cargar la ruta de aprendizaje');
      } finally {
        if (seq === requestSeq.current) {
          setLoading(false);
        }
      }
    },
    [areaId, userId, phaseFilter, loadAllPhases, sectionId, queryClient]
  );

  useEffect(() => {
    void fetchPath();
  }, [fetchPath]);

  useEffect(() => {
    const refresh = debounceFn(() => {
      if (userId && areaId) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.learningProgress(userId, areaId) });
      }
      void fetchPath({ background: true });
    }, 400);
    window.addEventListener(LESSON_COMPLETED_EVENT, refresh);
    window.addEventListener(LEARNING_PROGRESS_UPDATED_EVENT, refresh);
    window.addEventListener(BLOCK_EXAM_UPDATED_EVENT, refresh);
    return () => {
      window.removeEventListener(LESSON_COMPLETED_EVENT, refresh);
      window.removeEventListener(LEARNING_PROGRESS_UPDATED_EVENT, refresh);
      window.removeEventListener(BLOCK_EXAM_UPDATED_EVENT, refresh);
    };
  }, [fetchPath, userId, areaId, queryClient]);

  return { sections, loading, error };
};
