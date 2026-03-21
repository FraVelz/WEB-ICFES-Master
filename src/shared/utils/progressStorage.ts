// Utilidades para almacenar y recuperar datos de progreso en localStorage

export interface AreaStatItem {
  name: string;
  correct: number;
  total: number;
  percentage: number;
  icon: string;
  color: string;
}

export interface ProgressData {
  totalAttempts: number;
  totalQuestions: number;
  totalCorrect: number;
  percentage: number;
  streakDays: number;
  lastAttemptDate: string | null;
  bestArea?: AreaStatItem | null;
  weakArea?: AreaStatItem | null;
  areaStats: Record<string, AreaStatItem>;
}

interface AttemptQuestion {
  id: string;
  areaLabel?: string;
  correctAnswer: string;
}

export interface AttemptWithQuestions {
  id?: string | number;
  questions?: AttemptQuestion[];
  answers?: Record<string, string>;
  date?: string;
}

const STORAGE_KEYS = {
  EXAMS: 'icfes_exams',
  PRACTICE: 'icfes_practice',
  PROGRESS: 'icfes_progress',
  COMPLETED_LESSONS: 'icfes_completed_lessons',
};

export const getCompletedLessons = (): string[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.COMPLETED_LESSONS);
  return stored ? JSON.parse(stored) : [];
};

export const markLessonAsCompleted = (_userId: string, lessonId: string): void => {
  const completed = getCompletedLessons();
  if (!completed.includes(lessonId)) completed.push(lessonId);
  localStorage.setItem(
    STORAGE_KEYS.COMPLETED_LESSONS,
    JSON.stringify(completed)
  );
};

/**
 * Obtiene los exámenes almacenados
 */
export const getStoredExams = (): AttemptWithQuestions[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.EXAMS);
  return stored ? JSON.parse(stored) : [];
};

/**
 * Guarda un nuevo examen completo
 */
export const saveFullExam = (examData: Record<string, unknown>): AttemptWithQuestions & { id: number; type: string; date: string } => {
  const exams = getStoredExams();
  const newExam = {
    id: Date.now(),
    type: 'full-exam',
    date: new Date().toISOString(),
    ...examData,
  };
  exams.push(newExam);
  localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
  updateProgress();
  return newExam;
};

/**
 * Obtiene las prácticas almacenadas
 */
export const getStoredPractices = (): AttemptWithQuestions[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PRACTICE);
  return stored ? JSON.parse(stored) : [];
};

/**
 * Guarda una nueva práctica
 */
export const savePractice = (practiceData: Record<string, unknown>): AttemptWithQuestions & { id: number; type: string; date: string } => {
  const practices = getStoredPractices();
  const newPractice = {
    id: Date.now(),
    type: 'practice',
    date: new Date().toISOString(),
    ...practiceData,
  };
  practices.push(newPractice);
  localStorage.setItem(STORAGE_KEYS.PRACTICE, JSON.stringify(practices));
  updateProgress();
  return newPractice;
};

/**
 * Calcula y almacena el progreso total
 */
export const updateProgress = (): ProgressData => {
  const exams = getStoredExams();
  const practices = getStoredPractices();

  const allAttempts: AttemptWithQuestions[] = [...exams, ...practices];

  if (allAttempts.length === 0) {
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    return getDefaultProgress();
  }

  // Calcular estadísticas generales
  let totalQuestions = 0;
  let totalCorrect = 0;
  const areaStats: Record<string, { total: number; correct: number }> = {
    Matemáticas: { total: 0, correct: 0 },
    'Lectura Crítica': { total: 0, correct: 0 },
    'Ciencias Naturales': { total: 0, correct: 0 },
    'Sociales y Ciudadanas': { total: 0, correct: 0 },
  };

  allAttempts.forEach((attempt: AttemptWithQuestions) => {
    const { questions = [], answers = {} } = attempt;

    questions.forEach((question: AttemptQuestion) => {
      const areaLabel = question.areaLabel || 'Desconocido';
      totalQuestions++;

      if (areaStats[areaLabel]) {
        areaStats[areaLabel].total++;
      }

      if (answers[question.id] === question.correctAnswer) {
        totalCorrect++;
        if (areaStats[areaLabel]) {
          areaStats[areaLabel].correct++;
        }
      }
    });
  });

  // Calcular racha de días
  const streakDays = calculateStreak(allAttempts);

  const progress: ProgressData = {
    totalAttempts: allAttempts.length,
    totalQuestions,
    totalCorrect,
    percentage:
      totalQuestions > 0
        ? Math.round((totalCorrect / totalQuestions) * 100)
        : 0,
    streakDays,
    lastAttemptDate:
      allAttempts[allAttempts.length - 1]?.date || new Date().toISOString(),
    areaStats: {
      matematicas: {
        name: 'Matemáticas',
        correct: areaStats['Matemáticas'].correct,
        total: areaStats['Matemáticas'].total,
        percentage:
          areaStats['Matemáticas'].total > 0
            ? Math.round(
                (areaStats['Matemáticas'].correct /
                  areaStats['Matemáticas'].total) *
                  100
              )
            : 0,
        icon: 'faRuler',
        color: 'from-yellow-500 to-yellow-600',
      },
      lenguaje: {
        name: 'Lectura Crítica',
        correct: areaStats['Lectura Crítica'].correct,
        total: areaStats['Lectura Crítica'].total,
        percentage:
          areaStats['Lectura Crítica'].total > 0
            ? Math.round(
                (areaStats['Lectura Crítica'].correct /
                  areaStats['Lectura Crítica'].total) *
                  100
              )
            : 0,
        icon: 'faBook',
        color: 'from-blue-500 to-blue-600',
      },
      ciencias: {
        name: 'Ciencias Naturales',
        correct: areaStats['Ciencias Naturales'].correct,
        total: areaStats['Ciencias Naturales'].total,
        percentage:
          areaStats['Ciencias Naturales'].total > 0
            ? Math.round(
                (areaStats['Ciencias Naturales'].correct /
                  areaStats['Ciencias Naturales'].total) *
                  100
              )
            : 0,
        icon: 'faFlask',
        color: 'from-green-500 to-green-600',
      },
      sociales: {
        name: 'Sociales y Ciudadanas',
        correct: areaStats['Sociales y Ciudadanas'].correct,
        total: areaStats['Sociales y Ciudadanas'].total,
        percentage:
          areaStats['Sociales y Ciudadanas'].total > 0
            ? Math.round(
                (areaStats['Sociales y Ciudadanas'].correct /
                  areaStats['Sociales y Ciudadanas'].total) *
                  100
              )
            : 0,
        icon: 'faGlobe',
        color: 'from-orange-500 to-orange-600',
      },
    },
  };

  // Encontrar mejor y peor área
  const areas = Object.values(progress.areaStats).filter((a: AreaStatItem) => a.total > 0);
  if (areas.length > 0) {
    progress.bestArea = areas.reduce<AreaStatItem>(
      (prev, current) => (prev.percentage > current.percentage ? prev : current),
      areas[0]
    );
    progress.weakArea = areas.reduce<AreaStatItem>(
      (prev, current) => (prev.percentage < current.percentage ? prev : current),
      areas[0]
    );
  }

  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  return progress;
};

/**
 * Obtiene el progreso almacenado
 */
export const getProgress = (): ProgressData => {
  const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  return stored ? JSON.parse(stored) : getDefaultProgress();
};

/**
 * Progreso por defecto
 */
export const getDefaultProgress = (): ProgressData => {
  return {
    totalAttempts: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    percentage: 0,
    streakDays: 0,
    lastAttemptDate: null,
    bestArea: null,
    weakArea: null,
    areaStats: {
      matematicas: {
        name: 'Matemáticas',
        correct: 0,
        total: 0,
        percentage: 0,
        icon: 'faRuler',
        color: 'from-yellow-500 to-yellow-600',
      },
      lenguaje: {
        name: 'Lectura Crítica',
        correct: 0,
        total: 0,
        percentage: 0,
        icon: 'faBook',
        color: 'from-blue-500 to-blue-600',
      },
      ciencias: {
        name: 'Ciencias Naturales',
        correct: 0,
        total: 0,
        percentage: 0,
        icon: 'faFlask',
        color: 'from-green-500 to-green-600',
      },
      sociales: {
        name: 'Sociales y Ciudadanas',
        correct: 0,
        total: 0,
        percentage: 0,
        icon: 'faGlobe',
        color: 'from-orange-500 to-orange-600',
      },
    },
  };
};

/**
 * Calcula la racha de días consecutivos estudiando
 */
const calculateStreak = (attempts: AttemptWithQuestions[]): number => {
  if (attempts.length === 0) return 0;

  // Ordenar por fecha descendente
  const sorted = attempts
    .map((a) => new Date(a.date ?? 0).toDateString())
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const uniqueDates = [...new Set(sorted)];

  if (uniqueDates.length === 0) return 0;

  let streak = 1;
  const today = new Date();
  const firstDate = uniqueDates[0];
  let currentDate = new Date(firstDate ?? today.toDateString());
  const todayString = today.toDateString();

  // Si el último intento no fue hoy, reinicia la racha
  if (currentDate.toDateString() !== todayString) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (currentDate.toDateString() !== yesterday.toDateString()) {
      return 0;
    }
  }

  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i]);
    const expectedDate = new Date(currentDate);
    expectedDate.setDate(expectedDate.getDate() - 1);

    if (prevDate.toDateString() === expectedDate.toDateString()) {
      streak++;
      currentDate = prevDate;
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Limpia todos los datos almacenados
 */
export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.EXAMS);
  localStorage.removeItem(STORAGE_KEYS.PRACTICE);
  localStorage.removeItem(STORAGE_KEYS.PROGRESS);
};

/**
 * Limpia solo los exámenes guardados
 */
export const clearExamsOnly = (): void => {
  localStorage.removeItem(STORAGE_KEYS.EXAMS);
  updateProgress();
};

/**
 * Obtiene recomendaciones basadas en el progreso
 */
export const getRecommendations = (progress: ProgressData): string[] => {
  const recommendations: string[] = [];

  if (progress.weakArea) {
    recommendations.push(
      `Enfócate en fortalecer ${progress.weakArea.name} para mejorar tu promedio`
    );
  }

  if (progress.streakDays > 0 && progress.streakDays < 7) {
    recommendations.push(
      `Mantén tu racha de estudio diario - ¡Solo ${progress.streakDays} ${progress.streakDays === 1 ? 'día' : 'días'}! Puedes alcanzar más`
    );
  } else if (progress.streakDays === 0) {
    recommendations.push(
      '¡Comienza tu racha de estudio hoy! Realiza al menos un examen o práctica'
    );
  }

  recommendations.push(
    'Revisa las explicaciones de preguntas incorrectas para aprender'
  );

  recommendations.push('Realiza simulacros completos para prepararte mejor');

  return recommendations;
};
