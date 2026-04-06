import { useState, useEffect } from 'react';
import { LearningService } from '../services/LearningService';
import { useAuth } from '@/context/AuthContext';

/**
 * Learning-path state: maps Supabase/local lessons into UI "sections".
 */
import { buildLessonHrefFromNode } from '@/features/learning/constants/lessonDynamicRoutes';
import type { PathSection, PathNodeData } from '@/features/learning/components/LearningRoadmap/AreaPath';

export type { PathSection, PathNodeData };

export const useLearningPath = (areaId: string | undefined) => {
  const [sections, setSections] = useState<PathSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPath = async () => {
      if (!areaId) return;

      setLoading(true);
      try {
        // 1. Lessons + progress in parallel
        const [lessons, progress] = await Promise.all([
          LearningService.getLearningPath(areaId),
          user ? LearningService.getUserProgress(user.uid, areaId) : Promise.resolve(null),
        ]);

        // 2. Bucket by difficulty for the three section columns
        const groupedSections: PathSection[] = [
          {
            id: 'facil',
            title: 'Nivel Básico – Fundamentos',
            description: 'Domina los conceptos esenciales',
            nodes: [],
          },
          {
            id: 'intermedio',
            title: 'Nivel Intermedio – Práctica',
            description: 'Aplica lo aprendido en preguntas tipo ICFES',
            nodes: [],
          },
          {
            id: 'dificil',
            title: 'Nivel Avanzado – Maestría',
            description: 'Retos complejos para expertos',
            nodes: [],
          },
        ];

        // 3. Place lessons into buckets
        const completedIds = (progress as { completedLessons?: string[] } | null)?.completedLessons ?? [];
        lessons.forEach(
          (lesson: {
            id?: string;
            difficulty?: string;
            rewards?: { xp?: number; coins?: number };
            xp?: number;
            coins?: number;
          }) => {
            // Normalize difficulty (lowercase)
            const difficulty = lesson.difficulty?.toLowerCase() || 'facil';
            const sectionIndex = groupedSections.findIndex((s) => s.id === difficulty);

            if (sectionIndex !== -1) {
              // Node status from completion list
              let status = 'locked';
              const isCompleted = completedIds.includes(lesson.id ?? '');

              if (isCompleted) {
                status = 'completed';
              } else {
                // Simple rule: incomplete lessons stay available (not strict prerequisite chain)
                status = 'available';
              }

              // Flatten rewards for the roadmap UI
              const xp = lesson.rewards?.xp || lesson.xp || 0;
              const coins = lesson.rewards?.coins || lesson.coins || 0;

              const nodePayload = lesson as PathNodeData & { topic_slug?: string; topic?: string };
              const lessonHref = buildLessonHrefFromNode(areaId, nodePayload);

              groupedSections[sectionIndex].nodes.push({
                ...lesson,
                id: lesson.id ?? '',
                title: (lesson as { title?: string }).title,
                description: (lesson as { description?: string }).description,
                xp,
                coins,
                type: 'lesson',
                status,
                lessonHref: lessonHref ?? undefined,
              } as PathNodeData);
            }
          }
        );

        // Drop empty difficulty buckets
        const activeSections = groupedSections.filter((s) => s.nodes.length > 0);

        setSections(activeSections);
      } catch (err) {
        console.error(err);
        setError('Error al cargar la ruta de aprendizaje');
      } finally {
        setLoading(false);
      }
    };

    fetchPath();
  }, [areaId, user]);

  return { sections, loading, error };
};
