/**
 * Definiciones estáticas de badges y niveles (referencia UI / catálogo legacy).
 * La persistencia real usa `gamificationPersistence` y Supabase.
 */
export const BADGES = {
  first_question: {
    id: 'first_question',
    name: 'Primer Paso',
    description: 'Responder tu primera pregunta',
    icon: '🎯',
    points: 10,
  },
  hundred_questions: {
    id: 'hundred_questions',
    name: 'Centenario',
    description: 'Responder 100 preguntas',
    icon: '💯',
    points: 100,
  },
  thousand_questions: {
    id: 'thousand_questions',
    name: 'Millenial',
    description: 'Responder 1000 preguntas',
    icon: '🏆',
    points: 500,
  },
  perfect_area: {
    id: 'perfect_area',
    name: 'Especialista',
    description: 'Lograr 100% en un área completa',
    icon: '⭐',
    points: 200,
  },
  high_accuracy: {
    id: 'high_accuracy',
    name: 'Precisión',
    description: 'Mantener 90%+ de precisión',
    icon: '🎯',
    points: 150,
  },
  week_streak: {
    id: 'week_streak',
    name: 'Consistencia',
    description: 'Mantener racha de 7 días',
    icon: '🔥',
    points: 100,
  },
  month_streak: {
    id: 'month_streak',
    name: 'Dedicación',
    description: 'Mantener racha de 30 días',
    icon: '💪',
    points: 300,
  },
  early_bird: {
    id: 'early_bird',
    name: 'Madrugador',
    description: 'Estudiar entre 5-7 AM',
    icon: '🌅',
    points: 50,
  },
  night_owl: {
    id: 'night_owl',
    name: 'Búho Nocturno',
    description: 'Estudiar entre 10 PM-12 AM',
    icon: '🌙',
    points: 50,
  },
} as const;

export const LEVELS = [
  { level: 1, xpRequired: 0, title: 'Aprendiz', icon: '📚' },
  { level: 2, xpRequired: 100, title: 'Estudiante', icon: '✏️' },
  { level: 3, xpRequired: 300, title: 'Investigador', icon: '🔍' },
  { level: 4, xpRequired: 600, title: 'Experto', icon: '🧠' },
  { level: 5, xpRequired: 1000, title: 'Maestro', icon: '👑' },
] as const;
