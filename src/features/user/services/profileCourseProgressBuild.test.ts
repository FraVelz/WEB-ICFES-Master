import { describe, expect, it } from 'vitest';
import { buildProfileCourseProgress, countExamAttempts } from './profileCourseProgressBuild';
import type { LearningPathLesson } from '@/features/learning/services/LearningService';

const baseLesson = (id: string, phase: 1 | 2 | 3): LearningPathLesson => ({
  id,
  order: 0,
  phase,
  difficulty: phase === 1 ? 'facil' : phase === 2 ? 'intermedio' : 'dificil',
  rewards: { xp: 10, coins: 5 },
});

describe('countExamAttempts', () => {
  it('separa simulacros globales, generales por área y saltos de fase', () => {
    const result = countExamAttempts([
      { type: 'full-exam' },
      { type: 'full-exam' },
      { type: 'practice', practiceArea: 'lectura-critica', examMode: 'area-general' },
      { type: 'practice', practiceArea: 'lectura-critica', examMode: 'area-general' },
      { type: 'practice', practiceArea: 'matematicas', examMode: 'area-general' },
      { type: 'practice', practiceArea: 'lectura-critica', examMode: 'phase-skip' },
    ]);

    expect(result.globalExamCount).toBe(2);
    expect(result.areaGeneralByArea['lectura-critica']).toBe(2);
    expect(result.areaGeneralByArea.matematicas).toBe(1);
    expect(result.phaseSkipByArea['lectura-critica']).toBe(1);
    expect(result.totalAreaGeneralExamCount).toBe(3);
    expect(result.totalPhaseSkipExamCount).toBe(1);
    expect(result.totalAreaExamCount).toBe(4);
  });

  it('trata intentos legados sin examMode como simulacro general del área', () => {
    const result = countExamAttempts([{ type: 'practice', practiceArea: 'ingles' }]);
    expect(result.areaGeneralByArea.ingles).toBe(1);
    expect(result.totalAreaGeneralExamCount).toBe(1);
  });
});

describe('buildProfileCourseProgress', () => {
  it('marca la fase activa y cuenta exámenes', () => {
    const snapshot = buildProfileCourseProgress({
      lessonsByArea: {
        'lectura-critica': [baseLesson('l1', 1), baseLesson('l2', 1)],
      },
      completedLessonIds: ['l1'],
      skippedSectionIdsByArea: {},
      attempts: [
        {
          type: 'practice',
          practiceArea: 'lectura-critica',
          examMode: 'area-general',
          date: '2026-06-01T00:00:00.000Z',
        },
        { type: 'full-exam', date: '2026-06-02T00:00:00.000Z' },
      ],
      phasesAvailable: true,
    });

    expect(snapshot.hasAnyActivity).toBe(true);
    expect(snapshot.activeAreaId).toBe('lectura-critica');
    expect(snapshot.globalExamCount).toBe(1);
    expect(snapshot.totalAreaGeneralExamCount).toBe(1);

    const lc = snapshot.areas.find((a) => a.areaId === 'lectura-critica');
    expect(lc?.currentPhaseId).toBe('cimentacion');
    expect(lc?.phases[0]?.status).toBe('active');
    expect(lc?.areaGeneralExamCount).toBe(1);
  });

  it('sin fases disponibles solo expone conteos de exámenes', () => {
    const snapshot = buildProfileCourseProgress({
      lessonsByArea: {},
      completedLessonIds: [],
      skippedSectionIdsByArea: {},
      attempts: [{ type: 'practice', practiceArea: 'ingles', examMode: 'area-general' }],
      phasesAvailable: false,
    });

    expect(snapshot.phasesAvailable).toBe(false);
    expect(snapshot.areas.find((a) => a.areaId === 'ingles')?.areaGeneralExamCount).toBe(1);
    expect(snapshot.areas.find((a) => a.areaId === 'ingles')?.phases).toEqual([]);
  });
});
