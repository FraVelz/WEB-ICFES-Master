export type LegacyLessonTopic = {
  name: string;
  description: string;
  subtopics: string[];
  examples: string[];
};

export type LegacyLessonContent = {
  title: string;
  duration: string;
  lessons: number;
  difficulty: string;
  topics: LegacyLessonTopic[];
  keyFormulas: string[];
  practiceExercises: string[];
};

export type LegacyLessonTheme = {
  areaLabel: string;
  heroIcon: string;
  heroGradient: string;
  topicHeading: string;
  bulletColor: string;
};

export type LegacyLessonEntry = {
  glowA: string;
  glowB: string;
  keySectionTitle: string;
  practiceSectionTitle: string;
  content: LegacyLessonContent;
};

export const LEGACY_AREA_THEMES: Record<string, LegacyLessonTheme> = {
  matematicas: {
    areaLabel: 'Matemáticas',
    heroIcon: 'ruler',
    heroGradient: 'from-yellow-400 to-orange-400',
    topicHeading: 'text-yellow-400',
    bulletColor: 'text-yellow-400',
  },
  lenguaje: {
    areaLabel: 'Lectura Crítica',
    heroIcon: 'book-open',
    heroGradient: 'from-blue-400 to-app-accent',
    topicHeading: 'text-blue-400',
    bulletColor: 'text-blue-400',
  },
  ciencias: {
    areaLabel: 'Ciencias Naturales',
    heroIcon: 'flask',
    heroGradient: 'from-green-400 to-emerald-400',
    topicHeading: 'text-green-400',
    bulletColor: 'text-green-400',
  },
  sociales: {
    areaLabel: 'Sociales y Ciudadanas',
    heroIcon: 'landmark',
    heroGradient: 'from-orange-400 to-amber-400',
    topicHeading: 'text-orange-400',
    bulletColor: 'text-orange-400',
  },
  ingles: {
    areaLabel: 'Inglés',
    heroIcon: 'language',
    heroGradient: 'from-indigo-400 to-indigo-600',
    topicHeading: 'text-indigo-400',
    bulletColor: 'text-indigo-400',
  },
};
